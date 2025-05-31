import { erc20Abi } from "viem"
import { rMGP } from './RMGP'
import { yMGP } from './YMGP'
import { vMGP } from './VMGP'
import { cMGP } from './CMGP'
import { VLMGP } from './VLMGP'
import { MASTERMGP } from './MASTERMGP'
import { VLREWARDER } from './VLREWARDER'
import { ODOSRouter } from "./ODOSRouter"
import { WETH } from "./WETH"

export const ABIs = {
  MGP: erc20Abi,
  rMGP,
  yMGP,
  vMGP,
  VLMGP,
  MASTERMGP,
  VLREWARDER,
  cMGP,
  CKP: erc20Abi,
  PNP: erc20Abi,
  EGP: erc20Abi,
  LTP: erc20Abi,
  WETH,
  WBNB: erc20Abi,
  ODOSRouter
} as const
