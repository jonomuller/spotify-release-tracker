const webpack = require('webpack');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'source-map',
  target: 'node',
  externals: ['aws-sdk'],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve('ts-loader'),
        options: {
          configFile: 'tsconfig.json',
          transpileOnly: true
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};
