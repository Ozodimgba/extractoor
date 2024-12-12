import { Buffer } from 'buffer';
import { createHash } from 'crypto';

// Helper function to create a discriminator
function createDiscriminator(namespace: string, name: string): number[] {
  const discriminator = createHash('sha256')
    .update(`${namespace}:${name}`)
    .digest()
    .slice(0, 8);
  
  return Array.from(discriminator);
}

// Helper function to transform defined types
function transformDefinedType(type: string) {
  return {
    defined: {
      name: type
    }
  };
}

// Helper function to transform types
function transformType(type: any): any {
  if (!type) return type;

  if (typeof type === 'string') {
    // Handle simple type conversions
    const typeMap: { [key: string]: string } = {
      'publicKey': 'pubkey',
      'PublicKey': 'pubkey',
    };
    return typeMap[type] || type;
  } else if (typeof type === 'object') {
    if (type.vec) {
      return { 
        vec: transformType(type.vec) 
      };
    }
    if (type.option) {
      return { 
        option: transformType(type.option) 
      };
    }
    if (type.defined) {
      return transformDefinedType(type.defined);
    }
    // Handle nested defined types in vec
    if (type.vec && type.vec.defined) {
      return {
        vec: transformDefinedType(type.vec.defined)
      };
    }
    // Handle struct types
    if (type.kind === 'struct' && type.fields) {
      return {
        kind: 'struct',
        fields: type.fields.map((field: any) => ({
          ...field,
          type: transformType(field.type)
        }))
      };
    }
    // Handle other complex types
    return Object.fromEntries(
      Object.entries(type).map(([k, v]) => [k, transformType(v)])
    );
  }
  return type;
}

// Helper function to transform instruction arguments
function transformArgs(args: any[]): any[] {
  return args.map(arg => ({
    ...arg,
    type: transformType(arg.type)
  }));
}

// Helper function to transform accounts
function transformAccounts(accounts: any[]): any[] {
  return accounts.map(account => ({
    ...account,
    type: account.type ? transformType(account.type) : undefined
  }));
}

export function convertIdl(oldIdl: any): any {
  try {
    // Convert instructions
    const newInstructions = oldIdl.instructions.map((instruction: any) => ({
      ...instruction,
      discriminator: createDiscriminator('global', instruction.name),
      args: transformArgs(instruction.args),
      accounts: transformAccounts(instruction.accounts)
    }));

    // Convert accounts
    const newAccounts = oldIdl.accounts.map((account: any) => {
      const discriminator = createDiscriminator('account', account.name);
      
      // Handle different account structures
      const accountType = account.type ? transformType(account.type) : {
        kind: "struct",
        fields: []
      };

      return {
        name: account.name,
        discriminator,
        type: accountType
      };
    });

    // Transform types
    const transformedTypes = (oldIdl.types || []).map((type: any) => {
      if (!type.type) return type;

      return {
        ...type,
        type: transformType(type.type)
      };
    });

    // Create new IDL format
    return {
      address: "", // This needs to be filled with the actual program address
      metadata: {
        name: oldIdl.name,
        version: oldIdl.version,
        spec: "0.1.0"
      },
      instructions: newInstructions,
      accounts: newAccounts,
      types: transformedTypes,
      errors: oldIdl.errors
    };
  } catch (error) {
    console.error('Failed to convert IDL:', error);
    throw error;
  }
}