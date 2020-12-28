/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */

/** @typedef {import('plugins-manager').MetaPlugin} MetaPlugin */
/** @typedef {import('@web/dev-server').DevServerConfig} DevServerConfig */

/** @typedef {import('../types/main').RocketCliOptions} RocketCliOptions */
/** @typedef {import('../types/main').RocketPlugin} RocketPlugin */

import path from 'path';

import { readConfig } from '@web/config-loader';

import { RocketStart } from './RocketStart.js';
import { RocketBuild } from './RocketBuild.js';

/**
 * @param {Partial<RocketCliOptions>} inConfig
 * @returns {Promise<RocketCliOptions>}
 */
export async function normalizeConfig(inConfig) {
  let config = {
    configDir: process.cwd(),
    themes: [],
    setupUnifiedPlugins: [],
    setupDevAndBuildPlugins: [],
    setupDevPlugins: [],
    setupBuildPlugins: [],
    setupEleventyPlugins: [],
    setupCliPlugins: [],
    eleventy: () => {},
    ...inConfig,

    devServer: {
      rootDir: process.cwd(),
      ...inConfig.devServer,
    },
  };

  let userConfigFile;
  if (config.configFile) {
    const pathParts = path.parse(path.resolve(config.configFile));
    config.configDir = pathParts.dir;
    userConfigFile = pathParts.base;
  }

  try {
    const fileConfig = await readConfig(
      'rocket.config',
      userConfigFile,
      path.resolve(config.configDir),
    );
    if (fileConfig) {
      config = {
        ...config,
        ...fileConfig,
        build: {
          ...config.build,
          ...fileConfig.build,
        },
        devServer: {
          ...config.devServer,
          ...fileConfig.devServer,
        },
      };
    }
  } catch (error) {
    console.error('Could not read rocket config file', error);
    // we do not require a config file
  }

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
    if (theme.setupDevAndBuildPlugins) {
      config.setupDevAndBuildPlugins = [
        ...config.setupDevAndBuildPlugins,
        ...theme.setupDevAndBuildPlugins,
      ];
    }
    if (theme.setupDevPlugins) {
      config.setupDevPlugins = [...config.setupDevPlugins, ...theme.setupDevPlugins];
    }
    if (theme.setupBuildPlugins) {
      config.setupBuildPlugins = [...config.setupBuildPlugins, ...theme.setupBuildPlugins];
    }
    if (theme.setupEleventyPlugins) {
      config.setupEleventyPlugins = [...config.setupEleventyPlugins, ...theme.setupEleventyPlugins];
    }
    if (theme.setupCliPlugins) {
      config.setupCliPlugins = [...config.setupCliPlugins, ...theme.setupCliPlugins];
    }
  }
  // add "local" theme
  config._themePathes.push(path.resolve(inputDir));

  /** @type {MetaPlugin[]} */
  let pluginsMeta = [
    { name: 'rocket-start', plugin: RocketStart },
    { name: 'rocket-build', plugin: RocketBuild },
  ];

  if (Array.isArray(config.setupCliPlugins)) {
    for (const setupFn of config.setupCliPlugins) {
      pluginsMeta = setupFn(pluginsMeta);
    }
  }

  /** @type {RocketPlugin[]} */
  const plugins = [];
  for (const pluginObj of pluginsMeta) {
    /** @type {RocketPlugin} */
    let pluginInst = pluginObj.options
      ? new pluginObj.plugin(pluginObj.options)
      : new pluginObj.plugin();
    plugins.push(pluginInst);
  }

  return {
    command: 'help',
    pathPrefix: '/_site-dev', // pathPrefix can NOT have a '/' at the end as it will mean it may get ignored by 11ty 🤷‍♂️
    watch: true,
    outputDir: '_site-dev',
    plugins,
    // @ts-ignore
    devServer: config.devServer,

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
