import { useAccount, useBalance, useChainId } from "wagmi";

import { type Contracts, type AllCoin, type CurveCoin } from "./useContracts";

export interface Balances {
  user: Record<Exclude<AllCoin, "bMGP">, bigint>;
  curve: Record<CurveCoin, bigint>;
  wstMGP: { stMGP: bigint };
  syMGP: { yMGP: bigint };
}

export const useBalances = ({ contracts }: { contracts: Contracts }) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const useUserBalance = (coin: Exclude<AllCoin, "bMGP">) => useBalance({ address, token: coin === "ETH" ? undefined : contracts[chainId][coin] }).data?.value ?? 0n;

  const balances: Balances = {
    user: {
      CKP: useUserBalance("CKP"),
      EGP: useUserBalance("EGP"),
      LTP: useUserBalance("LTP"),
      MGP: useUserBalance("MGP"),
      rMGP: useUserBalance("rMGP"),
      PNP: useUserBalance("PNP"),
      WETH: useUserBalance("WETH"),
      cMGP: useUserBalance("cMGP"),
      wstMGP: useUserBalance("wstMGP"),
      yMGP: useUserBalance("yMGP"),
      stMGP: useUserBalance("stMGP"),
      vlMGP: useUserBalance("vlMGP"),
      vMGP: useUserBalance("vMGP"),
      syMGP: useUserBalance("syMGP"),
      ETH: useUserBalance("ETH")
    },
    curve: {
      MGP: useBalance({ token: contracts[chainId].MGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      stMGP: useBalance({ token: contracts[chainId].stMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      yMGP: useBalance({ token: contracts[chainId].yMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      vMGP: useBalance({ token: contracts[chainId].vMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      rMGP: useBalance({ token: contracts[chainId].vMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n
    },
    wstMGP: { stMGP: useBalance({ token: contracts[chainId].stMGP, address: contracts[chainId].wstMGP }).data?.value ?? 0n },
    syMGP: { yMGP: useBalance({ token: contracts[chainId].yMGP, address: contracts[chainId].syMGP }).data?.value ?? 0n }
  } as const;

  return balances;
};
