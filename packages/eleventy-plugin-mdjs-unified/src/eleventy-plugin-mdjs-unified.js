const { mdjsProcess } = require('@mdjs/core');
const visit = require('unist-util-visit');

/** @typedef {import('@mdjs/core').MdjsProcessPlugin} MdjsProcessPlugin */
/** @typedef {import('./types').EleventPluginMdjsUnified} EleventPluginMdjsUnified */

/**
 * @param {string} link
 */
function isInternalLink(link) {
  if (link.startsWith('http') || link.startsWith('/')) {
    return false;
  }
  return true;
}

/**
 * @param {*} pluginOptions
 */
function adjustLinks(pluginOptions) {
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName === 'a') {
        const href = node.properties && node.properties.href ? node.properties.href : undefined;
        const { inputPath } = pluginOptions.page;
        if (isInternalLink(href) && href.endsWith('.md')) {
          if (href.endsWith('index.md')) {
            node.properties.href = href.substring(0, href.lastIndexOf('/') + 1);
          } else {
            node.properties.href = `${href.substring(0, href.length - 3)}/`;
          }

          if (inputPath.endsWith('.md')) {
            if (inputPath.endsWith('index.md')) {
              // nothing
            } else {
              node.properties.href = `../${node.properties.href}`;
            }
          }
        }
      }
    });
    return tree;
  };
}

/**
 * @param {MdjsProcessPlugin[]} plugins
 */
function addAdjustLinksForEleventy(plugins) {
  // add plugins right after remark2rehype
  const remark2rehypePluginIndex = plugins.findIndex(plugin => plugin.name === 'remark2rehype');
  plugins.splice(remark2rehypePluginIndex + 1, 0, {
    name: 'adjustLinks',
    plugin: adjustLinks,
  });
  return plugins;
}

/**
 * @param {EleventPluginMdjsUnified} pluginOptions
 */
function eleventyUnified(pluginOptions) {
  /**
   * @param {string} mdjs
   * @param {*} eleventySettings
   */
  async function render(mdjs, eleventySettings) {
    /** @type {function[]} */
    let userSetupUnifiedPlugins = [];
    if (pluginOptions.setupUnifiedPlugins) {
      if (typeof pluginOptions.setupUnifiedPlugins === 'function') {
        userSetupUnifiedPlugins = [pluginOptions.setupUnifiedPlugins];
      }
      if (Array.isArray(pluginOptions.setupUnifiedPlugins)) {
        userSetupUnifiedPlugins = pluginOptions.setupUnifiedPlugins;
      }
    }

    /**
     * @param {MdjsProcessPlugin[]} plugins
     */
    function addEleventyPageToEveryPlugin(plugins) {
      return plugins.map(plugin => {
        if (plugin.options) {
          plugin.options.page = eleventySettings.page;
        } else {
          plugin.options = { page: eleventySettings.page };
        }
        return plugin;
      });
    }

    const result = await mdjsProcess(mdjs, {
      setupUnifiedPlugins: [
        addAdjustLinksForEleventy,
        ...userSetupUnifiedPlugins,
        addEleventyPageToEveryPlugin,
      ],
    });
    return result;
  }
  return {
    set: () => {
      // do nothing
    },
    render,
  };
}

/**
 * @param {*} eleventyConfig
 * @param {EleventPluginMdjsUnified} [pluginOptions]
 */
function configFunction(eleventyConfig, pluginOptions = {}) {
  eleventyConfig.setLibrary('md', eleventyUnified(pluginOptions));
}

const eleventPluginMdjsUnified = {
  initArguments: {},
  configFunction,
};

module.exports = eleventPluginMdjsUnified;
