module.exports = {
  entry: {
    index: './src/static/index.tsx',
    timer: './src/static/timer.tsx',
  },
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/public/javascripts',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'], // without 'json', growl causes compile error
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead',
                },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
};
