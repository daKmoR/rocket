import esDevServer from 'es-dev-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Eleventy from '@11ty/eleventy';

import { eleventyPlugin } from './start/eleventyPlugin.js';

const {
  readCommandLineArgs: readDevServerCommandLineArgs,
  createConfig,
  startServer,
} = esDevServer;

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */

export class RocketStartCli {
  constructor({ config, argv }) {
    const devServerOptions = readDevServerCommandLineArgs(argv, {
      defaultConfigDir: config.configDir,
    });

    this.config = {
      ...config,
      devServer: {
        ...config.devServer,
        ...devServerOptions,
      },
    };
  }

  async execute() {
    const absRootDir = this.config.devServer.rootDir
      ? path.resolve(this.config.devServer.rootDir)
      : process.cwd();

    const elev = new Eleventy(this.config.inputDir, '_site');
    // 11ty always wants a relative path to cwd - why?
    const rel = path.relative(process.cwd(), path.join(__dirname));
    const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.cjs');
    elev.setConfigPathOverride(relCwdPathToConfig);
    elev.setDryRun(true); // do not write to file system
    await elev.init();
    elev.watch();

    const devServerConfig = {
      nodeResolve: true,
      watch: true,
      ...this.config.devServer,
      open: this.config.devServer.open ? this.config.devServer.open : `${this.config.pathPrefix}/`,
      plugins: [eleventyPlugin({ elev, absRootDir })],
    };

    startServer(createConfig(devServerConfig));

    ['exit', 'SIGINT'].forEach(event => {
      process.on(event, () => {
        process.exit(0);
      });
    });
  }
}
