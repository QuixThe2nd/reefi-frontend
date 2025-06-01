import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

const features: readonly Feature[] = [
  {
    description: "Earn 90% of vlMGP yield with automatic compounding through rMGP, maintaining liquidity while maximizing returns.",
    icon: "🔄",
    title: "Auto-Compounding Yield"
  }, {
    description: "Receive transferrable tokens for all MGP derivatives, combining liquidity with staking rewards.",
    icon: "💧",
    title: "Liquid Derivatives"
  }, {
    description: "Lock yMGP to earn additional protocol fees (5% of withdrawals + vlMGP yield) on top of base rMGP returns.",
    icon: "📈",
    title: "Enhanced Yields"
  }, {
    description: "Control Reefi's vlMGP voting power through vMGP tokens, amplifying your influence in Magpie governance decisions.",
    icon: "🗳️",
    title: "Boosted Governance Power"
  }, {
    description: "Earn 1% of all pending yield by compounding rewards for the entire protocol - automated income opportunity.",
    icon: "💰",
    title: "Compound Rewards"
  }, {
    description: "Profit from rate differences between native minting, Curve trading, and withdrawal mechanisms.",
    icon: "⚖️",
    title: "Arbitrage Opportunities"
  }, {
    description: "Access Reefi on both BNB Chain and Arbitrum networks with seamless multi-chain functionality.",
    icon: "🌐",
    title: "Cross-Chain Support"
  }, {
    description: "Built-in peg stability mechanisms and withdrawal queues protect against depegging while maintaining liquidity.",
    icon: "🛡️",
    title: "Risk Management"
  }
] as const;

export const Features = memo((): ReactElement => {
  const { rewards, supplies, exchangeRates, prices } = useGlobalContext();
  const boost = (rewards.lockedYmgpAPY + rewards.mgpAPR) / rewards.mgpAPR - 1;

  return <div className="flex flex-col items-center">
    <div className="mb-4 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-green-600/30 bg-gradient-to-r from-green-600/20 to-blue-600/20 p-3 text-center">
        <div className="text-lg font-bold text-green-400">{(100 * aprToApy(rewards.mgpAPR)).toFixed(2)}%+</div>
        <div className="text-xs text-gray-400">Average Reefi Yield</div>
      </div>
      <div className="rounded-lg border border-green-600/30 bg-gradient-to-r from-green-600/20 to-blue-600/20 p-3 text-center">
        <div className="text-lg font-bold text-green-400">{(100 * rewards.mgpAPR).toFixed(2)}%</div>
        <div className="text-xs text-gray-400">Base Magpie Yield</div>
      </div>
      <div className="rounded-lg border border-orange-600/30 bg-gradient-to-r from-orange-600/20 to-red-600/20 p-3 text-center">
        <div className="text-lg font-bold text-orange-400">{boost.toFixed(2)}x+</div>
        <div className="text-xs text-gray-400">Yield Boost</div>
      </div>
      <div className="rounded-lg border border-green-600/30 bg-gradient-to-r from-green-600/20 to-blue-600/20 p-3 text-center">
        <div className="text-lg font-bold text-green-400">${(1000 * prices.MGP * exchangeRates.curve.vmgpMGP * Number(supplies.vmgp) / Number(supplies.rmgp)).toFixed(2)} vs ${(1000 * prices.MGP).toFixed(2)}</div>
        <div className="text-xs text-gray-400">Vote Price (1k Votes)</div>
      </div>
    </div>
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
      {features.map(feature => <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 transition-colors hover:border-green-600/30" key={feature.title}>
        <div className="mb-2 text-xl">{feature.icon}</div>
        <h3 className="mb-1 text-sm font-semibold text-green-400">{feature.title}</h3>
        <p className="text-xs leading-tight text-gray-300">{feature.description}</p>
      </div>)}
    </div>
  </div>;
});
Features.displayName = "Features";
