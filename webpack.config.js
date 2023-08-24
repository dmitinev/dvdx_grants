const path = require('path')
// plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
// const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
//------------------------------
// directories
const destName = 'dist'
const sourceName = 'src'
const logoName = 'Logo.png'
//-------------------------------
//variables
const isDevMode = process.env.NODE_ENV === 'development'
const isProdMode = process.env.NODE_ENV === 'production'
//--------------------------
//----------multiple HTML Pages (uncomment if needed)
// const htmlPageNames = ['Blog'];
// const multipleHtmlPlugins = htmlPageNames.map(name => {
//   return new HTMLWebpackPlugin({
//     template: `${name}.html`,
//     filename: `${path.resolve(__dirname, destName)}/${name}.html`,
//     minify: isProdMode
//   })
// });
//--------------
// Functions
const optimizations = () => {
  const config = {
    splitChunks: {chunks: "all"},
  }
  if (isProdMode) {
    config.minimize = true
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 3 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
        //uncomment to generate and replace png files with webp
        // generator: [
        //   {
        //     type: "asset",
        //     implementation: ImageMinimizerPlugin.imageminGenerate,
        //     options: {
        //       plugins: ["imagemin-webp"],
        //     },
        //   },
        // ],
      }),
    ]
  }
  return config
}
const filename = (extension) => {
  return isDevMode ? `[name].${extension}` : `[name].[contenthash].${extension}`
}
const cssLoaders = (extraLoader) => {
  const config =
    [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      'css-loader',
      'postcss-loader'
    ]
  if (extraLoader) {
    config.push(extraLoader)
  }
  return config
}

const setBabelOptions = (additionalPreset) => {
  const opts = {
    presets: [['@babel/preset-env', {
      "useBuiltIns": "usage",
      "corejs": 3
    }]],
  }

  if (Array.isArray(additionalPreset)) {
    opts.presets.push(...additionalPreset)
  }

  if (typeof additionalPreset === 'string') {
    opts.presets.push(additionalPreset)
  }

  return opts
}

const plugins = () => {
  const list = [
    new HTMLWebpackPlugin({template: `index.html`, filename: `${path.resolve(__dirname, destName)}/index.html`,
      minify: {
        collapseWhitespace: isProdMode
      }
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      notify: false,
      server: { baseDir: [`${destName}`] }
    }),

    new CopyPlugin({
      patterns: [
        { from: `${path.resolve(__dirname, sourceName)}/img/`, to: `${path.resolve(__dirname, destName)}/img/`, noErrorOnMissing: false},
      ],
      options: {
        concurrency: 100,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `../css/${filename('css')}`
    }),
    new FaviconsWebpackPlugin({
      logo: `${path.resolve(__dirname, sourceName)}/img/${logoName}`,
      prefix: '',
      publicPath: '../img/icons',
      outputPath: "../img/icons",
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          windows: false,
          yandex: false
        }
      }
    })
    // uncomment to generate minimized webp assets from every image in jpeg/png formats
    // new ImageminWebpWebpackPlugin()
  ]//---------add here .concat(multipleHtmlPlugins)
  if (isDevMode) {
    list.push(new ESLintPlugin())
  }
  if (isProdMode) {
    list.push(new BundleAnalyzerPlugin())
  }
  return list
}
// ----------------

module.exports = {
  context: `${path.resolve(__dirname, sourceName)}`,
  entry: {
    main: `/js/index.js`,
    //you can add more entries for other HTML pages if needed (see htmlPageNames array)
    //otherEntry: `/js/otherEntry.js`,
  },
  output: {
    filename: filename("js"),
    path: `${path.resolve(__dirname, destName)}/js`,
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.xml', '.png'],
    alias: {
      '@JSModules': path.resolve(__dirname, sourceName, "js/modules")
    },
  },
  devtool: isDevMode ? 'eval-source-map' : "source-map",
  optimization: optimizations(),
  devServer: {
    hot: isDevMode,
    port: 3000,
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: '../img/[name][ext]'
        },
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: '../fonts/[name][ext]'
        }
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: setBabelOptions()
        },
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: {
          loader: "babel-loader",
          options: setBabelOptions("@babel/preset-typescript")
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
          options: setBabelOptions("@babel/preset-react")
        },
        exclude: /node_modules/
      },
      {
        test: /\.tsx$/,
        use: {
          loader: "babel-loader",
          options: setBabelOptions(["@babel/preset-typescript", "@babel/preset-react"])
        },
        exclude: /node_modules/
      },
    ]
  },
}