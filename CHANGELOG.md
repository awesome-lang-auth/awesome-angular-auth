# Changelog

All notable changes to the Angular client library are documented in this file.
Releases up to 1.9.0 were published as `ng-awesome-node-auth` and have no entries here.

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
- The repository moved to [awesome-lang-auth/awesome-angular-auth](https://github.com/awesome-lang-auth/awesome-angular-auth). The workspace project is now `projects/awesome-angular-auth` and builds to `dist/awesome-angular-auth`.
