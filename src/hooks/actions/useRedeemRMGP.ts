import { useBalances } from "../../state/useBalances";
import { useCallback, useEffect, useRef } from "react";
import { useSupplies } from "../../state/useSupplies";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateBalances: ReturnType<typeof useBalances>[1];
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: ReturnType<typeof useSupplies>[1];
  updateReefiLockedMGP: () => Promise<void>;
  updateTotalLockedMGP: () => void;
  updateUnclaimedUserYield: () => Promise<void>;
  updateUnlockSchedule: () => void;
  updateUnsubmittedWithdraws: () => void;
  updateUserPendingWithdraws: () => void;
  updateUserWithdrawable: () => void;
  writeContracts: UseContracts;
}

export const useRedeemRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateBalances, chain, clients, send, setConnectRequired, updateSupplies, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, updateUnlockSchedule, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendReference = useRef(send);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const updateSuppliesReference = useRef(updateSupplies);
  const updateReefiLockedMGPReference = useRef(updateReefiLockedMGP);
  const updateTotalLockedMGPReference = useRef(updateTotalLockedMGP);
  const updateUnclaimedUserYieldReference = useRef(updateUnclaimedUserYield);
  const updateUnlockScheduleReference = useRef(updateUnlockSchedule);
  const updateUnsubmittedWithdrawsReference = useRef(updateUnsubmittedWithdraws);
  const updateUserPendingWithdrawsReference = useRef(updateUserPendingWithdraws);
  const updateUserWithdrawableReference = useRef(updateUserWithdrawable);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

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
    sendReference.current = send;
  }, [send]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

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
    updateUnclaimedUserYieldReference.current = updateUnclaimedUserYield;
  }, [updateUnclaimedUserYield]);

  useEffect(() => {
    updateUnlockScheduleReference.current = updateUnlockSchedule;
  }, [updateUnlockSchedule]);

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
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].rMGP.write.startUnlock([sendReference.current], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateUnlockScheduleReference.current();
    updateTotalLockedMGPReference.current();
    updateReefiLockedMGPReference.current();
    updateUserPendingWithdrawsReference.current();
    updateUnsubmittedWithdrawsReference.current();
    updateUserWithdrawableReference.current();
    updateUnclaimedUserYieldReference.current();
  }, []);
};
