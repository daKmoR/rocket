import path from 'path';
import { fileURLToPath } from 'url';
import { RocketSearchPlugin } from '../src/RocketSearchPlugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function rocketSearch() {
  return {
    path: path.resolve(__dirname),
    setupPlugins: plugins => {
      plugins.push(new RocketSearchPlugin());
      return plugins;
    },
  };
}
