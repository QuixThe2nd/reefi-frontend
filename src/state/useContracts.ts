import CKP_icon from "../../public/icons/CKP.png";
import EGP_icon from "../../public/icons/EGP.png";
import LTP_icon from "../../public/icons/LTP.png";
import MGP_icon from "../../public/icons/MGP.png";
import PNP_icon from "../../public/icons/PNP.png";
import WETH_icon from "../../public/icons/WETH.png";
import bMGP_icon from "../../public/icons/bMGP.png";
import curve_icon from "../../public/icons/curve.png";
import rMGP_icon from "../../public/icons/rMGP.png";
import stMGP_icon from "../../public/icons/stMGP.png";
import syMGP_icon from "../../public/icons/syMGP.png";
import vMGP_icon from "../../public/icons/vMGP.png";
import vlMGP_icon from "../../public/icons/vlMGP.png";
import wstMGP_icon from "../../public/icons/wstMGP.png";
import yMGP_icon from "../../public/icons/yMGP.png";

import { useMemo } from "react";
import { useReadContract, type useChainId } from "wagmi";
import zod from "zod";

import { ABIs } from "../ABIs/abis";
import ETH_icon from "../../public/icons/ETH.svg";

import type { wagmiConfig } from "..";

export type Chains = 56 | 42_161;

export const CurveCoinSchema = zod.enum(["stMGP", "yMGP", "vMGP", "rMGP", "MGP"]);
export const PrimaryCoinSchema = zod.enum(["stMGP", "wstMGP", "yMGP", "vMGP", "rMGP", "bMGP", "MGP", "syMGP"]);
export type PrimaryCoin = zod.infer<typeof PrimaryCoinSchema>;
export type CurveCoin = zod.infer<typeof CurveCoinSchema>;

type LockedCoinMagpie = "vlMGP";

export type CoreCoin = PrimaryCoin | LockedCoinMagpie;

const SecondaryCoinSchema = zod.enum(["MGP", "CKP", "PNP", "EGP", "LTP", "WETH", "ETH"]);
export type SecondaryCoin = zod.infer<typeof SecondaryCoinSchema>;
export type TradeableCoin = PrimaryCoin | SecondaryCoin;

type NonTradeableCoin = "cMGP";
type TransferrableCoin = TradeableCoin | NonTradeableCoin;

export type AllCoin = TransferrableCoin | LockedCoinMagpie;

export const isCurveCoin = (value: string): value is CurveCoin => CurveCoinSchema.safeParse(value).success;
export const isPrimaryCoin = (value: string): value is PrimaryCoin => PrimaryCoinSchema.safeParse(value).success;
export const isSecondaryCoin = (value: string): value is SecondaryCoin => SecondaryCoinSchema.safeParse(value).success;

export type Contracts = Record<ReturnType<typeof useChainId<typeof wagmiConfig>>, Record<Exclude<keyof typeof ABIs, "bMGP">, `0x${string}`>>;

export const curveIndexes: Record<CurveCoin, bigint> = { MGP: 0n, stMGP: 1n, yMGP: 2n, vMGP: 3n, rMGP: 4n };

export const decimals: Record<AllCoin, number> = { CKP: 18, EGP: 18, ETH: 18, LTP: 18, MGP: 18, PNP: 18, WETH: 18, cMGP: 18, wstMGP: 18, vMGP: 18, yMGP: 18, syMGP: 18, stMGP: 18, vlMGP: 18, rMGP: 18, bMGP: 18 };
export const coins: Record<AllCoin, { color: string; bgColor: string; icon: `${string}.${"png" | "svg"}` }> = {
  CKP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: CKP_icon },
  EGP: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: EGP_icon },
  LTP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: LTP_icon },
  MGP: { bgColor: "bg-blue-600", color: "bg-blue-400", icon: MGP_icon },
  PNP: { bgColor: "bg-teal-600", color: "bg-teal-400", icon: PNP_icon },
  WETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: WETH_icon },
  ETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: ETH_icon },
  cMGP: { bgColor: "bg-indigo-600", color: "bg-indigo-400", icon: curve_icon },
  wstMGP: { bgColor: "bg-green-600", color: "bg-green-400", icon: wstMGP_icon },
  vMGP: { bgColor: "bg-red-600", color: "bg-red-400", icon: vMGP_icon },
  yMGP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: yMGP_icon },
  syMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: syMGP_icon },
  stMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: stMGP_icon },
  rMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: rMGP_icon },
  bMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: bMGP_icon },
  vlMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: vlMGP_icon }
} as const;

export const useContracts = () => {
  const contractIndexes = ["MGP", "stMGP", "yMGP", "vMGP", "rMGP", "vlMGP", "wstMGP", "syMGP", "WETH", "LockManager", "SwapRouter", "MasterMagpie", "cMGP"] as const;
  const contractRegistry = "0x620cB68013b62351373a5dC18daB2BdE2456A9B0";

  const MGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("MGP")] }).data!;
  const vlMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("vlMGP")] }).data!;
  const stMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("stMGP")] }).data!;
  const wstMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("wstMGP")] }).data!;
  const yMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("yMGP")] }).data!;
  const vMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("vMGP")] }).data!;
  const rMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("rMGP")] }).data!;
  const syMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("syMGP")] }).data!;
  const WETH = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("WETH")] }).data!;
  const masterMagpie = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("MasterMagpie")] }).data!;
  const lockManager = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("LockManager")] }).data!;
  const swapRouter = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("SwapRouter")] }).data!;
  const cMGP = useReadContract({ abi: ABIs.contractRegistry, address: contractRegistry, functionName: "getContract", args: [contractIndexes.indexOf("cMGP")] }).data!;

  const contracts: Contracts = useMemo(() => ({
    42_161: {
      MGP, vlMGP, stMGP, wstMGP, yMGP, vMGP, rMGP, syMGP, cMGP, swapRouter, lockManager, contractRegistry, masterMagpie, WETH,

      // Helpers
      odosRouter: "0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13",
      vlRewarder: "0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45",

      // Third Party Coins
      CKP: "0x346Af1954e3d6be46B96dA713a1f7fD2d1928F1d",
      EGP: "0x7E7a7C916c19a45769f6BDAF91087f93c6C12F78",
      LTP: "0xa73959804651eEd0D4bd04293A675cB832c20454",
      PNP: "0x2Ac2B254Bc18cD4999f64773a966E4f4869c34Ee"
    },
    56: {
      MGP, vlMGP, stMGP, wstMGP, yMGP, vMGP, rMGP, syMGP, cMGP, swapRouter, lockManager, contractRegistry, masterMagpie, WETH,

      // Helpers
      odosRouter: "0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E",
      vlRewarder: "0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9",

      // Third Party Coins
      CKP: "0x2b5d9adea07b590b638ffc165792b2c610eda649",
      EGP: "0x0cc7288a11c0c31d39d0e05eb59f24e506ad6ad5",
      LTP: "0x56fa5f7bf457454be33d8b978c86a5f5b9dd84c2",
      PNP: "0x5012c90f14d190607662ca8344120812aaa2639d"
    }
  }), [MGP, WETH, cMGP, lockManager, masterMagpie, rMGP, stMGP, swapRouter, syMGP, vMGP, vlMGP, wstMGP, yMGP]);

  return contracts;
};
