import { useBalances } from "../../state/useBalances";
import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateBalances: ReturnType<typeof useBalances>[1];
  chain: Chains;
  clients: Clients;
  mgpLPAmount: bigint;
  rmgpLPAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  writeContracts: UseContracts;
  ymgpLPAmount: bigint;
}

export const useSupplyLiquidity = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateBalances, chain, clients, mgpLPAmount, rmgpLPAmount, setConnectRequired, writeContracts, ymgpLPAmount }: Properties<Clients>): () => Promise<void> => {
  const accountReference = useRef(account);
  const updateBalancesReference = useRef(updateBalances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const mgpLPAmountReference = useRef(mgpLPAmount);
  const rmgpLPAmountReference = useRef(rmgpLPAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const writeContractsReference = useRef(writeContracts);
  const ymgpLPAmountReference = useRef(ymgpLPAmount);

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
    mgpLPAmountReference.current = mgpLPAmount;
  }, [mgpLPAmount]);

  useEffect(() => {
    rmgpLPAmountReference.current = rmgpLPAmount;
  }, [rmgpLPAmount]);

  useEffect(() => {
    setConnectRequiredReference.current = setConnectRequired;
  }, [setConnectRequired]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  useEffect(() => {
    ymgpLPAmountReference.current = ymgpLPAmount;
  }, [ymgpLPAmount]);

  return useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].cMGP.write.add_liquidity([[mgpLPAmountReference.current, rmgpLPAmountReference.current, ymgpLPAmountReference.current], 0n], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
  }, []);
};
