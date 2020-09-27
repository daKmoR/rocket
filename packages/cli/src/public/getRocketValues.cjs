const path = require('path');
const fs = require('fs');
const urlFilter = require('@11ty/eleventy/src/Filters/Url.js');
const { getComputedConfig } = require('./computedConfig.cjs');

function chooseFile(userPath, config) {
  const userPathParts = userPath.split('/');

  // console.log({
  //   inputDir: config.inputDir,
  //   userPathParts,
  // });

  const finalUserPath = path.join(config.inputDir, ...userPathParts);
  if (fs.existsSync(finalUserPath)) {
    return {
      path: finalUserPath,
      url: urlFilter(path.join('/', ...userPathParts)),
    };
  }

  const finalFallbackPath = path.join(config.themePath, ...userPathParts);
  if (fs.existsSync(finalFallbackPath)) {
    return {
      path: finalFallbackPath,
      url: path.join('/', config.templatePathPrefix, ...userPathParts),
    };
  }

  return {
    path: '',
    url: '',
  };
}

async function getRocketValues() {
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

  const config = getComputedConfig();
  const logo = chooseFile('_assets/logo.svg', config);
  const homeBackground = chooseFile('_assets/home-background.svg', config);
  const logoColor = chooseFile('_assets/logo-color.svg', config);
  const cssVariables = chooseFile('_assets/variables.css', config);
  const cssStyle = chooseFile('_assets/style.css', config);
  const htmlHead = chooseFile('_assets/head.html', config);

  return {
    url,
    logoPath: logo.path,
    logoUrl: logo.url,
    logoColorPath: logoColor.path,
    logoColorUrl: logoColor.url,
    cssVariablesPath: cssVariables.path,
    cssVariablesUrl: cssVariables.url,
    cssStylePath: cssStyle.path,
    cssStyleUrl: cssStyle.url,
    homeBackgroundPath: homeBackground.path,
    homeBackgroundUrl: homeBackground.url,
    htmlHeadPath: htmlHead.path,
    htmlHeadUrl: htmlHead.url,
    newsletter: false,
    socialMediaImage: '/_assets/social-media-image.jpg',
  };
}

module.exports = {
  getRocketValues,
};
