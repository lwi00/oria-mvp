"use client";

import { LearnShell } from "../LearnShell";

interface Entry { term: string; def: React.ReactNode; }

const ENTRIES: Entry[] = [
  {
    term: "USDC",
    def: <>Stablecoin issued by <strong>Circle</strong>, pegged to the US dollar (1 USDC = $1). Backed by dollars and US Treasury bills held in a bank. This is what you deposit on Oria.</>,
  },
  {
    term: "Stablecoin",
    def: <>A crypto whose value is pegged to a fiat currency. Used to keep stable purchasing power inside the crypto ecosystem without volatility exposure.</>,
  },
  {
    term: "APY",
    def: <>Annual Percentage Yield — the annualised return. If you earn 0.4% in a month, the equivalent APY is ~5%. This is the number shown next to your balance.</>,
  },
  {
    term: "Baseline",
    def: <>The yield guaranteed to <strong>everyone</strong> on Oria (3% today). You earn it even with no activity.</>,
  },
  {
    term: "Bonus pool",
    def: <>The Morpho yield above the baseline, redistributed weekly among active users in proportion to their activity score. No magic — inactive users are effectively funding the active ones.</>,
  },
  {
    term: "Streak",
    def: <>The number of consecutive weeks you've hit your km target. It's the biggest ingredient of your activity score (60% weight). A missed week resets it to zero.</>,
  },
  {
    term: "Morpho",
    def: <>A decentralised lending protocol on Ethereum (~$7.4B deposited). Matches lenders and borrowers via <em>smart contracts</em>. Your USDC sits in a Morpho vault managed by a curator (Steakhouse, Gauntlet…).</>,
  },
  {
    term: "Vault",
    def: <>A Morpho compartment managed by a professional curator who picks where to lend for the best risk/return mix. Oria uses three USDC vaults: Steakhouse Prime, Gauntlet Prime (on Base) and Gauntlet Frontier (on Ethereum mainnet).</>,
  },
  {
    term: "Privy",
    def: <>The service that creates and manages your wallet without a seed phrase. You sign in with email, Google or Apple; Privy holds part of your key via MPC. Non-custodial: Oria doesn't have the key.</>,
  },
  {
    term: "Wallet",
    def: <>Your address on the blockchain. It holds your USDC and your vault shares. Format <code>0x…</code>. Visible in Wallet → Receive.</>,
  },
  {
    term: "Non-custodial",
    def: <>Nobody else can move your funds. Opposite of <em>custodial</em>, where an intermediary (exchange, app) holds the keys and can block or refuse a withdrawal.</>,
  },
  {
    term: "Smart contract",
    def: <>A program running on the blockchain that automatically executes the rules it encodes. Morpho is a set of smart contracts. Publicly auditable, immutable once deployed.</>,
  },
  {
    term: "Gas fees",
    def: <>Network transaction fees. Paid in ETH (on Base or Ethereum mainnet) to validators who secure the chain. A few cents on Base, sometimes more on Ethereum mainnet when busy.</>,
  },
  {
    term: "Base",
    def: <>A layer-2 blockchain built on Ethereum by Coinbase. Far lower gas fees than Ethereum mainnet, same underlying security. The default network on Oria.</>,
  },
  {
    term: "Liquidation",
    def: <>When a Morpho borrower no longer has enough collateral to cover their loan, the collateral is automatically sold to repay lenders. This is the mechanism that protects your deposit.</>,
  },
  {
    term: "Peg",
    def: <>The mechanism that keeps a stablecoin at parity (1 USDC = $1). A <em>depeg</em> happens when parity briefly drifts — usually due to a liquidity shock. Rare but possible.</>,
  },
  {
    term: "Spread",
    def: <>The slice Oria takes on the Morpho yield to run the product. We'd rather talk about what you receive than what we keep.</>,
  },
];

export default function GlossaryPage() {
  return (
    <LearnShell title="Glossary" intro="Every word we use, defined.">
      <div className="flex flex-col gap-3 mt-2">
        {ENTRIES.map((e) => (
          <div key={e.term} className="rounded-2xl border border-oria bg-oria-section p-4">
            <p className="text-[13px] font-extrabold text-accent-purple-bright uppercase tracking-wide mb-1">
              {e.term}
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed [&_strong]:text-text-primary [&_code]:bg-accent-purple/15 [&_code]:text-accent-purple-bright [&_code]:px-1 [&_code]:rounded">
              {e.def}
            </p>
          </div>
        ))}
      </div>
    </LearnShell>
  );
}
