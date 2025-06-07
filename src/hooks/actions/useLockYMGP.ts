import { useBalances } from "../../state/useBalances";
import { useCallback, useEffect, useRef } from "react";
import { useSupplies } from "../../state/useSupplies";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../../state/useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: ReturnType<typeof useSupplies>[1];
  writeContracts: UseContracts;
  updateBalances: ReturnType<typeof useBalances>[1];
}

export const useLockYMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, send, setConnectRequired, updateBalances, updateSupplies, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendReference = useRef(send);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const updateSuppliesReference = useRef(updateSupplies);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

  useEffect(() => {
    chainReference.current = chain;
  }, [chain]);

  useEffect(() => {
    clientsReference.current = clients;
  }, [clients]);

  useEffect(() => {
    sendReference.current = send;
  }, [send]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    updateSuppliesReference.current = updateSupplies;
  }, [updateSupplies]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].yMGP.write.lock([sendReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalances();
  }, []);
};
