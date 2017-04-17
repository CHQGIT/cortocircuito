const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const reactToolboxVariables = {
  'color-text': '#444548',
  /* Note that you can use global colors and variables */
  'color-primary': 'var(--palette-red-500)',
  'button-height': '30px',
};

const settings = {
  entry: {
    bundle: [
      "react-hot-loader/patch",
      "./src/index.js",
      "./src/css/toolbox/theme.js"
    ]
  },
  output: {
    filename: "[name].js",
    publicPath: "/",
    path: path.join(path.join(__dirname, 'dist'), 'js'),
    libraryTarget: "amd",
  },
  resolve: {
    //extensions: [".js", ".json", ".css"]
    extensions: ['.scss', '.css', '.js', '.json','.webpack.js', '.web.js', '.js', '.jsx']

  },
  //devtool: 'inline-source-map',
  devtool: 'source-map',
  module: {
    rules: [
      {
        //test: /\.js?$/,
         test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ["es2015", { modules: false }],
            "stage-2", "stage-1",
            "react"
          ],
          plugins: [
            "transform-node-env-inline"
          ],
          env: {
            development: {
              plugins: ["react-hot-loader/babel"]
            }
          }
        }
      },
      {
      //  test: /\.css$/,
      test: /(\.scss|\.css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader" // has separate config, see postcss.config.js nearby
        ]
      }
    ]
  },
  externals: [
      function(context, request, callback) {
          if (/^dojo/.test(request) ||
              /^dojox/.test(request) ||
              /^dijit/.test(request) ||
              /^esri/.test(request)
          ) {
              return callback(null, "amd " + request);
          }
          callback();
      }
  ],
  devServer: {
  //  contentBase: path.resolve("src/www"),
  //  publicPath: "http://localhost:8080/", // full URL is necessary for Hot Module Replacement if additional path will be added.
  /*  quiet: false,
    hot: true,
    port: 443,
    host: "127.0.0.1",

    historyApiFallback: true,
    inline: true
    */

    inline: true,
    port: 443,
    host: "127.0.0.1",
    historyApiFallback: true

  },
  plugins: [

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '../'),
        postcss () {
          return [
            require('postcss-import')({
              root: path.join(__dirname, '../src'),
              path: [path.join(__dirname, '../src/components')]
            }),
            require('postcss-mixins')(),
            require('postcss-each')(),
            require('postcss-cssnext')({
              features: {
                customProperties: {
                  variables: reactToolboxVariables,
                },
              }
            }),
            require('postcss-reporter')({
              clearMessages: true
            })
          ];
        }
      }
    }),
    new ExtractTextPlugin({ filename: 'spec.css', allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
};

module.exports = settings;
