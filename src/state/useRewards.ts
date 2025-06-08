import { contracts, decimals, publicClients, SecondaryCoin } from "../config/contracts";
import { formatEther } from "../utilities";
import { usePrices } from "./usePrices";
import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";

export const useRewards = ({ wallet, prices }: { wallet: ReturnType<typeof useWallet>[0]; prices: ReturnType<typeof usePrices>[0] }) => {
  const [rewards, setRewards] = useState({
    vlmgpAPR: 0,
    cmgpPoolAPY: 0,
    user: { lyMGP: 0n, lvMGP: 0n },
    reefi: {
      vlMGP: {
        pendingRewards: {} as Record<string, { address: `0x${string}`; rewards: bigint }>,
        estimatedMGP: 0,
        estimatedYMGP: 0n,
        estimatedGas: 0n
      }
    }
  });

  useEffect(() => {
    (async () => {
      // TODO: switch chains
      const response = await fetch("https://api.curve.finance/api/getVolumes/arbitrum");
      const curveBody = await response.json() as { data: { pools: { address: `0x${string}`; latestWeeklyApyPcent: number }[] } };
      curveBody.data.pools.forEach(pool => {
        if (pool.address === contracts[wallet.chain].cMGP.address) setRewards(y => ({ ...y, cmgpPoolAPY: pool.latestWeeklyApyPcent / 100 }));
      });
    })();
    (async () => {
      const lyMGP = await contracts[wallet.chain].yMGP.read.unclaimedUserYield();
      setRewards(r => ({ ...r, user: { ...r.user, lyMGP } }));
    })();
    (async () => {
      const response = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${wallet.chain}&rewarder=${contracts[wallet.chain].vlRewarder.address}`);
      const body = await response.json() as { data: { rewardTokenInfo: { apr: number }[] } };
      let vlmgpAPR = 0;
      body.data.rewardTokenInfo.forEach(token => {
        vlmgpAPR += token.apr;
      });
      setRewards(r => ({ ...r, vlmgpAPR }));
    })();
  }, [wallet.chain]);

  useEffect(() => {
    (async () => {
      type PendingTokensResponse = [bigint, `0x${string}`[], string[], bigint[]];
      const data = await contracts[wallet.chain].masterMGP.read.allPendingTokens([contracts[wallet.chain].vlMGP.address, contracts[wallet.chain].wstMGP.address]) as PendingTokensResponse;
      const pendingRewards: Record<SecondaryCoin, { address: `0x${string}`; rewards: bigint }> = { MGP: { address: contracts[wallet.chain].MGP.address, rewards: data[0] } };
      data[2].forEach((token, index) => {
        if (data[2][index] && data[3][index] && data[1][index]) pendingRewards[token.replace("Bridged ", "").toUpperCase() as SecondaryCoin] = { address: data[1][index], rewards: data[3][index] };
      });
      setRewards(r => {
        const rewardCoins = Object.keys(pendingRewards) as SecondaryCoin[];
        const estimatedMGP = rewardCoins.map(symbol => prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0) / prices.MGP;
        return { ...r, reefi: { ...r.reefi, vlMGP: { ...r.reefi.vlMGP, pendingRewards, estimatedMGP } } };
      });
    })();
  }, [wallet.chain, prices]);

  useEffect(() => {
    (async () => {
      if (wallet.clients === undefined || wallet.account === undefined) return;
      const simulation = await contracts[wallet.chain].wstMGP.simulate.claim({ account: wallet.account, chain: wallet.clients[wallet.chain].chain });
      setRewards(y => ({ ...y, reefi: { ...y.reefi, vlMGP: { ...y.reefi.vlMGP, estimatedYMGP: simulation.result } } }));
    })();
    (async () => {
      const [gasPrice, gas] = await Promise.all([publicClients[wallet.chain].getGasPrice(), wallet.account === undefined ? 0n : contracts[wallet.chain].wstMGP.estimateGas.claim({ account: wallet.account })]);
      setRewards(y => ({ ...y, reefi: { ...y.reefi, vlMGP: { ...y.reefi.vlMGP, estimatedGas: gasPrice * gas } } }));
    })();
  }, [wallet.account, wallet.clients, wallet.chain]);

  // const cmgpAPY = useMemo(() => {
  //   const yieldBearingUnderlyingPercent = Number(balances.curve.rMGP + balances.curve.yMGP) / Number(balances.curve.MGP + balances.curve.rMGP + balances.curve.yMGP);
  //   const underlyingYield = yieldBearingUnderlyingPercent * aprToApy(rewards.vlmgpAPR) * 0.9;
  //   return underlyingYield + rewards.cmgpPoolAPY;
  // }, [rewards.cmgpPoolAPY, rewards.vlmgpAPR, balances.curve.MGP, balances.curve.rMGP, balances.curve.yMGP]);
  // const estimatedCompoundGasFee = useMemo(() => formatEther(rewards.compoundRMGPGas, decimals.WETH) * tokenState.prices.WETH, [rewards.compoundRMGPGas, prices]);
  return [rewards] as const;
};
