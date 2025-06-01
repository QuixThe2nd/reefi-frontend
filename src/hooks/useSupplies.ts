import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useCachedUpdateable } from "./useUpdateable";

import { UseWallet } from "./useWallet";

export interface UseSupplies {
  readonly mgp: bigint;
  readonly rmgp: bigint;
  readonly ymgp: bigint;
  readonly vmgp: bigint;
  readonly updateMGP: () => void;
  readonly updateRMGP: () => void;
  readonly updateYMGP: () => void;
  // Readonly updateVMGP: () => void
}

export const useSupplies = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseSupplies => {
  const [mgp, updateMGP] = useCachedUpdateable(() => contracts[56].MGP.read.totalSupply(), [contracts], "mgp supply", 0n),
    [rmgp, updateRMGP] = useCachedUpdateable(() => contracts[wallet.chain].rMGP.read.totalSupply(), [contracts, wallet.chain], "rmgp supply", 0n),
    [ymgp, updateYMGP] = useCachedUpdateable(() => contracts[wallet.chain].yMGP.read.totalSupply(), [contracts, wallet.chain], "ymgp supply", 0n),
    // Const [vmgp, updateVMGP] = useCachedUpdateable(() => contracts[wallet.chain].VMGP.read.totalSupply(), [contracts, wallet.chain], 0n)
    vmgp = parseEther(8.5);

  return { mgp, rmgp, updateMGP, updateRMGP, updateYMGP, vmgp, ymgp };
};
