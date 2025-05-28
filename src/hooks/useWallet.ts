import { useEffect, useState } from "react"
import { createWalletClient, custom, publicActions, type WalletClient, type PublicActions } from "viem"
import { arbitrum, bsc } from 'viem/chains'
import { publicClients, type Chains } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

interface UseWallet {
  readonly clients: Record<Chains, WalletClient & PublicActions> | undefined,
  readonly chain: Chains,
  readonly account: `0x${string}` | undefined,
  readonly isConnecting: boolean,
  readonly connectRequired: boolean,
  readonly connectWallet: () => void,
  readonly setChain: React.Dispatch<React.SetStateAction<Chains>>,
  readonly setConnectRequired: React.Dispatch<React.SetStateAction<boolean>>,
  readonly ens: string | null
}

export const useWallet = ({ setError }: { readonly setError: (_msg: string) => void }): UseWallet => {
  const [clients, setClients] = useState<Record<Chains, WalletClient & PublicActions> | undefined>()
  const [chain, setChain] = useState<Chains>(42161)
  const [account, updateAccount] = useUpdateable(async () => clients ? (await clients[chain].requestAddresses())[0] : undefined, [clients])
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectRequired, setConnectRequired] = useState(false)
  const [ens] = useUpdateable(async () => account !== undefined ? await publicClients[1].getEnsName({ address: account }) : null, [account], null)

  const connectWallet = (): void => {
    if (!window.ethereum) return setError('No wallet found. Please install MetaMask to use Reefi.')
    setIsConnecting(true);
    const clients = {
      56: createWalletClient({ chain: bsc, transport: custom(window.ethereum)}).extend(publicActions),
      42161: createWalletClient({ chain: arbitrum, transport: custom(window.ethereum)}).extend(publicActions)
    } as const
    setClients(clients)
    updateAccount()
    setIsConnecting(false)
    setConnectRequired(false)
  }

  useEffect(() => {
    if (window.ethereum) connectWallet();
    const savedChain = window.localStorage.getItem('chain')
    if (savedChain !== null) setChain(Number(savedChain) as Chains)
  }, [])

  useEffect(() => {
    if (clients) (async (): Promise<void> => clients[chain].switchChain({ id: chain }))().catch(() => setError('Failed to switch chains'))
    connectWallet()
  }, [chain])

  return { clients, chain, account, isConnecting, connectRequired, connectWallet, setChain, setConnectRequired, ens }
}