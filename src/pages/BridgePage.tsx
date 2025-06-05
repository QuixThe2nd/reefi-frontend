import rMGP from "../../public/icons/rMGP.png";

import { contracts } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { Page } from "../components/Page";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

export const BridgePage = memo((): ReactElement => <Page info={["Bridge rMGP tokens between Arbitrum and BNB Chain using Wormhole's Token Bridge.", "Wrap rMGP to wrMGP on the source chain, bridge via Wormhole, then unwrap to rMGP on the destination chain."]} noTopMargin={true}>
  <WormholeConnect config={{
    chains: ["Arbitrum", "Bsc"],
    tokens: ["wrMGP (Arbitrum)", "wrMGP (Bsc)"],
    tokensConfig: {
      WRMGP_ARB: {
        symbol: "wrMGP (Arbitrum)",
        icon: rMGP,
        tokenId: {
          chain: "Arbitrum",
          address: contracts[42_161].wrMGP.address
        },
        decimals: 18
      },
      WRMGP_BSC: {
        symbol: "wrMGP (BSC)",
        icon: rMGP,
        tokenId: {
          chain: "Bsc",
          address: contracts[56].wrMGP.address
        },
        decimals: 18
      }
    },
    wrappedTokens: {
      Arbitrum: {
        [contracts[42_161].wrMGP.address]: {
          Bsc: contracts[56].wrMGP.address
        }
      },
      Bsc: {
        [contracts[56].wrMGP.address]: {
          Arbitrum: contracts[42_161].wrMGP.address
        }
      }
    }
  }} />
</Page>);
BridgePage.displayName = "BridgePage";
