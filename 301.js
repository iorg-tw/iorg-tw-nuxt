module.exports = [
  { from: '/events', to: '/e' },
  { from: '/d', to: '/r' },
  { from: '/v', to: '/a' },
  { from: '/i', to: '/a' },
  { from: /^\/[iv]{1}\/(.+)$/, to: '/a/$1' },
  { from: /^\/f\/r-(.+)$/, to: '/r/$1' }
]
