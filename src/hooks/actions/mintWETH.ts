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

export const mintWETH = ({ allowances, send, setError, chain }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]): void => {
  if (allowances.wstMGP_MGP < send) return setError("Allowance too low");
  writeContract({ abi: ABIs.WETH, address: contracts[chain].WETH, functionName: "deposit", value: send });
};
