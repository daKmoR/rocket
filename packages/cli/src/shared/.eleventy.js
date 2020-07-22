const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs');
const eleventyRocketNav = require('@d4kmor/eleventy-rocket-nav');
const path = require('path');
const fs = require('fs');
const { readdirSync } = require('fs');

const readCommandLineArgs = require('../start/readCommandLineArgs');
const { normalizeConfig } = require('./normalizeConfig');

const addPrevNextUrls = items => {
  items.forEach((item, index) => {
    const prev = index - 1;
    const next = index + 1;
    if (items[prev]) {
      item.data.previousUrl = items[prev].url;
    }
    if (items[next]) {
      item.data.nextUrl = items[next].url;
    }
  });
  return items;
};

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function inlineSvgUrl(file) {
  let relativeFilePath = file.startsWith('/') ? `.${file}` : `./${file}`;
  if (path.extname(file) != '.svg') {
    throw new Error('svgContents requires a filetype of svg');
  }
  let data = fs.readFileSync(relativeFilePath, function (err, contents) {
    if (err) {
      throw new Error(err);
    }
    return contents;
  });
  return data.toString('utf8');
}

module.exports = function (eleventyConfig) {
  const commandLineConfig = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  const config = normalizeConfig(commandLineConfig);
  // console.log(config);
  const configDir = config.configDir;
  const inputDir = path.join(configDir, 'docs');
  const { templatePathPrefix, pathPrefix } = config;
  const { data: dataDir, includes: includesDir } = config.dir;

  eleventyConfig.addFilter('themeUrl', function (url) {
    return path.join(templatePathPrefix, url);
  });
  eleventyConfig.addFilter('themePath', function (url) {
    return path.join('packages', 'launch', url);
  });
  eleventyConfig.addPassthroughCopy('./**/*.{png,gif,jpg,svg,css}');
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

  eleventyConfig.addFilter('inlineSvgUrl', inlineSvgUrl);

  // eleventyConfig.addCollection('post', collection => {
  //   return [...collection.getFilteredByGlob(`${inputDir}/blog/**/*.md`)];
  // });

  // eleventyConfig.addCollection('learn', collection => {
  //   let learn = [...collection.getFilteredByGlob(`${inputDir}/learn/**/*.md`)];
  //   learn.forEach(page => {
  //     page.data.section = 'learn';
  //   });
  //   const keyedOrder = {};
  //   learn.forEach(item => {
  //     if (item.data.eleventyNavigation.key) {
  //       if (item.data.eleventyNavigation.order) {
  //         keyedOrder[item.data.eleventyNavigation.key] = item.data.eleventyNavigation.order + 1;
  //       } else {
  //         keyedOrder[item.data.eleventyNavigation.key] = item.data.eleventyNavigation.parent;
  //       }
  //     }
  //   });
  //   const getOrder = parent => {
  //     let order = keyedOrder[parent];
  //     let depthOffset = 0;
  //     while (typeof order === 'string') {
  //       order = keyedOrder[order];
  //       depthOffset += 1;
  //     }
  //     return order + depthOffset;
  //   };
  //   learn = learn.sort(function (a, b) {
  //     const orderA = a.data.eleventyNavigation.order || getOrder(a.data.eleventyNavigation.parent);
  //     const orderB = b.data.eleventyNavigation.order || getOrder(b.data.eleventyNavigation.parent);
  //     if (orderA < orderB) {
  //       return -1;
  //     }
  //     if (orderB < orderA) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  //   learn = addPrevNextUrls(learn);
  //   return learn;
  // });
  // eleventyConfig.addCollection('post', collection => {
  //   return [...collection.getFilteredByGlob(`${inputDir}/blog/**/*.md`)];
  // });

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
