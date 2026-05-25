"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Lang = "en" | "fr";

type Dict = Record<string, string>;

const en: Dict = {
  // common
  "common.amount": "Amount",
  "common.cancel": "Cancel",
  "common.save": "Save changes",
  "common.saving": "Saving…",
  "common.allSaved": "All saved",
  "common.loading": "Loading…",
  "common.today": "Today",
  "common.thisWeek": "This week",
  "common.earlier": "Earlier",
  "common.connect": "Connect",
  "common.connecting": "Connecting…",
  "common.refresh": "Refresh",
  "common.viewTx": "view tx",

  // nav
  "nav.home": "Home",
  "nav.friends": "Friends",
  "nav.challenges": "Challenges",
  "nav.wallet": "Wallet",

  // wallet
  "wallet.title": "Wallet",
  "wallet.totalBalance": "Total balance",
  "wallet.earnedApy": "+{earned} earned · {apy}% APY",
  "wallet.deposit": "Deposit",
  "wallet.invest": "Invest",
  "wallet.withdraw": "Withdraw",
  "wallet.activity": "Activity",
  "wallet.earningStatus": "Earning status",
  "wallet.acrossVaults": "Across Morpho vaults · live on-chain",
  "wallet.active": "Active",
  "wallet.inactive": "Inactive",
  "wallet.invested": "Invested",
  "wallet.earnedLabel": "Earned",
  "wallet.yourApy": "Your APY",
  "wallet.yourPositions": "Your positions",
  "wallet.noPositions": "No positions yet. Tap Invest to start earning.",
  "wallet.idleUsdc": "Idle USDC",
  "wallet.usdcOn": "USDC on {chain}",
  "wallet.idleHint": "Not earning yield yet — tap Invest to deploy into a Morpho vault.",
  "wallet.recentTx": "Recent transactions",
  "wallet.earning": "Earning",
  "wallet.confirmed": "Confirmed",
  "wallet.noTx": "No transactions yet",
  "wallet.noTxHint": "Make your first deposit to start earning",
  "wallet.position": "position",
  "wallet.walletLabel": "Wallet",
  "wallet.addressCopied": "Address copied!",
  "wallet.copyFailed": "Failed to copy",

  // invest modal
  "invest.title": "Invest in Morpho",
  "invest.intro": "Choose a Morpho vault. You can switch between them — each has its own yield and chain.",
  "invest.tapMax": "Tap balance to use max",
  "invest.cta": "Invest",
  "invest.processing": "Processing…",
  "invest.walletNotConnected": "Wallet not connected",
  "invest.switching": "Switching to {chain}…",
  "invest.success": "Success!",
  "invest.cancelled": "Cancelled",
  "invest.failed": "Transaction failed",
  "invest.done": "Invested {amount} USDC in {vault} ✓",

  // withdraw modal
  "withdraw.title": "Withdraw from Morpho",
  "withdraw.intro": "Pick the vault to withdraw from.",
  "withdraw.positionOn": "Position on {chain}",
  "withdraw.tapMax": "Tap to withdraw max",
  "withdraw.cta": "Withdraw",
  "withdraw.amountTooSmall": "Amount too small",
  "withdraw.done": "Withdrew {amount} USDC ✓",

  // settings
  "settings.title": "Settings",
  "settings.backToProfile": "Back to profile",
  "settings.language": "Language",
  "settings.languageDesc": "Choose the language for the whole app.",
  "settings.vacationMode": "Vacation mode",
  "settings.vacationDesc": "Freeze your streak and APY progression for 2 weeks — in case of vacation or injury. The weekly evaluation won't reset your streak while active.",
  "settings.vacationActive": "Vacation active — {days} left",
  "settings.vacationEnds": "Ends {date}",
  "settings.endVacation": "End vacation early",
  "settings.ending": "Ending…",
  "settings.startVacation": "Start 2-week vacation",
  "settings.starting": "Starting…",
  "settings.vacationConfirm": "Freeze your streak for 2 weeks? Your current streak count and APY will be preserved.",
  "settings.vacationStarted": "Vacation mode started — your streak is frozen",
  "settings.vacationEnded": "Vacation mode ended",
  "settings.vacationStartFailed": "Failed to start vacation",
  "settings.vacationEndFailed": "Failed to end vacation",
  "settings.push": "Push Notifications",
  "settings.pushUpdating": "Updating…",
  "settings.pushEnabled": "Enabled",
  "settings.pushEnable": "Enable push notifications",
  "settings.pushDesc": "Get notified about friend pokes, goal completions, and more — even when the app is closed",
  "settings.pushOn": "Push notifications enabled!",
  "settings.pushOff": "Push notifications disabled",
  "settings.pushDenied": "Permission denied — check your browser settings",
  "settings.pushFailed": "Failed to update push notifications",
  "settings.notifications": "Notifications",
  "settings.notifRunReminders": "Run reminders",
  "settings.notifRunRemindersDesc": "Daily reminder at 7 AM on your scheduled run days",
  "settings.notifPokes": "Friend pokes",
  "settings.notifPokesDesc": "Let friends send you motivational nudges",
  "settings.notifFriendReq": "Friend requests",
  "settings.notifFriendReqDesc": "When someone sends you a friend request",
  "settings.notifWeekly": "Weekly summary",
  "settings.notifWeeklyDesc": "Recap of your week every Sunday",
  "settings.privacy": "Privacy",
  "settings.privacyLeaderboard": "Show on leaderboard",
  "settings.privacyLeaderboardDesc": "Appear in your friends' leaderboard rankings",
  "settings.privacyActivity": "Share activity with friends",
  "settings.privacyActivityDesc": "Let friends see your weekly distance and progress",
  "settings.units": "Units",
  "settings.unitsKm": "Kilometers",
  "settings.unitsMi": "Miles",
  "settings.unitsToMi": "Switch to miles",
  "settings.unitsToKm": "Switch to kilometers",
  "settings.monthlyProgression": "Monthly progression",
  "settings.monthlyProgressionDesc": "How much your weekly target should grow each month. Pick Maintenance to keep the same target, or a higher rate to gradually push yourself.",
  "settings.maintain": "Maintain",
  "settings.currency": "Currency",
  "settings.currencyDesc": "Display balances and earnings in your preferred currency. EUR is converted at a fixed rate of 0.92 (rate refresh coming soon).",
  "settings.saved": "Settings saved!",
  "settings.saveFailed": "Failed to save settings",
  "settings.day": "day",
  "settings.days": "days",
};

