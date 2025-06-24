import wstMGP from "../../public/icons/rMGP.png";

import { useContracts } from "../state/useContracts";

import { Page } from "../components/Page";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

import type { ReactElement } from "react";

export const Bridge = (): ReactElement => {
  const contracts = useContracts();
  return <Page info={[<span key="bridge">Bridge stMGP tokens between Arbitrum and BNB Chain using Wormhole&apos;s Token Bridge.</span>, <span key="wrap">Unwrap wstMGP as stMGP on the source chain, bridge via Wormhole, then wrap to wstMGP on the destination chain.</span>]} noTopMargin>
    <WormholeConnect config={{
      chains: ["Arbitrum", "Bsc"],
      tokens: ["stMGP (Arbitrum)", "stMGP (Bsc)"],
      tokensConfig: {
        WRMGP_ARB: {
          symbol: "stMGP (Arbitrum)",
          icon: wstMGP,
          tokenId: {
            chain: "Arbitrum",
            address: contracts[42_161].stMGP
          },
          decimals: 18
        },
        WRMGP_BSC: {
          symbol: "stMGP (BSC)",
          icon: wstMGP,
          tokenId: {
            chain: "Bsc",
            address: contracts[56].stMGP
          },
          decimals: 18
        }
      },
      wrappedTokens: {
        Arbitrum: {
          [contracts[42_161].stMGP]: {
            Bsc: contracts[56].stMGP
          }
        },
        Bsc: {
          [contracts[56].stMGP]: {
            Arbitrum: contracts[42_161].stMGP
          }
        }
      }
    }}
    />
  </Page>;
};
