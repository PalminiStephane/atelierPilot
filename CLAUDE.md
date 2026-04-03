# AtelierPilot — Guide d'usinage

## Description
Application web responsive pour atelier d'usinage (tours et fraiseuses conventionnelles).
Outil de calcul déployé en statique sur VPS OVH avec Apache.

## Stack technique
- Vite + React 18 + TypeScript
- Tailwind CSS 3 (via @tailwindcss/vite)
- Framer Motion (animations, gestes swipe)
- SVG natif pour dessins de pièces
- LocalStorage pour sauvegarde projets
- PWA avec service worker (hors ligne)
- Build statique : `npm run build` → `dist/`

## Commandes
- `npm run dev` — Serveur de développement
- `npm run build` — Build production
- `npm run preview` — Preview du build
- `npm test` — Tests Vitest

## Architecture
- `src/utils/calculations.ts` — Fonctions de calcul pures (JAMAIS de logique de rendu)
- `src/utils/constants.ts` — Matériaux, filetages ISO, plateaux diviseur
- `src/utils/storage.ts` — Helpers localStorage
- `src/components/ui/` — Composants UI réutilisables
- `src/components/layout/` — Header, BottomNav
- `src/components/modules/` — Modules métier (BoltCircle, CuttingSpeed, Threading, Tools, RectGrid, Projects)
- `src/hooks/` — Hooks personnalisés (useSwipe, useLocalStorage)
- `src/types/` — Types TypeScript partagés

## Conventions
- Code commenté en **français**
- Fonctions de calcul = **pure functions** dans calculations.ts
- Précision : 0.01mm minimum
- Validation de toutes les entrées (pas de négatif, pas de division par zéro)
- Mobile-first, responsive desktop
- Thème dark industriel, contraste WCAG AA minimum
- Boutons tactiles ≥ 48px, texte calcul ≥ 16px

## Modules
1. **Cercle de Perçage** (orange #FF6B00) — Formulaire, Tableau, Guidage swipe, Plan SVG
2. **Vitesses de Coupe** (bleu #4A90D9) — RPM, Vc, Avance, Tableau matériaux
3. **Taraudage & Filetage** (vert #22c55e) — Calculateur, Table ISO, Passes au tour
4. **Outils & Conversions** (jaune #f59e0b) — Conversions, Cônes, Triangle, Poids, Diviseur
5. **Grille Rectangulaire** (violet #a78bfa) — Formulaire, Serpentin, Guidage, Plan SVG
6. **Mes Projets** — Sauvegarde/chargement localStorage

## Suppression de fichiers
- Toujours utiliser `trash` au lieu de `rm` ou `rm -rf`
