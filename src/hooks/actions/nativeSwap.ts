import type { CoreCoinExtended } from "../../config/contracts";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "../..";

export const nativeSwap = ({ depositMGPAction, redeemRMGPAction, depositRMGPAction, lockYMGPAction, unlockYMGPAction }: {
  depositMGPAction: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  redeemRMGPAction: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  depositRMGPAction: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  lockYMGPAction: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  unlockYMGPAction: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
}) => (tokenIn: CoreCoinExtended, tokenOut: CoreCoinExtended, writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => {
  if (tokenIn === "MGP") {
    if (tokenOut === "wstMGP") return depositMGPAction(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "wstMGP") {
    if (tokenOut === "MGP") return redeemRMGPAction(writeContract);
    if (tokenOut === "yMGP") return depositRMGPAction(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "yMGP") {
    if (tokenOut === "wstMGP") return TODO(writeContract);
    if (tokenOut === "vMGP") return TODO(writeContract);
    if (tokenOut === "lyMGP") return lockYMGPAction(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "lyMGP") {
    if (tokenOut === "yMGP") return unlockYMGPAction(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "vMGP") {
    if (tokenOut === "lvMGP") return TODO(writeContract);
    throw new Error("Unexpected native swap output");
  }
  if (tokenIn === "lvMGP") {
    if (tokenOut === "vMGP") return TODO(writeContract);
    throw new Error("Unexpected native swap output");
  }
};
