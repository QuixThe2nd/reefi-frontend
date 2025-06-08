import { useBalances } from "../../state/useBalances";
import { useCallback, useEffect, useRef } from "react";
import { useSupplies } from "../../state/useSupplies";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../../state/useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateBalances: ReturnType<typeof useBalances>[1];
  updateSupplies: ReturnType<typeof useSupplies>[1];
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  writeContracts: UseContracts;
}

export const useRedeemRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateBalances, chain, clients, send, setConnectRequired, updateSupplies, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const updateBalancesReference = useRef(updateBalances);
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
    updateBalancesReference.current = updateBalances;
  }, [updateBalances]);

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
    await writeContractsReference.current[chainReference.current].wstMGP.write.startUnlock([sendReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalancesReference.current();
    updateSuppliesReference.current();
  }, []);
};
