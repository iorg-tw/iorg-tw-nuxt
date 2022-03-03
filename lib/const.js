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

const stickers = {
  daPreview: {
    _tw: '不心慌預報',
    _en: 'Preview',
    class: 'ok'
  },
  poohSays: {
    _tw: '維尼說',
    _en: 'CCP says',
    classes: 'danger'
  },
  poohAlso: {
    _tw: '維尼也說',
    _en: 'CCP also says',
    classes: 'danger'
  },
  ccpInit: {
    _tw: '中共發起',
    _en: 'CCP initiation',
    classes: 'danger'
  },
  ccpPart: {
    _tw: '中共協力',
    _en: 'CCP participation',
    classes: 'danger'
  },
  ccpExt: {
    _tw: '中共論述延伸',
    _en: 'CCP extension',
    classes: 'danger'
  },
  gov: {
    _tw: '政府宣傳',
    _en: 'Government',
    classes: 'alert'
  },
  statusQuo: {
    _tw: '符合現況',
    _en: 'StatusQuo',
    classes: 'ok'
  },
  simplification: {
    _tw: '簡化',
    _en: 'Simplification',
    classes: 'alert'
  },
  simplif: {
    _tw: '簡化',
    _en: 'Simplification',
    classes: 'alert'
  },
  falsif: {
    _tw: '無法證偽',
    _en: 'Cannot falsify',
    classes: 'alert'
  },
  waitScience: {
    _tw: '待科學驗證',
    _en: 'Wait for science',
    classes: 'alert'
  },
  lackScience: {
    _tw: '沒有科學證據',
    _en: 'Lack science',
    classes: 'alert'
  },
  suspicious: {
    _tw: '可疑訊息',
    _en: 'Suspicious',
    classes: 'alert'
  },
  unverified: {
    _tw: '引用未證實訊息',
    _en: 'Unverified information',
    classes: 'alert'
  },
  masqOrigin: {
    _tw: '混淆來源',
    _en: 'Masqueraded origin',
    classes: 'bad'
  },
  falseSrc: {
    _tw: '來源錯誤',
    _en: 'False source',
    classes: 'bad'
  },
  false: {
    _tw: '錯誤',
    _en: 'False',
    classes: 'danger'
  },
  partFalse: {
    _tw: '包含錯誤內容',
    _en: 'Partially false',
    classes: 'danger'
  },
  distortedContent: {
    _tw: '變造內容',
    _en: 'Distorted content',
    classes: 'bad'
  },
  badCausality: {
    _tw: '不當因果關係',
    _en: 'Bad causality',
    classes: 'bad'
  },
  noCausality: {
    _tw: '沒有因果關係',
    _en: 'No causality',
    classes: 'bad'
  },
  lackEvidence: {
    _tw: '沒有證據',
    _en: 'Lack evidence',
    classes: 'bad'
  },
  falseEq: {
    _tw: '錯誤類比',
    _en: 'False equivalence',
    classes: 'bad'
  },
  appealAuth: {
    _tw: '訴諸權威',
    _en: 'Appeal to authority',
    classes: 'alert'
  },
  appealFear: {
    _tw: '訴諸恐懼',
    _en: 'Appeal to fear',
    classes: 'alert'
  },
  conspiracy: {
    _tw: '陰謀論',
    _en: 'Conspiracy',
    classes: 'danger'
  },
  clusteredPosting: {
    _tw: '協同發文',
    _en: 'Clustered posting',
    classes: 'alert'
  },
  runData: {
    _tw: '心慌跑資料',
    _en: 'Run data',
    classes: 'highlight'
  },
  followUp: {
    _tw: '心慌追追追',
    _en: 'Follow-up',
    classes: 'highlight'
  },
  op: {
    _tw: 'IORG 觀點',
    _en: 'IORG opinion',
    classes: 'ok'
  },
  opinion: {
    _tw: 'IORG 觀點',
    _en: 'IORG opinion',
    classes: 'ok'
  },
  fb: {
    _tw: '臉',
    _en: 'F',
    classes: 'fb'
  },
  wb: {
    _tw: '微',
    _en: 'W',
    classes: 'wb'
  },
  ccp: {
    _tw: '中共',
    _en: 'CCP',
    classes: 'ccp'
  },
  red: {
    _tw: '類官媒',
    _en: 'CCP-AFF',
    classes: 'red'
  },
  pink: {
    _tw: '中國',
    _en: 'China',
    classes: 'pink'
  }
}

exports.PUNCT = PUNCT
exports.textMap = textMap
exports.stickers = stickers
