import path from 'path';
import { fileURLToPath } from 'url';
import { createMpaConfig } from '@d4kmor/building-rollup';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default createMpaConfig({
  input: '**/*.html',
  developmentMode: true,
  rootDir: __dirname,
  output: {
    dir: path.join(__dirname, '..', '__output'),
  },
});
