export const odosRouter = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "int256",
        name: "slippage",
        type: "int256"
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "referralCode",
        type: "uint32"
      }
    ],
    name: "Swap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokensIn",
        type: "address[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokensOut",
        type: "address[]"
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "referralCode",
        type: "uint32"
      }
    ],
    name: "SwapMulti",
    type: "event"
  },
  {
    inputs: [],
    name: "FEE_DENOM",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "REFERRAL_WITH_FEE_THRESHOLD",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "addressList",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    name: "referralLookup",
    outputs: [
      { internalType: "uint64", name: "referralFee", type: "uint64" },
      { internalType: "address", name: "beneficiary", type: "address" },
      { internalType: "bool", name: "registered", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint32", name: "_referralCode", type: "uint32" },
      { internalType: "uint64", name: "_referralFee", type: "uint64" },
      { internalType: "address", name: "_beneficiary", type: "address" }
    ],
    name: "registerReferralCode",
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
    inputs: [{ internalType: "uint256", name: "_swapMultiFee", type: "uint256" }],
    name: "setSwapMultiFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "uint256", name: "inputAmount", type: "uint256" },
          { internalType: "address", name: "inputReceiver", type: "address" },
          { internalType: "address", name: "outputToken", type: "address" },
          { internalType: "uint256", name: "outputQuote", type: "uint256" },
          { internalType: "uint256", name: "outputMin", type: "uint256" },
          { internalType: "address", name: "outputReceiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.swapTokenInfo",
        name: "tokenInfo",
        type: "tuple"
      },
      { internalType: "bytes", name: "pathDefinition", type: "bytes" },
      { internalType: "address", name: "executor", type: "address" },
      { internalType: "uint32", name: "referralCode", type: "uint32" }
    ],
    name: "swap",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "swapCompact",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.inputTokenInfo[]",
        name: "inputs",
        type: "tuple[]"
      },
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "relativeValue", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.outputTokenInfo[]",
        name: "outputs",
        type: "tuple[]"
      },
      { internalType: "uint256", name: "valueOutMin", type: "uint256" },
      { internalType: "bytes", name: "pathDefinition", type: "bytes" },
      { internalType: "address", name: "executor", type: "address" },
      { internalType: "uint32", name: "referralCode", type: "uint32" }
    ],
    name: "swapMulti",
    outputs: [{ internalType: "uint256[]", name: "amountsOut", type: "uint256[]" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "swapMultiCompact",
    outputs: [{ internalType: "uint256[]", name: "amountsOut", type: "uint256[]" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "swapMultiFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "contractAddress", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes", name: "signature", type: "bytes" }
        ],
        internalType: "struct OdosRouterV2.permit2Info",
        name: "permit2",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.inputTokenInfo[]",
        name: "inputs",
        type: "tuple[]"
      },
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "relativeValue", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.outputTokenInfo[]",
        name: "outputs",
        type: "tuple[]"
      },
      { internalType: "uint256", name: "valueOutMin", type: "uint256" },
      { internalType: "bytes", name: "pathDefinition", type: "bytes" },
      { internalType: "address", name: "executor", type: "address" },
      { internalType: "uint32", name: "referralCode", type: "uint32" }
    ],
    name: "swapMultiPermit2",
    outputs: [{ internalType: "uint256[]", name: "amountsOut", type: "uint256[]" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "contractAddress", type: "address" },
          { internalType: "uint256", name: "nonce", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes", name: "signature", type: "bytes" }
        ],
        internalType: "struct OdosRouterV2.permit2Info",
        name: "permit2",
        type: "tuple"
      },
      {
        components: [
          { internalType: "address", name: "inputToken", type: "address" },
          { internalType: "uint256", name: "inputAmount", type: "uint256" },
          { internalType: "address", name: "inputReceiver", type: "address" },
          { internalType: "address", name: "outputToken", type: "address" },
          { internalType: "uint256", name: "outputQuote", type: "uint256" },
          { internalType: "uint256", name: "outputMin", type: "uint256" },
          { internalType: "address", name: "outputReceiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.swapTokenInfo",
        name: "tokenInfo",
        type: "tuple"
      },
      { internalType: "bytes", name: "pathDefinition", type: "bytes" },
      { internalType: "address", name: "executor", type: "address" },
      { internalType: "uint32", name: "referralCode", type: "uint32" }
    ],
    name: "swapPermit2",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.inputTokenInfo[]",
        name: "inputs",
        type: "tuple[]"
      },
      {
        components: [
          { internalType: "address", name: "tokenAddress", type: "address" },
          { internalType: "uint256", name: "relativeValue", type: "uint256" },
          { internalType: "address", name: "receiver", type: "address" }
        ],
        internalType: "struct OdosRouterV2.outputTokenInfo[]",
        name: "outputs",
        type: "tuple[]"
      },
      { internalType: "uint256", name: "valueOutMin", type: "uint256" },
      { internalType: "bytes", name: "pathDefinition", type: "bytes" },
      { internalType: "address", name: "executor", type: "address" }
    ],
    name: "swapRouterFunds",
    outputs: [{ internalType: "uint256[]", name: "amountsOut", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "address", name: "dest", type: "address" }
    ],
    name: "transferRouterFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address[]", name: "addresses", type: "address[]" }],
    name: "writeAddressList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
] as const;
