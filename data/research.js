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
  },
  _R_B1: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vSoxqSJ4LfF9Hv9wKT8HQ9icAfgxZooFpY9EsuPdhda-5Hr65m__WBeX15ZkAue6WY8HIZsCvdpT0WH/pub'
  },
  _R_R1: {
    publicURL: 'https://docs.google.com/document/d/e/2PACX-1vTMqwZQFP2n7IK8RrDozn8vfUxo2ku8OEMKnLgRJos2-_HT2z38S6KCE0kK-IwY5JxAx1rWRVtWSZ7N/pub'
  }
}

const tree = [
  {
    id: '_R_A',
    to: '/r/a',
    level: 0,
    code: 'A',
    image: '/images/covers/a-h.png'
  },
  {
    id: '_R_B',
    to: '/r/b',
    level: 0,
    code: 'B',
    image: '/images/covers/b-h.png'
  },
  {
    id: '_R_B1',
    to: '/r/b1',
    level: 1,
    parentID: '_R_B',
    code: 'B.1',
    isArticle: true
  },
  {
    id: '_R_R1',
    to: '/r/r1',
    level: 1,
    parentID: '_R_B',
    code: 'R.1',
    isArticle: true
  },
  {
    id: '_R_D',
    to: '/r/d',
    level: 0,
    code: 'D',
    image: '/images/covers/d-h.png'
  },
  {
    id: '_R_D1',
    to: '/r/D1',
    level: 1,
    parentID: '_R_D',
    code: 'D.1'
  },
  {
    id: '_R_M',
    to: '/r/m',
    level: 0,
    code: 'M'
  },
  {
    id: '_O',
    to: '/open-by-default',
    level: 0,
    code: 'O'
  },
  {
    id: '_F',
    to: '/roadmap',
    level: 0,
    code: 'F'
  },
  {
    id: '_CE_2020',
    to: '/ce/2020',
    level: 0,
    code: 'CE'
  },
  {
    id: '_G',
    to: '/glossary',
    level: 0,
    code: 'G'
  },
  {
    id: '_X',
    to: '/exhibition',
    level: 0,
    code: 'X'
  }
]

const defaultCover = '/images/covers/x-h.png'

module.exports = {
  articleMap,
  tree,
  defaultCover
}
