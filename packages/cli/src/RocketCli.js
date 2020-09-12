import commandLineArgs from 'command-line-args';
import { promises as fs } from 'fs';
import path from 'path';
import { normalizeConfig } from './normalizeConfig.js';

import { RocketBuildCli } from './RocketBuildCli.js';
import { RocketStartCli } from './RocketStartCli.js';

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
  }

  async setup() {
    this.config = await normalizeConfig(this.argvConfig);

    await fs.writeFile(
      path.join(process.cwd(), '__eleventySettings.json'),
      JSON.stringify(this.config, null, 2),
    );
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
