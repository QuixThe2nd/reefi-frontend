import { useMemo, useCallback } from "react"
import { Chains, type Coins, contracts, decimals, publicClients } from "../config/contracts"
import { aprToApy, formatEther } from "../utils"
import { useUpdateable } from "./useUpdateable"
import { Balances } from "./useBalances"
import { Prices } from "./usePrices"

interface Props {
  readonly chain: Chains,
  readonly account: `0x${string}` | undefined,
  readonly prices: Prices,
  readonly balances: Balances
}

interface Yield {
  mgpAPR: number
  pendingRewards: Record<Coins, { address: `0x${string}`; rewards: bigint; }> | undefined
  unclaimedUserYield: bigint
  cmgpAPY: number
  cmgpPoolAPY: number
  uncompoundedMGPYield: number
  estimatedCompoundGasFee: number
  updatePendingRewards: () => void
  updateUnclaimedUserYield: () => void
}  

export const useYield = ({ chain, account, prices, balances }: Props): Yield => {
  const [cmgpPoolAPY] = useUpdateable(async (): Promise<number> => {
    const res = await fetch('https://api.curve.finance/api/getVolumes/arbitrum')
    const curveBody = await res.json() as { data: { pools: { address: `0x${string}`, latestWeeklyApyPcent: number }[] }}
    for (const pool of curveBody.data.pools) if (pool.address === contracts[chain].CMGP.address) return pool.latestWeeklyApyPcent/100
    return 0
  }, [chain], 'cMGP Pool APY', 0)
  const [mgpAPR] = useUpdateable(async () => {
    const res = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].VLREWARDER.address}`)
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

  const [unclaimedUserYield, updateUnclaimedUserYield] = useUpdateable(() => contracts[chain].YMGP.read.unclaimedUserYield(), [contracts, chain], 'unclaimedUserYield', 0n)
  const [compoundRMGPGas] = useUpdateable(async () => {
    const [gasPrice, gas] = await Promise.all([publicClients[chain].getGasPrice(), account === undefined ? 0n : contracts[chain].RMGP.estimateGas.claim({ account })])
    return gasPrice*gas
  }, [account, chain], 'Compound rMGP Gas', 0n)
  const [pendingRewards, updatePendingRewards] = useUpdateable(async (): Promise<Record<Coins, { address: `0x${string}`, rewards: bigint }>> => {
    const data = await contracts[chain].MASTERMGP.read.allPendingTokens([contracts[chain].VLMGP.address, contracts[chain].RMGP.address])
    const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts[chain].MGP.address, rewards: data[0] } }
    for (const i in data[2]) if (data[2][i] !== undefined && data[3][i] !== undefined && data[1][i] !== undefined) newPendingRewards[data[2][i].replace('Bridged ', '').toUpperCase()] = { rewards: data[3][i], address: data[1][i] };
    return newPendingRewards
  }, [chain], 'Pending Rewards')
  const uncompoundedMGPYield = useMemo(() => pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[chain].chain.nativeCurrency.symbol])*prices[publicClients[chain].chain.nativeCurrency.symbol], [chain, compoundRMGPGas, prices])

  useCallback(() => {
    const interval = setInterval(() => { updatePendingRewards() }, 30_000)
    return (): void => clearInterval(interval)
  }, [updatePendingRewards])

  return { mgpAPR, pendingRewards, unclaimedUserYield, cmgpAPY, cmgpPoolAPY, uncompoundedMGPYield, estimatedCompoundGasFee, updatePendingRewards, updateUnclaimedUserYield }
}