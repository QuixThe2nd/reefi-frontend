import Diagram from '../../public/diagram.svg'
import { useState, type ReactElement } from 'react'

interface QAItem {
  readonly question: string
  readonly answer: string | readonly string[]
}

const qaData: readonly QAItem[] = [
  {
    question: "What is Reefi and how does it work?",
    answer: [
      "Reefi is a protocol that refinances Magpie yield and governance by creating liquid derivatives of vlMGP (vote-locked MGP).",
      "It allows users to earn auto-compounding yield while maintaining liquidity and boosted yields, as well as boosted governance power."
    ]
  },
  {
    question: "What are the different tokens in the Reefi ecosystem?",
    answer: [
      "<strong>MGP</strong>: The base token from Magpie protocol",
      "<strong>rMGP</strong>: Liquid token representing locked MGP that earns auto-compounding yield (90% of vlMGP yield)",
      "<strong>yMGP</strong>: Token backed 1:1 by rMGP that can be locked for additional yield (5% of protocol yield + withdrawal fees)",
      "<strong>vMGP</strong>: Governance token backed by yMGP that controls Reefi's vlMGP voting power",
      "<strong>cMGP</strong>: Curve LP token for the MGP/rMGP/yMGP/vMGP pool that earns swap fees + underlying yield"
    ]
  },
  {
    question: "How do I earn yield with Reefi?",
    answer: [
      "1. <strong>Deposit MGP</strong>: Convert MGP to rMGP to earn 90% of vlMGP yield with auto-compounding",
      "2. <strong>Lock yMGP</strong>: Convert rMGP to yMGP and lock it to earn additional yield from protocol fees",
      "3. <strong>Provide Liquidity</strong>: Supply tokens to the Curve pool to earn swap fees plus underlying yield",
      "4. <strong>Compound Rewards</strong>: Anyone can compound pending yield and receive 1% as a reward"
    ]
  },
  {
    question: "What are the withdrawal mechanics for rMGP?",
    answer: [
      "rMGP can be redeemed for MGP in two ways:",
      "1. <strong>Instant Market Rate</strong>: Swap on Curve at current market price",
      "2. <strong>Native Redemption</strong>: Use the withdrawal queue for 90% of underlying value (10% fee) with 60-120 day wait time",
      "The 10% withdrawal fee is split: 5% to locked yMGP holders, 5% to Reefi treasury"
    ]
  },
  {
    question: "Why can't I withdraw yMGP?",
    answer: [
      "yMGP can't be natively redeemed for rMGP or MGP, instead it must be swapped at market rate.",
      "yMGP always trades at a discount, which allows for yMGP buyers to buy leveraged vlMGP yield.",
      "yMGP is designed for people dedicated to Magpie & Reefi, it rewards holders willing to commit with boosted yields and Reefi voting power.",
      "yMGP holders benefit the ecosystem by increasing permanent TVL, irreversibly boosting vMGP's voting power."
    ]
  },
  {
    question: "Why does rMGP have a withdrawal fee and delay?",
    answer: [
      "The withdrawal mechanics are inherited from Magpie's vlMGP system:",
      "• vlMGP has a minimum 60-day unlock period",
      "• Only 6 withdrawal slots are available at once, potentially extending wait time to 120 days in rare cases",
      "• The 10% fee acts as incentive to yMGP holders and ensures rMGP maintains a 90%-100% peg to underlying MGP value",
      "• This creates arbitrage opportunities for those willing to wait for withdrawals"
    ]
  },
  {
    question: "How does governance work in Reefi?",
    answer: [
      "<strong>vMGP Governance</strong>: vMGP holders control all of Reefi's vlMGP voting power on Magpie proposals",
      "<strong>Reefi DAO</strong>: Locked yMGP holders vote on Reefi protocol decisions",
      "<strong>Treasury</strong>: Receives 4% of compounded yield and 5% of withdrawal fees",
      "The core team has no initial token allocation as all tokens are backed by underlying MGP"
    ]
  },
  {
    question: "What are the risks of using Reefi?",
    answer: [
      "<strong>Smart Contract Risk</strong>: Reefi is in early beta and may contain bugs",
      "<strong>Depeg Risk</strong>: rMGP may trade below 90% of MGP value, though arbitrage mechanisms exist",
      "<strong>Liquidity Risk</strong>: Withdrawal queues may be full, extending redemption time",
      "<strong>Protocol Risk</strong>: Dependency on Magpie protocol and vlMGP mechanics"
    ]
  },
  {
    question: "How do I compound rewards and earn the 1% fee?",
    answer: [
      "Anyone can compound pending vlMGP yield by clicking 'Compound Yield' when it's profitable.",
      "The compounder receives 1% of all pending yield as yMGP tokens.",
      "This can be automated using scripts that monitor gas costs vs. rewards.",
      "Compounding benefits the entire protocol by reinvesting yield and maintaining peg stability."
    ]
  },
  {
    question: "What is the difference between minting and buying on Curve?",
    answer: [
      "<strong>Minting</strong>: Native protocol rate - rMGP minted at current backing ratio, yMGP always 1:1 with rMGP",
      "<strong>Curve Trading</strong>: Market-determined rates with potential premium/discount",
      "The UI shows percentage differences to help you choose the better option.",
      "Arbitrage opportunities exist when market rates deviate significantly from mint/burn rates."
    ]
  },
  {
    question: "Which chains does Reefi support?",
    answer: [
      "Reefi is deployed on:",
      "• <strong>BNB Chain</strong>: BnB Smart Chain",
      "• <strong>Arbitrum</strong>: Arbitrum One"
    ]
  },
  {
    question: "How are yields calculated and displayed?",
    answer: [
      "<strong>MGP APR</strong>: Base yield from vlMGP staking rewards",
      "<strong>rMGP APY</strong>: ~90% of MGP yield, auto-compounded",
      "<strong>Locked yMGP APY</strong>: Base auto-compound rMGP yield + additional yield from protocol fees",
      "<strong>cMGP APY</strong>: Weighted average of underlying token yields + Curve swap fees",
      "Yields are variable and depend on protocol usage and external factors."
    ]
  }
] as const

export const QASection = (): ReactElement => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number): void => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) newOpenItems.delete(index)
    else newOpenItems.add(index)
    setOpenItems(newOpenItems)
  }

  return (
    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-center">
      <div className="max-w-256">
        <div className="mb-6 bg-gray-900/80 rounded-xl p-4 border border-dashed border-yellow-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">⚠️ Important Notice</h3>
          <p className="text-gray-300 text-sm">Reefi is in <strong>very early beta</strong>. Please only deposit small amounts that you can afford to lose. The protocol may contain unknown bugs and should be used with caution</p>
        </div>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {qaData.map((item, index) => <div key={index} className="border border-gray-700 rounded-lg">
            <button type="button" className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-700/30 transition-colors" onClick={() => toggleItem(index)}>
              <span className="font-medium text-gray-200">{item.question}</span>
              <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${openItems.has(index) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openItems.has(index) && <div className="px-4 pb-4">
              <div className="pt-2 border-t border-gray-700">
                {Array.isArray(item.answer) ? (item.answer as string[]).map((paragraph, pIndex) => <p key={pIndex} className="text-gray-300 text-sm mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph }}/>) : <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />}
              </div>
            </div>}
          </div>)}
        </div>
        <div className="flex justify-center my-4"><img src={Diagram} alt="Diagram" className="w-full" /></div>
      </div>
    </div>
  )
}
