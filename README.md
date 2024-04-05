# Qualified Embed

Work in progress migration of Qualified's Embed to a public npm package

With Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our SDK makes it simple to embed code challenges and assessments into your existing products.


## Development

```
git config blame.ignoreRevsFile .git-blame-ignore-revs
npm i
npm run dev # run a development server
npm run build # bundle the manager to /dist
npm run jsdoc # bundle the docs to /docs
```

## TODO

- Format codebase with prettier and add ignore-revs, possibly add husky precommit hook
- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- Add end-user usage instructions (maybe React example?) (and unpkg/jsdelivr options for script tags, remove AMD from bundler potentially)
  - get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
- Prepare for npm release (@qualified/ namespace?)
- Determine how to version the docs
- Determine where to host the docs now that this is out of the Qualified codebase (github pages? netlify? -- I like the GH pages idea since it's all in one repo)
  - If we want to move it to netlify, something like https://www.npmjs.com/package/jsdoc-to-markdown might help
- Determine whether we can remove the /manager directory from the main codebase
  - test full development workflow with baseUrl
- break out config from index.html to JSON file and have webpack load the JSON and inject it into index.html
- test import on React project
- add jsdoc dev server
- determine whether obfuscateId needs to be replaced or what's going on with that. might need to move this server-side and change it now that it's in git history.
- Add CONTRIBUTING.md, LICENSE
- Add TS checks on docstrings?
- consider using parcel instead of webpack?
- check on how https://www.qualified.io/embed and https://www.qualified.io/embedded will work after removing the manager (I guess they will point to jsdelivr rather than https://www.qualified.io/embed.js?)
- Add tests? Possibly Playwright?
- Run by legal before going public
