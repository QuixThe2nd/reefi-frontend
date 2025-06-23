import { useState, type ReactElement } from "react";

import { Card } from "../components/Card";

type NonEmptyArray<T> = [T, ...T[]];

interface DocumentSection {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly subsections?: readonly DocumentSection[];
}

const documentationSections: NonEmptyArray<DocumentSection> = [
  {
    id: "introduction",
    title: "Introduction",
    content: "Reefi is a DeFi protocol that refinances Magpie yield and governance by creating liquid derivatives of vlMGP (vote-locked MGP). Reefi enables users to earn auto-compounding yield while maintaining liquidity, accessing boosted yields, and multiplying governance power through a sophisticated token ecosystem.",
    subsections: [
      {
        id: "what-is-reefi",
        title: "What is Reefi?",
        content: "Reefi stands for 'Refinance' and is built on top of the Magpie protocol. It creates liquid derivatives of vlMGP tokens, allowing users to unlock the value of locked MGP while still earning the associated yields. The protocol transforms illiquid vlMGP positions into a liquid, tradeable ecosystem of tokens that each serve different purposes in maximizing yield and governance participation."
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content: "Reefi works by pooling user MGP deposits and locking them as vlMGP in the Magpie protocol. In return, users receive liquid derivative tokens (wstMGP) that represent their share of the underlying vlMGP position. The protocol automatically compounds rewards, manages the vlMGP position, and distributes yields to token holders. Users can trade these derivatives on secondary markets or convert between different token types to optimize their yield strategies."
      }
    ]
  },
  {
    id: "tokens",
    title: "Token Ecosystem",
    content: "The Reefi ecosystem consists of a series interconnected tokens, each designed for specific use cases and yield strategies. Understanding the relationship between these tokens is crucial for maximizing your returns and participating in governance effectively.",
    subsections: [
      {
        id: "mgp",
        title: "MGP Token",
        content: "MGP is the base governance token for Magpie. It can be locked for 2 months as vlMGP to earn yield and governance rights, but this creates a liquidity problem."
      },
      {
        id: "wstmgp",
        title: "wstMGP Token",
        content: "wstMGP (Wrapped Staked MGP) is the core liquid staking token that represents a claim on the underlying vlMGP position (similar to wstETH). When you deposit MGP, you receive wstMGP tokens that automatically earn 90% of the vlMGP yield through auto-compounding. wstMGP can be redeemed for MGP either instantly through Curve at market rates or via the native withdrawal queue (60-120 day wait). The token maintains a floating peg to MGP based on the underlying backing ratio, which increases over time as yields compound."
      },
      {
        id: "ymgp",
        title: "yMGP Token",
        content: "yMGP (Yield MGP) is backed 1:1 by wstMGP earn the same yield by default. yMGP can be instantly redeemed for wstMGP with a 25% penalty, 60% of which goes to lyMGP holders and 40% to the treasury. This means yMGP is hard pegged to 0.75-1 wstMGP. yMGP can be used for range trading vs wstMGP as well as for LP yield, however yMGP's primary benefit come from locking it."
      },
      {
        id: "lymgp",
        title: "lyMGP Token",
        content: "lyMGP (Locked Yield MGP) represents a 1 yMGP share of the yMGP locker. When locking your yMGP for lyMGP, you will earn boosted yield from 5% of the total protocol yield plus 15% of all yMGP withdrawals. lyMGP can be instantly unlocked and is transferable, however accrued yield is not transferrable. lyMGP is also the governance token for Reefi. All Reefi specific issues can only be voted on by lyMGP holders."
      },
      {
        id: "vmgp",
        title: "vMGP Token",
        content: "vMGP (Voting MGP) is the governance token backed 1:1 by yMGP but cannot be converted back. In addition to wstMGP's underlying yield, vMGP holders control all of Reefi's vlMGP voting power on Magpie proposals, with votes amplified by the total vlMGP position. For example, if Reefi controls 1M vlMGP and there are 100K vMGP tokens, each vMGP has 10x voting power. vMGP can be purchased with yMGP through a one-way conversion."
      },
      {
        id: "lvmgp",
        title: "lvMGP Token",
        content: "lvMGP (Locked Voting MGP) is backed 1:1 by vMGP with instant withdrawals. lvMGP also earns yield similar to lyMGP. lvMGP earns it's yield by renting out it's voting power on Reefi's voting pool."
      },
      {
        id: "bmgp",
        title: "bMGP Tokens",
        content: "bMGP (Bond MGP) is backed 1:1 by MGP. When converting stMGP back to MGP, you are issued a bMGP which will be redeemable 1:1 for MGP at a specific date. Each time a new withdrawal slot is used with Magpie, a new bMGP token will be issued. bMGP can be traded on the open market, slowly regaining it's peg."
      },
      {
        id: "smgp",
        title: "sMGP Token",
        content: "sMGP (Synthetic MGP) is not backed by an underlying asset, instead backed by Reefi yield. sMGP allows you to trade on Reefi's underlying yield similar to Pendle, however sMGP has no maturity date. By buying sMGP you are betting that Reefi's yield will increase. sMGP is minted 1:1 for every MGP in non-compounded yield Reefi generates. Non-compounded yield is then sold on Curve to buyback and burn sMGP. This means when 1 sMGP is less than 1 MGP, all non-compounded protocol yield improves the peg."
      },
      {
        id: "cmgp",
        title: "cMGP Token",
        content: "cMGP is the Curve LP token for the MGP/wstMGP/yMGP/vMGP liquidity pool. By providing liquidity, users earn swap fees from arbitrage activity plus the underlying yield from their contributed tokens. The pool enables instant conversions between token types and helps maintain peg stability. LP providers benefit from multiple revenue streams: trading fees, yield from underlying tokens, and potential rewards from Curve's ecosystem."
      }
    ]
  },
  {
    id: "yield-strategies",
    title: "Yield Strategies",
    content: "Reefi offers multiple yield strategies to suit different risk profiles and investment timelines. Each strategy has unique characteristics, risks, and potential returns. Understanding these strategies helps users optimize their positions based on their goals.",
    subsections: [
      {
        id: "auto-compounding-rmgp",
        title: "Auto-Compounding with wstMGP",
        content: "The simplest strategy involves depositing MGP to receive wstMGP tokens. This provides 90% of vlMGP yield (typically 40-60% APR) with automatic compounding and full liquidity. The protocol handles all vlMGP management, reward claiming, and reinvestment. Users can exit anytime via Curve or queue for native redemption. This strategy is ideal for users who want vlMGP exposure without the complexity of manual management."
      },
      {
        id: "locked-yield",
        title: "Locked Yield Boost with yMGP",
        content: "Advanced users can convert wstMGP to yMGP and lock it to earn additional yield. Locked yMGP earns the base wstMGP yield plus 5% of total protocol yield plus 25% of yMGP withdrawal penalties. This can significantly boost APY, especially when many users are withdrawing yMGP. The trade-off is reduced liquidity and exposure to smart contract risks. This strategy works best for users with longer time horizons and higher risk tolerance."
      },
      {
        id: "sell-votes",
        title: "Sell votes with vMGP",
        content: "vMGP holders can locked their coins to earn additional yield. Locked vMGP is unable to vote on proposals. The yield comes from users that are buying votes with yMGP. This allows vMGP to be purchased as a speculative asset about the significance of future proposals. Most holders will find themselves leaving their vMGP locked until there is a vote they care about."
      },
      {
        id: "liquidity-provision",
        title: "Liquidity Provision",
        content: "Providing liquidity to the MGP/wstMGP/yMGP Curve pool earns swap fees plus underlying token yields. This strategy benefits from arbitrage activity and peg maintenance operations. LP providers should monitor pool composition and impermanent loss risks. During high volatility or depeg events, trading volume increases, boosting fee income. This strategy suits users comfortable with DeFi complexity and impermanent loss concepts."
      },
      {
        id: "fixed-yield",
        title: "Fixed Yield Strategy",
        content: "When wstMGP trades below its fair value, users can buy discounted wstMGP and immediately submit it for withdrawal to earn guaranteed fixed returns. The yield is determined by the discount (e.g., buying at 90% of backing value guarantees 11.1% return) over the withdrawal period (60-120 days). This strategy requires patience but offers predictable returns independent of variable staking yields. It's particularly attractive when wstMGP is significantly depegged."
      },
      {
        id: "compound-rewards",
        title: "Compound Rewards",
        content: "Anyone can compound pending vlMGP yields for the entire protocol and receive 1% of all pending rewards as compensation. This can be automated using scripts that monitor gas costs vs. reward amounts. When profitable, compounding benefits the entire protocol while earning risk-free rewards. This strategy requires technical knowledge but offers opportunities for passive income through automation."
      }
    ]
  },
  {
    id: "auto-compounding",
    title: "Auto Compounding",
    content: "Reefi's wstMGP earns auto compounded yield from vlMGP. Compounding occurs at a variable frequency and is initiated by users.",
    subsections: [
      {
        id: "auto-compounding-benefits",
        title: "Benefits",
        content: "As wstMGP's underlying vlMGP earns yield, the yield is automatically converted to MGP then deposited to earn more yield. By auto compounding yield, yield increases by roughly 20% - 30%. Another benefit for Reefi styled auto compounding is gas cost. Compounding yield costs roughly the same amount for 1 MGP or 1 million MGP, this allows for compounding to occur at a much faster rate."
      },
      {
        id: "auto-compounding-rewards",
        title: "Triggering a Compound to Earn Yield",
        content: "Compounds can be triggered by anyone. By compounding vlMGP yield, you earn 1% of the compounded yield as yMGP. This process involves clicking a single button and covering the gas fee (~$0.05 on Arbitrum). When compounding, all pending yield (PNP, EGP, etc.) is converted to MGP then locked as vlMGP."
      }
    ]
  },
  {
    id: "vote-markets",
    title: "Magpie Vote Markets",
    content: "Reefi creates a vote market for Magpie governance allowing users to buy lifetime voting rights or rent one time votes for pennies on the dollar.",
    subsections: [
      {
        id: "lifetime-votes",
        title: "Lifetime Boosted Voting Rights",
        content: "The vMGP token provides holders with lifetime voting rights. vMGP controls the entire vlMGP voting power of Reefi, sourcing voting power from wstMGP, yMGP, and it's own underlying vlMGP. If Reefi controls 1M vlMGP and 100K vMGP tokens exist, each vMGP represents 10x normal voting power."
      },
      {
        id: "voting-pool",
        title: "Voting Pool",
        content: "Reefi has a voting pool where anyone can directly buy votes with yMGP. These votes are sourced from all unvoted vMGP. By participating in a proposal's vote pool, you are buying shares of voting power. Each yMGP deposited into a vote pool votes for a specific choice in the proposal. At the end of the voting period, whichever choice has the most yMGP backing it wins."
      },
      {
        id: "selling-votes",
        title: "Selling Votes",
        content: "vMGP holders are able to directly sell votes by locking their vMGP for lvMGP. lvMGP loses it's voting rights and provides the voting pool more votes as well as a guaranteed minimum number of votes. All yMGP deposited in the vote pool goes to vMGP holders as yield."
      }
    ]
  },
  {
    id: "governance",
    title: "Reefi Governance",
    content: "Reefi implements a dual governance system: vMGP holders control Magpie protocol votes using Reefi's vlMGP position, while locked yMGP holders govern Reefi protocol decisions. This separation ensures both external influence and internal protocol management are democratically controlled.",
    subsections: [
      {
        id: "dao-structure",
        title: "DAO Structure",
        content: "Reefi's team has no token allocation as all tokens are backed by underlying MGP contributed by users. Locked yMGP holders vote on Reefi-specific decisions like fee structures, treasury management, and protocol upgrades. The protocol is designed to be community-governed from launch, with major decisions requiring consensus from locked yMGP holders who have the most skin in the game."
      }
    ]
  },
  {
    id: "risks",
    title: "Risks & Disclaimers",
    content: "DeFi protocols carry inherent risks that users must understand before participating. Reefi is in early beta and should be considered experimental technology. Users should only deposit amounts they can afford to lose and understand all risk factors before proceeding.",
    subsections: [
      {
        id: "smart-contract-risks",
        title: "Smart Contract Risks",
        content: "Smart contracts may contain bugs, vulnerabilities, or unexpected behaviors that could result in loss of funds. no code is guaranteed to be bug-free. The protocol's complexity increases risk surface area. Users should understand that early-stage protocols carry higher smart contract risks than established projects. Emergency mechanisms exist but may not prevent all potential loss scenarios."
      },
      {
        id: "market-risks",
        title: "Market & Depeg Risks",
        content: "stMGP, wstMGP, yMGP, & vMGP may trade at discounts to their underlying value, especially during market stress. While arbitrage mechanisms exist to restore pegs, they depend on market participants and may not work instantly. Extreme depegs could persist for extended periods. Users may face losses if tokens are sold below fair value, however native rates don't depeg. Yield rates are variable and may decrease due to market conditions or protocol changes."
      },
      {
        id: "liquidity-risks",
        title: "Liquidity & Withdrawal Risks",
        content: "Native withdrawals through Magpie's queue system take 60-120 days depending on how many slots are occupied. During stress events, Curve pools may have insufficient liquidity for large trades. Users should plan for potential delays in accessing underlying MGP. Withdrawal queues could become congested during market downturns when many users want to exit simultaneously."
      },
      {
        id: "protocol-dependency",
        title: "Protocol Dependency Risks",
        content: "Reefi depends on Magpie protocol continuing to operate as expected. Changes to Magpie's tokenomics, governance, or technical implementation could affect Reefi's functionality. Curve pool mechanics are essential for token liquidity and arbitrage. Users are exposed to risks from all underlying protocols in addition to Reefi-specific risks. This dependency risk is inherent to all protocol integrations."
      }
    ]
  },
  {
    id: "guides",
    title: "User Guides",
    content: "Step-by-step guides for common Reefi operations, from basic deposit and withdrawal to advanced yield strategies. These guides assume basic familiarity with DeFi concepts and wallet usage.",
    subsections: [
      {
        id: "getting-started",
        title: "Getting Started",
        content: "1. Connect a Web3 wallet (MetaMask recommended) to the Reefi interface. 2. Switch to BNB Chain or Arbitrum network. 3. Ensure you have MGP tokens and network gas tokens (BNB/ETH). 4. Start with small amounts while learning the protocol. 5. Understand that this is beta software with inherent risks. The interface will guide you through token approvals and transactions. Always verify transaction details before confirming."
      },
      {
        id: "depositing",
        title: "Depositing & Earning Yield",
        content: "To deposit MGP: 1. Navigate to 'Get wstMGP' section. 2. Enter MGP amount to deposit. 3. Approve MGP spending if needed. 4. Click 'Mint' to convert MGP to wstMGP. 5. wstMGP will automatically earn yield through auto-compounding. For enhanced yield: 1. Convert wstMGP to yMGP (1:1 ratio). 2. Lock yMGP to earn additional protocol fees. 3. Monitor your locked position and accumulated rewards. 4. Claim additional yield periodically."
      },
      {
        id: "withdrawing",
        title: "Withdrawal Methods",
        content: "Instant withdrawal via Curve: 1. Navigate to swap interface. 2. Select token to sell (wstMGP/yMGP). 3. Choose MGP as output token. 4. Execute swap at current market rate. Native withdrawal queue: 1. Go to 'Redeem wstMGP' section. 2. Submit tokens to withdrawal queue. 3. Wait 60-120 days for processing. 4. Claim MGP when withdrawal completes. Consider market rates vs. queue timing when choosing withdrawal method."
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting",
        content: "Common issues: Transaction failures usually indicate insufficient gas or token approvals. Ensure adequate gas limits and token allowances. High slippage warnings suggest low liquidity - consider smaller amounts or different timing. If transactions are pending, check network congestion and gas prices. For interface issues, try refreshing the page or clearing browser cache. When yields appear incorrect, remember they compound automatically and may not update immediately. Contact community support channels for persistent technical issues."
      },
      {
        id: "advanced-strategies",
        title: "Advanced Strategies",
        content: "Arbitrage opportunities: Monitor price differences between native mint rates and Curve market rates. Buy undervalued tokens and convert through optimal routes. Yield optimization: Compare APYs across different token types and lock durations. Consider compound frequency and gas costs in calculations. Governance participation: Convert yMGP to vMGP for amplified voting power on Magpie proposals. Research proposals and vote according to your interests. Risk management: Diversify across strategies and protocols. Set stop-losses and exit plans before entering positions."
      }
    ]
  }
] as const;

