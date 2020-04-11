const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const srcPath = path.join(__dirname, 'src')
const clientPath = path.join(__dirname, 'dist', 'client')
const serverPath = path.join(__dirname, 'dist', 'server')

const mode = 'development'
const context = srcPath
const rules = [
  {
    test: /\.js$/,
    include: srcPath,
    use: 'babel-loader',
  },
  {
    test: /\.(png|wav)$/,
    use: 'file-loader',
  },
]

module.exports = [
  {
    mode,
    context,
    entry: './client',
    output: {
      path: clientPath,
      publicPath: process.env.PUBLIC_PATH || '/',
      filename: '[name].[contenthash].js',
    },
    module: { rules },
    devServer: { overlay: true },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: `Player One`,
        template: './static/index.html',
      }),
      new webpack.ProvidePlugin({
        Stage: 'stage-js/platform/web',
      }),
      new webpack.EnvironmentPlugin({
        SERVER_URL: 'ws://localhost:8081',
      }),
    ],
  },
  {
    mode,
    context,
    entry: './server',
    output: { path: serverPath },
    module: { rules },
    plugins: [new CleanWebpackPlugin()],
    target: 'node',
    externals: [nodeExternals()],
  },
]
