import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

export const withdrawMGP = ({ chain }: { chain: typeof wagmiConfig["chains"][number]["id"] }) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ address: contracts[chain].wstMGP, abi: ABIs.wstMGP, functionName: "unlock" });
  writeContract({ address: contracts[chain].wstMGP, abi: ABIs.wstMGP, functionName: "withdraw" });
};
