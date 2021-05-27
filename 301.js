module.exports = [
  { from: '/events', to: '/e' },
  { from: '/d', to: '/r' },
  { from: '/v', to: '/a' },
  { from: '/i', to: '/a' },
  { from: /^\/[iv]{1}\/(.+)$/, to: '/a/$1' },
  { from: /^\/f\/r-(.+)$/, to: '/r/$1' },
  // short urls
  { from: '/f/co', to: 'https://docs.google.com/document/d/1jzXzNCLb5NzY8-ZpnKu548NtR3xAsiisGszA-foiFNs/edit'},
  { from: '/f/sns', to: 'https://docs.google.com/document/d/14LXxlD_hPicVcixhXermPXtaVjso8vASgqRqlhjuui0/edit'},
  { from: '/f/print', to: 'https://drive.google.com/drive/folders/1rhS-SA6rCELnS9XtzByPAHHIe7ymHlEe' }
]
