import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  chain: Chains;
  clients: Clients;
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: UseSupplies["updateSupplies"];
  updateTotalLockedYMGP: () => void;
  updateUserLockedYMGP: () => void;
  writeContracts: UseContracts;
}

export const useUnlockYMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, sendAmount, setConnectRequired, updateSupplies, updateTotalLockedYMGP, updateUserLockedYMGP, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
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
    sendAmountReference.current = sendAmount;
  }, [sendAmount]);

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
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    await writeContractsReference.current[chainReference.current].yMGP.write.unlock([sendAmountReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateSuppliesReference.current.yMGP();
    updateTotalLockedYMGPReference.current();
    updateUserLockedYMGPReference.current();
  }, []);
};
