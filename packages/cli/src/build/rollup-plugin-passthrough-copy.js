const glob = require('glob');
const fs = require('fs');
const path = require('path');

/**
 * Lists all files using the specified glob, starting from the given root directory.
 *
 * Will return all matching file paths fully resolved.
 */
function listFiles(fromGlob, rootDir) {
  return new Promise(resolve => {
    glob(fromGlob, { cwd: rootDir }, (er, files) => {
      // remember, each filepath returned is relative to rootDir
      resolve(
        files
          // fully resolve the filename relative to rootDir
          .map(filePath => path.resolve(rootDir, filePath))
          // filter out directories
          .filter(filePath => !fs.lstatSync(filePath).isDirectory()),
      );
    });
  });
}

async function patternsToFiles(inPatterns, rootDir) {
  const patterns = typeof inPatterns === 'string' ? [inPatterns] : inPatterns;
  const listFilesPromises = patterns.map(pattern => listFiles(pattern, rootDir));
  const arrayOfFilesArrays = await Promise.all(listFilesPromises);
  const files = [];

  for (const filesArray of arrayOfFilesArrays) {
    for (const filePath of filesArray) {
      files.push(filePath);
    }
  }

  return files;
}

function passthroughCopy({ patterns = [], rootDir = process.cwd() }) {
  const resolvedRootDir = path.resolve(rootDir);
  return {
    async generateBundle() {
      const files = await patternsToFiles(patterns, rootDir);
      for (const filePath of files) {
        const fileName = path.relative(resolvedRootDir, filePath);
        this.emitFile({
          type: 'asset',
          fileName,
          source: fs.readFileSync(filePath),
        });
      }
    },
  };
}

module.exports = { passthroughCopy };
