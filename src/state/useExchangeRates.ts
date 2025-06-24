import { parseEther } from "../utilities";
import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../ABIs/abis";

import { type Contracts, type CurveCoin, curveIndexes } from "./useContracts";
import type { Supplies } from "./useSupplies";

type ExchangeRates<T extends readonly string[]> = {
  [K in T[number]]: {
    [_P in Exclude<T[number], K>]: number;
  };
};

export const useExchangeRates = ({ contracts, supplies }: { contracts: Contracts; supplies: Supplies }): ExchangeRates<CurveCoin[]> & { wstMGP: { stMGP: number; yMGP: number } } => {
  const chain = useChainId();
  return {
    MGP: {
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.stMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.rMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001))
    },
    stMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.MGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.rMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001))
    },
    yMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.MGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.stMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.rMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001))
    },
    vMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.MGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.stMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.rMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001))
    },
    rMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.MGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.stMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001))
    },
    wstMGP: {
      stMGP: Number(supplies.stMGP) / Number(supplies.stMGP_shares),
      yMGP: Number(supplies.stMGP) / Number(supplies.stMGP_shares) / (Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, parseEther(0.000_000_001)] }).data) / Number(parseEther(0.000_000_001)))
    }
  };
};
