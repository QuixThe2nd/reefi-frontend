import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useCachedUpdateable } from "./useUpdateable";
import { useState } from "react";

import { UseWallet } from "./useWallet";

export interface UseAmounts {
  send: bigint;
  setSend: (_amount: bigint) => void;
  mgpRmgpCurve: bigint;
  rmgpMgpCurve: bigint;
  rmgpYmgpCurve: bigint;
  ymgpRmgpCurve: bigint;
  ymgpMgpCurve: bigint;
  mgpYmgpCurve: bigint;
  mgpLP: bigint;
  setMgpLP: (_amount: bigint) => void;
  rmgpLP: bigint;
  setRmgpLP: (_amount: bigint) => void;
  ymgpLP: bigint;
  setYmgpLP: (_amount: bigint) => void;
}

export const useAmounts = ({ wallet }: Readonly<{ wallet: UseWallet }>): UseAmounts => {
  const [send, setSend] = useState(() => parseEther(1));
  const [mgpLP, setMgpLP] = useState(0n);
  const [rmgpLP, setRmgpLP] = useState(0n);
  const [ymgpLP, setYmgpLP] = useState(0n);
  const [mgpRmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, send], { account: wallet.account }), [contracts, wallet.chain, send], "mgpRmgpCurveAmount", 0n);
  const [mgpYmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, send], { account: wallet.account }), [contracts, wallet.chain, send], "ymgpMgpCurve", 0n);
  const [rmgpMgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, send], { account: wallet.account }), [contracts, wallet.chain, send], "rmgpMgpCurveAmount", 0n);
  const [rmgpYmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, send], { account: wallet.account }), [contracts, wallet.chain, send], "rmgpYmgpCurveAmount", 0n);
  const [ymgpMgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, send], { account: wallet.account }), [contracts, wallet.chain, send], "ymgpMgpCurve", 0n);
  const [ymgpRmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, send], { account: wallet.account }), [contracts, wallet.chain, send], "ymgpRmgpCurve", 0n);
  return { mgpLP, mgpRmgpCurve, mgpYmgpCurve, rmgpLP, rmgpMgpCurve, rmgpYmgpCurve, send, setMgpLP, setRmgpLP, setSend, setYmgpLP, ymgpLP, ymgpMgpCurve, ymgpRmgpCurve };
};
