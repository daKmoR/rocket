const { getRocketValues } = require('@d4kmor/cli');

module.exports = async function () {
  const defaultValues = await getRocketValues();
  return {
    ...defaultValues,
    name: 'Rocket',
    description: 'Rocket is the way to build fast static websites with a sprinkle of javascript',
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
};
