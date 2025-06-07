import { useState } from "react";

import { PrimaryCoin } from "../config/contracts";

type CurveRates<T extends PropertyKey> = {
  [K in T]: {
    [_P in Exclude<T, K>]: bigint;
  }
};

interface Amounts {
  send: bigint | undefined;
  curve: CurveRates<PrimaryCoin>;
  lp: Record<PrimaryCoin, bigint>;
}

export const useAmounts = () => {
  const [amounts] = useState<Amounts>({
    send: undefined,
    curve: {
      MGP: { rMGP: 0n, yMGP: 0n, vMGP: 0n },
      rMGP: { MGP: 0n, yMGP: 0n, vMGP: 0n },
      yMGP: { MGP: 0n, rMGP: 0n, vMGP: 0n },
      vMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n }
    },
    lp: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n }
  });

  return [amounts] as const;
}