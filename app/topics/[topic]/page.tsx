import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTopics'
import { allPublications } from 'contentlayer/generated'
import topicData from 'app/topic-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
// import { sortPosts } from 'pliny/utils/contentlayer'
import { sortPostsByYearAndTitle } from 'app/utils'

export async function generateMetadata(props: {
  params: Promise<{ topic: string }>
}): Promise<Metadata> {
  const params = await props.params
  const topic = decodeURI(params.topic)
  return genPageMetadata({
    title: topic,
    description: `${siteMetadata.title} ${topic} topic content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/topics/${topic}/feed.xml`,
      },
    },
  })
}

// Prerender only these params at build time, others will be server-rendered on-demand.
export const generateStaticParams = async () => {
  const topicCounts = topicData as Record<string, number>
  const topicKeys = Object.keys(topicCounts)
  const paths = topicKeys.map((topic) => ({
    topic: encodeURI(topic),
  }))
  return paths
}

export default async function TopicPage(props: { params: Promise<{ topic: string }> }) {
  const params = await props.params
  const topic = decodeURI(params.topic)
  // Capitalize first letter and convert space to dash
  const title = topic[0].toUpperCase() + topic.split(' ').join('-').slice(1)
  const filteredPosts = sortPostsByYearAndTitle(
    allPublications.filter(
      (post) =>
        post.topics &&
        post.topics.map((t) => slug(t)).includes(topic) &&
        (process.env.NODE_ENV !== 'production' || !post.draft)
    )
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return <ListLayout posts={filteredPosts} title={title} />
}
