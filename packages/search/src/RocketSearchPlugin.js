import commandLineArgs from 'command-line-args';
import MiniSearch from 'minisearch';
import { getIdBlocksOfHtml } from './getIdBlocksOfHtml.js';
import readline from 'readline';
import chalk from 'chalk';

const CLEAR_COMMAND = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H';

export class RocketSearchPlugin {
  command = 'search';
  excludeLayouts = ['with-index.njk'];
  documents = [];

  async setup({ config, argv }) {
    const searcDefinitions = [
      {
        name: 'mode',
        alias: 'm',
        type: String,
        defaultValue: 'search',
        description: 'What build to run [search, index]',
      },
      { name: 'term', type: String, defaultOption: true, defaultValue: '' },
      { name: 'help', type: Boolean, description: 'See all options' },
    ];
    const searchOptions = commandLineArgs(searcDefinitions, { argv });

    this.config = {
      ...config,
      search: searchOptions,
    };
  }

  async execute() {
    const { mode } = this.config.search;
    switch (mode) {
      case 'search':
        await this.search();
        break;
      /* no default */
    }
  }

  async inspectRenderedHtml({ html, url, layout, title }) {
    if (!this.excludeLayouts.includes(layout)) {
      const blocks = await getIdBlocksOfHtml({ html, url });
      for (const block of blocks) {
        this.documents.push({
          id: block.url,
          title,
          headline: block.headline,
          body: block.text,
        });
      }
    }
  }

  async search() {
    await this.setupIndex();

    process.stderr.write('\u001B[?25l'); // hide default cursor

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.stderr.write('\u001B[?25h'); // show cursor
        process.exit();
      }

      const { term } = this.config.search;
      switch (key.name) {
        case 'backspace':
          this.config.search.term = term.substring(0, term.length - 1);
          break;
        case 'return':
        case 'right':
        case 'left':
        case 'up':
        case 'down':
          // ignore
          break;
        default:
          this.config.search.term += str;
      }
      this.renderCli();
    });

    this.renderCli();
  }

  renderCli() {
    console.log(CLEAR_COMMAND);
    console.log(`Searching for: ${this.config.search.term}█`);

    const { term } = this.config.search;

    let results = [];

    if (this.miniSearch && term !== '') {
      results = this.miniSearch.search(term);
    }

    console.log('');
    if (results.length > 0) {
      console.log(`  Found ${results.length} result${results.length > 2 ? 's' : ''}`);
      console.log('');
      let count = 0;
      for (const result of results) {
        count += 1;
        if (count > 10) {
          break;
        }
        console.log(`  Headline: ${result.headline}`);
        console.log(`  Title:    ${result.title}`);
        console.log(`  Url:      ${chalk.cyanBright(`http://localhost:8080${result.id}`)}`);
        console.log('  ---');
      }
    } else {
      console.log('  No results found. (type more or less)');
    }

    console.log('');
    console.log(`${chalk.gray('Press')} Strg+C ${chalk.gray('to quit search.')}`);
  }

  async setupIndex() {
    this.miniSearch = new MiniSearch({
      fields: ['title', 'headline', 'body'], // fields to index for full-text search
      storeFields: ['title', 'headline'], // fields to return with search results
      searchOptions: {
        boost: { headline: 3, title: 2 },
        fuzzy: 0.2,
      },
    });

    this.miniSearch.addAll(this.documents);
  }

  // async saveIndex() {
  //   await this.setupIndex();
  //   const json = JSON.stringify(this.miniSearch);
  //   fs.writeFileSync('./foo.json', json);
  // }
}
