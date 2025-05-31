import { erc20Abi } from "viem"
import { RMGP } from './RMGP'
import { YMGP } from './YMGP'
import { VMGP } from './VMGP'
import { VLMGP } from './VLMGP'
import { MASTERMGP } from './MASTERMGP'
import { VLREWARDER } from './VLREWARDER'
import { CMGP } from './CMGP'
import { ODOSRouter } from "./ODOSRouter"

export const ABIs = {
  MGP: erc20Abi,
  RMGP,
  YMGP,
  VMGP,
  VLMGP,
  MASTERMGP,
  VLREWARDER,
  CMGP,
  CKP: erc20Abi,
  PNP: erc20Abi,
  EGP: erc20Abi,
  LTP: erc20Abi,
  ETH: erc20Abi,
  BNB: erc20Abi,
  ODOSRouter
} as const
