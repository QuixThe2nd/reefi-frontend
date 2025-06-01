import { formatEther } from "../utilities";
import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { BuyOnCurve } from "../components/BuyOnCurve";
import { InfoCard } from "../components/InfoCard";
import { TokenApproval } from "../components/TokenApproval";

interface Properties {
  readonly sendAmount: bigint;
  readonly ymgpAllowance: bigint;
  readonly ymgpAllowanceCurve: bigint;
  readonly ymgpBalance: bigint;
  readonly ymgpVmgpCurveAmount: bigint;
  readonly onApprove: (_infinity: boolean) => Promise<void>;
  readonly setSendAmount: (_value: bigint) => void;
  readonly depositYMGP: () => Promise<void>;
  readonly buyVMGP: () => Promise<void>;
}

export const BuyVotesPage = memo(({ sendAmount, ymgpAllowance, ymgpAllowanceCurve, ymgpBalance, ymgpVmgpCurveAmount, onApprove, setSendAmount, depositYMGP, buyVMGP }: Properties): ReactElement => <>
  <div className="rounded-lg">
    <AmountInput balance={ymgpBalance} label="Get vMGP" onChange={setSendAmount} token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }} value={sendAmount} />
    <div className="mb-4 grid grid-cols-1 gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <TokenApproval allowance={ymgpAllowance} onApprove={onApprove} sendAmount={sendAmount} tokenSymbol='yMGP' />
          <button className="h-min w-full rounded-lg bg-green-600 py-2 transition-colors hover:bg-green-700" onClick={depositYMGP} type="submit">Mint ({formatEther(sendAmount)} vMGP)</button>
        </div>
        <BuyOnCurve allowanceCurve={ymgpAllowanceCurve} buy={buyVMGP} curveAmount={ymgpVmgpCurveAmount} nativeRate={1} onApprove={onApprove} sendAmount={sendAmount} tokenASymbol='yMGP' tokenBSymbol='vMGP' />
      </div>
    </div>
  </div>

  <InfoCard text="vMGP is backed 1:1 by yMGP. This process can not be undone. vMGP is used to vote on Magpie proposals with Reefi's underlying vlMGP." />
</>);
BuyVotesPage.displayName = "BuyVotesPage";
