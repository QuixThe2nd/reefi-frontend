import { useMemo, useCallback } from "react"
import { type Coins, contracts, decimals, publicClients } from "../config/contracts"
import { aprToApy, formatEther } from "../utils"
import { useCachedUpdateable } from "./useUpdateable"
import { UseBalances } from "./useBalances"
import { UsePrices } from "./usePrices"
import { UseWallet } from "./useWallet"

type PendingRewards = Record<Coins, { address: `0x${string}`; rewards: bigint; }> | Record<string, never>

interface Props {
  readonly wallet: UseWallet
  readonly prices: UsePrices,
  readonly balances: UseBalances
}

export interface UseRewards {
  mgpAPR: number
  pendingRewards: PendingRewards
  unclaimedUserYield: bigint
  cmgpAPY: number
  cmgpPoolAPY: number
  uncompoundedMGPYield: number
  estimatedCompoundGasFee: number
  estimatedCompoundAmount: [bigint | undefined, () => void]
  updatePendingRewards: () => void
  updateUnclaimedUserYield: () => void
}  

export const useRewards = ({ wallet, prices, balances }: Props): UseRewards => {
  const [cmgpPoolAPY] = useCachedUpdateable(async (): Promise<number> => {
    const res = await fetch('https://api.curve.finance/api/getVolumes/arbitrum')
    const curveBody = await res.json() as { data: { pools: { address: `0x${string}`, latestWeeklyApyPcent: number }[] }}
    for (const pool of curveBody.data.pools) if (pool.address === contracts[wallet.chain].CMGP.address) return pool.latestWeeklyApyPcent/100
    return 0
  }, [wallet.chain], 'cMGP Pool APY', 0)
  const [mgpAPR] = useCachedUpdateable(async () => {
    const res = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${wallet.chain}&rewarder=${contracts[wallet.chain].VLREWARDER.address}`)
    const body = await res.json() as { data: { rewardTokenInfo: { apr: number }[] }}
    let apr = 0
    for (const token of body.data.rewardTokenInfo) apr += token.apr
    return apr
  }, [], 'MGP APR', 0)
  const cmgpAPY = useMemo(() => {
    const yieldBearingUnderlyingPercent = Number(balances.rmgpCurve+balances.ymgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)
    const underlyingYield = yieldBearingUnderlyingPercent*aprToApy(mgpAPR)*0.9
    return underlyingYield+cmgpPoolAPY
  }, [cmgpPoolAPY, mgpAPR, balances.mgpCurve, balances.rmgpCurve, balances.ymgpCurve])

  const [unclaimedUserYield, updateUnclaimedUserYield] = useCachedUpdateable(() => contracts[wallet.chain].YMGP.read.unclaimedUserYield(), [contracts, wallet.chain], 'unclaimedUserYield', 0n)
  const [compoundRMGPGas] = useCachedUpdateable(async () => {
    const [gasPrice, gas] = await Promise.all([publicClients[wallet.chain].getGasPrice(), wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.estimateGas.claim({ account: wallet.account })])
    return gasPrice*gas
  }, [wallet.account, wallet.chain], 'Compound rMGP Gas', 0n)
  const [pendingRewards, updatePendingRewards] = useCachedUpdateable<PendingRewards>(async (): Promise<Record<Coins, { address: `0x${string}`, rewards: bigint }>> => {
    const data = await contracts[wallet.chain].MASTERMGP.read.allPendingTokens([contracts[wallet.chain].VLMGP.address, contracts[wallet.chain].RMGP.address])
    const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts[wallet.chain].MGP.address, rewards: data[0] } }
    for (const i in data[2]) if (data[2][i] !== undefined && data[3][i] !== undefined && data[1][i] !== undefined) newPendingRewards[data[2][i].replace('Bridged ', '').toUpperCase()] = { rewards: data[3][i], address: data[1][i] };
    return newPendingRewards
  }, [wallet.chain], 'Pending Rewards', {})
  const uncompoundedMGPYield = useMemo(() => Object.keys(pendingRewards).length > 0 ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[wallet.chain].chain.nativeCurrency.symbol])*prices[publicClients[wallet.chain].chain.nativeCurrency.symbol], [wallet.chain, compoundRMGPGas, prices])
  const estimatedCompoundAmount = useCachedUpdateable(async () => {
    if (wallet.clients === undefined || wallet.account === undefined) return
    const simulation = await contracts[wallet.chain].RMGP.simulate.claim({ account: wallet.account, chain: wallet.clients[wallet.chain].chain })
    return simulation.result
  }, [wallet.clients, wallet.chain, wallet.account], 'estimatedCompoundReward')

  useCallback(() => {
    const interval = setInterval(() => { updatePendingRewards() }, 30_000)
    return (): void => clearInterval(interval)
  }, [updatePendingRewards])

  return { mgpAPR, pendingRewards, unclaimedUserYield, cmgpAPY, cmgpPoolAPY, uncompoundedMGPYield, estimatedCompoundGasFee, updatePendingRewards, updateUnclaimedUserYield, estimatedCompoundAmount }
}