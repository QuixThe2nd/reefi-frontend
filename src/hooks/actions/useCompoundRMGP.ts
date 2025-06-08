import { useBalances } from "../../state/useBalances";
import { useCallback, useEffect, useRef } from "react";
import { useSupplies } from "../../state/useSupplies";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../../state/useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateBalances: ReturnType<typeof useBalances>[1];
  chain: Chains;
  clients: Clients;
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: ReturnType<typeof useSupplies>[1];
  writeContracts: UseContracts;
}

export const useCompoundRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateBalances, chain, clients, setConnectRequired, updateSupplies, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

  useEffect(() => {
    updateBalancesReference.current = updateBalances;
  }, [updateBalances]);

  useEffect(() => {
    chainReference.current = chain;
  }, [chain]);

  useEffect(() => {
    clientsReference.current = clients;
  }, [clients]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].wstMGP.write.claim({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalancesReference.current();
    updateSupplies();
  }, []);
};
