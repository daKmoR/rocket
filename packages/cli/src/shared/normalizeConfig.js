const fs = require('fs');
const path = require('path');
const { resolvedNodePackagePath } = require('./resolvedNodePackagePath.js');

function normalizeConfig(inConfig) {
  const rocketFilePath = path.join(process.cwd(), inConfig.configDir, 'rocket.config.js');

  let config = { devServer: {} };
  if (fs.existsSync(rocketFilePath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    config = require(rocketFilePath);
    config.devServer = config.devServer || {};
  }

  const devServer = {
    ...config.devServer,
    ...inConfig.devServer,
  };

  const inputDir = path.join(inConfig.configDir, './docs');

  const absIncludes = resolvedNodePackagePath('@dakmor/launch/_includes/');
  const absData = resolvedNodePackagePath('@dakmor/launch/_data/');
  // 11ty always wants a relative path to inputDir - why?
  const includes = path.relative(inputDir, absIncludes);
  const data = path.relative(inputDir, absData);

  // dev Server needs the paths to be absolute to the server root
  const devServerRootDir = devServer.rootDir ? devServer.rootDir : process.cwd();
  const absTemplatePrefix = resolvedNodePackagePath('@dakmor/launch/');
  const templatePathPrefix = path.join('/', path.relative(devServerRootDir, absTemplatePrefix));

  return {
    pathPrefix: '/docs/',
    templatePathPrefix,
    ...config,
    configDir: inConfig.configDir,
    inputDir,
    dir: {
      includes,
      data,
      ...config.dir,
    },

    // command line args read from regular es-dev-server
    devServer,
  };
}

module.exports = { normalizeConfig };
