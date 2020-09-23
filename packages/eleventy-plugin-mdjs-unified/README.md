# eleventy-plugin-mdjs

Use mdjs in your 11ty site.

## Setup

```
npm install @d4kmor/eleventy-plugin-mdjs
```

Create an 11ty config file `.eleventy.js`

```js
const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs);
};
```

As mdjs does return html AND javascript at the same time we need to have a template that can understand it. For that we create a layout file.

👉 `_includes/layout.njk`

```js
<main>
  {{ content.html | safe }}
</main>

<script type="module">
  {{ content.jsCode | safe }}
</script>
```

And in our content we then need to make sure to use that template.

👉 `index.md`

```
---
layout: layout.njk
---

# Hello World
```

You can see a minimal setup in the [examples repo](https://github.com/daKmoR/rocket-example-projects/tree/master/eleventy-and-mdjs).

## Configure a unified or remark plugin with mdjs

By providing a `setupUnifiedPlugins` function as an option to `eleventy-plugin-mdjs` you can set options for all unified/remark plugins.

This example adds a CSS class to the `htmlHeading` plugin so heading links can be selected in CSS.

```js
const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs');

function addClassAnchorToHtmlHeading(plugins) {
  return plugins.map(pluginObj => {
    if (pluginObj.name === 'htmlHeading') {
      return {
        ...pluginObj,
        options: {
          properties: {
            className: ['anchor'],
          },
        },
      };
    }
    return pluginObj;
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs, {
    setupUnifiedPlugins: addClassAnchorToHtmlHeading,
  });
};
```

## Add a unified or remark plugin

The order of plugins is important in unified as each plugin processes the content and passes on its result.
Some plugins do work with the markdown AST and some with the rehype (e.g. html) AST. In order to get access to the correct AST the plugin needs to be in a specific location in the processing order.

Examples on how to insert a plugin right after creating the markdown AST.

```js
const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs');

function addPluginForMarkdownAst(plugins) {
  // only add it if it's not already there
  if (plugins.findIndex(plugin => plugin.name === 'pluginForMarkdownAst') === -1) {
    // add plugins right after markdown
    const markdownPluginIndex = plugins.findIndex(plugin => plugin.name === 'markdown');
    plugins.splice(markdownPluginIndex + 1, 0, {
      name: 'pluginForMarkdownAst',
      plugin: pluginForMarkdownAst,
    });
  }
  return plugins;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs, {
    setupUnifiedPlugins: [addPluginForMarkdownAst],
  });
};
```

Examples on how to insert a plugin right after creating the rehype AST.

```js
const pluginMdjs = require('@d4kmor/eleventy-plugin-mdjs');

function addPluginForRehypeAst(plugins) {
  // only add it if it's not already there
  if (plugins.findIndex(plugin => plugin.name === 'pluginForRehypeAst') === -1) {
    // add plugins right after remark2rehype
    const remark2rehypePluginIndex = plugins.findIndex(plugin => plugin.name === 'remark2rehype');
    plugins.splice(remark2rehypePluginIndex + 1, 0, {
      name: 'pluginForRehypeAst',
      plugin: pluginForRehypeAst,
    });
  }
  return plugins;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs, {
    setupUnifiedPlugins: [addPluginForRehypeAst],
  });
};
```

You can also add both

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginMdjs, {
    setupUnifiedPlugins: [addPluginForMarkdownAst, addPluginForRehypeAst],
  });
};
```
