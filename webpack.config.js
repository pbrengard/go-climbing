var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
  entry: path.join(APP_DIR, 'index.js'),
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          "presets": ["react", "env"],
          "plugins": [["transform-runtime", {"polyfill": false}], "transform-class-properties"]
        }
      }
    ],
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
};

module.exports = config;
