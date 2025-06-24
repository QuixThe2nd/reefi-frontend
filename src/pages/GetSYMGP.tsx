import { aprToApy } from "../utilities";
import { useWriteSaveContract } from "../hooks/useWriteSaveContract";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { CoreCoin } from "../state/useContracts";
import { type ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  readonly ymgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mgpAPR: number;
  readonly reefiLockedMGP: bigint;
  readonly ymgpLocked: bigint;
}

export const GetSYMGP = ({ ymgpBalance, rmgpBalance, setSend, send, nativeSwap, mgpAPR, reefiLockedMGP, ymgpLocked }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteSaveContract("syMGP Minted");
  return <Page info={[<span key="lock ymgp">yMGP and rMGP can be locked 1:1 to earn additional auto-compounded yield. 5% of protocol yield and 25% of yMGP withdrawals are paid to syMGP.</span>, <span key="locked ymgp governance">syMGP holders are able to vote on Reefi governance proposals.</span>]}>
    <AmountInput balance={ymgpBalance} label="Lock yMGP" onChange={setSend} token={{ symbol: "yMGP" }} value={send} />
    <AmountInput balance={rmgpBalance} label="Lock rMGP" onChange={setSend} token={{ symbol: "rMGP" }} value={send} />
    <Button className="w-full" isLoading={isPending} onClick={() => nativeSwap("yMGP", "syMGP", writeContract)} type="submit">Deposit</Button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Base APY</span>
        <span>{Math.round(10_000 * aprToApy(mgpAPR) * 0.9) / 100}%</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Additional APY</span>
        <span>{Math.round(10_000 * (Number(reefiLockedMGP) * aprToApy(mgpAPR) * 0.05 / Number(ymgpLocked))) / 100}%+</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Total APY</span>
        <span>{Math.round(10_000 * (Number(reefiLockedMGP) * aprToApy(mgpAPR) * 0.05 / Number(ymgpLocked) + aprToApy(mgpAPR) * 0.9)) / 100}%+</span>
      </div>
    </div>
  </Page>;
};
