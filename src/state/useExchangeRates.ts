/* eslint functional/no-try-statements: 0 */

import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useAsyncReducer } from "../hooks/useAsyncReducer";
import { useEffect } from "react";
import { useWallet } from "./useWallet";

export const useExchangeRates = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [exchangeRates, updateExchangeRates] = useAsyncReducer<{ mgpRMGP: number; mgpYMGP: number; mgpVMGP: number; rmgpMGP: number; rmgpYMGP: number; rmgpVMGP: number; ymgpMGP: number; ymgpRMGP: number; ymgpVMGP: number; vmgpMGP: number; vmgpRMGP: number; vmgpYMGP: number }>(async () => {
    const safeRate = async (fn: () => Promise<number>) => {
      try {
        return await fn();
      } catch {
        return 0;
      }
    };

    const [mgpRMGP, mgpYMGP, mgpVMGP, rmgpMGP, rmgpYMGP, rmgpVMGP, ymgpMGP, ymgpRMGP, ymgpVMGP, vmgpMGP, vmgpRMGP, vmgpYMGP] = await Promise.all([
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)))
    ]);
    return { mgpRMGP, mgpYMGP, mgpVMGP, rmgpMGP, rmgpYMGP, rmgpVMGP, ymgpMGP, ymgpRMGP, ymgpVMGP, vmgpMGP, vmgpRMGP, vmgpYMGP };
  }, { mgpRMGP: 0, mgpYMGP: 0, mgpVMGP: 0, rmgpMGP: 0, rmgpYMGP: 0, rmgpVMGP: 0, ymgpMGP: 0, ymgpRMGP: 0, ymgpVMGP: 0, vmgpMGP: 0, vmgpRMGP: 0, vmgpYMGP: 0 });

  useEffect(() => {
    updateExchangeRates();
  }, [wallet.chain, wallet.account]);
  return [exchangeRates] as const;
};
