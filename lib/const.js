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
  }
}

exports.PUNCT = PUNCT
