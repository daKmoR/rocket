#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const fs = require('fs');
const Eleventy = require('@11ty/eleventy');

const readCommandLineArgs = require('./readCommandLineArgs');

function getFileWithLastUrlDir(url, absRootDir) {
  const endIndex = url.length - 1;
  const startIndex = url.lastIndexOf('/', endIndex - 1);
  const name = url.substring(startIndex + 1, endIndex);
  const pathTo = url.substring(0, startIndex);
  const relPath = path.join(pathTo, `${name}.md`);
  const possibleFile = path.join(absRootDir, relPath);
  if (fs.existsSync(possibleFile)) {
    return relPath;
  }
  return '';
}

async function eleventyRender(elev, relPath, serverPath) {
  // const serverPath = context.path;

  let body = 'eleventyRender: File not found';
  elev.config.filters['hook-for-rocket'] = (content, outputPath, inputPath) => {
    const compare = path.join(relPath, inputPath);
    if (serverPath === `/${compare}`) {
      body = content;
    }
    return content;
  };
  await elev.write();
  return body
    .replace(/href="\//g, 'href="/packages/cli/demo/docs/')
    .replace(/src="\//g, 'src="/packages/cli/demo/docs/');
}

async function run() {
  const config = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  const absRootDir = path.resolve(config.esDevServer.rootDir);
  const relPath = path.relative(absRootDir, process.cwd());

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
    plugins: [
      {
        async serve(ctx) {
          let usePath = ctx.path;
          if (ctx.path.endsWith('index.html')) {
            usePath = ctx.path.replace('index.html', 'index.md');
          } else if (ctx.path.endsWith('.html')) {
            usePath = ctx.path.replace('.html', '.md');
          } else if (ctx.path.endsWith('/')) {
            const fileForUrl = getFileWithLastUrlDir(ctx.path, absRootDir);
            if (fileForUrl) {
              usePath = fileForUrl;
            } else {
              usePath += 'index.md';
            }
          }
          if (usePath.endsWith('md')) {
            const newBody = await eleventyRender(elev, relPath, usePath);
            return {
              body: newBody,
              type: 'html',
            };
          }
          return undefined;
        },
      },
    ],
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
