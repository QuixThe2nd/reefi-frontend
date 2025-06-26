import PegCard from "./PegCard";

import type { useBonds } from "../state/useBonds";
import type { useExchangeRates } from "../state/useExchangeRates";
import type { useRewards } from "../state/useRewards";
import type { useSupplies } from "../state/useSupplies";

interface Properties {
  readonly bonds: ReturnType<typeof useBonds>;
  readonly rewards: ReturnType<typeof useRewards>;
  readonly exchangeRates: ReturnType<typeof useExchangeRates>;
  readonly supplies: ReturnType<typeof useSupplies>;
}

export const PegCards = ({ bonds, rewards, exchangeRates, supplies }: Properties) => {
  const stmgpTarget = () => {
    const withdrawWaitDays = 60 + (bonds.length === 6 ? (Number(bonds[0]?.endTime) - Date.now() / 1000) / 60 / 60 / 24 / 30 / 2 : 0);
    const dailyAPY = rewards.stMGP.APY / 365;
    const missedYield = dailyAPY * withdrawWaitDays;
    return 1 - missedYield;
  };
  return <div className="grid grid-cols-2 gap-6">
    <div className="flex flex-col gap-6">
      <PegCard details="The target rate is the fair value of stMGP, calculated by estimating how much vlMGP yield won't be earned during a bond's lifespan. When the buy price is under the target, you can get better yield through fixed interest bonds than by holding stMGP. For example if stMGP is earning 40% and bond maturity is 60 days, 6.66% in yield is missed out on, making stMGP's fair value 0.9333 MGP. The higher the yield, the lower the target price. If all available bond slots are used, the 60 day period is increased up to 120 days, decreasing the target peg." rates={[{ label: "Target", value: stmgpTarget(), color: "purple", required: true }, { label: "Sell", value: exchangeRates.stMGP.MGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.MGP.stMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} softPeg spread={100 / exchangeRates.MGP.stMGP / exchangeRates.stMGP.MGP - 100} targetToken="MGP" token="stMGP" />
      <PegCard rates={[{ label: "1 stMGP", value: 1, color: "emerald" }, { label: "1 wstMGP", value: Number(supplies.stMGP) / Number(supplies.stMGP_shares), color: "green", required: true }]} spread={0} targetToken="stMGP" token="wstMGP" />
    </div>
    <div className="flex flex-col gap-6">
      <PegCard rates={[{ label: "Burn", value: 0.75, color: "purple", required: true }, { label: "Sell", value: exchangeRates.yMGP.stMGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.stMGP.yMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} spread={100 / exchangeRates.stMGP.yMGP / exchangeRates.yMGP.stMGP - 100} targetToken="wstMGP" token="yMGP" />
      <PegCard rates={[{ label: "Burn", value: 0, color: "purple", required: true }, { label: "Sell", value: exchangeRates.vMGP.yMGP, color: "red", required: true }, { label: "Buy", value: 1 / exchangeRates.yMGP.vMGP, color: "blue", required: true }, { label: "Mint", value: 1, color: "green", required: true }]} spread={100 / exchangeRates.yMGP.vMGP / exchangeRates.vMGP.yMGP - 100} targetToken="yMGP" token="vMGP" />
    </div>
  </div>;
};
