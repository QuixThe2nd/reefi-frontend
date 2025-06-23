import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  chain: typeof wagmiConfig["chains"][number]["id"];
  address: `0x${string}` | undefined;
  setError: (_message: string) => void;
  contracts: Contracts;
}

export const mintSYMGP = ({ send, chain, address, setError, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (!address) return setError("Wallet not connected");
  writeContract({ abi: ABIs.syMGP, address: contracts[chain].syMGP, functionName: "deposit", args: [send, address] });
};
