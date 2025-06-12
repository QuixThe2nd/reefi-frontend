import { aprToApy, parseEther } from "../utilities";
import { contracts } from "../config/contracts";
import { memo, type ReactElement } from "react";
import { useCachedUpdateable } from "../hooks/useUpdateable";
import { useChainId, useReadContract } from "wagmi";
import zod from "zod";

import { ABIs } from "../config/ABIs/abis";

const getBorderClass = (mixed: boolean, better: boolean): string => {
  if (mixed) return "border-orange-600/50 bg-orange-900/20";
  if (better) return "border-yellow-600/50 bg-yellow-900/20";
  return "border-green-600/50 bg-green-900/20";
};

const getHeaderText = (mixed: boolean, better: boolean): string => {
  if (mixed) return "⚖️ Mixed Opportunities Across Chains";
  if (better) return "⚠️ Better Yield Available";
  return "✅ You're on the Best Chain";
};

const getStatusColor = (mixed: boolean, better: boolean): string => {
  if (mixed) return "bg-orange-400";
  if (better) return "bg-yellow-400";
  return "bg-green-400";
};

const streamRewardSchema = zod.object({
  data: zod.object({
    rewardTokenInfo: zod.array(zod.object({
      apr: zod.number()
    }))
  })
});

export const CrossChainYieldComparison = memo((): ReactElement | undefined => {
  const chain = useChainId();
  // Fetch MGP APR from both chains
  const [bscMgpAPR] = useCachedUpdateable(async () => {
    const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=56&rewarder=${contracts[56].vlRewarder}`);
    const body = streamRewardSchema.parse(await response.json());
    let apr = 0;
    body.data.rewardTokenInfo.forEach(token => {
      apr += token.apr;
    });
    return apr;
  }, [], "BSC MGP APR", 0);

  const [arbMgpAPR] = useCachedUpdateable(async () => {
    const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=42161&rewarder=${contracts[42_161].vlRewarder}`);
    const body = streamRewardSchema.parse(await response.json());
    let apr = 0;
    body.data.rewardTokenInfo.forEach(token => {
      apr += token.apr;
    });
    return apr;
  }, [], "ARB MGP APR", 0);

  // Fetch exchange rates from both chains
  const bscExchangeRates = {
    mgpToRmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[56].cMGP, functionName: "get_dy", args: [0n, 1n, parseEther(1)] }).data),
    mgpToYmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[56].cMGP, functionName: "get_dy", args: [1n, 2n, parseEther(1)] }).data),
    rmgpToYmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[56].cMGP, functionName: "get_dy", args: [0n, 2n, parseEther(1)] }).data)
  };
  const arbExchangeRates = {
    mgpToRmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[42_161].cMGP, functionName: "get_dy", args: [0n, 1n, parseEther(1)] }).data),
    mgpToYmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[42_161].cMGP, functionName: "get_dy", args: [1n, 2n, parseEther(1)] }).data),
    rmgpToYmgp: Number(useReadContract({ abi: ABIs.cMGP, address: contracts[42_161].cMGP, functionName: "get_dy", args: [0n, 2n, parseEther(1)] }).data)
  };


  // Fetch locked amounts for calculating locked yMGP yields
  const bscLockedAmounts = {
    reefiMGP: useReadContract({ abi: ABIs.vlMGP, address: contracts[56].vlMGP, functionName: "getUserTotalLocked", args: [contracts[56].wstMGP] }).data,
    lockedYMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[56].yMGP, functionName: "totalLocked" }).data
  };
  const arbLockedAmounts = {
    reefiMGP: useReadContract({ abi: ABIs.vlMGP, address: contracts[42_161].vlMGP, functionName: "getUserTotalLocked", args: [contracts[56].wstMGP] }).data,
    lockedYMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[42_161].yMGP, functionName: "totalLocked" }).data
  };

  const currentChainAPR = chain === 56 ? bscMgpAPR : arbMgpAPR;
  const otherChainAPR = chain === 56 ? arbMgpAPR : bscMgpAPR;
  const otherChainName = chain === 56 ? "Arbitrum" : "BNB Chain";

  const currentChainRates = chain === 56 ? bscExchangeRates : arbExchangeRates;
  const otherChainRates = chain === 56 ? arbExchangeRates : bscExchangeRates;

  const currentChainLocked = chain === 56 ? bscLockedAmounts : arbLockedAmounts;
  const otherChainLocked = chain === 56 ? arbLockedAmounts : bscLockedAmounts;

  // Calculate yields
  const currentChainBaseAPY = aprToApy(currentChainAPR) * 0.9;
  const otherChainBaseAPY = aprToApy(otherChainAPR) * 0.9;

  // Calculate locked yMGP additional yield (5% of protocol yield distributed to locked yMGP)
  const currentChainLockedBoost = Number(currentChainLocked.lockedYMGP) > 0 ? Number(currentChainLocked.reefiMGP) * aprToApy(currentChainAPR) * 0.05 / Number(currentChainLocked.lockedYMGP) : 0;
  const otherChainLockedBoost = Number(otherChainLocked.lockedYMGP) > 0 ? Number(otherChainLocked.reefiMGP) * aprToApy(otherChainAPR) * 0.05 / Number(otherChainLocked.lockedYMGP) : 0;

  const currentChainLockedAPY = currentChainBaseAPY + currentChainLockedBoost;
  const otherChainLockedAPY = otherChainBaseAPY + otherChainLockedBoost;

  // Calculate effective yields per MGP invested
  const currentRMGPEffective = currentChainBaseAPY * currentChainRates.mgpToRmgp;
  const otherRMGPEffective = otherChainBaseAPY * otherChainRates.mgpToRmgp;

  const currentYMGPEffective = currentChainBaseAPY * currentChainRates.mgpToYmgp;
  const otherYMGPEffective = otherChainBaseAPY * otherChainRates.mgpToYmgp;

  const currentLockedYMGPEffective = currentChainLockedAPY * currentChainRates.mgpToYmgp;
  const otherLockedYMGPEffective = otherChainLockedAPY * otherChainRates.mgpToYmgp;

  // Find the best opportunities
  const wstMGPDifference = otherRMGPEffective - currentRMGPEffective;
  const yMGPDifference = otherYMGPEffective - currentYMGPEffective;
  const lockedYMGPDifference = otherLockedYMGPEffective - currentLockedYMGPEffective;

  // Determine which tokens are better where
  const wstMGPBetterElsewhere = wstMGPDifference > 0.005;
  const yMGPBetterElsewhere = yMGPDifference > 0.005;
  const lockedYMGPBetterElsewhere = lockedYMGPDifference > 0.005;

  const wstMGPBetterHere = wstMGPDifference < -0.005;
  const yMGPBetterHere = yMGPDifference < -0.005;
  const lockedYMGPBetterHere = lockedYMGPDifference < -0.005;

  const tokensToOptimize = [wstMGPBetterElsewhere, yMGPBetterElsewhere, lockedYMGPBetterElsewhere].filter(Boolean).length;
  const tokensAlreadyOptimal = [wstMGPBetterHere, yMGPBetterHere, lockedYMGPBetterHere].filter(Boolean).length;

  const maxDifference = Math.max(Math.abs(wstMGPDifference), Math.abs(yMGPDifference), Math.abs(lockedYMGPDifference));
  const maxPercentageDiff = Math.max(Math.abs(wstMGPDifference / currentRMGPEffective * 100), Math.abs(yMGPDifference / currentYMGPEffective * 100), Math.abs(lockedYMGPDifference / currentLockedYMGPEffective * 100));

  // Only show if there's a meaningful difference (>0.5% absolute or >5% relative)
  if (maxDifference < 0.005 && maxPercentageDiff < 5) return undefined;

  const isMixedScenario = tokensToOptimize > 0 && tokensAlreadyOptimal > 0;
  const hasAnyBetterOpportunity = tokensToOptimize > 0;

  return <div className={`rounded-xl border p-4 ${getBorderClass(isMixedScenario, hasAnyBetterOpportunity)}`}>
    <div className="mb-2 flex items-center gap-2">
      <div className={`size-3 rounded-full ${getStatusColor(isMixedScenario, hasAnyBetterOpportunity)}`} />
      <h3 className="font-semibold">{getHeaderText(isMixedScenario, hasAnyBetterOpportunity)}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4 text-sm lg:grid-cols-3">
      {/* wstMGP Comparison */}
      <div className="rounded-lg border border-green-600/30 bg-green-900/10 p-3">
        <h4 className="mb-2 font-medium text-green-400">wstMGP (Auto-Compound)</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">{chain === 56 ? "BNB" : "ARB"}:</span>
            <div className="text-right">
              <div className="font-medium">{(currentRMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{currentChainRates.mgpToRmgp.toFixed(3)} wstMGP per MGP</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{otherChainName}:</span>
            <div className="text-right">
              <div className={`font-medium ${wstMGPDifference > 0 ? "text-yellow-400" : "text-gray-300"}`}>{(otherRMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{otherChainRates.mgpToRmgp.toFixed(3)} wstMGP per MGP</div>
            </div>
          </div>
          {Math.abs(wstMGPDifference) > 0.005 && <div className="border-t border-gray-700 pt-1 text-xs">
            <span className={wstMGPDifference > 0 ? "text-yellow-300" : "text-green-300"}>
              {wstMGPDifference > 0 ? "📈 " : "🏆 "}
              {wstMGPDifference > 0 ? "Get " : "Earn "}
              {Math.abs(wstMGPDifference * 100).toFixed(2)}% more yield
              per MGP
              {wstMGPDifference > 0 ? ` on ${otherChainName}` : " here"}
            </span>
          </div>}
        </div>
      </div>
      {/* yMGP Comparison */}
      <div className="rounded-lg border border-green-600/30 bg-green-900/10 p-3">
        <h4 className="mb-2 font-medium text-green-400">yMGP (Unlocked)</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">{chain === 56 ? "BNB" : "ARB"}:</span>
            <div className="text-right">
              <div className="font-medium">{(currentYMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{currentChainRates.mgpToYmgp.toFixed(3)} yMGP per MGP</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{otherChainName}:</span>
            <div className="text-right">
              <div className={`font-medium ${yMGPDifference > 0 ? "text-yellow-400" : "text-gray-300"}`}>{(otherYMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{otherChainRates.mgpToYmgp.toFixed(3)} yMGP per MGP</div>
            </div>
          </div>
          {Math.abs(yMGPDifference) > 0.005 && <div className="border-t border-gray-700 pt-1 text-xs">
            <span className={yMGPDifference > 0 ? "text-yellow-300" : "text-green-300"}>{yMGPDifference > 0 ? "📈 " : "🏆 "} {yMGPDifference > 0 ? "Get " : "Earn "} {Math.abs(yMGPDifference * 100).toFixed(2)}% more yield per MGP {yMGPDifference > 0 ? ` on ${otherChainName}` : " here"}</span>
          </div>}
        </div>
      </div>
      {/* Locked yMGP Comparison */}
      <div className="rounded-lg border border-green-600/30 bg-green-900/10 p-3">
        <h4 className="mb-2 font-medium text-green-400">Locked yMGP (Boosted)</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">{chain === 56 ? "BNB" : "ARB"}:</span>
            <div className="text-right">
              <div className="font-medium">{(currentLockedYMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{currentChainRates.mgpToYmgp.toFixed(3)} yMGP per MGP</div>
              <div className="text-xs text-gray-500">+{(currentChainLockedBoost * 100).toFixed(1)}% boost</div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{otherChainName}:</span>
            <div className="text-right">
              <div className={`font-medium ${lockedYMGPDifference > 0 ? "text-yellow-400" : "text-gray-300"}`}>{(otherLockedYMGPEffective * 100).toFixed(2)}%</div>
              <div className="text-xs text-gray-500">{otherChainRates.mgpToYmgp.toFixed(3)} yMGP per MGP</div>
              <div className="text-xs text-gray-500">+{(otherChainLockedBoost * 100).toFixed(1)}% boost</div>
            </div>
          </div>
          {Math.abs(lockedYMGPDifference) > 0.005 && <div className="border-t border-gray-700 pt-1 text-xs">
            <span className={lockedYMGPDifference > 0 ? "text-yellow-300" : "text-green-300"}>
              {lockedYMGPDifference > 0 ? "📈 " : "🏆 "}
              {lockedYMGPDifference > 0 ? "Get " : "Earn "}
              {Math.abs(lockedYMGPDifference * 100).toFixed(2)}% more
              yield per MGP
              {lockedYMGPDifference > 0 ? ` on ${otherChainName}` : " here"}
            </span>
          </div>}
        </div>
      </div>
    </div>
    {isMixedScenario ? <div className="mt-3 rounded-lg bg-orange-800/30 p-3">
      <p className="mb-2 text-sm font-medium text-orange-200">⚖️ Strategic choice: Different tokens perform better on different chains</p>
      <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
        <div>
          <p className="mb-1 font-medium text-orange-300">Better on {otherChainName}:</p>
          <div className="space-y-1">
            {wstMGPBetterElsewhere ? <div> • wstMGP: +{(wstMGPDifference * 100).toFixed(2)}% yield ({otherChainRates.mgpToRmgp.toFixed(3)} vs {currentChainRates.mgpToRmgp.toFixed(3)} per MGP)</div> : undefined}
            {yMGPBetterElsewhere ? <div>• yMGP: +{(yMGPDifference * 100).toFixed(2)}% yield ({otherChainRates.mgpToYmgp.toFixed(3)} vs {currentChainRates.mgpToYmgp.toFixed(3)} per MGP)</div> : undefined}
            {lockedYMGPBetterElsewhere ? <div>• Locked yMGP: +{(lockedYMGPDifference * 100).toFixed(2)}% yield ({(otherChainLockedBoost * 100).toFixed(1)}% vs  {(currentChainLockedBoost * 100).toFixed(1)}% boost)</div> : undefined}
          </div>
        </div>
        <div>
          <p className="mb-1 font-medium text-green-300">Better here ({chain === 56 ? "BNB Chain" : "Arbitrum"}):</p>
          <div className="space-y-1">
            {wstMGPBetterHere ? <div>• wstMGP: +{(Math.abs(wstMGPDifference) * 100).toFixed(2)} % yield ({currentChainRates.mgpToRmgp.toFixed(3)} vs {otherChainRates.mgpToRmgp.toFixed(3)} per MGP)</div> : undefined}
            {yMGPBetterHere ? <div>• yMGP: +{(Math.abs(yMGPDifference) * 100).toFixed(2)}% yield ({currentChainRates.mgpToYmgp.toFixed(3)} vs {otherChainRates.mgpToYmgp.toFixed(3)} per MGP)</div> : undefined}
            {lockedYMGPBetterHere ? <div>• Locked yMGP: +{(Math.abs(lockedYMGPDifference) * 100).toFixed(2)}% yield ({(currentChainLockedBoost * 100).toFixed(1)}% vs {(otherChainLockedBoost * 100).toFixed(1)}% boost)</div> : undefined}
          </div>
        </div>
      </div>
      <div className="mt-2 rounded bg-orange-900/50 p-2 text-xs text-orange-200">
        <strong>💡 Strategy:</strong>
        {" "}
        Consider diversifying across chains
        or focusing on the tokens that perform best where you currently
        are.
      </div>
    </div> : undefined}
    {hasAnyBetterOpportunity && !isMixedScenario ? <div className="mt-3 rounded-lg bg-yellow-800/30 p-3">
      <p className="mb-2 text-sm font-medium text-yellow-200">💡 You can get better returns on {otherChainName}:</p>
      <div className="space-y-1 text-xs">
        {wstMGPBetterElsewhere ? <div className="flex justify-between">
          <span>• wstMGP: Get {otherChainRates.mgpToRmgp.toFixed(3)} vs {currentChainRates.mgpToRmgp.toFixed(3)} tokens per MGP</span>
          <span className="text-yellow-300">+{(wstMGPDifference * 100).toFixed(2)}% annual yield</span>
        </div> : undefined}
        {yMGPBetterElsewhere ? <div className="flex justify-between">
          <span>• yMGP: Get {otherChainRates.mgpToYmgp.toFixed(3)} vs {currentChainRates.mgpToYmgp.toFixed(3)} tokens per MGP</span>
          <span className="text-yellow-300">+{(yMGPDifference * 100).toFixed(2)}% annual yield</span>
        </div> : undefined}
        {lockedYMGPBetterElsewhere ? <div className="flex justify-between">
          <span>• Locked yMGP: {(otherChainLockedBoost * 100).toFixed(1)}% vs {(currentChainLockedBoost * 100).toFixed(1)}% boost</span>
          <span className="text-yellow-300">+{(lockedYMGPDifference * 100).toFixed(2)}% annual yield</span>
        </div> : undefined}
      </div>
      <div className="mt-2 rounded bg-yellow-900/50 p-2 text-xs text-yellow-200">Example: 1000 MGP → {(1000 * Math.max(otherChainRates.mgpToRmgp, otherChainRates.mgpToYmgp)).toFixed(0)} tokens on {otherChainName} vs {(1000 * Math.max(currentChainRates.mgpToRmgp, currentChainRates.mgpToYmgp)).toFixed(0)} tokens here</div>
      <p className="mt-2 text-xs text-yellow-300">Higher yields come from {otherChainBaseAPY > currentChainBaseAPY ? "better base rates" : "more favorable exchange rates"} on {otherChainName}.</p>
    </div> : undefined}
    {!hasAnyBetterOpportunity && <div className="mt-3 rounded-lg bg-green-800/30 p-3">
      <p className="mb-2 text-sm font-medium text-green-200">✅ You&apos;re maximizing your MGP returns here!</p>
      <div className="space-y-1 text-xs text-green-300">
        {Math.abs(wstMGPDifference) > 0.005 && <div>
          • wstMGP: Earning{" "}
          {(Math.abs(wstMGPDifference) * 100).toFixed(2)}% more than{" "}
          {otherChainName} ({currentChainRates.mgpToRmgp.toFixed(3)} vs{" "}
          {otherChainRates.mgpToRmgp.toFixed(3)} tokens per MGP)
        </div>}
        {Math.abs(yMGPDifference) > 0.005 && <div>
          • yMGP: Earning {(Math.abs(yMGPDifference) * 100).toFixed(2)}%
          more than {otherChainName} (
          {currentChainRates.mgpToYmgp.toFixed(3)} vs{" "}
          {otherChainRates.mgpToYmgp.toFixed(3)} tokens per MGP)
        </div>}
        {Math.abs(lockedYMGPDifference) > 0.005 && <div>
          • Locked yMGP: Earning{" "}
          {(Math.abs(lockedYMGPDifference) * 100).toFixed(2)}% more than{" "}
          {otherChainName} ({(currentChainLockedBoost * 100).toFixed(1)}
          % vs {(otherChainLockedBoost * 100).toFixed(1)}% boost)
        </div>}
      </div>
    </div>}
  </div>;
});

CrossChainYieldComparison.displayName = "CrossChainYieldComparison";
