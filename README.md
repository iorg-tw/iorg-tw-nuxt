# IORG.tw

> IORG.tw made with Nuxt.js.

## Build Setup

### Create `.env`

```txt
HOST=0.0.0.0
PORT=10101
GOOGLE_SHEET_API_KEY={key}
AIRTABLE_API_KEY={key}
```

### Get ION data

```bash
$ npm run sync:ion
```

### Use some of these commands

```bash
# install dependencies
$ npm install

# serve with hot reload at [HOST]:[PORT]
$ npm run dev

# build for production
$ npm run build

# launch server
$ npm run start
# OR
$ pm2 start npm --name iorg-tw-nuxt -- start
```
