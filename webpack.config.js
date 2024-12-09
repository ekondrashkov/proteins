const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const { DefinePlugin } = require("webpack")

const NODE_ENV = process.env.NODE_ENV
const IS_DEV = NODE_ENV === "development"
const IS_PROD = NODE_ENV === "production"
const GLOBAL_CSS_REGEXP = /\.global\.css$/

function setupDevTool() {
  if (IS_DEV) {
    return "eval"
  }

  if (IS_PROD) {
    return false
  }
}

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  mode: NODE_ENV ? NODE_ENV : "development",
  entry: path.resolve(__dirname, "src/index.jsx"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts|tsx|jsx)$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|jpe?g|gif|woff)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
        exclude: GLOBAL_CSS_REGEXP,
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({ template: path.resolve(__dirname, "index.html") }),
    new DefinePlugin({ "process.env.FIREBASE_KEY": `'${process.env.FIREBASE_KEY}'` })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: IS_DEV,
  },
  devtool: setupDevTool(),
}
