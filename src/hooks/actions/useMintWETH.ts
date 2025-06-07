import { useAllowances } from "../../state/useAllowances";
import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  writeContracts: UseContracts;
}

export const useMintWETH = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, send, setConnectRequired, setError, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendReference = useRef(send);
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
    sendReference.current = send;
  }, [send]);

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
    if (allowancesReference.current.rMGP.MGP < sendReference.current) return setErrorReference.current("Allowance too low");
    await writeContractsReference.current[chainReference.current].WETH.write.deposit({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain, value: sendReference.current });
  }, []);
};
