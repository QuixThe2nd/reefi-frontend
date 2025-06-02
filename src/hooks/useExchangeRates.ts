import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";

export interface UseExchangeRates {
  readonly exchangeRates: Readonly<{
    mgpRMGP: number;
    mgpYMGP: number;
    rmgpYMGP: number;
    rmgpMGP: number;
    ymgpRMGP: number;
    ymgpMGP: number;
  }>;
  readonly updateExchangeRates: Readonly<{
    mgpRMGP: () => Promise<void>;
    mgpYMGP: () => Promise<void>;
    rmgpYMGP: () => Promise<void>;
    rmgpMGP: () => Promise<void>;
    ymgpRMGP: () => Promise<void>;
    ymgpMGP: () => Promise<void>;
  }>;
}

interface Properties {
  readonly wallet: UseWallet;
}

export const useExchangeRates = ({ wallet }: Properties): UseExchangeRates => {
  const [exchangeRates, setExchangeRates] = useStoredObject("exchangeRates", { mgpRMGP: 0, mgpYMGP: 0, rmgpMGP: 0, rmgpYMGP: 0, ymgpMGP: 0, ymgpRMGP: 0 });

  const updateExchangeRates = {
    mgpRMGP: async () => setExchangeRates({ mgpRMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) }),
    mgpYMGP: async () => setExchangeRates({ mgpYMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) }),
    rmgpMGP: async () => setExchangeRates({ rmgpMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) }),
    rmgpYMGP: async () => setExchangeRates({ rmgpYMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) }),
    ymgpMGP: async () => setExchangeRates({ ymgpMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) }),
    ymgpRMGP: async () => setExchangeRates({ ymgpRMGP: Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(1)], { account: wallet.account })) / Number(parseEther(1)) })
  };

  useEffect(() => {
    updateExchangeRates.mgpRMGP();
    updateExchangeRates.mgpYMGP();
    updateExchangeRates.rmgpMGP();
    updateExchangeRates.rmgpYMGP();
    updateExchangeRates.ymgpMGP();
    updateExchangeRates.ymgpRMGP();
  }, [wallet.chain, wallet.account]);

  return { exchangeRates, updateExchangeRates };
};
