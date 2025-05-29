import { useRef, useEffect, useCallback } from "react"
import { Chains } from "../../config/contracts"
import { WalletClient, PublicActions } from "viem"
import { UseContracts } from "../useContracts"

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined
  chain: Chains
  clients: Clients
  setConnectRequired: (_val: boolean) => void
  updateUnclaimedUserYield: () => void
  writeContracts: UseContracts<Clients>
}

export const useClaimYMGPRewards = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, setConnectRequired, updateUnclaimedUserYield, writeContracts }: Props<Clients>): () => void => {
  const accountRef = useRef(account)
  const chainRef = useRef(chain)
  const clientsRef = useRef(clients)
  const setConnectRequiredRef = useRef(setConnectRequired)
  const updateUnclaimedUserYieldRef = useRef(updateUnclaimedUserYield)
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
    setConnectRequiredRef.current = setConnectRequired
  }, [setConnectRequired])

  useEffect(() => {
    updateUnclaimedUserYieldRef.current = updateUnclaimedUserYield
  }, [updateUnclaimedUserYield])

  useEffect(() => {
    writeContractsRef.current = writeContracts
  }, [writeContracts])

  const claimYMGPRewards = useCallback(async (): Promise<void> => {
    if (!clientsRef.current || !writeContractsRef.current || accountRef.current === undefined) return setConnectRequiredRef.current(true)
    await writeContractsRef.current[chainRef.current].YMGP.write.claim({ account: accountRef.current, chain: clientsRef.current[chainRef.current].chain })
    updateUnclaimedUserYieldRef.current()
  }, [])

  return claimYMGPRewards
}