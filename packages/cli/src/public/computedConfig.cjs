let computedConfig = {};

function updateComputedConfig(config) {
  computedConfig = config;
}

function getComputedConfig() {
  return computedConfig;
}

module.exports = {
  updateComputedConfig,
  getComputedConfig,
};
