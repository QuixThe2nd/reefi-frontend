import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
  contracts: Contracts;
}

export const mintWETH = ({ send, chain, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]): void => {
  writeContract({ abi: ABIs.WETH, address: contracts[chain].WETH, functionName: "deposit", value: send });
};
