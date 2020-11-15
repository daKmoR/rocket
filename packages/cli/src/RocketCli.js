import commandLineArgs from 'command-line-args';
import { normalizeConfig } from './normalizeConfig.js';

import computedConfig from './public/computedConfig.cjs';

import path from 'path';
import Eleventy from '@11ty/eleventy';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const { setComputedConfig } = computedConfig;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RocketCli {
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

  async setupEleventy() {
    if (!this.eleventy) {
      const { _inputDirConfigDirRelative, outputDir } = this.config;

      await fs.emptyDir(outputDir);

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      class RocketEleventy extends Eleventy {
        async write() {
          that.updateComplete = new Promise(resolve => {
            that.__finishBuild = resolve;
          });

          await that.mergeThemes();

          await super.write();
          await that.update();
          that.__finishBuild();
        }
      }
      const elev = new RocketEleventy(_inputDirConfigDirRelative, outputDir);
      // 11ty always wants a relative path to cwd - why?
      const rel = path.relative(process.cwd(), path.join(__dirname));
      const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.cjs');
      elev.setConfigPathOverride(relCwdPathToConfig);

      // elev.setDryRun(true); // do not write to file system
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

  async mergeThemes() {
    for (const folder of ['_assets', '_data', '_includes']) {
      const to = path.join(this.config.inputDir, `_merged${folder}`);
      await fs.emptyDir(to);
      for (const sourceDir of this.config._themePathes) {
        const from = path.join(sourceDir, folder);
        if (fs.existsSync(from)) {
          await fs.copy(from, to);
        }
      }
    }
  }

  /**
   * Separate this so we can test it
   */
  async setup() {
    this.config = await normalizeConfig(this.argvConfig);
    setComputedConfig(this.config);
  }

  async run() {
    await this.setup();

    if (this.config) {
      for (const plugin of this.config.plugins) {
        if (this.considerPlugin(plugin)) {
          await plugin.setup({ config: this.config, argv: this.subArgv });

          if (typeof plugin.setupCommand === 'function') {
            this.config = plugin.setupCommand(this.config);
          }
        }
      }
    }

    await this.mergeThemes();
    await this.setupEleventy();

    if (this.config) {
      await this.updateComplete;

      for (const plugin of this.config.plugins) {
        if (this.considerPlugin(plugin) && typeof plugin.execute === 'function') {
          await plugin.execute();
        }
      }

      if (this.config.watch === false) {
        await this.eleventy.write();
      }

      // Build Phase
      if (this.config.command === 'build') {
        for (const plugin of this.config.plugins) {
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

  considerPlugin(plugin) {
    return plugin.commands.includes(this.config.command);
  }

  async update() {
    for (const page of this.eleventy.writer.templateMap._collection.items) {
      const { title, content: html, layout } = page.data;
      const url = page.data.page.url;
      const { inputPath, outputPath } = page;

      for (const plugin of this.config.plugins) {
        if (this.considerPlugin(plugin) && typeof plugin.inspectRenderedHtml === 'function') {
          await plugin.inspectRenderedHtml({
            html,
            inputPath,
            outputPath,
            layout,
            title,
            url,
            data: page.data,
            eleventy: this.eleventy,
          });
        }
      }
    }

    for (const plugin of this.config.plugins) {
      if (this.considerPlugin(plugin) && typeof plugin.updated === 'function') {
        await plugin.updated();
      }
    }
  }
}
