// TODO: add pause function on smart contract to prevent withdrawing unlocked tokens
import { useEffect, useState, useMemo, ReactElement } from 'react';
import { ArrowDown } from 'lucide-react';
import Diagram from '../public/diagram.svg'
import { createPublicClient, createWalletClient, custom, erc20Abi, webSocket, type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods, Abi, getContract, type WalletClient, type PublicActions, publicActions } from 'viem';
import { arbitrum, bsc, mainnet } from 'viem/chains';
import { parseEther, formatEther, formatNumber, formatTime, aprToApy } from './utils';
import { Slippage, Swap, SwapBuildOutputExactIn, ExactInQueryOutput } from "@balancer/sdk";

declare global {
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

type Chains = 56 | 42161
type Coins = 'MGP' | 'RMGP' | 'YMGP' | 'CKP' | 'PNP' | 'EGP' | 'LTP' | 'ETH' | 'BNB'

const contractABIs = {
  RMGP: [{"inputs":[{"internalType":"address","name":"_mgpToken","type":"address"},{"internalType":"address","name":"_ymgpToken","type":"address"},{"internalType":"address","name":"_masterMagpie","type":"address"},{"internalType":"address","name":"_vlMGP","type":"address"},{"internalType":"address","name":"_weth","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotUnlockZero","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"NoLockedTokens","type":"error"},{"inputs":[],"name":"NoSlotsToUnlock","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"SwapRouterNotSet","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rmgpAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"rmgpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"UnlockStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"slot","type":"uint256"}],"name":"Unlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"MASTER_MAGPIE","outputs":[{"internalType":"contract IMasterMagpie","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MGP_TOKEN","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VL_MGP","outputs":[{"internalType":"contract IVL_MGP","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"addRewardsToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPendingWithdraws","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserWithdrawable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingWithdraws","outputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"removeRewardsToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewardTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"swapRouter","type":"address"}],"name":"setSwapRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"setYMGP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rmgpAmount","type":"uint256"}],"name":"startUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"swapRouters","outputs":[{"internalType":"contract ISwapRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unsubmittedWithdraws","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ymgpToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
  YMGP: [{"inputs":[{"internalType":"address","name":"_rmgpToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotLockZero","type":"error"},{"inputs":[],"name":"CannotUnlockZero","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Locked","type":"event"},{"anonymous":false,"inputs":[],"name":"NoYieldToClaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"YieldClaimed","type":"event"},{"inputs":[],"name":"RMGP_TOKEN","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lockedBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unclaimedUserYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userClaimedYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
  vlMGP: [{"inputs":[],"name":"AllUnlockSlotOccupied","type":"error"},{"inputs":[],"name":"AlreadyMigrated","type":"error"},{"inputs":[],"name":"BeyondUnlockLength","type":"error"},{"inputs":[],"name":"BeyondUnlockSlotLimit","type":"error"},{"inputs":[],"name":"BurnEventManagerNotSet","type":"error"},{"inputs":[],"name":"BurnEvnentManagerPaused","type":"error"},{"inputs":[],"name":"InvalidAddress","type":"error"},{"inputs":[],"name":"InvalidCoolDownPeriod","type":"error"},{"inputs":[],"name":"IsZeroAddress","type":"error"},{"inputs":[],"name":"MaxSlotCantLowered","type":"error"},{"inputs":[],"name":"MaxSlotShouldNotZero","type":"error"},{"inputs":[],"name":"NotEnoughLockedMPG","type":"error"},{"inputs":[],"name":"NotInCoolDown","type":"error"},{"inputs":[],"name":"PenaltyToNotSet","type":"error"},{"inputs":[],"name":"StillInCoolDown","type":"error"},{"inputs":[],"name":"TransferNotWhiteListed","type":"error"},{"inputs":[],"name":"UnlockSlotOccupied","type":"error"},{"inputs":[],"name":"UnlockedAlready","type":"error"},{"inputs":[],"name":"coolDownInSecCanCauseOverflow","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_coolDownSecs","type":"uint256"}],"name":"CoolDownInSecsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"slotIdx","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mgpamount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"penaltyAmount","type":"uint256"}],"name":"ForceUnLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_maxSlot","type":"uint256"}],"name":"MaxSlotUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"NewLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldMaster","type":"address"},{"indexed":false,"internalType":"address","name":"_newMaster","type":"address"}],"name":"NewMasterChiefUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"penaltyDestination","type":"address"}],"name":"PenaltyDestinationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"penaltyDestination","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PenaltySentTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"slotIdx","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Unlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"uint256","name":"_timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"UnlockStarts","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"VlMgpBurn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_for","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"}],"name":"WhitelistSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"burnEventManager","type":"address"}],"name":"burnEventManagerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"referralStorage","type":"address"}],"name":"referralStorageSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"wombatBribeManager","type":"address"}],"name":"wombatBribeManagerSet","type":"event"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MGP","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_masterMagpie","type":"address"},{"internalType":"uint256","name":"_maxSlots","type":"uint256"},{"internalType":"address","name":"_mgp","type":"address"},{"internalType":"uint256","name":"_coolDownInSecs","type":"uint256"}],"name":"__vlMGP_init_","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnEventManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vlmgpAmountToBurn","type":"uint256"},{"internalType":"uint256","name":"_vlmgpBurnEventId","type":"uint256"}],"name":"burnVlmgp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"cancelUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coolDownInSecs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"expectedPenaltyAmount","outputs":[{"internalType":"uint256","name":"penaltyAmount","type":"uint256"},{"internalType":"uint256","name":"amontToUser","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"forceUnLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getFullyUnlock","outputs":[{"internalType":"uint256","name":"unlockedAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getNextAvailableUnlockSlot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getRewardablePercentWAD","outputs":[{"internalType":"uint256","name":"percent","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserAmountInCoolDown","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"n","type":"uint256"}],"name":"getUserNthUnlockSlot","outputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserTotalLocked","outputs":[{"internalType":"uint256","name":"_lockAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserUnlockSlotLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserUnlockingSchedule","outputs":[{"components":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"internalType":"struct ILocker.UserUnlocking[]","name":"slots","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"lockFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"masterMagpie","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSlot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penaltyDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referralStorage","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_coolDownSecs","type":"uint256"}],"name":"setCoolDownInSecs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_masterMagpie","type":"address"}],"name":"setMasterChief","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxSlots","type":"uint256"}],"name":"setMaxSlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_burnEventMAnager","type":"address"}],"name":"setMgpBurnEventManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_penaltyDestination","type":"address"}],"name":"setPenaltyDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referralStorage","type":"address"}],"name":"setReferralStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_for","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"setWhitelistForTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_bribeManager","type":"address"}],"name":"setWombatBribeManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountToCoolDown","type":"uint256"}],"name":"startUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAmountInCoolDown","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPenalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferPenalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"transferWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userUnlockings","outputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wombatBribeManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
  masterMagpie: [{"inputs":[],"name":"IndexOutOfBound","type":"error"},{"inputs":[],"name":"InvalidStakingToken","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[],"name":"MGPsetAlready","type":"error"},{"inputs":[],"name":"MustBeContract","type":"error"},{"inputs":[],"name":"MustBeContractOrZero","type":"error"},{"inputs":[],"name":"MustNotBeZero","type":"error"},{"inputs":[],"name":"OnlyActivePool","type":"error"},{"inputs":[],"name":"OnlyCompounder","type":"error"},{"inputs":[],"name":"OnlyLocker","type":"error"},{"inputs":[],"name":"OnlyPoolHelper","type":"error"},{"inputs":[],"name":"OnlyPoolManager","type":"error"},{"inputs":[],"name":"OnlyWhiteListedAllocUpdator","type":"error"},{"inputs":[],"name":"PoolExsisted","type":"error"},{"inputs":[],"name":"UnlockAmountExceedsLocked","type":"error"},{"inputs":[],"name":"WithdrawAmountExceedsStaked","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldARBRewarder","type":"address"},{"indexed":false,"internalType":"address","name":"_newARBRewarder","type":"address"}],"name":"ARBRewarderSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"rewarder","type":"address"}],"name":"ARBRewarderSetAsQueuer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":true,"internalType":"contract IBaseRewardPool","name":"_rewarder","type":"address"}],"name":"Add","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newCompounder","type":"address"},{"indexed":false,"internalType":"address","name":"_oldCompounder","type":"address"}],"name":"CompounderUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"DepositNotAvailable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"},{"indexed":true,"internalType":"address","name":"_receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isLock","type":"bool"}],"name":"HarvestMGP","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"address[]","name":"_legacyRewarder","type":"address[]"}],"name":"LegacyRewardersSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"bool","name":"_isRewardMGP","type":"bool"}],"name":"LockFreePoolUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_mgp","type":"address"}],"name":"MGPSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_mWomSV","type":"address"},{"indexed":false,"internalType":"address","name":"_oldMWomSV","type":"address"}],"name":"MWomSVpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_account","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"}],"name":"PoolManagerStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"indexed":true,"internalType":"contract IBaseRewardPool","name":"_rewarder","type":"address"}],"name":"Set","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_oldMgpPerSec","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_newMgpPerSec","type":"uint256"}],"name":"UpdateEmissionRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_lastRewardTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_lpSupply","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_accMGPPerShare","type":"uint256"}],"name":"UpdatePool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_oldAllocPoint","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_newAllocPoint","type":"uint256"}],"name":"UpdatePoolAlloc","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newVlmgp","type":"address"},{"indexed":false,"internalType":"address","name":"_oldVlmgp","type":"address"}],"name":"VLMGPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ARBRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"AllocationManagers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"MPGRewardPool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"PoolManagers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_mgp","type":"address"},{"internalType":"uint256","name":"_mgpPerSec","type":"uint256"},{"internalType":"uint256","name":"_startTimestamp","type":"uint256"}],"name":"__MasterMagpie_init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"address","name":"_helper","type":"address"},{"internalType":"bool","name":"_helperNeedsHarvest","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAllocationManager","type":"address"}],"name":"addWhitelistedAllocManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"allPendingLegacyTokens","outputs":[{"internalType":"address[][]","name":"bonusTokenAddresses","type":"address[][]"},{"internalType":"string[][]","name":"bonusTokenSymbols","type":"string[][]"},{"internalType":"uint256[][]","name":"pendingBonusRewards","type":"uint256[][]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"allPendingTokens","outputs":[{"internalType":"uint256","name":"pendingMGP","type":"uint256"},{"internalType":"address[]","name":"bonusTokenAddresses","type":"address[]"},{"internalType":"string[]","name":"bonusTokenSymbols","type":"string[]"},{"internalType":"uint256[]","name":"pendingBonusRewards","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"compounder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"mainRewardToken","type":"address"}],"name":"createRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositMWomSVFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositVlMGPFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"getPoolInfo","outputs":[{"internalType":"uint256","name":"emission","type":"uint256"},{"internalType":"uint256","name":"allocpoint","type":"uint256"},{"internalType":"uint256","name":"sizeOfPool","type":"uint256"},{"internalType":"uint256","name":"totalPoint","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"stakingToken","type":"address"}],"name":"getRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"legacyRewarder_deprecated","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"legacyRewarders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mWomSV","outputs":[{"internalType":"contract ILocker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mgp","outputs":[{"internalType":"contract MGP","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mgpPerSec","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"}],"name":"multiclaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"},{"internalType":"address","name":"_account","type":"address"}],"name":"multiclaimFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"},{"internalType":"address","name":"_account","type":"address"}],"name":"multiclaimOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"}],"name":"multiclaimSpec","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"},{"internalType":"address","name":"_rewardToken","type":"address"}],"name":"pendingTokens","outputs":[{"internalType":"uint256","name":"pendingMGP","type":"uint256"},{"internalType":"address","name":"bonusTokenAddress","type":"address"},{"internalType":"string","name":"bonusTokenSymbol","type":"string"},{"internalType":"uint256","name":"pendingBonusToken","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referral","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"registeredToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"removeWhitelistedAllocManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"rewarderBonusTokenInfo","outputs":[{"internalType":"address[]","name":"bonusTokenAddresses","type":"address[]"},{"internalType":"string[]","name":"bonusTokenSymbols","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"address","name":"_helper","type":"address"},{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"bool","name":"_helperNeedsHarvest","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_ARBRewarder","type":"address"}],"name":"setARBRewarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_pools","type":"address[]"}],"name":"setARBRewarderAsQueuer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_compounder","type":"address"}],"name":"setCompounder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_legacyRewarder","type":"address[][]"}],"name":"setLegacyRewarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"bool","name":"_isLockFree","type":"bool"}],"name":"setMGPRewardPools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_mWomSV","type":"address"}],"name":"setMWomSV","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"bool","name":"_allowedManager","type":"bool"}],"name":"setPoolManagerStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referral","type":"address"}],"name":"setReferral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vlmgp","type":"address"}],"name":"setVlmgp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"stakingInfo","outputs":[{"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"internalType":"uint256","name":"availableAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenToPoolInfo","outputs":[{"internalType":"address","name":"stakingToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardTimestamp","type":"uint256"},{"internalType":"uint256","name":"accMGPPerShare","type":"uint256"},{"internalType":"address","name":"rewarder","type":"address"},{"internalType":"address","name":"helper","type":"address"},{"internalType":"bool","name":"helperNeedsHarvest","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"unClaimedMgp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mgpPerSec","type":"uint256"}],"name":"updateEmissionRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"uint256[]","name":"_allocPoints","type":"uint256[]"}],"name":"updatePoolsAlloc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"address","name":"_manager","type":"address"},{"internalType":"bool","name":"_allowed","type":"bool"}],"name":"updateRewarderManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vlmgp","outputs":[{"internalType":"contract ILocker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawMWomSVFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawVlMGPFor","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  vlStreamRewarder: [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}],
  balancerRouter: [{"inputs":[{"internalType":"contract IVault","name":"vault","type":"address"},{"internalType":"contract IWETH","name":"weth","type":"address"},{"internalType":"contract IPermit2","name":"permit2","type":"address"},{"internalType":"string","name":"routerVersion","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[],"name":"ErrorSelectorNotFound","type":"error"},{"inputs":[],"name":"EthTransfer","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[],"name":"InputLengthMismatch","type":"error"},{"inputs":[],"name":"InsufficientEth","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"uint8","name":"bits","type":"uint8"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeCastOverflowedUintDowncast","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"SenderIsNotVault","type":"error"},{"inputs":[],"name":"SwapDeadline","type":"error"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"addLiquidityCustom","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"},{"internalType":"uint256","name":"bptAmountOut","type":"uint256"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"enum AddLiquidityKind","name":"kind","type":"uint8"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouterCommon.AddLiquidityHookParams","name":"params","type":"tuple"}],"name":"addLiquidityHook","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"},{"internalType":"uint256","name":"bptAmountOut","type":"uint256"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"exactBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"addLiquidityProportional","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"maxAmountIn","type":"uint256"},{"internalType":"uint256","name":"exactBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"addLiquiditySingleTokenExactOut","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"exactAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"addLiquidityUnbalanced","outputs":[{"internalType":"uint256","name":"bptAmountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getPermit2","outputs":[{"internalType":"contract IPermit2","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWeth","outputs":[{"internalType":"contract IWETH","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"exactAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"initialize","outputs":[{"internalType":"uint256","name":"bptAmountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"exactAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouter.InitializeHookParams","name":"params","type":"tuple"}],"name":"initializeHook","outputs":[{"internalType":"uint256","name":"bptAmountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct IRouterCommon.PermitApproval[]","name":"permitBatch","type":"tuple[]"},{"internalType":"bytes[]","name":"permitSignatures","type":"bytes[]"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permit2Batch","type":"tuple"},{"internalType":"bytes","name":"permit2Signature","type":"bytes"},{"internalType":"bytes[]","name":"multicallData","type":"bytes[]"}],"name":"permitBatchAndCall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryAddLiquidityCustom","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"},{"internalType":"uint256","name":"bptAmountOut","type":"uint256"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"uint256","name":"minBptAmountOut","type":"uint256"},{"internalType":"enum AddLiquidityKind","name":"kind","type":"uint8"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouterCommon.AddLiquidityHookParams","name":"params","type":"tuple"}],"name":"queryAddLiquidityHook","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"},{"internalType":"uint256","name":"bptAmountOut","type":"uint256"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountOut","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryAddLiquidityProportional","outputs":[{"internalType":"uint256[]","name":"amountsIn","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"uint256","name":"exactBptAmountOut","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryAddLiquiditySingleTokenExactOut","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"exactAmountsIn","type":"uint256[]"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryAddLiquidityUnbalanced","outputs":[{"internalType":"uint256","name":"bptAmountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"maxBptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryRemoveLiquidityCustom","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"uint256","name":"maxBptAmountIn","type":"uint256"},{"internalType":"enum RemoveLiquidityKind","name":"kind","type":"uint8"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouterCommon.RemoveLiquidityHookParams","name":"params","type":"tuple"}],"name":"queryRemoveLiquidityHook","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryRemoveLiquidityProportional","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"}],"name":"queryRemoveLiquidityRecovery","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"}],"name":"queryRemoveLiquidityRecoveryHook","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryRemoveLiquiditySingleTokenExactIn","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountOut","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"queryRemoveLiquiditySingleTokenExactOut","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"enum SwapKind","name":"kind","type":"uint8"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountGiven","type":"uint256"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouter.SwapSingleTokenHookParams","name":"params","type":"tuple"}],"name":"querySwapHook","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountIn","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"querySwapSingleTokenExactIn","outputs":[{"internalType":"uint256","name":"amountCalculated","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountOut","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"querySwapSingleTokenExactOut","outputs":[{"internalType":"uint256","name":"amountCalculated","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"maxBptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"removeLiquidityCustom","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"uint256","name":"maxBptAmountIn","type":"uint256"},{"internalType":"enum RemoveLiquidityKind","name":"kind","type":"uint8"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouterCommon.RemoveLiquidityHookParams","name":"params","type":"tuple"}],"name":"removeLiquidityHook","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"removeLiquidityProportional","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"}],"name":"removeLiquidityRecovery","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"}],"name":"removeLiquidityRecoveryHook","outputs":[{"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"exactBptAmountIn","type":"uint256"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"removeLiquiditySingleTokenExactIn","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"uint256","name":"maxBptAmountIn","type":"uint256"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountOut","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"removeLiquiditySingleTokenExactOut","outputs":[{"internalType":"uint256","name":"bptAmountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountIn","type":"uint256"},{"internalType":"uint256","name":"minAmountOut","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"swapSingleTokenExactIn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"exactAmountOut","type":"uint256"},{"internalType":"uint256","name":"maxAmountIn","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"swapSingleTokenExactOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"enum SwapKind","name":"kind","type":"uint8"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountGiven","type":"uint256"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"wethIsEth","type":"bool"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IRouter.SwapSingleTokenHookParams","name":"params","type":"tuple"}],"name":"swapSingleTokenHook","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
} as const
const decimals: Record<Coins, number> = { MGP: 18, RMGP: 18, YMGP: 18, CKP: 18, PNP: 18, EGP: 18, LTP: 18, ETH: 18, BNB: 18 }

const publicClients = {
  1: createPublicClient({ chain: mainnet, transport: webSocket('wss://eth.drpc.org') }),
  56: createPublicClient({ chain: bsc, transport: webSocket('wss://binance.llamarpc.com') }),
  42161: createPublicClient({ chain: arbitrum, transport: webSocket('wss://arbitrum.drpc.org') })
}

function useUpdateable<T>(factory: () => Promise<T>, deps: unknown[]): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  const [value, setValue] = useState<T>();
  useEffect(() => {
    factory().then(setValue)
  }, [...deps, updateCount]);
  const update = (): void => setUpdateCount(c => c + 1);
  return [value, update];
}

const App = (): ReactElement => {
  const [mode, setMode] = useState<'deploy' | 'addDEX' | 'deposit' | 'convert' | 'lock' | 'unlock' | 'redeem'>('deposit')
  const [showDiagram, setShowDiagram] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [approveInfinity, setApproveInfinity] = useState(false)
  const [sendAmount, setSendAmount] = useState(parseEther(100));
  const [prices, setPrices] = useState<Record<Coins, number>>({ MGP: 0, RMGP: 0, YMGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, ETH: 0, BNB: 0 })
  const [dexToken, setDEXToken] = useState<Coins>()
  const [router, setRouter] = useState('')
  const [camelot, setCamelot] = useState(false)

  // Wallet
  const [walletClients, setWalletClients] = useState<Record<Chains, WalletClient & PublicActions> | undefined>()
  const [chain, setChain] = useState<Chains>(42161)
  const [account, setAccount] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [ens] = useUpdateable(() => publicClients[1].getEnsName({ address: account }), [account])

  const chainContracts = useMemo(() => {
    return {
      56: {
        MGP: getContract({ address: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa' as `0x${string}`, abi: erc20Abi, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        RMGP: getContract({ address: '0x0277517658a1dd3899bf926fCf6A633e549eB769' as `0x${string}`, abi: contractABIs.RMGP, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        YMGP: getContract({ address: '0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb' as `0x${string}`, abi: contractABIs.YMGP, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        VLMGP: getContract({ address: '0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6' as `0x${string}`, abi: contractABIs.vlMGP, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        masterMagpie: getContract({ address: '0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46' as `0x${string}`, abi: contractABIs.masterMagpie, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        VLSTREAMREWARDER: getContract({ address: '0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9' as `0x${string}`, abi: contractABIs.vlStreamRewarder, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        WETH: getContract({ address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as `0x${string}`, abi: erc20Abi, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
        balancerRouter: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: contractABIs.balancerRouter, client: walletClients ? { public: publicClients[56], wallet: walletClients[56] } : publicClients[56] }),
      },
      42161: {
        MGP: getContract({ address: '0xa61F74247455A40b01b0559ff6274441FAfa22A3' as `0x${string}`, abi: erc20Abi, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        RMGP: getContract({ address: '0x3788c8791d826254bAbd49b602C93008468D5695' as `0x${string}`, abi: contractABIs.RMGP, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        YMGP: getContract({ address: '0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9' as `0x${string}`, abi: contractABIs.YMGP, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        VLMGP: getContract({ address: '0x536599497Ce6a35FC65C7503232Fec71A84786b9' as `0x${string}`, abi: contractABIs.vlMGP, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        masterMagpie: getContract({ address: '0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7' as `0x${string}`, abi: contractABIs.masterMagpie, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        VLSTREAMREWARDER: getContract({ address: '0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45' as `0x${string}`, abi: contractABIs.vlStreamRewarder, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        WETH: getContract({ address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`, abi: erc20Abi, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
        balancerRouter: getContract({ address: '0xEAedc32a51c510d35ebC11088fD5fF2b47aACF2E' as `0x${string}`, abi: contractABIs.balancerRouter, client: walletClients ? { public: publicClients[42161], wallet: walletClients[42161] } : publicClients[42161] }),
      }
    }
  }, [walletClients])

  const contracts = useMemo(() => {
    return chainContracts[chain]
  }, [chain, walletClients])

  // Deploy Contract
  const [abi, setABI] = useState<string>()
  const [constructorArgs, setConstructorArgs] = useState<{ internalType: string, name: string, type: string, value: string | undefined }[]>([])
  const [bytecode, setBytecode] = useState<`0x${string}`>()

  // Allowances
  const [mgpAllowance, updateMGPAllowance] = useUpdateable(() => contracts.MGP.read.allowance([account, contracts.RMGP.address]), [contracts, account])
  const [rmgpAllowance, updateRMGPAllowance] = useUpdateable(() => contracts.RMGP.read.allowance([account, contracts.YMGP.address]), [contracts, account])

  // Balances
  const [mgpBalance, updateMGPBalance] = useUpdateable(() => contracts.MGP.read.balanceOf([account]), [contracts, account])
  const [rmgpBalance, updateRMGPBalance] = useUpdateable(() => contracts.RMGP.read.balanceOf([account]), [contracts, account])
  const [ymgpBalance, updateYMGPBalance] = useUpdateable(() => contracts.YMGP.read.balanceOf([account]), [contracts, account])
  const [ymgpHoldings, updateYMGPHoldings] = useUpdateable(() => contracts.RMGP.read.balanceOf([contracts.YMGP.address]), [contracts, account])

  // Locked
  const [reefiLockedMGP, updateReefiLockedMGP] = useUpdateable(() => contracts.VLMGP.read.getUserTotalLocked([contracts.RMGP.address]), [contracts, account])
  const [totalLockedMGPBSC, updateTotalLockedMGPBSC] = useUpdateable(() => chainContracts[56].VLMGP.read.totalLocked(), [chainContracts, account])
  const [totalLockedMGPARB, updateTotalLockedMGPARB] = useUpdateable(() => chainContracts[42161].VLMGP.read.totalLocked(), [chainContracts, account])
  const totalLockedMGP = useMemo(() => { return (totalLockedMGPBSC ?? 0n) + (totalLockedMGPARB ?? 0n) }, [totalLockedMGPBSC, totalLockedMGPARB])
  const updateTotalLockedMGP = (): void => {
    updateTotalLockedMGPBSC()
    updateTotalLockedMGPARB()
  }
  const [totalLockedYMGP, updateTotalLockedYMGP] = useUpdateable(() => contracts.YMGP.read.totalLocked(), [contracts, account])
  const [userLockedYMGP, updateUserLockedYMGP] = useUpdateable(() => contracts.YMGP.read.lockedBalances([account]), [contracts, account])

  // Supply
  const [mgpSupply, updateMGPSupply] = useUpdateable(() => chainContracts[56].MGP.read.totalSupply(), [chainContracts])
  const [ymgpSupply, updateYMGPSupply] = useUpdateable(() => contracts.YMGP.read.totalSupply(), [contracts])
  const [rmgpSupply, updateRMGPSupply] = useUpdateable(() => contracts.RMGP.read.totalSupply(), [contracts])
  
  // Withdraws
  const [userPendingWithdraws, updateUserPendingWithdraws] = useUpdateable(() => contracts.RMGP.read.getUserPendingWithdraws([account]), [contracts, account])
  const [unsubmittedWithdraws, updateUnsubmittedWithdraws] = useUpdateable(() => contracts.RMGP.read.unsubmittedWithdraws(), [contracts])
  const [userWithdrawable, updateUserWithdrawable] = useUpdateable(() => contracts.RMGP.read.getUserWithdrawable(), [contracts])
  const [unlockSchedule, updateUnlockSchedule] = useUpdateable(() => contracts.VLMGP.read.getUserUnlockingSchedule([contracts.RMGP.address]), [contracts])

  // Pegs
  const mgpRmgpRatio = useMemo(() => { return rmgpSupply === 0n ? 1 : (Number(reefiLockedMGP) / Number(rmgpSupply)) }, [rmgpSupply, reefiLockedMGP])
  const ymgpRmgpRatio = 1

  // Yield
  const [mgpAPR, setMGPAPR] = useState(0)
  const [pendingRewards, setPendingRewards] = useState<Record<Coins, { address: `0x${string}`, rewards: bigint }> | undefined>()
  const [unclaimedUserYield, updateUnclaimedUserYield] = useUpdateable(() => contracts.YMGP.read.unclaimedUserYield(), [contracts])
  const [compoundRMGPGas, setCompoundRMGPGas] = useState(0n)
  const uncompoundedMGPYield = useMemo(() => {
    return pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0
  }, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[chain].chain.nativeCurrency.symbol])*prices[publicClients[chain].chain.nativeCurrency.symbol], [chain, compoundRMGPGas, prices])
  const updatePendingRewards = async (): Promise<void> => {
    const data = await contracts.masterMagpie.read.allPendingTokens([contracts.VLMGP.address, contracts.RMGP.address])
    const [pendingMGP, bonusTokenAddresses, bonusTokenSymbols, pendingBonusRewards] = data
    const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts.MGP.address, rewards: pendingMGP } }
    for (const i in bonusTokenSymbols) if (bonusTokenSymbols[i] !== undefined && pendingBonusRewards[i] !== undefined && bonusTokenAddresses[i] !== undefined) newPendingRewards[bonusTokenSymbols[i].replace('Bridged ', '').toUpperCase()] = { rewards: pendingBonusRewards[i], address: bonusTokenAddresses[i] };
    setPendingRewards(newPendingRewards)
  }

  useEffect(() => {
    if (window.ethereum) connectWallet();
    const savedChain = window.localStorage.getItem('chain')
    if (savedChain !== null) setChain(Number(savedChain) as 56 | 42161)
    fetch('https://api.magpiexyz.io/getalltokenprice').then(res => res.json().then((body: { data: { AllPrice: typeof prices }}) => setPrices(body.data.AllPrice)))
    const interval = setInterval(updatePendingRewards, 5_000)
    return (): void => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (walletClients) walletClients[chain].switchChain({ id: chain })
    window.ethereum?.request({ method: 'eth_accounts' }).then(accounts => { if (accounts !== undefined) connectWallet() })
    updatePendingRewards()
    fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts.VLSTREAMREWARDER.address}`).then(res => res.json()).then(body => {setMGPAPR((body as { data: { rewardTokenInfo: { apr: number }[] }}).data.rewardTokenInfo.reduce((acc, token) => {return { ...token, apr: acc.apr+token.apr }}).apr)})
  }, [chain])

  useEffect(() => {
    if (!account) return
    estimateCompoundRMGPGas().then(setCompoundRMGPGas)
  }, [chain, account])

  useEffect(() => {
    for (const item of JSON.parse(abi ?? '[]') as Abi) {
      if (item.type === 'constructor') {
        const args = (item.inputs as { internalType: string, name: string, type: string, value?: string }[]).map(arg => {
          const contract = arg.name.toUpperCase().replace('_', '').replace('TOKEN', '') as keyof typeof contracts
          return { ...arg, value: Object.keys(contracts).includes(contract) ? contracts[contract] : arg.value }
        })
        setConstructorArgs(args)
      }
    }
  }, [contracts, abi])

  const connectWallet = async (): Promise<void | (() => void)> => {
    if (!window.ethereum) return alert('MetaMask not found. Please install MetaMask to use this application.');
    setIsConnecting(true);
    const clients = {
      56: createWalletClient({ chain: bsc, transport: custom(window.ethereum)}).extend(publicActions),
      42161: createWalletClient({ chain: arbitrum, transport: custom(window.ethereum)}).extend(publicActions)
    } as const
    setWalletClients(clients)
    setAccount((await clients[chain].requestAddresses())[0] ?? '0x0000000000000000000000000000000000000000');
    setIsConnecting(false);
    return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
  }

  const handleAccountsChanged = (accounts: `0x${string}`[]): void => setAccount(accounts[0] ?? '0x0000000000000000000000000000000000000000');

  const approve = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    if (mode === 'deposit') {
      const amount = approveInfinity ? 2n ** 256n - 1n : sendAmount;
      await contracts.MGP.write.approve([contracts.RMGP.address, amount], { account })
      updateMGPAllowance()
    } else if (mode === 'convert') {
      const amount = approveInfinity ? 2n ** 256n - 1n : sendAmount;
      await contracts.RMGP.write.approve([contracts.YMGP.address, amount], { account })
      updateRMGPAllowance()
    }
  }

  const depositMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    if (mgpAllowance === undefined || mgpAllowance < sendAmount) return alert('Allowance too low')
    await contracts.RMGP.write.deposit([sendAmount], { account })
    updateMGPBalance()
    updateRMGPBalance()
    updateMGPSupply()
    updateRMGPSupply()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const depositRMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    if (rmgpAllowance === undefined || rmgpAllowance < sendAmount) return alert('Allowance too low')
    await contracts.YMGP.write.deposit([sendAmount], { account })
    updateRMGPBalance()
    updateYMGPBalance()
    updateRMGPSupply()
    updateYMGPSupply()
    updateYMGPHoldings()
  }

  const lockYMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    await contracts.YMGP.write.lock([sendAmount], { account })
    updateYMGPSupply()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const unlockYMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    await contracts.YMGP.write.unlock([sendAmount], { account })
    updateYMGPSupply()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const redeemRMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    await contracts.RMGP.write.startUnlock([sendAmount], { account })
    updateUnlockSchedule()
    updateRMGPSupply()
    updateRMGPBalance()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
    updateUnclaimedUserYield()
  }

  const withdrawMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    await contracts.RMGP.write.unlock([], { account })
    await contracts.RMGP.write.withdraw([], { account })
    updateMGPBalance()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
  }

  const compoundRMGP = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    await contracts.RMGP.write.claim([], { account })
    updatePendingRewards()
    updateUnclaimedUserYield()
    updateRMGPSupply()
    updateRMGPBalance()
    updateTotalLockedMGP()
  }

  const claimYMGPRewards = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    await contracts.YMGP.write.claim([], { account })
    updateUnclaimedUserYield()
  }

  const estimateCompoundRMGPGas = async (): Promise<bigint> => {
    const gasPrice = await publicClients[chain].getGasPrice()
    const gas = account === '0x0000000000000000000000000000000000000000' ? 0n : await contracts.RMGP.estimateGas.claim({ account })
    return gas*gasPrice
  }

  const deployContract = async (): Promise<void> => {
    if (!walletClients) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    if (abi === undefined) return alert('ABI not set')
    if (bytecode === undefined) return alert('Bytecode not set')
    const args = []
    for (const arg of constructorArgs) {
      if (!('value' in arg) || arg.value?.length === 0) return alert(`Constructor argument ${arg.name} is missing`)
      args.push(arg.value)
    }
    alert(`Contract Deployed: ${await walletClients[chain].deployContract({ abi: JSON.parse(abi), account, bytecode, args, chain: walletClients[chain].chain })}`)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-grow overflow-auto">
        <div className="p-4 md:p-6">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">REEFI</h1>
              <p>Refinance Magpie Yield{/* and governance*/}</p>
            </div>
            {account ? <div className="flex items-center space-x-4">
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">MGP: {mgpBalance !== undefined ? formatEther(mgpBalance, decimals.MGP).toFixed(4) : 'Loading...'}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">rMGP: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP).toFixed(4) : 'Loading...'}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">yMGP: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP).toFixed(4) : 'Loading...'}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Locked yMGP: {userLockedYMGP !== undefined ? formatEther(userLockedYMGP, decimals.YMGP).toFixed(4) : 'Loading...'}</div>
              <div className="bg-green-600/20 text-green-400 rounded-lg px-3 py-2 text-sm">{ens ?? `${account.slice(0, 6)}...${account.slice(-4)}`}</div>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" value={chain} onChange={e => {
                setChain(Number(e.target.value) as 56 | 42161)
                window.localStorage.setItem('chain', String(e.target.value))
              }}>
                <option value="56">BNB Chain</option>
                <option value="42161">Arbitrum</option>
              </select>
            </div> : <button type="button" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors" onClick={() => connectWallet()} disabled={isConnecting}>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</button>}
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div />
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="grid grid-cols-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">M</div>
                      <p className="font-bold text-lg">$MGP</p>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">${prices.MGP.toFixed(5)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 col-span-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{mgpSupply !== undefined ? formatNumber(formatEther(mgpSupply, decimals.MGP)) : 'Loading...'}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Locked</p>
                    <p className="font-medium">{totalLockedMGP !== undefined ? formatNumber(Math.round(formatEther(totalLockedMGP, decimals.MGP))) : 'Loading...'} MGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Lock Rate</p>
                    <p className="font-medium">{Math.round(10_000*Number(totalLockedMGP)/Number(mgpSupply))/100}%</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">FDV</p>
                    <p className="font-medium">${mgpSupply !== undefined ? formatNumber((prices.MGP*formatEther(mgpSupply, decimals.MGP))) : 'Loading...'}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">MGP is the underlying asset all derivatives rely on.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="grid grid-cols-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                      <p className="font-bold text-lg">$rMGP</p>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">${(prices.MGP*mgpRmgpRatio).toFixed(5)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 col-span-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{rmgpSupply !== undefined ? formatNumber(formatEther(rmgpSupply, decimals.RMGP), 4) : 'Loading...'} rMGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">TVL</p>
                    <p className="font-medium">{reefiLockedMGP !== undefined ? formatNumber(formatEther(reefiLockedMGP, decimals.MGP), 3) : 'Loading...'} MGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">1 rMGP</p>
                    <p className="font-medium">{mgpRmgpRatio.toFixed(5)} MGP</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.</p>
              <ul className="list-disc list-inside text-gray-300 text-xs mt-2">
                <li><strong>Liquid</strong>: Tradable token representing locked MGP</li>
                <li><strong>Auto Compounding</strong>: Yield is automatically reinvested</li>
                <li><strong>Pegged</strong>: rMGP is pegged to MGP with a 10% depeg limit</li>
                <li><strong>Redeemable</strong>: rMGP can be redeemed for MGP natively</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="grid grid-cols-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">Y</div>
                      <p className="font-bold text-lg">$yMGP</p>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">${(prices.MGP*mgpRmgpRatio*ymgpRmgpRatio).toFixed(5)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 col-span-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{ymgpSupply === undefined || totalLockedYMGP === undefined ? 'Loading...' : formatNumber(formatEther(ymgpSupply+totalLockedYMGP, decimals.YMGP))} yMGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Lock Rate</p>
                    <p className="font-medium">{ymgpSupply === undefined || totalLockedYMGP === undefined ? 'Loading...' : Math.round(10_000*Number(totalLockedYMGP)/Number(ymgpSupply+totalLockedYMGP))/100}%</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Peg</p>
                    <p className="font-medium">{Math.round(ymgpRmgpRatio*100)}%</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals {/*and 100% of rMGP from $vMGP deposits */}are distributed to locked yMGP paid in rMGP.</p>
              <ul className="list-disc list-inside text-gray-300 text-xs mt-2">
                <li><strong>Liquid</strong>: Tradable token representing locked rMGP</li>
                <li><strong>Extra Yield</strong>: 5% of protocol yield and withdrawals</li>
              </ul>
            </div>

            {/* <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">V</div>
                    <p className="font-bold text-lg">$vMGP</p>
                  </div>
                  <h2 className="text-2xl font-bold mt-2">${Math.round(prices.MGP*mgpRmgpRatio*coins.vMGP.peg*100_000)/100_000}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <p className="text-gray-400 text-xs">Supply</p>
                  <p className="font-medium">{Math.round(coins.vMGP.supply/100)/10}K yMGP</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <p className="text-gray-400 text-xs">Peg</p>
                  <p className="font-medium">{Math.round(coins.vMGP.peg*100)}%</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">$vMGP is minted 1:1 for rMGP but cannot be converted back to yMGP. $vMGP controls all of REEFI's voting power for Magpie governance proposals but earns no yield.</p>
            </div> */}
          </div>

          {/* <li>Sell vote power for more yield</li>
          <div>
            <h3 className="text-lg font-bold mb-2 text-center">Governance</h3>
            <ul className="list-disc list-inside text-gray-300">
              <li>Multiplied vote power</li>
              <li>Buy vote power for future yield</li>
            </ul>
          </div> */}
          <div className="flex flex-col justify-center mb-4 items-center">
            <button type="button" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors w-fit" onClick={() => setShowDiagram(!showDiagram)}>{showDiagram ? 'Hide Diagram' : 'Show Diagram'}</button>
            {showDiagram && <div className="flex justify-center mt-4"><img src={Diagram} alt="Diagram" className="h-120" /></div>}
          </div>

          <h2 className="text-2xl text-red-400 text-center">VERY EARLY BETA</h2>
          <p className="text-center mb-4">Reefi is in a very early beta. Please deposit very small amounts that you are okay losing as Reefi has many known and unknown bugs that need to be fixed.</p>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <div className="flex flex-row-reverse mb-6">
              <div className="flex gap-1">
                <div className="text-sm bg-gray-700 rounded-lg px-3 py-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                  <span>MGP APR: {Math.round(mgpAPR*10_000)/100}%</span>
                </div>
                <div className="text-sm bg-gray-700 rounded-lg px-3 py-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                  <span>RMGP APY: {Math.round(10_000*aprToApy(mgpAPR)*0.9)/100}%</span>
                </div>
                <div className="text-sm bg-gray-700 rounded-lg px-3 py-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                  <span>Locked YMGP APY: {Math.round(10_000*(((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP))+(aprToApy(mgpAPR)*0.9)))/100}%+</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 p-1 rounded-lg flex">
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'deploy' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('deploy')}>Deploy Contract</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'addDEX' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('addDEX')}>Add DEX</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'deposit' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('deposit')}>Deposit MGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'convert' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('convert')}>Convert rMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'lock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('lock')}>Lock yMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'unlock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('unlock')}>Unlock yMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'redeem' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('redeem')}>Withdraw rMGP</button>
              </div>
            </div>

            {!account ? <div className="bg-gray-700/50 p-10 rounded-lg text-center">
              <p className="text-xl mb-4">Connect your wallet to use Reefi</p>
              <button type="button" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors" onClick={() => connectWallet()} disabled={isConnecting}>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</button>
            </div> : <>
              {mode === 'deploy' && <div className="bg-gray-700/50 p-5 rounded-lg">
                <div className="mb-4">
                  <h3 className="text-md font-medium my-2">Bytecode</h3>
                  <textarea className="bg-gray-900 rounded-lg mb-2 p-4 outline-none text-lg w-full" placeholder="0x..." value={bytecode} onChange={e => setBytecode(e.target.value as `0x${string}`)} />
                  <h3 className="text-md font-medium my-2">ABI</h3>
                  <textarea className="bg-gray-900 rounded-lg mb-2 p-4 outline-none text-lg w-full" placeholder="[...]" value={abi} onChange={e => setABI(e.target.value)} />
                  {constructorArgs.map((arg, i) => <div key={arg.name}>
                    <h4 className="text-xs font-medium my-2">{arg.name}</h4>
                    <input type="text" placeholder={arg.type} value={arg.value} className="bg-gray-900 rounded-lg p-3 outline-none text-xs w-full" onChange={e => {
                      const newArgs = [...constructorArgs]
                      if (newArgs[i]) newArgs[i].value = e.target.value
                      setConstructorArgs(newArgs)
                    }} />
                  </div>)}
                </div>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={deployContract}>Deploy Contract</button>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-4" onClick={async () => {
                  await contracts.RMGP.write.setYMGP([contracts.YMGP.address], { account })
                }}>Set yMGP</button>
              </div>}

              {mode === 'addDEX' && <div className="bg-gray-700/50 p-5 rounded-lg">
                <h4 className="text-xs font-medium my-2">Token Symbol</h4>
                <input type="text" placeholder="MGP" className="bg-gray-900 rounded-lg p-3 outline-none text-xs w-full" onChange={e => setDEXToken(e.target.value as Coins)} />
                <h4 className="text-xs font-medium my-2">Token Contract</h4>
                <input type="text" placeholder="0x..." className="bg-gray-900 rounded-lg p-3 outline-none text-xs w-full" value={dexToken !== undefined && dexToken in contracts ? contracts[dexToken].address : ''} disabled />
                <h4 className="text-xs font-medium my-2">Router</h4>
                <input type="text" placeholder="0x..." className="bg-gray-900 rounded-lg p-3 outline-none text-xs w-full" value={router} onChange={e => setRouter(e.target.value)} />
                <div className="flex items-center mt-2">
                  <input id="camelot" type="checkbox" className="mr-2" checked={camelot} onChange={e => setCamelot(e.target.checked)} />
                  <label htmlFor="camelot" className="text-sm text-gray-300 select-none cursor-pointer">Camelot</label>
                </div>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-4" onClick={() => {
                  if (!dexToken) return alert("No token defined")
                  if (!(dexToken in contracts)) return alert("Token contract not defined")
                  contracts.RMGP.write.addRewardsToken([contracts[dexToken].address], { account })
                }}>Add Rewards Token</button>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-4" onClick={() => {
                  if (!dexToken) return alert("No token defined")
                  if (!(dexToken in contracts)) return alert("Token contract not defined")
                  if (!router) return alert("Swap router not defined")
                  contracts.RMGP.write.setSwapRouter([contracts[dexToken].address, router, camelot], { account })
                }}>Set Swap Router</button>
              </div>}

              {mode === 'deposit' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Deposit MGP</h3>
                      <div className="text-sm text-gray-400">Balance: {mgpBalance !== undefined ? formatEther(mgpBalance, decimals.MGP) : 'Loading...'} MGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(mgpBalance ?? 0n)}>MAX</button>
                        <div className="rounded-md px-3 py-1 flex items-center bg-blue-600">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-blue-400">M</div>
                          <span>MGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-2"><div className="inline-block p-1 bg-gray-700 rounded-full"><ArrowDown size={20} className="text-gray-400" /></div></div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Receive rMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP) : 'Loading...'} rMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount) / mgpRmgpRatio} readOnly/>
                      <div className="flex items-center">
                        <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                          <span>rMGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 text-sm text-gray-400">
                    <div className="flex justify-between mb-1">
                      <span>Original APR</span>
                      <span>{Math.round(10_000*mgpAPR)/100}%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Reward APY</span>
                      <span>{Math.round(10_000*aprToApy(mgpAPR)*0.9)/100}%</span>
                    </div>
                  </div>
                  {mgpAllowance === undefined ? <p>Loading...</p> : mgpAllowance < sendAmount ? <>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={approve}>Approve MGP</button>
                    <div className="flex items-center mt-2">
                      <input id="approve-infinity" type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
                      <label htmlFor="approve-infinity" className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
                    </div>
                  </> : <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositMGP}>Get rMGP</button>}
                  <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-2" onClick={async () => {
                    if (!walletClients || !walletClients[chain].chain) return alert('Wallet not connected')
                    contracts.balancerRouter.write.swapSingleTokenExactIn(['0xf2A32B2a9c158D1442cBf70065A1AE571d60Ebb2', contracts.MGP.address, contracts.RMGP.address, sendAmount, 0n, 999999999999999999n, false, '0x'], { account })
                    return

                    const slippage = Slippage.fromPercentage("1"); // 1%
                    // const poolState = await new BalancerApi('https://api-v3.balancer.fi/', chain).pools.fetchPoolState('0xf2A32B2a9c158D1442cBf70065A1AE571d60Ebb2');
                    // const addLiquidity = new AddLiquidity();
                    // const queryOutput = await addLiquidity.query({ chainId: chain, rpcUrl: walletClients[chain].chain.rpcUrls.default.http[0] as string, kind: AddLiquidityKind.Proportional, referenceAmount: { address: contracts.YMGP.address, decimals: decimals.YMGP, rawAmount: parseEther(1) } }, poolState);
                    // const permit2 = await Permit2Helper.signAddLiquidityApproval({ ...queryOutput, slippage, owner: account, client: walletClients[chain] });
                    // const call = addLiquidity.buildCallWithPermit2({ ...queryOutput, slippage, sender: account, recipient: account }, permit2);
                    // await walletClients[chain].sendTransaction({ account, data: call.callData, to: call.to, value: call.value, chain: walletClients[chain].chain });
                    // console.log(queryOutput, call);

                    const deadline = 999999999999999999n; // Deadline for the swap, in this case infinite
                    // const tokenIn = new Token(chain, contracts.MGP.address, decimals.MGP, "MGP");
                    // const tokenOut = new Token(chain, contracts.RMGP.address, decimals.RMGP, "rMGP");
                    // const sorPaths = await new BalancerApi("https://api-v3.balancer.fi/", chain).sorSwapPaths.fetchSorSwapPaths({ chainId: chain, tokenIn: tokenIn.address, tokenOut: tokenOut.address, swapKind: 0, swapAmount: TokenAmount.fromRawAmount(tokenIn, sendAmount) });
                    // if (sorPaths.length === 0) return alert('No route found')
                    // console.log('sorPaths', JSON.stringify(sorPaths))
                    const sorPaths = [{
                      inputAmountRaw: sendAmount.toString(),
                      outputAmountRaw: "0",
                      pools: ["0xf2A32B2a9c158D1442cBf70065A1AE571d60Ebb2"],
                      isBuffer: [true],
                      protocolVersion: 3,
                      tokens: [
                        { address: contracts.MGP.address, decimals: 18},
                        { address: contracts.RMGP.address, decimals: 18}
                      ]
                    }]
                    const swap = new Swap({ chainId: chain, paths: sorPaths, swapKind: 0})
                    console.log(`Input token: ${swap.inputAmount.token.address}, Amount: ${swap.inputAmount.amount}`)
                    console.log(`Output token: ${swap.outputAmount.token.address}, Amount: ${swap.outputAmount.amount}`)
                    const updated = await swap.query(walletClients[chain].chain.rpcUrls.default.http[0]) as ExactInQueryOutput;
                    console.log(`Updated amount: ${updated.expectedAmountOut.amount}`);
                    const callData = swap.buildCall({ slippage, deadline, queryOutput: updated, wethIsEth: false }) as SwapBuildOutputExactIn;
                    console.log(`Min Amount Out: ${callData.minAmountOut.amount}\n\nTx Data:\nTo: ${callData.to}\nCallData: ${callData.callData}\nValue: ${callData.value}`);
                  }}>Balancer</button>
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards and half the withdrawal fees.</p>
                    </div>
                  </div>
                </div>
              </>}

              {mode === 'convert' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Convert rMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP) : 'Loading...'} rMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))}/>
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(rmgpBalance ?? 0n)}>MAX</button>
                        <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">R</div>
                          <span>rMGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-2"><div className="inline-block p-1 bg-gray-700 rounded-full"><ArrowDown size={20} className="text-gray-400" /></div></div>
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-md font-medium">Receive yMGP</h3>
                        <div className="text-sm text-gray-400">Balance: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP) : 'Loading...'} yMGP</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between mb-8">
                        <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)/ymgpRmgpRatio} readOnly/>
                        <div className="flex items-center">
                          <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">Y</div>
                            <span>yMGP</span>
                          </div>
                        </div>
                      </div>
                      {rmgpAllowance === undefined ? <p>Loading...</p> : rmgpAllowance < sendAmount ? <>
                        <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={approve}>Approve rMGP</button>
                        <div className="flex items-center mt-2">
                          <input id="approve-infinity" type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
                          <label htmlFor="approve-infinity" className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
                        </div>
                      </> : <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositRMGP}>Get yMGP</button>}
                    </div>
                    {/* <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-md font-medium">Receive vMGP</h3>
                        <div className="text-sm text-gray-400">Balance: {balances?.vMGP} vMGP</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" defaultValue={100*(1/coins.vMGP.peg)} readOnly/>
                        <div className="flex items-center">
                          <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">V</div>
                            <span>vMGP</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 text-sm text-gray-400">
                        <div className="flex justify-between mt-4">
                          <span>Vote Multiplier</span>
                          <span>{Math.round((supply/coins.vMGP.supply)*100)/100}x</span>
                        </div>
                      </div>
                      <button className={`w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700`}>Get vMGP</button>
                    </div> */}
                  </div>
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">yMGP is backed 1:1 by rMGP. This process can not be undone.</p>
                    </div>
                  </div>
                </div>
              </>}

              {mode === 'redeem' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Redeem rMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP) : 'Loading...'} rMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(rmgpBalance ?? 0n)}>MAX</button>
                        <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                          <span>rMGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-2"><div className="inline-block p-1 bg-gray-700 rounded-full"><ArrowDown size={20} className="text-gray-400" /></div></div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Receive MGP</h3>
                      <div className="text-sm text-gray-400">Balance: {mgpBalance !== undefined ? formatEther(mgpBalance, decimals.MGP) : 'Loading...'} MGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={mgpRmgpRatio*formatEther(sendAmount)*0.9} readOnly />
                      <div className="flex items-center">
                        <div className="bg-blue-600 rounded-md px-3 py-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">M</div>
                          <span>MGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 text-sm text-gray-400">
                    <div className="flex justify-between mb-1">
                      <span>Rate</span>
                      <span>{mgpRmgpRatio*0.9} MGP to rMGP</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={redeemRMGP}>Redeem rMGP</button>
                  {userPendingWithdraws === undefined ? <p>Loading...</p> : userPendingWithdraws > 0n ? <>
                    <h3 className="text-md font-medium mt-4">Pending Withdraws</h3>
                    <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
                    {unlockSchedule?.[0] ? <p>Unlock available in: {formatTime(Number(unlockSchedule[0].endTime)-(+new Date()/1000))} to {formatTime((unsubmittedWithdraws !== undefined ? Number(unlockSchedule[unlockSchedule.length-1]?.endTime) + 60*60*24*60 : Number(unlockSchedule[unlockSchedule.length-1]?.endTime))-(+new Date()/1000))}</p> : <p>N/A</p>}
                  </> : ''}
                  {userWithdrawable === undefined ? <p>Loading...</p> : userWithdrawable > 0n ? <>
                    <h3 className="text-md font-medium mt-4">Available To Withdraw</h3>
                    <p>{formatEther(userWithdrawable, decimals.MGP)} MGP</p>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={withdrawMGP}>Withdraw MGP</button>
                  </> : ''}
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">rMGP can be redeemed for the underlying MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate.</p>
                      <p className="text-gray-300 mt-1">The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.</p>
                      <p className="text-gray-300 mt-1">Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.</p>
                      <p className="text-gray-300 mt-1">With the 10% withdrawal fee, rMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.</p>
                      <p className="text-gray-300 mt-1">Half of the withdrawal fee (5% of withdrawal) is redistributed to yMGP holders as yield, with the other half sent to the Reefi treasury.</p>
                    </div>
                  </div>
                </div>
              </>}

              {(mode === 'lock' || mode === 'unlock') && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  {mode === 'lock' ? <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-md font-medium">Lock yMGP</h3>
                        <div className="text-sm text-gray-400">Balance: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP) : 'Loading...'} yMGP</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                        <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                        <div className="flex items-center space-x-2">
                          <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(ymgpBalance ?? 0n)}>MAX</button>
                          <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">Y</div>
                            <span>yMGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 text-sm text-gray-400">
                      <div className="flex justify-between mb-1">
                        <span>Base APY</span>
                        <span>{Math.round(10_000*aprToApy(mgpAPR)*0.9)/100}%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Additional APY</span>
                        <span>{Math.round(10_000*((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP)))/100}%+</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Total APY</span>
                        <span>{Math.round(10_000*(((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP))+(aprToApy(mgpAPR)*0.9)))/100}%+</span>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={lockYMGP}>Lock yMGP</button>
                  </> : <>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Unlock yMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP) : 'Loading...'} yMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between mb-4">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(ymgpBalance ?? 0n)}>MAX</button>
                        <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">Y</div>
                          <span>yMGP</span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={unlockYMGP}>Unlock yMGP</button>
                  </>}
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.</p>
                    </div>
                  </div>
                </div>
              </>}
            </>}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
            <h2 className="text-2xl font-bold mb-4">Pending Rewards</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Uncompounded Yield</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-lg">{formatNumber(uncompoundedMGPYield, 6)} MGP</p>
                    <p className="font-medium text-lg">${formatNumber(uncompoundedMGPYield*prices.MGP, 6)}</p>
                  </div>
                  <div className="bg-green-600 bg-opacity-75 w-full h-[0.5px] my-2" />
                  {pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => <div key={symbol} className="flex justify-between">
                    <p className="font-small text-xs">{formatNumber(formatEther(pendingRewards[symbol].rewards, decimals[symbol]), 6)} {symbol}</p>
                    <p className="font-small text-xs">${formatNumber(prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol])), 6)}</p>
                  </div>) : ''}
                </div>
                <p className="text-gray-400 text-xs mt-2">Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of RMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as RMGP, 4% sent to the treasury, and 5% to locked YMGP. By clicking the button below, you will receive 1% of the pending yield.</p>
                <p className="text-xs text-gray-400 mt-4">Estimated Payout: <span className="text-green-400">${formatNumber(uncompoundedMGPYield*prices.MGP*0.01, 6)}</span></p>
                <p className="text-xs text-gray-400">Estimated Gas Fee: <span className="text-red-400">${formatNumber(estimatedCompoundGasFee, 6)}</span></p>
                <p className="text-gray-400 mt-2">Estimated Profit: <span className={`text-${uncompoundedMGPYield*prices.MGP*0.01 > estimatedCompoundGasFee ? 'green' : 'red'}-400`}>{uncompoundedMGPYield*prices.MGP*0.01 > estimatedCompoundGasFee ? '' : '-'}${String(formatNumber(uncompoundedMGPYield*prices.MGP*0.01-estimatedCompoundGasFee, 6)).replace('-', '')}</span></p>
                {uncompoundedMGPYield*prices.MGP*0.01 < estimatedCompoundGasFee ? <p className="text-gray-400 text-xs">ETA Till Profitable: {formatTime((estimatedCompoundGasFee/prices.MGP) / (formatEther(BigInt(mgpAPR*Number(reefiLockedMGP)), decimals.MGP) / (365 * 24 * 60 * 60)))}</p> : ''}
                <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={compoundRMGP}>Compound RMGP Yield (Get ~{formatNumber(0.01*uncompoundedMGPYield*(1/mgpRmgpRatio), 6)} rMGP)</button>
              </div>
              <div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Unclaimed Rewards</p>
                  <p className="font-medium text-lg">{unclaimedUserYield !== undefined ? formatNumber(formatEther(unclaimedUserYield, decimals.YMGP), 4) : 'Loading...'} rMGP</p>
                  <p className="font-small text-xs">Total: {ymgpHoldings === undefined || ymgpSupply === undefined || totalLockedYMGP === undefined ? 'Loading...' : formatNumber(formatEther(ymgpHoldings-ymgpSupply-totalLockedYMGP, decimals.YMGP), 4)} rMGP</p>
                </div>
                <p className="text-gray-400 text-xs mt-2">Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.</p>
                <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={claimYMGPRewards}>Claim YMGP Rewards</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
            <h2 className="text-lg font-bold mb-2">Contract Addresses</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {(Object.keys(contracts) as (keyof typeof contracts)[]).map(contract => <div key={contract}>
                <span className="font-semibold">{contract}:</span>
                <a href={`${publicClients[chain].chain.blockExplorers.default.url}/address/${contracts[contract].address}`} className="ml-2 break-all text-green-300">{contracts[contract].address}</a>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
