import { contracts } from "../config/contracts";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import type { UseWallet } from "./useWallet";

interface Locked {
  reefiMGP: bigint;
}

interface UpdateLocked {
  reefiMGP: () => Promise<void>;
}

export interface UseLocked {
  readonly locked: Locked;
  readonly updateLocked: UpdateLocked;
}

export const useLocked = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseLocked => {
  const [locked, setLocked] = useStoredObject<Locked>("locked", { reefiMGP: 0n });

  const updateLocked: UpdateLocked = {
    reefiMGP: () => contracts[wallet.chain].vlMGP.read.getUserTotalLocked([contracts[wallet.chain].rMGP.address]).then(reefiMGP => setLocked({ reefiMGP }))
  };

  useEffect(() => {
    updateLocked.reefiMGP();
  }, [wallet.chain]);

  return { locked, updateLocked };
};
