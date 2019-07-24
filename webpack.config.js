module.exports = {
  entry: './src/webapp/index.ts',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { configFile: 'tsconfig.webapp.json' }
      }
    ]
  }
};
