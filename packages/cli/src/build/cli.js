const path = require('path');
const { rollup } = require('rollup');
const { generateSW } = require('rollup-plugin-workbox');
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
    injectServiceWorker: false,
    workbox: false,
  });

  mpaConfig.plugins.push(
    generateSW({
      globIgnores: ['polyfills/*.js', 'legacy-*.js', 'nomodule-*.js'],
      swDest: path.join(process.cwd(), config.outputPath, 'service-worker.js'),
      globDirectory: path.join(process.cwd(), config.outputPath),
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
      targets: [config.outputPath],
    }),
  );

  mpaConfig.plugins.push(
    passthroughCopy({
      patterns: ['**/*.{png,gif,jpg,json,css}'],
      rootDir: path.join(config.devServer.rootDir, config.pathPrefix),
    }),
    passthroughCopy({
      patterns: [`${config.templatePathPrefix.substring(1)}/**/*.{png,gif,jpg,json,css}`],
      rootDir: config.devServer.rootDir,
    }),
  );

  mpaConfig.plugins.push(visualizer());

  await buildAndWrite(mpaConfig);
}

async function main() {
  const commandLineConfig = /** @type {ServerConfig & { configDir: string }} */ (readCommandLineArgs());
  const config = normalizeConfig(commandLineConfig);
  config.outputPath = '_site';

  const elev = new Eleventy(config.inputDir, config.outputPath);
  // 11ty always wants a relative path to cwd - why?
  const rel = path.relative(process.cwd(), path.join(__dirname, '..'));
  const relCwdPathToConfig = path.join(rel, 'shared', '.eleventy.js');
  elev.setConfigPathOverride(relCwdPathToConfig);
  elev.setDryRun(true); // do not write to file system
  elev.config.pathPrefix = ''; // TODO: for build we generally do not want a pathPrefix - make it configurable
  await elev.init();

  const htmlFiles = [];
  elev.config.filters['hook-for-rocket'] = (html, outputPath, inputPath) => {
    const name = path.relative(config.outputPath, outputPath);
    htmlFiles.push({
      html,
      name,
      rootDir: path.dirname(path.resolve(inputPath)),
    });
    return html;
  };
  await elev.init();
  await elev.write();

  await productionBuild(htmlFiles, config);
}

main();
