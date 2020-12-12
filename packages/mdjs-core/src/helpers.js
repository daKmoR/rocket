/** @typedef {import('unified').Plugin} UnifiedPlugin */
/** @typedef {import('@mdjs/core/types/code').MdjsProcessPlugin} MdjsProcessPlugin */

/**
 * @param {string} afterThisName
 * @param {string} addThisName
 * @param {UnifiedPlugin} addThisFunction
 */
function addPluginAfter(afterThisName, addThisName, addThisFunction) {
  /**
   * @param {MdjsProcessPlugin[]} plugins
   */
  const addPlugin = plugins => {
    if (plugins.findIndex(plugin => plugin.name === addThisName) === -1) {
      const markdownPluginIndex = plugins.findIndex(plugin => plugin.name === afterThisName);
      plugins.splice(markdownPluginIndex + 1, 0, {
        name: addThisName,
        plugin: addThisFunction,
      });
    }
    return plugins;
  };
  return addPlugin;
}

module.exports = {
  addPluginAfter,
};
