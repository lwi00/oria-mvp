"use client";

import { LearnShell } from "../LearnShell";

export default function CryptoPage() {
  return (
    <LearnShell title="Is this crypto?" intro="Yes — and probably not the crypto you're thinking of.">
      <h2>What you hold: USDC</h2>
      <p>
        USDC is a <strong>stablecoin</strong> pegged to the US dollar: 1 USDC = $1. Issued by Circle, a US company regulated by US financial authorities. Every USDC in circulation is backed by an actual dollar (or a US Treasury bill) held in a bank.
      </p>
      <p>
        So no, it's not Bitcoin or Ether moving ±15% in a day. It's a digital proxy for the dollar, used to transit through protocols like Morpho.
      </p>

      <h2>The protocol: Morpho</h2>
      <p>
        Morpho is a <strong>decentralised lending protocol</strong> running on Ethereum. A bank without a banker: code (a <em>smart contract</em>) that matches lenders (you) and borrowers automatically.
      </p>
      <ul>
        <li>Borrowers post collateral (usually overcollateralised: $150 to borrow 100 USDC) to guarantee their loan.</li>
        <li>If the collateral drops too far, the protocol liquidates it automatically to repay lenders.</li>
        <li>Borrowers pay interest; lenders get most of it.</li>
      </ul>
      <p>
        About <strong>$7.4B</strong> sits in Morpho today. One of the largest protocols of its kind, audited by Spearbit, Trail of Bits and OpenZeppelin.
      </p>

      <h2>Why crypto rather than a traditional bank?</h2>
      <p>Three differences that matter:</p>
      <ul>
        <li>
          <strong>Transparency</strong>. You can see on-chain in real time how much Morpho holds, who's borrowing what, and the live rate. No bank shows you that.
        </li>
        <li>
          <strong>Non-custodial</strong>. Nobody can block your withdrawal. Your USDC is in <em>your</em> wallet, not in an Oria or Morpho account.
        </li>
        <li>
          <strong>Better rates, usually</strong>. DeFi stablecoin yield is around 3–8% today. A Eurozone savings account caps below 3%.
        </li>
      </ul>

      <h2>What changes vs a bank</h2>
      <ul>
        <li><strong>No public guarantee</strong> like deposit insurance. If Morpho gets hacked (rare but possible), there's no state-level backstop.</li>
        <li><strong>You're responsible for your wallet</strong>. Privy makes this far easier (no seed phrase), but losing access to your Privy account means losing access to the wallet.</li>
        <li><strong>The yield isn't fixed</strong>. It moves with the market.</li>
      </ul>

      <h2>Our position</h2>
      <p>
        DeFi is mature enough today to be offered to people who aren't especially crypto-native — provided we explain clearly how it works and don't paper over the risks. That's what these pages are for.
      </p>
    </LearnShell>
  );
}
