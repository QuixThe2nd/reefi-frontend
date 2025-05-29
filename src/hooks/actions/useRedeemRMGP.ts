
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
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  supplies: UseSupplies
  updateReefiLockedMGP: () => void
  updateTotalLockedMGP: () => void
  updateUnclaimedUserYield: () => void
  updateUnlockSchedule: () => void
  updateUnsubmittedWithdraws: () => void
  updateUserPendingWithdraws: () => void
  updateUserWithdrawable: () => void
  writeContracts: Contracts<Clients>
}

export const useRedeemRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, sendAmount, setConnectRequired, supplies, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, updateUnlockSchedule, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const suppliesRef = useRef(supplies)
  const updateReefiLockedMGPRef = useRef(updateReefiLockedMGP)
  const updateTotalLockedMGPRef = useRef(updateTotalLockedMGP)
  const updateUnclaimedUserYieldRef = useRef(updateUnclaimedUserYield)
  const updateUnlockScheduleRef = useRef(updateUnlockSchedule)
  const updateUnsubmittedWithdrawsRef = useRef(updateUnsubmittedWithdraws)
  const updateUserPendingWithdrawsRef = useRef(updateUserPendingWithdraws)
  const updateUserWithdrawableRef = useRef(updateUserWithdrawable)
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
    sendAmountRef.current = sendAmount
  }, [sendAmount])

  useEffect(() => {
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

  useEffect(() => {
    suppliesRef.current = supplies
  }, [supplies])

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
    updateUnlockScheduleRef.current = updateUnlockSchedule
  }, [updateUnlockSchedule])

  useEffect(() => {
    updateUnsubmittedWithdrawsRef.current = updateUnsubmittedWithdraws
  }, [updateUnsubmittedWithdraws])

  useEffect(() => {
    updateUserPendingWithdrawsRef.current = updateUserPendingWithdraws
  }, [updateUserPendingWithdraws])

  useEffect(() => {
    updateUserWithdrawableRef.current = updateUserWithdrawable
  }, [updateUserWithdrawable])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const redeemRMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].RMGP.write.startUnlock([sendAmountRef.current], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    updateUnlockScheduleRef.current()
    suppliesRef.current.updateRMGP()
    balancesRef.current.updateRMGP()
    updateTotalLockedMGPRef.current()
    updateReefiLockedMGPRef.current()
    updateUserPendingWithdrawsRef.current()
    updateUnsubmittedWithdrawsRef.current()
    updateUserWithdrawableRef.current()
    updateUnclaimedUserYieldRef.current()
  }, [])

  return redeemRMGP
}