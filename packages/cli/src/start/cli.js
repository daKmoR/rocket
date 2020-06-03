#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const Eleventy = require('@11ty/eleventy');

const readCommandLineArgs = require('./readCommandLineArgs');

async function run() {
  const config = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  const absRootDir = path.resolve(config.esDevServer.rootDir);
  const relPath = path.relative(absRootDir, process.cwd());

  const elev = new Eleventy(config.configDir, './__site');
  elev.setConfigPathOverride('./demo/docs/.eleventy.js');
  elev.setDryRun(true); // do not write to file system
  await elev.init();

  config.esDevServer = {
    ...config.esDevServer,
    nodeResolve: true,
    watch: true,
    // open: './docs/README.md',
    // open: './packages/cli/demo/docs/README.md',
    middlewares: [
      async (ctx, next) => {
        if (ctx.path.endsWith('index.html')) {
          ctx.path = ctx.path.replace('index.html', 'README.md');
        } else if (ctx.path.endsWith('.html')) {
          ctx.path = ctx.path.replace('.html', '.md');
        } else if (ctx.path.endsWith('/')) {
          ctx.path += 'README.md';
        }
        return next();
      },
    ],
    plugins: [
      {
        async transform(context) {
          if (context.path.endsWith('md')) {
            const serverPath = context.path;

            let body = 'File not found';
            elev.config.filters['hook-for-rocket'] = (content, outputPath, inputPath) => {
              // console.log({
              //   inputPath, // './demo/docs/README.md',
              //   serverPath, // '/packages/cli/demo/docs/README.md'
              //   relPath,
              //   absRootDir,
              //   absConfigDir,
              //   cur,
              // });
              const compare = path.join(relPath, inputPath);
              if (serverPath === `/${compare}`) {
                body = content;
              }
              return content;
            };
            await elev.write();
            return {
              body: body.replace(/href="\//g, 'href="/docs/').replace(/src="\//g, 'src="/docs/'),
            };
          }
          return undefined;
        },
        resolveMimeType(context) {
          if (context.path.endsWith('md')) {
            return 'text/html';
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
