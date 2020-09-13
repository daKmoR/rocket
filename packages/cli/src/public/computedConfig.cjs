const fsSync = require('fs');
const path = require('path');

const fs = fsSync.promises;

const COMPUTED_CONFIG_PATH = path.join(process.cwd(), '__eleventySettings.json');

async function updateComputedConfig(config) {
  await fs.writeFile(COMPUTED_CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function getComputedConfig() {
  try {
    const configString = await fs.readFile(COMPUTED_CONFIG_PATH);
    return JSON.parse(configString);
  } catch (e) {
    console.log(`Could not find or parse computed config file at ${COMPUTED_CONFIG_PATH}`);
    throw new Error(e.message);
  }
}

function getComputedConfigSync() {
  try {
    const configString = fsSync.readFileSync(COMPUTED_CONFIG_PATH);
    return JSON.parse(configString);
  } catch (e) {
    console.log(`Could not find or parse computed config file at ${COMPUTED_CONFIG_PATH}`);
    throw new Error(e.message);
  }
}

async function cleanupComputedConfig() {
  if (fsSync.existsSync(COMPUTED_CONFIG_PATH)) {
    await fs.unlink(COMPUTED_CONFIG_PATH);
  }
}

module.exports = {
  updateComputedConfig,
  getComputedConfig,
  getComputedConfigSync,
  cleanupComputedConfig,
  COMPUTED_CONFIG_PATH,
};
