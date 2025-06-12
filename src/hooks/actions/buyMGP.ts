import { contracts } from "../../config/contracts";

import { ABIs } from "../../config/ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../../state/useAllowances";
import type { wagmiConfig } from "../..";

interface Properties {
  allowances: ReturnType<typeof useAllowances>;
  send: bigint;
  setError: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
}

export const buyMGP = ({ allowances, send, setError, chain }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (allowances.cMGP_wstMGP < send) return setError("Allowance too low");
  writeContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "exchange", args: [1n, 0n, send, 0n] });
};

