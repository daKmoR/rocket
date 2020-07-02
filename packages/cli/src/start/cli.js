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
  const absRootDir = config.esDevServer.rootDir
    ? path.resolve(config.esDevServer.rootDir)
    : process.cwd();

  const elev = new Eleventy();
  // 11ty always wants a relative path to cwd - why?
  const rel = path.relative(process.cwd(), path.join(__dirname, '..'));
  const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.js');
  elev.setConfigPathOverride(relCwdPathToConfig);

  elev.setDryRun(true); // do not write to file system
  await elev.init();
  elev.watch();

  config.esDevServer = {
    nodeResolve: true,
    watch: true,
    ...config.esDevServer,
    open: config.esDevServer.open ? config.esDevServer.open : `${config.configDir}/`,
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
