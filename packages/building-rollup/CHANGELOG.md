# @d4kmor/building-rollup

## 0.1.0
### Minor Changes

- b9a6274: Prepare release before moving npm scope and repo.
  
  - Have building-rollup as a dedicated package
  - Serve dev output as server root
  - Rename `themes` to `presets`
  - Move eleventy settings in to dedicated eleventy plugins
  - Introduce `setup-*` function which can be used to add, remove and adjust plugins for all systems
- 8228cf0: Inject service worker via rollup-plugin-html setting instead of a transform
- b9a6274: First initial release
