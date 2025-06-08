/* eslint functional/no-try-statements: 0 */

import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useAsyncReducer } from "../hooks/useAsyncReducer";
import { useEffect } from "react";
import { useWallet } from "./useWallet";

export const useExchangeRates = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [exchangeRates, updateExchangeRates] = useAsyncReducer<{ mgpWSTMGP: number; mgpYMGP: number; mgpVMGP: number; wstmgpMGP: number; wstmgpYMGP: number; wstmgpVMGP: number; ymgpMGP: number; ymgpWSTMGP: number; ymgpVMGP: number; vmgpMGP: number; vmgpWSTMGP: number; vmgpYMGP: number }>(async () => {
    const safeRate = async (fn: () => Promise<number>) => {
      try {
        return await fn();
      } catch {
        return 0;
      }
    };

    const [mgpWSTMGP, mgpYMGP, mgpVMGP, wstmgpMGP, wstmgpYMGP, wstmgpVMGP, ymgpMGP, ymgpWSTMGP, ymgpVMGP, vmgpMGP, vmgpWSTMGP, vmgpYMGP] = await Promise.all([
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(0.8),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(1.3),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(1.1),
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 3n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(1.2),
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 0n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(0.7),
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 1n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5))),
      Promise.resolve(0.85)
      // safeRate(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([3n, 2n, parseEther(0.5)], { account: wallet.account })) / Number(parseEther(0.5)))
    ]);
    return { mgpWSTMGP, mgpYMGP, mgpVMGP, wstmgpMGP, wstmgpYMGP, wstmgpVMGP, ymgpMGP, ymgpWSTMGP, ymgpVMGP, vmgpMGP, vmgpWSTMGP, vmgpYMGP };
  }, { mgpWSTMGP: 0, mgpYMGP: 0, mgpVMGP: 0, wstmgpMGP: 0, wstmgpYMGP: 0, wstmgpVMGP: 0, ymgpMGP: 0, ymgpWSTMGP: 0, ymgpVMGP: 0, vmgpMGP: 0, vmgpWSTMGP: 0, vmgpYMGP: 0 });

  useEffect(() => {
    updateExchangeRates();
  }, [wallet.chain, wallet.account]);
  return [exchangeRates] as const;
};
