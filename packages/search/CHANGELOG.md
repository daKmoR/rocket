# @d4kmor/core

## 0.3.1

### Patch Changes

- 98721f9: add css vars for combobox

## 0.3.0

### Minor Changes

- 15e0abe: Bump versions because dependencies changed

## 0.2.3

### Patch Changes

- 7c1275b: Background of the input should be transparent to support dark mode

## 0.2.2

### Patch Changes

- caaeb5e: Ensure it also works on Safari

## 0.2.1

### Patch Changes

- 638fe46: applied following fixies
  - expose some css theming variables
  - truncate text also when many terms are found
  - show only a max of 10 results for the frontend
  - add icons to npm artifact

## 0.2.0

### Minor Changes

- 4287d02: - create and serves a search index json file
  - add a web component that uses a combobox to fill in the search results (from the index)
  - highlight the appropriate search or terms (in frontend and in cli)

## 0.1.2

### Patch Changes

- aba5731: Add theme files to the npm package

## 0.1.1

### Patch Changes

- 7085e98: Add themes support

## 0.1.0

### Minor Changes

- 161d479: Add alpha plugin system + search via cli

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
