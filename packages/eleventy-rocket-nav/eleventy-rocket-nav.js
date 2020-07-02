/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
const { DepGraph } = require('dependency-graph');

const fs = require('fs');
const { SaxEventType, SAXParser } = require('sax-wasm');

const saxPath = require.resolve('sax-wasm/lib/sax-wasm.wasm');
const saxWasmBuffer = fs.readFileSync(saxPath);

// Instantiate
const parser = new SAXParser(
  SaxEventType.Attribute | SaxEventType.OpenTag | SaxEventType.Text | SaxEventType.CloseTag,
  { highWaterMark: 32 * 1024 }, // 32k chunks
);
parser.prepareWasm(saxWasmBuffer);

function getHeadingsOfHtml(html) {
  const headings = [];
  let capture = false;
  let captured = { text: '' };
  parser.eventHandler = (ev, data) => {
    if (ev === SaxEventType.OpenTag) {
      if (data.name === 'h2') {
        capture = true;
      }
    }

    if (capture && ev === SaxEventType.Text) {
      captured.text += data.value;
    }
    if (ev === SaxEventType.Attribute) {
      if (data.name === 'id') {
        captured.id = data.value;
      }
    }

    if (ev === SaxEventType.CloseTag) {
      if (data.name === 'h2') {
        capture = false;
        headings.push(captured);
        captured = { text: '' };
      }
    }
  };
  parser.write(Buffer.from(html));
  parser.end();

  return headings;
}

function findNavigationEntries(nodes = [], key = '') {
  const pages = [];
  for (const entry of nodes) {
    if (entry.data && entry.data.eleventyNavigation) {
      const nav = entry.data.eleventyNavigation;
      if ((!key && !nav.parent) || nav.parent === key) {
        pages.push({
          ...nav,
          url: nav.url || entry.data.page.url,
          pluginType: 'eleventy-navigation',
          templateContent: entry.templateContent,
          ...(key ? { parentKey: key } : {}),
        });
      }
    }
  }

  return pages
    .sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    })
    .map(entry => {
      if (!entry.title) {
        entry.title = entry.key;
      }
      if (entry.key) {
        const headings = getHeadingsOfHtml(entry.templateContent.html);

        const anchors = headings.map(heading => ({
          key: heading.text + Math.random(),
          parent: entry.key,
          url: `${entry.url}#${heading.id}`,
          pluginType: 'eleventy-navigation',
          parentKey: entry.key,
          title: heading.text,
          anchor: true,
        }));
        entry.children = [...anchors, ...findNavigationEntries(nodes, entry.key)];
      }
      return entry;
    });
}

function findDependencies(pages, depGraph, parentKey) {
  for (const page of pages) {
    depGraph.addNode(page.key, page);
    if (parentKey) {
      depGraph.addDependency(page.key, parentKey);
    }
    if (page.children) {
      findDependencies(page.children, depGraph, page.key);
    }
  }
}

function findBreadcrumbEntries(nodes, activeKey) {
  const pages = findNavigationEntries(nodes);
  const graph = new DepGraph();
  findDependencies(pages, graph);

  return activeKey
    ? graph.dependenciesOf(activeKey).map(key => {
        const data = { ...graph.getNodeData(key) };
        delete data.children;
        data._isBreadcrumb = true;
        return data;
      })
    : [];
}

function navigationToHtml(pages, options = {}) {
  options = {
    listElement: 'ul',
    listItemElement: 'li',
    listClass: '',
    listItemClass: '',
    listItemHasChildrenClass: '',
    activeKey: '',
    activeListItemClass: 'current',
    anchorClass: '',
    activeAnchorClass: '',
    activeTreeListClass: 'active',
    activeAnchorListClass: 'active',
    showExcerpt: false,
    isChildList: false,
    ...options,
  };

  let activePages = [];
  if (options.activeKey) {
    const graph = new DepGraph();
    findDependencies(pages, graph);
    try {
      activePages = graph.dependenciesOf(options.activeKey);
    } catch (err) {
      /* no active pages found */
    }
  }
  const isChildList = !!options.isChildList;
  options.isChildList = true;

  let urlFilter;
  if ('getFilter' in this) {
    // v0.10.0 and above
    urlFilter = this.getFilter('url');
  } else if ('nunjucksFilters' in this) {
    // backwards compat, hardcoded key
    urlFilter = this.nunjucksFilters.url;
  } else {
    // Theoretically we could just move on here with a `url => url` but then `pathPrefix`
    // would not work and it wouldn’t be obvious why—so let’s fail loudly to avoid that.
    throw new Error(
      'Could not find a `url` filter for the eleventy-navigation plugin in eleventyNavigationToHtml filter.',
    );
  }

  if (pages.length && pages[0].pluginType !== 'eleventy-navigation') {
    throw new Error(
      'Incorrect argument passed to eleventyNavigationToHtml filter. You must call `eleventyNavigation` or `eleventyNavigationBreadcrumb` first, like: `collection.all | eleventyNavigation | eleventyNavigationToHtml | safe`',
    );
  }

  return pages.length
    ? `<${options.listElement}${
        !isChildList && options.listClass ? ` class="${options.listClass}"` : ''
      }>${pages
        .map(entry => {
          const liClass = [];
          const aClass = [];
          if (options.listItemClass) {
            liClass.push(options.listItemClass);
          }
          if (options.anchorClass) {
            aClass.push(options.anchorClass);
          }
          if (options.activeKey === entry.key) {
            if (options.activeListItemClass) {
              liClass.push(options.activeListItemClass);
            }
            if (options.activeAnchorClass) {
              aClass.push(options.activeAnchorClass);
            }
          }
          if (options.activeTreeListClass && activePages && activePages.includes(entry.key)) {
            liClass.push(options.activeTreeListClass);
          }
          if (options.activeAnchorListClass && activePages && activePages.includes(entry.key)) {
            aClass.push(options.activeAnchorListClass);
          }
          if (options.listItemHasChildrenClass && entry.children && entry.children.length) {
            liClass.push(options.listItemHasChildrenClass);
          }

          if (entry.anchor) {
            liClass.push('anchor');
            aClass.push('anchor');
          }

          return `<${options.listItemElement}${
            liClass.length ? ` class="${liClass.join(' ')}"` : ''
          }><a href="${urlFilter(entry.url)}"${
            aClass.length ? ` class="${aClass.join(' ')}"` : ''
          }>${entry.title}</a>${options.showExcerpt && entry.excerpt ? `: ${entry.excerpt}` : ''}${
            entry.children ? navigationToHtml.call(this, entry.children, options) : ''
          }</${options.listItemElement}>`;
        })
        .join('\n')}</${options.listElement}>`
    : '';
}

module.exports = {
  findNavigationEntries,
  findBreadcrumbEntries,
  toHtml: navigationToHtml,
};
