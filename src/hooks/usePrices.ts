import { useEffect, useState } from "react"
import type { Coins } from "../config/contracts"

export type UsePrices = Readonly<Record<Coins, number>>

export const usePrices = (): UsePrices => {
  const [prices, setPrices] = useState<UsePrices>({ MGP: 0, rMGP: 0, yMGP: 0, cMGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, WETH: 0 })

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetch('https://api.magpiexyz.io/getalltokenprice')
      res.json().then((body: { readonly data: { readonly AllPrice: typeof prices }}) => setPrices(body.data.AllPrice))
    })()
  }, [])

  return prices
}
