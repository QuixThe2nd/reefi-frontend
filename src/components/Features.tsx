import { aprToApy } from "../utilities";

interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

const features: readonly Feature[] = [
  {
    description: "Earn yield with automatic compounding through wstMGP and the MGP Synth, maximizing yield.",
    icon: "🔄",
    title: "Auto-Compounding Yield"
  },
  {
    description: "Receive transferrable tokens for all MGP derivatives, combining liquidity with staking rewards.",
    icon: "💧",
    title: "Liquid Derivatives"
  },
  {
    description: "Lock yMGP and rMGP to earn additional protocol fees (5% of vlMGP yield) on top of base stMGP returns.",
    icon: "📈",
    title: "Enhanced Yields"
  },
  {
    description: "Control Reefi's vlMGP voting power with vMGP, boosting your influence in Magpie proposals.",
    icon: "🗳️",
    title: "Boosted Governance Power"
  },
  {
    description: "Earn 1% of all pending yield by compounding rewards for yield bearing Reefi positions like stMGP.",
    icon: "💰",
    title: "Compound Rewards"
  },
  {
    description: "Profit from rate differences between native minting, Curve trading, and the bond mechanism.",
    icon: "⚖️",
    title: "Arbitrage Opportunities"
  },
  {
    description: "Access Reefi on both BNB Chain and Arbitrum networks with seamless multi-chain functionality.",
    icon: "🌐",
    title: "Cross-Chain Support"
  },
  {
    description: "Built-in peg stability mechanisms protect against depegging while maintaining liquidity.",
    icon: "🛡️",
    title: "Risk Management"
  }
] as const;

interface Properties {
  readonly mgpAPR: number;
  readonly syMGPAPY: number;
  readonly mgpPrice: number;
  readonly vmgpSupply: bigint;
  readonly reefiLockedMGP: bigint;
  readonly vmgpMGPCurveRate: number;
}

export const Features = ({ mgpAPR, syMGPAPY, mgpPrice, vmgpSupply, reefiLockedMGP, vmgpMGPCurveRate }: Properties) => <div className="flex flex-col items-center">
  <div className="mb-2 grid w-full grid-cols-2 gap-2 md:grid-cols-4">
    <div className="rounded-lg border border-blue-600/30 bg-gradient-to-r from-blue-600/20 to-green-600/20 p-3 text-center">
      <div className="text-lg font-bold text-blue-400">{(100 * mgpAPR).toFixed(2)}%</div>
      <div className="text-xs text-gray-400">Base Magpie Yield</div>
    </div>
    <div className="rounded-lg border border-blue-600/30 bg-gradient-to-r from-blue-600/20 to-green-600/20 p-3 text-center">
      <div className="text-lg font-bold text-blue-400">{(100 * aprToApy(mgpAPR)).toFixed(2)}%+</div>
      <div className="text-xs text-gray-400">Average Reefi Yield</div>
    </div>
    <div className="rounded-lg border border-orange-600/30 bg-gradient-to-r from-orange-600/20 to-red-600/20 p-3 text-center">
      <div className="text-lg font-bold text-orange-400">{(100 * syMGPAPY).toFixed(2)}%+</div>
      <div className="text-xs text-gray-400">Boosted Yield</div>
    </div>
    <div className="rounded-lg border border-blue-600/30 bg-gradient-to-r from-blue-600/20 to-green-600/20 p-3 text-center">
      <div className="text-lg font-bold text-blue-400">${(1000 * mgpPrice * vmgpMGPCurveRate * Number(vmgpSupply) / Number(reefiLockedMGP)).toFixed(2)} vs ${(1000 * mgpPrice).toFixed(2)}</div>
      <div className="text-xs text-gray-400">Vote Price (1k Votes)</div>
    </div>
  </div>
  <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
    {features.map(feature => <div className="flex gap-4 rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 transition-colors hover:border-blue-600/30" key={feature.title}>
      <div className="mb-2 text-xl">{feature.icon}</div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-blue-400">{feature.title}</h3>
        <p className="text-xs leading-tight text-gray-300">{feature.description}</p>
      </div>
    </div>)}
  </div>
</div>;
