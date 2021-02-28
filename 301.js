module.exports = [
  { from: '/events', to: '/e' },
  { from: '/d', to: '/r' },
  { from: '/v', to: '/a', matchStart: true },
  { from: '/i', to: '/a', matchStart: true },
  { from: '/f/r-', to: '/r/', matchStart: true }
]
