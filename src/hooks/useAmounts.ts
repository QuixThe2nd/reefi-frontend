import { useState } from "react";
import { parseEther } from "../utils";
import { contracts } from "../config/contracts";
import { useCachedUpdateable } from "./useUpdateable";
import { UseWallet } from "./useWallet";

export interface UseAmounts {
  send: bigint
  setSend: (_amount: bigint) => void
  mgpRmgpCurve: bigint
  rmgpMgpCurve: bigint
  rmgpYmgpCurve: bigint
  mgpLP: bigint
  setMGPLP: (_amount: bigint) => void
  rmgpLP: bigint
  setRMGPLP: (_amount: bigint) => void
  ymgpLP: bigint
  setYMGPLP: (_amount: bigint) => void
}

export const useAmounts = ({ wallet }: { readonly wallet: UseWallet }): UseAmounts => {
  const [send, setSend] = useState(parseEther(1));
  const [mgpLP, setMGPLP] = useState(0n)
  const [rmgpLP, setRMGPLP] = useState(0n)
  const [ymgpLP, setYMGPLP] = useState(0n)
  const [mgpRmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, send], { account: wallet.account }), [contracts, wallet.chain, send], 'mgpRmgpCurveAmount', 0n)
  const [rmgpMgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, send], { account: wallet.account }), [contracts, wallet.chain, send], 'rmgpMgpCurveAmount', 0n)
  const [rmgpYmgpCurve] = useCachedUpdateable(() => send === 0n ? 0n : contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, send], { account: wallet.account }), [contracts, wallet.chain, send], 'rmgpYmgpCurveAmount', 0n)
  return { send, setSend, mgpRmgpCurve, rmgpMgpCurve, rmgpYmgpCurve, mgpLP, setMGPLP, rmgpLP, setRMGPLP, ymgpLP, setYMGPLP }
}
