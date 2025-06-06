import CKP from "../../public/icons/CKP.png";
import EGP from "../../public/icons/EGP.png";
import LTP from "../../public/icons/LTP.png";
import MGP from "../../public/icons/MGP.png";
import PNP from "../../public/icons/PNP.png";
import WETH from "../../public/icons/WETH.png";
import curve from "../../public/icons/curve.png";
import lyMGP from "../../public/icons/lyMGP.png";
import rMGP from "../../public/icons/rMGP.png";
import vMGP from "../../public/icons/vMGP.png";
import vlMGP from "../../public/icons/vlMGP.png";
import yMGP from "../../public/icons/yMGP.png";

import { arbitrum, bsc, mainnet } from "viem/chains";
import { createPublicClient, erc20Abi, getContract, webSocket } from "viem";

import { ABIs } from "./ABIs/abis";
import ETH from "../../public/icons/ETH.svg";

export type Chains = 56 | 42_161;

export type PrimaryCoinMagpie = "MGP";
export type PrimaryCoinReefi = "rMGP" | "yMGP" | "vMGP";
export type PrimaryCoin = PrimaryCoinReefi | PrimaryCoinMagpie;

export type LockedCoinMagpie = "vlMGP";
export type LockedCoinReefi = "lyMGP" | "lvMGP";
export type LockedCoin = LockedCoinReefi | LockedCoinMagpie;

export type CoreCoin = PrimaryCoin | LockedCoin;

export type SecondaryCoin = "CKP" | "PNP" | "EGP" | "LTP" | "WETH" | PrimaryCoinMagpie;
export type TradeableCoin = PrimaryCoin | SecondaryCoin;

export type NonTradeableCoin = "wrMGP" | "cMGP";
export type TransferrableCoin = TradeableCoin | NonTradeableCoin;

export type AllERC20 = LockedCoin | TransferrableCoin;
export type AllCoin = LockedCoin | TransferrableCoin | "ETH";

export const decimals: Record<AllCoin, number> = { CKP: 18, EGP: 18, ETH: 18, LTP: 18, MGP: 18, PNP: 18, WETH: 18, cMGP: 18, rMGP: 18, vMGP: 18, yMGP: 18, lyMGP: 18, lvMGP: 18, wrMGP: 18, vlMGP: 18 };
export const coins: Record<AllCoin, { color: string; bgColor: string; icon: `${string}.${"png" | "svg"}` }> = {
  CKP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: CKP },
  EGP: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: EGP },
  LTP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: LTP },
  MGP: { bgColor: "bg-blue-600", color: "bg-blue-400", icon: MGP },
  PNP: { bgColor: "bg-teal-600", color: "bg-teal-400", icon: PNP },
  WETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: WETH },
  ETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: ETH },
  cMGP: { bgColor: "bg-indigo-600", color: "bg-indigo-400", icon: curve },
  rMGP: { bgColor: "bg-green-600", color: "bg-green-400", icon: rMGP },
  vMGP: { bgColor: "bg-red-600", color: "bg-red-400", icon: vMGP },
  yMGP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: yMGP },
  lyMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP },
  lvMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP },
  vlMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: vlMGP },
  wrMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP }
} as const;

export const publicClients = {
  1: createPublicClient({ chain: mainnet, transport: webSocket("wss://eth.drpc.org") }),
  42_161: createPublicClient({ chain: arbitrum, transport: webSocket("wss://arbitrum.drpc.org") }),
  56: createPublicClient({ chain: bsc, transport: webSocket("wss://bsc.drpc.org") })
};

export const contracts = {
  42_161: {
    CKP: getContract({ abi: ABIs.CKP, address: "0x346Af1954e3d6be46B96dA713a1f7fD2d1928F1d" as const, client: publicClients[42_161] }),
    EGP: getContract({ abi: ABIs.EGP, address: "0x7E7a7C916c19a45769f6BDAF91087f93c6C12F78" as const, client: publicClients[42_161] }),
    LTP: getContract({ abi: ABIs.LTP, address: "0xa73959804651eEd0D4bd04293A675cB832c20454" as const, client: publicClients[42_161] }),
    masterMGP: getContract({ abi: ABIs.masterMGP, address: "0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7" as const, client: publicClients[42_161] }),
    MGP: getContract({ abi: erc20Abi, address: "0xa61F74247455A40b01b0559ff6274441FAfa22A3" as const, client: publicClients[42_161] }),
    odosRouter: getContract({ abi: ABIs.odosRouter, address: "0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13" as const, client: publicClients[42_161] }),
    PNP: getContract({ abi: ABIs.PNP, address: "0x2Ac2B254Bc18cD4999f64773a966E4f4869c34Ee" as const, client: publicClients[42_161] }),
    vlMGP: getContract({ abi: ABIs.vlMGP, address: "0x536599497Ce6a35FC65C7503232Fec71A84786b9" as const, client: publicClients[42_161] }),
    vlRewarder: getContract({ abi: ABIs.vlRewarder, address: "0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45" as const, client: publicClients[42_161] }),
    WETH: getContract({ abi: ABIs.WETH, address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as const, client: publicClients[42_161] }),
    cMGP: getContract({ abi: ABIs.cMGP, address: "0xD1465c3489Aa7Eac0e7f9907F93a684840a2F934" as const, client: publicClients[42_161] }),
    rMGP: getContract({ abi: ABIs.rMGP, address: "0x3788c8791d826254bAbd49b602C93008468D5695" as const, client: publicClients[42_161] }),
    vMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[42_161] }),
    lvMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[42_161] }),
    lyMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[42_161] }),
    wrMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[42_161] }),
    yMGP: getContract({ abi: ABIs.yMGP, address: "0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9" as const, client: publicClients[42_161] })
  },
  56: {
    CKP: getContract({ abi: ABIs.CKP, address: "0x2b5d9adea07b590b638ffc165792b2c610eda649", client: publicClients[56] }),
    EGP: getContract({ abi: ABIs.EGP, address: "0x0cc7288a11c0c31d39d0e05eb59f24e506ad6ad5" as const, client: publicClients[56] }),
    LTP: getContract({ abi: ABIs.LTP, address: "0x56fa5f7bf457454be33d8b978c86a5f5b9dd84c2" as const, client: publicClients[56] }),
    masterMGP: getContract({ abi: ABIs.masterMGP, address: "0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46" as const, client: publicClients[56] }),
    MGP: getContract({ abi: erc20Abi, address: "0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa" as const, client: publicClients[56] }),
    odosRouter: getContract({ abi: ABIs.odosRouter, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    PNP: getContract({ abi: ABIs.PNP, address: "0x5012c90f14d190607662ca8344120812aaa2639d" as const, client: publicClients[56] }),
    vlMGP: getContract({ abi: ABIs.vlMGP, address: "0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6" as const, client: publicClients[56] }),
    vlRewarder: getContract({ abi: ABIs.vlRewarder, address: "0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9" as const, client: publicClients[56] }),
    WETH: getContract({ abi: ABIs.WETH, address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" as const, client: publicClients[56] }),
    cMGP: getContract({ abi: ABIs.cMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    rMGP: getContract({ abi: ABIs.rMGP, address: "0x0277517658a1dd3899bf926fCf6A633e549eB769" as const, client: publicClients[56] }),
    vMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    lvMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    lyMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    wrMGP: getContract({ abi: ABIs.vMGP, address: "0x0000000000000000000000000000000000000000" as const, client: publicClients[56] }),
    yMGP: getContract({ abi: ABIs.yMGP, address: "0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb" as const, client: publicClients[56] })
  }
} as const;
