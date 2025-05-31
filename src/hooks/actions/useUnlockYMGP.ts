import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { UseContracts } from "../useContracts"
import { UseSupplies } from "../useSupplies"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  chain: Chains
  clients: Clients
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  supplies: UseSupplies
  updateTotalLockedYMGP: () => void
  updateUserLockedYMGP: () => void
  writeContracts: UseContracts<Clients>
}

export const useUnlockYMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, sendAmount, setConnectRequired, supplies, updateTotalLockedYMGP, updateUserLockedYMGP, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const suppliesRef = useRef(supplies)
  const updateTotalLockedYMGPRef = useRef(updateTotalLockedYMGP)
  const updateUserLockedYMGPRef = useRef(updateUserLockedYMGP)
  const writeContractsRef = useRef(writeContracts)

  useEffect(() => {
    accountRef.current = account
  }, [account])

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
    updateTotalLockedYMGPRef.current = updateTotalLockedYMGP
  }, [updateTotalLockedYMGP])

  useEffect(() => {
    updateUserLockedYMGPRef.current = updateUserLockedYMGP
  }, [updateUserLockedYMGP])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const unlockYMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].yMGP.write.unlock([sendAmountRef.current], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    suppliesRef.current.updateYMGP()
    updateTotalLockedYMGPRef.current()
    updateUserLockedYMGPRef.current()
  }, [])

  return unlockYMGP
}