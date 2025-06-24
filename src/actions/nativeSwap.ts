import { burnBMGP } from "./burnBMGP";
import { burnSYMGP } from "./burnSYMGP";
import { burnWSTMGP } from "./burnWSTMGP";
import { burnYMGP } from "./burnYMGP";
import { getBMGP } from "./getBMGP";
import { mintSTMGP } from "./mintSTMGP";
import { mintSYMGP } from "./mintSYMGP";
import { mintVMGP } from "./mintVMGP";
import { mintWSTMGP } from "./mintWSTMGP";
import { mintYMGP } from "./mintYMGP";

import type { Contracts, CoreCoin } from "../state/useContracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  send: bigint;
  stmgpMGPAllowance: bigint;
  setError: (_message: string) => void;
  startBMGPUnlock: boolean;
  bondAddress: `0x${string}`;
  chain: typeof wagmiConfig["chains"][number]["id"];
  address: `0x${string}` | undefined;
  contracts: Contracts;
}

export const nativeSwap = ({ send, stmgpMGPAllowance, setError, startBMGPUnlock, bondAddress, chain, address, contracts }: Properties) => (tokenIn: CoreCoin, tokenOut: CoreCoin, writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (tokenIn === "MGP") {
    if (tokenOut === "stMGP") return mintSTMGP({ send, allowance: stmgpMGPAllowance, setError, chain, address, contracts })(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "stMGP") {
    if (tokenOut === "bMGP") return getBMGP({ send, chain, address, setError, contracts })(writeContract, startBMGPUnlock);
    if (tokenOut === "wstMGP") return mintWSTMGP({ send, setError, chain, address, contracts })(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "wstMGP") {
    if (tokenOut === "stMGP") return burnWSTMGP({ send, chain, address, setError, contracts })(writeContract);
    if (tokenOut === "yMGP") return mintYMGP({ send, setError, chain, address, contracts })(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "yMGP") {
    if (tokenOut === "wstMGP") return burnYMGP({ send, chain, address, setError, contracts })(writeContract);
    if (tokenOut === "vMGP") return mintVMGP({ send, setError, chain, address, contracts })(writeContract);
    if (tokenOut === "syMGP") return mintSYMGP({ send, chain, address, setError, contracts })(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "syMGP") {
    if (tokenOut === "yMGP") return burnSYMGP({ send, chain, address, setError, contracts })(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "bMGP") {
    if (tokenOut === "stMGP") return burnBMGP({ send, address, setError })(writeContract, bondAddress);
    throw new Error("Unexpected native swap output");
  }
  throw new Error("Unexpected native swap input");
};
