"use client";

import { LearnShell } from "../LearnShell";

export default function CryptoPage() {
  return (
    <LearnShell
      title="C'est de la crypto ?"
      intro="Oui. Mais probablement pas la crypto à laquelle tu penses."
    >
      <h2>Ce que tu détiens : des USDC</h2>
      <p>
        USDC est un <strong>stablecoin</strong> : une crypto dont la valeur est calée sur le dollar US (1 USDC = 1 $). Émis par Circle, une boîte américaine régulée par les autorités financières US. Chaque USDC en circulation est adossé à un vrai dollar (ou un bon du Trésor US) détenu en banque.
      </p>
      <p>
        Donc non, ce n'est pas du Bitcoin qui peut faire ±15 % dans la journée. C'est un proxy numérique du dollar, qui sert à transiter dans des protocoles comme Morpho.
      </p>

      <h2>Le protocole : Morpho</h2>
      <p>
        Morpho est un <strong>protocole de prêt décentralisé</strong> qui tourne sur Ethereum. En gros, une banque sans banquier : un code (un <em>smart contract</em>) qui met en relation des prêteurs (toi) et des emprunteurs, automatiquement.
      </p>
      <ul>
        <li>Les emprunteurs déposent du collatéral (souvent surévalué : 150 € pour emprunter 100 USDC) pour garantir leur prêt.</li>
        <li>Si le collatéral baisse trop, le protocole le liquide automatiquement pour rembourser les prêteurs.</li>
        <li>Les emprunteurs paient des intérêts ; les prêteurs (toi) en récupèrent la majeure partie.</li>
      </ul>
      <p>
        Aujourd'hui <strong>~7,4 Mds$</strong> sont confiés à Morpho. C'est un des plus gros protocoles du genre, audité par Spearbit, Trail of Bits et OpenZeppelin.
      </p>

      <h2>Pourquoi crypto plutôt qu'une banque traditionnelle ?</h2>
      <p>Trois différences qui comptent :</p>
      <ul>
        <li>
          <strong>Transparence</strong>. Tu peux voir en temps réel sur la chaîne combien Morpho détient, qui emprunte combien, quel est le rendement. Aucune banque ne te montre ça.
        </li>
        <li>
          <strong>Non-custodial</strong>. Personne ne peut bloquer ton retrait. Tes USDC sont dans <em>ton</em> wallet, pas dans un compte d'Oria ou de Morpho.
        </li>
        <li>
          <strong>Meilleur taux, généralement</strong>. Le rendement du marché DeFi sur stablecoins est aujourd'hui entre 3 % et 8 %, là où un livret bancaire en zone euro plafonne sous 3 %.
        </li>
      </ul>

      <h2>Ce qui change par rapport à une banque</h2>
      <ul>
        <li><strong>Pas de garantie publique</strong> type fonds de garantie des dépôts. Si Morpho se fait hacker (rare mais possible), il n'y a pas l'État derrière pour rembourser.</li>
        <li><strong>Tu es responsable de ton wallet</strong>. Privy simplifie énormément (pas de seed phrase), mais perdre l'accès à ton compte Privy signifie perdre l'accès au wallet.</li>
        <li><strong>Le rendement n'est pas garanti</strong>. Il bouge avec le marché.</li>
      </ul>

      <h2>Notre position</h2>
      <p>
        On pense que la DeFi est aujourd'hui assez mature pour être proposée aux gens qui ne sont pas spécialement crypto-natifs — à condition d'expliquer clairement comment ça marche et de ne pas cacher les risques. C'est tout l'objet de ces pages.
      </p>
    </LearnShell>
  );
}
