const path = require('path');
const webpack = require('webpack');

const settings = {
  entry: {
    bundle: [
      "react-hot-loader/patch",
      "./src/index.js"
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
      },
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
  ],
};

module.exports = settings;