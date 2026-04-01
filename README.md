# 🕯️ Shad's Candle — Frontend

Application e-commerce de bougies artisanales, réalisée dans le cadre d'un projet de titre professionnel (CDA). Le frontend consomme une API REST Django pour afficher, filtrer et commander des produits.

🔗 **Démo live** : [cda-frontend-eta.vercel.app](https://cda-frontend-eta.vercel.app)

---

## 🧱 Stack technique

| Technologie                                   | Rôle                         |
| --------------------------------------------- | ---------------------------- |
| [Next.js 16](https://nextjs.org/)             | Framework React (App Router) |
| [React 19](https://react.dev/)                | UI                           |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique              |
| [Tailwind CSS 4](https://tailwindcss.com/)    | Styling                      |
| [Swiper](https://swiperjs.com/)               | Carrousel produits           |
| [Axios](https://axios-http.com/)              | Requêtes HTTP                |
| [ESLint](https://eslint.org/)                 | Linting                      |
| [Vercel](https://vercel.com/)                 | Déploiement                  |

---

## 🔗 Repos liés

- **Backend (Django REST Framework)** : [github.com/ShayyNwE/CDA-backend](https://github.com/ShayyNwE/CDA-backend)

---

## 🚀 Lancer le projet en local

### Prérequis

- Node.js 20+
- Le backend Django lancé sur `http://127.0.0.1:8000`

### Installation

```bash
git clone https://github.com/matteolvt/cda-frontend.git
cd cda-frontend
npm install
npm run dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Structure du projet

```
src/
├── app/                  # Pages (App Router Next.js)
│   ├── page.tsx          # Homepage
│   ├── produits/         # Catalogue & fiche produit
│   ├── panier/           # Panier
│   └── a-propos/         # Page À propos
├── components/
│   ├── Global/           # Navbar, Footer, Réassurance
│   ├── Homepage/         # Sections homepage
│   └── Product/          # ProductCard
```

---

## ⚙️ CI/CD

Pipeline GitHub Actions sur les branches `main` et `preprod` :

- **Lint** — ESLint
- **Type check** — TypeScript (`tsc --noEmit`)
- **Build** — `next build`

Le déploiement est géré automatiquement par **Vercel** à chaque merge.

---

## 👥 Auteurs

- [@matteolvt](https://github.com/matteolvt)
- [@ShayyNwE](https://github.com/ShayyNwE)
