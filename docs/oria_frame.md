
ORIA
Programmable Coin Jar

Document Cadre — Hackathon MVP
Architecture Backend & Spécifications Techniques

Version 1.0 — Mars 2026
Classification : Interne
 
Table des matières
Table des matières	2
1. Contexte du Projet	3
1.1 Vision Produit	3
1.2 Marché Cible	3
2. Périmètre du MVP Hackathon	4
2.1 Fonctionnalités IN-SCOPE	4
2.2 Fonctionnalités OUT-OF-SCOPE	4
3. Stack Technique	5
3.1 Backend	5
3.2 Blockchain	5
3.3 Infrastructure de déploiement	5
4. Architecture Backend	6
4.1 Architecture Modulaire	6
4.2 Modèle de données	6
4.3 Formule APY / Streaks	6
5. Plan de Réalisation	7
5.1 Planning Hackathon (48–72h)	7
5.2 Répartition par Profil	7
6. Aperçu de l’API	8
7. Sécurité	9
8. Évolutions Post-Hackathon	9
9. Équipe	9

 
1. Contexte du Projet
ORIA est une application d’épargne crypto gamifiée qui lie le rendement des dépôts à l’atteinte d’objectifs personnels (sport, santé, habitudes). L’application cible les 18–40 ans, épargnants déçus par les banques traditionnelles et attirés par les opportunités crypto.
Le présent document cadre définit le périmètre technique, les choix d’architecture et le plan de réalisation pour le MVP développé dans le cadre d’un hackathon.
1.1 Vision Produit
Créer un cercle vertueux entre épargne et amélioration personnelle : plus l’utilisateur est régulier dans ses objectifs sportifs, plus son rendement augmente (de 4% à 8% APY). La gamification (streaks, XP, challenges entre amis) et la couche sociale rendent l’épargne fun, accessible et virale.
1.2 Marché Cible
TAM : €956 Mds (Epargne française) — SAM : €88 Mds (part crypto-allouable) — SOM : €1.6 Md (2% capturable)
 
2. Périmètre du MVP Hackathon
2.1 Fonctionnalités IN-SCOPE
Fonctionnalité	Statut	Détail
Authentification Privy	Réel	Login social/email + création wallet intégré
Profil utilisateur	Réel	Nom, avatar, objectif (km/semaine), wallet
Streaks & gamification	Mocké (Strava)	Saisie manuelle d’activité, calcul streak, APY dynamique
Social (amis, feed)	Fonctionnel	Demandes d’amis, fil d’activité, leaderboard
Challenges de groupe	Fonctionnel	Création, inscription, suivi de progression
Lecture wallet on-chain	Réel	Balance USDC/AVAX via viem sur Avalanche Fuji
Yield / Morpho	Mocké	APY simulé basé sur les streaks, pas de dépôt réel

2.2 Fonctionnalités OUT-OF-SCOPE
•	Intégration Strava réelle (OAuth + webhooks)
•	Dépôt/retrait sur Morpho ou Aave (smart contracts)
•	Safe multisig pour la custody des fonds
•	KYC/AML & conformité MiCA
•	Swap de tokens (Li.Fi)
•	Carte de paiement / conciergerie
•	Suivi du temps d’écran (focus 2)
 
3. Stack Technique
3.1 Backend
Couche	Technologie	Justification
Runtime	Node.js 20 + TypeScript	Meilleur écosystème crypto, SDK Privy natif, prototypage rapide
Framework HTTP	Fastify 4.x	2x plus rapide qu’Express, validation de schéma intégrée, plugins riches
ORM	Prisma 5.x	Type-safe, migrations automatiques, compatible Supabase
Base de données	PostgreSQL 15 (Supabase)	Gratuit, real-time, RLS (Row Level Security)
Web3	viem	Client Avalanche type-safe pour lecture de balances on-chain
Authentification	Privy	Wallets intégrés, login social, onboarding sans friction

3.2 Blockchain
Chain cible : Avalanche C-Chain (Fuji Testnet pour le MVP). EVM-compatible, frais bas (<$0.01), finalité rapide (<2s). Les tokens utilisés sont USDC et WAVAX.
3.3 Infrastructure de déploiement
Service	Plateforme	Notes
Backend API	Railway / Render	Auto-deploy depuis GitHub, tier gratuit suffisant
Base de données	Supabase	PostgreSQL managé, 500MB gratuits
Frontend	Vercel	Déploiement automatique Next.js
Blockchain	Avalanche Fuji	Testnet gratuit, faucet disponible
 
