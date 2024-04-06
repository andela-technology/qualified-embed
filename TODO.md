# TODO

- add unpkg/jsdelivr options for script tags, remove AMD from bundler potentially
  - get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
  - update default baseUrl to point to latest CDN
- Prepare for npm release (@qualified/embed-sdk) https://www.freecodecamp.org/news/how-to-create-and-publish-your-first-npm-package/
- Determine how to version the docs (different GH pages branches or top-level folders? https://stackoverflow.com/questions/47643881/github-pages-maintaining-multiple-versions has ideas)
- Remove the embed/manager directory and relevant gulp stuff from the main codebase
- add jsdoc dev server with hot reloading
- determine whether obfuscateId needs to be replaced or what's going on with that. might need to move this server-side and change it now that it's in git history.
- Add CONTRIBUTING.md (good example: https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62#file-contributing-md), LICENSE
- Update SDK docs to show Node usage, and update browser usage with the new QualifiedEmbed prefix.
- check on how https://www.qualified.io/embed and https://www.qualified.io/embedded will work after removing the manager (I guess they will point to jsdelivr rather than https://www.qualified.io/embed.js?)
- Add Playwright tests? CI?
- Run by legal before going public

## Lower priority

- Possibly add husky precommit hook to run linting and prettier
- Add TS checks on docstrings?
- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- break out config from index.html to JSON file and have webpack load the JSON and inject it into index.html
- Add console.warn to https://www.qualified.io/embed to indicate it's deprecated
- Determine where to host the docs now that this is out of the Qualified codebase (github pages? docs.qualified.io/netlify? -- I like the GH pages idea since it's all in one repo--demo at https://andela-technology.github.io/qualified-embed/)
  - If we want to move it to netlify, something like https://www.npmjs.com/package/jsdoc-to-markdown might help
