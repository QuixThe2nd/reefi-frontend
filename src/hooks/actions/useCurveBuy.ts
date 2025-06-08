import { useAllowances } from "../../state/useAllowances";
import { useCallback } from "react";

import { Chains, PrimaryCoin } from "../../config/contracts";
import { UseContracts } from "../../state/useContracts";
import { WalletClient, PublicActions } from "viem";

interface Props {
  clients: Record<Chains, WalletClient & PublicActions> | undefined;
  account: `0x${string}` | undefined;
  writeContracts: UseContracts;
  setConnectRequired: (_value: boolean) => void;
  allowances: ReturnType<typeof useAllowances>[0];
  send: bigint;
  setError: (_value: string) => void;
  chain: Chains;
}

export const useCurveBuy = ({ clients, account, writeContracts, setConnectRequired, allowances, send, setError, chain }: Props) => useCallback(async (tokenIn: PrimaryCoin, tokenOut: PrimaryCoin) => {
  const curveIndex = { MGP: 0n, rMGP: 1n, yMGP: 2n, vMGP: 3n } as const;
  const indexIn = curveIndex[tokenIn];
  const indexOut = curveIndex[tokenOut];
  if (!clients || !writeContracts || account === undefined) return setConnectRequired(true);
  if (allowances.cMGP.rMGP < send) return setError("Allowance too low");
  await writeContracts[chain].cMGP.write.exchange([indexIn, indexOut, send, 0n], { account, chain: clients[chain].chain });
}, [account, allowances.cMGP.rMGP, chain, clients, send, setConnectRequired, setError, writeContracts]);
