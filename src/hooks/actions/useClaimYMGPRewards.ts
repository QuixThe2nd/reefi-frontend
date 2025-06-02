import { useCallback, useEffect, useRef } from "react";

import { Chains } from "../../config/contracts";
import { UseContracts } from "../useContracts";

import type { PublicActions, WalletClient } from "viem";

interface Properties<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  account: `0x${string}` | undefined;
  chain: Chains;
  clients: Clients;
  setConnectRequired: (_value: boolean) => void;
  updateUnclaimedUserYield: () => void;
  writeContracts: UseContracts;
}

export const useClaimYMGPRewards = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ account, chain, clients, setConnectRequired, updateUnclaimedUserYield, writeContracts }: Properties<Clients>): () => void => {
  const accountReference = useRef(account),
    chainReference = useRef(chain),
    clientsReference = useRef(clients),
    setConnectRequiredReference = useRef(setConnectRequired),
    updateUnclaimedUserYieldReference = useRef(updateUnclaimedUserYield),
    writeContractsReference = useRef(writeContracts);

  useEffect(() => {
    accountReference.current = account;
  }, [account]);

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
    updateUnclaimedUserYieldReference.current = updateUnclaimedUserYield;
  }, [updateUnclaimedUserYield]);

  useEffect(() => {
    writeContractsReference.current = writeContracts;
  }, [writeContracts]);

  const claimYMGPRewards = useCallback(async (): Promise<void> => {
    if (!clientsReference.current || !writeContractsReference.current || accountReference.current === undefined) return setConnectRequiredReference.current(true);
    await writeContractsReference.current[chainReference.current].yMGP.write.claim({ account: accountReference.current, chain: clientsReference.current[chainReference.current].chain });
    updateUnclaimedUserYieldReference.current();
  }, []);

  return claimYMGPRewards;
};
