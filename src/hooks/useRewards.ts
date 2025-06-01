import { aprToApy, formatEther } from "../utilities";
import { contracts, decimals, publicClients, type Coins } from "../config/contracts";
import { useCachedUpdateable } from "./useUpdateable";
import { useCallback, useMemo } from "react";

import { UseBalances } from "./useBalances";
import { UseLocked } from "./useLocked";
import { UsePrices } from "./usePrices";
import { UseWallet } from "./useWallet";

type PendingRewards = Record<Coins, { address: `0x${string}`;
  rewards: bigint; }> | Record<string, never>;

interface Properties {
  readonly wallet: UseWallet;
  readonly prices: UsePrices;
  readonly balances: UseBalances;
  readonly locked: UseLocked;
}

export interface UseRewards {
  mgpAPR: number;
  pendingRewards: PendingRewards;
  unclaimedUserYield: bigint;
  cmgpAPY: number;
  lockedYmgpAPY: number;
  cmgpPoolAPY: number;
  uncompoundedMGPYield: number;
  estimatedCompoundGasFee: number;
  estimatedCompoundAmount: [bigint | undefined, () => void];
  updatePendingRewards: () => void;
  updateUnclaimedUserYield: () => void;
}

export const useRewards = ({ wallet, prices, balances, locked }: Properties): UseRewards => {
  const [cmgpPoolAPY] = useCachedUpdateable(async (): Promise<number> => {
    const response = await fetch("https://api.curve.finance/api/getVolumes/arbitrum");
    const curveBody = await response.json() as { data: { pools: { address: `0x${string}`; latestWeeklyApyPcent: number }[] } };
    curveBody.data.pools.forEach(pool => {
      if (pool.address === contracts[wallet.chain].cMGP.address) return pool.latestWeeklyApyPcent / 100;
    });

    return 0;
  }, [wallet.chain], "cMGP Pool APY", 0);

  const [mgpAPR] = useCachedUpdateable(async () => {
    const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${wallet.chain}&rewarder=${contracts[wallet.chain].VLREWARDER.address}`);
    const body = await response.json() as { data: { rewardTokenInfo: { apr: number }[] } };
    let apr = 0;
    body.data.rewardTokenInfo.forEach(token => {
      apr += token.apr;
    });
    return apr;
  }, [], "MGP APR", 0);
  const cmgpAPY = useMemo(() => {
    const yieldBearingUnderlyingPercent = Number(balances.rmgpCurve + balances.ymgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve);
    const underlyingYield = yieldBearingUnderlyingPercent * aprToApy(mgpAPR) * 0.9;
    return underlyingYield + cmgpPoolAPY;
  }, [cmgpPoolAPY, mgpAPR, balances.mgpCurve, balances.rmgpCurve, balances.ymgpCurve]);
  const [unclaimedUserYield, updateUnclaimedUserYield] = useCachedUpdateable(() => contracts[wallet.chain].yMGP.read.unclaimedUserYield(), [contracts, wallet.chain], "unclaimedUserYield", 0n);
  const [compoundRMGPGas] = useCachedUpdateable(async () => {
    const [gasPrice, gas] = await Promise.all([publicClients[wallet.chain].getGasPrice(), wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.estimateGas.claim({ account: wallet.account })]);
    return gasPrice * gas;
  }, [wallet.account, wallet.chain], "Compound rMGP Gas", 0n);
  const [pendingRewards, updatePendingRewards] = useCachedUpdateable<PendingRewards>(async (): Promise<Record<Coins, { address: `0x${string}`; rewards: bigint }>> => {
    type PendingTokensResponse = [bigint, `0x${string}`[], string[], bigint[]];
    const data = await contracts[wallet.chain].MASTERMGP.read.allPendingTokens([contracts[wallet.chain].VLMGP.address, contracts[wallet.chain].rMGP.address]) as PendingTokensResponse;
    const newPendingRewards: Record<string, { address: `0x${string}`; rewards: bigint }> = { MGP: { address: contracts[wallet.chain].MGP.address, rewards: data[0] } };
    data[2].forEach((token, index) => {
      if (data[2][index] && data[3][index] && data[1][index]) newPendingRewards[token.replace("Bridged ", "").toUpperCase()] = { address: data[1][index], rewards: data[3][index] };
    });

    return newPendingRewards;
  }, [wallet.chain], "Pending Rewards", {});
  const uncompoundedMGPYield = useMemo(() => Object.keys(pendingRewards).length > 0 ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0) / prices.MGP : 0, [pendingRewards, prices]);
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals.WETH) * prices.WETH, [compoundRMGPGas, prices]);
  const lockedYmgpAPY = useMemo(() => Number(locked.reefiMGP) * aprToApy(mgpAPR) * 0.05 / Number(locked.ymgp) + aprToApy(mgpAPR) * 0.9, [locked.reefiMGP, mgpAPR, locked.ymgp]);
  const estimatedCompoundAmount = useCachedUpdateable(async () => {
    if (wallet.clients === undefined || wallet.account === undefined) return;

    const simulation = await contracts[wallet.chain].rMGP.simulate.claim({ account: wallet.account, chain: wallet.clients[wallet.chain].chain });
    return simulation.result;
  }, [wallet.clients, wallet.chain, wallet.account], "estimatedCompoundReward");

  useCallback(() => {
    const interval = setInterval(updatePendingRewards, 30_000);
    return (): void => clearInterval(interval);
  }, [updatePendingRewards]);

  return { cmgpAPY, cmgpPoolAPY, estimatedCompoundAmount, estimatedCompoundGasFee, lockedYmgpAPY, mgpAPR, pendingRewards, unclaimedUserYield, uncompoundedMGPYield, updatePendingRewards, updateUnclaimedUserYield };
};
