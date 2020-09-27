import commandLineArgs from 'command-line-args';

import path from 'path';
import { rollup } from 'rollup';
import clear from 'rollup-plugin-clear';
import { copy } from '@web/rollup-plugin-copy';
// const visualizer = require('rollup-plugin-visualizer');

import buildingRollup from '@open-wc/building-rollup';

const { createMpaConfig } = buildingRollup;

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
    outputDir: config.outputDir,
    legacyBuild: false,
    html: { html },
    injectServiceWorker: true,
  });

  mpaConfig.plugins.push(
    clear({
      targets: [config.outputDir],
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

export class RocketBuild {
  command = 'build';
  htmlFiles = [];

  setupCommand(config) {
    config.watch = false;
    config.pathPrefix = '';
    return config;
  }

  async setup({ config, argv }) {
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
  }

  async build() {
    await productionBuild(this.htmlFiles, this.config);
  }

  async inspectRenderedHtml({ inputPath, html, outputPath }) {
    const name = path.relative(this.config.outputDir, outputPath);
    this.htmlFiles.push({
      html,
      name,
      rootDir: path.dirname(path.resolve(inputPath)),
    });
  }
}
