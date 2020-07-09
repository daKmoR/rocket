---
title: Link to other pages
eleventyNavigation:
  key: Link Pages
  parent: First Pages
  order: 110
---

Eleventy treats every page as a folder. So even if you have a `my-documentation.md` file if you want to link to you need to do it via `./my-documentation/`.

## Link as markdown

Standard markdown applies and you can link via

```md
[visible label](./path/to/other-page/)
```
