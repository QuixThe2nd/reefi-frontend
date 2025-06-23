import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../ABIs/abis";

import { type Contracts, type CoreCoin } from "./useContracts";

export type Supplies = Record<Exclude<CoreCoin, "bMGP"> | "stMGP_shares", bigint>;

export const useSupplies = ({ contracts }: { contracts: Contracts }): Supplies => {
  const chain = useChainId();

  return {
    MGP: 1_000_000_000_000_000_000_000_000_000n, // 1 Billion
    wstMGP: useReadContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "totalSupply" }).data ?? 0n,
    yMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "totalSupply" }).data ?? 0n,
    vMGP: useReadContract({ abi: ABIs.vMGP, address: contracts[chain].vMGP, functionName: "totalSupply" }).data ?? 0n,
    syMGP: useReadContract({ abi: ABIs.syMGP, address: contracts[chain].syMGP, functionName: "totalSupply" }).data ?? 0n,
    stMGP: useReadContract({ abi: ABIs.stMGP, address: contracts[chain].stMGP, functionName: "totalSupply" }).data ?? 0n,
    stMGP_shares: useReadContract({ abi: ABIs.stMGP, address: contracts[chain].stMGP, functionName: "totalShares" }).data ?? 0n,
    rMGP: useReadContract({ abi: ABIs.rMGP, address: contracts[chain].rMGP, functionName: "totalSupply" }).data ?? 0n,
    vlMGP: (useReadContract({ chainId: 56, abi: ABIs.vlMGP, address: contracts[56].vlMGP, functionName: "totalSupply" }).data ?? 0n) + (useReadContract({ chainId: 42_161, abi: ABIs.vlMGP, address: contracts[42_161].vlMGP, functionName: "totalSupply" }).data ?? 0n)
  };
};
