const path = require('path');
const webpack = require('webpack');
const SystemBellPlugin = require('system-bell-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');

const cwd = process.cwd();
const config = {
  mode: 'development',
  // 入口文件
  entry:{
    app: [
      'webpack-hot-middleware/client?overlay=true',
      'react-hot-loader/patch',
      path.join(cwd,'./src/index.js'),
    ]
  },

  // 编译后的文件
  output: {
    // 所有输出文件的目标路径
    // 必须是绝对路径
    path: path.join(__dirname,'./dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        //本地调试直接将样式放到输入文件中就可以了
        use: [
          'style-loader',
          // {
          //   loader:"postcss-loader",
          //   options: { // 如果没有options这个选项将会报错 No PostCSS Config found
          //     plugins: [
          //       autoprefixer({
          //           browsers: ['last 5 version']
          //       })
          //     ]
          //   }
          // },
          'css-loader',
          'sass-loader',
        ]
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

  devtool: 'eval',
    // 插件
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 强制区分各文件的大小写
    new CaseSensitivePathsPlugin(),

    new SystemBellPlugin(),
    // 环境变量设置
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  optimization:{
    noEmitOnErrors: true,
  },

  // 禁止性能提示
  performance: {
    hints: false,
  },
}

module.exports = config;
