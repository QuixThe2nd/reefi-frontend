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
  mgpLPAmount: bigint;
  rmgpLPAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  writeContracts: UseContracts<Clients>;
  ymgpLPAmount: bigint;
}

export const useSupplyLiquidity = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, balances, chain, clients, mgpLPAmount, rmgpLPAmount, setConnectRequired, writeContracts, ymgpLPAmount }: Properties<Clients>): () => void => {
  const accountReference = useRef(account),
    balancesReference = useRef(balances),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    mgpLPAmountReference = useRef(mgpLPAmount),
    rmgpLPAmountReference = useRef(rmgpLPAmount),
    setConnectRequiredReference = useRef(setConnectRequired),
    writeContractsReference = useRef(writeContracts),
    ymgpLPAmountReference = useRef(ymgpLPAmount);

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

  const supplyLiquidity = useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    await writeContractsReference.current[chainReference.current].cMGP.write.add_liquidity([[mgpLPAmountReference.current, rmgpLPAmountReference.current, ymgpLPAmountReference.current], 0n], { account: accountReference.current,
      chain: clientsReference.current[chainReference.current].chain });
    balancesReference.current.MGP[1]();
    balancesReference.current.rMGP[1]();
    balancesReference.current.yMGP[1]();
    balancesReference.current.cMGP[1]();
    balancesReference.current.updateMGPCurve();
    balancesReference.current.updateRMGPCurve();
    balancesReference.current.updateYMGPCurve();
  }, []);

  return supplyLiquidity;
};
