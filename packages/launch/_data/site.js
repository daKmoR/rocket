const { getRocketValues } = require('@d4kmor/cli');

const defaultValues = getRocketValues();

module.exports = {
  name: 'Rocket',
  shortDesc: 'Rocket is the way to build fast static websites with a sprinkle of javascript',
  url: defaultValues.url,
  githubUrl: 'https://github.com/dakmor/rocket',
  helpUrl: 'https://github.com/daKmoR/rocket/issues',
  logo: {
    url: defaultValues.logoUrl,
    alt: 'Rocket Logo',
  },
  cssUrls: {
    variables: defaultValues.cssVariablesUrl,
    style: defaultValues.cssStyleUrl,
  },
};
