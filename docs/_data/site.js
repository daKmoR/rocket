// eslint-disable-next-line import/no-extraneous-dependencies
const { getRocketValues } = require('@d4kmor/cli');

const defaultValues = getRocketValues();

module.exports = {
  ...defaultValues,
  name: 'Rocket',
  shortDesc: 'Rocket is the way to build fast static websites with a sprinkle of javascript',
  url: 'https://rocketjs.org',
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/dakmor/rocket',
    },
  ],
  helpUrl: 'https://github.com/daKmoR/rocket/issues',
  logoAlt: 'Rocket Logo',
  iconColorMaskIcon: '#3f93ce',
  iconColorMsapplicationTileColor: '#1d3557',
  iconColorThemeColor: '#1d3557',
  // analytics: 'UA-131782693-2', // modern web key
};
