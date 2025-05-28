import { useState } from "react";
import { parseEther } from "../utils";
import { Chains, contracts } from "../config/contracts";
import { useUpdateable } from "./useUpdateable";

export const useAmounts = ({ chain, account }: { chain: Chains, account: `0x${string}` }) => {
  const [sendAmount, setSendAmount] = useState(parseEther(1));
  const [mgpLPAmount, setMGPLPAmount] = useState(0n)
  const [rmgpLPAmount, setRMGPLPAmount] = useState(0n)
  const [ymgpLPAmount, setYMGPLPAmount] = useState(0n)

  const [mgpRmgpCurveAmount] = useUpdateable(() => { return sendAmount === 0n ? Promise.resolve(0n) : contracts[chain].CMGP.read.get_dy([0n, 1n, sendAmount], { account }) }, [contracts, chain, sendAmount])
  const [rmgpMgpCurveAmount] = useUpdateable(() => { return sendAmount === 0n ? Promise.resolve(0n) : contracts[chain].CMGP.read.get_dy([1n, 0n, sendAmount], { account }) }, [contracts, chain, sendAmount])
  const [rmgpYmgpCurveAmount] = useUpdateable(() => { return sendAmount === 0n ? Promise.resolve(0n) : contracts[chain].CMGP.read.get_dy([1n, 2n, sendAmount], { account }) }, [contracts, chain, sendAmount])

  return { sendAmount, setSendAmount, mgpRmgpCurveAmount, rmgpMgpCurveAmount, rmgpYmgpCurveAmount, mgpLPAmount, setMGPLPAmount, rmgpLPAmount, setRMGPLPAmount, ymgpLPAmount, setYMGPLPAmount }
}