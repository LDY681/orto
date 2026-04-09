const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/latest', title: 'News' },
  {
    href: '/publication',
    title: 'Publications',
  },
  {
    href: '/resource/open-source-software-tools',
    title: 'Resources',
    hrefs: [
      {
        title: 'OPEN-SOURCE SOFTWARE TOOLS',
        href: '/resource/open-source-software-tools',
      },
      {
        title: 'OPEN-SOURCE DATABASES',
        href: '/resource/open-source-databases',
      },
      {
        title: 'PROTOCOLS AND INITIATIVES',
        href: '/resource/protocols-and-initiatives',
      },
      {
        title: 'OPEN-SCIENCE GENERAL RESOURCES',
        href: '/resource/open-science-general-resources',
      },
      {
        title: 'AI MODELS',
        href: '/resource/ai-models',
      },
    ],
  },
  { href: '/contact', title: 'Contact' },
  {
    href: '/people/member',
    title: 'People',
    hrefs: [
      { title: 'Website Founders', href: '/people/member' },
      { title: 'Collaborators', href: '/people/collaborator' },
    ],
  },
]

export default headerNavLinks
