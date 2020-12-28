/* eslint-disable @typescript-eslint/ban-ts-comment */
import commandLineArgs from 'command-line-args';
import { normalizeConfig } from './normalizeConfig.js';

/** @typedef {import('../types/main').RocketPlugin} RocketPlugin */

// @ts-ignore
import computedConfigPkg from './public/computedConfig.cjs';

import path from 'path';
import Eleventy from '@11ty/eleventy';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const { setComputedConfig } = computedConfigPkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RocketEleventy extends Eleventy {
  /**
   * @param {string} input
   * @param {string} output
   * @param {RocketCli} cli
   */
  constructor(input, output, cli) {
    super(input, output);
    this.__rocketCli = cli;
  }

  async write() {
    /** @type {function} */
    let finishBuild;
    this.__rocketCli.updateComplete = new Promise(resolve => {
      finishBuild = resolve;
    });

    await this.__rocketCli.mergeThemes();

    await super.write();
    await this.__rocketCli.update();
    // @ts-ignore
    finishBuild();
  }
}

export class RocketCli {
  updateComplete = new Promise(resolve => resolve(null));

  constructor({ argv } = { argv: undefined }) {
    const mainDefinitions = [
      { name: 'command', defaultOption: true, defaultValue: 'help' },
      {
        name: 'config-file',
        alias: 'c',
        type: String,
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
      configFile: options['config-file'],
    };
    this.__isSetup = false;
  }

  async setupEleventy() {
    if (!this.eleventy) {
      const { inputDir, outputDir } = this.config;

      await fs.emptyDir(outputDir);
      const elev = new RocketEleventy(inputDir, outputDir, this);
      elev.isVerbose = false;
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
    if (this.__isSetup === false) {
      this.config = await normalizeConfig(this.argvConfig);
      setComputedConfig(this.config);
      this.__isSetup = true;
    }
  }

  async run() {
    await this.setup();

    if (this.config) {
      for (const plugin of this.config.plugins) {
        if (this.considerPlugin(plugin)) {
          if (typeof plugin.setup === 'function') {
            await plugin.setup({ config: this.config, argv: this.subArgv });
          }

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

      if (this.config.watch === false && this.eleventy) {
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

  /**
   * @param {RocketPlugin} plugin
   */
  considerPlugin(plugin) {
    return plugin.commands.includes(this.config.command);
  }

  async update() {
    if (!this.eleventy || (this.eleventy && !this.eleventy.writer)) {
      return;
    }

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

  async stop() {
    for (const plugin of this.config.plugins) {
      if (this.considerPlugin(plugin) && typeof plugin.stop === 'function') {
        await plugin.stop();
      }
    }
  }

  async cleanup() {
    setComputedConfig({});
    if (this.eleventy) {
      this.eleventy.finish();
      // this.eleventy.stopWatch();
    }
    this.stop();
  }
}
