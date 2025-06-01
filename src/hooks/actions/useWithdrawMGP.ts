import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  balances: UseBalances;
  chain: Chains;
  clients: Clients;
  setConnectRequired: (_value: boolean) => void;
  updateUnsubmittedWithdraws: () => void;
  updateUserPendingWithdraws: () => void;
  updateUserWithdrawable: () => void;
  writeContracts: UseContracts<Clients>;
}

export const useWithdrawMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, setConnectRequired, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account);
  const balancesReference = useRef(balances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const updateUnsubmittedWithdrawsReference = useRef(updateUnsubmittedWithdraws);
  const updateUserPendingWithdrawsReference = useRef(updateUserPendingWithdraws);
  const updateUserWithdrawableReference = useRef(updateUserWithdrawable);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

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
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    updateUnsubmittedWithdrawsReference.current = updateUnsubmittedWithdraws;
  }, [updateUnsubmittedWithdraws]);

  useEffect(() => {
    updateUserPendingWithdrawsReference.current = updateUserPendingWithdraws;
  }, [updateUserPendingWithdraws]);

  useEffect(() => {
    updateUserWithdrawableReference.current = updateUserWithdrawable;
  }, [updateUserWithdrawable]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    await writeContractsReference.current[chainReference.current].rMGP.write.unlock({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    await writeContractsReference.current[chainReference.current].rMGP.write.withdraw({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    balancesReference.current.MGP[1]();
    updateUserPendingWithdrawsReference.current();
    updateUnsubmittedWithdrawsReference.current();
    updateUserWithdrawableReference.current();
  }, []);
};
