const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');

function resolvedNodePackagePath(resolvePath) {
  const hasNamespace = resolvePath.includes('@');
  const parts = resolvePath.split(path.sep);
  const pkgName = hasNamespace ? path.join(parts[0], parts[1]) : parts[0];
  parts.shift();
  if (hasNamespace) {
    parts.shift();
  }
  const purePath = path.join(...parts);
  const pkgJson = require.resolve(path.join(pkgName, 'package.json'));
  const pkgRoot = path.dirname(pkgJson);
  // console.log({ pkgName, pkgJson, purePath, pkgRoot, del: path.sep });
  return path.join(pkgRoot, purePath);
}

module.exports = function readCommandLineArgs() {
  const tmpConfig = commandLineArgs(
    [
      {
        name: 'config-dir',
        alias: 'c',
        type: String,
        defaultValue: '.',
      },
    ],
    { partial: true },
  );
  const rocketFilePath = path.join(process.cwd(), tmpConfig['config-dir'], 'rocket.config.js');

  let rocketConfig = { devServer: {} };
  if (fs.existsSync(rocketFilePath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    rocketConfig = require(rocketFilePath);
    rocketConfig.devServer = rocketConfig.devServer || {};
  }

  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: '.',
      description: 'Location of storybook configuration',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const rocketArgs = commandLineArgs(cliOptions, { partial: true });

  if ('help' in rocketArgs) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'rocket-start',
          content: `
          rocket start command. Wraps the dev-server, adding rocket specific functionality. All regular dev-server commands are available.

          Usage: \`rocket-start [options...]\`
        `.trim(),
        },
        {
          header: 'rocket options',
          optionList: cliOptions,
        },
        {
          header: 'dev-server options',
          content: '',
          optionList: esDevServerCliOptions,
        },
      ]),
    );
    process.exit();
  }
  const esDevServerConfig = esDevServerCommandLineArgs(rocketArgs._unknown || [], {
    defaultConfigDir: rocketArgs['config-dir'],
  });

  const devServer = {
    ...rocketConfig.devServer,
    ...esDevServerConfig,
  };

  const inputDir = path.join(rocketArgs['config-dir'], './docs');

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
    ...rocketConfig,
    configDir: rocketArgs['config-dir'],
    inputDir,
    dir: {
      includes,
      data,
      ...rocketConfig.dir,
    },

    // command line args read from regular es-dev-server
    devServer,
  };
};
