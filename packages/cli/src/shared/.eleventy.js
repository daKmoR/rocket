const pluginMdjs = require('@dakmor/eleventy-plugin-mdjs');
const eleventyRocketNav = require('@dakmor/eleventy-rocket-nav');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs);
  eleventyConfig.addPlugin(eleventyRocketNav);

  eleventyConfig.addPassthroughCopy('./styles.css');
  eleventyConfig.addPassthroughCopy('./**/*.{png,gif}');

  eleventyConfig.addCollection('docs', collection => {
    return [...collection.getFilteredByGlob('./demo/docs/docs/**/*.md')];
  });
  eleventyConfig.addCollection('learn', collection => {
    return [...collection.getFilteredByGlob('./demo/docs/learn/**/*.md')];
  });
  eleventyConfig.addCollection('post', collection => {
    return [...collection.getFilteredByGlob('./demo/docs/blog/**/*.md')];
  });
  eleventyConfig.addCollection('header', collection => {
    return [
      ...collection.getFilteredByGlob('./demo/docs/learn/index.md'),
      ...collection.getFilteredByGlob('./demo/docs/docs/index.md'),
      ...collection.getFilteredByGlob('./demo/docs/blog/index.md'),
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
    dir: { input: './', output: './_site-dev' },
    passthroughFileCopy: true,
  };
};
