import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

interface Properties {
  mgpLPAmount: bigint;
  rmgpLPAmount: bigint;
  ymgpLPAmount: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const supplyLiquidity = ({ mgpLPAmount, rmgpLPAmount, ymgpLPAmount, chain }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "add_liquidity", args: [[mgpLPAmount, rmgpLPAmount, ymgpLPAmount], 0n] });
};
