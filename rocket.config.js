import { rocketLaunch } from '@d4kmor/launch';
import { rocketBlog } from '@d4kmor/blog';
import { rocketSearch } from '@d4kmor/search';
import { absoluteBaseUrlNetlify } from '@d4kmor/core/helpers';

export default {
  presets: [rocketLaunch(), rocketBlog(), rocketSearch()],
  build: {
    absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
    // emptyOutputDir: false,
    // pathPrefix: 'subfolder-only-for-build',
    // serviceWorkerFileName: 'sw.js',
  },
};
