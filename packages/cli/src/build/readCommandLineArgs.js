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
    {
      name: 'mode',
      alias: 'm',
      type: String,
      defaultValue: 'full',
      description: 'What build to run [full, site, optimize]',
    },
    { name: 'help', type: Boolean, description: 'See all options' },
  ];

  const args = commandLineArgs(optionDefinitions, { partial: true });

  return {
    configDir: args['config-dir'],
    mode: args.mode,
  };
};
