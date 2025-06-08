import { useAllowances } from "./useAllowances";
import { useAmounts } from "./useAmounts";
import { useApprove } from "../hooks/actions/useApprove";
import { useBalances } from "./useBalances";
import { useClaimYMGPRewards } from "../hooks/actions/useClaimYMGPRewards";
import { useCompoundRMGP } from "../hooks/actions/useCompoundRMGP";
import { useContracts } from "./useContracts";
import { useConvertMGP } from "../hooks/actions/useConvertMGP";
import { useCurveBuy } from "../hooks/actions/useCurveBuy";
import { useDepositMGP } from "../hooks/actions/useDepositMGP";
import { useDepositRMGP } from "../hooks/actions/useDepositRMGP";
import { useLockYMGP } from "../hooks/actions/useLockYMGP";
import { useMintWETH } from "../hooks/actions/useMintWETH";
import { useRedeemRMGP } from "../hooks/actions/useRedeemRMGP";
import { useSupplies } from "./useSupplies";
import { useSupplyLiquidity } from "../hooks/actions/useSupplyLiquidity";
import { useSwap } from "../hooks/actions/useSwap";
import { useUnlockVLMGP } from "../hooks/actions/useUnlockVLMGP";
import { useUnlockYMGP } from "../hooks/actions/useUnlockYMGP";
import { useWallet } from "./useWallet";
import { useWithdrawMGP } from "../hooks/actions/useWithdrawMGP";

interface Props {
  wallet: ReturnType<typeof useWallet>[0];
  updateWallet: ReturnType<typeof useWallet>[1];
  updateBalances: ReturnType<typeof useBalances>[1];
  updateSupplies: ReturnType<typeof useSupplies>[1];
  amounts: ReturnType<typeof useAmounts>[0];
  allowances: ReturnType<typeof useAllowances>[0];
  updateAllowances: ReturnType<typeof useAllowances>[1];
  contracts: ReturnType<typeof useContracts>;
  setError: (_message: string) => void;
  setNotification: (_message: string) => void;
}

export const useActions = ({ wallet, updateWallet, updateBalances, updateSupplies, amounts, allowances, updateAllowances, contracts, setError, setNotification }: Props) => ({
  approve: useApprove({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, updateAllowances, writeContracts: contracts }),
  depositMGP: useDepositMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, writeContracts: contracts }),
  curveBuy: useCurveBuy({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, writeContracts: contracts }),
  convertMGP: useConvertMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, updateBalances, writeContracts: contracts }),
  depositRMGP: useDepositRMGP({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, updateBalances, updateSupplies, writeContracts: contracts }),
  lockYMGP: useLockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, updateSupplies, updateBalances, writeContracts: contracts }),
  unlockYMGP: useUnlockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, updateSupplies, updateBalances, writeContracts: contracts }),
  redeemRMGP: useRedeemRMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, updateBalances, updateSupplies, writeContracts: contracts }),
  withdrawMGP: useWithdrawMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: updateWallet.setConnectRequired, updateBalances, writeContracts: contracts }),
  compoundRMGP: useCompoundRMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: updateWallet.setConnectRequired, updateBalances, updateSupplies, writeContracts: contracts }),
  claimYMGPRewards: useClaimYMGPRewards({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: updateWallet.setConnectRequired, writeContracts: contracts }),
  supplyLiquidity: useSupplyLiquidity({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, mgpLPAmount: amounts.lp.MGP, rmgpLPAmount: amounts.lp.wstMGP, setConnectRequired: updateWallet.setConnectRequired, updateBalances, writeContracts: contracts, ymgpLPAmount: amounts.lp.yMGP }),
  swap: useSwap({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, setNotification }),
  mintWETH: useMintWETH({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, setError, writeContracts: contracts }),
  unlockVLMGP: useUnlockVLMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, send: amounts.send, setConnectRequired: updateWallet.setConnectRequired, writeContracts: contracts })
});
