import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allResources } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sortPosts } from 'pliny/utils/contentlayer'

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

export default async function CategoryPage(props: {
  params: Promise<{ category: string; topic: string }>
}) {
  const params = await props.params
  const category = decodeURI(params.category)
  const topic = decodeURI(params.topic)
  // Capitalize first letter and convert space to dash
  const title = category[0].toUpperCase() + category.split(' ').join('-').slice(1)

  const filteredPosts = sortPosts(
    allResources.filter((post) => {
      if (post.category && post.topics) {
        const hypenatedCategory = post.category.split(' ').join('-').toLowerCase()
        const hypenatedTopic = post.topics.find((t) => t === topic || slug(t) === topic)?.split(' ').join('-').toLowerCase()
        return hypenatedCategory == category && hypenatedTopic == topic
      }
      return process.env.NODE_ENV !== 'production' || !post.draft
    })
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return <ListLayout posts={filteredPosts} title={title} category={category} topic={topic} />
}
