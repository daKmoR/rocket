#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const Eleventy = require('@11ty/eleventy');

const readCommandLineArgs = require('./readCommandLineArgs');
const eleventyPlugin = require('./eleventyPlugin');

async function run() {
  const config = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  const absRootDir = path.resolve(config.esDevServer.rootDir);

  const elev = new Eleventy('./demo/docs', './__site');
  elev.setConfigPathOverride('./src/shared/.eleventy.js');
  elev.setDryRun(true); // do not write to file system
  await elev.init();
  elev.watch();

  config.esDevServer = {
    ...config.esDevServer,
    nodeResolve: true,
    watch: true,
    // open: './docs/README.md',
    // open: './packages/cli/demo/docs/README.md',
    plugins: [eleventyPlugin({ elev, absRootDir })],
  };

  startServer(createConfig(config.esDevServer));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
