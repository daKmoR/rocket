import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SECTION = 'blog';
const POST_COLLECTION = 'posts';
const isHiddenCollection = item => ['-', '_'].includes(item.charAt(0));
const isVisibleCollection = item => !isHiddenCollection(item);

export const theme = ({ section = SECTION, postCollection = POST_COLLECTION }) => {
  const isNotPostCollection = collection => collection !== postCollection;
  const eleventyFunction = eleventyConfig => {
    eleventyConfig.addLayoutAlias('blog', 'blog-overview.njk');
    eleventyConfig.addLayoutAlias('post', 'blog-details.njk');

    eleventyConfig.addCollection('posts', collection => {
      /*
      // It's not working beacuse it's a paginated collection.
      const headerDocs = eleventyConfig.collections.header(collection);
      headerDocs.filter(page => page.data.section === section).forEach(page => {
        page.data.layout = 'blog';
      });
      */
      if (section === postCollection) {
        throw new Error("Rocket blog: section and postCollection couldn't be equal");
      }
      if (!eleventyConfig.collections[section]) {
        const collectionKeys = Object.keys(eleventyConfig.collections);
        const availableCollections = collectionKeys
          .filter(isVisibleCollection)
          .filter(isNotPostCollection);
        throw new Error(
          `Rocket blog: Collection '${section}' not found. Aviable colections: ${availableCollections.join(
            ', ',
          )}`,
        );
      }

      const posts = eleventyConfig.collections[section](collection);
      posts.forEach(page => {
        page.data.layout = 'post';
      });
      return posts;
    });
  };

  return {
    path: path.resolve(__dirname),
    eleventyFunction,
  };
};
