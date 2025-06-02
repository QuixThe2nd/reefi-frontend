import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";

export interface UseSupplies {
  readonly supplies: { MGP: bigint; rMGP: bigint; yMGP: bigint; vMGP: bigint };
  readonly updateSupplies: { MGP: () => void; rMGP: () => void; yMGP: () => void };
}

export const useSupplies = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseSupplies => {
  const [supplies, setSupplies] = useStoredObject("supplies", { MGP: 0n, rMGP: 0n, vMGP: parseEther(8.5), yMGP: 0n });
  const updateSupplies = {
    MGP: () => contracts[56].MGP.read.totalSupply().then(MGP => setSupplies({ MGP })),
    rMGP: () => contracts[wallet.chain].rMGP.read.totalSupply().then(rMGP => setSupplies({ rMGP })),
    yMGP: () => contracts[wallet.chain].yMGP.read.totalSupply().then(yMGP => setSupplies({ yMGP }))
  };

  useEffect(() => {
    updateSupplies.MGP();
  }, []);

  useEffect(() => {
    updateSupplies.rMGP();
    updateSupplies.yMGP();
  }, [wallet.chain]);
  return { supplies, updateSupplies };
};
