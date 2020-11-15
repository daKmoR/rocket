import chai from 'chai';
import { renderResults, renderResult } from '../src/renderResults.js';

const { expect } = chai;

const defaultResult = {
  id: '/_site-dev/docs/#content-top',
  terms: ['more'],
  title: 'Documentation',
  headline: 'Read more',
  body: 'Here you will read more about it.',
  section: 'docs',
};

describe('renderResults', () => {
  it('renders a single result', async () => {
    const result = renderResult({ result: defaultResult, search: 'more' });
    expect(result).to.deep.equal([
      '  📖 ntation > Read \u001b[32mmore\u001b[39m',
      '     \u001b[90m you will read \u001b[32mmore\u001b[90m about it.\u001b[39m',
      '     \u001b[96mhttp://localhost:8080/_site-dev/docs/#content-top\u001b[39m',
      '',
    ]);
  });

  it('renders results', async () => {
    const result = renderResults({ term: 'launch', results: [defaultResult] });
    expect(result).to.deep.equal([
      '\u001b[2J\u001b[3J\u001b[H',
      'Searching for: launch█',
      '',
      '  📖 ntation > Read \u001b[32mmore\u001b[39m',
      '     \u001b[90m you will read \u001b[32mmore\u001b[90m about it.\u001b[39m',
      '     \u001b[96mhttp://localhost:8080/_site-dev/docs/#content-top\u001b[39m',
      '',
      '',
      'Legend:',
      '\u001b[90m   📜 Guides  📖 Docs  📝 Blog  ❓ Others\u001b[39m',
      '',
      '\u001b[90mPress\u001b[39m Strg+C \u001b[90mto quit search.\u001b[39m',
    ]);
  });
});
