import { aprToApy, formatEther, parseEther } from "../utilities";
import { contracts, decimals, publicClients } from "../config/contracts";
import { useBalances } from "../state/useBalances";
import { useCallback, useEffect, useMemo } from "react";
import { useStoredObject } from "./useStoredState";
import { useWallet } from "../state/useWallet";

import { UsePrices } from "./usePrices";

interface Properties {
  readonly wallet: ReturnType<typeof useWallet>[0];
  readonly prices: UsePrices;
  readonly balances: ReturnType<typeof useBalances>[0];
}

interface Rewards {
  cmgpPoolAPY: number;
  mgpAPR: number;
  compoundRMGPGas: bigint;
  estimatedCompoundAmount: bigint;
  pendingRewards: Record<string, { address: `0x${string}`; rewards: bigint }>;
  unclaimedUserYield: bigint;
  unclaimedUserVMGPYield: bigint;
}

interface UpdateRewards {
  cmgpPoolAPY: () => Promise<void>;
  mgpAPR: () => Promise<void>;
  compoundRMGPGas: () => Promise<void>;
  estimatedCompoundAmount: () => Promise<void>;
  pendingRewards: () => Promise<void>;
  unclaimedUserYield: () => Promise<void>;
}

export interface UseRewards {
  rewards: Rewards & {
    cmgpAPY: number;
    estimatedCompoundGasFee: number;
    lockedYmgpAPY: number;
    uncompoundedMGPYield: number;
  };
  updateRewards: UpdateRewards;
}

export const useRewards = ({ wallet, prices, balances }: Properties): UseRewards => {
  const [rewards, setRewards] = useStoredObject<Rewards>("rewards", { cmgpPoolAPY: 0, compoundRMGPGas: 0n, estimatedCompoundAmount: 0n, mgpAPR: 0, pendingRewards: {}, unclaimedUserYield: 0n, unclaimedUserVMGPYield: parseEther(0.5) });

  const updateRewards: UpdateRewards = {
    cmgpPoolAPY: async () => {
      // TODO: switch chains
      const response = await fetch("https://api.curve.finance/api/getVolumes/arbitrum");
      const curveBody = await response.json() as { data: { pools: { address: `0x${string}`; latestWeeklyApyPcent: number }[] } };
      curveBody.data.pools.forEach(pool => {
        if (pool.address === contracts[wallet.chain].cMGP.address) setRewards({ cmgpPoolAPY: pool.latestWeeklyApyPcent / 100 });
      });
    },
    compoundRMGPGas: async () => {
      const [gasPrice, gas] = await Promise.all([publicClients[wallet.chain].getGasPrice(), wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.estimateGas.claim({ account: wallet.account })]);
      setRewards({ compoundRMGPGas: gasPrice * gas });
    },
    estimatedCompoundAmount: async () => {
      if (wallet.clients === undefined || wallet.account === undefined) return;
      const simulation = await contracts[wallet.chain].rMGP.simulate.claim({ account: wallet.account, chain: wallet.clients[wallet.chain].chain });
      setRewards({ estimatedCompoundAmount: simulation.result });
    },
    mgpAPR: async () => {
      const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${wallet.chain}&rewarder=${contracts[wallet.chain].vlRewarder.address}`);
      const body = await response.json() as { data: { rewardTokenInfo: { apr: number }[] } };
      let mgpAPR = 0;
      body.data.rewardTokenInfo.forEach(token => {
        mgpAPR += token.apr;
      });
      setRewards({ mgpAPR });
    },
    pendingRewards: async () => {
      type PendingTokensResponse = [bigint, `0x${string}`[], string[], bigint[]];
      const data = await contracts[wallet.chain].masterMGP.read.allPendingTokens([contracts[wallet.chain].vlMGP.address, contracts[wallet.chain].rMGP.address]) as PendingTokensResponse;
      const pendingRewards: Record<string, { address: `0x${string}`; rewards: bigint }> = { MGP: { address: contracts[wallet.chain].MGP.address, rewards: data[0] } };
      data[2].forEach((token, index) => {
        if (data[2][index] && data[3][index] && data[1][index]) pendingRewards[token.replace("Bridged ", "").toUpperCase()] = { address: data[1][index], rewards: data[3][index] };
      });
      setRewards({ pendingRewards });
    },
    unclaimedUserYield: () => contracts[wallet.chain].yMGP.read.unclaimedUserYield().then(unclaimedUserYield => setRewards({ unclaimedUserYield }))
  };

  useEffect(() => {
    updateRewards.cmgpPoolAPY();
    updateRewards.mgpAPR();
    updateRewards.compoundRMGPGas();
    updateRewards.unclaimedUserYield();
    updateRewards.pendingRewards();
  }, [wallet.chain]);

  useEffect(() => {
    updateRewards.estimatedCompoundAmount();
  }, [wallet.clients, wallet.chain, wallet.account]);

  const cmgpAPY = useMemo(() => {
    const yieldBearingUnderlyingPercent = Number(balances.curve.rMGP + balances.curve.yMGP) / Number(balances.curve.MGP + balances.curve.rMGP + balances.curveyMGP);
    const underlyingYield = yieldBearingUnderlyingPercent * aprToApy(rewards.mgpAPR) * 0.9;
    return underlyingYield + rewards.cmgpPoolAPY;
  }, [rewards.cmgpPoolAPY, rewards.mgpAPR, balances.curve.MGP, balances.curve.rMGP, balances.curve.yMGP]);
  const uncompoundedMGPYield = useMemo(() => Object.keys(rewards.pendingRewards).length > 0 ? (Object.keys(rewards.pendingRewards) as Coins[]).map(symbol => prices[symbol] * Number(formatEther(rewards.pendingRewards[symbol]?.rewards ?? 0n, decimals[symbol]))).reduce((sum, value) => sum + value, 0) / prices.MGP : 0, [rewards.pendingRewards, prices]);
  const estimatedCompoundGasFee = useMemo(() => formatEther(rewards.compoundRMGPGas, decimals.WETH) * prices.WETH, [rewards.compoundRMGPGas, prices]);
  const lockedYmgpAPY = useMemo(() => Number(locked.reefiMGP) * aprToApy(rewards.mgpAPR) * 0.05 / Number(balances.lyMGP) + aprToApy(rewards.mgpAPR) * 0.9, [locked.reefiMGP, rewards.mgpAPR, balances.lyMGP]);

  useCallback(() => {
    const interval = setInterval(updateRewards.pendingRewards, 30_000);
    return (): void => {
      clearInterval(interval);
    };
  }, [updateRewards.pendingRewards]);

  return { rewards: { ...rewards, cmgpAPY, estimatedCompoundGasFee, lockedYmgpAPY, uncompoundedMGPYield }, updateRewards };
};
