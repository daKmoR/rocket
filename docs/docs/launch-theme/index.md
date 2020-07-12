---
title: Using the default Launch Theme.
eleventyNavigation:
  key: Launch Theme
  order: 10
---

Rocket comes with a theme you will love. Simple, Responsive and behaving like native it sure is going to be a hit among your users.

## Installation

```bash
npm i @rocket/launch
```

## Customization

The theme offers some options for configuration. To do so copy the [\_data](https://github.com/daKmoR/rocket/tree/master/packages/launch/_data) folder into your `docs` folder.

Create a config file for rocket and override the data path.

👉 `rocket.config.js`

```js
module.exports = {
  dir: {
    data: '_data',
  },
};
```

Now you can modify all the site info like

- Footer
- Github Url
- ...

### Replace Logo

To replace the logo you can place a `docs/_assets/logo.svg` and it will be used instead.

### Change default Css Variables

In order to replace default css variables you can place a `docs/_assets/variables.css` file and set your own values.

Note: This will replace all values so be sure to copy [the original](https://github.com/daKmoR/rocket/blob/master/packages/launch/_assets/variables.css) to not miss any variables.

### Adopt the css

You can create a `docs/_assets/style.css` and it will be included last so it can be used to override
