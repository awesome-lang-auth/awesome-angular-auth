# Contributing to awesome-angular-auth

Thank you for your interest in contributing to `@awesome-lang-auth/angular` (formerly `ng-awesome-node-auth`) and the official Angular SSR demo for the `awesome-node-auth` ecosystem!

## Development setup

```bash
git clone https://github.com/awesome-lang-auth/awesome-angular-auth
cd awesome-angular-auth
npm install
npm run build:ssr   # Build the library and the application
npm start           # Run in development mode
```

The library lives in `projects/awesome-angular-auth` and builds to `dist/awesome-angular-auth` (`npm run build:lib`). The demo imports it as `@awesome-lang-auth/angular` through the `tsconfig.json` path alias, so build the library before the demo. Consumers install it with `npm i @awesome-lang-auth/angular`.

`legacy/ng-awesome-node-auth` is the last release of the old package name: a re-export of `@awesome-lang-auth/angular`, with no code of its own. It is not part of the workspace build, and `publish.yml` never publishes it: it is packed and published by hand.

## How to contribute

1. **Fork** the repository and create a branch from `develop`.
2. Make your changes following the existing code style.
3. Ensure the project builds successfully with `npm run build:ssr` and the library tests pass with `npx ng test awesome-angular-auth --watch=false`.
4. Open a **Pull Request** against `develop`. `main` is the release branch: a version bump merged there publishes the package to npm.

## Reporting bugs & requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE/) provided. Search for [existing issues](https://github.com/awesome-lang-auth/awesome-angular-auth/issues) before opening a new one.

## Security issues

Do **not** open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing you agree that your work will be licensed under the [MIT License](LICENSE) that covers this project.