interface SidebarProperties {
  readonly sections: readonly DocumentSection[];
  readonly activeSection: string;
  readonly onSectionChange: (_sectionId: string) => void;
}

const Sidebar = ({ sections, activeSection, onSectionChange }: SidebarProperties): ReactElement => {
  const getParentSectionId = (sectionId: string): string | undefined => {
    for (const section of sections) if (section.subsections) for (const subsection of section.subsections) if (subsection.id === sectionId) return section.id;
    return undefined;
  };

  const isSubsectionOfActiveSection = (sectionId: string): boolean => getParentSectionId(activeSection) === sectionId || activeSection === sectionId;

  return <div className="w-64">
    <Card className="fixed w-64 border-r border-gray-700 bg-gray-800/50 p-4">
      <h3 className="mb-4 text-lg font-semibold text-blue-400 w-full">Documentation</h3>
      <nav className="space-y-2 w-full">
        {sections.map(section => <div key={section.id}>
          <button className={`w-full text-left text-sm font-medium transition-colors hover:text-blue-400 ${activeSection === section.id ? "text-blue-400" : "text-gray-300"}`} onClick={() => onSectionChange(section.id)} type="button">{section.title}</button>
          {section.subsections && isSubsectionOfActiveSection(section.id) ? <div className="ml-4 mt-2 space-y-1">
            {section.subsections.map(subsection => <button className={`block w-full text-left text-xs transition-colors hover:text-blue-300 ${activeSection === subsection.id ? "text-blue-300" : "text-gray-400"}`} key={subsection.id} onClick={() => onSectionChange(subsection.id)} type="button">{subsection.title}</button>)}
          </div> : undefined}
        </div>)}
      </nav>
    </Card>
  </div>;
};

