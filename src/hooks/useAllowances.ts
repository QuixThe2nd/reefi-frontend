import { contracts, Coins } from "../config/contracts";
import { useCachedUpdateable } from "./useUpdateable";

import { UseWallet } from "./useWallet";

type Contracts = Record<Coins, [bigint, () => void]>;

export interface UseAllowances {
  readonly MGP: [bigint, () => void];
  readonly rMGP: [bigint, () => void];
  readonly curve: Record<"MGP" | "rMGP" | "yMGP" | "cMGP", [bigint, () => void]>;
  readonly odos: Contracts;
}

export const useAllowances = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseAllowances => {
  const MGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].rMGP.address]), [contracts, wallet.chain, wallet.account], "mgp allowance", 0n);
  const rMGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].yMGP.address]), [contracts, wallet.chain, wallet.account], "rmgp allowance", 0n);
  // Const [ymgp, updateYMGP] = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.allowance([wallet.account, contracts[wallet.chain].VMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgp allowance', 0n)
  const curve = {
    MGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]), [contracts, wallet.chain, wallet.account], "mgpCurve allowance", 0n),
    cMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].cMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]), [contracts, wallet.account], "CMGPCurve allowance", 0n),
    rMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]), [contracts, wallet.chain, wallet.account], "rmgpCurve allowance", 0n),
    yMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]), [contracts, wallet.account], "ymgpCurve allowance", 0n)
  };
  const odos: Contracts = {
    CKP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CKP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "CKP ODOS allowance", 0n),
    EGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].EGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "EGP ODOS allowance", 0n),
    LTP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].LTP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "LTP ODOS allowance", 0n),
    MGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.chain, wallet.account], "mgp ODOS allowance", 0n),
    PNP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].PNP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "PNP ODOS allowance", 0n),
    WETH: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].WETH.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "WETH ODOS allowance", 0n),
    cMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].cMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "CMGP ODOS allowance", 0n),
    rMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.chain, wallet.account], "rmgp ODOS allowance", 0n),
    yMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]), [contracts, wallet.account], "ymgp ODOS allowance", 0n)
  };
  return { MGP, curve, odos, rMGP };
};
