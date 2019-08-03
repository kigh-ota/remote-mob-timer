module.exports = {
  entry: './src/webapp/index.tsx',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'], // without 'json', growl causes compile error
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { configFile: 'tsconfig.webapp.json' }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  }
};
