import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { UseContracts } from "../useContracts"
import { UseAllowances } from "../useAllowances"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: UseAllowances
  chain: Chains
  clients: Clients
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  setError: (_val: string) => void
  writeContracts: UseContracts<Clients>
}

export const useMintWETH = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const allowancesRef = useRef(allowances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const setErrorRef = useRef(setError)
  const writeContractsRef = useRef(writeContracts)

  useEffect(() => {
    accountRef.current = account
  }, [account])

  useEffect(() => {
    allowancesRef.current = allowances
  }, [allowances])

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
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const depositMGP = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    if (allowancesRef.current.MGP[0] < sendAmountRef.current) return setErrorRef.current('Allowance too low')
    await writeContractsRef.current[chainRef.current].WETH.write.deposit({ value: sendAmountRef.current, account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
  }, [])

  return depositMGP
}