import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  topic: string,
  category: string
}

const Tag = ({ topic, category }: Props) => {
  return (
    <Link
      href={`/resource/${slug(category)}/${slug(topic)}`}
      className={`mr-3 text-sm font-medium uppercase
        ${topic == 'Our tools' ? 'text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-400' : 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'}`
      }
    >
      {topic}
    </Link>
  )
}

export default Tag
