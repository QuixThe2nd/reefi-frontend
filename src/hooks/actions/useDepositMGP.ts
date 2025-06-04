import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseAmounts } from "../useAmounts";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: UseAllowances["allowances"];
  updateBalances: UseBalances["updateBalances"];
  chain: Chains;
  clients: Clients;
  sendAmount: UseAmounts["amounts"]["send"];
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  updateSupplies: UseSupplies["updateSupplies"];
  updateReefiLockedMGP: () => Promise<void>;
  updateTotalLockedMGP: () => void;
  writeContracts: UseContracts;
}

export const useDepositMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, updateBalances, chain, clients, sendAmount, setConnectRequired, setError, updateSupplies, updateReefiLockedMGP, updateTotalLockedMGP, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const setErrorReference = useRef(setError);
  const updateSuppliesReference = useRef(updateSupplies);
  const updateReefiLockedMGPReference = useRef(updateReefiLockedMGP);
  const updateTotalLockedMGPReference = useRef(updateTotalLockedMGP);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

  useEffect(() => {
    allowancesReference.current = allowances;
  }, [allowances]);

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
    sendAmountReference.current = sendAmount;
  }, [sendAmount]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    setErrorReference.current = setError;
  }, [setError]);

  useEffect(() => {
    updateSuppliesReference.current = updateSupplies;
  }, [updateSupplies]);

  useEffect(() => {
    updateReefiLockedMGPReference.current = updateReefiLockedMGP;
  }, [updateReefiLockedMGP]);

  useEffect(() => {
    updateTotalLockedMGPReference.current = updateTotalLockedMGP;
  }, [updateTotalLockedMGP]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    if (allowancesReference.current.MGP < (sendAmountReference.current ?? 0n)) {
      setErrorReference.current("Allowance too low"); return;
    }
    await writeContractsReference.current[chainReference.current].rMGP.write.deposit([sendAmountReference.current ?? 0n], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalancesReference.current.MGP();
    updateBalancesReference.current.rMGP();
    updateSuppliesReference.current.MGP();
    updateSuppliesReference.current.rMGP();
    updateTotalLockedMGPReference.current();
    updateReefiLockedMGPReference.current();
  }, []);
};
