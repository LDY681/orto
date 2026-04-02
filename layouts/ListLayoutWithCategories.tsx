/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import type { Resource } from 'contentlayer/generated'
import Link from '@/components/Link'
// import Category from '@/components/Category'
import categoryData from 'app/category-data.json'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Category from '@/components/Category'
import RatingsAndComments from '@/components/RatingsAndComments'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: Resource[]
  title: string
  category: string
  topic?: string
  initialDisplayPosts?: Resource[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithCategories({
  posts,
  title,
  category,
  topic,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const categoryCounts = categoryData[category] as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  const sortedCategorys = categoryKeys.sort((a, b) => categoryCounts[b] - categoryCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-6 py-4">
              {!topic ? (
                <h3 className="font-bold uppercase text-primary-500">All Categories</h3>
              ) : (
                <Link
                  href={`/resource/${category}`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  All Categories
                </Link>
              )}
              <ul>
                {sortedCategorys.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split(`/resource/${category}/`)[1]) === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${categoryCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/resource/${category}/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts categorized ${t}`}
                        >
                          {`${t} (${categoryCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayPosts.map((post, index) => {
                const { title, code, topics, href } = post
                return (
                  <li key={index} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <div className="space-y-3">
                        <div>
                          <div className="mb-2 text-2xl text-primary-500 dark:text-primary-400">
                            {title}
                          </div>
                          <MDXLayoutRenderer code={code} />
                          <div className="flex flex-wrap">
                            {topics?.map((topic) => <Category key={topic} topic={topic} category={category} />)}
                          </div>
                        </div>
                        <RatingsAndComments slug={title} />
                        {href && (
                          <Link href={href} className="text-sm font-medium text-primary-400">
                            Learn More -&gt;
                          </Link>
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
