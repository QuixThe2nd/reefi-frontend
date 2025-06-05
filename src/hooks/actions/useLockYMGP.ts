import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAmounts } from "../useAmounts";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  chain: Chains;
  clients: Clients;
  send: UseAmounts["amounts"]["send"];
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: UseSupplies["updateSupplies"];
  updateTotalLockedYMGP: () => void;
  updateUserLockedYMGP: () => Promise<void>;
  writeContracts: UseContracts;
}

export const useLockYMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, send, setConnectRequired, updateSupplies, updateTotalLockedYMGP, updateUserLockedYMGP, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendReference = useRef(send);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const updateSuppliesReference = useRef(updateSupplies);
  const updateTotalLockedYMGPReference = useRef(updateTotalLockedYMGP);
  const updateUserLockedYMGPReference = useRef(updateUserLockedYMGP);
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
    updateTotalLockedYMGPReference.current = updateTotalLockedYMGP;
  }, [updateTotalLockedYMGP]);

  useEffect(() => {
    updateUserLockedYMGPReference.current = updateUserLockedYMGP;
  }, [updateUserLockedYMGP]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].yMGP.write.lock([sendReference.current ?? 0n], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateSuppliesReference.current.yMGP();
    updateTotalLockedYMGPReference.current();
    updateUserLockedYMGPReference.current();
  }, []);
};
