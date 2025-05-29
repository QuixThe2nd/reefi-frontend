import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { Contracts } from "../useContracts"
import { Allowances } from "../useAllowances"
import { Balances } from "../useBalances"
import { UseSupplies } from "../useSupplies"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: Allowances
  balances: Balances
  chain: Chains
  clients: Clients
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  setError: (_val: string) => void
  supplies: UseSupplies
  updateYMGPHoldings: () => void
  writeContracts: Contracts<Clients>
}

export const useDepositRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, supplies, updateYMGPHoldings, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const allowancesRef = useRef(allowances)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const setErrorRef = useRef(setError)
  const suppliesRef = useRef(supplies)
  const updateYMGPHoldingsRef = useRef(updateYMGPHoldings)
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
    updateYMGPHoldingsRef.current = updateYMGPHoldings
  }, [updateYMGPHoldings])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const depositRMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    if (allowancesRef.current.rmgp < sendAmountRef.current) return setErrorRef.current('Allowance too low')
    await writeContractsRef.current[chainRef.current].YMGP.write.deposit([sendAmountRef.current], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    balancesRef.current.updateRMGP()
    balancesRef.current.updateYMGP()
    suppliesRef.current.updateRMGP()
    suppliesRef.current.updateYMGP()
    updateYMGPHoldingsRef.current()
  }, [])

  return depositRMGP
}