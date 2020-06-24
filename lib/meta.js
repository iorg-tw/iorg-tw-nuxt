import defaultCoverImage from '~/static/images/cover-2-1.png'

export function generateMeta(pageTitle, pageDescription, image = defaultCoverImage) {
  const title = [pageTitle, '/', 'IORG'].join(' ')
  const meta = [
    {
      hid: 'description',
      name: 'description',
      content: pageDescription
    },
    {
      vmid: 'og-type',
      name: 'og:type',
      property: 'og:type',
      content: 'website'
    },
    {
      vmid: 'og-title',
      name: 'og:title',
      property: 'og:title',
      content: pageTitle
    },
    {
      vmid: 'og-description',
      name: 'og:description',
      property: 'og:description',
      content: pageDescription
    },
    {
      vmid: 'og-image',
      name: 'og:image',
      property: 'og:image',
      content: image
    },
    {
      vmid: 'twitter-card',
      name: 'twitter:card',
      property: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      vmid: 'twitter-title',
      name: 'twitter:title',
      property: 'twitter:title',
      content: pageTitle
    },
    {
      vmid: 'twitter-description',
      name: 'twitter:description',
      property: 'twitter:description',
      content: pageDescription
    },
    {
      vmid: 'twitter-image',
      name: 'twitter:image',
      property: 'twitter:image',
      content: image
    }
  ]
  return {
    title,
    meta
  }
}
