import chai from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeConfig } from '../src/normalizeConfig.js';

const { expect } = chai;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function cleanup(config) {
  const configNoPaths = { ...config };
  delete configNoPaths.devServer.rootDir;
  delete configNoPaths.configDir;
  delete configNoPaths._configDirCwdRelative;
  delete configNoPaths.inputDir;
  delete configNoPaths._inputDirConfigDirRelative;
  delete configNoPaths._themePathes;
  delete configNoPaths.eleventyFunction;
  return configNoPaths;
}

describe('normalizeConfig', () => {
  it('makes sure essential settings are there', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'empty');
    const config = await normalizeConfig({
      configDir,
    });

    // testing pathes is always a little more complicted 😅
    expect(config.devServer.rootDir).to.exist;
    expect(config.configDir).to.equal(configDir);
    expect(config._configDirCwdRelative).to.not.equal(configDir);
    expect(config._configDirCwdRelative).to.match(/test\/fixtures\/empty$/);
    expect(config.inputDir).to.match(/empty\/docs$/);
    expect(config._inputDirConfigDirRelative).to.equal('docs');
    expect(config._themePathes[0]).to.match(/empty\/docs$/);

    expect(cleanup(config)).to.deep.equal({
      command: 'help',
      devServer: {},
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build' }],
      eleventy: {
        dir: {
          data: '_merged_data',
          includes: '_merged_includes',
        },
      },
      outputDir: '_site-dev',
      pathPrefix: '/_site-dev',
      build: {
        outputDir: '_site',
        pathPrefix: '',
      },
    });
  });

  it('can override settings via parameters', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'empty');
    const config = await normalizeConfig({
      configDir,
      devServer: {
        more: 'settings',
      },
    });

    expect(cleanup(config)).to.deep.equal({
      command: 'help',
      devServer: {
        more: 'settings',
      },
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build' }],
      eleventy: {
        dir: {
          data: '_merged_data',
          includes: '_merged_includes',
        },
      },
      outputDir: '_site-dev',
      pathPrefix: '/_site-dev',
      build: {
        outputDir: '_site',
        pathPrefix: '',
      },
    });
  });

  it('respects a rocket.config.js file', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'overrides');
    const config = await normalizeConfig({
      configDir,
    });

    expect(cleanup(config)).to.deep.equal({
      command: 'help',
      devServer: {
        more: 'from-file',
      },
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build' }],
      eleventy: {
        dir: {
          data: '--config-override--',
          includes: '_merged_includes',
        },
      },
      outputDir: '_site-dev',
      pathPrefix: '/_site-dev',
      build: {
        outputDir: '_site',
        pathPrefix: '',
      },
    });
  });

  it('supports an eleventy config function in rocket.config.js', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'override-eleventy-function');
    const config = await normalizeConfig({
      configDir,
    });

    expect(cleanup(config)).to.deep.equal({
      command: 'help',
      devServer: {},
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build' }],
      eleventy: {
        dir: {
          data: '--config-function-override--',
          includes: '_merged_includes',
        },
      },
      outputDir: '_site-dev',
      pathPrefix: '/_site-dev',
      build: {
        outputDir: '_site',
        pathPrefix: '',
      },
    });
  });
});
