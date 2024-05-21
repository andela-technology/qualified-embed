# TODO

- get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
- update default baseUrl in generated embed examples to point to latest CDN
- add TS and typechecking the JSDocs, as well as emit types
- Remove the embed/manager directory and relevant gulp stuff from the main codebase
- add jsdoc dev server with hot reloading
- Update SDK docs to show Node usage, and update browser usage with the new QualifiedEmbed prefix.
- Mock CR requests in tests
- Add husky precommit hook to run linting and prettier

## Lower priority

- Add LICENSE
- could add prettier action: https://github.com/marketplace/actions/prettier-action
- determine whether obfuscateId needs to be replaced or what's going on with that. might need to move this server-side and change it now that it's in git history. Update: it's actually in the docs: <https://www.qualified.io/embed/api-docs/global.html#obfuscateId__anchor>. So maybe not such a concern after all.
- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- break out config from index.html to JSON file and have webpack load the JSON and inject it into index.html
- Add console.warn to https://www.qualified.io/embed.js to indicate it's deprecated
