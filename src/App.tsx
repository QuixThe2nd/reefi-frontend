import { useEffect, useState, useCallback, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import Diagram from '../public/diagram.svg'
import { createPublicClient, createWalletClient, custom, erc20Abi, http, type WalletClient, type EIP1193EventMap, type EIP1193RequestFn, type EIP1474Methods, type CustomTransport, Abi, ReadContractParameters, ContractFunctionArgs, ContractFunctionName, ReadContractReturnType } from 'viem';
import { arbitrum, bsc, mainnet } from 'viem/chains';

mainnet.rpcUrls.default.http = ['https://eth.drpc.org']
// bsc.rpcUrls.default.http = ['https://bsc.drpc.org']
// arbitrum.rpcUrls.default.http = ['https://arbitrum.drpc.org']

declare global {
  interface Window {
    ethereum?: {
      on: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void;
      removeListener: <event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]) => void;
      request: EIP1193RequestFn<EIP1474Methods>;
    };
  }
}

type Contracts = {
  MGP: `0x${string}`,
  RMGP: `0x${string}`,
  YMGP: `0x${string}`,
  VLMGP: `0x${string}`,
  MASTERMAGPIE: `0x${string}`,
  VLSTREAMREWARDER: `0x${string}`
}

type Coins = 'MGP' | 'RMGP' | 'YMGP' | 'CKP' | 'PNP' | 'EGP' | 'LTP' | 'ETH' | 'BNB'

const parseEther = (value: number, decimals = 18): bigint => BigInt(Math.round((value * Number(10n ** BigInt(decimals))) / Number(1n)))
function formatEther(value: bigint, decimals = 18): number {
  const divisor = 10n ** BigInt(decimals)
  const wholePart = value / divisor
  const fractionalPart = value % divisor
  return fractionalPart === 0n ? Number(wholePart) : Number(`${wholePart}.${fractionalPart.toString().padStart(decimals, '0').replace(/0+$/, '')}`)
}
const formatNumber = (num: number, decimals = 2): string => num >= 1_000_000_000 ? `${(num / 1_000_000_000).toFixed(decimals)}B` : num >= 1_000_000 ? `${(num / 1_000_000).toFixed(decimals)}M` : num >= 1_000 ? `${(num / 1_000).toFixed(decimals)}K` : num.toFixed(decimals);
const formatTime = (seconds: number): string => seconds < 60 ? `${seconds} Seconds` : seconds < 3600 ? `${Math.floor(seconds / 60)} Minutes` : seconds < 86400 ? `${Math.floor(seconds / 3600)} Hours` : `${Math.floor(seconds / 86400)} Days`;

const aprToApy = (apr: number) => (1 + apr / 365) ** 365 - 1

