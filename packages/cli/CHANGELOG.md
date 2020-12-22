# @d4kmor/cli

## 0.11.1

### Patch Changes

- 6cf6ef2: Adds a helper for adding remark plugins
- 2d588b5: fix(cli): copy jpeg files as well

## 0.11.0

### Minor Changes

- 15e0abe: Add Types

### Patch Changes

- Updated dependencies [15e0abe]
  - @d4kmor/core@0.2.0
  - @d4kmor/eleventy-plugin-mdjs-unified@0.4.0
  - @d4kmor/eleventy-rocket-nav@0.3.0

## 0.10.1

### Patch Changes

- 7df4566: Add a dependency to @rollup/plugin-node-resolve

## 0.10.0

### Minor Changes

- 4287d02: plugins can now hook into multiple commands

## 0.9.0

### Minor Changes

- 673bedc: Themes can configure eleventy

## 0.8.0

### Minor Changes

- d976142: Update to the latest @web releases

## 0.7.1

### Patch Changes

- 12f97a4: Make sure going through getting started works

## 0.7.0

### Minor Changes

- 9cb2c19: - Hashes all assets to allow for permanent cache (and no more node_modules in `_site`)
  - Forks @open-wc/building-rollup to use latest @web/rollup-plugin-html & @web/rollup-plugin-polyfills-loader

### Patch Changes

- 915a565: Add and use new option `absoluteBaseUrl` which will convert social media urls to full absolute urls where needed.
- Updated dependencies [915a565]
  - @d4kmor/core@0.1.3

## 0.6.0

### Minor Changes

- 627a0ab: 1. simplify setup by removing abstractions
  2. eleventy renders into `_site-dev`
  3. rollup optimizes `_site-dev` into `_site`
  4. this enables all kind of input templates from eleventy (e.g. use `.njk`, `.xml`, `.html` inside of your docs folder)
  5. allow an `eleventy` config object or function in `rocket.config.js`

## 0.5.9

### Patch Changes

- 57d1577: feat(cli): add modifyConfig to modify eleventy config

## 0.5.8

### Patch Changes

- e26c14c: Change default service worker name from `sw.js` to `service-worker.js`.
  Add an option `build.serviceWorkerFileName`.

## 0.5.7

### Patch Changes

- 8965b11: Enable a setting build.pathPrefix that can be used for build only

## 0.5.6

### Patch Changes

- ebd5be9: Copy nested folders while building

## 0.5.5

### Patch Changes

- fe5da59: New Option build.emptyOutputDir; Copy all root doc files (not md or html)
- Updated dependencies [9237ebc]
  - @d4kmor/core@0.1.2

## 0.5.4

### Patch Changes

- 12c2ba1: The rootDir for non index.md files need to include the markdown filename

## 0.5.3

### Patch Changes

- e815126: Use _merged\_\_ folders instead of .*merged*_ folders as hidden folders are not deployed (by default) by netlify and potentially other services as well
- Updated dependencies [91c781f]
  - @d4kmor/eleventy-plugin-mdjs-unified@0.3.1

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
