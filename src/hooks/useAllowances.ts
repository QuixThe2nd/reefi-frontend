import { contracts, Coins } from "../config/contracts";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";


interface Allowance {
  readonly MGP: bigint;
  readonly rMGP: bigint;
  readonly curve: Record<"MGP" | "rMGP" | "yMGP" | "cMGP", bigint>;
  readonly odos: Record<Coins, bigint>;
}

interface UpdateAllowances {
  readonly MGP: () => Promise<void>;
  readonly rMGP: () => Promise<void>;
  readonly curve: Record<"MGP" | "rMGP" | "yMGP" | "cMGP", () => Promise<void>>;
  readonly odos: Record<Coins, () => Promise<void>>;
}

export interface UseAllowances {
  allowances: Allowance;
  updateAllowances: UpdateAllowances;
}

export const useAllowances = ({ wallet }: Readonly<{ wallet: UseWallet }>) => {
  const [allowances, setAllowances] = useStoredObject("allowances", { MGP: 0n, curve: { MGP: 0n, cMGP: 0n, rMGP: 0n, yMGP: 0n }, odos: { CKP: 0n, EGP: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n, cMGP: 0n, rMGP: 0n, yMGP: 0n }, rMGP: 0n });

  const updateAllowances: UpdateAllowances = {
    MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].rMGP.address]).then(value => setAllowances(() => ({ MGP: value }))),
    curve: {
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ curve: { ...a.curve, MGP: value } }))),
      cMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].cMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ curve: { ...a.curve, cMGP: value } }))),
      rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ curve: { ...a.curve, rMGP: value } }))),
      yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].cMGP.address]).then(value => setAllowances(a => ({ curve: { ...a.curve, yMGP: value } })))
    },
    odos: {
      CKP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].CKP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, CKP: value } }))),
      EGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].EGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, EGP: value } }))),
      LTP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].LTP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, LTP: value } }))),
      MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, MGP: value } }))),
      PNP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].PNP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, PNP: value } }))),
      WETH: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].WETH.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, WETH: value } }))),
      cMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].cMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, cMGP: value } }))),
      rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, rMGP: value } }))),
      yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].yMGP.read.allowance([wallet.account, contracts[wallet.chain].ODOSRouter.address]).then(value => setAllowances(a => ({ odos: { ...a.odos, yMGP: value } })))
    },
    rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.allowance([wallet.account, contracts[wallet.chain].yMGP.address]).then(value => setAllowances(() => ({ rMGP: value })))
  };

  useEffect(() => {
    updateAllowances.MGP();
    updateAllowances.rMGP();
    updateAllowances.curve.MGP();
    updateAllowances.curve.rMGP();
    updateAllowances.curve.yMGP();
    updateAllowances.curve.cMGP();
    updateAllowances.odos.CKP();
    updateAllowances.odos.EGP();
    updateAllowances.odos.LTP();
    updateAllowances.odos.MGP();
    updateAllowances.odos.PNP();
    updateAllowances.odos.WETH();
    updateAllowances.odos.cMGP();
    updateAllowances.odos.rMGP();
    updateAllowances.odos.yMGP();
  }, [wallet.account, wallet.chain]);

  return { allowances, updateAllowances };
};
