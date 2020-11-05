# Configuration >> Overview ||10

The configuration file is `rocket.config.js` or `rocket.config.mjs`.

The config files consists of the following parts:

```js
import { rocketLaunch } from '@d4kmor/launch';

export default {
  themes: [rocketLaunch()],
  build: {
    emptyOutputDir: true,
    pathPrefix: 'subfolder-only-for-build',
    serviceWorkerFileName: 'service-worker.js',
  },
  eleventy: {
    dir: { ... }
  },
  // or
  eleventy: eleventyConfig => {
    // see https://www.11ty.dev/docs/config/ for all docs
    // if you see `module.exports = {` then its the same as `eleventy: {`
    // if you see `module.exports = function(eleventyConfig) {` then its the same as `eleventy: eleventyConfig => {`
    eleventyConfig.addFilter('foo', () => 'foo');

    return { dir: { ... } };
  }
};
```
