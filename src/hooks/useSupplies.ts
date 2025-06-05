import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";

interface Supplies {
  MGP: bigint;
  rMGP: bigint;
  yMGP: bigint;
  vMGP: bigint;
  lyMGP: bigint;
  lvMGP: bigint;
  vlMGP: bigint;
}

type UpdateSupplies = Record<keyof Supplies, () => void>;

export interface UseSupplies {
  readonly supplies: Supplies;
  readonly updateSupplies: UpdateSupplies;
}

export const useSupplies = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseSupplies => {
  const [supplies, setSupplies] = useStoredObject<Supplies>("supplies", { MGP: 0n, rMGP: 0n, vMGP: parseEther(8.5), yMGP: 0n, lyMGP: 0n, lvMGP: 0n, vlMGP: 0n });
  const updateSupplies: UpdateSupplies = {
    MGP: () => contracts[56].MGP.read.totalSupply().then(MGP => setSupplies({ MGP })),
    rMGP: () => contracts[wallet.chain].rMGP.read.totalSupply().then(rMGP => setSupplies({ rMGP })),
    yMGP: () => contracts[wallet.chain].yMGP.read.totalSupply().then(yMGP => setSupplies({ yMGP })),
    vMGP: () => contracts[wallet.chain].yMGP.read.totalSupply().then(yMGP => setSupplies({ yMGP })),
    lyMGP: () => contracts[wallet.chain].yMGP.read.totalSupply().then(yMGP => setSupplies({ yMGP })),
    lvMGP: () => contracts[wallet.chain].yMGP.read.totalSupply().then(yMGP => setSupplies({ yMGP })),
    vlMGP: () => contracts[wallet.chain].vlMGP.read.totalSupply().then(vlMGP => setSupplies({ vlMGP }))
  };

  useEffect(() => {
    updateSupplies.MGP();
  }, []);

  useEffect(() => {
    updateSupplies.rMGP();
    updateSupplies.yMGP();
    updateSupplies.vMGP();
    updateSupplies.lyMGP();
    updateSupplies.lvMGP();
    updateSupplies.vlMGP();
  }, [wallet.chain]);
  return { supplies, updateSupplies };
};
