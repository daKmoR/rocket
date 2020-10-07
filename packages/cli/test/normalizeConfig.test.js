import chai from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeConfig } from '../src/normalizeConfig.js';

const { expect } = chai;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function removeAllPaths(config) {
  const configNoPaths = { ...config };
  delete configNoPaths.devServer.rootDir;
  delete configNoPaths.configDir;
  delete configNoPaths._configDirCwdRelative;
  delete configNoPaths.inputDir;
  delete configNoPaths._inputDirConfigDirRelative;
  delete configNoPaths._themePathes;
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

    expect(removeAllPaths(config)).to.deep.equal({
      command: 'help',
      devServer: {},
      outputDir: '_site',
      pathPrefix: '/docs',
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build', htmlFiles: [] }],
      eleventy: {
        dir: {
          data: '_merged_data',
          includes: '_merged_includes',
        },
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

    expect(removeAllPaths(config)).to.deep.equal({
      command: 'help',
      devServer: {
        more: 'settings',
      },
      outputDir: '_site',
      pathPrefix: '/docs',
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build', htmlFiles: [] }],
      eleventy: {
        dir: {
          data: '_merged_data',
          includes: '_merged_includes',
        },
      },
    });
  });

  it('respects a rocket.config.js file', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'overrides');
    const config = await normalizeConfig({
      configDir,
    });

    expect(removeAllPaths(config)).to.deep.equal({
      command: 'help',
      devServer: {
        more: 'from-file',
      },
      outputDir: '_site',
      pathPrefix: '/docs',
      watch: true,
      setupUnifiedPlugins: [],
      themes: [],
      plugins: [{ command: 'start' }, { command: 'build', htmlFiles: [] }],
      eleventy: {
        dir: {
          data: '_merged_data',
          includes: '_merged_includes',
        },
      },
    });
  });
});
