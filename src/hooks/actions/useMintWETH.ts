import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: UseAllowances;
  chain: Chains;
  clients: Clients;
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  writeContracts: UseContracts<Clients>;
}

export const useMintWETH = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
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

  const depositMGP = useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    if (allowancesReference.current.MGP[0] < sendAmountReference.current) return setErrorReference.current("Allowance too low");
    await writeContractsReference.current[chainReference.current].WETH.write.deposit({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain, value: sendAmountReference.current });
  }, []);

  return depositMGP;
};
