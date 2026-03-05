# ORIA — Design System

**Version:** 1.0  
**Date:** Mars 2026  
**Contexte:** Hackathon MVP  
**Langue de l'interface:** Anglais  

---

## 1. Philosophie de Design

### 1.1 Vision

ORIA est une app d'épargne crypto gamifiée qui cible les 18–40 ans. Le design doit transmettre trois qualités simultanément : **confiance** (c'est une app financière, les gens y déposent de l'argent), **énergie** (la gamification, les streaks, le sport) et **accessibilité** (pas de jargon crypto intimidant, onboarding sans friction).

L'identité visuelle repose sur un univers **clair, aérien et lumineux**, avec des accents lavande/violet comme signature chromatique. On évite le dark mode "crypto-degen" classique au profit d'un style plus proche d'une fintech grand public (Revolut, Lydia) tout en gardant une touche de personnalité via les gradients, les animations du jar et les éléments gamifiés.

### 1.2 Principes Directeurs

**Clarté avant tout.** Chaque écran doit être compréhensible en moins de 3 secondes. Les données financières (balance, APY, streak) sont hiérarchisées visuellement par taille et contraste. On ne sacrifie jamais la lisibilité pour l'esthétique.

**Progression visible.** Le concept central d'ORIA est le progrès — le jar qui se remplit, la barre de km, le streak qui grandit. Chaque élément de gamification doit avoir une représentation visuelle claire et animée. L'utilisateur doit *sentir* sa progression.

**Social sans friction.** Les interactions sociales (feed, leaderboard, challenges) doivent être légères et non intrusives. On montre l'activité des amis de manière positive (célébration des milestones) sans créer de pression négative.

**Mobile-first.** L'app est conçue pour le mobile (cible 390–420px). Le desktop est une vue centrée qui simule un viewport mobile. Les touch targets font minimum 44px, les espacements sont généreux.

---

## 2. Typographie

### 2.1 Police Principale

**Inter** est la police unique de l'application, utilisée pour tous les contextes (titres, corps, labels, données). Inter offre une excellente lisibilité sur écran, un large éventail de graisses, et un support natif des chiffres tabulaires — essentiel pour une app financière.

Import Google Fonts :

```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap
```

### 2.2 Échelle Typographique

L'échelle utilise un ratio de 1.25 (major third) à partir d'une base de 14px, avec des ajustements pour les cas spécifiques.

| Token | Taille | Graisse | Line-height | Letter-spacing | Usage |
|-------|--------|---------|-------------|----------------|-------|
| `display-xl` | 44px | 800 | 1.08 | -0.03em | Balance totale (wallet) |
| `display-lg` | 36px | 800 | 1.1 | -0.025em | Streak count hero |
| `heading-lg` | 24px | 700 | 1.2 | -0.02em | Titres de page (Dashboard, Wallet…) |
| `heading-md` | 18px | 700 | 1.3 | -0.015em | Titres de carte |
| `heading-sm` | 16px | 600 | 1.3 | -0.01em | Sous-titres, noms dans le leaderboard |
| `body-lg` | 16px | 400 | 1.6 | 0 | Descriptions, textes longs |
| `body-md` | 14px | 400 | 1.5 | 0 | Texte par défaut, feed items |
| `body-sm` | 13px | 400 | 1.5 | 0 | Texte secondaire, timestamps |
| `caption` | 12px | 500 | 1.4 | 0 | Labels, tags, métadonnées |
| `mono-lg` | 22px | 700 | 1.2 | -0.01em | Montants financiers (balance, APY) |
| `mono-md` | 14px | 600 | 1.3 | 0.02em | Données numériques, streak badges |
| `mono-sm` | 12px | 500 | 1.3 | 0.02em | Formules, codes, identifiants |
| `overline` | 11px | 600 | 1.4 | 0.1em | Labels de section (uppercase) |

### 2.3 Chiffres Tabulaires

Pour toutes les données financières (balance, APY, montants de transaction), activer les chiffres tabulaires d'Inter afin que les colonnes de chiffres s'alignent correctement :

```css
.financial-data {
  font-variant-numeric: tabular-nums;
}
```

### 2.4 Règles Typographiques

