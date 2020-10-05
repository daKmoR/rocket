> This project is in an ALPHA phase

# Rocket

## Installation

```bash
npm i @d4kmor/cli @d4kmor/launch
```

## Add to your .gitignore

```
## Rocket ignore files (need to be the full relative path to the folders)
docs/._merged_data/
docs/._merged_assets/
docs/._merged_includes/
```

## Usage

```json
"scripts": {
  "start": "rocket start",
  "build": "rocket build",
}
```

## Use the launch theme

Create `rocket.config.js` as es module (may need `.mdjs`)

```js
import { rocketLaunch } from '@d4kmor/launch';

export default {
  themes: [rocketLaunch()],
};
```

## Create Content

```
echo "# My First Page" > ./docs/guides/index.md
```
