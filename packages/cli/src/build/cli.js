/* eslint-disable */

const path = require('path');
const { rollup } = require('rollup');
const { generateSW } = require('rollup-plugin-workbox');
const Eleventy = require('@11ty/eleventy');
const { createMpaConfig } = require('./createMpaConfig.js');
const { passthroughCopy } = require('./rollup-plugin-passthrough-copy.js');
const clear = require('rollup-plugin-clear');

// const elev = new Eleventy('./docs', './_site');
// elev.setConfigPathOverride('./docs/.eleventy.js');
// elev.setDryRun(true); // do not write to file system

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

async function productionBuild(html) {
  // console.log(html);
  const mpaConfig = createMpaConfig({
    outputDir: '_site',
    legacyBuild: false,
    html: { html },
    injectServiceWorker: false,
    workbox: false,
  });

  mpaConfig.plugins.push(
    generateSW({
      globIgnores: ['polyfills/*.js', 'legacy-*.js', 'nomodule-*.js'],
      swDest: path.join(process.cwd(), '_site', 'service-worker.js'),
      globDirectory: path.join(process.cwd(), '_site'),
      globPatterns: ['**/*.{html,js,json,css,webmanifest,png,gif}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: 'polyfills/*.js',
          handler: 'CacheFirst',
        },
      ],
    }),
  );

  mpaConfig.plugins.push(
    clear({
      targets: ['_site'],
    }),
  );

  mpaConfig.plugins.push(
    passthroughCopy({
      patterns: '**/*.{png,gif,jpg,json,css}',
      rootDir: './demo/docs',
    }),
  );

  await buildAndWrite(mpaConfig);
}

async function main() {
  // const config = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  // const absRootDir = path.resolve(config.esDevServer.rootDir);
  // const relPath = path.relative(absRootDir, process.cwd());

  const elev = new Eleventy('./demo/docs', './__site');
  elev.setConfigPathOverride('./src/shared/.eleventy.js');
  elev.setDryRun(true);

  const htmlFiles = [];
  elev.config.filters['hook-for-rocket'] = (html, outputPath, inputPath) => {
    htmlFiles.push({
      html,
      name: outputPath.substring(9), // TODO: generate this
      rootDir: path.dirname(path.resolve(inputPath)),
    });
    return html;
  };
  await elev.init();
  await elev.write();

  await productionBuild(htmlFiles);
}

main();
