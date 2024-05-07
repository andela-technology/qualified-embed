# Contributing

Issues and pull requests are welcome. Before opening a PR, please create an issue and target the issue for closure with the PR.

Before opening a PR, add automated tests if appropriate and run and pass all checks:

```
npm run format
npm run lint
npm run test
```

## Development Setup

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
npm i # install dependencies
npm start # run a development server
npm run build # bundle the manager to /dist
npm run jsdoc # bundle the docs to /docs
npm run lint # run eslint
npm run format # run prettier
```

If you're working on Embed internals in the Qualified codebase, update `baseURL` in the Embed options in [public/index.html](public/index.html) to `http://localhost:3001` (or the port the Qualified UI Docker container is running on). You'll also need to ensure your `embedClientKey` and `challengeId` match a valid team and local Embed-enabled challenge.

## Deploying the Package

The package is hosted on [npm](https://www.npmjs.com/package/@qualified/embed) and follows semver.

```bash
npm publish
```

## Deploying the Docs

The [docs](https://andela-technology.github.io/qualified-embed/) are hosted on GitHub pages.

```bash
git checkout docs
npm run jsdoc
git add -f docs
git commit -m "Deploy docs"
git push
```

If you're publishing docs for a new release, on the `docs` branch, modify the workflow above to include subfolders for each release version.

The current version docs should be hosted at <https://andela-technology.github.io/qualified-embed/>, while outdated versions should be hosted at <https://andela-technology.github.io/qualified-embed/0.0.1> (for example).

You can achieve this by deleting the non-version labeled docs in the root folder (assuming it was already backed up to a version-specific subfolder), then copying the newly-generated folder into its version number.
