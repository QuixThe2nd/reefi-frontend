import { useState, useMemo, useEffect } from "react"
import { Chains, type Coins, contracts, decimals, publicClients } from "../config/contracts"
import { aprToApy, formatEther } from "../utils"
import { useUpdateable } from "./useUpdateable"
import { useBalances } from "./useBalances"
import { usePrices } from "./usePrices"

export const useYield = ({ chain, account }: { chain: Chains, account: `0x${string}` }) => {
  const balances = useBalances({ account, chain })
  const prices = usePrices()

  const [mgpAPR, setMGPAPR] = useState(0)
  const [pendingRewards, setPendingRewards] = useState<Record<Coins, { address: `0x${string}`, rewards: bigint }> | undefined>()
  const [unclaimedUserYield, updateUnclaimedUserYield] = useUpdateable(() => contracts[chain].YMGP.read.unclaimedUserYield(), [contracts, chain])
  const [cmgpPoolAPY, setCMGPPoolAPY] = useState(0)
  const cmgpAPY = useMemo(() => {
    if (balances.mgpCurve === undefined ||balances.rmgpCurve === undefined || balances.ymgpCurve === undefined) return 0
    const yieldBearingUnderlyingPercent = Number(balances.rmgpCurve+balances.ymgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)
    const underlyingYield = yieldBearingUnderlyingPercent*aprToApy(mgpAPR)*0.9
    return underlyingYield+(cmgpPoolAPY/100)
  }, [cmgpPoolAPY, mgpAPR, balances.mgpCurve, balances.rmgpCurve, balances.ymgpCurve])
  const [compoundRMGPGas, setCompoundRMGPGas] = useState(0n)
  const uncompoundedMGPYield = useMemo(() => {
    return pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))).reduce((sum, value) => sum + value, 0)/prices.MGP : 0
  }, [pendingRewards, prices])
  const estimatedCompoundGasFee = useMemo(() => formatEther(compoundRMGPGas, decimals[publicClients[chain].chain.nativeCurrency.symbol])*prices[publicClients[chain].chain.nativeCurrency.symbol], [chain, compoundRMGPGas, prices])
  const updatePendingRewards = async (): Promise<void> => {
    const data = await contracts[chain].MASTERMGP.read.allPendingTokens([contracts[chain].VLMGP.address, contracts[chain].RMGP.address])
    const [pendingMGP, bonusTokenAddresses, bonusTokenSymbols, pendingBonusRewards] = data
    const newPendingRewards: Record<string, { address: `0x${string}`, rewards: bigint }> = { MGP: { address: contracts[chain].MGP.address, rewards: pendingMGP } }
    for (const i in bonusTokenSymbols) if (bonusTokenSymbols[i] !== undefined && pendingBonusRewards[i] !== undefined && bonusTokenAddresses[i] !== undefined) newPendingRewards[bonusTokenSymbols[i].replace('Bridged ', '').toUpperCase()] = { rewards: pendingBonusRewards[i], address: bonusTokenAddresses[i] };
    setPendingRewards(newPendingRewards)
  }

  const estimateCompoundRMGPGas = async (): Promise<bigint> => {
    const gasPrice = await publicClients[chain].getGasPrice()
    const gas = account === '0x0000000000000000000000000000000000000000' ? 0n : await contracts[chain].RMGP.estimateGas.claim({ account })
    return gas*gasPrice
  }

  useEffect(() => {
    const interval = setInterval(updatePendingRewards, 30_000)
    return (): void => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch('https://api.curve.finance/api/getVolumes/arbitrum').then(res => res.json()).then((body: { data: { pools: { address: `0x${string}`, latestWeeklyApyPcent: number }[] } }) => {
      body.data.pools.forEach(pool => {
        if (pool.address === contracts[chain].CMGP.address) setCMGPPoolAPY(pool.latestWeeklyApyPcent)
      })
    })
    updatePendingRewards()
    fetch(`https://dev.api.magpiexyz.io/streamReward?chainId=${chain}&rewarder=${contracts[chain].VLREWARDER.address}`).then(res => res.json()).then(body => {setMGPAPR((body as { data: { rewardTokenInfo: { apr: number }[] }}).data.rewardTokenInfo.reduce((acc, token) => {return { ...token, apr: acc.apr+token.apr }}).apr)})
  }, [chain])

  useEffect(() => {
    if (!account) return
    estimateCompoundRMGPGas().then(setCompoundRMGPGas)
  }, [chain, account])

  return { mgpAPR, pendingRewards, unclaimedUserYield, cmgpPoolAPY, cmgpAPY, uncompoundedMGPYield, estimatedCompoundGasFee, updatePendingRewards, updateUnclaimedUserYield }
}