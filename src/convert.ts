import { convertIdl } from './utils';

// Your old IDL
const oldIDL = {
  "version": "0.1.0",
  "name": "multisig",
  "instructions": [
    {
      "name": "createMultisig",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxOwners",
          "type": "u8"
        },
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "threshold",
          "type": "u64"
        },
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "proposer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "appendProposalIx",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "proposalIx",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ix",
          "type": {
            "defined": "ProposalIx"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "batchNum",
          "type": "u32"
        }
      ]
    },
    {
      "name": "approveProposal",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setOwnersAndChangeThreshold",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setOwners",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeThreshold",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelAllProposals",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeProposalIx",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposalIx",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        }
      ]
    },
    {
      "name": "cancelProposal",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "createTransaction",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "programid",
          "type": "publicKey"
        },
        {
          "name": "dataAccounts",
          "type": {
            "vec": {
              "defined": "TransactionAccount"
            }
          }
        },
        {
          "name": "instructionData",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "approve",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "cancelAllTransactions",
      "accounts": [
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeTransaction",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "multisigSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "cancelTransaction",
      "accounts": [
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "threshold",
            "type": "u64"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "ownerSetSeqno",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "Proposal",
      "docs": [
        "* Proposal struct stores\n * all of the state related\n * to the ixs that we\n * are going to create"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "multisig",
            "type": "publicKey"
          },
          {
            "name": "numIxs",
            "type": "u32"
          },
          {
            "name": "numExecutedIxs",
            "type": "u32"
          },
          {
            "name": "ownerSetSeqno",
            "type": "u32"
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "ProposalIx",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposal",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "ProposalIxAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "batchNum",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "Transaction",
      "docs": [
        "* Transaction struct stores\n * all of the state related\n * to the transaction that we\n * are going to create"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "multisig",
            "type": "publicKey"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TransactionAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "ownerSetSeqno",
            "type": "u32"
          },
          {
            "name": "proposer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ProposalIxAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TransactionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidOwner",
      "msg": "The given owner is not part of this multisig."
    },
    {
      "code": 6001,
      "name": "InvalidOwnersLen",
      "msg": "Owners length must be non zero."
    },
    {
      "code": 6002,
      "name": "NotEnoughSigners",
      "msg": "Not enough owners signed this transaction."
    },
    {
      "code": 6003,
      "name": "TransactionAlreadySigned",
      "msg": "Cannot delete a transaction that has been signed by an owner."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow when adding."
    },
    {
      "code": 6005,
      "name": "UnableToDelete",
      "msg": "Cannot delete a transaction the owner did not create."
    },
    {
      "code": 6006,
      "name": "AlreadyExecuted",
      "msg": "The given transaction has already been executed."
    },
    {
      "code": 6007,
      "name": "InvalidThreshold",
      "msg": "Threshold must be less than or equal to the number of owners."
    },
    {
      "code": 6008,
      "name": "UniqueOwners",
      "msg": "Owners must be unique"
    },
    {
      "code": 6009,
      "name": "NonProposerCancelled",
      "msg": "Transactions can only be cancelled by the original proposer of the transaction."
    },
    {
      "code": 6010,
      "name": "InvalidProposalIxIndex",
      "msg": "The index passed in for the Proposal Ix falls outside the range of valid indices."
    },
    {
      "code": 6011,
      "name": "AlreadyExecutedProposalIx",
      "msg": "The given ix in this Proposal has already been executed."
    },
    {
      "code": 6012,
      "name": "InvalidReallocAccountSize",
      "msg": "The new size realloced exceeds MAX_PERMITTED_DATA_INCREASE."
    },
    {
      "code": 6013,
      "name": "InvalidMaxOwnersSize",
      "msg": "The max owners size is less than the amount of owners."
    }
  ]
}

try {
  const newIDL = convertIdl(oldIDL);
  console.log(JSON.stringify(newIDL, null, 2));
} catch (error) {
  console.error('Failed to convert IDL:', error);
}