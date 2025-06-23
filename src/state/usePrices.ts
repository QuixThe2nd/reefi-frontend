import { useEffect, useState } from "react";
import { z } from "zod";

import type { SecondaryCoin } from "./useContracts";

const ApiResponseSchema = z.object({
  data: z.object({
    AllPrice: z.object({
      MGP: z.number(),
      CKP: z.number(),
      PNP: z.number(),
      EGP: z.number(),
      LTP: z.number(),
      WETH: z.number(),
      ETH: z.number()
    })
  })
});

export const usePrices = () => {
  const [prices, setPrices] = useState<Record<SecondaryCoin, number>>({ MGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, WETH: 0, ETH: 0 });

  useEffect(() => {
    (async (): Promise<void> => {
      const response = await fetch("https://api.magpiexyz.io/getalltokenprice");
      const parsed = ApiResponseSchema.parse(await response.json());
      setPrices(parsed.data.AllPrice);
    })();
  }, []);

  return prices;
};
