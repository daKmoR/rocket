# Configuration >> Getting Started ||10

The main config file is `rocket.config.js` or `rocket.config.mjs`.

It typcially looks something like this

```js
import { rocketLaunch } from '@d4kmor/launch';
import { rocketBlog } from '@d4kmor/blog';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default /** @type {Partial<import('@d4kmor/cli').RocketCliOptions>} */ ({
  themes: [rocketLaunch(), rocketBlog(), rocketSearch()],
  build: {
    absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
    // emptyOutputDir: false,
    // pathPrefix: 'subfolder-only-for-build',
    // serviceWorkerFileName: 'sw.js',
  },
  // eleventy: eleventyConfig => {
  //   eleventyConfig.addFilter('foo', () => 'foo');
  // }
});
```

## Adding Remark/Unified Plugins

If you want to a plugin to the markdown processing you can use `setupUnifiedPlugins`.

```js
import emoji from 'remark-emoji';
import { addPluginAfter } from '@mdjs/core';

/** @type {Partial<import('@d4kmor/cli').RocketCliOptions>} */
const config = {
  setupUnifiedPlugins: [addPluginAfter('markdown', 'emoji', emoji)],
};

export default config;
```

For plugins that should handle the markdown ast you should use `addPluginAfter('markdown', 'my-plugin', MyPlugin)`. <br>
While for the rehype ast you should use `addPluginAfter('remark2rehype', 'my-plugin', MyPlugin)`.
