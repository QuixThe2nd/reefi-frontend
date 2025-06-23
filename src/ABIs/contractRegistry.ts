export const contractRegistry = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "ContractNotFound",
    type: "error"
  },
  {
    inputs: [],
    name: "ContractPaused",
    type: "error"
  },
  {
    inputs: [],
    name: "LengthMismatch",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "ZeroAddress",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address"
      }
    ],
    name: "ContractRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address"
      }
    ],
    name: "ContractUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "getContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_contract",
        type: "address"
      }
    ],
    name: "getContractExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "getContractKeyExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "getERC20",
    outputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      }
    ],
    name: "removeContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey",
        name: "key",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "contractAddress",
        type: "address"
      }
    ],
    name: "setContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum ContractRegistry.ContractKey[]",
        name: "keys",
        type: "uint8[]"
      },
      {
        internalType: "address[]",
        name: "addresses",
        type: "address[]"
      }
    ],
    name: "setContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_paused",
        type: "bool"
      }
    ],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
