const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const cwd = process.cwd();
const config = {
  mode: 'production',
  // 入口文件
  entry:{
    app: [
      path.join(cwd,'./src/index.js'),
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react'
    ],
  },

  // 编译后的文件
  output: {
    // 所有输出文件的目标路径
    // 必须是绝对路径
    path: path.join(cwd,'./dist'),
    filename: 'js/[name].js',
    publicPath: '/',
    // 非主入口文件的输出名称
    chunkFilename: 'js/[name].js', 
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract({
            use: [
                {
                    loader: 'css-loader',
                    options: {
                      minimize: true,
                      sourceMap: false,
                    }
                },
                {
                    loader:"postcss-loader",
                    options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
                        plugins: [
                            autoprefixer({
                                browsers: ['last 5 version']
                            })
                        ]
                    }
                },
                'sass-loader',
            ],
            fallback: 'style-loader',         //当css没被提取成额外的css文件时，调用这个
            // publicPath: './dist/css/'
        })
    },
      {
        test: /\.js[x]?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4196,
              name: 'img/[name].[ext]?[hash:7]',
              publicPath: '../'
            },
          },
        ],
      },
    ],
  },

   // 解析
   resolve: {
    //  
    alias: {
      utils: path.join(cwd, './src/utils'),
      models: path.join(cwd, './src/models'),
      routes: path.join(cwd, './src/routes'),
      services: path.join(cwd, './src/services'),
      '@': path.join(cwd, './src/assets'),
      components: path.join(cwd, './src/components'),
      container: path.join(cwd, './src/container'),
      common: path.join(cwd, './src/common'),
      layouts: path.join(cwd, './src/layouts'),
    },
    enforceExtension: false, // 无需扩展名
    extensions: ['.jsx', '.json', '.js', '.scss', '.vue'],
  },
    // 插件
  plugins: [
    // 压缩
    // new webpack.optimize.UglifyJsPlugin(),
    // 编译出错时 可以跳过输出阶段， 确保输出资源不会包含错误,4.0之后optimization.noEmitOnErrors默认有
    // new webpack.NoEmitOnErrorsPlugin(),
    // 提取css
    // 提取公有包
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['lib', 'manifest']
    // }),
    new ExtractTextPlugin('css/[name].css'),

    // 环境变量设置
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  optimization:{
    // 提取公有包
    splitChunks:{
      minSize: 1,
      chunks: "initial",
      name:"vendor"
    },
    minimize: true,
    // runtimeChunk: false
  },

  // 禁止性能提示
  performance: {
    hints: 'warning',
  },
}

module.exports = config;
