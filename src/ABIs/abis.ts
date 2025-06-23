import { bMGP } from "./bMGP";
import { cMGP } from "./cMGP";
import { contractRegistry } from "./contractRegistry";
import { erc20Abi } from "viem";
import { lockManager } from "./lockManager";
import { masterMagpie } from "./masterMagpie";
import { odosRouter } from "./odosRouter";
import { rMGP } from "./rMGP";
import { stMGP } from "./stMGP";
import { swapRouter } from "./swapRouter";
import { syMGP } from "./syMGP";
import { vMGP } from "./vMGP";
import { vlMGP } from "./vlMGP";
import { vlRewarder } from "./vlRewarder";
import { wstMGP } from "./wstMGP";
import { yMGP } from "./yMGP";

import { WETH } from "./WETH";

export const ABIs = { CKP: erc20Abi, EGP: erc20Abi, LTP: erc20Abi, MGP: erc20Abi, PNP: erc20Abi,
  bMGP, odosRouter, WETH, cMGP, masterMagpie, wstMGP, vMGP, vlMGP, vlRewarder, yMGP, stMGP, lockManager, swapRouter, rMGP, syMGP, contractRegistry } as const;
