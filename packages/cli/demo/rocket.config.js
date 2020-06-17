module.exports = {
  inputDir: './docs',
  outputDir: './_site',
  devServer: {
    rootDir: '../../',
  },
  rollup: config => {
    return config;
  },
  eleventy: config => {
    return config;
  },
};
