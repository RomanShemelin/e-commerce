const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const buildPath = path.resolve(__dirname, "build");
const srcPath = path.resolve(__dirname, "src");
const htmlPath = path.resolve(__dirname, "public", "index.html");

const isProd = process.env.NODE_ENV === "production";

const getSettingsForStyles = (withModules = false) => {
  return [
    MiniCssExtractPlugin.loader,
    !withModules
      ? "css-loader"
      : {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: !isProd
                ? "[path][name]__[local]"
                : "[contenthash:base64]",
            },
          },
        },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["autoprefixer"],
        },
      },
    },
    "sass-loader",
  ];
};

module.exports = {
  entry: path.join(srcPath, "index.tsx"),
  target: !isProd ? "web" : "browserslist",
  devtool: !isProd ? "inline-source-map" : undefined,
  output: {
    path: buildPath,
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: htmlPath,
    }),
    new webpack.ProgressPlugin(),
    !isProd && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
    }),
    new TsCheckerPlugin(),
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.module\.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: getSettingsForStyles(),
      },
      {
        test: /\.[tj]sx?$/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".jsx", ".js", ".ts"],
    alias: {
      "@pages": path.join(srcPath, "pages"),
      "@components": path.join(srcPath, "components"),
      "@icons": path.join(__dirname, "public", "icons"),
      "@configs": path.join(srcPath, "configs"),
      "@styles": path.join(srcPath, "styles"),
      "@utils": path.join(srcPath, "utils"),
      "@store": path.join(srcPath, "store"),
    },
  },

  devServer: {
    host: "localhost",
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};
