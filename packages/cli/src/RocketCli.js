import commandLineArgs from 'command-line-args';
import { normalizeConfig } from './normalizeConfig.js';

import { RocketStart } from './RocketStart.js';
import { RocketBuild } from './RocketBuild.js';
import computedConfig from './public/computedConfig.cjs';

import path from 'path';
import Eleventy from '@11ty/eleventy';
import { fileURLToPath } from 'url';

const { updateComputedConfig } = computedConfig;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RocketCli {
  plugins = [new RocketStart(), new RocketBuild()];
  updateComplete;

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

    this.plugins = this.config.setupPlugins(this.plugins);

    updateComputedConfig(this.config);
  }

  async setupEleventy() {
    if (!this.eleventy) {
      const { inputDir, outputDir } = this.config;

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      class RocketEleventy extends Eleventy {
        async write() {
          that.updateComplete = new Promise(resolve => {
            that.__finishBuild = resolve;
          });
          await super.write();
          await that.update();
          that.__finishBuild();
        }
      }
      const elev = new RocketEleventy(inputDir, outputDir);
      // 11ty always wants a relative path to cwd - why?
      const rel = path.relative(process.cwd(), path.join(__dirname));
      const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.cjs');
      elev.setConfigPathOverride(relCwdPathToConfig);

      // if (this.config.pathPrefix !== undefined) {
      //   elev.config.pathPrefix = this.config.pathPrefix;
      // }

      elev.setDryRun(true); // do not write to file system
      await elev.init();

      if (this.config.watch) {
        elev.watch();
      }

      // // 11ty will bind this hook to itself
      // const that = this;
      // elev.config.filters['hook-for-rocket'] = async function hook(html, outputPath) {
      //   // that.requestUpdate();
      //   // const data = await this.getData();
      //   // const { layout, title, inputPath } = data;
      //   // const url = data.page.url;
      //   // for (const plugin of that.plugins) {
      //   //   if (typeof plugin.transformHtml === 'function') {
      //   //     await plugin.transformHtml({ html, inputPath, outputPath, layout, title, url });
      //   //   }
      //   // }
      //   return html;
      // };

      this.eleventy = elev;
    }
  }

  async run() {
    await this.setup();

    if (this.config) {
      for (const plugin of this.plugins) {
        if (this.config.command === plugin.command) {
          await plugin.setup({ config: this.config, argv: this.subArgv });

          if (typeof plugin.setupCommand === 'function') {
            this.config = plugin.setupCommand(this.config);
          }
        }
      }
    }

    await this.setupEleventy();

    if (this.config) {
      await this.updateComplete;

      for (const plugin of this.plugins) {
        if (this.config.command === plugin.command && typeof plugin.execute === 'function') {
          await plugin.execute();
        }
      }

      if (this.config.watch === false) {
        await this.eleventy.write();
      }

      // Build Phase
      if (this.config.command === 'build') {
        for (const plugin of this.plugins) {
          if (typeof plugin.build === 'function') {
            await plugin.build();
          }
        }
      }

      if (this.config.command === 'help') {
        console.log('Help is here: use build or start');
      }
    }
  }

  async update() {
    for (const page of this.eleventy.writer.templateMap._collection.items) {
      const { title, content: html, layout } = page.data;
      const url = page.data.page.url;
      const { inputPath, outputPath } = page;

      for (const plugin of this.plugins) {
        if (
          this.config.command === plugin.command &&
          typeof plugin.inspectRenderedHtml === 'function'
        ) {
          await plugin.inspectRenderedHtml({ html, inputPath, outputPath, layout, title, url });
        }
      }
    }
  }
}
