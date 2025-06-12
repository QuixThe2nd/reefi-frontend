import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { CoreCoinExtended } from "../config/contracts";
import type { wagmiConfig } from "..";

interface Properties {
  readonly ymgpBalance: bigint;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly nativeSwap: (_tokenIn: CoreCoinExtended, _tokenOut: CoreCoinExtended, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mgpAPR: number;
  readonly reefiLockedMGP: bigint;
  readonly ymgpLocked: bigint;
}

export const LockPage = memo(({ ymgpBalance, setSend, send, nativeSwap, mgpAPR, reefiLockedMGP, ymgpLocked }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteContract();
  return <Page info={[<span key="lock ymgp">yMGP can be locked to earn additional yield paid in wstMGP. 5% of protocol yield and 25% of yMGP withdrawals are paid to yMGP lockers.</span>, <span key="locked ymgp governance">Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi&apos;s vlMGP.</span>]}>
    <AmountInput balance={ymgpBalance} label="Lock yMGP" onChange={setSend} token={{ symbol: "yMGP" }} value={send} />
    <Button className="w-full" isLoading={isPending} onClick={() => nativeSwap("yMGP", "lyMGP", writeContract)} type="submit">Lock yMGP</Button>
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
});
LockPage.displayName = "LockPage";
