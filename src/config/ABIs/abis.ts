import { cMGP } from "./CMGP";
import { erc20Abi } from "viem";
import { masterMGP } from "./MASTERMGP";
import { odosRouter } from "./ODOSRouter";
import { vMGP } from "./VMGP";
import { vlMGP } from "./VLMGP";
import { vlRewarder } from "./VLREWARDER";
import { wstMGP } from "./WSTMGP";
import { yMGP } from "./YMGP";

import { WETH } from "./WETH";

export const ABIs = { CKP: erc20Abi, EGP: erc20Abi, LTP: erc20Abi, MGP: erc20Abi, PNP: erc20Abi,
  odosRouter, WETH, cMGP, masterMGP, wstMGP, vMGP, vlMGP, vlRewarder, yMGP,
  stMGP: erc20Abi } as const;
