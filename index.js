function jsonpNoop () {}
jsonpNoop.uid = 0

class jsonpPromise {
  constructor (options) {
    this.initConfig(options)
    this.buildURL()
    this.insertScript()
    return this.generatePromise()
  }
  initConfig (options) {
    this.options = options
    this.options.callback = this.options.callback ? this.options.callback : `__jp${jsonpNoop.uid++}`
    this.script = document.createElement('script')
  }
  buildURL () {
    const query = this.queryStringify()

    let url = this.options.url
    url += (~url.indexOf('?') ? '&' : '?') + query + 'callback=' + this.options.callback
    url = url.replace('?&', '?')
    this.url = url
  }
  queryStringify () {
    const queryObj = this.options.params
    let queryString = ''
    if (queryObj) {
      const queryKeysArray = Object.keys(queryObj)
      queryKeysArray.forEach(key => {
        queryString += `${key}=${encodeURIComponent(queryObj[key])}&`
      })
    }
    return queryString
  }
  insertScript () {
    const script = this.script
    const target = document.getElementsByTagName('script')[0] || document.head
    script.src = this.url
    target.parentNode.insertBefore(script, target)
  }
  generatePromise () {
    const callback = this.options.callback
    return new Promise((resolve, reject) => {
      // handle include . callback name like: a.b.c
      const callbackArray = callback.split('.')
      const length = callbackArray.length
      let callbackObj = window

      callbackArray.forEach((key, index) => {
        if (length === index + 1) {
          callbackObj[key] = (data) => {
            resolve(data)
            this.cleanup(callback)
          }
        } else {
          if (!callbackObj[key]) {
            callbackObj[key] = {}
          }
          callbackObj = callbackObj[key]
        }
      })
    })
  }
  cleanup () {
    const script = this.script
    if (script.parentNode) script.parentNode.removeChild(script)
    window[this.options.callback] = jsonpNoop
  }
}

export default function (options) {
  return new jsonpPromise(options)
}