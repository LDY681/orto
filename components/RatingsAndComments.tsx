'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import Rating from './Rating'

const commentIcon = (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
)

//! Gicus cannot abstract elements in the same page with pathname or url, as a workaround, change the title of the page as identifier
const changeTitle = (slug: string) => {
  document.title = slug + ' | ' + siteMetadata.title
}

export default function RatingsAndComments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      <div className="flex justify-start items-center gap-2">
        <Rating rating={4.5} ratingCount={10} slug={slug} />
        <a className='flex flex-1 justify-end pr-2' href={`#${slug}`} onClick={() => changeTitle(slug)}>
          <button
            aria-label="Scroll To Comment"
            onClick={() => setLoadComments(!loadComments)}
            className="rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          >
            {commentIcon}
          </button>
        </a>
    
      </div>
      {loadComments && (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      )}
    </>
  )
}
