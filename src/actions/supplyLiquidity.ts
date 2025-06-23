import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  MGP: bigint;
  stMGP: bigint;
  yMGP: bigint;
  vMGP: bigint;
  rMGP: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
  contracts: Contracts;
}

export const supplyLiquidity = ({ MGP, stMGP, yMGP, vMGP, rMGP, chain, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  writeContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "add_liquidity", args: [[MGP, stMGP, yMGP, vMGP, rMGP], 0n] });
};
