#!/usr/bin/env node

const path = require('path');
const { rollup } = require('rollup');
const clear = require('rollup-plugin-clear');
const visualizer = require('rollup-plugin-visualizer');
const Eleventy = require('@11ty/eleventy');
const { createMpaConfig } = require('./createMpaConfig.js');
const { passthroughCopy } = require('./rollup-plugin-passthrough-copy.js');

const readCommandLineArgs = require('./readCommandLineArgs.js');
const { normalizeConfig } = require('../shared/normalizeConfig.js');

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
    // injectServiceWorker: {
    //   registerUrl: '/service-worker.js',
    // },
    // workbox: {
    //   swDest: `${config.outputPath}/service-worker.js`,
    // },
  });

  mpaConfig.plugins.push(
    clear({
      targets: [config.outputPath],
    }),
  );

  mpaConfig.plugins.push(
    passthroughCopy({
      patterns: ['**/*.{png,gif,jpg,json,css,svg}'],
      rootDir: path.join(config.devServer.rootDir, config.pathPrefix),
    }),
    passthroughCopy({
      patterns: [`${config.templatePathPrefix.substring(1)}/**/*.{png,gif,jpg,json,css,svg}`],
      rootDir: config.devServer.rootDir,
    }),
  );

  mpaConfig.plugins.push(visualizer());

  await buildAndWrite(mpaConfig);
}

class RocketCli {
  constructor() {
    const commandLineConfig = /** @type {ServerConfig & { configDir: string }} */ (readCommandLineArgs());
    this.config = normalizeConfig(commandLineConfig);
    this.config.outputPath = '_site';
  }

  build() {
    const { mode } = this.config;
    switch (mode) {
      case 'full':
        this.buildFull();
        break;
      case 'site':
        this.buildSite();
        break;
      /* no default */
    }
  }

  async setupEleventy() {
    if (!this.elev) {
      const { inputDir, outputPath } = this.config;
      const elev = new Eleventy(inputDir, outputPath);
      // 11ty always wants a relative path to cwd - why?
      const rel = path.relative(process.cwd(), path.join(__dirname, '..'));
      const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.js');
      elev.setConfigPathOverride(relCwdPathToConfig);

      elev.config.pathPrefix = ''; // TODO: for build we generally do not want a pathPrefix - make it configurable
      if (this.config.mode === 'full') {
        elev.setDryRun(true); // do not write to file system
      }
      await elev.init();

      this.elev = elev;
    }
  }

  async buildSite() {
    await this.setupEleventy();
    await this.elev.write();
  }

  async buildFull() {
    await this.setupEleventy();
    const htmlFiles = [];
    this.elev.config.filters['hook-for-rocket'] = (html, outputPath, inputPath) => {
      const name = path.relative(this.config.outputPath, outputPath);
      htmlFiles.push({
        html,
        name,
        rootDir: path.dirname(path.resolve(inputPath)),
      });
      return html;
    };
    await this.elev.write();
    await productionBuild(htmlFiles, this.config);
  }
}

const cli = new RocketCli();
cli.build();
