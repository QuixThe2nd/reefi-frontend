import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  chain: typeof wagmiConfig["chains"][number]["id"];
  contracts: Contracts;
}

export const compoundSTMGP = ({ chain, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.stMGP, address: contracts[chain].stMGP, functionName: "compound" });
};
