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