const contractABIs = {
  MGP: erc20Abi,
  RMGP: [{"inputs":[{"internalType":"address","name":"_mgpToken","type":"address"},{"internalType":"address","name":"_ymgpToken","type":"address"},{"internalType":"address","name":"_masterMagpie","type":"address"},{"internalType":"address","name":"_vlMGP","type":"address"},{"internalType":"address","name":"_weth","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotUnlockZero","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"NoLockedTokens","type":"error"},{"inputs":[],"name":"NoSlotsToUnlock","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"SwapRouterNotSet","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rmgpAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"rmgpAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"UnlockStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"slot","type":"uint256"}],"name":"Unlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"MASTER_MAGPIE","outputs":[{"internalType":"contract IMasterMagpie","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MGP_TOKEN","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VL_MGP","outputs":[{"internalType":"contract IVL_MGP","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"addRewardsToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserPendingWithdraws","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserWithdrawable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingWithdraws","outputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"mgpAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"removeRewardsToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewardTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"swapRouter","type":"address"}],"name":"setSwapRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"setYMGP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rmgpAmount","type":"uint256"}],"name":"startUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"swapRouters","outputs":[{"internalType":"contract ISwapRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unsubmittedWithdraws","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ymgpToken","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
  YMGP: [{"inputs":[{"internalType":"address","name":"_rmgpToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotLockZero","type":"error"},{"inputs":[],"name":"CannotUnlockZero","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"ZeroAddress","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Locked","type":"event"},{"anonymous":false,"inputs":[],"name":"NoYieldToClaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"YieldClaimed","type":"event"},{"inputs":[],"name":"RMGP_TOKEN","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lockedBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unclaimedUserYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userClaimedYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
  vlMGP: [{"inputs":[],"name":"AllUnlockSlotOccupied","type":"error"},{"inputs":[],"name":"AlreadyMigrated","type":"error"},{"inputs":[],"name":"BeyondUnlockLength","type":"error"},{"inputs":[],"name":"BeyondUnlockSlotLimit","type":"error"},{"inputs":[],"name":"BurnEventManagerNotSet","type":"error"},{"inputs":[],"name":"BurnEvnentManagerPaused","type":"error"},{"inputs":[],"name":"InvalidAddress","type":"error"},{"inputs":[],"name":"InvalidCoolDownPeriod","type":"error"},{"inputs":[],"name":"IsZeroAddress","type":"error"},{"inputs":[],"name":"MaxSlotCantLowered","type":"error"},{"inputs":[],"name":"MaxSlotShouldNotZero","type":"error"},{"inputs":[],"name":"NotEnoughLockedMPG","type":"error"},{"inputs":[],"name":"NotInCoolDown","type":"error"},{"inputs":[],"name":"PenaltyToNotSet","type":"error"},{"inputs":[],"name":"StillInCoolDown","type":"error"},{"inputs":[],"name":"TransferNotWhiteListed","type":"error"},{"inputs":[],"name":"UnlockSlotOccupied","type":"error"},{"inputs":[],"name":"UnlockedAlready","type":"error"},{"inputs":[],"name":"coolDownInSecCanCauseOverflow","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_coolDownSecs","type":"uint256"}],"name":"CoolDownInSecsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"slotIdx","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mgpamount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"penaltyAmount","type":"uint256"}],"name":"ForceUnLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_maxSlot","type":"uint256"}],"name":"MaxSlotUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"NewLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldMaster","type":"address"},{"indexed":false,"internalType":"address","name":"_newMaster","type":"address"}],"name":"NewMasterChiefUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"penaltyDestination","type":"address"}],"name":"PenaltyDestinationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"penaltyDestination","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PenaltySentTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"slotIdx","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Unlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"uint256","name":"_timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"UnlockStarts","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_eventId","type":"uint256"}],"name":"VlMgpBurn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_for","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"}],"name":"WhitelistSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"burnEventManager","type":"address"}],"name":"burnEventManagerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"referralStorage","type":"address"}],"name":"referralStorageSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"wombatBribeManager","type":"address"}],"name":"wombatBribeManagerSet","type":"event"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MGP","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_masterMagpie","type":"address"},{"internalType":"uint256","name":"_maxSlots","type":"uint256"},{"internalType":"address","name":"_mgp","type":"address"},{"internalType":"uint256","name":"_coolDownInSecs","type":"uint256"}],"name":"__vlMGP_init_","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"burnEventManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_vlmgpAmountToBurn","type":"uint256"},{"internalType":"uint256","name":"_vlmgpBurnEventId","type":"uint256"}],"name":"burnVlmgp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"cancelUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coolDownInSecs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"expectedPenaltyAmount","outputs":[{"internalType":"uint256","name":"penaltyAmount","type":"uint256"},{"internalType":"uint256","name":"amontToUser","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"forceUnLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getFullyUnlock","outputs":[{"internalType":"uint256","name":"unlockedAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getNextAvailableUnlockSlot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getRewardablePercentWAD","outputs":[{"internalType":"uint256","name":"percent","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserAmountInCoolDown","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"n","type":"uint256"}],"name":"getUserNthUnlockSlot","outputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserTotalLocked","outputs":[{"internalType":"uint256","name":"_lockAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserUnlockSlotLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserUnlockingSchedule","outputs":[{"components":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"internalType":"struct ILocker.UserUnlocking[]","name":"slots","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"lockFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"masterMagpie","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSlot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penaltyDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referralStorage","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_coolDownSecs","type":"uint256"}],"name":"setCoolDownInSecs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_masterMagpie","type":"address"}],"name":"setMasterChief","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxSlots","type":"uint256"}],"name":"setMaxSlots","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_burnEventMAnager","type":"address"}],"name":"setMgpBurnEventManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_penaltyDestination","type":"address"}],"name":"setPenaltyDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referralStorage","type":"address"}],"name":"setReferralStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_for","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"setWhitelistForTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_bribeManager","type":"address"}],"name":"setWombatBribeManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountToCoolDown","type":"uint256"}],"name":"startUnlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAmountInCoolDown","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPenalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferPenalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"transferWhitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_slotIndex","type":"uint256"}],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userUnlockings","outputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"amountInCoolDown","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"wombatBribeManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}],
  masterMagpie: [{"inputs":[],"name":"IndexOutOfBound","type":"error"},{"inputs":[],"name":"InvalidStakingToken","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[],"name":"MGPsetAlready","type":"error"},{"inputs":[],"name":"MustBeContract","type":"error"},{"inputs":[],"name":"MustBeContractOrZero","type":"error"},{"inputs":[],"name":"MustNotBeZero","type":"error"},{"inputs":[],"name":"OnlyActivePool","type":"error"},{"inputs":[],"name":"OnlyCompounder","type":"error"},{"inputs":[],"name":"OnlyLocker","type":"error"},{"inputs":[],"name":"OnlyPoolHelper","type":"error"},{"inputs":[],"name":"OnlyPoolManager","type":"error"},{"inputs":[],"name":"OnlyWhiteListedAllocUpdator","type":"error"},{"inputs":[],"name":"PoolExsisted","type":"error"},{"inputs":[],"name":"UnlockAmountExceedsLocked","type":"error"},{"inputs":[],"name":"WithdrawAmountExceedsStaked","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_oldARBRewarder","type":"address"},{"indexed":false,"internalType":"address","name":"_newARBRewarder","type":"address"}],"name":"ARBRewarderSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"rewarder","type":"address"}],"name":"ARBRewarderSetAsQueuer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":true,"internalType":"contract IBaseRewardPool","name":"_rewarder","type":"address"}],"name":"Add","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newCompounder","type":"address"},{"indexed":false,"internalType":"address","name":"_oldCompounder","type":"address"}],"name":"CompounderUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"DepositNotAvailable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"},{"indexed":true,"internalType":"address","name":"_receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isLock","type":"bool"}],"name":"HarvestMGP","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"address[]","name":"_legacyRewarder","type":"address[]"}],"name":"LegacyRewardersSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"bool","name":"_isRewardMGP","type":"bool"}],"name":"LockFreePoolUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_mgp","type":"address"}],"name":"MGPSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_mWomSV","type":"address"},{"indexed":false,"internalType":"address","name":"_oldMWomSV","type":"address"}],"name":"MWomSVpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_account","type":"address"},{"indexed":false,"internalType":"bool","name":"_status","type":"bool"}],"name":"PoolManagerStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"indexed":true,"internalType":"contract IBaseRewardPool","name":"_rewarder","type":"address"}],"name":"Set","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":false,"internalType":"uint256","name":"_oldMgpPerSec","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_newMgpPerSec","type":"uint256"}],"name":"UpdateEmissionRate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_lastRewardTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_lpSupply","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_accMGPPerShare","type":"uint256"}],"name":"UpdatePool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_oldAllocPoint","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_newAllocPoint","type":"uint256"}],"name":"UpdatePoolAlloc","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newVlmgp","type":"address"},{"indexed":false,"internalType":"address","name":"_oldVlmgp","type":"address"}],"name":"VLMGPUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_user","type":"address"},{"indexed":true,"internalType":"address","name":"_stakingToken","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ARBRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"AllocationManagers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"MPGRewardPool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"PoolManagers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_mgp","type":"address"},{"internalType":"uint256","name":"_mgpPerSec","type":"uint256"},{"internalType":"uint256","name":"_startTimestamp","type":"uint256"}],"name":"__MasterMagpie_init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"address","name":"_helper","type":"address"},{"internalType":"bool","name":"_helperNeedsHarvest","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAllocationManager","type":"address"}],"name":"addWhitelistedAllocManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"allPendingLegacyTokens","outputs":[{"internalType":"address[][]","name":"bonusTokenAddresses","type":"address[][]"},{"internalType":"string[][]","name":"bonusTokenSymbols","type":"string[][]"},{"internalType":"uint256[][]","name":"pendingBonusRewards","type":"uint256[][]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"allPendingTokens","outputs":[{"internalType":"uint256","name":"pendingMGP","type":"uint256"},{"internalType":"address[]","name":"bonusTokenAddresses","type":"address[]"},{"internalType":"string[]","name":"bonusTokenSymbols","type":"string[]"},{"internalType":"uint256[]","name":"pendingBonusRewards","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"compounder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"mainRewardToken","type":"address"}],"name":"createRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositMWomSVFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"depositVlMGPFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"getPoolInfo","outputs":[{"internalType":"uint256","name":"emission","type":"uint256"},{"internalType":"uint256","name":"allocpoint","type":"uint256"},{"internalType":"uint256","name":"sizeOfPool","type":"uint256"},{"internalType":"uint256","name":"totalPoint","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"stakingToken","type":"address"}],"name":"getRewarder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"legacyRewarder_deprecated","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"legacyRewarders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mWomSV","outputs":[{"internalType":"contract ILocker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mgp","outputs":[{"internalType":"contract MGP","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mgpPerSec","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"}],"name":"multiclaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"},{"internalType":"address","name":"_account","type":"address"}],"name":"multiclaimFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"},{"internalType":"address","name":"_account","type":"address"}],"name":"multiclaimOnBehalf","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_rewardTokens","type":"address[][]"}],"name":"multiclaimSpec","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"},{"internalType":"address","name":"_rewardToken","type":"address"}],"name":"pendingTokens","outputs":[{"internalType":"uint256","name":"pendingMGP","type":"uint256"},{"internalType":"address","name":"bonusTokenAddress","type":"address"},{"internalType":"string","name":"bonusTokenSymbol","type":"string"},{"internalType":"uint256","name":"pendingBonusToken","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referral","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"registeredToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"removeWhitelistedAllocManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"rewarderBonusTokenInfo","outputs":[{"internalType":"address[]","name":"bonusTokenAddresses","type":"address[]"},{"internalType":"string[]","name":"bonusTokenSymbols","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"address","name":"_helper","type":"address"},{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"bool","name":"_helperNeedsHarvest","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_ARBRewarder","type":"address"}],"name":"setARBRewarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_pools","type":"address[]"}],"name":"setARBRewarderAsQueuer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_compounder","type":"address"}],"name":"setCompounder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"address[][]","name":"_legacyRewarder","type":"address[][]"}],"name":"setLegacyRewarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"bool","name":"_isLockFree","type":"bool"}],"name":"setMGPRewardPools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_mWomSV","type":"address"}],"name":"setMWomSV","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"bool","name":"_allowedManager","type":"bool"}],"name":"setPoolManagerStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referral","type":"address"}],"name":"setReferral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vlmgp","type":"address"}],"name":"setVlmgp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"address","name":"_user","type":"address"}],"name":"stakingInfo","outputs":[{"internalType":"uint256","name":"stakedAmount","type":"uint256"},{"internalType":"uint256","name":"availableAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenToPoolInfo","outputs":[{"internalType":"address","name":"stakingToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardTimestamp","type":"uint256"},{"internalType":"uint256","name":"accMGPPerShare","type":"uint256"},{"internalType":"address","name":"rewarder","type":"address"},{"internalType":"address","name":"helper","type":"address"},{"internalType":"bool","name":"helperNeedsHarvest","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"unClaimedMgp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mgpPerSec","type":"uint256"}],"name":"updateEmissionRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_stakingTokens","type":"address[]"},{"internalType":"uint256[]","name":"_allocPoints","type":"uint256[]"}],"name":"updatePoolsAlloc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rewarder","type":"address"},{"internalType":"address","name":"_manager","type":"address"},{"internalType":"bool","name":"_allowed","type":"bool"}],"name":"updateRewarderManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vlmgp","outputs":[{"internalType":"contract ILocker","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_stakingToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawMWomSVFor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_for","type":"address"}],"name":"withdrawVlMGPFor","outputs":[],"stateMutability":"nonpayable","type":"function"}],
} as const
const contracts: { /*56: Contracts,*/ 42161: Contracts } = {
  // 56: { MGP: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa', RMGP: '0x3534dd212b62d8e0f3282aAa111Bce2c6Ba49963', YMGP: '0x0000000000000000000000000000000000000000', VLMGP: '0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6', MASTERMAGPIE: '0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46', VLSTREAMREWARDER: '0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9' },
  42161: { MGP: '0xa61F74247455A40b01b0559ff6274441FAfa22A3', RMGP: '0xAa4dEb3d1aa7a04627e83Ccf1d59fCB2BD18AC62', YMGP: '0x578AC88A7A9245CE4F86702Bb7857Da7F568369c', VLMGP: '0x536599497Ce6a35FC65C7503232Fec71A84786b9', MASTERMAGPIE: '0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7', VLSTREAMREWARDER: '0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45' }
} as const
const publicClients = {
  1: createPublicClient({ chain: mainnet, transport: http() }),
  56: createPublicClient({ chain: bsc, transport: http() }),
  42161: createPublicClient({ chain: arbitrum, transport: http() })
}
const decimals: Record<Coins, number> = { MGP: 18, RMGP: 18, YMGP: 18, CKP: 18, PNP: 18, EGP: 18, LTP: 18, ETH: 18, BNB: 18 }
function useContractState<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  T extends ReadContractReturnType<abi, functionName, args> | null
>(defaultValue: T, client: (typeof publicClients)[keyof typeof publicClients], args: ReadContractParameters<abi, functionName, args>, deps: unknown[]) {
  // @ts-expect-error:
  const [state, setState] = useState<T extends null ? ReadContractReturnType<abi, functionName, args> | null : ReadContractReturnType<abi, functionName, args>>(defaultValue)
  // @ts-expect-error:
  const update = () => client.readContract(args).then(setState)
  useEffect(() => { update() }, [client, ...deps])
  return [state, update] as const
}

