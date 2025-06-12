import { contracts, type PrimaryCoin } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../../state/useAllowances";
import type { wagmiConfig } from "../..";

interface Props {
  allowances: ReturnType<typeof useAllowances>;
  send: bigint;
  setError: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const curveBuy = ({ allowances, send, setError, chain }: Props) => (tokenIn: PrimaryCoin, tokenOut: PrimaryCoin, writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  const curveIndex = { MGP: 0n, wstMGP: 1n, yMGP: 2n, vMGP: 3n } as const;
  const indexIn = curveIndex[tokenIn];
  const indexOut = curveIndex[tokenOut];
  if (allowances.cMGP_wstMGP < send) return setError("Allowance too low");
  writeContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "exchange", args: [indexIn, indexOut, send, 0n] });
};
