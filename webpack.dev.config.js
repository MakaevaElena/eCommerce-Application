const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: {
      app: {
        name: 'chrome',
      }
    },
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    compress: true,
    port: 4000,
    historyApiFallback: true,
  }
};
