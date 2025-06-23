import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  setError: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
  address: `0x${string}` | undefined;
  contracts: Contracts;
}

export const mintYMGP = ({ send, setError, chain, address, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (!address) return setError("Wallet not connected");
  writeContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "deposit", args: [send, address] });
};
