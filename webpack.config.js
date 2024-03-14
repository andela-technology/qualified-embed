const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve("src", "embed.js"),
  output: {
    filename: "embed.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    {
      apply: compiler => {
        compiler.hooks.afterEmit.tap("CopyPublicHtml", () => {
          const fs = require("fs");
          fs.copyFileSync("./public/index.html", "./dist/index.html");
        });
      },
    },
  ],
};