Les titres de page utilisent `heading-lg` et sont toujours en minuscules avec majuscule initiale (title case). Les montants financiers utilisent toujours `mono-lg` ou `mono-md` avec `tabular-nums` activé. Les pourcentages (APY) sont toujours affichés avec 2 décimales (ex: 7.24%, pas 7.2%). Les labels de section utilisent `overline` en uppercase avec un letter-spacing élargi. Le texte du body ne dépasse jamais 65 caractères par ligne pour le confort de lecture.

---

## 3. Couleurs

### 3.1 Palette Principale

La palette est construite autour d'un axe violet/lavande (identité ORIA) complété par des gris neutres pour le texte et les surfaces, et des couleurs sémantiques pour le feedback.

#### Violet — Brand

| Token | Hex | Usage |
|-------|-----|-------|
| `purple-700` | `#6d28d9` | Hover états actifs, bordures focus |
| `purple-600` | `#7c3aed` | **Couleur principale** — boutons, accents, liens, icônes actives |
| `purple-500` | `#8b5cf6` | Icônes secondaires, texte accent léger |
| `purple-400` | `#a78bfa` | Gradient secondaire, tags, badges |
| `purple-300` | `#c4b5fd` | Bordures subtiles, indicateurs inactifs |
| `purple-200` | `#ddd6fe` | Backgrounds de badges, icône containers |
| `purple-100` | `#ede9fe` | Surfaces légères (barres vides, backgrounds de section) |
| `purple-50` | `#f5f3ff` | Background très léger, hover sur cartes |

#### Surfaces & Neutres

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#faf9ff` | Background principal de l'app |
| `bg-card` | `rgba(255,255,255,0.85)` | Cards avec glassmorphism |
| `bg-card-hover` | `rgba(255,255,255,0.95)` | Cards au hover |
| `bg-elevated` | `#ffffff` | Modales, bottom sheets |
| `bg-section` | `rgba(237,233,254,0.3)` | Sections alternées |
| `border-default` | `rgba(196,181,253,0.2)` | Bordures de cartes |
| `border-subtle` | `rgba(196,181,253,0.1)` | Séparateurs internes |
| `border-focus` | `#7c3aed` | Bordure d'input au focus |

#### Texte

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#1e1b4b` | Titres, texte principal (indigo très foncé) |
| `text-secondary` | `#6b7280` | Texte de description, labels |
| `text-muted` | `#9ca3af` | Timestamps, placeholders, texte désactivé |
| `text-on-purple` | `#ffffff` | Texte sur fond violet (boutons, badges actifs) |

#### Sémantiques

| Token | Hex | Usage |
|-------|-----|-------|
| `success-500` | `#10b981` | Yield positif, goal atteint, statut actif |
| `success-100` | `#dcfce7` | Background tag "Active", dot semaine réussie |
| `error-500` | `#ef4444` | Streak perdu, goal manqué, erreur |
| `error-100` | `#fee2e2` | Background dot semaine ratée |
| `warning-500` | `#f59e0b` | Avertissements, streak en danger |
| `warning-100` | `#fef9c3` | Background tag "Mocked" dans la doc |

### 3.2 Gradients

Trois gradients principaux utilisés dans l'interface :

Le **gradient brand** (`linear-gradient(135deg, #7c3aed, #a78bfa)`) est appliqué aux boutons principaux, badges de streak, avatars highlight et barres APY remplies.

Le **gradient surface** (`linear-gradient(135deg, rgba(237,233,254,0.8), rgba(221,214,254,0.5))`) est utilisé pour les cartes hero (streak, balance totale) et le bloc CTA de la landing.

Le **gradient jar** (`linear-gradient(to top, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)`) remplit l'intérieur du jar SVG, du plus foncé en bas au plus clair en haut, simulant un liquide.

### 3.3 Effets de Fond

L'arrière-plan de l'app utilise des blobs de gradient diffus (via `radial-gradient` + `filter: blur(30-50px)`) positionnés en fixed. Ces blobs sont en `purple-300` à `purple-200` avec une opacité de 15-30%. Ils donnent de la profondeur à l'interface sans distraire du contenu. Les blobs ne doivent jamais se superposer directement au contenu lisible.

