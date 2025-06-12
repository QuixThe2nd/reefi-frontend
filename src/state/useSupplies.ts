import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../config/ABIs/abis";

export const useSupplies = () => {
  const chain = useChainId();
  return {
    MGP: 1_000_000_000_000_000_000_000_000_000n, // 1 Billion
    wstMGP: useReadContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "totalSupply" }).data ?? 0n,
    yMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "totalSupply" }).data ?? 0n,
    vMGP: parseEther(8),
    lyMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "totalLocked" }).data ?? 0n,
    lvMGP: parseEther(2),
    vlMGP: (useReadContract({ abi: ABIs.vlMGP, address: contracts[56].vlMGP, functionName: "totalSupply" }).data ?? 0n) + (useReadContract({ abi: ABIs.vlMGP, address: contracts[42_161].vlMGP, functionName: "totalSupply" }).data ?? 0n)
  };
};
