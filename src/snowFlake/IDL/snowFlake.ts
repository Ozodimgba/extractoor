export type SnowFlake = {
    "version": "0.1.0",
    "name": "snowflake",
    "instructions": [
      {
        "name": "createFlow",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "safe",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "requestedBy",
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
            "name": "accountSize",
            "type": "u32"
          },
          {
            "name": "clientFlow",
            "type": {
              "defined": "Flow"
            }
          },
          {
            "name": "isDraft",
            "type": "bool"
          }
        ]
      },
      {
        "name": "deleteFlow",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "requestedBy",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "abortFlow",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safe",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "requestedBy",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "createSafe",
        "accounts": [
          {
            "name": "safe",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "safeSigner",
            "isMut": false,
            "isSigner": false
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
            "name": "clientSafe",
            "type": {
              "defined": "Safe"
            }
          }
        ]
      },
      {
        "name": "addOwner",
        "accounts": [
          {
            "name": "safe",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "removeOwner",
        "accounts": [
          {
            "name": "safe",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "changeThreshold",
        "accounts": [
          {
            "name": "safe",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "threshold",
            "type": "u8"
          }
        ]
      },
      {
        "name": "approveProposal",
        "accounts": [
          {
            "name": "safe",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "caller",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "isApproved",
            "type": "bool"
          }
        ]
      },
      {
        "name": "executeMultisigFlow",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safe",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "caller",
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
        "name": "executeScheduledMultisigFlow",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safe",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "caller",
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
        "name": "markTimedFlowAsError",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "safe",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "safeSigner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "caller",
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
        "name": "addAction",
        "accounts": [
          {
            "name": "flow",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "requestedBy",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "clientAction",
            "type": {
              "defined": "Action"
            }
          },
          {
            "name": "finishDraft",
            "type": "bool"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Flow",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "requestedBy",
              "type": "publicKey"
            },
            {
              "name": "safe",
              "type": "publicKey"
            },
            {
              "name": "lastUpdatedDate",
              "type": "i64"
            },
            {
              "name": "proposalStage",
              "type": "u8"
            },
            {
              "name": "createdDate",
              "type": "i64"
            },
            {
              "name": "triggerType",
              "type": "u8"
            },
            {
              "name": "nextExecutionTime",
              "type": "i64"
            },
            {
              "name": "retryWindow",
              "type": "u32"
            },
            {
              "name": "recurring",
              "type": "bool"
            },
            {
              "name": "remainingRuns",
              "type": "i16"
            },
            {
              "name": "scheduleEndDate",
              "type": "i64"
            },
            {
              "name": "clientAppId",
              "type": "u32"
            },
            {
              "name": "lastRentCharged",
              "type": "i64"
            },
            {
              "name": "lastScheduledExecution",
              "type": "i64"
            },
            {
              "name": "expiryDate",
              "type": "i64"
            },
            {
              "name": "expireOnComplete",
              "type": "bool"
            },
            {
              "name": "appId",
              "type": "publicKey"
            },
            {
              "name": "payFeeFrom",
              "type": "u8"
            },
            {
              "name": "userUtcOffset",
              "type": "i32"
            },
            {
              "name": "customComputeBudget",
              "type": "u32"
            },
            {
              "name": "customFee",
              "type": "u32"
            },
            {
              "name": "customField1",
              "type": "i32"
            },
            {
              "name": "customField2",
              "type": "i32"
            },
            {
              "name": "ownerSetSeqno",
              "type": "u8"
            },
            {
              "name": "externalId",
              "type": "string"
            },
            {
              "name": "cron",
              "type": "string"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "extra",
              "type": "string"
            },
            {
              "name": "actions",
              "type": {
                "vec": {
                  "defined": "Action"
                }
              }
            },
            {
              "name": "approvals",
              "type": {
                "vec": {
                  "defined": "ApprovalRecord"
                }
              }
            }
          ]
        }
      },
      {
        "name": "Safe",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "approvalsRequired",
              "type": "u8"
            },
            {
              "name": "creator",
              "type": "publicKey"
            },
            {
              "name": "createdAt",
              "type": "i64"
            },
            {
              "name": "signerBump",
              "type": "u8"
            },
            {
              "name": "ownerSetSeqno",
              "type": "u8"
            },
            {
              "name": "extra",
              "type": "string"
            },
            {
              "name": "owners",
              "type": {
                "vec": "publicKey"
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "Action",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "actionCode",
              "type": "u32"
            },
            {
              "name": "instruction",
              "type": "bytes"
            },
            {
              "name": "program",
              "type": "publicKey"
            },
            {
              "name": "accounts",
              "type": {
                "vec": {
                  "defined": "TargetAccountSpec"
                }
              }
            },
            {
              "name": "extra",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "ApprovalRecord",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "date",
              "type": "i64"
            },
            {
              "name": "isApproved",
              "type": "bool"
            }
          ]
        }
      },
      {
        "name": "TargetAccountSpec",
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
        "name": "TriggerType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Manual"
            },
            {
              "name": "Time"
            },
            {
              "name": "Program"
            }
          ]
        }
      },
      {
        "name": "ProposalStateType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Draft"
            },
            {
              "name": "Pending"
            },
            {
              "name": "Approved"
            },
            {
              "name": "Rejected"
            },
            {
              "name": "ExecutionInProgress"
            },
            {
              "name": "Complete"
            },
            {
              "name": "Failed"
            },
            {
              "name": "Aborted"
            }
          ]
        }
      },
      {
        "name": "FeeSource",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "FromFeeAccount"
            },
            {
              "name": "FromFlow"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidJobData",
        "msg": "SnowflakeSafe: The job data is invalid."
      },
      {
        "code": 6001,
        "name": "InvalidExecutionType",
        "msg": "SnowflakeSafe: Invalid execution type for the job."
      },
      {
        "code": 6002,
        "name": "JobIsNotDueForExecution",
        "msg": "SnowflakeSafe: The job is not due for execution."
      },
      {
        "code": 6003,
        "name": "JobIsExpired",
        "msg": "SnowflakeSafe: The job is expired."
      },
      {
        "code": 6004,
        "name": "CannotMarkJobAsErrorIfItsWithinSchedule",
        "msg": "SnowflakeSafe: Unable to mark the time triggered job as error because it is still within schedule."
      },
      {
        "code": 6005,
        "name": "UserInstructionMustNotReferenceTheNodeOperator",
        "msg": "SnowflakeSafe: User instruction must not reference the node operator."
      },
      {
        "code": 6006,
        "name": "CreatorIsNotAssignedToOwnerList",
        "msg": "SnowflakeSafe: Creator is not assigned to owner list"
      },
      {
        "code": 6007,
        "name": "InvalidMinApprovalsRequired",
        "msg": "SnowflakeSafe: At least 1 required approvals"
      },
      {
        "code": 6008,
        "name": "InvalidMaxApprovalsRequired",
        "msg": "SnowflakeSafe: Required approvals exceeds the number of owners"
      },
      {
        "code": 6009,
        "name": "InvalidMinOwnerCount",
        "msg": "SnowflakeSafe: At least 1 owner."
      },
      {
        "code": 6010,
        "name": "InvalidMaxOwnerCount",
        "msg": "SnowflakeSafe: Max owner reached."
      },
      {
        "code": 6011,
        "name": "InvalidSafe",
        "msg": "SnowflakeSafe: Invalid Safe."
      },
      {
        "code": 6012,
        "name": "InvalidOwner",
        "msg": "SnowflakeSafe: Not an owner."
      },
      {
        "code": 6013,
        "name": "DuplicateOwnerInSafe",
        "msg": "SnowflakeSafe: Duplicate owner address in safe."
      },
      {
        "code": 6014,
        "name": "OwnerIsNotRemoved",
        "msg": "SnowflakeSafe: Owner is not removed from safe"
      },
      {
        "code": 6015,
        "name": "AddressSignedAlready",
        "msg": "SnowflakeSafe: Address signed already"
      },
      {
        "code": 6016,
        "name": "RequestIsRejected",
        "msg": "SnowflakeSafe: Request is rejected"
      },
      {
        "code": 6017,
        "name": "RequestIsExecutedAlready",
        "msg": "SnowflakeSafe: Request is executed already"
      },
      {
        "code": 6018,
        "name": "RequestIsNotApprovedYet",
        "msg": "SnowflakeSafe: Request is not approved yet"
      },
      {
        "code": 6019,
        "name": "RequestIsNotExecutedYet",
        "msg": "SnowflakeSafe: Request is not executed yet"
      },
      {
        "code": 6020,
        "name": "ExceedLimitProposalSignatures",
        "msg": "SnowflakeSafe: Exceed limit proposal signatures"
      },
      {
        "code": 6021,
        "name": "FlowNotEnoughApprovals",
        "msg": "SnowflakeSafe: Flow not enough approvals"
      },
      {
        "code": 6022,
        "name": "FlowMustHaveZeroApproverBeforeUpdate",
        "msg": "SnowflakeSafe: Flow must have zero approver before update"
      },
      {
        "code": 6023,
        "name": "FlowMustBeInDraftedBeforeUpdate",
        "msg": "SnowflakeSafe: Flow must be in drafted before update"
      },
      {
        "code": 6024,
        "name": "FlowIsNotReadyYet",
        "msg": "SnowflakeSafe: Flow is not ready yet"
      },
      {
        "code": 6025,
        "name": "InvalidUtcOffset",
        "msg": "SnowflakeSafe: Invalid UTC offset"
      },
      {
        "code": 6026,
        "name": "InvalidCronPatternForScheduledFlow",
        "msg": "SnowflakeSafe: Cron pattern cannot be empty for scheduled flow"
      }
    ]
  }