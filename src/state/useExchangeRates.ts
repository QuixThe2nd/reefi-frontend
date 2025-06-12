/* eslint functional/no-try-statements: 0 */
import { contracts } from "../config/contracts";
import { parseEther } from "../utilities";
import { useChainId, useReadContract } from "wagmi";

import { ABIs } from "../config/ABIs/abis";

export const useExchangeRates = () => {
  const chain = useChainId();
  const exchangeRates = {
    MGP: {
      wstMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [0n, 1n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [0n, 2n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      vMGP: 0.8
    },
    wstMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [1n, 0n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      yMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [1n, 2n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      vMGP: 1.3
    },
    yMGP: {
      MGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [2n, 0n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      wstMGP: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [2n, 1n, parseEther(0.5)] }).data) / Number(parseEther(0.5)),
      vMGP: 1.1
    },
    vMGP: {
      MGP: 1.2,
      wstMGP: 0.7,
      yMGP: 0.85
    }
  } as const;

  return exchangeRates;
};
