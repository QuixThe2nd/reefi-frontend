import { Card } from "./Card";
import Diagram from "../../public/diagram.svg";

import { type JSX, useState, type ReactElement } from "react";

interface QAItem {
  readonly question: string;
  readonly answer: JSX.Element | readonly JSX.Element[];
}

const qaData: readonly QAItem[] = [
  {
    answer: [
      <span key="What is reefi">Reefi is a protocol that refinances Magpie yield and governance by creating liquid derivatives of vlMGP (vote-locked MGP).</span>,
      <span key="Reefi benefits">It allows users to earn auto-compounding yield while maintaining liquidity and boosted yields, as well as boosted governance power.</span>
    ],
    question: "What is Reefi and how does it work?"
  },
  {
    answer: [
      <span key="MGP"><strong>MGP</strong>: The base token from Magpie protocol</span>,
      <span key="wstMGP"><strong>wstMGP</strong>: Liquid token representing locked MGP that earns auto-compounding yield (90% of vlMGP yield)</span>,
      <span key="yMGP"><strong>yMGP</strong>: Token backed 1:1 by wstMGP that can be locked to earn 5% of vlMGP yield and 25% on redemptions</span>,
      <span key="vMGP"><strong>vMGP</strong>: Governance token backed by yMGP that controls Reefi&apos;s vlMGP voting power</span>,
      <span key="cMGP"><strong>cMGP</strong>: Curve LP token for the MGP/wstMGP/yMGP/vMGP pool that earns swap fees + underlying yield</span>
    ],
    question: "What are the different tokens in the Reefi ecosystem?"
  },
  {
    answer: [
      <span key="Deposit MGP">1. <strong>Deposit MGP</strong>: Convert MGP to wstMGP to earn 90% of vlMGP yield with auto-compounding</span>,
      <span key="Lock yMGP">2. <strong>Lock yMGP</strong>: Convert wstMGP to yMGP and lock it to earn additional yield from protocol fees and redemptions</span>,
      <span key="Provide Liquidity">3. <strong>Provide Liquidity</strong>: Supply tokens to the Curve pool to earn swap fees plus underlying yield</span>,
      <span key="Compound Rewards">4. <strong>Compound Rewards</strong>: Anyone can compound pending yield and receive 1% as a reward</span>,
      <span key="Fixed Yield">5. <strong>Fixed Yield</strong>: Buy wstMGP and instantly withdraw to earn fixed yield</span>
    ],
    question: "How do I earn yield with Reefi?"
  },
  {
    answer: [
      <span key="Redeem wstMGP">wstMGP can be redeemed for MGP in two ways:</span>,
      <span key="Instant Market Rate">1. <strong>Instant Market Rate</strong>: Swap on Curve at current market price</span>,
      <span key="Native Redemption">2. <strong>Native Redemption</strong>: Use the withdrawal queue with a 60-120 day wait time</span>
    ],
    question: "What are the withdrawal mechanics for wstMGP?"
  },
  {
    answer: [
      <span key="Withdrawal Mechanics">The withdrawal mechanics are inherited from Magpie&apos;s vlMGP:</span>,
      <span key="Unlock Period">• vlMGP has a minimum 60-day unlock period</span>,
      <span key="Unlock slots">• Only 6 withdrawal slots are available at once, potentially extending wait time to 120 days in rare cases</span>,
      <span key="Arbitrage Opportunities">• This creates arbitrage opportunities for those willing to wait for withdrawals</span>
    ],
    question: "Why does wstMGP have a withdrawal delay?"
  },
  {
    answer: [
      <span key="vMGP Governance"><strong>vMGP Governance</strong>: vMGP holders control all of Reefi&apos;s vlMGP voting power on Magpie proposals</span>,
      <span key="Reefi DAO"><strong>Reefi DAO</strong>: Locked yMGP holders vote on Reefi protocol decisions</span>,
      <span key=">Treasury"><strong>Treasury</strong>: Receives 4% of compounded yield</span>,
      <span key="Initial Allocation">The core team has no initial token allocation as all tokens are backed by underlying MGP</span>
    ],
    question: "How does governance work in Reefi?"
  },
  {
    answer: [
      <span key="Smart Contract Risk"><strong>Smart Contract Risk</strong>: Reefi is in early beta and may contain bugs</span>,
      <span key="Depeg Risk"><strong>Depeg Risk</strong>: wstMGP and yMGP may trade below the MGP value, though arbitrage mechanisms exist</span>,
      <span key="Liquidity Risk"><strong>Liquidity Risk</strong>: Withdrawal queues may be full, extending redemption time</span>,
      <span key="Protocol Risk"><strong>Protocol Risk</strong>: Dependency on Magpie protocol and vlMGP mechanics</span>
    ],
    question: "What are the risks of using Reefi?"
  },
  {
    answer: [
      <span key="Who can compound">Anyone can compound pending vlMGP yield by clicking &apos;Compound Yield&apos; when it&apos;s profitable.</span>,
      <span key="Compounder rewards">The compounder receives 1% of all pending yield as yMGP tokens.</span>,
      <span key="Automating compounds">This can be automated using scripts that monitor gas costs vs. rewards.</span>,
      <span key="Compounding benefits">Compounding benefits the entire protocol by reinvesting yield and maintaining peg stability.</span>
    ],
    question: "How do I compound rewards and earn the 1% fee?"
  },
  {
    answer: [
      <span key="Minting"><strong>Minting</strong>: Native protocol rate - wstMGP minted at current backing ratio, yMGP always 1:1 with wstMGP`</span>,
      <span key="Curve Trading"><strong>Curve Trading</strong>: Market-determined rates with potential premium/discount`</span>,
      <span key="Percentage Difference">The UI shows percentage differences to help you choose the better option.</span>,
      <span key="arbitrage Opportunities 2">Arbitrage opportunities exist when market rates deviate significantly from mint/burn rates.</span>
    ],
    question: "What is the difference between minting and buying on Curve?"
  },
  {
    answer: [
      <span key="Deployed Chains">Reefi is deployed on:</span>,
      <span key="BNB Chain">• <strong>BNB Chain</strong>: BnB Smart Chain</span>,
      <span key="Arbitrum">• <strong>Arbitrum</strong>: Arbitrum One</span>
    ],
    question: "Which chains does Reefi support?"
  }
] as const;

export const QASection = (): ReactElement => {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());
  const toggleItem = (index: number): void => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) newOpenItems.delete(index);
    else newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

  return <Card>
    <div className="max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {qaData.map((item, index) => <div className="rounded-lg border border-gray-700" key={item.question}>
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-700/30" onClick={() => toggleItem(index)} type="button">
            <span className="font-medium text-gray-200">{item.question}</span>
            <svg aria-hidden="true" className={`size-5 text-gray-400 transition-transform${openItems.has(index) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
          {openItems.has(index) && <div className="px-4 pb-4">
            <div className="border-t border-gray-700 pt-2">{Array.isArray(item.answer) ? (item.answer as string[]).map(paragraph => <p className="mb-2 text-sm text-gray-300 last:mb-0" key={paragraph}>{paragraph}</p>) : <p className="text-sm text-gray-300">{item.answer}</p>}</div>
          </div>}
        </div>)}
      </div>
      <div className="my-4 flex justify-center">
        <img alt="Diagram" className="w-full" src={Diagram} />
      </div>
    </div>
  </Card>;
};
