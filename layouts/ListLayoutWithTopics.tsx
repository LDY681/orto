/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import type { Publication } from 'contentlayer/generated'
import Link from '@/components/Link'
import Button from '@/components/Button'
import Topic from '@/components/Topic'
import topicData from 'app/topic-data.json'
import { MDXLayoutRenderer } from 'pliny/mdx-components'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: Publication[]
  title: string
  initialDisplayPosts?: Publication[]
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

export default function ListLayoutWithTopics({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const topicCounts = topicData as Record<string, number>
  const topicKeys = Object.keys(topicCounts)
  const sortedTopics = topicKeys.sort((a, b) => topicCounts[b] - topicCounts[a])

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
              {pathname.startsWith('/publication') ? (
                <h3 className="font-bold uppercase text-primary-500">All Categories</h3>
              ) : (
                <Link
                  href={`/publication`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  All Categories
                </Link>
              )}
              <ul>
                {sortedTopics.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/topics/')[1]) === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${topicCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/topics/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts topicged ${t}`}
                        >
                          {`${t} (${topicCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { authors, year, code, topics, doi, pmid, website } = post
                return (
                  <li key={doi} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <div className="space-y-3">
                        <div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {authors} ({year})
                          </div>
                          <MDXLayoutRenderer code={code} />
                          <div className="flex flex-wrap">
                            {topics?.map((topic) => <Topic key={topic} text={topic} />)}
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          {doi && (
                            <Button href={doi} className="mr-3 text-sm font-medium uppercase">
                              DOI
                            </Button>
                          )}
                          {pmid && (
                            <Button href={pmid} className="mr-3 text-sm font-medium uppercase">
                              PMID
                            </Button>
                          )}
                          {website && (
                            <Button href={website} className="mr-3 text-sm font-medium uppercase">
                              WEBSITE
                            </Button>
                          )}
                        </div>
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
