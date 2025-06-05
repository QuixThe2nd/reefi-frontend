import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { UseAmounts } from "../hooks/useAmounts";

interface Properties {
  readonly send: UseAmounts["amounts"]["send"];
  readonly setSendAmount: (_amount: bigint) => void;
  readonly unlockYMGP: () => void;
  readonly lymgpBalance: bigint;
}

const UnlockPageComponent = ({ send, setSendAmount, unlockYMGP, lymgpBalance }: Properties): ReactElement => <Page info={["yMGP can be unlocked instantly. Unlocked yMGP earns the underlying rMGP yield, but forfeits the additional yield."]}>
  <AmountInput balance={lymgpBalance} label="Get yMGP" onChange={setSendAmount} token={{ symbol: "lyMGP" }} value={send} />
  <Button className="w-full" onClick={unlockYMGP} type="submit">Unlock yMGP</Button>
</Page>;
export const UnlockPage = memo(UnlockPageComponent);
