import { contracts, PrimaryCoin, SecondaryCoin } from "../config/contracts";
import { useState } from "react";
import { useWallet } from "./useWallet";

interface Allowances {
  rMGP: { MGP: bigint };
  yMGP: { rMGP: bigint };
  lyMGP: { yMGP: bigint };
  vMGP: { yMGP: bigint };
  lvMGP: { vMGP: bigint };
  cMGP: Record<PrimaryCoin, bigint>;
  odos: Record<SecondaryCoin, bigint>;
}

export const useAllowances = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [allowances, setAllowances] = useState<Allowances>({
    rMGP: { MGP: 0n },
    yMGP: { rMGP: 0n },
    lyMGP: { yMGP: 0n },
    vMGP: { yMGP: 0n },
    lvMGP: { vMGP: 0n },
    cMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n },
    odos: { CKP: 0n, EGP: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n }
  });

  const updateAllowances = {
    rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].rMGP.address]).then(value => setAllowances(a => ({ ...a, rMGP: { MGP: value } }))),
    yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].yMGP.address]).then(value => setAllowances(a => ({ ...a, yMGP: { rMGP: value } }))),
    curve: {
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, MGP: value } }))),
      rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, rMGP: value } }))),
      yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, yMGP: value } }))),
      vMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].vMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, yMGP: value } })))
    },
    odos: {
      CKP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].CKP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, CKP: value } }))),
      EGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].EGP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, EGP: value } }))),
      LTP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].LTP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, LTP: value } }))),
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, MGP: value } }))),
      PNP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].PNP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, PNP: value } }))),
      WETH: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].WETH.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(value => setAllowances(a => ({ ...a, odos: { ...a.odos, WETH: value } })))
    }
  };

  return [allowances, updateAllowances] as const;
};
