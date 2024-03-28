const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve("src", "embed.js"),
  output: {
    filename: "embed.min.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "QualifiedEmbed",
      type: "umd",
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    {
      apply: compiler => {
        compiler.hooks.afterEmit.tap("CopyPublicHtml", () => {
          const fs = require("fs");
          const src = path.join(__dirname, "public", "index.html");
          const dest = path.join(__dirname, "dist", "index.html");
          fs.copyFileSync(src, dest);
        });
      },
    },
  ],
};
