import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../ABIs/abis";

import { type Contracts } from "./useContracts";

export interface Bond {
  startTime: bigint;
  endTime: bigint;
  amountInCoolDown: bigint;
}

export const useBonds = ({ contracts }: { contracts: Contracts }): readonly Bond[] => {
  const chain = useChainId();

  return useReadContract({ abi: ABIs.lockManager, address: contracts[chain].lockManager, functionName: "getUserUnlockingSchedule" }).data ?? [];
};
