import { contracts, publicClients, Coins } from "../config/contracts";
import { parseEther } from "../utilities";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";

type Balances = Record<Coins | "ETH" | "curveMGP" | "curveRMGP" | "curveYMGP" | "ymgpHoldings" | "vmgpHoldings", bigint>;
type UpdateBalances = Record<keyof Balances, () => Promise<void>>;

export type UseBalances = Readonly<{
  balances: Balances;
  updateBalances: UpdateBalances;
}>;

export const useBalances = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseBalances => {
  const [balances, setBalances] = useStoredObject<Balances>("balances", { CKP: 0n, EGP: 0n, ETH: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n, cMGP: 0n, lyMGP: 0n, curveMGP: 0n, curveRMGP: 0n, curveYMGP: 0n, rMGP: 0n, vMGP: 0n, yMGP: 0n, ymgpHoldings: 0n, vmgpHoldings: parseEther(0.5), lvMGP: parseEther(0.5), wrMGP: 0n });

  const updateBalances: UpdateBalances = {
    CKP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].CKP.read.balanceOf([wallet.account]).then(CKP => setBalances(() => ({ CKP }))),
    EGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].EGP.read.balanceOf([wallet.account]).then(EGP => setBalances(() => ({ EGP }))),
    ETH: () => wallet.account === undefined ? Promise.resolve() : publicClients[wallet.chain].getBalance({ address: wallet.account }).then(ETH => setBalances(() => ({ ETH }))),
    LTP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].LTP.read.balanceOf([wallet.account]).then(LTP => setBalances(() => ({ LTP }))),
    MGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].MGP.read.balanceOf([wallet.account]).then(MGP => setBalances(() => ({ MGP }))),
    PNP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].PNP.read.balanceOf([wallet.account]).then(PNP => setBalances(() => ({ PNP }))),
    WETH: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].WETH.read.balanceOf([wallet.account]).then(WETH => setBalances(() => ({ WETH }))),
    cMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].cMGP.read.balanceOf([wallet.account]).then(cMGP => setBalances(() => ({ cMGP }))),
    curveMGP: () => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].cMGP.address]).then(curveMGP => setBalances({ curveMGP })),
    curveRMGP: () => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].cMGP.address]).then(curveRMGP => setBalances({ curveRMGP })),
    curveYMGP: () => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].cMGP.address]).then(curveYMGP => setBalances({ curveYMGP })),
    rMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].rMGP.read.balanceOf([wallet.account]).then(rMGP => setBalances(() => ({ rMGP }))),
    yMGP: () => wallet.account === undefined ? Promise.resolve() : contracts[wallet.chain].yMGP.read.balanceOf([wallet.account]).then(yMGP => setBalances(() => ({ yMGP }))),
    lyMGP: () => wallet.account ? contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account]).then(lyMGP => setBalances({ lyMGP })) : Promise.resolve(),
    lvMGP: () => wallet.account ? contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account]).then(lyMGP => setBalances({ lyMGP })) : Promise.resolve(),
    vMGP: () => contracts[wallet.chain].vMGP.read.balanceOf([contracts[wallet.chain].yMGP.address]).then(vMGP => setBalances(() => ({ vMGP }))),
    ymgpHoldings: () => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].yMGP.address]).then(ymgpHoldings => setBalances(() => ({ ymgpHoldings }))),
    vmgpHoldings: () => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].yMGP.address]).then(ymgpHoldings => setBalances(() => ({ ymgpHoldings })))
  };

  useEffect(() => {
    Object.values(updateBalances).forEach(u => u());
  }, [wallet.chain, wallet.account]);

  return { balances, updateBalances };
};
