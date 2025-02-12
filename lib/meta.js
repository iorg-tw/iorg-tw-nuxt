const config = require('../data/config.js')
const defaultCoverImage = 'https://iorg.tw/images/cover-2-1.png'

export function generateMeta(title, subtitle = '', description = '', image = defaultCoverImage) {
  const SEP = '–'
  title = [title, ...(subtitle ? [SEP, subtitle] : []), SEP, config.title].join(' ')
  description = description.length > 0 ? description : subtitle.length > 0 ? subtitle : config.title

  const meta = [
    {
      hid: 'description',
      name: 'description',
      content: description
    },
    // og
    {
      hid: 'og-type',
      name: 'og:type',
      property: 'og:type',
      content: 'website'
    },
    {
      vmid: 'og-title',
      name: 'og:title',
      property: 'og:title',
      content: title
    },
    {
      vmid: 'og-description',
      name: 'og:description',
      property: 'og:description',
      content: description
    },
    {
      vmid: 'og-image',
      name: 'og:image',
      property: 'og:image',
      content: image
    },
    // twitter
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
      content: title
    },
    {
      vmid: 'twitter-description',
      name: 'twitter:description',
      property: 'twitter:description',
      content: description
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
    _description: description,
    _image: image,
    meta
  }
}
