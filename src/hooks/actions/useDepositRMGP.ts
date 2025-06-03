import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
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
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  updateSupplies: UseSupplies["updateSupplies"];
  updateYMGPHoldings: () => Promise<void>;
  writeContracts: UseContracts;
}

export const useDepositRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, updateBalances, chain, clients, sendAmount, setConnectRequired, setError, updateSupplies, updateYMGPHoldings, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const setErrorReference = useRef(setError);
  const updateSuppliesReference = useRef(updateSupplies);
  const updateYMGPHoldingsReference = useRef(updateYMGPHoldings);
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
    updateYMGPHoldingsReference.current = updateYMGPHoldings;
  }, [updateYMGPHoldings]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    if (allowancesReference.current.rMGP < sendAmountReference.current) {
      setErrorReference.current("Allowance too low"); return;
    }
    await writeContractsReference.current[chainReference.current].yMGP.write.deposit([sendAmountReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalancesReference.current.rMGP();
    updateBalancesReference.current.yMGP();
    updateSuppliesReference.current.rMGP();
    updateSuppliesReference.current.yMGP();
    updateYMGPHoldingsReference.current();
  }, []);
};
