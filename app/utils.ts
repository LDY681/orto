import { Document, MDX } from 'contentlayer2/core';

type MDXDocument = Document & {
    body: MDX;
};

function sortOrderBy(a: any, b: any, order: string) {
  if (order === 'asc') {
    if (a > b)
      return 1;
    if (a < b)
      return -1;
  } else {
    if (a > b)
      return -1;
    if (a < b)
      return 1;
  }
  return 0;
}

/**
 * Sorts an array of MDX documents by a specified key and order
 * @param allBlogs <T extends MDXDocument>[]
 * @param key sort by title by default, if default, need to provided MDXDocument & { title: string }
 * @param order sort by ascending order by default
 * @returns <T extends MDXDocument>[]
 */
export function sortPostsOrderByKey<T extends MDXDocument>(allBlogs: T[], key: string = "title", order: 'asc' | 'desc' = 'asc') {
  return allBlogs.sort((a, b) => sortOrderBy(a[key], b[key], order));
}

/**
 * Sorts an array of MDX documents by year first and then title
 * @param allBlogs <T extends MDXDocument>[]
 * @param order sort by ascending order by default
 * @returns <T extends MDXDocument>[]
 */
export function sortPostsByYearAndTitle<T extends MDXDocument>(allBlogs: T[], order: 'asc' | 'desc' = 'asc') {
  return allBlogs.sort((a, b) => {
    const yearA = a?.year || 2000;
    const yearB = b?.year || 2000;
    const titleA = a?.body?.raw?.trim().slice(0, 10) || '';
    const titleB = b?.body?.raw?.trim().slice(0, 10) || '';

    // We want most recent year to be first, but we want smallest alphabet letters to be first
    const keyA = (9999 - yearA) + titleA
    const keyB = (9999 - yearB) + titleB
    return sortOrderBy(keyA, keyB, order);
  });
}

/**
 * Filter and show blog posts only (excluding first-level pages in post layouts)
 */

export function filterBlogs<T extends MDXDocument>(allBlogs: T[]): T[] {
  const excludedSlugs = ['about', 'octava'];
  return allBlogs.filter((post) => !excludedSlugs.includes(post.slug));
}