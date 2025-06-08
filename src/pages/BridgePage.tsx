import wstMGP from "../../public/icons/rMGP.png";

import { contracts } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { Page } from "../components/Page";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

export const BridgePage = memo((): ReactElement => <Page info={["Bridge stMGP tokens between Arbitrum and BNB Chain using Wormhole's Token Bridge.", "Unwrap wstMGP as stMGP on the source chain, bridge via Wormhole, then wrap to wstMGP on the destination chain."]} noTopMargin={true}>
  <WormholeConnect config={{
    chains: ["Arbitrum", "Bsc"],
    tokens: ["stMGP (Arbitrum)", "stMGP (Bsc)"],
    tokensConfig: {
      WRMGP_ARB: {
        symbol: "stMGP (Arbitrum)",
        icon: wstMGP,
        tokenId: {
          chain: "Arbitrum",
          address: contracts[42_161].stMGP.address
        },
        decimals: 18
      },
      WRMGP_BSC: {
        symbol: "stMGP (BSC)",
        icon: wstMGP,
        tokenId: {
          chain: "Bsc",
          address: contracts[56].stMGP.address
        },
        decimals: 18
      }
    },
    wrappedTokens: {
      Arbitrum: {
        [contracts[42_161].stMGP.address]: {
          Bsc: contracts[56].stMGP.address
        }
      },
      Bsc: {
        [contracts[56].stMGP.address]: {
          Arbitrum: contracts[42_161].stMGP.address
        }
      }
    }
  }} />
</Page>);
BridgePage.displayName = "BridgePage";
