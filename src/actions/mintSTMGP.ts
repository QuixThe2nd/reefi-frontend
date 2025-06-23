import { ABIs } from "../ABIs/abis";

import type { Contracts } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  allowance: bigint;
  send: bigint;
  setError: (_value: string) => void;
  chain: typeof wagmiConfig["chains"][number]["id"];
  address: `0x${string}` | undefined;
  contracts: Contracts;
}

export const mintSTMGP = ({ allowance, send, setError, chain, address, contracts }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (allowance < send) return setError("Allowance too low");
  if (!address) return setError("Wallet not connected");
  writeContract({ abi: ABIs.stMGP, address: contracts[chain].stMGP, functionName: "deposit", args: [send, address] });
};
