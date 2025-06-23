import { useChainId, useReadContract } from "wagmi";
import { useState } from "react";

import { ABIs } from "../ABIs/abis";

import { type Contracts, curveIndexes, type PrimaryCoin, type CurveCoin, CurveCoinSchema } from "./useContracts";

export type FlattenRecord<T extends Record<string, bigint>> = {
  [K1 in keyof T as K1 extends string ?
    K1 extends keyof T ?
      { [K2 in keyof T]: K2 extends string ?
        K1 extends K2 ? never : `${K1}_${K2}`
        : never }[keyof T]
      : never
    : never]: bigint
};

export const useAmounts = ({ contracts }: { contracts: Contracts }) => {
  const [lp, setLP] = useState<Record<CurveCoin, bigint>>({ MGP: 0n, stMGP: 0n, yMGP: 0n, vMGP: 0n, rMGP: 0n });
  const [send, setSend] = useState(0n);
  const chain = useChainId();

  const coins: readonly CurveCoin[] = CurveCoinSchema.options;
  const curve: FlattenRecord<Record<PrimaryCoin, bigint>> = {} as FlattenRecord<Record<PrimaryCoin, bigint>>;

  for (const from of coins) for (const to of coins) if (from !== to) {
    const key = `${from}_${to}` as keyof FlattenRecord<Record<PrimaryCoin, bigint>>;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    curve[key] = useReadContract({ abi: ABIs.cMGP, address: contracts[chain].cMGP, functionName: "get_dy", args: [curveIndexes[from], curveIndexes[to], send] }).data ?? 0n;
  }

  return [
    { lp, curve, send },
    { setSend, setLP }
  ] as const;
};
