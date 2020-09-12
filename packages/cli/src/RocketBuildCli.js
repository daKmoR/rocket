import commandLineArgs from 'command-line-args';

import path from 'path';
import { rollup } from 'rollup';
import clear from 'rollup-plugin-clear';
import { copy } from '@web/rollup-plugin-copy';
import { fileURLToPath } from 'url';
// const visualizer = require('rollup-plugin-visualizer');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Eleventy from '@11ty/eleventy';

import buildingRollup from '@open-wc/building-rollup';

const { createMpaConfig } = buildingRollup;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {object} config
 */
async function buildAndWrite(config) {
  const bundle = await rollup(config);

  if (Array.isArray(config.output)) {
    await bundle.write(config.output[0]);
    await bundle.write(config.output[1]);
  } else {
    await bundle.write(config.output);
  }
}

async function productionBuild(html, config) {
  const mpaConfig = createMpaConfig({
    outputDir: config.outputPath,
    legacyBuild: false,
    html: { html },
    injectServiceWorker: true,
  });

  mpaConfig.plugins.push(
    clear({
      targets: [config.outputPath],
    }),
  );

  const copyPattern = '**/*.{png,gif,jpg,json,css,svg,ico,html}';

  mpaConfig.plugins.push(
    copy({
      patterns: [copyPattern],
      rootDir: path.join(config.devServer.rootDir, config.pathPrefix),
    }),
    copy({
      patterns: [`${config.templatePathPrefix.substring(1)}/${copyPattern}`],
      rootDir: config.devServer.rootDir,
    }),
  );

  // mpaConfig.plugins.push(visualizer());

  await buildAndWrite(mpaConfig);
}

export class RocketBuildCli {
  constructor({ config, argv }) {
    const buildDefinitions = [
      {
        name: 'mode',
        alias: 'm',
        type: String,
        defaultValue: 'full',
        description: 'What build to run [full, site, optimize]',
      },
      { name: 'help', type: Boolean, description: 'See all options' },
    ];
    const buildOptions = commandLineArgs(buildDefinitions, { argv });

    this.config = {
      ...config,
      build: buildOptions,
    };

    this.config.outputPath = '_site';
  }

  async execute() {
    const { mode } = this.config.build;
    switch (mode) {
      case 'full':
        await this.buildFull();
        break;
      case 'site':
        await this.buildSite();
        break;
      /* no default */
    }
  }

  async setupEleventy() {
    if (!this.eleventy) {
      const { inputDir, outputPath } = this.config;
      const elev = new Eleventy(inputDir, outputPath);
      // 11ty always wants a relative path to cwd - why?
      const rel = path.relative(process.cwd(), path.join(__dirname));
      const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.cjs');
      elev.setConfigPathOverride(relCwdPathToConfig);

      elev.config.pathPrefix = ''; // TODO: for build we generally do not want a pathPrefix - make it configurable
      if (this.config.mode === 'full') {
        elev.setDryRun(true); // do not write to file system
      }
      await elev.init();

      this.eleventy = elev;
    }
  }

  async buildSite() {
    await this.setupEleventy();
    await this.eleventy.write();
  }

  async buildFull() {
    await this.setupEleventy();
    const htmlFiles = [];

    // 11ty will bind this hook to itself
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.eleventy.config.filters['hook-for-rocket'] = function hook(html, outputPath) {
      const { inputPath } = this;

      const name = path.relative(that.config.outputPath, outputPath);
      htmlFiles.push({
        html,
        name,
        rootDir: path.dirname(path.resolve(inputPath)),
      });
      return html;
    };
    await this.eleventy.write();
    await productionBuild(htmlFiles, this.config);
  }
}
