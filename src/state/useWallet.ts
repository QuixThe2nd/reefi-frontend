import { arbitrum, bsc } from "viem/chains";
import { createWalletClient, custom, PublicActions, publicActions, WalletClient } from "viem";
import { useState, useEffect } from "react";

import { Chains, publicClients } from "../config/contracts";

interface WalletState {
  clients: Record<Chains, WalletClient & PublicActions> | undefined;
  chain: Chains;
  account: `0x${string}` | undefined;
  isConnecting: boolean;
  connectionRequired: boolean;
  ens: string | undefined;
}

export const useWallet = ({ setError }: { setError: (_msg: string) => void }) => {
  const [wallet, setWallet] = useState<WalletState>({
    clients: undefined,
    chain: 42_161,
    account: undefined,
    isConnecting: false,
    connectionRequired: false,
    ens: undefined
  });

  const connectWallet = (): void => {
    if (window.ethereum === undefined) return setError("No wallet found. Please install MetaMask to use Reefi.");
    setWallet(previous => ({ ...previous, isConnecting: true }));

    const walletClients = {
      42_161: createWalletClient({ chain: arbitrum, transport: custom(window.ethereum) }).extend(publicActions),
      56: createWalletClient({ chain: bsc, transport: custom(window.ethereum) }).extend(publicActions)
    } as const;

    setWallet(previous => ({ ...previous, clients: walletClients, isConnecting: false, connectRequired: false }));
  };

  const setChain = (newChain: Chains): void => {
    setWallet(previous => ({ ...previous, chain: newChain }));
    window.localStorage.setItem("chain", String(newChain));
  };

  const setConnectRequired = (required: boolean): void => setWallet(previous => ({ ...previous, connectRequired: required }));

  useEffect(() => {
    (async () => {
      if (!wallet.clients) return;
      const addresses = await wallet.clients[wallet.chain].requestAddresses();
      setWallet(previous => ({ ...previous, account: addresses[0] }));
    })();
  }, [wallet.clients, wallet.chain]);

  useEffect(() => {
    (async () => {
      if (!wallet.account) return;
      const ensName = await publicClients[1].getEnsName({ address: wallet.account });
      setWallet(previous => ({ ...previous, ens: ensName ?? undefined }));
    })();
  }, [wallet.account]);

  useEffect(() => {
    if (wallet.clients) {
      wallet.clients[wallet.chain].switchChain({ id: wallet.chain }).catch(() => setError("Failed to switch chains"));
      connectWallet();
    }
  }, [wallet.chain]);

  useEffect(() => {
    if (window.ethereum) connectWallet();
    const savedChain = window.localStorage.getItem("chain");
    if (savedChain !== null) setChain(Number(savedChain) as 56 | 42_161);
  }, []);

  return [wallet, { connectWallet, setChain, setConnectRequired }] as const;
};
