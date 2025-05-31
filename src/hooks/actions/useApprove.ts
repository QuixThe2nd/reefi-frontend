import { useRef, useEffect, useCallback } from "react"
import { Chains, Coins, contracts } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { Pages } from "../../App"
import { UseContracts } from "../useContracts"
import { UseAllowances } from "../useAllowances"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: UseAllowances
  chain: Chains
  clients: Clients
  page: Pages
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  writeContracts: UseContracts<Clients>
}

export const useApprove = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, page, sendAmount, setConnectRequired, writeContracts }: Props<Clients>): (_contract: 'RMGP' | 'YMGP' | 'CMGP' | 'ODOSRouter', _coin: Coins, _infinity: boolean) => void => {
  const accountRef = useRef(account)
  const allowancesRef = useRef(allowances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const pageRef = useRef(page)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
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
    pageRef.current = page
  }, [page])

  useEffect(() => {
    sendAmountRef.current = sendAmount
  }, [sendAmount])

  useEffect(() => {
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const approve = useCallback(async (contract: 'RMGP' | 'YMGP' | 'CMGP' | 'ODOSRouter', coin: Coins, infinity: boolean): Promise<void> => {
    if (clientsRef.current === undefined || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    const amount = infinity ? 2n ** 256n - 1n : sendAmountRef.current;
    await writeContractsRef.current[chainRef.current][coin].write.approve([contracts[chainRef.current][contract].address, amount], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    if (contract === 'CMGP') allowancesRef.current.curve[coin][1]()
    else if (contract === 'ODOSRouter') allowancesRef.current.odos[coin][1]()
    else allowancesRef.current.curve[coin][1]()
  }, [])

  return approve
}