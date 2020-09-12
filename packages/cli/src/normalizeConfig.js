import path from 'path';
import deepmerge from 'deepmerge';

import { createRequire } from 'module';
import { readConfig } from '@web/config-loader';

const require = createRequire(import.meta.url);

/** @typedef {import('./types').RocketCliOptions} RocketCliOptions */

/**
 * @param {Partial<RocketCliOptions>} inConfig
 * @returns {Promise<RocketCliOptions>}
 */
export async function normalizeConfig(inConfig) {
  let config = { ...inConfig };
  if (!config.configDir) {
    throw new Error('You need to provide a configDir');
  }

  try {
    const fileConfig = await readConfig('rocket.config', undefined, path.resolve(config.configDir));
    config = deepmerge(config, fileConfig);
  } catch (error) {
    // we do not require a config file
  }

  if (!config.configDir) {
    throw new Error('You can not set the configDir in the rocket.config.js');
  }

  const devServer = {
    rootDir: process.cwd(),
    ...config.devServer,
  };

  const themePackage = config.themePackage || '@d4kmor/launch';

  const inputDir = path.join(config.configDir, './docs');
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

  return {
    // pathPrefix can NOT have a '/' at the end as it will mean it may get ignored by 11ty 🤷‍♂️
    command: 'help',
    pathPrefix: '/docs',
    templatePathPrefix,
    themePath,
    ...config,
    themePackage,
    configDir: config.configDir,
    inputDir,
    dir: {
      includes,
      data,
      ...config.dir,
    },

    devServer,
  };
}
