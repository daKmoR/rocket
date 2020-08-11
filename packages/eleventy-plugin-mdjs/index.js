const { mdjsProcess, mdjsProcessPlugins } = require('@mdjs/core');
const visit = require('unist-util-visit');
const footnotes = require('remark-footnotes');

const plugins = mdjsProcessPlugins.map(pluginObj => {
  if (pluginObj.name === 'htmlHeading') {
    return {
      ...pluginObj,
      options: {
        properties: {
          className: ['anchor'],
        },
        content: [
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              className: ['octicon', 'octicon-link'],
              viewBox: '0 0 16 16',
              ariaHidden: 'true',
              width: 16,
              height: 16,
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  fillRule: 'evenodd',
                  d:
                    'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z',
                },
              },
            ],
          },
        ],
      },
    };
  }
  return pluginObj;
});

function isInternalLink(link) {
  if (link.startsWith('http') || link.startsWith('/')) {
    return false;
  }
  return true;
}

function adjustLinks(options) {
  // remark works by modifying nodes directly
  /* eslint-disable no-param-reassign */
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName === 'a') {
        const href = node.properties && node.properties.href ? node.properties.href : undefined;
        const { inputPath } = options.page;
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
  /* eslint-enable no-param-reassign */
}

// add plugins right after markdown
const markdownPluginIndex = plugins.findIndex(plugin => plugin.name === 'remark2rehype');
plugins.splice(markdownPluginIndex + 1, 0, {
  name: 'footnotes',
  plugin: footnotes,
  options: { inlineNotes: true },
});

// add plugins right after remark2rehype
const remark2rehypePluginIndex = plugins.findIndex(plugin => plugin.name === 'remark2rehype');
plugins.splice(remark2rehypePluginIndex + 1, 0, {
  name: 'adjustLinks',
  plugin: adjustLinks,
});

function eleventyUnified() {
  return {
    set: () => {},
    render: async (str, options) => {
      const pluginsWithPage = plugins.map(plugin => {
        if (plugin.options) {
          // eslint-disable-next-line no-param-reassign
          plugin.options.page = options.page;
        } else {
          // eslint-disable-next-line no-param-reassign
          plugin.options = { page: options.page };
        }
        return plugin;
      });
      const result = await mdjsProcess(str, {
        plugins: pluginsWithPage,
      });
      return result;
    },
  };
}

const defaultEleventyUnifiedOptions = {
  plugins: [],
};

const _eleventy = {
  initArguments: {},
  configFunction: (eleventyConfig, pluginOptions = {}) => {
    const options = {
      ...defaultEleventyUnifiedOptions,
      ...pluginOptions,
    };
    eleventyConfig.setLibrary('md', eleventyUnified(options));
  },
};

module.exports = _eleventy;
