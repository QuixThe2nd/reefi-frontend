import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: UseAllowances;
  balances: UseBalances;
  chain: Chains;
  clients: Clients;
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  supplies: UseSupplies;
  updateYMGPHoldings: () => void;
  writeContracts: UseContracts<Clients>;
}

export const useDepositRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, supplies, updateYMGPHoldings, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const balancesReference = useRef(balances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const setErrorReference = useRef(setError);
  const suppliesReference = useRef(supplies);
  const updateYMGPHoldingsReference = useRef(updateYMGPHoldings);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

  useEffect(() => {
    allowancesReference.current = allowances;
  }, [allowances]);

  useEffect(() => {
    balancesReference.current = balances;
  }, [balances]);

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
    suppliesReference.current = supplies;
  }, [supplies]);

  useEffect(() => {
    updateYMGPHoldingsReference.current = updateYMGPHoldings;
  }, [updateYMGPHoldings]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    if (allowancesReference.current.rMGP[0] < sendAmountReference.current) return setErrorReference.current("Allowance too low");
    await writeContractsReference.current[chainReference.current].yMGP.write.deposit([sendAmountReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    balancesReference.current.rMGP[1]();
    balancesReference.current.yMGP[1]();
    suppliesReference.current.updateRMGP();
    suppliesReference.current.updateYMGP();
    updateYMGPHoldingsReference.current();
  }, []);
};
