import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

interface Properties {
  readonly sendAmount: bigint;
  readonly setSendAmount: (_amount: bigint) => void;
  readonly unlockVMGP: () => void;
  readonly lvmgpBalance: bigint;
}

const UnlockVMGPPageComponent = ({ sendAmount, setSendAmount, unlockVMGP, lvmgpBalance }: Properties): ReactElement => <Page info={["vMGP can be unlocked instantly. By unlocking your vMGP you won't receive additional yield, but will be able to vote."]}>
  <AmountInput balance={lvmgpBalance} label="Get vMGP" onChange={setSendAmount} token={{ symbol: "lvMGP" }} value={sendAmount} />
  <Button className="w-full" onClick={unlockVMGP} type="submit">Unlock vMGP</Button>
</Page>;
export const UnlockVMGPPage = memo(UnlockVMGPPageComponent);
