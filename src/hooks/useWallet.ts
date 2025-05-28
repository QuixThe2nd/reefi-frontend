import { useEffect, useState } from "react"
import { createWalletClient, custom, publicActions, type WalletClient, type PublicActions } from "viem"
import { arbitrum, bsc } from 'viem/chains'
import { publicClients, type Chains } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

interface UseWallet {
  clients: Record<Chains, WalletClient & PublicActions> | undefined,
  chain: Chains,
  account: `0x${string}`,
  isConnecting: boolean,
  connectRequired: boolean,
  connectWallet: () => Promise<void | (() => void)>,
  setChain: React.Dispatch<React.SetStateAction<Chains>>,
  setConnectRequired: React.Dispatch<React.SetStateAction<boolean>>,
  ens: string | null | undefined
}

export const useWallet = ({ setError }: { setError: (msg: string) => void }): UseWallet => {
  const [clients, setClients] = useState<Record<Chains, WalletClient & PublicActions> | undefined>()
  const [chain, setChain] = useState<Chains>(42161)
  const [account, setAccount] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectRequired, setConnectRequired] = useState(false)
  const [ens] = useUpdateable(() => publicClients[1].getEnsName({ address: account }), [account])

  const connectWallet = async (): Promise<void | (() => void)> => {
    if (!window.ethereum) return setError('No wallet found. Please install MetaMask to use Reefi.')
    setIsConnecting(true);
    const clients = {
      56: createWalletClient({ chain: bsc, transport: custom(window.ethereum)}).extend(publicActions),
      42161: createWalletClient({ chain: arbitrum, transport: custom(window.ethereum)}).extend(publicActions)
    } as const
    setClients(clients)
    setAccount((await clients[chain].requestAddresses())[0] ?? '0x0000000000000000000000000000000000000000')
    setIsConnecting(false)
    setConnectRequired(false)
  }

  useEffect(() => {
    if (window.ethereum) connectWallet();
    const savedChain = window.localStorage.getItem('chain')
    if (savedChain !== null) setChain(Number(savedChain) as Chains)
  }, [])

  useEffect(() => {
    if (clients) clients[chain].switchChain({ id: chain })
    window.ethereum?.request({ method: 'eth_accounts' }).then(accounts => { if (accounts !== undefined) connectWallet() })
  }, [chain])

  return { clients, chain, account, isConnecting, connectRequired, connectWallet, setChain, setConnectRequired, ens }
}