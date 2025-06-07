import { useAllowances } from "../../state/useAllowances";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  writeContracts: UseContracts;
}

export const depositMGP = async <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, send, setConnectRequired, setError, writeContracts }: Properties<Clients>): Promise<void> => {
  if (!clients || !writeContracts || account === undefined) return setConnectRequired(true);
  if (allowances.rMGP.MGP < send) return setError("Allowance too low");
  await writeContracts[chain].rMGP.write.deposit([send], { account, chain: clients[chain].chain });
};
