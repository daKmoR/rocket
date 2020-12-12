// @ts-check
import emoji from 'remark-emoji';
import { addPluginAfter } from '@mdjs/core';

/** @type {Partial<import("../../../types/main").RocketCliOptions>} */
const config = {
  setupUnifiedPlugins: [addPluginAfter('markdown', 'emoji', emoji)],
};

export default config;
