---
'@d4kmor/eleventy-plugin-mdjs-unified': minor
'@d4kmor/blog': minor
'@d4kmor/building-rollup': minor
'@d4kmor/cli': minor
'@d4kmor/core': minor
'@d4kmor/drawer': minor
'@d4kmor/eleventy-rocket-nav': minor
'@d4kmor/launch': minor
'@d4kmor/navigation': minor
'@d4kmor/search': minor
---

Prepare release before moving npm scope and repo. 

- Have building-rollup as a dedicated package
- Serve dev output as server root
- Rename `themes` to `presets`
- Move eleventy settings in to dedicated eleventy plugins
- Introduce `setup-*` function which can be used to add, remove and adjust plugins for all systems
