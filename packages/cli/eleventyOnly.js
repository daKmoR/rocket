const Eleventy = require('@11ty/eleventy');

async function run() {
  const elev = new Eleventy('./demo/docs', './__site');
  elev.setConfigPathOverride('./src/shared/.eleventy.js');
  elev.setDryRun(true); // do not write to file system
  await elev.init();
  await elev.write();
}

run();
