import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { AmountInput } from "../components/AmountInput";
import { Page } from "../components/Page";

export const LockPage = memo((): ReactElement => {
  const { actions, rewards, balances, amounts, locked } = useGlobalContext();
  return <Page info={["yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.", "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."]}>
    <AmountInput balance={balances.yMGP[0]} label="Lock yMGP" onChange={amounts.setSend} token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }} value={amounts.send} />
    <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={actions.lockYMGP} type="submit">Lock yMGP</button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Base APY</span>
        <span>{Math.round(10_000 * aprToApy(rewards.mgpAPR) * 0.9) / 100}%</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Additional APY</span>
        <span>{Math.round(10_000 * (Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(locked.ymgp))) / 100}%+</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Total APY</span>
        <span>{Math.round(10_000 * (Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(locked.ymgp) + aprToApy(rewards.mgpAPR) * 0.9)) / 100}%+</span>
      </div>
    </div>
  </Page>;
});
LockPage.displayName = "LockPage";
