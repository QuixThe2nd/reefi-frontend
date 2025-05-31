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
  mgpLPAmount: bigint
  rmgpLPAmount: bigint
  setConnectRequired: (_val: boolean) => void
  writeContracts: UseContracts<Clients>
  ymgpLPAmount: bigint
}

export const useSupplyLiquidity = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, mgpLPAmount, rmgpLPAmount, setConnectRequired, writeContracts, ymgpLPAmount }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const balancesRef = useRef(balances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const mgpLPAmountRef = useRef(mgpLPAmount)
  const rmgpLPAmountRef = useRef(rmgpLPAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const writeContractsRef = useRef(writeContracts)
  const ymgpLPAmountRef = useRef(ymgpLPAmount)

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
    mgpLPAmountRef.current = mgpLPAmount
  }, [mgpLPAmount])

  useEffect(() => {
    rmgpLPAmountRef.current = rmgpLPAmount
  }, [rmgpLPAmount])

  useEffect(() => {
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  useEffect(() => {
    ymgpLPAmountRef.current = ymgpLPAmount
  }, [ymgpLPAmount])

  const supplyLiquidity = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].cMGP.write.add_liquidity([[mgpLPAmountRef.current, rmgpLPAmountRef.current, ymgpLPAmountRef.current], 0n], { account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    balancesRef.current.MGP[1]()
    balancesRef.current.rMGP[1]()
    balancesRef.current.yMGP[1]()
    balancesRef.current.cMGP[1]()
    balancesRef.current.updateMGPCurve()
    balancesRef.current.updateRMGPCurve()
    balancesRef.current.updateYMGPCurve()
  }, [])

  return supplyLiquidity
}