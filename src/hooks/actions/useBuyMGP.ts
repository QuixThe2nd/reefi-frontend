import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";

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
  writeContracts: UseContracts;
}

export const useBuyMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, updateBalances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const setErrorReference = useRef(setError);
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
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    if (allowancesReference.current.curve.rMGP < sendAmountReference.current) {
      setErrorReference.current("Allowance too low"); return;
    }
    await writeContractsReference.current[chainReference.current].cMGP.write.exchange([1n, 0n, sendAmountReference.current, 0n], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateBalancesReference.current.MGP();
    updateBalancesReference.current.rMGP();
    updateBalancesReference.current.curveMGP();
    updateBalancesReference.current.curveRMGP();
  }, []);
};
