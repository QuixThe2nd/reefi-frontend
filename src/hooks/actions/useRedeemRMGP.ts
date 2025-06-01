import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  balances: UseBalances;
  chain: Chains;
  clients: Clients;
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  supplies: UseSupplies;
  updateReefiLockedMGP: () => void;
  updateTotalLockedMGP: () => void;
  updateUnclaimedUserYield: () => void;
  updateUnlockSchedule: () => void;
  updateUnsubmittedWithdraws: () => void;
  updateUserPendingWithdraws: () => void;
  updateUserWithdrawable: () => void;
  writeContracts: UseContracts<Clients>;
}

export const useRedeemRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, sendAmount, setConnectRequired, supplies, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, updateUnlockSchedule, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account),
    balancesReference = useRef(balances),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    sendAmountReference = useRef(sendAmount),
    setConnectRequiredReference = useRef(setConnectRequired),
    suppliesReference = useRef(supplies),
    updateReefiLockedMGPReference = useRef(updateReefiLockedMGP),
    updateTotalLockedMGPReference = useRef(updateTotalLockedMGP),
    updateUnclaimedUserYieldReference = useRef(updateUnclaimedUserYield),
    updateUnlockScheduleReference = useRef(updateUnlockSchedule),
    updateUnsubmittedWithdrawsReference = useRef(updateUnsubmittedWithdraws),
    updateUserPendingWithdrawsReference = useRef(updateUserPendingWithdraws),
    updateUserWithdrawableReference = useRef(updateUserWithdrawable),
    writeContractsReference = useRef(writeContracts);

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
    sendAmountReference.current = sendAmount;
  }, [sendAmount]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    suppliesReference.current = supplies;
  }, [supplies]);

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

  const redeemRMGP = useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].rMGP.write.startUnlock([sendAmountReference.current], { account: accountReference.current,
      chain: clientsReference.current[chainReference.current].chain });
    updateUnlockScheduleReference.current();
    suppliesReference.current.updateRMGP();
    balancesReference.current.rMGP[1]();
    updateTotalLockedMGPReference.current();
    updateReefiLockedMGPReference.current();
    updateUserPendingWithdrawsReference.current();
    updateUnsubmittedWithdrawsReference.current();
    updateUserWithdrawableReference.current();
    updateUnclaimedUserYieldReference.current();
  }, []);

  return redeemRMGP;
};
