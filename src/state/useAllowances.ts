import { useState } from "react";

import { PrimaryCoin, SecondaryCoin } from "../config/contracts";

interface Allowances {
  rMGP: { MGP: bigint };
  yMGP: { rMGP: bigint };
  lyMGP: { yMGP: bigint };
  vMGP: { yMGP: bigint };
  lvMGP: { vMGP: bigint };
  cMGP: Record<PrimaryCoin, bigint>;
  odos: Record<SecondaryCoin, bigint>;
}

export const useAllowances = () => {
  const [allowances] = useState<Allowances>({
    rMGP: { MGP: 0n },
    yMGP: { rMGP: 0n },
    lyMGP: { yMGP: 0n },
    vMGP: { yMGP: 0n },
    lvMGP: { vMGP: 0n },
    cMGP: { MGP: 0n, rMGP: 0n, yMGP: 0n, vMGP: 0n },
    odos: { CKP: 0n, EGP: 0n, LTP: 0n, MGP: 0n, PNP: 0n, WETH: 0n }
  });

  return [allowances] as const;
};
