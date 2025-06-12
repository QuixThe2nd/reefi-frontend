import { contracts, type TransferrableCoin } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

interface Properties {
  send: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const approve = ({ send, chain }: Properties) => (coin: TransferrableCoin, spender: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", infinity: boolean, writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]): void => {
  const amount = infinity ? 2n ** 256n - 1n : send;
  writeContract({ abi: ABIs[coin], address: contracts[chain][coin], functionName: "approve", args: [contracts[chain][spender], amount] });
};
