const articleMap = {
  keyFindings: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vTP2pZvsbfGbERQCtaIduiRkgsRduLp68wBPZOpM6M9mk2ruSX5qrHGbsN3ira567Dc6qj65V0vpqTG/pub'
  },
  methodologies: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vSnOIJMI4CV2m3OoHKqjBRSI7ezjIXwgJjiMC-z6Y_IzdrsaTw6ntmMWOcgfHq-Mm2RJL_uD94YOisD/pub'
  },
  openByDefault: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vTWjy95OHJ4XseWoHL_JbW_kSa1FTQiQTilY0KNHbGb77FJSeOCsARrF5StE_ReXLgnty5qZERxHDt1/pub'
  },
  glossary: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vSJe7UCSYhMvEzZyAeAaJ-UxbJOVNNnkEN8897d01lGpP2w_LVp9S8kpUAwOnsPMRU3cPWqE5mLyQM4/pub'
  },
  acknowledgement: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vTbqKB1uun54pSxk6lD-I_NhpGxyYFEc2jsw-KPT-fY9JVNk_NsveMJwVGpYqIC5GcSerugWMhDOrfC/pub'
  }
}

const topics = [
  {
    id: 'A',
    to: '/r/a',
    title: '中國對台滲透網絡',
    image: '/images/covers/a-h.png'
  },
  {
    id: 'B',
    to: '/r/b',
    title: '資訊操弄',
    image: '/images/covers/b-h.png'
  },
  {
    id: 'D',
    to: '/r/d',
    title: '人際滲透',
    image: '/images/covers/d-h.png'
  },
  {
    id: 'P1',
    to: '/r/p/1',
    title: '受操弄資訊內容演化',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'P2',
    to: '/r/p/2',
    title: '事實查核有效性',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'M',
    to: '/r/m',
    title: '研究方法',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'O',
    to: '/open-by-default',
    title: '研究成果授權公開',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'F',
    title: '未來研究',
    to: '/roadmap',
    image: '/images/covers/f-h.png'
  },
  {
    id: 'W',
    to: '/community-engagement-2020',
    title: '在地連結成果報告',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'G',
    to: '/glossary',
    title: '辭典',
    image: '/images/covers/x-h.png'
  },
  {
    id: 'X',
    to: '/exhibition',
    title: '展覽',
    image: '/images/covers/x-h.png'
  }
]

const cases = [
  {
    id: 'B1',
    to: '/r/b/1',
    title: '關西機場'
  },
  {
    id: 'B2',
    to: '/r/b/2',
    title: '陳菊貪污'
  },
  {
    id: 'D1',
    to: '/r/d/1',
    title: '村里長滲透'
  }
]

module.exports = {
  articleMap,
  topics,
  cases
}