const fr: Dict = {
  // common
  "common.amount": "Montant",
  "common.cancel": "Annuler",
  "common.save": "Enregistrer",
  "common.saving": "Enregistrement…",
  "common.allSaved": "Tout est enregistré",
  "common.loading": "Chargement…",
  "common.today": "Aujourd'hui",
  "common.thisWeek": "Cette semaine",
  "common.earlier": "Plus tôt",
  "common.connect": "Connecter",
  "common.connecting": "Connexion…",
  "common.refresh": "Rafraîchir",
  "common.viewTx": "voir la tx",

  // nav
  "nav.home": "Accueil",
  "nav.friends": "Amis",
  "nav.challenges": "Défis",
  "nav.wallet": "Portefeuille",

  // wallet
  "wallet.title": "Portefeuille",
  "wallet.totalBalance": "Solde total",
  "wallet.earnedApy": "+{earned} gagnés · {apy}% APY",
  "wallet.deposit": "Dépôt",
  "wallet.invest": "Investir",
  "wallet.withdraw": "Retirer",
  "wallet.activity": "Activité",
  "wallet.earningStatus": "Statut de rendement",
  "wallet.acrossVaults": "Sur les vaults Morpho · en direct on-chain",
  "wallet.active": "Actif",
  "wallet.inactive": "Inactif",
  "wallet.invested": "Investi",
  "wallet.earnedLabel": "Gagné",
  "wallet.yourApy": "Ton APY",
  "wallet.yourPositions": "Tes positions",
  "wallet.noPositions": "Aucune position pour l'instant. Touche Investir pour commencer à gagner.",
  "wallet.idleUsdc": "USDC inactif",
  "wallet.usdcOn": "USDC sur {chain}",
  "wallet.idleHint": "Pas encore de rendement — touche Investir pour déployer dans un vault Morpho.",
  "wallet.recentTx": "Transactions récentes",
  "wallet.earning": "En rendement",
  "wallet.confirmed": "Confirmé",
  "wallet.noTx": "Aucune transaction pour l'instant",
  "wallet.noTxHint": "Fais ton premier dépôt pour commencer à gagner",
  "wallet.position": "position",
  "wallet.walletLabel": "Portefeuille",
  "wallet.addressCopied": "Adresse copiée !",
  "wallet.copyFailed": "Échec de la copie",

  // invest modal
  "invest.title": "Investir dans Morpho",
  "invest.intro": "Choisis un vault Morpho. Tu peux passer de l'un à l'autre — chacun a son propre rendement et sa chaîne.",
  "invest.tapMax": "Touche le solde pour utiliser le max",
  "invest.cta": "Investir",
  "invest.processing": "En cours…",
  "invest.walletNotConnected": "Portefeuille non connecté",
  "invest.switching": "Passage sur {chain}…",
  "invest.success": "Réussi !",
  "invest.cancelled": "Annulé",
  "invest.failed": "Transaction échouée",
  "invest.done": "{amount} USDC investis dans {vault} ✓",

  // withdraw modal
  "withdraw.title": "Retirer de Morpho",
  "withdraw.intro": "Choisis le vault depuis lequel retirer.",
  "withdraw.positionOn": "Position sur {chain}",
  "withdraw.tapMax": "Touche pour retirer le max",
  "withdraw.cta": "Retirer",
  "withdraw.amountTooSmall": "Montant trop petit",
  "withdraw.done": "{amount} USDC retirés ✓",

  // settings
  "settings.title": "Réglages",
  "settings.backToProfile": "Retour au profil",
  "settings.language": "Langue",
  "settings.languageDesc": "Choisis la langue de toute l'application.",
  "settings.vacationMode": "Mode vacances",
  "settings.vacationDesc": "Gèle ta série et ta progression d'APY pendant 2 semaines — en cas de vacances ou de blessure. L'évaluation hebdomadaire ne réinitialisera pas ta série tant qu'il est actif.",
  "settings.vacationActive": "Vacances actives — encore {days}",
  "settings.vacationEnds": "Fin le {date}",
  "settings.endVacation": "Terminer les vacances",
  "settings.ending": "Fin en cours…",
  "settings.startVacation": "Démarrer 2 semaines de vacances",
  "settings.starting": "Démarrage…",
  "settings.vacationConfirm": "Geler ta série pendant 2 semaines ? Ton décompte de série et ton APY seront préservés.",
  "settings.vacationStarted": "Mode vacances activé — ta série est gelée",
  "settings.vacationEnded": "Mode vacances terminé",
  "settings.vacationStartFailed": "Échec du démarrage des vacances",
  "settings.vacationEndFailed": "Échec de la fin des vacances",
  "settings.push": "Notifications push",
  "settings.pushUpdating": "Mise à jour…",
  "settings.pushEnabled": "Activées",
  "settings.pushEnable": "Activer les notifications push",
  "settings.pushDesc": "Reçois une notification pour les pokes d'amis, les objectifs atteints, et plus — même quand l'app est fermée",
  "settings.pushOn": "Notifications push activées !",
  "settings.pushOff": "Notifications push désactivées",
  "settings.pushDenied": "Permission refusée — vérifie les réglages de ton navigateur",
  "settings.pushFailed": "Échec de la mise à jour des notifications push",
  "settings.notifications": "Notifications",
  "settings.notifRunReminders": "Rappels de course",
  "settings.notifRunRemindersDesc": "Rappel quotidien à 7 h les jours de course prévus",
  "settings.notifPokes": "Pokes d'amis",
  "settings.notifPokesDesc": "Laisse tes amis t'envoyer des encouragements",
  "settings.notifFriendReq": "Demandes d'ami",
  "settings.notifFriendReqDesc": "Quand quelqu'un t'envoie une demande d'ami",
  "settings.notifWeekly": "Résumé hebdomadaire",
  "settings.notifWeeklyDesc": "Récap de ta semaine chaque dimanche",
  "settings.privacy": "Confidentialité",
  "settings.privacyLeaderboard": "Apparaître au classement",
  "settings.privacyLeaderboardDesc": "Apparais dans le classement de tes amis",
  "settings.privacyActivity": "Partager l'activité avec les amis",
  "settings.privacyActivityDesc": "Laisse tes amis voir ta distance hebdo et ta progression",
  "settings.units": "Unités",
  "settings.unitsKm": "Kilomètres",
  "settings.unitsMi": "Miles",
  "settings.unitsToMi": "Passer aux miles",
  "settings.unitsToKm": "Passer aux kilomètres",
  "settings.monthlyProgression": "Progression mensuelle",
  "settings.monthlyProgressionDesc": "De combien ton objectif hebdo doit augmenter chaque mois. Choisis Maintien pour garder le même objectif, ou un taux plus élevé pour te pousser progressivement.",
  "settings.maintain": "Maintien",
  "settings.currency": "Devise",
  "settings.currencyDesc": "Affiche les soldes et les gains dans la devise de ton choix. L'EUR est converti à un taux fixe de 0,92 (rafraîchissement du taux bientôt).",
  "settings.saved": "Réglages enregistrés !",
  "settings.saveFailed": "Échec de l'enregistrement des réglages",
  "settings.day": "jour",
  "settings.days": "jours",
};

const MESSAGES: Record<Lang, Dict> = { en, fr };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Read the saved choice on mount (client-only to avoid hydration mismatch).
  useEffect(() => {
    const saved = localStorage.getItem("oria_lang");
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("oria_lang", l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let s = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
