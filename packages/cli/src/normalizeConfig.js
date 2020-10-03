import path from 'path';
import deepmerge from 'deepmerge';

import { createRequire } from 'module';
import { readConfig } from '@web/config-loader';

import { RocketStart } from './RocketStart.js';
import { RocketBuild } from './RocketBuild.js';

const require = createRequire(import.meta.url);

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

  const inputDir = path.join(config.configDir, './docs');

  config.themePathes = [];
  for (const theme of config.themes) {
    config.themePathes.push(theme.path);

    if (theme.setupUnifiedPlugins) {
      config.setupUnifiedPlugins = [...config.setupUnifiedPlugins, ...theme.setupUnifiedPlugins];
    }

    if (theme.setupPlugins) {
      config.plugins = theme.setupPlugins(config.plugins);
    }
  }
  // add "local" theme
  config.themePathes.push(path.resolve(inputDir));
  // execute setupPlugins of local rocket config file
  if (config.setupPlugins) {
    config.plugins = config.setupPlugins(config.plugins);
  }

  const themePackage = config.themePackage || '@d4kmor/launch';

  let themePath = '';
  try {
    themePath = path.dirname(require.resolve(`${themePackage}/theme/.eleventy.js`));
  } catch (error) {
    throw new Error(
      `The theme "${themePackage}" did not have a "theme/.elenventy.js" file at "${error.path}"`,
    );
  }

  const absIncludes = path.join(themePath, '_includes');
  const absData = path.join(themePath, '_data');
  // 11ty always wants a relative path to inputDir - why?
  const includes = path.relative(inputDir, absIncludes);
  const data = path.relative(inputDir, absData);

  // dev Server needs the paths to be absolute to the server root
  if (config.devServer && config.devServer.rootDir) {
    devServer.rootDir = config.devServer.rootDir;
  }
  const templatePathPrefix = path.join('/', path.relative(devServer.rootDir, themePath));

  const inputPath = path.join(process.cwd(), inputDir);

  return {
    // pathPrefix can NOT have a '/' at the end as it will mean it may get ignored by 11ty 🤷‍♂️
    command: 'help',
    pathPrefix: '/docs',
    templatePathPrefix,
    themePath,
    includesPath: includes,
    dataPath: data,
    ...config,
    themePackage,
    configDir: config.configDir,
    inputDir,
    inputPath,
    outputDir: '_site',
    watch: true,
    dir: {
      data: '._merged_data',
      includes: '._merged_includes',
      ...config.dir,
      output: '_site',
    },

    devServer,
  };
}
