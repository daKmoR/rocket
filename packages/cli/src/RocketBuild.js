/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import commandLineArgs from 'command-line-args';

import path from 'path';
import { rollup } from 'rollup';
import { copy } from '@web/rollup-plugin-copy';
import fs from 'fs-extra';

import buildingRollup from './_building-rollup-fork/index.cjs';

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

async function productionBuild(config) {
  const serviceWorkerFileName =
    config.build && config.build.serviceWorkerFileName
      ? config.build.serviceWorkerFileName
      : 'service-worker.js';
  const mpaConfig = createMpaConfig({
    outputDir: config.build.outputDir,
    legacyBuild: false,
    injectServiceWorker: true,
    workbox: {
      swDest: path.join(config.build.outputDir, serviceWorkerFileName),
    },
    html: {
      rootDir: path.join(config.devServer.rootDir, '_site-dev'),
      input: '**/*.html',
      absoluteBaseUrl: config.build.absoluteBaseUrl,
    },
  });

  mpaConfig.plugins.push(
    copy({
      patterns: ['!(*.md|*.html)*', '_merged_assets/_static/**/*.{png,gif,jpg,json,css,svg,ico}'],
      rootDir: path.join(config.devServer.rootDir, config.pathPrefix),
    }),
  );

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
