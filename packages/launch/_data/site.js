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

module.exports = {
  name: 'Rocket',
  shortDesc: 'Rocket is the way to build fast static websites with a sprinkle of javascript',
  url,
  githubUrl: 'https://github.com/dakmor/rocket',
  helpUrl: 'https://github.com/daKmoR/rocket/issues',
  logo: {
    path: '/_assets/logo.svg',
    alt: 'Rocket Logo',
  },
};
