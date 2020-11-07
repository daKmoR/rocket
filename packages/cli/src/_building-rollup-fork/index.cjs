/**
 * @typedef {import('./types').BasicOptions} BasicOptions
 * @typedef {import('./types').SpaOptions} SpaOptions
 */

const { createBasicConfig } = require('./createBasicConfig.cjs');
const { createSpaConfig } = require('./createSpaConfig.cjs');
const { createMpaConfig } = require('./createMpaConfig.cjs');

module.exports = { createBasicConfig, createSpaConfig, createMpaConfig };
