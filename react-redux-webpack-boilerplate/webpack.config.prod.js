const path = require('path');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  context: path.join(__dirname, 'src'),
  entry: {
    vendor: ['react', 'react-dom'],
    app: './index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].[hash].js",
    publicPath: '/'
  },
  profile: true,
  performance: {
    maxAssetSize: 300000,
    maxEntrypointSize: 300000,
    hints: 'warning'
  },
  optimization: {
    // Tree shaking
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimize: true,
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {},
          ecma: undefined,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  stats: {
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m',
    },
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    // compression
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new ExtractTextPlugin({
      filename: 'styles-[hash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
      production: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new ScriptExtHtmlWebpackPlugin({
      sync: 'vendor',
      defaultAttribute: 'async',
    }),
    new FaviconsWebpackPlugin({
      logo: './public/logo.png',
      title: 'React redux boilerplate',
      prefix: 'favicons/',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),

    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'boilerplateApp',
        staticFileGlobsIgnorePatterns: [/dist\/.*\.html/]
      }
    ),
    new webpack.LoaderOptionsPlugin({
      'minimize': true
    })
  ],
  module: {
    rules: [
      {
        test: /(\.css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          }
        ]
      },
      {
        test: /(\.scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|webpack.config.js)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.(woff|woff2)$/, use: 'url?prefix=font/&limit=5000-loader' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url?limit=10000&mimetype=application/octet-stream-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url?limit=10000&mimetype=image/svg+xml-loader' }
    ]
  }
};