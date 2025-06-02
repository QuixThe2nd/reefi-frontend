import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { Chains, contracts } from "../config/contracts";

import type { UseWallet } from "./useWallet";

interface Locked {
  MGP: Record<Chains, bigint>;
  reefiMGP: bigint;
  userYMGP: bigint;
  yMGP: bigint;
}

interface UpdateLocked {
  MGP: {
    42_161: () => Promise<void>;
    56: () => Promise<void>;
    all: () => void;
  };
  reefiMGP: () => Promise<void>;
  userYMGP: () => Promise<void>;
  yMGP: () => Promise<void>;
}

export interface UseLocked {
  readonly locked: Locked;
  readonly updateLocked: UpdateLocked;
}

export const useLocked = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseLocked => {
  const [locked, setLocked] = useStoredObject<Locked>("locked", { MGP: { 42_161: 0n, 56: 0n }, reefiMGP: 0n, userYMGP: 0n, yMGP: 0n });

  const updateLocked: UpdateLocked = {
    MGP: {
      42_161: () => contracts[42_161].VLMGP.read.totalLocked().then(value => setLocked(l => ({ MGP: { ...l.MGP, 42_161: value } }))),
      56: () => contracts[56].VLMGP.read.totalLocked().then(value => setLocked(l => ({ MGP: { ...l.MGP, 56: value } }))),
      all: () => {
        updateLocked.MGP[42_161]();
        updateLocked.MGP[56]();
      }
    },
    reefiMGP: () => contracts[wallet.chain].VLMGP.read.getUserTotalLocked([contracts[wallet.chain].rMGP.address]).then(reefiMGP => setLocked({ reefiMGP })),
    userYMGP: () => wallet.account ? contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account]).then(userYMGP => setLocked({ userYMGP })) : Promise.resolve(),
    yMGP: () => contracts[wallet.chain].yMGP.read.totalLocked().then(yMGP => setLocked({ yMGP }))
  };

  useEffect(() => {
    updateLocked.MGP[42_161]();
    updateLocked.MGP[56]();
  }, []);

  useEffect(() => {
    updateLocked.reefiMGP();
    updateLocked.yMGP();
  }, [wallet.chain]);

  useEffect(() => {
    updateLocked.userYMGP();
  }, [wallet.account]);

  return { locked, updateLocked };
};
