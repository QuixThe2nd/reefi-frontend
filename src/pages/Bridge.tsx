import wstMGP from "../../public/icons/rMGP.png";

import { useContracts } from "../state/useContracts";

import { Page } from "../components/Page";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

import type { ReactElement } from "react";

export const Bridge = (): ReactElement => {
  const contracts = useContracts();
  return <Page info={[<span key="bridge">Bridge wstMGP tokens between Arbitrum and BNB Chain using Wormhole&apos;s Token Bridge.</span>, <span key="wrap">Wrap your stMGP to bridge it cross-chain.</span>]} noTopMargin>
    <WormholeConnect config={{
      chains: ["Arbitrum", "Bsc"],
      tokens: ["wstMGP (Arbitrum)", "wstMGP (Bsc)"],
      tokensConfig: {
        WRMGP_ARB: {
          symbol: "wstMGP (Arbitrum)",
          icon: wstMGP,
          tokenId: {
            chain: "Arbitrum",
            address: contracts[42_161].wstMGP
          },
          decimals: 18
        },
        WRMGP_BSC: {
          symbol: "wstMGP (BSC)",
          icon: wstMGP,
          tokenId: {
            chain: "Bsc",
            address: contracts[56].wstMGP
          },
          decimals: 18
        }
      },
      wrappedTokens: {
        Arbitrum: {
          [contracts[42_161].wstMGP]: {
            Bsc: contracts[56].wstMGP
          }
        },
        Bsc: {
          [contracts[56].wstMGP]: {
            Arbitrum: contracts[42_161].wstMGP
          }
        }
      }
    }}
    />
  </Page>;
};
