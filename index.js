function jsonpNoop() {}
jsonpNoop.uid = 0;
const TIMEOUT = 10000;

class jsonpPromise {
  constructor(options = {}) {
    this.timeoutTimer = 0;
    this.initConfig(options);
    this.buildURL();
    return this.generatePromise();
  }
  initConfig(options) {
    this.options = options;
    this.options.callback = this.options.callback
      ? this.options.callback
      : `__jp${jsonpNoop.uid++}`;
    this.script = document.createElement("script");
    // timeout setup
    this.timeout = isNaN(options.timeout) ? TIMEOUT : +options.timeout;
  }
  buildURL() {
    const query = this.queryStringify();

    let url = this.options.url;
    url +=
      (~url.indexOf("?") ? "&" : "?") +
      query +
      "callback=" +
      this.options.callback;
    url = url.replace("?&", "?");
    this.url = url;
  }
  queryStringify() {
    const queryObj = this.options.params;
    let queryString = "";
    if (queryObj) {
      const queryKeysArray = Object.keys(queryObj);
      queryKeysArray.forEach(key => {
        queryString += `${key}=${encodeURIComponent(queryObj[key])}&`;
      });
    }
    return queryString;
  }
  insertScript(errCallback = () => void 0) {
    const script = this.script;
    const target = document.getElementsByTagName("script")[0] || document.head;
    script.src = this.url;
    script.onload = () => {
      clearTimeout(this.timeoutTimer);
    };
    // handle timeout & onerror
    this.timeoutTimer = setTimeout(() => {
      errCallback();
    }, this.timeout);
    script.onerror = errCallback;
    target.parentNode.insertBefore(script, target);
  }
  generatePromise() {
    // support callback mode
    const THENABLE = {
      then() {}
    };
    const { onSuccess, onError } = this.options;
    if (typeof onSuccess === "function" || typeof onError === "function") {
      const onSuccess2Use = onSuccess || function() {};
      const onError2Use = onError || function() {};
      this.setJsonpCallback(onSuccess2Use);
      this.insertScript(onError2Use);
      return THENABLE;
    }
    if (global.Promise) {
      return new Promise((resolve, reject) => {
        this.insertScript(reject);
        this.setJsonpCallback(resolve);
      });
    }
    return THENABLE;
  }

  setJsonpCallback(fn = () => void 0) {
    const callback = this.options.callback;
    // handle include . callback name like: a.b.c
    const callbackArray = callback.split(".");
    const length = callbackArray.length;
    let callbackObj = window;

    callbackArray.forEach((key, index) => {
      if (length === index + 1) {
        callbackObj[key] = data => {
          fn(data);
          this.cleanup(callback);
        };
      } else {
        if (!callbackObj[key]) {
          callbackObj[key] = {};
        }
        callbackObj = callbackObj[key];
      }
    });
  }
  cleanup() {
    const script = this.script;
    if (script.parentNode) script.parentNode.removeChild(script);
    window[this.options.callback] = jsonpNoop;
  }
}

export default function(options) {
  return new jsonpPromise(options);
}
