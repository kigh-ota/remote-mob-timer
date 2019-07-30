module.exports = {
  entry: './src/webapp/index.tsx',
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { configFile: 'tsconfig.webapp.json' }
      }
    ]
  }
};
