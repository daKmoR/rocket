/* eslint-disable no-param-reassign */
const fs = require('fs').promises;
const path = require('path');

const REGEXP_TO_FILE_PATH = new RegExp('/', 'g');

function toFilePath(browserPath) {
  return browserPath.replace(REGEXP_TO_FILE_PATH, path.sep);
}

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

async function getEleventyRenderedFile(elev, absRootDir, absFilePath) {
  let body = 'eleventyRender: File not found';
  elev.config.filters['hook-for-rocket'] = (content, outputPath, inputPath) => {
    const currentAbsFilePath = path.join(process.cwd(), inputPath);

    // check if this is the file we're looking for
    if (currentAbsFilePath === absFilePath) {
      body = content;
    }
    return content;
  };

  await elev.write();

  // TODO: Make this work outside this repository
  return body
    .replace(/href="\//g, 'href="/packages/cli/demo/docs/')
    .replace(/src="\//g, 'src="/packages/cli/demo/docs/');
}

function eleventyPlugin({ absRootDir, elev }) {
  /** @type {import('chokidar').FSWatcher} */
  let fileWatcher;

  return {
    serverStart(args) {
      ({ fileWatcher } = args);
    },

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

      const newBody = await getEleventyRenderedFile(elev, absRootDir, absFilePath);
      if (!newBody) {
        return undefined;
      }

      fileWatcher.add(absFilePath);
      return { body: newBody, type: 'html' };
    },
  };
}

module.exports = eleventyPlugin;
