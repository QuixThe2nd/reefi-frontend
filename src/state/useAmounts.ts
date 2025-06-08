/* eslint functional/no-try-statements: 0 */
import { contracts, PrimaryCoin } from "../config/contracts";
import { useAsyncMemo } from "../hooks/useAsyncMemo";
import { useState } from "react";
import { useWallet } from "./useWallet";

type CurveRates<T extends PropertyKey> = {
  [K in T]: {
    [_P in Exclude<T, K>]: bigint;
  }
};

export const useAmounts = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [lp, setLP] = useState<Record<PrimaryCoin, bigint>>({ MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n });
  const [send, setSend] = useState(0n);

  const curve = useAsyncMemo<CurveRates<PrimaryCoin>>(async () => {
    const safeAmount = async (fn: () => Promise<bigint>) => {
      try {
        return await fn();
      } catch {
        return 0n;
      }
    };

    const [mgpRmgp, mgpYmgp, mgpVmgp, rmgpMgp, rmgpYmgp, rmgpVmgp, ymgpMgp, ymgpRmgp, ymgpVmgp, vmgpMgp, vmgpRmgp, vmgpYmgp] = await Promise.all([
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, send], { account: wallet.account })),
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, send], { account: wallet.account })),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([0n, 3n, send], { account: wallet.account })),
      Promise.resolve(send),
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, send], { account: wallet.account })),
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, send], { account: wallet.account })),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([1n, 3n, send], { account: wallet.account })),
      Promise.resolve(send),
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, send], { account: wallet.account })),
      safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, send], { account: wallet.account })),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([2n, 3n, send], { account: wallet.account })),
      Promise.resolve(send),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([3n, 0n, send], { account: wallet.account })),
      Promise.resolve(send),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([3n, 1n, send], { account: wallet.account })),
      Promise.resolve(send),
      // safeAmount(() => contracts[wallet.chain].cMGP.read.get_dy([3n, 2n, send], { account: wallet.account }))
      Promise.resolve(send)
    ]);
    return {
      MGP: { rMGP: mgpRmgp, yMGP: mgpYmgp, vMGP: mgpVmgp },
      rMGP: { MGP: rmgpMgp, yMGP: rmgpYmgp, vMGP: rmgpVmgp },
      yMGP: { MGP: ymgpMgp, rMGP: ymgpRmgp, vMGP: ymgpVmgp },
      vMGP: { MGP: vmgpMgp, rMGP: vmgpRmgp, yMGP: vmgpYmgp }
    };
  }, [wallet.chain, send], {
    MGP: { rMGP: 0n, yMGP: 0n, vMGP: 0n },
    rMGP: { MGP: 0n, yMGP: 0n, vMGP: 0n },
    yMGP: { MGP: 0n, rMGP: 0n, vMGP: 0n },
    vMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n }
  });

  return [{ lp, curve, send }, { setSend, setLP }] as const;
};
