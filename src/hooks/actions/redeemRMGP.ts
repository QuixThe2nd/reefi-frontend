import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

interface Properties {
  send: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const redeemRMGP = ({ send, chain }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "startUnlock", args: [send] });
};
