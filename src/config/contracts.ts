import CKP from "../../public/icons/CKP.png";
import EGP from "../../public/icons/EGP.png";
import LTP from "../../public/icons/LTP.png";
import MGP from "../../public/icons/MGP.png";
import PNP from "../../public/icons/PNP.png";
import WETH from "../../public/icons/WETH.png";
import curve from "../../public/icons/curve.png";
import lyMGP from "../../public/icons/lyMGP.png";
import vMGP from "../../public/icons/vMGP.png";
import vlMGP from "../../public/icons/vlMGP.png";
import wstMGP from "../../public/icons/rMGP.png";
import yMGP from "../../public/icons/yMGP.png";

import zod from "zod";

import ETH from "../../public/icons/ETH.svg";

export type Chains = 56 | 42_161;

export const PrimaryCoinMagpieSchema = zod.literal("MGP");
export const PrimaryCoinReefiSchema = zod.enum(["wstMGP", "yMGP", "vMGP"]);
export const PrimaryCoinSchema = zod.union([PrimaryCoinReefiSchema, PrimaryCoinMagpieSchema]);

export type PrimaryCoinMagpie = zod.infer<typeof PrimaryCoinMagpieSchema>;
export type PrimaryCoinReefi = zod.infer<typeof PrimaryCoinReefiSchema>;
export type PrimaryCoin = zod.infer<typeof PrimaryCoinSchema>;

export type LockedCoinMagpie = "vlMGP";
export type LockedCoinReefi = "lyMGP" | "lvMGP";
export type LockedCoin = LockedCoinReefi | LockedCoinMagpie;

export type CoreCoin = PrimaryCoin | LockedCoin;
export type CoreCoinExtended = CoreCoin | "stMGP";

export type SecondaryCoin = "CKP" | "PNP" | "EGP" | "LTP" | "WETH" | PrimaryCoinMagpie;
export type SecondaryCoinETH = SecondaryCoin | "ETH";
export type TradeableCoin = PrimaryCoin | SecondaryCoin;
export type TradeableCoinExtendedETH = TradeableCoin | "stMGP" | "ETH";

export type NonTradeableCoin = "cMGP";
export type TransferrableCoin = TradeableCoin | "stMGP" | NonTradeableCoin;

export type AllCoin = LockedCoin | TransferrableCoin;
export type AllCoinETH = AllCoin | "ETH";
export type AllCoinExtendedETH = AllCoinETH | "stMGP";

export const isPrimaryCoin = (value: string): value is PrimaryCoin => PrimaryCoinSchema.safeParse(value).success;

export const decimals: Record<AllCoinETH, number> = { CKP: 18, EGP: 18, ETH: 18, LTP: 18, MGP: 18, PNP: 18, WETH: 18, cMGP: 18, wstMGP: 18, vMGP: 18, yMGP: 18, lyMGP: 18, lvMGP: 18, stMGP: 18, vlMGP: 18 };
export const coins: Record<AllCoinETH, { color: string; bgColor: string; icon: `${string}.${"png" | "svg"}` }> = {
  CKP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: CKP },
  EGP: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: EGP },
  LTP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: LTP },
  MGP: { bgColor: "bg-blue-600", color: "bg-blue-400", icon: MGP },
  PNP: { bgColor: "bg-teal-600", color: "bg-teal-400", icon: PNP },
  WETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: WETH },
  ETH: { bgColor: "bg-gray-600", color: "bg-gray-400", icon: ETH },
  cMGP: { bgColor: "bg-indigo-600", color: "bg-indigo-400", icon: curve },
  wstMGP: { bgColor: "bg-green-600", color: "bg-green-400", icon: wstMGP },
  vMGP: { bgColor: "bg-red-600", color: "bg-red-400", icon: vMGP },
  yMGP: { bgColor: "bg-yellow-600", color: "bg-yellow-400", icon: yMGP },
  lyMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP },
  lvMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP },
  vlMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: vlMGP },
  stMGP: { bgColor: "bg-orange-600", color: "bg-orange-400", icon: lyMGP }
} as const;

export const contracts = {
  42_161: {
    CKP: "0x346Af1954e3d6be46B96dA713a1f7fD2d1928F1d",
    EGP: "0x7E7a7C916c19a45769f6BDAF91087f93c6C12F78",
    LTP: "0xa73959804651eEd0D4bd04293A675cB832c20454",
    masterMGP: "0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7",
    MGP: "0xa61F74247455A40b01b0559ff6274441FAfa22A3",
    odosRouter: "0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13",
    PNP: "0x2Ac2B254Bc18cD4999f64773a966E4f4869c34Ee",
    vlMGP: "0x536599497Ce6a35FC65C7503232Fec71A84786b9",
    vlRewarder: "0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45",
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    cMGP: "0xD1465c3489Aa7Eac0e7f9907F93a684840a2F934",
    wstMGP: "0x3788c8791d826254bAbd49b602C93008468D5695",
    vMGP: "0x0000000000000000000000000000000000000001",
    lvMGP: "0x0000000000000000000000000000000000000002",
    lyMGP: "0x0000000000000000000000000000000000000003",
    stMGP: "0x0000000000000000000000000000000000000004",
    yMGP: "0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9"
  },
  56: {
    CKP: "0x2b5d9adea07b590b638ffc165792b2c610eda649",
    EGP: "0x0cc7288a11c0c31d39d0e05eb59f24e506ad6ad5",
    LTP: "0x56fa5f7bf457454be33d8b978c86a5f5b9dd84c2",
    masterMGP: "0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46",
    MGP: "0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa",
    odosRouter: "0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E",
    PNP: "0x5012c90f14d190607662ca8344120812aaa2639d",
    vlMGP: "0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6",
    vlRewarder: "0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9",
    WETH: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    cMGP: "0x0000000000000000000000000000000000000005",
    wstMGP: "0x0277517658a1dd3899bf926fCf6A633e549eB769",
    vMGP: "0x0000000000000000000000000000000000000006",
    lvMGP: "0x0000000000000000000000000000000000000007",
    lyMGP: "0x0000000000000000000000000000000000000008",
    stMGP: "0x0000000000000000000000000000000000000009",
    yMGP: "0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb"
  }
} as const;
