import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

interface Properties {
  vmgpBalance: bigint;
  setSend: (_send: bigint) => void;
  send: bigint;
  lockYMGP: () => void;
  mgpAPR: number;
}

export const LockVMGPPage = memo(({ vmgpBalance, setSend, send, lockYMGP, mgpAPR }: Properties): ReactElement => <Page info={["vMGP can be locked to earn additional yield paid in yMGP. Locked vMGP is rented out to others who are willing to pay to vote for you."]}>
  <AmountInput balance={vmgpBalance} label="Lock vMGP" onChange={setSend} token={{ symbol: "vMGP" }} value={send} />
  <Button className="w-full" onClick={lockYMGP} type="submit">Lock yMGP</Button>
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
