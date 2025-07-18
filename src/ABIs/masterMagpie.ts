export const masterMagpie = [
  { inputs: [], name: "IndexOutOfBound", type: "error" },
  { inputs: [], name: "InvalidStakingToken", type: "error" },
  { inputs: [], name: "LengthMismatch", type: "error" },
  { inputs: [], name: "MGPsetAlready", type: "error" },
  { inputs: [], name: "MustBeContract", type: "error" },
  { inputs: [], name: "MustBeContractOrZero", type: "error" },
  { inputs: [], name: "MustNotBeZero", type: "error" },
  { inputs: [], name: "OnlyActivePool", type: "error" },
  { inputs: [], name: "OnlyCompounder", type: "error" },
  { inputs: [], name: "OnlyLocker", type: "error" },
  { inputs: [], name: "OnlyPoolHelper", type: "error" },
  { inputs: [], name: "OnlyPoolManager", type: "error" },
  { inputs: [], name: "OnlyWhiteListedAllocUpdator", type: "error" },
  { inputs: [], name: "PoolExsisted", type: "error" },
  { inputs: [], name: "UnlockAmountExceedsLocked", type: "error" },
  { inputs: [], name: "WithdrawAmountExceedsStaked", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_oldARBRewarder",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_newARBRewarder",
        type: "address"
      }
    ],
    name: "ARBRewarderSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "rewarder",
        type: "address"
      }
    ],
    name: "ARBRewarderSetAsQueuer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: true,
        internalType: "contract IBaseRewardPool",
        name: "_rewarder",
        type: "address"
      }
    ],
    name: "Add",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_newCompounder",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_oldCompounder",
        type: "address"
      }
    ],
    name: "CompounderUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Deposit",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "DepositNotAvailable",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "EmergencyWithdraw",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      },
      { indexed: false, internalType: "bool", name: "isLock", type: "bool" }
    ],
    name: "HarvestMGP",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "_legacyRewarder",
        type: "address[]"
      }
    ],
    name: "LegacyRewardersSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isRewardMGP",
        type: "bool"
      }
    ],
    name: "LockFreePoolUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_mgp",
        type: "address"
      }
    ],
    name: "MGPSet",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_mWomSV",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_oldMWomSV",
        type: "address"
      }
    ],
    name: "MWomSVpdated",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_account",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "_status", type: "bool" }
    ],
    name: "PoolManagerStatus",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "contract IBaseRewardPool",
        name: "_rewarder",
        type: "address"
      }
    ],
    name: "Set",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_oldMgpPerSec",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newMgpPerSec",
        type: "uint256"
      }
    ],
    name: "UpdateEmissionRate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_lastRewardTimestamp",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_lpSupply",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_accMGPPerShare",
        type: "uint256"
      }
    ],
    name: "UpdatePool",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_oldAllocPoint",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newAllocPoint",
        type: "uint256"
      }
    ],
    name: "UpdatePoolAlloc",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_newVlmgp",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_oldVlmgp",
        type: "address"
      }
    ],
    name: "VLMGPUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_stakingToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Withdraw",
    type: "event"
  },
  {
    inputs: [],
    name: "ARBRewarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "AllocationManagers",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "MPGRewardPool",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "PoolManagers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_mgp", type: "address" },
      { internalType: "uint256", name: "_mgpPerSec", type: "uint256" },
      { internalType: "uint256", name: "_startTimestamp", type: "uint256" }
    ],
    name: "__MasterMagpie_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_rewarder", type: "address" },
      { internalType: "address", name: "_helper", type: "address" },
      { internalType: "bool", name: "_helperNeedsHarvest", type: "bool" }
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newAllocationManager",
        type: "address"
      }
    ],
    name: "addWhitelistedAllocManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_user", type: "address" }
    ],
    name: "allPendingLegacyTokens",
    outputs: [
      {
        internalType: "address[][]",
        name: "bonusTokenAddresses",
        type: "address[][]"
      },
      {
        internalType: "string[][]",
        name: "bonusTokenSymbols",
        type: "string[][]"
      },
      {
        internalType: "uint256[][]",
        name: "pendingBonusRewards",
        type: "uint256[][]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_user", type: "address" }
    ],
    name: "allPendingTokens",
    outputs: [
      { internalType: "uint256", name: "pendingMGP", type: "uint256" },
      {
        internalType: "address[]",
        name: "bonusTokenAddresses",
        type: "address[]"
      },
      { internalType: "string[]", name: "bonusTokenSymbols", type: "string[]" },
      {
        internalType: "uint256[]",
        name: "pendingBonusRewards",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "compounder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "mainRewardToken", type: "address" }
    ],
    name: "createRewarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "depositFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "depositMWomSVFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "depositVlMGPFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_stakingToken", type: "address" }],
    name: "getPoolInfo",
    outputs: [
      { internalType: "uint256", name: "emission", type: "uint256" },
      { internalType: "uint256", name: "allocpoint", type: "uint256" },
      { internalType: "uint256", name: "sizeOfPool", type: "uint256" },
      { internalType: "uint256", name: "totalPoint", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "stakingToken", type: "address" }],
    name: "getRewarder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "legacyRewarder_deprecated",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "legacyRewarders",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mWomSV",
    outputs: [{ internalType: "contract ILocker", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "mgp",
    outputs: [{ internalType: "contract MGP", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mgpPerSec",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address[]", name: "_stakingTokens", type: "address[]" }],
    name: "multiclaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_stakingTokens", type: "address[]" },
      {
        internalType: "address[][]",
        name: "_rewardTokens",
        type: "address[][]"
      },
      { internalType: "address", name: "_account", type: "address" }
    ],
    name: "multiclaimFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_stakingTokens", type: "address[]" },
      {
        internalType: "address[][]",
        name: "_rewardTokens",
        type: "address[][]"
      },
      { internalType: "address", name: "_account", type: "address" }
    ],
    name: "multiclaimOnBehalf",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_stakingTokens", type: "address[]" },
      {
        internalType: "address[][]",
        name: "_rewardTokens",
        type: "address[][]"
      }
    ],
    name: "multiclaimSpec",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "address", name: "_rewardToken", type: "address" }
    ],
    name: "pendingTokens",
    outputs: [
      { internalType: "uint256", name: "pendingMGP", type: "uint256" },
      { internalType: "address", name: "bonusTokenAddress", type: "address" },
      { internalType: "string", name: "bonusTokenSymbol", type: "string" },
      { internalType: "uint256", name: "pendingBonusToken", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "referral",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "registeredToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "removeWhitelistedAllocManager",
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
    inputs: [{ internalType: "address", name: "_stakingToken", type: "address" }],
    name: "rewarderBonusTokenInfo",
    outputs: [
      {
        internalType: "address[]",
        name: "bonusTokenAddresses",
        type: "address[]"
      },
      { internalType: "string[]", name: "bonusTokenSymbols", type: "string[]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "address", name: "_helper", type: "address" },
      { internalType: "address", name: "_rewarder", type: "address" },
      { internalType: "bool", name: "_helperNeedsHarvest", type: "bool" }
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_ARBRewarder", type: "address" }],
    name: "setARBRewarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address[]", name: "_pools", type: "address[]" }],
    name: "setARBRewarderAsQueuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_compounder", type: "address" }],
    name: "setCompounder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_stakingTokens", type: "address[]" },
      {
        internalType: "address[][]",
        name: "_legacyRewarder",
        type: "address[][]"
      }
    ],
    name: "setLegacyRewarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "bool", name: "_isLockFree", type: "bool" }
    ],
    name: "setMGPRewardPools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_mWomSV", type: "address" }],
    name: "setMWomSV",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_account", type: "address" },
      { internalType: "bool", name: "_allowedManager", type: "bool" }
    ],
    name: "setPoolManagerStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_referral", type: "address" }],
    name: "setReferral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_vlmgp", type: "address" }],
    name: "setVlmgp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_user", type: "address" }
    ],
    name: "stakingInfo",
    outputs: [
      { internalType: "uint256", name: "stakedAmount", type: "uint256" },
      { internalType: "uint256", name: "availableAmount", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "startTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokenToPoolInfo",
    outputs: [
      { internalType: "address", name: "stakingToken", type: "address" },
      { internalType: "uint256", name: "allocPoint", type: "uint256" },
      { internalType: "uint256", name: "lastRewardTimestamp", type: "uint256" },
      { internalType: "uint256", name: "accMGPPerShare", type: "uint256" },
      { internalType: "address", name: "rewarder", type: "address" },
      { internalType: "address", name: "helper", type: "address" },
      { internalType: "bool", name: "helperNeedsHarvest", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
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
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "unClaimedMgp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_mgpPerSec", type: "uint256" }],
    name: "updateEmissionRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_stakingToken", type: "address" }],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_stakingTokens", type: "address[]" },
      { internalType: "uint256[]", name: "_allocPoints", type: "uint256[]" }
    ],
    name: "updatePoolsAlloc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_rewarder", type: "address" },
      { internalType: "address", name: "_manager", type: "address" },
      { internalType: "bool", name: "_allowed", type: "bool" }
    ],
    name: "updateRewarderManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "vlmgp",
    outputs: [{ internalType: "contract ILocker", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "withdrawFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "withdrawMWomSVFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_for", type: "address" }
    ],
    name: "withdrawVlMGPFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
