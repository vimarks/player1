const webpack = require('webpack')

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Stage: 'stage-js/platform/web',
    }),
    new webpack.EnvironmentPlugin({
      SERVER_URL: 'ws://localhost:8081',
    }),
  ],
  devServer: {
    contentBase: 'dist',
  },
}
