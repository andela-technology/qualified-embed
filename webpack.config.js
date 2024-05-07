const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    new HtmlWebpackPlugin({
      hash: false,
      template: path.resolve("public", "index.html"),
      filename: "index.html",
    }),
  ],
};
