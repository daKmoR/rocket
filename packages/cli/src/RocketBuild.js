/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import commandLineArgs from 'command-line-args';
import { rollup } from 'rollup';
import fs from 'fs-extra';
import { copy } from '@web/rollup-plugin-copy';

import { createMpaConfig } from '@d4kmor/building-rollup';
import { addPlugin } from 'plugins-manager';

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

async function productionBuild(config) {
  // const serviceWorkerFileName =
  //   config.build && config.build.serviceWorkerFileName
  //     ? config.build.serviceWorkerFileName
  //     : 'service-worker.js';

  const mpaConfig = createMpaConfig({
    input: '**/*.html',
    output: {
      dir: config.build.outputDir,
    },
    // custom
    rootDir: config.outputDir, // config.outputDir = 11ty output = rollup input
    // absoluteBaseUrl: config.build.absoluteBaseUrl,
    setupPlugins: [
      addPlugin({
        name: 'copy',
        plugin: copy,
        options: {
          patterns: [
            '!(*.md|*.html)*',
            '_merged_assets/_static/**/*.{png,gif,jpg,json,css,svg,ico}',
          ],
          rootDir: config.outputDir,
        },
      }),
      ...config.setupDevAndBuildPlugins,
      ...config.setupBuildPlugins,
    ],
  });

  await buildAndWrite(mpaConfig);
}

export class RocketBuild {
  commands = ['build'];

  setupCommand(config) {
    config.watch = false;
    config.pathPrefix = '';
    if (config.build && config.build.pathPrefix !== undefined) {
      config.pathPrefix = config.build.pathPrefix;
    }
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
      build: {
        emptyOutputDir: true,
        ...config.build,
        ...buildOptions,
      },
    };
  }

  async build() {
    if (this.config.build.emptyOutputDir) {
      await fs.emptyDir(this.config.build.outputDir);
    }
    await productionBuild(this.config);
  }
}
