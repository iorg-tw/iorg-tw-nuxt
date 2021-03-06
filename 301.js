module.exports = [
  { from: '/events', to: '/e' },
  { from: '/d', to: '/r' },
  { from: '/v', to: '/a' },
  { from: '/i', to: '/a' },
  { from: '/a/ye-da-hua', to: '/a/yeh-ta-hua' },
  { from: '/a/teng-hh', to: '/a/teng-hsi-hua' },
  { from: '/a/wang-wy', to: '/a/wang-wan-yu' },
  { from: '/a/huang-jn', to: '/a/huang-jaw-nian' },
  { from: '/a/ho-cw', to: '/a/ho-chih-wei' },
  { from: '/a/chen-tf', to: '/a/chen-ting-fei' },
  { from: '/a/chiu-hc', to: '/a/chiu-hsien-chih' },
  { from: '/a/kao-ha', to: '/a/kao-hung-an' },
  { from: '/a/chen-pw', to: '/a/chen-po-wei' },
  { from: '/a/wu-sy', to: '/a/wu-szu-yao' },
  { from: '/a/miao-by', to: '/a/miao-bo-ya' },
  { from: '/a/fan-y', to: '/a/fan-yun' },
  { from: '/a/lai-py', to: '/a/lai-pin-yu' },
  { from: '/a/chiu-wc', to: '/a/chiu-wei-chieh' },
  { from: '/a/hong-sh', to: '/a/hung-sun-han' },
  { from: /^\/[iv]{1}\/(.+)$/, to: '/a/$1' },
  { from: /^\/f\/r-(.+)$/, to: '/r/$1' },
  // short urls
  { from: '/f/co', to: 'https://docs.google.com/document/d/1jzXzNCLb5NzY8-ZpnKu548NtR3xAsiisGszA-foiFNs/edit'},
  { from: '/f/dsc', to: 'https://docs.google.com/document/d/1NFFKVFr47-Kzuam8c0Fa7hyq09z-l1iHbMG9vtvOfeA/edit'},
  { from: '/f/sns', to: 'https://docs.google.com/document/d/14LXxlD_hPicVcixhXermPXtaVjso8vASgqRqlhjuui0/edit'},
  { from: '/f/print', to: 'https://drive.google.com/drive/folders/1rhS-SA6rCELnS9XtzByPAHHIe7ymHlEe' }
]