interface ContentProperties {
  readonly section: DocumentSection;
}

const Content = ({ section }: ContentProperties): ReactElement => <div className="flex-1 overflow-auto p-6">
  <div className="mx-auto max-w-4xl">
    <h1 className="mb-6 text-3xl font-bold text-white">{section.title}</h1>
    <div className="prose prose-invert max-w-none">
      <p className="mb-6 text-gray-300 leading-relaxed">{section.content}</p>
      {section.subsections ? <div className="space-y-8">
        {section.subsections.map(subsection => <div className="border-l-4 border-blue-600 pl-6" key={subsection.id}>
          <h2 className="mb-3 text-xl font-semibold text-blue-400">{subsection.title}</h2>
          <p className="text-gray-300 leading-relaxed">{subsection.content}</p>
        </div>)}
      </div> : undefined}
      <div className="mt-12 rounded-lg border border-gray-700 bg-gray-800/30 p-6">
        <h3 className="mb-3 text-lg font-semibold text-yellow-400">⚠️ Important Notice</h3>
        <p className="text-sm text-gray-300"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </div>
  </div>
</div>;
const findSectionById = (sections: readonly DocumentSection[], id: string): DocumentSection | undefined => {
  for (const section of sections) {
    if (section.id === id) return section;
    if (section.subsections) {
      const found = findSectionById(section.subsections, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const Documentation = (): ReactElement => {
  const [activeSection, setActiveSection] = useState("introduction");
  const currentSection: DocumentSection = findSectionById(documentationSections, activeSection) ?? documentationSections[0];
  return <div className="flex h-full">
    <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} sections={documentationSections} />
    <Content section={currentSection} />
  </div>;
};
