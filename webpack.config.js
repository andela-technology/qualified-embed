const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve("src", "embed.js"),
  output: {
    filename: "embed.min.js",
    path: path.resolve("dist"),
    library: {
      name: "QualifiedEmbed",
      type: "umd",
    },
  },
  devServer: {
    static: {
      directory: path.resolve("public"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("CopyPublicHtml", () => {
          const fs = require("fs");
          const src = path.resolve("public", "index.html");
          const dest = path.resolve("dist", "index.html");
          const destDir = path.resolve("dist");
          fs.rmSync(destDir, { recursive: true, force: true });
          fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(src, dest);
        });
      },
    },
  ],
};
