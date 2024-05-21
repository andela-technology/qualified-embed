# Contributing

Issues and pull requests are welcome. Before opening a PR, please create an issue and target the issue for closure with the PR.

Before opening a PR, add automated tests if appropriate and run and pass all checks:

```bash
npm run format
npm run lint
npm run test
```

We have precommit hooks and CI actions to run these tasks.

## Development Setup

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
npm i # install dependencies
npm start # run a development server
npm run jsdoc # bundle the docs to /docs
npm run lint # run eslint
npm run format # run prettier
npm run test # run playwright e2e tests
```

If you're working on Embed internals in the Qualified codebase, update `baseURL` in the Embed options in [public/index.html](public/index.html) to `http://localhost:3001` (or the port the Qualified UI Docker container is running on). You'll also need to ensure your `embedClientKey` and `challengeId` match a valid team and local Embed-enabled challenge.

## Creating a New Release

Create a new release on GitHub at https://github.com/andela-technology/qualified-embed/releases. The release should provide a list of changes, a link to the docs, a link to the npm package and a link to the unpkg dist bundle.

## Publishing the Package

The package is hosted on [npm](https://www.npmjs.com/package/@qualified/embed) and follows semver. Update the version in package.json accordingly, update the script tags in README.md and the docs to point to the latest version, and run:

```bash
npm run build # bundle the manager to /dist for unpkg
npm publish
npm deprecate @qualified/embed@<previous version>
```

## Deploying the Docs

The [docs](https://andela-technology.github.io/qualified-embed/) are hosted on GitHub pages.

```bash
git checkout docs
git merge main
npm run jsdoc
git add -f docs
git commit -m "Deploy docs"
git push
```

Feel free to make a PR if you prefer, but be sure to merge it into the docs branch.

If you're publishing docs for a new release, on the `docs` branch, modify the workflow above to include subfolders for each release version.

The docs for the current embed release should be hosted at <https://andela-technology.github.io/qualified-embed/docs>, while outdated (and the current) versions should be hosted at <https://andela-technology.github.io/qualified-embed/docs/0.0.1> (for example).

You can achieve this by deleting the non-version labeled docs in the root folder (assuming it was already backed up to a version-specific subfolder), generating docs for the latest release, then copying the newly-generated folder into its version number.

`create-doc-resource-links.js` should be used to link each version-specific docs folder with the global assets in the `/docs` folder and delete any unnecessary folders in the version-specific docs folders.

## Updating Related Resources

The Qualified codebase has a few references to the script. Update all unpkg links (`git grep unpkg`) to use the latest script tag.

https://github.com/qualified/embed-demos also uses the script tag and should be updated accordingly.

Update the script tags within the jsdocs examples and README.md here as well.
