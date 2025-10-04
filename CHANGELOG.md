# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-10-04

### Added
- Bundled the full markdown action suite under `src/actions` and exported it from the core package so projects no longer need the external `markdown-actions` dependency.
- Documented the plugin collection now published from `src/plugins`, including usage guides in the main README, docs, and demo walkthroughs.
- Introduced a comprehensive documentation refresh covering the new action utilities, plugin APIs, and demo workflows across `/docs`, `README.md`, `OVERVIEW.md`, and `bakeshop-demo/README.md`.

### Changed
- Updated contribution guidance and quick-start instructions to reflect the streamlined package layout and Node.js 20+ support.
- Refined the documentation structure, aligning the table of contents with the shipped guides and clarifying how to access bundled plugins and formatting helpers.

---

## [1.0.0] - 2025-09-26

### Added
- Initial public release of the Marzipan core editor library and Bakeshop demo application.
- Live overlay preview, theming system, toolbar, keyboard shortcuts, stats panel, and plugin foundation.
- TypeScript declarations, documentation set, and contribution guide.

[Unreleased]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pinkpixel-dev/marzipan/releases/tag/v1.0.0
