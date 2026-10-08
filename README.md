# NG Awesome Node Auth Project

This project combines a powerful Node.js authentication backend using `awesome-node-auth` with a modern Angular frontend utilizing the `@awesome-lang-auth/angular` library (formerly `ng-awesome-node-auth`).

## Installing the library

```bash
npm i @awesome-lang-auth/angular
```

The library supports **Angular 21.2+ and Angular 22** (peer dependencies `^21.2.0 || ^22.0.0` since 1.11.0). This repository's workspace and demo app use Angular 22, which needs Node.js `^22.22.3` or `^24.15.0`.

> **Formerly `ng-awesome-node-auth`:** replace the dependency and the import specifier (`'ng-awesome-node-auth'` → `'@awesome-lang-auth/angular'`). The API is unchanged. Repository: [awesome-lang-auth/awesome-angular-auth](https://github.com/awesome-lang-auth/awesome-angular-auth).

## Project Structure

- **Angular library**: Located in `projects/awesome-angular-auth` (published as `@awesome-lang-auth/angular`, see its [README](projects/awesome-angular-auth/README.md)).
- **Angular Application**: Located in `src/app`.
- **Express Server**: Located in `src/server.ts` (handles SSR and API routing).
- **In-Memory Stores**: Located in `src/server/` (User and Settings stores).

---

## 🚀 Server-Side Implementation

The server is built with Express and handles both the Angular SSR engine and the `awesome-node-auth` backend.

### 1. Auth Configuration (`src/server/auth.config.ts`)

Define your stores and core authentication settings.

```typescript
import { AuthConfigurator, AuthConfig } from 'awesome-node-auth';
import { InMemoryUserStore } from './in-memory-user-store';
import { InMemorySettingsStore } from './in-memory-settings-store';
import { join } from 'node:path';

export const userStore = new InMemoryUserStore();
export const settingsStore = new InMemorySettingsStore();
export const uploadDir = join(process.cwd(), 'public/uploads');

export const authConfig: AuthConfig = {
  apiPrefix: '/api/auth',
  accessTokenSecret: process.env['JWT_SECRET'],
  ui: { enabled: true },
  email: { siteUrl: 'http://localhost:4200' }
};

export const authConfigurator = new AuthConfigurator(authConfig, userStore);
```

### 2. API Routes (`src/server/auth.routes.ts`)

Mount the authentication router and the Admin Panel.

```typescript
import { Router } from 'express';
import { AuthEventBus } from 'awesome-node-auth';
import { authConfigurator, settingsStore, uploadDir } from './auth.config';

const router = Router();
const bus = new AuthEventBus();

router.use('/', authConfigurator.router({
  settingsStore,
  uploadDir,
  eventBus: bus,          // router events (login, register, 2FA, ...) are published on it
  defaultRegister: true,  // built-in POST /register (awesome-node-auth >= 1.10): email, password hash, firstName, lastName
}));

export default router;
```

### 3. Main Server Entry (`src/server.ts`)

Wire everything together, including the Admin Panel and Angular SSR.

```typescript
import express from 'express';
import { createAdminRouter } from 'awesome-node-auth';
import authRoutes from './server/auth.routes';
import { userStore, settingsStore, uploadDir, ADMIN_SECRET } from './server/auth.config';

const app = express();

// Auth API & UI
app.use('/api/auth', authRoutes);

// Admin Panel (mounted at root for correct path resolution)
app.use('/admin/auth', createAdminRouter(userStore, {
  adminSecret: ADMIN_SECRET,
  settingsStore,
  uploadDir,
  apiPrefix: '/api/auth'
}));

// Fallback for all other routes to Angular SSR
app.use('**', angularSsrHandler);
```

---

### 1. Breaking SSR Routing Loops
When using Angular SSR, the server tries to render all routes. If an unauthenticated user hits `/dashboard`, Angular redirects to `/login`. If `/login` is also handled by Angular (and it's a SPA), this can lead to infinite loops.

**The Solution:**
Handle auth redirects at the **Express server level** before the Angular engine. This ensures the browser is redirected to the backend-served UI pages:

```typescript
const authPaths = ['login', 'register', 'forgot-password', 'reset-password', '2fa', 'verify-email'];

authPaths.forEach(p => {
  app.get(`/${p}`, (req, res) => {
    // Redirect to the backend-served UI, preserving query parameters
    const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    res.redirect(`/api/auth/ui/${p}${query}`);
  });
});
```

### 2. Preventing Build-Time Server Starts
Angular's build process (`ng build`) imports your server module to extract routes. If your server starts listening on a port during this phase, the build will hang.

**The Solution:**
Wrap your `app.listen()` block with a check for `isMainModule()`:

```typescript
import { isMainModule } from '@angular/ssr/node';

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}
```
This ensures the server only starts during actual execution, not during the build.

### 3. Wildcard SSR Route
In `src/app/app.routes.server.ts`, ensure you have a wildcard route configured for server rendering to handle the fallback correctly:
  ```typescript
  export const serverRoutes: ServerRoute[] = [
    { path: '**', renderMode: RenderMode.Server }
  ];
  ```

---

## ⚙️ Enabling Full Admin Features
To unlock all features in the Admin Panel (Settings, Uploads, Theme Sync), the `createAdminRouter` must be configured with:
- `settingsStore`: Enables the "Control" tab for real-time UI customization.
- `uploadDir`: Enables file uploads for logos and backgrounds.
- `apiPrefix`: Essential for the Admin Panel to correctly resolve the Auth API endpoints.

```typescript
app.use('/admin/auth', createAdminRouter(userStore, {
  adminSecret: ADMIN_SECRET,
  settingsStore,
  uploadDir,
  apiPrefix: '/api/auth'
}));
```

---

## 🎨 Frontend Implementation

The Angular app uses the `@awesome-lang-auth/angular` library for seamless integration.

### 1. App Configuration (`src/app/app.config.ts`)

```typescript
import { provideAuth, provideAuthUi } from '@awesome-lang-auth/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth({ 
      apiPrefix: '/api/auth',
      // Optional: set to true to handle session expiry manually 
      // without automatic full-page redirects.
      headless: false 
    }),
    provideAuthUi() // For theme synchronization and config-aware UI
  ]
};
```

### 2. Route Protection (`src/app/app.routes.ts`)

```typescript
import { authGuard, guestGuard } from '@awesome-lang-auth/angular';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
];
```

---

## 🛠️ Development

### Scripts

- `npm run dev`: Start Angular dev server.
- `npm run build:ssr`: Build the Angular application and the Express server for production.
- `node dist/ng-awesome-node-auth-prj/server/server.mjs`: Start the production server.

### Maintenance

The project includes an auto-cleanup timer in `server.ts` that clears the in-memory user database every 5 minutes during testing.
