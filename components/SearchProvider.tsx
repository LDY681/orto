'use client'

import { KBarSearchProvider } from 'pliny/search/KBar'
import { useRouter } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'

// searchConfig={siteMetadata.search as SearchConfig}

export const SearchProvider = ({ children }) => {
  const router = useRouter()
  return (
    <KBarSearchProvider
      kbarConfig={{
        searchDocumentsPath: 'search.json',
        onSearchDocumentsLoad(json) {
          return json.map((post) => ({
            id: post.path,
            name: post.title,
            keywords: post?.summary || '',
            section: post.type || 'Blog',
            subtitle: post?.date?.split('T')[0] || post?.authors || post?.category,
            perform: () => router.push('/' + post.path),
          }))
        },
      }}
    >
      {children}
    </KBarSearchProvider>
  )
}
