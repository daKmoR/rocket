# @d4kmor/cli

## 0.5.2

### Patch Changes

- 7085e98: Add themes support

## 0.5.1

### Patch Changes

- f96ba62: Update @lion/overlays and adjust code to no longer require a patch

## 0.5.0

### Minor Changes

- 161d479: Add alpha plugin system + search via cli

## 0.4.3

### Patch Changes

- 8dec626: Extract title from markdown headline on all pages

## 0.4.2

### Patch Changes

- f0acb1d: Make sure the hierarchy makes sense when using markdown headlines
- Updated dependencies [f0acb1d]
  - @d4kmor/core@0.1.1

## 0.4.1

### Patch Changes

- 652b5e7: Make @d4kmor/core a real dependency

## 0.4.0

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

### Patch Changes

- Updated dependencies [1819f5f]
- Updated dependencies [0bf484a]
  - @d4kmor/eleventy-rocket-nav@0.2.1
  - @d4kmor/eleventy-plugin-mdjs-unified@0.3.0

## 0.3.2

### Patch Changes

- 41c5bc8: Support functions in rocket config by using an es module singleton instead of a file storage

## 0.3.1

### Patch Changes

- d79da48: Add entry file to npm package

## 0.3.0

### Minor Changes

- d51bcf1: Start of restructure, add some tests and types

### Patch Changes

- Updated dependencies [d51bcf1]
  - @d4kmor/eleventy-plugin-mdjs-unified@0.2.0
  - @d4kmor/eleventy-rocket-nav@0.2.0

## 0.2.5

### Patch Changes

- Update service worker refresh handling

## 0.2.4

### Patch Changes

- clean up dependencies

## 0.2.3

### Patch Changes

- Support a 404.html page out of the box for Multi Page Applications

## 0.2.2

### Patch Changes

- Social Media Image, site description per page

## 0.2.1

### Patch Changes

- fix: service worker reload and favicon paths

## 0.2.0

### Minor Changes

- Add new layout with-index and auto assign blog-details layout

## 0.1.15

### Patch Changes

- Support relative links in not index.md files
- Updated dependencies [undefined]
  - @d4kmor/eleventy-plugin-mdjs@0.1.3

## 0.1.14

### Patch Changes

- Footnotes, Build update, socialLinks
- Updated dependencies [undefined]
  - @d4kmor/eleventy-plugin-mdjs@0.1.2

## 0.1.13

### Patch Changes

- Updates
- Updated dependencies [undefined]
  - @d4kmor/eleventy-rocket-nav@0.1.3
  - @d4kmor/navigation@0.1.1

## 0.1.12

### Patch Changes

- 11ty Workaround instead of a source patch

## 0.1.11

### Patch Changes

- Updates

## 0.1.10

### Patch Changes

- updates
- Updated dependencies [undefined]
  - @d4kmor/eleventy-rocket-nav@0.1.2

## 0.1.9

### Patch Changes

- sidebar style

## 0.1.8

### Patch Changes

- colored svgs as images

## 0.1.7

### Patch Changes

- introduce color logo

## 0.1.6

### Patch Changes

- Support markdown links to .md files
- Updated dependencies [undefined]
  - @d4kmor/eleventy-plugin-mdjs@0.1.1

## 0.1.5

### Patch Changes

- proper themePath filter

## 0.1.4

### Patch Changes

- Auto Select home background svg if available

## 0.1.2

### Patch Changes

- speed improvement

## 0.1.1

### Patch Changes

- Style updates

## 0.1.0

### Minor Changes

- Bump Versions

### Patch Changes

- Updated dependencies [undefined]
  - @d4kmor/eleventy-plugin-mdjs@0.1.0
  - @d4kmor/eleventy-rocket-nav@0.1.0
  - @d4kmor/navigation@0.1.0

## 0.0.2

### Patch Changes

- Initial Release
- Updated dependencies [undefined]
  - @d4kmor/eleventy-plugin-mdjs@0.0.2
  - @d4kmor/eleventy-rocket-nav@0.0.2
  - @d4kmor/navigation@0.0.2
