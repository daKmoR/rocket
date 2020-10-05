import path from 'path';
import { startDevServer } from '@web/dev-server';
import { promises as fs } from 'fs';

const REGEXP_TO_FILE_PATH = new RegExp('/', 'g');

/**
 * @param {string} browserPath
 */
function toFilePath(browserPath) {
  return browserPath.replace(REGEXP_TO_FILE_PATH, path.sep);
}

/**
 * @param {string} browserPath
 * @param {string} absRootDir
 */
async function getFileWithLastUrlDir(browserPath, absRootDir) {
  const endIndex = browserPath.length - 1;
  const startIndex = browserPath.lastIndexOf('/', endIndex - 1);
  const name = browserPath.substring(startIndex + 1, endIndex);
  const pathTo = browserPath.substring(0, startIndex);
  const browserPathWithFilename = path.join(pathTo, `${name}.md`);
  const potentialFilePath = path.join(absRootDir, toFilePath(browserPathWithFilename));

  try {
    await fs.access(potentialFilePath);
    return potentialFilePath;
  } catch (error) {
    return undefined;
  }
}

const pageCache = {};

function eleventyPlugin({ absRootDir }) {
  return {
    name: 'eleventyPlugin',

    async serve(ctx) {
      let absFilePath;

      if (ctx.path.endsWith('/')) {
        // for urls ending with / we need to match eleventy's URL rewriting logic
        const filePathForUrl = await getFileWithLastUrlDir(ctx.path, absRootDir);

        if (filePathForUrl) {
          // URL: /foo/bar/, eleventy: /foo/bar.md
          absFilePath = filePathForUrl;
        } else {
          // URL: /foo/bar/, eleventy: /foo/bar/index.md
          absFilePath = path.join(absRootDir, toFilePath(ctx.path), 'index.md');
        }
      } else if (['.html', '.md'].some(ext => ctx.path.endsWith(ext))) {
        // we handle urls that end with .html or .md
        // URL: /foo/bar/index.html, eleventy: /foo/bar/index.md
        // URL: /foo/bar/foo.md, eleventy: /foo/bar/foo.md
        const browserPath = ctx.path.replace('.html', '.md');
        absFilePath = path.join(absRootDir, toFilePath(browserPath));
      } else {
        // we don't handle urls that don't end with /, .md or .html
        return undefined;
      }

      const newBody = pageCache[absFilePath];
      if (!newBody) {
        return undefined;
      }

      return { body: newBody, type: 'html' };
    },
  };
}

export class RocketStart {
  command = 'start';

  async setup({ config, argv }) {
    this.__argv = argv;
    this.config = {
      ...config,
      devServer: {
        ...config.devServer,
      },
    };
  }

  async inspectRenderedHtml({ inputPath, html }) {
    const currentAbsFilePath = path.join(process.cwd(), inputPath);
    pageCache[currentAbsFilePath] = html;
  }

  async execute() {
    const absRootDir = this.config.devServer.rootDir
      ? path.resolve(this.config.devServer.rootDir)
      : process.cwd();

    const devServerConfig = {
      nodeResolve: true,
      watch: true,
      ...this.config.devServer,
      open: this.config.devServer.open ? this.config.devServer.open : `${this.config.pathPrefix}/`,
      plugins: [eleventyPlugin({ absRootDir })],
      clearTerminalOnReload: false,
    };

    await startDevServer({
      config: devServerConfig,
      readCliArgs: true,
      readFileConfig: false,
      argv: this.__argv,
    });
  }
}
