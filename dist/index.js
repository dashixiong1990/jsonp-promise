'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (options) {
  return new jsonpPromise(options);
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function jsonpNoop() {}
jsonpNoop.uid = 0;

var jsonpPromise = function () {
  function jsonpPromise(options) {
    _classCallCheck(this, jsonpPromise);

    this.initConfig(options);
    this.buildURL();
    this.insertScript();
    return this.generatePromise();
  }

  _createClass(jsonpPromise, [{
    key: 'initConfig',
    value: function initConfig(options) {
      this.options = options;
      this.options.callback = this.options.callback ? this.options.callback : '__jp' + jsonpNoop.uid++;
      this.script = document.createElement('script');
    }
  }, {
    key: 'buildURL',
    value: function buildURL() {
      var query = this.queryStringify();

      var url = this.options.url;
      url += (~url.indexOf('?') ? '&' : '?') + query + 'callback=' + this.options.callback;
      url = url.replace('?&', '?');
      this.url = url;
    }
  }, {
    key: 'queryStringify',
    value: function queryStringify() {
      var queryObj = this.options.params;
      var queryString = '';
      if (queryObj) {
        var queryKeysArray = Object.keys(queryObj);
        queryKeysArray.forEach(function (key) {
          queryString += key + '=' + encodeURIComponent(queryObj[key]) + '&';
        });
      }
      return queryString;
    }
  }, {
    key: 'insertScript',
    value: function insertScript() {
      var script = this.script;
      var target = document.getElementsByTagName('script')[0] || document.head;
      script.src = this.url;
      target.parentNode.insertBefore(script, target);
    }
  }, {
    key: 'generatePromise',
    value: function generatePromise() {
      var _this = this;

      var callback = this.options.callback;
      return new Promise(function (resolve, reject) {
        // handle include . callback name like: a.b.c
        var callbackArray = callback.split('.');
        var length = callbackArray.length;
        var callbackObj = window;

        callbackArray.forEach(function (key, index) {
          if (length === index + 1) {
            callbackObj[key] = function (data) {
              resolve(data);
              _this.cleanup(callback);
            };
          } else {
            if (!callbackObj[key]) {
              callbackObj[key] = {};
            }
            callbackObj = callbackObj[key];
          }
        });
      });
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      var script = this.script;
      if (script.parentNode) script.parentNode.removeChild(script);
      window[this.options.callback] = jsonpNoop;
    }
  }]);

  return jsonpPromise;
}();