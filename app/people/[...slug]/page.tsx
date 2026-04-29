import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'

export const metadata = genPageMetadata({ title: 'People' })

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const authors = allAuthors
    .filter((p: Authors) => p.slug !== 'default' && p.role == slug)
    .sort((a, b) => {
      const a_index = a.index ? a.index : 999
      const b_index = b.index ? b.index : 999
      return a_index - b_index
    })

  const titleMaps = {
    member: 'Team Members',
    alumni: 'Alumni',
    collaborator: 'Collaborators',
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Image src="/static/images/people-banner.png" width={902} height={130} alt="banner" />
        <h1 className="pt-14 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {titleMaps[slug].toUpperCase()}
        </h1>
      </div>
      {authors.map((author) => (
        <AuthorLayout key={author.name} content={{ ...coreContent(author), nested: true }}>
          <MDXLayoutRenderer code={author.body.code} />
        </AuthorLayout>
      ))}
    </>
  )
}