---

## 4. Espacements

### 4.1 Système de Spacing

L'échelle de spacing est basée sur un multiple de 4px :

| Token | Valeur | Usage typique |
|-------|--------|---------------|
| `space-1` | 4px | Micro-espacement (entre icône et texte inline) |
| `space-2` | 8px | Gap entre éléments très proches (dots de semaine) |
| `space-3` | 12px | Padding interne de tags, gap grille compacte |
| `space-4` | 16px | Padding de carte standard, gap entre éléments |
| `space-5` | 20px | Padding latéral de page |
| `space-6` | 24px | Padding de carte large, gap entre sections |
| `space-8` | 32px | Séparation entre groupes de cartes |
| `space-10` | 40px | Padding vertical de section |
| `space-16` | 64px | Séparation majeure entre blocs de landing |

### 4.2 Layout

Le viewport cible est **390–420px** de large. Le contenu a un padding latéral de `space-5` (20px). Les cartes ont un padding interne de `space-4` à `space-6` (16–24px). Le gap entre les cartes est de `space-4` (16px). La grille 2 colonnes (stats rapides) utilise un gap de `space-3` (12px).

---

## 5. Composants

### 5.1 Cards

Les cartes sont le conteneur principal de l'interface. Elles utilisent un fond semi-transparent avec glassmorphism léger.

Les propriétés par défaut sont : `background: rgba(255,255,255,0.85)`, `border-radius: 20px`, `border: 1px solid rgba(196,181,253,0.2)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 2px 12px rgba(0,0,0,0.03)`, `padding: 20px`.

Au hover (quand cliquable) : `background: rgba(255,255,255,0.95)`, `border-color: rgba(167,139,250,0.3)`, `box-shadow: 0 12px 40px rgba(124,58,237,0.1)`, `transform: translateY(-4px)`.

La variante **hero card** (streak, balance) utilise le gradient surface comme fond avec un overflow hidden et un blob décoratif en position absolute.

### 5.2 Boutons

#### Primaire
Fond en gradient brand, texte blanc, `border-radius: 14px`, `padding: 13px 34px`, `box-shadow: 0 4px 20px rgba(124,58,237,0.3)`. Au hover : `transform: translateY(-2px)` et ombre intensifiée. Police : Inter 16px / 600.

#### Secondaire
Fond `rgba(255,255,255,0.6)`, bordure `rgba(196,181,253,0.4)`, texte `text-secondary`. Au hover : bordure et texte passent en violet. Police : Inter 16px / 500.

#### Ghost / Dashed
Pour les actions de création (ex: "+ Create Challenge") : bordure `2px dashed rgba(167,139,250,0.35)`, fond `rgba(237,233,254,0.3)`, texte violet. Police : Inter 15px / 600.

#### Taille minimum
Tous les boutons respectent un touch target minimum de 44px de hauteur.

### 5.3 Avatars

Cercle avec initiales, gradient lavande. Deux variantes.

La variante **default** utilise `background: linear-gradient(135deg, #ddd6fe, #c4b5fd)`, texte en `purple-600`, sans ombre. La variante **highlight** (utilisateur courant) utilise le gradient brand, texte blanc, avec `box-shadow: 0 2px 12px rgba(124,58,237,0.25)`.

Tailles : 28px (empilé dans challenges), 32px (feed items), 34px (leaderboard), 36px (feed étendu).

### 5.4 Badges & Tags

Les badges de streak utilisent le gradient brand en fond, 52px de diamètre en cercle, texte blanc gras. Les tags de statut (Active, Mocked) sont en `border-radius: 20px`, padding `6px 14px`, fond sémantique (`success-100` pour Active, `warning-100` pour Mocked), texte en couleur sémantique correspondante. Les compteurs (ex: "4/6" dans challenges) utilisent `border-radius: 8px`, fond `purple-100`, texte `purple-600`, police mono.

### 5.5 Progress Bars

La barre vide a une hauteur de 8px, `border-radius: 4px`, fond `purple-100`. La barre remplie utilise le gradient brand horizontal (`linear-gradient(90deg, #7c3aed, #a78bfa)`), même border-radius. La transition est `width 1s ease`. La barre doit toujours être accompagnée d'un label textuel (pourcentage ou valeur numérique).

