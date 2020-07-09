#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const Eleventy = require('@11ty/eleventy');

const readCommandLineArgs = require('./readCommandLineArgs.js');
const eleventyPlugin = require('./eleventyPlugin');
const { normalizeConfig } = require('../shared/normalizeConfig.js');

/* 
  inputDir: ./docs
  configDir: ./
  server-root: ./
  cwd: /

  serverUrl: /docs

  inputDir: ./docs
  configDir: ./demo
  cwd: packages/cli/  
  server-root: ../../

  serverUrl: /packages/cli/docs
*/

async function run() {
  const commandLineConfig = /** @type {ServerConfig & { configDir: string }} */ (readCommandLineArgs());
  const config = normalizeConfig(commandLineConfig);
  // console.log(config);

  const absRootDir = config.devServer.rootDir
    ? path.resolve(config.devServer.rootDir)
    : process.cwd();

  // process.exit();

  const elev = new Eleventy(config.inputDir, '_site');
  // 11ty always wants a relative path to cwd - why?
  const rel = path.relative(process.cwd(), path.join(__dirname, '..'));
  const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.js');
  elev.setConfigPathOverride(relCwdPathToConfig);

  elev.setDryRun(true); // do not write to file system
  await elev.init();
  elev.watch();

  config.devServer = {
    nodeResolve: true,
    watch: true,
    ...config.devServer,
    open: config.devServer.open ? config.devServer.open : `${config.pathPrefix}`,
    plugins: [eleventyPlugin({ elev, absRootDir })],
  };

  startServer(createConfig(config.devServer));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
