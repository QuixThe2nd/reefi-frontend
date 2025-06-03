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
  setError: (_message: string) => void;
  setNotification: (_message: string) => void;
  wallet: W;
  updateBalances: UseBalances["updateBalances"];
  allowances: UseAllowances["allowances"];
  updateAllowances: UseAllowances["updateAllowances"];
  updateSupplies: UseSupplies["updateSupplies"];
  writeContracts: UseContracts;
  updateLocked: UseLocked["updateLocked"];
  amounts: UseAmounts["amounts"];
  updateRewards: UseRewards["updateRewards"];
  updateWithdraws: UseWithdraws["updateWithdraws"];
}

export interface UseActions {
  approve: (_contract: "rMGP" | "yMGP" | "cMGP" | "ODOSRouter", _coin: Coins, _infinity: boolean) => Promise<void>;
  depositMGP: () => Promise<void>;
  buyRMGP: () => Promise<void>;
  buyYMGP: () => Promise<void>;
  convertMGP: () => Promise<void>;
  buyMGP: () => Promise<void>;
  depositRMGP: () => Promise<void>;
  lockYMGP: () => Promise<void>;
  unlockYMGP: () => Promise<void>;
  redeemRMGP: () => Promise<void>;
  withdrawMGP: () => Promise<void>;
  compoundRMGP: () => Promise<void>;
  claimYMGPRewards: () => Promise<void>;
  supplyLiquidity: () => Promise<void>;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => Promise<void>;
  mintWETH: () => Promise<void>;
  sellYMGP: () => Promise<void>;
}

export const useActions = <W extends UseWallet>({ setError, setNotification, wallet, updateBalances, allowances, updateAllowances, updateSupplies, writeContracts, updateLocked, amounts, updateRewards, updateWithdraws }: Properties<W>): UseActions => {
  const approve = useApprove({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, updateAllowances, writeContracts });
  const depositMGP = useDepositMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, updateReefiLockedMGP: updateLocked.reefiMGP, updateSupplies, updateTotalLockedMGP: () => {
    updateLocked.MGP.all();
  }, writeContracts });
  const buyRMGP = useBuyRMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, writeContracts });
  const sellYMGP = useSellRMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, writeContracts });
  const buyYMGP = useBuyYMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, writeContracts });
  const convertMGP = useConvertMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, writeContracts });
  const buyMGP = useBuyMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, writeContracts });
  const depositRMGP = useDepositRMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, updateBalances, updateSupplies, updateYMGPHoldings: updateBalances.ymgpHoldings, writeContracts });
  const lockYMGP = useLockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, updateSupplies, updateTotalLockedYMGP: updateLocked.yMGP, updateUserLockedYMGP: updateLocked.userYMGP, writeContracts });
  const unlockYMGP = useUnlockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, updateSupplies, updateTotalLockedYMGP: updateLocked.yMGP, updateUserLockedYMGP: updateLocked.userYMGP, writeContracts });
  const redeemRMGP = useRedeemRMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, updateBalances, updateReefiLockedMGP: updateLocked.reefiMGP, updateSupplies, updateTotalLockedMGP: () => {
    updateLocked.MGP[56]();
    updateLocked.MGP[42_161]();
  }, updateUnclaimedUserYield: updateRewards.unclaimedUserYield, updateUnlockSchedule: updateWithdraws.unlockSchedule, updateUnsubmittedWithdraws: updateWithdraws.unsubmitted, updateUserPendingWithdraws: updateWithdraws.userPending, updateUserWithdrawable: updateWithdraws.userWithdrawable, writeContracts });
  const withdrawMGP = useWithdrawMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateBalances, updateUnsubmittedWithdraws: updateWithdraws.unsubmitted, updateUserPendingWithdraws: updateWithdraws.userPending, updateUserWithdrawable: updateWithdraws.userWithdrawable, writeContracts });
  const compoundRMGP = useCompoundRMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateBalances, updatePendingRewards: updateRewards.pendingRewards, updateReefiLockedMGP: updateLocked.reefiMGP, updateSupplies, updateTotalLockedMGP: () => {
    updateLocked.MGP[56]();
    updateLocked.MGP[42_161]();
  }, updateUnclaimedUserYield: updateRewards.unclaimedUserYield, writeContracts });
  const claimYMGPRewards = useClaimYMGPRewards({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateUnclaimedUserYield: updateRewards.unclaimedUserYield, writeContracts });
  const supplyLiquidity = useSupplyLiquidity({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, mgpLPAmount: amounts.lp.MGP, rmgpLPAmount: amounts.lp.rMGP, setConnectRequired: wallet.setConnectRequired, updateBalances, writeContracts, ymgpLPAmount: amounts.lp.yMGP });
  const swap = useSwap({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, setNotification });
  const mintWETH = useMintWETH({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts });

  return { approve, buyMGP, buyRMGP, buyYMGP, claimYMGPRewards, compoundRMGP, convertMGP, depositMGP, depositRMGP, lockYMGP, mintWETH, redeemRMGP, sellYMGP, supplyLiquidity, swap, unlockYMGP, withdrawMGP };
};
