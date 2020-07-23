const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');
const urlFilter = require('@11ty/eleventy/src/Filters/Url.js');

const { normalizeConfig } = require('../shared/normalizeConfig.js');

function selectPath(userPath, defaultPath = false) {
  return fs.existsSync(userPath) ? userPath : defaultPath;
}

function getRocketValues() {
  let url = '/';

  // handling netlify previews
  switch (process.env.CONTEXT) {
    case 'production':
      url = process.env.URL;
      break;
    case 'deploy-preview':
      url = process.env.DEPLOY_URL;
      break;
    case 'branch-deploy':
      url = process.env.DEPLOY_PRIME_URL;
      break;
    /* no default */
  }

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
  const commandLineConfig = {
    configDir: rocketArgs['config-dir'],
  };
  const config = normalizeConfig(commandLineConfig);

  // User logo at _assets/logo.svg
  const userLogoPath = path.join(config.inputDir, '_assets', 'logo.svg');
  const defaultLogoPath = path.join('/', config.templatePathPrefix, '_assets', 'logo.svg');
  let logoPath = defaultLogoPath;
  let logoUrl = defaultLogoPath;
  if (fs.existsSync(userLogoPath)) {
    logoUrl = urlFilter(path.join('/', '_assets', 'logo.svg'));
    logoPath = userLogoPath;
  }

  // User home background at _assets/home-background.svg
  const homeBackgroundPath = selectPath(
    path.join(config.inputDir, '_assets', 'home-background.svg'),
  );

  // User CSS variables at _assets/variables.css
  const userCssVariablesPath = path.join(config.inputDir, '_assets', 'variables.css');
  const defaultCssVariablesPath = path.join(
    '/',
    config.templatePathPrefix,
    '_assets',
    'variables.css',
  );
  const cssVariablesUrl = fs.existsSync(userCssVariablesPath)
    ? urlFilter(path.join('/', '_assets', 'variables.css'))
    : defaultCssVariablesPath;

  // User CSS at _assets/style.css
  const userCssStylePath = path.join(config.inputDir, '_assets', 'style.css');
  const cssStyleUrl = fs.existsSync(userCssStylePath)
    ? urlFilter(path.join('/', '_assets', 'style.css'))
    : '';

  return {
    url,
    logoPath,
    logoUrl,
    cssVariablesUrl,
    cssStyleUrl,
    homeBackgroundPath,
    newsletter: false,
  };
}

module.exports = {
  getRocketValues,
};
