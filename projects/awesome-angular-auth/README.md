# @awesome-lang-auth/angular

An elegant, standalone Angular library providing interceptors, guards, and session management for frontends backed by `awesome-node-auth`.

This library is designed to be **lightweight and 100% tree-shakable**. You only ship the code you actually use.

> **Formerly `ng-awesome-node-auth`.** To migrate, replace the dependency (`npm uninstall ng-awesome-node-auth`, then `npm i @awesome-lang-auth/angular`) and the import specifier (`'ng-awesome-node-auth'` → `'@awesome-lang-auth/angular'`). The API is unchanged.

## 🔗 Official Documentation

For detailed instructions on how to set up the **Node.js backend**, visit the official documentation:
👉 **[awesomelangauth.com](https://awesomelangauth.com)**

---

## ✨ Features

- **Full Session Management**: Reactive signals for user state and authentication status.
- **Smart Guards**: `authGuard` and `guestGuard` for seamless navigation control.
- **Auto-Interception**: Transparently handles Access & Refresh tokens via an HTTP interceptor.
- **CSRF Protection**: Native support for standard CSRF token patterns.
- **UI Synchronization**: Optional `provideAuthUi()` to sync themes and feature flags with the backend.
- **SSR Friendly**: Fully compatible with Angular Server-Side Rendering.

---

## 🚀 Installation

Install the library in your Angular project:

```bash
npm install @awesome-lang-auth/angular
```

### Compatibility

| `@awesome-lang-auth/angular` | Angular |
|---|---|
| 1.11.x | 21.2+ and 22 |
| 1.10.x | 21.2+ |

Since 1.11.0, the peer dependencies on `@angular/core` and `@angular/common` are `^21.2.0 || ^22.0.0`. Version 1.10.x declares `^21.2.0`.

---

## 🛠️ Quick Start

### 1. Configure Providers (`app.config.ts`)

Add `provideAuth` to your application configuration.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAuth, provideAuthUi } from '@awesome-lang-auth/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core Auth (Session, Interceptor, CSRF)
    provideAuth({ apiPrefix: '/api/auth' }),
    
    // Optional: UI Integration (Theme sync, config fetching)
    provideAuthUi(),
  ]
};
```

### 2. Protect Routes (`app.routes.ts`)

```typescript
import { authGuard, guestGuard } from '@awesome-lang-auth/angular';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
];
```

---

## 🎨 Advanced UI Integration

When using `provideAuthUi()`, the library automatically:
1. **Fetches Backend Config**: Exposes feature flags (registration, forgot-password, etc.) via `UiConfigService`.
2. **Synchronizes Themes**: Real-time CSS variable updates when colors are changed in the Admin Panel.

### Feature Flag Example:

```typescript
import { inject } from '@angular/core';
import { UiConfigService } from '@awesome-lang-auth/angular';

// In your component...
uiConfig = inject(UiConfigService);
canRegister = this.uiConfig.hasFeature('register');
```

---

## 📖 API Summary

- **`user()`**: Signal with current `AuthUser` or `null`.
- **`isAuthenticated()`**: Signal returning `true` if logged in.
- **`logout()`**: Clears session and redirects.
- **`checkSession()`**: Re-fetches the current session (`/me`).
- **`refreshToken()`**: Manually triggers a token refresh.

For full API reference and backend integration guides, visit [awesomelangauth.com](https://awesomelangauth.com).
