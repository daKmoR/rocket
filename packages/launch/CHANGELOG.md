# @d4kmor/launch

## 0.4.3

### Patch Changes

- 6acfb29: Fix mobile drawer styles

## 0.4.2

### Patch Changes

- 7085e98: Add themes support

## 0.4.1

### Patch Changes

- f96ba62: Update @lion/overlays and adjust code to no longer require a patch
- Updated dependencies [f96ba62]
  - @d4kmor/drawer@0.2.1

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

## 0.3.0

### Minor Changes

- d51bcf1: Start of restructure, add some tests and types
- 4d6b81b: Styling improvements. Added outside paddings to make it look nicer on smaller viewports. Made footer and header widths consistent with content width. Changed header bar to be white which looks cleaner. Changed the sidebar nav styles to be cleaner. Made the call to action buttons cleaner looking. Made the spacing around the mobile menu button consistent. Changed the reasons section to use CSS grid to make it look more consistent on different viewports by specifying grid gaps, instead of doing it with margins.

### Patch Changes

- Updated dependencies [d51bcf1]
  - @d4kmor/drawer@0.2.0
  - @d4kmor/navigation@0.2.0

## 0.2.14

### Patch Changes

- Add js to npm artifact

## 0.2.13

### Patch Changes

- Update service worker refresh handling

## 0.2.12

### Patch Changes

- Add edit link to blogs + use page.date

## 0.2.11

### Patch Changes

- Allow to define pageTitle for each page; show only published blog posts in the blog overview

## 0.2.10

### Patch Changes

- Add "edit page on github" link and make sure code blocks don't make main wider

## 0.2.9

### Patch Changes

- clean up dependencies
- Updated dependencies [undefined]
  - @d4kmor/navigation@0.1.3

## 0.2.8

### Patch Changes

- Improve sidebar navigation by always linking to first sub page item and indicationg currently active anchor page

## 0.2.7

### Patch Changes

- Full image url for twitter

## 0.2.6

### Patch Changes

- Social Media Image, site description per page
- Updated dependencies [undefined]
  - @d4kmor/cli@0.2.2

## 0.2.5

### Patch Changes

- fix: service worker reload and favicon paths
- Updated dependencies [undefined]
  - @d4kmor/cli@0.2.1

## 0.2.4

### Patch Changes

- Add auto analytics

## 0.2.3

### Patch Changes

- Expose colors for tables

## 0.2.2

### Patch Changes

- Improve blog views

## 0.2.1

### Patch Changes

- Add light dark mode toggle

## 0.2.0

### Minor Changes

- Add new layout with-index and auto assign blog-details layout

### Patch Changes

- Updated dependencies [undefined]
  - @d4kmor/cli@0.2.0

## 0.1.16

### Patch Changes

- Footnotes, Build update, socialLinks
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.14

## 0.1.15

### Patch Changes

- Updates
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.13

## 0.1.14

### Patch Changes

- Updates
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.11

## 0.1.13

### Patch Changes

- updates
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.10

## 0.1.12

### Patch Changes

- sidebar style
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.9

## 0.1.11

### Patch Changes

- colored svgs as images
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.8

## 0.1.10

### Patch Changes

- introduce color logo
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.7

## 0.1.9

### Patch Changes

- Auto Select home background svg if available
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.4

## 0.1.8

### Patch Changes

- handle long menu and submenu

## 0.1.7

### Patch Changes

- menu margin if content shorter then menu

## 0.1.6

### Patch Changes

- Add readme

## 0.1.5

### Patch Changes

- footer again

## 0.1.4

### Patch Changes

- footer auto size

## 0.1.3

### Patch Changes

- min height

## 0.1.2

### Patch Changes

- Nicer Footer

## 0.1.1

### Patch Changes

- Style updates
- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.1

## 0.1.0

### Minor Changes

- Bump Versions

### Patch Changes

- Updated dependencies [undefined]
  - @d4kmor/cli@0.1.0
  - @d4kmor/drawer@0.1.0

## 0.0.2

### Patch Changes

- Initial Release
- Updated dependencies [undefined]
  - @d4kmor/cli@0.0.2
