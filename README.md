# Qualified Embed SDK

With Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our SDK makes it simple to embed code challenges and assessments into your existing products.

## Documentation

[Embed SDK docs](https://andela-technology.github.io/qualified-embed/)

## Examples

- [Embed playground](https://www.qualified.io/embedded)
- [Advanced Embed demos](https://github.com/qualified/embed-demos)

## Usage

### Node

Install the dependency into your Node web project:

```
npm i @qualified/embed-sdk
```

Import the package and create an instance of the Embed manager:

```js
import { QualifiedEmbedManager } from "@qualified/embed-sdk";

const manager = QualifiedEmbedManager.init({
  options: {
    embedClientKey: "Your Embed key"
  }
});
const editor = manager.createEditor({
  challengeId: "An embedded challenge ID",
  node: document.querySelector("#qualified-embed-container"),
});
```

Optionally integrate this into your front end framework of choice (React, Vue, Angular, etc), then bundle the code using your favorite web bundler (Vite, Webpack, Parcel, etc).

See our [Embed with React demo](https://github.com/qualified/embed-demos/tree/master/react) for a complete example.

### Browser

You can use Qualified Embed in a script tag as follows:

```html
<script src=":replace with unpkg or jsdelivr url:"></script>
```

See our [quick start](https://andela-technology.github.io/qualified-embed/tutorial-challenges.html) and [demo page](https://github.com/qualified/embed-demos) for examples.

## Development

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
npm i # install dependencies
npm run dev # run a development server
npm run build # bundle the manager to /dist
npm run jsdoc # bundle the docs to /docs
npm run lint # run eslint
npm run format # run prettier
```

If you're adjusting Embed internals in the Qualified codebase, update `baseURL` in the Embed options in <public/index.html> to `http://localhost:3001` (or the port the Qualified UI Docker container is running on).

### Deploying the Package

The package is hosted on npm.

```bash
npm publish
```

### Deploying the Docs

The [docs](https://andela-technology.github.io/qualified-embed/) are hosted on GitHub pages.

```bash
git checkout docs
npm run jsdoc
git add -f docs
git commit -m "Deploy docs"
git push
```

## Contributing

Issues and pull requests are welcome. Please lint and format all contributions with `npm run lint` and `npm run format` before submitting a pull request.
