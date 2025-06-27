import { useChainId, useReadContract } from "wagmi";
import { useState } from "react";

import { ABIs } from "../ABIs/abis";

import { type Contracts, curveIndexes, type CurveCoin, CurveCoinSchema } from "./useContracts";

type LP = Record<CurveCoin, bigint>;
type Curve = Record<CurveCoin, Record<CurveCoin, bigint>>;

export type Amounts = [{ lp: LP; curve: Curve; send: bigint }, { setSend: (_: bigint) => void; setLP: (_: LP) => void }];

const useExchangeRate = ({ contracts, from, to, send }: { contracts: Contracts; from: CurveCoin; to: CurveCoin; send: bigint }) => {
  const chain = useChainId();
  return useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes[from], curveIndexes[to], send] }).data ?? 1n;
};

export const useAmounts = ({ contracts }: { contracts: Contracts }): Amounts => {
  const [lp, setLP] = useState<LP>({ MGP: 0n, stMGP: 0n, yMGP: 0n, vMGP: 0n, rMGP: 0n });
  const [send, setSend] = useState(0n);

  const coins: readonly CurveCoin[] = CurveCoinSchema.options;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const curve = Object.fromEntries(coins.map(from => [from, Object.fromEntries(coins.filter(to => from !== to).map(to => [to, useExchangeRate({ contracts, from, to, send })]))])) as unknown as Curve;
  return [
    { lp, curve, send },
    { setSend, setLP }
  ] as const;
};
