---
title: Managing the sidebar
eleventyNavigation:
  key: Manage sidebar
  parent: First Pages
  order: 100
---

The sidebar will show all the content of the current section.

## Create a hierarchical structure

You can create a hierarchical page by providing a key and parent to `eleventyNavigation`.

...

## Ordering Pages

We recommend to provide a order based on depth of the tree.

- section: -100 to 0
- first level: 10 to 99
- second level: 100 to 999
- third level: 1000 to 9999
- ...
