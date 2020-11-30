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

<inline-notification type="danger">

You may be tempted to skip the step above, because you're not ready to commit to git yet!

Rocket uses the .gitignore file to manage it's requirements. If you skip this step, rocket will fail to deploy!

</inline-notification>





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

Start up:

```bash
npx rocket start
```

## Taking Inventory Before Adding Pages:

We're about to add both content and navigation at the same time.

It can be helpful to take an inventory, before we start, to separate basic setup from the creation of content and navigation.

- We built the project with basic npm commands
- Added a couple required files manually
- **doc/index.md** to seed the content
- Launches with a simple npx command

That's all it takes to get a new super-fast and powerful site, complete with a service worker, default styling, navigation, and ready to deploy as a plain old static files.

```js script
import '@d4kmor/launch/inline-notification/inline-notification.js';
```
