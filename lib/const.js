const PUNCT = {
  IDEOSPACE: '　',
  COMMA: '，',
  FSTOP: '。',
  PAUSE: '、',
  COLON: '：',
  SEMICOL: '；',
  EXCLA: '！',
  Q: '？',
  SLASH: '／',
  DOT: '･',
  L: {
    PAR: '（',
    DBRAC: '《',
    SBRAC: '〈',
    QUOTE: '「',
    FBRAC: '【' // 隅付き括弧 (sumitsuki-kakko) OR ink-filled bracket OR lenticular bracket
  },
  R: {
    PAR: '）',
    DBRAC: '》',
    SBRAC: '〉',
    QUOTE: '」',
    FBRAC: '】'
  },
  ELLIPS: '⋯'
}

const textMap = {
  china: '中國',
  ccp: '中共',
  hk: '香港',
  my: '馬來西亞',
  tw: '台灣',
  jp: '日本',
  usa: '美國',
  forum: '論壇',
  none: 'none',
  default: 'default',
  command: 'command'
}

exports.PUNCT = PUNCT
exports.textMap = textMap
