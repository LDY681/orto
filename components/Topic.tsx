import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  topic: string
}

const Tag = ({ topic }: Props) => {
  return (
    <Link
      href={`/topics/${slug(topic)}`}
      /* if extract from post =' Our papers', if extract from topic-data.json = 'our-papers' */
      className={`mr-3 text-sm font-medium uppercase
        ${(topic == 'Our papers' || topic == 'our-papers') ? 
          'text-secondary-400 hover:text-secondary-500 dark:text-secondary-300 dark:hover:text-secondary-500'
          : 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'}
      `}
    >
      {topic}
    </Link>
  )
}

export default Tag
