import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { UseAmounts } from "../hooks/useAmounts";

interface Properties {
  readonly send: UseAmounts["amounts"]["send"];
  readonly setSendAmount: (_amount: bigint) => void;
  readonly unlockVMGP: () => void;
  readonly lvmgpBalance: bigint;
}

const UnlockVMGPPageComponent = ({ send, setSendAmount, unlockVMGP, lvmgpBalance }: Properties): ReactElement => <Page info={["vMGP can be unlocked instantly. By unlocking your vMGP you won't receive additional yield, but will be able to vote."]}>
  <AmountInput balance={lvmgpBalance} label="Get vMGP" onChange={setSendAmount} token={{ symbol: "lvMGP" }} value={send} />
  <Button className="w-full" onClick={unlockVMGP} type="submit">Unlock vMGP</Button>
</Page>;
export const UnlockVMGPPage = memo(UnlockVMGPPageComponent);
