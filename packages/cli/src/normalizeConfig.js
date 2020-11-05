import path from 'path';

import { readConfig } from '@web/config-loader';

import { RocketStart } from './RocketStart.js';
import { RocketBuild } from './RocketBuild.js';

/** @typedef {import('./types').RocketCliOptions} RocketCliOptions */

/**
 * @param {Partial<RocketCliOptions>} inConfig
 * @returns {Promise<RocketCliOptions>}
 */
export async function normalizeConfig(inConfig) {
  let config = {
    themes: [],
    setupUnifiedPlugins: [],
    plugins: [new RocketStart(), new RocketBuild()],
    ...inConfig,
    eleventy: {
      dir: {
        data: '_merged_data',
        includes: '_merged_includes',
      },
      ...inConfig.eleventy,
    },
  };
  if (!config.configDir) {
    throw new Error('You need to provide a configDir');
  }

  try {
    const fileConfig = await readConfig('rocket.config', undefined, path.resolve(config.configDir));
    config = { ...config, ...fileConfig }; //  deepmerge(config, fileConfig);
  } catch (error) {
    console.error('Could not read rocket config file', error);
    // we do not require a config file
  }

  if (!config.configDir) {
    throw new Error('You can not set the configDir in the rocket.config.js');
  }

  const devServer = {
    rootDir: process.cwd(),
    ...config.devServer,
  };

  config.configDir = path.resolve(config.configDir);
  const _configDirCwdRelative = path.relative(process.cwd(), config.configDir);

  const inputDir = path.join(_configDirCwdRelative, './docs');
  const _inputDirConfigDirRelative = path.relative(config.configDir, inputDir);

  config._themePathes = [];
  for (const theme of config.themes) {
    config._themePathes.push(theme.path);

    if (theme.setupUnifiedPlugins) {
      config.setupUnifiedPlugins = [...config.setupUnifiedPlugins, ...theme.setupUnifiedPlugins];
    }

    if (theme.setupPlugins) {
      config.plugins = theme.setupPlugins(config.plugins);
    }
  }
  // add "local" theme
  config._themePathes.push(path.resolve(inputDir));
  // execute setupPlugins of local rocket config file
  if (config.setupPlugins) {
    config.plugins = config.setupPlugins(config.plugins);
  }

  // dev Server needs the paths to be absolute to the server root
  if (config.devServer && config.devServer.rootDir) {
    devServer.rootDir = config.devServer.rootDir;
  }

  return {
    command: 'help',
    // pathPrefix can NOT have a '/' at the end as it will mean it may get ignored by 11ty 🤷‍♂️
    pathPrefix: '/_site-dev',
    ...config,
    configDir: config.configDir,
    _configDirCwdRelative,
    inputDir,
    _inputDirConfigDirRelative,
    outputDir: '_site-dev',
    watch: true,
    eleventy: config.eleventy,

    devServer,
    build: {
      outputDir: '_site',
      pathPrefix: '',
    },
  };
}
