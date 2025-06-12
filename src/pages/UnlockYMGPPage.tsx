import { memo, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { CoreCoin } from "../config/contracts";
import type { wagmiConfig } from "..";

interface Properties {
  readonly send: bigint;
  readonly setSendAmount: (_amount: bigint) => void;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly lymgpBalance: bigint;
}

const UnlockPageComponent = ({ send, setSendAmount, nativeSwap, lymgpBalance }: Properties): ReactElement => {
  const { writeContract } = useWriteContract();
  return <Page info={<span>yMGP can be unlocked instantly. Unlocked yMGP earns the underlying wstMGP yield, but forfeits the additional yield.</span>}>
    <AmountInput balance={lymgpBalance} label="Get yMGP" onChange={setSendAmount} token={{ symbol: "lyMGP" }} value={send} />
    <Button className="w-full" onClick={() => nativeSwap("yMGP", "MGP", writeContract)} type="submit">Unlock yMGP</Button>
  </Page>;
};
export const UnlockPage = memo(UnlockPageComponent);
