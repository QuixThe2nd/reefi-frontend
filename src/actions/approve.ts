import { ABIs } from "../ABIs/abis";

import { type Contracts, type CurveCoin, type SecondaryCoin } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
  contracts: Contracts;
}
type WriteContract = UseWriteContractReturnType<typeof wagmiConfig>["writeContract"];

type SupportedCoins = CurveCoin | Exclude<SecondaryCoin, "ETH"> | "MGP";
type Spender = "stMGP" | "cMGP" | "odosRouter";
export type ApproveFunction = (_coin: SupportedCoins, _spender: Spender, _infinity: boolean, _writeContract: WriteContract) => void;

export const approve = ({ send, chain, contracts }: Properties): ApproveFunction => (coin: SupportedCoins, spender: Spender, infinity: boolean, writeContract: WriteContract): void => {
  const amount = infinity ? 2n ** 256n - 1n : send;
  writeContract({ abi: ABIs[coin], address: contracts[chain][coin], functionName: "approve", args: [contracts[chain][spender], amount] });
};
