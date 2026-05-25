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
    <LearnShell
      title="D'où vient le rendement ?"
      intro="Trois étages : Morpho génère le yield, on en garantit une part à tout le monde, et le reste se redistribue selon ta consistance."
    >
      <h2>Étage 1 — Le rendement vient de Morpho</h2>
      <p>
        Tes USDC sont déposés dans un <strong>coffre Morpho</strong> sur Base ou Ethereum (tu choisis dans Wallet → Invest). Ce coffre prête ces USDC à des emprunteurs qui ont déposé du collatéral. Les emprunteurs paient des intérêts ; ces intérêts remontent au coffre, et donc à toi.
      </p>
      <p>
        Aujourd'hui le marché donne environ <strong>{vaultMax.toFixed(2)} %</strong> annualisé sur ce coffre. Ce taux bouge avec l'offre et la demande de crédit — il monte quand la demande augmente, il baisse quand elle se calme.
      </p>

      <h2>Étage 2 — La baseline garantie</h2>
      <p>
        Oria garantit <strong>{baseline.toFixed(2)} %</strong> de baseline à tout le monde, peu importe l'activité. Même si tu ne bouges pas, tu touches au moins ça.
      </p>
      <p>
        C'est volontaire : on veut que le produit reste rassurant pour quelqu'un qui découvre la DeFi, pas un jeu à somme nulle où il faut tout donner pour récupérer quelque chose.
      </p>

      <h2>Étage 3 — Le bonus pool, redistribué selon ta consistance</h2>
      <p>
        Le reste du rendement (<strong>{Math.max(0, vaultMax - baseline).toFixed(2)} %</strong> environ) est mis dans un pool partagé. Ce pool est <strong>redistribué chaque semaine</strong> en fonction du score d'activité de chaque utilisateur. Plus tu es régulier, plus ta part grossit.
      </p>
      <p>
        Le score d'activité combine 4 ingrédients : ta streak (poids 60 %), ta régularité hebdo (15 %), ton long run (15 %), et la progression de ton allure (10 %).
      </p>
      {streakCount > 0 ? (
        <p>
          Toi, avec {streakCount} semaine{streakCount > 1 ? "s" : ""} de streak, tu récupères actuellement <strong>+{bonus.toFixed(2)} %</strong> de bonus, ce qui te place à <strong>{effectiveApy.toFixed(2)} %</strong> au total.
        </p>
      ) : (
        <p>
          Tant que tu ne valides pas une semaine, tu restes sur la baseline. Une fois la streak lancée, ton bonus augmente à chaque semaine validée jusqu'à atteindre le plafond à 16 semaines.
        </p>
      )}

      <h2>Le plafond : jamais plus que ce que Morpho donne</h2>
      <p>
        On a posé une limite haute : <strong>ton APY effectif ne peut jamais dépasser le rendement réel du coffre</strong>. Si Morpho donne {vaultMax.toFixed(2)} %, le maximum que tu peux toucher chez nous est {vaultMax.toFixed(2)} %. Pas plus.
      </p>
      <p>
        C'est un garde-fou : on ne veut surtout pas payer plus que ce que les emprunteurs paient. Le pool de bonus existe uniquement pour redistribuer l'excédent que les inactifs n'utilisent pas — il ne crée pas de rendement à partir de rien.
      </p>

      <h2>Ce qu'Oria prend</h2>
      <p>
        On prend une part fixe (le <em>spread</em>) sur le rendement Morpho pour faire tourner le produit. La part exacte n'est pas affichée volontairement dans l'app : on préfère montrer ce que tu reçois, pas ce qu'on garde. Si tu veux savoir, demande — on dira.
      </p>
    </LearnShell>
  );
}
