[![Build Status](https://travis-ci.org/dashixiong1990/jsonp_p.svg?branch=master)](https://travis-ci.org/dashixiong1990/jsonp_p)

# jsonp_p

Jsonp in Promise and callback mode.

## Installing

```bash
npm install jsonp_p
```

## Usage

```js
import jsonp from "jsonp_p";

// Promise mode
jsonp({
  url: "http://jsfiddle.net/echo/jsonp/",
  params: {
    name: "jsonp_p",
    version: "0.0.1"
  },
  callback: "jsonp"
}).then(data => {
  console.log(data);
  //{name: 'jsonp_p',version: '0.0.1'}
});

// callback mode
jsonp({
  url: "http://jsfiddle.net/echo/jsonp/",
  params: {
    name: "jsonp_p",
    version: "0.0.1"
  },
  callback: "jsonp",
  onSuccess(data) {
    console.log(data);
    //{name: 'jsonp_p',version: '0.0.1'}
  }
});
```

## options

### url

request url

### params

query string defaultencodeURI

### callback

callback name

### onSuccess

If callback mode is preferred, then a function can be passed to `onSuccess`

### onError

Just like onSuccess, available if callback mode is preferred

## Callback and Promise

`jsonp_p` supports callback mode now.

If a global `Promise` is available, `jsonp_p` can also run in Promise mode.

If your environment doesn't support `Promise`, you can add [polyfill](https://github.com/jakearchibald/es6-promise).
