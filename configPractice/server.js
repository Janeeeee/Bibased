const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./config/webpack.config');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

// app.use('/', express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(7777, 'localhost', function(err) {
  if (err) {
      return;
  }
  console.log('Listening at http://localhost:7777');
});