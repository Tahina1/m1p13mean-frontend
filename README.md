# M1P13 Mean Frontend

Angular Clean Architecture Template with CQRS Pattern

## Architecture

This project follows **Clean Architecture** principles with 4 layers:

```
src/app/
├── domain/           # Business models and interfaces (NO dependencies)
├── application/      # Commands, Queries, and Services
├── infrastructure/   # Stores, HTTP, Guards, Interceptors
├── presentation/     # Components, Pages, Layouts
└── core/             # Configuration and utilities
```

### Layer Dependencies

```
Presentation → Application → Infrastructure → Domain
                    ↓              ↓
               Domain only     Domain only
```

## Features

- **Angular 21+** with standalone components
- **Angular Signals** for state management
- **CQRS Pattern** (Commands and Queries)
- **Clean Architecture** with strict layer separation
- **Tailwind CSS** for styling
- **TypeScript Strict Mode**
- **Path Aliases** for clean imports
- **Lazy Loading** for all routes
- **HTTP Interceptors** for auth and error handling
- **Route Guards** for authentication and roles

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:4200`

### Build

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Code Quality

```bash
# Format code (required before commit)
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

## Project Structure

```
src/app/
├── domain/                    # Domain Layer
│   ├── common/               # Shared types (ApiResponse, Pagination)
│   ├── users/                # User domain models
│   └── auth/                 # Auth domain models
│
├── application/               # Application Layer
│   ├── commands/             # Write operations
│   │   └── auth/             # Auth commands (Login, Register, Logout)
│   ├── queries/              # Read operations
│   │   └── users/            # User queries
│   └── services/             # Service facades for components
│
├── infrastructure/            # Infrastructure Layer
│   ├── api/                  # API route definitions
│   ├── http/                 # HTTP service
│   ├── interceptors/         # HTTP interceptors
│   ├── stores/               # State management with Signals
│   └── guards/               # Route guards
│
├── presentation/              # Presentation Layer
│   ├── components/shared/    # Reusable components
│   ├── layouts/              # Layout components
│   └── pages/                # Page components
│
└── core/                      # Core Layer
    ├── config/               # App configuration
    └── utils/                # Utility functions
```

## Path Aliases

```typescript
import { IUser } from '@domain/users';
import { AuthService } from '@application/services';
import { AuthStore } from '@infrastructure/stores';
import { LoginComponent } from '@presentation/pages/auth';
import { APP_CONFIG } from '@core/config';
import { environment } from '@env';
```

## CQRS Pattern

### Commands (Write Operations)

```typescript
@Injectable({ providedIn: 'root' })
export class LoginCommand {
  execute(credentials: ILoginCredentials): Observable<IApiResponse<IAuthResponse>> {
    // ...
  }
}
```

### Queries (Read Operations)

```typescript
@Injectable({ providedIn: 'root' })
export class GetCurrentUserQuery {
  execute(): Observable<IApiResponse<IUser>> {
    // ...
  }
}
```

### Services (Facades)

Components should use Services, not Commands/Queries directly:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginCommand = inject(LoginCommand);

  login(credentials: ILoginCredentials) {
    return this.loginCommand.execute(credentials);
  }
}
```

## State Management with Signals

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<IUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  setUser(user: IUser | null): void {
    this._user.set(user);
  }
}
```

## Environment Configuration

Configure your API URL in `src/environments/`:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'M1P13 Mean Frontend',
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api',
  appName: 'M1P13 Mean Frontend',
};
```

## License

MIT
