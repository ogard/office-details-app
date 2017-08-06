/* eslint-disable import/no-extraneous-dependencies */

const version = require('./package.json').version;
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const AnyBarWebpackPlugin = require('anybar-webpack');


module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    'webpack-hot-middleware/client?reload=true',
    './src/client'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new AnyBarWebpackPlugin({ enableNotifications: true }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        // exclude: /node_modules/,
        include: path.join(__dirname, 'src/client'),
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
    postcss: () => [autoprefixer({ browsers: ['last 2 versions'] })],
  }
}
