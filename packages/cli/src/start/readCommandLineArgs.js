const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');

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

  return {
    pathPrefix: '/docs/',
    templatePathPrefix: '/packages/cli/demo/docs',
    ...rocketConfig,
    configDir: rocketArgs['config-dir'],
    dir: {
      includes: '../packages/cli/demo/docs/_includes/',
      data: '../packages/cli/demo/docs/_data/',
      ...rocketConfig.dir,
    },

    // command line args read from regular es-dev-server
    devServer: {
      ...rocketConfig.devServer,
      ...esDevServerConfig,
    },
  };
};
