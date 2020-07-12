---
title: Working with your first pages
eleventyNavigation:
  key: First Pages
  order: 10
---

Once you have your first page up you probably wonder what more you can do.

In most cases you will have multiple sections in your website and each of those sections will come with it's own sidebar navigation.

## Setup sections

To create a "section" you need to create a folder with an `index.md`.

```bash
cd docs
mkdir my-section
```

👉 `index.md`

```md
---
title: Learning Rocket
eleventyNavigation:
  key: Learn
  order: -50
---

Your text comes here
```

This will mean you get a menu at the top with "Learn" and a page with the title "Learning Rocket".

## How many sections should I have?

Generally we recommend to stay below 5 sections.
