---
title: Deploy
eleventyNavigation:
  key: Learn
  order: -50
---

Rocket is a fundamentally straight forward way to generate static pages while still allowing to sprinkle in some JavaScript where needed.

## Favicon

We recommend going to [realfavicongenerator.net](https://realfavicongenerator.net/) to generate all the things.

It however won't come with a maskable icon.

You can create one at [maskable.app](https://maskable.app/editor).

Afterwards it's probably good to compress it via [squoosh.app](https://squoosh.app/) and to save it as a `maskable-icon.png`.

Then place all the files like so.

You will also need to adjust the path in the `browserconfig.xml`.

```
.
├── _assets
│   └── icons
│       ├── android-chrome-192x192.png
│       ├── android-chrome-512x512.png
│       ├── apple-touch-icon.png
│       ├── favicon-16x16.png
│       ├── favicon-32x32.png
│       ├── maskable_icon.jpg
│       ├── mstile-150x150.png
│       └── safari-pinned-tab.svg
├── browserconfig.xml
├── favicon.ico
└── webmanifest.json
```

The following html will be added

```html
<link rel="apple-touch-icon" sizes="180x180" href="/_assets/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/_assets/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/_assets/favicon-16x16.png" />
<link rel="manifest" href="/webmanifest.json" />
<link rel="mask-icon" href="/_assets/safari-pinned-tab.svg" color="#3f93ce" />
<meta name="msapplication-TileColor" content="#1d3557" />
<meta name="theme-color" content="#1d3557" />
```
