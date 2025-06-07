import { Chains } from "../../config/contracts";
import { UseAllowances } from "../useAllowances";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  setError: (_value: string) => void;
  writeContracts: UseContracts;
}

export const depositMGP = async <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, allowances, chain, clients, send, setConnectRequired, setError, writeContracts }: Properties<Clients>): Promise<void> => {
  if (!clients || !writeContracts || account === undefined) return setConnectRequired(true);
  if (allowances.MGP < (send ?? 0n)) return setError("Allowance too low");
  await writeContracts[chain].rMGP.write.deposit([send ?? 0n], { account, chain: clients[chain].chain });
};
