---
'@d4kmor/cli': minor
'@d4kmor/launch': minor
---

1. simplify setup by removing abstractions
2. eleventy renders into `_site-dev`
3. rollup optimizes `_site-dev` into `_site`
4. this enables all kind of input templates from eleventy (e.g. use `.njk`, `.xml`, `.html` inside of your docs folder)
5. allow an `eleventy` config object or function in `rocket.config.js`
