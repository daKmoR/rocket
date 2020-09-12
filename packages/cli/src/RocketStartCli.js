import path from 'path';
import { fileURLToPath } from 'url';
import { startDevServer } from '@web/dev-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Eleventy from '@11ty/eleventy';

import { eleventyPlugin } from './start/eleventyPlugin.js';

export class RocketStartCli {
  constructor({ config, argv }) {
    this.__argv = argv;
    this.config = {
      ...config,
      devServer: {
        ...config.devServer,
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

    await startDevServer({
      config: devServerConfig,
      readCliArgs: true,
      readFileConfig: false,
      argv: this.__argv,
    });

    ['exit', 'SIGINT'].forEach(event => {
      process.on(event, () => {
        process.exit(0);
      });
    });
  }
}
