import { contracts, Chains, Coins } from "../../config/contracts";
import { useCallback, useEffect, useRef } from "react";

import { UseAllowances } from "../useAllowances";
import { UseAmounts } from "../useAmounts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  updateAllowances: UseAllowances["updateAllowances"];
  chain: Chains;
  clients: Clients;
  send: UseAmounts["amounts"]["send"];
  setConnectRequired: (_value: boolean) => void;
  writeContracts: UseContracts;
}

export const useApprove = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, updateAllowances, chain, clients, send, setConnectRequired, writeContracts }: Properties<Clients>): (_contract: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _coin: Exclude<Coins, "lyMGP" | "lvMGP" | "wrMGP">, _infinity: boolean) => Promise<void> => {
  const accountReference = useRef(account);
  const updateAllowancesReference = useRef(updateAllowances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendReference = useRef(send);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

  useEffect(() => {
    updateAllowancesReference.current = updateAllowances;
  }, [updateAllowances]);

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
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  return useCallback(async (contract: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", coin: Exclude<Coins, "lyMGP" | "lvMGP">, infinity: boolean): Promise<void> => {
    if (clientsReference.current === undefined || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    const amount = infinity ? 2n ** 256n - 1n : sendReference.current;
    await writeContractsReference.current[chainReference.current][coin].write.approve([contracts[chainReference.current][contract].address, amount], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    if (contract === "cMGP") updateAllowancesReference.current.curve[coin as "MGP" | "rMGP" | "yMGP"]();
    else if (contract === "odosRouter") updateAllowancesReference.current.odos[coin]();
    else updateAllowancesReference.current.curve[coin as "MGP" | "rMGP" | "yMGP"]();
  }, []);
};
