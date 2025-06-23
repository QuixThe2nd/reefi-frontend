import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useWriteContract } from "wagmi";

export const useWriteSaveContract = (description: string) => {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const addRecentTransaction = useAddRecentTransaction();

  if (hash) addRecentTransaction({ hash, description });
  return { writeContract, isPending };
};
