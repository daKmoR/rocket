---
title: Learning Rocket
eleventyNavigation:
  key: Learn
  order: -50
---

Rocket is a fundamentally straight forward way to generate static pages while still allowing to sprinkle in some JavaScript where needed.

## Quick start

Before you can use Rocket you need to install it:

```bash
npm i @rocket/cli @rocket/launch
```

Once that is done it is time to add your first page to your docs folder.

```bash
mkdir docs
echo "Hello world" > index.md
```

You can now start rocket and it will be using the `@rocket/launch` theme.

```bash
npx start-rocket
```
