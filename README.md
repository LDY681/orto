# Open Research Tools for Ophthalmology (ORTO)

## Prerequisites
Install node.js
https://nodejs.org/en/download/package-manager
It is advised to install version 20.x as that's what has been used in production.

Install yarn
```bash
npm install --global yarn
```

Please make sure your IDE has End of Line set to LF rather than CRLF

## Guide
next.js https://nextjs.org/docs
tailwind.css https://tailwindcss.com/docs/installation
mdx https://mdxjs.com/docs/
contentlayer https://contentlayer.dev/docs/getting-started-cddd76b7
react.js https://react.dev/learn

## Installation

```bash
yarn
```

Please note, that if you are using Windows, you may need to run:

```bash
$env:PWD = $(Get-Location).Path
```

## Development

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit the layout in `app` or content in `data`. With live reloading, the pages auto-updates as you edit them.

# Page Structure
for blog/tags
list using: listlayoutwithtags: http://localhost:3000/tags/tag
post using: postbanner/postlayout/postsimple

for publication
list using listlayoutwithtopics: http://localhost:3000/topics/topic

for resource
list using listlayoutwithcategories http://localhost:3000/resource/category/subcategory

difference between three listlayout:
blog - listlayoutwithtags: + tags underneath the listitem
publication - listlayoutwithtopics: + topics + DOI/PMID underneath the listitem
resource - listlayoutwithcategories + subcategories in a category

## TODO
subcategories need to be restored since previously only one category was allowed for each resource item

## Extend / Customize

`data/siteMetadata.js` - contains most of the site related information which should be modified for a user's need.

`data/authors/default.md` - default author information (required). Additional authors can be added as files in `data/authors`.

`data/headerNavLinks.js` - navigation links.

`data/logo.svg` - replace with your own logo.

`data/blog` - replace with your own blog posts.

`public/static` - store assets such as images and favicons.

`tailwind.config.js` and `css/tailwind.css` - tailwind configuration and stylesheet which can be modified to change the overall look and feel of the site.

`css/prism.css` - controls the styles associated with the code blocks. Feel free to customize it and use your preferred prismjs theme e.g. [prism themes](https://github.com/PrismJS/prism-themes).

`contentlayer.config.ts` - configuration for Contentlayer, including definition of content sources and MDX plugins used. See [Contentlayer documentation](https://www.contentlayer.dev/docs/getting-started) for more information.

`components/MDXComponents.js` - pass your own JSX code or React component by specifying it over here. You can then use them directly in the `.mdx` or `.md` file. By default, a custom link, `next/image` component, table of contents component and Newsletter form are passed down. Note that the components should be default exported to avoid [existing issues with Next.js](https://github.com/vercel/next.js/issues/51593).

`layouts` - main templates used in pages:

- There are currently 3 post layouts available: `PostLayout`, `PostSimple` and `PostBanner`. `PostLayout` is the default 2 column layout with meta and author information. `PostSimple` is a simplified version of `PostLayout`, while `PostBanner` features a banner image.
- There are 2 blog listing layouts: `ListLayout`, the layout used in version 1 of the template with a search bar and `ListLayoutWithTags`, currently used in version 2, which omits the search bar but includes a sidebar with information on the tags.

`app` - pages to route to. Read the [Next.js documentation](https://nextjs.org/docs/app) for more information.

`next.config.js` - configuration related to Next.js. You need to adapt the Content Security Policy if you want to load scripts, images etc. from other domains.

## Post

Content is modelled using [Contentlayer](https://www.contentlayer.dev/), which allows you to define your own content schema and use it to generate typed content objects. See [Contentlayer documentation](https://www.contentlayer.dev/docs/getting-started) for more information.

### Frontmatter

Frontmatter follows [Hugo's standards](https://gohugo.io/content-management/front-matter/).

Please refer to `contentlayer.config.ts` for an up to date list of supported fields. The following fields are supported:

```
title (required)
date (required)
tags (optional)
draft (optional)
summary (optional)
images (optional)
authors (optional list which should correspond to the file names in `data/authors`. Uses `default` if none is specified)
layout (optional list which should correspond to the file names in `data/layouts`)
```

### Production & Maintainance
The application is hosted on Vercel, user demographics is recorded by Google Analytics and comments are hosted as discussions in the Github repository.

Vercel Deployment https://vercel.com/
Google Analytics https://analytics.google.com/analytics/web/
Github Comments https://github.com/LDY681/orto/discussions

### Future Integration
After a domain is acquired, it it advised to set up a CDN for fast access and content protection, Cloudfare offers a free plan which comes with caching, DDos protection and bot detection.
https://www.cloudflare.com/en-au/
