import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  clients: Clients;
  sendAmount: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  setNotification: (_value: string) => void;
}

export const useSwap = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, sendAmount, setConnectRequired, setError, setNotification }: Properties<Clients>): (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => Promise<void> => {
  const accountReference = useRef(account);
  const allowancesReference = useRef(allowances);
  const chainReference = useRef(chain);
  const clientsReference = useRef(clients);
  const sendAmountReference = useRef(sendAmount);
  const setConnectRequiredReference = useRef(setConnectRequired);
  const setErrorReference = useRef(setError);
  const setNotificationReference = useRef(setNotification);

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
    setErrorReference.current = setError;
  }, [setError]);

  useEffect(() => {
    setNotificationReference.current = setNotification;
  }, [setNotification]);

  return useCallback(async (tokenIn: `0x${string}`, tokenOut: `0x${string}`): Promise<void> => {
    if (!clientsReference.current || accountReference.current === undefined) {
      setConnectRequiredReference.current(true); return;
    }
    if (allowancesReference.current.curve.MGP < sendAmountReference.current) {
      setErrorReference.current("Allowance too low"); return;
    }

    setNotificationReference.current("Fetching swap route");
    const quoteRequestBody = {
      chainId: chainReference.current,
      compact: true,
      disableRFQs: true,
      inputTokens: [{ amount: String(sendAmountReference.current), tokenAddress: tokenIn }],
      outputTokens: [{ proportion: 1, tokenAddress: tokenOut }],
      referralCode: 0,
      slippageLimitPercent: 5,
      userAddr: accountReference.current
    };
    const response = await fetch("https://api.odos.xyz/sor/quote/v2", { body: JSON.stringify(quoteRequestBody), headers: { "Content-Type": "application/json" }, method: "POST" });
    if (!response.ok) {
      setError("Failed to find route"); return;
    }
    setNotificationReference.current("Assembling transaction");
    const assembleRequestBody = { pathId: (await response.json() as { pathId: string }).pathId, simulate: false, userAddr: accountReference.current };
    const response2 = await fetch("https://api.odos.xyz/sor/assemble", { body: JSON.stringify(assembleRequestBody), headers: { "Content-Type": "application/json" }, method: "POST" });
    const { transaction } = await response2.json() as { transaction: { gas: number } };
    await clientsReference.current[chainReference.current].sendTransaction({ ...transaction, account: accountReference.current, chain: undefined, gas: BigInt(Math.max(transaction.gas, 0)) });
  }, []);
};
