import { contracts } from "../config/contracts";
import { useCachedUpdateable } from "./useUpdateable";
import { useMemo } from "react";

import type { UseWallet } from "./useWallet";

export interface UseLocked {
  readonly reefiMGP: bigint;
  readonly ymgp: bigint;
  readonly userYMGP: bigint;
  readonly mgp: bigint;
  readonly updateReefiMGP: () => void;
  readonly updateYMGP: () => void;
  readonly updateUserYMGP: () => void;
  readonly updateMGP: () => void;
}

export const useLocked = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseLocked => {
  const [reefiMGP, updateReefiMGP] = useCachedUpdateable(() => contracts[wallet.chain].VLMGP.read.getUserTotalLocked([contracts[wallet.chain].rMGP.address]), [contracts, wallet.account, wallet.chain], "reefiMGP locked", 0n);
  const [mgpBSC, updateMGPBSC] = useCachedUpdateable(() => contracts[56].VLMGP.read.totalLocked(), [contracts, wallet.account], "mgpBSC locked", 0n);
  const [mgpARB, updateMGPARB] = useCachedUpdateable(() => contracts[42_161].VLMGP.read.totalLocked(), [contracts, wallet.account], "mgpARB locked", 0n);
  const mgp = useMemo(() => mgpBSC + mgpARB, [mgpBSC, mgpARB]);
  const updateMGP = (): void => {
    updateMGPBSC();
    updateMGPARB();
  };
  const [ymgp, updateYMGP] = useCachedUpdateable(() => contracts[wallet.chain].yMGP.read.totalLocked(), [contracts, wallet.account], "ymgp locked", 0n);
  const [userYMGP, updateUserYMGP] = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account]), [contracts, wallet.account], "userYMGP locked", 0n);
  return { mgp, reefiMGP, updateMGP, updateReefiMGP, updateUserYMGP, updateYMGP, userYMGP, ymgp };
};
