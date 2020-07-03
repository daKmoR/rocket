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
  const rocketDir = path.dirname(rocketFilePath);

  let rocketJs = { esDevServer: {} };
  if (fs.existsSync(rocketFilePath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    rocketJs = require(rocketFilePath);
    if (rocketJs.files) {
      rocketJs.files = typeof rocketJs.files === 'string' ? [rocketJs.files] : rocketJs.files;
      rocketJs.files = rocketJs.files.map(entry => path.join(rocketDir, entry));
    }
    rocketJs.esDevServer = rocketJs.esDevServer || {};
  }

  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: '.',
      description: 'Location of storybook configuration',
    },
    {
      name: 'files',
      defaultValue: rocketJs.files || './files/*.files.{js,mdx}',
      description: 'List of story files e.g. --files files/*.files.\\{js,mdx\\}',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];
  // console.log(cliOptions);

  const rocketArgs = commandLineArgs(cliOptions, { partial: true });
  rocketArgs.files = typeof rocketArgs.files === 'string' ? [rocketArgs.files] : rocketArgs.files;

  if ('help' in rocketArgs) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'rocket-start',
          content: `
          rocket start command. Wraps the es-dev-server, adding rocket specific functionality. All regular es-dev-server commands are available.

          Usage: \`rocket-start [options...]\`
        `.trim(),
        },
        {
          header: 'rocket options',
          optionList: cliOptions,
        },
        {
          header: 'es-dev-server options',
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
    files: rocketArgs.files,
    configDir: rocketArgs['config-dir'],
    setupMdjsPlugins: rocketJs.setupMdjsPlugins,
    // command line args read from regular es-dev-server
    esDevServer: esDevServerConfig,
  };
};
