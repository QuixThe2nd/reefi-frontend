import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Page } from "../components/Page";
import { Button } from "../components/Button";

interface Properties {
  readonly sendAmount: bigint;
  readonly setSendAmount: (_amount: bigint) => void;
  readonly unlockYMGP: () => void;
  readonly ymgpBalance: bigint;
}

const UnlockPageComponent = ({ sendAmount, setSendAmount, unlockYMGP, ymgpBalance }: Properties): ReactElement => <Page info={["yMGP can be unlocked instantly. Unlocked yMGP earns the underlying rMGP yield, but forfeits the additional yield."]}>
  <AmountInput balance={ymgpBalance} label="Get yMGP" onChange={setSendAmount} token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }} value={sendAmount} />
  <Button className="w-full" onClick={unlockYMGP} type="submit">Unlock yMGP</Button>
</Page>;
export const UnlockPage = memo(UnlockPageComponent);
