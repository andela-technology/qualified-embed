# Critical for initial release

- Update default `baseUrl` in generated embed examples to point to latest CDN in main Qualified codebase.
- Remove the embed/manager directory and relevant gulp stuff from the main codebase.
- Update SDK docs to show Node usage, and update browser usage with the new QualifiedEmbed prefix and JSDelivr links.

## Lower priority

- add jsdoc dev server with hot reloading
- add TS and typechecking the JSDocs, as well as emit types
- get webpack to build for browser module imports as well as script tags (or rely on unpkg?)
- Mock CR requests in tests
- Add LICENSE
- could add prettier action: https://github.com/marketplace/actions/prettier-action
- determine whether obfuscateId needs to be replaced or what's going on with that. might need to move this server-side and change it now that it's in git history. Update: it's actually in the docs: <https://www.qualified.io/embed/api-docs/global.html#obfuscateId__anchor>. So maybe not such a concern after all.
- Simplify classes `window.QualifiedEmbed.QualifiedEmbedManager.init({` -> `new window.QualifiedEmbed.Manager({`.
- break out config from index.html to JSON file and have webpack load the JSON and inject it into index.html
- Add console.warn to legacy https://www.qualified.io/embed.js to indicate it's deprecated
