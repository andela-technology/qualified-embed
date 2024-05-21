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

## Creating a New Release

Create a new release on GitHub at https://github.com/andela-technology/qualified-embed/releases. The release should provide a list of changes, a link to the docs and a link to the npm package.

## Publishing the Package

The package is hosted on [npm](https://www.npmjs.com/package/@qualified/embed) and follows semver. Update the version in package.json accordingly, update the script tags in README.md and the docs to point to the latest version, and run:

```bash
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

## Publishing the Browser Script

We use JSDelivr to host the script via a release on GitHub. All bundles should go in the `/dist` branch and should have the same code as their corresponding npm version.

```bash
git checkout dist
git merge main
npm run build
git add -f dist
git commit -m "Add browser script for release v1.0.2"
git push
```

Feel free to make a PR if you prefer, but be sure to merge it into the dist branch.

Once you create a release, use the tag for the JSDelivr link. The format is <https://cdn.jsdelivr.net/gh/andela-technology/qualified-embed@1.0.2/dist/embed.min.js> where 1.0.2 is the release version.

## Updating Related Resources

The Qualified codebase has a few references to the script. Update all JSDeliver links (`git grep jsdelivr`) to use the latest script tag.

https://github.com/qualified/embed-demos also uses the script tag and should be updated accordingly.

Update the script tags within the jsdocs here as well.
