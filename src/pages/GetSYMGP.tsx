/* eslint @stylistic/no-extra-parens: 0 */
import { aprToApy } from "../utilities";
import { useState, type ReactElement } from "react";
import { useWriteSaveContract } from "../hooks/useWriteSaveContract";

import { AmountInput } from "../components/AmountInput";
import { AmountOutput } from "../components/AmountOutput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { CoreCoin } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  readonly ymgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly symgpBalance: bigint;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mgpAPR: number;
  readonly stmgpSupply: bigint;
  readonly ymgpLocked: bigint;
}

export const GetSYMGP = ({ ymgpBalance, rmgpBalance, symgpBalance, setSend, send, nativeSwap, mgpAPR, stmgpSupply, ymgpLocked }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteSaveContract("syMGP Minted");
  const [deposit, setDeposit] = useState(true);

  return <Page info={[<span key="lock ymgp">yMGP and rMGP can be locked 1:1 to earn additional auto-compounded yield. 5% of protocol yield and 25% of yMGP withdrawals are paid to syMGP.</span>, <span key="locked ymgp governance">syMGP holders are able to vote on Reefi governance proposals.</span>]}>
    {deposit}
    {deposit ? <>
      <AmountInput balance={ymgpBalance} label="Deposit yMGP" onChange={setSend} token={{ symbol: "yMGP" }} value={send} />
      <AmountInput balance={rmgpBalance} label="Deposit rMGP" onChange={setSend} token={{ symbol: "rMGP" }} value={send} />
    </> : <AmountInput balance={symgpBalance} label="Withdraw syMGP" onChange={setSend} token={{ symbol: "syMGP" }} value={send} />}
    <button className="flex justify-center py-4 w-full" onClick={() => setDeposit(d => !d)} type="button">
      <svg aria-hidden="true" className="size-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
    </button>
    {/* DO NOT REMOVE THESE BRACKETS OR PRECISION WILL BE LOST: */}
    {deposit ? <AmountOutput balance={symgpBalance} label="Get syMGP" token={{ symbol: "syMGP" }} /> : <>
      <AmountOutput balance={ymgpBalance} label="Get yMGP" token={{ symbol: "yMGP" }} />
      <AmountOutput balance={rmgpBalance} label="Get rMGP" token={{ symbol: "rMGP" }} />
    </>}
    <Button className="w-full" isLoading={isPending} onClick={() => nativeSwap(deposit ? "yMGP" : "syMGP", deposit ? "syMGP" : "yMGP", writeContract)} type="submit">{deposit ? "Deposit" : "Withdraw"}</Button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Base APY</span>
        <span>{Math.round(10_000 * aprToApy(mgpAPR) * 0.9) / 100}%</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Additional APY</span>
        <span>{Math.round(10_000 * (Number(stmgpSupply) * aprToApy(mgpAPR) * 0.05 / Number(ymgpLocked * 2n))) / 100}%+</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Total APY</span>
        <span>{Math.round(10_000 * (Number(stmgpSupply) * aprToApy(mgpAPR) * 0.05 / Number(ymgpLocked * 2n) + aprToApy(mgpAPR) * 0.9)) / 100}%+</span>
      </div>
    </div>
  </Page>;
};
