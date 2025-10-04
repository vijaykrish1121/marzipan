# Contributing to Marzipan

Thanks for your interest in helping improve Marzipan! This guide covers the tooling you’ll need, how the repository is structured, and the workflow we follow for pull requests.

## Code of Conduct

Be respectful, inclusive, and collaborative. Assume good intent and help others succeed.

## Prerequisites

- **Node.js 20 or newer** (matches the `engines` field in `package.json`).
- **npm 9+** (bundled with Node 20).
- Git and a modern browser for running the playground.

## Getting Started

```bash
git clone https://github.com/pinkpixel-dev/marzipan
cd marzipan
npm install
```

## Scripts

Run these from the repository root:

- `npm run dev` – watch-mode build of the core library
- `npm run build` – type-check then bundle to `dist/`
- `npm run lint` – ESLint flat config
- `npm run prettier` – format source and docs
- `npm run typecheck` – strict TypeScript checks

### Bakeshop demo (`bakeshop-demo/`)

```bash
cd bakeshop-demo
npm install
npm run dev
```

Additional scripts (`build`, `preview`, `lint`, `typecheck`, `format`) mirror the root commands for the playground.

## Project Structure

- Core library source: `src/`
- Bundled actions: `src/actions/`
- First-party plugins: `src/plugins/`
- Documentation: `docs/`
- Demo playground: `bakeshop-demo/`

## Pull Request Checklist

1. Create a feature branch from `main`.
2. Keep the scope focused and include tests or docs when appropriate.
3. Run `npm run lint` and `npm run typecheck` (and the demo equivalents if you touched it).
4. Update `CHANGELOG.md` when the change affects users (new features, breaking changes, documentation overhauls).
5. Provide a clear summary of the change, rationale, and verification steps in the PR description.

## Commit Style

Use concise, descriptive messages. Common prefixes:
- `feat:` – new user-facing functionality
- `fix:` – bug fixes
- `docs:` – documentation-only updates
- `refactor:` – code reorganisation without behaviour change
- `chore:` – tooling and maintenance tasks

## Reporting Issues

When opening an issue, please include:
- Steps to reproduce
- Expected vs. actual behaviour
- Environment details (OS, browser, Node version)
- Minimal repro code or screenshot if relevant

## License

By contributing, you agree that your code will be licensed under the Apache License 2.0.

Thanks again for helping make Marzipan sweeter for everyone! 🍰
