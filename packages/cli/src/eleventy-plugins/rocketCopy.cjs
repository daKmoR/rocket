const rocketCopy = {
  configFunction: (eleventyConfig, { inputDir, filesExtensionsToCopy }) => {
    eleventyConfig.addPassthroughCopy(`${inputDir}/**/*.{${filesExtensionsToCopy}}`);
  },
};

module.exports = rocketCopy;
