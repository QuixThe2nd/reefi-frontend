import { useState, useMemo, useEffect, useCallback } from "react"
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
  cmgpPoolAPY: number
  cmgpAPY: number
  uncompoundedMGPYield: number
  estimatedCompoundGasFee: number
  updatePendingRewards: () => void
  updateUnclaimedUserYield: () => void
}  

export const useYield = ({ chain, account, prices, balances }: Props): Yield => {
  const [mgpAPR, setMGPAPR] = useState(0)
  const [pendingRewards, setPendingRewards] = useState<Record<Coins, { address: `0x${string}`, rewards: bigint }> | undefined>()
  const [unclaimedUserYield, updateUnclaimedUserYield] = useUpdateable(() => contracts[chain].YMGP.read.unclaimedUserYield(), [contracts, chain], 'unclaimedUserYield', 0n)
  const [cmgpPoolAPY, setCMGPPoolAPY] = useState(0)
  const cmgpAPY = useMemo(() => {
    const yieldBearingUnderlyingPercent = Number(balances.rmgpCurve+balances.ymgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)
    const underlyingYield = yieldBearingUnderlyingPercent*aprToApy(mgpAPR)*0.9
    return underlyingYield+(cmgpPoolAPY/100)
  }, [cmgpPoolAPY, mgpAPR, balances.mgpCurve, balances.rmgpCurve, balances.ymgpCurve])
  const [compoundRMGPGas, setCompoundRMGPGas] = useState(0n)
  const uncompoundedMGPYield = useMemo(() => {
    return pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0
  }, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[chain].chain.nativeCurrency.symbol])*prices[publicClients[chain].chain.nativeCurrency.symbol], [chain, compoundRMGPGas, prices])
  const updatePendingRewards = useCallback((): void => {
    contracts[chain].MASTERMGP.read.allPendingTokens([contracts[chain].VLMGP.address, contracts[chain].RMGP.address]).then(data => {
      const [pendingMGP, bonusTokenAddresses, bonusTokenSymbols, pendingBonusRewards] = data
      const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts[chain].MGP.address, rewards: pendingMGP } }
      for (const i in bonusTokenSymbols) if (bonusTokenSymbols[i] !== undefined && pendingBonusRewards[i] !== undefined && bonusTokenAddresses[i] !== undefined) newPendingRewards[bonusTokenSymbols[i].replace('Bridged ', '').toUpperCase()] = { rewards: pendingBonusRewards[i], address: bonusTokenAddresses[i] };
      setPendingRewards(newPendingRewards)
    })  
  }, [chain])

  const estimateCompoundRMGPGas = useCallback(async (): Promise<bigint> => {
    const gasPrice = await publicClients[chain].getGasPrice()
    const gas = account === undefined ? 0n : await contracts[chain].RMGP.estimateGas.claim({ account })
    return gas*gasPrice
  }, [account, chain])

  useEffect(() => {
    const interval = setInterval(() => { updatePendingRewards() }, 30_000)
    return (): void => clearInterval(interval)
  }, [updatePendingRewards])

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetch('https://api.curve.finance/api/getVolumes/arbitrum')
      const body = await res.json() as { data: { pools: { address: `0x${string}`, latestWeeklyApyPcent: number }[] }}
      for (const pool of body.data.pools) {
        if (pool.address === contracts[chain].CMGP.address) setCMGPPoolAPY(pool.latestWeeklyApyPcent)
      }
    })()
    updatePendingRewards();
    (async (): Promise<void> => {
      const res = await fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].VLREWARDER.address}`)
      const body = await res.json() as { data: { rewardTokenInfo: { apr: number }[] }}
      let apr = 0
      for (const token of body.data.rewardTokenInfo) {
        apr += token.apr
      }
      setMGPAPR(apr)
    })()
  }, [chain, updatePendingRewards])

  useEffect(() => {
    estimateCompoundRMGPGas().then(setCompoundRMGPGas)
  }, [chain, account, estimateCompoundRMGPGas])

  return { mgpAPR, pendingRewards, unclaimedUserYield, cmgpPoolAPY, cmgpAPY, uncompoundedMGPYield, estimatedCompoundGasFee, updatePendingRewards, updateUnclaimedUserYield }
}