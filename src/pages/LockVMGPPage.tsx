import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

interface Properties {
  readonly vmgpBalance: bigint;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly lockVMGP: () => void;
  readonly mgpAPR: number;
}

export const LockVMGPPage = memo(({ vmgpBalance, setSend, send, lockVMGP, mgpAPR }: Properties): ReactElement => <Page info={<span>vMGP can be locked to earn additional yield paid in yMGP. Locked vMGP can&apos;t be voted with as it is rented to those willing to pay to vote for you.</span>}>
  <AmountInput balance={vmgpBalance} label="Lock vMGP" onChange={setSend} token={{ symbol: "vMGP" }} value={send} />
  <Button className="w-full" onClick={lockVMGP} type="submit">Lock yMGP</Button>
  <div className="mt-4 text-sm text-gray-400">
    <div className="mb-1 flex justify-between">
      <span>Base APY (Value Appreciation)</span>
      <span>{Math.round(10_000 * aprToApy(mgpAPR) * 0.9) / 100}%</span>
    </div>
    <div className="mb-1 flex justify-between">
      <span>Additional APR (Vote Purchases)</span>
      <span>Variable</span>
    </div>
  </div>
</Page>);
LockVMGPPage.displayName = "LockVMGPPage";
