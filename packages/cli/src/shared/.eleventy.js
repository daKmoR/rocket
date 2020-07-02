const pluginMdjs = require('@dakmor/eleventy-plugin-mdjs');
const eleventyRocketNav = require('@dakmor/eleventy-rocket-nav');

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

// console.log('CONFIG: side effect');

const readCommandLineArgs = require('../start/readCommandLineArgs');

module.exports = function (eleventyConfig) {
  const config = /** @type {ServerConfig & { files: string[], configDir: string }} */ (readCommandLineArgs());
  const inputDir = config.configDir;

  // console.log('CONFIG: execute', config);
  eleventyConfig.addPlugin(pluginMdjs);
  eleventyConfig.addPlugin(eleventyRocketNav);

  eleventyConfig.addPassthroughCopy('./styles.css');
  eleventyConfig.addPassthroughCopy('./**/*.{png,gif}');

  eleventyConfig.addCollection('docs', collection => {
    let docs = [...collection.getFilteredByGlob(`${inputDir}/docs/**/*.md`)];
    docs.forEach(page => {
      page.data.section = 'docs';
    });
    docs = addPrevNextUrls(docs);
    return docs;
  });
  eleventyConfig.addCollection('learn', collection => {
    let learn = [...collection.getFilteredByGlob(`${inputDir}/learn/**/*.md`)];
    learn.forEach(page => {
      page.data.section = 'learn';
    });
    const keyedOrder = {};
    learn.forEach(item => {
      if (item.data.eleventyNavigation.key) {
        if (item.data.eleventyNavigation.order) {
          keyedOrder[item.data.eleventyNavigation.key] = item.data.eleventyNavigation.order + 1;
        } else {
          keyedOrder[item.data.eleventyNavigation.key] = item.data.eleventyNavigation.parent;
        }
      }
    });
    const getOrder = parent => {
      let order = keyedOrder[parent];
      let depthOffset = 0;
      while (typeof order === 'string') {
        order = keyedOrder[order];
        depthOffset += 1;
      }
      return order + depthOffset;
    };
    learn = learn.sort(function (a, b) {
      const orderA = a.data.eleventyNavigation.order || getOrder(a.data.eleventyNavigation.parent);
      const orderB = b.data.eleventyNavigation.order || getOrder(b.data.eleventyNavigation.parent);
      if (orderA < orderB) {
        return -1;
      }
      if (orderB < orderA) {
        return 1;
      }
      return 0;
    });
    learn = addPrevNextUrls(learn);
    return learn;
  });
  eleventyConfig.addCollection('post', collection => {
    return [...collection.getFilteredByGlob(`${inputDir}/blog/**/*.md`)];
  });
  eleventyConfig.addCollection('header', collection => {
    return [
      ...collection.getFilteredByGlob(`${inputDir}/learn/index.md`),
      ...collection.getFilteredByGlob(`${inputDir}/docs/index.md`),
      ...collection.getFilteredByGlob(`${inputDir}/blog/index.md`),
    ];
  });

  // eleventyConfig.addCollection('section', function(collection) {
  //   // This works _because_ of our current content. Something like https://github.com/Polymer/lit-html/blob/master/docs/.eleventy.js#L37
  //   // would be more robust, but there are likely other answers here.
  //   return collection.getFilteredByTag('section').reverse();
  // });

  // 11ty needs this as it apparently reads this config from multiple files
  // and only if we provide this hook we can actually override later when we
  // programmatically trigger 11ty
  // @TODO: create an issue and find a nicer way to add this transformer
  eleventyConfig.addTransform('hook-for-rocket');

  return {
    dir: {
      input: inputDir,
      output: './_site-dev',
      // includes: '../packages/cli/demo/docs/_includes/',
      // data: '../packages/cli/demo/docs/_data/',
    },
    passthroughFileCopy: true,
  };
};
