/* eslint-disable @typescript-eslint/ban-ts-comment */
import { startDevServer } from '@web/dev-server';

/** @typedef {import('../types/main').RocketCliOptions} RocketCliOptions */
/** @typedef {import('@web/dev-server').DevServerConfig} DevServerConfig */

export class RocketStart {
  commands = ['start'];

  /**
   * @param {object} options
   * @param {RocketCliOptions} options.config
   * @param {any} options.argv
   */
  async setup({ config, argv }) {
    this.__argv = argv;
    this.config = {
      ...config,
      devServer: {
        ...config.devServer,
      },
    };
  }

  async execute() {
    if (!this.config) {
      return;
    }

    /** @type {DevServerConfig} */
    const devServerConfig = {
      nodeResolve: true,
      watch: true,
      ...this.config.devServer,
      // @ts-ignore
      open: this.config.devServer.open ? this.config.devServer.open : `${this.config.pathPrefix}/`,
      clearTerminalOnReload: false,
    };

    await startDevServer({
      config: devServerConfig,
      readCliArgs: true,
      readFileConfig: false,
      argv: this.__argv,
    });
  }
}
