import fs from 'fs';
// import { esbuildPlugin } from '@web/dev-server-esbuild';

const packages = fs
  .readdirSync('packages')
  .filter(
    dir =>
      fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test-web`),
  );

export default {
  nodeResolve: true,
  // plugins: [esbuildPlugin({ ts: true })],
  groups: packages.map(pkg => {
    return {
      name: pkg,
      files: `packages/${pkg}/test-web/**/*.test.js`,
    };
  }),
};