### 5.6 Week Dots

Les 7 jours de la semaine sont représentés par des cercles de 28px disposés horizontalement avec un gap de 6px. Les trois états sont : **complété** (gradient brand, texte blanc "✓", box-shadow violet), **manqué** (fond `error-100`, texte `error-500` "✗"), et **à venir** (fond `purple-100`, bordure `2px dashed`, texte muted "·"). Sous chaque dot, un label du jour en mono 10px.

### 5.7 Progress Ring

Cercle SVG de 64–80px, stroke de 5–6px. Le track vide est en `purple-100`, le fill utilise `purple-600` avec `stroke-linecap: round`. L'animation utilise `stroke-dashoffset` avec une courbe `cubic-bezier(0.34, 1.56, 0.64, 1)` pour un effet de rebond. Le contenu central (pourcentage, icône) est positionné en absolute au centre.

### 5.8 Savings Jar (SVG)

Le jar est l'élément central de l'identité visuelle. C'est un SVG en forme de bocal avec un liquide animé à l'intérieur.

Le contour du jar utilise un fill très léger (`rgba(124,58,237,0.06)`) avec un stroke subtil (`rgba(124,58,237,0.15)`). Le liquide utilise le gradient jar (foncé en bas, clair en haut) avec un clip-path sur la forme du bocal. Une ellipse semi-transparente en haut du liquide simule la surface. Un reflet blanc vertical sur le côté gauche simule le verre. Le couvercle est un rectangle arrondi en `rgba(124,58,237,0.2)`.

Les animations utilisent `transition: 1.5–1.8s cubic-bezier(0.34, 1.56, 0.64, 1)` pour un remplissage fluide avec léger rebond.

Tailles : 240×320 pour le hero (landing/dashboard), 100×140 pour le mini jar dans les cartes.

### 5.9 Navigation

#### Tab Bar (Bottom)
Fixée en bas, 5 items max, fond `rgba(255,255,255,0.9)` avec `backdrop-filter: blur(20px)`, séparée par une bordure top subtile. Chaque item a une icône emoji (20px), un label en Inter 11px, et un dot indicateur violet (4px) quand actif. L'item actif a l'icône sans filtre et le label en `purple-600` / 600.

#### Header (Top)
Sticky, fond frosted glass (`rgba(250,249,255,0.8)` + blur), contient le logo Oria (icône 30px + texte 20px), la cloche de notification (avec dot rouge si notifications), et l'avatar utilisateur.

### 5.10 Inputs

Les champs de texte utilisent `border-radius: 12px`, `border: 1px solid rgba(196,181,253,0.4)`, `background: rgba(255,255,255,0.8)`, `padding: 13px 20px`, Inter 15px. Au focus : `border-color: #7c3aed`, pas d'outline par défaut (le changement de bordure suffit). Le placeholder est en `text-muted`.

---

## 6. Animations & Micro-interactions

### 6.1 Principes

