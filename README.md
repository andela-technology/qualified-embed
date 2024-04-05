# Qualified Embed SDK

With Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our SDK makes it simple to embed code challenges and assessments into your existing products.

- [Qualified Embed SDK docs](https://andela-technology.github.io/qualified-embed/)
- [Qualified Embed demo](https://www.qualified.io/embedded)


## Usage

Node:

```
npm i @qualified/embed-sdk
```

CDN/browser:

```
<script src=":replace with unpkg or jsdelivr url:"></script>
```


## Examples

TODO: react and vanilla. https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/ has an example of testing an npm package locally.


## Development

```
git config blame.ignoreRevsFile .git-blame-ignore-revs
npm i
npm run dev # run a development server
npm run build # bundle the manager to /dist
npm run jsdoc # bundle the docs to /docs
npm run lint # run eslint
npm run format # run prettier
```


## Deploying the Package

```
npm publish
```


## Deploying the Docs

```
git checkout docs
npm run jsdoc
git add -f docs
git commit -m "Deploy docs"
git push
```


## TODO

- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- Add end-user usage instructions (maybe React example?) (and unpkg/jsdelivr options for script tags, remove AMD from bundler potentially)
  - get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
- Prepare for npm release (@qualified/ namespace?) https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/
- Determine how to version the docs (different GH pages branches or top-level folders? https://stackoverflow.com/questions/47643881/github-pages-maintaining-multiple-versions has ideas)
- Determine where to host the docs now that this is out of the Qualified codebase (github pages? docs.qualified.io/netlify? -- I like the GH pages idea since it's all in one repo--demo at https://andela-technology.github.io/qualified-embed/)
  - If we want to move it to netlify, something like https://www.npmjs.com/package/jsdoc-to-markdown might help
- Determine whether we can remove the /manager directory from the main codebase
  - test full development workflow with baseUrl
- break out config from index.html to JSON file and have webpack load the JSON and inject it into index.html
- add jsdoc dev server
- Possibly add husky precommit hook to run linting and prettier
- determine whether obfuscateId needs to be replaced or what's going on with that. might need to move this server-side and change it now that it's in git history.
- Add CONTRIBUTING.md (good example: https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62#file-contributing-md), LICENSE
- Add TS checks on docstrings?
- consider using parcel instead of webpack?
- check on how https://www.qualified.io/embed and https://www.qualified.io/embedded will work after removing the manager (I guess they will point to jsdelivr rather than https://www.qualified.io/embed.js?)
- Add tests? Possibly Playwright?
- Run by legal before going public
