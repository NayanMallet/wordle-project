# Wordle Project

Un clone moderne et robuste du célèbre jeu Wordle, développé avec **Vue 3**, **Vite** et une architecture orientée domaine (**DDD**).

## 🚀 Technologies

- **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Style:** [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI:** [Radix Vue](https://www.radix-vue.com/) & [Lucide Icons](https://lucide.dev/)
- **Langage:** [TypeScript](https://www.typescriptlang.org/)
- **Tests:** [Vitest](https://vitest.dev/)
- **Gestionnaire de paquets:** [pnpm](https://pnpm.io/)

## 🛠️ Installation

Clonez le projet et installez les dépendances :

```bash
# Installation des dépendances
pnpm install
```

## 📖 Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le serveur de développement sur `http://localhost:5173` |
| `pnpm build` | Compile le projet pour la production |
| `pnpm test` | Exécute les tests unitaires avec Vitest |
| `pnpm preview` | Prévisualise la version de production localement |

## 🏗️ Architecture

Le projet suit les principes de la **Clean Architecture** / **DDD** pour assurer la maintenabilité et la testabilité du code :

- `src/domain/`: Logique métier pure (modèles, use cases, ports). Indépendant du framework.
- `src/infrastructure/`: Implémentations techniques (ex: accès aux dictionnaires de mots).
- `src/composables/`: Pont entre la logique métier et les composants Vue.
- `src/components/`: Composants d'interface utilisateur (SFC Vue).
- `src/lib/`: Utilitaires transverses.

## 🧪 Tests

La logique métier est couverte par des tests unitaires pour garantir la validité des règles du jeu (évaluation des essais, gestion de la partie).

```bash
pnpm test
```

---
