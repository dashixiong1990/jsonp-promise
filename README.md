# jsonp_p
Promise based jsonp

## Installing

```bash
$ npm install jsonp_p
```

## Usage

```js
import jsonpPromise from 'jsonp_p'

jsonpPromise({
  url: 'http://jsfiddle.net/echo/jsonp/',  
  params: {
    name: 'jsonp_p',
    version: '0.0.1'
  },
  callback: 'jsonpPromise' 
}).then( data => {
  console.log(data)
  //{name: 'jsonp_p',version: '0.0.1'}
})
```

## options

#### url 
request url
#### params 
query string defaultencodeURI
#### callback
callback name

## Promises

jsonp_p depends on a native ES6 Promise implementation to be [supported](http://caniuse.com/promises).
If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise).
