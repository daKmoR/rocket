import { rocketLaunch } from '@d4kmor/launch';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default {
  themes: [rocketLaunch(), rocketSearch()],
  build: {
    absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
    // emptyOutputDir: false,
    // pathPrefix: 'subfolder-only-for-build',
    // serviceWorkerFileName: 'sw.js',
  },
  // eleventy: eleventyConfig => {
  //   eleventyConfig.addFilter('foo', () => 'foo');
  // }
};
