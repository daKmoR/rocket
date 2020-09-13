const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs-unified');
const eleventyRocketNav = require('@d4kmor/eleventy-rocket-nav');
const path = require('path');
const fs = require('fs');
const { readdirSync } = require('fs');
const { getComputedConfigSync } = require('../public/computedConfig.cjs');

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function inlineFilePath(filePath) {
  let data = fs.readFileSync(filePath, function (err, contents) {
    if (err) {
      throw new Error(err);
    }
    return contents;
  });
  return data.toString('utf8');
}

function modifySvg(svgText, options) {
  const insertAt = svgText.indexOf('<svg') + 4;
  return `${svgText.substr(0, insertAt)} class="${options.addRootClass}" ${svgText.substr(
    insertAt,
  )}`;
}

module.exports = function (eleventyConfig) {
  const config = getComputedConfigSync();

  const configDir = config.configDir;
  const inputDir = path.join(configDir, 'docs');
  const { templatePathPrefix, pathPrefix, themePath } = config;
  const { data: dataDir, includes: includesDir } = config.dir;

  eleventyConfig.addFilter('themeUrl', function (url) {
    return path.join(templatePathPrefix, url);
  });
  eleventyConfig.addFilter('themePath', function (url) {
    return path.join(themePath, url);
  });

  eleventyConfig.addFilter('inputPath', function (url) {
    return path.join(inputDir, url);
  });

  eleventyConfig.addPassthroughCopy(`${inputDir}/**/*.{png,gif,jpg,svg,css,xml,json,js}`);
  eleventyConfig.addPlugin(pluginMdjs);
  eleventyConfig.addPlugin(eleventyRocketNav);

  const sectionNames = getDirectories(inputDir);
  const headerCollectionPaths = [];
  for (const section of sectionNames) {
    const fullPath = path.join(inputDir, section);
    const indexSection = path.join(fullPath, 'index.md');
    if (fs.existsSync(indexSection)) {
      // add to header
      headerCollectionPaths.push(indexSection);

      // add to specific collection
      eleventyConfig.addCollection(section, collection => {
        let docs = [...collection.getFilteredByGlob(`${inputDir}/${section}/**/*.md`)];
        docs.forEach(page => {
          page.data.section = section;
          if (section === 'blog') {
            page.data.layout = 'blog-details.njk';
          }
        });
        docs = docs.filter(page => page.inputPath !== `./${indexSection}`);
        // docs = addPrevNextUrls(docs);
        return docs;
      });
    }
  }

  eleventyConfig.addCollection('header', collection => {
    let headers = [];
    for (const headerCollectionPath of headerCollectionPaths) {
      headers = [...headers, ...collection.getFilteredByGlob(headerCollectionPath)];
    }
    headers = headers.sort((a, b) => {
      const aOrder = (a.data && a.data.eleventyNavigation && a.data.eleventyNavigation.order) || 0;
      const bOrder = (b.data && b.data.eleventyNavigation && b.data.eleventyNavigation.order) || 0;
      return aOrder - bOrder;
    });
    return headers;
  });

  eleventyConfig.addFilter('inlineFilePath', inlineFilePath);
  eleventyConfig.addFilter('modifySvg', modifySvg);

  // 11ty needs this as it apparently reads this config from multiple files
  // and only if we provide this hook we can actually override later when we
  // programmatically trigger 11ty
  // @TODO: create an issue and find a nicer way to add this transformer
  eleventyConfig.addTransform('hook-for-rocket');

  return {
    dir: {
      includes: includesDir,
      data: dataDir,
    },
    pathPrefix,
    passthroughFileCopy: true,
  };
};
