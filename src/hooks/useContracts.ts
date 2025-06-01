import { contracts, Chains } from "../config/contracts";
import { getContract, type GetContractReturnType, type PublicActions, type WalletClient } from "viem";
import { useMemo } from "react";

import { ABIs } from "../config/ABIs/abis";
import { UseWallet } from "./useWallet";

type ContractAddresses = {
  [K in keyof typeof ABIs]: GetContractReturnType<typeof ABIs[K], WalletClient & PublicActions>
};
type Contracts = Record<Chains, ContractAddresses>;

export type UseContracts<Clients> = Clients extends undefined ? undefined : Contracts;

export const useContracts = ({ wallet }: { wallet: UseWallet }): UseContracts<typeof wallet["clients"]> => {
  const writeContracts = useMemo(() => {
    if (!wallet.clients) return;

    return {
      42_161: {
        // StakedCMGP: getContract({ address: contracts[42_161].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[42_161] }),
        CKP: getContract({ abi: ABIs.CKP, address: contracts[42_161].CKP.address, client: wallet.clients[42_161] }),
        EGP: getContract({ abi: ABIs.EGP, address: contracts[42_161].EGP.address, client: wallet.clients[42_161] }),
        LTP: getContract({ abi: ABIs.LTP, address: contracts[42_161].LTP.address, client: wallet.clients[42_161] }),
        MASTERMGP: getContract({ abi: ABIs.masterMGP, address: contracts[42_161].MASTERMGP.address, client: wallet.clients[42_161] }),
        MGP: getContract({ abi: ABIs.MGP, address: contracts[42_161].MGP.address, client: wallet.clients[42_161] }),
        ODOSRouter: getContract({ abi: ABIs.ODOSRouter, address: contracts[42_161].ODOSRouter.address, client: wallet.clients[42_161] }),
        PNP: getContract({ abi: ABIs.PNP, address: contracts[42_161].PNP.address, client: wallet.clients[42_161] }),
        WETH: getContract({ abi: ABIs.WETH, address: contracts[42_161].WETH.address, client: wallet.clients[42_161] }),
        cMGP: getContract({ abi: ABIs.cMGP, address: contracts[42_161].cMGP.address, client: wallet.clients[42_161] }),
        masterMGP: getContract({ abi: ABIs.masterMGP, address: contracts[42_161].MASTERMGP.address, client: wallet.clients[42_161] }),
        rMGP: getContract({ abi: ABIs.rMGP, address: contracts[42_161].rMGP.address, client: wallet.clients[42_161] }),
        vMGP: getContract({ abi: ABIs.vMGP, address: contracts[42_161].vMGP.address, client: wallet.clients[42_161] }),
        vlMGP: getContract({ abi: ABIs.vlMGP, address: contracts[42_161].VLMGP.address, client: wallet.clients[42_161] }),
        vlREWARDER: getContract({ abi: ABIs.vlRewarder, address: contracts[42_161].VLREWARDER.address, client: wallet.clients[42_161] }),
        yMGP: getContract({ abi: ABIs.yMGP, address: contracts[42_161].yMGP.address, client: wallet.clients[42_161] })
      },
      56: {
        // StakedCMGP: getContract({ address: contracts[56].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[56] }),        CKP: getContract({ address: contracts[56].CKP.address, abi: ABIs.CKP, client: wallet.clients[56] }),
        CKP: getContract({ abi: ABIs.CKP, address: contracts[56].CKP.address, client: wallet.clients[56] }),
        EGP: getContract({ abi: ABIs.EGP, address: contracts[56].EGP.address, client: wallet.clients[56] }),
        LTP: getContract({ abi: ABIs.LTP, address: contracts[56].LTP.address, client: wallet.clients[56] }),
        MASTERMGP: getContract({ abi: ABIs.masterMGP, address: contracts[56].MASTERMGP.address, client: wallet.clients[56] }),
        MGP: getContract({ abi: ABIs.MGP, address: contracts[56].MGP.address, client: wallet.clients[56] }),
        ODOSRouter: getContract({ abi: ABIs.ODOSRouter, address: contracts[56].ODOSRouter.address, client: wallet.clients[56] }),
        PNP: getContract({ abi: ABIs.PNP, address: contracts[56].PNP.address, client: wallet.clients[56] }),
        WETH: getContract({ abi: ABIs.WETH, address: contracts[56].WETH.address, client: wallet.clients[56] }),
        cMGP: getContract({ abi: ABIs.cMGP, address: contracts[56].cMGP.address, client: wallet.clients[56] }),
        masterMGP: getContract({ abi: ABIs.masterMGP, address: contracts[56].MASTERMGP.address, client: wallet.clients[56] }),
        rMGP: getContract({ abi: ABIs.rMGP, address: contracts[56].rMGP.address, client: wallet.clients[56] }),
        vMGP: getContract({ abi: ABIs.vMGP, address: contracts[56].vMGP.address, client: wallet.clients[56] }),
        vlMGP: getContract({ abi: ABIs.vlMGP, address: contracts[56].VLMGP.address, client: wallet.clients[56] }),
        vlREWARDER: getContract({ abi: ABIs.vlRewarder, address: contracts[56].VLREWARDER.address, client: wallet.clients[56] }),
        yMGP: getContract({ abi: ABIs.yMGP, address: contracts[56].yMGP.address, client: wallet.clients[56] })
      }
    };
  }, [wallet.clients]);

  return writeContracts;
};
