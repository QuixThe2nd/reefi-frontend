import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { UseContracts } from "../useContracts"
import { UseBalances } from "../useBalances"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  balances: UseBalances
  chain: Chains
  clients: Clients
  setConnectRequired: (_val: boolean) => void
  updateUnsubmittedWithdraws: () => void
  updateUserPendingWithdraws: () => void
  updateUserWithdrawable: () => void
  writeContracts: UseContracts<Clients>
}

export const useWithdrawMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, setConnectRequired, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const setConnectRequiredRef = useRef(setConnectRequired)
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
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

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

  const withdrawMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].rMGP.write.unlock({ account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    await writeContractsRef.current[chainRef.current].rMGP.write.withdraw({ account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    balancesRef.current.MGP[1]()
    updateUserPendingWithdrawsRef.current()
    updateUnsubmittedWithdrawsRef.current()
    updateUserWithdrawableRef.current()
  }, [])

  return withdrawMGP
}