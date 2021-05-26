module.exports = [
  { from: '/events', to: '/e' },
  { from: '/d', to: '/r' },
  { from: '/v', to: '/a' },
  { from: '/i', to: '/a' },
  { from: /^\/[iv]{1}\/(.+)$/, to: '/a/$1' },
  { from: /^\/f\/r-(.+)$/, to: '/r/$1' },
  // short urls
  { from: '/f/print', to: 'https://drive.google.com/drive/folders/1rhS-SA6rCELnS9XtzByPAHHIe7ymHlEe' }
]
