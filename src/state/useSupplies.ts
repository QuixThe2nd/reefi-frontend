import { contracts, CoreCoin } from "../config/contracts";
import { useAsyncReducer } from "../hooks/useAsyncReducer";
import { useEffect } from "react";
import { useWallet } from "./useWallet";

export const useSupplies = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }) => {
  const [supplies, updateSupplies] = useAsyncReducer<Record<CoreCoin, bigint>>(async () => {
    const results = await Promise.allSettled([
      contracts[56].MGP.read.totalSupply(),
      contracts[wallet.chain].rMGP.read.totalSupply(),
      contracts[wallet.chain].yMGP.read.totalSupply(),
      contracts[wallet.chain].vMGP.read.totalSupply(),
      contracts[wallet.chain].yMGP.read.totalLocked(),
      contracts[wallet.chain].lvMGP.read.totalSupply(),
      Promise.resolve(await contracts[56].vlMGP.read.totalSupply() + await contracts[42_161].vlMGP.read.totalSupply())
    ]);
    const [MGP, rMGP, yMGP, vMGP, lyMGP, lvMGP, vlMGP] = results.map(result => result.status === "fulfilled" ? result.value : 0n) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint];
    return { MGP, rMGP, yMGP, vMGP, lyMGP, lvMGP, vlMGP };
  }, { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n, vlMGP: 0n, lyMGP: 0n, lvMGP: 0n });

  useEffect(() => {
    updateSupplies();
  }, [wallet.chain]);
  return [supplies] as const;
};
