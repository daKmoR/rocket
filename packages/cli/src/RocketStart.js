import { startDevServer } from '@web/dev-server';

export class RocketStart {
  commands = ['start'];

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
    const devServerConfig = {
      nodeResolve: true,
      watch: true,
      ...this.config.devServer,
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
