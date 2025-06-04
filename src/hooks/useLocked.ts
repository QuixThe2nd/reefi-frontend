import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { Chains, contracts } from "../config/contracts";

import type { UseWallet } from "./useWallet";

interface Locked {
  MGP: Record<Chains, bigint>;
  reefiMGP: bigint;
}

interface UpdateLocked {
  MGP: {
    42_161: () => Promise<void>;
    56: () => Promise<void>;
    all: () => Promise<void>;
  };
  reefiMGP: () => Promise<void>;
}

export interface UseLocked {
  readonly locked: Locked;
  readonly updateLocked: UpdateLocked;
}

export const useLocked = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseLocked => {
  const [locked, setLocked] = useStoredObject<Locked>("locked", { MGP: { 42_161: 0n, 56: 0n }, reefiMGP: 0n });

  const updateLocked: UpdateLocked = {
    MGP: {
      42_161: () => contracts[42_161].vlMGP.read.totalLocked().then(value => setLocked(l => ({ MGP: { ...l.MGP, 42_161: value } }))),
      56: () => contracts[56].vlMGP.read.totalLocked().then(value => setLocked(l => ({ MGP: { ...l.MGP, 56: value } }))),
      all: async () => {
        await updateLocked.MGP[42_161]();
        await updateLocked.MGP[56]();
      }
    },
    reefiMGP: () => contracts[wallet.chain].vlMGP.read.getUserTotalLocked([contracts[wallet.chain].rMGP.address]).then(reefiMGP => setLocked({ reefiMGP }))
  };

  useEffect(() => {
    updateLocked.MGP[42_161]();
    updateLocked.MGP[56]();
  }, []);

  useEffect(() => {
    updateLocked.reefiMGP();
  }, [wallet.chain]);

  return { locked, updateLocked };
};
