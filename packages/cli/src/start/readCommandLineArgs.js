const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  readCommandLineArgs: esDevServerCommandLineArgs,
  commandLineOptions: esDevServerCliOptions,
} = require('es-dev-server');

module.exports = function readCommandLineArgs() {
  const cliOptions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: '.',
      description: 'Location of rocket configuration',
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
    configDir: rocketArgs['config-dir'],

    // command line args read from regular es-dev-server
    devServer: esDevServerConfig,
  };
};
