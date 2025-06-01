import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";

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
  writeContracts: UseContracts<Clients>;
}

export const useBuyYMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account),
    allowancesReference = useRef(allowances),
    balancesReference = useRef(balances),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    sendAmountReference = useRef(sendAmount),
    setConnectRequiredReference = useRef(setConnectRequired),
    setErrorReference = useRef(setError),
    writeContractsReference = useRef(writeContracts);

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
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    if (allowancesReference.current.curve.rMGP[0] < sendAmountReference.current) return setErrorReference.current("Allowance too low");
    await writeContractsReference.current[chainReference.current].cMGP.write.exchange([1n, 2n, sendAmountReference.current, 0n], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    balancesReference.current.rMGP[1]();
    balancesReference.current.yMGP[1]();
    balancesReference.current.updateRMGPCurve();
    balancesReference.current.updateYMGPCurve();
  }, []);
};
