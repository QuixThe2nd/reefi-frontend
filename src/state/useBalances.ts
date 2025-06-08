/* eslint functional/no-try-statements: 0 */
import { parseEther } from "../utilities";
import { useAsyncReducer } from "../hooks/useAsyncReducer";
import { useEffect } from "react";
import { useWallet } from "./useWallet";

import { AllCoinETH, PrimaryCoin, publicClients, contracts } from "../config/contracts";

export const useBalances = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [balances, updateBalances] = useAsyncReducer<{ user: Record<AllCoinETH, bigint>; wstMGP: { MGP: bigint }; yMGP: { wstMGP: bigint }; vMGP: { yMGP: bigint }; curve: Record<PrimaryCoin, bigint> }>(async () => {
    const safeBalance = async (fn: () => Promise<bigint>) => {
      try {
        return await fn();
      } catch {
        return 0n;
      }
    };

    const [userCKP, userEGP, userLTP, userMGP, userPNP, userWETH, userCMGP, userRMGP, userYMGP, userLyMGP, userWrMGP, userVlMGP, userLvMGP, userETH, userVMGP, curveMGP, curveRMGP, curveYMGP, curveVMGP, wstMGPMGP, yMGPRMGP, vMGPYMGP] = await Promise.all([
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].CKP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].EGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].LTP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].MGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].PNP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].WETH.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].cMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].wstMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].stMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].vlMGP.read.balanceOf([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].yMGP.read.lockedBalances([wallet.account])),
      safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : publicClients[wallet.chain].getBalance({ address: wallet.account })),
      // safeBalance(() => wallet.account === undefined ? Promise.resolve(0n) : contracts[wallet.chain].vMGP.read.balanceOf([wallet.account])),
      Promise.resolve(parseEther(1.5)),
      safeBalance(() => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].wstMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].vMGP.read.balanceOf([contracts[wallet.chain].cMGP.address])),
      safeBalance(() => contracts[wallet.chain].vlMGP.read.getUserTotalLocked([contracts[wallet.chain].wstMGP.address])),
      safeBalance(() => contracts[wallet.chain].wstMGP.read.balanceOf([contracts[wallet.chain].yMGP.address])),
      safeBalance(() => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].vMGP.address]))
    ]);

    return {
      user: {
        CKP: userCKP,
        EGP: userEGP,
        LTP: userLTP,
        MGP: userMGP,
        PNP: userPNP,
        WETH: userWETH,
        cMGP: userCMGP,
        wstMGP: userRMGP,
        yMGP: userYMGP,
        lyMGP: userLyMGP,
        stMGP: userWrMGP,
        vlMGP: userVlMGP,
        lvMGP: userLvMGP,
        ETH: userETH,
        vMGP: userVMGP
      },
      curve: {
        MGP: curveMGP,
        wstMGP: curveRMGP,
        yMGP: curveYMGP,
        vMGP: curveVMGP
      },
      wstMGP: { MGP: wstMGPMGP },
      yMGP: { wstMGP: yMGPRMGP },
      vMGP: { yMGP: vMGPYMGP }
    };
  }, {
    user: {
      MGP: 0n, wstMGP: 0n, yMGP: 0n, vMGP: 0n,
      vlMGP: 0n, lyMGP: 0n, lvMGP: 0n,
      stMGP: 0n, cMGP: 0n,
      CKP: 0n, EGP: 0n, LTP: 0n, PNP: 0n,
      WETH: 0n, ETH: 0n
    },
    wstMGP: { MGP: 0n },
    yMGP: { wstMGP: 0n },
    vMGP: { yMGP: 0n },
    curve: { MGP: 0n, wstMGP: 0n, yMGP: 0n, vMGP: 0n }
  });

  useEffect(() => {
    updateBalances();
  }, [wallet.account, wallet.chain]);

  return [balances, updateBalances] as const;
};