4. Architecture Backend
4.1 Architecture Modulaire
Le backend suit une architecture modulaire organisée par domaine métier. Chaque module possède ses propres routes, services et schémas de validation. Cette approche facilite le travail en parallèle et la maintenance.
Module	Responsabilités
Auth	Vérification JWT Privy, création/récupération du profil utilisateur, liaison wallet
Streaks	Enregistrement d’activités, évaluation hebdomadaire, calcul du streak count et de l’APY dynamique
Social	Système d’amis (demande, acceptation, suppression), fil d’activité social, leaderboard
Challenges	Challenges de groupe : création, inscription, suivi de la progression collective
Wallet	Lecture des soldes on-chain (USDC, AVAX), simulation de rendement, enregistrement des dépôts

4.2 Modèle de données
Le modèle de données est construit autour de 7 tables principales : users, streaks, activities, deposits, friendships, feed_events, challenges et challenge_members. Les relations sont détaillées dans le document d’architecture technique (ORIA_Backend_Architecture.md) avec le schéma Prisma complet.
4.3 Formule APY / Streaks
L’APY est calculé dynamiquement entre 4% (base, sans streak) et 8% (maximum, à 10 semaines consécutives) via une courbe logarithmique qui récompense la régularité précoce :
APY(s) = 4 + 4 × min(1, ln(1+s) / ln(11))
Streak	0	2	4	6	10
APY	4.00%	5.83%	6.72%	7.24%	8.00%
 
5. Plan de Réalisation
5.1 Planning Hackathon (48–72h)
Phase	Timing	Livrables
1. Fondations	H0 – H8	Scaffolding Fastify + TS + Prisma, auth Privy, migrations DB, health check, CORS
2. Core	H8 – H24	Module Streaks (activité, évaluation, APY), module Social (amis, feed, leaderboard), module Wallet (balance on-chain, yield simulé)
3. Social+	H24 – H48	Challenges de groupe, seed data pour démo, gestion d’erreurs, documentation Swagger
4. Démo	H48 – H72	Tests end-to-end avec frontend, scénario de démo, préparation présentation

5.2 Répartition par Profil
Profil	Première moitié	Seconde moitié
Backend Dev	Auth Privy + Streaks module + DB	Challenges + Wallet + polish
Full-stack Dev	Social module + API routes	Intégration frontend + seed data
Frontend Dev	Onboarding Privy + dashboard	Vues sociales + démo flow
 
6. Aperçu de l’API
L’API REST est organisée par domaine fonctionnel. Toutes les routes (sauf le health check) nécessitent un JWT Privy valide dans le header Authorization. Le détail complet des endpoints, schémas de requête/réponse et exemples sont documentés dans le fichier d’architecture technique.
Domaine	Endpoints	Routes clés
Auth & Users	4	POST /api/auth/verify, GET /api/users/me, PATCH /api/users/me
Streaks	4	GET /api/streaks/me, POST /api/activities, POST /api/streaks/evaluate
Social	7	GET /api/friends, POST /api/friends/request, GET /api/feed, GET /api/leaderboard
Challenges	4	POST /api/challenges, POST /api/challenges/:id/join, GET /api/challenges/:id
Wallet	4	GET /api/wallet/balance, POST /api/wallet/start-earning, GET /api/wallet/earnings
 
7. Sécurité
Même dans un contexte hackathon, les mesures de sécurité fondamentales sont imposées dès le MVP :
•	Validation JWT : Chaque requête passe par le middleware de vérification Privy. Aucune donnée client n’est prise de confiance.
•	Validation des entrées : Tous les corps de requête sont validés par des schémas Zod avant traitement.
•	Protection SQL : Prisma paramétrise toutes les requêtes par défaut.
•	CORS : Restreint à l’origine du frontend uniquement.
•	Rate limiting : Plugin Fastify basique (10 req/s par IP).
•	Aucune clé privée côté serveur : Toute signature se fait côté client via le wallet Privy.
8. Évolutions Post-Hackathon
Les éléments suivants sont hors scope du MVP mais planifiés pour la roadmap produit :
Phase	Fonctionnalités	Timeline (Roadmap)
Alpha (Q2 2026)	Intégration Strava réelle, swap Li.Fi, source Aave	Partenariat RunClub, engagement communauté
Beta (Q3 2026)	Suivi temps d’écran, apps tierces, Safe multisig	1000 utilisateurs, phase de fidélisation
Launch (Q4+ 2026)	Carte de paiement, crédit, rendement multi-actifs	Extension, KYC/AML, conformité MiCA 2.0

9. Équipe
Membre	Rôle	Focus
Talam Diop	Co-Founder & CEO	Vision produit, stratégie, investissement crypto (ex-VC Signature Ventures, Stake Capital)
Louis Doidy	Co-Founder & CTO	Architecture technique, blockchain, data (42, LVMH)
Eva Munoz	Co-Founder & CPO	Produit, UX, investissement deeptech (ex-VC)
Emma Delhomme	Co-Founder & CMO	Support client, SEO, marketing (m-work, blisce, Paprec)

— Fin du document —
