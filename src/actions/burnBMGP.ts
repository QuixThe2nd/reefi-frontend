import { ABIs } from "../ABIs/abis";

import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  address: `0x${string}` | undefined;
  setError: (_message: string) => void;
}

export const burnBMGP = ({ send, address, setError }: Properties) => (writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"], bondAddress: `0x${string}`) => {
  if (!address) return setError("Wallet not connected");
  writeContract({ abi: ABIs.bMGP, address: bondAddress, functionName: "redeem", args: [send] });
};