Les animations servent la compréhension (montrer le progrès) et le plaisir (récompenser l'action). Elles ne doivent jamais bloquer l'interaction ni ralentir la perception de performance. Toute animation dépasse rarement 500ms sauf les remplissages de jar (1.5–1.8s pour l'effet dramatique).

### 6.2 Courbes d'Easing

La courbe **standard** (`cubic-bezier(0.16, 1, 0.3, 1)`) est utilisée pour les entrées d'éléments (fade-in, slide-up). C'est un ease-out prononcé qui donne une sensation de fluidité. La courbe **bounce** (`cubic-bezier(0.34, 1.56, 0.64, 1)`) est réservée aux éléments de gamification : remplissage du jar, progression des barres APY, progress ring. Le léger overshoot renforce la satisfaction. La courbe **simple** (`ease 0.2–0.3s`) est pour les micro-interactions : hover sur boutons, changement de couleur, scale.

### 6.3 Animations Récurrentes

Le **scroll-reveal** fait apparaître les cartes et sections avec `opacity: 0 → 1` et `translateY(24px) → 0` via IntersectionObserver, durée 500ms, delay échelonné de 100–150ms entre éléments. Le **button lift** applique `translateY(-2px)` au hover avec intensification de l'ombre. Le **pulse** est un keyframe `opacity: 1 → 0.5 → 1` sur 2s en boucle, utilisé pour le dot "live" du testnet. Le **jar fill** anime `y` et `height` du rect SVG en 1.8s avec la courbe bounce.

### 6.4 Transitions de Tab

Le changement de tab dans l'app n'utilise pas de transition de slide (trop lourd pour un MVP). Le contenu change instantanément. Le seul indicateur animé est le dot sous l'onglet actif.

---

## 7. Iconographie

### 7.1 Style

Le MVP utilise des **emoji natifs** comme icônes pour gagner du temps de développement. Cela donne aussi un ton accessible et friendly qui correspond à la cible.

### 7.2 Mapping

| Contexte | Emoji | Usage |
|----------|-------|-------|
| App icon / Logo | 🚀 | Nav bar, favicon |
| Streak | 🔥 | Badge de streak, labels APY |
| Home | 🏠 | Tab bar |
| Social | 👥 | Tab bar |
| Challenges | 🏆 | Tab bar, milestone |
| Wallet | 💰 | Tab bar, événement dépôt |
| Jar | 🏺 | Feature card |
| Goal met | 🏃 | Feed event course |
| Challenge joined | 🤝 | Feed event, feature card |
| Activity tracking | 📊 | Feature card |
| Target | 🎯 | Feature card milestone |
| Chain | ⛓️ | Feature card non-custodial |
| Notification | 🔔 | Header |
| Leaderboard | 🥇🥈🥉 | Rangs 1, 2, 3 |
| Yield | ✦ | Transaction history |

### 7.3 Post-MVP

En post-hackathon, les emojis seront remplacés par un set d'icônes custom en **stroke style** (lineweight 1.5px, rounded caps), en `purple-600` sur fond `purple-100`. Lucide React est la librairie recommandée pour la transition.

---

## 8. Responsive & Adaptations

### 8.1 Breakpoints

| Nom | Largeur | Comportement |
|-----|---------|-------------|
| Mobile | < 480px | Layout natif, 1 colonne |
| Tablet | 480–768px | Conteneur centré 420px, marges auto |
| Desktop | > 768px | Conteneur centré 420px, ombre latérale, bordures |

### 8.2 Landing Page

La landing page a un comportement différent : elle utilise un max-width de 1080px et passe en layout multi-colonnes (grille 3 colonnes pour les features, flex row pour le hero) au-dessus de 768px. En dessous, tout empile verticalement.

### 8.3 Gestion du Safe Area

Sur mobile (PWA), prévoir un padding-bottom supplémentaire de `env(safe-area-inset-bottom)` pour la tab bar afin de ne pas être masquée par la barre de navigation iOS.

---

## 9. Accessibility

### 9.1 Contrastes

Tous les textes respectent le ratio WCAG AA minimum (4.5:1 pour le body, 3:1 pour le texte large). Le texte `text-primary` (#1e1b4b) sur `bg-primary` (#faf9ff) donne un ratio de 14.2:1. Le texte `text-secondary` (#6b7280) sur blanc donne un ratio de 5.0:1. Le texte blanc sur `purple-600` (#7c3aed) donne un ratio de 4.6:1.

### 9.2 Touch Targets

Tous les éléments interactifs (boutons, onglets, liens, dots) ont une zone de tap minimum de 44×44px conformément aux guidelines Apple HIG et Material Design.

### 9.3 États Visibles

Chaque élément interactif a un état focus visible (bordure ou outline violet) pour la navigation clavier. Les changements de couleur ne sont jamais le seul indicateur d'un état — on utilise aussi des icônes (✓, ✗), des labels textuels et des changements de forme.

---

## 10. Tokens CSS

Résumé des variables CSS à implémenter pour assurer la cohérence :

```css
:root {
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Colors — Brand */
  --purple-50: #f5f3ff;
  --purple-100: #ede9fe;
  --purple-200: #ddd6fe;
  --purple-300: #c4b5fd;
  --purple-400: #a78bfa;
  --purple-500: #8b5cf6;
  --purple-600: #7c3aed;
  --purple-700: #6d28d9;

  /* Colors — Surfaces */
  --bg-primary: #faf9ff;
  --bg-card: rgba(255, 255, 255, 0.85);
  --bg-card-hover: rgba(255, 255, 255, 0.95);
  --bg-elevated: #ffffff;
  --bg-section: rgba(237, 233, 254, 0.3);

  /* Colors — Text */
  --text-primary: #1e1b4b;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --text-on-purple: #ffffff;

  /* Colors — Borders */
  --border-default: rgba(196, 181, 253, 0.2);
  --border-subtle: rgba(196, 181, 253, 0.1);
  --border-focus: #7c3aed;

  /* Colors — Semantic */
  --success-500: #10b981;
  --success-100: #dcfce7;
  --error-500: #ef4444;
  --error-100: #fee2e2;
  --warning-500: #f59e0b;
  --warning-100: #fef9c3;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #7c3aed, #a78bfa);
  --gradient-surface: linear-gradient(135deg, rgba(237,233,254,0.8), rgba(221,214,254,0.5));
  --gradient-jar: linear-gradient(to top, #7c3aed, #a78bfa, #c4b5fd);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-16: 64px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.03);
  --shadow-card-hover: 0 12px 40px rgba(124, 58, 237, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-button: 0 4px 20px rgba(124, 58, 237, 0.3);
  --shadow-button-hover: 0 8px 28px rgba(124, 58, 237, 0.4);
  --shadow-avatar: 0 2px 12px rgba(124, 58, 237, 0.25);

  /* Easing */
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-reveal: 0.5s var(--ease-standard);
  --transition-fill: 1.5s var(--ease-bounce);
}
```

---

## 11. Structure des Écrans

### 11.1 Arborescence

```
App
├── Onboarding
│   ├── Welcome (logo + tagline)
│   ├── Connect Wallet (Privy)
│   ├── Choose Goal (type + target km)
│   └── Fund Wallet (deposit USDC/AVAX)
│
├── Dashboard (Home tab)
│   ├── Streak Hero Card (jar + streak + APY + week dots)
│   ├── Weekly Progress (bar + km counter)
│   ├── Quick Stats (balance + current APY)
│   ├── APY Progression (mini bar chart)
│   └── Friends Activity Preview (3 items + "see all")
│
├── Social (Friends tab)
│   ├── Friends Leaderboard (ranked by streak)
│   └── Activity Feed (all friends events)
│
├── Challenges (Challenges tab)
│   ├── Create Challenge (CTA)
│   └── Active Challenges (cards with progress)
│
├── Wallet (Wallet tab)
│   ├── Balance Card (total + earned + actions)
│   ├── Earning Status (Morpho info + stats)
│   └── Transaction History (deposits + yield)
│
└── Settings (future)
    ├── Profile (name, avatar, goal)
    ├── Connected Apps (Strava, Apple Health)
    └── Wallet Management
```

### 11.2 Navigation

La navigation principale est une tab bar fixée en bas avec 4 onglets : Home, Social, Challenges, Wallet. Le header top est sticky et contient le logo, les notifications et l'avatar. Il n'y a pas de navigation par drawer ou hamburger — tout est accessible en 1 tap depuis la tab bar.

---

## 12. Assets & Ressources

### 12.1 Logo

Le logo ORIA est composé d'une icône (emoji 🚀 dans un carré arrondi gradient brand) et du texte "Oria" en Inter 800. En post-hackathon, l'icône sera remplacée par l'astronaute du pitch deck vectorisé en SVG.

### 12.2 Illustrations

Le MVP n'utilise pas d'illustrations custom. Le jar SVG est le seul élément graphique produit. Les emojis servent d'icônes. En post-hackathon, prévoir des illustrations onboarding (astronaute + jar, amis qui courent ensemble, graphique de croissance) en style flat/line art avec la palette lavande.

### 12.3 Favicon & PWA

Le favicon utilise un carré arrondi 512×512 avec le gradient brand et le texte "O" en blanc. Le manifest PWA définit `theme_color: #7c3aed` et `background_color: #faf9ff`.

---

*— Fin du document —*
