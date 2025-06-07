import { useCallback } from "react";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../../state/useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  chain: Chains;
  clients: Clients;
  send: bigint;
  setConnectRequired: (_value: boolean) => void;
  writeContracts: UseContracts;
}

export const useUnlockVLMGP = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, send, setConnectRequired, writeContracts }: Properties<Clients>) => useCallback(async (): Promise<void> => {
  if (!clients || !writeContracts || account === undefined) return setConnectRequired(true);
  await writeContracts[chain].vlMGP.write.startUnlock([send], { account, chain: clients[chain].chain });
}, [account, chain, clients, send, setConnectRequired, writeContracts]);
