// pathPrefix = '/packages/cli/demo/docs/';
// includesDir = './_includes/';
// dataDir = './_data/';
// templatePathPrefix = pathPrefix;

module.exports = {
  dir: {
    includes: './_includes/',
    data: './_data/',
  },
  pathPrefix: '/packages/cli/demo/docs/',
  templatePathPrefix: '/packages/cli/demo/docs/',
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
