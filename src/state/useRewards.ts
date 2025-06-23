import { aprToApy, formatEther } from "../utilities";
import { encodeFunctionData } from "viem/utils";
import { useAccount, useChainId, useEstimateGas, useGasPrice, useReadContract, useSimulateContract } from "wagmi";
import { useEffect, useState } from "react";
import zod from "zod";

import { ABIs } from "../ABIs/abis";

import { type Contracts, decimals, type SecondaryCoin } from "./useContracts";
import type { Supplies } from "./useSupplies";
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

export const useRewards = ({ prices, contracts, supplies }: { prices: ReturnType<typeof usePrices>; contracts: Contracts; supplies: Supplies }) => {
  const chain = useChainId();
  const { address } = useAccount();
  const [cmgpPoolAPY, setCmgpPoolAPY] = useState(0);
  const [vlmgpAPR, setVlmgpAPR] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await fetch(`https://api.curve.finance/api/getVolumes/${chain === 42_161 ? "arbitrum" : "bsc"}`);
      const curveBody = CurveResponseSchema.parse(await response.json());
      for (const pool of curveBody.data.pools) if (pool.address === contracts[chain].cMGP) setCmgpPoolAPY(pool.latestWeeklyApyPcent / 100);
    })();
    (async () => {
      const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].vlRewarder}`);
      const body = MagpieResponseSchema.parse(await response.json());
      let apr = 0;
      for (const token of body.data.rewardTokenInfo) apr += token.apr;
      setVlmgpAPR(apr);
    })();
  }, [chain, contracts]);

  const { data } = useReadContract({ abi: ABIs.masterMagpie, address: contracts[chain].masterMagpie, functionName: "allPendingTokens", args: [contracts[chain].vlMGP, contracts[chain].lockManager] });
  const pendingRewards = { MGP: { address: contracts[chain].MGP, rewards: data?.[0] ?? 0n } } as unknown as Record<SecondaryCoin, { address: `0x${string}`; rewards: bigint }>;
  data?.[2].forEach((token, index) => {
    if (data[2][index] && data[3][index] && data[1][index]) pendingRewards[token.replace("Bridged ", "").toUpperCase() as SecondaryCoin] = { address: data[1][index], rewards: data[3][index] };
  });
  const rewardCoins = Object.keys(pendingRewards) as SecondaryCoin[];
  const estimatedMGP = rewardCoins.map(symbol => prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0) / prices.MGP;

  const gas = useEstimateGas({ to: contracts[chain].stMGP, data: encodeFunctionData({ abi: ABIs.stMGP, functionName: "compound" }), value: 0n, account: address }).data ?? 0n;
  const gasPrice = useGasPrice().data ?? 0n;
  const estimatedGas = gas * gasPrice;

  const estimatedRMGP = useSimulateContract({ address: contracts[chain].stMGP, abi: ABIs.stMGP, functionName: "compound" }).data?.result ?? 0n;
  const stmgpAPY = aprToApy(vlmgpAPR) * 0.9;
  return {
    cmgpPoolAPY,
    vlMGP: { estimatedRMGP, estimatedGas, pendingRewards, estimatedMGP, APR: vlmgpAPR },
    stMGP: {
      APY: stmgpAPY
    },
    syMGP: {
      APY: stmgpAPY + Number(supplies.stMGP) * stmgpAPY / 18 / Number(supplies.syMGP)
    }
  };
};
