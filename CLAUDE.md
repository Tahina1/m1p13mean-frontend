# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

M1P13 Mean Frontend is a modern Angular application following Clean Architecture principles with CQRS pattern. It uses Angular 21+ with standalone components, Signals for state management, and TypeScript strict mode.

## Common Commands

```bash
# Development
npm start                   # Start dev server (port 4200)
npm run dev                 # Start dev server with auto-open

# Build
npm run build               # Build for development
npm run build:prod          # Build for production

# Code Quality
npm run lint                # Run ESLint
npm run format              # Format with Prettier (REQUIRED before commit)
npm run format:check        # Check formatting

# Testing
npm test                    # Run tests
npm run test:coverage       # Run with coverage
```

## Code Style Guidelines

### Architecture (STRICT - Clean Architecture)

Four layers with strict dependency rules:

1. **Domain Layer** (`src/app/domain/`) - NO dependencies on other layers
   - Contains business models and interfaces
   - Only pure TypeScript files
   - Examples: `User.interface.ts`, `IAuthService.ts`

2. **Application Layer** (`src/app/application/`) - Depends on Domain only
   - Commands (write operations): `LoginCommand.ts`
   - Queries (read operations): `GetCurrentUserQuery.ts`
   - Services (facades): `AuthService.ts`

3. **Infrastructure Layer** (`src/app/infrastructure/`) - Depends on Domain and Application
   - Stores (state management with Signals)
   - HTTP client and interceptors
   - Guards and route protection
   - API route definitions

4. **Presentation Layer** (`src/app/presentation/`) - Can depend on all layers
   - Components organized by feature
   - Layouts and shared components
   - Uses Services from Application layer (NOT Commands/Queries directly)

### Naming Conventions

- **Files**:
  - Interfaces: `user.interface.ts`, `auth-service.interface.ts`
  - Components: `login.component.ts`, `main-layout.component.ts`
  - Services: `auth.service.ts`, `http.service.ts`
  - Commands: `login.command.ts`, `register.command.ts`
  - Queries: `get-current-user.query.ts`, `get-users.query.ts`
  - Stores: `auth.store.ts`, `user.store.ts`
  - Guards: `auth.guard.ts`, `role.guard.ts`

- **Variables**: camelCase for variables/functions, PascalCase for types/interfaces
- **Interfaces**: Prefix with 'I' (IUser, IAuthService, IApiResponse)

### Imports (REQUIRED)

Use path aliases - NEVER use relative paths (../../../):

```typescript
import { IUser } from '@domain/users';
import { AuthService } from '@application/services';
import { AuthStore } from '@infrastructure/stores';
import { LoginComponent } from '@presentation/pages/auth';
```

### Component Structure

- Standalone components (default in Angular 19+)
- Inline templates for simple components
- Use Signals for reactive state
- Inject dependencies with `inject()` function

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
})
export class ExampleComponent {
  private readonly authService = inject(AuthService);

  // Use signals from service
  readonly user = this.authService.user;
  readonly isAuthenticated = this.authService.isAuthenticated;
}
```

### CQRS Pattern (REQUIRED)

**Commands** - Write operations:
```typescript
@Injectable({ providedIn: 'root' })
export class LoginCommand {
  execute(credentials: ILoginCredentials): Observable<IApiResponse<IAuthResponse>> {
    // Implementation
  }
}
```

**Queries** - Read operations:
```typescript
@Injectable({ providedIn: 'root' })
export class GetCurrentUserQuery {
  execute(): Observable<IApiResponse<IUser>> {
    // Implementation
  }
}
```

**Services** - Facades for components:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginCommand = inject(LoginCommand);

  login(credentials: ILoginCredentials) {
    return this.loginCommand.execute(credentials);
  }
}
```

### State Management with Signals

Use Angular Signals for reactive state:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<IUser | null>(null);

  // Public readonly signal
  readonly user = this._user.asReadonly();

  // Computed signal
  readonly isAuthenticated = computed(() => !!this._user());

  // Mutation method
  setUser(user: IUser | null): void {
    this._user.set(user);
  }
}
```

## Architecture Layers

### Domain Layer (`src/app/domain/`)

```
domain/
├── common/           # Shared types (ApiResponse, Pagination)
├── users/            # User domain models
│   ├── user.interface.ts
│   ├── user-service.interface.ts
│   └── index.ts
└── auth/             # Auth domain models
    ├── auth.interface.ts
    ├── auth-service.interface.ts
    └── index.ts
```

### Application Layer (`src/app/application/`)

```
application/
├── commands/         # Write operations
│   └── auth/
│       ├── login.command.ts
│       ├── register.command.ts
│       └── logout.command.ts
├── queries/          # Read operations
│   └── users/
│       ├── get-current-user.query.ts
│       └── get-users.query.ts
└── services/         # Facades for components
    ├── auth.service.ts
    └── index.ts
```

### Infrastructure Layer (`src/app/infrastructure/`)

```
infrastructure/
├── api/              # API routes
│   ├── routes/
│   │   ├── base.routes.ts
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   └── api.routes.ts
├── http/             # HTTP client
│   └── http.service.ts
├── interceptors/     # HTTP interceptors
│   ├── auth.interceptor.ts
│   └── error.interceptor.ts
├── stores/           # State management
│   └── auth.store.ts
└── guards/           # Route guards
    ├── auth.guard.ts
    └── role.guard.ts
```

### Presentation Layer (`src/app/presentation/`)

```
presentation/
├── components/
│   └── shared/       # Reusable components
│       ├── loading-spinner/
│       └── error-message/
├── layouts/          # Layout components
│   ├── main-layout/
│   └── auth-layout/
└── pages/            # Page components
    ├── auth/
    │   ├── login/
    │   └── register/
    └── home/
        ├── home.component.ts
        └── dashboard.component.ts
```

### Core Layer (`src/app/core/`)

```
core/
├── config/           # App configuration
│   └── app.config.ts
└── utils/            # Utility functions
    └── storage.util.ts
```

## Path Aliases (REQUIRED)

```typescript
// tsconfig.json paths
"@/*": ["src/app/*"],
"@domain/*": ["src/app/domain/*"],
"@application/*": ["src/app/application/*"],
"@infrastructure/*": ["src/app/infrastructure/*"],
"@presentation/*": ["src/app/presentation/*"],
"@core/*": ["src/app/core/*"],
"@env": ["src/environments/environment"]
```

## Tech Stack

- **Framework**: Angular 21+ with TypeScript (strict mode)
- **Components**: Standalone components (default)
- **State Management**: Angular Signals
- **HTTP Client**: HttpClient with functional interceptors
- **Routing**: Angular Router with lazy loading
- **Styling**: Tailwind CSS
- **Forms**: Reactive Forms with Validators
- **Validation**: Zod (optional)
- **Testing**: Vitest

## Critical Rules

1. **Standalone components** - All components must be standalone
2. **Signals for state** - Use Angular Signals, not RxJS BehaviorSubject
3. **CQRS pattern** - Separate Commands (write) and Queries (read)
4. **Clean Architecture** - Respect layer dependencies
5. **Path aliases** - No relative imports allowed
6. **Inject function** - Use `inject()` instead of constructor injection
7. **Lazy loading** - All routes should be lazy loaded
8. **Format before commit** - `npm run format` is required

## Security

- Never expose API keys or secrets in code
- Validate all user inputs
- Use proper error handling without exposing sensitive data
- JWT tokens handled securely through AuthStore

## Performance

- Use `OnPush` change detection where possible
- Lazy load all routes
- Use `trackBy` with `@for` loops
- Avoid unnecessary signal updates
