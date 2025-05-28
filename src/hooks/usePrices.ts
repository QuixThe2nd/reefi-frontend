import { useEffect, useState } from "react"
import type { Coins } from "../config/contracts"

export type Prices = Readonly<Record<Coins, number>>

export const usePrices = (): Prices => {
  const [prices, setPrices] = useState<Prices>({ MGP: 0, RMGP: 0, YMGP: 0, VMGP: 0, CMGP: 0, CKP: 0, PNP: 0, EGP: 0, LTP: 0, ETH: 0, BNB: 0 })

  useEffect(() => {
    (async (): Promise<void> => {
      const res = await fetch('https://api.magpiexyz.io/getalltokenprice')
      res.json().then((body: { readonly data: { readonly AllPrice: typeof prices }}) => setPrices(body.data.AllPrice))
    })()
  }, [])

  return prices
}
