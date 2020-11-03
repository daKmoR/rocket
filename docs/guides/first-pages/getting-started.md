# First Pages >> Getting Started ||10

Rocket is has the following prerequisits:

- [Node 14+](https://nodejs.org/en/)

Make sure they are installed before proceeding.

## Setup

The fastest way to get started is by using an existing theme like the launch theme.

1. Start with an empty new folder

   ```
   mkdir my-project
   cd my-project
   npm init -y
   ```

2. Install dependencies

   ```
   npm install --save-dev @d4kmor/cli @d4kmor/launch
   ```

3. Add to your .gitignore

   ```
   ## Rocket ignore files (need to be the full relative path to the folders)
   docs/_merged_data/
   docs/_merged_assets/
   docs/_merged_includes/
   ```

4. Create a `rocket.config.mjs` (or `.js` if you have type: "module" in you package.json)

   ```js
   import { rocketLaunch } from '@d4kmor/launch';

   export default {
     themes: [rocketLaunch()],
   };
   ```

<inline-notification type="warning" title="note">

All further pathes are relative to your project root (my-project in this case)

</inline-notification>

## Add your first page

👉 `docs/index.md`

```md
# Welcome to Rocket
```

and start up with `npx rocket start`.

## Add a section

In most cases you will have multiple sections in your website and each of those sections will come with it's own sidebar navigation.

To create a section you need to create a folder with an `index.md`.

```bash
mkdir docs/guides
```

👉 `docs/guides/index.md`

```md
# Guides

You can read all about...
```

This will mean you get a menu at the top with "Guides" and a page with the same title.

> How many sections should I have?

Generally we recommend to stay below 5 sections.

## Adding a category

Often each section will have multiple categories.

To create a category you need to create a folder with an `index.md`.

```bash
mkdir docs/guides/first-pages/
```

👉 `docs/guides/first-pages/index.md`

```md
# First Pages
```

## Adding a page to a category

👉 `docs/guides/first-pages/getting-started.md`

```md
# First Pages >> Getting Started

This is how you get started.
```

```js script
import '@d4kmor/launch/inline-notification/inline-notification.js';
```
