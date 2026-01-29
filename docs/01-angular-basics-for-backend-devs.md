# Angular pour les Développeurs Backend

Ce guide explique Angular en utilisant des analogies avec le développement backend (Node.js, Java, PHP, etc.).

## Table des matières

1. [Concepts fondamentaux](#1-concepts-fondamentaux)
2. [Le système de modules et d'injection](#2-le-système-de-modules-et-dinjection)
3. [Les Components (Composants)](#3-les-components-composants)
4. [Les Services et l'injection de dépendances](#4-les-services-et-linjection-de-dépendances)
5. [Les Signals (Réactivité)](#5-les-signals-réactivité)
6. [Les Observables et RxJS](#6-les-observables-et-rxjs)
7. [Le Routing](#7-le-routing)
8. [Les Formulaires](#8-les-formulaires)
9. [Les Interceptors](#9-les-interceptors)
10. [Les Guards](#10-les-guards)

---

## 1. Concepts fondamentaux

### Analogie Backend → Frontend

| Backend | Angular Frontend |
|---------|------------------|
| Controller | Component |
| Service | Service |
| Middleware | Interceptor / Guard |
| Repository | Service (appel API) |
| DTO | Interface TypeScript |
| Route | Route Angular |
| Session/JWT | AuthStore (Signal) |

### Structure d'un projet Angular

```
src/
├── main.ts              # Point d'entrée (comme index.js en Node)
├── index.html           # Page HTML unique (SPA)
├── styles.scss          # Styles globaux
├── app/
│   ├── app.ts           # Composant racine
│   ├── app.config.ts    # Configuration (providers)
│   ├── app.routes.ts    # Définition des routes
│   └── ...              # Ton code
└── environments/
    └── environment.ts   # Variables d'environnement
```

---

## 2. Le système de modules et d'injection

### Avant Angular 14 : NgModules (ancien système)

```typescript
// ❌ Ancien système - tu verras ça dans de vieux tutos
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Angular 14+ : Standalone Components (nouveau système)

```typescript
// ✅ Nouveau système - ce qu'on utilise dans ce projet
@Component({
  selector: 'app-root',
  standalone: true,        // <-- Composant autonome
  imports: [RouterOutlet], // <-- Importe directement ce dont il a besoin
  template: `<router-outlet />`
})
export class App { }
```

**Analogie Backend** : C'est comme passer de la configuration XML à des annotations en Java, ou de `require()` à `import` en Node.js.

---

## 3. Les Components (Composants)

Un **Component** est l'équivalent d'un Controller + une Vue combinés.

### Anatomie d'un Component

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  // 1. METADATA
  selector: 'app-user-profile',      // Tag HTML: <app-user-profile />
  standalone: true,                   // Composant autonome
  imports: [CommonModule],            // Dépendances du template

  // 2. TEMPLATE (la vue HTML)
  template: `
    <div class="profile">
      <h1>{{ user().name }}</h1>
      <button (click)="onLogout()">Déconnexion</button>
    </div>
  `,

  // 3. STYLES (CSS scoped au composant)
  styles: [`
    .profile { padding: 20px; }
  `]
})
export class UserProfileComponent {
  // 4. LOGIQUE (le controller)

  // Injection de dépendances (comme @Autowired en Java)
  private readonly authService = inject(AuthService);

  // État réactif avec Signals
  user = this.authService.user;

  // Méthode appelée par le template
  onLogout(): void {
    this.authService.logout();
  }
}
```

### Syntaxe du Template

```html
<!-- Interpolation : afficher une valeur -->
<p>{{ user.name }}</p>

<!-- Property binding : passer une valeur à un attribut -->
<input [value]="user.email" />
<button [disabled]="isLoading">Envoyer</button>

<!-- Event binding : écouter un événement -->
<button (click)="onSubmit()">Cliquer</button>
<input (input)="onInput($event)" />

<!-- Two-way binding : liaison bidirectionnelle -->
<input [(ngModel)]="searchTerm" />

<!-- Condition @if (Angular 17+) -->
@if (user) {
  <p>Bienvenue {{ user.name }}</p>
} @else {
  <p>Non connecté</p>
}

<!-- Boucle @for (Angular 17+) -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}

<!-- Ancienne syntaxe (tu verras dans les vieux tutos) -->
<p *ngIf="user">Bienvenue {{ user.name }}</p>
<li *ngFor="let item of items">{{ item.name }}</li>
```

### Cycle de vie d'un Component

```typescript
export class MyComponent implements OnInit, OnDestroy {

  // Appelé une fois après la création
  ngOnInit(): void {
    console.log('Composant initialisé');
    // Équivalent: componentDidMount() en React
    // Équivalent: mounted() en Vue.js
  }

  // Appelé quand le composant est détruit
  ngOnDestroy(): void {
    console.log('Composant détruit');
    // Nettoyer les subscriptions, timers, etc.
  }
}
```

---

## 4. Les Services et l'injection de dépendances

Un **Service** est une classe injectable qui contient de la logique métier ou des appels API.

### Créer un Service

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'  // Singleton global (comme @Service en Spring)
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUserDto) {
    return this.http.post<User>(this.apiUrl, user);
  }
}
```

### Injection de dépendances

```typescript
// ✅ Méthode moderne (Angular 14+)
export class MyComponent {
  private readonly userService = inject(UserService);
}

// ❌ Ancienne méthode (tu verras dans les vieux tutos)
export class MyComponent {
  constructor(private userService: UserService) { }
}
```

**Analogie Backend** :
- `@Injectable({ providedIn: 'root' })` = `@Service` ou `@Component` en Spring
- `inject(Service)` = `@Autowired` en Spring ou injection dans le constructeur en NestJS

---

## 5. Les Signals (Réactivité)

Les **Signals** sont le nouveau système de réactivité d'Angular (depuis Angular 16).

### C'est quoi un Signal ?

Un Signal est une **valeur réactive** qui notifie automatiquement Angular quand elle change.

**Analogie Backend** : C'est comme un `BehaviorSubject` RxJS, ou une variable observable dans d'autres frameworks.

### Créer et utiliser un Signal

```typescript
import { signal, computed } from '@angular/core';

export class CounterComponent {
  // 1. Créer un signal avec une valeur initiale
  count = signal(0);

  // 2. Signal dérivé (computed) - recalculé automatiquement
  doubleCount = computed(() => this.count() * 2);

  // 3. Lire la valeur d'un signal (appeler comme une fonction)
  getCurrentCount(): number {
    return this.count();  // Retourne 0
  }

  // 4. Modifier un signal
  increment(): void {
    // Option 1: set() - remplacer la valeur
    this.count.set(10);

    // Option 2: update() - modifier basé sur la valeur actuelle
    this.count.update(current => current + 1);
  }
}
```

### Signal dans le template

```html
<!-- Appeler le signal comme une fonction avec () -->
<p>Compteur: {{ count() }}</p>
<p>Double: {{ doubleCount() }}</p>

<button (click)="increment()">+1</button>
```

### Signal vs Variable normale

```typescript
// ❌ Variable normale - Angular ne sait pas quand elle change
name = 'John';

// ✅ Signal - Angular sait quand elle change et met à jour la vue
name = signal('John');
```

### Signals en lecture seule

```typescript
export class AuthStore {
  // Signal privé (modifiable uniquement dans cette classe)
  private readonly _user = signal<User | null>(null);

  // Signal public en lecture seule (les autres ne peuvent que lire)
  readonly user = this._user.asReadonly();

  setUser(user: User): void {
    this._user.set(user);  // ✅ OK ici
  }
}

// Dans un autre fichier
const authStore = inject(AuthStore);
console.log(authStore.user());      // ✅ Lecture OK
authStore.user.set(newUser);        // ❌ Erreur! Lecture seule
```

---

## 6. Les Observables et RxJS

Angular utilise **RxJS** pour les opérations asynchrones (appels HTTP, événements...).

### C'est quoi un Observable ?

Un **Observable** est un flux de données asynchrones. C'est comme une Promise, mais qui peut émettre plusieurs valeurs dans le temps.

| Promise | Observable |
|---------|------------|
| Une seule valeur | Plusieurs valeurs |
| Exécuté immédiatement | Exécuté à la souscription |
| Non annulable | Annulable |

### Utilisation basique

```typescript
import { Observable } from 'rxjs';

export class UserService {
  private readonly http = inject(HttpClient);

  // http.get() retourne un Observable
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

// Dans un composant
export class UserListComponent {
  private readonly userService = inject(UserService);

  users = signal<User[]>([]);

  loadUsers(): void {
    // subscribe() déclenche la requête
    this.userService.getUsers().subscribe({
      next: (data) => this.users.set(data),    // Succès
      error: (err) => console.error(err),       // Erreur
      complete: () => console.log('Terminé')    // Fin
    });
  }
}
```

### Opérateurs RxJS courants

```typescript
import { map, filter, tap, catchError, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

this.userService.getUsers().pipe(
  // tap: effet de bord (logging, etc.) sans modifier les données
  tap(users => console.log('Reçu:', users)),

  // map: transformer les données
  map(users => users.filter(u => u.isActive)),

  // catchError: gérer les erreurs
  catchError(error => {
    console.error('Erreur:', error);
    return of([]);  // Retourner une valeur par défaut
  })
).subscribe(users => {
  this.users.set(users);
});
```

### Signal vs Observable

```typescript
// Observable: flux de données, doit être souscrit
users$: Observable<User[]> = this.http.get<User[]>('/api/users');

// Signal: valeur réactive, pas besoin de souscrire
users = signal<User[]>([]);

// Conversion Observable → Signal
this.http.get<User[]>('/api/users').subscribe(data => {
  this.users.set(data);
});
```

---

## 7. Le Routing

Le **Router** Angular gère la navigation entre les pages (comme Express Router).

### Définir les routes

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Route simple
  {
    path: '',
    component: HomeComponent
  },

  // Route avec paramètre
  {
    path: 'users/:id',
    component: UserDetailComponent
  },

  // Lazy loading (chargement à la demande)
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent)
  },

  // Routes enfants
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },

  // Route par défaut (404)
  { path: '**', redirectTo: '' }
];
```

### Navigation dans le code

```typescript
import { Router, ActivatedRoute } from '@angular/router';

export class MyComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Naviguer vers une autre page
  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  // Naviguer avec des paramètres
  goToUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  // Naviguer avec des query params
  search(term: string): void {
    this.router.navigate(['/search'], {
      queryParams: { q: term }
    });
  }

  // Lire les paramètres de route
  ngOnInit(): void {
    // Paramètre de route: /users/:id
    const id = this.route.snapshot.params['id'];

    // Query param: /search?q=test
    const query = this.route.snapshot.queryParams['q'];
  }
}
```

### Navigation dans le template

```html
<!-- Lien simple -->
<a routerLink="/users">Utilisateurs</a>

<!-- Lien avec paramètre -->
<a [routerLink]="['/users', user.id]">{{ user.name }}</a>

<!-- Lien actif (ajoute une classe CSS) -->
<a routerLink="/home" routerLinkActive="active">Accueil</a>

<!-- Afficher le contenu de la route enfant -->
<router-outlet />
```

---

## 8. Les Formulaires

Angular propose deux types de formulaires.

### Reactive Forms (recommandé)

```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      @if (form.get('email')?.errors?.['required']) {
        <span class="error">Email requis</span>
      }
      @if (form.get('email')?.errors?.['email']) {
        <span class="error">Email invalide</span>
      }

      <input formControlName="password" type="password" />

      <button [disabled]="form.invalid">Envoyer</button>
    </form>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  // Définir le formulaire avec validation
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      console.log('Soumis:', email, password);
    }
  }
}
```

### Validators disponibles

```typescript
import { Validators } from '@angular/forms';

Validators.required           // Champ requis
Validators.email              // Email valide
Validators.minLength(5)       // Minimum 5 caractères
Validators.maxLength(100)     // Maximum 100 caractères
Validators.min(0)             // Valeur minimum
Validators.max(100)           // Valeur maximum
Validators.pattern(/regex/)   // Expression régulière
```

---

## 9. Les Interceptors

Un **Interceptor** intercepte les requêtes/réponses HTTP (comme un middleware Express).

### Créer un Interceptor (fonctionnel - Angular 15+)

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer le token
  const token = localStorage.getItem('access_token');

  // Si token existe, cloner la requête avec le header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Passer au suivant
  return next(req);
};
```

### Enregistrer l'Interceptor

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

**Analogie Backend** : C'est exactement comme un middleware Express :
```javascript
// Express middleware (backend)
app.use((req, res, next) => {
  req.headers.authorization = 'Bearer ' + token;
  next();
});
```

---

## 10. Les Guards

Un **Guard** protège les routes (comme un middleware d'authentification).

### Créer un Guard (fonctionnel - Angular 15+)

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from './stores/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;  // Autoriser l'accès
  }

  // Rediriger vers login
  router.navigate(['/auth/login']);
  return false;
};
```

### Utiliser un Guard

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],  // Protéger cette route
    component: DashboardComponent
  }
];
```

**Analogie Backend** : C'est comme un middleware d'authentification Express :
```javascript
// Express middleware (backend)
const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/dashboard', authMiddleware, dashboardController);
```

---

## Résumé des analogies Backend → Angular

| Concept Backend | Équivalent Angular |
|-----------------|-------------------|
| Controller | Component |
| Service/Repository | Service avec `@Injectable()` |
| DTO/Model | Interface TypeScript |
| Middleware | Interceptor |
| Auth Middleware | Guard |
| Router | Angular Router |
| Session/État | Signal ou Store |
| `@Autowired` / DI | `inject()` |
| `async/await` | Observable + `subscribe()` |
| Template Engine | Template Angular |

---

## Fichier suivant

Continue avec [02-architecture-guide.md](./02-architecture-guide.md) pour comprendre l'architecture Clean Architecture et CQRS de ce projet.
