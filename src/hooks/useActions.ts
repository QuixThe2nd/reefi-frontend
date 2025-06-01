import { useApprove } from "./actions/useApprove";
import { useBuyMGP } from "./actions/useBuyMGP";
import { useBuyRMGP } from "./actions/useBuyRMGP";
import { useBuyYMGP } from "./actions/useBuyYMGP";
import { useClaimYMGPRewards } from "./actions/useClaimYMGPRewards";
import { useCompoundRMGP } from "./actions/useCompoundRMGP";
import { useConvertMGP } from "./actions/useConvertMGP";
import { useDepositMGP } from "./actions/useDepositMGP";
import { useDepositRMGP } from "./actions/useDepositRMGP";
import { useLockYMGP } from "./actions/useLockYMGP";
import { useMintWETH } from "./actions/useMintWETH";
import { useRedeemRMGP } from "./actions/useRedeemRMGP";
import { useSellRMGP } from "./actions/useSellRMGP";
import { useSupplyLiquidity } from "./actions/useSupplyLiquidity";
import { useSwap } from "./actions/useSwap";
import { useUnlockYMGP } from "./actions/useUnlockYMGP";
import { useWithdrawMGP } from "./actions/useWithdrawMGP";

import { Coins } from "../config/contracts";
import { Pages } from "../App";
import { UseAllowances } from "./useAllowances";
import { UseAmounts } from "./useAmounts";
import { UseBalances } from "./useBalances";
import { UseContracts } from "./useContracts";
import { UseLocked } from "./useLocked";
import { UseRewards } from "./useRewards";
import { UseSupplies } from "./useSupplies";
import { UseWallet } from "./useWallet";
import { UseWithdraws } from "./useWithdraws";

interface Properties<W extends UseWallet> {
  page: Pages;
  setError: (_message: string) => void;
  setNotification: (_message: string) => void;
  wallet: W;
  balances: UseBalances;
  allowances: UseAllowances;
  supplies: UseSupplies;
  writeContracts: UseContracts<W["clients"]>;
  locked: UseLocked;
  amounts: UseAmounts;
  rewards: UseRewards;
  withdraws: UseWithdraws;
}

export interface UseActions {
  approve: (_contract: "rMGP" | "yMGP" | "cMGP" | "ODOSRouter", _coin: Coins, _infinity: boolean) => void;
  depositMGP: () => void;
  buyRMGP: () => void;
  buyYMGP: () => void;
  convertMGP: () => void;
  buyMGP: () => void;
  depositRMGP: () => void;
  lockYMGP: () => void;
  unlockYMGP: () => void;
  redeemRMGP: () => void;
  withdrawMGP: () => void;
  compoundRMGP: () => void;
  claimYMGPRewards: () => void;
  supplyLiquidity: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  mintWETH: () => void;
  sellYMGP: () => void;
}

export const useActions = <W extends UseWallet>({ setError, setNotification, wallet, balances, allowances, supplies, writeContracts, locked, amounts, withdraws, rewards }: Properties<W>): UseActions => {
  const approve = useApprove({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, writeContracts });
  const depositMGP = useDepositMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, supplies, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, writeContracts });
  const buyRMGP = useBuyRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });
  const sellYMGP = useSellRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });
  const buyYMGP = useBuyYMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });
  const convertMGP = useConvertMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });
  const buyMGP = useBuyMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });
  const depositRMGP = useDepositRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, supplies, updateYMGPHoldings: balances.updateYMGPHoldings, writeContracts });
  const lockYMGP = useLockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateTotalLockedYMGP: locked.updateMGP, updateUserLockedYMGP: locked.updateUserYMGP, writeContracts });
  const unlockYMGP = useUnlockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateTotalLockedYMGP: locked.updateMGP, updateUserLockedYMGP: locked.updateUserYMGP, writeContracts });
  const redeemRMGP = useRedeemRMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, updateUnlockSchedule: withdraws.updateUnlockSchedule, updateUnsubmittedWithdraws: withdraws.updateUnsubmittedWithdraws, updateUserPendingWithdraws: withdraws.updateUserPendingWithdraws, updateUserWithdrawable: withdraws.updateUserWithdrawable, writeContracts });
  const withdrawMGP = useWithdrawMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateUnsubmittedWithdraws: withdraws.updateUnsubmittedWithdraws, updateUserPendingWithdraws: withdraws.updateUserPendingWithdraws, updateUserWithdrawable: withdraws.updateUserWithdrawable, writeContracts });
  const compoundRMGP = useCompoundRMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, supplies, updatePendingRewards: rewards.updatePendingRewards, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, writeContracts });
  const claimYMGPRewards = useClaimYMGPRewards({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, writeContracts });
  const supplyLiquidity = useSupplyLiquidity({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, mgpLPAmount: amounts.mgpLP, rmgpLPAmount: amounts.rmgpLP, setConnectRequired: wallet.setConnectRequired, writeContracts, ymgpLPAmount: amounts.ymgpLP });
  const swap = useSwap({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, setNotification });
  const mintWETH = useMintWETH({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });

  return { approve, buyMGP, buyRMGP, buyYMGP, claimYMGPRewards, compoundRMGP, convertMGP, depositMGP, depositRMGP, lockYMGP, mintWETH, redeemRMGP, sellYMGP, supplyLiquidity, swap, unlockYMGP, withdrawMGP };
};
