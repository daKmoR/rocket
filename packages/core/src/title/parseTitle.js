/** @typedef {import('./types').EleventyPage} EleventyPage */

/**
 * Parses a title and extracts the relevante data for it.
 * A title can contain
 * - ">>" to define a parent => child relationship
 * - "||" to define the order for this page
 *
 * @example
 * Foo ||3
 * Foo >> Bar ||10
 *
 * @param {string} inTitle
 * @return {EleventyPage}
 */
export function parseTitle(inTitle) {
  if (typeof inTitle !== 'string') {
    throw new Error('You need to provide a string to `parseTitle`');
  }

  /** @type EleventyPage */
  const data = {};
  let title = inTitle;
  let order = 0;
  let navigationTitle = title;
  let parent;
  if (title.includes('>>')) {
    const parts = title
      .split('>>')
      .map(part => part.trim())
      .filter(Boolean);
    title = parts.join(' ');
    navigationTitle = parts[parts.length - 1];
    if (parts.length >= 2) {
      parent = parts[parts.length - 2];
      if (parts.length >= 3) {
        title = `${parent} ${parts[parts.length - 1]}`;
      }
    }
  }

  if (title.includes('||')) {
    const parts = title
      .split('||')
      .map(part => part.trim())
      .filter(Boolean);
    title = parts.join(' ');
    navigationTitle = navigationTitle.split('||').map(part => part.trim())[0];
    if (parts.length === 2) {
      title = parts[0];
      order = parseInt(parts[1]);
    }
  }
  data.title = title;
  data.eleventyNavigation = {
    key: inTitle,
    title: navigationTitle,
    order,
  };
  if (parent) {
    data.eleventyNavigation.parent = parent;
  }
  return data;
}
