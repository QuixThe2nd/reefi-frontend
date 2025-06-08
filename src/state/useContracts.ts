import { getContract, GetContractReturnType, PublicActions, WalletClient } from "viem";
import { useMemo } from "react";
import { useWallet } from "./useWallet";

import { ABIs } from "../config/ABIs/abis";
import { Chains, contracts } from "../config/contracts";

export type UseContracts = Record<Chains, { [K in keyof typeof ABIs]: GetContractReturnType<typeof ABIs[K], WalletClient & PublicActions> }> | undefined;

export const useContracts = ({ wallet }: { wallet: ReturnType<typeof useWallet>[0] }): UseContracts => {
  const writeContracts = useMemo(() => {
    if (!wallet.clients) return;

    return {
      42_161: {
        // StakedCMGP: getContract({ address: contracts[42_161].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[42_161] }),
        CKP: getContract({ abi: ABIs.CKP, address: contracts[42_161].CKP.address, client: wallet.clients[42_161] }),
        EGP: getContract({ abi: ABIs.EGP, address: contracts[42_161].EGP.address, client: wallet.clients[42_161] }),
        LTP: getContract({ abi: ABIs.LTP, address: contracts[42_161].LTP.address, client: wallet.clients[42_161] }),
        MGP: getContract({ abi: ABIs.MGP, address: contracts[42_161].MGP.address, client: wallet.clients[42_161] }),
        odosRouter: getContract({ abi: ABIs.odosRouter, address: contracts[42_161].odosRouter.address, client: wallet.clients[42_161] }),
        PNP: getContract({ abi: ABIs.PNP, address: contracts[42_161].PNP.address, client: wallet.clients[42_161] }),
        WETH: getContract({ abi: ABIs.WETH, address: contracts[42_161].WETH.address, client: wallet.clients[42_161] }),
        cMGP: getContract({ abi: ABIs.cMGP, address: contracts[42_161].cMGP.address, client: wallet.clients[42_161] }),
        masterMGP: getContract({ abi: ABIs.masterMGP, address: contracts[42_161].masterMGP.address, client: wallet.clients[42_161] }),
        wstMGP: getContract({ abi: ABIs.wstMGP, address: contracts[42_161].wstMGP.address, client: wallet.clients[42_161] }),
        vMGP: getContract({ abi: ABIs.vMGP, address: contracts[42_161].vMGP.address, client: wallet.clients[42_161] }),
        vlMGP: getContract({ abi: ABIs.vlMGP, address: contracts[42_161].vlMGP.address, client: wallet.clients[42_161] }),
        vlRewarder: getContract({ abi: ABIs.vlRewarder, address: contracts[42_161].vlRewarder.address, client: wallet.clients[42_161] }),
        yMGP: getContract({ abi: ABIs.yMGP, address: contracts[42_161].yMGP.address, client: wallet.clients[42_161] })
      },
      56: {
        // StakedCMGP: getContract({ address: contracts[56].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[56] }),        CKP: getContract({ address: contracts[56].CKP.address, abi: ABIs.CKP, client: wallet.clients[56] }),
        CKP: getContract({ abi: ABIs.CKP, address: contracts[56].CKP.address, client: wallet.clients[56] }),
        EGP: getContract({ abi: ABIs.EGP, address: contracts[56].EGP.address, client: wallet.clients[56] }),
        LTP: getContract({ abi: ABIs.LTP, address: contracts[56].LTP.address, client: wallet.clients[56] }),
        MGP: getContract({ abi: ABIs.MGP, address: contracts[56].MGP.address, client: wallet.clients[56] }),
        odosRouter: getContract({ abi: ABIs.odosRouter, address: contracts[56].odosRouter.address, client: wallet.clients[56] }),
        PNP: getContract({ abi: ABIs.PNP, address: contracts[56].PNP.address, client: wallet.clients[56] }),
        WETH: getContract({ abi: ABIs.WETH, address: contracts[56].WETH.address, client: wallet.clients[56] }),
        cMGP: getContract({ abi: ABIs.cMGP, address: contracts[56].cMGP.address, client: wallet.clients[56] }),
        masterMGP: getContract({ abi: ABIs.masterMGP, address: contracts[56].masterMGP.address, client: wallet.clients[56] }),
        wstMGP: getContract({ abi: ABIs.wstMGP, address: contracts[56].wstMGP.address, client: wallet.clients[56] }),
        vMGP: getContract({ abi: ABIs.vMGP, address: contracts[56].vMGP.address, client: wallet.clients[56] }),
        vlMGP: getContract({ abi: ABIs.vlMGP, address: contracts[56].vlMGP.address, client: wallet.clients[56] }),
        vlRewarder: getContract({ abi: ABIs.vlRewarder, address: contracts[56].vlRewarder.address, client: wallet.clients[56] }),
        yMGP: getContract({ abi: ABIs.yMGP, address: contracts[56].yMGP.address, client: wallet.clients[56] })
      }
    };
  }, [wallet.clients]);
  return writeContracts;
};
