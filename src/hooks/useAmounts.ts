import { useState } from "react";
import { parseEther } from "../utils";
import { Chains, contracts } from "../config/contracts";
import { useUpdateable } from "./useUpdateable";

interface Amounts {
  sendAmount: bigint
  setSendAmount: (_amount: bigint) => void
  mgpRmgpCurveAmount: bigint
  rmgpMgpCurveAmount: bigint
  rmgpYmgpCurveAmount: bigint
  mgpLPAmount: bigint
  setMGPLPAmount: (_amount: bigint) => void
  rmgpLPAmount: bigint
  setRMGPLPAmount: (_amount: bigint) => void
  ymgpLPAmount: bigint
  setYMGPLPAmount: (_amount: bigint) => void
}

export const useAmounts = ({ chain, account }: { readonly chain: Chains, readonly account: `0x${string}` | undefined }): Amounts => {
  const [sendAmount, setSendAmount] = useState(parseEther(1));
  const [mgpLPAmount, setMGPLPAmount] = useState(0n)
  const [rmgpLPAmount, setRMGPLPAmount] = useState(0n)
  const [ymgpLPAmount, setYMGPLPAmount] = useState(0n)

  const [mgpRmgpCurveAmount] = useUpdateable(() => sendAmount === 0n ? 0n : contracts[chain].CMGP.read.get_dy([0n, 1n, sendAmount], { account }), [contracts, chain, sendAmount], 0n)
  const [rmgpMgpCurveAmount] = useUpdateable(() => sendAmount === 0n ? 0n : contracts[chain].CMGP.read.get_dy([1n, 0n, sendAmount], { account }), [contracts, chain, sendAmount], 0n)
  const [rmgpYmgpCurveAmount] = useUpdateable(() => sendAmount === 0n ? 0n : contracts[chain].CMGP.read.get_dy([1n, 2n, sendAmount], { account }), [contracts, chain, sendAmount], 0n)

  return { sendAmount, setSendAmount, mgpRmgpCurveAmount, rmgpMgpCurveAmount, rmgpYmgpCurveAmount, mgpLPAmount, setMGPLPAmount, rmgpLPAmount, setRMGPLPAmount, ymgpLPAmount, setYMGPLPAmount }
}