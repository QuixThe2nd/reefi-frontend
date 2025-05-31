import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { UseAllowances } from "../useAllowances"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  allowances: UseAllowances
  chain: Chains
  clients: Clients
  sendAmount: bigint
  setConnectRequired: (_val: boolean) => void
  setError: (_val: string) => void
  setNotification: (_val: string) => void
}

export const useSwap = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, sendAmount, setConnectRequired, setError, setNotification }: Props<Clients>): (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void => {
  const accountRef = useRef(account)
  const allowancesRef = useRef(allowances)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const sendAmountRef = useRef(sendAmount)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const setErrorRef = useRef(setError)
  const setNotificationRef = useRef(setNotification)

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
    setNotificationRef.current = setNotification
  }, [setNotification])

  const buyRMGP = useCallback(async (tokenIn: `0x${string}`, tokenOut: `0x${string}`): Promise<void> => {
    if (!clientsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    if (allowancesRef.current.curve.MGP[0] < sendAmountRef.current) return setErrorRef.current('Allowance too low')

    setNotificationRef.current('Fetching swap route')
    const quoteRequestBody = {
      chainId: chainRef.current ,
      inputTokens: [{ tokenAddress: tokenIn, amount: String(sendAmountRef.current) }],
      outputTokens: [{ tokenAddress: tokenOut, proportion: 1 }],
      userAddr: accountRef.current,
      slippageLimitPercent: 5,
      referralCode: 0,
      disableRFQs: true,
      compact: true,
    };
    const response = await fetch('https://api.odos.xyz/sor/quote/v2', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quoteRequestBody) });
    if (!response.ok) return setError('Failed to find route')
    setNotificationRef.current('Assembling transaction')
    const assembleRequestBody = { userAddr: accountRef.current, pathId: (await response.json() as { pathId: string }).pathId, simulate: false };
    const response2 = await fetch('https://api.odos.xyz/sor/assemble', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(assembleRequestBody)});
    const { transaction } = await response2.json() as { transaction: { gas: number } }
    await clientsRef.current[chainRef.current].sendTransaction({ ...transaction, account: accountRef.current, chain: undefined, gas: BigInt(Math.max(transaction.gas, 0)) })
  }, [])

  return buyRMGP
}
