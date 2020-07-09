/* eslint-disable import/no-dynamic-require, global-require */
const commandLineArgs = require('command-line-args');

module.exports = function readCommandLineArgs() {
  const optionDefinitions = [
    {
      name: 'config-dir',
      alias: 'c',
      type: String,
      defaultValue: '.',
      description: 'Location of rocket configuration',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const args = commandLineArgs(optionDefinitions, { partial: true });

  return {
    configDir: args['config-dir'],
  };
};
