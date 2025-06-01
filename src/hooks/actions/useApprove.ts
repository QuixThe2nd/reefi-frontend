import { contracts, Chains, Coins } from "../../config/contracts";
import { useCallback, useEffect, useRef } from "react";

import { Pages } from "../../App";
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
  writeContracts: UseContracts<Clients>;
}

export const useApprove = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, sendAmount, setConnectRequired, writeContracts }: Properties<Clients>): (_contract: "rMGP" | "yMGP" | "cMGP" | "ODOSRouter", _coin: Coins, _infinity: boolean) => void => {
  const accountReference = useRef(account),
    allowancesReference = useRef(allowances),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    sendAmountReference = useRef(sendAmount),
    setConnectRequiredReference = useRef(setConnectRequired),
    writeContractsReference = useRef(writeContracts);

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
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  const approve = useCallback(async (contract: "rMGP" | "yMGP" | "cMGP" | "ODOSRouter", coin: Coins, infinity: boolean): Promise<void> => {
    if (clientsReference.current === undefined || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    const amount = infinity ? 2n ** 256n - 1n : sendAmountReference.current;
    await writeContractsReference.current[chainReference.current][coin].write.approve([contracts[chainReference.current][contract].address, amount], { account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    if (contract === "cMGP") allowancesReference.current.curve[coin][1]();
    else if (contract === "ODOSRouter") allowancesReference.current.odos[coin][1]();
    else allowancesReference.current.curve[coin][1]();
  }, []);

  return approve;
};
