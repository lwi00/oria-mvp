"use client";

import { LearnShell } from "../LearnShell";
import { useStreak } from "@/lib/hooks";

export default function YieldPage() {
  const { data: streak } = useStreak();
  const streakCount = streak?.currentCount ?? 0;
  const effectiveApy = streak?.effectiveApy ?? 3;
  const breakdown = streak?.apyBreakdown;
  const baseline = breakdown?.baseline ?? 3;
  const vaultMax = breakdown?.vaultRate ?? 5;
  const bonus = Math.max(0, effectiveApy - baseline);

  return (
    <LearnShell title="Where the yield comes from" intro="Three layers: Morpho generates the yield, we guarantee a slice to everyone, and the rest redistributes by consistency.">
      <h2>Layer 1 — Morpho generates the yield</h2>
      <p>
        Your USDC sits in a <strong>Morpho vault</strong> on Base or Ethereum (you pick in Wallet → Invest). The vault lends those USDC to borrowers who've posted collateral. Borrowers pay interest, the vault collects it, and it flows back to you.
      </p>
      <p>
        Right now the market gives about <strong>{vaultMax.toFixed(2)}%</strong> annualised on that vault. The rate moves with supply and demand for credit — up when borrowing demand rises, down when it cools.
      </p>

      <h2>Layer 2 — The guaranteed baseline</h2>
      <p>
        Oria guarantees <strong>{baseline.toFixed(2)}%</strong> baseline to everyone, regardless of activity. Sit still, and you still earn that.
      </p>
      <p>
        We picked this deliberately — the product should stay reassuring for someone discovering DeFi, not a zero-sum game where you have to grind to get anything back.
      </p>

      <h2>Layer 3 — The bonus pool, redistributed by consistency</h2>
      <p>
        The rest of the yield (roughly <strong>{Math.max(0, vaultMax - baseline).toFixed(2)}%</strong>) sits in a shared pool. That pool is <strong>redistributed weekly</strong> based on each user's activity score. The more consistent you are, the bigger your slice.
      </p>
      <p>
        The activity score is made of four ingredients: streak (60% weight), weekly regularity (15%), long run (15%), pace progression (10%).
      </p>
      {streakCount > 0 ? (
        <p>
          With {streakCount} week{streakCount > 1 ? "s" : ""} of streak, you currently pull <strong>+{bonus.toFixed(2)}%</strong> of bonus, which puts you at <strong>{effectiveApy.toFixed(2)}%</strong>.
        </p>
      ) : (
        <p>
          Until you complete a week, you stay on the baseline. Once you do, your bonus grows with every validated week until the streak component caps at 16.
        </p>
      )}

      <h2>The ceiling: never above what Morpho pays</h2>
      <p>
        We capped the effective APY at the vault rate itself: <strong>your APY can never exceed what Morpho generates</strong>. If Morpho pays {vaultMax.toFixed(2)}%, the most you can earn here is {vaultMax.toFixed(2)}%.
      </p>
      <p>
        The bonus pool only redistributes what inactive users leave on the table — it doesn't create yield out of thin air.
      </p>

      <h2>What Oria takes</h2>
      <p>
        Oria takes a fixed slice (the <em>spread</em>) on the Morpho yield to run the product. We don't surface the exact figure in the app — we'd rather highlight what you receive than what we keep. Ask if you want the number.
      </p>
    </LearnShell>
  );
}
