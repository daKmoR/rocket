import chai from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeConfig } from '../src/normalizeConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { expect } = chai;

describe('normalizeConfig', () => {
  it('makes sure essential settings are there', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'empty');
    const config = await normalizeConfig({
      configDir,
    });

    expect(config.devServer.rootDir).to.exist;
    expect(config.themePath).to.match(/launch\/theme$/);
    expect(config.templatePathPrefix).to.match(/launch\/theme$/);
    expect(config.inputDir).to.match(/empty\/docs$/);

    const configNoPaths = { ...config };
    delete configNoPaths.devServer.rootDir;
    delete configNoPaths.themePath;
    delete configNoPaths.templatePathPrefix;
    delete configNoPaths.inputDir;
    delete configNoPaths.dir;
    expect(configNoPaths).to.deep.equal({
      command: 'help',
      configDir,
      devServer: {},
      outputDir: '_site',
      pathPrefix: '/docs',
      themePackage: '@d4kmor/launch',
      watch: true,
    });
  });

  it('can override settings via parameters', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'empty');
    const config = await normalizeConfig({
      configDir,
      devServer: {
        more: 'settings',
      },
      dir: {
        data: 'override/path/_data',
        includes: 'override/as/would/be/relative',
      },
    });

    const configNoPaths = { ...config };
    delete configNoPaths.devServer.rootDir;
    delete configNoPaths.themePath;
    delete configNoPaths.templatePathPrefix;
    delete configNoPaths.inputDir;
    expect(configNoPaths).to.deep.equal({
      command: 'help',
      configDir,
      devServer: {
        more: 'settings',
      },
      dir: {
        data: 'override/path/_data',
        includes: 'override/as/would/be/relative',
        output: '_site',
      },
      outputDir: '_site',
      pathPrefix: '/docs',
      themePackage: '@d4kmor/launch',
      watch: true,
    });
  });

  it('respects a rocket.config.js file', async () => {
    const configDir = path.join(__dirname, 'fixtures', 'overrides');
    const config = await normalizeConfig({
      configDir,
    });

    const configNoPaths = { ...config };
    delete configNoPaths.devServer.rootDir;
    delete configNoPaths.themePath;
    delete configNoPaths.templatePathPrefix;
    delete configNoPaths.inputDir;
    expect(configNoPaths).to.deep.equal({
      command: 'help',
      configDir,
      devServer: {
        more: 'settings',
      },
      dir: {
        data: 'override/path/_data',
        includes: 'override/as/would/be/relative',
        output: '_site',
      },
      outputDir: '_site',
      pathPrefix: '/docs',
      themePackage: '@d4kmor/launch',
      watch: true,
    });
  });
});
