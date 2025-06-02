import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseBalances } from "../useBalances";
import { UseContracts } from "../useContracts";
import { UseSupplies } from "../useSupplies";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateBalances: UseBalances["updateBalances"];
  chain: Chains;
  clients: Clients;
  setConnectRequired: (_value: boolean) => void;
  updateSupplies: UseSupplies["updateSupplies"];
  updatePendingRewards: () => void;
  updateReefiLockedMGP: () => void;
  updateTotalLockedMGP: () => void;
  updateUnclaimedUserYield: () => void;
  writeContracts: UseContracts;
}

export const useCompoundRMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateBalances, chain, clients, setConnectRequired, updateSupplies, updatePendingRewards, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const updateSuppliesReference = useRef(updateSupplies);
  const updatePendingRewardsReference = useRef(updatePendingRewards);
  const updateReefiLockedMGPReference = useRef(updateReefiLockedMGP);
  const updateTotalLockedMGPReference = useRef(updateTotalLockedMGP);
  const updateUnclaimedUserYieldReference = useRef(updateUnclaimedUserYield);
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
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    updateSuppliesReference.current = updateSupplies;
  }, [updateSupplies]);

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

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].rMGP.write.claim({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updatePendingRewardsReference.current();
    updateUnclaimedUserYieldReference.current();
    updateSuppliesReference.current.rMGP();
    updateBalancesReference.current.rMGP();
    updateTotalLockedMGPReference.current();
    updateReefiLockedMGPReference.current();
  }, []);
};
