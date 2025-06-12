import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

export const claimVMGPRewards = ({ chain }: { chain: typeof wagmiConfig["chains"][number]["id"] }) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.vMGP, address: contracts[chain].vMGP, functionName: "claim" });
};
