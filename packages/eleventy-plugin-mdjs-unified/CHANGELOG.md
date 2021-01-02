# @d4kmor/eleventy-plugin-mdjs-unified

## 0.5.0

### Minor Changes

- b9a6274: Prepare release before moving npm scope and repo.

  - Have building-rollup as a dedicated package
  - Serve dev output as server root
  - Rename `themes` to `presets`
  - Move eleventy settings in to dedicated eleventy plugins
  - Introduce `setup-*` function which can be used to add, remove and adjust plugins for all systems

### Patch Changes

- 542ca63: handle anchors in MD files
- Updated dependencies [b9a6274]
  - @mdjs/core@0.6.0

## 0.4.0

### Minor Changes

- 15e0abe: Add Types

### Patch Changes

- Updated dependencies [15e0abe]
  - @mdjs/core@0.5.0

## 0.3.1

### Patch Changes

- 91c781f: You can now use relative imports in all markdown files (not just index.md). For that the import in js of markdown files gets parsed and modified if needed.

## 0.3.0

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

## 0.2.0

### Minor Changes

- d51bcf1: Start of restructure, add some tests and types

## 0.1.3

### Patch Changes

- Support relative links in not index.md files

## 0.1.2

### Patch Changes

- Footnotes, Build update, socialLinks

## 0.1.1

### Patch Changes

- Support markdown links to .md files

## 0.1.0

### Minor Changes

- Bump Versions

## 0.0.2

### Patch Changes

- Initial Release
