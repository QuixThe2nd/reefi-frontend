import { ABIs } from "../ABIs/abis";

import { type Contracts, curveIndexes, type CurveCoin } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { wagmiConfig } from "..";

interface Props {
  allowances: ReturnType<typeof useAllowances>["curve"];
  send: bigint;
  setError: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
  contracts: Contracts;
}

export type BuyOnCurve = (_tokenIn: CurveCoin, _tokenOut: CurveCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;

export const buyOnCurve = ({ allowances, send, setError, chain, contracts }: Props): BuyOnCurve => (tokenIn: CurveCoin, tokenOut: CurveCoin, writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  const indexIn = curveIndexes[tokenIn];
  const indexOut = curveIndexes[tokenOut];
  if (allowances.stMGP < send) return setError("Allowance too low");
  writeContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "exchange", args: [indexIn, indexOut, send, 0n] });
};
