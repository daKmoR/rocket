import { createSpaMetaConfig } from './createSpaConfig.js';
import { adjustPluginOptions, metaConfigToRollupConfig } from 'plugins-manager';

export function createMpaConfig(userConfig) {
  const { config, pluginsArray } = createMpaMetaConfig(userConfig);

  const final = metaConfigToRollupConfig(config, pluginsArray);
  return final;
}

export function createMpaMetaConfig(userConfig = { output: {}, setupPlugins: [] }) {
  const { config, pluginsArray } = createSpaMetaConfig(userConfig);

  config.setupPlugins = [
    adjustPluginOptions('rollup-plugin-html', {
      flattenOutput: false,
    }),
    adjustPluginOptions('generate-sw', {
      navigateFallback: '/404.html',
    }),
    ...config.setupPlugins,
  ];

  return { config, pluginsArray };
}
