import { arbitrum, bsc } from "viem/chains";
import { createWalletClient, custom, publicActions, type PublicActions, type WalletClient } from "viem";
import { publicClients, type Chains } from "../config/contracts";
import { useCachedUpdateable } from "./useUpdateable";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

export interface UseWallet {
  readonly clients: Record<Chains, WalletClient & PublicActions> | undefined;
  readonly chain: Chains;
  readonly account: `0x${string}` | undefined;
  readonly isConnecting: boolean;
  readonly connectRequired: boolean;
  readonly connectWallet: () => void;
  readonly setChain: Dispatch<SetStateAction<Chains>>;
  readonly setConnectRequired: Dispatch<SetStateAction<boolean>>;
  readonly ens: string | undefined;
}

export const useWallet = ({ setError }: Readonly<{ setError: (_message: string) => void }>): UseWallet => {
  const [clients, setClients] = useState<Record<Chains, WalletClient & PublicActions> | undefined>();
  const [chain, setChain] = useState<Chains>(42_161);
  const [account, updateAccount] = useCachedUpdateable(async () => {
    if (!clients) return;
    const addresses = await clients[chain].requestAddresses();
    return addresses[0];
  }, [clients], "account");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectRequired, setConnectRequired] = useState(false);
  const [ens] = useCachedUpdateable(async () => account === undefined ? undefined : await publicClients[1].getEnsName({ address: account }) ?? undefined, [account], "ens");

  const connectWallet = useCallback((): void => {
    if (globalThis.ethereum === undefined) {
      setError("No wallet found. Please install MetaMask to use Reefi."); return;
    }
    setIsConnecting(true);
    const walletClients = {
      42_161: createWalletClient({ chain: arbitrum, transport: custom(globalThis.ethereum) }).extend(publicActions),
      56: createWalletClient({ chain: bsc, transport: custom(globalThis.ethereum) }).extend(publicActions)
    } as const;
    setClients(walletClients);
    updateAccount();
    setIsConnecting(false);
    setConnectRequired(false);
  }, []);

  useEffect(() => {
    if (globalThis.ethereum) connectWallet();
    const savedChain = globalThis.localStorage.getItem("chain");
    if (savedChain !== null) setChain(Number(savedChain) as Chains);
  }, []);

  useEffect(() => {
    if (clients) ((): Promise<void> => clients[chain].switchChain({ id: chain }))().catch(() => setError("Failed to switch chains"));

    connectWallet();
  }, [chain]);

  return { account, chain, clients, connectRequired, connectWallet, ens, isConnecting, setChain, setConnectRequired };
};
