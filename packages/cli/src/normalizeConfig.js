/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

/** @typedef {import('../types/main').RocketCliOptions} RocketCliOptions */
/** @typedef {import('@web/dev-server').DevServerConfig} DevServerConfig */

import path from 'path';

import { readConfig } from '@web/config-loader';

import { RocketStart } from './RocketStart.js';
import { RocketBuild } from './RocketBuild.js';
import { eleventyConfigEmpty } from './shared/eleventyConfigEmpty.js';

/**
 * @param {*} localConfig
 */
function getEleventyConfig(localConfig) {
  let eleventyConfig = {
    config: localConfig.eleventy || {},
    function: localConfig.eleventyFunction || function () {},
  };
  if (typeof localConfig.eleventy === 'function') {
    eleventyConfig.config = localConfig.eleventy(eleventyConfigEmpty);
    eleventyConfig.function = localConfig.eleventy;
    delete localConfig.eleventy;
  }
  return eleventyConfig;
}

/**
 *
 * @param {*} config
 * @param {*} eleventyConfig
 * @param {*} localConfig
 */
function mergeEleventyConfigs(config, eleventyConfig, localConfig = {}) {
  const oldConfig = { ...config };

  const oldEleventyFunction = config.eleventyFunction;
  config = {
    ...config,
    ...localConfig,
    // @ts-ignore
    eleventyFunction: (...args) => {
      oldEleventyFunction(...args);
      eleventyConfig.function(...args);
    },
  };

  if (eleventyConfig.config) {
    if (eleventyConfig.config.dir) {
      config.eleventy = {
        ...oldConfig.eleventy,
        ...eleventyConfig.config,
        dir: {
          ...oldConfig.eleventy.dir,
          ...eleventyConfig.config.dir,
        },
      };
    } else {
      config.eleventy = {
        ...oldConfig.eleventy,
        ...eleventyConfig.config,
      };
    }
  }
  return config;
}

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
    },
    eleventyFunction: () => {},
  };

  if (!config.configDir) {
    throw new Error('You need to provide a configDir');
  }

  try {
    const fileConfig = await readConfig('rocket.config', undefined, path.resolve(config.configDir));
    if (fileConfig) {
      config = mergeEleventyConfigs(config, getEleventyConfig(fileConfig), fileConfig);
    }
  } catch (error) {
    console.error('Could not read rocket config file', error);
    // we do not require a config file
  }

  if (!config.configDir) {
    throw new Error('You can not set the configDir in the rocket.config.js');
  }

  if (config.themes) {
    config.themes.forEach(theme => {
      config = mergeEleventyConfigs(config, getEleventyConfig(theme));
    });
  }

  /** @type {Partial<DevServerConfig>} */
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
    pathPrefix: '/_site-dev', // pathPrefix can NOT have a '/' at the end as it will mean it may get ignored by 11ty 🤷‍♂️
    watch: true,
    outputDir: '_site-dev',
    // @ts-ignore
    devServer,

    ...config,

    build: {
      outputDir: '_site',
      pathPrefix: '',
      ...config.build,
    },

    configDir: config.configDir,
    _configDirCwdRelative,
    inputDir,
    _inputDirConfigDirRelative,
  };
}
