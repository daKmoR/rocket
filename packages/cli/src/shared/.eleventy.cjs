const path = require('path');
const fs = require('fs');
const { readdirSync } = require('fs');

const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs-unified');
const eleventyRocketNav = require('@d4kmor/eleventy-rocket-nav');
const { processContentWithTitle } = require('@d4kmor/core/title');

const { getComputedConfig } = require('../public/computedConfig.cjs');

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
  const config = getComputedConfig();

  const { pathPrefix, inputDir, configDir, outputDir } = config;
  const { data, includes } = config.eleventy.dir;

  eleventyConfig.addFilter('asset', function (inPath) {
    return inPath.replace('_assets/', '_merged_assets/');
  });

  eleventyConfig.addFilter('toAbsPath', function (inPath) {
    return path.join(inputDir, inPath);
  });

  eleventyConfig.addPassthroughCopy(`${inputDir}/**/*.{png,gif,jpg,svg,css,xml,json,js}`);
  eleventyConfig.addPlugin(pluginMdjs, { setupUnifiedPlugins: config.setupUnifiedPlugins });
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
        });
        docs = docs.filter(page => page.inputPath !== `./${indexSection}`);

        // docs = addPrevNextUrls(docs);
        return docs;
      });
    }
  }

  // adds title from markdown headline to all pages
  eleventyConfig.addCollection('--workaround-to-get-all-pages--', collection => {
    const docs = collection.getAll();
    docs.forEach(page => {
      page.data.addTitleHeadline = true;
      const titleData = processContentWithTitle(
        page.template.inputContent,
        page.template._templateRender._engineName,
      );
      if (titleData) {
        page.data.title = titleData.title;
        page.data.eleventyNavigation = { ...titleData.eleventyNavigation };
        page.data.addTitleHeadline = false;
      }
    });
    return docs;
  });

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

  if (config.eleventyFunction) {
    config.eleventyFunction(eleventyConfig);
  }

  return {
    dir: {
      // no input: inputDir as we set this when we create the eleventy instance
      includes,
      data,
      output: outputDir,
    },
    pathPrefix,
    passthroughFileCopy: true,
  };
};
