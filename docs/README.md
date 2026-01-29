# Documentation du Projet

Bienvenue dans la documentation du template Angular Clean Architecture + CQRS.

## Guides disponibles

### 1. [Angular pour les Développeurs Backend](./01-angular-basics-for-backend-devs.md)

Si tu viens du backend et que tu découvres Angular, commence par ce guide.

**Tu apprendras :**
- Les analogies Backend ↔ Angular (Controller = Component, etc.)
- Les Components et leur structure
- Les Services et l'injection de dépendances
- Les Signals (réactivité)
- Les Observables et RxJS
- Le Routing
- Les Formulaires
- Les Interceptors (comme les middlewares)
- Les Guards (protection des routes)

---

### 2. [Guide d'Architecture : Clean Architecture + CQRS](./02-architecture-guide.md)

Comprendre l'architecture de ce projet en profondeur.

**Tu apprendras :**
- Les 4 couches (Domain, Infrastructure, Application, Presentation)
- Le pattern CQRS (Commands vs Queries)
- Comment les données circulent dans l'application
- Analyse détaillée du système de Login
- Les règles d'or à respecter

---

### 3. [Tutoriel CRUD : Gestion de Produits](./03-crud-tutorial.md)

Un tutoriel pas à pas pour créer un module CRUD complet.

**Tu apprendras :**
- Créer les interfaces Domain
- Créer le Store avec Signals
- Créer les Commands et Queries
- Créer le Service façade
- Créer les Components UI
- Configurer les routes
- Simuler une API (Mock)

---

## Parcours recommandé

```
┌─────────────────────────────────────────────────────────────┐
│                    PARCOURS D'APPRENTISSAGE                  │
└─────────────────────────────────────────────────────────────┘

Étape 1: Nouveau en Angular ?
         │
         └──▶ Lire 01-angular-basics-for-backend-devs.md
              (Comprendre les concepts de base)

Étape 2: Comprendre l'architecture
         │
         └──▶ Lire 02-architecture-guide.md
              (Comprendre Clean Architecture + CQRS)

Étape 3: Pratiquer
         │
         └──▶ Suivre 03-crud-tutorial.md
              (Créer ton premier module CRUD)

Étape 4: Appliquer
         │
         └──▶ Créer tes propres modules
              (Users, Orders, etc.)
```

---

## Structure du projet

```
src/app/
├── domain/           # 🔵 Interfaces et types métier
├── infrastructure/   # 🟢 Technique (Store, HTTP, Guards)
├── application/      # 🟡 Logique métier (Commands, Queries, Services)
├── presentation/     # 🔴 UI (Components, Pages, Layouts)
└── core/             # ⚪ Configuration et utilitaires
```

---

## Commandes utiles

```bash
# Démarrer le projet
npm run dev

# Créer un composant
ng generate component presentation/pages/mon-composant

# Créer un service
ng generate service infrastructure/services/mon-service

# Build production
npm run build:prod
```

---

## Besoin d'aide ?

- Consulte les fichiers existants comme exemples
- Le code du Login est un bon exemple à étudier
- Le tutoriel CRUD montre le pattern complet

Bonne lecture ! 📚
