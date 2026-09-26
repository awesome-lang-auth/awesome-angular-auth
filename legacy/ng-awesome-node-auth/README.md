# ng-awesome-node-auth → `@awesome-lang-auth/angular`

> **This package has been renamed to [`@awesome-lang-auth/angular`](https://www.npmjs.com/package/@awesome-lang-auth/angular).**
> 1.10.0 is the last version of `ng-awesome-node-auth`. It contains no code of its own: it depends on `@awesome-lang-auth/angular` and re-exports it, so existing apps keep building while you migrate. The package is deprecated on npm and receives no further releases.

## Migrate

1. Replace the dependency:

   ```bash
   npm uninstall ng-awesome-node-auth
   npm install @awesome-lang-auth/angular
   ```

2. Replace the import specifier:

   ```ts
   // before
   import { provideAuth, authGuard } from 'ng-awesome-node-auth';
   // after
   import { provideAuth, authGuard } from '@awesome-lang-auth/angular';
   ```

The API is unchanged. New features and fixes ship only in `@awesome-lang-auth/angular`.

## What this version does

- `import { ... } from 'ng-awesome-node-auth'` resolves to `@awesome-lang-auth/angular` (`^1.10.0`). The exports are the same objects: the same `AuthService` class, the same `NG_AUTH_OPTIONS` and `AUTH_SERVICE` tokens. An app can mix both import specifiers while it migrates file by file.
- The Angular peer dependencies are unchanged from 1.9.0: `@angular/common` and `@angular/core` `^21.2.0`.
- It ships only the re-export (`index.mjs`, `index.d.ts`), this README and the MIT license.

## Links

- Repository: [awesome-lang-auth/awesome-angular-auth](https://github.com/awesome-lang-auth/awesome-angular-auth) (this bridge lives in [`legacy/ng-awesome-node-auth`](https://github.com/awesome-lang-auth/awesome-angular-auth/tree/develop/legacy/ng-awesome-node-auth))
- Changelog: [CHANGELOG.md](https://github.com/awesome-lang-auth/awesome-angular-auth/blob/develop/CHANGELOG.md)
- Issues: [awesome-lang-auth/awesome-angular-auth/issues](https://github.com/awesome-lang-auth/awesome-angular-auth/issues)
- Documentation: [www.awesomenodeauth.com](https://www.awesomenodeauth.com)

## License

MIT
