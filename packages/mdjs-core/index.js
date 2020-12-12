/** @typedef {import('@mdjs/core/types/code').MarkdownResult} MarkdownResult */
/** @typedef {import('@mdjs/core/types/code').Story} Story */
/** @typedef {import('@mdjs/core/types/code').MdjsProcessPlugin} MdjsProcessPlugin */

const { mdjsParse } = require('./src/mdjsParse.js');
const { mdjsStoryParse } = require('./src/mdjsStoryParse.js');
const { mdjsDocPage } = require('./src/mdjsDocPage.js');
const { mdjsProcess, mdjsProcessPlugins } = require('./src/mdjsProcess.js');
const { isMdjsContent } = require('./src/isMdjsContent.js');
const { addPluginAfter } = require('./src/helpers.js');

module.exports = {
  mdjsParse,
  mdjsStoryParse,
  mdjsDocPage,
  mdjsProcess,
  mdjsProcessPlugins,
  isMdjsContent,
  addPluginAfter,
};
