import chai from 'chai';
import { RocketCli } from '../src/RocketCli.js';

const { expect } = chai;

describe('RocketCli', () => {
  it('has the default command help', async () => {
    const cli = new RocketCli({ argv: [] });
    await cli.setup();
    expect(cli.config.command).to.equal('help');
  });

  it('does accept a command as the 2nd parameter', async () => {
    const cli = new RocketCli({ argv: ['build'] });
    await cli.setup();
    expect(cli.config.command).to.equal('build');
  });
});
