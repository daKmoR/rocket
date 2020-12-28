import chai from 'chai';
import { createBasicConfig } from '../src/createBasicConfig.js';

const { expect } = chai;

describe('createBasicConfig', () => {
  it('does something', () => {
    const config = createBasicConfig();
    expect(config.plugins.length).to.equal(3);
  });
});
