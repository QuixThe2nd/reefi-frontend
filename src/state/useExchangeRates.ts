import { formatEther, parseEther } from "../utilities";
import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../ABIs/abis";

import type { Balances } from "./useBalances";
import { type Contracts, type CurveCoin, curveIndexes } from "./useContracts";
import type { Supplies } from "./useSupplies";

type ExchangeRateMap<T extends readonly string[]> = {
  [K in T[number]]: {
    [_P in Exclude<T[number], K>]: number;
  };
};

interface Properties {
  contracts: Contracts;
  supplies: Supplies;
  balances: Balances;
}

const roundDownMagnitude = (num: number) => {
  if (num === 0) return 0n;
  const exponent = Math.floor(Math.log10(Math.abs(num))) - 1;
  const magnitude = 10 ** exponent;
  return parseEther(num >= 0 ? magnitude : -magnitude);
};

export type ExchangeRates = ExchangeRateMap<CurveCoin[]> & { wstMGP: { stMGP: number; yMGP: number } };

export const useExchangeRates = ({ contracts, supplies, balances }: Properties): ExchangeRates => {
  const swapAmount = roundDownMagnitude(formatEther(balances.curve.MGP));
  const chain = useChainId();
  return {
    MGP: {
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.stMGP, swapAmount] }).data) / Number(swapAmount),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.MGP, curveIndexes.rMGP, swapAmount] }).data) / Number(swapAmount)
    },
    stMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.MGP, swapAmount] }).data) / Number(swapAmount),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.rMGP, swapAmount] }).data) / Number(swapAmount)
    },
    yMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.MGP, swapAmount] }).data) / Number(swapAmount),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.stMGP, swapAmount] }).data) / Number(swapAmount),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.vMGP, swapAmount] }).data) / Number(swapAmount),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.yMGP, curveIndexes.rMGP, swapAmount] }).data) / Number(swapAmount)
    },
    vMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.MGP, swapAmount] }).data) / Number(swapAmount),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.stMGP, swapAmount] }).data) / Number(swapAmount),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      rMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.vMGP, curveIndexes.rMGP, swapAmount] }).data) / Number(swapAmount)
    },
    rMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.MGP, swapAmount] }).data) / Number(swapAmount),
      stMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.stMGP, swapAmount] }).data) / Number(swapAmount),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount),
      vMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.rMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount)
    },
    wstMGP: {
      stMGP: Number(supplies.stMGP) / Number(supplies.stMGP_shares),
      yMGP: Number(supplies.stMGP) / Number(supplies.stMGP_shares) / (Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes.stMGP, curveIndexes.yMGP, swapAmount] }).data) / Number(swapAmount))
    }
  };
};
