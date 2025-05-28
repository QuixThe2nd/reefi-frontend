import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { Contracts } from "../useContracts"
import { Allowances } from "../useAllowances"
import { Balances } from "../useBalances"
import { Supplies } from "../useSupplies"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: Allowances
  balances: Balances
  chain: Chains
  clients: Clients
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  setError: (_val: string) => void
  supplies: Supplies
  updateReefiLockedMGP: () => void
  updateTotalLockedMGP: () => void
  writeContracts: Contracts<Clients>
}

export const useDepositMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, supplies, updateReefiLockedMGP, updateTotalLockedMGP, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const allowancesRef = useRef(allowances)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const setErrorRef = useRef(setError)
  const suppliesRef = useRef(supplies)
  const updateReefiLockedMGPRef = useRef(updateReefiLockedMGP)
  const updateTotalLockedMGPRef = useRef(updateTotalLockedMGP)
  const writeContractsRef = useRef(writeContracts)

  useEffect(() => {
    accountRef.current = account
  }, [account])

  useEffect(() => {
    allowancesRef.current = allowances
  }, [allowances])

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
    setErrorRef.current = setError
  }, [setError])

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
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const depositMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    if (allowancesRef.current.mgp < sendAmountRef.current) return setErrorRef.current('Allowance too low')
    await writeContractsRef.current[chainRef.current].RMGP.write.deposit([sendAmountRef.current], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    balancesRef.current.updateMGP()
    balancesRef.current.updateRMGP()
    suppliesRef.current.updateMGP()
    suppliesRef.current.updateRMGP()
    updateTotalLockedMGPRef.current()
    updateReefiLockedMGPRef.current()
  }, [])

  return depositMGP
}