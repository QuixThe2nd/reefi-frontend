import { useWriteSaveContract } from "../hooks/useWriteSaveContract";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { CoreCoin } from "../state/useContracts";
import { type ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  readonly send: bigint;
  readonly setSendAmount: (_amount: bigint) => void;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly lymgpBalance: bigint;
}

export const BurnSYMGP = ({ send, setSendAmount, nativeSwap, lymgpBalance }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteSaveContract("syMGP Burned");
  return <Page info={<span>yMGP can be unlocked instantly. Unlocked yMGP earns the underlying wstMGP yield, but forfeits the additional yield.</span>}>
    <AmountInput balance={lymgpBalance} label="Get yMGP" onChange={setSendAmount} token={{ symbol: "syMGP" }} value={send} />
    <Button className="w-full" isLoading={isPending} onClick={() => nativeSwap("syMGP", "yMGP", writeContract)} type="submit">Unlock yMGP</Button>
  </Page>;
};

