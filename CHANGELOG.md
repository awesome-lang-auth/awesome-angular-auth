# Changelog

All notable changes to the Angular client library are documented in this file.
Releases up to 1.9.0 were published as `ng-awesome-node-auth` and have no entries here.

## [1.11.0] — 2026-10-08

### Added
- **Angular 22 support.** The peer dependencies `@angular/core` and `@angular/common` are now `^21.2.0 || ^22.0.0`, so the package installs in an Angular 22 app without `--legacy-peer-deps`. Angular 21.2 apps keep working: the package built with Angular 22 was checked in new Angular 21.2 and 22.2 apps (production build, unit tests, server-side rendering).

### Changed
- The package is built with Angular 22, ng-packagr 22 and TypeScript 6.0. The public API and the requests sent to the backend are unchanged. The JavaScript bundle comes out of the new toolchain with a different layout and without the source comments; the typings keep their documentation.
- `provideAuth()` still adds `withFetch()` to `provideHttpClient()`. Angular 22 marks `withFetch()` deprecated because fetch is now its default backend, but Angular 21 still defaults to XHR, so the library keeps it.
- The workspace and the demo app use Angular 22. Building this repository needs Node.js `^22.22.3` or `^24.15.0`.

## [1.10.1] — 2026-10-08

### Changed
- The homepage and documentation links point to [awesomelangauth.com](https://awesomelangauth.com). No code change.

## [1.10.0] — 2026-09-26

### Changed
- **The package is now `@awesome-lang-auth/angular`** (formerly `ng-awesome-node-auth`). The code is the same; only the name and the scope change. To migrate, replace the dependency and the import specifier:
  ```bash
  npm uninstall ng-awesome-node-auth
  npm install @awesome-lang-auth/angular
  ```
  ```ts
  // before
  import { provideAuth, authGuard } from 'ng-awesome-node-auth';
  // after
  import { provideAuth, authGuard } from '@awesome-lang-auth/angular';
  ```
- The version follows the Node library (1.10.x).
- The package now ships the MIT `LICENSE` text next to the `license` field.
- The repository moved to [awesome-lang-auth/awesome-angular-auth](https://github.com/awesome-lang-auth/awesome-angular-auth). The workspace project is now `projects/awesome-angular-auth` and builds to `dist/awesome-angular-auth`.

### Fixed
- `AuthService.setup2fa()` now passes `otpauthUrl` through to the caller, next to `secret` and `qrCode` ([#7](https://github.com/awesome-lang-auth/awesome-angular-auth/issues/7)). Against a backend that sends `otpauthUrl` without `qrCode`, the app can now draw the QR itself. The request is unchanged.
