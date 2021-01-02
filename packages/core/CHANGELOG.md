# @d4kmor/core

## 0.3.0

### Minor Changes

- b9a6274: Prepare release before moving npm scope and repo.

  - Have building-rollup as a dedicated package
  - Serve dev output as server root
  - Rename `themes` to `presets`
  - Move eleventy settings in to dedicated eleventy plugins
  - Introduce `setup-*` function which can be used to add, remove and adjust plugins for all systems

## 0.2.0

### Minor Changes

- 15e0abe: Add Types

## 0.1.3

### Patch Changes

- 915a565: Add `absoluteBaseUrlNetlify` to helpers to work with netlify previews

## 0.1.2

### Patch Changes

- 9237ebc: In the navigation put a ": " between parent and current page

## 0.1.1

### Patch Changes

- f0acb1d: Make sure the hierarchy makes sense when using markdown headlines

## 0.1.0

### Minor Changes

- 0bf484a: Allow to read a markdown title with meta data to replace frontmatter.

  Example:

  ```
  # Writing Pages >> Structure ||10
  ```

  will result in this frontmatter data

  ```js
  {
    title: 'Writing Pages Structure',
    eleventyNavigation: {
      title: 'Structure',
      key: 'Writing Pages >> Structure ||10',
      parent: 'Writing Pages',
      order: 10,
    },
  }
  ```
