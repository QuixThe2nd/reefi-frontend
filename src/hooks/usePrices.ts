import { useEffect, useState } from "react";

import { SecondaryCoin } from "../config/contracts";

export type UsePrices = Readonly<Record<SecondaryCoin, number>>;

export const usePrices = (): UsePrices => {
  const [prices, setPrices] = useState<UsePrices>({ CKP: 0, EGP: 0, LTP: 0, MGP: 0, PNP: 0, WETH: 0 });
  useEffect(() => {
    (async (): Promise<void> => {
      const response = await fetch("https://api.magpiexyz.io/getalltokenprice");
      response.json().then((body: Readonly<{ data: { AllPrice: typeof prices } }>) => {
        setPrices(body.data.AllPrice);
      });
    })();
  }, []);
  return prices;
};
