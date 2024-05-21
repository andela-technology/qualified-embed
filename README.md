# Qualified Embed SDK

With Qualified Embed, you can now build advanced, developer-friendly coding products for education, recruiting, upskilling, and more. Our SDK makes it simple to embed code challenges and assessments into your existing products.

## Documentation

[Embed SDK docs](https://andela-technology.github.io/qualified-embed/docs)

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
    embedClientKey: "Your Embed key",
  },
});
const editor = manager.createEditor({
  challengeId: "An embedded challenge ID",
  node: document.querySelector("#qualified-embed-container"),
});
```

Optionally integrate this into your front end framework of choice (React, Vue, Angular, etc), then bundle the code using your favorite web bundler (Webpack, Vite, Parcel, etc).

See our [Embed with React demo](https://github.com/qualified/embed-demos/tree/master/react) for a complete example.

### Browser

You can use Qualified Embed in a script tag as follows:

```html
<script src="https://cdn.jsdelivr.net/gh/andela-technology/qualified-embed@dist/dist/embed.min.js"></script>
```

See our [quick start guide](https://andela-technology.github.io/qualified-embed/tutorial-challenges.html) and [demo page](https://github.com/qualified/embed-demos) for examples.