const App = () => {
  const [mode, setMode] = useState<'deploy' | 'deposit' | 'convert' | 'lock' | 'unlock' | 'redeem'>('deposit')
  const [showDiagram, setShowDiagram] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [approveInfinity, setApproveInfinity] = useState(false)
  const [sendAmount, setSendAmount] = useState(parseEther(100));
  const [prices, setPrices] = useState<Record<Coins, number>>({ MGP: 0, RMGP: 0, YMGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, ETH: 0, BNB: 0 })

  // Wallet
  const [walletClient, setWalletClient] = useState<WalletClient<CustomTransport> | undefined>()
  const [chain, setChain] = useState<42161>(42161)
  const [account, setAccount] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [ens, setENS] = useState<string | null>(null)
  useEffect(() => {publicClients[1].getEnsName({ address: account }).then(setENS)}, [account])

  // Deploy Contract
  const [abi, setABI] = useState<string>()
  const [constructorArgs, setConstructorArgs] = useState<{ internalType: string, name: string, type: string, value?: string }[]>([])
  const [bytecode, setBytecode] = useState<`0x${string}`>()

  // Allowances
  const [mgpAllowance, updateMGPAllowance] = useContractState(0n, publicClients[chain], { abi: contractABIs.MGP, address: contracts[chain].MGP, functionName: 'allowance', args: [account, contracts[chain].RMGP] }, [account])
  const [rmgpAllowance, updateRMGPAllowance] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'allowance', args: [account, contracts[chain].YMGP] }, [account])

  // Balances
  const [mgpBalance, updateMGPBalance] = useContractState(0n, publicClients[chain], { abi: contractABIs.MGP, address: contracts[chain].MGP, functionName: 'balanceOf', args: [account] }, [account])
  const [rmgpBalance, updateRMGPBalance] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'balanceOf', args: [account] }, [account])
  const [ymgpBalance, updateYMGPBalance] = useContractState(0n, publicClients[chain], { abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'balanceOf', args: [account] }, [account])
  const [ymgpHoldings, updateYMGPHoldings] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'balanceOf', args: [contracts[chain].YMGP] }, [])

  // Locked
  const [reefiLockedMGP, updateReefiLockedMGP] = useContractState(0n, publicClients[chain], { abi: contractABIs.vlMGP, address: contracts[chain].VLMGP, functionName: 'getUserTotalLocked', args: [contracts[chain].RMGP] }, [])
  const [totalLockedMGP, updateTotalLockedMGP] = useContractState(0n, publicClients[chain], { abi: contractABIs.vlMGP, address: contracts[chain].VLMGP, functionName: 'totalLocked' }, [])
  const [totalLockedYMGP, updateTotalLockedYMGP] = useContractState(0n, publicClients[chain], { abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'totalLocked' }, [])
  const [userLockedYMGP, updateUserLockedYMGP] = useContractState(0n, publicClients[chain], { abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'lockedBalances', args: [account] }, [account])

  // Supply
  const [mgpSupply, updateMGPSupply] = useContractState(0n, publicClients[chain], { abi: contractABIs.MGP, address: contracts[chain].MGP, functionName: 'totalSupply' }, [])
  const [ymgpSupply, updateYMGPSupply] = useContractState(0n, publicClients[chain], { abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'totalSupply' }, [])
  const [rmgpSupply, updateRMGPSupply] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'totalSupply' }, [])
  
  // Withdraws
  const [userPendingWithdraws, updateUserPendingWithdraws] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'getUserPendingWithdraws', args: [account] }, [account])
  const [unsubmittedWithdraws, updateUnsubmittedWithdraws] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'unsubmittedWithdraws' }, [])
  const [userWithdrawable, updateUserWithdrawable] = useContractState(0n, publicClients[chain], { abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'getUserWithdrawable', account }, [account])
  const [unlockSchedule, updateUnlockSchedule] = useContractState(null, publicClients[chain], { abi: contractABIs.vlMGP, address: contracts[chain].VLMGP, functionName: 'getUserUnlockingSchedule', args: [contracts[chain].RMGP] }, [])

  // Pegs
  const mgpRmgpRatio = useMemo(() => { return rmgpSupply === 0n ? 1 : (Number(reefiLockedMGP) / Number(rmgpSupply)) }, [rmgpSupply, reefiLockedMGP])
  const ymgpRmgpRatio = 1

  // Yield
  const [mgpAPR, setMGPAPR] = useState(0)
  const [pendingRewards, setPendingRewards] = useState<Record<Coins, { address: `0x${string}`, rewards: bigint }> | undefined>()
  const [unclaimedUserYield, updateUnclaimedUserYield] = useContractState(0n, publicClients[chain], { abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'unclaimedUserYield', account }, [account])
  const [compoundRMGPGas, setCompoundRMGPGas] = useState(0n)
  const uncompoundedMGPYield = useMemo(() => {
    return pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0
  }, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[chain].chain.nativeCurrency.symbol])*prices[publicClients[chain].chain.nativeCurrency.symbol], [chain, compoundRMGPGas, prices])
  const updatePendingRewards = async () => {
    publicClients[chain].readContract({ abi: contractABIs.masterMagpie, address: contracts[chain].MASTERMAGPIE, functionName: 'allPendingTokens', args: [contracts[chain].VLMGP, contracts[chain].RMGP] }).then(data => {
      const [pendingMGP, bonusTokenAddresses, bonusTokenSymbols, pendingBonusRewards] = data
      const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts[chain].MGP, rewards: pendingMGP } }
      for (const i in bonusTokenSymbols) newPendingRewards[bonusTokenSymbols[i].replace('Bridged ', '').toUpperCase()] = { rewards: pendingBonusRewards[i], address: bonusTokenAddresses[i] };
      setPendingRewards(newPendingRewards)
    })
  }

  useEffect(() => {
    if (window.ethereum) connectWallet();
    fetch('https://api.magpiexyz.io/getalltokenprice').then(res => res.json().then((body: { data: { AllPrice: typeof prices }}) => setPrices(body.data.AllPrice)))
  }, [])

  useEffect(() => {
    window.ethereum?.request({ method: 'eth_accounts', params: [] }).then(accounts => { if (accounts) connectWallet() })
    updatePendingRewards()
    walletClient?.switchChain({ id: chain })
    fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].VLSTREAMREWARDER}`).then(res => res.json()).then(body => {setMGPAPR((body as { data: { rewardTokenInfo: { apr: number }[] }}).data.rewardTokenInfo.reduce((acc, token) => {return { ...token, apr: acc.apr+token.apr }}).apr)})
  }, [chain])

  useEffect(() => {
    if (!account) return
    estimateCompoundRMGPGas().then(setCompoundRMGPGas)
  }, [chain, account])

  useEffect(() => {
    for (const item of JSON.parse(abi ?? '[]')) {
      if (item.type === 'constructor') {
        setConstructorArgs((item.inputs as { internalType: string, name: string, type: string, value?: string }[]).map(arg => {
          const contract = arg.name.toUpperCase().replace('_', '').replace('TOKEN', '') as keyof Contracts
          return { ...arg, value: Object.keys(contracts[chain]).includes(contract) ? contracts[chain][contract] : arg.value }
        }))
      }
    }
  }, [chain, abi])

  const connectWallet = async () => {
    if (!window.ethereum) return alert('MetaMask not found. Please install MetaMask to use this application.');
    setIsConnecting(true);
    const client = createWalletClient({ chain: arbitrum, transport: custom(window.ethereum)})
    setWalletClient(client)
    setAccount((await client.requestAddresses())[0]);
    setIsConnecting(false);
    return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
  }

  const handleAccountsChanged = async (accounts: `0x${string}`[]) => setAccount(accounts[0]);

  const approve = async () => {
    if (!walletClient) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    if (mode === 'deposit') {
      const amount = approveInfinity ? 2n ** 256n - 1n : sendAmount;
      await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.MGP, address: contracts[chain].MGP, account, functionName: 'approve', args: [contracts[chain].RMGP, amount] })).request)
      updateMGPAllowance()
    } else if (mode === 'convert') {
      const amount = approveInfinity ? 2n ** 256n - 1n : sendAmount;
      await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, account, functionName: 'approve', args: [contracts[chain].YMGP, amount] })).request)
      updateRMGPAllowance()
    }
  }

  const depositMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    if (mgpAllowance < sendAmount) return alert('Allowance too low')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'deposit', account, args: [sendAmount] })).request)
    updateMGPBalance()
    updateRMGPBalance()
    updateMGPSupply()
    updateRMGPSupply()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const depositRMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    if (rmgpAllowance < sendAmount) return alert('Allowance too low')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'deposit', account, args: [sendAmount] })).request)
    updateRMGPBalance()
    updateYMGPBalance()
    updateRMGPSupply()
    updateYMGPSupply()
    updateYMGPHoldings()
  }

  const lockYMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'lock', account, args: [sendAmount] })).request)
    updateYMGPSupply()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const unlockYMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'unlock', account, args: [sendAmount] })).request)
    updateYMGPSupply()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const redeemRMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'startUnlock', account, args: [sendAmount] })).request)
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

  const withdrawMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'unlock', account })).request)
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'withdraw', account })).request)
    updateMGPBalance()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
  }

  const compoundRMGP = async () => {
    if (!walletClient) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'claim', account })).request)
    updatePendingRewards()
    updateUnclaimedUserYield()
    updateRMGPSupply()
    updateTotalLockedMGP()
  }

  const claimYMGPRewards = async () => {
    if (!walletClient) return alert('Wallet not connected')
    await walletClient.writeContract((await publicClients[chain].simulateContract({ abi: contractABIs.YMGP, address: contracts[chain].YMGP, functionName: 'claim', account })).request)
    updateUnclaimedUserYield()
  }

  const estimateCompoundRMGPGas = async () => {
    const gasPrice: bigint = await publicClients[chain].getGasPrice()
    let gas: bigint
    try {
      gas = await publicClients[chain].estimateContractGas({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, functionName: 'deposit', account, args: [sendAmount] })
    } catch(e) {
      gas = 0n
    }
    return gas*gasPrice
  }

  const deployContract = async () => {
    if (!walletClient) return alert('Wallet not connected')
    if (!account) return alert('No address found')
    if (!abi) return alert('ABI not set')
    if (!bytecode) return alert('Bytecode not set')
    const args = []
    for (const arg of constructorArgs) {
      if (!('value' in arg) || arg.value?.length === 0) return alert(`Constructor argument ${arg.name} is missing`)
      args.push(arg.value)
    }
    alert(`Contract Deployed: ${await walletClient.deployContract({ abi: JSON.parse(abi), account, bytecode, args, chain: walletClient.chain })}`)
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
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">MGP: {formatEther(mgpBalance, decimals.MGP).toFixed(4)}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">RMGP: {formatEther(rmgpBalance, decimals.RMGP).toFixed(4)}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">YMGP: {formatEther(ymgpBalance, decimals.YMGP).toFixed(4)}</div>
              <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Locked YMGP: {formatEther(userLockedYMGP, decimals.YMGP).toFixed(4)}</div>
              <div className="bg-green-600/20 text-green-400 rounded-lg px-3 py-2 text-sm">{ens ?? `${account.slice(0, 6)}...${account.slice(-4)}`}</div>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" value={chain} onChange={e => setChain(Number(e.target.value) as 42161)}>
                <option value="56" disabled>BSC</option>
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
                    <h2 className="text-2xl font-bold mt-2">${prices.MGP.toFixed(6)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 col-span-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{formatNumber(formatEther(mgpSupply, decimals.MGP))}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Locked</p>
                    <p className="font-medium">{formatNumber(Math.round(formatEther(totalLockedMGP, decimals.MGP)))} MGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Lock Rate</p>
                    <p className="font-medium">{Math.round(10_000*Number(totalLockedMGP)/Number(mgpSupply))/100}%</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">FDV</p>
                    <p className="font-medium">${formatNumber((prices.MGP*formatEther(mgpSupply, decimals.MGP)))}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">$MGP is the underlying asset all derivatives rely on.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="grid grid-cols-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                      <p className="font-bold text-lg">$RMGP</p>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">${(prices.MGP*mgpRmgpRatio).toFixed(6)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 col-span-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{formatNumber(formatEther(rmgpSupply, decimals.RMGP))} rMGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">TVL</p>
                    <p className="font-medium">{formatNumber(formatEther(reefiLockedMGP, decimals.MGP), 3)} MGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">1 RMGP</p>
                    <p className="font-medium">{mgpRmgpRatio.toFixed(6)} MGP</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">$RMGP earns auto compounding yield from locked $MGP, while remaining liquid. $RMGP can be converted back to $MGP.</p>
              <ul className="list-disc list-inside text-gray-300 text-xs mt-2">
                <li><strong>Liquid</strong>: Tradable token representing locked $MGP</li>
                <li><strong>Auto Compounding</strong>: Yield is automatically reinvested</li>
                <li><strong>Pegged</strong>: $RMGP is pegged to $MGP with a 10% depeg limit</li>
                <li><strong>Redeemable</strong>: $RMGP can be redeemed for $MGP natively</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="grid grid-cols-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2">Y</div>
                      <p className="font-bold text-lg">$YMGP</p>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">${(prices.MGP*mgpRmgpRatio*ymgpRmgpRatio).toFixed(6)}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 col-span-2">
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Supply</p>
                    <p className="font-medium">{formatNumber(formatEther(ymgpSupply+totalLockedYMGP, decimals.YMGP))} YMGP</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Lock Rate</p>
                    <p className="font-medium">{Math.round(10_000*Number(totalLockedYMGP)/Number(ymgpSupply+totalLockedYMGP))/100}%</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2">
                    <p className="text-gray-400 text-xs">Peg</p>
                    <p className="font-medium">{Math.round(ymgpRmgpRatio*100)}%</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">$YMGP is backed 1:1 by $RMGP but cannot be converted back to $RMGP. 5% of protocol yield and withdrawals {/*and 100% of $RMGP from $vMGP deposits */}are distributed to locked $YMGP paid in $RMGP.</p>
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
                  <p className="font-medium">{Math.round(coins.vMGP.supply/100)/10}K YMGP</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <p className="text-gray-400 text-xs">Peg</p>
                  <p className="font-medium">{Math.round(coins.vMGP.peg*100)}%</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-2">$vMGP is minted 1:1 for $RMGP but cannot be converted back to $YMGP. $vMGP controls all of REEFI's voting power for Magpie governance proposals but earns no yield.</p>
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
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'deposit' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('deposit')}>Deposit MGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'convert' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('convert')}>Convert RMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'lock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('lock')}>Lock YMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'unlock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('unlock')}>Unlock YMGP</button>
                <button type="button" className={`px-4 py-2 rounded-md transition-colors ${mode === 'redeem' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setMode('redeem')}>Withdraw RMGP</button>
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
                      newArgs[i].value = e.target.value
                      setConstructorArgs(newArgs)
                    }} />
                  </div>)}
                </div>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={deployContract}>Deploy Contract</button>
                <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-4" onClick={async () => {
                  const { request } = await publicClients[chain].simulateContract({ abi: contractABIs.RMGP, address: contracts[chain].RMGP, account, functionName: 'setYMGP', args: [contracts[chain].YMGP] })
                  await walletClient?.writeContract(request)
                }}>Set YMGP</button>
              </div>}

              {mode === 'deposit' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Deposit MGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(mgpBalance, decimals.MGP)} MGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(mgpBalance)}>MAX</button>
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
                      <h3 className="text-md font-medium">Receive RMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(rmgpBalance, decimals.RMGP)} RMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount) / mgpRmgpRatio} readOnly/>
                      <div className="flex items-center">
                        <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                          <span>RMGP</span>
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
                  {mgpAllowance < sendAmount ? <>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={approve}>Approve MGP</button>
                    <div className="flex items-center mt-2">
                      <input id="approve-infinity" type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
                      <label htmlFor="approve-infinity" className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
                    </div>
                  </> : <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositMGP}>Get RMGP</button>}
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">$MGP can be converted to $RMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards and half the withdrawal fees.</p>
                    </div>
                  </div>
                </div>
              </>}

              {mode === 'convert' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Convert RMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(rmgpBalance, decimals.RMGP)} RMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))}/>
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(rmgpBalance)}>MAX</button>
                        <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">R</div>
                          <span>RMGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-2"><div className="inline-block p-1 bg-gray-700 rounded-full"><ArrowDown size={20} className="text-gray-400" /></div></div>
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-md font-medium">Receive YMGP</h3>
                        <div className="text-sm text-gray-400">Balance: {formatEther(ymgpBalance, decimals.YMGP)} YMGP</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between mb-8">
                        <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)/ymgpRmgpRatio} readOnly/>
                        <div className="flex items-center">
                          <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">Y</div>
                            <span>YMGP</span>
                          </div>
                        </div>
                      </div>
                      {rmgpAllowance < sendAmount ? <>
                        <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={approve}>Approve RMGP</button>
                        <div className="flex items-center mt-2">
                          <input id="approve-infinity" type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
                          <label htmlFor="approve-infinity" className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
                        </div>
                      </> : <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositRMGP}>Get YMGP</button>}
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
                      <p className="text-gray-300 mt-1">$YMGP is backed 1:1 by $RMGP. This process can not be undone.</p>
                    </div>
                  </div>
                </div>
              </>}

              {mode === 'redeem' && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Redeem RMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(rmgpBalance, decimals.RMGP)} RMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(rmgpBalance)}>MAX</button>
                        <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
                          <span>RMGP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center my-2"><div className="inline-block p-1 bg-gray-700 rounded-full"><ArrowDown size={20} className="text-gray-400" /></div></div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Receive MGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(mgpBalance, decimals.MGP)} MGP</div>
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
                      <span>{mgpRmgpRatio*0.9} MGP to RMGP</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={redeemRMGP}>Redeem RMGP</button>
                  {userPendingWithdraws > 0n ? <>
                    <h3 className="text-md font-medium mt-4">Pending Withdraws</h3>
                    <p>{formatEther(userPendingWithdraws, decimals.MGP)} MGP</p>
                    {unlockSchedule ? <p>Unlock available in: {formatTime(Number(unlockSchedule[0].endTime)-(+new Date()/1000))} to {formatTime((unsubmittedWithdraws ? Number(unlockSchedule[unlockSchedule.length-1].endTime) + 60*60*24*60 : Number(unlockSchedule[unlockSchedule.length-1].endTime))-(+new Date()/1000))}</p> : <p>N/A</p>}
                  </> : ''}
                  {userWithdrawable > 0n ? <>
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
                      <p className="text-gray-300 mt-1">$RMGP can be redeemed for the underlying $MGP through the withdrawal queue for a 10% fee or swapped instantly at market rate.</p>
                      <p className="text-gray-300 mt-1">The withdrawal queue is processed directly through Magpie, therefore native withdrawals take at minimum 60 days.</p>
                      <p className="text-gray-300 mt-1">Only 6 withdrawals can be processed through Magpie at once. If all slots are used, withdrawals will be added to the queue once a new slot is made available making worst case withdrawal time 120 days.</p>
                      <p className="text-gray-300 mt-1">With the 10% withdrawal fee, $RMGP depegs under 90% of the underlying value always recover as they can be arbitraged by people willing to wait for withdrawals to be processed.</p>
                      <p className="text-gray-300 mt-1">Half of the withdrawal fee (5% of withdrawal) is redistributed to $YMGP holders as yield, with the other half sent to the Reefi treasury.</p>
                    </div>
                  </div>
                </div>
              </>}

              {(mode === 'lock' || mode === 'unlock') && <>
                <div className="bg-gray-700/50 p-5 rounded-lg">
                  {mode === 'lock' ? <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-md font-medium">Lock YMGP</h3>
                        <div className="text-sm text-gray-400">Balance: {formatEther(ymgpBalance, decimals.YMGP)} YMGP</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                        <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                        <div className="flex items-center space-x-2">
                          <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(ymgpBalance)}>MAX</button>
                          <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">Y</div>
                            <span>YMGP</span>
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
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={lockYMGP}>Lock YMGP</button>
                  </> : <>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-md font-medium">Unlock YMGP</h3>
                      <div className="text-sm text-gray-400">Balance: {formatEther(ymgpBalance, decimals.YMGP)} YMGP</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between mb-4">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(ymgpBalance)}>MAX</button>
                        <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">Y</div>
                          <span>YMGP</span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={unlockYMGP}>Unlock YMGP</button>
                  </>}
                </div>
                <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div>
                      <span className="font-medium text-indigo-300">About</span>
                      <p className="text-gray-300 mt-1">$YMGP can be locked to earn additional yield paid in $RMGP. 5% of protocol yield and half of $RMGP withdrawal fees are paid to $YMGP lockers.</p>
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
                <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={compoundRMGP}>Compound RMGP Yield (Get ~{formatNumber(0.01*uncompoundedMGPYield*(1/mgpRmgpRatio), 6)} RMGP)</button>
              </div>
              <div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Unclaimed Rewards</p>
                  <p className="font-medium text-lg">{formatEther(unclaimedUserYield, decimals.YMGP)} RMGP</p>
                  <p className="font-small text-xs">Total: {formatEther(ymgpHoldings-ymgpSupply-totalLockedYMGP, decimals.YMGP)} RMGP</p>
                </div>
                <p className="text-gray-400 text-xs mt-2">Locked $YMGP earns additional yield from the underlying $vlMGP and from 5% of $RMGP withdrawal.</p>
                <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={claimYMGPRewards}>Claim YMGP Rewards</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
            <h2 className="text-lg font-bold mb-2">Contract Addresses</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {(Object.keys(contracts[chain]) as (keyof Contracts)[]).map(contract => <div key={contract}>
                <span className="font-semibold">{contract}:</span>
                <a href={`${publicClients[chain].chain.blockExplorers.default.url}/address/${contracts[chain][contract]}`} className="ml-2 break-all text-green-300">{contracts[chain][contract]}</a>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
