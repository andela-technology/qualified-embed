# Qualified Embed

Work in progress migration of Qualified's Embed to a public npm package

With Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our SDK makes it simple to embed code challenges and assessments into your existing products.


## Development

```
npm i
npm run build # bundle the manager to /dist
npm run jsdoc # bundle the docs to /docs
```

## TODO

- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- Add end-user usage instructions (and unpkg/jsdelivr options for script tags)
- Add development instructions
- Format codebase with prettier and add ignore-revs, possibly add husky precommit hook
- Prepare for npm release (@qualified/ namespace?)
- Determine how to version the docs
- Determine where to host the docs (github pages? netlify?)
  - If we want to move it to netlify, something like https://www.npmjs.com/package/jsdoc-to-markdown might help
- Determine whether we can remove the /manager directory from the main codebase
- Run by legal before going public
- get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
- Add tests?
- Add CONTRIBUTING.md, LICENSE
- Flesh out this readme
- Use uglify to make minification closer to original: https://stackoverflow.com/questions/25956937/how-to-build-minified-and-uncompressed-bundle-with-webpack
