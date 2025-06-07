import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useAsyncReducer } from "../hooks/useAsyncReducer";
import { useEffect } from "react";
import { useWallet } from "./useWallet";

export const useExchangeRates = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [exchangeRates, updateExchangeRates] = useAsyncReducer<{ mgpRMGP: number; mgpYMGP: number; rmgpYMGP: number; rmgpMGP: number; ymgpRMGP: number; ymgpMGP: number; ymgpVMGP: number }>(async () => {
    const [mgpRMGP, mgpYMGP, rmgpMGP, rmgpYMGP, ymgpMGP, ymgpRMGP, ymgpVMGP] = await Promise.all([
      Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)),
      Promise.resolve(0)
    ]);
    return { mgpRMGP, mgpYMGP, rmgpMGP, rmgpYMGP, ymgpMGP, ymgpRMGP, ymgpVMGP };
  }, { mgpRMGP: 0, rmgpYMGP: 0, ymgpVMGP: 0, mgpYMGP: 0, ymgpRMGP: 0, rmgpMGP: 0, ymgpMGP: 0 });

  useEffect(() => {
    updateExchangeRates();
  }, [wallet.chain, wallet.account]);
  return [exchangeRates] as const;
};
