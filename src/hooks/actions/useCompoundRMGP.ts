import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { Contracts } from "../useContracts"
import { Balances } from "../useBalances"
import { UseSupplies } from "../useSupplies"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  balances: Balances
  chain: Chains
  clients: Clients
  setConnectRequired: (_val: boolean) => void
  supplies: UseSupplies
  updatePendingRewards: () => void
  updateReefiLockedMGP: () => void
  updateTotalLockedMGP: () => void
  updateUnclaimedUserYield: () => void
  writeContracts: Contracts<Clients>
}

export const useCompoundRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, setConnectRequired, supplies, updatePendingRewards, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const suppliesRef = useRef(supplies)
  const updatePendingRewardsRef = useRef(updatePendingRewards)
  const updateReefiLockedMGPRef = useRef(updateReefiLockedMGP)
  const updateTotalLockedMGPRef = useRef(updateTotalLockedMGP)
  const updateUnclaimedUserYieldRef = useRef(updateUnclaimedUserYield)
  const writeContractsRef = useRef(writeContracts)

  useEffect(() => {
    accountRef.current = account
  }, [account])

  useEffect(() => {
    balancesRef.current = balances
  }, [balances])

  useEffect(() => {
    chainRef.current = chain
  }, [chain])

  useEffect(() => {
    clientsRef.current = clients
  }, [clients])

  useEffect(() => {
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

  useEffect(() => {
    suppliesRef.current = supplies
  }, [supplies])

  useEffect(() => {
    updatePendingRewardsRef.current = updatePendingRewards
  }, [updatePendingRewards])

  useEffect(() => {
    updateReefiLockedMGPRef.current = updateReefiLockedMGP
  }, [updateReefiLockedMGP])

  useEffect(() => {
    updateTotalLockedMGPRef.current = updateTotalLockedMGP
  }, [updateTotalLockedMGP])

  useEffect(() => {
    updateUnclaimedUserYieldRef.current = updateUnclaimedUserYield
  }, [updateUnclaimedUserYield])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const compoundRMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].RMGP.write.claim({ account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    updatePendingRewardsRef.current()
    updateUnclaimedUserYieldRef.current()
    suppliesRef.current.updateRMGP()
    balancesRef.current.updateRMGP()
    updateTotalLockedMGPRef.current()
    updateReefiLockedMGPRef.current()
  }, [])

  return compoundRMGP
}