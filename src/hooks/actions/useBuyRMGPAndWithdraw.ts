import { useCallback } from "react";

interface Properties {
  buyRMGP: () => Promise<void>;
  withdrawMGP: () => Promise<void>;
}

export const useBuyRMGPAndWithdraw = ({ buyRMGP, withdrawMGP }: Properties): () => Promise<void> => useCallback(async (): Promise<void> => {
  await buyRMGP();
  await withdrawMGP();
}, []);
