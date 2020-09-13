import chai from 'chai';
import fs from 'fs';
import { RocketCli } from '../src/RocketCli.js';
import computedConfig from '../src/public/computedConfig.cjs';

const { expect } = chai;

const { COMPUTED_CONFIG_PATH } = computedConfig;

describe('RocketCli', () => {
  let cli;

  afterEach(async () => {
    if (cli?.cleanup) {
      await cli.cleanup();
    }
  });

  it('has the default command help', async () => {
    cli = new RocketCli({ argv: [] });
    await cli.setup();
    expect(cli.config.command).to.equal('help');
  });

  it('does accept a command as the 2nd parameter', async () => {
    cli = new RocketCli({ argv: ['build'] });
    await cli.setup();
    expect(cli.config.command).to.equal('build');
  });

  it('does create and cleanup a computed config file', async () => {
    cli = new RocketCli();
    // no config when we start
    expect(fs.existsSync(COMPUTED_CONFIG_PATH)).to.be.false;

    // has a config after setup
    await cli.setup();
    expect(fs.existsSync(COMPUTED_CONFIG_PATH)).to.be.true;

    // cleans it up
    await cli.cleanup();
    expect(fs.existsSync(COMPUTED_CONFIG_PATH)).to.be.false;
  });
});
