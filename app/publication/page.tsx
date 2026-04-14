import ListLayout from '@/layouts/ListLayoutWithTopics'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allPublications } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { sortPostsByYearAndTitle} from 'app/utils'
const POSTS_PER_PAGE = 100 // default

export const metadata = genPageMetadata({ title: 'Publication' })

export default function BlogPage() {
  const posts = sortPostsByYearAndTitle(
    allPublications.filter((post) => process.env.NODE_ENV !== 'production' || !post.draft)
  )
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Categories"
    />
  )
}
