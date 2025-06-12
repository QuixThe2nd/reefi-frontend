import { contracts, type PrimaryCoin, type SecondaryCoin } from "../config/contracts";
import { useAccount, useChainId, useReadContract } from "wagmi";

import { ABIs } from "../config/ABIs/abis";

type FlattenRecord<T extends Record<string, bigint>, Prefix extends string> = {
  [K in keyof T as `${Prefix}_${string & K}`]: bigint;
};

type Allowances = {
  wstMGP_MGP: bigint;
  stMGP_wstMGP: bigint;
  yMGP_wstMGP: bigint;
  lyMGP_yMGP: bigint;
  vMGP_yMGP: bigint;
  lvMGP_vMGP: bigint;
} & FlattenRecord<Record<PrimaryCoin, bigint>, "cMGP">
& FlattenRecord<Record<SecondaryCoin, bigint>, "odos">;

export const useAllowances = () => {
  const chain = useChainId();
  const { address } = useAccount();
  const allowances: Allowances = {
    wstMGP_MGP: useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].wstMGP] }).data ?? 0n,
    stMGP_wstMGP: 0n,
    yMGP_wstMGP: useReadContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "allowance", args: [address!, contracts[chain].yMGP] }).data ?? 0n,
    lyMGP_yMGP: 0n,
    vMGP_yMGP: 0n,
    lvMGP_vMGP: 0n,
    cMGP_MGP: useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    cMGP_wstMGP: useReadContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    cMGP_yMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    cMGP_vMGP: 0n,
    odos_CKP: useReadContract({ abi: ABIs.CKP, address: contracts[chain].CKP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    odos_EGP: useReadContract({ abi: ABIs.EGP, address: contracts[chain].EGP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    odos_LTP: useReadContract({ abi: ABIs.LTP, address: contracts[chain].LTP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    odos_MGP: useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    odos_PNP: useReadContract({ abi: ABIs.PNP, address: contracts[chain].PNP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    odos_WETH: useReadContract({ abi: ABIs.WETH, address: contracts[chain].WETH, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n
  };

  return allowances;
};
