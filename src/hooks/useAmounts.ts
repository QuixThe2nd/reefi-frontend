import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useEffect } from "react";
import { useStoredObject } from "./useStoredState";

import { UseWallet } from "./useWallet";

interface Amounts {
  curve: {
    mgpRmgp: bigint;
    mgpYmgp: bigint;
    rmgpMgp: bigint;
    rmgpYmgp: bigint;
    ymgpMgp: bigint;
    ymgpRmgp: bigint;
  };
  lp: {
    MGP: bigint;
    rMGP: bigint;
    yMGP: bigint;
  };
  send: bigint;
}

interface UpdateAmounts {
  curve: {
    mgpRmgp: () => Promise<void>;
    mgpYmgp: () => Promise<void>;
    rmgpMgp: () => Promise<void>;
    rmgpYmgp: () => Promise<void>;
    ymgpMgp: () => Promise<void>;
    ymgpRmgp: () => Promise<void>;
  };
  send: (_value: bigint) => void;
  lp: {
    MGP: (_value: bigint) => void;
    rMGP: (_value: bigint) => void;
    yMGP: (_value: bigint) => void;
  };
}

export interface UseAmounts {
  amounts: Amounts;
  updateAmounts: UpdateAmounts;
}

export const useAmounts = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseAmounts => {
  const [amounts, setAmounts] = useStoredObject<Amounts>("amounts", { curve: { mgpRmgp: 0n, mgpYmgp: 0n, rmgpMgp: 0n, rmgpYmgp: 0n, ymgpMgp: 0n, ymgpRmgp: 0n }, lp: { MGP: 0n, rMGP: 0n, yMGP: 0n }, send: parseEther(1) });

  const updateAmounts: UpdateAmounts = {
    curve: {
      mgpRmgp: () => contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, mgpRmgp: value } }));
      }),
      mgpYmgp: () => contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, mgpYmgp: value } }));
      }),
      rmgpMgp: () => contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, rmgpMgp: value } }));
      }),
      rmgpYmgp: () => contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, rmgpYmgp: value } }));
      }),
      ymgpMgp: () => contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, ymgpMgp: value } }));
      }),
      ymgpRmgp: () => contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, amounts.send], { account: wallet.account }).then(value => {
        setAmounts(a => ({ curve: { ...a.curve, ymgpRmgp: value } }));
      })
    },
    lp: {
      MGP: MGP => {
        setAmounts(a => ({ lp: { ...a.lp, MGP } }));
      },
      rMGP: rMGP => {
        setAmounts(a => ({ lp: { ...a.lp, rMGP } }));
      },
      yMGP: yMGP => {
        setAmounts(a => ({ lp: { ...a.lp, yMGP } }));
      }
    },
    send: send => {
      setAmounts({ send });
    }
  };

  useEffect(() => {
    updateAmounts.curve.mgpRmgp();
    updateAmounts.curve.mgpYmgp();
    updateAmounts.curve.rmgpMgp();
    updateAmounts.curve.rmgpYmgp();
    updateAmounts.curve.ymgpMgp();
    updateAmounts.curve.ymgpRmgp();
  }, [wallet.chain, amounts.send]);

  return { amounts, updateAmounts };
};
