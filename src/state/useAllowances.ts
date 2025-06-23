import { useAccount, useChainId, useReadContract } from "wagmi";

import { ABIs } from "../ABIs/abis";

import { type Contracts, type CurveCoin, type SecondaryCoin } from "./useContracts";

type CurveAllowances = Record<CurveCoin, bigint>;
type OdosAllowances = Record<Exclude<SecondaryCoin, "ETH">, bigint>;

export const useAllowances = ({ contracts }: { contracts: Contracts }) => {
  const chain = useChainId();
  const { address } = useAccount();

  const stMGP_MGP = useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].stMGP] }).data ?? 0n;
  const curve: CurveAllowances = {
    MGP: useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    yMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    stMGP: useReadContract({ abi: ABIs.stMGP, address: contracts[chain].stMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    rMGP: useReadContract({ abi: ABIs.rMGP, address: contracts[chain].rMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n,
    vMGP: useReadContract({ abi: ABIs.vMGP, address: contracts[chain].vMGP, functionName: "allowance", args: [address!, contracts[chain].cMGP] }).data ?? 0n
  };
  const odos: OdosAllowances = {
    CKP: useReadContract({ abi: ABIs.CKP, address: contracts[chain].CKP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    EGP: useReadContract({ abi: ABIs.EGP, address: contracts[chain].EGP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    LTP: useReadContract({ abi: ABIs.LTP, address: contracts[chain].LTP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    MGP: useReadContract({ abi: ABIs.MGP, address: contracts[chain].MGP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    PNP: useReadContract({ abi: ABIs.PNP, address: contracts[chain].PNP, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n,
    WETH: useReadContract({ abi: ABIs.WETH, address: contracts[chain].WETH, functionName: "allowance", args: [address!, contracts[chain].odosRouter] }).data ?? 0n
  };
  return { stMGP_MGP, curve, odos };
};
