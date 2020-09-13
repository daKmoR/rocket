import commandLineArgs from 'command-line-args';
import { normalizeConfig } from './normalizeConfig.js';

import { RocketBuildCli } from './RocketBuildCli.js';
import { RocketStartCli } from './RocketStartCli.js';
import computedConfig from './public/computedConfig.cjs';

const { updateComputedConfig, cleanupComputedConfig } = computedConfig;

export class RocketCli {
  constructor({ argv } = { argv: undefined }) {
    const mainDefinitions = [
      { name: 'command', defaultOption: true, defaultValue: 'help' },
      {
        name: 'config-dir',
        alias: 'c',
        type: String,
        defaultValue: '.',
        description: 'Location of rocket configuration',
      },
    ];
    const options = commandLineArgs(mainDefinitions, {
      stopAtFirstUnknown: true,
      argv,
    });
    this.subArgv = options._unknown || [];
    this.argvConfig = {
      command: options.command,
      configDir: options['config-dir'],
    };

    this.__needsCleanup = true;

    this.cleanup = this.cleanup.bind(this);
    ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach(eventType => {
      process.on(eventType, this.cleanup);
    });
  }

  /**
   * TODO: check why cleanup get's called 2 times even when using a guard
   */
  async cleanup() {
    await cleanupComputedConfig();
  }

  async setup() {
    this.config = await normalizeConfig(this.argvConfig);

    await updateComputedConfig(this.config);
  }

  async run() {
    await this.setup();

    if (this.config) {
      if (this.config.command === 'build') {
        const build = new RocketBuildCli({ config: this.config, argv: this.subArgv });
        await build.execute();
      }

      if (this.config.command === 'start') {
        const start = new RocketStartCli({ config: this.config, argv: this.subArgv });
        await start.execute();
      }

      if (this.config.command === 'help') {
        console.log('Help is here: use build or start');
      }
    }
  }
}
