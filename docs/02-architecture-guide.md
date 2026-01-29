# Guide d'Architecture : Clean Architecture + CQRS

Ce guide explique l'architecture de ce projet Angular et comment les différentes couches interagissent.

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Les 4 couches expliquées](#2-les-4-couches-expliquées)
3. [Flux de données complet](#3-flux-de-données-complet)
4. [Analyse du système de Login](#4-analyse-du-système-de-login)
5. [Règles d'or](#5-règles-dor)

---

## 1. Vue d'ensemble

### Qu'est-ce que Clean Architecture ?

C'est une architecture en **couches concentriques** où les dépendances vont toujours vers l'intérieur.

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  (Components, Pages, Templates)                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │                 APPLICATION                       │    │
│  │  (Commands, Queries, Services)                    │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │            INFRASTRUCTURE                │    │    │
│  │  │  (Stores, HTTP, Guards, Interceptors)    │    │    │
│  │  │  ┌─────────────────────────────────┐    │    │    │
│  │  │  │            DOMAIN               │    │    │    │
│  │  │  │  (Interfaces, Types, Enums)     │    │    │    │
│  │  │  │  (AUCUNE DÉPENDANCE)            │    │    │    │
│  │  │  └─────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Qu'est-ce que CQRS ?

**CQRS** = Command Query Responsibility Segregation

- **Command** = Écriture (modifier des données)
- **Query** = Lecture (récupérer des données)

On sépare les opérations de lecture et d'écriture dans des classes distinctes.

```
┌─────────────┐      ┌─────────────┐
│   COMMAND   │      │    QUERY    │
│  (Écriture) │      │  (Lecture)  │
├─────────────┤      ├─────────────┤
│ • Login     │      │ • GetUser   │
│ • Register  │      │ • GetUsers  │
│ • Create    │      │ • Search    │
│ • Update    │      │ • GetById   │
│ • Delete    │      │             │
└─────────────┘      └─────────────┘
```

**Analogie Backend** : C'est comme séparer les repositories en ReadRepository et WriteRepository.

---

## 2. Les 4 couches expliquées

### Structure des dossiers

```
src/app/
├── domain/              # 🔵 DOMAIN (centre)
├── infrastructure/      # 🟢 INFRASTRUCTURE
├── application/         # 🟡 APPLICATION
├── presentation/        # 🔴 PRESENTATION (extérieur)
└── core/                # ⚪ CORE (utilitaires)
```

---

### 🔵 DOMAIN - Le cœur métier

**Emplacement** : `src/app/domain/`

**Contenu** : Interfaces, types, enums - AUCUNE logique, AUCUNE dépendance.

**Analogie Backend** : Les entités/models et interfaces de repository.

```
domain/
├── common/
│   ├── api-response.interface.ts    # Format standard des réponses API
│   └── index.ts
├── users/
│   ├── user.interface.ts            # Interface User
│   ├── user-service.interface.ts    # Contrat du service User
│   └── index.ts
└── auth/
    ├── auth.interface.ts            # DTOs d'authentification
    ├── auth-service.interface.ts    # Contrat du service Auth
    └── index.ts
```

#### Exemple : user.interface.ts

```typescript
// src/app/domain/users/user.interface.ts

/**
 * Modèle User - représente un utilisateur dans le système.
 * C'est juste une INTERFACE, pas de logique.
 */
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

// DTO pour créer un user (Data Transfer Object)
export interface ICreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

#### Exemple : api-response.interface.ts

```typescript
// src/app/domain/common/api-response.interface.ts

/**
 * Format standard de réponse API.
 * Toutes les réponses du backend suivent ce format.
 */
export interface IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  pagination?: IPaginationInfo;
}

export interface IPaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

---

### 🟢 INFRASTRUCTURE - L'implémentation technique

**Emplacement** : `src/app/infrastructure/`

**Contenu** : Tout ce qui est "technique" - HTTP, stockage, configuration.

**Analogie Backend** : Repositories, configuration DB, clients HTTP.

```
infrastructure/
├── api/
│   ├── routes/
│   │   ├── base.routes.ts       # URL de base de l'API
│   │   ├── auth.routes.ts       # Routes auth (/auth/login, etc.)
│   │   └── user.routes.ts       # Routes users (/users, etc.)
│   └── api.routes.ts            # Agrégateur de toutes les routes
├── http/
│   └── http.service.ts          # Wrapper HttpClient
├── interceptors/
│   ├── auth.interceptor.ts      # Ajoute le token aux requêtes
│   └── error.interceptor.ts     # Gère les erreurs HTTP
├── stores/
│   └── auth.store.ts            # État d'authentification (Signals)
└── guards/
    ├── auth.guard.ts            # Protège les routes authentifiées
    └── role.guard.ts            # Protège les routes par rôle
```

#### Exemple : auth.store.ts (Store avec Signals)

```typescript
// src/app/infrastructure/stores/auth.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { IUser } from '@domain/users';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // ═══════════════════════════════════════════════════════════════
  // ÉTAT PRIVÉ (Signals modifiables uniquement ici)
  // ═══════════════════════════════════════════════════════════════

  private readonly _user = signal<IUser | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // ÉTAT PUBLIC (Signals en lecture seule)
  // ═══════════════════════════════════════════════════════════════

  readonly user = this._user.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // ═══════════════════════════════════════════════════════════════
  // SIGNAUX DÉRIVÉS (Computed - recalculés automatiquement)
  // ═══════════════════════════════════════════════════════════════

  readonly isAuthenticated = computed(() => {
    return !!this._accessToken() && !!this._user();
  });

  readonly userRoles = computed(() => {
    return this._user()?.roles ?? [];
  });

  // ═══════════════════════════════════════════════════════════════
  // MUTATIONS (méthodes pour modifier l'état)
  // ═══════════════════════════════════════════════════════════════

  setAuth(user: IUser, accessToken: string): void {
    this._user.set(user);
    this._accessToken.set(accessToken);
    this._error.set(null);
    localStorage.setItem('access_token', accessToken);
  }

  clearAuth(): void {
    this._user.set(null);
    this._accessToken.set(null);
    localStorage.removeItem('access_token');
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }
}
```

#### Exemple : api.routes.ts

```typescript
// src/app/infrastructure/api/api.routes.ts
import { environment } from '@env';

// Créer une URL complète
const createApiUrl = (path: string) => `${environment.apiUrl}${path}`;

export const apiRoutes = {
  auth: {
    login: () => createApiUrl('/auth/login'),
    register: () => createApiUrl('/auth/register'),
    logout: () => createApiUrl('/auth/logout'),
  },
  users: {
    getAll: () => createApiUrl('/users'),
    getById: (id: string) => createApiUrl(`/users/${id}`),
    create: () => createApiUrl('/users'),
    update: (id: string) => createApiUrl(`/users/${id}`),
    delete: (id: string) => createApiUrl(`/users/${id}`),
  }
};
```

---

### 🟡 APPLICATION - La logique métier

**Emplacement** : `src/app/application/`

**Contenu** : Commands (écriture), Queries (lecture), Services façades.

**Analogie Backend** : Use Cases, Application Services, Handlers.

```
application/
├── commands/
│   └── auth/
│       ├── login.command.ts       # Logique de login
│       ├── register.command.ts    # Logique d'inscription
│       ├── logout.command.ts      # Logique de déconnexion
│       └── index.ts
├── queries/
│   └── users/
│       ├── get-current-user.query.ts
│       ├── get-users.query.ts
│       └── index.ts
└── services/
    ├── auth.service.ts            # Façade pour l'authentification
    └── index.ts
```

#### Exemple : login.command.ts

```typescript
// src/app/application/commands/auth/login.command.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';

import { ILoginCredentials, IAuthResponse } from '@domain/auth';
import { IApiResponse } from '@domain/common';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * COMMAND : Login
 * Responsabilité : Authentifier un utilisateur
 *
 * Un Command modifie l'état (écriture).
 */
@Injectable({ providedIn: 'root' })
export class LoginCommand {
  // Injection des dépendances
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  /**
   * Exécuter la commande de login.
   *
   * @param credentials - Email et mot de passe
   * @param redirectUrl - URL de redirection après login (optionnel)
   */
  execute(
    credentials: ILoginCredentials,
    redirectUrl?: string
  ): Observable<IApiResponse<IAuthResponse>> {

    // 1. Mettre à jour l'état (loading)
    this.authStore.setLoading(true);
    this.authStore.setError(null);

    // 2. Faire l'appel HTTP
    return this.http
      .post<IApiResponse<IAuthResponse>>(
        apiRoutes.auth.login(),
        credentials
      )
      .pipe(
        // 3. En cas de succès
        tap((response) => {
          if (response.status === 'success' && response.data) {
            // Mettre à jour le store
            this.authStore.setAuth(
              response.data.user,
              response.data.accessToken
            );
            // Rediriger
            this.router.navigate([redirectUrl || '/dashboard']);
          }
        }),

        // 4. En cas d'erreur
        catchError((error) => {
          this.authStore.setError(error.message || 'Login failed');
          return throwError(() => error);
        }),

        // 5. Dans tous les cas (succès ou erreur)
        finalize(() => {
          this.authStore.setLoading(false);
        })
      );
  }
}
```

#### Exemple : get-users.query.ts

```typescript
// src/app/application/queries/users/get-users.query.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '@domain/users';
import { IApiResponse, IPaginationParams } from '@domain/common';
import { apiRoutes } from '@infrastructure/api/api.routes';

/**
 * QUERY : GetUsers
 * Responsabilité : Récupérer la liste des utilisateurs
 *
 * Une Query ne modifie pas l'état (lecture seule).
 */
@Injectable({ providedIn: 'root' })
export class GetUsersQuery {
  private readonly http = inject(HttpClient);

  /**
   * Exécuter la query.
   *
   * @param params - Paramètres de pagination
   */
  execute(params?: IPaginationParams): Observable<IApiResponse<IUser[]>> {
    let httpParams = new HttpParams();

    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<IApiResponse<IUser[]>>(
      apiRoutes.users.getAll(),
      { params: httpParams }
    );
  }
}
```

#### Exemple : auth.service.ts (Façade)

```typescript
// src/app/application/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ILoginCredentials, IRegisterDto } from '@domain/auth';
import { AuthStore } from '@infrastructure/stores/auth.store';
import { LoginCommand } from '@application/commands/auth/login.command';
import { LogoutCommand } from '@application/commands/auth/logout.command';
import { RegisterCommand } from '@application/commands/auth/register.command';

/**
 * SERVICE FAÇADE : AuthService
 *
 * C'est la seule classe que les Components doivent utiliser.
 * Elle expose l'état (Signals) et les actions (Commands/Queries).
 *
 * Pourquoi une façade ?
 * - Simplifie l'interface pour les components
 * - Cache la complexité interne
 * - Point d'entrée unique
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Dépendances
  private readonly authStore = inject(AuthStore);
  private readonly loginCommand = inject(LoginCommand);
  private readonly logoutCommand = inject(LogoutCommand);
  private readonly registerCommand = inject(RegisterCommand);

  // ═══════════════════════════════════════════════════════════════
  // ÉTAT (exposé depuis le store)
  // ═══════════════════════════════════════════════════════════════

  readonly user = this.authStore.user;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly loading = this.authStore.loading;
  readonly error = this.authStore.error;
  readonly userRoles = this.authStore.userRoles;

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS (délèguent aux Commands)
  // ═══════════════════════════════════════════════════════════════

  login(credentials: ILoginCredentials, redirectUrl?: string) {
    return this.loginCommand.execute(credentials, redirectUrl);
  }

  logout() {
    return this.logoutCommand.execute();
  }

  register(data: IRegisterDto) {
    return this.registerCommand.execute(data);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  hasRole(role: string | string[]): boolean {
    return this.authStore.hasRole(role);
  }

  clearError(): void {
    this.authStore.setError(null);
  }
}
```

---

### 🔴 PRESENTATION - L'interface utilisateur

**Emplacement** : `src/app/presentation/`

**Contenu** : Components, Pages, Layouts.

**Analogie Backend** : Controllers + Vues.

```
presentation/
├── components/
│   └── shared/                    # Composants réutilisables
│       ├── loading-spinner/
│       └── error-message/
├── layouts/
│   ├── main-layout/               # Layout principal (navbar, footer)
│   └── auth-layout/               # Layout pour pages auth
└── pages/
    ├── auth/
    │   ├── login/
    │   │   └── login.component.ts
    │   └── register/
    │       └── register.component.ts
    └── home/
        ├── home.component.ts
        └── dashboard.component.ts
```

---

## 3. Flux de données complet

Voici comment les données circulent lors d'un login :

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FLUX DE LOGIN                                 │
└──────────────────────────────────────────────────────────────────────┘

1. USER ACTION
   ┌─────────────────┐
   │  LoginComponent │ ──── Clic sur "Sign in"
   └────────┬────────┘
            │
            ▼
2. SERVICE FAÇADE
   ┌─────────────────┐
   │   AuthService   │ ──── authService.login(credentials)
   └────────┬────────┘
            │
            ▼
3. COMMAND (CQRS)
   ┌─────────────────┐
   │  LoginCommand   │ ──── loginCommand.execute(credentials)
   └────────┬────────┘
            │
            ▼
4. HTTP REQUEST
   ┌─────────────────┐
   │   HttpClient    │ ──── POST /api/auth/login
   └────────┬────────┘
            │
            ▼
5. INTERCEPTOR
   ┌─────────────────┐
   │ AuthInterceptor │ ──── (Pas de token pour login)
   └────────┬────────┘
            │
            ▼
6. API BACKEND
   ┌─────────────────┐
   │  Backend API    │ ──── Traitement côté serveur
   └────────┬────────┘
            │
            ▼
7. RESPONSE
   ┌─────────────────┐
   │ { user, token } │ ──── Réponse JSON
   └────────┬────────┘
            │
            ▼
8. COMMAND (suite)
   ┌─────────────────┐
   │  LoginCommand   │ ──── authStore.setAuth(user, token)
   └────────┬────────┘
            │
            ▼
9. STORE UPDATE
   ┌─────────────────┐
   │    AuthStore    │ ──── _user.set(user)
   └────────┬────────┘      _accessToken.set(token)
            │
            ▼
10. SIGNAL NOTIFICATION
   ┌─────────────────┐
   │   Signal Change │ ──── Notifie tous les abonnés
   └────────┬────────┘
            │
            ▼
11. UI UPDATE
   ┌─────────────────┐
   │  LoginComponent │ ──── isAuthenticated() = true
   │  MainLayout     │      user() = { ... }
   │  Guards         │      → Redirection vers /dashboard
   └─────────────────┘
```

---

## 4. Analyse du système de Login

Regardons comment le login fonctionne étape par étape.

### Étape 1 : Le composant Login

```typescript
// src/app/presentation/pages/auth/login/login.component.ts

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <!-- Formulaire de login -->
    <form [formGroup]="form" (ngSubmit)="onSubmit()">

      <!-- Afficher l'erreur si présente -->
      @if (authService.error()) {
        <div class="error">{{ authService.error() }}</div>
      }

      <!-- Champs du formulaire -->
      <input formControlName="email" type="email" />
      <input formControlName="password" type="password" />

      <!-- Bouton avec état loading -->
      <button [disabled]="form.invalid || authService.loading()">
        @if (authService.loading()) {
          Signing in...
        } @else {
          Sign in
        }
      </button>
    </form>
  `
})
export class LoginComponent {
  // 1. Injecter les dépendances
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  // 2. Définir le formulaire
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // 3. Soumettre le formulaire
  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];

    // Appeler le service (qui appelle le Command)
    this.authService.login({ email, password }, returnUrl).subscribe();
  }
}
```

### Étape 2 : Le Service Façade

```typescript
// Le composant appelle: authService.login(credentials)

// AuthService délègue au LoginCommand
login(credentials: ILoginCredentials, redirectUrl?: string) {
  return this.loginCommand.execute(credentials, redirectUrl);
}
```

### Étape 3 : Le Command exécute la logique

```typescript
// LoginCommand.execute() :

// 1. Active le loading
this.authStore.setLoading(true);

// 2. Fait l'appel HTTP
this.http.post(apiRoutes.auth.login(), credentials).pipe(
  tap((response) => {
    // 3. Met à jour le store en cas de succès
    this.authStore.setAuth(response.data.user, response.data.accessToken);
    // 4. Redirige
    this.router.navigate(['/dashboard']);
  })
);
```

### Étape 4 : Le Store met à jour les Signals

```typescript
// AuthStore.setAuth() :

setAuth(user: IUser, accessToken: string): void {
  this._user.set(user);           // Signal mis à jour
  this._accessToken.set(accessToken);
  // → isAuthenticated() retourne maintenant true
}
```

### Étape 5 : L'UI se met à jour automatiquement

```html
<!-- Le template réagit aux changements de Signals -->

<!-- Avant: authService.loading() = true -->
<button disabled>Signing in...</button>

<!-- Après: authService.loading() = false, isAuthenticated = true -->
<!-- → Redirection automatique vers /dashboard -->
```

---

## 5. Règles d'or

### ✅ À FAIRE

```typescript
// 1. Components utilisent SEULEMENT les Services
export class MyComponent {
  private readonly authService = inject(AuthService);  // ✅

  login() {
    this.authService.login(credentials);  // ✅
  }
}

// 2. Services utilisent Commands/Queries
export class AuthService {
  login() {
    return this.loginCommand.execute();  // ✅
  }
}

// 3. Commands/Queries utilisent le Store et HTTP
export class LoginCommand {
  execute() {
    this.http.post(...).pipe(
      tap(() => this.authStore.setAuth(...))  // ✅
    );
  }
}

// 4. Imports avec path aliases
import { IUser } from '@domain/users';  // ✅
```

### ❌ À NE PAS FAIRE

```typescript
// 1. Component accède directement au Store
export class MyComponent {
  private readonly authStore = inject(AuthStore);  // ❌
  // Les components ne doivent pas manipuler le store directement
}

// 2. Component appelle directement un Command
export class MyComponent {
  private readonly loginCommand = inject(LoginCommand);  // ❌
  // Passer par le Service façade
}

// 3. Imports relatifs
import { IUser } from '../../../domain/users';  // ❌
// Utiliser @domain/users
```

### Récapitulatif des responsabilités

| Couche | Responsabilité | Accède à |
|--------|----------------|----------|
| **Domain** | Interfaces, Types | Rien |
| **Infrastructure** | Technique (HTTP, Store, Guards) | Domain |
| **Application** | Logique métier (Commands, Queries) | Domain, Infrastructure |
| **Presentation** | UI (Components) | Application (Services) |

---

## Fichier suivant

Continue avec [03-crud-tutorial.md](./03-crud-tutorial.md) pour un tutoriel pratique de création d'un CRUD complet.
