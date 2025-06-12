import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

interface Properties {
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const claimYMGPRewards = ({ chain }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "claim" });
};
