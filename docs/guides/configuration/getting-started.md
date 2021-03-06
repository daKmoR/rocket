# Configuration >> Getting Started ||10

The main config file is `rocket.config.js` or `rocket.config.mjs`.

It typically looks something like this

```js
import { rocketLaunch } from '@d4kmor/launch';
import { rocketBlog } from '@d4kmor/blog';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default /** @type {Partial<import('@d4kmor/cli').RocketCliOptions>} */ ({
  presets: [rocketLaunch(), rocketBlog(), rocketSearch()],
  emptyOutputDir: false,
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
});
```

The Plugins Manager helps you register and execute your plugins across the various Rocket components - rollup, dev-server, eleventy, and markdown. It replaces the specific registration/execution call in a given plugin system by an intent to use that plugin.

## Adding Remark/Unified Plugins

If you want to a plugin to the markdown processing you can use `setupUnifiedPlugins`.

```js
import emoji from 'remark-emoji';
import { addPlugin } from 'plugins-manager';

/** @type {Partial<import('@d4kmor/cli').RocketCliOptions>} */
const config = {
  setupUnifiedPlugins: [addPlugin({ location: 'markdown', name: 'emoji', plugin: emoji })],
};

export default config;
```

For plugins that should handle the markdown <abbr title="Abstract Syntax Tree">AST</abbr> you should use `addPlugin({ location: 'markdown', name: 'my-plugin', plugin: MyPlugin})`. <br>
While for the rehype ast you should use `addPlugin({ location: 'remark2rehype', name: 'my-plugin', plugin: MyPlugin})`.
