import { contracts, decimals, type SecondaryCoin } from "../config/contracts";
import { encodeFunctionData } from "viem/utils";
import { formatEther } from "../utilities";
import { useAccount, useChainId, useEstimateGas, useGasPrice, useReadContract, useSimulateContract } from "wagmi";
import { useLoggedEffect } from "..";
import { useState } from "react";
import zod from "zod";

import { ABIs } from "../config/ABIs/abis";

import type { usePrices } from "./usePrices";

const CurveResponseSchema = zod.object({
  data: zod.object({
    pools: zod.array(zod.object({
      address: zod.string().regex(/^0x[\dA-Fa-f]+$/u),
      latestWeeklyApyPcent: zod.number()
    }))
  })
});

const MagpieResponseSchema = zod.object({
  data: zod.object({
    rewardTokenInfo: zod.array(zod.object({
      apr: zod.number()
    }))
  })
});

export const useRewards = ({ prices }: { prices: ReturnType<typeof usePrices> }) => {
  const chain = useChainId();
  const [rewards, setRewards] = useState({
    vlmgpAPR: 0,
    cmgpPoolAPY: 0,
    user: { lvMGP: 0n }
  });


  useLoggedEffect(() => {
    (async () => {
      // TODO: switch chains
      const response = await fetch("https://api.curve.finance/api/getVolumes/arbitrum");
      const curveBody = CurveResponseSchema.parse(await response.json());
      for (const pool of curveBody.data.pools) if (pool.address === contracts[chain].cMGP) setRewards(y => ({ ...y, cmgpPoolAPY: pool.latestWeeklyApyPcent / 100 }));
    })();
    (async () => {
      const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].vlRewarder}`);
      const body = MagpieResponseSchema.parse(await response.json());
      let vlmgpAPR = 0;
      for (const token of body.data.rewardTokenInfo) vlmgpAPR += token.apr;
      setRewards(r => ({ ...r, vlmgpAPR }));
    })();
  }, [], "Fetching rewards");

  const { data } = useReadContract({ abi: ABIs.masterMGP, address: contracts[chain].masterMGP, functionName: "allPendingTokens", args: [contracts[chain].vlMGP, contracts[chain].wstMGP] });
  const pendingRewards = { MGP: { address: contracts[chain].MGP, rewards: data?.[0] ?? 0n } } as unknown as Record<SecondaryCoin, { address: `0x${string}`; rewards: bigint }>;
  data?.[2].forEach((token, index) => {
    if (data[2][index] && data[3][index] && data[1][index]) pendingRewards[token.replace("Bridged ", "").toUpperCase() as SecondaryCoin] = { address: data[1][index], rewards: data[3][index] };
  });
  const rewardCoins = Object.keys(pendingRewards) as SecondaryCoin[];
  const estimatedMGP = rewardCoins.map(symbol => prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0) / prices.MGP;

  // const cmgpAPY = useMemo(() => {
  //   const yieldBearingUnderlyingPercent = Number(balances.curve.rMGP + balances.curve.yMGP) / Number(balances.curve.MGP + balances.curve.rMGP + balances.curve.yMGP);
  //   const underlyingYield = yieldBearingUnderlyingPercent * aprToApy(rewards.vlmgpAPR) * 0.9;
  //   return underlyingYield + rewards.cmgpPoolAPY;
  // }, [rewards.cmgpPoolAPY, rewards.vlmgpAPR, balances.curve.MGP, balances.curve.rMGP, balances.curve.yMGP]);
  // const estimatedCompoundGasFee = useMemo(() => formatEther(rewards.compoundRMGPGas, decimals.WETH) * tokenState.prices.WETH, [rewards.compoundRMGPGas, prices]);

  const { address } = useAccount();
  const gas = useEstimateGas({ to: contracts[chain].wstMGP, data: encodeFunctionData({ abi: ABIs.wstMGP, functionName: "claim" }), value: 0n, account: address }).data ?? 0n;
  const gasPrice = useGasPrice().data ?? 0n;
  const estimatedGas = gas * gasPrice;

  const estimatedYMGP = useSimulateContract({ abi: ABIs.wstMGP, address: contracts[chain].wstMGP, functionName: "claim" }).data?.result ?? 0n;
  return {
    ...rewards,
    user: {
      ...rewards.user,
      lyMGP: useReadContract({ abi: ABIs.yMGP, address: contracts[chain].yMGP, functionName: "unclaimedUserYield" }).data ?? 0n
    },
    reefi: {
      vlMGP: { estimatedYMGP, estimatedGas, pendingRewards, estimatedMGP }
    }
  };
};
