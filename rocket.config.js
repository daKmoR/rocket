// const footnotes = require('remark-footnotes');
import { rocketSearch } from '@d4kmor/search';
import { rocketLaunch } from '@d4kmor/launch';

// function addSupportForFoodnotes(plugins) {
//   // add right after markdown
//   const markdownPluginIndex = plugins.findIndex(plugin => plugin.name === 'remark2rehype');
//   plugins.splice(markdownPluginIndex + 1, 0, {
//     name: 'footnotes',
//     plugin: footnotes,
//     options: { inlineNotes: true },
//   });
//   return plugins;
// }

export default {
  themes: [rocketLaunch(), rocketSearch()],

  // dir: {
  //   data: '._merged-data',
  //   includes: '._merged-includes',
  // },
  // setupUnifiedPlugins: [addOcticonToHeadlines],

  // setupPlugins: plugins => {
  //   plugins.push(new RocketSearch());
  //   return plugins;
  // },

  // TODO: support these config options
  // dataDir: '_data',
  // eleventy: {},
};
