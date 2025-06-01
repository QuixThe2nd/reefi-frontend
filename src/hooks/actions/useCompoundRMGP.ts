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
  setConnectRequired: (_value: boolean) => void;
  supplies: UseSupplies;
  updatePendingRewards: () => void;
  updateReefiLockedMGP: () => void;
  updateTotalLockedMGP: () => void;
  updateUnclaimedUserYield: () => void;
  writeContracts: UseContracts<Clients>;
}

export const useCompoundRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, setConnectRequired, supplies, updatePendingRewards, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account),
    balancesReference = useRef(balances),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    setConnectRequiredReference = useRef(setConnectRequired),
    suppliesReference = useRef(supplies),
    updatePendingRewardsReference = useRef(updatePendingRewards),
    updateReefiLockedMGPReference = useRef(updateReefiLockedMGP),
    updateTotalLockedMGPReference = useRef(updateTotalLockedMGP),
    updateUnclaimedUserYieldReference = useRef(updateUnclaimedUserYield),
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
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    suppliesReference.current = supplies;
  }, [supplies]);

  useEffect(() => {
    updatePendingRewardsReference.current = updatePendingRewards;
  }, [updatePendingRewards]);

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
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  const compoundRMGP = useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].rMGP.write.claim({ account: accountReference.current,
      chain: clientsReference.current[chainReference.current].chain });
    updatePendingRewardsReference.current();
    updateUnclaimedUserYieldReference.current();
    suppliesReference.current.updateRMGP();
    balancesReference.current.rMGP[1]();
    updateTotalLockedMGPReference.current();
    updateReefiLockedMGPReference.current();
  }, []);

  return compoundRMGP;
};
