import { contracts, PrimaryCoin, SecondaryCoin } from "../config/contracts";
import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";

interface Allowances {
  wstMGP: { MGP: bigint };
  stMGP: { wstMGP: bigint };
  yMGP: { wstMGP: bigint };
  lyMGP: { yMGP: bigint };
  vMGP: { yMGP: bigint };
  lvMGP: { vMGP: bigint };
  cMGP: Record<PrimaryCoin, bigint>;
  odos: Record<SecondaryCoin, bigint>;
}

export const useAllowances = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [allowances, setAllowances] = useState<Allowances>({
    wstMGP: { MGP: 0n },
    stMGP: { wstMGP: 0n },
    yMGP: { wstMGP: 0n },
    lyMGP: { yMGP: 0n },
    vMGP: { yMGP: 0n },
    lvMGP: { vMGP: 0n },
    cMGP: { MGP: 0n, wstMGP: 0n, yMGP: 0n, vMGP: 0n },
    odos: { CKP: 0n, EGP: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n }
  });

  const updateAllowances = {
    wstMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].wstMGP.address]).then(MGP => setAllowances(a => ({ ...a, wstMGP: { MGP } }))),
    yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].wstMGP.read.allowance([wallet.account, contracts[wallet.chain].yMGP.address]).then(wstMGP => setAllowances(a => ({ ...a, yMGP: { wstMGP } }))),
    cMGP: {
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(MGP => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, MGP } }))),
      wstMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].wstMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(wstMGP => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, wstMGP } }))),
      yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(yMGP => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, yMGP } }))),
      // vMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].vMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ ...a, cMGP: { ...a.cMGP, yMGP: value } })))
      vMGP: () => Promise.resolve()
    },
    odos: {
      CKP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].CKP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(CKP => setAllowances(a => ({ ...a, odos: { ...a.odos, CKP } }))),
      EGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].EGP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(EGP => setAllowances(a => ({ ...a, odos: { ...a.odos, EGP } }))),
      LTP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].LTP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(LTP => setAllowances(a => ({ ...a, odos: { ...a.odos, LTP } }))),
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(MGP => setAllowances(a => ({ ...a, odos: { ...a.odos, MGP } }))),
      PNP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].PNP.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(PNP => setAllowances(a => ({ ...a, odos: { ...a.odos, PNP } }))),
      WETH: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].WETH.read.allowance([wallet.account, contracts[wallet.chain].odosRouter.address]).then(WETH => setAllowances(a => ({ ...a, odos: { ...a.odos, WETH } })))
    }
  };

  useEffect(() => {
    updateAllowances.wstMGP();
    updateAllowances.yMGP();
    updateAllowances.cMGP.MGP();
    updateAllowances.cMGP.wstMGP();
    updateAllowances.cMGP.yMGP();
    updateAllowances.cMGP.vMGP();
    updateAllowances.odos.CKP();
    updateAllowances.odos.EGP();
    updateAllowances.odos.LTP();
    updateAllowances.odos.MGP();
    updateAllowances.odos.PNP();
    updateAllowances.odos.WETH();
  }, [wallet.account, wallet.chain]);

  return [allowances, updateAllowances] as const;
};
