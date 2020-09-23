---
'@d4kmor/cli': minor
'@d4kmor/core': minor
'@d4kmor/eleventy-plugin-mdjs-unified': minor
'@d4kmor/launch': minor
---

Allow to read a markdown title with meta data to replace frontmatter.

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
