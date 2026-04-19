import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allResources } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// import { sortPosts } from 'pliny/utils/contentlayer'
import { sortPostsOrderByKey } from 'app/utils'

export async function generateMetadata(props: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const params = await props.params
  const category = decodeURI(params.category)
  return genPageMetadata({
    title: category,
    description: `${siteMetadata.title} ${category} category content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categorys/${category}/feed.xml`,
      },
    },
  })
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params
  const category = decodeURI(params.category)
  // Capitalize first letter and convert space to dash
  const title = category[0].toUpperCase() + category.split(' ').join('-').slice(1)

  // Return posts that matches the category
  const filteredPosts = sortPostsOrderByKey(
    allResources.filter((post) => {
      if (post.category) {
        const hypenatedCategory = post.category.split(' ').join('-').toLowerCase()
        return hypenatedCategory == category
      }
      return process.env.NODE_ENV !== 'production' || !post.draft
    }),
    'title',
    'asc'
  )

  if (filteredPosts.length === 0) {
    return notFound()
  }
  return <ListLayout posts={filteredPosts} title={title} category={category} />
}
