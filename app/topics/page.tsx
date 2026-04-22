import Link from '@/components/Link'
import Topic from '@/components/Topic'
import { slug } from 'github-slugger'
import topicData from 'app/topic-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Topics', description: 'Things I blog about' })

export default async function Page() {
  const topicCounts = topicData as Record<string, number>
  const topicKeys = Object.keys(topicCounts)
  const sortedTopics = topicKeys.sort((a, b) => topicCounts[b] - topicCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Publication Catalog
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {topicKeys.length === 0 && 'No topics found.'}
          {sortedTopics.map((t) => {
            return (
              <div key={t} className={`mb-2 mr-5 mt-2
                  ${t == 'our-papers' ? 
                    'text-secondary-400 hover:text-secondary-500 dark:text-secondary-300 dark:hover:text-secondary-500'
                    : 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'}
                `}
              >
                <Topic key={t} topic={t} />
                <Link
                  href={`/topic/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold"
                  aria-label={`View posts topic ${t}`}
                >
                  {` (${topicCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
