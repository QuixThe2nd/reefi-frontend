/* eslint functional/no-try-statements: 0 */
import { contracts } from "../config/contracts";
import { useAccount, useBalance, useChainId, useReadContract } from "wagmi";

import { ABIs } from "../config/ABIs/abis";

export const useBalances = () => {
  const { address } = useAccount();
  const chainId = useChainId();

  const balances = {
    user: {
      CKP: useBalance({ address, token: contracts[chainId].CKP }).data?.value ?? 0n,
      EGP: useBalance({ address, token: contracts[chainId].EGP }).data?.value ?? 0n,
      LTP: useBalance({ address, token: contracts[chainId].LTP }).data?.value ?? 0n,
      MGP: useBalance({ address, token: contracts[chainId].MGP }).data?.value ?? 0n,
      PNP: useBalance({ address, token: contracts[chainId].PNP }).data?.value ?? 0n,
      WETH: useBalance({ address, token: contracts[chainId].WETH }).data?.value ?? 0n,
      cMGP: useBalance({ address, token: contracts[chainId].cMGP }).data?.value ?? 0n,
      wstMGP: useBalance({ address, token: contracts[chainId].wstMGP }).data?.value ?? 0n,
      yMGP: useBalance({ address, token: contracts[chainId].yMGP }).data?.value ?? 0n,
      lyMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chainId].yMGP, functionName: "lockedBalances", args: [address!] }).data ?? 0n,
      stMGP: useBalance({ address, token: contracts[chainId].stMGP }).data?.value ?? 0n,
      vlMGP: useBalance({ address, token: contracts[chainId].vlMGP }).data?.value ?? 0n,
      lvMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chainId].yMGP, functionName: "lockedBalances", args: [address!] }).data ?? 0n,
      vMGP: useBalance({ address, token: contracts[chainId].vMGP }).data?.value ?? 0n,
      ETH: useBalance({ address }).data?.value ?? 0n
    },
    curve: {
      MGP: useBalance({ token: contracts[chainId].MGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      wstMGP: useBalance({ token: contracts[chainId].wstMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      yMGP: useBalance({ token: contracts[chainId].yMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n,
      vMGP: useBalance({ token: contracts[chainId].vMGP, address: contracts[chainId].cMGP }).data?.value ?? 0n
    },
    wstMGP: { MGP: useReadContract({ abi: ABIs.vlMGP, address: contracts[chainId].vlMGP, functionName: "getUserTotalLocked", args: [contracts[chainId].wstMGP] }).data ?? 0n },
    yMGP: { wstMGP: useBalance({ token: contracts[chainId].wstMGP, address: contracts[chainId].yMGP }).data?.value ?? 0n },
    vMGP: { yMGP: useBalance({ token: contracts[chainId].yMGP, address: contracts[chainId].vMGP }).data?.value ?? 0n }
  } as const;

  return balances;
};
