import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useCachedUpdateable } from "./useUpdateable";
import { useMemo } from "react";

import { UseLocked } from "./useLocked";
import { UseSupplies } from "./useSupplies";
import { UseWallet } from "./useWallet";

export interface UseExchangeRates {
  readonly mintRMGP: number;
  readonly curve: Readonly<{
    mgpRMGP: number;
    mgpYMGP: number;
    rmgpYMGP: number;
    rmgpMGP: number;
    ymgpRMGP: number;
    ymgpMGP: number;
    vmgpMGP: number;
  }>;
}

interface Properties {
  readonly locked: UseLocked;
  readonly wallet: UseWallet;
  readonly supplies: UseSupplies;
}

export const useExchangeRates = ({ locked, wallet, supplies }: Properties): UseExchangeRates => {
  const mintRMGP = useMemo(() => supplies.rmgp === 0n ? 1 : Number(locked.reefiMGP) / Number(supplies.rmgp), [supplies.rmgp, locked.reefiMGP]);
  const [mgpRMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "mgpRMGP curve", 0);
  const [mgpYMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "mgpYMGP curve", 0);
  const [rmgpYMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "rmgpYMGP curve", 0);
  const [rmgpMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "rmgpMGP curve", 0);
  const [ymgpRMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "ymgpRMGP curve", 0);
  const [ymgpMGP] = useCachedUpdateable(async () => Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(0.000_01)], { account: wallet.account })) / Number(parseEther(0.000_01)), [contracts, wallet.chain], "ymgpMGP curve", 0);
  const vmgpMGP = 0.8;
  return {

    curve: {
      mgpRMGP,
      mgpYMGP,
      rmgpMGP,
      rmgpYMGP,
      vmgpMGP,
      ymgpMGP,
      ymgpRMGP
    },
    mintRMGP
  };
};
