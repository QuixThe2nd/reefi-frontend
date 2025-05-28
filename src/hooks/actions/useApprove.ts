import { useRef, useEffect, useCallback } from "react"
import { Chains, contracts } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { Pages } from "../../App"
import { Contracts } from "../useContracts"
import { Allowances } from "../useAllowances"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: Allowances
  chain: Chains
  clients: Clients
  page: Pages
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  writeContracts: Contracts<Clients>
}

export const useApprove = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, page, sendAmount, setConnectRequired, writeContracts }: Props<Clients>): () => void => {
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

  const approve = useCallback(async (infinity = false, curve = false): Promise<void> => {
    if (clientsRef.current === undefined || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    if (pageRef.current === 'deposit') {
      const amount = infinity ? 2n ** 256n - 1n : sendAmountRef.current;
      await writeContractsRef.current[chainRef.current].MGP.write.approve([curve ? contracts[chainRef.current].CMGP.address : contracts[chainRef.current].RMGP.address, amount], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
      if (curve) allowancesRef.current.updateMGPCurve()
      else allowancesRef.current.updateMGP()
    } else if (pageRef.current === 'convert' || pageRef.current === 'redeem') {
      const amount = infinity ? 2n ** 256n - 1n : sendAmountRef.current;
      await writeContractsRef.current[chainRef.current].RMGP.write.approve([curve ? contracts[chainRef.current].CMGP.address : contracts[chainRef.current].YMGP.address, amount], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
      if (curve) allowancesRef.current.updateRMGPCurve()
      else allowancesRef.current.updateRMGP()
    }
  }, [])

  return approve
}