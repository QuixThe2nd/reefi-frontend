import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Page } from "../components/Page";
import { Button } from "../components/Button";

interface Properties {
  ymgpBalance: bigint;
  setSend: (_send: bigint) => void;
  send: bigint;
  lockYMGP: () => void;
  mgpAPR: number;
  reefiLockedMGP: bigint;
  ymgpLocked: bigint;
}

export const LockPage = memo(({ ymgpBalance, setSend, send, lockYMGP, mgpAPR, reefiLockedMGP, ymgpLocked }: Properties): ReactElement => <Page info={["yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.", "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."]}>
  <AmountInput balance={ymgpBalance} label="Lock yMGP" onChange={setSend} token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }} value={send} />
  <Button className="w-full" onClick={lockYMGP} type="submit">Lock yMGP</Button>
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
</Page>);
LockPage.displayName = "LockPage";
