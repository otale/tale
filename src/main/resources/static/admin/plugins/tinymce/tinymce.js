// 4.7.4 (2017-12-05)
(function () {
(function () {
  'use strict';

  var noop = function () {
  };
  var noarg = function (f) {
    return function () {
      return f();
    };
  };
  var compose = function (fa, fb) {
    return function () {
      return fa(fb.apply(null, arguments));
    };
  };
  var constant = function (value) {
    return function () {
      return value;
    };
  };
  var identity = function (x) {
    return x;
  };
  var tripleEquals = function (a, b) {
    return a === b;
  };
  var curry = function (f) {
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++)
      args[i - 1] = arguments[i];
    return function () {
      var newArgs = new Array(arguments.length);
      for (var j = 0; j < newArgs.length; j++)
        newArgs[j] = arguments[j];
      var all = args.concat(newArgs);
      return f.apply(null, all);
    };
  };
  var not = function (f) {
    return function () {
      return !f.apply(null, arguments);
    };
  };
  var die = function (msg) {
    return function () {
      throw new Error(msg);
    };
  };
  var apply = function (f) {
    return f();
  };
  var call = function (f) {
    f();
  };
  var never$1 = constant(false);
  var always$1 = constant(true);
  var $_f41mrx6jc7tm6cd = {
    noop: noop,
    noarg: noarg,
    compose: compose,
    constant: constant,
    identity: identity,
    tripleEquals: tripleEquals,
    curry: curry,
    not: not,
    die: die,
    apply: apply,
    call: call,
    never: never$1,
    always: always$1
  };

  var never = $_f41mrx6jc7tm6cd.never;
  var always = $_f41mrx6jc7tm6cd.always;
  var none = function () {
    return NONE;
  };
  var NONE = function () {
    var eq = function (o) {
      return o.isNone();
    };
    var call = function (thunk) {
      return thunk();
    };
    var id = function (n) {
      return n;
    };
    var noop = function () {
    };
    var me = {
      fold: function (n, s) {
        return n();
      },
      is: never,
      isSome: never,
      isNone: always,
      getOr: id,
      getOrThunk: call,
      getOrDie: function (msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      or: id,
      orThunk: call,
      map: none,
      ap: none,
      each: noop,
      bind: none,
      flatten: none,
      exists: never,
      forall: always,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function () {
        return [];
      },
      toString: $_f41mrx6jc7tm6cd.constant('none()')
    };
    if (Object.freeze)
      Object.freeze(me);
    return me;
  }();
  var some = function (a) {
    var constant_a = function () {
      return a;
    };
    var self = function () {
      return me;
    };
    var map = function (f) {
      return some(f(a));
    };
    var bind = function (f) {
      return f(a);
    };
    var me = {
      fold: function (n, s) {
        return s(a);
      },
      is: function (v) {
        return a === v;
      },
      isSome: always,
      isNone: never,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      or: self,
      orThunk: self,
      map: map,
      ap: function (optfab) {
        return optfab.fold(none, function (fab) {
          return some(fab(a));
        });
      },
      each: function (f) {
        f(a);
      },
      bind: bind,
      flatten: constant_a,
      exists: bind,
      forall: bind,
      filter: function (f) {
        return f(a) ? me : NONE;
      },
      equals: function (o) {
        return o.is(a);
      },
      equals_: function (o, elementEq) {
        return o.fold(never, function (b) {
          return elementEq(a, b);
        });
      },
      toArray: function () {
        return [a];
      },
      toString: function () {
        return 'some(' + a + ')';
      }
    };
    return me;
  };
  var from = function (value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  var $_e5uurj5jc7tm6bt = {
    some: some,
    none: none,
    from: from
  };

  var rawIndexOf = function () {
    var pIndexOf = Array.prototype.indexOf;
    var fastIndex = function (xs, x) {
      return pIndexOf.call(xs, x);
    };
    var slowIndex = function (xs, x) {
      return slowIndexOf(xs, x);
    };
    return pIndexOf === undefined ? slowIndex : fastIndex;
  }();
  var indexOf = function (xs, x) {
    var r = rawIndexOf(xs, x);
    return r === -1 ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(r);
  };
  var contains = function (xs, x) {
    return rawIndexOf(xs, x) > -1;
  };
  var exists = function (xs, pred) {
    return findIndex(xs, pred).isSome();
  };
  var range = function (num, f) {
    var r = [];
    for (var i = 0; i < num; i++) {
      r.push(f(i));
    }
    return r;
  };
  var chunk = function (array, size) {
    var r = [];
    for (var i = 0; i < array.length; i += size) {
      var s = array.slice(i, i + size);
      r.push(s);
    }
    return r;
  };
  var map = function (xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i, xs);
    }
    return r;
  };
  var each$1 = function (xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var eachr = function (xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var partition = function (xs, pred) {
    var pass = [];
    var fail = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      var arr = pred(x, i, xs) ? pass : fail;
      arr.push(x);
    }
    return {
      pass: pass,
      fail: fail
    };
  };
  var filter = function (xs, pred) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        r.push(x);
      }
    }
    return r;
  };
  var groupBy = function (xs, f) {
    if (xs.length === 0) {
      return [];
    } else {
      var wasType = f(xs[0]);
      var r = [];
      var group = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var type = f(x);
        if (type !== wasType) {
          r.push(group);
          group = [];
        }
        wasType = type;
        group.push(x);
      }
      if (group.length !== 0) {
        r.push(group);
      }
      return r;
    }
  };
  var foldr = function (xs, f, acc) {
    eachr(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var foldl = function (xs, f, acc) {
    each$1(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_e5uurj5jc7tm6bt.some(x);
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_e5uurj5jc7tm6bt.some(i);
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var slowIndexOf = function (xs, x) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  };
  var push = Array.prototype.push;
  var flatten = function (xs) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!Array.prototype.isPrototypeOf(xs[i]))
        throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
      push.apply(r, xs[i]);
    }
    return r;
  };
  var bind = function (xs, f) {
    var output = map(xs, f);
    return flatten(output);
  };
  var forall = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i];
      if (pred(x, i, xs) !== true) {
        return false;
      }
    }
    return true;
  };
  var equal = function (a1, a2) {
    return a1.length === a2.length && forall(a1, function (x, i) {
      return x === a2[i];
    });
  };
  var slice = Array.prototype.slice;
  var reverse = function (xs) {
    var r = slice.call(xs, 0);
    r.reverse();
    return r;
  };
  var difference = function (a1, a2) {
    return filter(a1, function (x) {
      return !contains(a2, x);
    });
  };
  var mapToObject = function (xs, f) {
    var r = {};
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      r[String(x)] = f(x, i);
    }
    return r;
  };
  var pure = function (x) {
    return [x];
  };
  var sort = function (xs, comparator) {
    var copy = slice.call(xs, 0);
    copy.sort(comparator);
    return copy;
  };
  var head = function (xs) {
    return xs.length === 0 ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(xs[xs.length - 1]);
  };
  var $_20yqgb4jc7tm6aj = {
    map: map,
    each: each$1,
    eachr: eachr,
    partition: partition,
    filter: filter,
    groupBy: groupBy,
    indexOf: indexOf,
    foldr: foldr,
    foldl: foldl,
    find: find,
    findIndex: findIndex,
    flatten: flatten,
    bind: bind,
    forall: forall,
    exists: exists,
    contains: contains,
    equal: equal,
    reverse: reverse,
    chunk: chunk,
    difference: difference,
    mapToObject: mapToObject,
    pure: pure,
    sort: sort,
    range: range,
    head: head,
    last: last
  };

  var global = typeof window !== 'undefined' ? window : Function('return this;')();

  var path = function (parts, scope) {
    var o = scope !== undefined && scope !== null ? scope : global;
    for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
      o = o[parts[i]];
    return o;
  };
  var resolve = function (p, scope) {
    var parts = p.split('.');
    return path(parts, scope);
  };
  var step = function (o, part) {
    if (o[part] === undefined || o[part] === null)
      o[part] = {};
    return o[part];
  };
  var forge = function (parts, target) {
    var o = target !== undefined ? target : global;
    for (var i = 0; i < parts.length; ++i)
      o = step(o, parts[i]);
    return o;
  };
  var namespace = function (name, target) {
    var parts = name.split('.');
    return forge(parts, target);
  };
  var $_70jjagcjc7tm6hj = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_70jjagcjc7tm6hj.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_e2a3j6bjc7tm6hd = { getOrDie: getOrDie };

  var url = function () {
    return $_e2a3j6bjc7tm6hd.getOrDie('URL');
  };
  var createObjectURL = function (blob) {
    return url().createObjectURL(blob);
  };
  var revokeObjectURL = function (u) {
    url().revokeObjectURL(u);
  };
  var $_58egr1ajc7tm6h8 = {
    createObjectURL: createObjectURL,
    revokeObjectURL: revokeObjectURL
  };

  var nav = navigator;
  var userAgent = nav.userAgent;
  var opera;
  var webkit;
  var ie;
  var ie11;
  var ie12;
  var gecko;
  var mac;
  var iDevice;
  var android;
  var fileApi;
  var phone;
  var tablet;
  var windowsPhone;
  var matchMediaQuery = function (query) {
    return 'matchMedia' in window ? matchMedia(query).matches : false;
  };
  opera = false;
  android = /Android/.test(userAgent);
  webkit = /WebKit/.test(userAgent);
  ie = !webkit && !opera && /MSIE/gi.test(userAgent) && /Explorer/gi.test(nav.appName);
  ie = ie && /MSIE (\w+)\./.exec(userAgent)[1];
  ie11 = userAgent.indexOf('Trident/') != -1 && (userAgent.indexOf('rv:') != -1 || nav.appName.indexOf('Netscape') != -1) ? 11 : false;
  ie12 = userAgent.indexOf('Edge/') != -1 && !ie && !ie11 ? 12 : false;
  ie = ie || ie11 || ie12;
  gecko = !webkit && !ie11 && /Gecko/.test(userAgent);
  mac = userAgent.indexOf('Mac') != -1;
  iDevice = /(iPad|iPhone)/.test(userAgent);
  fileApi = 'FormData' in window && 'FileReader' in window && 'URL' in window && !!$_58egr1ajc7tm6h8.createObjectURL;
  phone = matchMediaQuery('only screen and (max-device-width: 480px)') && (android || iDevice);
  tablet = matchMediaQuery('only screen and (min-width: 800px)') && (android || iDevice);
  windowsPhone = userAgent.indexOf('Windows Phone') != -1;
  if (ie12) {
    webkit = false;
  }
  var contentEditable = !iDevice || fileApi || parseInt(userAgent.match(/AppleWebKit\/(\d*)/)[1]) >= 534;
  var $_dtgtsy9jc7tm6gs = {
    opera: opera,
    webkit: webkit,
    ie: ie,
    gecko: gecko,
    mac: mac,
    iOS: iDevice,
    android: android,
    contentEditable: contentEditable,
    transparentSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    caretAfter: ie != 8,
    range: window.getSelection && 'Range' in window,
    documentMode: ie && !ie12 ? document.documentMode || 7 : 10,
    fileApi: fileApi,
    ceFalse: ie === false || ie > 8,
    cacheSuffix: '',
    container: null,
    overrideViewPort: null,
    experimentalShadowDom: false,
    canHaveCSP: ie === false || ie > 11,
    desktop: !phone && !tablet,
    windowsPhone: windowsPhone
  };

  var promise = function () {
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    var isArray = Array.isArray || function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
    var Promise = function (fn) {
      if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function')
        throw new TypeError('not a function');
      this._state = null;
      this._value = null;
      this._deferreds = [];
      doResolve(fn, bind(resolve, this), bind(reject, this));
    };
    var asap = Promise.immediateFn || typeof setImmediate === 'function' && setImmediate || function (fn) {
      setTimeout(fn, 1);
    };
    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }
    function resolve(newValue) {
      try {
        if (newValue === this)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) {
        reject.call(this, e);
      }
    }
    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }
    function finale() {
      for (var i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
      }
      this._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done)
            return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done)
            return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done)
          return;
        done = true;
        onRejected(ex);
      }
    }
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };
    Promise.all = function () {
      var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
      return new Promise(function (resolve, reject) {
        if (args.length === 0)
          return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
    return Promise;
  };
  var promiseObj = window.Promise ? window.Promise : promise();

  var requestAnimationFramePromise;
  var requestAnimationFrame = function (callback, element) {
    var i, requestAnimationFrameFunc = window.requestAnimationFrame, vendors = [
        'ms',
        'moz',
        'webkit'
      ];
    var featurefill = function (callback) {
      window.setTimeout(callback, 0);
    };
    for (i = 0; i < vendors.length && !requestAnimationFrameFunc; i++) {
      requestAnimationFrameFunc = window[vendors[i] + 'RequestAnimationFrame'];
    }
    if (!requestAnimationFrameFunc) {
      requestAnimationFrameFunc = featurefill;
    }
    requestAnimationFrameFunc(callback, element);
  };
  var wrappedSetTimeout = function (callback, time) {
    if (typeof time != 'number') {
      time = 0;
    }
    return setTimeout(callback, time);
  };
  var wrappedSetInterval = function (callback, time) {
    if (typeof time != 'number') {
      time = 1;
    }
    return setInterval(callback, time);
  };
  var wrappedClearTimeout = function (id) {
    return clearTimeout(id);
  };
  var wrappedClearInterval = function (id) {
    return clearInterval(id);
  };
  var debounce = function (callback, time) {
    var timer, func;
    func = function () {
      var args = arguments;
      clearTimeout(timer);
      timer = wrappedSetTimeout(function () {
        callback.apply(this, args);
      }, time);
    };
    func.stop = function () {
      clearTimeout(timer);
    };
    return func;
  };
  var $_9jpiwcgjc7tm6kr = {
    requestAnimationFrame: function (callback, element) {
      if (requestAnimationFramePromise) {
        requestAnimationFramePromise.then(callback);
        return;
      }
      requestAnimationFramePromise = new promiseObj(function (resolve) {
        if (!element) {
          element = document.body;
        }
        requestAnimationFrame(resolve, element);
      }).then(callback);
    },
    setTimeout: wrappedSetTimeout,
    setInterval: wrappedSetInterval,
    setEditorTimeout: function (editor, callback, time) {
      return wrappedSetTimeout(function () {
        if (!editor.removed) {
          callback();
        }
      }, time);
    },
    setEditorInterval: function (editor, callback, time) {
      var timer;
      timer = wrappedSetInterval(function () {
        if (!editor.removed) {
          callback();
        } else {
          clearInterval(timer);
        }
      }, time);
      return timer;
    },
    debounce: debounce,
    throttle: debounce,
    clearInterval: wrappedClearInterval,
    clearTimeout: wrappedClearTimeout
  };

  var eventExpandoPrefix = 'mce-data-';
  var mouseEventRe = /^(?:mouse|contextmenu)|click/;
  var deprecated = {
    keyLocation: 1,
    layerX: 1,
    layerY: 1,
    returnValue: 1,
    webkitMovementX: 1,
    webkitMovementY: 1,
    keyIdentifier: 1
  };
  var hasIsDefaultPrevented = function (event) {
    return event.isDefaultPrevented === returnTrue || event.isDefaultPrevented === returnFalse;
  };
  var returnFalse = function () {
    return false;
  };
  var returnTrue = function () {
    return true;
  };
  var addEvent = function (target, name, callback, capture) {
    if (target.addEventListener) {
      target.addEventListener(name, callback, capture || false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + name, callback);
    }
  };
  var removeEvent = function (target, name, callback, capture) {
    if (target.removeEventListener) {
      target.removeEventListener(name, callback, capture || false);
    } else if (target.detachEvent) {
      target.detachEvent('on' + name, callback);
    }
  };
  var getTargetFromShadowDom = function (event, defaultTarget) {
    var path, target = defaultTarget;
    path = event.path;
    if (path && path.length > 0) {
      target = path[0];
    }
    if (event.deepPath) {
      path = event.deepPath();
      if (path && path.length > 0) {
        target = path[0];
      }
    }
    return target;
  };
  var fix = function (originalEvent, data) {
    var name, event = data || {}, undef;
    for (name in originalEvent) {
      if (!deprecated[name]) {
        event[name] = originalEvent[name];
      }
    }
    if (!event.target) {
      event.target = event.srcElement || document;
    }
    if ($_dtgtsy9jc7tm6gs.experimentalShadowDom) {
      event.target = getTargetFromShadowDom(originalEvent, event.target);
    }
    if (originalEvent && mouseEventRe.test(originalEvent.type) && originalEvent.pageX === undef && originalEvent.clientX !== undef) {
      var eventDoc = event.target.ownerDocument || document;
      var doc = eventDoc.documentElement;
      var body = eventDoc.body;
      event.pageX = originalEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = originalEvent.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }
    event.preventDefault = function () {
      event.isDefaultPrevented = returnTrue;
      if (originalEvent) {
        if (originalEvent.preventDefault) {
          originalEvent.preventDefault();
        } else {
          originalEvent.returnValue = false;
        }
      }
    };
    event.stopPropagation = function () {
      event.isPropagationStopped = returnTrue;
      if (originalEvent) {
        if (originalEvent.stopPropagation) {
          originalEvent.stopPropagation();
        } else {
          originalEvent.cancelBubble = true;
        }
      }
    };
    event.stopImmediatePropagation = function () {
      event.isImmediatePropagationStopped = returnTrue;
      event.stopPropagation();
    };
    if (hasIsDefaultPrevented(event) === false) {
      event.isDefaultPrevented = returnFalse;
      event.isPropagationStopped = returnFalse;
      event.isImmediatePropagationStopped = returnFalse;
    }
    if (typeof event.metaKey == 'undefined') {
      event.metaKey = false;
    }
    return event;
  };
  var bindOnReady = function (win, callback, eventUtils) {
    var doc = win.document, event = { type: 'ready' };
    if (eventUtils.domLoaded) {
      callback(event);
      return;
    }
    var isDocReady = function () {
      return doc.readyState === 'complete' || doc.readyState === 'interactive' && doc.body;
    };
    var readyHandler = function () {
      if (!eventUtils.domLoaded) {
        eventUtils.domLoaded = true;
        callback(event);
      }
    };
    var waitForDomLoaded = function () {
      if (isDocReady()) {
        removeEvent(doc, 'readystatechange', waitForDomLoaded);
        readyHandler();
      }
    };
    var tryScroll = function () {
      try {
        doc.documentElement.doScroll('left');
      } catch (ex) {
        $_9jpiwcgjc7tm6kr.setTimeout(tryScroll);
        return;
      }
      readyHandler();
    };
    if (doc.addEventListener && !($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 11)) {
      if (isDocReady()) {
        readyHandler();
      } else {
        addEvent(win, 'DOMContentLoaded', readyHandler);
      }
    } else {
      addEvent(doc, 'readystatechange', waitForDomLoaded);
      if (doc.documentElement.doScroll && win.self === win.top) {
        tryScroll();
      }
    }
    addEvent(win, 'load', readyHandler);
  };
  var EventUtils = function () {
    var self = this, events = {}, count, expando, hasFocusIn, hasMouseEnterLeave, mouseEnterLeave;
    expando = eventExpandoPrefix + (+new Date()).toString(32);
    hasMouseEnterLeave = 'onmouseenter' in document.documentElement;
    hasFocusIn = 'onfocusin' in document.documentElement;
    mouseEnterLeave = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    };
    count = 1;
    self.domLoaded = false;
    self.events = events;
    var executeHandlers = function (evt, id) {
      var callbackList, i, l, callback, container = events[id];
      callbackList = container && container[evt.type];
      if (callbackList) {
        for (i = 0, l = callbackList.length; i < l; i++) {
          callback = callbackList[i];
          if (callback && callback.func.call(callback.scope, evt) === false) {
            evt.preventDefault();
          }
          if (evt.isImmediatePropagationStopped()) {
            return;
          }
        }
      }
    };
    self.bind = function (target, names, callback, scope) {
      var id, callbackList, i, name, fakeName, nativeHandler, capture, win = window;
      var defaultNativeHandler = function (evt) {
        executeHandlers(fix(evt || win.event), id);
      };
      if (!target || target.nodeType === 3 || target.nodeType === 8) {
        return;
      }
      if (!target[expando]) {
        id = count++;
        target[expando] = id;
        events[id] = {};
      } else {
        id = target[expando];
      }
      scope = scope || target;
      names = names.split(' ');
      i = names.length;
      while (i--) {
        name = names[i];
        nativeHandler = defaultNativeHandler;
        fakeName = capture = false;
        if (name === 'DOMContentLoaded') {
          name = 'ready';
        }
        if (self.domLoaded && name === 'ready' && target.readyState == 'complete') {
          callback.call(scope, fix({ type: name }));
          continue;
        }
        if (!hasMouseEnterLeave) {
          fakeName = mouseEnterLeave[name];
          if (fakeName) {
            nativeHandler = function (evt) {
              var current, related;
              current = evt.currentTarget;
              related = evt.relatedTarget;
              if (related && current.contains) {
                related = current.contains(related);
              } else {
                while (related && related !== current) {
                  related = related.parentNode;
                }
              }
              if (!related) {
                evt = fix(evt || win.event);
                evt.type = evt.type === 'mouseout' ? 'mouseleave' : 'mouseenter';
                evt.target = current;
                executeHandlers(evt, id);
              }
            };
          }
        }
        if (!hasFocusIn && (name === 'focusin' || name === 'focusout')) {
          capture = true;
          fakeName = name === 'focusin' ? 'focus' : 'blur';
          nativeHandler = function (evt) {
            evt = fix(evt || win.event);
            evt.type = evt.type === 'focus' ? 'focusin' : 'focusout';
            executeHandlers(evt, id);
          };
        }
        callbackList = events[id][name];
        if (!callbackList) {
          events[id][name] = callbackList = [{
              func: callback,
              scope: scope
            }];
          callbackList.fakeName = fakeName;
          callbackList.capture = capture;
          callbackList.nativeHandler = nativeHandler;
          if (name === 'ready') {
            bindOnReady(target, nativeHandler, self);
          } else {
            addEvent(target, fakeName || name, nativeHandler, capture);
          }
        } else {
          if (name === 'ready' && self.domLoaded) {
            callback({ type: name });
          } else {
            callbackList.push({
              func: callback,
              scope: scope
            });
          }
        }
      }
      target = callbackList = 0;
      return callback;
    };
    self.unbind = function (target, names, callback) {
      var id, callbackList, i, ci, name, eventMap;
      if (!target || target.nodeType === 3 || target.nodeType === 8) {
        return self;
      }
      id = target[expando];
      if (id) {
        eventMap = events[id];
        if (names) {
          names = names.split(' ');
          i = names.length;
          while (i--) {
            name = names[i];
            callbackList = eventMap[name];
            if (callbackList) {
              if (callback) {
                ci = callbackList.length;
                while (ci--) {
                  if (callbackList[ci].func === callback) {
                    var nativeHandler = callbackList.nativeHandler;
                    var fakeName = callbackList.fakeName, capture = callbackList.capture;
                    callbackList = callbackList.slice(0, ci).concat(callbackList.slice(ci + 1));
                    callbackList.nativeHandler = nativeHandler;
                    callbackList.fakeName = fakeName;
                    callbackList.capture = capture;
                    eventMap[name] = callbackList;
                  }
                }
              }
              if (!callback || callbackList.length === 0) {
                delete eventMap[name];
                removeEvent(target, callbackList.fakeName || name, callbackList.nativeHandler, callbackList.capture);
              }
            }
          }
        } else {
          for (name in eventMap) {
            callbackList = eventMap[name];
            removeEvent(target, callbackList.fakeName || name, callbackList.nativeHandler, callbackList.capture);
          }
          eventMap = {};
        }
        for (name in eventMap) {
          return self;
        }
        delete events[id];
        try {
          delete target[expando];
        } catch (ex) {
          target[expando] = null;
        }
      }
      return self;
    };
    self.fire = function (target, name, args) {
      var id;
      if (!target || target.nodeType === 3 || target.nodeType === 8) {
        return self;
      }
      args = fix(null, args);
      args.type = name;
      args.target = target;
      do {
        id = target[expando];
        if (id) {
          executeHandlers(args, id);
        }
        target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow;
      } while (target && !args.isPropagationStopped());
      return self;
    };
    self.clean = function (target) {
      var i, children, unbind = self.unbind;
      if (!target || target.nodeType === 3 || target.nodeType === 8) {
        return self;
      }
      if (target[expando]) {
        unbind(target);
      }
      if (!target.getElementsByTagName) {
        target = target.document;
      }
      if (target && target.getElementsByTagName) {
        unbind(target);
        children = target.getElementsByTagName('*');
        i = children.length;
        while (i--) {
          target = children[i];
          if (target[expando]) {
            unbind(target);
          }
        }
      }
      return self;
    };
    self.destroy = function () {
      events = {};
    };
    self.cancel = function (e) {
      if (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      return false;
    };
  };
  EventUtils.Event = new EventUtils();
  EventUtils.Event.bind(window, 'ready', function () {
  });

  var i;
  var support;
  var Expr;
  var getText;
  var isXML;
  var tokenize;
  var compile;
  var select;
  var outermostContext;
  var sortInput;
  var hasDuplicate;
  var setDocument;
  var document$1;
  var docElem;
  var documentIsHTML;
  var rbuggyQSA;
  var rbuggyMatches;
  var matches;
  var contains$1;
  var expando = 'sizzle' + -new Date();
  var preferredDoc = window.document;
  var dirruns = 0;
  var done = 0;
  var classCache = createCache();
  var tokenCache = createCache();
  var compilerCache = createCache();
  var sortOrder = function (a, b) {
      if (a === b) {
        hasDuplicate = true;
      }
      return 0;
    };
  var strundefined = typeof undefined;
  var MAX_NEGATIVE = 1 << 31;
  var hasOwn = {}.hasOwnProperty;
  var arr = [];
  var pop = arr.pop;
  var push_native = arr.push;
  var push$2 = arr.push;
  var slice$2 = arr.slice;
  var indexOf$1 = arr.indexOf || function (elem) {
      var i = 0, len = this.length;
      for (; i < len; i++) {
        if (this[i] === elem) {
          return i;
        }
      }
      return -1;
    };
  var booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped';
  var whitespace = '[\\x20\\t\\r\\n\\f]';
  var identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+';
  var attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace + '*([*^$|!~]?=)' + whitespace + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace + '*\\]';
  var pseudos = ':(' + identifier + ')(?:\\((' + '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' + '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' + '.*' + ')\\)|)';
  var rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g');
  var rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*');
  var rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*');
  var rattributeQuotes = new RegExp('=' + whitespace + '*([^\\]\'"]*?)' + whitespace + '*\\]', 'g');
  var rpseudo = new RegExp(pseudos);
  var ridentifier = new RegExp('^' + identifier + '$');
  var matchExpr = {
      'ID': new RegExp('^#(' + identifier + ')'),
      'CLASS': new RegExp('^\\.(' + identifier + ')'),
      'TAG': new RegExp('^(' + identifier + '|[*])'),
      'ATTR': new RegExp('^' + attributes),
      'PSEUDO': new RegExp('^' + pseudos),
      'CHILD': new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
      'bool': new RegExp('^(?:' + booleans + ')$', 'i'),
      'needsContext': new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
    };
  var rinputs = /^(?:input|select|textarea|button)$/i;
  var rheader = /^h\d$/i;
  var rnative = /^[^{]+\{\s*\[native \w/;
  var rquickExpr$1 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
  var rsibling = /[+~]/;
  var rescape = /'|\\/g;
  var runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig');
  var funescape = function (_, escaped, escapedWhitespace) {
      var high = '0x' + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
    };
  try {
    push$2.apply(arr = slice$2.call(preferredDoc.childNodes), preferredDoc.childNodes);
    arr[preferredDoc.childNodes.length].nodeType;
  } catch (e) {
    push$2 = {
      apply: arr.length ? function (target, els) {
        push_native.apply(target, slice$2.call(els));
      } : function (target, els) {
        var j = target.length, i = 0;
        while (target[j++] = els[i++]) {
        }
        target.length = j - 1;
      }
    };
  }
  var Sizzle = function (selector, context, results, seed) {
    var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
    if ((context ? context.ownerDocument || context : preferredDoc) !== document$1) {
      setDocument(context);
    }
    context = context || document$1;
    results = results || [];
    if (!selector || typeof selector !== 'string') {
      return results;
    }
    if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
      return [];
    }
    if (documentIsHTML && !seed) {
      if (match = rquickExpr$1.exec(selector)) {
        if (m = match[1]) {
          if (nodeType === 9) {
            elem = context.getElementById(m);
            if (elem && elem.parentNode) {
              if (elem.id === m) {
                results.push(elem);
                return results;
              }
            } else {
              return results;
            }
          } else {
            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains$1(context, elem) && elem.id === m) {
              results.push(elem);
              return results;
            }
          }
        } else if (match[2]) {
          push$2.apply(results, context.getElementsByTagName(selector));
          return results;
        } else if ((m = match[3]) && support.getElementsByClassName) {
          push$2.apply(results, context.getElementsByClassName(m));
          return results;
        }
      }
      if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
        nid = old = expando;
        newContext = context;
        newSelector = nodeType === 9 && selector;
        if (nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
          groups = tokenize(selector);
          if (old = context.getAttribute('id')) {
            nid = old.replace(rescape, '\\$&');
          } else {
            context.setAttribute('id', nid);
          }
          nid = '[id=\'' + nid + '\'] ';
          i = groups.length;
          while (i--) {
            groups[i] = nid + toSelector(groups[i]);
          }
          newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
          newSelector = groups.join(',');
        }
        if (newSelector) {
          try {
            push$2.apply(results, newContext.querySelectorAll(newSelector));
            return results;
          } catch (qsaError) {
          } finally {
            if (!old) {
              context.removeAttribute('id');
            }
          }
        }
      }
    }
    return select(selector.replace(rtrim, '$1'), context, results, seed);
  };
  function createCache() {
    var keys = [];
    function cache(key, value) {
      if (keys.push(key + ' ') > Expr.cacheLength) {
        delete cache[keys.shift()];
      }
      return cache[key + ' '] = value;
    }
    return cache;
  }
  function markFunction(fn) {
    fn[expando] = true;
    return fn;
  }
  function siblingCheck(a, b) {
    var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
    if (diff) {
      return diff;
    }
    if (cur) {
      while (cur = cur.nextSibling) {
        if (cur === b) {
          return -1;
        }
      }
    }
    return a ? 1 : -1;
  }
  function createInputPseudo(type) {
    return function (elem) {
      var name = elem.nodeName.toLowerCase();
      return name === 'input' && elem.type === type;
    };
  }
  function createButtonPseudo(type) {
    return function (elem) {
      var name = elem.nodeName.toLowerCase();
      return (name === 'input' || name === 'button') && elem.type === type;
    };
  }
  function createPositionalPseudo(fn) {
    return markFunction(function (argument) {
      argument = +argument;
      return markFunction(function (seed, matches) {
        var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
        while (i--) {
          if (seed[j = matchIndexes[i]]) {
            seed[j] = !(matches[j] = seed[j]);
          }
        }
      });
    });
  }
  function testContext(context) {
    return context && typeof context.getElementsByTagName !== strundefined && context;
  }
  support = Sizzle.support = {};
  isXML = Sizzle.isXML = function (elem) {
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== 'HTML' : false;
  };
  setDocument = Sizzle.setDocument = function (node) {
    var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
    function getTop(win) {
      try {
        return win.top;
      } catch (ex) {
      }
      return null;
    }
    if (doc === document$1 || doc.nodeType !== 9 || !doc.documentElement) {
      return document$1;
    }
    document$1 = doc;
    docElem = doc.documentElement;
    documentIsHTML = !isXML(doc);
    if (parent && parent !== getTop(parent)) {
      if (parent.addEventListener) {
        parent.addEventListener('unload', function () {
          setDocument();
        }, false);
      } else if (parent.attachEvent) {
        parent.attachEvent('onunload', function () {
          setDocument();
        });
      }
    }
    support.attributes = true;
    support.getElementsByTagName = true;
    support.getElementsByClassName = rnative.test(doc.getElementsByClassName);
    support.getById = true;
    Expr.find['ID'] = function (id, context) {
      if (typeof context.getElementById !== strundefined && documentIsHTML) {
        var m = context.getElementById(id);
        return m && m.parentNode ? [m] : [];
      }
    };
    Expr.filter['ID'] = function (id) {
      var attrId = id.replace(runescape, funescape);
      return function (elem) {
        return elem.getAttribute('id') === attrId;
      };
    };
    Expr.find['TAG'] = support.getElementsByTagName ? function (tag, context) {
      if (typeof context.getElementsByTagName !== strundefined) {
        return context.getElementsByTagName(tag);
      }
    } : function (tag, context) {
      var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
      if (tag === '*') {
        while (elem = results[i++]) {
          if (elem.nodeType === 1) {
            tmp.push(elem);
          }
        }
        return tmp;
      }
      return results;
    };
    Expr.find['CLASS'] = support.getElementsByClassName && function (className, context) {
      if (documentIsHTML) {
        return context.getElementsByClassName(className);
      }
    };
    rbuggyMatches = [];
    rbuggyQSA = [];
    support.disconnectedMatch = true;
    rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));
    hasCompare = rnative.test(docElem.compareDocumentPosition);
    contains$1 = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
      var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
      return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
    } : function (a, b) {
      if (b) {
        while (b = b.parentNode) {
          if (b === a) {
            return true;
          }
        }
      }
      return false;
    };
    sortOrder = hasCompare ? function (a, b) {
      if (a === b) {
        hasDuplicate = true;
        return 0;
      }
      var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
      if (compare) {
        return compare;
      }
      compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
      if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
        if (a === doc || a.ownerDocument === preferredDoc && contains$1(preferredDoc, a)) {
          return -1;
        }
        if (b === doc || b.ownerDocument === preferredDoc && contains$1(preferredDoc, b)) {
          return 1;
        }
        return sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0;
      }
      return compare & 4 ? -1 : 1;
    } : function (a, b) {
      if (a === b) {
        hasDuplicate = true;
        return 0;
      }
      var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
      if (!aup || !bup) {
        return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf$1.call(sortInput, a) - indexOf$1.call(sortInput, b) : 0;
      } else if (aup === bup) {
        return siblingCheck(a, b);
      }
      cur = a;
      while (cur = cur.parentNode) {
        ap.unshift(cur);
      }
      cur = b;
      while (cur = cur.parentNode) {
        bp.unshift(cur);
      }
      while (ap[i] === bp[i]) {
        i++;
      }
      return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
    };
    return doc;
  };
  Sizzle.matches = function (expr, elements) {
    return Sizzle(expr, null, null, elements);
  };
  Sizzle.matchesSelector = function (elem, expr) {
    if ((elem.ownerDocument || elem) !== document$1) {
      setDocument(elem);
    }
    expr = expr.replace(rattributeQuotes, '=\'$1\']');
    if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
      try {
        var ret = matches.call(elem, expr);
        if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
          return ret;
        }
      } catch (e) {
      }
    }
    return Sizzle(expr, document$1, null, [elem]).length > 0;
  };
  Sizzle.contains = function (context, elem) {
    if ((context.ownerDocument || context) !== document$1) {
      setDocument(context);
    }
    return contains$1(context, elem);
  };
  Sizzle.attr = function (elem, name) {
    if ((elem.ownerDocument || elem) !== document$1) {
      setDocument(elem);
    }
    var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
    return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
  };
  Sizzle.error = function (msg) {
    throw new Error('Syntax error, unrecognized expression: ' + msg);
  };
  Sizzle.uniqueSort = function (results) {
    var elem, duplicates = [], j = 0, i = 0;
    hasDuplicate = !support.detectDuplicates;
    sortInput = !support.sortStable && results.slice(0);
    results.sort(sortOrder);
    if (hasDuplicate) {
      while (elem = results[i++]) {
        if (elem === results[i]) {
          j = duplicates.push(i);
        }
      }
      while (j--) {
        results.splice(duplicates[j], 1);
      }
    }
    sortInput = null;
    return results;
  };
  getText = Sizzle.getText = function (elem) {
    var node, ret = '', i = 0, nodeType = elem.nodeType;
    if (!nodeType) {
      while (node = elem[i++]) {
        ret += getText(node);
      }
    } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
      if (typeof elem.textContent === 'string') {
        return elem.textContent;
      } else {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += getText(elem);
        }
      }
    } else if (nodeType === 3 || nodeType === 4) {
      return elem.nodeValue;
    }
    return ret;
  };
  Expr = Sizzle.selectors = {
    cacheLength: 50,
    createPseudo: markFunction,
    match: matchExpr,
    attrHandle: {},
    find: {},
    relative: {
      '>': {
        dir: 'parentNode',
        first: true
      },
      ' ': { dir: 'parentNode' },
      '+': {
        dir: 'previousSibling',
        first: true
      },
      '~': { dir: 'previousSibling' }
    },
    preFilter: {
      'ATTR': function (match) {
        match[1] = match[1].replace(runescape, funescape);
        match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape);
        if (match[2] === '~=') {
          match[3] = ' ' + match[3] + ' ';
        }
        return match.slice(0, 4);
      },
      'CHILD': function (match) {
        match[1] = match[1].toLowerCase();
        if (match[1].slice(0, 3) === 'nth') {
          if (!match[3]) {
            Sizzle.error(match[0]);
          }
          match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'));
          match[5] = +(match[7] + match[8] || match[3] === 'odd');
        } else if (match[3]) {
          Sizzle.error(match[0]);
        }
        return match;
      },
      'PSEUDO': function (match) {
        var excess, unquoted = !match[6] && match[2];
        if (matchExpr['CHILD'].test(match[0])) {
          return null;
        }
        if (match[3]) {
          match[2] = match[4] || match[5] || '';
        } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
          match[0] = match[0].slice(0, excess);
          match[2] = unquoted.slice(0, excess);
        }
        return match.slice(0, 3);
      }
    },
    filter: {
      'TAG': function (nodeNameSelector) {
        var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
        return nodeNameSelector === '*' ? function () {
          return true;
        } : function (elem) {
          return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
        };
      },
      'CLASS': function (className) {
        var pattern = classCache[className + ' '];
        return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
          return pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || '');
        });
      },
      'ATTR': function (name, operator, check) {
        return function (elem) {
          var result = Sizzle.attr(elem, name);
          if (result == null) {
            return operator === '!=';
          }
          if (!operator) {
            return true;
          }
          result += '';
          return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (' ' + result + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-' : false;
        };
      },
      'CHILD': function (type, what, argument, first, last) {
        var simple = type.slice(0, 3) !== 'nth', forward = type.slice(-4) !== 'last', ofType = what === 'of-type';
        return first === 1 && last === 0 ? function (elem) {
          return !!elem.parentNode;
        } : function (elem, context, xml) {
          var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? 'nextSibling' : 'previousSibling', parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
          if (parent) {
            if (simple) {
              while (dir) {
                node = elem;
                while (node = node[dir]) {
                  if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                    return false;
                  }
                }
                start = dir = type === 'only' && !start && 'nextSibling';
              }
              return true;
            }
            start = [forward ? parent.firstChild : parent.lastChild];
            if (forward && useCache) {
              outerCache = parent[expando] || (parent[expando] = {});
              cache = outerCache[type] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = cache[0] === dirruns && cache[2];
              node = nodeIndex && parent.childNodes[nodeIndex];
              while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                if (node.nodeType === 1 && ++diff && node === elem) {
                  outerCache[type] = [
                    dirruns,
                    nodeIndex,
                    diff
                  ];
                  break;
                }
              }
            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
              diff = cache[1];
            } else {
              while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                  if (useCache) {
                    (node[expando] || (node[expando] = {}))[type] = [
                      dirruns,
                      diff
                    ];
                  }
                  if (node === elem) {
                    break;
                  }
                }
              }
            }
            diff -= last;
            return diff === first || diff % first === 0 && diff / first >= 0;
          }
        };
      },
      'PSEUDO': function (pseudo, argument) {
        var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error('unsupported pseudo: ' + pseudo);
        if (fn[expando]) {
          return fn(argument);
        }
        if (fn.length > 1) {
          args = [
            pseudo,
            pseudo,
            '',
            argument
          ];
          return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
            var idx, matched = fn(seed, argument), i = matched.length;
            while (i--) {
              idx = indexOf$1.call(seed, matched[i]);
              seed[idx] = !(matches[idx] = matched[i]);
            }
          }) : function (elem) {
            return fn(elem, 0, args);
          };
        }
        return fn;
      }
    },
    pseudos: {
      'not': markFunction(function (selector) {
        var input = [], results = [], matcher = compile(selector.replace(rtrim, '$1'));
        return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
          var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
          while (i--) {
            if (elem = unmatched[i]) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) : function (elem, context, xml) {
          input[0] = elem;
          matcher(input, null, xml, results);
          return !results.pop();
        };
      }),
      'has': markFunction(function (selector) {
        return function (elem) {
          return Sizzle(selector, elem).length > 0;
        };
      }),
      'contains': markFunction(function (text) {
        text = text.replace(runescape, funescape);
        return function (elem) {
          return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
        };
      }),
      'lang': markFunction(function (lang) {
        if (!ridentifier.test(lang || '')) {
          Sizzle.error('unsupported lang: ' + lang);
        }
        lang = lang.replace(runescape, funescape).toLowerCase();
        return function (elem) {
          var elemLang;
          do {
            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute('xml:lang') || elem.getAttribute('lang')) {
              elemLang = elemLang.toLowerCase();
              return elemLang === lang || elemLang.indexOf(lang + '-') === 0;
            }
          } while ((elem = elem.parentNode) && elem.nodeType === 1);
          return false;
        };
      }),
      'target': function (elem) {
        var hash = window.location && window.location.hash;
        return hash && hash.slice(1) === elem.id;
      },
      'root': function (elem) {
        return elem === docElem;
      },
      'focus': function (elem) {
        return elem === document$1.activeElement && (!document$1.hasFocus || document$1.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
      },
      'enabled': function (elem) {
        return elem.disabled === false;
      },
      'disabled': function (elem) {
        return elem.disabled === true;
      },
      'checked': function (elem) {
        var nodeName = elem.nodeName.toLowerCase();
        return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
      },
      'selected': function (elem) {
        if (elem.parentNode) {
          elem.parentNode.selectedIndex;
        }
        return elem.selected === true;
      },
      'empty': function (elem) {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          if (elem.nodeType < 6) {
            return false;
          }
        }
        return true;
      },
      'parent': function (elem) {
        return !Expr.pseudos['empty'](elem);
      },
      'header': function (elem) {
        return rheader.test(elem.nodeName);
      },
      'input': function (elem) {
        return rinputs.test(elem.nodeName);
      },
      'button': function (elem) {
        var name = elem.nodeName.toLowerCase();
        return name === 'input' && elem.type === 'button' || name === 'button';
      },
      'text': function (elem) {
        var attr;
        return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text');
      },
      'first': createPositionalPseudo(function () {
        return [0];
      }),
      'last': createPositionalPseudo(function (matchIndexes, length) {
        return [length - 1];
      }),
      'eq': createPositionalPseudo(function (matchIndexes, length, argument) {
        return [argument < 0 ? argument + length : argument];
      }),
      'even': createPositionalPseudo(function (matchIndexes, length) {
        var i = 0;
        for (; i < length; i += 2) {
          matchIndexes.push(i);
        }
        return matchIndexes;
      }),
      'odd': createPositionalPseudo(function (matchIndexes, length) {
        var i = 1;
        for (; i < length; i += 2) {
          matchIndexes.push(i);
        }
        return matchIndexes;
      }),
      'lt': createPositionalPseudo(function (matchIndexes, length, argument) {
        var i = argument < 0 ? argument + length : argument;
        for (; --i >= 0;) {
          matchIndexes.push(i);
        }
        return matchIndexes;
      }),
      'gt': createPositionalPseudo(function (matchIndexes, length, argument) {
        var i = argument < 0 ? argument + length : argument;
        for (; ++i < length;) {
          matchIndexes.push(i);
        }
        return matchIndexes;
      })
    }
  };
  Expr.pseudos['nth'] = Expr.pseudos['eq'];
  for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
    Expr.pseudos[i] = createInputPseudo(i);
  }
  for (i in {
      submit: true,
      reset: true
    }) {
    Expr.pseudos[i] = createButtonPseudo(i);
  }
  function setFilters() {
  }
  setFilters.prototype = Expr.filters = Expr.pseudos;
  Expr.setFilters = new setFilters();
  tokenize = Sizzle.tokenize = function (selector, parseOnly) {
    var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + ' '];
    if (cached) {
      return parseOnly ? 0 : cached.slice(0);
    }
    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;
    while (soFar) {
      if (!matched || (match = rcomma.exec(soFar))) {
        if (match) {
          soFar = soFar.slice(match[0].length) || soFar;
        }
        groups.push(tokens = []);
      }
      matched = false;
      if (match = rcombinators.exec(soFar)) {
        matched = match.shift();
        tokens.push({
          value: matched,
          type: match[0].replace(rtrim, ' ')
        });
        soFar = soFar.slice(matched.length);
      }
      for (type in Expr.filter) {
        if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: type,
            matches: match
          });
          soFar = soFar.slice(matched.length);
        }
      }
      if (!matched) {
        break;
      }
    }
    return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
  };
  function toSelector(tokens) {
    var i = 0, len = tokens.length, selector = '';
    for (; i < len; i++) {
      selector += tokens[i].value;
    }
    return selector;
  }
  function addCombinator(matcher, combinator, base) {
    var dir = combinator.dir, checkNonElements = base && dir === 'parentNode', doneName = done++;
    return combinator.first ? function (elem, context, xml) {
      while (elem = elem[dir]) {
        if (elem.nodeType === 1 || checkNonElements) {
          return matcher(elem, context, xml);
        }
      }
    } : function (elem, context, xml) {
      var oldCache, outerCache, newCache = [
          dirruns,
          doneName
        ];
      if (xml) {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            if (matcher(elem, context, xml)) {
              return true;
            }
          }
        }
      } else {
        while (elem = elem[dir]) {
          if (elem.nodeType === 1 || checkNonElements) {
            outerCache = elem[expando] || (elem[expando] = {});
            if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
              return newCache[2] = oldCache[2];
            } else {
              outerCache[dir] = newCache;
              if (newCache[2] = matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        }
      }
    };
  }
  function elementMatcher(matchers) {
    return matchers.length > 1 ? function (elem, context, xml) {
      var i = matchers.length;
      while (i--) {
        if (!matchers[i](elem, context, xml)) {
          return false;
        }
      }
      return true;
    } : matchers[0];
  }
  function multipleContexts(selector, contexts, results) {
    var i = 0, len = contexts.length;
    for (; i < len; i++) {
      Sizzle(selector, contexts[i], results);
    }
    return results;
  }
  function condense(unmatched, map, filter, context, xml) {
    var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
    for (; i < len; i++) {
      if (elem = unmatched[i]) {
        if (!filter || filter(elem, context, xml)) {
          newUnmatched.push(elem);
          if (mapped) {
            map.push(i);
          }
        }
      }
    }
    return newUnmatched;
  }
  function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
    if (postFilter && !postFilter[expando]) {
      postFilter = setMatcher(postFilter);
    }
    if (postFinder && !postFinder[expando]) {
      postFinder = setMatcher(postFinder, postSelector);
    }
    return markFunction(function (seed, results, context, xml) {
      var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
      if (matcher) {
        matcher(matcherIn, matcherOut, context, xml);
      }
      if (postFilter) {
        temp = condense(matcherOut, postMap);
        postFilter(temp, [], context, xml);
        i = temp.length;
        while (i--) {
          if (elem = temp[i]) {
            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
          }
        }
      }
      if (seed) {
        if (postFinder || preFilter) {
          if (postFinder) {
            temp = [];
            i = matcherOut.length;
            while (i--) {
              if (elem = matcherOut[i]) {
                temp.push(matcherIn[i] = elem);
              }
            }
            postFinder(null, matcherOut = [], temp, xml);
          }
          i = matcherOut.length;
          while (i--) {
            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf$1.call(seed, elem) : preMap[i]) > -1) {
              seed[temp] = !(results[temp] = elem);
            }
          }
        }
      } else {
        matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
        if (postFinder) {
          postFinder(null, results, matcherOut, xml);
        } else {
          push$2.apply(results, matcherOut);
        }
      }
    });
  }
  function matcherFromTokens(tokens) {
    var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function (elem) {
        return elem === checkContext;
      }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
        return indexOf$1.call(checkContext, elem) > -1;
      }, implicitRelative, true), matchers = [function (elem, context, xml) {
          return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
        }];
    for (; i < len; i++) {
      if (matcher = Expr.relative[tokens[i].type]) {
        matchers = [addCombinator(elementMatcher(matchers), matcher)];
      } else {
        matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
        if (matcher[expando]) {
          j = ++i;
          for (; j < len; j++) {
            if (Expr.relative[tokens[j].type]) {
              break;
            }
          }
          return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
        }
        matchers.push(matcher);
      }
    }
    return elementMatcher(matchers);
  }
  function matcherFromGroupMatchers(elementMatchers, setMatchers) {
    var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, outermost) {
        var elem, j, matcher, matchedCount = 0, i = '0', unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find['TAG']('*', outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
        if (outermost) {
          outermostContext = context !== document$1 && context;
        }
        for (; i !== len && (elem = elems[i]) != null; i++) {
          if (byElement && elem) {
            j = 0;
            while (matcher = elementMatchers[j++]) {
              if (matcher(elem, context, xml)) {
                results.push(elem);
                break;
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (seed) {
              unmatched.push(elem);
            }
          }
        }
        matchedCount += i;
        if (bySet && i !== matchedCount) {
          j = 0;
          while (matcher = setMatchers[j++]) {
            matcher(unmatched, setMatched, context, xml);
          }
          if (seed) {
            if (matchedCount > 0) {
              while (i--) {
                if (!(unmatched[i] || setMatched[i])) {
                  setMatched[i] = pop.call(results);
                }
              }
            }
            setMatched = condense(setMatched);
          }
          push$2.apply(results, setMatched);
          if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
            Sizzle.uniqueSort(results);
          }
        }
        if (outermost) {
          dirruns = dirrunsUnique;
          outermostContext = contextBackup;
        }
        return unmatched;
      };
    return bySet ? markFunction(superMatcher) : superMatcher;
  }
  compile = Sizzle.compile = function (selector, match) {
    var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + ' '];
    if (!cached) {
      if (!match) {
        match = tokenize(selector);
      }
      i = match.length;
      while (i--) {
        cached = matcherFromTokens(match[i]);
        if (cached[expando]) {
          setMatchers.push(cached);
        } else {
          elementMatchers.push(cached);
        }
      }
      cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
      cached.selector = selector;
    }
    return cached;
  };
  select = Sizzle.select = function (selector, context, results, seed) {
    var i, tokens, token, type, find, compiled = typeof selector === 'function' && selector, match = !seed && tokenize(selector = compiled.selector || selector);
    results = results || [];
    if (match.length === 1) {
      tokens = match[0] = match[0].slice(0);
      if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
        context = (Expr.find['ID'](token.matches[0].replace(runescape, funescape), context) || [])[0];
        if (!context) {
          return results;
        } else if (compiled) {
          context = context.parentNode;
        }
        selector = selector.slice(tokens.shift().value.length);
      }
      i = matchExpr['needsContext'].test(selector) ? 0 : tokens.length;
      while (i--) {
        token = tokens[i];
        if (Expr.relative[type = token.type]) {
          break;
        }
        if (find = Expr.find[type]) {
          if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
            tokens.splice(i, 1);
            selector = seed.length && toSelector(tokens);
            if (!selector) {
              push$2.apply(results, seed);
              return results;
            }
            break;
          }
        }
      }
    }
    (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
    return results;
  };
  support.sortStable = expando.split('').sort(sortOrder).join('') === expando;
  support.detectDuplicates = !!hasDuplicate;
  setDocument();
  support.sortDetached = true;

  var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
  var toArray = function (obj) {
    var array = obj, i, l;
    if (!isArray(obj)) {
      array = [];
      for (i = 0, l = obj.length; i < l; i++) {
        array[i] = obj[i];
      }
    }
    return array;
  };
  var each$5 = function (o, cb, s) {
    var n, l;
    if (!o) {
      return 0;
    }
    s = s || o;
    if (o.length !== undefined) {
      for (n = 0, l = o.length; n < l; n++) {
        if (cb.call(s, o[n], n, o) === false) {
          return 0;
        }
      }
    } else {
      for (n in o) {
        if (o.hasOwnProperty(n)) {
          if (cb.call(s, o[n], n, o) === false) {
            return 0;
          }
        }
      }
    }
    return 1;
  };
  var map$1 = function (array, callback) {
    var out = [];
    each$5(array, function (item, index) {
      out.push(callback(item, index, array));
    });
    return out;
  };
  var filter$1 = function (a, f) {
    var o = [];
    each$5(a, function (v, index) {
      if (!f || f(v, index, a)) {
        o.push(v);
      }
    });
    return o;
  };
  var indexOf$2 = function (a, v) {
    var i, l;
    if (a) {
      for (i = 0, l = a.length; i < l; i++) {
        if (a[i] === v) {
          return i;
        }
      }
    }
    return -1;
  };
  var reduce = function (collection, iteratee, accumulator, thisArg) {
    var i = 0;
    if (arguments.length < 3) {
      accumulator = collection[0];
    }
    for (; i < collection.length; i++) {
      accumulator = iteratee.call(thisArg, accumulator, collection[i], i);
    }
    return accumulator;
  };
  var findIndex$1 = function (array, predicate, thisArg) {
    var i, l;
    for (i = 0, l = array.length; i < l; i++) {
      if (predicate.call(thisArg, array[i], i, array)) {
        return i;
      }
    }
    return -1;
  };
  var find$1 = function (array, predicate, thisArg) {
    var idx = findIndex$1(array, predicate, thisArg);
    if (idx !== -1) {
      return array[idx];
    }
    return undefined;
  };
  var last$1 = function (collection) {
    return collection[collection.length - 1];
  };
  var $_gf68zqkjc7tm6r7 = {
    isArray: isArray,
    toArray: toArray,
    each: each$5,
    map: map$1,
    filter: filter$1,
    indexOf: indexOf$2,
    reduce: reduce,
    findIndex: findIndex$1,
    find: find$1,
    last: last$1
  };

  var whiteSpaceRegExp$2 = /^\s*|\s*$/g;
  var trim$1 = function (str) {
    return str === null || str === undefined ? '' : ('' + str).replace(whiteSpaceRegExp$2, '');
  };
  var is$1 = function (obj, type) {
    if (!type) {
      return obj !== undefined;
    }
    if (type == 'array' && $_gf68zqkjc7tm6r7.isArray(obj)) {
      return true;
    }
    return typeof obj == type;
  };
  var makeMap = function (items, delim, map) {
    var i;
    items = items || [];
    delim = delim || ',';
    if (typeof items == 'string') {
      items = items.split(delim);
    }
    map = map || {};
    i = items.length;
    while (i--) {
      map[items[i]] = {};
    }
    return map;
  };
  var hasOwnProperty = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  var create = function (s, p, root) {
    var self = this, sp, ns, cn, scn, c, de = 0;
    s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s);
    cn = s[3].match(/(^|\.)(\w+)$/i)[2];
    ns = self.createNS(s[3].replace(/\.\w+$/, ''), root);
    if (ns[cn]) {
      return;
    }
    if (s[2] == 'static') {
      ns[cn] = p;
      if (this.onCreate) {
        this.onCreate(s[2], s[3], ns[cn]);
      }
      return;
    }
    if (!p[cn]) {
      p[cn] = function () {
      };
      de = 1;
    }
    ns[cn] = p[cn];
    self.extend(ns[cn].prototype, p);
    if (s[5]) {
      sp = self.resolve(s[5]).prototype;
      scn = s[5].match(/\.(\w+)$/i)[1];
      c = ns[cn];
      if (de) {
        ns[cn] = function () {
          return sp[scn].apply(this, arguments);
        };
      } else {
        ns[cn] = function () {
          this.parent = sp[scn];
          return c.apply(this, arguments);
        };
      }
      ns[cn].prototype[cn] = ns[cn];
      self.each(sp, function (f, n) {
        ns[cn].prototype[n] = sp[n];
      });
      self.each(p, function (f, n) {
        if (sp[n]) {
          ns[cn].prototype[n] = function () {
            this.parent = sp[n];
            return f.apply(this, arguments);
          };
        } else {
          if (n != cn) {
            ns[cn].prototype[n] = f;
          }
        }
      });
    }
    self.each(p['static'], function (f, n) {
      ns[cn][n] = f;
    });
  };
  var extend = function (obj, ext) {
    var x = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      x[_i - 2] = arguments[_i];
    }
    var i, l, name, args = arguments, value;
    for (i = 1, l = args.length; i < l; i++) {
      ext = args[i];
      for (name in ext) {
        if (ext.hasOwnProperty(name)) {
          value = ext[name];
          if (value !== undefined) {
            obj[name] = value;
          }
        }
      }
    }
    return obj;
  };
  var walk = function (o, f, n, s) {
    s = s || this;
    if (o) {
      if (n) {
        o = o[n];
      }
      $_gf68zqkjc7tm6r7.each(o, function (o, i) {
        if (f.call(s, o, i, n) === false) {
          return false;
        }
        walk(o, f, n, s);
      });
    }
  };
  var createNS = function (n, o) {
    var i, v;
    o = o || window;
    n = n.split('.');
    for (i = 0; i < n.length; i++) {
      v = n[i];
      if (!o[v]) {
        o[v] = {};
      }
      o = o[v];
    }
    return o;
  };
  var resolve$1 = function (n, o) {
    var i, l;
    o = o || window;
    n = n.split('.');
    for (i = 0, l = n.length; i < l; i++) {
      o = o[n[i]];
      if (!o) {
        break;
      }
    }
    return o;
  };
  var explode = function (s, d) {
    if (!s || is$1(s, 'array')) {
      return s;
    }
    return $_gf68zqkjc7tm6r7.map(s.split(d || ','), trim$1);
  };
  var _addCacheSuffix = function (url) {
    var cacheSuffix = $_dtgtsy9jc7tm6gs.cacheSuffix;
    if (cacheSuffix) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + cacheSuffix;
    }
    return url;
  };
  var $_b8tc32jjc7tm6qi = {
    trim: trim$1,
    isArray: $_gf68zqkjc7tm6r7.isArray,
    is: is$1,
    toArray: $_gf68zqkjc7tm6r7.toArray,
    makeMap: makeMap,
    each: $_gf68zqkjc7tm6r7.each,
    map: $_gf68zqkjc7tm6r7.map,
    grep: $_gf68zqkjc7tm6r7.filter,
    inArray: $_gf68zqkjc7tm6r7.indexOf,
    hasOwn: hasOwnProperty,
    extend: extend,
    create: create,
    walk: walk,
    createNS: createNS,
    resolve: resolve$1,
    explode: explode,
    _addCacheSuffix: _addCacheSuffix
  };

  var doc = document;
  var push$1 = Array.prototype.push;
  var slice$1 = Array.prototype.slice;
  var rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
  var Event = EventUtils.Event;
  var undef;
  var skipUniques = $_b8tc32jjc7tm6qi.makeMap('children,contents,next,prev');
  var isDefined = function (obj) {
    return typeof obj !== 'undefined';
  };
  var isString = function (obj) {
    return typeof obj === 'string';
  };
  var isWindow = function (obj) {
    return obj && obj == obj.window;
  };
  var createFragment = function (html, fragDoc) {
    var frag, node, container;
    fragDoc = fragDoc || doc;
    container = fragDoc.createElement('div');
    frag = fragDoc.createDocumentFragment();
    container.innerHTML = html;
    while (node = container.firstChild) {
      frag.appendChild(node);
    }
    return frag;
  };
  var domManipulate = function (targetNodes, sourceItem, callback, reverse) {
    var i;
    if (isString(sourceItem)) {
      sourceItem = createFragment(sourceItem, getElementDocument(targetNodes[0]));
    } else if (sourceItem.length && !sourceItem.nodeType) {
      sourceItem = DomQuery.makeArray(sourceItem);
      if (reverse) {
        for (i = sourceItem.length - 1; i >= 0; i--) {
          domManipulate(targetNodes, sourceItem[i], callback, reverse);
        }
      } else {
        for (i = 0; i < sourceItem.length; i++) {
          domManipulate(targetNodes, sourceItem[i], callback, reverse);
        }
      }
      return targetNodes;
    }
    if (sourceItem.nodeType) {
      i = targetNodes.length;
      while (i--) {
        callback.call(targetNodes[i], sourceItem);
      }
    }
    return targetNodes;
  };
  var hasClass = function (node, className) {
    return node && className && (' ' + node.className + ' ').indexOf(' ' + className + ' ') !== -1;
  };
  var wrap = function (elements, wrapper, all) {
    var lastParent, newWrapper;
    wrapper = DomQuery(wrapper)[0];
    elements.each(function () {
      var self = this;
      if (!all || lastParent != self.parentNode) {
        lastParent = self.parentNode;
        newWrapper = wrapper.cloneNode(false);
        self.parentNode.insertBefore(newWrapper, self);
        newWrapper.appendChild(self);
      } else {
        newWrapper.appendChild(self);
      }
    });
    return elements;
  };
  var numericCssMap = $_b8tc32jjc7tm6qi.makeMap('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', ' ');
  var booleanMap = $_b8tc32jjc7tm6qi.makeMap('checked compact declare defer disabled ismap multiple nohref noshade nowrap readonly selected', ' ');
  var propFix = {
    'for': 'htmlFor',
    'class': 'className',
    'readonly': 'readOnly'
  };
  var cssFix = { 'float': 'cssFloat' };
  var attrHooks = {};
  var cssHooks = {};
  var DomQuery = function (selector, context) {
    return new DomQuery.fn.init(selector, context);
  };
  var inArray = function (item, array) {
    var i;
    if (array.indexOf) {
      return array.indexOf(item);
    }
    i = array.length;
    while (i--) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };
  var whiteSpaceRegExp$1 = /^\s*|\s*$/g;
  var trim = function (str) {
    return str === null || str === undef ? '' : ('' + str).replace(whiteSpaceRegExp$1, '');
  };
  var each$4 = function (obj, callback) {
    var length, key, i, undef, value;
    if (obj) {
      length = obj.length;
      if (length === undef) {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            value = obj[key];
            if (callback.call(value, key, value) === false) {
              break;
            }
          }
        }
      } else {
        for (i = 0; i < length; i++) {
          value = obj[i];
          if (callback.call(value, i, value) === false) {
            break;
          }
        }
      }
    }
    return obj;
  };
  var grep$2 = function (array, callback) {
    var out = [];
    each$4(array, function (i, item) {
      if (callback(item, i)) {
        out.push(item);
      }
    });
    return out;
  };
  var getElementDocument = function (element) {
    if (!element) {
      return doc;
    }
    if (element.nodeType == 9) {
      return element;
    }
    return element.ownerDocument;
  };
  DomQuery.fn = DomQuery.prototype = {
    constructor: DomQuery,
    selector: '',
    context: null,
    length: 0,
    init: function (selector, context) {
      var self = this, match, node;
      if (!selector) {
        return self;
      }
      if (selector.nodeType) {
        self.context = self[0] = selector;
        self.length = 1;
        return self;
      }
      if (context && context.nodeType) {
        self.context = context;
      } else {
        if (context) {
          return DomQuery(selector).attr(context);
        }
        self.context = context = document;
      }
      if (isString(selector)) {
        self.selector = selector;
        if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
          match = [
            null,
            selector,
            null
          ];
        } else {
          match = rquickExpr.exec(selector);
        }
        if (match) {
          if (match[1]) {
            node = createFragment(selector, getElementDocument(context)).firstChild;
            while (node) {
              push$1.call(self, node);
              node = node.nextSibling;
            }
          } else {
            node = getElementDocument(context).getElementById(match[2]);
            if (!node) {
              return self;
            }
            if (node.id !== match[2]) {
              return self.find(selector);
            }
            self.length = 1;
            self[0] = node;
          }
        } else {
          return DomQuery(context).find(selector);
        }
      } else {
        this.add(selector, false);
      }
      return self;
    },
    toArray: function () {
      return $_b8tc32jjc7tm6qi.toArray(this);
    },
    add: function (items, sort) {
      var self = this, nodes, i;
      if (isString(items)) {
        return self.add(DomQuery(items));
      }
      if (sort !== false) {
        nodes = DomQuery.unique(self.toArray().concat(DomQuery.makeArray(items)));
        self.length = nodes.length;
        for (i = 0; i < nodes.length; i++) {
          self[i] = nodes[i];
        }
      } else {
        push$1.apply(self, DomQuery.makeArray(items));
      }
      return self;
    },
    attr: function (name, value) {
      var self = this, hook;
      if (typeof name === 'object') {
        each$4(name, function (name, value) {
          self.attr(name, value);
        });
      } else if (isDefined(value)) {
        this.each(function () {
          var hook;
          if (this.nodeType === 1) {
            hook = attrHooks[name];
            if (hook && hook.set) {
              hook.set(this, value);
              return;
            }
            if (value === null) {
              this.removeAttribute(name, 2);
            } else {
              this.setAttribute(name, value, 2);
            }
          }
        });
      } else {
        if (self[0] && self[0].nodeType === 1) {
          hook = attrHooks[name];
          if (hook && hook.get) {
            return hook.get(self[0], name);
          }
          if (booleanMap[name]) {
            return self.prop(name) ? name : undef;
          }
          value = self[0].getAttribute(name, 2);
          if (value === null) {
            value = undef;
          }
        }
        return value;
      }
      return self;
    },
    removeAttr: function (name) {
      return this.attr(name, null);
    },
    prop: function (name, value) {
      var self = this;
      name = propFix[name] || name;
      if (typeof name === 'object') {
        each$4(name, function (name, value) {
          self.prop(name, value);
        });
      } else if (isDefined(value)) {
        this.each(function () {
          if (this.nodeType == 1) {
            this[name] = value;
          }
        });
      } else {
        if (self[0] && self[0].nodeType && name in self[0]) {
          return self[0][name];
        }
        return value;
      }
      return self;
    },
    css: function (name, value) {
      var self = this, elm, hook;
      var camel = function (name) {
        return name.replace(/-(\D)/g, function (a, b) {
          return b.toUpperCase();
        });
      };
      var dashed = function (name) {
        return name.replace(/[A-Z]/g, function (a) {
          return '-' + a;
        });
      };
      if (typeof name === 'object') {
        each$4(name, function (name, value) {
          self.css(name, value);
        });
      } else {
        if (isDefined(value)) {
          name = camel(name);
          if (typeof value === 'number' && !numericCssMap[name]) {
            value = value.toString() + 'px';
          }
          self.each(function () {
            var style = this.style;
            hook = cssHooks[name];
            if (hook && hook.set) {
              hook.set(this, value);
              return;
            }
            try {
              this.style[cssFix[name] || name] = value;
            } catch (ex) {
            }
            if (value === null || value === '') {
              if (style.removeProperty) {
                style.removeProperty(dashed(name));
              } else {
                style.removeAttribute(name);
              }
            }
          });
        } else {
          elm = self[0];
          hook = cssHooks[name];
          if (hook && hook.get) {
            return hook.get(elm);
          }
          if (elm.ownerDocument.defaultView) {
            try {
              return elm.ownerDocument.defaultView.getComputedStyle(elm, null).getPropertyValue(dashed(name));
            } catch (ex) {
              return undef;
            }
          } else if (elm.currentStyle) {
            return elm.currentStyle[camel(name)];
          }
        }
      }
      return self;
    },
    remove: function () {
      var self = this, node, i = this.length;
      while (i--) {
        node = self[i];
        Event.clean(node);
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
      return this;
    },
    empty: function () {
      var self = this, node, i = this.length;
      while (i--) {
        node = self[i];
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      }
      return this;
    },
    html: function (value) {
      var self = this, i;
      if (isDefined(value)) {
        i = self.length;
        try {
          while (i--) {
            self[i].innerHTML = value;
          }
        } catch (ex) {
          DomQuery(self[i]).empty().append(value);
        }
        return self;
      }
      return self[0] ? self[0].innerHTML : '';
    },
    text: function (value) {
      var self = this, i;
      if (isDefined(value)) {
        i = self.length;
        while (i--) {
          if ('innerText' in self[i]) {
            self[i].innerText = value;
          } else {
            self[0].textContent = value;
          }
        }
        return self;
      }
      return self[0] ? self[0].innerText || self[0].textContent : '';
    },
    append: function () {
      return domManipulate(this, arguments, function (node) {
        if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
          this.appendChild(node);
        }
      });
    },
    prepend: function () {
      return domManipulate(this, arguments, function (node) {
        if (this.nodeType === 1 || this.host && this.host.nodeType === 1) {
          this.insertBefore(node, this.firstChild);
        }
      }, true);
    },
    before: function () {
      var self = this;
      if (self[0] && self[0].parentNode) {
        return domManipulate(self, arguments, function (node) {
          this.parentNode.insertBefore(node, this);
        });
      }
      return self;
    },
    after: function () {
      var self = this;
      if (self[0] && self[0].parentNode) {
        return domManipulate(self, arguments, function (node) {
          this.parentNode.insertBefore(node, this.nextSibling);
        }, true);
      }
      return self;
    },
    appendTo: function (val) {
      DomQuery(val).append(this);
      return this;
    },
    prependTo: function (val) {
      DomQuery(val).prepend(this);
      return this;
    },
    replaceWith: function (content) {
      return this.before(content).remove();
    },
    wrap: function (content) {
      return wrap(this, content);
    },
    wrapAll: function (content) {
      return wrap(this, content, true);
    },
    wrapInner: function (content) {
      this.each(function () {
        DomQuery(this).contents().wrapAll(content);
      });
      return this;
    },
    unwrap: function () {
      return this.parent().each(function () {
        DomQuery(this).replaceWith(this.childNodes);
      });
    },
    clone: function () {
      var result = [];
      this.each(function () {
        result.push(this.cloneNode(true));
      });
      return DomQuery(result);
    },
    addClass: function (className) {
      return this.toggleClass(className, true);
    },
    removeClass: function (className) {
      return this.toggleClass(className, false);
    },
    toggleClass: function (className, state) {
      var self = this;
      if (typeof className != 'string') {
        return self;
      }
      if (className.indexOf(' ') !== -1) {
        each$4(className.split(' '), function () {
          self.toggleClass(this, state);
        });
      } else {
        self.each(function (index, node) {
          var existingClassName, classState;
          classState = hasClass(node, className);
          if (classState !== state) {
            existingClassName = node.className;
            if (classState) {
              node.className = trim((' ' + existingClassName + ' ').replace(' ' + className + ' ', ' '));
            } else {
              node.className += existingClassName ? ' ' + className : className;
            }
          }
        });
      }
      return self;
    },
    hasClass: function (className) {
      return hasClass(this[0], className);
    },
    each: function (callback) {
      return each$4(this, callback);
    },
    on: function (name, callback) {
      return this.each(function () {
        Event.bind(this, name, callback);
      });
    },
    off: function (name, callback) {
      return this.each(function () {
        Event.unbind(this, name, callback);
      });
    },
    trigger: function (name) {
      return this.each(function () {
        if (typeof name == 'object') {
          Event.fire(this, name.type, name);
        } else {
          Event.fire(this, name);
        }
      });
    },
    show: function () {
      return this.css('display', '');
    },
    hide: function () {
      return this.css('display', 'none');
    },
    slice: function () {
      return new DomQuery(slice$1.apply(this, arguments));
    },
    eq: function (index) {
      return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    find: function (selector) {
      var i, l, ret = [];
      for (i = 0, l = this.length; i < l; i++) {
        DomQuery.find(selector, this[i], ret);
      }
      return DomQuery(ret);
    },
    filter: function (selector) {
      if (typeof selector == 'function') {
        return DomQuery(grep$2(this.toArray(), function (item, i) {
          return selector(i, item);
        }));
      }
      return DomQuery(DomQuery.filter(selector, this.toArray()));
    },
    closest: function (selector) {
      var result = [];
      if (selector instanceof DomQuery) {
        selector = selector[0];
      }
      this.each(function (i, node) {
        while (node) {
          if (typeof selector == 'string' && DomQuery(node).is(selector)) {
            result.push(node);
            break;
          } else if (node == selector) {
            result.push(node);
            break;
          }
          node = node.parentNode;
        }
      });
      return DomQuery(result);
    },
    offset: function (offset) {
      var elm, doc, docElm;
      var x = 0, y = 0, pos;
      if (!offset) {
        elm = this[0];
        if (elm) {
          doc = elm.ownerDocument;
          docElm = doc.documentElement;
          if (elm.getBoundingClientRect) {
            pos = elm.getBoundingClientRect();
            x = pos.left + (docElm.scrollLeft || doc.body.scrollLeft) - docElm.clientLeft;
            y = pos.top + (docElm.scrollTop || doc.body.scrollTop) - docElm.clientTop;
          }
        }
        return {
          left: x,
          top: y
        };
      }
      return this.css(offset);
    },
    push: push$1,
    sort: [].sort,
    splice: [].splice
  };
  $_b8tc32jjc7tm6qi.extend(DomQuery, {
    extend: $_b8tc32jjc7tm6qi.extend,
    makeArray: function (object) {
      if (isWindow(object) || object.nodeType) {
        return [object];
      }
      return $_b8tc32jjc7tm6qi.toArray(object);
    },
    inArray: inArray,
    isArray: $_b8tc32jjc7tm6qi.isArray,
    each: each$4,
    trim: trim,
    grep: grep$2,
    find: Sizzle,
    expr: Sizzle.selectors,
    unique: Sizzle.uniqueSort,
    text: Sizzle.getText,
    contains: Sizzle.contains,
    filter: function (expr, elems, not) {
      var i = elems.length;
      if (not) {
        expr = ':not(' + expr + ')';
      }
      while (i--) {
        if (elems[i].nodeType != 1) {
          elems.splice(i, 1);
        }
      }
      if (elems.length === 1) {
        elems = DomQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [];
      } else {
        elems = DomQuery.find.matches(expr, elems);
      }
      return elems;
    }
  });
  var dir = function (el, prop, until) {
    var matched = [], cur = el[prop];
    if (typeof until != 'string' && until instanceof DomQuery) {
      until = until[0];
    }
    while (cur && cur.nodeType !== 9) {
      if (until !== undefined) {
        if (cur === until) {
          break;
        }
        if (typeof until == 'string' && DomQuery(cur).is(until)) {
          break;
        }
      }
      if (cur.nodeType === 1) {
        matched.push(cur);
      }
      cur = cur[prop];
    }
    return matched;
  };
  var sibling = function (node, siblingName, nodeType, until) {
    var result = [];
    if (until instanceof DomQuery) {
      until = until[0];
    }
    for (; node; node = node[siblingName]) {
      if (nodeType && node.nodeType !== nodeType) {
        continue;
      }
      if (until !== undefined) {
        if (node === until) {
          break;
        }
        if (typeof until == 'string' && DomQuery(node).is(until)) {
          break;
        }
      }
      result.push(node);
    }
    return result;
  };
  var firstSibling = function (node, siblingName, nodeType) {
    for (node = node[siblingName]; node; node = node[siblingName]) {
      if (node.nodeType == nodeType) {
        return node;
      }
    }
    return null;
  };
  each$4({
    parent: function (node) {
      var parent = node.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function (node) {
      return dir(node, 'parentNode');
    },
    next: function (node) {
      return firstSibling(node, 'nextSibling', 1);
    },
    prev: function (node) {
      return firstSibling(node, 'previousSibling', 1);
    },
    children: function (node) {
      return sibling(node.firstChild, 'nextSibling', 1);
    },
    contents: function (node) {
      return $_b8tc32jjc7tm6qi.toArray((node.nodeName === 'iframe' ? node.contentDocument || node.contentWindow.document : node).childNodes);
    }
  }, function (name, fn) {
    DomQuery.fn[name] = function (selector) {
      var self = this, result = [];
      self.each(function () {
        var nodes = fn.call(result, this, selector, result);
        if (nodes) {
          if (DomQuery.isArray(nodes)) {
            result.push.apply(result, nodes);
          } else {
            result.push(nodes);
          }
        }
      });
      if (this.length > 1) {
        if (!skipUniques[name]) {
          result = DomQuery.unique(result);
        }
        if (name.indexOf('parents') === 0) {
          result = result.reverse();
        }
      }
      result = DomQuery(result);
      if (selector) {
        return result.filter(selector);
      }
      return result;
    };
  });
  each$4({
    parentsUntil: function (node, until) {
      return dir(node, 'parentNode', until);
    },
    nextUntil: function (node, until) {
      return sibling(node, 'nextSibling', 1, until).slice(1);
    },
    prevUntil: function (node, until) {
      return sibling(node, 'previousSibling', 1, until).slice(1);
    }
  }, function (name, fn) {
    DomQuery.fn[name] = function (selector, filter) {
      var self = this, result = [];
      self.each(function () {
        var nodes = fn.call(result, this, selector, result);
        if (nodes) {
          if (DomQuery.isArray(nodes)) {
            result.push.apply(result, nodes);
          } else {
            result.push(nodes);
          }
        }
      });
      if (this.length > 1) {
        result = DomQuery.unique(result);
        if (name.indexOf('parents') === 0 || name === 'prevUntil') {
          result = result.reverse();
        }
      }
      result = DomQuery(result);
      if (filter) {
        return result.filter(filter);
      }
      return result;
    };
  });
  DomQuery.fn.is = function (selector) {
    return !!selector && this.filter(selector).length > 0;
  };
  DomQuery.fn.init.prototype = DomQuery.fn;
  DomQuery.overrideDefaults = function (callback) {
    var defaults;
    var sub = function (selector, context) {
      defaults = defaults || callback();
      if (arguments.length === 0) {
        selector = defaults.element;
      }
      if (!context) {
        context = defaults.context;
      }
      return new sub.fn.init(selector, context);
    };
    DomQuery.extend(sub, this);
    return sub;
  };
  var appendHooks = function (targetHooks, prop, hooks) {
    each$4(hooks, function (name, func) {
      targetHooks[name] = targetHooks[name] || {};
      targetHooks[name][prop] = func;
    });
  };
  if ($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 8) {
    appendHooks(attrHooks, 'get', {
      maxlength: function (elm) {
        var value = elm.maxLength;
        if (value === 2147483647) {
          return undef;
        }
        return value;
      },
      size: function (elm) {
        var value = elm.size;
        if (value === 20) {
          return undef;
        }
        return value;
      },
      'class': function (elm) {
        return elm.className;
      },
      style: function (elm) {
        var value = elm.style.cssText;
        if (value.length === 0) {
          return undef;
        }
        return value;
      }
    });
    appendHooks(attrHooks, 'set', {
      'class': function (elm, value) {
        elm.className = value;
      },
      style: function (elm, value) {
        elm.style.cssText = value;
      }
    });
  }
  if ($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 9) {
    cssFix['float'] = 'styleFloat';
    appendHooks(cssHooks, 'set', {
      opacity: function (elm, value) {
        var style = elm.style;
        if (value === null || value === '') {
          style.removeAttribute('filter');
        } else {
          style.zoom = 1;
          style.filter = 'alpha(opacity=' + value * 100 + ')';
        }
      }
    });
  }
  DomQuery.attrHooks = attrHooks;
  DomQuery.cssHooks = cssHooks;

  var cached = function (f) {
    var called = false;
    var r;
    return function () {
      if (!called) {
        called = true;
        r = f.apply(null, arguments);
      }
      return r;
    };
  };
  var $_6jw1h6njc7tm6sx = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$2 = function (regexes, agent) {
    var r = firstMatch(regexes, agent);
    if (!r)
      return {
        major: 0,
        minor: 0
      };
    var group = function (i) {
      return Number(agent.replace(r, '$' + i));
    };
    return nu$1(group(1), group(2));
  };
  var detect$2 = function (versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase();
    if (versionRegexes.length === 0)
      return unknown$1();
    return find$2(versionRegexes, cleanedAgent);
  };
  var unknown$1 = function () {
    return nu$1(0, 0);
  };
  var nu$1 = function (major, minor) {
    return {
      major: major,
      minor: minor
    };
  };
  var $_9mx1imqjc7tm6ta = {
    nu: nu$1,
    detect: detect$2,
    unknown: unknown$1
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie$1 = 'IE';
  var opera$1 = 'Opera';
  var firefox = 'Firefox';
  var safari = 'Safari';
  var isBrowser = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown = function () {
    return nu({
      current: undefined,
      version: $_9mx1imqjc7tm6ta.unknown()
    });
  };
  var nu = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge, current),
      isChrome: isBrowser(chrome, current),
      isIE: isBrowser(ie$1, current),
      isOpera: isBrowser(opera$1, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var $_fi82rlpjc7tm6t4 = {
    unknown: unknown,
    nu: nu,
    edge: $_f41mrx6jc7tm6cd.constant(edge),
    chrome: $_f41mrx6jc7tm6cd.constant(chrome),
    ie: $_f41mrx6jc7tm6cd.constant(ie$1),
    opera: $_f41mrx6jc7tm6cd.constant(opera$1),
    firefox: $_f41mrx6jc7tm6cd.constant(firefox),
    safari: $_f41mrx6jc7tm6cd.constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android$1 = 'Android';
  var linux = 'Linux';
  var osx = 'OSX';
  var solaris = 'Solaris';
  var freebsd = 'FreeBSD';
  var isOS = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$2 = function () {
    return nu$2({
      current: undefined,
      version: $_9mx1imqjc7tm6ta.unknown()
    });
  };
  var nu$2 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isWindows: isOS(windows, current),
      isiOS: isOS(ios, current),
      isAndroid: isOS(android$1, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var $_dqh5b0rjc7tm6tg = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_f41mrx6jc7tm6cd.constant(windows),
    ios: $_f41mrx6jc7tm6cd.constant(ios),
    android: $_f41mrx6jc7tm6cd.constant(android$1),
    linux: $_f41mrx6jc7tm6cd.constant(linux),
    osx: $_f41mrx6jc7tm6cd.constant(osx),
    solaris: $_f41mrx6jc7tm6cd.constant(solaris),
    freebsd: $_f41mrx6jc7tm6cd.constant(freebsd)
  };

  var DeviceType = function (os, browser, userAgent) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
    var isiPhone = os.isiOS() && !isiPad;
    var isAndroid3 = os.isAndroid() && os.version.major === 3;
    var isAndroid4 = os.isAndroid() && os.version.major === 4;
    var isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true;
    var isTouch = os.isiOS() || os.isAndroid();
    var isPhone = isTouch && !isTablet;
    var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
    return {
      isiPad: $_f41mrx6jc7tm6cd.constant(isiPad),
      isiPhone: $_f41mrx6jc7tm6cd.constant(isiPhone),
      isTablet: $_f41mrx6jc7tm6cd.constant(isTablet),
      isPhone: $_f41mrx6jc7tm6cd.constant(isPhone),
      isTouch: $_f41mrx6jc7tm6cd.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_f41mrx6jc7tm6cd.constant(iOSwebview)
    };
  };

  var detect$3 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_20yqgb4jc7tm6aj.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$3(browsers, userAgent).map(function (browser) {
      var version = $_9mx1imqjc7tm6ta.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$3(oses, userAgent).map(function (os) {
      var version = $_9mx1imqjc7tm6ta.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_a751w5tjc7tm6tv = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  };

  var addToStart = function (str, prefix) {
    return prefix + str;
  };
  var addToEnd = function (str, suffix) {
    return str + suffix;
  };
  var removeFromStart = function (str, numChars) {
    return str.substring(numChars);
  };
  var removeFromEnd = function (str, numChars) {
    return str.substring(0, str.length - numChars);
  };
  var $_26lrqtwjc7tm6ug = {
    addToStart: addToStart,
    addToEnd: addToEnd,
    removeFromStart: removeFromStart,
    removeFromEnd: removeFromEnd
  };

  var first = function (str, count) {
    return str.substr(0, count);
  };
  var last$2 = function (str, count) {
    return str.substr(str.length - count, str.length);
  };
  var head$1 = function (str) {
    return str === '' ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(str.substring(1));
  };
  var $_8ekgqkxjc7tm6uk = {
    first: first,
    last: last$2,
    head: head$1,
    tail: tail
  };

  var checkRange = function (str, substr, start) {
    if (substr === '')
      return true;
    if (str.length < substr.length)
      return false;
    var x = str.substr(start, start + substr.length);
    return x === substr;
  };
  var supplant = function (str, obj) {
    var isStringOrNumber = function (a) {
      var t = typeof a;
      return t === 'string' || t === 'number';
    };
    return str.replace(/\${([^{}]*)}/g, function (a, b) {
      var value = obj[b];
      return isStringOrNumber(value) ? value : a;
    });
  };
  var removeLeading = function (str, prefix) {
    return startsWith(str, prefix) ? $_26lrqtwjc7tm6ug.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_26lrqtwjc7tm6ug.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_26lrqtwjc7tm6ug.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_26lrqtwjc7tm6ug.addToEnd(str, prefix);
  };
  var contains$2 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_8ekgqkxjc7tm6uk.head(str).bind(function (head) {
      return $_8ekgqkxjc7tm6uk.tail(str).map(function (tail) {
        return head.toUpperCase() + tail;
      });
    }).getOr(str);
  };
  var startsWith = function (str, prefix) {
    return checkRange(str, prefix, 0);
  };
  var endsWith = function (str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length);
  };
  var trim$2 = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  var lTrim = function (str) {
    return str.replace(/^\s+/g, '');
  };
  var rTrim = function (str) {
    return str.replace(/\s+$/g, '');
  };
  var $_esne4hvjc7tm6ub = {
    supplant: supplant,
    startsWith: startsWith,
    removeLeading: removeLeading,
    removeTrailing: removeTrailing,
    ensureLeading: ensureLeading,
    ensureTrailing: ensureTrailing,
    endsWith: endsWith,
    contains: contains$2,
    trim: trim$2,
    lTrim: lTrim,
    rTrim: rTrim,
    capitalize: capitalize
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function (target) {
    return function (uastring) {
      return $_esne4hvjc7tm6ub.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_esne4hvjc7tm6ub.contains(uastring, 'edge/') && $_esne4hvjc7tm6ub.contains(uastring, 'chrome') && $_esne4hvjc7tm6ub.contains(uastring, 'safari') && $_esne4hvjc7tm6ub.contains(uastring, 'applewebkit');
        return monstrosity;
      }
    },
    {
      name: 'Chrome',
      versionRegexes: [
        /.*?chrome\/([0-9]+)\.([0-9]+).*/,
        normalVersionRegex
      ],
      search: function (uastring) {
        return $_esne4hvjc7tm6ub.contains(uastring, 'chrome') && !$_esne4hvjc7tm6ub.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_esne4hvjc7tm6ub.contains(uastring, 'msie') || $_esne4hvjc7tm6ub.contains(uastring, 'trident');
      }
    },
    {
      name: 'Opera',
      versionRegexes: [
        normalVersionRegex,
        /.*?opera\/([0-9]+)\.([0-9]+).*/
      ],
      search: checkContains('opera')
    },
    {
      name: 'Firefox',
      versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
      search: checkContains('firefox')
    },
    {
      name: 'Safari',
      versionRegexes: [
        normalVersionRegex,
        /.*?cpu os ([0-9]+)_([0-9]+).*/
      ],
      search: function (uastring) {
        return ($_esne4hvjc7tm6ub.contains(uastring, 'safari') || $_esne4hvjc7tm6ub.contains(uastring, 'mobile/')) && $_esne4hvjc7tm6ub.contains(uastring, 'applewebkit');
      }
    }
  ];
  var oses = [
    {
      name: 'Windows',
      search: checkContains('win'),
      versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'iOS',
      search: function (uastring) {
        return $_esne4hvjc7tm6ub.contains(uastring, 'iphone') || $_esne4hvjc7tm6ub.contains(uastring, 'ipad');
      },
      versionRegexes: [
        /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
        /.*cpu os ([0-9]+)_([0-9]+).*/,
        /.*cpu iphone os ([0-9]+)_([0-9]+).*/
      ]
    },
    {
      name: 'Android',
      search: checkContains('android'),
      versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'OSX',
      search: checkContains('os x'),
      versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
    },
    {
      name: 'Linux',
      search: checkContains('linux'),
      versionRegexes: []
    },
    {
      name: 'Solaris',
      search: checkContains('sunos'),
      versionRegexes: []
    },
    {
      name: 'FreeBSD',
      search: checkContains('freebsd'),
      versionRegexes: []
    }
  ];
  var $_4s3rkvujc7tm6u2 = {
    browsers: $_f41mrx6jc7tm6cd.constant(browsers),
    oses: $_f41mrx6jc7tm6cd.constant(oses)
  };

  var detect$1 = function (userAgent) {
    var browsers = $_4s3rkvujc7tm6u2.browsers();
    var oses = $_4s3rkvujc7tm6u2.oses();
    var browser = $_a751w5tjc7tm6tv.detectBrowser(browsers, userAgent).fold($_fi82rlpjc7tm6t4.unknown, $_fi82rlpjc7tm6t4.nu);
    var os = $_a751w5tjc7tm6tv.detectOs(oses, userAgent).fold($_dqh5b0rjc7tm6tg.unknown, $_dqh5b0rjc7tm6tg.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_7nvrkiojc7tm6t1 = { detect: detect$1 };

  var detect = $_6jw1h6njc7tm6sx.cached(function () {
    var userAgent = navigator.userAgent;
    return $_7nvrkiojc7tm6t1.detect(userAgent);
  });
  var $_e43n9tmjc7tm6ss = { detect: detect };

  var fromHtml = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      console.error('HTML does not have a single root node', html);
      throw 'HTML must have a single root node';
    }
    return fromDom(div.childNodes[0]);
  };
  var fromTag = function (tag, scope) {
    var doc = scope || document;
    var node = doc.createElement(tag);
    return fromDom(node);
  };
  var fromText = function (text, scope) {
    var doc = scope || document;
    var node = doc.createTextNode(text);
    return fromDom(node);
  };
  var fromDom = function (node) {
    if (node === null || node === undefined)
      throw new Error('Node cannot be null or undefined');
    return { dom: $_f41mrx6jc7tm6cd.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_e5uurj5jc7tm6bt.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_bscr39yjc7tm6uo = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_6k49jo10jc7tm6v5 = {
    ATTRIBUTE: 2,
    CDATA_SECTION: 4,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    ELEMENT: 1,
    TEXT: 3,
    PROCESSING_INSTRUCTION: 7,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    NOTATION: 12
  };

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value = function (element) {
    return element.dom().nodeValue;
  };
  var isType = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_6k49jo10jc7tm6v5.COMMENT || name(element) === '#comment';
  };
  var isElement = isType($_6k49jo10jc7tm6v5.ELEMENT);
  var isText = isType($_6k49jo10jc7tm6v5.TEXT);
  var isDocument = isType($_6k49jo10jc7tm6v5.DOCUMENT);
  var $_4bxsjnzjc7tm6uw = {
    name: name,
    type: type,
    value: value,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var typeOf = function (x) {
    if (x === null)
      return 'null';
    var t = typeof x;
    if (t === 'object' && Array.prototype.isPrototypeOf(x))
      return 'array';
    if (t === 'object' && String.prototype.isPrototypeOf(x))
      return 'string';
    return t;
  };
  var isType$1 = function (type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var $_1g0kpc12jc7tm6vn = {
    isString: isType$1('string'),
    isObject: isType$1('object'),
    isArray: isType$1('array'),
    isNull: isType$1('null'),
    isBoolean: isType$1('boolean'),
    isUndefined: isType$1('undefined'),
    isFunction: isType$1('function'),
    isNumber: isType$1('number')
  };

  var keys = function () {
    var fastKeys = Object.keys;
    var slowKeys = function (o) {
      var r = [];
      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          r.push(i);
        }
      }
      return r;
    };
    return fastKeys === undefined ? slowKeys : fastKeys;
  }();
  var each$6 = function (obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i, obj);
    }
  };
  var objectMap = function (obj, f) {
    return tupleMap(obj, function (x, i, obj) {
      return {
        k: i,
        v: f(x, i, obj)
      };
    });
  };
  var tupleMap = function (obj, f) {
    var r = {};
    each$6(obj, function (x, i) {
      var tuple = f(x, i, obj);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var bifilter = function (obj, pred) {
    var t = {};
    var f = {};
    each$6(obj, function (x, i) {
      var branch = pred(x, i) ? t : f;
      branch[i] = x;
    });
    return {
      t: t,
      f: f
    };
  };
  var mapToArray = function (obj, f) {
    var r = [];
    each$6(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find$3 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_e5uurj5jc7tm6bt.some(x);
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_fttkez13jc7tm6vs = {
    bifilter: bifilter,
    each: each$6,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$3,
    keys: keys,
    values: values,
    size: size
  };

  var rawSet = function (dom, key, value) {
    if ($_1g0kpc12jc7tm6vn.isString(value) || $_1g0kpc12jc7tm6vn.isBoolean(value) || $_1g0kpc12jc7tm6vn.isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set$1 = function (element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var setAll$1 = function (element, attrs) {
    var dom = element.dom();
    $_fttkez13jc7tm6vs.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get$1 = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has = function (element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove$1 = function (element, key) {
    element.dom().removeAttribute(key);
  };
  var hasNone = function (element) {
    var attrs = element.dom().attributes;
    return attrs === undefined || attrs === null || attrs.length === 0;
  };
  var clone = function (element) {
    return $_20yqgb4jc7tm6aj.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne$1 = function (source, destination, attr) {
    if (has(source, attr) && !has(destination, attr))
      set$1(destination, attr, get$1(source, attr));
  };
  var transfer$1 = function (source, destination, attrs) {
    if (!$_4bxsjnzjc7tm6uw.isElement(source) || !$_4bxsjnzjc7tm6uw.isElement(destination))
      return;
    $_20yqgb4jc7tm6aj.each(attrs, function (attr) {
      transferOne$1(source, destination, attr);
    });
  };
  var $_ftie1r14jc7tm6vz = {
    clone: clone,
    set: set$1,
    setAll: setAll$1,
    get: get$1,
    has: has,
    remove: remove$1,
    hasNone: hasNone,
    transfer: transfer$1
  };

  var inBody = function (element) {
    var dom = $_4bxsjnzjc7tm6uw.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_6jw1h6njc7tm6sx.cached(function () {
    return getBody($_bscr39yjc7tm6uo.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_bscr39yjc7tm6uo.fromDom(body);
  };
  var $_2hnc5315jc7tm6wb = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_fvarhv16jc7tm6wj = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_1g0kpc12jc7tm6vn.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_fvarhv16jc7tm6wj.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_fvarhv16jc7tm6wj.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll = function (element, css) {
    var dom = element.dom();
    $_fttkez13jc7tm6vs.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_fttkez13jc7tm6vs.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_2hnc5315jc7tm6wb.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_fvarhv16jc7tm6wj.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_e5uurj5jc7tm6bt.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_fvarhv16jc7tm6wj.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_bscr39yjc7tm6uo.fromTag(tag);
    set(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_ftie1r14jc7tm6vz.has(element, 'style') && $_esne4hvjc7tm6ub.trim($_ftie1r14jc7tm6vz.get(element, 'style')) === '') {
      $_ftie1r14jc7tm6vz.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_ftie1r14jc7tm6vz.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_ftie1r14jc7tm6vz.remove : $_ftie1r14jc7tm6vz.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_fvarhv16jc7tm6wj.isSupported(sourceDom) && $_fvarhv16jc7tm6wj.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set(destination, style, value);
    });
  };
  var transfer = function (source, destination, styles) {
    if (!$_4bxsjnzjc7tm6uw.isElement(source) || !$_4bxsjnzjc7tm6uw.isElement(destination))
      return;
    $_20yqgb4jc7tm6aj.each(styles, function (style) {
      transferOne(source, destination, style);
    });
  };
  var $_c8wsbp11jc7tm6va = {
    copy: copy,
    set: set,
    preserve: preserve,
    setAll: setAll,
    setOptions: setOptions,
    remove: remove,
    get: get,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer
  };

  var Immutable = function () {
    var fields = arguments;
    return function () {
      var values = new Array(arguments.length);
      for (var i = 0; i < values.length; i++)
        values[i] = arguments[i];
      if (fields.length !== values.length)
        throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
      var struct = {};
      $_20yqgb4jc7tm6aj.each(fields, function (name, i) {
        struct[name] = $_f41mrx6jc7tm6cd.constant(values[i]);
      });
      return struct;
    };
  };

  var sort$1 = function (arr) {
    return arr.slice(0).sort();
  };
  var reqMessage = function (required, keys) {
    throw new Error('All required keys (' + sort$1(required).join(', ') + ') were not specified. Specified keys were: ' + sort$1(keys).join(', ') + '.');
  };
  var unsuppMessage = function (unsupported) {
    throw new Error('Unsupported keys for object: ' + sort$1(unsupported).join(', '));
  };
  var validateStrArr = function (label, array) {
    if (!$_1g0kpc12jc7tm6vn.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_20yqgb4jc7tm6aj.each(array, function (a) {
      if (!$_1g0kpc12jc7tm6vn.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_20yqgb4jc7tm6aj.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_c37usg1bjc7tm6xy = {
    sort: sort$1,
    reqMessage: reqMessage,
    unsuppMessage: unsuppMessage,
    validateStrArr: validateStrArr,
    invalidTypeMessage: invalidTypeMessage,
    checkDupes: checkDupes
  };

  var MixedBag = function (required, optional) {
    var everything = required.concat(optional);
    if (everything.length === 0)
      throw new Error('You must specify at least one required or optional field.');
    $_c37usg1bjc7tm6xy.validateStrArr('required', required);
    $_c37usg1bjc7tm6xy.validateStrArr('optional', optional);
    $_c37usg1bjc7tm6xy.checkDupes(everything);
    return function (obj) {
      var keys = $_fttkez13jc7tm6vs.keys(obj);
      var allReqd = $_20yqgb4jc7tm6aj.forall(required, function (req) {
        return $_20yqgb4jc7tm6aj.contains(keys, req);
      });
      if (!allReqd)
        $_c37usg1bjc7tm6xy.reqMessage(required, keys);
      var unsupported = $_20yqgb4jc7tm6aj.filter(keys, function (key) {
        return !$_20yqgb4jc7tm6aj.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_c37usg1bjc7tm6xy.unsuppMessage(unsupported);
      var r = {};
      $_20yqgb4jc7tm6aj.each(required, function (req) {
        r[req] = $_f41mrx6jc7tm6cd.constant(obj[req]);
      });
      $_20yqgb4jc7tm6aj.each(optional, function (opt) {
        r[opt] = $_f41mrx6jc7tm6cd.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_e5uurj5jc7tm6bt.some(obj[opt]) : $_e5uurj5jc7tm6bt.none());
      });
      return r;
    };
  };

  var $_4vs0gm18jc7tm6xh = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var toArray$1 = function (target, f) {
    var r = [];
    var recurse = function (e) {
      r.push(e);
      return f(e);
    };
    var cur = f(target);
    do {
      cur = cur.bind(recurse);
    } while (cur.isSome());
    return r;
  };
  var $_4marh1cjc7tm6y4 = { toArray: toArray$1 };

  var node = function () {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('Node');
    return f;
  };
  var compareDocumentPosition = function (a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0;
  };
  var documentPositionPreceding = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
  };
  var documentPositionContainedBy = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
  };
  var $_1y10ps1ejc7tm6yk = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

  var ELEMENT = $_6k49jo10jc7tm6v5.ELEMENT;
  var DOCUMENT = $_6k49jo10jc7tm6v5.DOCUMENT;
  var is$2 = function (element, selector) {
    var elem = element.dom();
    if (elem.nodeType !== ELEMENT)
      return false;
    else if (elem.matches !== undefined)
      return elem.matches(selector);
    else if (elem.msMatchesSelector !== undefined)
      return elem.msMatchesSelector(selector);
    else if (elem.webkitMatchesSelector !== undefined)
      return elem.webkitMatchesSelector(selector);
    else if (elem.mozMatchesSelector !== undefined)
      return elem.mozMatchesSelector(selector);
    else
      throw new Error('Browser lacks native selectors');
  };
  var bypassSelector = function (dom) {
    return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT || dom.childElementCount === 0;
  };
  var all = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? [] : $_20yqgb4jc7tm6aj.map(base.querySelectorAll(selector), $_bscr39yjc7tm6uo.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.from(base.querySelector(selector)).map($_bscr39yjc7tm6uo.fromDom);
  };
  var $_dnzz0a1fjc7tm6yr = {
    all: all,
    is: is$2,
    one: one
  };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_20yqgb4jc7tm6aj.exists(elements, $_f41mrx6jc7tm6cd.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_1y10ps1ejc7tm6yk.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser$1 = $_e43n9tmjc7tm6ss.detect().browser;
  var contains$3 = browser$1.isIE() ? ieContains : regularContains;
  var $_b0e3uw1djc7tm6y8 = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains$3,
    is: $_dnzz0a1fjc7tm6yr.is
  };

  var owner = function (element) {
    return $_bscr39yjc7tm6uo.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_bscr39yjc7tm6uo.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_bscr39yjc7tm6uo.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_e5uurj5jc7tm6bt.from(dom.parentNode).map($_bscr39yjc7tm6uo.fromDom);
  };
  var findIndex$2 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_20yqgb4jc7tm6aj.findIndex(kin, function (elem) {
        return $_b0e3uw1djc7tm6y8.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_1g0kpc12jc7tm6vn.isFunction(isRoot) ? isRoot : $_f41mrx6jc7tm6cd.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_bscr39yjc7tm6uo.fromDom(rawParent);
      ret.push(parent);
      if (stop(parent) === true)
        break;
      else
        dom = rawParent;
    }
    return ret;
  };
  var siblings = function (element) {
    var filterSelf = function (elements) {
      return $_20yqgb4jc7tm6aj.filter(elements, function (x) {
        return !$_b0e3uw1djc7tm6y8.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_e5uurj5jc7tm6bt.from(dom.offsetParent).map($_bscr39yjc7tm6uo.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_e5uurj5jc7tm6bt.from(dom.previousSibling).map($_bscr39yjc7tm6uo.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_e5uurj5jc7tm6bt.from(dom.nextSibling).map($_bscr39yjc7tm6uo.fromDom);
  };
  var prevSiblings = function (element) {
    return $_20yqgb4jc7tm6aj.reverse($_4marh1cjc7tm6y4.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_4marh1cjc7tm6y4.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_20yqgb4jc7tm6aj.map(dom.childNodes, $_bscr39yjc7tm6uo.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_e5uurj5jc7tm6bt.from(children[index]).map($_bscr39yjc7tm6uo.fromDom);
  };
  var firstChild = function (element) {
    return child(element, 0);
  };
  var lastChild = function (element) {
    return child(element, element.dom().childNodes.length - 1);
  };
  var childNodesCount = function (element) {
    return element.dom().childNodes.length;
  };
  var hasChildNodes = function (element) {
    return element.dom().hasChildNodes();
  };
  var spot = $_4vs0gm18jc7tm6xh.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_15fekq17jc7tm6wo = {
    owner: owner,
    defaultView: defaultView,
    documentElement: documentElement,
    parent: parent,
    findIndex: findIndex$2,
    parents: parents,
    siblings: siblings,
    prevSibling: prevSibling,
    offsetParent: offsetParent,
    prevSiblings: prevSiblings,
    nextSibling: nextSibling,
    nextSiblings: nextSiblings,
    children: children,
    child: child,
    firstChild: firstChild,
    lastChild: lastChild,
    childNodesCount: childNodesCount,
    hasChildNodes: hasChildNodes,
    leaf: leaf
  };

  var browser = $_e43n9tmjc7tm6ss.detect().browser;
  var firstElement = function (nodes) {
    return $_20yqgb4jc7tm6aj.find(nodes, $_4bxsjnzjc7tm6uw.isElement);
  };
  var getTableCaptionDeltaY = function (elm) {
    if (browser.isFirefox() && $_4bxsjnzjc7tm6uw.name(elm) === 'table') {
      return firstElement($_15fekq17jc7tm6wo.children(elm)).filter(function (elm) {
        return $_4bxsjnzjc7tm6uw.name(elm) === 'caption';
      }).bind(function (caption) {
        return firstElement($_15fekq17jc7tm6wo.nextSiblings(caption)).map(function (body) {
          var bodyTop = body.dom().offsetTop;
          var captionTop = caption.dom().offsetTop;
          var captionHeight = caption.dom().offsetHeight;
          return bodyTop <= captionTop ? -captionHeight : 0;
        });
      }).getOr(0);
    } else {
      return 0;
    }
  };
  var getPos = function (body, elm, rootElm) {
    var x = 0, y = 0, offsetParent, doc = body.ownerDocument, pos;
    rootElm = rootElm ? rootElm : body;
    if (elm) {
      if (rootElm === body && elm.getBoundingClientRect && $_c8wsbp11jc7tm6va.get($_bscr39yjc7tm6uo.fromDom(body), 'position') === 'static') {
        pos = elm.getBoundingClientRect();
        x = pos.left + (doc.documentElement.scrollLeft || body.scrollLeft) - doc.documentElement.clientLeft;
        y = pos.top + (doc.documentElement.scrollTop || body.scrollTop) - doc.documentElement.clientTop;
        return {
          x: x,
          y: y
        };
      }
      offsetParent = elm;
      while (offsetParent && offsetParent !== rootElm && offsetParent.nodeType) {
        x += offsetParent.offsetLeft || 0;
        y += offsetParent.offsetTop || 0;
        offsetParent = offsetParent.offsetParent;
      }
      offsetParent = elm.parentNode;
      while (offsetParent && offsetParent !== rootElm && offsetParent.nodeType) {
        x -= offsetParent.scrollLeft || 0;
        y -= offsetParent.scrollTop || 0;
        offsetParent = offsetParent.parentNode;
      }
      y += getTableCaptionDeltaY($_bscr39yjc7tm6uo.fromDom(elm));
    }
    return {
      x: x,
      y: y
    };
  };
  var $_1j5tgoljc7tm6rt = { getPos: getPos };

  var nu$4 = function (baseFn) {
    var data = $_e5uurj5jc7tm6bt.none();
    var callbacks = [];
    var map = function (f) {
      return nu$4(function (nCallback) {
        get(function (data) {
          nCallback(f(data));
        });
      });
    };
    var get = function (nCallback) {
      if (isReady())
        call(nCallback);
      else
        callbacks.push(nCallback);
    };
    var set = function (x) {
      data = $_e5uurj5jc7tm6bt.some(x);
      run(callbacks);
      callbacks = [];
    };
    var isReady = function () {
      return data.isSome();
    };
    var run = function (cbs) {
      $_20yqgb4jc7tm6aj.each(cbs, call);
    };
    var call = function (cb) {
      data.each(function (x) {
        setTimeout(function () {
          cb(x);
        }, 0);
      });
    };
    baseFn(set);
    return {
      get: get,
      map: map,
      isReady: isReady
    };
  };
  var pure$2 = function (a) {
    return nu$4(function (callback) {
      callback(a);
    });
  };
  var $_fo9es01ijc7tm6zi = {
    nu: nu$4,
    pure: pure$2
  };

  var bounce = function (f) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var me = this;
      setTimeout(function () {
        f.apply(me, args);
      }, 0);
    };
  };
  var $_8lcqrj1jjc7tm6zn = { bounce: bounce };

  var nu$3 = function (baseFn) {
    var get = function (callback) {
      baseFn($_8lcqrj1jjc7tm6zn.bounce(callback));
    };
    var map = function (fab) {
      return nu$3(function (callback) {
        get(function (a) {
          var value = fab(a);
          callback(value);
        });
      });
    };
    var bind = function (aFutureB) {
      return nu$3(function (callback) {
        get(function (a) {
          aFutureB(a).get(callback);
        });
      });
    };
    var anonBind = function (futureB) {
      return nu$3(function (callback) {
        get(function (a) {
          futureB.get(callback);
        });
      });
    };
    var toLazy = function () {
      return $_fo9es01ijc7tm6zi.nu(get);
    };
    return {
      map: map,
      bind: bind,
      anonBind: anonBind,
      toLazy: toLazy,
      get: get
    };
  };
  var pure$1 = function (a) {
    return nu$3(function (callback) {
      callback(a);
    });
  };
  var $_8tm7g71hjc7tm6zd = {
    nu: nu$3,
    pure: pure$1
  };

  var par$1 = function (asyncValues, nu) {
    return nu(function (callback) {
      var r = [];
      var count = 0;
      var cb = function (i) {
        return function (value) {
          r[i] = value;
          count++;
          if (count >= asyncValues.length) {
            callback(r);
          }
        };
      };
      if (asyncValues.length === 0) {
        callback([]);
      } else {
        $_20yqgb4jc7tm6aj.each(asyncValues, function (asyncValue, i) {
          asyncValue.get(cb(i));
        });
      }
    });
  };
  var $_794gdh1ljc7tm6zv = { par: par$1 };

  var par = function (futures) {
    return $_794gdh1ljc7tm6zv.par(futures, $_8tm7g71hjc7tm6zd.nu);
  };
  var mapM = function (array, fn) {
    var futures = $_20yqgb4jc7tm6aj.map(array, fn);
    return par(futures);
  };
  var compose$1 = function (f, g) {
    return function (a) {
      return g(a).bind(f);
    };
  };
  var $_eizc6i1kjc7tm6zr = {
    par: par,
    mapM: mapM,
    compose: compose$1
  };

  var value$1 = function (o) {
    var is = function (v) {
      return o === v;
    };
    var or = function (opt) {
      return value$1(o);
    };
    var orThunk = function (f) {
      return value$1(o);
    };
    var map = function (f) {
      return value$1(f(o));
    };
    var each = function (f) {
      f(o);
    };
    var bind = function (f) {
      return f(o);
    };
    var fold = function (_, onValue) {
      return onValue(o);
    };
    var exists = function (f) {
      return f(o);
    };
    var forall = function (f) {
      return f(o);
    };
    var toOption = function () {
      return $_e5uurj5jc7tm6bt.some(o);
    };
    return {
      is: is,
      isValue: $_f41mrx6jc7tm6cd.constant(true),
      isError: $_f41mrx6jc7tm6cd.constant(false),
      getOr: $_f41mrx6jc7tm6cd.constant(o),
      getOrThunk: $_f41mrx6jc7tm6cd.constant(o),
      getOrDie: $_f41mrx6jc7tm6cd.constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    };
  };
  var error = function (message) {
    var getOrThunk = function (f) {
      return f();
    };
    var getOrDie = function () {
      return $_f41mrx6jc7tm6cd.die(message)();
    };
    var or = function (opt) {
      return opt;
    };
    var orThunk = function (f) {
      return f();
    };
    var map = function (f) {
      return error(message);
    };
    var bind = function (f) {
      return error(message);
    };
    var fold = function (onError, _) {
      return onError(message);
    };
    return {
      is: $_f41mrx6jc7tm6cd.constant(false),
      isValue: $_f41mrx6jc7tm6cd.constant(false),
      isError: $_f41mrx6jc7tm6cd.constant(true),
      getOr: $_f41mrx6jc7tm6cd.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_f41mrx6jc7tm6cd.noop,
      bind: bind,
      exists: $_f41mrx6jc7tm6cd.constant(false),
      forall: $_f41mrx6jc7tm6cd.constant(true),
      toOption: $_e5uurj5jc7tm6bt.none
    };
  };
  var $_aerm2l1mjc7tm6zz = {
    value: value$1,
    error: error
  };

  var StyleSheetLoader = function (document, settings) {
    var idCount = 0, loadedStates = {}, maxLoadTime;
    settings = settings || {};
    maxLoadTime = settings.maxLoadTime || 5000;
    var appendToHead = function (node) {
      document.getElementsByTagName('head')[0].appendChild(node);
    };
    var load = function (url, loadedCallback, errorCallback) {
      var link, style, startTime, state;
      var passed = function () {
        var callbacks = state.passed, i = callbacks.length;
        while (i--) {
          callbacks[i]();
        }
        state.status = 2;
        state.passed = [];
        state.failed = [];
      };
      var failed = function () {
        var callbacks = state.failed, i = callbacks.length;
        while (i--) {
          callbacks[i]();
        }
        state.status = 3;
        state.passed = [];
        state.failed = [];
      };
      var isOldWebKit = function () {
        var webKitChunks = navigator.userAgent.match(/WebKit\/(\d*)/);
        return !!(webKitChunks && parseInt(webKitChunks[1], 10) < 536);
      };
      var wait = function (testCallback, waitCallback) {
        if (!testCallback()) {
          if (new Date().getTime() - startTime < maxLoadTime) {
            $_9jpiwcgjc7tm6kr.setTimeout(waitCallback);
          } else {
            failed();
          }
        }
      };
      var waitForWebKitLinkLoaded = function () {
        wait(function () {
          var styleSheets = document.styleSheets, styleSheet, i = styleSheets.length, owner;
          while (i--) {
            styleSheet = styleSheets[i];
            owner = styleSheet.ownerNode ? styleSheet.ownerNode : styleSheet.owningElement;
            if (owner && owner.id === link.id) {
              passed();
              return true;
            }
          }
        }, waitForWebKitLinkLoaded);
      };
      var waitForGeckoLinkLoaded = function () {
        wait(function () {
          try {
            var cssRules = style.sheet.cssRules;
            passed();
            return !!cssRules;
          } catch (ex) {
          }
        }, waitForGeckoLinkLoaded);
      };
      url = $_b8tc32jjc7tm6qi._addCacheSuffix(url);
      if (!loadedStates[url]) {
        state = {
          passed: [],
          failed: []
        };
        loadedStates[url] = state;
      } else {
        state = loadedStates[url];
      }
      if (loadedCallback) {
        state.passed.push(loadedCallback);
      }
      if (errorCallback) {
        state.failed.push(errorCallback);
      }
      if (state.status == 1) {
        return;
      }
      if (state.status == 2) {
        passed();
        return;
      }
      if (state.status == 3) {
        failed();
        return;
      }
      state.status = 1;
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.id = 'u' + idCount++;
      link.async = false;
      link.defer = false;
      startTime = new Date().getTime();
      if ('onload' in link && !isOldWebKit()) {
        link.onload = waitForWebKitLinkLoaded;
        link.onerror = failed;
      } else {
        if (navigator.userAgent.indexOf('Firefox') > 0) {
          style = document.createElement('style');
          style.textContent = '@import "' + url + '"';
          waitForGeckoLinkLoaded();
          appendToHead(style);
          return;
        }
        waitForWebKitLinkLoaded();
      }
      appendToHead(link);
      link.href = url;
    };
    var loadF = function (url) {
      return $_8tm7g71hjc7tm6zd.nu(function (resolve) {
        load(url, $_f41mrx6jc7tm6cd.compose(resolve, $_f41mrx6jc7tm6cd.constant($_aerm2l1mjc7tm6zz.value(url))), $_f41mrx6jc7tm6cd.compose(resolve, $_f41mrx6jc7tm6cd.constant($_aerm2l1mjc7tm6zz.error(url))));
      });
    };
    var unbox = function (result) {
      return result.fold($_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity);
    };
    var loadAll = function (urls, success, failure) {
      $_eizc6i1kjc7tm6zr.par($_20yqgb4jc7tm6aj.map(urls, loadF)).get(function (result) {
        var parts = $_20yqgb4jc7tm6aj.partition(result, function (r) {
          return r.isValue();
        });
        if (parts.fail.length > 0) {
          failure(parts.fail.map(unbox));
        } else {
          success(parts.pass.map(unbox));
        }
      });
    };
    return {
      load: load,
      loadAll: loadAll
    };
  };

  var TreeWalker = function (startNode, rootNode) {
    var node = startNode;
    var findSibling = function (node, startName, siblingName, shallow) {
      var sibling, parent;
      if (node) {
        if (!shallow && node[startName]) {
          return node[startName];
        }
        if (node != rootNode) {
          sibling = node[siblingName];
          if (sibling) {
            return sibling;
          }
          for (parent = node.parentNode; parent && parent != rootNode; parent = parent.parentNode) {
            sibling = parent[siblingName];
            if (sibling) {
              return sibling;
            }
          }
        }
      }
    };
    var findPreviousNode = function (node, startName, siblingName, shallow) {
      var sibling, parent, child;
      if (node) {
        sibling = node[siblingName];
        if (rootNode && sibling === rootNode) {
          return;
        }
        if (sibling) {
          if (!shallow) {
            for (child = sibling[startName]; child; child = child[startName]) {
              if (!child[startName]) {
                return child;
              }
            }
          }
          return sibling;
        }
        parent = node.parentNode;
        if (parent && parent !== rootNode) {
          return parent;
        }
      }
    };
    this.current = function () {
      return node;
    };
    this.next = function (shallow) {
      node = findSibling(node, 'firstChild', 'nextSibling', shallow);
      return node;
    };
    this.prev = function (shallow) {
      node = findSibling(node, 'lastChild', 'previousSibling', shallow);
      return node;
    };
    this.prev2 = function (shallow) {
      node = findPreviousNode(node, 'lastChild', 'previousSibling', shallow);
      return node;
    };
  };

  var blocks = [
    'article',
    'aside',
    'details',
    'div',
    'dt',
    'figcaption',
    'footer',
    'form',
    'fieldset',
    'header',
    'hgroup',
    'html',
    'main',
    'nav',
    'section',
    'summary',
    'body',
    'p',
    'dl',
    'multicol',
    'dd',
    'figure',
    'address',
    'center',
    'blockquote',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'listing',
    'xmp',
    'pre',
    'plaintext',
    'menu',
    'dir',
    'ul',
    'ol',
    'li',
    'hr',
    'table',
    'tbody',
    'thead',
    'tfoot',
    'th',
    'tr',
    'td',
    'caption'
  ];
  var voids = [
    'area',
    'base',
    'basefont',
    'br',
    'col',
    'frame',
    'hr',
    'img',
    'input',
    'isindex',
    'link',
    'meta',
    'param',
    'embed',
    'source',
    'wbr',
    'track'
  ];
  var tableCells = [
    'td',
    'th'
  ];
  var tableSections = [
    'thead',
    'tbody',
    'tfoot'
  ];
  var textBlocks = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'address',
    'pre',
    'form',
    'blockquote',
    'center',
    'dir',
    'fieldset',
    'header',
    'footer',
    'article',
    'section',
    'hgroup',
    'aside',
    'nav',
    'figure'
  ];
  var headings = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ];
  var listItems = [
    'li',
    'dd',
    'dt'
  ];
  var lists = [
    'ul',
    'ol',
    'dl'
  ];
  var lazyLookup = function (items) {
    var lookup;
    return function (node) {
      lookup = lookup ? lookup : $_20yqgb4jc7tm6aj.mapToObject(items, $_f41mrx6jc7tm6cd.constant(true));
      return lookup.hasOwnProperty($_4bxsjnzjc7tm6uw.name(node));
    };
  };
  var isHeading = lazyLookup(headings);
  var isBlock = lazyLookup(blocks);
  var isInline = function (node) {
    return $_4bxsjnzjc7tm6uw.isElement(node) && !isBlock(node);
  };
  var isBr = function (node) {
    return $_4bxsjnzjc7tm6uw.isElement(node) && $_4bxsjnzjc7tm6uw.name(node) === 'br';
  };
  var $_8zplag1pjc7tm70h = {
    isBlock: isBlock,
    isInline: isInline,
    isHeading: isHeading,
    isTextBlock: lazyLookup(textBlocks),
    isList: lazyLookup(lists),
    isListItem: lazyLookup(listItems),
    isVoid: lazyLookup(voids),
    isTableSection: lazyLookup(tableSections),
    isTableCell: lazyLookup(tableCells),
    isBr: isBr
  };

  var isNodeType = function (type) {
    return function (node) {
      return !!node && node.nodeType == type;
    };
  };
  var isElement$1 = isNodeType(1);
  var matchNodeNames = function (names) {
    names = names.toLowerCase().split(' ');
    return function (node) {
      var i, name;
      if (node && node.nodeType) {
        name = node.nodeName.toLowerCase();
        for (i = 0; i < names.length; i++) {
          if (name === names[i]) {
            return true;
          }
        }
      }
      return false;
    };
  };
  var matchStyleValues = function (name, values) {
    values = values.toLowerCase().split(' ');
    return function (node) {
      var i, cssValue;
      if (isElement$1(node)) {
        for (i = 0; i < values.length; i++) {
          cssValue = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyValue(name);
          if (cssValue === values[i]) {
            return true;
          }
        }
      }
      return false;
    };
  };
  var hasPropValue = function (propName, propValue) {
    return function (node) {
      return isElement$1(node) && node[propName] === propValue;
    };
  };
  var hasAttribute = function (attrName, attrValue) {
    return function (node) {
      return isElement$1(node) && node.hasAttribute(attrName);
    };
  };
  var hasAttributeValue = function (attrName, attrValue) {
    return function (node) {
      return isElement$1(node) && node.getAttribute(attrName) === attrValue;
    };
  };
  var isBogus = function (node) {
    return isElement$1(node) && node.hasAttribute('data-mce-bogus');
  };
  var hasContentEditableState = function (value) {
    return function (node) {
      if (isElement$1(node)) {
        if (node.contentEditable === value) {
          return true;
        }
        if (node.getAttribute('data-mce-contenteditable') === value) {
          return true;
        }
      }
      return false;
    };
  };
  var $_1qi2bn1qjc7tm70u = {
    isText: isNodeType(3),
    isElement: isElement$1,
    isComment: isNodeType(8),
    isDocument: isNodeType(9),
    isBr: matchNodeNames('br'),
    isContentEditableTrue: hasContentEditableState('true'),
    isContentEditableFalse: hasContentEditableState('false'),
    matchNodeNames: matchNodeNames,
    hasPropValue: hasPropValue,
    hasAttribute: hasAttribute,
    hasAttributeValue: hasAttributeValue,
    matchStyleValues: matchStyleValues,
    isBogus: isBogus
  };

  var surroundedBySpans = function (node) {
    var previousIsSpan = node.previousSibling && node.previousSibling.nodeName === 'SPAN';
    var nextIsSpan = node.nextSibling && node.nextSibling.nodeName === 'SPAN';
    return previousIsSpan && nextIsSpan;
  };
  var isBookmarkNode = function (node) {
    return node && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark';
  };
  var trimNode = function (dom, node) {
    var i, children = node.childNodes;
    if ($_1qi2bn1qjc7tm70u.isElement(node) && isBookmarkNode(node)) {
      return;
    }
    for (i = children.length - 1; i >= 0; i--) {
      trimNode(dom, children[i]);
    }
    if ($_1qi2bn1qjc7tm70u.isDocument(node) === false) {
      if ($_1qi2bn1qjc7tm70u.isText(node) && node.nodeValue.length > 0) {
        var trimmedLength = $_b8tc32jjc7tm6qi.trim(node.nodeValue).length;
        if (dom.isBlock(node.parentNode) || trimmedLength > 0) {
          return;
        }
        if (trimmedLength === 0 && surroundedBySpans(node)) {
          return;
        }
      } else if ($_1qi2bn1qjc7tm70u.isElement(node)) {
        children = node.childNodes;
        if (children.length === 1 && isBookmarkNode(children[0])) {
          node.parentNode.insertBefore(children[0], node);
        }
        if (children.length || $_8zplag1pjc7tm70h.isVoid($_bscr39yjc7tm6uo.fromDom(node))) {
          return;
        }
      }
      dom.remove(node);
    }
    return node;
  };
  var $_19jhoo1ojc7tm70b = { trimNode: trimNode };

  var makeMap$1 = $_b8tc32jjc7tm6qi.makeMap;
  var namedEntities;
  var baseEntities;
  var reverseEntities;
  var attrsCharsRegExp = /[&<>\"\u0060\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var rawCharsRegExp = /[<>&\"\']/g;
  var entityRegExp = /&#([a-z0-9]+);?|&([a-z0-9]+);/gi;
  var asciiMap = {
      128: '\u20AC',
      130: '\u201A',
      131: '\u0192',
      132: '\u201E',
      133: '\u2026',
      134: '\u2020',
      135: '\u2021',
      136: '\u02c6',
      137: '\u2030',
      138: '\u0160',
      139: '\u2039',
      140: '\u0152',
      142: '\u017d',
      145: '\u2018',
      146: '\u2019',
      147: '\u201C',
      148: '\u201D',
      149: '\u2022',
      150: '\u2013',
      151: '\u2014',
      152: '\u02DC',
      153: '\u2122',
      154: '\u0161',
      155: '\u203A',
      156: '\u0153',
      158: '\u017e',
      159: '\u0178'
    };
  baseEntities = {
    '"': '&quot;',
    '\'': '&#39;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '`': '&#96;'
  };
  reverseEntities = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': '\''
  };
  var nativeDecode = function (text) {
    var elm;
    elm = $_bscr39yjc7tm6uo.fromTag('div').dom();
    elm.innerHTML = text;
    return elm.textContent || elm.innerText || text;
  };
  var buildEntitiesLookup = function (items, radix) {
    var i, chr, entity, lookup = {};
    if (items) {
      items = items.split(',');
      radix = radix || 10;
      for (i = 0; i < items.length; i += 2) {
        chr = String.fromCharCode(parseInt(items[i], radix));
        if (!baseEntities[chr]) {
          entity = '&' + items[i + 1] + ';';
          lookup[chr] = entity;
          lookup[entity] = chr;
        }
      }
      return lookup;
    }
  };
  namedEntities = buildEntitiesLookup('50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' + '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' + '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' + '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' + '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' + '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' + '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' + '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' + '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' + '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' + 'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' + 'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' + 't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' + 'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' + 'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' + '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' + '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' + '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' + '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' + '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' + 'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' + 'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' + 'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' + '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' + '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32);
  var Entities = {
    encodeRaw: function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        return baseEntities[chr] || chr;
      });
    },
    encodeAllRaw: function (text) {
      return ('' + text).replace(rawCharsRegExp, function (chr) {
        return baseEntities[chr] || chr;
      });
    },
    encodeNumeric: function (text, attr) {
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        if (chr.length > 1) {
          return '&#' + ((chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536) + ';';
        }
        return baseEntities[chr] || '&#' + chr.charCodeAt(0) + ';';
      });
    },
    encodeNamed: function (text, attr, entities) {
      entities = entities || namedEntities;
      return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
        return baseEntities[chr] || entities[chr] || chr;
      });
    },
    getEncodeFunc: function (name, entities) {
      entities = buildEntitiesLookup(entities) || namedEntities;
      var encodeNamedAndNumeric = function (text, attr) {
        return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
          if (baseEntities[chr] !== undefined) {
            return baseEntities[chr];
          }
          if (entities[chr] !== undefined) {
            return entities[chr];
          }
          if (chr.length > 1) {
            return '&#' + ((chr.charCodeAt(0) - 55296) * 1024 + (chr.charCodeAt(1) - 56320) + 65536) + ';';
          }
          return '&#' + chr.charCodeAt(0) + ';';
        });
      };
      var encodeCustomNamed = function (text, attr) {
        return Entities.encodeNamed(text, attr, entities);
      };
      name = makeMap$1(name.replace(/\+/g, ','));
      if (name.named && name.numeric) {
        return encodeNamedAndNumeric;
      }
      if (name.named) {
        if (entities) {
          return encodeCustomNamed;
        }
        return Entities.encodeNamed;
      }
      if (name.numeric) {
        return Entities.encodeNumeric;
      }
      return Entities.encodeRaw;
    },
    decode: function (text) {
      return text.replace(entityRegExp, function (all, numeric) {
        if (numeric) {
          if (numeric.charAt(0).toLowerCase() === 'x') {
            numeric = parseInt(numeric.substr(1), 16);
          } else {
            numeric = parseInt(numeric, 10);
          }
          if (numeric > 65535) {
            numeric -= 65536;
            return String.fromCharCode(55296 + (numeric >> 10), 56320 + (numeric & 1023));
          }
          return asciiMap[numeric] || String.fromCharCode(numeric);
        }
        return reverseEntities[all] || namedEntities[all] || nativeDecode(all);
      });
    }
  };

  var mapCache = {};
  var dummyObj = {};
  var makeMap$2 = $_b8tc32jjc7tm6qi.makeMap;
  var each$7 = $_b8tc32jjc7tm6qi.each;
  var extend$1 = $_b8tc32jjc7tm6qi.extend;
  var explode$1 = $_b8tc32jjc7tm6qi.explode;
  var inArray$1 = $_b8tc32jjc7tm6qi.inArray;
  var split = function (items, delim) {
    items = $_b8tc32jjc7tm6qi.trim(items);
    return items ? items.split(delim || ' ') : [];
  };
  var compileSchema = function (type) {
    var schema = {}, globalAttributes, blockContent;
    var phrasingContent, flowContent, html4BlockContent, html4PhrasingContent;
    var add = function (name, attributes, children) {
      var ni, attributesOrder, element;
      var arrayToMap = function (array, obj) {
        var map = {}, i, l;
        for (i = 0, l = array.length; i < l; i++) {
          map[array[i]] = obj || {};
        }
        return map;
      };
      children = children || [];
      attributes = attributes || '';
      if (typeof children === 'string') {
        children = split(children);
      }
      name = split(name);
      ni = name.length;
      while (ni--) {
        attributesOrder = split([
          globalAttributes,
          attributes
        ].join(' '));
        element = {
          attributes: arrayToMap(attributesOrder),
          attributesOrder: attributesOrder,
          children: arrayToMap(children, dummyObj)
        };
        schema[name[ni]] = element;
      }
    };
    var addAttrs = function (name, attributes) {
      var ni, schemaItem, i, l;
      name = split(name);
      ni = name.length;
      attributes = split(attributes);
      while (ni--) {
        schemaItem = schema[name[ni]];
        for (i = 0, l = attributes.length; i < l; i++) {
          schemaItem.attributes[attributes[i]] = {};
          schemaItem.attributesOrder.push(attributes[i]);
        }
      }
    };
    if (mapCache[type]) {
      return mapCache[type];
    }
    globalAttributes = 'id accesskey class dir lang style tabindex title role';
    blockContent = 'address blockquote div dl fieldset form h1 h2 h3 h4 h5 h6 hr menu ol p pre table ul';
    phrasingContent = 'a abbr b bdo br button cite code del dfn em embed i iframe img input ins kbd ' + 'label map noscript object q s samp script select small span strong sub sup ' + 'textarea u var #text #comment';
    if (type != 'html4') {
      globalAttributes += ' contenteditable contextmenu draggable dropzone ' + 'hidden spellcheck translate';
      blockContent += ' article aside details dialog figure header footer hgroup section nav';
      phrasingContent += ' audio canvas command datalist mark meter output picture ' + 'progress time wbr video ruby bdi keygen';
    }
    if (type != 'html5-strict') {
      globalAttributes += ' xml:lang';
      html4PhrasingContent = 'acronym applet basefont big font strike tt';
      phrasingContent = [
        phrasingContent,
        html4PhrasingContent
      ].join(' ');
      each$7(split(html4PhrasingContent), function (name) {
        add(name, '', phrasingContent);
      });
      html4BlockContent = 'center dir isindex noframes';
      blockContent = [
        blockContent,
        html4BlockContent
      ].join(' ');
      flowContent = [
        blockContent,
        phrasingContent
      ].join(' ');
      each$7(split(html4BlockContent), function (name) {
        add(name, '', flowContent);
      });
    }
    flowContent = flowContent || [
      blockContent,
      phrasingContent
    ].join(' ');
    add('html', 'manifest', 'head body');
    add('head', '', 'base command link meta noscript script style title');
    add('title hr noscript br');
    add('base', 'href target');
    add('link', 'href rel media hreflang type sizes hreflang');
    add('meta', 'name http-equiv content charset');
    add('style', 'media type scoped');
    add('script', 'src async defer type charset');
    add('body', 'onafterprint onbeforeprint onbeforeunload onblur onerror onfocus ' + 'onhashchange onload onmessage onoffline ononline onpagehide onpageshow ' + 'onpopstate onresize onscroll onstorage onunload', flowContent);
    add('address dt dd div caption', '', flowContent);
    add('h1 h2 h3 h4 h5 h6 pre p abbr code var samp kbd sub sup i b u bdo span legend em strong small s cite dfn', '', phrasingContent);
    add('blockquote', 'cite', flowContent);
    add('ol', 'reversed start type', 'li');
    add('ul', '', 'li');
    add('li', 'value', flowContent);
    add('dl', '', 'dt dd');
    add('a', 'href target rel media hreflang type', phrasingContent);
    add('q', 'cite', phrasingContent);
    add('ins del', 'cite datetime', flowContent);
    add('img', 'src sizes srcset alt usemap ismap width height');
    add('iframe', 'src name width height', flowContent);
    add('embed', 'src type width height');
    add('object', 'data type typemustmatch name usemap form width height', [
      flowContent,
      'param'
    ].join(' '));
    add('param', 'name value');
    add('map', 'name', [
      flowContent,
      'area'
    ].join(' '));
    add('area', 'alt coords shape href target rel media hreflang type');
    add('table', 'border', 'caption colgroup thead tfoot tbody tr' + (type == 'html4' ? ' col' : ''));
    add('colgroup', 'span', 'col');
    add('col', 'span');
    add('tbody thead tfoot', '', 'tr');
    add('tr', '', 'td th');
    add('td', 'colspan rowspan headers', flowContent);
    add('th', 'colspan rowspan headers scope abbr', flowContent);
    add('form', 'accept-charset action autocomplete enctype method name novalidate target', flowContent);
    add('fieldset', 'disabled form name', [
      flowContent,
      'legend'
    ].join(' '));
    add('label', 'form for', phrasingContent);
    add('input', 'accept alt autocomplete checked dirname disabled form formaction formenctype formmethod formnovalidate ' + 'formtarget height list max maxlength min multiple name pattern readonly required size src step type value width');
    add('button', 'disabled form formaction formenctype formmethod formnovalidate formtarget name type value', type == 'html4' ? flowContent : phrasingContent);
    add('select', 'disabled form multiple name required size', 'option optgroup');
    add('optgroup', 'disabled label', 'option');
    add('option', 'disabled label selected value');
    add('textarea', 'cols dirname disabled form maxlength name readonly required rows wrap');
    add('menu', 'type label', [
      flowContent,
      'li'
    ].join(' '));
    add('noscript', '', flowContent);
    if (type != 'html4') {
      add('wbr');
      add('ruby', '', [
        phrasingContent,
        'rt rp'
      ].join(' '));
      add('figcaption', '', flowContent);
      add('mark rt rp summary bdi', '', phrasingContent);
      add('canvas', 'width height', flowContent);
      add('video', 'src crossorigin poster preload autoplay mediagroup loop ' + 'muted controls width height buffered', [
        flowContent,
        'track source'
      ].join(' '));
      add('audio', 'src crossorigin preload autoplay mediagroup loop muted controls ' + 'buffered volume', [
        flowContent,
        'track source'
      ].join(' '));
      add('picture', '', 'img source');
      add('source', 'src srcset type media sizes');
      add('track', 'kind src srclang label default');
      add('datalist', '', [
        phrasingContent,
        'option'
      ].join(' '));
      add('article section nav aside header footer', '', flowContent);
      add('hgroup', '', 'h1 h2 h3 h4 h5 h6');
      add('figure', '', [
        flowContent,
        'figcaption'
      ].join(' '));
      add('time', 'datetime', phrasingContent);
      add('dialog', 'open', flowContent);
      add('command', 'type label icon disabled checked radiogroup command');
      add('output', 'for form name', phrasingContent);
      add('progress', 'value max', phrasingContent);
      add('meter', 'value min max low high optimum', phrasingContent);
      add('details', 'open', [
        flowContent,
        'summary'
      ].join(' '));
      add('keygen', 'autofocus challenge disabled form keytype name');
    }
    if (type != 'html5-strict') {
      addAttrs('script', 'language xml:space');
      addAttrs('style', 'xml:space');
      addAttrs('object', 'declare classid code codebase codetype archive standby align border hspace vspace');
      addAttrs('embed', 'align name hspace vspace');
      addAttrs('param', 'valuetype type');
      addAttrs('a', 'charset name rev shape coords');
      addAttrs('br', 'clear');
      addAttrs('applet', 'codebase archive code object alt name width height align hspace vspace');
      addAttrs('img', 'name longdesc align border hspace vspace');
      addAttrs('iframe', 'longdesc frameborder marginwidth marginheight scrolling align');
      addAttrs('font basefont', 'size color face');
      addAttrs('input', 'usemap align');
      addAttrs('select', 'onchange');
      addAttrs('textarea');
      addAttrs('h1 h2 h3 h4 h5 h6 div p legend caption', 'align');
      addAttrs('ul', 'type compact');
      addAttrs('li', 'type');
      addAttrs('ol dl menu dir', 'compact');
      addAttrs('pre', 'width xml:space');
      addAttrs('hr', 'align noshade size width');
      addAttrs('isindex', 'prompt');
      addAttrs('table', 'summary width frame rules cellspacing cellpadding align bgcolor');
      addAttrs('col', 'width align char charoff valign');
      addAttrs('colgroup', 'width align char charoff valign');
      addAttrs('thead', 'align char charoff valign');
      addAttrs('tr', 'align char charoff valign bgcolor');
      addAttrs('th', 'axis align char charoff valign nowrap bgcolor width height');
      addAttrs('form', 'accept');
      addAttrs('td', 'abbr axis scope align char charoff valign nowrap bgcolor width height');
      addAttrs('tfoot', 'align char charoff valign');
      addAttrs('tbody', 'align char charoff valign');
      addAttrs('area', 'nohref');
      addAttrs('body', 'background bgcolor text link vlink alink');
    }
    if (type != 'html4') {
      addAttrs('input button select textarea', 'autofocus');
      addAttrs('input textarea', 'placeholder');
      addAttrs('a', 'download');
      addAttrs('link script img', 'crossorigin');
      addAttrs('iframe', 'sandbox seamless allowfullscreen');
    }
    each$7(split('a form meter progress dfn'), function (name) {
      if (schema[name]) {
        delete schema[name].children[name];
      }
    });
    delete schema.caption.children.table;
    delete schema.script;
    mapCache[type] = schema;
    return schema;
  };
  var compileElementMap = function (value, mode) {
    var styles;
    if (value) {
      styles = {};
      if (typeof value == 'string') {
        value = { '*': value };
      }
      each$7(value, function (value, key) {
        styles[key] = styles[key.toUpperCase()] = mode == 'map' ? makeMap$2(value, /[, ]/) : explode$1(value, /[, ]/);
      });
    }
    return styles;
  };
  var Schema = function (settings) {
    var self = {}, elements = {}, children = {}, patternElements = [], validStyles, invalidStyles, schemaItems;
    var whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, validClasses;
    var blockElementsMap, nonEmptyElementsMap, moveCaretBeforeOnEnterElementsMap, textBlockElementsMap, textInlineElementsMap;
    var customElementsMap = {}, specialElements = {};
    var createLookupTable = function (option, defaultValue, extendWith) {
      var value = settings[option];
      if (!value) {
        value = mapCache[option];
        if (!value) {
          value = makeMap$2(defaultValue, ' ', makeMap$2(defaultValue.toUpperCase(), ' '));
          value = extend$1(value, extendWith);
          mapCache[option] = value;
        }
      } else {
        value = makeMap$2(value, /[, ]/, makeMap$2(value.toUpperCase(), /[, ]/));
      }
      return value;
    };
    settings = settings || {};
    schemaItems = compileSchema(settings.schema);
    if (settings.verify_html === false) {
      settings.valid_elements = '*[*]';
    }
    validStyles = compileElementMap(settings.valid_styles);
    invalidStyles = compileElementMap(settings.invalid_styles, 'map');
    validClasses = compileElementMap(settings.valid_classes, 'map');
    whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea video audio iframe object code');
    selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr');
    shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link ' + 'meta param embed source wbr track');
    boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize ' + 'noshade nowrap readonly selected autoplay loop controls');
    nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object ' + 'script pre code', shortEndedElementsMap);
    moveCaretBeforeOnEnterElementsMap = createLookupTable('move_caret_before_on_enter_elements', 'table', nonEmptyElementsMap);
    textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' + 'blockquote center dir fieldset header footer article section hgroup aside nav figure');
    blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' + 'th tr td li ol ul caption dl dt dd noscript menu isindex option ' + 'datalist select optgroup figcaption', textBlockElementsMap);
    textInlineElementsMap = createLookupTable('text_inline_elements', 'span strong b em i font strike u var cite ' + 'dfn code mark q sup sub samp');
    each$7((settings.special || 'script noscript noframes noembed title style textarea xmp').split(' '), function (name) {
      specialElements[name] = new RegExp('</' + name + '[^>]*>', 'gi');
    });
    var patternToRegExp = function (str) {
      return new RegExp('^' + str.replace(/([?+*])/g, '.$1') + '$');
    };
    var addValidElements = function (validElements) {
      var ei, el, ai, al, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder, prefix, outputName, globalAttributes, globalAttributesOrder, key, value, elementRuleRegExp = /^([#+\-])?([^\[!\/]+)(?:\/([^\[!]+))?(?:(!?)\[([^\]]+)\])?$/, attrRuleRegExp = /^([!\-])?(\w+[\\:]:\w+|[^=:<]+)?(?:([=:<])(.*))?$/, hasPatternsRegExp = /[*?+]/;
      if (validElements) {
        validElements = split(validElements, ',');
        if (elements['@']) {
          globalAttributes = elements['@'].attributes;
          globalAttributesOrder = elements['@'].attributesOrder;
        }
        for (ei = 0, el = validElements.length; ei < el; ei++) {
          matches = elementRuleRegExp.exec(validElements[ei]);
          if (matches) {
            prefix = matches[1];
            elementName = matches[2];
            outputName = matches[3];
            attrData = matches[5];
            attributes = {};
            attributesOrder = [];
            element = {
              attributes: attributes,
              attributesOrder: attributesOrder
            };
            if (prefix === '#') {
              element.paddEmpty = true;
            }
            if (prefix === '-') {
              element.removeEmpty = true;
            }
            if (matches[4] === '!') {
              element.removeEmptyAttrs = true;
            }
            if (globalAttributes) {
              for (key in globalAttributes) {
                attributes[key] = globalAttributes[key];
              }
              attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
            }
            if (attrData) {
              attrData = split(attrData, '|');
              for (ai = 0, al = attrData.length; ai < al; ai++) {
                matches = attrRuleRegExp.exec(attrData[ai]);
                if (matches) {
                  attr = {};
                  attrType = matches[1];
                  attrName = matches[2].replace(/[\\:]:/g, ':');
                  prefix = matches[3];
                  value = matches[4];
                  if (attrType === '!') {
                    element.attributesRequired = element.attributesRequired || [];
                    element.attributesRequired.push(attrName);
                    attr.required = true;
                  }
                  if (attrType === '-') {
                    delete attributes[attrName];
                    attributesOrder.splice(inArray$1(attributesOrder, attrName), 1);
                    continue;
                  }
                  if (prefix) {
                    if (prefix === '=') {
                      element.attributesDefault = element.attributesDefault || [];
                      element.attributesDefault.push({
                        name: attrName,
                        value: value
                      });
                      attr.defaultValue = value;
                    }
                    if (prefix === ':') {
                      element.attributesForced = element.attributesForced || [];
                      element.attributesForced.push({
                        name: attrName,
                        value: value
                      });
                      attr.forcedValue = value;
                    }
                    if (prefix === '<') {
                      attr.validValues = makeMap$2(value, '?');
                    }
                  }
                  if (hasPatternsRegExp.test(attrName)) {
                    element.attributePatterns = element.attributePatterns || [];
                    attr.pattern = patternToRegExp(attrName);
                    element.attributePatterns.push(attr);
                  } else {
                    if (!attributes[attrName]) {
                      attributesOrder.push(attrName);
                    }
                    attributes[attrName] = attr;
                  }
                }
              }
            }
            if (!globalAttributes && elementName == '@') {
              globalAttributes = attributes;
              globalAttributesOrder = attributesOrder;
            }
            if (outputName) {
              element.outputName = elementName;
              elements[outputName] = element;
            }
            if (hasPatternsRegExp.test(elementName)) {
              element.pattern = patternToRegExp(elementName);
              patternElements.push(element);
            } else {
              elements[elementName] = element;
            }
          }
        }
      }
    };
    var setValidElements = function (validElements) {
      elements = {};
      patternElements = [];
      addValidElements(validElements);
      each$7(schemaItems, function (element, name) {
        children[name] = element.children;
      });
    };
    var addCustomElements = function (customElements) {
      var customElementRegExp = /^(~)?(.+)$/;
      if (customElements) {
        mapCache.text_block_elements = mapCache.block_elements = null;
        each$7(split(customElements, ','), function (rule) {
          var matches = customElementRegExp.exec(rule), inline = matches[1] === '~', cloneName = inline ? 'span' : 'div', name = matches[2];
          children[name] = children[cloneName];
          customElementsMap[name] = cloneName;
          if (!inline) {
            blockElementsMap[name.toUpperCase()] = {};
            blockElementsMap[name] = {};
          }
          if (!elements[name]) {
            var customRule = elements[cloneName];
            customRule = extend$1({}, customRule);
            delete customRule.removeEmptyAttrs;
            delete customRule.removeEmpty;
            elements[name] = customRule;
          }
          each$7(children, function (element, elmName) {
            if (element[cloneName]) {
              children[elmName] = element = extend$1({}, children[elmName]);
              element[name] = element[cloneName];
            }
          });
        });
      }
    };
    var addValidChildren = function (validChildren) {
      var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/;
      mapCache[settings.schema] = null;
      if (validChildren) {
        each$7(split(validChildren, ','), function (rule) {
          var matches = childRuleRegExp.exec(rule), parent, prefix;
          if (matches) {
            prefix = matches[1];
            if (prefix) {
              parent = children[matches[2]];
            } else {
              parent = children[matches[2]] = { '#comment': {} };
            }
            parent = children[matches[2]];
            each$7(split(matches[3], '|'), function (child) {
              if (prefix === '-') {
                delete parent[child];
              } else {
                parent[child] = {};
              }
            });
          }
        });
      }
    };
    var getElementRule = function (name) {
      var element = elements[name], i;
      if (element) {
        return element;
      }
      i = patternElements.length;
      while (i--) {
        element = patternElements[i];
        if (element.pattern.test(name)) {
          return element;
        }
      }
    };
    if (!settings.valid_elements) {
      each$7(schemaItems, function (element, name) {
        elements[name] = {
          attributes: element.attributes,
          attributesOrder: element.attributesOrder
        };
        children[name] = element.children;
      });
      if (settings.schema != 'html5') {
        each$7(split('strong/b em/i'), function (item) {
          item = split(item, '/');
          elements[item[1]].outputName = item[0];
        });
      }
      each$7(split('ol ul sub sup blockquote span font a table tbody tr strong em b i'), function (name) {
        if (elements[name]) {
          elements[name].removeEmpty = true;
        }
      });
      each$7(split('p h1 h2 h3 h4 h5 h6 th td pre div address caption li'), function (name) {
        elements[name].paddEmpty = true;
      });
      each$7(split('span'), function (name) {
        elements[name].removeEmptyAttrs = true;
      });
    } else {
      setValidElements(settings.valid_elements);
    }
    addCustomElements(settings.custom_elements);
    addValidChildren(settings.valid_children);
    addValidElements(settings.extended_valid_elements);
    addValidChildren('+ol[ul|ol],+ul[ul|ol]');
    each$7({
      dd: 'dl',
      dt: 'dl',
      li: 'ul ol',
      td: 'tr',
      th: 'tr',
      tr: 'tbody thead tfoot',
      tbody: 'table',
      thead: 'table',
      tfoot: 'table',
      legend: 'fieldset',
      area: 'map',
      param: 'video audio object'
    }, function (parents, item) {
      if (elements[item]) {
        elements[item].parentsRequired = split(parents);
      }
    });
    if (settings.invalid_elements) {
      each$7(explode$1(settings.invalid_elements), function (item) {
        if (elements[item]) {
          delete elements[item];
        }
      });
    }
    if (!getElementRule('span')) {
      addValidElements('span[!data-mce-type|*]');
    }
    self.children = children;
    self.getValidStyles = function () {
      return validStyles;
    };
    self.getInvalidStyles = function () {
      return invalidStyles;
    };
    self.getValidClasses = function () {
      return validClasses;
    };
    self.getBoolAttrs = function () {
      return boolAttrMap;
    };
    self.getBlockElements = function () {
      return blockElementsMap;
    };
    self.getTextBlockElements = function () {
      return textBlockElementsMap;
    };
    self.getTextInlineElements = function () {
      return textInlineElementsMap;
    };
    self.getShortEndedElements = function () {
      return shortEndedElementsMap;
    };
    self.getSelfClosingElements = function () {
      return selfClosingElementsMap;
    };
    self.getNonEmptyElements = function () {
      return nonEmptyElementsMap;
    };
    self.getMoveCaretBeforeOnEnterElements = function () {
      return moveCaretBeforeOnEnterElementsMap;
    };
    self.getWhiteSpaceElements = function () {
      return whiteSpaceElementsMap;
    };
    self.getSpecialElements = function () {
      return specialElements;
    };
    self.isValidChild = function (name, child) {
      var parent = children[name.toLowerCase()];
      return !!(parent && parent[child.toLowerCase()]);
    };
    self.isValid = function (name, attr) {
      var attrPatterns, i, rule = getElementRule(name);
      if (rule) {
        if (attr) {
          if (rule.attributes[attr]) {
            return true;
          }
          attrPatterns = rule.attributePatterns;
          if (attrPatterns) {
            i = attrPatterns.length;
            while (i--) {
              if (attrPatterns[i].pattern.test(name)) {
                return true;
              }
            }
          }
        } else {
          return true;
        }
      }
      return false;
    };
    self.getElementRule = getElementRule;
    self.getCustomElements = function () {
      return customElementsMap;
    };
    self.addValidElements = addValidElements;
    self.setValidElements = setValidElements;
    self.addCustomElements = addCustomElements;
    self.addValidChildren = addValidChildren;
    self.elements = elements;
    return self;
  };

  var Styles = function (settings, schema) {
    var rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi, urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi, styleRegExp = /\s*([^:]+):\s*([^;]+);?/g, trimRightRegExp = /\s+$/, i, encodingLookup = {}, encodingItems, validStyles, invalidStyles, invisibleChar = '\uFEFF';
    settings = settings || {};
    if (schema) {
      validStyles = schema.getValidStyles();
      invalidStyles = schema.getInvalidStyles();
    }
    encodingItems = ('\\" \\\' \\; \\: ; : ' + invisibleChar).split(' ');
    for (i = 0; i < encodingItems.length; i++) {
      encodingLookup[encodingItems[i]] = invisibleChar + i;
      encodingLookup[invisibleChar + i] = encodingItems[i];
    }
    var toHex = function (match, r, g, b) {
      var hex = function (val) {
        val = parseInt(val, 10).toString(16);
        return val.length > 1 ? val : '0' + val;
      };
      return '#' + hex(r) + hex(g) + hex(b);
    };
    return {
      toHex: function (color) {
        return color.replace(rgbRegExp, toHex);
      },
      parse: function (css) {
        var styles = {}, matches, name, value, isEncoded, urlConverter = settings.url_converter;
        var urlConverterScope = settings.url_converter_scope || this;
        var compress = function (prefix, suffix, noJoin) {
          var top, right, bottom, left;
          top = styles[prefix + '-top' + suffix];
          if (!top) {
            return;
          }
          right = styles[prefix + '-right' + suffix];
          if (!right) {
            return;
          }
          bottom = styles[prefix + '-bottom' + suffix];
          if (!bottom) {
            return;
          }
          left = styles[prefix + '-left' + suffix];
          if (!left) {
            return;
          }
          var box = [
            top,
            right,
            bottom,
            left
          ];
          i = box.length - 1;
          while (i--) {
            if (box[i] !== box[i + 1]) {
              break;
            }
          }
          if (i > -1 && noJoin) {
            return;
          }
          styles[prefix + suffix] = i == -1 ? box[0] : box.join(' ');
          delete styles[prefix + '-top' + suffix];
          delete styles[prefix + '-right' + suffix];
          delete styles[prefix + '-bottom' + suffix];
          delete styles[prefix + '-left' + suffix];
        };
        var canCompress = function (key) {
          var value = styles[key], i;
          if (!value) {
            return;
          }
          value = value.split(' ');
          i = value.length;
          while (i--) {
            if (value[i] !== value[0]) {
              return false;
            }
          }
          styles[key] = value[0];
          return true;
        };
        var compress2 = function (target, a, b, c) {
          if (!canCompress(a)) {
            return;
          }
          if (!canCompress(b)) {
            return;
          }
          if (!canCompress(c)) {
            return;
          }
          styles[target] = styles[a] + ' ' + styles[b] + ' ' + styles[c];
          delete styles[a];
          delete styles[b];
          delete styles[c];
        };
        var encode = function (str) {
          isEncoded = true;
          return encodingLookup[str];
        };
        var decode = function (str, keepSlashes) {
          if (isEncoded) {
            str = str.replace(/\uFEFF[0-9]/g, function (str) {
              return encodingLookup[str];
            });
          }
          if (!keepSlashes) {
            str = str.replace(/\\([\'\";:])/g, '$1');
          }
          return str;
        };
        var decodeSingleHexSequence = function (escSeq) {
          return String.fromCharCode(parseInt(escSeq.slice(1), 16));
        };
        var decodeHexSequences = function (value) {
          return value.replace(/\\[0-9a-f]+/gi, decodeSingleHexSequence);
        };
        var processUrl = function (match, url, url2, url3, str, str2) {
          str = str || str2;
          if (str) {
            str = decode(str);
            return '\'' + str.replace(/\'/g, '\\\'') + '\'';
          }
          url = decode(url || url2 || url3);
          if (!settings.allow_script_urls) {
            var scriptUrl = url.replace(/[\s\r\n]+/g, '');
            if (/(java|vb)script:/i.test(scriptUrl)) {
              return '';
            }
            if (!settings.allow_svg_data_urls && /^data:image\/svg/i.test(scriptUrl)) {
              return '';
            }
          }
          if (urlConverter) {
            url = urlConverter.call(urlConverterScope, url, 'style');
          }
          return 'url(\'' + url.replace(/\'/g, '\\\'') + '\')';
        };
        if (css) {
          css = css.replace(/[\u0000-\u001F]/g, '');
          css = css.replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, function (str) {
            return str.replace(/[;:]/g, encode);
          });
          while (matches = styleRegExp.exec(css)) {
            styleRegExp.lastIndex = matches.index + matches[0].length;
            name = matches[1].replace(trimRightRegExp, '').toLowerCase();
            value = matches[2].replace(trimRightRegExp, '');
            if (name && value) {
              name = decodeHexSequences(name);
              value = decodeHexSequences(value);
              if (name.indexOf(invisibleChar) !== -1 || name.indexOf('"') !== -1) {
                continue;
              }
              if (!settings.allow_script_urls && (name == 'behavior' || /expression\s*\(|\/\*|\*\//.test(value))) {
                continue;
              }
              if (name === 'font-weight' && value === '700') {
                value = 'bold';
              } else if (name === 'color' || name === 'background-color') {
                value = value.toLowerCase();
              }
              value = value.replace(rgbRegExp, toHex);
              value = value.replace(urlOrStrRegExp, processUrl);
              styles[name] = isEncoded ? decode(value, true) : value;
            }
          }
          compress('border', '', true);
          compress('border', '-width');
          compress('border', '-color');
          compress('border', '-style');
          compress('padding', '');
          compress('margin', '');
          compress2('border', 'border-width', 'border-style', 'border-color');
          if (styles.border === 'medium none') {
            delete styles.border;
          }
          if (styles['border-image'] === 'none') {
            delete styles['border-image'];
          }
        }
        return styles;
      },
      serialize: function (styles, elementName) {
        var css = '', name, value;
        var serializeStyles = function (name) {
          var styleList, i, l, value;
          styleList = validStyles[name];
          if (styleList) {
            for (i = 0, l = styleList.length; i < l; i++) {
              name = styleList[i];
              value = styles[name];
              if (value) {
                css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
              }
            }
          }
        };
        var isValid = function (name, elementName) {
          var styleMap;
          styleMap = invalidStyles['*'];
          if (styleMap && styleMap[name]) {
            return false;
          }
          styleMap = invalidStyles[elementName];
          if (styleMap && styleMap[name]) {
            return false;
          }
          return true;
        };
        if (elementName && validStyles) {
          serializeStyles('*');
          serializeStyles(elementName);
        } else {
          for (name in styles) {
            value = styles[name];
            if (value && (!invalidStyles || isValid(name, elementName))) {
              css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
            }
          }
        }
        return css;
      }
    };
  };

  var each$3 = $_b8tc32jjc7tm6qi.each;
  var is = $_b8tc32jjc7tm6qi.is;
  var grep$1 = $_b8tc32jjc7tm6qi.grep;
  var isIE = $_dtgtsy9jc7tm6gs.ie;
  var simpleSelectorRe = /^([a-z0-9],?)+$/i;
  var whiteSpaceRegExp = /^[ \t\r\n]*$/;
  var setupAttrHooks = function (domUtils, settings) {
    var attrHooks = {}, keepValues = settings.keep_values, keepUrlHook;
    keepUrlHook = {
      set: function ($elm, value, name) {
        if (settings.url_converter) {
          value = settings.url_converter.call(settings.url_converter_scope || domUtils, value, name, $elm[0]);
        }
        $elm.attr('data-mce-' + name, value).attr(name, value);
      },
      get: function ($elm, name) {
        return $elm.attr('data-mce-' + name) || $elm.attr(name);
      }
    };
    attrHooks = {
      style: {
        set: function ($elm, value) {
          if (value !== null && typeof value === 'object') {
            $elm.css(value);
            return;
          }
          if (keepValues) {
            $elm.attr('data-mce-style', value);
          }
          $elm.attr('style', value);
        },
        get: function ($elm) {
          var value = $elm.attr('data-mce-style') || $elm.attr('style');
          value = domUtils.serializeStyle(domUtils.parseStyle(value), $elm[0].nodeName);
          return value;
        }
      }
    };
    if (keepValues) {
      attrHooks.href = attrHooks.src = keepUrlHook;
    }
    return attrHooks;
  };
  var updateInternalStyleAttr = function (domUtils, $elm) {
    var value = $elm.attr('style');
    value = domUtils.serializeStyle(domUtils.parseStyle(value), $elm[0].nodeName);
    if (!value) {
      value = null;
    }
    $elm.attr('data-mce-style', value);
  };
  var nodeIndex = function (node, normalized) {
    var idx = 0, lastNodeType, nodeType;
    if (node) {
      for (lastNodeType = node.nodeType, node = node.previousSibling; node; node = node.previousSibling) {
        nodeType = node.nodeType;
        if (normalized && nodeType == 3) {
          if (nodeType == lastNodeType || !node.nodeValue.length) {
            continue;
          }
        }
        idx++;
        lastNodeType = nodeType;
      }
    }
    return idx;
  };
  var DOMUtils = function (doc, settings) {
    var self = this, blockElementsMap;
    self.doc = doc;
    self.win = window;
    self.files = {};
    self.counter = 0;
    self.stdMode = !isIE || doc.documentMode >= 8;
    self.boxModel = !isIE || doc.compatMode == 'CSS1Compat' || self.stdMode;
    self.styleSheetLoader = StyleSheetLoader(doc);
    self.boundEvents = [];
    self.settings = settings = settings || {};
    self.schema = settings.schema ? settings.schema : Schema({});
    self.styles = Styles({
      url_converter: settings.url_converter,
      url_converter_scope: settings.url_converter_scope
    }, settings.schema);
    self.fixDoc(doc);
    self.events = settings.ownEvents ? new EventUtils(settings.proxy) : EventUtils.Event;
    self.attrHooks = setupAttrHooks(self, settings);
    blockElementsMap = self.schema.getBlockElements();
    self.$ = DomQuery.overrideDefaults(function () {
      return {
        context: doc,
        element: self.getRoot()
      };
    });
    self.isBlock = function (node) {
      if (!node) {
        return false;
      }
      var type = node.nodeType;
      if (type) {
        return !!(type === 1 && blockElementsMap[node.nodeName]);
      }
      return !!blockElementsMap[node];
    };
  };
  DOMUtils.prototype = {
    $$: function (elm) {
      if (typeof elm == 'string') {
        elm = this.get(elm);
      }
      return this.$(elm);
    },
    root: null,
    fixDoc: function (doc) {
    },
    clone: function (node, deep) {
      var self = this, clone, doc;
      if (!isIE || node.nodeType !== 1 || deep) {
        return node.cloneNode(deep);
      }
      doc = self.doc;
      if (!deep) {
        clone = doc.createElement(node.nodeName);
        each$3(self.getAttribs(node), function (attr) {
          self.setAttrib(clone, attr.nodeName, self.getAttrib(node, attr.nodeName));
        });
        return clone;
      }
      return clone.firstChild;
    },
    getRoot: function () {
      var self = this;
      return self.settings.root_element || self.doc.body;
    },
    getViewPort: function (win) {
      var doc, rootElm;
      win = !win ? this.win : win;
      doc = win.document;
      rootElm = this.boxModel ? doc.documentElement : doc.body;
      return {
        x: win.pageXOffset || rootElm.scrollLeft,
        y: win.pageYOffset || rootElm.scrollTop,
        w: win.innerWidth || rootElm.clientWidth,
        h: win.innerHeight || rootElm.clientHeight
      };
    },
    getRect: function (elm) {
      var self = this, pos, size;
      elm = self.get(elm);
      pos = self.getPos(elm);
      size = self.getSize(elm);
      return {
        x: pos.x,
        y: pos.y,
        w: size.w,
        h: size.h
      };
    },
    getSize: function (elm) {
      var self = this, w, h;
      elm = self.get(elm);
      w = self.getStyle(elm, 'width');
      h = self.getStyle(elm, 'height');
      if (w.indexOf('px') === -1) {
        w = 0;
      }
      if (h.indexOf('px') === -1) {
        h = 0;
      }
      return {
        w: parseInt(w, 10) || elm.offsetWidth || elm.clientWidth,
        h: parseInt(h, 10) || elm.offsetHeight || elm.clientHeight
      };
    },
    getParent: function (node, selector, root) {
      return this.getParents(node, selector, root, false);
    },
    getParents: function (node, selector, root, collect) {
      var self = this, selectorVal, result = [];
      node = self.get(node);
      collect = collect === undefined;
      root = root || (self.getRoot().nodeName != 'BODY' ? self.getRoot().parentNode : null);
      if (is(selector, 'string')) {
        selectorVal = selector;
        if (selector === '*') {
          selector = function (node) {
            return node.nodeType == 1;
          };
        } else {
          selector = function (node) {
            return self.is(node, selectorVal);
          };
        }
      }
      while (node) {
        if (node == root || !node.nodeType || node.nodeType === 9) {
          break;
        }
        if (!selector || selector(node)) {
          if (collect) {
            result.push(node);
          } else {
            return node;
          }
        }
        node = node.parentNode;
      }
      return collect ? result : null;
    },
    get: function (elm) {
      var name;
      if (elm && this.doc && typeof elm == 'string') {
        name = elm;
        elm = this.doc.getElementById(elm);
        if (elm && elm.id !== name) {
          return this.doc.getElementsByName(name)[1];
        }
      }
      return elm;
    },
    getNext: function (node, selector) {
      return this._findSib(node, selector, 'nextSibling');
    },
    getPrev: function (node, selector) {
      return this._findSib(node, selector, 'previousSibling');
    },
    select: function (selector, scope) {
      var self = this;
      return Sizzle(selector, self.get(scope) || self.settings.root_element || self.doc, []);
    },
    is: function (elm, selector) {
      var i;
      if (!elm) {
        return false;
      }
      if (elm.length === undefined) {
        if (selector === '*') {
          return elm.nodeType == 1;
        }
        if (simpleSelectorRe.test(selector)) {
          selector = selector.toLowerCase().split(/,/);
          elm = elm.nodeName.toLowerCase();
          for (i = selector.length - 1; i >= 0; i--) {
            if (selector[i] == elm) {
              return true;
            }
          }
          return false;
        }
      }
      if (elm.nodeType && elm.nodeType != 1) {
        return false;
      }
      var elms = elm.nodeType ? [elm] : elm;
      return Sizzle(selector, elms[0].ownerDocument || elms[0], null, elms).length > 0;
    },
    add: function (parentElm, name, attrs, html, create) {
      var self = this;
      return this.run(parentElm, function (parentElm) {
        var newElm;
        newElm = is(name, 'string') ? self.doc.createElement(name) : name;
        self.setAttribs(newElm, attrs);
        if (html) {
          if (html.nodeType) {
            newElm.appendChild(html);
          } else {
            self.setHTML(newElm, html);
          }
        }
        return !create ? parentElm.appendChild(newElm) : newElm;
      });
    },
    create: function (name, attrs, html) {
      return this.add(this.doc.createElement(name), name, attrs, html, 1);
    },
    createHTML: function (name, attrs, html) {
      var outHtml = '', key;
      outHtml += '<' + name;
      for (key in attrs) {
        if (attrs.hasOwnProperty(key) && attrs[key] !== null && typeof attrs[key] != 'undefined') {
          outHtml += ' ' + key + '="' + this.encode(attrs[key]) + '"';
        }
      }
      if (typeof html != 'undefined') {
        return outHtml + '>' + html + '</' + name + '>';
      }
      return outHtml + ' />';
    },
    createFragment: function (html) {
      var frag, node, doc = this.doc, container;
      container = doc.createElement('div');
      frag = doc.createDocumentFragment();
      if (html) {
        container.innerHTML = html;
      }
      while (node = container.firstChild) {
        frag.appendChild(node);
      }
      return frag;
    },
    remove: function (node, keepChildren) {
      node = this.$$(node);
      if (keepChildren) {
        node.each(function () {
          var child;
          while (child = this.firstChild) {
            if (child.nodeType == 3 && child.data.length === 0) {
              this.removeChild(child);
            } else {
              this.parentNode.insertBefore(child, this);
            }
          }
        }).remove();
      } else {
        node.remove();
      }
      return node.length > 1 ? node.toArray() : node[0];
    },
    setStyle: function (elm, name, value) {
      elm = this.$$(elm).css(name, value);
      if (this.settings.update_styles) {
        updateInternalStyleAttr(this, elm);
      }
    },
    getStyle: function (elm, name, computed) {
      elm = this.$$(elm);
      if (computed) {
        return elm.css(name);
      }
      name = name.replace(/-(\D)/g, function (a, b) {
        return b.toUpperCase();
      });
      if (name == 'float') {
        name = $_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 12 ? 'styleFloat' : 'cssFloat';
      }
      return elm[0] && elm[0].style ? elm[0].style[name] : undefined;
    },
    setStyles: function (elm, styles) {
      elm = this.$$(elm).css(styles);
      if (this.settings.update_styles) {
        updateInternalStyleAttr(this, elm);
      }
    },
    removeAllAttribs: function (e) {
      return this.run(e, function (e) {
        var i, attrs = e.attributes;
        for (i = attrs.length - 1; i >= 0; i--) {
          e.removeAttributeNode(attrs.item(i));
        }
      });
    },
    setAttrib: function (elm, name, value) {
      var self = this, originalValue, hook, settings = self.settings;
      if (value === '') {
        value = null;
      }
      elm = self.$$(elm);
      originalValue = elm.attr(name);
      if (!elm.length) {
        return;
      }
      hook = self.attrHooks[name];
      if (hook && hook.set) {
        hook.set(elm, value, name);
      } else {
        elm.attr(name, value);
      }
      if (originalValue != value && settings.onSetAttrib) {
        settings.onSetAttrib({
          attrElm: elm,
          attrName: name,
          attrValue: value
        });
      }
    },
    setAttribs: function (elm, attrs) {
      var self = this;
      self.$$(elm).each(function (i, node) {
        each$3(attrs, function (value, name) {
          self.setAttrib(node, name, value);
        });
      });
    },
    getAttrib: function (elm, name, defaultVal) {
      var self = this, hook, value;
      elm = self.$$(elm);
      if (elm.length) {
        hook = self.attrHooks[name];
        if (hook && hook.get) {
          value = hook.get(elm, name);
        } else {
          value = elm.attr(name);
        }
      }
      if (typeof value == 'undefined') {
        value = defaultVal || '';
      }
      return value;
    },
    getPos: function (elm, rootElm) {
      return $_1j5tgoljc7tm6rt.getPos(this.doc.body, this.get(elm), rootElm);
    },
    parseStyle: function (cssText) {
      return this.styles.parse(cssText);
    },
    serializeStyle: function (styles, name) {
      return this.styles.serialize(styles, name);
    },
    addStyle: function (cssText) {
      var self = this, doc = self.doc, head, styleElm;
      if (self !== DOMUtils.DOM && doc === document) {
        var addedStyles = DOMUtils.DOM.addedStyles;
        addedStyles = addedStyles || [];
        if (addedStyles[cssText]) {
          return;
        }
        addedStyles[cssText] = true;
        DOMUtils.DOM.addedStyles = addedStyles;
      }
      styleElm = doc.getElementById('mceDefaultStyles');
      if (!styleElm) {
        styleElm = doc.createElement('style');
        styleElm.id = 'mceDefaultStyles';
        styleElm.type = 'text/css';
        head = doc.getElementsByTagName('head')[0];
        if (head.firstChild) {
          head.insertBefore(styleElm, head.firstChild);
        } else {
          head.appendChild(styleElm);
        }
      }
      if (styleElm.styleSheet) {
        styleElm.styleSheet.cssText += cssText;
      } else {
        styleElm.appendChild(doc.createTextNode(cssText));
      }
    },
    loadCSS: function (url) {
      var self = this, doc = self.doc, head;
      if (self !== DOMUtils.DOM && doc === document) {
        DOMUtils.DOM.loadCSS(url);
        return;
      }
      if (!url) {
        url = '';
      }
      head = doc.getElementsByTagName('head')[0];
      each$3(url.split(','), function (url) {
        var link;
        url = $_b8tc32jjc7tm6qi._addCacheSuffix(url);
        if (self.files[url]) {
          return;
        }
        self.files[url] = true;
        link = self.create('link', {
          rel: 'stylesheet',
          href: url
        });
        if (isIE && doc.documentMode && doc.recalc) {
          link.onload = function () {
            if (doc.recalc) {
              doc.recalc();
            }
            link.onload = null;
          };
        }
        head.appendChild(link);
      });
    },
    addClass: function (elm, cls) {
      this.$$(elm).addClass(cls);
    },
    removeClass: function (elm, cls) {
      this.toggleClass(elm, cls, false);
    },
    hasClass: function (elm, cls) {
      return this.$$(elm).hasClass(cls);
    },
    toggleClass: function (elm, cls, state) {
      this.$$(elm).toggleClass(cls, state).each(function () {
        if (this.className === '') {
          DomQuery(this).attr('class', null);
        }
      });
    },
    show: function (elm) {
      this.$$(elm).show();
    },
    hide: function (elm) {
      this.$$(elm).hide();
    },
    isHidden: function (elm) {
      return this.$$(elm).css('display') == 'none';
    },
    uniqueId: function (prefix) {
      return (!prefix ? 'mce_' : prefix) + this.counter++;
    },
    setHTML: function (elm, html) {
      elm = this.$$(elm);
      if (isIE) {
        elm.each(function (i, target) {
          if (target.canHaveHTML === false) {
            return;
          }
          while (target.firstChild) {
            target.removeChild(target.firstChild);
          }
          try {
            target.innerHTML = '<br>' + html;
            target.removeChild(target.firstChild);
          } catch (ex) {
            DomQuery('<div></div>').html('<br>' + html).contents().slice(1).appendTo(target);
          }
          return html;
        });
      } else {
        elm.html(html);
      }
    },
    getOuterHTML: function (elm) {
      elm = this.get(elm);
      return elm.nodeType == 1 && 'outerHTML' in elm ? elm.outerHTML : DomQuery('<div></div>').append(DomQuery(elm).clone()).html();
    },
    setOuterHTML: function (elm, html) {
      var self = this;
      self.$$(elm).each(function () {
        try {
          if ('outerHTML' in this) {
            this.outerHTML = html;
            return;
          }
        } catch (ex) {
        }
        self.remove(DomQuery(this).html(html), true);
      });
    },
    decode: Entities.decode,
    encode: Entities.encodeAllRaw,
    insertAfter: function (node, referenceNode) {
      referenceNode = this.get(referenceNode);
      return this.run(node, function (node) {
        var parent, nextSibling;
        parent = referenceNode.parentNode;
        nextSibling = referenceNode.nextSibling;
        if (nextSibling) {
          parent.insertBefore(node, nextSibling);
        } else {
          parent.appendChild(node);
        }
        return node;
      });
    },
    replace: function (newElm, oldElm, keepChildren) {
      var self = this;
      return self.run(oldElm, function (oldElm) {
        if (is(oldElm, 'array')) {
          newElm = newElm.cloneNode(true);
        }
        if (keepChildren) {
          each$3(grep$1(oldElm.childNodes), function (node) {
            newElm.appendChild(node);
          });
        }
        return oldElm.parentNode.replaceChild(newElm, oldElm);
      });
    },
    rename: function (elm, name) {
      var self = this, newElm;
      if (elm.nodeName != name.toUpperCase()) {
        newElm = self.create(name);
        each$3(self.getAttribs(elm), function (attrNode) {
          self.setAttrib(newElm, attrNode.nodeName, self.getAttrib(elm, attrNode.nodeName));
        });
        self.replace(newElm, elm, 1);
      }
      return newElm || elm;
    },
    findCommonAncestor: function (a, b) {
      var ps = a, pe;
      while (ps) {
        pe = b;
        while (pe && ps != pe) {
          pe = pe.parentNode;
        }
        if (ps == pe) {
          break;
        }
        ps = ps.parentNode;
      }
      if (!ps && a.ownerDocument) {
        return a.ownerDocument.documentElement;
      }
      return ps;
    },
    toHex: function (rgbVal) {
      return this.styles.toHex($_b8tc32jjc7tm6qi.trim(rgbVal));
    },
    run: function (elm, func, scope) {
      var self = this, result;
      if (typeof elm === 'string') {
        elm = self.get(elm);
      }
      if (!elm) {
        return false;
      }
      scope = scope || this;
      if (!elm.nodeType && (elm.length || elm.length === 0)) {
        result = [];
        each$3(elm, function (elm, i) {
          if (elm) {
            if (typeof elm == 'string') {
              elm = self.get(elm);
            }
            result.push(func.call(scope, elm, i));
          }
        });
        return result;
      }
      return func.call(scope, elm);
    },
    getAttribs: function (elm) {
      var attrs;
      elm = this.get(elm);
      if (!elm) {
        return [];
      }
      if (isIE) {
        attrs = [];
        if (elm.nodeName == 'OBJECT') {
          return elm.attributes;
        }
        if (elm.nodeName === 'OPTION' && this.getAttrib(elm, 'selected')) {
          attrs.push({
            specified: 1,
            nodeName: 'selected'
          });
        }
        var attrRegExp = /<\/?[\w:\-]+ ?|=[\"][^\"]+\"|=\'[^\']+\'|=[\w\-]+|>/gi;
        elm.cloneNode(false).outerHTML.replace(attrRegExp, '').replace(/[\w:\-]+/gi, function (a) {
          attrs.push({
            specified: 1,
            nodeName: a
          });
        });
        return attrs;
      }
      return elm.attributes;
    },
    isEmpty: function (node, elements) {
      var self = this, i, attributes, type, whitespace, walker, name, brCount = 0;
      node = node.firstChild;
      if (node) {
        walker = new TreeWalker(node, node.parentNode);
        elements = elements || (self.schema ? self.schema.getNonEmptyElements() : null);
        whitespace = self.schema ? self.schema.getWhiteSpaceElements() : {};
        do {
          type = node.nodeType;
          if (type === 1) {
            var bogusVal = node.getAttribute('data-mce-bogus');
            if (bogusVal) {
              node = walker.next(bogusVal === 'all');
              continue;
            }
            name = node.nodeName.toLowerCase();
            if (elements && elements[name]) {
              if (name === 'br') {
                brCount++;
                node = walker.next();
                continue;
              }
              return false;
            }
            attributes = self.getAttribs(node);
            i = attributes.length;
            while (i--) {
              name = attributes[i].nodeName;
              if (name === 'name' || name === 'data-mce-bookmark') {
                return false;
              }
            }
          }
          if (type == 8) {
            return false;
          }
          if (type === 3 && !whiteSpaceRegExp.test(node.nodeValue)) {
            return false;
          }
          if (type === 3 && node.parentNode && whitespace[node.parentNode.nodeName] && whiteSpaceRegExp.test(node.nodeValue)) {
            return false;
          }
          node = walker.next();
        } while (node);
      }
      return brCount <= 1;
    },
    createRng: function () {
      return this.doc.createRange();
    },
    nodeIndex: nodeIndex,
    split: function (parentElm, splitElm, replacementElm) {
      var self = this, r = self.createRng(), bef, aft, pa;
      if (parentElm && splitElm) {
        r.setStart(parentElm.parentNode, self.nodeIndex(parentElm));
        r.setEnd(splitElm.parentNode, self.nodeIndex(splitElm));
        bef = r.extractContents();
        r = self.createRng();
        r.setStart(splitElm.parentNode, self.nodeIndex(splitElm) + 1);
        r.setEnd(parentElm.parentNode, self.nodeIndex(parentElm) + 1);
        aft = r.extractContents();
        pa = parentElm.parentNode;
        pa.insertBefore($_19jhoo1ojc7tm70b.trimNode(self, bef), parentElm);
        if (replacementElm) {
          pa.insertBefore(replacementElm, parentElm);
        } else {
          pa.insertBefore(splitElm, parentElm);
        }
        pa.insertBefore($_19jhoo1ojc7tm70b.trimNode(self, aft), parentElm);
        self.remove(parentElm);
        return replacementElm || splitElm;
      }
    },
    bind: function (target, name, func, scope) {
      var self = this;
      if ($_b8tc32jjc7tm6qi.isArray(target)) {
        var i = target.length;
        while (i--) {
          target[i] = self.bind(target[i], name, func, scope);
        }
        return target;
      }
      if (self.settings.collect && (target === self.doc || target === self.win)) {
        self.boundEvents.push([
          target,
          name,
          func,
          scope
        ]);
      }
      return self.events.bind(target, name, func, scope || self);
    },
    unbind: function (target, name, func) {
      var self = this, i;
      if ($_b8tc32jjc7tm6qi.isArray(target)) {
        i = target.length;
        while (i--) {
          target[i] = self.unbind(target[i], name, func);
        }
        return target;
      }
      if (self.boundEvents && (target === self.doc || target === self.win)) {
        i = self.boundEvents.length;
        while (i--) {
          var item = self.boundEvents[i];
          if (target == item[0] && (!name || name == item[1]) && (!func || func == item[2])) {
            this.events.unbind(item[0], item[1], item[2]);
          }
        }
      }
      return this.events.unbind(target, name, func);
    },
    fire: function (target, name, evt) {
      return this.events.fire(target, name, evt);
    },
    getContentEditable: function (node) {
      var contentEditable;
      if (!node || node.nodeType != 1) {
        return null;
      }
      contentEditable = node.getAttribute('data-mce-contenteditable');
      if (contentEditable && contentEditable !== 'inherit') {
        return contentEditable;
      }
      return node.contentEditable !== 'inherit' ? node.contentEditable : null;
    },
    getContentEditableParent: function (node) {
      var root = this.getRoot(), state = null;
      for (; node && node !== root; node = node.parentNode) {
        state = this.getContentEditable(node);
        if (state !== null) {
          break;
        }
      }
      return state;
    },
    destroy: function () {
      var self = this;
      if (self.boundEvents) {
        var i = self.boundEvents.length;
        while (i--) {
          var item = self.boundEvents[i];
          this.events.unbind(item[0], item[1], item[2]);
        }
        self.boundEvents = null;
      }
      if (Sizzle.setDocument) {
        Sizzle.setDocument();
      }
      self.win = self.doc = self.root = self.events = self.frag = null;
    },
    isChildOf: function (node, parent) {
      while (node) {
        if (parent === node) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    dumpRng: function (r) {
      return 'startContainer: ' + r.startContainer.nodeName + ', startOffset: ' + r.startOffset + ', endContainer: ' + r.endContainer.nodeName + ', endOffset: ' + r.endOffset;
    },
    _findSib: function (node, selector, name) {
      var self = this, func = selector;
      if (node) {
        if (typeof func == 'string') {
          func = function (node) {
            return self.is(node, selector);
          };
        }
        for (node = node[name]; node; node = node[name]) {
          if (func(node)) {
            return node;
          }
        }
      }
      return null;
    }
  };
  DOMUtils.DOM = new DOMUtils(document);
  DOMUtils.nodeIndex = nodeIndex;

  var DOM = DOMUtils.DOM;
  var each$2 = $_b8tc32jjc7tm6qi.each;
  var grep = $_b8tc32jjc7tm6qi.grep;
  var isFunction = function (f) {
    return typeof f === 'function';
  };
  var ScriptLoader = function () {
    var QUEUED = 0, LOADING = 1, LOADED = 2, FAILED = 3, states = {}, queue = [], scriptLoadedCallbacks = {}, queueLoadedCallbacks = [], loading = 0, undef;
    var loadScript = function (url, success, failure) {
      var dom = DOM, elm, id;
      var done = function () {
        dom.remove(id);
        if (elm) {
          elm.onreadystatechange = elm.onload = elm = null;
        }
        success();
      };
      var error = function () {
        if (isFunction(failure)) {
          failure();
        } else {
          if (typeof console !== 'undefined' && console.log) {
            console.log('Failed to load script: ' + url);
          }
        }
      };
      id = dom.uniqueId();
      elm = document.createElement('script');
      elm.id = id;
      elm.type = 'text/javascript';
      elm.src = $_b8tc32jjc7tm6qi._addCacheSuffix(url);
      if ('onreadystatechange' in elm) {
        elm.onreadystatechange = function () {
          if (/loaded|complete/.test(elm.readyState)) {
            done();
          }
        };
      } else {
        elm.onload = done;
      }
      elm.onerror = error;
      (document.getElementsByTagName('head')[0] || document.body).appendChild(elm);
    };
    this.isDone = function (url) {
      return states[url] == LOADED;
    };
    this.markDone = function (url) {
      states[url] = LOADED;
    };
    this.add = this.load = function (url, success, scope, failure) {
      var state = states[url];
      if (state == undef) {
        queue.push(url);
        states[url] = QUEUED;
      }
      if (success) {
        if (!scriptLoadedCallbacks[url]) {
          scriptLoadedCallbacks[url] = [];
        }
        scriptLoadedCallbacks[url].push({
          success: success,
          failure: failure,
          scope: scope || this
        });
      }
    };
    this.remove = function (url) {
      delete states[url];
      delete scriptLoadedCallbacks[url];
    };
    this.loadQueue = function (success, scope, failure) {
      this.loadScripts(queue, success, scope, failure);
    };
    this.loadScripts = function (scripts, success, scope, failure) {
      var loadScripts, failures = [];
      var execCallbacks = function (name, url) {
        each$2(scriptLoadedCallbacks[url], function (callback) {
          if (isFunction(callback[name])) {
            callback[name].call(callback.scope);
          }
        });
        scriptLoadedCallbacks[url] = undef;
      };
      queueLoadedCallbacks.push({
        success: success,
        failure: failure,
        scope: scope || this
      });
      loadScripts = function () {
        var loadingScripts = grep(scripts);
        scripts.length = 0;
        each$2(loadingScripts, function (url) {
          if (states[url] === LOADED) {
            execCallbacks('success', url);
            return;
          }
          if (states[url] === FAILED) {
            execCallbacks('failure', url);
            return;
          }
          if (states[url] !== LOADING) {
            states[url] = LOADING;
            loading++;
            loadScript(url, function () {
              states[url] = LOADED;
              loading--;
              execCallbacks('success', url);
              loadScripts();
            }, function () {
              states[url] = FAILED;
              loading--;
              failures.push(url);
              execCallbacks('failure', url);
              loadScripts();
            });
          }
        });
        if (!loading) {
          var notifyCallbacks = queueLoadedCallbacks.slice(0);
          queueLoadedCallbacks.length = 0;
          each$2(notifyCallbacks, function (callback) {
            if (failures.length === 0) {
              if (isFunction(callback.success)) {
                callback.success.call(callback.scope);
              }
            } else {
              if (isFunction(callback.failure)) {
                callback.failure.call(callback.scope, failures);
              }
            }
          });
        }
      };
      loadScripts();
    };
  };
  ScriptLoader.ScriptLoader = new ScriptLoader();

  var each = $_b8tc32jjc7tm6qi.each;
  var AddOnManager = function () {
    var self = this;
    self.items = [];
    self.urls = {};
    self.lookup = {};
    self._listeners = [];
  };
  AddOnManager.prototype = {
    get: function (name) {
      if (this.lookup[name]) {
        return this.lookup[name].instance;
      }
      return undefined;
    },
    dependencies: function (name) {
      var result;
      if (this.lookup[name]) {
        result = this.lookup[name].dependencies;
      }
      return result || [];
    },
    requireLangPack: function (name, languages) {
      var language = AddOnManager.language;
      if (language && AddOnManager.languageLoad !== false) {
        if (languages) {
          languages = ',' + languages + ',';
          if (languages.indexOf(',' + language.substr(0, 2) + ',') != -1) {
            language = language.substr(0, 2);
          } else if (languages.indexOf(',' + language + ',') == -1) {
            return;
          }
        }
        ScriptLoader.ScriptLoader.add(this.urls[name] + '/langs/' + language + '.js');
      }
    },
    add: function (id, addOn, dependencies) {
      this.items.push(addOn);
      this.lookup[id] = {
        instance: addOn,
        dependencies: dependencies
      };
      var result = $_20yqgb4jc7tm6aj.partition(this._listeners, function (listener) {
        return listener.name === id;
      });
      this._listeners = result.fail;
      each(result.pass, function (listener) {
        listener.callback();
      });
      return addOn;
    },
    remove: function (name) {
      delete this.urls[name];
      delete this.lookup[name];
    },
    createUrl: function (baseUrl, dep) {
      if (typeof dep === 'object') {
        return dep;
      }
      return {
        prefix: baseUrl.prefix,
        resource: dep,
        suffix: baseUrl.suffix
      };
    },
    addComponents: function (pluginName, scripts) {
      var pluginUrl = this.urls[pluginName];
      each(scripts, function (script) {
        ScriptLoader.ScriptLoader.add(pluginUrl + '/' + script);
      });
    },
    load: function (name, addOnUrl, success, scope, failure) {
      var self = this, url = addOnUrl;
      var loadDependencies = function () {
        var dependencies = self.dependencies(name);
        each(dependencies, function (dep) {
          var newUrl = self.createUrl(addOnUrl, dep);
          self.load(newUrl.resource, newUrl, undefined, undefined);
        });
        if (success) {
          if (scope) {
            success.call(scope);
          } else {
            success.call(ScriptLoader);
          }
        }
      };
      if (self.urls[name]) {
        return;
      }
      if (typeof addOnUrl === 'object') {
        url = addOnUrl.prefix + addOnUrl.resource + addOnUrl.suffix;
      }
      if (url.indexOf('/') !== 0 && url.indexOf('://') == -1) {
        url = AddOnManager.baseURL + '/' + url;
      }
      self.urls[name] = url.substring(0, url.lastIndexOf('/'));
      if (self.lookup[name]) {
        loadDependencies();
      } else {
        ScriptLoader.ScriptLoader.add(url, loadDependencies, scope, failure);
      }
    },
    waitFor: function (name, callback) {
      if (this.lookup.hasOwnProperty(name)) {
        callback();
      } else {
        this._listeners.push({
          name: name,
          callback: callback
        });
      }
    }
  };
  AddOnManager.PluginManager = new AddOnManager();
  AddOnManager.ThemeManager = new AddOnManager();

  var ZWSP = '\uFEFF';
  var isZwsp = function (chr) {
    return chr === ZWSP;
  };
  var trim$4 = function (text) {
    return text.replace(new RegExp(ZWSP, 'g'), '');
  };
  var $_55zd6d21jc7tm765 = {
    isZwsp: isZwsp,
    ZWSP: ZWSP,
    trim: trim$4
  };

  var isElement$3 = $_1qi2bn1qjc7tm70u.isElement;
  var isText$3 = $_1qi2bn1qjc7tm70u.isText;
  var isCaretContainerBlock = function (node) {
    if (isText$3(node)) {
      node = node.parentNode;
    }
    return isElement$3(node) && node.hasAttribute('data-mce-caret');
  };
  var isCaretContainerInline = function (node) {
    return isText$3(node) && $_55zd6d21jc7tm765.isZwsp(node.data);
  };
  var isCaretContainer$1 = function (node) {
    return isCaretContainerBlock(node) || isCaretContainerInline(node);
  };
  var hasContent = function (node) {
    return node.firstChild !== node.lastChild || !$_1qi2bn1qjc7tm70u.isBr(node.firstChild);
  };
  var insertInline = function (node, before) {
    var doc, sibling, textNode, parentNode;
    doc = node.ownerDocument;
    textNode = doc.createTextNode($_55zd6d21jc7tm765.ZWSP);
    parentNode = node.parentNode;
    if (!before) {
      sibling = node.nextSibling;
      if (isText$3(sibling)) {
        if (isCaretContainer$1(sibling)) {
          return sibling;
        }
        if (startsWithCaretContainer(sibling)) {
          sibling.splitText(1);
          return sibling;
        }
      }
      if (node.nextSibling) {
        parentNode.insertBefore(textNode, node.nextSibling);
      } else {
        parentNode.appendChild(textNode);
      }
    } else {
      sibling = node.previousSibling;
      if (isText$3(sibling)) {
        if (isCaretContainer$1(sibling)) {
          return sibling;
        }
        if (endsWithCaretContainer(sibling)) {
          return sibling.splitText(sibling.data.length - 1);
        }
      }
      parentNode.insertBefore(textNode, node);
    }
    return textNode;
  };
  var prependInline = function (node) {
    if ($_1qi2bn1qjc7tm70u.isText(node)) {
      var data = node.data;
      if (data.length > 0 && data.charAt(0) !== $_55zd6d21jc7tm765.ZWSP) {
        node.insertData(0, $_55zd6d21jc7tm765.ZWSP);
      }
      return node;
    } else {
      return null;
    }
  };
  var appendInline = function (node) {
    if ($_1qi2bn1qjc7tm70u.isText(node)) {
      var data = node.data;
      if (data.length > 0 && data.charAt(data.length - 1) !== $_55zd6d21jc7tm765.ZWSP) {
        node.insertData(data.length, $_55zd6d21jc7tm765.ZWSP);
      }
      return node;
    } else {
      return null;
    }
  };
  var isBeforeInline = function (pos) {
    return pos && $_1qi2bn1qjc7tm70u.isText(pos.container()) && pos.container().data.charAt(pos.offset()) === $_55zd6d21jc7tm765.ZWSP;
  };
  var isAfterInline = function (pos) {
    return pos && $_1qi2bn1qjc7tm70u.isText(pos.container()) && pos.container().data.charAt(pos.offset() - 1) === $_55zd6d21jc7tm765.ZWSP;
  };
  var createBogusBr = function () {
    var br = document.createElement('br');
    br.setAttribute('data-mce-bogus', '1');
    return br;
  };
  var insertBlock = function (blockName, node, before) {
    var doc, blockNode, parentNode;
    doc = node.ownerDocument;
    blockNode = doc.createElement(blockName);
    blockNode.setAttribute('data-mce-caret', before ? 'before' : 'after');
    blockNode.setAttribute('data-mce-bogus', 'all');
    blockNode.appendChild(createBogusBr());
    parentNode = node.parentNode;
    if (!before) {
      if (node.nextSibling) {
        parentNode.insertBefore(blockNode, node.nextSibling);
      } else {
        parentNode.appendChild(blockNode);
      }
    } else {
      parentNode.insertBefore(blockNode, node);
    }
    return blockNode;
  };
  var startsWithCaretContainer = function (node) {
    return isText$3(node) && node.data[0] == $_55zd6d21jc7tm765.ZWSP;
  };
  var endsWithCaretContainer = function (node) {
    return isText$3(node) && node.data[node.data.length - 1] == $_55zd6d21jc7tm765.ZWSP;
  };
  var trimBogusBr = function (elm) {
    var brs = elm.getElementsByTagName('br');
    var lastBr = brs[brs.length - 1];
    if ($_1qi2bn1qjc7tm70u.isBogus(lastBr)) {
      lastBr.parentNode.removeChild(lastBr);
    }
  };
  var showCaretContainerBlock = function (caretContainer) {
    if (caretContainer && caretContainer.hasAttribute('data-mce-caret')) {
      trimBogusBr(caretContainer);
      caretContainer.removeAttribute('data-mce-caret');
      caretContainer.removeAttribute('data-mce-bogus');
      caretContainer.removeAttribute('style');
      caretContainer.removeAttribute('_moz_abspos');
      return caretContainer;
    }
    return null;
  };
  var $_40segn20jc7tm75y = {
    isCaretContainer: isCaretContainer$1,
    isCaretContainerBlock: isCaretContainerBlock,
    isCaretContainerInline: isCaretContainerInline,
    showCaretContainerBlock: showCaretContainerBlock,
    insertInline: insertInline,
    prependInline: prependInline,
    appendInline: appendInline,
    isBeforeInline: isBeforeInline,
    isAfterInline: isAfterInline,
    insertBlock: insertBlock,
    hasContent: hasContent,
    startsWithCaretContainer: startsWithCaretContainer,
    endsWithCaretContainer: endsWithCaretContainer
  };

  var isContentEditableTrue = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var isContentEditableFalse = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isBr$2 = $_1qi2bn1qjc7tm70u.isBr;
  var isText$2 = $_1qi2bn1qjc7tm70u.isText;
  var isInvalidTextElement = $_1qi2bn1qjc7tm70u.matchNodeNames('script style textarea');
  var isAtomicInline = $_1qi2bn1qjc7tm70u.matchNodeNames('img input textarea hr iframe video audio object');
  var isTable = $_1qi2bn1qjc7tm70u.matchNodeNames('table');
  var isCaretContainer = $_40segn20jc7tm75y.isCaretContainer;
  var isCaretCandidate$1 = function (node) {
    if (isCaretContainer(node)) {
      return false;
    }
    if (isText$2(node)) {
      if (isInvalidTextElement(node.parentNode)) {
        return false;
      }
      return true;
    }
    return isAtomicInline(node) || isBr$2(node) || isTable(node) || isContentEditableFalse(node);
  };
  var isInEditable = function (node, rootNode) {
    for (node = node.parentNode; node && node != rootNode; node = node.parentNode) {
      if (isContentEditableFalse(node)) {
        return false;
      }
      if (isContentEditableTrue(node)) {
        return true;
      }
    }
    return true;
  };
  var isAtomicContentEditableFalse = function (node) {
    if (!isContentEditableFalse(node)) {
      return false;
    }
    return $_gf68zqkjc7tm6r7.reduce(node.getElementsByTagName('*'), function (result, elm) {
      return result || isContentEditableTrue(elm);
    }, false) !== true;
  };
  var isAtomic = function (node) {
    return isAtomicInline(node) || isAtomicContentEditableFalse(node);
  };
  var isEditableCaretCandidate = function (node, rootNode) {
    return isCaretCandidate$1(node) && isInEditable(node, rootNode);
  };
  var $_bnhdlx1zjc7tm75s = {
    isCaretCandidate: isCaretCandidate$1,
    isInEditable: isInEditable,
    isAtomic: isAtomic,
    isEditableCaretCandidate: isEditableCaretCandidate
  };

  var round = Math.round;
  var clone$1 = function (rect) {
    if (!rect) {
      return {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    return {
      left: round(rect.left),
      top: round(rect.top),
      bottom: round(rect.bottom),
      right: round(rect.right),
      width: round(rect.width),
      height: round(rect.height)
    };
  };
  var collapse = function (clientRect, toStart) {
    clientRect = clone$1(clientRect);
    if (toStart) {
      clientRect.right = clientRect.left;
    } else {
      clientRect.left = clientRect.left + clientRect.width;
      clientRect.right = clientRect.left;
    }
    clientRect.width = 0;
    return clientRect;
  };
  var isEqual = function (rect1, rect2) {
    return rect1.left === rect2.left && rect1.top === rect2.top && rect1.bottom === rect2.bottom && rect1.right === rect2.right;
  };
  var isValidOverflow = function (overflowY, clientRect1, clientRect2) {
    return overflowY >= 0 && overflowY <= Math.min(clientRect1.height, clientRect2.height) / 2;
  };
  var isAbove = function (clientRect1, clientRect2) {
    if (clientRect1.bottom - clientRect1.height / 2 < clientRect2.top) {
      return true;
    }
    if (clientRect1.top > clientRect2.bottom) {
      return false;
    }
    return isValidOverflow(clientRect2.top - clientRect1.bottom, clientRect1, clientRect2);
  };
  var isBelow = function (clientRect1, clientRect2) {
    if (clientRect1.top > clientRect2.bottom) {
      return true;
    }
    if (clientRect1.bottom < clientRect2.top) {
      return false;
    }
    return isValidOverflow(clientRect2.bottom - clientRect1.top, clientRect1, clientRect2);
  };
  var isLeft = function (clientRect1, clientRect2) {
    return clientRect1.left < clientRect2.left;
  };
  var isRight = function (clientRect1, clientRect2) {
    return clientRect1.right > clientRect2.right;
  };
  var compare = function (clientRect1, clientRect2) {
    if (isAbove(clientRect1, clientRect2)) {
      return -1;
    }
    if (isBelow(clientRect1, clientRect2)) {
      return 1;
    }
    if (isLeft(clientRect1, clientRect2)) {
      return -1;
    }
    if (isRight(clientRect1, clientRect2)) {
      return 1;
    }
    return 0;
  };
  var containsXY = function (clientRect, clientX, clientY) {
    return clientX >= clientRect.left && clientX <= clientRect.right && clientY >= clientRect.top && clientY <= clientRect.bottom;
  };
  var $_dqnspu22jc7tm76a = {
    clone: clone$1,
    collapse: collapse,
    isEqual: isEqual,
    isAbove: isAbove,
    isBelow: isBelow,
    isLeft: isLeft,
    isRight: isRight,
    compare: compare,
    containsXY: containsXY
  };

  var getSelectedNode = function (range) {
    var startContainer = range.startContainer, startOffset = range.startOffset;
    if (startContainer.hasChildNodes() && range.endOffset == startOffset + 1) {
      return startContainer.childNodes[startOffset];
    }
    return null;
  };
  var getNode = function (container, offset) {
    if (container.nodeType === 1 && container.hasChildNodes()) {
      if (offset >= container.childNodes.length) {
        offset = container.childNodes.length - 1;
      }
      container = container.childNodes[offset];
    }
    return container;
  };
  var $_4yp5rq23jc7tm76g = {
    getSelectedNode: getSelectedNode,
    getNode: getNode
  };

  var extendingChars = new RegExp('[\u0300-\u036f\u0483-\u0487\u0488-\u0489\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a' + '\u064b-\u065f\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0' + '\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08E3-\u0902\u093a\u093c' + '\u0941-\u0948\u094d\u0951-\u0957\u0962-\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2-\u09e3' + '\u0a01-\u0a02\u0a3c\u0a41-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a82\u0abc' + '\u0ac1-\u0ac5\u0ac7-\u0ac8\u0acd\u0ae2-\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57' + '\u0b62-\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c00\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56' + '\u0c62-\u0c63\u0c81\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc-\u0ccd\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d01\u0d3e\u0d41-\u0d44' + '\u0d4d\u0d57\u0d62-\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9' + '\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86-\u0f87\u0f8d-\u0f97' + '\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039-\u103a\u103d-\u103e\u1058-\u1059\u105e-\u1060\u1071-\u1074' + '\u1082\u1085-\u1086\u108d\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b4-\u17b5' + '\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193b\u1a17-\u1a18' + '\u1a1b\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1ab0-\u1abd\u1ABE\u1b00-\u1b03\u1b34' + '\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80-\u1b81\u1ba2-\u1ba5\u1ba8-\u1ba9\u1bab-\u1bad\u1be6\u1be8-\u1be9' + '\u1bed\u1bef-\u1bf1\u1c2c-\u1c33\u1c36-\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1cf4\u1cf8-\u1cf9' + '\u1dc0-\u1df5\u1dfc-\u1dff\u200c-\u200d\u20d0-\u20dc\u20DD-\u20E0\u20e1\u20E2-\u20E4\u20e5-\u20f0\u2cef-\u2cf1' + '\u2d7f\u2de0-\u2dff\u302a-\u302d\u302e-\u302f\u3099-\u309a\ua66f\uA670-\uA672\ua674-\ua67d\uA69E-\ua69f\ua6f0-\ua6f1' + '\ua802\ua806\ua80b\ua825-\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc' + '\ua9e5\uaa29-\uaa2e\uaa31-\uaa32\uaa35-\uaa36\uaa43\uaa4c\uaa7c\uaab0\uaab2-\uaab4\uaab7-\uaab8\uaabe-\uaabf\uaac1' + '\uaaec-\uaaed\uaaf6\uabe5\uabe8\uabed\ufb1e\ufe00-\ufe0f\ufe20-\uFE2F\uff9e-\uff9f]');
  var isExtendingChar = function (ch) {
    return typeof ch == 'string' && ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
  };
  var $_8vfp6724jc7tm76m = { isExtendingChar: isExtendingChar };

  var slice$3 = [].slice;
  var constant$1 = function (value) {
    return function () {
      return value;
    };
  };
  var negate = function (predicate) {
    return function (x) {
      return !predicate(x);
    };
  };
  var compose$2 = function (f, g) {
    return function (x) {
      return f(g(x));
    };
  };
  var or = function () {
    var x = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      x[_i] = arguments[_i];
    }
    var args = slice$3.call(arguments);
    return function (x) {
      for (var i = 0; i < args.length; i++) {
        if (args[i](x)) {
          return true;
        }
      }
      return false;
    };
  };
  var and = function () {
    var x = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      x[_i] = arguments[_i];
    }
    var args = slice$3.call(arguments);
    return function (x) {
      for (var i = 0; i < args.length; i++) {
        if (!args[i](x)) {
          return false;
        }
      }
      return true;
    };
  };
  var curry$1 = function (fn) {
    var x = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      x[_i - 1] = arguments[_i];
    }
    var args = slice$3.call(arguments);
    if (args.length - 1 >= fn.length) {
      return fn.apply(this, args.slice(1));
    }
    return function () {
      var tempArgs = args.concat([].slice.call(arguments));
      return curry$1.apply(this, tempArgs);
    };
  };
  var noop$1 = function () {
  };
  var $_fy81ys25jc7tm77a = {
    constant: constant$1,
    negate: negate,
    and: and,
    or: or,
    curry: curry$1,
    compose: compose$2,
    noop: noop$1
  };

  var isElement$2 = $_1qi2bn1qjc7tm70u.isElement;
  var isCaretCandidate = $_bnhdlx1zjc7tm75s.isCaretCandidate;
  var isBlock$1 = $_1qi2bn1qjc7tm70u.matchStyleValues('display', 'block table');
  var isFloated = $_1qi2bn1qjc7tm70u.matchStyleValues('float', 'left right');
  var isValidElementCaretCandidate = $_fy81ys25jc7tm77a.and(isElement$2, isCaretCandidate, $_fy81ys25jc7tm77a.negate(isFloated));
  var isNotPre = $_fy81ys25jc7tm77a.negate($_1qi2bn1qjc7tm70u.matchStyleValues('white-space', 'pre pre-line pre-wrap'));
  var isText$1 = $_1qi2bn1qjc7tm70u.isText;
  var isBr$1 = $_1qi2bn1qjc7tm70u.isBr;
  var nodeIndex$1 = DOMUtils.nodeIndex;
  var resolveIndex = $_4yp5rq23jc7tm76g.getNode;
  var createRange = function (doc) {
    return 'createRange' in doc ? doc.createRange() : DOMUtils.DOM.createRng();
  };
  var isWhiteSpace = function (chr) {
    return chr && /[\r\n\t ]/.test(chr);
  };
  var isHiddenWhiteSpaceRange = function (range) {
    var container = range.startContainer, offset = range.startOffset, text;
    if (isWhiteSpace(range.toString()) && isNotPre(container.parentNode)) {
      text = container.data;
      if (isWhiteSpace(text[offset - 1]) || isWhiteSpace(text[offset + 1])) {
        return true;
      }
    }
    return false;
  };
  var getCaretPositionClientRects = function (caretPosition) {
    var clientRects = [], beforeNode, node;
    var getBrClientRect = function (brNode) {
      var doc = brNode.ownerDocument, rng = createRange(doc), nbsp = doc.createTextNode('\xA0'), parentNode = brNode.parentNode, clientRect;
      parentNode.insertBefore(nbsp, brNode);
      rng.setStart(nbsp, 0);
      rng.setEnd(nbsp, 1);
      clientRect = $_dqnspu22jc7tm76a.clone(rng.getBoundingClientRect());
      parentNode.removeChild(nbsp);
      return clientRect;
    };
    var getBoundingClientRect = function (item) {
      var clientRect, clientRects;
      clientRects = item.getClientRects();
      if (clientRects.length > 0) {
        clientRect = $_dqnspu22jc7tm76a.clone(clientRects[0]);
      } else {
        clientRect = $_dqnspu22jc7tm76a.clone(item.getBoundingClientRect());
      }
      if (isBr$1(item) && clientRect.left === 0) {
        return getBrClientRect(item);
      }
      return clientRect;
    };
    var collapseAndInflateWidth = function (clientRect, toStart) {
      clientRect = $_dqnspu22jc7tm76a.collapse(clientRect, toStart);
      clientRect.width = 1;
      clientRect.right = clientRect.left + 1;
      return clientRect;
    };
    var addUniqueAndValidRect = function (clientRect) {
      if (clientRect.height === 0) {
        return;
      }
      if (clientRects.length > 0) {
        if ($_dqnspu22jc7tm76a.isEqual(clientRect, clientRects[clientRects.length - 1])) {
          return;
        }
      }
      clientRects.push(clientRect);
    };
    var addCharacterOffset = function (container, offset) {
      var range = createRange(container.ownerDocument);
      if (offset < container.data.length) {
        if ($_8vfp6724jc7tm76m.isExtendingChar(container.data[offset])) {
          return clientRects;
        }
        if ($_8vfp6724jc7tm76m.isExtendingChar(container.data[offset - 1])) {
          range.setStart(container, offset);
          range.setEnd(container, offset + 1);
          if (!isHiddenWhiteSpaceRange(range)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), false));
            return clientRects;
          }
        }
      }
      if (offset > 0) {
        range.setStart(container, offset - 1);
        range.setEnd(container, offset);
        if (!isHiddenWhiteSpaceRange(range)) {
          addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), false));
        }
      }
      if (offset < container.data.length) {
        range.setStart(container, offset);
        range.setEnd(container, offset + 1);
        if (!isHiddenWhiteSpaceRange(range)) {
          addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(range), true));
        }
      }
    };
    if (isText$1(caretPosition.container())) {
      addCharacterOffset(caretPosition.container(), caretPosition.offset());
      return clientRects;
    }
    if (isElement$2(caretPosition.container())) {
      if (caretPosition.isAtEnd()) {
        node = resolveIndex(caretPosition.container(), caretPosition.offset());
        if (isText$1(node)) {
          addCharacterOffset(node, node.data.length);
        }
        if (isValidElementCaretCandidate(node) && !isBr$1(node)) {
          addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false));
        }
      } else {
        node = resolveIndex(caretPosition.container(), caretPosition.offset());
        if (isText$1(node)) {
          addCharacterOffset(node, 0);
        }
        if (isValidElementCaretCandidate(node) && caretPosition.isAtEnd()) {
          addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), false));
          return clientRects;
        }
        beforeNode = resolveIndex(caretPosition.container(), caretPosition.offset() - 1);
        if (isValidElementCaretCandidate(beforeNode) && !isBr$1(beforeNode)) {
          if (isBlock$1(beforeNode) || isBlock$1(node) || !isValidElementCaretCandidate(node)) {
            addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(beforeNode), false));
          }
        }
        if (isValidElementCaretCandidate(node)) {
          addUniqueAndValidRect(collapseAndInflateWidth(getBoundingClientRect(node), true));
        }
      }
    }
    return clientRects;
  };
  var CaretPosition = function (container, offset, clientRects) {
    var isAtStart = function () {
      if (isText$1(container)) {
        return offset === 0;
      }
      return offset === 0;
    };
    var isAtEnd = function () {
      if (isText$1(container)) {
        return offset >= container.data.length;
      }
      return offset >= container.childNodes.length;
    };
    var toRange = function () {
      var range;
      range = createRange(container.ownerDocument);
      range.setStart(container, offset);
      range.setEnd(container, offset);
      return range;
    };
    var getClientRects = function () {
      if (!clientRects) {
        clientRects = getCaretPositionClientRects(new CaretPosition(container, offset));
      }
      return clientRects;
    };
    var isVisible = function () {
      return getClientRects().length > 0;
    };
    var isEqual = function (caretPosition) {
      return caretPosition && container === caretPosition.container() && offset === caretPosition.offset();
    };
    var getNode = function (before) {
      return resolveIndex(container, before ? offset - 1 : offset);
    };
    return {
      container: $_fy81ys25jc7tm77a.constant(container),
      offset: $_fy81ys25jc7tm77a.constant(offset),
      toRange: toRange,
      getClientRects: getClientRects,
      isVisible: isVisible,
      isAtStart: isAtStart,
      isAtEnd: isAtEnd,
      isEqual: isEqual,
      getNode: getNode
    };
  };
  CaretPosition.fromRangeStart = function (range) {
    return new CaretPosition(range.startContainer, range.startOffset);
  };
  CaretPosition.fromRangeEnd = function (range) {
    return new CaretPosition(range.endContainer, range.endOffset);
  };
  CaretPosition.after = function (node) {
    return new CaretPosition(node.parentNode, nodeIndex$1(node) + 1);
  };
  CaretPosition.before = function (node) {
    return new CaretPosition(node.parentNode, nodeIndex$1(node));
  };
  CaretPosition.isAtStart = function (pos) {
    return pos ? pos.isAtStart() : false;
  };
  CaretPosition.isAtEnd = function (pos) {
    return pos ? pos.isAtEnd() : false;
  };
  CaretPosition.isTextPosition = function (pos) {
    return pos ? $_1qi2bn1qjc7tm70u.isText(pos.container()) : false;
  };

  var isContentEditableTrue$1 = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var isContentEditableFalse$2 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isBlockLike = $_1qi2bn1qjc7tm70u.matchStyleValues('display', 'block table table-cell table-caption list-item');
  var isCaretContainer$2 = $_40segn20jc7tm75y.isCaretContainer;
  var isCaretContainerBlock$1 = $_40segn20jc7tm75y.isCaretContainerBlock;
  var curry$2 = $_fy81ys25jc7tm77a.curry;
  var isElement$5 = $_1qi2bn1qjc7tm70u.isElement;
  var isCaretCandidate$3 = $_bnhdlx1zjc7tm75s.isCaretCandidate;
  var isForwards$1 = function (direction) {
    return direction > 0;
  };
  var isBackwards$1 = function (direction) {
    return direction < 0;
  };
  var skipCaretContainers = function (walk, shallow) {
    var node;
    while (node = walk(shallow)) {
      if (!isCaretContainerBlock$1(node)) {
        return node;
      }
    }
    return null;
  };
  var findNode = function (node, direction, predicateFn, rootNode, shallow) {
    var walker = new TreeWalker(node, rootNode);
    if (isBackwards$1(direction)) {
      if (isContentEditableFalse$2(node) || isCaretContainerBlock$1(node)) {
        node = skipCaretContainers(walker.prev, true);
        if (predicateFn(node)) {
          return node;
        }
      }
      while (node = skipCaretContainers(walker.prev, shallow)) {
        if (predicateFn(node)) {
          return node;
        }
      }
    }
    if (isForwards$1(direction)) {
      if (isContentEditableFalse$2(node) || isCaretContainerBlock$1(node)) {
        node = skipCaretContainers(walker.next, true);
        if (predicateFn(node)) {
          return node;
        }
      }
      while (node = skipCaretContainers(walker.next, shallow)) {
        if (predicateFn(node)) {
          return node;
        }
      }
    }
    return null;
  };
  var getEditingHost = function (node, rootNode) {
    for (node = node.parentNode; node && node != rootNode; node = node.parentNode) {
      if (isContentEditableTrue$1(node)) {
        return node;
      }
    }
    return rootNode;
  };
  var getParentBlock = function (node, rootNode) {
    while (node && node != rootNode) {
      if (isBlockLike(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var isInSameBlock = function (caretPosition1, caretPosition2, rootNode) {
    return getParentBlock(caretPosition1.container(), rootNode) == getParentBlock(caretPosition2.container(), rootNode);
  };
  var isInSameEditingHost = function (caretPosition1, caretPosition2, rootNode) {
    return getEditingHost(caretPosition1.container(), rootNode) == getEditingHost(caretPosition2.container(), rootNode);
  };
  var getChildNodeAtRelativeOffset = function (relativeOffset, caretPosition) {
    var container, offset;
    if (!caretPosition) {
      return null;
    }
    container = caretPosition.container();
    offset = caretPosition.offset();
    if (!isElement$5(container)) {
      return null;
    }
    return container.childNodes[offset + relativeOffset];
  };
  var beforeAfter = function (before, node) {
    var range = node.ownerDocument.createRange();
    if (before) {
      range.setStartBefore(node);
      range.setEndBefore(node);
    } else {
      range.setStartAfter(node);
      range.setEndAfter(node);
    }
    return range;
  };
  var isNodesInSameBlock = function (rootNode, node1, node2) {
    return getParentBlock(node1, rootNode) == getParentBlock(node2, rootNode);
  };
  var lean = function (left, rootNode, node) {
    var sibling, siblingName;
    if (left) {
      siblingName = 'previousSibling';
    } else {
      siblingName = 'nextSibling';
    }
    while (node && node != rootNode) {
      sibling = node[siblingName];
      if (isCaretContainer$2(sibling)) {
        sibling = sibling[siblingName];
      }
      if (isContentEditableFalse$2(sibling)) {
        if (isNodesInSameBlock(rootNode, sibling, node)) {
          return sibling;
        }
        break;
      }
      if (isCaretCandidate$3(sibling)) {
        break;
      }
      node = node.parentNode;
    }
    return null;
  };
  var before = curry$2(beforeAfter, true);
  var after = curry$2(beforeAfter, false);
  var normalizeRange = function (direction, rootNode, range) {
    var node, container, offset, location;
    var leanLeft = curry$2(lean, true, rootNode);
    var leanRight = curry$2(lean, false, rootNode);
    container = range.startContainer;
    offset = range.startOffset;
    if ($_40segn20jc7tm75y.isCaretContainerBlock(container)) {
      if (!isElement$5(container)) {
        container = container.parentNode;
      }
      location = container.getAttribute('data-mce-caret');
      if (location == 'before') {
        node = container.nextSibling;
        if (isContentEditableFalse$2(node)) {
          return before(node);
        }
      }
      if (location == 'after') {
        node = container.previousSibling;
        if (isContentEditableFalse$2(node)) {
          return after(node);
        }
      }
    }
    if (!range.collapsed) {
      return range;
    }
    if ($_1qi2bn1qjc7tm70u.isText(container)) {
      if (isCaretContainer$2(container)) {
        if (direction === 1) {
          node = leanRight(container);
          if (node) {
            return before(node);
          }
          node = leanLeft(container);
          if (node) {
            return after(node);
          }
        }
        if (direction === -1) {
          node = leanLeft(container);
          if (node) {
            return after(node);
          }
          node = leanRight(container);
          if (node) {
            return before(node);
          }
        }
        return range;
      }
      if ($_40segn20jc7tm75y.endsWithCaretContainer(container) && offset >= container.data.length - 1) {
        if (direction === 1) {
          node = leanRight(container);
          if (node) {
            return before(node);
          }
        }
        return range;
      }
      if ($_40segn20jc7tm75y.startsWithCaretContainer(container) && offset <= 1) {
        if (direction === -1) {
          node = leanLeft(container);
          if (node) {
            return after(node);
          }
        }
        return range;
      }
      if (offset === container.data.length) {
        node = leanRight(container);
        if (node) {
          return before(node);
        }
        return range;
      }
      if (offset === 0) {
        node = leanLeft(container);
        if (node) {
          return after(node);
        }
        return range;
      }
    }
    return range;
  };
  var isNextToContentEditableFalse = function (relativeOffset, caretPosition) {
    return isContentEditableFalse$2(getChildNodeAtRelativeOffset(relativeOffset, caretPosition));
  };
  var $_4knc0r27jc7tm77s = {
    isForwards: isForwards$1,
    isBackwards: isBackwards$1,
    findNode: findNode,
    getEditingHost: getEditingHost,
    getParentBlock: getParentBlock,
    isInSameBlock: isInSameBlock,
    isInSameEditingHost: isInSameEditingHost,
    isBeforeContentEditableFalse: curry$2(isNextToContentEditableFalse, 0),
    isAfterContentEditableFalse: curry$2(isNextToContentEditableFalse, -1),
    normalizeRange: normalizeRange
  };

  var isContentEditableFalse$1 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isText$4 = $_1qi2bn1qjc7tm70u.isText;
  var isElement$4 = $_1qi2bn1qjc7tm70u.isElement;
  var isBr$3 = $_1qi2bn1qjc7tm70u.isBr;
  var isForwards = $_4knc0r27jc7tm77s.isForwards;
  var isBackwards = $_4knc0r27jc7tm77s.isBackwards;
  var isCaretCandidate$2 = $_bnhdlx1zjc7tm75s.isCaretCandidate;
  var isAtomic$1 = $_bnhdlx1zjc7tm75s.isAtomic;
  var isEditableCaretCandidate$1 = $_bnhdlx1zjc7tm75s.isEditableCaretCandidate;
  var getParents = function (node, rootNode) {
    var parents = [];
    while (node && node != rootNode) {
      parents.push(node);
      node = node.parentNode;
    }
    return parents;
  };
  var nodeAtIndex = function (container, offset) {
    if (container.hasChildNodes() && offset < container.childNodes.length) {
      return container.childNodes[offset];
    }
    return null;
  };
  var getCaretCandidatePosition = function (direction, node) {
    if (isForwards(direction)) {
      if (isCaretCandidate$2(node.previousSibling) && !isText$4(node.previousSibling)) {
        return CaretPosition.before(node);
      }
      if (isText$4(node)) {
        return CaretPosition(node, 0);
      }
    }
    if (isBackwards(direction)) {
      if (isCaretCandidate$2(node.nextSibling) && !isText$4(node.nextSibling)) {
        return CaretPosition.after(node);
      }
      if (isText$4(node)) {
        return CaretPosition(node, node.data.length);
      }
    }
    if (isBackwards(direction)) {
      if (isBr$3(node)) {
        return CaretPosition.before(node);
      }
      return CaretPosition.after(node);
    }
    return CaretPosition.before(node);
  };
  var isBrBeforeBlock = function (node, rootNode) {
    var next;
    if (!$_1qi2bn1qjc7tm70u.isBr(node)) {
      return false;
    }
    next = findCaretPosition(1, CaretPosition.after(node), rootNode);
    if (!next) {
      return false;
    }
    return !$_4knc0r27jc7tm77s.isInSameBlock(CaretPosition.before(node), CaretPosition.before(next), rootNode);
  };
  var findCaretPosition = function (direction, startCaretPosition, rootNode) {
    var container, offset, node, nextNode, innerNode, rootContentEditableFalseElm, caretPosition;
    if (!isElement$4(rootNode) || !startCaretPosition) {
      return null;
    }
    if (startCaretPosition.isEqual(CaretPosition.after(rootNode)) && rootNode.lastChild) {
      caretPosition = CaretPosition.after(rootNode.lastChild);
      if (isBackwards(direction) && isCaretCandidate$2(rootNode.lastChild) && isElement$4(rootNode.lastChild)) {
        return isBr$3(rootNode.lastChild) ? CaretPosition.before(rootNode.lastChild) : caretPosition;
      }
    } else {
      caretPosition = startCaretPosition;
    }
    container = caretPosition.container();
    offset = caretPosition.offset();
    if (isText$4(container)) {
      if (isBackwards(direction) && offset > 0) {
        return CaretPosition(container, --offset);
      }
      if (isForwards(direction) && offset < container.length) {
        return CaretPosition(container, ++offset);
      }
      node = container;
    } else {
      if (isBackwards(direction) && offset > 0) {
        nextNode = nodeAtIndex(container, offset - 1);
        if (isCaretCandidate$2(nextNode)) {
          if (!isAtomic$1(nextNode)) {
            innerNode = $_4knc0r27jc7tm77s.findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode);
            if (innerNode) {
              if (isText$4(innerNode)) {
                return CaretPosition(innerNode, innerNode.data.length);
              }
              return CaretPosition.after(innerNode);
            }
          }
          if (isText$4(nextNode)) {
            return CaretPosition(nextNode, nextNode.data.length);
          }
          return CaretPosition.before(nextNode);
        }
      }
      if (isForwards(direction) && offset < container.childNodes.length) {
        nextNode = nodeAtIndex(container, offset);
        if (isCaretCandidate$2(nextNode)) {
          if (isBrBeforeBlock(nextNode, rootNode)) {
            return findCaretPosition(direction, CaretPosition.after(nextNode), rootNode);
          }
          if (!isAtomic$1(nextNode)) {
            innerNode = $_4knc0r27jc7tm77s.findNode(nextNode, direction, isEditableCaretCandidate$1, nextNode);
            if (innerNode) {
              if (isText$4(innerNode)) {
                return CaretPosition(innerNode, 0);
              }
              return CaretPosition.before(innerNode);
            }
          }
          if (isText$4(nextNode)) {
            return CaretPosition(nextNode, 0);
          }
          return CaretPosition.after(nextNode);
        }
      }
      node = caretPosition.getNode();
    }
    if (isForwards(direction) && caretPosition.isAtEnd() || isBackwards(direction) && caretPosition.isAtStart()) {
      node = $_4knc0r27jc7tm77s.findNode(node, direction, $_fy81ys25jc7tm77a.constant(true), rootNode, true);
      if (isEditableCaretCandidate$1(node, rootNode)) {
        return getCaretCandidatePosition(direction, node);
      }
    }
    nextNode = $_4knc0r27jc7tm77s.findNode(node, direction, isEditableCaretCandidate$1, rootNode);
    rootContentEditableFalseElm = $_gf68zqkjc7tm6r7.last($_gf68zqkjc7tm6r7.filter(getParents(container, rootNode), isContentEditableFalse$1));
    if (rootContentEditableFalseElm && (!nextNode || !rootContentEditableFalseElm.contains(nextNode))) {
      if (isForwards(direction)) {
        caretPosition = CaretPosition.after(rootContentEditableFalseElm);
      } else {
        caretPosition = CaretPosition.before(rootContentEditableFalseElm);
      }
      return caretPosition;
    }
    if (nextNode) {
      return getCaretCandidatePosition(direction, nextNode);
    }
    return null;
  };
  var CaretWalker = function (rootNode) {
    return {
      next: function (caretPosition) {
        return findCaretPosition(1, caretPosition, rootNode);
      },
      prev: function (caretPosition) {
        return findCaretPosition(-1, caretPosition, rootNode);
      }
    };
  };

  var hasOnlyOneChild = function (node) {
    return node.firstChild && node.firstChild === node.lastChild;
  };
  var isPaddingNode = function (node) {
    return node.name === 'br' || node.value === '\xA0';
  };
  var isPaddedEmptyBlock = function (schema, node) {
    var blockElements = schema.getBlockElements();
    return blockElements[node.name] && hasOnlyOneChild(node) && isPaddingNode(node.firstChild);
  };
  var isEmptyFragmentElement = function (schema, node) {
    var nonEmptyElements = schema.getNonEmptyElements();
    return node && (node.isEmpty(nonEmptyElements) || isPaddedEmptyBlock(schema, node));
  };
  var isListFragment = function (schema, fragment) {
    var firstChild = fragment.firstChild;
    var lastChild = fragment.lastChild;
    if (firstChild && firstChild.name === 'meta') {
      firstChild = firstChild.next;
    }
    if (lastChild && lastChild.attr('id') === 'mce_marker') {
      lastChild = lastChild.prev;
    }
    if (isEmptyFragmentElement(schema, lastChild)) {
      lastChild = lastChild.prev;
    }
    if (!firstChild || firstChild !== lastChild) {
      return false;
    }
    return firstChild.name === 'ul' || firstChild.name === 'ol';
  };
  var cleanupDomFragment = function (domFragment) {
    var firstChild = domFragment.firstChild;
    var lastChild = domFragment.lastChild;
    if (firstChild && firstChild.nodeName === 'META') {
      firstChild.parentNode.removeChild(firstChild);
    }
    if (lastChild && lastChild.id === 'mce_marker') {
      lastChild.parentNode.removeChild(lastChild);
    }
    return domFragment;
  };
  var toDomFragment = function (dom, serializer, fragment) {
    var html = serializer.serialize(fragment);
    var domFragment = dom.createFragment(html);
    return cleanupDomFragment(domFragment);
  };
  var listItems$1 = function (elm) {
    return $_b8tc32jjc7tm6qi.grep(elm.childNodes, function (child) {
      return child.nodeName === 'LI';
    });
  };
  var isPadding = function (node) {
    return node.data === '\xA0' || $_1qi2bn1qjc7tm70u.isBr(node);
  };
  var isListItemPadded = function (node) {
    return node && node.firstChild && node.firstChild === node.lastChild && isPadding(node.firstChild);
  };
  var isEmptyOrPadded = function (elm) {
    return !elm.firstChild || isListItemPadded(elm);
  };
  var trimListItems = function (elms) {
    return elms.length > 0 && isEmptyOrPadded(elms[elms.length - 1]) ? elms.slice(0, -1) : elms;
  };
  var getParentLi = function (dom, node) {
    var parentBlock = dom.getParent(node, dom.isBlock);
    return parentBlock && parentBlock.nodeName === 'LI' ? parentBlock : null;
  };
  var isParentBlockLi = function (dom, node) {
    return !!getParentLi(dom, node);
  };
  var getSplit = function (parentNode, rng) {
    var beforeRng = rng.cloneRange();
    var afterRng = rng.cloneRange();
    beforeRng.setStartBefore(parentNode);
    afterRng.setEndAfter(parentNode);
    return [
      beforeRng.cloneContents(),
      afterRng.cloneContents()
    ];
  };
  var findFirstIn = function (node, rootNode) {
    var caretPos = CaretPosition.before(node);
    var caretWalker = CaretWalker(rootNode);
    var newCaretPos = caretWalker.next(caretPos);
    return newCaretPos ? newCaretPos.toRange() : null;
  };
  var findLastOf = function (node, rootNode) {
    var caretPos = CaretPosition.after(node);
    var caretWalker = CaretWalker(rootNode);
    var newCaretPos = caretWalker.prev(caretPos);
    return newCaretPos ? newCaretPos.toRange() : null;
  };
  var insertMiddle = function (target, elms, rootNode, rng) {
    var parts = getSplit(target, rng);
    var parentElm = target.parentNode;
    parentElm.insertBefore(parts[0], target);
    $_b8tc32jjc7tm6qi.each(elms, function (li) {
      parentElm.insertBefore(li, target);
    });
    parentElm.insertBefore(parts[1], target);
    parentElm.removeChild(target);
    return findLastOf(elms[elms.length - 1], rootNode);
  };
  var insertBefore = function (target, elms, rootNode) {
    var parentElm = target.parentNode;
    $_b8tc32jjc7tm6qi.each(elms, function (elm) {
      parentElm.insertBefore(elm, target);
    });
    return findFirstIn(target, rootNode);
  };
  var insertAfter = function (target, elms, rootNode, dom) {
    dom.insertAfter(elms.reverse(), target);
    return findLastOf(elms[0], rootNode);
  };
  var insertAtCaret$1 = function (serializer, dom, rng, fragment) {
    var domFragment = toDomFragment(dom, serializer, fragment);
    var liTarget = getParentLi(dom, rng.startContainer);
    var liElms = trimListItems(listItems$1(domFragment.firstChild));
    var BEGINNING = 1, END = 2;
    var rootNode = dom.getRoot();
    var isAt = function (location) {
      var caretPos = CaretPosition.fromRangeStart(rng);
      var caretWalker = CaretWalker(dom.getRoot());
      var newPos = location === BEGINNING ? caretWalker.prev(caretPos) : caretWalker.next(caretPos);
      return newPos ? getParentLi(dom, newPos.getNode()) !== liTarget : true;
    };
    if (isAt(BEGINNING)) {
      return insertBefore(liTarget, liElms, rootNode);
    } else if (isAt(END)) {
      return insertAfter(liTarget, liElms, rootNode, dom);
    }
    return insertMiddle(liTarget, liElms, rootNode, rng);
  };
  var $_dnpt631xjc7tm755 = {
    isListFragment: isListFragment,
    insertAtCaret: insertAtCaret$1,
    isParentBlockLi: isParentBlockLi,
    trimListItems: trimListItems,
    listItems: listItems$1
  };

  var isText$5 = $_1qi2bn1qjc7tm70u.isText;
  var isBogus$1 = $_1qi2bn1qjc7tm70u.isBogus;
  var nodeIndex$2 = DOMUtils.nodeIndex;
  var normalizedParent = function (node) {
    var parentNode = node.parentNode;
    if (isBogus$1(parentNode)) {
      return normalizedParent(parentNode);
    }
    return parentNode;
  };
  var getChildNodes = function (node) {
    if (!node) {
      return [];
    }
    return $_gf68zqkjc7tm6r7.reduce(node.childNodes, function (result, node) {
      if (isBogus$1(node) && node.nodeName != 'BR') {
        result = result.concat(getChildNodes(node));
      } else {
        result.push(node);
      }
      return result;
    }, []);
  };
  var normalizedTextOffset = function (textNode, offset) {
    while (textNode = textNode.previousSibling) {
      if (!isText$5(textNode)) {
        break;
      }
      offset += textNode.data.length;
    }
    return offset;
  };
  var equal$1 = function (targetValue) {
    return function (value) {
      return targetValue === value;
    };
  };
  var normalizedNodeIndex = function (node) {
    var nodes, index, numTextFragments;
    nodes = getChildNodes(normalizedParent(node));
    index = $_gf68zqkjc7tm6r7.findIndex(nodes, equal$1(node), node);
    nodes = nodes.slice(0, index + 1);
    numTextFragments = $_gf68zqkjc7tm6r7.reduce(nodes, function (result, node, i) {
      if (isText$5(node) && isText$5(nodes[i - 1])) {
        result++;
      }
      return result;
    }, 0);
    nodes = $_gf68zqkjc7tm6r7.filter(nodes, $_1qi2bn1qjc7tm70u.matchNodeNames(node.nodeName));
    index = $_gf68zqkjc7tm6r7.findIndex(nodes, equal$1(node), node);
    return index - numTextFragments;
  };
  var createPathItem = function (node) {
    var name;
    if (isText$5(node)) {
      name = 'text()';
    } else {
      name = node.nodeName.toLowerCase();
    }
    return name + '[' + normalizedNodeIndex(node) + ']';
  };
  var parentsUntil = function (rootNode, node, predicate) {
    var parents = [];
    for (node = node.parentNode; node != rootNode; node = node.parentNode) {
      if (predicate && predicate(node)) {
        break;
      }
      parents.push(node);
    }
    return parents;
  };
  var create$1 = function (rootNode, caretPosition) {
    var container, offset, path = [], outputOffset, childNodes, parents;
    container = caretPosition.container();
    offset = caretPosition.offset();
    if (isText$5(container)) {
      outputOffset = normalizedTextOffset(container, offset);
    } else {
      childNodes = container.childNodes;
      if (offset >= childNodes.length) {
        outputOffset = 'after';
        offset = childNodes.length - 1;
      } else {
        outputOffset = 'before';
      }
      container = childNodes[offset];
    }
    path.push(createPathItem(container));
    parents = parentsUntil(rootNode, container);
    parents = $_gf68zqkjc7tm6r7.filter(parents, $_fy81ys25jc7tm77a.negate($_1qi2bn1qjc7tm70u.isBogus));
    path = path.concat($_gf68zqkjc7tm6r7.map(parents, function (node) {
      return createPathItem(node);
    }));
    return path.reverse().join('/') + ',' + outputOffset;
  };
  var resolvePathItem = function (node, name, index) {
    var nodes = getChildNodes(node);
    nodes = $_gf68zqkjc7tm6r7.filter(nodes, function (node, index) {
      return !isText$5(node) || !isText$5(nodes[index - 1]);
    });
    nodes = $_gf68zqkjc7tm6r7.filter(nodes, $_1qi2bn1qjc7tm70u.matchNodeNames(name));
    return nodes[index];
  };
  var findTextPosition = function (container, offset) {
    var node = container, targetOffset = 0, dataLen;
    while (isText$5(node)) {
      dataLen = node.data.length;
      if (offset >= targetOffset && offset <= targetOffset + dataLen) {
        container = node;
        offset = offset - targetOffset;
        break;
      }
      if (!isText$5(node.nextSibling)) {
        container = node;
        offset = dataLen;
        break;
      }
      targetOffset += dataLen;
      node = node.nextSibling;
    }
    if (offset > container.data.length) {
      offset = container.data.length;
    }
    return new CaretPosition(container, offset);
  };
  var resolve$3 = function (rootNode, path) {
    var parts, container, offset;
    if (!path) {
      return null;
    }
    parts = path.split(',');
    path = parts[0].split('/');
    offset = parts.length > 1 ? parts[1] : 'before';
    container = $_gf68zqkjc7tm6r7.reduce(path, function (result, value) {
      value = /([\w\-\(\)]+)\[([0-9]+)\]/.exec(value);
      if (!value) {
        return null;
      }
      if (value[1] === 'text()') {
        value[1] = '#text';
      }
      return resolvePathItem(result, value[1], parseInt(value[2], 10));
    }, rootNode);
    if (!container) {
      return null;
    }
    if (!isText$5(container)) {
      if (offset === 'after') {
        offset = nodeIndex$2(container) + 1;
      } else {
        offset = nodeIndex$2(container);
      }
      return new CaretPosition(container.parentNode, offset);
    }
    return findTextPosition(container, parseInt(offset, 10));
  };
  var $_f3rnuc2bjc7tm78t = {
    create: create$1,
    resolve: resolve$3
  };

  var isContentEditableFalse$3 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var getNormalizedTextOffset = function (trim, container, offset) {
    var node, trimmedOffset;
    trimmedOffset = trim(container.data.slice(0, offset)).length;
    for (node = container.previousSibling; node && $_1qi2bn1qjc7tm70u.isText(node); node = node.previousSibling) {
      trimmedOffset += trim(node.data).length;
    }
    return trimmedOffset;
  };
  var getPoint = function (dom, trim, normalized, rng, start) {
    var container = rng[start ? 'startContainer' : 'endContainer'];
    var offset = rng[start ? 'startOffset' : 'endOffset'], point = [], childNodes, after = 0;
    var root = dom.getRoot();
    if ($_1qi2bn1qjc7tm70u.isText(container)) {
      point.push(normalized ? getNormalizedTextOffset(trim, container, offset) : offset);
    } else {
      childNodes = container.childNodes;
      if (offset >= childNodes.length && childNodes.length) {
        after = 1;
        offset = Math.max(0, childNodes.length - 1);
      }
      point.push(dom.nodeIndex(childNodes[offset], normalized) + after);
    }
    for (; container && container !== root; container = container.parentNode) {
      point.push(dom.nodeIndex(container, normalized));
    }
    return point;
  };
  var getLocation = function (trim, selection, normalized, rng) {
    var dom = selection.dom, bookmark = {};
    bookmark.start = getPoint(dom, trim, normalized, rng, true);
    if (!selection.isCollapsed()) {
      bookmark.end = getPoint(dom, trim, normalized, rng, false);
    }
    return bookmark;
  };
  var trimEmptyTextNode = function (node) {
    if ($_1qi2bn1qjc7tm70u.isText(node) && node.data.length === 0) {
      node.parentNode.removeChild(node);
    }
  };
  var findIndex$3 = function (dom, name, element) {
    var count = 0;
    $_b8tc32jjc7tm6qi.each(dom.select(name), function (node) {
      if (node.getAttribute('data-mce-bogus') === 'all') {
        return;
      }
      if (node === element) {
        return false;
      }
      count++;
    });
    return count;
  };
  var moveEndPoint = function (rng, start) {
    var container, offset, childNodes, prefix = start ? 'start' : 'end';
    container = rng[prefix + 'Container'];
    offset = rng[prefix + 'Offset'];
    if ($_1qi2bn1qjc7tm70u.isElement(container) && container.nodeName === 'TR') {
      childNodes = container.childNodes;
      container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];
      if (container) {
        offset = start ? 0 : container.childNodes.length;
        rng['set' + (start ? 'Start' : 'End')](container, offset);
      }
    }
  };
  var normalizeTableCellSelection = function (rng) {
    moveEndPoint(rng, true);
    moveEndPoint(rng, false);
    return rng;
  };
  var findSibling = function (node, offset) {
    var sibling;
    if ($_1qi2bn1qjc7tm70u.isElement(node)) {
      node = $_4yp5rq23jc7tm76g.getNode(node, offset);
      if (isContentEditableFalse$3(node)) {
        return node;
      }
    }
    if ($_40segn20jc7tm75y.isCaretContainer(node)) {
      if ($_1qi2bn1qjc7tm70u.isText(node) && $_40segn20jc7tm75y.isCaretContainerBlock(node)) {
        node = node.parentNode;
      }
      sibling = node.previousSibling;
      if (isContentEditableFalse$3(sibling)) {
        return sibling;
      }
      sibling = node.nextSibling;
      if (isContentEditableFalse$3(sibling)) {
        return sibling;
      }
    }
  };
  var findAdjacentContentEditableFalseElm = function (rng) {
    return findSibling(rng.startContainer, rng.startOffset) || findSibling(rng.endContainer, rng.endOffset);
  };
  var getOffsetBookmark = function (trim, normalized, selection) {
    var element = selection.getNode();
    var name = element ? element.nodeName : null;
    var rng = selection.getRng();
    if (isContentEditableFalse$3(element) || name === 'IMG') {
      return {
        name: name,
        index: findIndex$3(selection.dom, name, element)
      };
    }
    element = findAdjacentContentEditableFalseElm(rng);
    if (element) {
      name = element.tagName;
      return {
        name: name,
        index: findIndex$3(selection.dom, name, element)
      };
    }
    return getLocation(trim, selection, normalized, rng);
  };
  var getCaretBookmark = function (selection) {
    var rng = selection.getRng();
    return {
      start: $_f3rnuc2bjc7tm78t.create(selection.dom.getRoot(), CaretPosition.fromRangeStart(rng)),
      end: $_f3rnuc2bjc7tm78t.create(selection.dom.getRoot(), CaretPosition.fromRangeEnd(rng))
    };
  };
  var getRangeBookmark = function (selection) {
    return { rng: selection.getRng() };
  };
  var getPersistentBookmark = function (selection) {
    var dom = selection.dom;
    var rng = selection.getRng();
    var id = dom.uniqueId();
    var collapsed = selection.isCollapsed();
    var styles = 'overflow:hidden;line-height:0px';
    var element = selection.getNode();
    var name = element.nodeName;
    var chr = '&#xFEFF;';
    if (name === 'IMG') {
      return {
        name: name,
        index: findIndex$3(dom, name, element)
      };
    }
    var rng2 = normalizeTableCellSelection(rng.cloneRange());
    if (!collapsed) {
      rng2.collapse(false);
      var endBookmarkNode = dom.create('span', {
        'data-mce-type': 'bookmark',
        id: id + '_end',
        style: styles
      }, chr);
      rng2.insertNode(endBookmarkNode);
      trimEmptyTextNode(endBookmarkNode.nextSibling);
    }
    rng = normalizeTableCellSelection(rng);
    rng.collapse(true);
    var startBookmarkNode = dom.create('span', {
      'data-mce-type': 'bookmark',
      id: id + '_start',
      style: styles
    }, chr);
    rng.insertNode(startBookmarkNode);
    trimEmptyTextNode(startBookmarkNode.previousSibling);
    selection.moveToBookmark({
      id: id,
      keep: 1
    });
    return { id: id };
  };
  var getBookmark$1 = function (selection, type, normalized) {
    if (type === 2) {
      return getOffsetBookmark($_55zd6d21jc7tm765.trim, normalized, selection);
    } else if (type === 3) {
      return getCaretBookmark(selection);
    } else if (type) {
      return getRangeBookmark(selection);
    } else {
      return getPersistentBookmark(selection);
    }
  };
  var $_c3qhcz2ajc7tm78g = {
    getBookmark: getBookmark$1,
    getUndoBookmark: $_f41mrx6jc7tm6cd.curry(getOffsetBookmark, $_f41mrx6jc7tm6cd.identity, true)
  };

  var cat = function (arr) {
    var r = [];
    var push = function (x) {
      r.push(x);
    };
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push);
    }
    return r;
  };
  var findMap = function (arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i);
      if (r.isSome()) {
        return r;
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_e5uurj5jc7tm6bt.none();
      }
    }
    return $_e5uurj5jc7tm6bt.some(f.apply(null, r));
  };
  var $_2siq12djc7tm79e = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var addBogus = function (dom, node) {
    if (dom.isBlock(node) && !node.innerHTML && !$_dtgtsy9jc7tm6gs.ie) {
      node.innerHTML = '<br data-mce-bogus="1" />';
    }
    return node;
  };
  var resolveCaretPositionBookmark = function (dom, bookmark) {
    var rng, pos;
    rng = dom.createRng();
    pos = $_f3rnuc2bjc7tm78t.resolve(dom.getRoot(), bookmark.start);
    rng.setStart(pos.container(), pos.offset());
    pos = $_f3rnuc2bjc7tm78t.resolve(dom.getRoot(), bookmark.end);
    rng.setEnd(pos.container(), pos.offset());
    return rng;
  };
  var setEndPoint = function (dom, start, bookmark, rng) {
    var point = bookmark[start ? 'start' : 'end'], i, node, offset, children, root = dom.getRoot();
    if (point) {
      offset = point[0];
      for (node = root, i = point.length - 1; i >= 1; i--) {
        children = node.childNodes;
        if (point[i] > children.length - 1) {
          return;
        }
        node = children[point[i]];
      }
      if (node.nodeType === 3) {
        offset = Math.min(point[0], node.nodeValue.length);
      }
      if (node.nodeType === 1) {
        offset = Math.min(point[0], node.childNodes.length);
      }
      if (start) {
        rng.setStart(node, offset);
      } else {
        rng.setEnd(node, offset);
      }
    }
    return true;
  };
  var restoreEndPoint = function (dom, suffix, bookmark) {
    var marker = dom.get(bookmark.id + '_' + suffix), node, idx, next, prev, keep = bookmark.keep;
    var container, offset;
    if (marker) {
      node = marker.parentNode;
      if (suffix === 'start') {
        if (!keep) {
          idx = dom.nodeIndex(marker);
        } else {
          node = marker.firstChild;
          idx = 1;
        }
        container = node;
        offset = idx;
      } else {
        if (!keep) {
          idx = dom.nodeIndex(marker);
        } else {
          node = marker.firstChild;
          idx = 1;
        }
        container = node;
        offset = idx;
      }
      if (!keep) {
        prev = marker.previousSibling;
        next = marker.nextSibling;
        $_b8tc32jjc7tm6qi.each($_b8tc32jjc7tm6qi.grep(marker.childNodes), function (node) {
          if ($_1qi2bn1qjc7tm70u.isText(node)) {
            node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '');
          }
        });
        while (marker = dom.get(bookmark.id + '_' + suffix)) {
          dom.remove(marker, 1);
        }
        if (prev && next && prev.nodeType === next.nodeType && $_1qi2bn1qjc7tm70u.isText(prev) && !$_dtgtsy9jc7tm6gs.opera) {
          idx = prev.nodeValue.length;
          prev.appendData(next.nodeValue);
          dom.remove(next);
          if (suffix === 'start') {
            container = prev;
            offset = idx;
          } else {
            container = prev;
            offset = idx;
          }
        }
      }
      return $_e5uurj5jc7tm6bt.some(CaretPosition(container, offset));
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var alt = function (o1, o2) {
    return o1.isSome() ? o1 : o2;
  };
  var resolvePaths = function (dom, bookmark) {
    var rng = dom.createRng();
    if (setEndPoint(dom, true, bookmark, rng) && setEndPoint(dom, false, bookmark, rng)) {
      return $_e5uurj5jc7tm6bt.some(rng);
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var resolveId = function (dom, bookmark) {
    var startPos = restoreEndPoint(dom, 'start', bookmark);
    var endPos = restoreEndPoint(dom, 'end', bookmark);
    return $_2siq12djc7tm79e.liftN([
      startPos,
      alt(endPos, startPos)
    ], function (spos, epos) {
      var rng = dom.createRng();
      rng.setStart(addBogus(dom, spos.container()), spos.offset());
      rng.setEnd(addBogus(dom, epos.container()), epos.offset());
      return rng;
    });
  };
  var resolveIndex$1 = function (dom, bookmark) {
    return $_e5uurj5jc7tm6bt.from(dom.select(bookmark.name)[bookmark.index]).map(function (elm) {
      var rng = dom.createRng();
      rng.selectNode(elm);
      return rng;
    });
  };
  var resolve$4 = function (selection, bookmark) {
    var dom = selection.dom;
    if (bookmark) {
      if ($_b8tc32jjc7tm6qi.isArray(bookmark.start)) {
        return resolvePaths(dom, bookmark);
      } else if (typeof bookmark.start === 'string') {
        return $_e5uurj5jc7tm6bt.some(resolveCaretPositionBookmark(dom, bookmark));
      } else if (bookmark.id) {
        return resolveId(dom, bookmark);
      } else if (bookmark.name) {
        return resolveIndex$1(dom, bookmark);
      } else if (bookmark.rng) {
        return $_e5uurj5jc7tm6bt.some(bookmark.rng);
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var $_cfgylg2cjc7tm794 = { resolve: resolve$4 };

  var getBookmark = function (selection, type, normalized) {
    return $_c3qhcz2ajc7tm78g.getBookmark(selection, type, normalized);
  };
  var moveToBookmark = function (selection, bookmark) {
    $_cfgylg2cjc7tm794.resolve(selection, bookmark).each(function (rng) {
      selection.setRng(rng);
    });
  };
  var isBookmarkNode$1 = function (node) {
    return node && node.tagName === 'SPAN' && node.getAttribute('data-mce-type') === 'bookmark';
  };
  var $_am1og29jc7tm78b = {
    getBookmark: getBookmark,
    moveToBookmark: moveToBookmark,
    isBookmarkNode: isBookmarkNode$1
  };

  var each$10 = $_b8tc32jjc7tm6qi.each;
  var ElementUtils = function (dom) {
    this.compare = function (node1, node2) {
      if (node1.nodeName != node2.nodeName) {
        return false;
      }
      var getAttribs = function (node) {
        var attribs = {};
        each$10(dom.getAttribs(node), function (attr) {
          var name = attr.nodeName.toLowerCase();
          if (name.indexOf('_') !== 0 && name !== 'style' && name.indexOf('data-') !== 0) {
            attribs[name] = dom.getAttrib(node, name);
          }
        });
        return attribs;
      };
      var compareObjects = function (obj1, obj2) {
        var value, name;
        for (name in obj1) {
          if (obj1.hasOwnProperty(name)) {
            value = obj2[name];
            if (typeof value == 'undefined') {
              return false;
            }
            if (obj1[name] != value) {
              return false;
            }
            delete obj2[name];
          }
        }
        for (name in obj2) {
          if (obj2.hasOwnProperty(name)) {
            return false;
          }
        }
        return true;
      };
      if (!compareObjects(getAttribs(node1), getAttribs(node2))) {
        return false;
      }
      if (!compareObjects(dom.parseStyle(dom.getAttrib(node1, 'style')), dom.parseStyle(dom.getAttrib(node2, 'style')))) {
        return false;
      }
      return !$_am1og29jc7tm78b.isBookmarkNode(node1) && !$_am1og29jc7tm78b.isBookmarkNode(node2);
    };
  };

  var before$1 = function (marker, element) {
    var parent = $_15fekq17jc7tm6wo.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after$1 = function (marker, element) {
    var sibling = $_15fekq17jc7tm6wo.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_15fekq17jc7tm6wo.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before$1(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_15fekq17jc7tm6wo.firstChild(parent);
    firstChild.fold(function () {
      append(parent, element);
    }, function (v) {
      parent.dom().insertBefore(element.dom(), v.dom());
    });
  };
  var append = function (parent, element) {
    parent.dom().appendChild(element.dom());
  };
  var appendAt = function (parent, element, index) {
    $_15fekq17jc7tm6wo.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before$1(v, element);
    });
  };
  var wrap$1 = function (element, wrapper) {
    before$1(element, wrapper);
    append(wrapper, element);
  };
  var $_bacixv2fjc7tm79x = {
    before: before$1,
    after: after$1,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap$1
  };

  var before$2 = function (marker, elements) {
    $_20yqgb4jc7tm6aj.each(elements, function (x) {
      $_bacixv2fjc7tm79x.before(marker, x);
    });
  };
  var after$2 = function (marker, elements) {
    $_20yqgb4jc7tm6aj.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_bacixv2fjc7tm79x.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_20yqgb4jc7tm6aj.each(elements.slice().reverse(), function (x) {
      $_bacixv2fjc7tm79x.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_20yqgb4jc7tm6aj.each(elements, function (x) {
      $_bacixv2fjc7tm79x.append(parent, x);
    });
  };
  var $_2oy1ps2hjc7tm7ab = {
    before: before$2,
    after: after$2,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_20yqgb4jc7tm6aj.each($_15fekq17jc7tm6wo.children(element), function (rogue) {
      remove$2(rogue);
    });
  };
  var remove$2 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_15fekq17jc7tm6wo.children(wrapper);
    if (children.length > 0)
      $_2oy1ps2hjc7tm7ab.before(wrapper, children);
    remove$2(wrapper);
  };
  var $_gi2jzz2gjc7tm7a2 = {
    empty: empty,
    remove: remove$2,
    unwrap: unwrap
  };

  var NodeValue = function (is, name) {
    var get = function (element) {
      if (!is(element))
        throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
      return getOption(element).getOr('');
    };
    var getOptionIE10 = function (element) {
      try {
        return getOptionSafe(element);
      } catch (e) {
        return $_e5uurj5jc7tm6bt.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_e5uurj5jc7tm6bt.from(element.dom().nodeValue) : $_e5uurj5jc7tm6bt.none();
    };
    var browser = $_e43n9tmjc7tm6ss.detect().browser;
    var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;
    var set = function (element, value) {
      if (!is(element))
        throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
      element.dom().nodeValue = value;
    };
    return {
      get: get,
      getOption: getOption,
      set: set
    };
  };

  var api = NodeValue($_4bxsjnzjc7tm6uw.isText, 'text');
  var get$2 = function (element) {
    return api.get(element);
  };
  var getOption = function (element) {
    return api.getOption(element);
  };
  var set$2 = function (element, value) {
    api.set(element, value);
  };
  var $_3rk0xt2ijc7tm7au = {
    get: get$2,
    getOption: getOption,
    set: set$2
  };

  var all$2 = function (predicate) {
    return descendants$1($_2hnc5315jc7tm6wb.body(), predicate);
  };
  var ancestors$1 = function (scope, predicate, isRoot) {
    return $_20yqgb4jc7tm6aj.filter($_15fekq17jc7tm6wo.parents(scope, isRoot), predicate);
  };
  var siblings$2 = function (scope, predicate) {
    return $_20yqgb4jc7tm6aj.filter($_15fekq17jc7tm6wo.siblings(scope), predicate);
  };
  var children$2 = function (scope, predicate) {
    return $_20yqgb4jc7tm6aj.filter($_15fekq17jc7tm6wo.children(scope), predicate);
  };
  var descendants$1 = function (scope, predicate) {
    var result = [];
    $_20yqgb4jc7tm6aj.each($_15fekq17jc7tm6wo.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants$1(x, predicate));
    });
    return result;
  };
  var $_8zewvx2ljc7tm7bb = {
    all: all$2,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  var all$1 = function (selector) {
    return $_dnzz0a1fjc7tm6yr.all(selector);
  };
  var ancestors = function (scope, selector, isRoot) {
    return $_8zewvx2ljc7tm7bb.ancestors(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    }, isRoot);
  };
  var siblings$1 = function (scope, selector) {
    return $_8zewvx2ljc7tm7bb.siblings(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    });
  };
  var children$1 = function (scope, selector) {
    return $_8zewvx2ljc7tm7bb.children(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    });
  };
  var descendants = function (scope, selector) {
    return $_dnzz0a1fjc7tm6yr.all(selector, scope);
  };
  var $_8esf4w2kjc7tm7b6 = {
    all: all$1,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var getLastChildren = function (elm) {
    var children = [], rawNode = elm.dom();
    while (rawNode) {
      children.push($_bscr39yjc7tm6uo.fromDom(rawNode));
      rawNode = rawNode.lastChild;
    }
    return children;
  };
  var removeTrailingBr = function (elm) {
    var allBrs = $_8esf4w2kjc7tm7b6.descendants(elm, 'br');
    var brs = $_20yqgb4jc7tm6aj.filter(getLastChildren(elm).slice(-1), $_8zplag1pjc7tm70h.isBr);
    if (allBrs.length === brs.length) {
      $_20yqgb4jc7tm6aj.each(brs, $_gi2jzz2gjc7tm7a2.remove);
    }
  };
  var fillWithPaddingBr = function (elm) {
    $_gi2jzz2gjc7tm7a2.empty(elm);
    $_bacixv2fjc7tm79x.append(elm, $_bscr39yjc7tm6uo.fromHtml('<br data-mce-bogus="1">'));
  };
  var isPaddingContents = function (elm) {
    return $_4bxsjnzjc7tm6uw.isText(elm) ? $_3rk0xt2ijc7tm7au.get(elm) === '\xA0' : $_8zplag1pjc7tm70h.isBr(elm);
  };
  var isPaddedElement = function (elm) {
    return $_20yqgb4jc7tm6aj.filter($_15fekq17jc7tm6wo.children(elm), isPaddingContents).length === 1;
  };
  var trimBlockTrailingBr = function (elm) {
    $_15fekq17jc7tm6wo.lastChild(elm).each(function (lastChild) {
      $_15fekq17jc7tm6wo.prevSibling(lastChild).each(function (lastChildPrevSibling) {
        if ($_8zplag1pjc7tm70h.isBlock(elm) && $_8zplag1pjc7tm70h.isBr(lastChild) && $_8zplag1pjc7tm70h.isBlock(lastChildPrevSibling)) {
          $_gi2jzz2gjc7tm7a2.remove(lastChild);
        }
      });
    });
  };
  var $_82ax5c2ejc7tm79k = {
    removeTrailingBr: removeTrailingBr,
    fillWithPaddingBr: fillWithPaddingBr,
    isPaddedElement: isPaddedElement,
    trimBlockTrailingBr: trimBlockTrailingBr
  };

  var makeMap$3 = $_b8tc32jjc7tm6qi.makeMap;
  var Writer = function (settings) {
    var html = [], indent, indentBefore, indentAfter, encode, htmlOutput;
    settings = settings || {};
    indent = settings.indent;
    indentBefore = makeMap$3(settings.indent_before || '');
    indentAfter = makeMap$3(settings.indent_after || '');
    encode = Entities.getEncodeFunc(settings.entity_encoding || 'raw', settings.entities);
    htmlOutput = settings.element_format == 'html';
    return {
      start: function (name, attrs, empty) {
        var i, l, attr, value;
        if (indent && indentBefore[name] && html.length > 0) {
          value = html[html.length - 1];
          if (value.length > 0 && value !== '\n') {
            html.push('\n');
          }
        }
        html.push('<', name);
        if (attrs) {
          for (i = 0, l = attrs.length; i < l; i++) {
            attr = attrs[i];
            html.push(' ', attr.name, '="', encode(attr.value, true), '"');
          }
        }
        if (!empty || htmlOutput) {
          html[html.length] = '>';
        } else {
          html[html.length] = ' />';
        }
        if (empty && indent && indentAfter[name] && html.length > 0) {
          value = html[html.length - 1];
          if (value.length > 0 && value !== '\n') {
            html.push('\n');
          }
        }
      },
      end: function (name) {
        var value;
        html.push('</', name, '>');
        if (indent && indentAfter[name] && html.length > 0) {
          value = html[html.length - 1];
          if (value.length > 0 && value !== '\n') {
            html.push('\n');
          }
        }
      },
      text: function (text, raw) {
        if (text.length > 0) {
          html[html.length] = raw ? text : encode(text);
        }
      },
      cdata: function (text) {
        html.push('<![CDATA[', text, ']]>');
      },
      comment: function (text) {
        html.push('<!--', text, '-->');
      },
      pi: function (name, text) {
        if (text) {
          html.push('<?', name, ' ', encode(text), '?>');
        } else {
          html.push('<?', name, '?>');
        }
        if (indent) {
          html.push('\n');
        }
      },
      doctype: function (text) {
        html.push('<!DOCTYPE', text, '>', indent ? '\n' : '');
      },
      reset: function () {
        html.length = 0;
      },
      getContent: function () {
        return html.join('').replace(/\n$/, '');
      }
    };
  };

  var Serializer = function (settings, schema) {
    var self = {}, writer = Writer(settings);
    settings = settings || {};
    settings.validate = 'validate' in settings ? settings.validate : true;
    self.schema = schema = schema || Schema();
    self.writer = writer;
    self.serialize = function (node) {
      var handlers, validate;
      validate = settings.validate;
      handlers = {
        3: function (node) {
          writer.text(node.value, node.raw);
        },
        8: function (node) {
          writer.comment(node.value);
        },
        7: function (node) {
          writer.pi(node.name, node.value);
        },
        10: function (node) {
          writer.doctype(node.value);
        },
        4: function (node) {
          writer.cdata(node.value);
        },
        11: function (node) {
          if (node = node.firstChild) {
            do {
              walk(node);
            } while (node = node.next);
          }
        }
      };
      writer.reset();
      var walk = function (node) {
        var handler = handlers[node.type], name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule;
        if (!handler) {
          name = node.name;
          isEmpty = node.shortEnded;
          attrs = node.attributes;
          if (validate && attrs && attrs.length > 1) {
            sortedAttrs = [];
            sortedAttrs.map = {};
            elementRule = schema.getElementRule(node.name);
            if (elementRule) {
              for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) {
                attrName = elementRule.attributesOrder[i];
                if (attrName in attrs.map) {
                  attrValue = attrs.map[attrName];
                  sortedAttrs.map[attrName] = attrValue;
                  sortedAttrs.push({
                    name: attrName,
                    value: attrValue
                  });
                }
              }
              for (i = 0, l = attrs.length; i < l; i++) {
                attrName = attrs[i].name;
                if (!(attrName in sortedAttrs.map)) {
                  attrValue = attrs.map[attrName];
                  sortedAttrs.map[attrName] = attrValue;
                  sortedAttrs.push({
                    name: attrName,
                    value: attrValue
                  });
                }
              }
              attrs = sortedAttrs;
            }
          }
          writer.start(node.name, attrs, isEmpty);
          if (!isEmpty) {
            if (node = node.firstChild) {
              do {
                walk(node);
              } while (node = node.next);
            }
            writer.end(name);
          }
        } else {
          handler(node);
        }
      };
      if (node.type == 1 && !settings.inner) {
        walk(node);
      } else {
        handlers[11](node);
      }
      return writer.getContent();
    };
    return self;
  };

  var walkToPositionIn = function (forward, rootNode, startNode) {
    var position = forward ? CaretPosition.before(startNode) : CaretPosition.after(startNode);
    return fromPosition(forward, rootNode, position);
  };
  var afterElement = function (node) {
    return $_1qi2bn1qjc7tm70u.isBr(node) ? CaretPosition.before(node) : CaretPosition.after(node);
  };
  var isBeforeOrStart = function (position) {
    if (CaretPosition.isTextPosition(position)) {
      return position.offset() === 0;
    } else {
      return $_bnhdlx1zjc7tm75s.isCaretCandidate(position.getNode());
    }
  };
  var isAfterOrEnd = function (position) {
    if (CaretPosition.isTextPosition(position)) {
      return position.offset() === position.container().data.length;
    } else {
      return $_bnhdlx1zjc7tm75s.isCaretCandidate(position.getNode(true));
    }
  };
  var isBeforeAfterSameElement = function (from, to) {
    return !CaretPosition.isTextPosition(from) && !CaretPosition.isTextPosition(to) && from.getNode() === to.getNode(true);
  };
  var isAtBr = function (position) {
    return !CaretPosition.isTextPosition(position) && $_1qi2bn1qjc7tm70u.isBr(position.getNode());
  };
  var shouldSkipPosition = function (forward, from, to) {
    if (forward) {
      return !isBeforeAfterSameElement(from, to) && !isAtBr(from) && isAfterOrEnd(from) && isBeforeOrStart(to);
    } else {
      return !isBeforeAfterSameElement(to, from) && isBeforeOrStart(from) && isAfterOrEnd(to);
    }
  };
  var fromPosition = function (forward, rootNode, position) {
    var walker = CaretWalker(rootNode);
    return $_e5uurj5jc7tm6bt.from(forward ? walker.next(position) : walker.prev(position));
  };
  var navigate = function (forward, rootNode, from) {
    return fromPosition(forward, rootNode, from).bind(function (to) {
      if ($_4knc0r27jc7tm77s.isInSameBlock(from, to, rootNode) && shouldSkipPosition(forward, from, to)) {
        return fromPosition(forward, rootNode, to);
      } else {
        return $_e5uurj5jc7tm6bt.some(to);
      }
    });
  };
  var positionIn = function (forward, element) {
    var startNode = forward ? element.firstChild : element.lastChild;
    if ($_1qi2bn1qjc7tm70u.isText(startNode)) {
      return $_e5uurj5jc7tm6bt.some(new CaretPosition(startNode, forward ? 0 : startNode.data.length));
    } else if (startNode) {
      if ($_bnhdlx1zjc7tm75s.isCaretCandidate(startNode)) {
        return $_e5uurj5jc7tm6bt.some(forward ? CaretPosition.before(startNode) : afterElement(startNode));
      } else {
        return walkToPositionIn(forward, element, startNode);
      }
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var $_d2dq9h2pjc7tm7c9 = {
    fromPosition: fromPosition,
    nextPosition: $_f41mrx6jc7tm6cd.curry(fromPosition, true),
    prevPosition: $_f41mrx6jc7tm6cd.curry(fromPosition, false),
    navigate: navigate,
    positionIn: positionIn,
    firstPositionIn: $_f41mrx6jc7tm6cd.curry(positionIn, true),
    lastPositionIn: $_f41mrx6jc7tm6cd.curry(positionIn, false)
  };

  var createRange$1 = function (sc, so, ec, eo) {
    var rng = document.createRange();
    rng.setStart(sc, so);
    rng.setEnd(ec, eo);
    return rng;
  };
  var normalizeBlockSelectionRange = function (rng) {
    var startPos = CaretPosition.fromRangeStart(rng);
    var endPos = CaretPosition.fromRangeEnd(rng);
    var rootNode = rng.commonAncestorContainer;
    return $_d2dq9h2pjc7tm7c9.fromPosition(false, rootNode, endPos).map(function (newEndPos) {
      if (!$_4knc0r27jc7tm77s.isInSameBlock(startPos, endPos, rootNode) && $_4knc0r27jc7tm77s.isInSameBlock(startPos, newEndPos, rootNode)) {
        return createRange$1(startPos.container(), startPos.offset(), newEndPos.container(), newEndPos.offset());
      } else {
        return rng;
      }
    }).getOr(rng);
  };
  var normalizeBlockSelection = function (rng) {
    return rng.collapsed ? rng : normalizeBlockSelectionRange(rng);
  };
  var normalize = function (rng) {
    return normalizeBlockSelection(rng);
  };
  var $_f0orrf2ojc7tm7c3 = { normalize: normalize };

  var isTableCell = $_1qi2bn1qjc7tm70u.matchNodeNames('td th');
  var validInsertion = function (editor, value, parentNode) {
    if (parentNode.getAttribute('data-mce-bogus') === 'all') {
      parentNode.parentNode.insertBefore(editor.dom.createFragment(value), parentNode);
    } else {
      var node = parentNode.firstChild;
      var node2 = parentNode.lastChild;
      if (!node || node === node2 && node.nodeName === 'BR') {
        editor.dom.setHTML(parentNode, value);
      } else {
        editor.selection.setContent(value);
      }
    }
  };
  var trimBrsFromTableCell = function (dom, elm) {
    $_e5uurj5jc7tm6bt.from(dom.getParent(elm, 'td,th')).map($_bscr39yjc7tm6uo.fromDom).each($_82ax5c2ejc7tm79k.trimBlockTrailingBr);
  };
  var insertHtmlAtCaret = function (editor, value, details) {
    var parser, serializer, parentNode, rootNode, fragment, args;
    var marker, rng, node, node2, bookmarkHtml, merge;
    var textInlineElements = editor.schema.getTextInlineElements();
    var selection = editor.selection, dom = editor.dom;
    var trimOrPaddLeftRight = function (html) {
      var rng, container, offset;
      rng = selection.getRng(true);
      container = rng.startContainer;
      offset = rng.startOffset;
      var hasSiblingText = function (siblingName) {
        return container[siblingName] && container[siblingName].nodeType == 3;
      };
      if (container.nodeType == 3) {
        if (offset > 0) {
          html = html.replace(/^&nbsp;/, ' ');
        } else if (!hasSiblingText('previousSibling')) {
          html = html.replace(/^ /, '&nbsp;');
        }
        if (offset < container.length) {
          html = html.replace(/&nbsp;(<br>|)$/, ' ');
        } else if (!hasSiblingText('nextSibling')) {
          html = html.replace(/(&nbsp;| )(<br>|)$/, '&nbsp;');
        }
      }
      return html;
    };
    var trimNbspAfterDeleteAndPaddValue = function () {
      var rng, container, offset;
      rng = selection.getRng(true);
      container = rng.startContainer;
      offset = rng.startOffset;
      if (container.nodeType == 3 && rng.collapsed) {
        if (container.data[offset] === '\xA0') {
          container.deleteData(offset, 1);
          if (!/[\u00a0| ]$/.test(value)) {
            value += ' ';
          }
        } else if (container.data[offset - 1] === '\xA0') {
          container.deleteData(offset - 1, 1);
          if (!/[\u00a0| ]$/.test(value)) {
            value = ' ' + value;
          }
        }
      }
    };
    var reduceInlineTextElements = function () {
      if (merge) {
        var root = editor.getBody(), elementUtils = new ElementUtils(dom);
        $_b8tc32jjc7tm6qi.each(dom.select('*[data-mce-fragment]'), function (node) {
          for (var testNode = node.parentNode; testNode && testNode != root; testNode = testNode.parentNode) {
            if (textInlineElements[node.nodeName.toLowerCase()] && elementUtils.compare(testNode, node)) {
              dom.remove(node, true);
            }
          }
        });
      }
    };
    var markFragmentElements = function (fragment) {
      var node = fragment;
      while (node = node.walk()) {
        if (node.type === 1) {
          node.attr('data-mce-fragment', '1');
        }
      }
    };
    var umarkFragmentElements = function (elm) {
      $_b8tc32jjc7tm6qi.each(elm.getElementsByTagName('*'), function (elm) {
        elm.removeAttribute('data-mce-fragment');
      });
    };
    var isPartOfFragment = function (node) {
      return !!node.getAttribute('data-mce-fragment');
    };
    var canHaveChildren = function (node) {
      return node && !editor.schema.getShortEndedElements()[node.nodeName];
    };
    var moveSelectionToMarker = function (marker) {
      var parentEditableFalseElm, parentBlock, nextRng;
      var getContentEditableFalseParent = function (node) {
        var root = editor.getBody();
        for (; node && node !== root; node = node.parentNode) {
          if (editor.dom.getContentEditable(node) === 'false') {
            return node;
          }
        }
        return null;
      };
      if (!marker) {
        return;
      }
      selection.scrollIntoView(marker);
      parentEditableFalseElm = getContentEditableFalseParent(marker);
      if (parentEditableFalseElm) {
        dom.remove(marker);
        selection.select(parentEditableFalseElm);
        return;
      }
      rng = dom.createRng();
      node = marker.previousSibling;
      if (node && node.nodeType == 3) {
        rng.setStart(node, node.nodeValue.length);
        if (!$_dtgtsy9jc7tm6gs.ie) {
          node2 = marker.nextSibling;
          if (node2 && node2.nodeType == 3) {
            node.appendData(node2.data);
            node2.parentNode.removeChild(node2);
          }
        }
      } else {
        rng.setStartBefore(marker);
        rng.setEndBefore(marker);
      }
      var findNextCaretRng = function (rng) {
        var caretPos = CaretPosition.fromRangeStart(rng);
        var caretWalker = CaretWalker(editor.getBody());
        caretPos = caretWalker.next(caretPos);
        if (caretPos) {
          return caretPos.toRange();
        }
      };
      parentBlock = dom.getParent(marker, dom.isBlock);
      dom.remove(marker);
      if (parentBlock && dom.isEmpty(parentBlock)) {
        editor.$(parentBlock).empty();
        rng.setStart(parentBlock, 0);
        rng.setEnd(parentBlock, 0);
        if (!isTableCell(parentBlock) && !isPartOfFragment(parentBlock) && (nextRng = findNextCaretRng(rng))) {
          rng = nextRng;
          dom.remove(parentBlock);
        } else {
          dom.add(parentBlock, dom.create('br', { 'data-mce-bogus': '1' }));
        }
      }
      selection.setRng(rng);
    };
    if (/^ | $/.test(value)) {
      value = trimOrPaddLeftRight(value);
    }
    parser = editor.parser;
    merge = details.merge;
    serializer = Serializer({ validate: editor.settings.validate }, editor.schema);
    bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">&#xFEFF;&#x200B;</span>';
    args = {
      content: value,
      format: 'html',
      selection: true,
      paste: details.paste
    };
    args = editor.fire('BeforeSetContent', args);
    if (args.isDefaultPrevented()) {
      editor.fire('SetContent', {
        content: args.content,
        format: 'html',
        selection: true,
        paste: details.paste
      });
      return;
    }
    value = args.content;
    if (value.indexOf('{$caret}') == -1) {
      value += '{$caret}';
    }
    value = value.replace(/\{\$caret\}/, bookmarkHtml);
    rng = selection.getRng();
    var caretElement = rng.startContainer || (rng.parentElement ? rng.parentElement() : null);
    var body = editor.getBody();
    if (caretElement === body && selection.isCollapsed()) {
      if (dom.isBlock(body.firstChild) && canHaveChildren(body.firstChild) && dom.isEmpty(body.firstChild)) {
        rng = dom.createRng();
        rng.setStart(body.firstChild, 0);
        rng.setEnd(body.firstChild, 0);
        selection.setRng(rng);
      }
    }
    if (!selection.isCollapsed()) {
      editor.selection.setRng($_f0orrf2ojc7tm7c3.normalize(editor.selection.getRng()));
      editor.getDoc().execCommand('Delete', false, null);
      trimNbspAfterDeleteAndPaddValue();
    }
    parentNode = selection.getNode();
    var parserArgs = {
      context: parentNode.nodeName.toLowerCase(),
      data: details.data,
      insert: true
    };
    fragment = parser.parse(value, parserArgs);
    if (details.paste === true && $_dnpt631xjc7tm755.isListFragment(editor.schema, fragment) && $_dnpt631xjc7tm755.isParentBlockLi(dom, parentNode)) {
      rng = $_dnpt631xjc7tm755.insertAtCaret(serializer, dom, editor.selection.getRng(true), fragment);
      editor.selection.setRng(rng);
      editor.fire('SetContent', args);
      return;
    }
    markFragmentElements(fragment);
    node = fragment.lastChild;
    if (node.attr('id') == 'mce_marker') {
      marker = node;
      for (node = node.prev; node; node = node.walk(true)) {
        if (node.type == 3 || !dom.isBlock(node.name)) {
          if (editor.schema.isValidChild(node.parent.name, 'span')) {
            node.parent.insert(marker, node, node.name === 'br');
          }
          break;
        }
      }
    }
    editor._selectionOverrides.showBlockCaretContainer(parentNode);
    if (!parserArgs.invalid) {
      value = serializer.serialize(fragment);
      validInsertion(editor, value, parentNode);
    } else {
      selection.setContent(bookmarkHtml);
      parentNode = selection.getNode();
      rootNode = editor.getBody();
      if (parentNode.nodeType == 9) {
        parentNode = node = rootNode;
      } else {
        node = parentNode;
      }
      while (node !== rootNode) {
        parentNode = node;
        node = node.parentNode;
      }
      value = parentNode == rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode);
      value = serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, function () {
        return serializer.serialize(fragment);
      })));
      if (parentNode == rootNode) {
        dom.setHTML(rootNode, value);
      } else {
        dom.setOuterHTML(parentNode, value);
      }
    }
    reduceInlineTextElements();
    moveSelectionToMarker(dom.get('mce_marker'));
    umarkFragmentElements(editor.getBody());
    trimBrsFromTableCell(editor.dom, editor.selection.getStart());
    editor.fire('SetContent', args);
    editor.addVisual();
  };
  var processValue = function (value) {
    var details;
    if (typeof value !== 'string') {
      details = $_b8tc32jjc7tm6qi.extend({
        paste: value.paste,
        data: { paste: value.paste }
      }, value);
      return {
        content: value.content,
        details: details
      };
    }
    return {
      content: value,
      details: {}
    };
  };
  var insertAtCaret = function (editor, value) {
    var result = processValue(value);
    insertHtmlAtCaret(editor, result.content, result.details);
  };
  var $_8kiytu1wjc7tm74r = { insertAtCaret: insertAtCaret };

  var ClosestOrAncestor = function (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_e5uurj5jc7tm6bt.some(scope) : $_1g0kpc12jc7tm6vn.isFunction(isRoot) && isRoot(scope) ? $_e5uurj5jc7tm6bt.none() : ancestor(scope, a, isRoot);
  };

  var first$1 = function (predicate) {
    return descendant($_2hnc5315jc7tm6wb.body(), predicate);
  };
  var ancestor = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_1g0kpc12jc7tm6vn.isFunction(isRoot) ? isRoot : $_f41mrx6jc7tm6cd.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_bscr39yjc7tm6uo.fromDom(element);
      if (predicate(el))
        return $_e5uurj5jc7tm6bt.some(el);
      else if (stop(el))
        break;
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var closest = function (scope, predicate, isRoot) {
    var is = function (scope) {
      return predicate(scope);
    };
    return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
  };
  var sibling$1 = function (scope, predicate) {
    var element = scope.dom();
    if (!element.parentNode)
      return $_e5uurj5jc7tm6bt.none();
    return child$1($_bscr39yjc7tm6uo.fromDom(element.parentNode), function (x) {
      return !$_b0e3uw1djc7tm6y8.eq(scope, x) && predicate(x);
    });
  };
  var child$1 = function (scope, predicate) {
    var result = $_20yqgb4jc7tm6aj.find(scope.dom().childNodes, $_f41mrx6jc7tm6cd.compose(predicate, $_bscr39yjc7tm6uo.fromDom));
    return result.map($_bscr39yjc7tm6uo.fromDom);
  };
  var descendant = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_bscr39yjc7tm6uo.fromDom(element.childNodes[i])))
          return $_e5uurj5jc7tm6bt.some($_bscr39yjc7tm6uo.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_e5uurj5jc7tm6bt.none();
    };
    return descend(scope.dom());
  };
  var $_agx7022ujc7tm7f1 = {
    first: first$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling$1,
    child: child$1,
    descendant: descendant
  };

  var sectionResult = $_4vs0gm18jc7tm6xh.immutable('sections', 'settings');
  var detection = $_e43n9tmjc7tm6ss.detect();
  var isTouch = detection.deviceType.isTouch();
  var mobilePlugins = [
    'lists',
    'autolink',
    'autosave'
  ];
  var defaultMobileSettings = { theme: 'mobile' };
  var normalizePlugins = function (plugins) {
    var pluginNames = $_1g0kpc12jc7tm6vn.isArray(plugins) ? plugins.join(' ') : plugins;
    var trimmedPlugins = $_20yqgb4jc7tm6aj.map($_1g0kpc12jc7tm6vn.isString(pluginNames) ? pluginNames.split(' ') : [], $_esne4hvjc7tm6ub.trim);
    return $_20yqgb4jc7tm6aj.filter(trimmedPlugins, function (item) {
      return item.length > 0;
    });
  };
  var filterMobilePlugins = function (plugins) {
    return $_20yqgb4jc7tm6aj.filter(plugins, $_f41mrx6jc7tm6cd.curry($_20yqgb4jc7tm6aj.contains, mobilePlugins));
  };
  var extractSections = function (keys, settings) {
    var result = $_fttkez13jc7tm6vs.bifilter(settings, function (value, key) {
      return $_20yqgb4jc7tm6aj.contains(keys, key);
    });
    return sectionResult(result.t, result.f);
  };
  var getSection = function (sectionResult, name, defaults) {
    var sections = sectionResult.sections();
    var sectionSettings = sections.hasOwnProperty(name) ? sections[name] : {};
    return $_b8tc32jjc7tm6qi.extend({}, defaults, sectionSettings);
  };
  var hasSection = function (sectionResult, name) {
    return sectionResult.sections().hasOwnProperty(name);
  };
  var getDefaultSettings = function (id, documentBaseUrl, editor) {
    return {
      id: id,
      theme: 'modern',
      delta_width: 0,
      delta_height: 0,
      popup_css: '',
      plugins: '',
      document_base_url: documentBaseUrl,
      add_form_submit_trigger: true,
      submit_patch: true,
      add_unload_trigger: true,
      convert_urls: true,
      relative_urls: true,
      remove_script_host: true,
      object_resizing: true,
      doctype: '<!DOCTYPE html>',
      visual: true,
      font_size_style_values: 'xx-small,x-small,small,medium,large,x-large,xx-large',
      font_size_legacy_values: 'xx-small,small,medium,large,x-large,xx-large,300%',
      forced_root_block: 'p',
      hidden_input: true,
      padd_empty_editor: true,
      render_ui: true,
      indentation: '30px',
      inline_styles: true,
      convert_fonts_to_spans: true,
      indent: 'simple',
      indent_before: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
      indent_after: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,th,ul,ol,li,dl,dt,dd,area,table,thead,' + 'tfoot,tbody,tr,section,article,hgroup,aside,figure,figcaption,option,optgroup,datalist',
      entity_encoding: 'named',
      url_converter: editor.convertURL,
      url_converter_scope: editor,
      ie7_compat: true
    };
  };
  var getExternalPlugins = function (overrideSettings, settings) {
    var userDefinedExternalPlugins = settings.external_plugins ? settings.external_plugins : {};
    if (overrideSettings && overrideSettings.external_plugins) {
      return $_b8tc32jjc7tm6qi.extend({}, overrideSettings.external_plugins, userDefinedExternalPlugins);
    } else {
      return userDefinedExternalPlugins;
    }
  };
  var combinePlugins = function (forcedPlugins, plugins) {
    return [].concat(normalizePlugins(forcedPlugins)).concat(normalizePlugins(plugins));
  };
  var processPlugins = function (isTouchDevice, sectionResult, defaultOverrideSettings, settings) {
    var forcedPlugins = normalizePlugins(defaultOverrideSettings.forced_plugins);
    var plugins = normalizePlugins(settings.plugins);
    var platformPlugins = isTouchDevice && hasSection(sectionResult, 'mobile') ? filterMobilePlugins(plugins) : plugins;
    var combinedPlugins = combinePlugins(forcedPlugins, platformPlugins);
    return $_b8tc32jjc7tm6qi.extend(settings, { plugins: combinedPlugins.join(' ') });
  };
  var isOnMobile = function (isTouchDevice, sectionResult) {
    var isInline = sectionResult.settings().inline;
    return isTouchDevice && hasSection(sectionResult, 'mobile') && !isInline;
  };
  var combineSettings = function (isTouchDevice, defaultSettings, defaultOverrideSettings, settings) {
    var sectionResult = extractSections(['mobile'], settings);
    var extendedSettings = $_b8tc32jjc7tm6qi.extend(defaultSettings, defaultOverrideSettings, sectionResult.settings(), isOnMobile(isTouchDevice, sectionResult) ? getSection(sectionResult, 'mobile', defaultMobileSettings) : {}, {
      validate: true,
      content_editable: sectionResult.settings().inline,
      external_plugins: getExternalPlugins(defaultOverrideSettings, sectionResult.settings())
    });
    return processPlugins(isTouchDevice, sectionResult, defaultOverrideSettings, extendedSettings);
  };
  var getEditorSettings = function (editor, id, documentBaseUrl, defaultOverrideSettings, settings) {
    var defaultSettings = getDefaultSettings(id, documentBaseUrl, editor);
    return combineSettings(isTouch, defaultSettings, defaultOverrideSettings, settings);
  };
  var get$3 = function (editor, name) {
    return $_e5uurj5jc7tm6bt.from(editor.settings[name]);
  };
  var getFiltered = function (predicate, editor, name) {
    return $_e5uurj5jc7tm6bt.from(editor.settings[name]).filter(predicate);
  };
  var $_4dtvpj2xjc7tm7fy = {
    getEditorSettings: getEditorSettings,
    get: get$3,
    getString: $_f41mrx6jc7tm6cd.curry(getFiltered, $_1g0kpc12jc7tm6vn.isString),
    combineSettings: combineSettings
  };

  var strongRtl = /[\u0591-\u07FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
  var hasStrongRtl = function (text) {
    return strongRtl.test(text);
  };
  var $_bhnwdk2yjc7tm7gd = { hasStrongRtl: hasStrongRtl };

  var isInlineTarget = function (editor, elm) {
    var selector = $_4dtvpj2xjc7tm7fy.getString(editor, 'inline_boundaries_selector').getOr('a[href],code');
    return $_dnzz0a1fjc7tm6yr.is($_bscr39yjc7tm6uo.fromDom(elm), selector);
  };
  var isRtl = function (element) {
    return DOMUtils.DOM.getStyle(element, 'direction', true) === 'rtl' || $_bhnwdk2yjc7tm7gd.hasStrongRtl(element.textContent);
  };
  var findInlineParents = function (isInlineTarget, rootNode, pos) {
    return $_20yqgb4jc7tm6aj.filter(DOMUtils.DOM.getParents(pos.container(), '*', rootNode), isInlineTarget);
  };
  var findRootInline = function (isInlineTarget, rootNode, pos) {
    var parents = findInlineParents(isInlineTarget, rootNode, pos);
    return $_e5uurj5jc7tm6bt.from(parents[parents.length - 1]);
  };
  var hasSameParentBlock = function (rootNode, node1, node2) {
    var block1 = $_4knc0r27jc7tm77s.getParentBlock(node1, rootNode);
    var block2 = $_4knc0r27jc7tm77s.getParentBlock(node2, rootNode);
    return block1 && block1 === block2;
  };
  var isAtZwsp = function (pos) {
    return $_40segn20jc7tm75y.isBeforeInline(pos) || $_40segn20jc7tm75y.isAfterInline(pos);
  };
  var normalizePosition = function (forward, pos) {
    var container = pos.container(), offset = pos.offset();
    if (forward) {
      if ($_40segn20jc7tm75y.isCaretContainerInline(container)) {
        if ($_1qi2bn1qjc7tm70u.isText(container.nextSibling)) {
          return new CaretPosition(container.nextSibling, 0);
        } else {
          return CaretPosition.after(container);
        }
      } else {
        return $_40segn20jc7tm75y.isBeforeInline(pos) ? new CaretPosition(container, offset + 1) : pos;
      }
    } else {
      if ($_40segn20jc7tm75y.isCaretContainerInline(container)) {
        if ($_1qi2bn1qjc7tm70u.isText(container.previousSibling)) {
          return new CaretPosition(container.previousSibling, container.previousSibling.data.length);
        } else {
          return CaretPosition.before(container);
        }
      } else {
        return $_40segn20jc7tm75y.isAfterInline(pos) ? new CaretPosition(container, offset - 1) : pos;
      }
    }
  };
  var normalizeForwards = $_f41mrx6jc7tm6cd.curry(normalizePosition, true);
  var normalizeBackwards = $_f41mrx6jc7tm6cd.curry(normalizePosition, false);
  var $_9dady72wjc7tm7fl = {
    isInlineTarget: isInlineTarget,
    findRootInline: findRootInline,
    isRtl: isRtl,
    isAtZwsp: isAtZwsp,
    normalizePosition: normalizePosition,
    normalizeForwards: normalizeForwards,
    normalizeBackwards: normalizeBackwards,
    hasSameParentBlock: hasSameParentBlock
  };

  var isBeforeRoot = function (rootNode) {
    return function (elm) {
      return $_b0e3uw1djc7tm6y8.eq(rootNode, $_bscr39yjc7tm6uo.fromDom(elm.dom().parentNode));
    };
  };
  var getParentBlock$1 = function (rootNode, elm) {
    return $_b0e3uw1djc7tm6y8.contains(rootNode, elm) ? $_agx7022ujc7tm7f1.closest(elm, function (element) {
      return $_8zplag1pjc7tm70h.isTextBlock(element) || $_8zplag1pjc7tm70h.isListItem(element);
    }, isBeforeRoot(rootNode)) : $_e5uurj5jc7tm6bt.none();
  };
  var placeCaretInEmptyBody = function (editor) {
    var body = editor.getBody();
    var node = body.firstChild && editor.dom.isBlock(body.firstChild) ? body.firstChild : body;
    editor.selection.setCursorLocation(node, 0);
  };
  var paddEmptyBody = function (editor) {
    if (editor.dom.isEmpty(editor.getBody())) {
      editor.setContent('');
      placeCaretInEmptyBody(editor);
    }
  };
  var willDeleteLastPositionInElement = function (forward, fromPos, elm) {
    return $_2siq12djc7tm79e.liftN([
      $_d2dq9h2pjc7tm7c9.firstPositionIn(elm),
      $_d2dq9h2pjc7tm7c9.lastPositionIn(elm)
    ], function (firstPos, lastPos) {
      var normalizedFirstPos = $_9dady72wjc7tm7fl.normalizePosition(true, firstPos);
      var normalizedLastPos = $_9dady72wjc7tm7fl.normalizePosition(false, lastPos);
      var normalizedFromPos = $_9dady72wjc7tm7fl.normalizePosition(false, fromPos);
      if (forward) {
        return $_d2dq9h2pjc7tm7c9.nextPosition(elm, normalizedFromPos).map(function (nextPos) {
          return nextPos.isEqual(normalizedLastPos) && fromPos.isEqual(normalizedFirstPos);
        }).getOr(false);
      } else {
        return $_d2dq9h2pjc7tm7c9.prevPosition(elm, normalizedFromPos).map(function (prevPos) {
          return prevPos.isEqual(normalizedFirstPos) && fromPos.isEqual(normalizedLastPos);
        }).getOr(false);
      }
    }).getOr(true);
  };
  var $_2qjhc22tjc7tm7dx = {
    getParentBlock: getParentBlock$1,
    paddEmptyBody: paddEmptyBody,
    willDeleteLastPositionInElement: willDeleteLastPositionInElement
  };

  var first$2 = function (selector) {
    return $_dnzz0a1fjc7tm6yr.one(selector);
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_agx7022ujc7tm7f1.ancestor(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    }, isRoot);
  };
  var sibling$3 = function (scope, selector) {
    return $_agx7022ujc7tm7f1.sibling(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    });
  };
  var child$3 = function (scope, selector) {
    return $_agx7022ujc7tm7f1.child(scope, function (e) {
      return $_dnzz0a1fjc7tm6yr.is(e, selector);
    });
  };
  var descendant$2 = function (scope, selector) {
    return $_dnzz0a1fjc7tm6yr.one(selector, scope);
  };
  var closest$2 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_dnzz0a1fjc7tm6yr.is, ancestor$2, scope, selector, isRoot);
  };
  var $_d6v5nd31jc7tm7gs = {
    first: first$2,
    ancestor: ancestor$2,
    sibling: sibling$3,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var any = function (selector) {
    return $_d6v5nd31jc7tm7gs.first(selector).isSome();
  };
  var ancestor$1 = function (scope, selector, isRoot) {
    return $_d6v5nd31jc7tm7gs.ancestor(scope, selector, isRoot).isSome();
  };
  var sibling$2 = function (scope, selector) {
    return $_d6v5nd31jc7tm7gs.sibling(scope, selector).isSome();
  };
  var child$2 = function (scope, selector) {
    return $_d6v5nd31jc7tm7gs.child(scope, selector).isSome();
  };
  var descendant$1 = function (scope, selector) {
    return $_d6v5nd31jc7tm7gs.descendant(scope, selector).isSome();
  };
  var closest$1 = function (scope, selector, isRoot) {
    return $_d6v5nd31jc7tm7gs.closest(scope, selector, isRoot).isSome();
  };
  var $_g9bbeh30jc7tm7go = {
    any: any,
    ancestor: ancestor$1,
    sibling: sibling$2,
    child: child$2,
    descendant: descendant$1,
    closest: closest$1
  };

  var hasWhitespacePreserveParent = function (rootNode, node) {
    var rootElement = $_bscr39yjc7tm6uo.fromDom(rootNode);
    var startNode = $_bscr39yjc7tm6uo.fromDom(node);
    return $_g9bbeh30jc7tm7go.ancestor(startNode, 'pre,code', $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, rootElement));
  };
  var isWhitespace = function (rootNode, node) {
    return $_1qi2bn1qjc7tm70u.isText(node) && /^[ \t\r\n]*$/.test(node.data) && hasWhitespacePreserveParent(rootNode, node) === false;
  };
  var isNamedAnchor = function (node) {
    return $_1qi2bn1qjc7tm70u.isElement(node) && node.nodeName === 'A' && node.hasAttribute('name');
  };
  var isContent = function (rootNode, node) {
    return $_bnhdlx1zjc7tm75s.isCaretCandidate(node) && isWhitespace(rootNode, node) === false || isNamedAnchor(node) || isBookmark(node);
  };
  var isBookmark = $_1qi2bn1qjc7tm70u.hasAttribute('data-mce-bookmark');
  var isBogus$2 = $_1qi2bn1qjc7tm70u.hasAttribute('data-mce-bogus');
  var isBogusAll = $_1qi2bn1qjc7tm70u.hasAttributeValue('data-mce-bogus', 'all');
  var isEmptyNode = function (targetNode) {
    var walker, node, brCount = 0;
    if (isContent(targetNode, targetNode)) {
      return false;
    } else {
      node = targetNode.firstChild;
      if (!node) {
        return true;
      }
      walker = new TreeWalker(node, targetNode);
      do {
        if (isBogusAll(node)) {
          node = walker.next(true);
          continue;
        }
        if (isBogus$2(node)) {
          node = walker.next();
          continue;
        }
        if ($_1qi2bn1qjc7tm70u.isBr(node)) {
          brCount++;
          node = walker.next();
          continue;
        }
        if (isContent(targetNode, node)) {
          return false;
        }
        node = walker.next();
      } while (node);
      return brCount <= 1;
    }
  };
  var isEmpty = function (elm) {
    return isEmptyNode(elm.dom());
  };
  var $_2pntmm2zjc7tm7gh = { isEmpty: isEmpty };

  var BlockPosition = $_4vs0gm18jc7tm6xh.immutable('block', 'position');
  var BlockBoundary = $_4vs0gm18jc7tm6xh.immutable('from', 'to');
  var getBlockPosition = function (rootNode, pos) {
    var rootElm = $_bscr39yjc7tm6uo.fromDom(rootNode);
    var containerElm = $_bscr39yjc7tm6uo.fromDom(pos.container());
    return $_2qjhc22tjc7tm7dx.getParentBlock(rootElm, containerElm).map(function (block) {
      return BlockPosition(block, pos);
    });
  };
  var isDifferentBlocks = function (blockBoundary) {
    return $_b0e3uw1djc7tm6y8.eq(blockBoundary.from().block(), blockBoundary.to().block()) === false;
  };
  var hasSameParent = function (blockBoundary) {
    return $_15fekq17jc7tm6wo.parent(blockBoundary.from().block()).bind(function (parent1) {
      return $_15fekq17jc7tm6wo.parent(blockBoundary.to().block()).filter(function (parent2) {
        return $_b0e3uw1djc7tm6y8.eq(parent1, parent2);
      });
    }).isSome();
  };
  var isEditable = function (blockBoundary) {
    return $_1qi2bn1qjc7tm70u.isContentEditableFalse(blockBoundary.from().block()) === false && $_1qi2bn1qjc7tm70u.isContentEditableFalse(blockBoundary.to().block()) === false;
  };
  var skipLastBr = function (rootNode, forward, blockPosition) {
    if ($_1qi2bn1qjc7tm70u.isBr(blockPosition.position().getNode()) && $_2pntmm2zjc7tm7gh.isEmpty(blockPosition.block()) === false) {
      return $_d2dq9h2pjc7tm7c9.positionIn(false, blockPosition.block().dom()).bind(function (lastPositionInBlock) {
        if (lastPositionInBlock.isEqual(blockPosition.position())) {
          return $_d2dq9h2pjc7tm7c9.fromPosition(forward, rootNode, lastPositionInBlock).bind(function (to) {
            return getBlockPosition(rootNode, to);
          });
        } else {
          return $_e5uurj5jc7tm6bt.some(blockPosition);
        }
      }).getOr(blockPosition);
    } else {
      return blockPosition;
    }
  };
  var readFromRange = function (rootNode, forward, rng) {
    var fromBlockPos = getBlockPosition(rootNode, CaretPosition.fromRangeStart(rng));
    var toBlockPos = fromBlockPos.bind(function (blockPos) {
      return $_d2dq9h2pjc7tm7c9.fromPosition(forward, rootNode, blockPos.position()).bind(function (to) {
        return getBlockPosition(rootNode, to).map(function (blockPos) {
          return skipLastBr(rootNode, forward, blockPos);
        });
      });
    });
    return $_2siq12djc7tm79e.liftN([
      fromBlockPos,
      toBlockPos
    ], BlockBoundary).filter(function (blockBoundary) {
      return isDifferentBlocks(blockBoundary) && hasSameParent(blockBoundary) && isEditable(blockBoundary);
    });
  };
  var read = function (rootNode, forward, rng) {
    return rng.collapsed ? readFromRange(rootNode, forward, rng) : $_e5uurj5jc7tm6bt.none();
  };
  var $_2czp642sjc7tm7d6 = { read: read };

  var dropLast = function (xs) {
    return xs.slice(0, -1);
  };
  var parentsUntil$1 = function (startNode, rootElm, predicate) {
    if ($_b0e3uw1djc7tm6y8.contains(rootElm, startNode)) {
      return dropLast($_15fekq17jc7tm6wo.parents(startNode, function (elm) {
        return predicate(elm) || $_b0e3uw1djc7tm6y8.eq(elm, rootElm);
      }));
    } else {
      return [];
    }
  };
  var parents$1 = function (startNode, rootElm) {
    return parentsUntil$1(startNode, rootElm, $_f41mrx6jc7tm6cd.constant(false));
  };
  var parentsAndSelf = function (startNode, rootElm) {
    return [startNode].concat(parents$1(startNode, rootElm));
  };
  var $_75x9wp33jc7tm7hb = {
    parentsUntil: parentsUntil$1,
    parents: parents$1,
    parentsAndSelf: parentsAndSelf
  };

  var getChildrenUntilBlockBoundary = function (block) {
    var children = $_15fekq17jc7tm6wo.children(block);
    return $_20yqgb4jc7tm6aj.findIndex(children, $_8zplag1pjc7tm70h.isBlock).fold(function () {
      return children;
    }, function (index) {
      return children.slice(0, index);
    });
  };
  var extractChildren = function (block) {
    var children = getChildrenUntilBlockBoundary(block);
    $_20yqgb4jc7tm6aj.each(children, function (node) {
      $_gi2jzz2gjc7tm7a2.remove(node);
    });
    return children;
  };
  var trimBr = function (first, block) {
    $_d2dq9h2pjc7tm7c9.positionIn(first, block.dom()).each(function (position) {
      var node = position.getNode();
      if ($_1qi2bn1qjc7tm70u.isBr(node)) {
        $_gi2jzz2gjc7tm7a2.remove($_bscr39yjc7tm6uo.fromDom(node));
      }
    });
  };
  var removeEmptyRoot = function (rootNode, block) {
    var parents = $_75x9wp33jc7tm7hb.parentsAndSelf(block, rootNode);
    return $_20yqgb4jc7tm6aj.find(parents.reverse(), $_2pntmm2zjc7tm7gh.isEmpty).each($_gi2jzz2gjc7tm7a2.remove);
  };
  var findParentInsertPoint = function (toBlock, block) {
    var parents = $_15fekq17jc7tm6wo.parents(block, function (elm) {
      return $_b0e3uw1djc7tm6y8.eq(elm, toBlock);
    });
    return $_e5uurj5jc7tm6bt.from(parents[parents.length - 2]);
  };
  var getInsertionPoint = function (fromBlock, toBlock) {
    if ($_b0e3uw1djc7tm6y8.contains(toBlock, fromBlock)) {
      return $_15fekq17jc7tm6wo.parent(fromBlock).bind(function (parent) {
        return $_b0e3uw1djc7tm6y8.eq(parent, toBlock) ? $_e5uurj5jc7tm6bt.some(fromBlock) : findParentInsertPoint(toBlock, fromBlock);
      });
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var mergeBlockInto = function (rootNode, fromBlock, toBlock) {
    if ($_2pntmm2zjc7tm7gh.isEmpty(toBlock)) {
      $_gi2jzz2gjc7tm7a2.remove(toBlock);
      if ($_2pntmm2zjc7tm7gh.isEmpty(fromBlock)) {
        $_82ax5c2ejc7tm79k.fillWithPaddingBr(fromBlock);
      }
      return $_d2dq9h2pjc7tm7c9.firstPositionIn(fromBlock.dom());
    } else {
      trimBr(true, fromBlock);
      trimBr(false, toBlock);
      var children = extractChildren(fromBlock);
      return getInsertionPoint(fromBlock, toBlock).fold(function () {
        removeEmptyRoot(rootNode, fromBlock);
        var position = $_d2dq9h2pjc7tm7c9.lastPositionIn(toBlock.dom());
        $_20yqgb4jc7tm6aj.each(children, function (node) {
          $_bacixv2fjc7tm79x.append(toBlock, node);
        });
        return position;
      }, function (target) {
        var position = $_d2dq9h2pjc7tm7c9.prevPosition(toBlock.dom(), CaretPosition.before(target.dom()));
        $_20yqgb4jc7tm6aj.each(children, function (node) {
          $_bacixv2fjc7tm79x.before(target, node);
        });
        removeEmptyRoot(rootNode, fromBlock);
        return position;
      });
    }
  };
  var mergeBlocks = function (rootNode, forward, block1, block2) {
    return forward ? mergeBlockInto(rootNode, block2, block1) : mergeBlockInto(rootNode, block1, block2);
  };
  var $_38iit332jc7tm7gy = { mergeBlocks: mergeBlocks };

  var backspaceDelete = function (editor, forward) {
    var position, rootNode = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    position = $_2czp642sjc7tm7d6.read(rootNode.dom(), forward, editor.selection.getRng()).bind(function (blockBoundary) {
      return $_38iit332jc7tm7gy.mergeBlocks(rootNode, forward, blockBoundary.from().block(), blockBoundary.to().block());
    });
    position.each(function (pos) {
      editor.selection.setRng(pos.toRange());
    });
    return position.isSome();
  };
  var $_34bxq92rjc7tm7cv = { backspaceDelete: backspaceDelete };

  var deleteRangeMergeBlocks = function (rootNode, selection) {
    var rng = selection.getRng();
    return $_2siq12djc7tm79e.liftN([
      $_2qjhc22tjc7tm7dx.getParentBlock(rootNode, $_bscr39yjc7tm6uo.fromDom(rng.startContainer)),
      $_2qjhc22tjc7tm7dx.getParentBlock(rootNode, $_bscr39yjc7tm6uo.fromDom(rng.endContainer))
    ], function (block1, block2) {
      if ($_b0e3uw1djc7tm6y8.eq(block1, block2) === false) {
        rng.deleteContents();
        $_38iit332jc7tm7gy.mergeBlocks(rootNode, true, block1, block2).each(function (pos) {
          selection.setRng(pos.toRange());
        });
        return true;
      } else {
        return false;
      }
    }).getOr(false);
  };
  var isRawNodeInTable = function (root, rawNode) {
    var node = $_bscr39yjc7tm6uo.fromDom(rawNode);
    var isRoot = $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, root);
    return $_agx7022ujc7tm7f1.ancestor(node, $_8zplag1pjc7tm70h.isTableCell, isRoot).isSome();
  };
  var isSelectionInTable = function (root, rng) {
    return isRawNodeInTable(root, rng.startContainer) || isRawNodeInTable(root, rng.endContainer);
  };
  var isEverythingSelected = function (root, rng) {
    var noPrevious = $_d2dq9h2pjc7tm7c9.prevPosition(root.dom(), CaretPosition.fromRangeStart(rng)).isNone();
    var noNext = $_d2dq9h2pjc7tm7c9.nextPosition(root.dom(), CaretPosition.fromRangeEnd(rng)).isNone();
    return !isSelectionInTable(root, rng) && noPrevious && noNext;
  };
  var emptyEditor = function (editor) {
    editor.setContent('');
    editor.selection.setCursorLocation();
    return true;
  };
  var deleteRange = function (editor) {
    var rootNode = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    var rng = editor.selection.getRng();
    return isEverythingSelected(rootNode, rng) ? emptyEditor(editor) : deleteRangeMergeBlocks(rootNode, editor.selection);
  };
  var backspaceDelete$1 = function (editor, forward) {
    return editor.selection.isCollapsed() ? false : deleteRange(editor);
  };
  var $_brt56434jc7tm7hi = { backspaceDelete: backspaceDelete$1 };

  var generate = function (cases) {
    if (!$_1g0kpc12jc7tm6vn.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_20yqgb4jc7tm6aj.each(cases, function (acase, count) {
      var keys = $_fttkez13jc7tm6vs.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_1g0kpc12jc7tm6vn.isArray(value)) {
        throw new Error('case arguments must be an array');
      }
      constructors.push(key);
      adt[key] = function () {
        var argLength = arguments.length;
        if (argLength !== value.length) {
          throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
        }
        var args = new Array(argLength);
        for (var i = 0; i < args.length; i++)
          args[i] = arguments[i];
        var match = function (branches) {
          var branchKeys = $_fttkez13jc7tm6vs.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_20yqgb4jc7tm6aj.forall(constructors, function (reqKey) {
            return $_20yqgb4jc7tm6aj.contains(branchKeys, reqKey);
          });
          if (!allReqd)
            throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
          return branches[key].apply(null, args);
        };
        return {
          fold: function () {
            if (arguments.length !== cases.length) {
              throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
            }
            var target = arguments[count];
            return target.apply(null, args);
          },
          match: match,
          log: function (label) {
            console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            });
          }
        };
      };
    });
    return adt;
  };
  var $_7voxo737jc7tm7ii = { generate: generate };

  var DeleteAction = $_7voxo737jc7tm7ii.generate([
    { remove: ['element'] },
    { moveToElement: ['element'] },
    { moveToPosition: ['position'] }
  ]);
  var isAtContentEditableBlockCaret = function (forward, from) {
    var elm = from.getNode(forward === false);
    var caretLocation = forward ? 'after' : 'before';
    return $_1qi2bn1qjc7tm70u.isElement(elm) && elm.getAttribute('data-mce-caret') === caretLocation;
  };
  var deleteEmptyBlockOrMoveToCef = function (rootNode, forward, from, to) {
    var toCefElm = to.getNode(forward === false);
    return $_2qjhc22tjc7tm7dx.getParentBlock($_bscr39yjc7tm6uo.fromDom(rootNode), $_bscr39yjc7tm6uo.fromDom(from.getNode())).map(function (blockElm) {
      return $_2pntmm2zjc7tm7gh.isEmpty(blockElm) ? DeleteAction.remove(blockElm.dom()) : DeleteAction.moveToElement(toCefElm);
    }).orThunk(function () {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToElement(toCefElm));
    });
  };
  var findCefPosition = function (rootNode, forward, from) {
    return $_d2dq9h2pjc7tm7c9.fromPosition(forward, rootNode, from).bind(function (to) {
      if (forward && $_1qi2bn1qjc7tm70u.isContentEditableFalse(to.getNode())) {
        return deleteEmptyBlockOrMoveToCef(rootNode, forward, from, to);
      } else if (forward === false && $_1qi2bn1qjc7tm70u.isContentEditableFalse(to.getNode(true))) {
        return deleteEmptyBlockOrMoveToCef(rootNode, forward, from, to);
      } else if (forward && $_4knc0r27jc7tm77s.isAfterContentEditableFalse(from)) {
        return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToPosition(to));
      } else if (forward === false && $_4knc0r27jc7tm77s.isBeforeContentEditableFalse(from)) {
        return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToPosition(to));
      } else {
        return $_e5uurj5jc7tm6bt.none();
      }
    });
  };
  var getContentEditableBlockAction = function (forward, elm) {
    if (forward && $_1qi2bn1qjc7tm70u.isContentEditableFalse(elm.nextSibling)) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToElement(elm.nextSibling));
    } else if (forward === false && $_1qi2bn1qjc7tm70u.isContentEditableFalse(elm.previousSibling)) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToElement(elm.previousSibling));
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var skipMoveToActionFromInlineCefToContent = function (root, from, deleteAction) {
    return deleteAction.fold(function (elm) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.remove(elm));
    }, function (elm) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToElement(elm));
    }, function (to) {
      if ($_4knc0r27jc7tm77s.isInSameBlock(from, to, root)) {
        return $_e5uurj5jc7tm6bt.none();
      } else {
        return $_e5uurj5jc7tm6bt.some(DeleteAction.moveToPosition(to));
      }
    });
  };
  var getContentEditableAction = function (rootNode, forward, from) {
    if (isAtContentEditableBlockCaret(forward, from)) {
      return getContentEditableBlockAction(forward, from.getNode(forward === false)).fold(function () {
        return findCefPosition(rootNode, forward, from);
      }, $_e5uurj5jc7tm6bt.some);
    } else {
      return findCefPosition(rootNode, forward, from).bind(function (deleteAction) {
        return skipMoveToActionFromInlineCefToContent(rootNode, from, deleteAction);
      });
    }
  };
  var read$1 = function (rootNode, forward, rng) {
    var normalizedRange = $_4knc0r27jc7tm77s.normalizeRange(forward ? 1 : -1, rootNode, rng);
    var from = CaretPosition.fromRangeStart(normalizedRange);
    if (forward === false && $_4knc0r27jc7tm77s.isAfterContentEditableFalse(from)) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.remove(from.getNode(true)));
    } else if (forward && $_4knc0r27jc7tm77s.isBeforeContentEditableFalse(from)) {
      return $_e5uurj5jc7tm6bt.some(DeleteAction.remove(from.getNode()));
    } else {
      return getContentEditableAction(rootNode, forward, from);
    }
  };
  var $_f639u436jc7tm7hy = { read: read$1 };

  var needsReposition = function (pos, elm) {
    var container = pos.container();
    var offset = pos.offset();
    return CaretPosition.isTextPosition(pos) === false && container === elm.parentNode && offset > CaretPosition.before(elm).offset();
  };
  var reposition = function (elm, pos) {
    return needsReposition(pos, elm) ? new CaretPosition(pos.container(), pos.offset() - 1) : pos;
  };
  var beforeOrStartOf = function (node) {
    return $_1qi2bn1qjc7tm70u.isText(node) ? new CaretPosition(node, 0) : CaretPosition.before(node);
  };
  var afterOrEndOf = function (node) {
    return $_1qi2bn1qjc7tm70u.isText(node) ? new CaretPosition(node, node.data.length) : CaretPosition.after(node);
  };
  var getPreviousSiblingCaretPosition = function (elm) {
    if ($_bnhdlx1zjc7tm75s.isCaretCandidate(elm.previousSibling)) {
      return $_e5uurj5jc7tm6bt.some(afterOrEndOf(elm.previousSibling));
    } else {
      return elm.previousSibling ? $_d2dq9h2pjc7tm7c9.lastPositionIn(elm.previousSibling) : $_e5uurj5jc7tm6bt.none();
    }
  };
  var getNextSiblingCaretPosition = function (elm) {
    if ($_bnhdlx1zjc7tm75s.isCaretCandidate(elm.nextSibling)) {
      return $_e5uurj5jc7tm6bt.some(beforeOrStartOf(elm.nextSibling));
    } else {
      return elm.nextSibling ? $_d2dq9h2pjc7tm7c9.firstPositionIn(elm.nextSibling) : $_e5uurj5jc7tm6bt.none();
    }
  };
  var findCaretPositionBackwardsFromElm = function (rootElement, elm) {
    var startPosition = CaretPosition.before(elm.previousSibling ? elm.previousSibling : elm.parentNode);
    return $_d2dq9h2pjc7tm7c9.prevPosition(rootElement, startPosition).fold(function () {
      return $_d2dq9h2pjc7tm7c9.nextPosition(rootElement, CaretPosition.after(elm));
    }, $_e5uurj5jc7tm6bt.some);
  };
  var findCaretPositionForwardsFromElm = function (rootElement, elm) {
    return $_d2dq9h2pjc7tm7c9.nextPosition(rootElement, CaretPosition.after(elm)).fold(function () {
      return $_d2dq9h2pjc7tm7c9.prevPosition(rootElement, CaretPosition.before(elm));
    }, $_e5uurj5jc7tm6bt.some);
  };
  var findCaretPositionBackwards = function (rootElement, elm) {
    return getPreviousSiblingCaretPosition(elm).orThunk(function () {
      return getNextSiblingCaretPosition(elm);
    }).orThunk(function () {
      return findCaretPositionBackwardsFromElm(rootElement, elm);
    });
  };
  var findCaretPositionForward = function (rootElement, elm) {
    return getNextSiblingCaretPosition(elm).orThunk(function () {
      return getPreviousSiblingCaretPosition(elm);
    }).orThunk(function () {
      return findCaretPositionForwardsFromElm(rootElement, elm);
    });
  };
  var findCaretPosition$1 = function (forward, rootElement, elm) {
    return forward ? findCaretPositionForward(rootElement, elm) : findCaretPositionBackwards(rootElement, elm);
  };
  var findCaretPosOutsideElmAfterDelete = function (forward, rootElement, elm) {
    return findCaretPosition$1(forward, rootElement, elm).map($_f41mrx6jc7tm6cd.curry(reposition, elm));
  };
  var setSelection = function (editor, forward, pos) {
    pos.fold(function () {
      editor.focus();
    }, function (pos) {
      editor.selection.setRng(pos.toRange(), forward);
    });
  };
  var eqRawNode = function (rawNode) {
    return function (elm) {
      return elm.dom() === rawNode;
    };
  };
  var isBlock$2 = function (editor, elm) {
    return elm && editor.schema.getBlockElements().hasOwnProperty($_4bxsjnzjc7tm6uw.name(elm));
  };
  var paddEmptyBlock = function (elm) {
    if ($_2pntmm2zjc7tm7gh.isEmpty(elm)) {
      var br = $_bscr39yjc7tm6uo.fromHtml('<br data-mce-bogus="1">');
      $_gi2jzz2gjc7tm7a2.empty(elm);
      $_bacixv2fjc7tm79x.append(elm, br);
      return $_e5uurj5jc7tm6bt.some(CaretPosition.before(br.dom()));
    } else {
      return $_e5uurj5jc7tm6bt.none();
    }
  };
  var deleteNormalized = function (elm, afterDeletePosOpt) {
    return $_2siq12djc7tm79e.liftN([
      $_15fekq17jc7tm6wo.prevSibling(elm),
      $_15fekq17jc7tm6wo.nextSibling(elm),
      afterDeletePosOpt
    ], function (prev, next, afterDeletePos) {
      var offset, prevNode = prev.dom(), nextNode = next.dom();
      if ($_1qi2bn1qjc7tm70u.isText(prevNode) && $_1qi2bn1qjc7tm70u.isText(nextNode)) {
        offset = prevNode.data.length;
        prevNode.appendData(nextNode.data);
        $_gi2jzz2gjc7tm7a2.remove(next);
        $_gi2jzz2gjc7tm7a2.remove(elm);
        if (afterDeletePos.container() === nextNode) {
          return new CaretPosition(prevNode, offset);
        } else {
          return afterDeletePos;
        }
      } else {
        $_gi2jzz2gjc7tm7a2.remove(elm);
        return afterDeletePos;
      }
    }).orThunk(function () {
      $_gi2jzz2gjc7tm7a2.remove(elm);
      return afterDeletePosOpt;
    });
  };
  var deleteElement$1 = function (editor, forward, elm) {
    var afterDeletePos = findCaretPosOutsideElmAfterDelete(forward, editor.getBody(), elm.dom());
    var parentBlock = $_agx7022ujc7tm7f1.ancestor(elm, $_f41mrx6jc7tm6cd.curry(isBlock$2, editor), eqRawNode(editor.getBody()));
    var normalizedAfterDeletePos = deleteNormalized(elm, afterDeletePos);
    if (editor.dom.isEmpty(editor.getBody())) {
      editor.setContent('');
      editor.selection.setCursorLocation();
    } else {
      parentBlock.bind(paddEmptyBlock).fold(function () {
        setSelection(editor, forward, normalizedAfterDeletePos);
      }, function (paddPos) {
        setSelection(editor, forward, $_e5uurj5jc7tm6bt.some(paddPos));
      });
    }
  };
  var $_1556y238jc7tm7ir = { deleteElement: deleteElement$1 };

  var deleteElement = function (editor, forward) {
    return function (element) {
      editor._selectionOverrides.hideFakeCaret();
      $_1556y238jc7tm7ir.deleteElement(editor, forward, $_bscr39yjc7tm6uo.fromDom(element));
      return true;
    };
  };
  var moveToElement = function (editor, forward) {
    return function (element) {
      var pos = forward ? CaretPosition.before(element) : CaretPosition.after(element);
      editor.selection.setRng(pos.toRange());
      return true;
    };
  };
  var moveToPosition = function (editor) {
    return function (pos) {
      editor.selection.setRng(pos.toRange());
      return true;
    };
  };
  var backspaceDeleteCaret = function (editor, forward) {
    var result = $_f639u436jc7tm7hy.read(editor.getBody(), forward, editor.selection.getRng()).map(function (deleteAction) {
      return deleteAction.fold(deleteElement(editor, forward), moveToElement(editor, forward), moveToPosition(editor));
    });
    return result.getOr(false);
  };
  var deleteOffscreenSelection = function (rootElement) {
    $_20yqgb4jc7tm6aj.each($_8esf4w2kjc7tm7b6.descendants(rootElement, '.mce-offscreen-selection'), $_gi2jzz2gjc7tm7a2.remove);
  };
  var backspaceDeleteRange = function (editor, forward) {
    var selectedElement = editor.selection.getNode();
    if ($_1qi2bn1qjc7tm70u.isContentEditableFalse(selectedElement)) {
      deleteOffscreenSelection($_bscr39yjc7tm6uo.fromDom(editor.getBody()));
      $_1556y238jc7tm7ir.deleteElement(editor, forward, $_bscr39yjc7tm6uo.fromDom(editor.selection.getNode()));
      $_2qjhc22tjc7tm7dx.paddEmptyBody(editor);
      return true;
    } else {
      return false;
    }
  };
  var getContentEditableRoot = function (root, node) {
    while (node && node !== root) {
      if ($_1qi2bn1qjc7tm70u.isContentEditableTrue(node) || $_1qi2bn1qjc7tm70u.isContentEditableFalse(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var paddEmptyElement = function (editor) {
    var br, ceRoot = getContentEditableRoot(editor.getBody(), editor.selection.getNode());
    if ($_1qi2bn1qjc7tm70u.isContentEditableTrue(ceRoot) && editor.dom.isBlock(ceRoot) && editor.dom.isEmpty(ceRoot)) {
      br = editor.dom.create('br', { 'data-mce-bogus': '1' });
      editor.dom.setHTML(ceRoot, '');
      ceRoot.appendChild(br);
      editor.selection.setRng(CaretPosition.before(br).toRange());
    }
    return true;
  };
  var backspaceDelete$2 = function (editor, forward) {
    if (editor.selection.isCollapsed()) {
      return backspaceDeleteCaret(editor, forward);
    } else {
      return backspaceDeleteRange(editor, forward);
    }
  };
  var $_b90wzv35jc7tm7hp = {
    backspaceDelete: backspaceDelete$2,
    paddEmptyElement: paddEmptyElement
  };

  var isText$6 = $_1qi2bn1qjc7tm70u.isText;
  var startsWithCaretContainer$1 = function (node) {
    return isText$6(node) && node.data[0] === $_55zd6d21jc7tm765.ZWSP;
  };
  var endsWithCaretContainer$1 = function (node) {
    return isText$6(node) && node.data[node.data.length - 1] === $_55zd6d21jc7tm765.ZWSP;
  };
  var createZwsp = function (node) {
    return node.ownerDocument.createTextNode($_55zd6d21jc7tm765.ZWSP);
  };
  var insertBefore$1 = function (node) {
    if (isText$6(node.previousSibling)) {
      if (endsWithCaretContainer$1(node.previousSibling)) {
        return node.previousSibling;
      } else {
        node.previousSibling.appendData($_55zd6d21jc7tm765.ZWSP);
        return node.previousSibling;
      }
    } else if (isText$6(node)) {
      if (startsWithCaretContainer$1(node)) {
        return node;
      } else {
        node.insertData(0, $_55zd6d21jc7tm765.ZWSP);
        return node;
      }
    } else {
      var newNode = createZwsp(node);
      node.parentNode.insertBefore(newNode, node);
      return newNode;
    }
  };
  var insertAfter$1 = function (node) {
    if (isText$6(node.nextSibling)) {
      if (startsWithCaretContainer$1(node.nextSibling)) {
        return node.nextSibling;
      } else {
        node.nextSibling.insertData(0, $_55zd6d21jc7tm765.ZWSP);
        return node.nextSibling;
      }
    } else if (isText$6(node)) {
      if (endsWithCaretContainer$1(node)) {
        return node;
      } else {
        node.appendData($_55zd6d21jc7tm765.ZWSP);
        return node;
      }
    } else {
      var newNode = createZwsp(node);
      if (node.nextSibling) {
        node.parentNode.insertBefore(newNode, node.nextSibling);
      } else {
        node.parentNode.appendChild(newNode);
      }
      return newNode;
    }
  };
  var insertInline$1 = function (before, node) {
    return before ? insertBefore$1(node) : insertAfter$1(node);
  };
  var $_3n6ugn3bjc7tm7jn = {
    insertInline: insertInline$1,
    insertInlineBefore: $_f41mrx6jc7tm6cd.curry(insertInline$1, true),
    insertInlineAfter: $_f41mrx6jc7tm6cd.curry(insertInline$1, false)
  };

  var isElement$6 = $_1qi2bn1qjc7tm70u.isElement;
  var isText$7 = $_1qi2bn1qjc7tm70u.isText;
  var removeNode = function (node) {
    var parentNode = node.parentNode;
    if (parentNode) {
      parentNode.removeChild(node);
    }
  };
  var getNodeValue = function (node) {
    try {
      return node.nodeValue;
    } catch (ex) {
      return '';
    }
  };
  var setNodeValue = function (node, text) {
    if (text.length === 0) {
      removeNode(node);
    } else {
      node.nodeValue = text;
    }
  };
  var trimCount = function (text) {
    var trimmedText = $_55zd6d21jc7tm765.trim(text);
    return {
      count: text.length - trimmedText.length,
      text: trimmedText
    };
  };
  var removeUnchanged = function (caretContainer, pos) {
    remove$3(caretContainer);
    return pos;
  };
  var removeTextAndReposition = function (caretContainer, pos) {
    var before = trimCount(caretContainer.data.substr(0, pos.offset()));
    var after = trimCount(caretContainer.data.substr(pos.offset()));
    var text = before.text + after.text;
    if (text.length > 0) {
      setNodeValue(caretContainer, text);
      return new CaretPosition(caretContainer, pos.offset() - before.count);
    } else {
      return pos;
    }
  };
  var removeElementAndReposition = function (caretContainer, pos) {
    var parentNode = pos.container();
    var newPosition = $_20yqgb4jc7tm6aj.indexOf(parentNode.childNodes, caretContainer).map(function (index) {
      return index < pos.offset() ? new CaretPosition(parentNode, pos.offset() - 1) : pos;
    }).getOr(pos);
    remove$3(caretContainer);
    return newPosition;
  };
  var removeTextCaretContainer = function (caretContainer, pos) {
    return pos.container() === caretContainer ? removeTextAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos);
  };
  var removeElementCaretContainer = function (caretContainer, pos) {
    return pos.container() === caretContainer.parentNode ? removeElementAndReposition(caretContainer, pos) : removeUnchanged(caretContainer, pos);
  };
  var removeAndReposition = function (container, pos) {
    return CaretPosition.isTextPosition(pos) ? removeTextCaretContainer(container, pos) : removeElementCaretContainer(container, pos);
  };
  var remove$3 = function (caretContainerNode) {
    if (isElement$6(caretContainerNode) && $_40segn20jc7tm75y.isCaretContainer(caretContainerNode)) {
      if ($_40segn20jc7tm75y.hasContent(caretContainerNode)) {
        caretContainerNode.removeAttribute('data-mce-caret');
      } else {
        removeNode(caretContainerNode);
      }
    }
    if (isText$7(caretContainerNode)) {
      var text = $_55zd6d21jc7tm765.trim(getNodeValue(caretContainerNode));
      setNodeValue(caretContainerNode, text);
    }
  };
  var $_5xp8n23cjc7tm7js = {
    removeAndReposition: removeAndReposition,
    remove: remove$3
  };

  var insertInlinePos = function (pos, before) {
    if ($_1qi2bn1qjc7tm70u.isText(pos.container())) {
      return $_3n6ugn3bjc7tm7jn.insertInline(before, pos.container());
    } else {
      return $_3n6ugn3bjc7tm7jn.insertInline(before, pos.getNode());
    }
  };
  var isPosCaretContainer = function (pos, caret) {
    var caretNode = caret.get();
    return caretNode && pos.container() === caretNode && $_40segn20jc7tm75y.isCaretContainerInline(caretNode);
  };
  var renderCaret = function (caret, location) {
    return location.fold(function (element) {
      $_5xp8n23cjc7tm7js.remove(caret.get());
      var text = $_3n6ugn3bjc7tm7jn.insertInlineBefore(element);
      caret.set(text);
      return $_e5uurj5jc7tm6bt.some(new CaretPosition(text, text.length - 1));
    }, function (element) {
      return $_d2dq9h2pjc7tm7c9.firstPositionIn(element).map(function (pos) {
        if (!isPosCaretContainer(pos, caret)) {
          $_5xp8n23cjc7tm7js.remove(caret.get());
          var text = insertInlinePos(pos, true);
          caret.set(text);
          return new CaretPosition(text, 1);
        } else {
          return new CaretPosition(caret.get(), 1);
        }
      });
    }, function (element) {
      return $_d2dq9h2pjc7tm7c9.lastPositionIn(element).map(function (pos) {
        if (!isPosCaretContainer(pos, caret)) {
          $_5xp8n23cjc7tm7js.remove(caret.get());
          var text = insertInlinePos(pos, false);
          caret.set(text);
          return new CaretPosition(text, text.length - 1);
        } else {
          return new CaretPosition(caret.get(), caret.get().length - 1);
        }
      });
    }, function (element) {
      $_5xp8n23cjc7tm7js.remove(caret.get());
      var text = $_3n6ugn3bjc7tm7jn.insertInlineAfter(element);
      caret.set(text);
      return $_e5uurj5jc7tm6bt.some(new CaretPosition(text, 1));
    });
  };
  var $_8avfvd3ajc7tm7jg = { renderCaret: renderCaret };

  var isInlineBlock = function (node) {
    return node && /^(IMG)$/.test(node.nodeName);
  };
  var moveStart = function (dom, selection, rng) {
    var container = rng.startContainer, offset = rng.startOffset, walker, node, nodes;
    if (rng.startContainer === rng.endContainer) {
      if (isInlineBlock(rng.startContainer.childNodes[rng.startOffset])) {
        return;
      }
    }
    if (container.nodeType === 3 && offset >= container.nodeValue.length) {
      offset = dom.nodeIndex(container);
      container = container.parentNode;
    }
    if (container.nodeType === 1) {
      nodes = container.childNodes;
      if (offset < nodes.length) {
        container = nodes[offset];
        walker = new TreeWalker(container, dom.getParent(container, dom.isBlock));
      } else {
        container = nodes[nodes.length - 1];
        walker = new TreeWalker(container, dom.getParent(container, dom.isBlock));
        walker.next(true);
      }
      for (node = walker.current(); node; node = walker.next()) {
        if (node.nodeType === 3 && !isWhiteSpaceNode$1(node)) {
          rng.setStart(node, 0);
          selection.setRng(rng);
          return;
        }
      }
    }
  };
  var getNonWhiteSpaceSibling = function (node, next, inc) {
    if (node) {
      next = next ? 'nextSibling' : 'previousSibling';
      for (node = inc ? node : node[next]; node; node = node[next]) {
        if (node.nodeType === 1 || !isWhiteSpaceNode$1(node)) {
          return node;
        }
      }
    }
  };
  var isTextBlock$1 = function (editor, name) {
    if (name.nodeType) {
      name = name.nodeName;
    }
    return !!editor.schema.getTextBlockElements()[name.toLowerCase()];
  };
  var isValid = function (ed, parent, child) {
    return ed.schema.isValidChild(parent, child);
  };
  var isWhiteSpaceNode$1 = function (node) {
    return node && node.nodeType === 3 && /^([\t \r\n]+|)$/.test(node.nodeValue);
  };
  var replaceVars = function (value, vars) {
    if (typeof value !== 'string') {
      value = value(vars);
    } else if (vars) {
      value = value.replace(/%(\w+)/g, function (str, name) {
        return vars[name] || str;
      });
    }
    return value;
  };
  var isEq$1 = function (str1, str2) {
    str1 = str1 || '';
    str2 = str2 || '';
    str1 = '' + (str1.nodeName || str1);
    str2 = '' + (str2.nodeName || str2);
    return str1.toLowerCase() === str2.toLowerCase();
  };
  var normalizeStyleValue = function (dom, value, name) {
    if (name === 'color' || name === 'backgroundColor') {
      value = dom.toHex(value);
    }
    if (name === 'fontWeight' && value === 700) {
      value = 'bold';
    }
    if (name === 'fontFamily') {
      value = value.replace(/[\'\"]/g, '').replace(/,\s+/g, ',');
    }
    return '' + value;
  };
  var getStyle = function (dom, node, name) {
    return normalizeStyleValue(dom, dom.getStyle(node, name), name);
  };
  var getTextDecoration = function (dom, node) {
    var decoration;
    dom.getParent(node, function (n) {
      decoration = dom.getStyle(n, 'text-decoration');
      return decoration && decoration !== 'none';
    });
    return decoration;
  };
  var getParents$2 = function (dom, node, selector) {
    return dom.getParents(node, selector, dom.getRoot());
  };
  var $_1y2ou73gjc7tm7lj = {
    isInlineBlock: isInlineBlock,
    moveStart: moveStart,
    getNonWhiteSpaceSibling: getNonWhiteSpaceSibling,
    isTextBlock: isTextBlock$1,
    isValid: isValid,
    isWhiteSpaceNode: isWhiteSpaceNode$1,
    replaceVars: replaceVars,
    isEq: isEq$1,
    normalizeStyleValue: normalizeStyleValue,
    getStyle: getStyle,
    getTextDecoration: getTextDecoration,
    getParents: getParents$2
  };

  var isBookmarkNode$2 = $_am1og29jc7tm78b.isBookmarkNode;
  var getParents$1 = $_1y2ou73gjc7tm7lj.getParents;
  var isWhiteSpaceNode = $_1y2ou73gjc7tm7lj.isWhiteSpaceNode;
  var isTextBlock = $_1y2ou73gjc7tm7lj.isTextBlock;
  var findLeaf = function (node, offset) {
    if (typeof offset === 'undefined') {
      offset = node.nodeType === 3 ? node.length : node.childNodes.length;
    }
    while (node && node.hasChildNodes()) {
      node = node.childNodes[offset];
      if (node) {
        offset = node.nodeType === 3 ? node.length : node.childNodes.length;
      }
    }
    return {
      node: node,
      offset: offset
    };
  };
  var excludeTrailingWhitespace = function (endContainer, endOffset) {
    var leaf = findLeaf(endContainer, endOffset);
    if (leaf.node) {
      while (leaf.node && leaf.offset === 0 && leaf.node.previousSibling) {
        leaf = findLeaf(leaf.node.previousSibling);
      }
      if (leaf.node && leaf.offset > 0 && leaf.node.nodeType === 3 && leaf.node.nodeValue.charAt(leaf.offset - 1) === ' ') {
        if (leaf.offset > 1) {
          endContainer = leaf.node;
          endContainer.splitText(leaf.offset - 1);
        }
      }
    }
    return endContainer;
  };
  var isBogusBr = function (node) {
    return node.nodeName === 'BR' && node.getAttribute('data-mce-bogus') && !node.nextSibling;
  };
  var findParentContentEditable = function (dom, node) {
    var parent = node;
    while (parent) {
      if (parent.nodeType === 1 && dom.getContentEditable(parent)) {
        return dom.getContentEditable(parent) === 'false' ? parent : node;
      }
      parent = parent.parentNode;
    }
    return node;
  };
  var findSpace = function (start, remove, node, offset) {
    var pos, pos2, str = node.nodeValue;
    if (typeof offset === 'undefined') {
      offset = start ? str.length : 0;
    }
    if (start) {
      pos = str.lastIndexOf(' ', offset);
      pos2 = str.lastIndexOf('\xA0', offset);
      pos = pos > pos2 ? pos : pos2;
      if (pos !== -1 && !remove) {
        pos++;
      }
    } else {
      pos = str.indexOf(' ', offset);
      pos2 = str.indexOf('\xA0', offset);
      pos = pos !== -1 && (pos2 === -1 || pos < pos2) ? pos : pos2;
    }
    return pos;
  };
  var findWordEndPoint = function (dom, body, container, offset, start, remove) {
    var walker, node, pos, lastTextNode;
    if (container.nodeType === 3) {
      pos = findSpace(start, remove, container, offset);
      if (pos !== -1) {
        return {
          container: container,
          offset: pos
        };
      }
      lastTextNode = container;
    }
    walker = new TreeWalker(container, dom.getParent(container, dom.isBlock) || body);
    while (node = walker[start ? 'prev' : 'next']()) {
      if (node.nodeType === 3) {
        lastTextNode = node;
        pos = findSpace(start, remove, node);
        if (pos !== -1) {
          return {
            container: node,
            offset: pos
          };
        }
      } else if (dom.isBlock(node)) {
        break;
      }
    }
    if (lastTextNode) {
      if (start) {
        offset = 0;
      } else {
        offset = lastTextNode.length;
      }
      return {
        container: lastTextNode,
        offset: offset
      };
    }
  };
  var findSelectorEndPoint = function (dom, format, rng, container, siblingName) {
    var parents, i, y, curFormat;
    if (container.nodeType === 3 && container.nodeValue.length === 0 && container[siblingName]) {
      container = container[siblingName];
    }
    parents = getParents$1(dom, container);
    for (i = 0; i < parents.length; i++) {
      for (y = 0; y < format.length; y++) {
        curFormat = format[y];
        if ('collapsed' in curFormat && curFormat.collapsed !== rng.collapsed) {
          continue;
        }
        if (dom.is(parents[i], curFormat.selector)) {
          return parents[i];
        }
      }
    }
    return container;
  };
  var findBlockEndPoint = function (editor, format, container, siblingName) {
    var node, dom = editor.dom, root = dom.getRoot();
    if (!format[0].wrapper) {
      node = dom.getParent(container, format[0].block, root);
    }
    if (!node) {
      var scopeRoot = dom.getParent(container, 'LI,TD,TH');
      node = dom.getParent(container.nodeType === 3 ? container.parentNode : container, function (node) {
        return node !== root && isTextBlock(editor, node);
      }, scopeRoot);
    }
    if (node && format[0].wrapper) {
      node = getParents$1(dom, node, 'ul,ol').reverse()[0] || node;
    }
    if (!node) {
      node = container;
      while (node[siblingName] && !dom.isBlock(node[siblingName])) {
        node = node[siblingName];
        if ($_1y2ou73gjc7tm7lj.isEq(node, 'br')) {
          break;
        }
      }
    }
    return node || container;
  };
  var findParentContainer = function (dom, format, startContainer, startOffset, endContainer, endOffset, start) {
    var container, parent, sibling, siblingName, root;
    container = parent = start ? startContainer : endContainer;
    siblingName = start ? 'previousSibling' : 'nextSibling';
    root = dom.getRoot();
    if (container.nodeType === 3 && !isWhiteSpaceNode(container)) {
      if (start ? startOffset > 0 : endOffset < container.nodeValue.length) {
        return container;
      }
    }
    while (true) {
      if (!format[0].block_expand && dom.isBlock(parent)) {
        return parent;
      }
      for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) {
        if (!isBookmarkNode$2(sibling) && !isWhiteSpaceNode(sibling) && !isBogusBr(sibling)) {
          return parent;
        }
      }
      if (parent === root || parent.parentNode === root) {
        container = parent;
        break;
      }
      parent = parent.parentNode;
    }
    return container;
  };
  var expandRng = function (editor, rng, format, remove) {
    var endPoint, startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset, dom = editor.dom;
    if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
      startContainer = $_4yp5rq23jc7tm76g.getNode(startContainer, startOffset);
      if (startContainer.nodeType === 3) {
        startOffset = 0;
      }
    }
    if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
      endContainer = $_4yp5rq23jc7tm76g.getNode(endContainer, rng.collapsed ? endOffset : endOffset - 1);
      if (endContainer.nodeType === 3) {
        endOffset = endContainer.nodeValue.length;
      }
    }
    startContainer = findParentContentEditable(dom, startContainer);
    endContainer = findParentContentEditable(dom, endContainer);
    if (isBookmarkNode$2(startContainer.parentNode) || isBookmarkNode$2(startContainer)) {
      startContainer = isBookmarkNode$2(startContainer) ? startContainer : startContainer.parentNode;
      startContainer = startContainer.nextSibling || startContainer;
      if (startContainer.nodeType === 3) {
        startOffset = 0;
      }
    }
    if (isBookmarkNode$2(endContainer.parentNode) || isBookmarkNode$2(endContainer)) {
      endContainer = isBookmarkNode$2(endContainer) ? endContainer : endContainer.parentNode;
      endContainer = endContainer.previousSibling || endContainer;
      if (endContainer.nodeType === 3) {
        endOffset = endContainer.length;
      }
    }
    if (format[0].inline) {
      if (rng.collapsed) {
        endPoint = findWordEndPoint(dom, editor.getBody(), startContainer, startOffset, true, remove);
        if (endPoint) {
          startContainer = endPoint.container;
          startOffset = endPoint.offset;
        }
        endPoint = findWordEndPoint(dom, editor.getBody(), endContainer, endOffset, false, remove);
        if (endPoint) {
          endContainer = endPoint.container;
          endOffset = endPoint.offset;
        }
      }
      endContainer = remove ? endContainer : excludeTrailingWhitespace(endContainer, endOffset);
    }
    if (format[0].inline || format[0].block_expand) {
      if (!format[0].inline || (startContainer.nodeType !== 3 || startOffset === 0)) {
        startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true);
      }
      if (!format[0].inline || (endContainer.nodeType !== 3 || endOffset === endContainer.nodeValue.length)) {
        endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false);
      }
    }
    if (format[0].selector && format[0].expand !== false && !format[0].inline) {
      startContainer = findSelectorEndPoint(dom, format, rng, startContainer, 'previousSibling');
      endContainer = findSelectorEndPoint(dom, format, rng, endContainer, 'nextSibling');
    }
    if (format[0].block || format[0].selector) {
      startContainer = findBlockEndPoint(editor, format, startContainer, 'previousSibling');
      endContainer = findBlockEndPoint(editor, format, endContainer, 'nextSibling');
      if (format[0].block) {
        if (!dom.isBlock(startContainer)) {
          startContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, true);
        }
        if (!dom.isBlock(endContainer)) {
          endContainer = findParentContainer(dom, format, startContainer, startOffset, endContainer, endOffset, false);
        }
      }
    }
    if (startContainer.nodeType === 1) {
      startOffset = dom.nodeIndex(startContainer);
      startContainer = startContainer.parentNode;
    }
    if (endContainer.nodeType === 1) {
      endOffset = dom.nodeIndex(endContainer) + 1;
      endContainer = endContainer.parentNode;
    }
    return {
      startContainer: startContainer,
      startOffset: startOffset,
      endContainer: endContainer,
      endOffset: endOffset
    };
  };
  var $_f7qs4i3fjc7tm7l4 = { expandRng: expandRng };

  var isEq$2 = $_1y2ou73gjc7tm7lj.isEq;
  var matchesUnInheritedFormatSelector = function (ed, node, name) {
    var formatList = ed.formatter.get(name);
    if (formatList) {
      for (var i = 0; i < formatList.length; i++) {
        if (formatList[i].inherit === false && ed.dom.is(node, formatList[i].selector)) {
          return true;
        }
      }
    }
    return false;
  };
  var matchParents = function (editor, node, name, vars) {
    var root = editor.dom.getRoot();
    if (node === root) {
      return false;
    }
    node = editor.dom.getParent(node, function (node) {
      if (matchesUnInheritedFormatSelector(editor, node, name)) {
        return true;
      }
      return node.parentNode === root || !!matchNode(editor, node, name, vars, true);
    });
    return matchNode(editor, node, name, vars);
  };
  var matchName = function (dom, node, format) {
    if (isEq$2(node, format.inline)) {
      return true;
    }
    if (isEq$2(node, format.block)) {
      return true;
    }
    if (format.selector) {
      return node.nodeType === 1 && dom.is(node, format.selector);
    }
  };
  var matchItems = function (dom, node, format, itemName, similar, vars) {
    var key, value, items = format[itemName], i;
    if (format.onmatch) {
      return format.onmatch(node, format, itemName);
    }
    if (items) {
      if (typeof items.length === 'undefined') {
        for (key in items) {
          if (items.hasOwnProperty(key)) {
            if (itemName === 'attributes') {
              value = dom.getAttrib(node, key);
            } else {
              value = $_1y2ou73gjc7tm7lj.getStyle(dom, node, key);
            }
            if (similar && !value && !format.exact) {
              return;
            }
            if ((!similar || format.exact) && !isEq$2(value, $_1y2ou73gjc7tm7lj.normalizeStyleValue(dom, $_1y2ou73gjc7tm7lj.replaceVars(items[key], vars), key))) {
              return;
            }
          }
        }
      } else {
        for (i = 0; i < items.length; i++) {
          if (itemName === 'attributes' ? dom.getAttrib(node, items[i]) : $_1y2ou73gjc7tm7lj.getStyle(dom, node, items[i])) {
            return format;
          }
        }
      }
    }
    return format;
  };
  var matchNode = function (ed, node, name, vars, similar) {
    var formatList = ed.formatter.get(name), format, i, x, classes, dom = ed.dom;
    if (formatList && node) {
      for (i = 0; i < formatList.length; i++) {
        format = formatList[i];
        if (matchName(ed.dom, node, format) && matchItems(dom, node, format, 'attributes', similar, vars) && matchItems(dom, node, format, 'styles', similar, vars)) {
          if (classes = format.classes) {
            for (x = 0; x < classes.length; x++) {
              if (!ed.dom.hasClass(node, classes[x])) {
                return;
              }
            }
          }
          return format;
        }
      }
    }
  };
  var match = function (editor, name, vars, node) {
    var startNode;
    if (node) {
      return matchParents(editor, node, name, vars);
    }
    node = editor.selection.getNode();
    if (matchParents(editor, node, name, vars)) {
      return true;
    }
    startNode = editor.selection.getStart();
    if (startNode !== node) {
      if (matchParents(editor, startNode, name, vars)) {
        return true;
      }
    }
    return false;
  };
  var matchAll = function (editor, names, vars) {
    var startElement, matchedFormatNames = [], checkedMap = {};
    startElement = editor.selection.getStart();
    editor.dom.getParent(startElement, function (node) {
      var i, name;
      for (i = 0; i < names.length; i++) {
        name = names[i];
        if (!checkedMap[name] && matchNode(editor, node, name, vars)) {
          checkedMap[name] = true;
          matchedFormatNames.push(name);
        }
      }
    }, editor.dom.getRoot());
    return matchedFormatNames;
  };
  var canApply = function (editor, name) {
    var formatList = editor.formatter.get(name), startNode, parents, i, x, selector, dom = editor.dom;
    if (formatList) {
      startNode = editor.selection.getStart();
      parents = $_1y2ou73gjc7tm7lj.getParents(dom, startNode);
      for (x = formatList.length - 1; x >= 0; x--) {
        selector = formatList[x].selector;
        if (!selector || formatList[x].defaultBlock) {
          return true;
        }
        for (i = parents.length - 1; i >= 0; i--) {
          if (dom.is(parents[i], selector)) {
            return true;
          }
        }
      }
    }
    return false;
  };
  var $_wz3my3hjc7tm7lo = {
    matchNode: matchNode,
    matchName: matchName,
    match: match,
    matchAll: matchAll,
    canApply: canApply,
    matchesUnInheritedFormatSelector: matchesUnInheritedFormatSelector
  };

  var splitText = function (node, offset) {
    return node.splitText(offset);
  };
  var split$1 = function (rng) {
    var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset;
    if (startContainer === endContainer && $_1qi2bn1qjc7tm70u.isText(startContainer)) {
      if (startOffset > 0 && startOffset < startContainer.nodeValue.length) {
        endContainer = splitText(startContainer, startOffset);
        startContainer = endContainer.previousSibling;
        if (endOffset > startOffset) {
          endOffset = endOffset - startOffset;
          startContainer = endContainer = splitText(endContainer, endOffset).previousSibling;
          endOffset = endContainer.nodeValue.length;
          startOffset = 0;
        } else {
          endOffset = 0;
        }
      }
    } else {
      if ($_1qi2bn1qjc7tm70u.isText(startContainer) && startOffset > 0 && startOffset < startContainer.nodeValue.length) {
        startContainer = splitText(startContainer, startOffset);
        startOffset = 0;
      }
      if ($_1qi2bn1qjc7tm70u.isText(endContainer) && endOffset > 0 && endOffset < endContainer.nodeValue.length) {
        endContainer = splitText(endContainer, endOffset).previousSibling;
        endOffset = endContainer.nodeValue.length;
      }
    }
    return {
      startContainer: startContainer,
      startOffset: startOffset,
      endContainer: endContainer,
      endOffset: endOffset
    };
  };
  var $_bnjeic3ijc7tm7lt = { split: split$1 };

  var ZWSP$1 = $_55zd6d21jc7tm765.ZWSP;
  var CARET_ID = '_mce_caret';
  var importNode = function (ownerDocument, node) {
    return ownerDocument.importNode(node, true);
  };
  var isCaretNode = function (node) {
    return node.nodeType === 1 && node.id === CARET_ID;
  };
  var getEmptyCaretContainers = function (node) {
    var nodes = [];
    while (node) {
      if (node.nodeType === 3 && node.nodeValue !== ZWSP$1 || node.childNodes.length > 1) {
        return [];
      }
      if (node.nodeType === 1) {
        nodes.push(node);
      }
      node = node.firstChild;
    }
    return nodes;
  };
  var isCaretContainerEmpty = function (node) {
    return getEmptyCaretContainers(node).length > 0;
  };
  var findFirstTextNode = function (node) {
    var walker;
    if (node) {
      walker = new TreeWalker(node, node);
      for (node = walker.current(); node; node = walker.next()) {
        if (node.nodeType === 3) {
          return node;
        }
      }
    }
    return null;
  };
  var createCaretContainer = function (fill) {
    var caretContainer = $_bscr39yjc7tm6uo.fromTag('span');
    $_ftie1r14jc7tm6vz.setAll(caretContainer, {
      id: CARET_ID,
      'data-mce-bogus': '1',
      'data-mce-type': 'format-caret'
    });
    if (fill) {
      $_bacixv2fjc7tm79x.append(caretContainer, $_bscr39yjc7tm6uo.fromText(ZWSP$1));
    }
    return caretContainer;
  };
  var getParentCaretContainer = function (body, node) {
    while (node && node !== body) {
      if (node.id === CARET_ID) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var trimZwspFromCaretContainer = function (caretContainerNode) {
    var textNode = findFirstTextNode(caretContainerNode);
    if (textNode && textNode.nodeValue.charAt(0) === ZWSP$1) {
      textNode.deleteData(0, 1);
    }
    return textNode;
  };
  var removeCaretContainerNode = function (dom, selection, node, moveCaret) {
    var rng, block, textNode;
    rng = selection.getRng(true);
    block = dom.getParent(node, dom.isBlock);
    if (isCaretContainerEmpty(node)) {
      if (moveCaret !== false) {
        rng.setStartBefore(node);
        rng.setEndBefore(node);
      }
      dom.remove(node);
    } else {
      textNode = trimZwspFromCaretContainer(node);
      if (rng.startContainer === textNode && rng.startOffset > 0) {
        rng.setStart(textNode, rng.startOffset - 1);
      }
      if (rng.endContainer === textNode && rng.endOffset > 0) {
        rng.setEnd(textNode, rng.endOffset - 1);
      }
      dom.remove(node, true);
    }
    if (block && dom.isEmpty(block)) {
      $_82ax5c2ejc7tm79k.fillWithPaddingBr($_bscr39yjc7tm6uo.fromDom(block));
    }
    selection.setRng(rng);
  };
  var removeCaretContainer = function (body, dom, selection, node, moveCaret) {
    if (!node) {
      node = getParentCaretContainer(body, selection.getStart());
      if (!node) {
        while (node = dom.get(CARET_ID)) {
          removeCaretContainerNode(dom, selection, node, false);
        }
      }
    } else {
      removeCaretContainerNode(dom, selection, node, moveCaret);
    }
  };
  var insertCaretContainerNode = function (editor, caretContainer, formatNode) {
    var dom = editor.dom, block = dom.getParent(formatNode, $_fy81ys25jc7tm77a.curry($_1y2ou73gjc7tm7lj.isTextBlock, editor));
    if (block && dom.isEmpty(block)) {
      formatNode.parentNode.replaceChild(caretContainer, formatNode);
    } else {
      $_82ax5c2ejc7tm79k.removeTrailingBr($_bscr39yjc7tm6uo.fromDom(formatNode));
      if (dom.isEmpty(formatNode)) {
        formatNode.parentNode.replaceChild(caretContainer, formatNode);
      } else {
        dom.insertAfter(caretContainer, formatNode);
      }
    }
  };
  var appendNode = function (parentNode, node) {
    parentNode.appendChild(node);
    return node;
  };
  var insertFormatNodesIntoCaretContainer = function (formatNodes, caretContainer) {
    var innerMostFormatNode = $_20yqgb4jc7tm6aj.foldr(formatNodes, function (parentNode, formatNode) {
      return appendNode(parentNode, formatNode.cloneNode(false));
    }, caretContainer);
    return appendNode(innerMostFormatNode, innerMostFormatNode.ownerDocument.createTextNode(ZWSP$1));
  };
  var applyCaretFormat = function (editor, name, vars) {
    var rng, caretContainer, textNode, offset, bookmark, container, text;
    var selection = editor.selection;
    rng = selection.getRng(true);
    offset = rng.startOffset;
    container = rng.startContainer;
    text = container.nodeValue;
    caretContainer = getParentCaretContainer(editor.getBody(), selection.getStart());
    if (caretContainer) {
      textNode = findFirstTextNode(caretContainer);
    }
    var wordcharRegex = /[^\s\u00a0\u00ad\u200b\ufeff]/;
    if (text && offset > 0 && offset < text.length && wordcharRegex.test(text.charAt(offset)) && wordcharRegex.test(text.charAt(offset - 1))) {
      bookmark = selection.getBookmark();
      rng.collapse(true);
      rng = $_f7qs4i3fjc7tm7l4.expandRng(editor, rng, editor.formatter.get(name));
      rng = $_bnjeic3ijc7tm7lt.split(rng);
      editor.formatter.apply(name, vars, rng);
      selection.moveToBookmark(bookmark);
    } else {
      if (!caretContainer || textNode.nodeValue !== ZWSP$1) {
        caretContainer = importNode(editor.getDoc(), createCaretContainer(true).dom());
        textNode = caretContainer.firstChild;
        rng.insertNode(caretContainer);
        offset = 1;
        editor.formatter.apply(name, vars, caretContainer);
      } else {
        editor.formatter.apply(name, vars, caretContainer);
      }
      selection.setCursorLocation(textNode, offset);
    }
  };
  var removeCaretFormat = function (editor, name, vars, similar) {
    var dom = editor.dom, selection = editor.selection;
    var rng = selection.getRng(true), container, offset, bookmark;
    var hasContentAfter, node, formatNode, parents = [], caretContainer;
    container = rng.startContainer;
    offset = rng.startOffset;
    node = container;
    if (container.nodeType === 3) {
      if (offset !== container.nodeValue.length) {
        hasContentAfter = true;
      }
      node = node.parentNode;
    }
    while (node) {
      if ($_wz3my3hjc7tm7lo.matchNode(editor, node, name, vars, similar)) {
        formatNode = node;
        break;
      }
      if (node.nextSibling) {
        hasContentAfter = true;
      }
      parents.push(node);
      node = node.parentNode;
    }
    if (!formatNode) {
      return;
    }
    if (hasContentAfter) {
      bookmark = selection.getBookmark();
      rng.collapse(true);
      rng = $_f7qs4i3fjc7tm7l4.expandRng(editor, rng, editor.formatter.get(name), true);
      rng = $_bnjeic3ijc7tm7lt.split(rng);
      editor.formatter.remove(name, vars, rng);
      selection.moveToBookmark(bookmark);
    } else {
      caretContainer = getParentCaretContainer(editor.getBody(), formatNode);
      var newCaretContainer = createCaretContainer(false).dom();
      var caretNode = insertFormatNodesIntoCaretContainer(parents, newCaretContainer);
      if (caretContainer) {
        insertCaretContainerNode(editor, newCaretContainer, caretContainer);
      } else {
        insertCaretContainerNode(editor, newCaretContainer, formatNode);
      }
      removeCaretContainerNode(dom, selection, caretContainer, false);
      selection.setCursorLocation(caretNode, 1);
      if (dom.isEmpty(formatNode)) {
        dom.remove(formatNode);
      }
    }
  };
  var disableCaretContainer = function (body, dom, selection, keyCode) {
    removeCaretContainer(body, dom, selection, null, false);
    if (keyCode === 8 && selection.isCollapsed() && selection.getStart().innerHTML === ZWSP$1) {
      removeCaretContainer(body, dom, selection, getParentCaretContainer(body, selection.getStart()));
    }
    if (keyCode === 37 || keyCode === 39) {
      removeCaretContainer(body, dom, selection, getParentCaretContainer(body, selection.getStart()));
    }
  };
  var setup = function (editor) {
    var dom = editor.dom, selection = editor.selection;
    var body = editor.getBody();
    editor.on('mouseup keydown', function (e) {
      disableCaretContainer(body, dom, selection, e.keyCode);
    });
  };
  var replaceWithCaretFormat = function (targetNode, formatNodes) {
    var caretContainer = createCaretContainer(false);
    var innerMost = insertFormatNodesIntoCaretContainer(formatNodes, caretContainer.dom());
    $_bacixv2fjc7tm79x.before($_bscr39yjc7tm6uo.fromDom(targetNode), caretContainer);
    $_gi2jzz2gjc7tm7a2.remove($_bscr39yjc7tm6uo.fromDom(targetNode));
    return CaretPosition(innerMost, 0);
  };
  var isFormatElement = function (editor, element) {
    var inlineElements = editor.schema.getTextInlineElements();
    return inlineElements.hasOwnProperty($_4bxsjnzjc7tm6uw.name(element)) && !isCaretNode(element.dom()) && !$_1qi2bn1qjc7tm70u.isBogus(element.dom());
  };
  var $_316jl3ejc7tm7kg = {
    setup: setup,
    applyCaretFormat: applyCaretFormat,
    removeCaretFormat: removeCaretFormat,
    isCaretNode: isCaretNode,
    getParentCaretContainer: getParentCaretContainer,
    replaceWithCaretFormat: replaceWithCaretFormat,
    isFormatElement: isFormatElement
  };

  var evaluateUntil = function (fns, args) {
    for (var i = 0; i < fns.length; i++) {
      var result = fns[i].apply(null, args);
      if (result.isSome()) {
        return result;
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var $_ce3m3d3jjc7tm7lx = { evaluateUntil: evaluateUntil };

  var Location = $_7voxo737jc7tm7ii.generate([
    { before: ['element'] },
    { start: ['element'] },
    { end: ['element'] },
    { after: ['element'] }
  ]);
  var rescope$1 = function (rootNode, node) {
    var parentBlock = $_4knc0r27jc7tm77s.getParentBlock(node, rootNode);
    return parentBlock ? parentBlock : rootNode;
  };
  var before$3 = function (isInlineTarget, rootNode, pos) {
    var nPos = $_9dady72wjc7tm7fl.normalizeForwards(pos);
    var scope = rescope$1(rootNode, nPos.container());
    return $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, scope, nPos).fold(function () {
      return $_d2dq9h2pjc7tm7c9.nextPosition(scope, nPos).bind($_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.findRootInline, isInlineTarget, scope)).map(function (inline) {
        return Location.before(inline);
      });
    }, $_e5uurj5jc7tm6bt.none);
  };
  var isNotInsideFormatCaretContainer = function (rootNode, elm) {
    return $_316jl3ejc7tm7kg.getParentCaretContainer(rootNode, elm) === null;
  };
  var findInsideRootInline = function (isInlineTarget, rootNode, pos) {
    return $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, rootNode, pos).filter($_f41mrx6jc7tm6cd.curry(isNotInsideFormatCaretContainer, rootNode));
  };
  var start = function (isInlineTarget, rootNode, pos) {
    var nPos = $_9dady72wjc7tm7fl.normalizeBackwards(pos);
    return findInsideRootInline(isInlineTarget, rootNode, nPos).bind(function (inline) {
      var prevPos = $_d2dq9h2pjc7tm7c9.prevPosition(inline, nPos);
      return prevPos.isNone() ? $_e5uurj5jc7tm6bt.some(Location.start(inline)) : $_e5uurj5jc7tm6bt.none();
    });
  };
  var end = function (isInlineTarget, rootNode, pos) {
    var nPos = $_9dady72wjc7tm7fl.normalizeForwards(pos);
    return findInsideRootInline(isInlineTarget, rootNode, nPos).bind(function (inline) {
      var nextPos = $_d2dq9h2pjc7tm7c9.nextPosition(inline, nPos);
      return nextPos.isNone() ? $_e5uurj5jc7tm6bt.some(Location.end(inline)) : $_e5uurj5jc7tm6bt.none();
    });
  };
  var after$3 = function (isInlineTarget, rootNode, pos) {
    var nPos = $_9dady72wjc7tm7fl.normalizeBackwards(pos);
    var scope = rescope$1(rootNode, nPos.container());
    return $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, scope, nPos).fold(function () {
      return $_d2dq9h2pjc7tm7c9.prevPosition(scope, nPos).bind($_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.findRootInline, isInlineTarget, scope)).map(function (inline) {
        return Location.after(inline);
      });
    }, $_e5uurj5jc7tm6bt.none);
  };
  var isValidLocation = function (location) {
    return $_9dady72wjc7tm7fl.isRtl(getElement(location)) === false;
  };
  var readLocation = function (isInlineTarget, rootNode, pos) {
    var location = $_ce3m3d3jjc7tm7lx.evaluateUntil([
      before$3,
      start,
      end,
      after$3
    ], [
      isInlineTarget,
      rootNode,
      pos
    ]);
    return location.filter(isValidLocation);
  };
  var getElement = function (location) {
    return location.fold($_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity);
  };
  var getName = function (location) {
    return location.fold($_f41mrx6jc7tm6cd.constant('before'), $_f41mrx6jc7tm6cd.constant('start'), $_f41mrx6jc7tm6cd.constant('end'), $_f41mrx6jc7tm6cd.constant('after'));
  };
  var outside = function (location) {
    return location.fold(Location.before, Location.before, Location.after, Location.after);
  };
  var inside = function (location) {
    return location.fold(Location.start, Location.start, Location.end, Location.end);
  };
  var isEq = function (location1, location2) {
    return getName(location1) === getName(location2) && getElement(location1) === getElement(location2);
  };
  var betweenInlines = function (forward, isInlineTarget, rootNode, from, to, location) {
    return $_2siq12djc7tm79e.liftN([
      $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, rootNode, from),
      $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, rootNode, to)
    ], function (fromInline, toInline) {
      if (fromInline !== toInline && $_9dady72wjc7tm7fl.hasSameParentBlock(rootNode, fromInline, toInline)) {
        return Location.after(forward ? fromInline : toInline);
      } else {
        return location;
      }
    }).getOr(location);
  };
  var skipNoMovement = function (fromLocation, toLocation) {
    return fromLocation.fold($_f41mrx6jc7tm6cd.constant(true), function (fromLocation) {
      return !isEq(fromLocation, toLocation);
    });
  };
  var findLocationTraverse = function (forward, isInlineTarget, rootNode, fromLocation, pos) {
    var from = $_9dady72wjc7tm7fl.normalizePosition(forward, pos);
    var to = $_d2dq9h2pjc7tm7c9.fromPosition(forward, rootNode, from).map($_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.normalizePosition, forward));
    var location = to.fold(function () {
      return fromLocation.map(outside);
    }, function (to) {
      return readLocation(isInlineTarget, rootNode, to).map($_f41mrx6jc7tm6cd.curry(betweenInlines, forward, isInlineTarget, rootNode, from, to)).filter($_f41mrx6jc7tm6cd.curry(skipNoMovement, fromLocation));
    });
    return location.filter(isValidLocation);
  };
  var findLocationSimple = function (forward, location) {
    if (forward) {
      return location.fold($_f41mrx6jc7tm6cd.compose($_e5uurj5jc7tm6bt.some, Location.start), $_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.compose($_e5uurj5jc7tm6bt.some, Location.after), $_e5uurj5jc7tm6bt.none);
    } else {
      return location.fold($_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.compose($_e5uurj5jc7tm6bt.some, Location.before), $_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.compose($_e5uurj5jc7tm6bt.some, Location.end));
    }
  };
  var findLocation = function (forward, isInlineTarget, rootNode, pos) {
    var from = $_9dady72wjc7tm7fl.normalizePosition(forward, pos);
    var fromLocation = readLocation(isInlineTarget, rootNode, from);
    return readLocation(isInlineTarget, rootNode, from).bind($_f41mrx6jc7tm6cd.curry(findLocationSimple, forward)).orThunk(function () {
      return findLocationTraverse(forward, isInlineTarget, rootNode, fromLocation, pos);
    });
  };
  var $_dv5v4q3djc7tm7k4 = {
    readLocation: readLocation,
    findLocation: findLocation,
    prevLocation: $_f41mrx6jc7tm6cd.curry(findLocation, false),
    nextLocation: $_f41mrx6jc7tm6cd.curry(findLocation, true),
    getElement: getElement,
    outside: outside,
    inside: inside
  };

  var Cell = function (initial) {
    var value = initial;
    var get = function () {
      return value;
    };
    var set = function (v) {
      value = v;
    };
    var clone = function () {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  var hasSelectionModifyApi = function (editor) {
    return $_1g0kpc12jc7tm6vn.isFunction(editor.selection.getSel().modify);
  };
  var moveRel = function (forward, selection, pos) {
    var delta = forward ? 1 : -1;
    selection.setRng(CaretPosition(pos.container(), pos.offset() + delta).toRange());
    selection.getSel().modify('move', forward ? 'forward' : 'backward', 'word');
    return true;
  };
  var moveByWord = function (forward, editor) {
    var rng = editor.selection.getRng();
    var pos = forward ? CaretPosition.fromRangeEnd(rng) : CaretPosition.fromRangeStart(rng);
    if (!hasSelectionModifyApi(editor)) {
      return false;
    } else if (forward && $_40segn20jc7tm75y.isBeforeInline(pos)) {
      return moveRel(true, editor.selection, pos);
    } else if (!forward && $_40segn20jc7tm75y.isAfterInline(pos)) {
      return moveRel(false, editor.selection, pos);
    } else {
      return false;
    }
  };
  var $_gb7k293mjc7tm7mg = {
    hasSelectionModifyApi: hasSelectionModifyApi,
    moveByWord: moveByWord
  };

  var setCaretPosition = function (editor, pos) {
    var rng = editor.dom.createRng();
    rng.setStart(pos.container(), pos.offset());
    rng.setEnd(pos.container(), pos.offset());
    editor.selection.setRng(rng);
  };
  var isFeatureEnabled$1 = function (editor) {
    return editor.settings.inline_boundaries !== false;
  };
  var setSelected = function (state, elm) {
    if (state) {
      elm.setAttribute('data-mce-selected', 'inline-boundary');
    } else {
      elm.removeAttribute('data-mce-selected');
    }
  };
  var renderCaretLocation = function (editor, caret, location) {
    return $_8avfvd3ajc7tm7jg.renderCaret(caret, location).map(function (pos) {
      setCaretPosition(editor, pos);
      return location;
    });
  };
  var findLocation$1 = function (editor, caret, forward) {
    var rootNode = editor.getBody();
    var from = CaretPosition.fromRangeStart(editor.selection.getRng());
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    var location = $_dv5v4q3djc7tm7k4.findLocation(forward, isInlineTarget, rootNode, from);
    return location.bind(function (location) {
      return renderCaretLocation(editor, caret, location);
    });
  };
  var toggleInlines = function (isInlineTarget, dom, elms) {
    var selectedInlines = $_20yqgb4jc7tm6aj.filter(dom.select('*[data-mce-selected="inline-boundary"]'), isInlineTarget);
    var targetInlines = $_20yqgb4jc7tm6aj.filter(elms, isInlineTarget);
    $_20yqgb4jc7tm6aj.each($_20yqgb4jc7tm6aj.difference(selectedInlines, targetInlines), $_f41mrx6jc7tm6cd.curry(setSelected, false));
    $_20yqgb4jc7tm6aj.each($_20yqgb4jc7tm6aj.difference(targetInlines, selectedInlines), $_f41mrx6jc7tm6cd.curry(setSelected, true));
  };
  var safeRemoveCaretContainer = function (editor, caret) {
    if (editor.selection.isCollapsed() && editor.composing !== true && caret.get()) {
      var pos = CaretPosition.fromRangeStart(editor.selection.getRng());
      if (CaretPosition.isTextPosition(pos) && $_9dady72wjc7tm7fl.isAtZwsp(pos) === false) {
        setCaretPosition(editor, $_5xp8n23cjc7tm7js.removeAndReposition(caret.get(), pos));
        caret.set(null);
      }
    }
  };
  var renderInsideInlineCaret = function (isInlineTarget, editor, caret, elms) {
    if (editor.selection.isCollapsed()) {
      var inlines = $_20yqgb4jc7tm6aj.filter(elms, isInlineTarget);
      $_20yqgb4jc7tm6aj.each(inlines, function (inline) {
        var pos = CaretPosition.fromRangeStart(editor.selection.getRng());
        $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, editor.getBody(), pos).bind(function (location) {
          return renderCaretLocation(editor, caret, location);
        });
      });
    }
  };
  var move = function (editor, caret, forward) {
    return function () {
      return isFeatureEnabled$1(editor) ? findLocation$1(editor, caret, forward).isSome() : false;
    };
  };
  var moveWord = function (forward, editor, caret) {
    return function () {
      return isFeatureEnabled$1(editor) ? $_gb7k293mjc7tm7mg.moveByWord(forward, editor) : false;
    };
  };
  var setupSelectedState = function (editor) {
    var caret = new Cell(null);
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    editor.on('NodeChange', function (e) {
      if (isFeatureEnabled$1(editor)) {
        toggleInlines(isInlineTarget, editor.dom, e.parents);
        safeRemoveCaretContainer(editor, caret);
        renderInsideInlineCaret(isInlineTarget, editor, caret, e.parents);
      }
    });
    return caret;
  };
  var $_3ulj7l3kjc7tm7m2 = {
    move: move,
    moveNextWord: $_f41mrx6jc7tm6cd.curry(moveWord, true),
    movePrevWord: $_f41mrx6jc7tm6cd.curry(moveWord, false),
    setupSelectedState: setupSelectedState,
    setCaretPosition: setCaretPosition
  };

  var isFeatureEnabled = function (editor) {
    return editor.settings.inline_boundaries !== false;
  };
  var rangeFromPositions = function (from, to) {
    var range = document.createRange();
    range.setStart(from.container(), from.offset());
    range.setEnd(to.container(), to.offset());
    return range;
  };
  var hasOnlyTwoOrLessPositionsLeft = function (elm) {
    return $_2siq12djc7tm79e.liftN([
      $_d2dq9h2pjc7tm7c9.firstPositionIn(elm),
      $_d2dq9h2pjc7tm7c9.lastPositionIn(elm)
    ], function (firstPos, lastPos) {
      var normalizedFirstPos = $_9dady72wjc7tm7fl.normalizePosition(true, firstPos);
      var normalizedLastPos = $_9dady72wjc7tm7fl.normalizePosition(false, lastPos);
      return $_d2dq9h2pjc7tm7c9.nextPosition(elm, normalizedFirstPos).map(function (pos) {
        return pos.isEqual(normalizedLastPos);
      }).getOr(true);
    }).getOr(true);
  };
  var setCaretLocation = function (editor, caret) {
    return function (location) {
      return $_8avfvd3ajc7tm7jg.renderCaret(caret, location).map(function (pos) {
        $_3ulj7l3kjc7tm7m2.setCaretPosition(editor, pos);
        return true;
      }).getOr(false);
    };
  };
  var deleteFromTo = function (editor, caret, from, to) {
    var rootNode = editor.getBody();
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    editor.undoManager.ignore(function () {
      editor.selection.setRng(rangeFromPositions(from, to));
      editor.execCommand('Delete');
      $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, rootNode, CaretPosition.fromRangeStart(editor.selection.getRng())).map($_dv5v4q3djc7tm7k4.inside).map(setCaretLocation(editor, caret));
    });
    editor.nodeChanged();
  };
  var rescope = function (rootNode, node) {
    var parentBlock = $_4knc0r27jc7tm77s.getParentBlock(node, rootNode);
    return parentBlock ? parentBlock : rootNode;
  };
  var backspaceDeleteCollapsed = function (editor, caret, forward, from) {
    var rootNode = rescope(editor.getBody(), from.container());
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    var fromLocation = $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, rootNode, from);
    return fromLocation.bind(function (location) {
      if (forward) {
        return location.fold($_f41mrx6jc7tm6cd.constant($_e5uurj5jc7tm6bt.some($_dv5v4q3djc7tm7k4.inside(location))), $_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.constant($_e5uurj5jc7tm6bt.some($_dv5v4q3djc7tm7k4.outside(location))), $_e5uurj5jc7tm6bt.none);
      } else {
        return location.fold($_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.constant($_e5uurj5jc7tm6bt.some($_dv5v4q3djc7tm7k4.outside(location))), $_e5uurj5jc7tm6bt.none, $_f41mrx6jc7tm6cd.constant($_e5uurj5jc7tm6bt.some($_dv5v4q3djc7tm7k4.inside(location))));
      }
    }).map(setCaretLocation(editor, caret)).getOrThunk(function () {
      var toPosition = $_d2dq9h2pjc7tm7c9.navigate(forward, rootNode, from);
      var toLocation = toPosition.bind(function (pos) {
        return $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, rootNode, pos);
      });
      if (fromLocation.isSome() && toLocation.isSome()) {
        return $_9dady72wjc7tm7fl.findRootInline(isInlineTarget, rootNode, from).map(function (elm) {
          if (hasOnlyTwoOrLessPositionsLeft(elm)) {
            $_1556y238jc7tm7ir.deleteElement(editor, forward, $_bscr39yjc7tm6uo.fromDom(elm));
            return true;
          } else {
            return false;
          }
        }).getOr(false);
      } else {
        return toLocation.bind(function (_) {
          return toPosition.map(function (to) {
            if (forward) {
              deleteFromTo(editor, caret, from, to);
            } else {
              deleteFromTo(editor, caret, to, from);
            }
            return true;
          });
        }).getOr(false);
      }
    });
  };
  var backspaceDelete$3 = function (editor, caret, forward) {
    if (editor.selection.isCollapsed() && isFeatureEnabled(editor)) {
      var from = CaretPosition.fromRangeStart(editor.selection.getRng());
      return backspaceDeleteCollapsed(editor, caret, forward, from);
    }
    return false;
  };
  var $_g7y0aq39jc7tm7j6 = { backspaceDelete: backspaceDelete$3 };

  var tableCellRng = $_4vs0gm18jc7tm6xh.immutable('start', 'end');
  var tableSelection = $_4vs0gm18jc7tm6xh.immutable('rng', 'table', 'cells');
  var deleteAction = $_7voxo737jc7tm7ii.generate([
    { removeTable: ['element'] },
    { emptyCells: ['cells'] }
  ]);
  var getClosestCell = function (container, isRoot) {
    return $_d6v5nd31jc7tm7gs.closest($_bscr39yjc7tm6uo.fromDom(container), 'td,th', isRoot);
  };
  var getClosestTable = function (cell, isRoot) {
    return $_d6v5nd31jc7tm7gs.ancestor(cell, 'table', isRoot);
  };
  var isExpandedCellRng = function (cellRng) {
    return $_b0e3uw1djc7tm6y8.eq(cellRng.start(), cellRng.end()) === false;
  };
  var getTableFromCellRng = function (cellRng, isRoot) {
    return getClosestTable(cellRng.start(), isRoot).bind(function (startParentTable) {
      return getClosestTable(cellRng.end(), isRoot).bind(function (endParentTable) {
        return $_b0e3uw1djc7tm6y8.eq(startParentTable, endParentTable) ? $_e5uurj5jc7tm6bt.some(startParentTable) : $_e5uurj5jc7tm6bt.none();
      });
    });
  };
  var getCellRng = function (rng, isRoot) {
    return $_2siq12djc7tm79e.liftN([
      getClosestCell(rng.startContainer, isRoot),
      getClosestCell(rng.endContainer, isRoot)
    ], tableCellRng).filter(isExpandedCellRng);
  };
  var getTableSelectionFromCellRng = function (cellRng, isRoot) {
    return getTableFromCellRng(cellRng, isRoot).bind(function (table) {
      var cells = $_8esf4w2kjc7tm7b6.descendants(table, 'td,th');
      return tableSelection(cellRng, table, cells);
    });
  };
  var getTableSelectionFromRng = function (rootNode, rng) {
    var isRoot = $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, rootNode);
    return getCellRng(rng, isRoot).map(function (cellRng) {
      return getTableSelectionFromCellRng(cellRng, isRoot);
    });
  };
  var getCellIndex = function (cellArray, cell) {
    return $_20yqgb4jc7tm6aj.findIndex(cellArray, function (x) {
      return $_b0e3uw1djc7tm6y8.eq(x, cell);
    });
  };
  var getSelectedCells = function (tableSelection) {
    return $_2siq12djc7tm79e.liftN([
      getCellIndex(tableSelection.cells(), tableSelection.rng().start()),
      getCellIndex(tableSelection.cells(), tableSelection.rng().end())
    ], function (startIndex, endIndex) {
      return tableSelection.cells().slice(startIndex, endIndex + 1);
    });
  };
  var getAction = function (tableSelection) {
    return getSelectedCells(tableSelection).bind(function (selected) {
      var cells = tableSelection.cells();
      return selected.length === cells.length ? deleteAction.removeTable(tableSelection.table()) : deleteAction.emptyCells(selected);
    });
  };
  var getActionFromCells = function (cells) {
    return deleteAction.emptyCells(cells);
  };
  var getActionFromRange = function (rootNode, rng) {
    return getTableSelectionFromRng(rootNode, rng).map(getAction);
  };
  var $_87uxqn3ojc7tm7n2 = {
    getActionFromRange: getActionFromRange,
    getActionFromCells: getActionFromCells
  };

  var getRanges = function (selection) {
    var ranges = [];
    if (selection) {
      for (var i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
      }
    }
    return ranges;
  };
  var getSelectedNodes = function (ranges) {
    return $_20yqgb4jc7tm6aj.bind(ranges, function (range) {
      var node = $_4yp5rq23jc7tm76g.getSelectedNode(range);
      return node ? [$_bscr39yjc7tm6uo.fromDom(node)] : [];
    });
  };
  var hasMultipleRanges = function (selection) {
    return getRanges(selection).length > 1;
  };
  var $_43ngx63qjc7tm7o4 = {
    getRanges: getRanges,
    getSelectedNodes: getSelectedNodes,
    hasMultipleRanges: hasMultipleRanges
  };

  var getCellsFromRanges = function (ranges) {
    return $_20yqgb4jc7tm6aj.filter($_43ngx63qjc7tm7o4.getSelectedNodes(ranges), $_8zplag1pjc7tm70h.isTableCell);
  };
  var getCellsFromElement = function (elm) {
    var selectedCells = $_8esf4w2kjc7tm7b6.descendants(elm, 'td[data-mce-selected],th[data-mce-selected]');
    return selectedCells;
  };
  var getCellsFromElementOrRanges = function (ranges, element) {
    var selectedCells = getCellsFromElement(element);
    var rangeCells = getCellsFromRanges(ranges);
    return selectedCells.length > 0 ? selectedCells : rangeCells;
  };
  var getCellsFromEditor = function (editor) {
    return getCellsFromElementOrRanges($_43ngx63qjc7tm7o4.getRanges(editor.selection.getSel()), $_bscr39yjc7tm6uo.fromDom(editor.getBody()));
  };
  var $_118s3f3pjc7tm7nm = {
    getCellsFromRanges: getCellsFromRanges,
    getCellsFromElement: getCellsFromElement,
    getCellsFromElementOrRanges: getCellsFromElementOrRanges,
    getCellsFromEditor: getCellsFromEditor
  };

  var emptyCells = function (editor, cells) {
    $_20yqgb4jc7tm6aj.each(cells, $_82ax5c2ejc7tm79k.fillWithPaddingBr);
    editor.selection.setCursorLocation(cells[0].dom(), 0);
    return true;
  };
  var deleteTableElement = function (editor, table) {
    $_1556y238jc7tm7ir.deleteElement(editor, false, table);
    return true;
  };
  var deleteCellRange = function (editor, rootElm, rng) {
    return $_87uxqn3ojc7tm7n2.getActionFromRange(rootElm, rng).map(function (action) {
      return action.fold($_f41mrx6jc7tm6cd.curry(deleteTableElement, editor), $_f41mrx6jc7tm6cd.curry(emptyCells, editor));
    });
  };
  var deleteCaptionRange = function (editor, caption) {
    return emptyElement(editor, caption);
  };
  var deleteTableRange = function (editor, rootElm, rng, startElm) {
    return getParentCaption(rootElm, startElm).fold(function () {
      return deleteCellRange(editor, rootElm, rng);
    }, function (caption) {
      return deleteCaptionRange(editor, caption);
    }).getOr(false);
  };
  var deleteRange$1 = function (editor, startElm) {
    var rootNode = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    var rng = editor.selection.getRng();
    var selectedCells = $_118s3f3pjc7tm7nm.getCellsFromEditor(editor);
    return selectedCells.length !== 0 ? emptyCells(editor, selectedCells) : deleteTableRange(editor, rootNode, rng, startElm);
  };
  var getParentCell = function (rootElm, elm) {
    return $_20yqgb4jc7tm6aj.find($_75x9wp33jc7tm7hb.parentsAndSelf(elm, rootElm), $_8zplag1pjc7tm70h.isTableCell);
  };
  var getParentCaption = function (rootElm, elm) {
    return $_20yqgb4jc7tm6aj.find($_75x9wp33jc7tm7hb.parentsAndSelf(elm, rootElm), function (elm) {
      return $_4bxsjnzjc7tm6uw.name(elm) === 'caption';
    });
  };
  var deleteBetweenCells = function (editor, rootElm, forward, fromCell, from) {
    return $_d2dq9h2pjc7tm7c9.navigate(forward, editor.getBody(), from).bind(function (to) {
      return getParentCell(rootElm, $_bscr39yjc7tm6uo.fromDom(to.getNode())).map(function (toCell) {
        return $_b0e3uw1djc7tm6y8.eq(toCell, fromCell) === false;
      });
    });
  };
  var emptyElement = function (editor, elm) {
    $_82ax5c2ejc7tm79k.fillWithPaddingBr(elm);
    editor.selection.setCursorLocation(elm.dom(), 0);
    return $_e5uurj5jc7tm6bt.some(true);
  };
  var isDeleteOfLastCharPos = function (fromCaption, forward, from, to) {
    return $_d2dq9h2pjc7tm7c9.firstPositionIn(fromCaption.dom()).bind(function (first) {
      return $_d2dq9h2pjc7tm7c9.lastPositionIn(fromCaption.dom()).map(function (last) {
        return forward ? from.isEqual(first) && to.isEqual(last) : from.isEqual(last) && to.isEqual(first);
      });
    }).getOr(true);
  };
  var emptyCaretCaption = function (editor, elm) {
    return emptyElement(editor, elm);
  };
  var validateCaretCaption = function (rootElm, fromCaption, to) {
    return getParentCaption(rootElm, $_bscr39yjc7tm6uo.fromDom(to.getNode())).map(function (toCaption) {
      return $_b0e3uw1djc7tm6y8.eq(toCaption, fromCaption) === false;
    });
  };
  var deleteCaretInsideCaption = function (editor, rootElm, forward, fromCaption, from) {
    return $_d2dq9h2pjc7tm7c9.navigate(forward, editor.getBody(), from).bind(function (to) {
      return isDeleteOfLastCharPos(fromCaption, forward, from, to) ? emptyCaretCaption(editor, fromCaption) : validateCaretCaption(rootElm, fromCaption, to);
    }).or($_e5uurj5jc7tm6bt.some(true));
  };
  var deleteCaretCells = function (editor, forward, rootElm, startElm) {
    var from = CaretPosition.fromRangeStart(editor.selection.getRng());
    return getParentCell(rootElm, startElm).bind(function (fromCell) {
      return $_2pntmm2zjc7tm7gh.isEmpty(fromCell) ? emptyElement(editor, fromCell) : deleteBetweenCells(editor, rootElm, forward, fromCell, from);
    });
  };
  var deleteCaretCaption = function (editor, forward, rootElm, fromCaption) {
    var from = CaretPosition.fromRangeStart(editor.selection.getRng());
    return $_2pntmm2zjc7tm7gh.isEmpty(fromCaption) ? emptyElement(editor, fromCaption) : deleteCaretInsideCaption(editor, rootElm, forward, fromCaption, from);
  };
  var deleteCaret = function (editor, forward, startElm) {
    var rootElm = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    return getParentCaption(rootElm, startElm).fold(function () {
      return deleteCaretCells(editor, forward, rootElm, startElm);
    }, function (fromCaption) {
      return deleteCaretCaption(editor, forward, rootElm, fromCaption);
    }).getOr(false);
  };
  var backspaceDelete$4 = function (editor, forward) {
    var startElm = $_bscr39yjc7tm6uo.fromDom(editor.selection.getStart(true));
    return editor.selection.isCollapsed() ? deleteCaret(editor, forward, startElm) : deleteRange$1(editor, startElm);
  };
  var $_479zvc3njc7tm7mn = { backspaceDelete: backspaceDelete$4 };

  var nativeCommand = function (editor, command) {
    editor.getDoc().execCommand(command, false, null);
  };
  var deleteCommand = function (editor) {
    if ($_b90wzv35jc7tm7hp.backspaceDelete(editor, false)) {
      return;
    } else if ($_g7y0aq39jc7tm7j6.backspaceDelete(editor, false)) {
      return;
    } else if ($_34bxq92rjc7tm7cv.backspaceDelete(editor, false)) {
      return;
    } else if ($_479zvc3njc7tm7mn.backspaceDelete(editor)) {
      return;
    } else if ($_brt56434jc7tm7hi.backspaceDelete(editor, false)) {
      return;
    } else {
      nativeCommand(editor, 'Delete');
      $_2qjhc22tjc7tm7dx.paddEmptyBody(editor);
    }
  };
  var forwardDeleteCommand = function (editor) {
    if ($_b90wzv35jc7tm7hp.backspaceDelete(editor, true)) {
      return;
    } else if ($_g7y0aq39jc7tm7j6.backspaceDelete(editor, true)) {
      return;
    } else if ($_34bxq92rjc7tm7cv.backspaceDelete(editor, true)) {
      return;
    } else if ($_479zvc3njc7tm7mn.backspaceDelete(editor)) {
      return;
    } else if ($_brt56434jc7tm7hi.backspaceDelete(editor, true)) {
      return;
    } else {
      nativeCommand(editor, 'ForwardDelete');
    }
  };
  var $_9gvx7k2qjc7tm7cp = {
    deleteCommand: deleteCommand,
    forwardDeleteCommand: forwardDeleteCommand
  };

  var isEq$3 = function (rng1, rng2) {
    return rng1 && rng2 && (rng1.startContainer === rng2.startContainer && rng1.startOffset === rng2.startOffset) && (rng1.endContainer === rng2.endContainer && rng1.endOffset === rng2.endOffset);
  };
  var $_5m3au53tjc7tm7ou = { isEq: isEq$3 };

  var position = $_4vs0gm18jc7tm6xh.immutable('container', 'offset');
  var findParent = function (node, rootNode, predicate) {
    while (node && node !== rootNode) {
      if (predicate(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var hasParent = function (node, rootNode, predicate) {
    return findParent(node, rootNode, predicate) !== null;
  };
  var hasParentWithName = function (node, rootNode, name) {
    return hasParent(node, rootNode, function (node) {
      return node.nodeName === name;
    });
  };
  var isTable$1 = function (node) {
    return node && node.nodeName === 'TABLE';
  };
  var isTableCell$1 = function (node) {
    return node && /^(TD|TH|CAPTION)$/.test(node.nodeName);
  };
  var isCeFalseCaretContainer = function (node, rootNode) {
    return $_40segn20jc7tm75y.isCaretContainer(node) && hasParent(node, rootNode, $_316jl3ejc7tm7kg.isCaretNode) === false;
  };
  var hasBrBeforeAfter = function (dom, node, left) {
    var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || dom.getRoot());
    while (node = walker[left ? 'prev' : 'next']()) {
      if ($_1qi2bn1qjc7tm70u.isBr(node)) {
        return true;
      }
    }
  };
  var isPrevNode = function (node, name) {
    return node.previousSibling && node.previousSibling.nodeName === name;
  };
  var hasContentEditableFalseParent = function (body, node) {
    while (node && node !== body) {
      if ($_1qi2bn1qjc7tm70u.isContentEditableFalse(node)) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };
  var findTextNodeRelative = function (dom, isAfterNode, collapsed, left, startNode) {
    var walker, lastInlineElement, parentBlockContainer, body = dom.getRoot(), node;
    var nonEmptyElementsMap = dom.schema.getNonEmptyElements();
    parentBlockContainer = dom.getParent(startNode.parentNode, dom.isBlock) || body;
    if (left && $_1qi2bn1qjc7tm70u.isBr(startNode) && isAfterNode && dom.isEmpty(parentBlockContainer)) {
      return $_e5uurj5jc7tm6bt.some(position(startNode.parentNode, dom.nodeIndex(startNode)));
    }
    walker = new TreeWalker(startNode, parentBlockContainer);
    while (node = walker[left ? 'prev' : 'next']()) {
      if (dom.getContentEditableParent(node) === 'false' || isCeFalseCaretContainer(node, body)) {
        return $_e5uurj5jc7tm6bt.none();
      }
      if ($_1qi2bn1qjc7tm70u.isText(node) && node.nodeValue.length > 0) {
        if (hasParentWithName(node, body, 'A') === false) {
          return $_e5uurj5jc7tm6bt.some(position(node, left ? node.nodeValue.length : 0));
        }
        return $_e5uurj5jc7tm6bt.none();
      }
      if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
        return $_e5uurj5jc7tm6bt.none();
      }
      lastInlineElement = node;
    }
    if (collapsed && lastInlineElement) {
      return $_e5uurj5jc7tm6bt.some(position(lastInlineElement, 0));
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var normalizeEndPoint = function (dom, collapsed, start, rng) {
    var container, offset, walker, body = dom.getRoot(), node, nonEmptyElementsMap;
    var directionLeft, isAfterNode, normalized = false;
    container = rng[(start ? 'start' : 'end') + 'Container'];
    offset = rng[(start ? 'start' : 'end') + 'Offset'];
    isAfterNode = $_1qi2bn1qjc7tm70u.isElement(container) && offset === container.childNodes.length;
    nonEmptyElementsMap = dom.schema.getNonEmptyElements();
    directionLeft = start;
    if ($_40segn20jc7tm75y.isCaretContainer(container)) {
      return $_e5uurj5jc7tm6bt.none();
    }
    if ($_1qi2bn1qjc7tm70u.isElement(container) && offset > container.childNodes.length - 1) {
      directionLeft = false;
    }
    if ($_1qi2bn1qjc7tm70u.isDocument(container)) {
      container = body;
      offset = 0;
    }
    if (container === body) {
      if (directionLeft) {
        node = container.childNodes[offset > 0 ? offset - 1 : 0];
        if (node) {
          if ($_40segn20jc7tm75y.isCaretContainer(node)) {
            return $_e5uurj5jc7tm6bt.none();
          }
          if (nonEmptyElementsMap[node.nodeName] || isTable$1(node)) {
            return $_e5uurj5jc7tm6bt.none();
          }
        }
      }
      if (container.hasChildNodes()) {
        offset = Math.min(!directionLeft && offset > 0 ? offset - 1 : offset, container.childNodes.length - 1);
        container = container.childNodes[offset];
        offset = $_1qi2bn1qjc7tm70u.isText(container) && isAfterNode ? container.data.length : 0;
        if (!collapsed && container === body.lastChild && isTable$1(container)) {
          return $_e5uurj5jc7tm6bt.none();
        }
        if (hasContentEditableFalseParent(body, container) || $_40segn20jc7tm75y.isCaretContainer(container)) {
          return $_e5uurj5jc7tm6bt.none();
        }
        if (container.hasChildNodes() && isTable$1(container) === false) {
          node = container;
          walker = new TreeWalker(container, body);
          do {
            if ($_1qi2bn1qjc7tm70u.isContentEditableFalse(node) || $_40segn20jc7tm75y.isCaretContainer(node)) {
              normalized = false;
              break;
            }
            if ($_1qi2bn1qjc7tm70u.isText(node) && node.nodeValue.length > 0) {
              offset = directionLeft ? 0 : node.nodeValue.length;
              container = node;
              normalized = true;
              break;
            }
            if (nonEmptyElementsMap[node.nodeName.toLowerCase()] && !isTableCell$1(node)) {
              offset = dom.nodeIndex(node);
              container = node.parentNode;
              if ((node.nodeName === 'IMG' || node.nodeName === 'PRE') && !directionLeft) {
                offset++;
              }
              normalized = true;
              break;
            }
          } while (node = directionLeft ? walker.next() : walker.prev());
        }
      }
    }
    if (collapsed) {
      if ($_1qi2bn1qjc7tm70u.isText(container) && offset === 0) {
        findTextNodeRelative(dom, isAfterNode, collapsed, true, container).each(function (pos) {
          container = pos.container();
          offset = pos.offset();
          normalized = true;
        });
      }
      if ($_1qi2bn1qjc7tm70u.isElement(container)) {
        node = container.childNodes[offset];
        if (!node) {
          node = container.childNodes[offset - 1];
        }
        if (node && $_1qi2bn1qjc7tm70u.isBr(node) && !isPrevNode(node, 'A') && !hasBrBeforeAfter(dom, node, false) && !hasBrBeforeAfter(dom, node, true)) {
          findTextNodeRelative(dom, isAfterNode, collapsed, true, node).each(function (pos) {
            container = pos.container();
            offset = pos.offset();
            normalized = true;
          });
        }
      }
    }
    if (directionLeft && !collapsed && $_1qi2bn1qjc7tm70u.isText(container) && offset === container.nodeValue.length) {
      findTextNodeRelative(dom, isAfterNode, collapsed, false, container).each(function (pos) {
        container = pos.container();
        offset = pos.offset();
        normalized = true;
      });
    }
    return normalized ? $_e5uurj5jc7tm6bt.some(position(container, offset)) : $_e5uurj5jc7tm6bt.none();
  };
  var normalize$1 = function (dom, rng) {
    var collapsed = rng.collapsed, normRng = rng.cloneRange();
    normalizeEndPoint(dom, collapsed, true, normRng).each(function (pos) {
      normRng.setStart(pos.container(), pos.offset());
    });
    if (!collapsed) {
      normalizeEndPoint(dom, collapsed, false, normRng).each(function (pos) {
        normRng.setEnd(pos.container(), pos.offset());
      });
    }
    if (collapsed) {
      normRng.collapse(true);
    }
    return $_5m3au53tjc7tm7ou.isEq(rng, normRng) ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.some(normRng);
  };
  var $_ca2q7b3sjc7tm7ol = { normalize: normalize$1 };

  var hasRightSideContent = function (schema, container, parentBlock) {
    var walker = new TreeWalker(container, parentBlock), node;
    var nonEmptyElementsMap = schema.getNonEmptyElements();
    while (node = walker.next()) {
      if (nonEmptyElementsMap[node.nodeName.toLowerCase()] || node.length > 0) {
        return true;
      }
    }
  };
  var scrollToBr = function (dom, selection, brElm) {
    var marker = dom.create('span', {}, '&nbsp;');
    brElm.parentNode.insertBefore(marker, brElm);
    selection.scrollIntoView(marker);
    dom.remove(marker);
  };
  var moveSelectionToBr = function (dom, selection, brElm, extraBr) {
    var rng = dom.createRng();
    if (!extraBr) {
      rng.setStartAfter(brElm);
      rng.setEndAfter(brElm);
    } else {
      rng.setStartBefore(brElm);
      rng.setEndBefore(brElm);
    }
    selection.setRng(rng);
  };
  var insertBrAtCaret = function (editor, evt) {
    var selection = editor.selection, dom = editor.dom;
    var brElm, extraBr;
    var rng = selection.getRng(true);
    $_ca2q7b3sjc7tm7ol.normalize(dom, rng).each(function (normRng) {
      rng.setStart(normRng.startContainer, normRng.startOffset);
      rng.setEnd(normRng.endContainer, normRng.endOffset);
    });
    var offset = rng.startOffset;
    var container = rng.startContainer;
    if (container.nodeType === 1 && container.hasChildNodes()) {
      var isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
      container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;
      if (isAfterLastNodeInContainer && container.nodeType === 3) {
        offset = container.nodeValue.length;
      } else {
        offset = 0;
      }
    }
    var parentBlock = dom.getParent(container, dom.isBlock);
    var containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null;
    var containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : '';
    var isControlKey = evt && evt.ctrlKey;
    if (containerBlockName === 'LI' && !isControlKey) {
      parentBlock = containerBlock;
    }
    if (container && container.nodeType === 3 && offset >= container.nodeValue.length) {
      if (!hasRightSideContent(editor.schema, container, parentBlock)) {
        brElm = dom.create('br');
        rng.insertNode(brElm);
        rng.setStartAfter(brElm);
        rng.setEndAfter(brElm);
        extraBr = true;
      }
    }
    brElm = dom.create('br');
    rng.insertNode(brElm);
    scrollToBr(dom, selection, brElm);
    moveSelectionToBr(dom, selection, brElm, extraBr);
    editor.undoManager.add();
  };
  var insertBrBefore = function (editor, inline) {
    var br = $_bscr39yjc7tm6uo.fromTag('br');
    $_bacixv2fjc7tm79x.before($_bscr39yjc7tm6uo.fromDom(inline), br);
    editor.undoManager.add();
  };
  var insertBrAfter = function (editor, inline) {
    if (!hasBrAfter(editor.getBody(), inline)) {
      $_bacixv2fjc7tm79x.after($_bscr39yjc7tm6uo.fromDom(inline), $_bscr39yjc7tm6uo.fromTag('br'));
    }
    var br = $_bscr39yjc7tm6uo.fromTag('br');
    $_bacixv2fjc7tm79x.after($_bscr39yjc7tm6uo.fromDom(inline), br);
    scrollToBr(editor.dom, editor.selection, br.dom());
    moveSelectionToBr(editor.dom, editor.selection, br.dom(), false);
    editor.undoManager.add();
  };
  var isBeforeBr = function (pos) {
    return $_1qi2bn1qjc7tm70u.isBr(pos.getNode());
  };
  var hasBrAfter = function (rootNode, startNode) {
    if (isBeforeBr(CaretPosition.after(startNode))) {
      return true;
    } else {
      return $_d2dq9h2pjc7tm7c9.nextPosition(rootNode, CaretPosition.after(startNode)).map(function (pos) {
        return $_1qi2bn1qjc7tm70u.isBr(pos.getNode());
      }).getOr(false);
    }
  };
  var isAnchorLink = function (elm) {
    return elm && elm.nodeName === 'A' && 'href' in elm;
  };
  var isInsideAnchor = function (location) {
    return location.fold($_f41mrx6jc7tm6cd.constant(false), isAnchorLink, isAnchorLink, $_f41mrx6jc7tm6cd.constant(false));
  };
  var readInlineAnchorLocation = function (editor) {
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    var position = CaretPosition.fromRangeStart(editor.selection.getRng());
    return $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, editor.getBody(), position).filter(isInsideAnchor);
  };
  var insertBrOutsideAnchor = function (editor, location) {
    location.fold($_f41mrx6jc7tm6cd.noop, $_f41mrx6jc7tm6cd.curry(insertBrBefore, editor), $_f41mrx6jc7tm6cd.curry(insertBrAfter, editor), $_f41mrx6jc7tm6cd.noop);
  };
  var insert = function (editor, evt) {
    var anchorLocation = readInlineAnchorLocation(editor);
    if (anchorLocation.isSome()) {
      anchorLocation.each($_f41mrx6jc7tm6cd.curry(insertBrOutsideAnchor, editor));
    } else {
      insertBrAtCaret(editor, evt);
    }
  };
  var $_15morc3rjc7tm7oa = { insert: insert };

  var adt = $_7voxo737jc7tm7ii.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart$1 = function (situ) {
    return situ.fold($_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity, $_f41mrx6jc7tm6cd.identity);
  };
  var $_dk5is53wjc7tm7pl = {
    before: adt.before,
    on: adt.on,
    after: adt.after,
    cata: cata,
    getStart: getStart$1
  };

  var type$1 = $_7voxo737jc7tm7ii.generate([
    { domRange: ['rng'] },
    {
      relative: [
        'startSitu',
        'finishSitu'
      ]
    },
    {
      exact: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var range$1 = $_4vs0gm18jc7tm6xh.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$1.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_bscr39yjc7tm6uo.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_dk5is53wjc7tm7pl.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart(selection);
    return $_15fekq17jc7tm6wo.defaultView(start);
  };
  var $_8nd26h3vjc7tm7pc = {
    domRange: type$1.domRange,
    relative: type$1.relative,
    exact: type$1.exact,
    exactFromRange: exactFromRange,
    range: range$1,
    getWin: getWin
  };

  var browser$2 = $_e43n9tmjc7tm6ss.detect().browser;
  var clamp = function (offset, element) {
    var max = $_4bxsjnzjc7tm6uw.isText(element) ? $_3rk0xt2ijc7tm7au.get(element).length : $_15fekq17jc7tm6wo.children(element).length + 1;
    if (offset > max) {
      return max;
    } else if (offset < 0) {
      return 0;
    }
    return offset;
  };
  var normalizeRng = function (rng) {
    return $_8nd26h3vjc7tm7pc.range(rng.start(), clamp(rng.soffset(), rng.start()), rng.finish(), clamp(rng.foffset(), rng.finish()));
  };
  var isOrContains = function (root, elm) {
    return $_b0e3uw1djc7tm6y8.contains(root, elm) || $_b0e3uw1djc7tm6y8.eq(root, elm);
  };
  var isRngInRoot = function (root) {
    return function (rng) {
      return isOrContains(root, rng.start()) && isOrContains(root, rng.finish());
    };
  };
  var shouldStore = function (editor) {
    return editor.inline === true || browser$2.isIE();
  };
  var nativeRangeToSelectionRange = function (r) {
    return $_8nd26h3vjc7tm7pc.range($_bscr39yjc7tm6uo.fromDom(r.startContainer), r.startOffset, $_bscr39yjc7tm6uo.fromDom(r.endContainer), r.endOffset);
  };
  var readRange = function (win) {
    var selection = win.getSelection();
    var rng = !selection || selection.rangeCount === 0 ? $_e5uurj5jc7tm6bt.none() : $_e5uurj5jc7tm6bt.from(selection.getRangeAt(0));
    return rng.map(nativeRangeToSelectionRange);
  };
  var getBookmark$2 = function (root) {
    var win = $_15fekq17jc7tm6wo.defaultView(root);
    return readRange(win.dom()).filter(isRngInRoot(root));
  };
  var validate = function (root, bookmark) {
    return $_e5uurj5jc7tm6bt.from(bookmark).filter(isRngInRoot(root)).map(normalizeRng);
  };
  var bookmarkToNativeRng = function (bookmark) {
    var rng = document.createRange();
    rng.setStart(bookmark.start().dom(), bookmark.soffset());
    rng.setEnd(bookmark.finish().dom(), bookmark.foffset());
    return $_e5uurj5jc7tm6bt.some(rng);
  };
  var store = function (editor) {
    var newBookmark = shouldStore(editor) ? getBookmark$2($_bscr39yjc7tm6uo.fromDom(editor.getBody())) : $_e5uurj5jc7tm6bt.none();
    editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark;
  };
  var storeNative = function (editor, rng) {
    var root = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    var range = shouldStore(editor) ? $_e5uurj5jc7tm6bt.from(rng) : $_e5uurj5jc7tm6bt.none();
    var newBookmark = range.map(nativeRangeToSelectionRange).filter(isRngInRoot(root));
    editor.bookmark = newBookmark.isSome() ? newBookmark : editor.bookmark;
  };
  var getRng = function (editor) {
    var bookmark = editor.bookmark ? editor.bookmark : $_e5uurj5jc7tm6bt.none();
    return bookmark.bind($_f41mrx6jc7tm6cd.curry(validate, $_bscr39yjc7tm6uo.fromDom(editor.getBody()))).bind(bookmarkToNativeRng);
  };
  var restore = function (editor) {
    getRng(editor).each(function (rng) {
      editor.selection.setRng(rng);
    });
  };
  var $_5o1m7s3ujc7tm7p1 = {
    store: store,
    storeNative: storeNative,
    readRange: readRange,
    restore: restore,
    getRng: getRng,
    getBookmark: getBookmark$2,
    validate: validate
  };

  var each$9 = $_b8tc32jjc7tm6qi.each;
  var extend$3 = $_b8tc32jjc7tm6qi.extend;
  var map$2 = $_b8tc32jjc7tm6qi.map;
  var inArray$2 = $_b8tc32jjc7tm6qi.inArray;
  var explode$2 = $_b8tc32jjc7tm6qi.explode;
  var TRUE = true;
  var FALSE = false;
  var EditorCommands = function (editor) {
    var dom, selection, formatter, commands = {
        state: {},
        exec: {},
        value: {}
      }, settings = editor.settings, bookmark;
    editor.on('PreInit', function () {
      dom = editor.dom;
      selection = editor.selection;
      settings = editor.settings;
      formatter = editor.formatter;
    });
    var execCommand = function (command, ui, value, args) {
      var func, customCommand, state = false;
      if (editor.removed) {
        return;
      }
      if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint)$/.test(command) && (!args || !args.skip_focus)) {
        editor.focus();
      } else {
        $_5o1m7s3ujc7tm7p1.restore(editor);
      }
      args = editor.fire('BeforeExecCommand', {
        command: command,
        ui: ui,
        value: value
      });
      if (args.isDefaultPrevented()) {
        return false;
      }
      customCommand = command.toLowerCase();
      if (func = commands.exec[customCommand]) {
        func(customCommand, ui, value);
        editor.fire('ExecCommand', {
          command: command,
          ui: ui,
          value: value
        });
        return true;
      }
      each$9(editor.plugins, function (p) {
        if (p.execCommand && p.execCommand(command, ui, value)) {
          editor.fire('ExecCommand', {
            command: command,
            ui: ui,
            value: value
          });
          state = true;
          return false;
        }
      });
      if (state) {
        return state;
      }
      if (editor.theme && editor.theme.execCommand && editor.theme.execCommand(command, ui, value)) {
        editor.fire('ExecCommand', {
          command: command,
          ui: ui,
          value: value
        });
        return true;
      }
      try {
        state = editor.getDoc().execCommand(command, ui, value);
      } catch (ex) {
      }
      if (state) {
        editor.fire('ExecCommand', {
          command: command,
          ui: ui,
          value: value
        });
        return true;
      }
      return false;
    };
    var queryCommandState = function (command) {
      var func;
      if (editor.quirks.isHidden() || editor.removed) {
        return;
      }
      command = command.toLowerCase();
      if (func = commands.state[command]) {
        return func(command);
      }
      try {
        return editor.getDoc().queryCommandState(command);
      } catch (ex) {
      }
      return false;
    };
    var queryCommandValue = function (command) {
      var func;
      if (editor.quirks.isHidden() || editor.removed) {
        return;
      }
      command = command.toLowerCase();
      if (func = commands.value[command]) {
        return func(command);
      }
      try {
        return editor.getDoc().queryCommandValue(command);
      } catch (ex) {
      }
    };
    var addCommands = function (commandList, type) {
      type = type || 'exec';
      each$9(commandList, function (callback, command) {
        each$9(command.toLowerCase().split(','), function (command) {
          commands[type][command] = callback;
        });
      });
    };
    var addCommand = function (command, callback, scope) {
      command = command.toLowerCase();
      commands.exec[command] = function (command, ui, value, args) {
        return callback.call(scope || editor, ui, value, args);
      };
    };
    var queryCommandSupported = function (command) {
      command = command.toLowerCase();
      if (commands.exec[command]) {
        return true;
      }
      try {
        return editor.getDoc().queryCommandSupported(command);
      } catch (ex) {
      }
      return false;
    };
    var addQueryStateHandler = function (command, callback, scope) {
      command = command.toLowerCase();
      commands.state[command] = function () {
        return callback.call(scope || editor);
      };
    };
    var addQueryValueHandler = function (command, callback, scope) {
      command = command.toLowerCase();
      commands.value[command] = function () {
        return callback.call(scope || editor);
      };
    };
    var hasCustomCommand = function (command) {
      command = command.toLowerCase();
      return !!commands.exec[command];
    };
    extend$3(this, {
      execCommand: execCommand,
      queryCommandState: queryCommandState,
      queryCommandValue: queryCommandValue,
      queryCommandSupported: queryCommandSupported,
      addCommands: addCommands,
      addCommand: addCommand,
      addQueryStateHandler: addQueryStateHandler,
      addQueryValueHandler: addQueryValueHandler,
      hasCustomCommand: hasCustomCommand
    });
    var execNativeCommand = function (command, ui, value) {
      if (ui === undefined) {
        ui = FALSE;
      }
      if (value === undefined) {
        value = null;
      }
      return editor.getDoc().execCommand(command, ui, value);
    };
    var isFormatMatch = function (name) {
      return formatter.match(name);
    };
    var toggleFormat = function (name, value) {
      formatter.toggle(name, value ? { value: value } : undefined);
      editor.nodeChanged();
    };
    var storeSelection = function (type) {
      bookmark = selection.getBookmark(type);
    };
    var restoreSelection = function () {
      selection.moveToBookmark(bookmark);
    };
    addCommands({
      'mceResetDesignMode,mceBeginUndoLevel': function () {
      },
      'mceEndUndoLevel,mceAddUndoLevel': function () {
        editor.undoManager.add();
      },
      'Cut,Copy,Paste': function (command) {
        var doc = editor.getDoc(), failed;
        try {
          execNativeCommand(command);
        } catch (ex) {
          failed = TRUE;
        }
        if (command === 'paste' && !doc.queryCommandEnabled(command)) {
          failed = true;
        }
        if (failed || !doc.queryCommandSupported(command)) {
          var msg = editor.translate('Your browser doesn\'t support direct access to the clipboard. ' + 'Please use the Ctrl+X/C/V keyboard shortcuts instead.');
          if ($_dtgtsy9jc7tm6gs.mac) {
            msg = msg.replace(/Ctrl\+/g, '\u2318+');
          }
          editor.notificationManager.open({
            text: msg,
            type: 'error'
          });
        }
      },
      unlink: function () {
        if (selection.isCollapsed()) {
          var elm = editor.dom.getParent(editor.selection.getStart(), 'a');
          if (elm) {
            editor.dom.remove(elm, true);
          }
          return;
        }
        formatter.remove('link');
      },
      'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull,JustifyNone': function (command) {
        var align = command.substring(7);
        if (align == 'full') {
          align = 'justify';
        }
        each$9('left,center,right,justify'.split(','), function (name) {
          if (align != name) {
            formatter.remove('align' + name);
          }
        });
        if (align != 'none') {
          toggleFormat('align' + align);
        }
      },
      'InsertUnorderedList,InsertOrderedList': function (command) {
        var listElm, listParent;
        execNativeCommand(command);
        listElm = dom.getParent(selection.getNode(), 'ol,ul');
        if (listElm) {
          listParent = listElm.parentNode;
          if (/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) {
            storeSelection();
            dom.split(listParent, listElm);
            restoreSelection();
          }
        }
      },
      'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
        toggleFormat(command);
      },
      'ForeColor,HiliteColor,FontName': function (command, ui, value) {
        toggleFormat(command, value);
      },
      FontSize: function (command, ui, value) {
        var fontClasses, fontSizes;
        if (value >= 1 && value <= 7) {
          fontSizes = explode$2(settings.font_size_style_values);
          fontClasses = explode$2(settings.font_size_classes);
          if (fontClasses) {
            value = fontClasses[value - 1] || value;
          } else {
            value = fontSizes[value - 1] || value;
          }
        }
        toggleFormat(command, value);
      },
      RemoveFormat: function (command) {
        formatter.remove(command);
      },
      mceBlockQuote: function () {
        toggleFormat('blockquote');
      },
      FormatBlock: function (command, ui, value) {
        return toggleFormat(value || 'p');
      },
      mceCleanup: function () {
        var bookmark = selection.getBookmark();
        editor.setContent(editor.getContent({ cleanup: TRUE }), { cleanup: TRUE });
        selection.moveToBookmark(bookmark);
      },
      mceRemoveNode: function (command, ui, value) {
        var node = value || selection.getNode();
        if (node != editor.getBody()) {
          storeSelection();
          editor.dom.remove(node, TRUE);
          restoreSelection();
        }
      },
      mceSelectNodeDepth: function (command, ui, value) {
        var counter = 0;
        dom.getParent(selection.getNode(), function (node) {
          if (node.nodeType == 1 && counter++ == value) {
            selection.select(node);
            return FALSE;
          }
        }, editor.getBody());
      },
      mceSelectNode: function (command, ui, value) {
        selection.select(value);
      },
      mceInsertContent: function (command, ui, value) {
        $_8kiytu1wjc7tm74r.insertAtCaret(editor, value);
      },
      mceInsertRawHTML: function (command, ui, value) {
        selection.setContent('tiny_mce_marker');
        editor.setContent(editor.getContent().replace(/tiny_mce_marker/g, function () {
          return value;
        }));
      },
      mceToggleFormat: function (command, ui, value) {
        toggleFormat(value);
      },
      mceSetContent: function (command, ui, value) {
        editor.setContent(value);
      },
      'Indent,Outdent': function (command) {
        var intentValue, indentUnit, value;
        intentValue = settings.indentation;
        indentUnit = /[a-z%]+$/i.exec(intentValue);
        intentValue = parseInt(intentValue, 10);
        if (!queryCommandState('InsertUnorderedList') && !queryCommandState('InsertOrderedList')) {
          if (!settings.forced_root_block && !dom.getParent(selection.getNode(), dom.isBlock)) {
            formatter.apply('div');
          }
          each$9(selection.getSelectedBlocks(), function (element) {
            if (dom.getContentEditable(element) === 'false') {
              return;
            }
            if (element.nodeName !== 'LI') {
              var indentStyleName = editor.getParam('indent_use_margin', false) ? 'margin' : 'padding';
              indentStyleName = element.nodeName === 'TABLE' ? 'margin' : indentStyleName;
              indentStyleName += dom.getStyle(element, 'direction', true) == 'rtl' ? 'Right' : 'Left';
              if (command == 'outdent') {
                value = Math.max(0, parseInt(element.style[indentStyleName] || 0, 10) - intentValue);
                dom.setStyle(element, indentStyleName, value ? value + indentUnit : '');
              } else {
                value = parseInt(element.style[indentStyleName] || 0, 10) + intentValue + indentUnit;
                dom.setStyle(element, indentStyleName, value);
              }
            }
          });
        } else {
          execNativeCommand(command);
        }
      },
      mceRepaint: function () {
      },
      InsertHorizontalRule: function () {
        editor.execCommand('mceInsertContent', false, '<hr />');
      },
      mceToggleVisualAid: function () {
        editor.hasVisual = !editor.hasVisual;
        editor.addVisual();
      },
      mceReplaceContent: function (command, ui, value) {
        editor.execCommand('mceInsertContent', false, value.replace(/\{\$selection\}/g, selection.getContent({ format: 'text' })));
      },
      mceInsertLink: function (command, ui, value) {
        var anchor;
        if (typeof value == 'string') {
          value = { href: value };
        }
        anchor = dom.getParent(selection.getNode(), 'a');
        value.href = value.href.replace(' ', '%20');
        if (!anchor || !value.href) {
          formatter.remove('link');
        }
        if (value.href) {
          formatter.apply('link', value, anchor);
        }
      },
      selectAll: function () {
        var editingHost = dom.getParent(selection.getStart(), $_1qi2bn1qjc7tm70u.isContentEditableTrue);
        if (editingHost) {
          var rng = dom.createRng();
          rng.selectNodeContents(editingHost);
          selection.setRng(rng);
        }
      },
      'delete': function () {
        $_9gvx7k2qjc7tm7cp.deleteCommand(editor);
      },
      'forwardDelete': function () {
        $_9gvx7k2qjc7tm7cp.forwardDeleteCommand(editor);
      },
      mceNewDocument: function () {
        editor.setContent('');
      },
      InsertLineBreak: function (command, ui, value) {
        $_15morc3rjc7tm7oa.insert(editor, value);
        return true;
      }
    });
    addCommands({
      'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull': function (command) {
        var name = 'align' + command.substring(7);
        var nodes = selection.isCollapsed() ? [dom.getParent(selection.getNode(), dom.isBlock)] : selection.getSelectedBlocks();
        var matches = map$2(nodes, function (node) {
          return !!formatter.matchNode(node, name);
        });
        return inArray$2(matches, TRUE) !== -1;
      },
      'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) {
        return isFormatMatch(command);
      },
      mceBlockQuote: function () {
        return isFormatMatch('blockquote');
      },
      Outdent: function () {
        var node;
        if (settings.inline_styles) {
          if ((node = dom.getParent(selection.getStart(), dom.isBlock)) && parseInt(node.style.paddingLeft, 10) > 0) {
            return TRUE;
          }
          if ((node = dom.getParent(selection.getEnd(), dom.isBlock)) && parseInt(node.style.paddingLeft, 10) > 0) {
            return TRUE;
          }
        }
        return queryCommandState('InsertUnorderedList') || queryCommandState('InsertOrderedList') || !settings.inline_styles && !!dom.getParent(selection.getNode(), 'BLOCKQUOTE');
      },
      'InsertUnorderedList,InsertOrderedList': function (command) {
        var list = dom.getParent(selection.getNode(), 'ul,ol');
        return list && (command === 'insertunorderedlist' && list.tagName === 'UL' || command === 'insertorderedlist' && list.tagName === 'OL');
      }
    }, 'state');
    addCommands({
      'FontSize,FontName': function (command) {
        var value = 0, parent;
        if (parent = dom.getParent(selection.getNode(), 'span')) {
          if (command == 'fontsize') {
            value = parent.style.fontSize;
          } else {
            value = parent.style.fontFamily.replace(/, /g, ',').replace(/[\'\"]/g, '').toLowerCase();
          }
        }
        return value;
      }
    }, 'value');
    addCommands({
      Undo: function () {
        editor.undoManager.undo();
      },
      Redo: function () {
        editor.undoManager.redo();
      }
    });
  };

  var nativeEvents = $_b8tc32jjc7tm6qi.makeMap('focus blur focusin focusout click dblclick mousedown mouseup mousemove mouseover beforepaste paste cut copy selectionchange ' + 'mouseout mouseenter mouseleave wheel keydown keypress keyup input contextmenu dragstart dragend dragover ' + 'draggesture dragdrop drop drag submit ' + 'compositionstart compositionend compositionupdate touchstart touchmove touchend', ' ');
  var Dispatcher = function (settings) {
    var self = this, scope, bindings = {}, toggleEvent;
    var returnFalse = function () {
      return false;
    };
    var returnTrue = function () {
      return true;
    };
    settings = settings || {};
    scope = settings.scope || self;
    toggleEvent = settings.toggleEvent || returnFalse;
    var fire = function (name, args) {
      var handlers, i, l, callback;
      name = name.toLowerCase();
      args = args || {};
      args.type = name;
      if (!args.target) {
        args.target = scope;
      }
      if (!args.preventDefault) {
        args.preventDefault = function () {
          args.isDefaultPrevented = returnTrue;
        };
        args.stopPropagation = function () {
          args.isPropagationStopped = returnTrue;
        };
        args.stopImmediatePropagation = function () {
          args.isImmediatePropagationStopped = returnTrue;
        };
        args.isDefaultPrevented = returnFalse;
        args.isPropagationStopped = returnFalse;
        args.isImmediatePropagationStopped = returnFalse;
      }
      if (settings.beforeFire) {
        settings.beforeFire(args);
      }
      handlers = bindings[name];
      if (handlers) {
        for (i = 0, l = handlers.length; i < l; i++) {
          callback = handlers[i];
          if (callback.once) {
            off(name, callback.func);
          }
          if (args.isImmediatePropagationStopped()) {
            args.stopPropagation();
            return args;
          }
          if (callback.func.call(scope, args) === false) {
            args.preventDefault();
            return args;
          }
        }
      }
      return args;
    };
    var on = function (name, callback, prepend, extra) {
      var handlers, names, i;
      if (callback === false) {
        callback = returnFalse;
      }
      if (callback) {
        callback = { func: callback };
        if (extra) {
          $_b8tc32jjc7tm6qi.extend(callback, extra);
        }
        names = name.toLowerCase().split(' ');
        i = names.length;
        while (i--) {
          name = names[i];
          handlers = bindings[name];
          if (!handlers) {
            handlers = bindings[name] = [];
            toggleEvent(name, true);
          }
          if (prepend) {
            handlers.unshift(callback);
          } else {
            handlers.push(callback);
          }
        }
      }
      return self;
    };
    var off = function (name, callback) {
      var i, handlers, bindingName, names, hi;
      if (name) {
        names = name.toLowerCase().split(' ');
        i = names.length;
        while (i--) {
          name = names[i];
          handlers = bindings[name];
          if (!name) {
            for (bindingName in bindings) {
              toggleEvent(bindingName, false);
              delete bindings[bindingName];
            }
            return self;
          }
          if (handlers) {
            if (!callback) {
              handlers.length = 0;
            } else {
              hi = handlers.length;
              while (hi--) {
                if (handlers[hi].func === callback) {
                  handlers = handlers.slice(0, hi).concat(handlers.slice(hi + 1));
                  bindings[name] = handlers;
                }
              }
            }
            if (!handlers.length) {
              toggleEvent(name, false);
              delete bindings[name];
            }
          }
        }
      } else {
        for (name in bindings) {
          toggleEvent(name, false);
        }
        bindings = {};
      }
      return self;
    };
    var once = function (name, callback, prepend) {
      return on(name, callback, prepend, { once: true });
    };
    var has = function (name) {
      name = name.toLowerCase();
      return !(!bindings[name] || bindings[name].length === 0);
    };
    self.fire = fire;
    self.on = on;
    self.off = off;
    self.once = once;
    self.has = has;
  };
  Dispatcher.isNative = function (name) {
    return !!nativeEvents[name.toLowerCase()];
  };

  var getEventDispatcher = function (obj) {
    if (!obj._eventDispatcher) {
      obj._eventDispatcher = new Dispatcher({
        scope: obj,
        toggleEvent: function (name, state) {
          if (Dispatcher.isNative(name) && obj.toggleNativeEvent) {
            obj.toggleNativeEvent(name, state);
          }
        }
      });
    }
    return obj._eventDispatcher;
  };
  var $_4pdx2z3yjc7tm7py = {
    fire: function (name, args, bubble) {
      var self = this;
      if (self.removed && name !== 'remove') {
        return args;
      }
      args = getEventDispatcher(self).fire(name, args, bubble);
      if (bubble !== false && self.parent) {
        var parent = self.parent();
        while (parent && !args.isPropagationStopped()) {
          parent.fire(name, args, false);
          parent = parent.parent();
        }
      }
      return args;
    },
    on: function (name, callback, prepend) {
      return getEventDispatcher(this).on(name, callback, prepend);
    },
    off: function (name, callback) {
      return getEventDispatcher(this).off(name, callback);
    },
    once: function (name, callback) {
      return getEventDispatcher(this).once(name, callback);
    },
    hasEventListeners: function (name) {
      return getEventDispatcher(this).has(name);
    }
  };

  var DOM$2 = DOMUtils.DOM;
  var customEventRootDelegates;
  var getEventTarget = function (editor, eventName) {
    if (eventName == 'selectionchange') {
      return editor.getDoc();
    }
    if (!editor.inline && /^mouse|touch|click|contextmenu|drop|dragover|dragend/.test(eventName)) {
      return editor.getDoc().documentElement;
    }
    if (editor.settings.event_root) {
      if (!editor.eventRoot) {
        editor.eventRoot = DOM$2.select(editor.settings.event_root)[0];
      }
      return editor.eventRoot;
    }
    return editor.getBody();
  };
  var bindEventDelegate = function (editor, eventName) {
    var eventRootElm, delegate;
    var isListening = function (editor) {
      return !editor.hidden && !editor.readonly;
    };
    if (!editor.delegates) {
      editor.delegates = {};
    }
    if (editor.delegates[eventName] || editor.removed) {
      return;
    }
    eventRootElm = getEventTarget(editor, eventName);
    if (editor.settings.event_root) {
      if (!customEventRootDelegates) {
        customEventRootDelegates = {};
        editor.editorManager.on('removeEditor', function () {
          var name;
          if (!editor.editorManager.activeEditor) {
            if (customEventRootDelegates) {
              for (name in customEventRootDelegates) {
                editor.dom.unbind(getEventTarget(editor, name));
              }
              customEventRootDelegates = null;
            }
          }
        });
      }
      if (customEventRootDelegates[eventName]) {
        return;
      }
      delegate = function (e) {
        var target = e.target, editors = editor.editorManager.get(), i = editors.length;
        while (i--) {
          var body = editors[i].getBody();
          if (body === target || DOM$2.isChildOf(target, body)) {
            if (isListening(editors[i])) {
              editors[i].fire(eventName, e);
            }
          }
        }
      };
      customEventRootDelegates[eventName] = delegate;
      DOM$2.bind(eventRootElm, eventName, delegate);
    } else {
      delegate = function (e) {
        if (isListening(editor)) {
          editor.fire(eventName, e);
        }
      };
      DOM$2.bind(eventRootElm, eventName, delegate);
      editor.delegates[eventName] = delegate;
    }
  };
  var EditorObservable = {
    bindPendingEventDelegates: function () {
      var self = this;
      $_b8tc32jjc7tm6qi.each(self._pendingNativeEvents, function (name) {
        bindEventDelegate(self, name);
      });
    },
    toggleNativeEvent: function (name, state) {
      var self = this;
      if (name == 'focus' || name == 'blur') {
        return;
      }
      if (state) {
        if (self.initialized) {
          bindEventDelegate(self, name);
        } else {
          if (!self._pendingNativeEvents) {
            self._pendingNativeEvents = [name];
          } else {
            self._pendingNativeEvents.push(name);
          }
        }
      } else if (self.initialized) {
        self.dom.unbind(getEventTarget(self, name), name, self.delegates[name]);
        delete self.delegates[name];
      }
    },
    unbindAllNativeEvents: function () {
      var self = this, name;
      if (self.delegates) {
        for (name in self.delegates) {
          self.dom.unbind(getEventTarget(self, name), name, self.delegates[name]);
        }
        delete self.delegates;
      }
      if (!self.inline) {
        self.getBody().onload = null;
        self.dom.unbind(self.getWin());
        self.dom.unbind(self.getDoc());
      }
      self.dom.unbind(self.getBody());
      self.dom.unbind(self.getContainer());
    }
  };
  EditorObservable = $_b8tc32jjc7tm6qi.extend({}, $_4pdx2z3yjc7tm7py, EditorObservable);
  var EditorObservable$1 = EditorObservable;

  var setEditorCommandState = function (editor, cmd, state) {
    try {
      editor.getDoc().execCommand(cmd, false, state);
    } catch (ex) {
    }
  };
  var clickBlocker = function (editor) {
    var target, handler;
    target = editor.getBody();
    handler = function (e) {
      if (editor.dom.getParents(e.target, 'a').length > 0) {
        e.preventDefault();
      }
    };
    editor.dom.bind(target, 'click', handler);
    return {
      unbind: function () {
        editor.dom.unbind(target, 'click', handler);
      }
    };
  };
  var toggleReadOnly = function (editor, state) {
    if (editor._clickBlocker) {
      editor._clickBlocker.unbind();
      editor._clickBlocker = null;
    }
    if (state) {
      editor._clickBlocker = clickBlocker(editor);
      editor.selection.controlSelection.hideResizeRect();
      editor.readonly = true;
      editor.getBody().contentEditable = false;
    } else {
      editor.readonly = false;
      editor.getBody().contentEditable = true;
      setEditorCommandState(editor, 'StyleWithCSS', false);
      setEditorCommandState(editor, 'enableInlineTableEditing', false);
      setEditorCommandState(editor, 'enableObjectResizing', false);
      editor.focus();
      editor.nodeChanged();
    }
  };
  var setMode = function (editor, mode) {
    var currentMode = editor.readonly ? 'readonly' : 'design';
    if (mode == currentMode) {
      return;
    }
    if (editor.initialized) {
      toggleReadOnly(editor, mode == 'readonly');
    } else {
      editor.on('init', function () {
        toggleReadOnly(editor, mode == 'readonly');
      });
    }
    editor.fire('SwitchMode', { mode: mode });
  };
  var $_4sookl40jc7tm7q8 = { setMode: setMode };

  var each$11 = $_b8tc32jjc7tm6qi.each;
  var explode$3 = $_b8tc32jjc7tm6qi.explode;
  var keyCodeLookup = {
    'f9': 120,
    'f10': 121,
    'f11': 122
  };
  var modifierNames = $_b8tc32jjc7tm6qi.makeMap('alt,ctrl,shift,meta,access');
  var Shortcuts = function (editor) {
    var self = this, shortcuts = {}, pendingPatterns = [];
    var parseShortcut = function (pattern) {
      var id, key, shortcut = {};
      each$11(explode$3(pattern, '+'), function (value) {
        if (value in modifierNames) {
          shortcut[value] = true;
        } else {
          if (/^[0-9]{2,}$/.test(value)) {
            shortcut.keyCode = parseInt(value, 10);
          } else {
            shortcut.charCode = value.charCodeAt(0);
            shortcut.keyCode = keyCodeLookup[value] || value.toUpperCase().charCodeAt(0);
          }
        }
      });
      id = [shortcut.keyCode];
      for (key in modifierNames) {
        if (shortcut[key]) {
          id.push(key);
        } else {
          shortcut[key] = false;
        }
      }
      shortcut.id = id.join(',');
      if (shortcut.access) {
        shortcut.alt = true;
        if ($_dtgtsy9jc7tm6gs.mac) {
          shortcut.ctrl = true;
        } else {
          shortcut.shift = true;
        }
      }
      if (shortcut.meta) {
        if ($_dtgtsy9jc7tm6gs.mac) {
          shortcut.meta = true;
        } else {
          shortcut.ctrl = true;
          shortcut.meta = false;
        }
      }
      return shortcut;
    };
    var createShortcut = function (pattern, desc, cmdFunc, scope) {
      var shortcuts;
      shortcuts = $_b8tc32jjc7tm6qi.map(explode$3(pattern, '>'), parseShortcut);
      shortcuts[shortcuts.length - 1] = $_b8tc32jjc7tm6qi.extend(shortcuts[shortcuts.length - 1], {
        func: cmdFunc,
        scope: scope || editor
      });
      return $_b8tc32jjc7tm6qi.extend(shortcuts[0], {
        desc: editor.translate(desc),
        subpatterns: shortcuts.slice(1)
      });
    };
    var hasModifier = function (e) {
      return e.altKey || e.ctrlKey || e.metaKey;
    };
    var isFunctionKey = function (e) {
      return e.type === 'keydown' && e.keyCode >= 112 && e.keyCode <= 123;
    };
    var matchShortcut = function (e, shortcut) {
      if (!shortcut) {
        return false;
      }
      if (shortcut.ctrl != e.ctrlKey || shortcut.meta != e.metaKey) {
        return false;
      }
      if (shortcut.alt != e.altKey || shortcut.shift != e.shiftKey) {
        return false;
      }
      if (e.keyCode == shortcut.keyCode || e.charCode && e.charCode == shortcut.charCode) {
        e.preventDefault();
        return true;
      }
      return false;
    };
    var executeShortcutAction = function (shortcut) {
      return shortcut.func ? shortcut.func.call(shortcut.scope) : null;
    };
    editor.on('keyup keypress keydown', function (e) {
      if ((hasModifier(e) || isFunctionKey(e)) && !e.isDefaultPrevented()) {
        each$11(shortcuts, function (shortcut) {
          if (matchShortcut(e, shortcut)) {
            pendingPatterns = shortcut.subpatterns.slice(0);
            if (e.type == 'keydown') {
              executeShortcutAction(shortcut);
            }
            return true;
          }
        });
        if (matchShortcut(e, pendingPatterns[0])) {
          if (pendingPatterns.length === 1) {
            if (e.type == 'keydown') {
              executeShortcutAction(pendingPatterns[0]);
            }
          }
          pendingPatterns.shift();
        }
      }
    });
    self.add = function (pattern, desc, cmdFunc, scope) {
      var cmd;
      cmd = cmdFunc;
      if (typeof cmdFunc === 'string') {
        cmdFunc = function () {
          editor.execCommand(cmd, false, null);
        };
      } else if ($_b8tc32jjc7tm6qi.isArray(cmd)) {
        cmdFunc = function () {
          editor.execCommand(cmd[0], cmd[1], cmd[2]);
        };
      }
      each$11(explode$3($_b8tc32jjc7tm6qi.trim(pattern.toLowerCase())), function (pattern) {
        var shortcut = createShortcut(pattern, desc, cmdFunc, scope);
        shortcuts[shortcut.id] = shortcut;
      });
      return true;
    };
    self.remove = function (pattern) {
      var shortcut = createShortcut(pattern);
      if (shortcuts[shortcut.id]) {
        delete shortcuts[shortcut.id];
        return true;
      }
      return false;
    };
  };

  var each$12 = $_b8tc32jjc7tm6qi.each;
  var isValidPrefixAttrName = function (name) {
    return name.indexOf('data-') === 0 || name.indexOf('aria-') === 0;
  };
  var trimComments = function (text) {
    return text.replace(/<!--|-->/g, '');
  };
  var findEndTag = function (schema, html, startIndex) {
    var count = 1, index, matches, tokenRegExp, shortEndedElements;
    shortEndedElements = schema.getShortEndedElements();
    tokenRegExp = /<([!?\/])?([A-Za-z0-9\-_\:\.]+)((?:\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\/|\s+)>/g;
    tokenRegExp.lastIndex = index = startIndex;
    while (matches = tokenRegExp.exec(html)) {
      index = tokenRegExp.lastIndex;
      if (matches[1] === '/') {
        count--;
      } else if (!matches[1]) {
        if (matches[2] in shortEndedElements) {
          continue;
        }
        count++;
      }
      if (count === 0) {
        break;
      }
    }
    return index;
  };
  var SaxParser = function (settings, schema) {
    var self = this;
    var noop = function () {
    };
    settings = settings || {};
    self.schema = schema = schema || Schema();
    if (settings.fix_self_closing !== false) {
      settings.fix_self_closing = true;
    }
    each$12('comment cdata text start end pi doctype'.split(' '), function (name) {
      if (name) {
        self[name] = settings[name] || noop;
      }
    });
    self.parse = function (html) {
      var self = this, matches, index = 0, value, endRegExp, stack = [], attrList, i, text, name;
      var isInternalElement, removeInternalElements, shortEndedElements, fillAttrsMap, isShortEnded;
      var validate, elementRule, isValidElement, attr, attribsValue, validAttributesMap, validAttributePatterns;
      var attributesRequired, attributesDefault, attributesForced, processHtml;
      var anyAttributesRequired, selfClosing, tokenRegExp, attrRegExp, specialElements, attrValue, idCount = 0;
      var decode = Entities.decode, fixSelfClosing, filteredUrlAttrs = $_b8tc32jjc7tm6qi.makeMap('src,href,data,background,formaction,poster');
      var scriptUriRegExp = /((java|vb)script|mhtml):/i, dataUriRegExp = /^data:/i;
      var processEndTag = function (name) {
        var pos, i;
        pos = stack.length;
        while (pos--) {
          if (stack[pos].name === name) {
            break;
          }
        }
        if (pos >= 0) {
          for (i = stack.length - 1; i >= pos; i--) {
            name = stack[i];
            if (name.valid) {
              self.end(name.name);
            }
          }
          stack.length = pos;
        }
      };
      var parseAttribute = function (match, name, value, val2, val3) {
        var attrRule, i, trimRegExp = /[\s\u0000-\u001F]+/g;
        name = name.toLowerCase();
        value = name in fillAttrsMap ? name : decode(value || val2 || val3 || '');
        if (validate && !isInternalElement && isValidPrefixAttrName(name) === false) {
          attrRule = validAttributesMap[name];
          if (!attrRule && validAttributePatterns) {
            i = validAttributePatterns.length;
            while (i--) {
              attrRule = validAttributePatterns[i];
              if (attrRule.pattern.test(name)) {
                break;
              }
            }
            if (i === -1) {
              attrRule = null;
            }
          }
          if (!attrRule) {
            return;
          }
          if (attrRule.validValues && !(value in attrRule.validValues)) {
            return;
          }
        }
        if (filteredUrlAttrs[name] && !settings.allow_script_urls) {
          var uri = value.replace(trimRegExp, '');
          try {
            uri = decodeURIComponent(uri);
          } catch (ex) {
            uri = unescape(uri);
          }
          if (scriptUriRegExp.test(uri)) {
            return;
          }
          if (!settings.allow_html_data_urls && dataUriRegExp.test(uri) && !/^data:image\//i.test(uri)) {
            return;
          }
        }
        if (isInternalElement && (name in filteredUrlAttrs || name.indexOf('on') === 0)) {
          return;
        }
        attrList.map[name] = value;
        attrList.push({
          name: name,
          value: value
        });
      };
      tokenRegExp = new RegExp('<(?:' + '(?:!--([\\w\\W]*?)-->)|' + '(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + '(?:!DOCTYPE([\\w\\W]*?)>)|' + '(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + '(?:\\/([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)>)|' + '(?:([A-Za-z][A-Za-z0-9\\-_\\:\\.]*)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' + ')', 'g');
      attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g;
      shortEndedElements = schema.getShortEndedElements();
      selfClosing = settings.self_closing_elements || schema.getSelfClosingElements();
      fillAttrsMap = schema.getBoolAttrs();
      validate = settings.validate;
      removeInternalElements = settings.remove_internals;
      fixSelfClosing = settings.fix_self_closing;
      specialElements = schema.getSpecialElements();
      processHtml = html + '>';
      while (matches = tokenRegExp.exec(processHtml)) {
        if (index < matches.index) {
          self.text(decode(html.substr(index, matches.index - index)));
        }
        if (value = matches[6]) {
          value = value.toLowerCase();
          if (value.charAt(0) === ':') {
            value = value.substr(1);
          }
          processEndTag(value);
        } else if (value = matches[7]) {
          if (matches.index + matches[0].length > html.length) {
            self.text(decode(html.substr(matches.index)));
            index = matches.index + matches[0].length;
            continue;
          }
          value = value.toLowerCase();
          if (value.charAt(0) === ':') {
            value = value.substr(1);
          }
          isShortEnded = value in shortEndedElements;
          if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value) {
            processEndTag(value);
          }
          if (!validate || (elementRule = schema.getElementRule(value))) {
            isValidElement = true;
            if (validate) {
              validAttributesMap = elementRule.attributes;
              validAttributePatterns = elementRule.attributePatterns;
            }
            if (attribsValue = matches[8]) {
              isInternalElement = attribsValue.indexOf('data-mce-type') !== -1;
              if (isInternalElement && removeInternalElements) {
                isValidElement = false;
              }
              attrList = [];
              attrList.map = {};
              attribsValue.replace(attrRegExp, parseAttribute);
            } else {
              attrList = [];
              attrList.map = {};
            }
            if (validate && !isInternalElement) {
              attributesRequired = elementRule.attributesRequired;
              attributesDefault = elementRule.attributesDefault;
              attributesForced = elementRule.attributesForced;
              anyAttributesRequired = elementRule.removeEmptyAttrs;
              if (anyAttributesRequired && !attrList.length) {
                isValidElement = false;
              }
              if (attributesForced) {
                i = attributesForced.length;
                while (i--) {
                  attr = attributesForced[i];
                  name = attr.name;
                  attrValue = attr.value;
                  if (attrValue === '{$uid}') {
                    attrValue = 'mce_' + idCount++;
                  }
                  attrList.map[name] = attrValue;
                  attrList.push({
                    name: name,
                    value: attrValue
                  });
                }
              }
              if (attributesDefault) {
                i = attributesDefault.length;
                while (i--) {
                  attr = attributesDefault[i];
                  name = attr.name;
                  if (!(name in attrList.map)) {
                    attrValue = attr.value;
                    if (attrValue === '{$uid}') {
                      attrValue = 'mce_' + idCount++;
                    }
                    attrList.map[name] = attrValue;
                    attrList.push({
                      name: name,
                      value: attrValue
                    });
                  }
                }
              }
              if (attributesRequired) {
                i = attributesRequired.length;
                while (i--) {
                  if (attributesRequired[i] in attrList.map) {
                    break;
                  }
                }
                if (i === -1) {
                  isValidElement = false;
                }
              }
              if (attr = attrList.map['data-mce-bogus']) {
                if (attr === 'all') {
                  index = findEndTag(schema, html, tokenRegExp.lastIndex);
                  tokenRegExp.lastIndex = index;
                  continue;
                }
                isValidElement = false;
              }
            }
            if (isValidElement) {
              self.start(value, attrList, isShortEnded);
            }
          } else {
            isValidElement = false;
          }
          if (endRegExp = specialElements[value]) {
            endRegExp.lastIndex = index = matches.index + matches[0].length;
            if (matches = endRegExp.exec(html)) {
              if (isValidElement) {
                text = html.substr(index, matches.index - index);
              }
              index = matches.index + matches[0].length;
            } else {
              text = html.substr(index);
              index = html.length;
            }
            if (isValidElement) {
              if (text.length > 0) {
                self.text(text, true);
              }
              self.end(value);
            }
            tokenRegExp.lastIndex = index;
            continue;
          }
          if (!isShortEnded) {
            if (!attribsValue || attribsValue.indexOf('/') != attribsValue.length - 1) {
              stack.push({
                name: value,
                valid: isValidElement
              });
            } else if (isValidElement) {
              self.end(value);
            }
          }
        } else if (value = matches[1]) {
          if (value.charAt(0) === '>') {
            value = ' ' + value;
          }
          if (!settings.allow_conditional_comments && value.substr(0, 3).toLowerCase() === '[if') {
            value = ' ' + value;
          }
          self.comment(value);
        } else if (value = matches[2]) {
          self.cdata(trimComments(value));
        } else if (value = matches[3]) {
          self.doctype(value);
        } else if (value = matches[4]) {
          self.pi(value, matches[5]);
        }
        index = matches.index + matches[0].length;
      }
      if (index < html.length) {
        self.text(decode(html.substr(index)));
      }
      for (i = stack.length - 1; i >= 0; i--) {
        value = stack[i];
        if (value.valid) {
          self.end(value.name);
        }
      }
    };
  };
  SaxParser.findEndTag = findEndTag;

  var trimHtml = function (tempAttrs, html) {
    var trimContentRegExp = new RegExp(['\\s?(' + tempAttrs.join('|') + ')="[^"]+"'].join('|'), 'gi');
    return html.replace(trimContentRegExp, '');
  };
  var trimInternal = function (serializer, html) {
    var content = html;
    var bogusAllRegExp = /<(\w+) [^>]*data-mce-bogus="all"[^>]*>/g;
    var endTagIndex, index, matchLength, matches, shortEndedElements;
    var schema = serializer.schema;
    content = trimHtml(serializer.getTempAttrs(), content);
    shortEndedElements = schema.getShortEndedElements();
    while (matches = bogusAllRegExp.exec(content)) {
      index = bogusAllRegExp.lastIndex;
      matchLength = matches[0].length;
      if (shortEndedElements[matches[1]]) {
        endTagIndex = index;
      } else {
        endTagIndex = SaxParser.findEndTag(schema, content, index);
      }
      content = content.substring(0, index - matchLength) + content.substring(endTagIndex);
      bogusAllRegExp.lastIndex = index - matchLength;
    }
    return content;
  };
  var trimExternal = function (serializer, html) {
    return $_55zd6d21jc7tm765.trim(trimInternal(serializer, html));
  };
  var $_fneq5042jc7tm7qk = {
    trimExternal: trimExternal,
    trimInternal: trimInternal
  };

  var any$1 = function (predicate) {
    return $_agx7022ujc7tm7f1.first(predicate).isSome();
  };
  var ancestor$3 = function (scope, predicate, isRoot) {
    return $_agx7022ujc7tm7f1.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest$3 = function (scope, predicate, isRoot) {
    return $_agx7022ujc7tm7f1.closest(scope, predicate, isRoot).isSome();
  };
  var sibling$4 = function (scope, predicate) {
    return $_agx7022ujc7tm7f1.sibling(scope, predicate).isSome();
  };
  var child$4 = function (scope, predicate) {
    return $_agx7022ujc7tm7f1.child(scope, predicate).isSome();
  };
  var descendant$3 = function (scope, predicate) {
    return $_agx7022ujc7tm7f1.descendant(scope, predicate).isSome();
  };
  var $_8g76qu46jc7tm7rt = {
    any: any$1,
    ancestor: ancestor$3,
    closest: closest$3,
    sibling: sibling$4,
    child: child$4,
    descendant: descendant$3
  };

  var focus$1 = function (element) {
    element.dom().focus();
  };
  var blur = function (element) {
    element.dom().blur();
  };
  var hasFocus$1 = function (element) {
    var doc = $_15fekq17jc7tm6wo.owner(element).dom();
    return element.dom() === doc.activeElement;
  };
  var active = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    return $_e5uurj5jc7tm6bt.from(doc.activeElement).map($_bscr39yjc7tm6uo.fromDom);
  };
  var focusInside = function (element) {
    var doc = $_15fekq17jc7tm6wo.owner(element);
    var inside = active(doc).filter(function (a) {
      return $_8g76qu46jc7tm7rt.closest(a, $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, element));
    });
    inside.fold(function () {
      focus$1(element);
    }, $_f41mrx6jc7tm6cd.noop);
  };
  var search = function (element) {
    return active($_15fekq17jc7tm6wo.owner(element)).filter(function (e) {
      return element.dom().contains(e.dom());
    });
  };
  var $_1x6tu945jc7tm7rl = {
    hasFocus: hasFocus$1,
    focus: focus$1,
    blur: blur,
    active: active,
    search: search,
    focusInside: focusInside
  };

  var getContentEditableHost = function (editor, node) {
    return editor.dom.getParent(node, function (node) {
      return editor.dom.getContentEditable(node) === 'true';
    });
  };
  var getCollapsedNode = function (rng) {
    return rng.collapsed ? $_e5uurj5jc7tm6bt.from($_4yp5rq23jc7tm76g.getNode(rng.startContainer, rng.startOffset)).map($_bscr39yjc7tm6uo.fromDom) : $_e5uurj5jc7tm6bt.none();
  };
  var getFocusInElement = function (root, rng) {
    return getCollapsedNode(rng).bind(function (node) {
      if ($_8zplag1pjc7tm70h.isTableSection(node)) {
        return $_e5uurj5jc7tm6bt.some(node);
      } else if ($_b0e3uw1djc7tm6y8.contains(root, node) === false) {
        return $_e5uurj5jc7tm6bt.some(root);
      } else {
        return $_e5uurj5jc7tm6bt.none();
      }
    });
  };
  var normalizeSelection = function (editor, rng) {
    getFocusInElement($_bscr39yjc7tm6uo.fromDom(editor.getBody()), rng).bind(function (elm) {
      return $_d2dq9h2pjc7tm7c9.firstPositionIn(elm.dom());
    }).fold(function () {
      editor.selection.normalize();
    }, function (caretPos) {
      editor.selection.setRng(caretPos.toRange());
    });
  };
  var focusBody = function (body) {
    if (body.setActive) {
      try {
        body.setActive();
      } catch (ex) {
        body.focus();
      }
    } else {
      body.focus();
    }
  };
  var hasElementFocus = function (elm) {
    return $_1x6tu945jc7tm7rl.hasFocus(elm) || $_1x6tu945jc7tm7rl.search(elm).isSome();
  };
  var hasIframeFocus = function (editor) {
    return editor.iframeElement && $_1x6tu945jc7tm7rl.hasFocus($_bscr39yjc7tm6uo.fromDom(editor.iframeElement));
  };
  var hasInlineFocus = function (editor) {
    var rawBody = editor.getBody();
    return rawBody && hasElementFocus($_bscr39yjc7tm6uo.fromDom(rawBody));
  };
  var hasFocus = function (editor) {
    return editor.inline ? hasInlineFocus(editor) : hasIframeFocus(editor);
  };
  var focusEditor = function (editor) {
    var selection = editor.selection, contentEditable = editor.settings.content_editable;
    var body = editor.getBody(), contentEditableHost, rng = selection.getRng();
    editor.quirks.refreshContentEditable();
    contentEditableHost = getContentEditableHost(editor, selection.getNode());
    if (editor.$.contains(body, contentEditableHost)) {
      focusBody(contentEditableHost);
      normalizeSelection(editor, rng);
      activateEditor(editor);
      return;
    }
    if (editor.bookmark !== undefined && hasFocus(editor) === false) {
      $_5o1m7s3ujc7tm7p1.getRng(editor).each(function (bookmarkRng) {
        editor.selection.setRng(bookmarkRng);
        rng = bookmarkRng;
      });
    }
    if (!contentEditable) {
      if (!$_dtgtsy9jc7tm6gs.opera) {
        focusBody(body);
      }
      editor.getWin().focus();
    }
    if ($_dtgtsy9jc7tm6gs.gecko || contentEditable) {
      focusBody(body);
      normalizeSelection(editor, rng);
    }
    activateEditor(editor);
  };
  var activateEditor = function (editor) {
    editor.editorManager.setActive(editor);
  };
  var focus = function (editor, skipFocus) {
    if (editor.removed) {
      return;
    }
    skipFocus ? activateEditor(editor) : focusEditor(editor);
  };
  var $_9dadsv44jc7tm7rb = {
    focus: focus,
    hasFocus: hasFocus
  };

  var getProp = function (propName, elm) {
    var rawElm = elm.dom();
    return rawElm[propName];
  };
  var getComputedSizeProp = function (propName, elm) {
    return parseInt($_c8wsbp11jc7tm6va.get(elm, propName), 10);
  };
  var getClientWidth = $_f41mrx6jc7tm6cd.curry(getProp, 'clientWidth');
  var getClientHeight = $_f41mrx6jc7tm6cd.curry(getProp, 'clientHeight');
  var getMarginTop = $_f41mrx6jc7tm6cd.curry(getComputedSizeProp, 'margin-top');
  var getMarginLeft = $_f41mrx6jc7tm6cd.curry(getComputedSizeProp, 'margin-left');
  var getBoundingClientRect = function (elm) {
    return elm.dom().getBoundingClientRect();
  };
  var isInsideElementContentArea = function (bodyElm, clientX, clientY) {
    var clientWidth = getClientWidth(bodyElm);
    var clientHeight = getClientHeight(bodyElm);
    return clientX >= 0 && clientY >= 0 && clientX <= clientWidth && clientY <= clientHeight;
  };
  var transpose = function (inline, elm, clientX, clientY) {
    var clientRect = getBoundingClientRect(elm);
    var deltaX = inline ? clientRect.left + elm.dom().clientLeft + getMarginLeft(elm) : 0;
    var deltaY = inline ? clientRect.top + elm.dom().clientTop + getMarginTop(elm) : 0;
    var x = clientX - deltaX;
    var y = clientY - deltaY;
    return {
      x: x,
      y: y
    };
  };
  var isXYInContentArea = function (editor, clientX, clientY) {
    var bodyElm = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    var targetElm = editor.inline ? bodyElm : $_15fekq17jc7tm6wo.documentElement(bodyElm);
    var transposedPoint = transpose(editor.inline, targetElm, clientX, clientY);
    return isInsideElementContentArea(targetElm, transposedPoint.x, transposedPoint.y);
  };
  var fromDomSafe = function (node) {
    return $_e5uurj5jc7tm6bt.from(node).map($_bscr39yjc7tm6uo.fromDom);
  };
  var isEditorAttachedToDom = function (editor) {
    var rawContainer = editor.inline ? editor.getBody() : editor.getContentAreaContainer();
    return fromDomSafe(rawContainer).map(function (container) {
      return $_b0e3uw1djc7tm6y8.contains($_15fekq17jc7tm6wo.owner(container), container);
    }).getOr(false);
  };
  var $_1f157949jc7tm7sb = {
    isXYInContentArea: isXYInContentArea,
    isEditorAttachedToDom: isEditorAttachedToDom
  };

  var NotificationManagerImpl = function () {
    var unimplemented = function () {
      throw new Error('Theme did not provide a NotificationManager implementation.');
    };
    return {
      open: unimplemented,
      close: unimplemented,
      reposition: unimplemented,
      getArgs: unimplemented
    };
  };

  var NotificationManager = function (editor) {
    var notifications = [];
    var getImplementation = function () {
      var theme = editor.theme;
      return theme && theme.getNotificationManagerImpl ? theme.getNotificationManagerImpl() : NotificationManagerImpl();
    };
    var getTopNotification = function () {
      return $_e5uurj5jc7tm6bt.from(notifications[0]);
    };
    var isEqual = function (a, b) {
      return a.type === b.type && a.text === b.text && !a.progressBar && !a.timeout && !b.progressBar && !b.timeout;
    };
    var reposition = function () {
      if (notifications.length > 0) {
        getImplementation().reposition(notifications);
      }
    };
    var addNotification = function (notification) {
      notifications.push(notification);
    };
    var closeNotification = function (notification) {
      $_20yqgb4jc7tm6aj.findIndex(notifications, function (otherNotification) {
        return otherNotification === notification;
      }).each(function (index) {
        notifications.splice(index, 1);
      });
    };
    var open = function (args) {
      if (editor.removed || !$_1f157949jc7tm7sb.isEditorAttachedToDom(editor)) {
        return;
      }
      return $_20yqgb4jc7tm6aj.find(notifications, function (notification) {
        return isEqual(getImplementation().getArgs(notification), args);
      }).getOrThunk(function () {
        editor.editorManager.setActive(editor);
        var notification = getImplementation().open(args, function () {
          closeNotification(notification);
          reposition();
        });
        addNotification(notification);
        reposition();
        return notification;
      });
    };
    var close = function () {
      getTopNotification().each(function (notification) {
        getImplementation().close(notification);
        closeNotification(notification);
        reposition();
      });
    };
    var getNotifications = function () {
      return notifications;
    };
    var registerEvents = function (editor) {
      editor.on('SkinLoaded', function () {
        var serviceMessage = editor.settings.service_message;
        if (serviceMessage) {
          open({
            text: serviceMessage,
            type: 'warning',
            timeout: 0,
            icon: ''
          });
        }
      });
      editor.on('ResizeEditor ResizeWindow', function () {
        $_9jpiwcgjc7tm6kr.requestAnimationFrame(reposition);
      });
      editor.on('remove', function () {
        $_20yqgb4jc7tm6aj.each(notifications, function (notification) {
          getImplementation().close(notification);
        });
      });
    };
    registerEvents(editor);
    return {
      open: open,
      close: close,
      getNotifications: getNotifications
    };
  };

  var WindowManagerImpl = function () {
    var unimplemented = function () {
      throw new Error('Theme did not provide a WindowManager implementation.');
    };
    return {
      open: unimplemented,
      alert: unimplemented,
      confirm: unimplemented,
      close: unimplemented,
      getParams: unimplemented,
      setParams: unimplemented
    };
  };

  var WindowManager = function (editor) {
    var windows = [];
    var getImplementation = function () {
      var theme = editor.theme;
      return theme && theme.getWindowManagerImpl ? theme.getWindowManagerImpl() : WindowManagerImpl();
    };
    var funcBind = function (scope, f) {
      return function () {
        return f ? f.apply(scope, arguments) : undefined;
      };
    };
    var fireOpenEvent = function (win) {
      editor.fire('OpenWindow', { win: win });
    };
    var fireCloseEvent = function (win) {
      editor.fire('CloseWindow', { win: win });
    };
    var addWindow = function (win) {
      windows.push(win);
      fireOpenEvent(win);
    };
    var closeWindow = function (win) {
      $_20yqgb4jc7tm6aj.findIndex(windows, function (otherWindow) {
        return otherWindow === win;
      }).each(function (index) {
        windows.splice(index, 1);
        fireCloseEvent(win);
        if (windows.length === 0) {
          editor.focus();
        }
      });
    };
    var getTopWindow = function () {
      return $_e5uurj5jc7tm6bt.from(windows[windows.length - 1]);
    };
    var open = function (args, params) {
      editor.editorManager.setActive(editor);
      $_5o1m7s3ujc7tm7p1.store(editor);
      var win = getImplementation().open(args, params, closeWindow);
      addWindow(win);
      return win;
    };
    var alert = function (message, callback, scope) {
      var win = getImplementation().alert(message, funcBind(scope ? scope : this, callback), closeWindow);
      addWindow(win);
    };
    var confirm = function (message, callback, scope) {
      var win = getImplementation().confirm(message, funcBind(scope ? scope : this, callback), closeWindow);
      addWindow(win);
    };
    var close = function () {
      getTopWindow().each(function (win) {
        getImplementation().close(win);
        closeWindow(win);
      });
    };
    var getParams = function () {
      return getTopWindow().map(getImplementation().getParams).getOr(null);
    };
    var setParams = function (params) {
      getTopWindow().each(function (win) {
        getImplementation().setParams(win, params);
      });
    };
    var getWindows = function () {
      return windows;
    };
    editor.on('remove', function () {
      $_20yqgb4jc7tm6aj.each(windows.slice(0), function (win) {
        getImplementation().close(win);
      });
    });
    return {
      windows: windows,
      open: open,
      alert: alert,
      confirm: confirm,
      close: close,
      getParams: getParams,
      setParams: setParams,
      getWindows: getWindows
    };
  };

  var PluginManager = AddOnManager.PluginManager;
  var resolvePluginName = function (targetUrl, suffix) {
    for (var name in PluginManager.urls) {
      var matchUrl = PluginManager.urls[name] + '/plugin' + suffix + '.js';
      if (matchUrl === targetUrl) {
        return name;
      }
    }
    return null;
  };
  var pluginUrlToMessage = function (editor, url) {
    var plugin = resolvePluginName(url, editor.suffix);
    return plugin ? 'Failed to load plugin: ' + plugin + ' from url ' + url : 'Failed to load plugin url: ' + url;
  };
  var displayNotification = function (editor, message) {
    editor.notificationManager.open({
      type: 'error',
      text: message
    });
  };
  var displayError = function (editor, message) {
    if (editor._skinLoaded) {
      displayNotification(editor, message);
    } else {
      editor.on('SkinLoaded', function () {
        displayNotification(editor, message);
      });
    }
  };
  var uploadError = function (editor, message) {
    displayError(editor, 'Failed to upload image: ' + message);
  };
  var pluginLoadError = function (editor, url) {
    displayError(editor, pluginUrlToMessage(editor, url));
  };
  var initError = function (message) {
    var x = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      x[_i - 1] = arguments[_i];
    }
    var console = window.console;
    if (console) {
      if (console.error) {
        console.error.apply(console, arguments);
      } else {
        console.log.apply(console, arguments);
      }
    }
  };
  var $_4z4ogl4djc7tm7t4 = {
    pluginLoadError: pluginLoadError,
    uploadError: uploadError,
    displayError: displayError,
    initError: initError
  };

  var PluginManager$1 = AddOnManager.PluginManager;

  var ThemeManager = AddOnManager.ThemeManager;

  var XMLHttpRequest = function () {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('XMLHttpRequest');
    return new f();
  };

  var Uploader = function (uploadStatus, settings) {
    var pendingPromises = {};
    var pathJoin = function (path1, path2) {
      if (path1) {
        return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
      }
      return path2;
    };
    var defaultHandler = function (blobInfo, success, failure, progress) {
      var xhr, formData;
      xhr = new XMLHttpRequest();
      xhr.open('POST', settings.url);
      xhr.withCredentials = settings.credentials;
      xhr.upload.onprogress = function (e) {
        progress(e.loaded / e.total * 100);
      };
      xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
      };
      xhr.onload = function () {
        var json;
        if (xhr.status < 200 || xhr.status >= 300) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }
        json = JSON.parse(xhr.responseText);
        if (!json || typeof json.location != 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }
        success(pathJoin(settings.basePath, json.location));
      };
      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      xhr.send(formData);
    };
    var noUpload = function () {
      return new promiseObj(function (resolve) {
        resolve([]);
      });
    };
    var handlerSuccess = function (blobInfo, url) {
      return {
        url: url,
        blobInfo: blobInfo,
        status: true
      };
    };
    var handlerFailure = function (blobInfo, error) {
      return {
        url: '',
        blobInfo: blobInfo,
        status: false,
        error: error
      };
    };
    var resolvePending = function (blobUri, result) {
      $_b8tc32jjc7tm6qi.each(pendingPromises[blobUri], function (resolve) {
        resolve(result);
      });
      delete pendingPromises[blobUri];
    };
    var uploadBlobInfo = function (blobInfo, handler, openNotification) {
      uploadStatus.markPending(blobInfo.blobUri());
      return new promiseObj(function (resolve) {
        var notification, progress;
        var noop = function () {
        };
        try {
          var closeNotification = function () {
            if (notification) {
              notification.close();
              progress = noop;
            }
          };
          var success = function (url) {
            closeNotification();
            uploadStatus.markUploaded(blobInfo.blobUri(), url);
            resolvePending(blobInfo.blobUri(), handlerSuccess(blobInfo, url));
            resolve(handlerSuccess(blobInfo, url));
          };
          var failure = function (error) {
            closeNotification();
            uploadStatus.removeFailed(blobInfo.blobUri());
            resolvePending(blobInfo.blobUri(), handlerFailure(blobInfo, error));
            resolve(handlerFailure(blobInfo, error));
          };
          progress = function (percent) {
            if (percent < 0 || percent > 100) {
              return;
            }
            if (!notification) {
              notification = openNotification();
            }
            notification.progressBar.value(percent);
          };
          handler(blobInfo, success, failure, progress);
        } catch (ex) {
          resolve(handlerFailure(blobInfo, ex.message));
        }
      });
    };
    var isDefaultHandler = function (handler) {
      return handler === defaultHandler;
    };
    var pendingUploadBlobInfo = function (blobInfo) {
      var blobUri = blobInfo.blobUri();
      return new promiseObj(function (resolve) {
        pendingPromises[blobUri] = pendingPromises[blobUri] || [];
        pendingPromises[blobUri].push(resolve);
      });
    };
    var uploadBlobs = function (blobInfos, openNotification) {
      blobInfos = $_b8tc32jjc7tm6qi.grep(blobInfos, function (blobInfo) {
        return !uploadStatus.isUploaded(blobInfo.blobUri());
      });
      return promiseObj.all($_b8tc32jjc7tm6qi.map(blobInfos, function (blobInfo) {
        return uploadStatus.isPending(blobInfo.blobUri()) ? pendingUploadBlobInfo(blobInfo) : uploadBlobInfo(blobInfo, settings.handler, openNotification);
      }));
    };
    var upload = function (blobInfos, openNotification) {
      return !settings.url && isDefaultHandler(settings.handler) ? noUpload() : uploadBlobs(blobInfos, openNotification);
    };
    settings = $_b8tc32jjc7tm6qi.extend({
      credentials: false,
      handler: defaultHandler
    }, settings);
    return { upload: upload };
  };

  var Blob = function (parts, properties) {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('Blob');
    return new f(parts, properties);
  };

  var FileReader = function () {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('FileReader');
    return new f();
  };

  var Uint8Array = function (arr) {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('Uint8Array');
    return new f(arr);
  };

  var requestAnimationFrame$1 = function (callback) {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('requestAnimationFrame');
    f(callback);
  };
  var atob = function (base64) {
    var f = $_e2a3j6bjc7tm6hd.getOrDie('atob');
    return f(base64);
  };
  var $_21ohis4qjc7tm7vv = {
    atob: atob,
    requestAnimationFrame: requestAnimationFrame$1
  };

  var blobUriToBlob = function (url) {
    return new promiseObj(function (resolve, reject) {
      var rejectWithError = function () {
        reject('Cannot convert ' + url + ' to Blob. Resource might not exist or is inaccessible.');
      };
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            rejectWithError();
          }
        };
        xhr.onerror = rejectWithError;
        xhr.send();
      } catch (ex) {
        rejectWithError();
      }
    });
  };
  var parseDataUri = function (uri) {
    var type, matches;
    uri = decodeURIComponent(uri).split(',');
    matches = /data:([^;]+)/.exec(uri[0]);
    if (matches) {
      type = matches[1];
    }
    return {
      type: type,
      data: uri[1]
    };
  };
  var dataUriToBlob = function (uri) {
    return new promiseObj(function (resolve) {
      var str, arr, i;
      uri = parseDataUri(uri);
      try {
        str = $_21ohis4qjc7tm7vv.atob(uri.data);
      } catch (e) {
        resolve(new Blob([]));
        return;
      }
      arr = new Uint8Array(str.length);
      for (i = 0; i < arr.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      resolve(new Blob([arr], { type: uri.type }));
    });
  };
  var uriToBlob = function (url) {
    if (url.indexOf('blob:') === 0) {
      return blobUriToBlob(url);
    }
    if (url.indexOf('data:') === 0) {
      return dataUriToBlob(url);
    }
    return null;
  };
  var blobToDataUri = function (blob) {
    return new promiseObj(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };
  var $_5xmvl04mjc7tm7vb = {
    uriToBlob: uriToBlob,
    blobToDataUri: blobToDataUri,
    parseDataUri: parseDataUri
  };

  var count = 0;
  var uniqueId = function (prefix) {
    return (prefix || 'blobid') + count++;
  };
  var imageToBlobInfo = function (blobCache, img, resolve, reject) {
    var base64, blobInfo;
    if (img.src.indexOf('blob:') === 0) {
      blobInfo = blobCache.getByUri(img.src);
      if (blobInfo) {
        resolve({
          image: img,
          blobInfo: blobInfo
        });
      } else {
        $_5xmvl04mjc7tm7vb.uriToBlob(img.src).then(function (blob) {
          $_5xmvl04mjc7tm7vb.blobToDataUri(blob).then(function (dataUri) {
            base64 = $_5xmvl04mjc7tm7vb.parseDataUri(dataUri).data;
            blobInfo = blobCache.create(uniqueId(), blob, base64);
            blobCache.add(blobInfo);
            resolve({
              image: img,
              blobInfo: blobInfo
            });
          });
        }, function (err) {
          reject(err);
        });
      }
      return;
    }
    base64 = $_5xmvl04mjc7tm7vb.parseDataUri(img.src).data;
    blobInfo = blobCache.findFirst(function (cachedBlobInfo) {
      return cachedBlobInfo.base64() === base64;
    });
    if (blobInfo) {
      resolve({
        image: img,
        blobInfo: blobInfo
      });
    } else {
      $_5xmvl04mjc7tm7vb.uriToBlob(img.src).then(function (blob) {
        blobInfo = blobCache.create(uniqueId(), blob, base64);
        blobCache.add(blobInfo);
        resolve({
          image: img,
          blobInfo: blobInfo
        });
      }, function (err) {
        reject(err);
      });
    }
  };
  var getAllImages = function (elm) {
    return elm ? elm.getElementsByTagName('img') : [];
  };
  var ImageScanner = function (uploadStatus, blobCache) {
    var cachedPromises = {};
    var findAll = function (elm, predicate) {
      var images, promises;
      if (!predicate) {
        predicate = $_fy81ys25jc7tm77a.constant(true);
      }
      images = $_gf68zqkjc7tm6r7.filter(getAllImages(elm), function (img) {
        var src = img.src;
        if (!$_dtgtsy9jc7tm6gs.fileApi) {
          return false;
        }
        if (img.hasAttribute('data-mce-bogus')) {
          return false;
        }
        if (img.hasAttribute('data-mce-placeholder')) {
          return false;
        }
        if (!src || src == $_dtgtsy9jc7tm6gs.transparentSrc) {
          return false;
        }
        if (src.indexOf('blob:') === 0) {
          return !uploadStatus.isUploaded(src);
        }
        if (src.indexOf('data:') === 0) {
          return predicate(img);
        }
        return false;
      });
      promises = $_gf68zqkjc7tm6r7.map(images, function (img) {
        var newPromise;
        if (cachedPromises[img.src]) {
          return new promiseObj(function (resolve) {
            cachedPromises[img.src].then(function (imageInfo) {
              if (typeof imageInfo === 'string') {
                return imageInfo;
              }
              resolve({
                image: img,
                blobInfo: imageInfo.blobInfo
              });
            });
          });
        }
        newPromise = new promiseObj(function (resolve, reject) {
          imageToBlobInfo(blobCache, img, resolve, reject);
        }).then(function (result) {
          delete cachedPromises[result.image.src];
          return result;
        })['catch'](function (error) {
          delete cachedPromises[img.src];
          return error;
        });
        cachedPromises[img.src] = newPromise;
        return newPromise;
      });
      return promiseObj.all(promises);
    };
    return { findAll: findAll };
  };

  var count$1 = 0;
  var seed = function () {
    var rnd = function () {
      return Math.round(Math.random() * 4294967295).toString(36);
    };
    var now = new Date().getTime();
    return 's' + now.toString(36) + rnd() + rnd() + rnd();
  };
  var uuid = function (prefix) {
    return prefix + count$1++ + seed();
  };
  var $_5p67zq4sjc7tm7w5 = { uuid: uuid };

  var BlobCache = function () {
    var cache = [], constant = $_fy81ys25jc7tm77a.constant;
    var mimeToExt = function (mime) {
      var mimes = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/png': 'png'
      };
      return mimes[mime.toLowerCase()] || 'dat';
    };
    var create = function (o, blob, base64, filename) {
      return typeof o === 'object' ? toBlobInfo(o) : toBlobInfo({
        id: o,
        name: filename,
        blob: blob,
        base64: base64
      });
    };
    var toBlobInfo = function (o) {
      var id, name;
      if (!o.blob || !o.base64) {
        throw 'blob and base64 representations of the image are required for BlobInfo to be created';
      }
      id = o.id || $_5p67zq4sjc7tm7w5.uuid('blobid');
      name = o.name || id;
      return {
        id: constant(id),
        name: constant(name),
        filename: constant(name + '.' + mimeToExt(o.blob.type)),
        blob: constant(o.blob),
        base64: constant(o.base64),
        blobUri: constant(o.blobUri || $_58egr1ajc7tm6h8.createObjectURL(o.blob)),
        uri: constant(o.uri)
      };
    };
    var add = function (blobInfo) {
      if (!get(blobInfo.id())) {
        cache.push(blobInfo);
      }
    };
    var get = function (id) {
      return findFirst(function (cachedBlobInfo) {
        return cachedBlobInfo.id() === id;
      });
    };
    var findFirst = function (predicate) {
      return $_gf68zqkjc7tm6r7.filter(cache, predicate)[0];
    };
    var getByUri = function (blobUri) {
      return findFirst(function (blobInfo) {
        return blobInfo.blobUri() == blobUri;
      });
    };
    var removeByUri = function (blobUri) {
      cache = $_gf68zqkjc7tm6r7.filter(cache, function (blobInfo) {
        if (blobInfo.blobUri() === blobUri) {
          $_58egr1ajc7tm6h8.revokeObjectURL(blobInfo.blobUri());
          return false;
        }
        return true;
      });
    };
    var destroy = function () {
      $_gf68zqkjc7tm6r7.each(cache, function (cachedBlobInfo) {
        $_58egr1ajc7tm6h8.revokeObjectURL(cachedBlobInfo.blobUri());
      });
      cache = [];
    };
    return {
      create: create,
      add: add,
      get: get,
      getByUri: getByUri,
      findFirst: findFirst,
      removeByUri: removeByUri,
      destroy: destroy
    };
  };

  var UploadStatus = function () {
    var PENDING = 1, UPLOADED = 2;
    var blobUriStatuses = {};
    var createStatus = function (status, resultUri) {
      return {
        status: status,
        resultUri: resultUri
      };
    };
    var hasBlobUri = function (blobUri) {
      return blobUri in blobUriStatuses;
    };
    var getResultUri = function (blobUri) {
      var result = blobUriStatuses[blobUri];
      return result ? result.resultUri : null;
    };
    var isPending = function (blobUri) {
      return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === PENDING : false;
    };
    var isUploaded = function (blobUri) {
      return hasBlobUri(blobUri) ? blobUriStatuses[blobUri].status === UPLOADED : false;
    };
    var markPending = function (blobUri) {
      blobUriStatuses[blobUri] = createStatus(PENDING, null);
    };
    var markUploaded = function (blobUri, resultUri) {
      blobUriStatuses[blobUri] = createStatus(UPLOADED, resultUri);
    };
    var removeFailed = function (blobUri) {
      delete blobUriStatuses[blobUri];
    };
    var destroy = function () {
      blobUriStatuses = {};
    };
    return {
      hasBlobUri: hasBlobUri,
      getResultUri: getResultUri,
      isPending: isPending,
      isUploaded: isUploaded,
      markPending: markPending,
      markUploaded: markUploaded,
      removeFailed: removeFailed,
      destroy: destroy
    };
  };

  var EditorUpload = function (editor) {
    var blobCache = BlobCache(), uploader, imageScanner, settings = editor.settings;
    var uploadStatus = UploadStatus();
    var aliveGuard = function (callback) {
      return function (result) {
        if (editor.selection) {
          return callback(result);
        }
        return [];
      };
    };
    var cacheInvalidator = function () {
      return '?' + new Date().getTime();
    };
    var replaceString = function (content, search, replace) {
      var index = 0;
      do {
        index = content.indexOf(search, index);
        if (index !== -1) {
          content = content.substring(0, index) + replace + content.substr(index + search.length);
          index += replace.length - search.length + 1;
        }
      } while (index !== -1);
      return content;
    };
    var replaceImageUrl = function (content, targetUrl, replacementUrl) {
      content = replaceString(content, 'src="' + targetUrl + '"', 'src="' + replacementUrl + '"');
      content = replaceString(content, 'data-mce-src="' + targetUrl + '"', 'data-mce-src="' + replacementUrl + '"');
      return content;
    };
    var replaceUrlInUndoStack = function (targetUrl, replacementUrl) {
      $_gf68zqkjc7tm6r7.each(editor.undoManager.data, function (level) {
        if (level.type === 'fragmented') {
          level.fragments = $_gf68zqkjc7tm6r7.map(level.fragments, function (fragment) {
            return replaceImageUrl(fragment, targetUrl, replacementUrl);
          });
        } else {
          level.content = replaceImageUrl(level.content, targetUrl, replacementUrl);
        }
      });
    };
    var openNotification = function () {
      return editor.notificationManager.open({
        text: editor.translate('Image uploading...'),
        type: 'info',
        timeout: -1,
        progressBar: true
      });
    };
    var replaceImageUri = function (image, resultUri) {
      blobCache.removeByUri(image.src);
      replaceUrlInUndoStack(image.src, resultUri);
      editor.$(image).attr({
        src: settings.images_reuse_filename ? resultUri + cacheInvalidator() : resultUri,
        'data-mce-src': editor.convertURL(resultUri, 'src')
      });
    };
    var uploadImages = function (callback) {
      if (!uploader) {
        uploader = Uploader(uploadStatus, {
          url: settings.images_upload_url,
          basePath: settings.images_upload_base_path,
          credentials: settings.images_upload_credentials,
          handler: settings.images_upload_handler
        });
      }
      return scanForImages().then(aliveGuard(function (imageInfos) {
        var blobInfos;
        blobInfos = $_gf68zqkjc7tm6r7.map(imageInfos, function (imageInfo) {
          return imageInfo.blobInfo;
        });
        return uploader.upload(blobInfos, openNotification).then(aliveGuard(function (result) {
          var filteredResult = $_gf68zqkjc7tm6r7.map(result, function (uploadInfo, index) {
            var image = imageInfos[index].image;
            if (uploadInfo.status && editor.settings.images_replace_blob_uris !== false) {
              replaceImageUri(image, uploadInfo.url);
            } else if (uploadInfo.error) {
              $_4z4ogl4djc7tm7t4.uploadError(editor, uploadInfo.error);
            }
            return {
              element: image,
              status: uploadInfo.status
            };
          });
          if (callback) {
            callback(filteredResult);
          }
          return filteredResult;
        }));
      }));
    };
    var uploadImagesAuto = function (callback) {
      if (settings.automatic_uploads !== false) {
        return uploadImages(callback);
      }
    };
    var isValidDataUriImage = function (imgElm) {
      return settings.images_dataimg_filter ? settings.images_dataimg_filter(imgElm) : true;
    };
    var scanForImages = function () {
      if (!imageScanner) {
        imageScanner = ImageScanner(uploadStatus, blobCache);
      }
      return imageScanner.findAll(editor.getBody(), isValidDataUriImage).then(aliveGuard(function (result) {
        result = $_gf68zqkjc7tm6r7.filter(result, function (resultItem) {
          if (typeof resultItem === 'string') {
            $_4z4ogl4djc7tm7t4.displayError(editor, resultItem);
            return false;
          }
          return true;
        });
        $_gf68zqkjc7tm6r7.each(result, function (resultItem) {
          replaceUrlInUndoStack(resultItem.image.src, resultItem.blobInfo.blobUri());
          resultItem.image.src = resultItem.blobInfo.blobUri();
          resultItem.image.removeAttribute('data-mce-src');
        });
        return result;
      }));
    };
    var destroy = function () {
      blobCache.destroy();
      uploadStatus.destroy();
      imageScanner = uploader = null;
    };
    var replaceBlobUris = function (content) {
      return content.replace(/src="(blob:[^"]+)"/g, function (match, blobUri) {
        var resultUri = uploadStatus.getResultUri(blobUri);
        if (resultUri) {
          return 'src="' + resultUri + '"';
        }
        var blobInfo = blobCache.getByUri(blobUri);
        if (!blobInfo) {
          blobInfo = $_gf68zqkjc7tm6r7.reduce(editor.editorManager.get(), function (result, editor) {
            return result || editor.editorUpload && editor.editorUpload.blobCache.getByUri(blobUri);
          }, null);
        }
        if (blobInfo) {
          return 'src="data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64() + '"';
        }
        return match;
      });
    };
    editor.on('setContent', function () {
      if (editor.settings.automatic_uploads !== false) {
        uploadImagesAuto();
      } else {
        scanForImages();
      }
    });
    editor.on('RawSaveContent', function (e) {
      e.content = replaceBlobUris(e.content);
    });
    editor.on('getContent', function (e) {
      if (e.source_view || e.format == 'raw') {
        return;
      }
      e.content = replaceBlobUris(e.content);
    });
    editor.on('PostRender', function () {
      editor.parser.addNodeFilter('img', function (images) {
        $_gf68zqkjc7tm6r7.each(images, function (img) {
          var src = img.attr('src');
          if (blobCache.getByUri(src)) {
            return;
          }
          var resultUri = uploadStatus.getResultUri(src);
          if (resultUri) {
            img.attr('src', resultUri);
          }
        });
      });
    });
    return {
      blobCache: blobCache,
      uploadImages: uploadImages,
      uploadImagesAuto: uploadImagesAuto,
      scanForImages: scanForImages,
      destroy: destroy
    };
  };

  var isBlockElement = function (blockElements, node) {
    return blockElements.hasOwnProperty(node.nodeName);
  };
  var isValidTarget = function (blockElements, node) {
    if ($_1qi2bn1qjc7tm70u.isText(node)) {
      return true;
    } else if ($_1qi2bn1qjc7tm70u.isElement(node)) {
      return !isBlockElement(blockElements, node) && !$_am1og29jc7tm78b.isBookmarkNode(node);
    } else {
      return false;
    }
  };
  var hasBlockParent = function (blockElements, root, node) {
    return $_20yqgb4jc7tm6aj.exists($_75x9wp33jc7tm7hb.parents($_bscr39yjc7tm6uo.fromDom(node), $_bscr39yjc7tm6uo.fromDom(root)), function (elm) {
      return isBlockElement(blockElements, elm.dom());
    });
  };
  var addRootBlocks = function (editor) {
    var settings = editor.settings, dom = editor.dom, selection = editor.selection;
    var schema = editor.schema, blockElements = schema.getBlockElements();
    var node = selection.getStart(), rootNode = editor.getBody(), rng;
    var startContainer, startOffset, endContainer, endOffset, rootBlockNode;
    var tempNode, wrapped, restoreSelection;
    var rootNodeName, forcedRootBlock;
    forcedRootBlock = settings.forced_root_block;
    if (!node || !$_1qi2bn1qjc7tm70u.isElement(node) || !forcedRootBlock) {
      return;
    }
    rootNodeName = rootNode.nodeName.toLowerCase();
    if (!schema.isValidChild(rootNodeName, forcedRootBlock.toLowerCase()) || hasBlockParent(blockElements, rootNode, node)) {
      return;
    }
    rng = selection.getRng();
    startContainer = rng.startContainer;
    startOffset = rng.startOffset;
    endContainer = rng.endContainer;
    endOffset = rng.endOffset;
    restoreSelection = $_9dadsv44jc7tm7rb.hasFocus(editor);
    node = rootNode.firstChild;
    while (node) {
      if (isValidTarget(blockElements, node)) {
        if ($_1qi2bn1qjc7tm70u.isText(node) && node.nodeValue.length === 0) {
          tempNode = node;
          node = node.nextSibling;
          dom.remove(tempNode);
          continue;
        }
        if (!rootBlockNode) {
          rootBlockNode = dom.create(forcedRootBlock, editor.settings.forced_root_block_attrs);
          node.parentNode.insertBefore(rootBlockNode, node);
          wrapped = true;
        }
        tempNode = node;
        node = node.nextSibling;
        rootBlockNode.appendChild(tempNode);
      } else {
        rootBlockNode = null;
        node = node.nextSibling;
      }
    }
    if (wrapped && restoreSelection) {
      rng.setStart(startContainer, startOffset);
      rng.setEnd(endContainer, endOffset);
      selection.setRng(rng);
      editor.nodeChanged();
    }
  };
  var setup$1 = function (editor) {
    if (editor.settings.forced_root_block) {
      editor.on('NodeChange', $_f41mrx6jc7tm6cd.curry(addRootBlocks, editor));
    }
  };
  var $_g5aehe4ujc7tm7wi = { setup: setup$1 };

  var NodeChange = function (editor) {
    var lastRng, lastPath = [];
    var isSameElementPath = function (startElm) {
      var i, currentPath;
      currentPath = editor.$(startElm).parentsUntil(editor.getBody()).add(startElm);
      if (currentPath.length === lastPath.length) {
        for (i = currentPath.length; i >= 0; i--) {
          if (currentPath[i] !== lastPath[i]) {
            break;
          }
        }
        if (i === -1) {
          lastPath = currentPath;
          return true;
        }
      }
      lastPath = currentPath;
      return false;
    };
    if (!('onselectionchange' in editor.getDoc())) {
      editor.on('NodeChange Click MouseUp KeyUp Focus', function (e) {
        var nativeRng, fakeRng;
        nativeRng = editor.selection.getRng();
        fakeRng = {
          startContainer: nativeRng.startContainer,
          startOffset: nativeRng.startOffset,
          endContainer: nativeRng.endContainer,
          endOffset: nativeRng.endOffset
        };
        if (e.type == 'nodechange' || !$_5m3au53tjc7tm7ou.isEq(fakeRng, lastRng)) {
          editor.fire('SelectionChange');
        }
        lastRng = fakeRng;
      });
    }
    editor.on('contextmenu', function () {
      editor.fire('SelectionChange');
    });
    editor.on('SelectionChange', function () {
      var startElm = editor.selection.getStart(true);
      if (!startElm || !$_dtgtsy9jc7tm6gs.range && editor.selection.isCollapsed()) {
        return;
      }
      if (!isSameElementPath(startElm) && editor.dom.isChildOf(startElm, editor.getBody())) {
        editor.nodeChanged({ selectionChange: true });
      }
    });
    editor.on('MouseUp', function (e) {
      if (!e.isDefaultPrevented()) {
        if (editor.selection.getNode().nodeName == 'IMG') {
          $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
            editor.nodeChanged();
          });
        } else {
          editor.nodeChanged();
        }
      }
    });
    this.nodeChanged = function (args) {
      var selection = editor.selection, node, parents, root;
      if (editor.initialized && selection && !editor.settings.disable_nodechange && !editor.readonly) {
        root = editor.getBody();
        node = selection.getStart(true) || root;
        if (node.ownerDocument != editor.getDoc() || !editor.dom.isChildOf(node, root)) {
          node = root;
        }
        parents = [];
        editor.dom.getParent(node, function (node) {
          if (node === root) {
            return true;
          }
          parents.push(node);
        });
        args = args || {};
        args.element = node;
        args.parents = parents;
        editor.fire('NodeChange', args);
      }
    };
  };

  var getAbsolutePosition = function (elm) {
    var doc, docElem, win, clientRect;
    clientRect = elm.getBoundingClientRect();
    doc = elm.ownerDocument;
    docElem = doc.documentElement;
    win = doc.defaultView;
    return {
      top: clientRect.top + win.pageYOffset - docElem.clientTop,
      left: clientRect.left + win.pageXOffset - docElem.clientLeft
    };
  };
  var getBodyPosition = function (editor) {
    return editor.inline ? getAbsolutePosition(editor.getBody()) : {
      left: 0,
      top: 0
    };
  };
  var getScrollPosition = function (editor) {
    var body = editor.getBody();
    return editor.inline ? {
      left: body.scrollLeft,
      top: body.scrollTop
    } : {
      left: 0,
      top: 0
    };
  };
  var getBodyScroll = function (editor) {
    var body = editor.getBody(), docElm = editor.getDoc().documentElement;
    var inlineScroll = {
      left: body.scrollLeft,
      top: body.scrollTop
    };
    var iframeScroll = {
      left: body.scrollLeft || docElm.scrollLeft,
      top: body.scrollTop || docElm.scrollTop
    };
    return editor.inline ? inlineScroll : iframeScroll;
  };
  var getMousePosition = function (editor, event) {
    if (event.target.ownerDocument !== editor.getDoc()) {
      var iframePosition = getAbsolutePosition(editor.getContentAreaContainer());
      var scrollPosition = getBodyScroll(editor);
      return {
        left: event.pageX - iframePosition.left + scrollPosition.left,
        top: event.pageY - iframePosition.top + scrollPosition.top
      };
    }
    return {
      left: event.pageX,
      top: event.pageY
    };
  };
  var calculatePosition = function (bodyPosition, scrollPosition, mousePosition) {
    return {
      pageX: mousePosition.left - bodyPosition.left + scrollPosition.left,
      pageY: mousePosition.top - bodyPosition.top + scrollPosition.top
    };
  };
  var calc = function (editor, event) {
    return calculatePosition(getBodyPosition(editor), getScrollPosition(editor), getMousePosition(editor, event));
  };
  var $_6nfrxq4yjc7tm7xw = { calc: calc };

  var isContentEditableFalse$5 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isContentEditableTrue$3 = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var isDraggable = function (rootElm, elm) {
    return isContentEditableFalse$5(elm) && elm !== rootElm;
  };
  var isValidDropTarget = function (editor, targetElement, dragElement) {
    if (targetElement === dragElement || editor.dom.isChildOf(targetElement, dragElement)) {
      return false;
    }
    if (isContentEditableFalse$5(targetElement)) {
      return false;
    }
    return true;
  };
  var cloneElement = function (elm) {
    var cloneElm = elm.cloneNode(true);
    cloneElm.removeAttribute('data-mce-selected');
    return cloneElm;
  };
  var createGhost = function (editor, elm, width, height) {
    var clonedElm = elm.cloneNode(true);
    editor.dom.setStyles(clonedElm, {
      width: width,
      height: height
    });
    editor.dom.setAttrib(clonedElm, 'data-mce-selected', null);
    var ghostElm = editor.dom.create('div', {
      'class': 'mce-drag-container',
      'data-mce-bogus': 'all',
      unselectable: 'on',
      contenteditable: 'false'
    });
    editor.dom.setStyles(ghostElm, {
      position: 'absolute',
      opacity: 0.5,
      overflow: 'hidden',
      border: 0,
      padding: 0,
      margin: 0,
      width: width,
      height: height
    });
    editor.dom.setStyles(clonedElm, {
      margin: 0,
      boxSizing: 'border-box'
    });
    ghostElm.appendChild(clonedElm);
    return ghostElm;
  };
  var appendGhostToBody = function (ghostElm, bodyElm) {
    if (ghostElm.parentNode !== bodyElm) {
      bodyElm.appendChild(ghostElm);
    }
  };
  var moveGhost = function (ghostElm, position, width, height, maxX, maxY) {
    var overflowX = 0, overflowY = 0;
    ghostElm.style.left = position.pageX + 'px';
    ghostElm.style.top = position.pageY + 'px';
    if (position.pageX + width > maxX) {
      overflowX = position.pageX + width - maxX;
    }
    if (position.pageY + height > maxY) {
      overflowY = position.pageY + height - maxY;
    }
    ghostElm.style.width = width - overflowX + 'px';
    ghostElm.style.height = height - overflowY + 'px';
  };
  var removeElement = function (elm) {
    if (elm && elm.parentNode) {
      elm.parentNode.removeChild(elm);
    }
  };
  var isLeftMouseButtonPressed = function (e) {
    return e.button === 0;
  };
  var hasDraggableElement = function (state) {
    return state.element;
  };
  var applyRelPos = function (state, position) {
    return {
      pageX: position.pageX - state.relX,
      pageY: position.pageY + 5
    };
  };
  var start$1 = function (state, editor) {
    return function (e) {
      if (isLeftMouseButtonPressed(e)) {
        var ceElm = $_gf68zqkjc7tm6r7.find(editor.dom.getParents(e.target), $_fy81ys25jc7tm77a.or(isContentEditableFalse$5, isContentEditableTrue$3));
        if (isDraggable(editor.getBody(), ceElm)) {
          var elmPos = editor.dom.getPos(ceElm);
          var bodyElm = editor.getBody();
          var docElm = editor.getDoc().documentElement;
          state.element = ceElm;
          state.screenX = e.screenX;
          state.screenY = e.screenY;
          state.maxX = (editor.inline ? bodyElm.scrollWidth : docElm.offsetWidth) - 2;
          state.maxY = (editor.inline ? bodyElm.scrollHeight : docElm.offsetHeight) - 2;
          state.relX = e.pageX - elmPos.x;
          state.relY = e.pageY - elmPos.y;
          state.width = ceElm.offsetWidth;
          state.height = ceElm.offsetHeight;
          state.ghost = createGhost(editor, ceElm, state.width, state.height);
        }
      }
    };
  };
  var move$1 = function (state, editor) {
    var throttledPlaceCaretAt = $_9jpiwcgjc7tm6kr.throttle(function (clientX, clientY) {
      editor._selectionOverrides.hideFakeCaret();
      editor.selection.placeCaretAt(clientX, clientY);
    }, 0);
    return function (e) {
      var movement = Math.max(Math.abs(e.screenX - state.screenX), Math.abs(e.screenY - state.screenY));
      if (hasDraggableElement(state) && !state.dragging && movement > 10) {
        var args = editor.fire('dragstart', { target: state.element });
        if (args.isDefaultPrevented()) {
          return;
        }
        state.dragging = true;
        editor.focus();
      }
      if (state.dragging) {
        var targetPos = applyRelPos(state, $_6nfrxq4yjc7tm7xw.calc(editor, e));
        appendGhostToBody(state.ghost, editor.getBody());
        moveGhost(state.ghost, targetPos, state.width, state.height, state.maxX, state.maxY);
        throttledPlaceCaretAt(e.clientX, e.clientY);
      }
    };
  };
  var getRawTarget = function (selection) {
    var rng = selection.getSel().getRangeAt(0);
    var startContainer = rng.startContainer;
    return startContainer.nodeType === 3 ? startContainer.parentNode : startContainer;
  };
  var drop = function (state, editor) {
    return function (e) {
      if (state.dragging) {
        if (isValidDropTarget(editor, getRawTarget(editor.selection), state.element)) {
          var targetClone = cloneElement(state.element);
          var args = editor.fire('drop', {
            targetClone: targetClone,
            clientX: e.clientX,
            clientY: e.clientY
          });
          if (!args.isDefaultPrevented()) {
            targetClone = args.targetClone;
            editor.undoManager.transact(function () {
              removeElement(state.element);
              editor.insertContent(editor.dom.getOuterHTML(targetClone));
              editor._selectionOverrides.hideFakeCaret();
            });
          }
        }
      }
      removeDragState(state);
    };
  };
  var stop = function (state, editor) {
    return function () {
      removeDragState(state);
      if (state.dragging) {
        editor.fire('dragend');
      }
    };
  };
  var removeDragState = function (state) {
    state.dragging = false;
    state.element = null;
    removeElement(state.ghost);
  };
  var bindFakeDragEvents = function (editor) {
    var state = {}, pageDom, dragStartHandler, dragHandler, dropHandler, dragEndHandler, rootDocument;
    pageDom = DOMUtils.DOM;
    rootDocument = document;
    dragStartHandler = start$1(state, editor);
    dragHandler = move$1(state, editor);
    dropHandler = drop(state, editor);
    dragEndHandler = stop(state, editor);
    editor.on('mousedown', dragStartHandler);
    editor.on('mousemove', dragHandler);
    editor.on('mouseup', dropHandler);
    pageDom.bind(rootDocument, 'mousemove', dragHandler);
    pageDom.bind(rootDocument, 'mouseup', dragEndHandler);
    editor.on('remove', function () {
      pageDom.unbind(rootDocument, 'mousemove', dragHandler);
      pageDom.unbind(rootDocument, 'mouseup', dragEndHandler);
    });
  };
  var blockIeDrop = function (editor) {
    editor.on('drop', function (e) {
      var realTarget = typeof e.clientX !== 'undefined' ? editor.getDoc().elementFromPoint(e.clientX, e.clientY) : null;
      if (isContentEditableFalse$5(realTarget) || isContentEditableFalse$5(editor.dom.getContentEditableParent(realTarget))) {
        e.preventDefault();
      }
    });
  };
  var init$1 = function (editor) {
    bindFakeDragEvents(editor);
    blockIeDrop(editor);
  };
  var $_dxyzsi4xjc7tm7xo = { init: init$1 };

  var isContentEditableFalse$6 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isTableCell$2 = function (node) {
    return node && /^(TD|TH)$/i.test(node.nodeName);
  };
  var FakeCaret = function (rootNode, isBlock) {
    var cursorInterval, $lastVisualCaret = null, caretContainerNode;
    var getAbsoluteClientRect = function (node, before) {
      var clientRect = $_dqnspu22jc7tm76a.collapse(node.getBoundingClientRect(), before), docElm, scrollX, scrollY, margin, rootRect;
      if (rootNode.tagName == 'BODY') {
        docElm = rootNode.ownerDocument.documentElement;
        scrollX = rootNode.scrollLeft || docElm.scrollLeft;
        scrollY = rootNode.scrollTop || docElm.scrollTop;
      } else {
        rootRect = rootNode.getBoundingClientRect();
        scrollX = rootNode.scrollLeft - rootRect.left;
        scrollY = rootNode.scrollTop - rootRect.top;
      }
      clientRect.left += scrollX;
      clientRect.right += scrollX;
      clientRect.top += scrollY;
      clientRect.bottom += scrollY;
      clientRect.width = 1;
      margin = node.offsetWidth - node.clientWidth;
      if (margin > 0) {
        if (before) {
          margin *= -1;
        }
        clientRect.left += margin;
        clientRect.right += margin;
      }
      return clientRect;
    };
    var trimInlineCaretContainers = function () {
      var contentEditableFalseNodes, node, sibling, i, data;
      contentEditableFalseNodes = DomQuery('*[contentEditable=false]', rootNode);
      for (i = 0; i < contentEditableFalseNodes.length; i++) {
        node = contentEditableFalseNodes[i];
        sibling = node.previousSibling;
        if ($_40segn20jc7tm75y.endsWithCaretContainer(sibling)) {
          data = sibling.data;
          if (data.length == 1) {
            sibling.parentNode.removeChild(sibling);
          } else {
            sibling.deleteData(data.length - 1, 1);
          }
        }
        sibling = node.nextSibling;
        if ($_40segn20jc7tm75y.startsWithCaretContainer(sibling)) {
          data = sibling.data;
          if (data.length == 1) {
            sibling.parentNode.removeChild(sibling);
          } else {
            sibling.deleteData(0, 1);
          }
        }
      }
      return null;
    };
    var show = function (before, node) {
      var clientRect, rng;
      hide();
      if (isTableCell$2(node)) {
        return null;
      }
      if (isBlock(node)) {
        caretContainerNode = $_40segn20jc7tm75y.insertBlock('p', node, before);
        clientRect = getAbsoluteClientRect(node, before);
        DomQuery(caretContainerNode).css('top', clientRect.top);
        $lastVisualCaret = DomQuery('<div class="mce-visual-caret" data-mce-bogus="all"></div>').css(clientRect).appendTo(rootNode);
        if (before) {
          $lastVisualCaret.addClass('mce-visual-caret-before');
        }
        startBlink();
        rng = node.ownerDocument.createRange();
        rng.setStart(caretContainerNode, 0);
        rng.setEnd(caretContainerNode, 0);
      } else {
        caretContainerNode = $_40segn20jc7tm75y.insertInline(node, before);
        rng = node.ownerDocument.createRange();
        if (isContentEditableFalse$6(caretContainerNode.nextSibling)) {
          rng.setStart(caretContainerNode, 0);
          rng.setEnd(caretContainerNode, 0);
        } else {
          rng.setStart(caretContainerNode, 1);
          rng.setEnd(caretContainerNode, 1);
        }
        return rng;
      }
      return rng;
    };
    var hide = function () {
      trimInlineCaretContainers();
      if (caretContainerNode) {
        $_5xp8n23cjc7tm7js.remove(caretContainerNode);
        caretContainerNode = null;
      }
      if ($lastVisualCaret) {
        $lastVisualCaret.remove();
        $lastVisualCaret = null;
      }
      clearInterval(cursorInterval);
    };
    var hasFocus = function () {
      return rootNode.ownerDocument.activeElement === rootNode;
    };
    var startBlink = function () {
      cursorInterval = $_9jpiwcgjc7tm6kr.setInterval(function () {
        if (hasFocus()) {
          DomQuery('div.mce-visual-caret', rootNode).toggleClass('mce-visual-caret-hidden');
        } else {
          DomQuery('div.mce-visual-caret', rootNode).addClass('mce-visual-caret-hidden');
        }
      }, 500);
    };
    var destroy = function () {
      $_9jpiwcgjc7tm6kr.clearInterval(cursorInterval);
    };
    var getCss = function () {
      return '.mce-visual-caret {' + 'position: absolute;' + 'background-color: black;' + 'background-color: currentcolor;' + '}' + '.mce-visual-caret-hidden {' + 'display: none;' + '}' + '*[data-mce-caret] {' + 'position: absolute;' + 'left: -1000px;' + 'right: auto;' + 'top: 0;' + 'margin: 0;' + 'padding: 0;' + '}';
    };
    return {
      show: show,
      hide: hide,
      getCss: getCss,
      destroy: destroy
    };
  };

  var getClientRects = function (node) {
    var toArrayWithNode = function (clientRects) {
      return $_gf68zqkjc7tm6r7.map(clientRects, function (clientRect) {
        clientRect = $_dqnspu22jc7tm76a.clone(clientRect);
        clientRect.node = node;
        return clientRect;
      });
    };
    if ($_gf68zqkjc7tm6r7.isArray(node)) {
      return $_gf68zqkjc7tm6r7.reduce(node, function (result, node) {
        return result.concat(getClientRects(node));
      }, []);
    }
    if ($_1qi2bn1qjc7tm70u.isElement(node)) {
      return toArrayWithNode(node.getClientRects());
    }
    if ($_1qi2bn1qjc7tm70u.isText(node)) {
      var rng = node.ownerDocument.createRange();
      rng.setStart(node, 0);
      rng.setEnd(node, node.data.length);
      return toArrayWithNode(rng.getClientRects());
    }
  };
  var $_fx9egk51jc7tm7yd = { getClientRects: getClientRects };

  var isContentEditableFalse$7 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var findNode$1 = $_4knc0r27jc7tm77s.findNode;
  var curry$3 = $_fy81ys25jc7tm77a.curry;
  var distanceToRectLeft = function (clientRect, clientX) {
    return Math.abs(clientRect.left - clientX);
  };
  var distanceToRectRight = function (clientRect, clientX) {
    return Math.abs(clientRect.right - clientX);
  };
  var findClosestClientRect = function (clientRects, clientX) {
    var isInside = function (clientX, clientRect) {
      return clientX >= clientRect.left && clientX <= clientRect.right;
    };
    return $_gf68zqkjc7tm6r7.reduce(clientRects, function (oldClientRect, clientRect) {
      var oldDistance, newDistance;
      oldDistance = Math.min(distanceToRectLeft(oldClientRect, clientX), distanceToRectRight(oldClientRect, clientX));
      newDistance = Math.min(distanceToRectLeft(clientRect, clientX), distanceToRectRight(clientRect, clientX));
      if (isInside(clientX, clientRect)) {
        return clientRect;
      }
      if (isInside(clientX, oldClientRect)) {
        return oldClientRect;
      }
      if (newDistance == oldDistance && isContentEditableFalse$7(clientRect.node)) {
        return clientRect;
      }
      if (newDistance < oldDistance) {
        return clientRect;
      }
      return oldClientRect;
    });
  };
  var walkUntil = function (direction, rootNode, predicateFn, node) {
    while (node = findNode$1(node, direction, $_bnhdlx1zjc7tm75s.isEditableCaretCandidate, rootNode)) {
      if (predicateFn(node)) {
        return;
      }
    }
  };
  var findLineNodeRects = function (rootNode, targetNodeRect) {
    var clientRects = [];
    var collect = function (checkPosFn, node) {
      var lineRects;
      lineRects = $_gf68zqkjc7tm6r7.filter($_fx9egk51jc7tm7yd.getClientRects(node), function (clientRect) {
        return !checkPosFn(clientRect, targetNodeRect);
      });
      clientRects = clientRects.concat(lineRects);
      return lineRects.length === 0;
    };
    clientRects.push(targetNodeRect);
    walkUntil(-1, rootNode, curry$3(collect, $_dqnspu22jc7tm76a.isAbove), targetNodeRect.node);
    walkUntil(1, rootNode, curry$3(collect, $_dqnspu22jc7tm76a.isBelow), targetNodeRect.node);
    return clientRects;
  };
  var getContentEditableFalseChildren = function (rootNode) {
    return $_gf68zqkjc7tm6r7.filter($_gf68zqkjc7tm6r7.toArray(rootNode.getElementsByTagName('*')), isContentEditableFalse$7);
  };
  var caretInfo = function (clientRect, clientX) {
    return {
      node: clientRect.node,
      before: distanceToRectLeft(clientRect, clientX) < distanceToRectRight(clientRect, clientX)
    };
  };
  var closestCaret = function (rootNode, clientX, clientY) {
    var contentEditableFalseNodeRects, closestNodeRect;
    contentEditableFalseNodeRects = $_fx9egk51jc7tm7yd.getClientRects(getContentEditableFalseChildren(rootNode));
    contentEditableFalseNodeRects = $_gf68zqkjc7tm6r7.filter(contentEditableFalseNodeRects, function (clientRect) {
      return clientY >= clientRect.top && clientY <= clientRect.bottom;
    });
    closestNodeRect = findClosestClientRect(contentEditableFalseNodeRects, clientX);
    if (closestNodeRect) {
      closestNodeRect = findClosestClientRect(findLineNodeRects(rootNode, closestNodeRect), clientX);
      if (closestNodeRect && isContentEditableFalse$7(closestNodeRect.node)) {
        return caretInfo(closestNodeRect, clientX);
      }
    }
    return null;
  };
  var $_87htka50jc7tm7y9 = {
    findClosestClientRect: findClosestClientRect,
    findLineNodeRects: findLineNodeRects,
    closestCaret: closestCaret
  };

  var isXYWithinRange = function (clientX, clientY, range) {
    if (range.collapsed) {
      return false;
    }
    return $_20yqgb4jc7tm6aj.foldl(range.getClientRects(), function (state, rect) {
      return state || $_dqnspu22jc7tm76a.containsXY(rect, clientX, clientY);
    }, false);
  };
  var $_av8odt52jc7tm7yh = { isXYWithinRange: isXYWithinRange };

  var adaptable = function (fn, rate) {
    var timer = null;
    var args = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        args = null;
      }
    };
    var throttle = function () {
      args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var first$3 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var last$3 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer !== null)
        clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
        timer = null;
        args = null;
      }, rate);
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var $_w9o8y54jc7tm7yp = {
    adaptable: adaptable,
    first: first$3,
    last: last$3
  };

  var isContentEditableTrue$4 = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var isContentEditableFalse$8 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var showCaret = function (direction, editor, node, before) {
    return editor._selectionOverrides.showCaret(direction, node, before);
  };
  var getNodeRange = function (node) {
    var rng = node.ownerDocument.createRange();
    rng.selectNode(node);
    return rng;
  };
  var selectNode = function (editor, node) {
    var e;
    e = editor.fire('BeforeObjectSelected', { target: node });
    if (e.isDefaultPrevented()) {
      return null;
    }
    return getNodeRange(node);
  };
  var renderCaretAtRange = function (editor, range) {
    var caretPosition, ceRoot;
    range = $_4knc0r27jc7tm77s.normalizeRange(1, editor.getBody(), range);
    caretPosition = CaretPosition.fromRangeStart(range);
    if (isContentEditableFalse$8(caretPosition.getNode())) {
      return showCaret(1, editor, caretPosition.getNode(), !caretPosition.isAtEnd());
    }
    if (isContentEditableFalse$8(caretPosition.getNode(true))) {
      return showCaret(1, editor, caretPosition.getNode(true), false);
    }
    ceRoot = editor.dom.getParent(caretPosition.getNode(), $_fy81ys25jc7tm77a.or(isContentEditableFalse$8, isContentEditableTrue$4));
    if (isContentEditableFalse$8(ceRoot)) {
      return showCaret(1, editor, ceRoot, false);
    }
    return null;
  };
  var renderRangeCaret = function (editor, range) {
    var caretRange;
    if (!range || !range.collapsed) {
      return range;
    }
    caretRange = renderCaretAtRange(editor, range);
    if (caretRange) {
      return caretRange;
    }
    return range;
  };
  var $_ebmpgm55jc7tm7yv = {
    showCaret: showCaret,
    selectNode: selectNode,
    renderCaretAtRange: renderCaretAtRange,
    renderRangeCaret: renderRangeCaret
  };

  var setup$2 = function (editor) {
    var renderFocusCaret = $_w9o8y54jc7tm7yp.first(function () {
      if (!editor.removed) {
        var caretRange = $_ebmpgm55jc7tm7yv.renderRangeCaret(editor, editor.selection.getRng());
        editor.selection.setRng(caretRange);
      }
    }, 0);
    editor.on('focus', function () {
      renderFocusCaret.throttle();
    });
    editor.on('blur', function () {
      renderFocusCaret.cancel();
    });
  };
  var $_bawfbe53jc7tm7yl = { setup: setup$2 };

  var $_b5txs856jc7tm7z0 = {
    BACKSPACE: 8,
    DELETE: 46,
    DOWN: 40,
    ENTER: 13,
    LEFT: 37,
    RIGHT: 39,
    SPACEBAR: 32,
    TAB: 9,
    UP: 38,
    modifierPressed: function (e) {
      return e.shiftKey || e.ctrlKey || e.altKey || this.metaKeyPressed(e);
    },
    metaKeyPressed: function (e) {
      return $_dtgtsy9jc7tm6gs.mac ? e.metaKey : e.ctrlKey && !e.altKey;
    }
  };

  var isContentEditableTrue$2 = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var isContentEditableFalse$4 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isAfterContentEditableFalse = $_4knc0r27jc7tm77s.isAfterContentEditableFalse;
  var isBeforeContentEditableFalse = $_4knc0r27jc7tm77s.isBeforeContentEditableFalse;
  var SelectionOverrides = function (editor) {
    var isBlock = function (node) {
      return editor.dom.isBlock(node);
    };
    var rootNode = editor.getBody();
    var fakeCaret = FakeCaret(editor.getBody(), isBlock), realSelectionId = 'sel-' + editor.dom.uniqueId(), selectedContentEditableNode;
    var isFakeSelectionElement = function (elm) {
      return editor.dom.hasClass(elm, 'mce-offscreen-selection');
    };
    var getRealSelectionElement = function () {
      var container = editor.dom.get(realSelectionId);
      return container ? container.getElementsByTagName('*')[0] : container;
    };
    var setRange = function (range) {
      if (range) {
        editor.selection.setRng(range);
      }
    };
    var getRange = function () {
      return editor.selection.getRng();
    };
    var scrollIntoView = function (node, alignToTop) {
      editor.selection.scrollIntoView(node, alignToTop);
    };
    var showCaret = function (direction, node, before) {
      var e;
      e = editor.fire('ShowCaret', {
        target: node,
        direction: direction,
        before: before
      });
      if (e.isDefaultPrevented()) {
        return null;
      }
      scrollIntoView(node, direction === -1);
      return fakeCaret.show(before, node);
    };
    var getNormalizedRangeEndPoint = function (direction, range) {
      range = $_4knc0r27jc7tm77s.normalizeRange(direction, rootNode, range);
      if (direction == -1) {
        return CaretPosition.fromRangeStart(range);
      }
      return CaretPosition.fromRangeEnd(range);
    };
    var showBlockCaretContainer = function (blockCaretContainer) {
      if (blockCaretContainer.hasAttribute('data-mce-caret')) {
        $_40segn20jc7tm75y.showCaretContainerBlock(blockCaretContainer);
        setRange(getRange());
        scrollIntoView(blockCaretContainer[0]);
      }
    };
    var registerEvents = function () {
      var getContentEditableRoot = function (node) {
        var root = editor.getBody();
        while (node && node != root) {
          if (isContentEditableTrue$2(node) || isContentEditableFalse$4(node)) {
            return node;
          }
          node = node.parentNode;
        }
        return null;
      };
      editor.on('mouseup', function (e) {
        var range = getRange();
        if (range.collapsed && $_1f157949jc7tm7sb.isXYInContentArea(editor, e.clientX, e.clientY)) {
          setRange($_ebmpgm55jc7tm7yv.renderCaretAtRange(editor, range));
        }
      });
      editor.on('click', function (e) {
        var contentEditableRoot;
        contentEditableRoot = getContentEditableRoot(e.target);
        if (contentEditableRoot) {
          if (isContentEditableFalse$4(contentEditableRoot)) {
            e.preventDefault();
            editor.focus();
          }
          if (isContentEditableTrue$2(contentEditableRoot)) {
            if (editor.dom.isChildOf(contentEditableRoot, editor.selection.getNode())) {
              removeContentEditableSelection();
            }
          }
        }
      });
      editor.on('blur NewBlock', function () {
        removeContentEditableSelection();
      });
      var handleTouchSelect = function (editor) {
        var moved = false;
        editor.on('touchstart', function () {
          moved = false;
        });
        editor.on('touchmove', function () {
          moved = true;
        });
        editor.on('touchend', function (e) {
          var contentEditableRoot = getContentEditableRoot(e.target);
          if (isContentEditableFalse$4(contentEditableRoot)) {
            if (!moved) {
              e.preventDefault();
              setContentEditableSelection($_ebmpgm55jc7tm7yv.selectNode(editor, contentEditableRoot));
            }
          }
        });
      };
      var hasNormalCaretPosition = function (elm) {
        var caretWalker = CaretWalker(elm);
        if (!elm.firstChild) {
          return false;
        }
        var startPos = CaretPosition.before(elm.firstChild);
        var newPos = caretWalker.next(startPos);
        return newPos && !isBeforeContentEditableFalse(newPos) && !isAfterContentEditableFalse(newPos);
      };
      var isInSameBlock = function (node1, node2) {
        var block1 = editor.dom.getParent(node1, editor.dom.isBlock);
        var block2 = editor.dom.getParent(node2, editor.dom.isBlock);
        return block1 === block2;
      };
      var hasBetterMouseTarget = function (targetNode, caretNode) {
        var targetBlock = editor.dom.getParent(targetNode, editor.dom.isBlock);
        var caretBlock = editor.dom.getParent(caretNode, editor.dom.isBlock);
        return targetBlock && !isInSameBlock(targetBlock, caretBlock) && hasNormalCaretPosition(targetBlock);
      };
      handleTouchSelect(editor);
      editor.on('mousedown', function (e) {
        var contentEditableRoot;
        if ($_1f157949jc7tm7sb.isXYInContentArea(editor, e.clientX, e.clientY) === false) {
          return;
        }
        contentEditableRoot = getContentEditableRoot(e.target);
        if (contentEditableRoot) {
          if (isContentEditableFalse$4(contentEditableRoot)) {
            e.preventDefault();
            setContentEditableSelection($_ebmpgm55jc7tm7yv.selectNode(editor, contentEditableRoot));
          } else {
            removeContentEditableSelection();
            if (!(isContentEditableTrue$2(contentEditableRoot) && e.shiftKey) && !$_av8odt52jc7tm7yh.isXYWithinRange(e.clientX, e.clientY, editor.selection.getRng())) {
              editor.selection.placeCaretAt(e.clientX, e.clientY);
            }
          }
        } else {
          removeContentEditableSelection();
          hideFakeCaret();
          var caretInfo = $_87htka50jc7tm7y9.closestCaret(rootNode, e.clientX, e.clientY);
          if (caretInfo) {
            if (!hasBetterMouseTarget(e.target, caretInfo.node)) {
              e.preventDefault();
              editor.getBody().focus();
              setRange(showCaret(1, caretInfo.node, caretInfo.before));
            }
          }
        }
      });
      editor.on('keypress', function (e) {
        if ($_b5txs856jc7tm7z0.modifierPressed(e)) {
          return;
        }
        switch (e.keyCode) {
        default:
          if (isContentEditableFalse$4(editor.selection.getNode())) {
            e.preventDefault();
          }
          break;
        }
      });
      editor.on('getSelectionRange', function (e) {
        var rng = e.range;
        if (selectedContentEditableNode) {
          if (!selectedContentEditableNode.parentNode) {
            selectedContentEditableNode = null;
            return;
          }
          rng = rng.cloneRange();
          rng.selectNode(selectedContentEditableNode);
          e.range = rng;
        }
      });
      editor.on('setSelectionRange', function (e) {
        var rng;
        rng = setContentEditableSelection(e.range, e.forward);
        if (rng) {
          e.range = rng;
        }
      });
      editor.on('AfterSetSelectionRange', function (e) {
        var rng = e.range;
        if (!isRangeInCaretContainer(rng)) {
          hideFakeCaret();
        }
        if (!isFakeSelectionElement(rng.startContainer.parentNode)) {
          removeContentEditableSelection();
        }
      });
      editor.on('copy', function (e) {
        var clipboardData = e.clipboardData;
        if (!e.isDefaultPrevented() && e.clipboardData && !$_dtgtsy9jc7tm6gs.ie) {
          var realSelectionElement = getRealSelectionElement();
          if (realSelectionElement) {
            e.preventDefault();
            clipboardData.clearData();
            clipboardData.setData('text/html', realSelectionElement.outerHTML);
            clipboardData.setData('text/plain', realSelectionElement.outerText);
          }
        }
      });
      $_dxyzsi4xjc7tm7xo.init(editor);
      $_bawfbe53jc7tm7yl.setup(editor);
    };
    var addCss = function () {
      var styles = editor.contentStyles, rootClass = '.mce-content-body';
      styles.push(fakeCaret.getCss());
      styles.push(rootClass + ' .mce-offscreen-selection {' + 'position: absolute;' + 'left: -9999999999px;' + 'max-width: 1000000px;' + '}' + rootClass + ' *[contentEditable=false] {' + 'cursor: default;' + '}' + rootClass + ' *[contentEditable=true] {' + 'cursor: text;' + '}');
    };
    var isWithinCaretContainer = function (node) {
      return $_40segn20jc7tm75y.isCaretContainer(node) || $_40segn20jc7tm75y.startsWithCaretContainer(node) || $_40segn20jc7tm75y.endsWithCaretContainer(node);
    };
    var isRangeInCaretContainer = function (rng) {
      return isWithinCaretContainer(rng.startContainer) || isWithinCaretContainer(rng.endContainer);
    };
    var setContentEditableSelection = function (range, forward) {
      var node, $ = editor.$, dom = editor.dom, $realSelectionContainer, sel, startContainer, startOffset, endOffset, e, caretPosition, targetClone, origTargetClone;
      if (!range) {
        return null;
      }
      if (range.collapsed) {
        if (!isRangeInCaretContainer(range)) {
          if (forward === false) {
            caretPosition = getNormalizedRangeEndPoint(-1, range);
            if (isContentEditableFalse$4(caretPosition.getNode(true))) {
              return showCaret(-1, caretPosition.getNode(true), false);
            }
            if (isContentEditableFalse$4(caretPosition.getNode())) {
              return showCaret(-1, caretPosition.getNode(), !caretPosition.isAtEnd());
            }
          } else {
            caretPosition = getNormalizedRangeEndPoint(1, range);
            if (isContentEditableFalse$4(caretPosition.getNode())) {
              return showCaret(1, caretPosition.getNode(), !caretPosition.isAtEnd());
            }
            if (isContentEditableFalse$4(caretPosition.getNode(true))) {
              return showCaret(1, caretPosition.getNode(true), false);
            }
          }
        }
        return null;
      }
      startContainer = range.startContainer;
      startOffset = range.startOffset;
      endOffset = range.endOffset;
      if (startContainer.nodeType === 3 && startOffset === 0 && isContentEditableFalse$4(startContainer.parentNode)) {
        startContainer = startContainer.parentNode;
        startOffset = dom.nodeIndex(startContainer);
        startContainer = startContainer.parentNode;
      }
      if (startContainer.nodeType != 1) {
        return null;
      }
      if (endOffset == startOffset + 1) {
        node = startContainer.childNodes[startOffset];
      }
      if (!isContentEditableFalse$4(node)) {
        return null;
      }
      targetClone = origTargetClone = node.cloneNode(true);
      e = editor.fire('ObjectSelected', {
        target: node,
        targetClone: targetClone
      });
      if (e.isDefaultPrevented()) {
        return null;
      }
      $realSelectionContainer = $_d6v5nd31jc7tm7gs.descendant($_bscr39yjc7tm6uo.fromDom(editor.getBody()), '#' + realSelectionId).fold(function () {
        return $([]);
      }, function (elm) {
        return $([elm.dom()]);
      });
      targetClone = e.targetClone;
      if ($realSelectionContainer.length === 0) {
        $realSelectionContainer = $('<div data-mce-bogus="all" class="mce-offscreen-selection"></div>').attr('id', realSelectionId);
        $realSelectionContainer.appendTo(editor.getBody());
      }
      range = editor.dom.createRng();
      if (targetClone === origTargetClone && $_dtgtsy9jc7tm6gs.ie) {
        $realSelectionContainer.empty().append('<p style="font-size: 0" data-mce-bogus="all">\xA0</p>').append(targetClone);
        range.setStartAfter($realSelectionContainer[0].firstChild.firstChild);
        range.setEndAfter(targetClone);
      } else {
        $realSelectionContainer.empty().append('\xA0').append(targetClone).append('\xA0');
        range.setStart($realSelectionContainer[0].firstChild, 1);
        range.setEnd($realSelectionContainer[0].lastChild, 0);
      }
      $realSelectionContainer.css({ top: dom.getPos(node, editor.getBody()).y });
      $realSelectionContainer[0].focus();
      sel = editor.selection.getSel();
      sel.removeAllRanges();
      sel.addRange(range);
      $_20yqgb4jc7tm6aj.each($_8esf4w2kjc7tm7b6.descendants($_bscr39yjc7tm6uo.fromDom(editor.getBody()), '*[data-mce-selected]'), function (elm) {
        $_ftie1r14jc7tm6vz.remove(elm, 'data-mce-selected');
      });
      node.setAttribute('data-mce-selected', 1);
      selectedContentEditableNode = node;
      hideFakeCaret();
      return range;
    };
    var removeContentEditableSelection = function () {
      if (selectedContentEditableNode) {
        selectedContentEditableNode.removeAttribute('data-mce-selected');
        $_d6v5nd31jc7tm7gs.descendant($_bscr39yjc7tm6uo.fromDom(editor.getBody()), '#' + realSelectionId).each($_gi2jzz2gjc7tm7a2.remove);
        selectedContentEditableNode = null;
      }
    };
    var destroy = function () {
      fakeCaret.destroy();
      selectedContentEditableNode = null;
    };
    var hideFakeCaret = function () {
      fakeCaret.hide();
    };
    if ($_dtgtsy9jc7tm6gs.ceFalse) {
      registerEvents();
      addCss();
    }
    return {
      showCaret: showCaret,
      showBlockCaretContainer: showBlockCaretContainer,
      hideFakeCaret: hideFakeCaret,
      destroy: destroy
    };
  };

  var KEEP = 0;
  var INSERT = 1;
  var DELETE = 2;
  var diff = function (left, right) {
    var size = left.length + right.length + 2;
    var vDown = new Array(size);
    var vUp = new Array(size);
    var snake = function (start, end, diag) {
      return {
        start: start,
        end: end,
        diag: diag
      };
    };
    var buildScript = function (start1, end1, start2, end2, script) {
      var middle = getMiddleSnake(start1, end1, start2, end2);
      if (middle === null || middle.start === end1 && middle.diag === end1 - end2 || middle.end === start1 && middle.diag === start1 - start2) {
        var i = start1;
        var j = start2;
        while (i < end1 || j < end2) {
          if (i < end1 && j < end2 && left[i] === right[j]) {
            script.push([
              KEEP,
              left[i]
            ]);
            ++i;
            ++j;
          } else {
            if (end1 - start1 > end2 - start2) {
              script.push([
                DELETE,
                left[i]
              ]);
              ++i;
            } else {
              script.push([
                INSERT,
                right[j]
              ]);
              ++j;
            }
          }
        }
      } else {
        buildScript(start1, middle.start, start2, middle.start - middle.diag, script);
        for (var i2 = middle.start; i2 < middle.end; ++i2) {
          script.push([
            KEEP,
            left[i2]
          ]);
        }
        buildScript(middle.end, end1, middle.end - middle.diag, end2, script);
      }
    };
    var buildSnake = function (start, diag, end1, end2) {
      var end = start;
      while (end - diag < end2 && end < end1 && left[end] === right[end - diag]) {
        ++end;
      }
      return snake(start, end, diag);
    };
    var getMiddleSnake = function (start1, end1, start2, end2) {
      var m = end1 - start1;
      var n = end2 - start2;
      if (m === 0 || n === 0) {
        return null;
      }
      var delta = m - n;
      var sum = n + m;
      var offset = (sum % 2 === 0 ? sum : sum + 1) / 2;
      vDown[1 + offset] = start1;
      vUp[1 + offset] = end1 + 1;
      for (var d = 0; d <= offset; ++d) {
        for (var k = -d; k <= d; k += 2) {
          var i = k + offset;
          if (k === -d || k != d && vDown[i - 1] < vDown[i + 1]) {
            vDown[i] = vDown[i + 1];
          } else {
            vDown[i] = vDown[i - 1] + 1;
          }
          var x = vDown[i];
          var y = x - start1 + start2 - k;
          while (x < end1 && y < end2 && left[x] === right[y]) {
            vDown[i] = ++x;
            ++y;
          }
          if (delta % 2 != 0 && delta - d <= k && k <= delta + d) {
            if (vUp[i - delta] <= vDown[i]) {
              return buildSnake(vUp[i - delta], k + start1 - start2, end1, end2);
            }
          }
        }
        for (k = delta - d; k <= delta + d; k += 2) {
          i = k + offset - delta;
          if (k === delta - d || k != delta + d && vUp[i + 1] <= vUp[i - 1]) {
            vUp[i] = vUp[i + 1] - 1;
          } else {
            vUp[i] = vUp[i - 1];
          }
          x = vUp[i] - 1;
          y = x - start1 + start2 - k;
          while (x >= start1 && y >= start2 && left[x] === right[y]) {
            vUp[i] = x--;
            y--;
          }
          if (delta % 2 === 0 && -d <= k && k <= d) {
            if (vUp[i] <= vDown[i + delta]) {
              return buildSnake(vUp[i], k + start1 - start2, end1, end2);
            }
          }
        }
      }
    };
    var script = [];
    buildScript(0, left.length, 0, right.length, script);
    return script;
  };
  var $_g7rygk5ajc7tm7zs = {
    KEEP: KEEP,
    DELETE: DELETE,
    INSERT: INSERT,
    diff: diff
  };

  var getOuterHtml = function (elm) {
    if (elm.nodeType === 1) {
      return elm.outerHTML;
    } else if (elm.nodeType === 3) {
      return Entities.encodeRaw(elm.data, false);
    } else if (elm.nodeType === 8) {
      return '<!--' + elm.data + '-->';
    }
    return '';
  };
  var createFragment$1 = function (html) {
    var frag, node, container;
    container = document.createElement('div');
    frag = document.createDocumentFragment();
    if (html) {
      container.innerHTML = html;
    }
    while (node = container.firstChild) {
      frag.appendChild(node);
    }
    return frag;
  };
  var insertAt = function (elm, html, index) {
    var fragment = createFragment$1(html);
    if (elm.hasChildNodes() && index < elm.childNodes.length) {
      var target = elm.childNodes[index];
      target.parentNode.insertBefore(fragment, target);
    } else {
      elm.appendChild(fragment);
    }
  };
  var removeAt = function (elm, index) {
    if (elm.hasChildNodes() && index < elm.childNodes.length) {
      var target = elm.childNodes[index];
      target.parentNode.removeChild(target);
    }
  };
  var applyDiff = function (diff, elm) {
    var index = 0;
    $_gf68zqkjc7tm6r7.each(diff, function (action) {
      if (action[0] === $_g7rygk5ajc7tm7zs.KEEP) {
        index++;
      } else if (action[0] === $_g7rygk5ajc7tm7zs.INSERT) {
        insertAt(elm, action[1], index);
        index++;
      } else if (action[0] === $_g7rygk5ajc7tm7zs.DELETE) {
        removeAt(elm, index);
      }
    });
  };
  var read$2 = function (elm) {
    return $_gf68zqkjc7tm6r7.filter($_gf68zqkjc7tm6r7.map(elm.childNodes, getOuterHtml), function (item) {
      return item.length > 0;
    });
  };
  var write = function (fragments, elm) {
    var currentFragments = $_gf68zqkjc7tm6r7.map(elm.childNodes, getOuterHtml);
    applyDiff($_g7rygk5ajc7tm7zs.diff(currentFragments, fragments), elm);
    return elm;
  };
  var $_eq76we59jc7tm7zm = {
    read: read$2,
    write: write
  };

  var hasIframes = function (html) {
    return html.indexOf('</iframe>') !== -1;
  };
  var createFragmentedLevel = function (fragments) {
    return {
      type: 'fragmented',
      fragments: fragments,
      content: '',
      bookmark: null,
      beforeBookmark: null
    };
  };
  var createCompleteLevel = function (content) {
    return {
      type: 'complete',
      fragments: null,
      content: content,
      bookmark: null,
      beforeBookmark: null
    };
  };
  var createFromEditor = function (editor) {
    var fragments, content, trimmedFragments;
    fragments = $_eq76we59jc7tm7zm.read(editor.getBody());
    trimmedFragments = $_20yqgb4jc7tm6aj.bind(fragments, function (html) {
      var trimmed = $_fneq5042jc7tm7qk.trimInternal(editor.serializer, html);
      return trimmed.length > 0 ? [trimmed] : [];
    });
    content = trimmedFragments.join('');
    return hasIframes(content) ? createFragmentedLevel(trimmedFragments) : createCompleteLevel(content);
  };
  var applyToEditor = function (editor, level, before) {
    if (level.type === 'fragmented') {
      $_eq76we59jc7tm7zm.write(level.fragments, editor.getBody());
    } else {
      editor.setContent(level.content, { format: 'raw' });
    }
    editor.selection.moveToBookmark(before ? level.beforeBookmark : level.bookmark);
  };
  var getLevelContent = function (level) {
    return level.type === 'fragmented' ? level.fragments.join('') : level.content;
  };
  var isEq$4 = function (level1, level2) {
    return !!level1 && !!level2 && getLevelContent(level1) === getLevelContent(level2);
  };
  var $_dg4h6t58jc7tm7zh = {
    createFragmentedLevel: createFragmentedLevel,
    createCompleteLevel: createCompleteLevel,
    createFromEditor: createFromEditor,
    applyToEditor: applyToEditor,
    isEq: isEq$4
  };

  var UndoManager = function (editor) {
    var self = this, index = 0, data = [], beforeBookmark, isFirstTypedCharacter, locks = 0;
    var isUnlocked = function () {
      return locks === 0;
    };
    var setTyping = function (typing) {
      if (isUnlocked()) {
        self.typing = typing;
      }
    };
    var setDirty = function (state) {
      editor.setDirty(state);
    };
    var addNonTypingUndoLevel = function (e) {
      setTyping(false);
      self.add({}, e);
    };
    var endTyping = function () {
      if (self.typing) {
        setTyping(false);
        self.add();
      }
    };
    editor.on('init', function () {
      self.add();
    });
    editor.on('BeforeExecCommand', function (e) {
      var cmd = e.command;
      if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
        endTyping();
        self.beforeChange();
      }
    });
    editor.on('ExecCommand', function (e) {
      var cmd = e.command;
      if (cmd !== 'Undo' && cmd !== 'Redo' && cmd !== 'mceRepaint') {
        addNonTypingUndoLevel(e);
      }
    });
    editor.on('ObjectResizeStart Cut', function () {
      self.beforeChange();
    });
    editor.on('SaveContent ObjectResized blur', addNonTypingUndoLevel);
    editor.on('DragEnd', addNonTypingUndoLevel);
    editor.on('KeyUp', function (e) {
      var keyCode = e.keyCode;
      if (e.isDefaultPrevented()) {
        return;
      }
      if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45 || e.ctrlKey) {
        addNonTypingUndoLevel();
        editor.nodeChanged();
      }
      if (keyCode === 46 || keyCode === 8) {
        editor.nodeChanged();
      }
      if (isFirstTypedCharacter && self.typing && $_dg4h6t58jc7tm7zh.isEq($_dg4h6t58jc7tm7zh.createFromEditor(editor), data[0]) === false) {
        if (editor.isDirty() === false) {
          setDirty(true);
          editor.fire('change', {
            level: data[0],
            lastLevel: null
          });
        }
        editor.fire('TypingUndo');
        isFirstTypedCharacter = false;
        editor.nodeChanged();
      }
    });
    editor.on('KeyDown', function (e) {
      var keyCode = e.keyCode;
      if (e.isDefaultPrevented()) {
        return;
      }
      if (keyCode >= 33 && keyCode <= 36 || keyCode >= 37 && keyCode <= 40 || keyCode === 45) {
        if (self.typing) {
          addNonTypingUndoLevel(e);
        }
        return;
      }
      var modKey = e.ctrlKey && !e.altKey || e.metaKey;
      if ((keyCode < 16 || keyCode > 20) && keyCode !== 224 && keyCode !== 91 && !self.typing && !modKey) {
        self.beforeChange();
        setTyping(true);
        self.add({}, e);
        isFirstTypedCharacter = true;
      }
    });
    editor.on('MouseDown', function (e) {
      if (self.typing) {
        addNonTypingUndoLevel(e);
      }
    });
    editor.addShortcut('meta+z', '', 'Undo');
    editor.addShortcut('meta+y,meta+shift+z', '', 'Redo');
    editor.on('AddUndo Undo Redo ClearUndos', function (e) {
      if (!e.isDefaultPrevented()) {
        editor.nodeChanged();
      }
    });
    self = {
      data: data,
      typing: false,
      beforeChange: function () {
        if (isUnlocked()) {
          beforeBookmark = $_c3qhcz2ajc7tm78g.getUndoBookmark(editor.selection);
        }
      },
      add: function (level, event) {
        var i, settings = editor.settings, lastLevel, currentLevel;
        currentLevel = $_dg4h6t58jc7tm7zh.createFromEditor(editor);
        level = level || {};
        level = $_b8tc32jjc7tm6qi.extend(level, currentLevel);
        if (isUnlocked() === false || editor.removed) {
          return null;
        }
        lastLevel = data[index];
        if (editor.fire('BeforeAddUndo', {
            level: level,
            lastLevel: lastLevel,
            originalEvent: event
          }).isDefaultPrevented()) {
          return null;
        }
        if (lastLevel && $_dg4h6t58jc7tm7zh.isEq(lastLevel, level)) {
          return null;
        }
        if (data[index]) {
          data[index].beforeBookmark = beforeBookmark;
        }
        if (settings.custom_undo_redo_levels) {
          if (data.length > settings.custom_undo_redo_levels) {
            for (i = 0; i < data.length - 1; i++) {
              data[i] = data[i + 1];
            }
            data.length--;
            index = data.length;
          }
        }
        level.bookmark = $_c3qhcz2ajc7tm78g.getUndoBookmark(editor.selection);
        if (index < data.length - 1) {
          data.length = index + 1;
        }
        data.push(level);
        index = data.length - 1;
        var args = {
          level: level,
          lastLevel: lastLevel,
          originalEvent: event
        };
        editor.fire('AddUndo', args);
        if (index > 0) {
          setDirty(true);
          editor.fire('change', args);
        }
        return level;
      },
      undo: function () {
        var level;
        if (self.typing) {
          self.add();
          self.typing = false;
          setTyping(false);
        }
        if (index > 0) {
          level = data[--index];
          $_dg4h6t58jc7tm7zh.applyToEditor(editor, level, true);
          setDirty(true);
          editor.fire('undo', { level: level });
        }
        return level;
      },
      redo: function () {
        var level;
        if (index < data.length - 1) {
          level = data[++index];
          $_dg4h6t58jc7tm7zh.applyToEditor(editor, level, false);
          setDirty(true);
          editor.fire('redo', { level: level });
        }
        return level;
      },
      clear: function () {
        data = [];
        index = 0;
        self.typing = false;
        self.data = data;
        editor.fire('ClearUndos');
      },
      hasUndo: function () {
        return index > 0 || self.typing && data[0] && !$_dg4h6t58jc7tm7zh.isEq($_dg4h6t58jc7tm7zh.createFromEditor(editor), data[0]);
      },
      hasRedo: function () {
        return index < data.length - 1 && !self.typing;
      },
      transact: function (callback) {
        endTyping();
        self.beforeChange();
        self.ignore(callback);
        return self.add();
      },
      ignore: function (callback) {
        try {
          locks++;
          callback();
        } finally {
          locks--;
        }
      },
      extra: function (callback1, callback2) {
        var lastLevel, bookmark;
        if (self.transact(callback1)) {
          bookmark = data[index].bookmark;
          lastLevel = data[index - 1];
          $_dg4h6t58jc7tm7zh.applyToEditor(editor, lastLevel, true);
          if (self.transact(callback2)) {
            data[index - 1].beforeBookmark = bookmark;
          }
        }
      }
    };
    return self;
  };

  var postProcessHooks = {};
  var filter$2 = $_gf68zqkjc7tm6r7.filter;
  var each$14 = $_gf68zqkjc7tm6r7.each;
  var addPostProcessHook = function (name, hook) {
    var hooks = postProcessHooks[name];
    if (!hooks) {
      postProcessHooks[name] = hooks = [];
    }
    postProcessHooks[name].push(hook);
  };
  var postProcess = function (name, editor) {
    each$14(postProcessHooks[name], function (hook) {
      hook(editor);
    });
  };
  addPostProcessHook('pre', function (editor) {
    var rng = editor.selection.getRng(), isPre, blocks;
    var hasPreSibling = function (pre) {
      return isPre(pre.previousSibling) && $_gf68zqkjc7tm6r7.indexOf(blocks, pre.previousSibling) !== -1;
    };
    var joinPre = function (pre1, pre2) {
      DomQuery(pre2).remove();
      DomQuery(pre1).append('<br><br>').append(pre2.childNodes);
    };
    isPre = $_1qi2bn1qjc7tm70u.matchNodeNames('pre');
    if (!rng.collapsed) {
      blocks = editor.selection.getSelectedBlocks();
      each$14(filter$2(filter$2(blocks, isPre), hasPreSibling), function (pre) {
        joinPre(pre.previousSibling, pre);
      });
    }
  });
  var $_4ssstw5djc7tm80t = { postProcess: postProcess };

  var each$17 = $_b8tc32jjc7tm6qi.each;
  var getEndChild = function (container, index) {
    var childNodes = container.childNodes;
    index--;
    if (index > childNodes.length - 1) {
      index = childNodes.length - 1;
    } else if (index < 0) {
      index = 0;
    }
    return childNodes[index] || container;
  };
  var walk$1 = function (dom, rng, callback) {
    var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset, ancestor, startPoint, endPoint, node, parent, siblings, nodes;
    nodes = dom.select('td[data-mce-selected],th[data-mce-selected]');
    if (nodes.length > 0) {
      each$17(nodes, function (node) {
        callback([node]);
      });
      return;
    }
    var exclude = function (nodes) {
      var node;
      node = nodes[0];
      if (node.nodeType === 3 && node === startContainer && startOffset >= node.nodeValue.length) {
        nodes.splice(0, 1);
      }
      node = nodes[nodes.length - 1];
      if (endOffset === 0 && nodes.length > 0 && node === endContainer && node.nodeType === 3) {
        nodes.splice(nodes.length - 1, 1);
      }
      return nodes;
    };
    var collectSiblings = function (node, name, endNode) {
      var siblings = [];
      for (; node && node != endNode; node = node[name]) {
        siblings.push(node);
      }
      return siblings;
    };
    var findEndPoint = function (node, root) {
      do {
        if (node.parentNode === root) {
          return node;
        }
        node = node.parentNode;
      } while (node);
    };
    var walkBoundary = function (startNode, endNode, next) {
      var siblingName = next ? 'nextSibling' : 'previousSibling';
      for (node = startNode, parent = node.parentNode; node && node != endNode; node = parent) {
        parent = node.parentNode;
        siblings = collectSiblings(node === startNode ? node : node[siblingName], siblingName);
        if (siblings.length) {
          if (!next) {
            siblings.reverse();
          }
          callback(exclude(siblings));
        }
      }
    };
    if (startContainer.nodeType === 1 && startContainer.hasChildNodes()) {
      startContainer = startContainer.childNodes[startOffset];
    }
    if (endContainer.nodeType === 1 && endContainer.hasChildNodes()) {
      endContainer = getEndChild(endContainer, endOffset);
    }
    if (startContainer === endContainer) {
      return callback(exclude([startContainer]));
    }
    ancestor = dom.findCommonAncestor(startContainer, endContainer);
    for (node = startContainer; node; node = node.parentNode) {
      if (node === endContainer) {
        return walkBoundary(startContainer, ancestor, true);
      }
      if (node === ancestor) {
        break;
      }
    }
    for (node = endContainer; node; node = node.parentNode) {
      if (node === startContainer) {
        return walkBoundary(endContainer, ancestor);
      }
      if (node === ancestor) {
        break;
      }
    }
    startPoint = findEndPoint(startContainer, ancestor) || startContainer;
    endPoint = findEndPoint(endContainer, ancestor) || endContainer;
    walkBoundary(startContainer, startPoint, true);
    siblings = collectSiblings(startPoint === startContainer ? startPoint : startPoint.nextSibling, 'nextSibling', endPoint === endContainer ? endPoint.nextSibling : endPoint);
    if (siblings.length) {
      callback(exclude(siblings));
    }
    walkBoundary(endContainer, endPoint);
  };
  var $_5v48kh5gjc7tm81m = { walk: walk$1 };

  var MCE_ATTR_RE = /^(src|href|style)$/;
  var each$16 = $_b8tc32jjc7tm6qi.each;
  var isEq$5 = $_1y2ou73gjc7tm7lj.isEq;
  var isTableCell$3 = function (node) {
    return /^(TH|TD)$/.test(node.nodeName);
  };
  var getContainer = function (ed, rng, start) {
    var container, offset, lastIdx;
    container = rng[start ? 'startContainer' : 'endContainer'];
    offset = rng[start ? 'startOffset' : 'endOffset'];
    if ($_1qi2bn1qjc7tm70u.isElement(container)) {
      lastIdx = container.childNodes.length - 1;
      if (!start && offset) {
        offset--;
      }
      container = container.childNodes[offset > lastIdx ? lastIdx : offset];
    }
    if ($_1qi2bn1qjc7tm70u.isText(container) && start && offset >= container.nodeValue.length) {
      container = new TreeWalker(container, ed.getBody()).next() || container;
    }
    if ($_1qi2bn1qjc7tm70u.isText(container) && !start && offset === 0) {
      container = new TreeWalker(container, ed.getBody()).prev() || container;
    }
    return container;
  };
  var wrap$2 = function (dom, node, name, attrs) {
    var wrapper = dom.create(name, attrs);
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);
    return wrapper;
  };
  var matchName$1 = function (dom, node, format) {
    if (isEq$5(node, format.inline)) {
      return true;
    }
    if (isEq$5(node, format.block)) {
      return true;
    }
    if (format.selector) {
      return $_1qi2bn1qjc7tm70u.isElement(node) && dom.is(node, format.selector);
    }
  };
  var isColorFormatAndAnchor = function (node, format) {
    return format.links && node.tagName === 'A';
  };
  var find$4 = function (dom, node, next, inc) {
    node = $_1y2ou73gjc7tm7lj.getNonWhiteSpaceSibling(node, next, inc);
    return !node || (node.nodeName === 'BR' || dom.isBlock(node));
  };
  var removeNode$1 = function (ed, node, format) {
    var parentNode = node.parentNode, rootBlockElm;
    var dom = ed.dom, forcedRootBlock = ed.settings.forced_root_block;
    if (format.block) {
      if (!forcedRootBlock) {
        if (dom.isBlock(node) && !dom.isBlock(parentNode)) {
          if (!find$4(dom, node, false) && !find$4(dom, node.firstChild, true, 1)) {
            node.insertBefore(dom.create('br'), node.firstChild);
          }
          if (!find$4(dom, node, true) && !find$4(dom, node.lastChild, false, 1)) {
            node.appendChild(dom.create('br'));
          }
        }
      } else {
        if (parentNode === dom.getRoot()) {
          if (!format.list_block || !isEq$5(node, format.list_block)) {
            each$16($_b8tc32jjc7tm6qi.grep(node.childNodes), function (node) {
              if ($_1y2ou73gjc7tm7lj.isValid(ed, forcedRootBlock, node.nodeName.toLowerCase())) {
                if (!rootBlockElm) {
                  rootBlockElm = wrap$2(dom, node, forcedRootBlock);
                  dom.setAttribs(rootBlockElm, ed.settings.forced_root_block_attrs);
                } else {
                  rootBlockElm.appendChild(node);
                }
              } else {
                rootBlockElm = 0;
              }
            });
          }
        }
      }
    }
    if (format.selector && format.inline && !isEq$5(format.inline, node)) {
      return;
    }
    dom.remove(node, 1);
  };
  var removeFormat = function (ed, format, vars, node, compareNode) {
    var i, attrs, stylesModified, dom = ed.dom;
    if (!matchName$1(dom, node, format) && !isColorFormatAndAnchor(node, format)) {
      return false;
    }
    if (format.remove !== 'all') {
      each$16(format.styles, function (value, name) {
        value = $_1y2ou73gjc7tm7lj.normalizeStyleValue(dom, $_1y2ou73gjc7tm7lj.replaceVars(value, vars), name);
        if (typeof name === 'number') {
          name = value;
          compareNode = 0;
        }
        if (format.remove_similar || (!compareNode || isEq$5($_1y2ou73gjc7tm7lj.getStyle(dom, compareNode, name), value))) {
          dom.setStyle(node, name, '');
        }
        stylesModified = 1;
      });
      if (stylesModified && dom.getAttrib(node, 'style') === '') {
        node.removeAttribute('style');
        node.removeAttribute('data-mce-style');
      }
      each$16(format.attributes, function (value, name) {
        var valueOut;
        value = $_1y2ou73gjc7tm7lj.replaceVars(value, vars);
        if (typeof name === 'number') {
          name = value;
          compareNode = 0;
        }
        if (!compareNode || isEq$5(dom.getAttrib(compareNode, name), value)) {
          if (name === 'class') {
            value = dom.getAttrib(node, name);
            if (value) {
              valueOut = '';
              each$16(value.split(/\s+/), function (cls) {
                if (/mce\-\w+/.test(cls)) {
                  valueOut += (valueOut ? ' ' : '') + cls;
                }
              });
              if (valueOut) {
                dom.setAttrib(node, name, valueOut);
                return;
              }
            }
          }
          if (name === 'class') {
            node.removeAttribute('className');
          }
          if (MCE_ATTR_RE.test(name)) {
            node.removeAttribute('data-mce-' + name);
          }
          node.removeAttribute(name);
        }
      });
      each$16(format.classes, function (value) {
        value = $_1y2ou73gjc7tm7lj.replaceVars(value, vars);
        if (!compareNode || dom.hasClass(compareNode, value)) {
          dom.removeClass(node, value);
        }
      });
      attrs = dom.getAttribs(node);
      for (i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].nodeName;
        if (attrName.indexOf('_') !== 0 && attrName.indexOf('data-') !== 0) {
          return false;
        }
      }
    }
    if (format.remove !== 'none') {
      removeNode$1(ed, node, format);
      return true;
    }
  };
  var findFormatRoot = function (editor, container, name, vars, similar) {
    var formatRoot;
    each$16($_1y2ou73gjc7tm7lj.getParents(editor.dom, container.parentNode).reverse(), function (parent) {
      var format;
      if (!formatRoot && parent.id !== '_start' && parent.id !== '_end') {
        format = $_wz3my3hjc7tm7lo.matchNode(editor, parent, name, vars, similar);
        if (format && format.split !== false) {
          formatRoot = parent;
        }
      }
    });
    return formatRoot;
  };
  var wrapAndSplit = function (editor, formatList, formatRoot, container, target, split, format, vars) {
    var parent, clone, lastClone, firstClone, i, formatRootParent, dom = editor.dom;
    if (formatRoot) {
      formatRootParent = formatRoot.parentNode;
      for (parent = container.parentNode; parent && parent !== formatRootParent; parent = parent.parentNode) {
        clone = dom.clone(parent, false);
        for (i = 0; i < formatList.length; i++) {
          if (removeFormat(editor, formatList[i], vars, clone, clone)) {
            clone = 0;
            break;
          }
        }
        if (clone) {
          if (lastClone) {
            clone.appendChild(lastClone);
          }
          if (!firstClone) {
            firstClone = clone;
          }
          lastClone = clone;
        }
      }
      if (split && (!format.mixed || !dom.isBlock(formatRoot))) {
        container = dom.split(formatRoot, container);
      }
      if (lastClone) {
        target.parentNode.insertBefore(lastClone, target);
        firstClone.appendChild(target);
      }
    }
    return container;
  };
  var remove$4 = function (ed, name, vars, node, similar) {
    var formatList = ed.formatter.get(name), format = formatList[0];
    var bookmark, rng, contentEditable = true, dom = ed.dom, selection = ed.selection;
    var splitToFormatRoot = function (container) {
      var formatRoot = findFormatRoot(ed, container, name, vars, similar);
      return wrapAndSplit(ed, formatList, formatRoot, container, container, true, format, vars);
    };
    var process = function (node) {
      var children, i, l, lastContentEditable, hasContentEditableState;
      if ($_1qi2bn1qjc7tm70u.isElement(node) && dom.getContentEditable(node)) {
        lastContentEditable = contentEditable;
        contentEditable = dom.getContentEditable(node) === 'true';
        hasContentEditableState = true;
      }
      children = $_b8tc32jjc7tm6qi.grep(node.childNodes);
      if (contentEditable && !hasContentEditableState) {
        for (i = 0, l = formatList.length; i < l; i++) {
          if (removeFormat(ed, formatList[i], vars, node, node)) {
            break;
          }
        }
      }
      if (format.deep) {
        if (children.length) {
          for (i = 0, l = children.length; i < l; i++) {
            process(children[i]);
          }
          if (hasContentEditableState) {
            contentEditable = lastContentEditable;
          }
        }
      }
    };
    var unwrap = function (start) {
      var node = dom.get(start ? '_start' : '_end'), out = node[start ? 'firstChild' : 'lastChild'];
      if ($_am1og29jc7tm78b.isBookmarkNode(out)) {
        out = out[start ? 'firstChild' : 'lastChild'];
      }
      if ($_1qi2bn1qjc7tm70u.isText(out) && out.data.length === 0) {
        out = start ? node.previousSibling || node.nextSibling : node.nextSibling || node.previousSibling;
      }
      dom.remove(node, true);
      return out;
    };
    var removeRngStyle = function (rng) {
      var startContainer, endContainer;
      var commonAncestorContainer = rng.commonAncestorContainer;
      rng = $_f7qs4i3fjc7tm7l4.expandRng(ed, rng, formatList, true);
      if (format.split) {
        startContainer = getContainer(ed, rng, true);
        endContainer = getContainer(ed, rng);
        if (startContainer !== endContainer) {
          if (/^(TR|TH|TD)$/.test(startContainer.nodeName) && startContainer.firstChild) {
            if (startContainer.nodeName === 'TR') {
              startContainer = startContainer.firstChild.firstChild || startContainer;
            } else {
              startContainer = startContainer.firstChild || startContainer;
            }
          }
          if (commonAncestorContainer && /^T(HEAD|BODY|FOOT|R)$/.test(commonAncestorContainer.nodeName) && isTableCell$3(endContainer) && endContainer.firstChild) {
            endContainer = endContainer.firstChild || endContainer;
          }
          if (dom.isChildOf(startContainer, endContainer) && startContainer !== endContainer && !dom.isBlock(endContainer) && !isTableCell$3(startContainer) && !isTableCell$3(endContainer)) {
            startContainer = wrap$2(dom, startContainer, 'span', {
              id: '_start',
              'data-mce-type': 'bookmark'
            });
            splitToFormatRoot(startContainer);
            startContainer = unwrap(true);
            return;
          }
          startContainer = wrap$2(dom, startContainer, 'span', {
            id: '_start',
            'data-mce-type': 'bookmark'
          });
          endContainer = wrap$2(dom, endContainer, 'span', {
            id: '_end',
            'data-mce-type': 'bookmark'
          });
          splitToFormatRoot(startContainer);
          splitToFormatRoot(endContainer);
          startContainer = unwrap(true);
          endContainer = unwrap();
        } else {
          startContainer = endContainer = splitToFormatRoot(startContainer);
        }
        rng.startContainer = startContainer.parentNode ? startContainer.parentNode : startContainer;
        rng.startOffset = dom.nodeIndex(startContainer);
        rng.endContainer = endContainer.parentNode ? endContainer.parentNode : endContainer;
        rng.endOffset = dom.nodeIndex(endContainer) + 1;
      }
      $_5v48kh5gjc7tm81m.walk(dom, rng, function (nodes) {
        each$16(nodes, function (node) {
          process(node);
          if ($_1qi2bn1qjc7tm70u.isElement(node) && ed.dom.getStyle(node, 'text-decoration') === 'underline' && node.parentNode && $_1y2ou73gjc7tm7lj.getTextDecoration(dom, node.parentNode) === 'underline') {
            removeFormat(ed, {
              'deep': false,
              'exact': true,
              'inline': 'span',
              'styles': { 'textDecoration': 'underline' }
            }, null, node);
          }
        });
      });
    };
    if (node) {
      if (node.nodeType) {
        rng = dom.createRng();
        rng.setStartBefore(node);
        rng.setEndAfter(node);
        removeRngStyle(rng);
      } else {
        removeRngStyle(node);
      }
      return;
    }
    if (dom.getContentEditable(selection.getNode()) === 'false') {
      node = selection.getNode();
      for (var i = 0, l = formatList.length; i < l; i++) {
        if (formatList[i].ceFalseOverride) {
          if (removeFormat(ed, formatList[i], vars, node, node)) {
            break;
          }
        }
      }
      return;
    }
    if (!selection.isCollapsed() || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
      bookmark = selection.getBookmark();
      removeRngStyle(selection.getRng(true));
      selection.moveToBookmark(bookmark);
      if (format.inline && $_wz3my3hjc7tm7lo.match(ed, name, vars, selection.getStart())) {
        $_1y2ou73gjc7tm7lj.moveStart(dom, selection, selection.getRng(true));
      }
      ed.nodeChanged();
    } else {
      $_316jl3ejc7tm7kg.removeCaretFormat(ed, name, vars, similar);
    }
  };
  var $_14757i5fjc7tm819 = {
    removeFormat: removeFormat,
    remove: remove$4
  };

  var each$15 = $_b8tc32jjc7tm6qi.each;
  var isElementNode$1 = function (node) {
    return node && node.nodeType === 1 && !$_am1og29jc7tm78b.isBookmarkNode(node) && !$_316jl3ejc7tm7kg.isCaretNode(node) && !$_1qi2bn1qjc7tm70u.isBogus(node);
  };
  var findElementSibling = function (node, siblingName) {
    var sibling;
    for (sibling = node; sibling; sibling = sibling[siblingName]) {
      if (sibling.nodeType === 3 && sibling.nodeValue.length !== 0) {
        return node;
      }
      if (sibling.nodeType === 1 && !$_am1og29jc7tm78b.isBookmarkNode(sibling)) {
        return sibling;
      }
    }
    return node;
  };
  var mergeSiblingsNodes = function (dom, prev, next) {
    var sibling, tmpSibling, elementUtils = new ElementUtils(dom);
    if (prev && next) {
      prev = findElementSibling(prev, 'previousSibling');
      next = findElementSibling(next, 'nextSibling');
      if (elementUtils.compare(prev, next)) {
        for (sibling = prev.nextSibling; sibling && sibling !== next;) {
          tmpSibling = sibling;
          sibling = sibling.nextSibling;
          prev.appendChild(tmpSibling);
        }
        dom.remove(next);
        $_b8tc32jjc7tm6qi.each($_b8tc32jjc7tm6qi.grep(next.childNodes), function (node) {
          prev.appendChild(node);
        });
        return prev;
      }
    }
    return next;
  };
  var processChildElements$1 = function (node, filter, process) {
    each$15(node.childNodes, function (node) {
      if (isElementNode$1(node)) {
        if (filter(node)) {
          process(node);
        }
        if (node.hasChildNodes()) {
          processChildElements$1(node, filter, process);
        }
      }
    });
  };
  var hasStyle = function (dom, name) {
    return $_f41mrx6jc7tm6cd.curry(function (name, node) {
      return !!(node && $_1y2ou73gjc7tm7lj.getStyle(dom, node, name));
    }, name);
  };
  var applyStyle = function (dom, name, value) {
    return $_f41mrx6jc7tm6cd.curry(function (name, value, node) {
      dom.setStyle(node, name, value);
      if (node.getAttribute('style') === '') {
        node.removeAttribute('style');
      }
      unwrapEmptySpan(dom, node);
    }, name, value);
  };
  var unwrapEmptySpan = function (dom, node) {
    if (node.nodeName === 'SPAN' && dom.getAttribs(node).length === 0) {
      dom.remove(node, true);
    }
  };
  var processUnderlineAndColor = function (dom, node) {
    var textDecoration;
    if (node.nodeType === 1 && node.parentNode && node.parentNode.nodeType === 1) {
      textDecoration = $_1y2ou73gjc7tm7lj.getTextDecoration(dom, node.parentNode);
      if (dom.getStyle(node, 'color') && textDecoration) {
        dom.setStyle(node, 'text-decoration', textDecoration);
      } else if (dom.getStyle(node, 'text-decoration') === textDecoration) {
        dom.setStyle(node, 'text-decoration', null);
      }
    }
  };
  var mergeUnderlineAndColor = function (dom, format, vars, node) {
    if (format.styles.color || format.styles.textDecoration) {
      $_b8tc32jjc7tm6qi.walk(node, $_f41mrx6jc7tm6cd.curry(processUnderlineAndColor, dom), 'childNodes');
      processUnderlineAndColor(dom, node);
    }
  };
  var mergeBackgroundColorAndFontSize = function (dom, format, vars, node) {
    if (format.styles && format.styles.backgroundColor) {
      processChildElements$1(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'backgroundColor', $_1y2ou73gjc7tm7lj.replaceVars(format.styles.backgroundColor, vars)));
    }
  };
  var mergeSubSup = function (dom, format, vars, node) {
    if (format.inline === 'sub' || format.inline === 'sup') {
      processChildElements$1(node, hasStyle(dom, 'fontSize'), applyStyle(dom, 'fontSize', ''));
      dom.remove(dom.select(format.inline === 'sup' ? 'sub' : 'sup', node), true);
    }
  };
  var mergeSiblings = function (dom, format, vars, node) {
    if (node && format.merge_siblings !== false) {
      node = mergeSiblingsNodes(dom, $_1y2ou73gjc7tm7lj.getNonWhiteSpaceSibling(node), node);
      node = mergeSiblingsNodes(dom, node, $_1y2ou73gjc7tm7lj.getNonWhiteSpaceSibling(node, true));
    }
  };
  var clearChildStyles = function (dom, format, node) {
    if (format.clear_child_styles) {
      var selector = format.links ? '*:not(a)' : '*';
      each$15(dom.select(selector, node), function (node) {
        if (isElementNode$1(node)) {
          each$15(format.styles, function (value, name) {
            dom.setStyle(node, name, '');
          });
        }
      });
    }
  };
  var mergeWithChildren = function (editor, formatList, vars, node) {
    each$15(formatList, function (format) {
      each$15(editor.dom.select(format.inline, node), function (child) {
        if (!isElementNode$1(child)) {
          return;
        }
        $_14757i5fjc7tm819.removeFormat(editor, format, vars, child, format.exact ? child : null);
      });
      clearChildStyles(editor.dom, format, node);
    });
  };
  var mergeWithParents = function (editor, format, name, vars, node) {
    if ($_wz3my3hjc7tm7lo.matchNode(editor, node.parentNode, name, vars)) {
      if ($_14757i5fjc7tm819.removeFormat(editor, format, vars, node)) {
        return;
      }
    }
    if (format.merge_with_parents) {
      editor.dom.getParent(node.parentNode, function (parent) {
        if ($_wz3my3hjc7tm7lo.matchNode(editor, parent, name, vars)) {
          $_14757i5fjc7tm819.removeFormat(editor, format, vars, node);
          return true;
        }
      });
    }
  };
  var $_b5071q5ejc7tm80z = {
    mergeWithChildren: mergeWithChildren,
    mergeUnderlineAndColor: mergeUnderlineAndColor,
    mergeBackgroundColorAndFontSize: mergeBackgroundColorAndFontSize,
    mergeSubSup: mergeSubSup,
    mergeSiblings: mergeSiblings,
    mergeWithParents: mergeWithParents
  };

  var each$13 = $_b8tc32jjc7tm6qi.each;
  var isElementNode = function (node) {
    return node && node.nodeType === 1 && !$_am1og29jc7tm78b.isBookmarkNode(node) && !$_316jl3ejc7tm7kg.isCaretNode(node) && !$_1qi2bn1qjc7tm70u.isBogus(node);
  };
  var applyFormat = function (ed, name, vars, node) {
    var formatList = ed.formatter.get(name), format = formatList[0], bookmark, rng, isCollapsed = !node && ed.selection.isCollapsed();
    var dom = ed.dom, selection = ed.selection;
    var setElementFormat = function (elm, fmt) {
      fmt = fmt || format;
      if (elm) {
        if (fmt.onformat) {
          fmt.onformat(elm, fmt, vars, node);
        }
        each$13(fmt.styles, function (value, name) {
          dom.setStyle(elm, name, $_1y2ou73gjc7tm7lj.replaceVars(value, vars));
        });
        if (fmt.styles) {
          var styleVal = dom.getAttrib(elm, 'style');
          if (styleVal) {
            elm.setAttribute('data-mce-style', styleVal);
          }
        }
        each$13(fmt.attributes, function (value, name) {
          dom.setAttrib(elm, name, $_1y2ou73gjc7tm7lj.replaceVars(value, vars));
        });
        each$13(fmt.classes, function (value) {
          value = $_1y2ou73gjc7tm7lj.replaceVars(value, vars);
          if (!dom.hasClass(elm, value)) {
            dom.addClass(elm, value);
          }
        });
      }
    };
    var applyNodeStyle = function (formatList, node) {
      var found = false;
      if (!format.selector) {
        return false;
      }
      each$13(formatList, function (format) {
        if ('collapsed' in format && format.collapsed !== isCollapsed) {
          return;
        }
        if (dom.is(node, format.selector) && !$_316jl3ejc7tm7kg.isCaretNode(node)) {
          setElementFormat(node, format);
          found = true;
          return false;
        }
      });
      return found;
    };
    var applyRngStyle = function (dom, rng, bookmark, nodeSpecific) {
      var newWrappers = [], wrapName, wrapElm, contentEditable = true;
      wrapName = format.inline || format.block;
      wrapElm = dom.create(wrapName);
      setElementFormat(wrapElm);
      $_5v48kh5gjc7tm81m.walk(dom, rng, function (nodes) {
        var currentWrapElm;
        var process = function (node) {
          var nodeName, parentName, hasContentEditableState, lastContentEditable;
          lastContentEditable = contentEditable;
          nodeName = node.nodeName.toLowerCase();
          parentName = node.parentNode.nodeName.toLowerCase();
          if (node.nodeType === 1 && dom.getContentEditable(node)) {
            lastContentEditable = contentEditable;
            contentEditable = dom.getContentEditable(node) === 'true';
            hasContentEditableState = true;
          }
          if ($_1y2ou73gjc7tm7lj.isEq(nodeName, 'br')) {
            currentWrapElm = 0;
            if (format.block) {
              dom.remove(node);
            }
            return;
          }
          if (format.wrapper && $_wz3my3hjc7tm7lo.matchNode(ed, node, name, vars)) {
            currentWrapElm = 0;
            return;
          }
          if (contentEditable && !hasContentEditableState && format.block && !format.wrapper && $_1y2ou73gjc7tm7lj.isTextBlock(ed, nodeName) && $_1y2ou73gjc7tm7lj.isValid(ed, parentName, wrapName)) {
            node = dom.rename(node, wrapName);
            setElementFormat(node);
            newWrappers.push(node);
            currentWrapElm = 0;
            return;
          }
          if (format.selector) {
            var found = applyNodeStyle(formatList, node);
            if (!format.inline || found) {
              currentWrapElm = 0;
              return;
            }
          }
          if (contentEditable && !hasContentEditableState && $_1y2ou73gjc7tm7lj.isValid(ed, wrapName, nodeName) && $_1y2ou73gjc7tm7lj.isValid(ed, parentName, wrapName) && !(!nodeSpecific && node.nodeType === 3 && node.nodeValue.length === 1 && node.nodeValue.charCodeAt(0) === 65279) && !$_316jl3ejc7tm7kg.isCaretNode(node) && (!format.inline || !dom.isBlock(node))) {
            if (!currentWrapElm) {
              currentWrapElm = dom.clone(wrapElm, false);
              node.parentNode.insertBefore(currentWrapElm, node);
              newWrappers.push(currentWrapElm);
            }
            currentWrapElm.appendChild(node);
          } else {
            currentWrapElm = 0;
            each$13($_b8tc32jjc7tm6qi.grep(node.childNodes), process);
            if (hasContentEditableState) {
              contentEditable = lastContentEditable;
            }
            currentWrapElm = 0;
          }
        };
        each$13(nodes, process);
      });
      if (format.links === true) {
        each$13(newWrappers, function (node) {
          var process = function (node) {
            if (node.nodeName === 'A') {
              setElementFormat(node, format);
            }
            each$13($_b8tc32jjc7tm6qi.grep(node.childNodes), process);
          };
          process(node);
        });
      }
      each$13(newWrappers, function (node) {
        var childCount;
        var getChildCount = function (node) {
          var count = 0;
          each$13(node.childNodes, function (node) {
            if (!$_1y2ou73gjc7tm7lj.isWhiteSpaceNode(node) && !$_am1og29jc7tm78b.isBookmarkNode(node)) {
              count++;
            }
          });
          return count;
        };
        var getChildElementNode = function (root) {
          var child = false;
          each$13(root.childNodes, function (node) {
            if (isElementNode(node)) {
              child = node;
              return false;
            }
          });
          return child;
        };
        var mergeStyles = function (node) {
          var child, clone;
          child = getChildElementNode(node);
          if (child && !$_am1og29jc7tm78b.isBookmarkNode(child) && $_wz3my3hjc7tm7lo.matchName(dom, child, format)) {
            clone = dom.clone(child, false);
            setElementFormat(clone);
            dom.replace(clone, node, true);
            dom.remove(child, 1);
          }
          return clone || node;
        };
        childCount = getChildCount(node);
        if ((newWrappers.length > 1 || !dom.isBlock(node)) && childCount === 0) {
          dom.remove(node, 1);
          return;
        }
        if (format.inline || format.wrapper) {
          if (!format.exact && childCount === 1) {
            node = mergeStyles(node);
          }
          $_b5071q5ejc7tm80z.mergeWithChildren(ed, formatList, vars, node);
          $_b5071q5ejc7tm80z.mergeWithParents(ed, format, name, vars, node);
          $_b5071q5ejc7tm80z.mergeBackgroundColorAndFontSize(dom, format, vars, node);
          $_b5071q5ejc7tm80z.mergeSubSup(dom, format, vars, node);
          $_b5071q5ejc7tm80z.mergeSiblings(dom, format, vars, node);
        }
      });
    };
    if (dom.getContentEditable(selection.getNode()) === 'false') {
      node = selection.getNode();
      for (var i = 0, l = formatList.length; i < l; i++) {
        if (formatList[i].ceFalseOverride && dom.is(node, formatList[i].selector)) {
          setElementFormat(node, formatList[i]);
          return;
        }
      }
      return;
    }
    if (format) {
      if (node) {
        if (node.nodeType) {
          if (!applyNodeStyle(formatList, node)) {
            rng = dom.createRng();
            rng.setStartBefore(node);
            rng.setEndAfter(node);
            applyRngStyle(dom, $_f7qs4i3fjc7tm7l4.expandRng(ed, rng, formatList), null, true);
          }
        } else {
          applyRngStyle(dom, node, null, true);
        }
      } else {
        if (!isCollapsed || !format.inline || dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
          var curSelNode = ed.selection.getNode();
          if (!ed.settings.forced_root_block && formatList[0].defaultBlock && !dom.getParent(curSelNode, dom.isBlock)) {
            applyFormat(ed, formatList[0].defaultBlock);
          }
          ed.selection.setRng($_f0orrf2ojc7tm7c3.normalize(ed.selection.getRng()));
          bookmark = selection.getBookmark();
          applyRngStyle(dom, $_f7qs4i3fjc7tm7l4.expandRng(ed, selection.getRng(true), formatList), bookmark);
          if (format.styles) {
            $_b5071q5ejc7tm80z.mergeUnderlineAndColor(dom, format, vars, curSelNode);
          }
          selection.moveToBookmark(bookmark);
          $_1y2ou73gjc7tm7lj.moveStart(dom, selection, selection.getRng(true));
          ed.nodeChanged();
        } else {
          $_316jl3ejc7tm7kg.applyCaretFormat(ed, name, vars);
        }
      }
      $_4ssstw5djc7tm80t.postProcess(name, ed);
    }
  };
  var $_953im05cjc7tm80g = { applyFormat: applyFormat };

  var each$18 = $_b8tc32jjc7tm6qi.each;
  var setup$3 = function (formatChangeData, editor) {
    var currentFormats = {};
    formatChangeData.set({});
    editor.on('NodeChange', function (e) {
      var parents = $_1y2ou73gjc7tm7lj.getParents(editor.dom, e.element), matchedFormats = {};
      parents = $_b8tc32jjc7tm6qi.grep(parents, function (node) {
        return node.nodeType === 1 && !node.getAttribute('data-mce-bogus');
      });
      each$18(formatChangeData.get(), function (callbacks, format) {
        each$18(parents, function (node) {
          if (editor.formatter.matchNode(node, format, {}, callbacks.similar)) {
            if (!currentFormats[format]) {
              each$18(callbacks, function (callback) {
                callback(true, {
                  node: node,
                  format: format,
                  parents: parents
                });
              });
              currentFormats[format] = callbacks;
            }
            matchedFormats[format] = callbacks;
            return false;
          }
          if ($_wz3my3hjc7tm7lo.matchesUnInheritedFormatSelector(editor, node, format)) {
            return false;
          }
        });
      });
      each$18(currentFormats, function (callbacks, format) {
        if (!matchedFormats[format]) {
          delete currentFormats[format];
          each$18(callbacks, function (callback) {
            callback(false, {
              node: e.element,
              format: format,
              parents: parents
            });
          });
        }
      });
    });
  };
  var addListeners = function (formatChangeData, formats, callback, similar) {
    var formatChangeItems = formatChangeData.get();
    each$18(formats.split(','), function (format) {
      if (!formatChangeItems[format]) {
        formatChangeItems[format] = [];
        formatChangeItems[format].similar = similar;
      }
      formatChangeItems[format].push(callback);
    });
    formatChangeData.set(formatChangeItems);
  };
  var formatChanged = function (editor, formatChangeState, formats, callback, similar) {
    if (formatChangeState.get() === null) {
      setup$3(formatChangeState, editor);
    }
    addListeners(formatChangeState, formats, callback, similar);
  };
  var $_8pb30b5hjc7tm81t = { formatChanged: formatChanged };

  var get$4 = function (dom) {
    var formats = {
      valigntop: [{
          selector: 'td,th',
          styles: { 'verticalAlign': 'top' }
        }],
      valignmiddle: [{
          selector: 'td,th',
          styles: { 'verticalAlign': 'middle' }
        }],
      valignbottom: [{
          selector: 'td,th',
          styles: { 'verticalAlign': 'bottom' }
        }],
      alignleft: [
        {
          selector: 'figure.image',
          collapsed: false,
          classes: 'align-left',
          ceFalseOverride: true,
          preview: 'font-family font-size'
        },
        {
          selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
          styles: { textAlign: 'left' },
          inherit: false,
          preview: false,
          defaultBlock: 'div'
        },
        {
          selector: 'img,table',
          collapsed: false,
          styles: { 'float': 'left' },
          preview: 'font-family font-size'
        }
      ],
      aligncenter: [
        {
          selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
          styles: { textAlign: 'center' },
          inherit: false,
          preview: 'font-family font-size',
          defaultBlock: 'div'
        },
        {
          selector: 'figure.image',
          collapsed: false,
          classes: 'align-center',
          ceFalseOverride: true,
          preview: 'font-family font-size'
        },
        {
          selector: 'img',
          collapsed: false,
          styles: {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          },
          preview: false
        },
        {
          selector: 'table',
          collapsed: false,
          styles: {
            marginLeft: 'auto',
            marginRight: 'auto'
          },
          preview: 'font-family font-size'
        }
      ],
      alignright: [
        {
          selector: 'figure.image',
          collapsed: false,
          classes: 'align-right',
          ceFalseOverride: true,
          preview: 'font-family font-size'
        },
        {
          selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
          styles: { textAlign: 'right' },
          inherit: false,
          preview: 'font-family font-size',
          defaultBlock: 'div'
        },
        {
          selector: 'img,table',
          collapsed: false,
          styles: { 'float': 'right' },
          preview: 'font-family font-size'
        }
      ],
      alignjustify: [{
          selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
          styles: { textAlign: 'justify' },
          inherit: false,
          defaultBlock: 'div',
          preview: 'font-family font-size'
        }],
      bold: [
        {
          inline: 'strong',
          remove: 'all'
        },
        {
          inline: 'span',
          styles: { fontWeight: 'bold' }
        },
        {
          inline: 'b',
          remove: 'all'
        }
      ],
      italic: [
        {
          inline: 'em',
          remove: 'all'
        },
        {
          inline: 'span',
          styles: { fontStyle: 'italic' }
        },
        {
          inline: 'i',
          remove: 'all'
        }
      ],
      underline: [
        {
          inline: 'span',
          styles: { textDecoration: 'underline' },
          exact: true
        },
        {
          inline: 'u',
          remove: 'all'
        }
      ],
      strikethrough: [
        {
          inline: 'span',
          styles: { textDecoration: 'line-through' },
          exact: true
        },
        {
          inline: 'strike',
          remove: 'all'
        }
      ],
      forecolor: {
        inline: 'span',
        styles: { color: '%value' },
        links: true,
        remove_similar: true,
        clear_child_styles: true
      },
      hilitecolor: {
        inline: 'span',
        styles: { backgroundColor: '%value' },
        links: true,
        remove_similar: true,
        clear_child_styles: true
      },
      fontname: {
        inline: 'span',
        styles: { fontFamily: '%value' },
        clear_child_styles: true
      },
      fontsize: {
        inline: 'span',
        styles: { fontSize: '%value' },
        clear_child_styles: true
      },
      fontsize_class: {
        inline: 'span',
        attributes: { 'class': '%value' }
      },
      blockquote: {
        block: 'blockquote',
        wrapper: 1,
        remove: 'all'
      },
      subscript: { inline: 'sub' },
      superscript: { inline: 'sup' },
      code: { inline: 'code' },
      link: {
        inline: 'a',
        selector: 'a',
        remove: 'all',
        split: true,
        deep: true,
        onmatch: function () {
          return true;
        },
        onformat: function (elm, fmt, vars) {
          $_b8tc32jjc7tm6qi.each(vars, function (value, key) {
            dom.setAttrib(elm, key, value);
          });
        }
      },
      removeformat: [
        {
          selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
          remove: 'all',
          split: true,
          expand: false,
          block_expand: true,
          deep: true
        },
        {
          selector: 'span',
          attributes: [
            'style',
            'class'
          ],
          remove: 'empty',
          split: true,
          expand: false,
          deep: true
        },
        {
          selector: '*',
          attributes: [
            'style',
            'class'
          ],
          split: false,
          expand: false,
          deep: true
        }
      ]
    };
    $_b8tc32jjc7tm6qi.each('p h1 h2 h3 h4 h5 h6 div address pre div dt dd samp'.split(/\s/), function (name) {
      formats[name] = {
        block: name,
        remove: 'all'
      };
    });
    return formats;
  };
  var $_74lgdv5jjc7tm824 = { get: get$4 };

  var FormatRegistry = function (editor) {
    var formats = {};
    var get = function (name) {
      return name ? formats[name] : formats;
    };
    var register = function (name, format) {
      if (name) {
        if (typeof name !== 'string') {
          $_b8tc32jjc7tm6qi.each(name, function (format, name) {
            register(name, format);
          });
        } else {
          format = format.length ? format : [format];
          $_b8tc32jjc7tm6qi.each(format, function (format) {
            if (typeof format.deep === 'undefined') {
              format.deep = !format.selector;
            }
            if (typeof format.split === 'undefined') {
              format.split = !format.selector || format.inline;
            }
            if (typeof format.remove === 'undefined' && format.selector && !format.inline) {
              format.remove = 'none';
            }
            if (format.selector && format.inline) {
              format.mixed = true;
              format.block_expand = true;
            }
            if (typeof format.classes === 'string') {
              format.classes = format.classes.split(/\s+/);
            }
          });
          formats[name] = format;
        }
      }
    };
    var unregister = function (name) {
      if (name && formats[name]) {
        delete formats[name];
      }
      return formats;
    };
    register($_74lgdv5jjc7tm824.get(editor.dom));
    register(editor.settings.formats);
    return {
      get: get,
      register: register,
      unregister: unregister
    };
  };

  var each$19 = $_b8tc32jjc7tm6qi.each;
  var dom = DOMUtils.DOM;
  var parsedSelectorToHtml = function (ancestry, editor) {
    var elm, item, fragment;
    var schema = editor && editor.schema || Schema({});
    var decorate = function (elm, item) {
      if (item.classes.length) {
        dom.addClass(elm, item.classes.join(' '));
      }
      dom.setAttribs(elm, item.attrs);
    };
    var createElement = function (sItem) {
      var elm;
      item = typeof sItem === 'string' ? {
        name: sItem,
        classes: [],
        attrs: {}
      } : sItem;
      elm = dom.create(item.name);
      decorate(elm, item);
      return elm;
    };
    var getRequiredParent = function (elm, candidate) {
      var name = typeof elm !== 'string' ? elm.nodeName.toLowerCase() : elm;
      var elmRule = schema.getElementRule(name);
      var parentsRequired = elmRule && elmRule.parentsRequired;
      if (parentsRequired && parentsRequired.length) {
        return candidate && $_b8tc32jjc7tm6qi.inArray(parentsRequired, candidate) !== -1 ? candidate : parentsRequired[0];
      } else {
        return false;
      }
    };
    var wrapInHtml = function (elm, ancestry, siblings) {
      var parent, parentCandidate, parentRequired;
      var ancestor = ancestry.length > 0 && ancestry[0];
      var ancestorName = ancestor && ancestor.name;
      parentRequired = getRequiredParent(elm, ancestorName);
      if (parentRequired) {
        if (ancestorName === parentRequired) {
          parentCandidate = ancestry[0];
          ancestry = ancestry.slice(1);
        } else {
          parentCandidate = parentRequired;
        }
      } else if (ancestor) {
        parentCandidate = ancestry[0];
        ancestry = ancestry.slice(1);
      } else if (!siblings) {
        return elm;
      }
      if (parentCandidate) {
        parent = createElement(parentCandidate);
        parent.appendChild(elm);
      }
      if (siblings) {
        if (!parent) {
          parent = dom.create('div');
          parent.appendChild(elm);
        }
        $_b8tc32jjc7tm6qi.each(siblings, function (sibling) {
          var siblingElm = createElement(sibling);
          parent.insertBefore(siblingElm, elm);
        });
      }
      return wrapInHtml(parent, ancestry, parentCandidate && parentCandidate.siblings);
    };
    if (ancestry && ancestry.length) {
      item = ancestry[0];
      elm = createElement(item);
      fragment = dom.create('div');
      fragment.appendChild(wrapInHtml(elm, ancestry.slice(1), item.siblings));
      return fragment;
    } else {
      return '';
    }
  };
  var selectorToHtml = function (selector, editor) {
    return parsedSelectorToHtml(parseSelector(selector), editor);
  };
  var parseSelectorItem = function (item) {
    var tagName;
    var obj = {
      classes: [],
      attrs: {}
    };
    item = obj.selector = $_b8tc32jjc7tm6qi.trim(item);
    if (item !== '*') {
      tagName = item.replace(/(?:([#\.]|::?)([\w\-]+)|(\[)([^\]]+)\]?)/g, function ($0, $1, $2, $3, $4) {
        switch ($1) {
        case '#':
          obj.attrs.id = $2;
          break;
        case '.':
          obj.classes.push($2);
          break;
        case ':':
          if ($_b8tc32jjc7tm6qi.inArray('checked disabled enabled read-only required'.split(' '), $2) !== -1) {
            obj.attrs[$2] = $2;
          }
          break;
        }
        if ($3 === '[') {
          var m = $4.match(/([\w\-]+)(?:\=\"([^\"]+))?/);
          if (m) {
            obj.attrs[m[1]] = m[2];
          }
        }
        return '';
      });
    }
    obj.name = tagName || 'div';
    return obj;
  };
  var parseSelector = function (selector) {
    if (!selector || typeof selector !== 'string') {
      return [];
    }
    selector = selector.split(/\s*,\s*/)[0];
    selector = selector.replace(/\s*(~\+|~|\+|>)\s*/g, '$1');
    return $_b8tc32jjc7tm6qi.map(selector.split(/(?:>|\s+(?![^\[\]]+\]))/), function (item) {
      var siblings = $_b8tc32jjc7tm6qi.map(item.split(/(?:~\+|~|\+)/), parseSelectorItem);
      var obj = siblings.pop();
      if (siblings.length) {
        obj.siblings = siblings;
      }
      return obj;
    }).reverse();
  };
  var getCssText = function (editor, format) {
    var name, previewFrag, previewElm, items;
    var previewCss = '', parentFontSize, previewStyles;
    previewStyles = editor.settings.preview_styles;
    if (previewStyles === false) {
      return '';
    }
    if (typeof previewStyles !== 'string') {
      previewStyles = 'font-family font-size font-weight font-style text-decoration ' + 'text-transform color background-color border border-radius outline text-shadow';
    }
    var removeVars = function (val) {
      return val.replace(/%(\w+)/g, '');
    };
    if (typeof format === 'string') {
      format = editor.formatter.get(format);
      if (!format) {
        return;
      }
      format = format[0];
    }
    if ('preview' in format) {
      previewStyles = format.preview;
      if (previewStyles === false) {
        return '';
      }
    }
    name = format.block || format.inline || 'span';
    items = parseSelector(format.selector);
    if (items.length) {
      if (!items[0].name) {
        items[0].name = name;
      }
      name = format.selector;
      previewFrag = parsedSelectorToHtml(items, editor);
    } else {
      previewFrag = parsedSelectorToHtml([name], editor);
    }
    previewElm = dom.select(name, previewFrag)[0] || previewFrag.firstChild;
    each$19(format.styles, function (value, name) {
      value = removeVars(value);
      if (value) {
        dom.setStyle(previewElm, name, value);
      }
    });
    each$19(format.attributes, function (value, name) {
      value = removeVars(value);
      if (value) {
        dom.setAttrib(previewElm, name, value);
      }
    });
    each$19(format.classes, function (value) {
      value = removeVars(value);
      if (!dom.hasClass(previewElm, value)) {
        dom.addClass(previewElm, value);
      }
    });
    editor.fire('PreviewFormats');
    dom.setStyles(previewFrag, {
      position: 'absolute',
      left: -65535
    });
    editor.getBody().appendChild(previewFrag);
    parentFontSize = dom.getStyle(editor.getBody(), 'fontSize', true);
    parentFontSize = /px$/.test(parentFontSize) ? parseInt(parentFontSize, 10) : 0;
    each$19(previewStyles.split(' '), function (name) {
      var value = dom.getStyle(previewElm, name, true);
      if (name === 'background-color' && /transparent|rgba\s*\([^)]+,\s*0\)/.test(value)) {
        value = dom.getStyle(editor.getBody(), name, true);
        if (dom.toHex(value).toLowerCase() === '#ffffff') {
          return;
        }
      }
      if (name === 'color') {
        if (dom.toHex(value).toLowerCase() === '#000000') {
          return;
        }
      }
      if (name === 'font-size') {
        if (/em|%$/.test(value)) {
          if (parentFontSize === 0) {
            return;
          }
          value = parseFloat(value) / (/%$/.test(value) ? 100 : 1);
          value = value * parentFontSize + 'px';
        }
      }
      if (name === 'border' && value) {
        previewCss += 'padding:0 2px;';
      }
      previewCss += name + ':' + value + ';';
    });
    editor.fire('AfterPreviewFormats');
    dom.remove(previewFrag);
    return previewCss;
  };
  var $_8rajgf5kjc7tm82b = {
    getCssText: getCssText,
    parseSelector: parseSelector,
    selectorToHtml: selectorToHtml
  };

  var toggle = function (editor, formats, name, vars, node) {
    var fmt = formats.get(name);
    if ($_wz3my3hjc7tm7lo.match(editor, name, vars, node) && (!('toggle' in fmt[0]) || fmt[0].toggle)) {
      $_14757i5fjc7tm819.remove(editor, name, vars, node);
    } else {
      $_953im05cjc7tm80g.applyFormat(editor, name, vars, node);
    }
  };
  var $_8irqjm5ljc7tm82w = { toggle: toggle };

  var setup$4 = function (editor) {
    editor.addShortcut('meta+b', '', 'Bold');
    editor.addShortcut('meta+i', '', 'Italic');
    editor.addShortcut('meta+u', '', 'Underline');
    for (var i = 1; i <= 6; i++) {
      editor.addShortcut('access+' + i, '', [
        'FormatBlock',
        false,
        'h' + i
      ]);
    }
    editor.addShortcut('access+7', '', [
      'FormatBlock',
      false,
      'p'
    ]);
    editor.addShortcut('access+8', '', [
      'FormatBlock',
      false,
      'div'
    ]);
    editor.addShortcut('access+9', '', [
      'FormatBlock',
      false,
      'address'
    ]);
  };
  var $_2b0lud5mjc7tm830 = { setup: setup$4 };

  var Formatter = function (editor) {
    var formats = FormatRegistry(editor);
    var formatChangeState = Cell(null);
    $_2b0lud5mjc7tm830.setup(editor);
    $_316jl3ejc7tm7kg.setup(editor);
    return {
      get: formats.get,
      register: formats.register,
      unregister: formats.unregister,
      apply: $_f41mrx6jc7tm6cd.curry($_953im05cjc7tm80g.applyFormat, editor),
      remove: $_f41mrx6jc7tm6cd.curry($_14757i5fjc7tm819.remove, editor),
      toggle: $_f41mrx6jc7tm6cd.curry($_8irqjm5ljc7tm82w.toggle, editor, formats),
      match: $_f41mrx6jc7tm6cd.curry($_wz3my3hjc7tm7lo.match, editor),
      matchAll: $_f41mrx6jc7tm6cd.curry($_wz3my3hjc7tm7lo.matchAll, editor),
      matchNode: $_f41mrx6jc7tm6cd.curry($_wz3my3hjc7tm7lo.matchNode, editor),
      canApply: $_f41mrx6jc7tm6cd.curry($_wz3my3hjc7tm7lo.canApply, editor),
      formatChanged: $_f41mrx6jc7tm6cd.curry($_8pb30b5hjc7tm81t.formatChanged, editor, formatChangeState),
      getCssText: $_f41mrx6jc7tm6cd.curry($_8rajgf5kjc7tm82b.getCssText, editor)
    };
  };

  var shallow = function (old, nu) {
    return nu;
  };
  var deep = function (old, nu) {
    var bothObjects = $_1g0kpc12jc7tm6vn.isObject(old) && $_1g0kpc12jc7tm6vn.isObject(nu);
    return bothObjects ? deepMerge(old, nu) : nu;
  };
  var baseMerge = function (merger) {
    return function () {
      var objects = new Array(arguments.length);
      for (var i = 0; i < objects.length; i++)
        objects[i] = arguments[i];
      if (objects.length === 0)
        throw new Error('Can\'t merge zero objects');
      var ret = {};
      for (var j = 0; j < objects.length; j++) {
        var curObject = objects[j];
        for (var key in curObject)
          if (curObject.hasOwnProperty(key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep);
  var merge = baseMerge(shallow);
  var $_7t33ct5pjc7tm83j = {
    deepMerge: deepMerge,
    merge: merge
  };

  var firePreProcess = function (editor, args) {
    return editor.fire('PreProcess', args);
  };
  var firePostProcess = function (editor, args) {
    return editor.fire('PostProcess', args);
  };
  var $_e5js1t5qjc7tm83n = {
    firePreProcess: firePreProcess,
    firePostProcess: firePostProcess
  };

  var register = function (htmlParser, settings, dom) {
    htmlParser.addAttributeFilter('data-mce-tabindex', function (nodes, name) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        node.attr('tabindex', node.attributes.map['data-mce-tabindex']);
        node.attr(name, null);
      }
    });
    htmlParser.addAttributeFilter('src,href,style', function (nodes, name) {
      var i = nodes.length, node, value, internalName = 'data-mce-' + name;
      var urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope, undef;
      while (i--) {
        node = nodes[i];
        value = node.attributes.map[internalName];
        if (value !== undef) {
          node.attr(name, value.length > 0 ? value : null);
          node.attr(internalName, null);
        } else {
          value = node.attributes.map[name];
          if (name === 'style') {
            value = dom.serializeStyle(dom.parseStyle(value), node.name);
          } else if (urlConverter) {
            value = urlConverter.call(urlConverterScope, value, name, node.name);
          }
          node.attr(name, value.length > 0 ? value : null);
        }
      }
    });
    htmlParser.addAttributeFilter('class', function (nodes) {
      var i = nodes.length, node, value;
      while (i--) {
        node = nodes[i];
        value = node.attr('class');
        if (value) {
          value = node.attr('class').replace(/(?:^|\s)mce-item-\w+(?!\S)/g, '');
          node.attr('class', value.length > 0 ? value : null);
        }
      }
    });
    htmlParser.addAttributeFilter('data-mce-type', function (nodes, name, args) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        if (node.attributes.map['data-mce-type'] === 'bookmark' && !args.cleanup) {
          node.remove();
        }
      }
    });
    htmlParser.addNodeFilter('noscript', function (nodes) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i].firstChild;
        if (node) {
          node.value = Entities.decode(node.value);
        }
      }
    });
    htmlParser.addNodeFilter('script,style', function (nodes, name) {
      var i = nodes.length, node, value, type;
      var trim = function (value) {
        return value.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n').replace(/^[\r\n]*|[\r\n]*$/g, '').replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, '').replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, '');
      };
      while (i--) {
        node = nodes[i];
        value = node.firstChild ? node.firstChild.value : '';
        if (name === 'script') {
          type = node.attr('type');
          if (type) {
            node.attr('type', type === 'mce-no/type' ? null : type.replace(/^mce\-/, ''));
          }
          if (settings.element_format === 'xhtml' && value.length > 0) {
            node.firstChild.value = '// <![CDATA[\n' + trim(value) + '\n// ]]>';
          }
        } else {
          if (settings.element_format === 'xhtml' && value.length > 0) {
            node.firstChild.value = '<!--\n' + trim(value) + '\n-->';
          }
        }
      }
    });
    htmlParser.addNodeFilter('#comment', function (nodes) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        if (node.value.indexOf('[CDATA[') === 0) {
          node.name = '#cdata';
          node.type = 4;
          node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, '');
        } else if (node.value.indexOf('mce:protected ') === 0) {
          node.name = '#text';
          node.type = 3;
          node.raw = true;
          node.value = unescape(node.value).substr(14);
        }
      }
    });
    htmlParser.addNodeFilter('xml:namespace,input', function (nodes, name) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        if (node.type === 7) {
          node.remove();
        } else if (node.type === 1) {
          if (name === 'input' && !('type' in node.attributes.map)) {
            node.attr('type', 'text');
          }
        }
      }
    });
    htmlParser.addAttributeFilter('data-mce-type', function (nodes) {
      $_20yqgb4jc7tm6aj.each(nodes, function (node) {
        if (node.attr('data-mce-type') === 'format-caret') {
          if (node.isEmpty(htmlParser.schema.getNonEmptyElements())) {
            node.remove();
          } else {
            node.unwrap();
          }
        }
      });
    });
    htmlParser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style,' + 'data-mce-selected,data-mce-expando,' + 'data-mce-type,data-mce-resize', function (nodes, name) {
      var i = nodes.length;
      while (i--) {
        nodes[i].attr(name, null);
      }
    });
  };
  var trimTrailingBr = function (rootNode) {
    var brNode1, brNode2;
    var isBr = function (node) {
      return node && node.name === 'br';
    };
    brNode1 = rootNode.lastChild;
    if (isBr(brNode1)) {
      brNode2 = brNode1.prev;
      if (isBr(brNode2)) {
        brNode1.remove();
        brNode2.remove();
      }
    }
  };
  var $_c1u84x5rjc7tm83v = {
    register: register,
    trimTrailingBr: trimTrailingBr
  };

  var preProcess = function (editor, node, args) {
    var impl, doc, oldDoc;
    var dom = editor.dom;
    node = node.cloneNode(true);
    impl = document.implementation;
    if (impl.createHTMLDocument) {
      doc = impl.createHTMLDocument('');
      $_b8tc32jjc7tm6qi.each(node.nodeName === 'BODY' ? node.childNodes : [node], function (node) {
        doc.body.appendChild(doc.importNode(node, true));
      });
      if (node.nodeName !== 'BODY') {
        node = doc.body.firstChild;
      } else {
        node = doc.body;
      }
      oldDoc = dom.doc;
      dom.doc = doc;
    }
    $_e5js1t5qjc7tm83n.firePreProcess(editor, $_7t33ct5pjc7tm83j.merge(args, { node: node }));
    if (oldDoc) {
      dom.doc = oldDoc;
    }
    return node;
  };
  var shouldFireEvent = function (editor, args) {
    return editor && editor.hasEventListeners('PreProcess') && !args.no_events;
  };
  var process = function (editor, node, args) {
    return shouldFireEvent(editor, args) ? preProcess(editor, node, args) : node;
  };
  var $_9vueuh5sjc7tm84a = { process: process };

  var removeAttrs = function (node, names) {
    $_20yqgb4jc7tm6aj.each(names, function (name) {
      node.attr(name, null);
    });
  };
  var addFontToSpansFilter = function (domParser, styles, fontSizes) {
    domParser.addNodeFilter('font', function (nodes) {
      $_20yqgb4jc7tm6aj.each(nodes, function (node) {
        var props = styles.parse(node.attr('style'));
        var color = node.attr('color');
        var face = node.attr('face');
        var size = node.attr('size');
        if (color) {
          props.color = color;
        }
        if (face) {
          props['font-family'] = face;
        }
        if (size) {
          props['font-size'] = fontSizes[parseInt(node.attr('size'), 10) - 1];
        }
        node.name = 'span';
        node.attr('style', styles.serialize(props));
        removeAttrs(node, [
          'color',
          'face',
          'size'
        ]);
      });
    });
  };
  var addStrikeToSpanFilter = function (domParser, styles) {
    domParser.addNodeFilter('strike', function (nodes) {
      $_20yqgb4jc7tm6aj.each(nodes, function (node) {
        var props = styles.parse(node.attr('style'));
        props['text-decoration'] = 'line-through';
        node.name = 'span';
        node.attr('style', styles.serialize(props));
      });
    });
  };
  var addFilters = function (domParser, settings) {
    var styles = Styles();
    if (settings.convert_fonts_to_spans) {
      addFontToSpansFilter(domParser, styles, $_b8tc32jjc7tm6qi.explode(settings.font_size_legacy_values));
    }
    addStrikeToSpanFilter(domParser, styles);
  };
  var register$1 = function (domParser, settings) {
    if (settings.inline_styles) {
      addFilters(domParser, settings);
    }
  };
  var $_49jak35ujc7tm851 = { register: register$1 };

  var whiteSpaceRegExp$3 = /^[ \t\r\n]*$/;
  var typeLookup = {
    '#text': 3,
    '#comment': 8,
    '#cdata': 4,
    '#pi': 7,
    '#doctype': 10,
    '#document-fragment': 11
  };
  var walk$2 = function (node, rootNode, prev) {
    var sibling, parent, startName = prev ? 'lastChild' : 'firstChild', siblingName = prev ? 'prev' : 'next';
    if (node[startName]) {
      return node[startName];
    }
    if (node !== rootNode) {
      sibling = node[siblingName];
      if (sibling) {
        return sibling;
      }
      for (parent = node.parent; parent && parent !== rootNode; parent = parent.parent) {
        sibling = parent[siblingName];
        if (sibling) {
          return sibling;
        }
      }
    }
  };
  var Node$2 = function (name, type) {
    this.name = name;
    this.type = type;
    if (type === 1) {
      this.attributes = [];
      this.attributes.map = {};
    }
  };
  Node$2.prototype = {
    replace: function (node) {
      var self = this;
      if (node.parent) {
        node.remove();
      }
      self.insert(node, self);
      self.remove();
      return self;
    },
    attr: function (name, value) {
      var self = this, attrs, i, undef;
      if (typeof name !== 'string') {
        for (i in name) {
          self.attr(i, name[i]);
        }
        return self;
      }
      if (attrs = self.attributes) {
        if (value !== undef) {
          if (value === null) {
            if (name in attrs.map) {
              delete attrs.map[name];
              i = attrs.length;
              while (i--) {
                if (attrs[i].name === name) {
                  attrs = attrs.splice(i, 1);
                  return self;
                }
              }
            }
            return self;
          }
          if (name in attrs.map) {
            i = attrs.length;
            while (i--) {
              if (attrs[i].name === name) {
                attrs[i].value = value;
                break;
              }
            }
          } else {
            attrs.push({
              name: name,
              value: value
            });
          }
          attrs.map[name] = value;
          return self;
        }
        return attrs.map[name];
      }
    },
    clone: function () {
      var self = this, clone = new Node$2(self.name, self.type), i, l, selfAttrs, selfAttr, cloneAttrs;
      if (selfAttrs = self.attributes) {
        cloneAttrs = [];
        cloneAttrs.map = {};
        for (i = 0, l = selfAttrs.length; i < l; i++) {
          selfAttr = selfAttrs[i];
          if (selfAttr.name !== 'id') {
            cloneAttrs[cloneAttrs.length] = {
              name: selfAttr.name,
              value: selfAttr.value
            };
            cloneAttrs.map[selfAttr.name] = selfAttr.value;
          }
        }
        clone.attributes = cloneAttrs;
      }
      clone.value = self.value;
      clone.shortEnded = self.shortEnded;
      return clone;
    },
    wrap: function (wrapper) {
      var self = this;
      self.parent.insert(wrapper, self);
      wrapper.append(self);
      return self;
    },
    unwrap: function () {
      var self = this, node, next;
      for (node = self.firstChild; node;) {
        next = node.next;
        self.insert(node, self, true);
        node = next;
      }
      self.remove();
    },
    remove: function () {
      var self = this, parent = self.parent, next = self.next, prev = self.prev;
      if (parent) {
        if (parent.firstChild === self) {
          parent.firstChild = next;
          if (next) {
            next.prev = null;
          }
        } else {
          prev.next = next;
        }
        if (parent.lastChild === self) {
          parent.lastChild = prev;
          if (prev) {
            prev.next = null;
          }
        } else {
          next.prev = prev;
        }
        self.parent = self.next = self.prev = null;
      }
      return self;
    },
    append: function (node) {
      var self = this, last;
      if (node.parent) {
        node.remove();
      }
      last = self.lastChild;
      if (last) {
        last.next = node;
        node.prev = last;
        self.lastChild = node;
      } else {
        self.lastChild = self.firstChild = node;
      }
      node.parent = self;
      return node;
    },
    insert: function (node, refNode, before) {
      var parent;
      if (node.parent) {
        node.remove();
      }
      parent = refNode.parent || this;
      if (before) {
        if (refNode === parent.firstChild) {
          parent.firstChild = node;
        } else {
          refNode.prev.next = node;
        }
        node.prev = refNode.prev;
        node.next = refNode;
        refNode.prev = node;
      } else {
        if (refNode === parent.lastChild) {
          parent.lastChild = node;
        } else {
          refNode.next.prev = node;
        }
        node.next = refNode.next;
        node.prev = refNode;
        refNode.next = node;
      }
      node.parent = parent;
      return node;
    },
    getAll: function (name) {
      var self = this, node, collection = [];
      for (node = self.firstChild; node; node = walk$2(node, self)) {
        if (node.name === name) {
          collection.push(node);
        }
      }
      return collection;
    },
    empty: function () {
      var self = this, nodes, i, node;
      if (self.firstChild) {
        nodes = [];
        for (node = self.firstChild; node; node = walk$2(node, self)) {
          nodes.push(node);
        }
        i = nodes.length;
        while (i--) {
          node = nodes[i];
          node.parent = node.firstChild = node.lastChild = node.next = node.prev = null;
        }
      }
      self.firstChild = self.lastChild = null;
      return self;
    },
    isEmpty: function (elements, whitespace, predicate) {
      var self = this, node = self.firstChild, i, name;
      whitespace = whitespace || {};
      if (node) {
        do {
          if (node.type === 1) {
            if (node.attributes.map['data-mce-bogus']) {
              continue;
            }
            if (elements[node.name]) {
              return false;
            }
            i = node.attributes.length;
            while (i--) {
              name = node.attributes[i].name;
              if (name === 'name' || name.indexOf('data-mce-bookmark') === 0) {
                return false;
              }
            }
          }
          if (node.type === 8) {
            return false;
          }
          if (node.type === 3 && !whiteSpaceRegExp$3.test(node.value)) {
            return false;
          }
          if (node.type === 3 && node.parent && whitespace[node.parent.name] && whiteSpaceRegExp$3.test(node.value)) {
            return false;
          }
          if (predicate && predicate(node)) {
            return false;
          }
        } while (node = walk$2(node, self));
      }
      return true;
    },
    walk: function (prev) {
      return walk$2(this, null, prev);
    }
  };
  Node$2.create = function (name, attrs) {
    var node, attrName;
    node = new Node$2(name, typeLookup[name] || 1);
    if (attrs) {
      for (attrName in attrs) {
        node.attr(attrName, attrs[attrName]);
      }
    }
    return node;
  };

  var makeMap$4 = $_b8tc32jjc7tm6qi.makeMap;
  var each$20 = $_b8tc32jjc7tm6qi.each;
  var explode$4 = $_b8tc32jjc7tm6qi.explode;
  var extend$4 = $_b8tc32jjc7tm6qi.extend;
  var paddEmptyNode = function (settings, args, blockElements, node) {
    var brPreferred = settings.padd_empty_with_br || args.insert;
    if (brPreferred && blockElements[node.name]) {
      node.empty().append(new Node$2('br', '1')).shortEnded = true;
    } else {
      node.empty().append(new Node$2('#text', '3')).value = '\xA0';
    }
  };
  var isPaddedWithNbsp = function (node) {
    return hasOnlyChild(node, '#text') && node.firstChild.value === '\xA0';
  };
  var hasOnlyChild = function (node, name) {
    return node && node.firstChild && node.firstChild === node.lastChild && node.firstChild.name === name;
  };
  var isPadded = function (schema, node) {
    var rule = schema.getElementRule(node.name);
    return rule && rule.paddEmpty;
  };
  var isEmpty$1 = function (schema, nonEmptyElements, whitespaceElements, node) {
    return node.isEmpty(nonEmptyElements, whitespaceElements, function (node) {
      return isPadded(schema, node);
    });
  };
  var DomParser = function (settings, schema) {
    var self = {}, nodeFilters = {}, attributeFilters = [], matchedNodes = {}, matchedAttributes = {};
    settings = settings || {};
    settings.validate = 'validate' in settings ? settings.validate : true;
    settings.root_name = settings.root_name || 'body';
    self.schema = schema = schema || Schema();
    var fixInvalidChildren = function (nodes) {
      var ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i;
      var nonEmptyElements, whitespaceElements, nonSplitableElements, textBlockElements, specialElements, sibling, nextNode;
      nonSplitableElements = makeMap$4('tr,td,th,tbody,thead,tfoot,table');
      nonEmptyElements = schema.getNonEmptyElements();
      whitespaceElements = schema.getWhiteSpaceElements();
      textBlockElements = schema.getTextBlockElements();
      specialElements = schema.getSpecialElements();
      for (ni = 0; ni < nodes.length; ni++) {
        node = nodes[ni];
        if (!node.parent || node.fixed) {
          continue;
        }
        if (textBlockElements[node.name] && node.parent.name == 'li') {
          sibling = node.next;
          while (sibling) {
            if (textBlockElements[sibling.name]) {
              sibling.name = 'li';
              sibling.fixed = true;
              node.parent.insert(sibling, node.parent);
            } else {
              break;
            }
            sibling = sibling.next;
          }
          node.unwrap(node);
          continue;
        }
        parents = [node];
        for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent) {
          parents.push(parent);
        }
        if (parent && parents.length > 1) {
          parents.reverse();
          newParent = currentNode = self.filterNode(parents[0].clone());
          for (i = 0; i < parents.length - 1; i++) {
            if (schema.isValidChild(currentNode.name, parents[i].name)) {
              tempNode = self.filterNode(parents[i].clone());
              currentNode.append(tempNode);
            } else {
              tempNode = currentNode;
            }
            for (childNode = parents[i].firstChild; childNode && childNode != parents[i + 1];) {
              nextNode = childNode.next;
              tempNode.append(childNode);
              childNode = nextNode;
            }
            currentNode = tempNode;
          }
          if (!isEmpty$1(schema, nonEmptyElements, whitespaceElements, newParent)) {
            parent.insert(newParent, parents[0], true);
            parent.insert(node, newParent);
          } else {
            parent.insert(node, parents[0], true);
          }
          parent = parents[0];
          if (isEmpty$1(schema, nonEmptyElements, whitespaceElements, parent) || hasOnlyChild(parent, 'br')) {
            parent.empty().remove();
          }
        } else if (node.parent) {
          if (node.name === 'li') {
            sibling = node.prev;
            if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
              sibling.append(node);
              continue;
            }
            sibling = node.next;
            if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) {
              sibling.insert(node, sibling.firstChild, true);
              continue;
            }
            node.wrap(self.filterNode(new Node$2('ul', 1)));
            continue;
          }
          if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) {
            node.wrap(self.filterNode(new Node$2('div', 1)));
          } else {
            if (specialElements[node.name]) {
              node.empty().remove();
            } else {
              node.unwrap();
            }
          }
        }
      }
    };
    self.filterNode = function (node) {
      var i, name, list;
      if (name in nodeFilters) {
        list = matchedNodes[name];
        if (list) {
          list.push(node);
        } else {
          matchedNodes[name] = [node];
        }
      }
      i = attributeFilters.length;
      while (i--) {
        name = attributeFilters[i].name;
        if (name in node.attributes.map) {
          list = matchedAttributes[name];
          if (list) {
            list.push(node);
          } else {
            matchedAttributes[name] = [node];
          }
        }
      }
      return node;
    };
    self.addNodeFilter = function (name, callback) {
      each$20(explode$4(name), function (name) {
        var list = nodeFilters[name];
        if (!list) {
          nodeFilters[name] = list = [];
        }
        list.push(callback);
      });
    };
    self.addAttributeFilter = function (name, callback) {
      each$20(explode$4(name), function (name) {
        var i;
        for (i = 0; i < attributeFilters.length; i++) {
          if (attributeFilters[i].name === name) {
            attributeFilters[i].callbacks.push(callback);
            return;
          }
        }
        attributeFilters.push({
          name: name,
          callbacks: [callback]
        });
      });
    };
    self.parse = function (html, args) {
      var parser, rootNode, node, nodes, i, l, fi, fl, list, name, validate;
      var blockElements, startWhiteSpaceRegExp, invalidChildren = [], isInWhiteSpacePreservedElement;
      var endWhiteSpaceRegExp, allWhiteSpaceRegExp, isAllWhiteSpaceRegExp, whiteSpaceElements;
      var children, nonEmptyElements, rootBlockName;
      args = args || {};
      matchedNodes = {};
      matchedAttributes = {};
      blockElements = extend$4(makeMap$4('script,style,head,html,body,title,meta,param'), schema.getBlockElements());
      nonEmptyElements = schema.getNonEmptyElements();
      children = schema.children;
      validate = settings.validate;
      rootBlockName = 'forced_root_block' in args ? args.forced_root_block : settings.forced_root_block;
      whiteSpaceElements = schema.getWhiteSpaceElements();
      startWhiteSpaceRegExp = /^[ \t\r\n]+/;
      endWhiteSpaceRegExp = /[ \t\r\n]+$/;
      allWhiteSpaceRegExp = /[ \t\r\n]+/g;
      isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/;
      var addRootBlocks = function () {
        var node = rootNode.firstChild, next, rootBlockNode;
        var trim = function (rootBlockNode) {
          if (rootBlockNode) {
            node = rootBlockNode.firstChild;
            if (node && node.type == 3) {
              node.value = node.value.replace(startWhiteSpaceRegExp, '');
            }
            node = rootBlockNode.lastChild;
            if (node && node.type == 3) {
              node.value = node.value.replace(endWhiteSpaceRegExp, '');
            }
          }
        };
        if (!schema.isValidChild(rootNode.name, rootBlockName.toLowerCase())) {
          return;
        }
        while (node) {
          next = node.next;
          if (node.type == 3 || node.type == 1 && node.name !== 'p' && !blockElements[node.name] && !node.attr('data-mce-type')) {
            if (!rootBlockNode) {
              rootBlockNode = createNode(rootBlockName, 1);
              rootBlockNode.attr(settings.forced_root_block_attrs);
              rootNode.insert(rootBlockNode, node);
              rootBlockNode.append(node);
            } else {
              rootBlockNode.append(node);
            }
          } else {
            trim(rootBlockNode);
            rootBlockNode = null;
          }
          node = next;
        }
        trim(rootBlockNode);
      };
      var createNode = function (name, type) {
        var node = new Node$2(name, type), list;
        if (name in nodeFilters) {
          list = matchedNodes[name];
          if (list) {
            list.push(node);
          } else {
            matchedNodes[name] = [node];
          }
        }
        return node;
      };
      var removeWhitespaceBefore = function (node) {
        var textNode, textNodeNext, textVal, sibling, blockElements = schema.getBlockElements();
        for (textNode = node.prev; textNode && textNode.type === 3;) {
          textVal = textNode.value.replace(endWhiteSpaceRegExp, '');
          if (textVal.length > 0) {
            textNode.value = textVal;
            return;
          }
          textNodeNext = textNode.next;
          if (textNodeNext) {
            if (textNodeNext.type == 3 && textNodeNext.value.length) {
              textNode = textNode.prev;
              continue;
            }
            if (!blockElements[textNodeNext.name] && textNodeNext.name != 'script' && textNodeNext.name != 'style') {
              textNode = textNode.prev;
              continue;
            }
          }
          sibling = textNode.prev;
          textNode.remove();
          textNode = sibling;
        }
      };
      var cloneAndExcludeBlocks = function (input) {
        var name, output = {};
        for (name in input) {
          if (name !== 'li' && name != 'p') {
            output[name] = input[name];
          }
        }
        return output;
      };
      parser = new SaxParser({
        validate: validate,
        allow_script_urls: settings.allow_script_urls,
        allow_conditional_comments: settings.allow_conditional_comments,
        self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()),
        cdata: function (text) {
          node.append(createNode('#cdata', 4)).value = text;
        },
        text: function (text, raw) {
          var textNode;
          if (!isInWhiteSpacePreservedElement) {
            text = text.replace(allWhiteSpaceRegExp, ' ');
            if (node.lastChild && blockElements[node.lastChild.name]) {
              text = text.replace(startWhiteSpaceRegExp, '');
            }
          }
          if (text.length !== 0) {
            textNode = createNode('#text', 3);
            textNode.raw = !!raw;
            node.append(textNode).value = text;
          }
        },
        comment: function (text) {
          node.append(createNode('#comment', 8)).value = text;
        },
        pi: function (name, text) {
          node.append(createNode(name, 7)).value = text;
          removeWhitespaceBefore(node);
        },
        doctype: function (text) {
          var newNode;
          newNode = node.append(createNode('#doctype', 10));
          newNode.value = text;
          removeWhitespaceBefore(node);
        },
        start: function (name, attrs, empty) {
          var newNode, attrFiltersLen, elementRule, attrName, parent;
          elementRule = validate ? schema.getElementRule(name) : {};
          if (elementRule) {
            newNode = createNode(elementRule.outputName || name, 1);
            newNode.attributes = attrs;
            newNode.shortEnded = empty;
            node.append(newNode);
            parent = children[node.name];
            if (parent && children[newNode.name] && !parent[newNode.name]) {
              invalidChildren.push(newNode);
            }
            attrFiltersLen = attributeFilters.length;
            while (attrFiltersLen--) {
              attrName = attributeFilters[attrFiltersLen].name;
              if (attrName in attrs.map) {
                list = matchedAttributes[attrName];
                if (list) {
                  list.push(newNode);
                } else {
                  matchedAttributes[attrName] = [newNode];
                }
              }
            }
            if (blockElements[name]) {
              removeWhitespaceBefore(newNode);
            }
            if (!empty) {
              node = newNode;
            }
            if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
              isInWhiteSpacePreservedElement = true;
            }
          }
        },
        end: function (name) {
          var textNode, elementRule, text, sibling, tempNode;
          elementRule = validate ? schema.getElementRule(name) : {};
          if (elementRule) {
            if (blockElements[name]) {
              if (!isInWhiteSpacePreservedElement) {
                textNode = node.firstChild;
                if (textNode && textNode.type === 3) {
                  text = textNode.value.replace(startWhiteSpaceRegExp, '');
                  if (text.length > 0) {
                    textNode.value = text;
                    textNode = textNode.next;
                  } else {
                    sibling = textNode.next;
                    textNode.remove();
                    textNode = sibling;
                    while (textNode && textNode.type === 3) {
                      text = textNode.value;
                      sibling = textNode.next;
                      if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                        textNode.remove();
                        textNode = sibling;
                      }
                      textNode = sibling;
                    }
                  }
                }
                textNode = node.lastChild;
                if (textNode && textNode.type === 3) {
                  text = textNode.value.replace(endWhiteSpaceRegExp, '');
                  if (text.length > 0) {
                    textNode.value = text;
                    textNode = textNode.prev;
                  } else {
                    sibling = textNode.prev;
                    textNode.remove();
                    textNode = sibling;
                    while (textNode && textNode.type === 3) {
                      text = textNode.value;
                      sibling = textNode.prev;
                      if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) {
                        textNode.remove();
                        textNode = sibling;
                      }
                      textNode = sibling;
                    }
                  }
                }
              }
            }
            if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) {
              isInWhiteSpacePreservedElement = false;
            }
            if (elementRule.removeEmpty && isEmpty$1(schema, nonEmptyElements, whiteSpaceElements, node)) {
              if (!node.attributes.map.name && !node.attributes.map.id) {
                tempNode = node.parent;
                if (blockElements[node.name]) {
                  node.empty().remove();
                } else {
                  node.unwrap();
                }
                node = tempNode;
                return;
              }
            }
            if (elementRule.paddEmpty && (isPaddedWithNbsp(node) || isEmpty$1(schema, nonEmptyElements, whiteSpaceElements, node))) {
              paddEmptyNode(settings, args, blockElements, node);
            }
            node = node.parent;
          }
        }
      }, schema);
      rootNode = node = new Node$2(args.context || settings.root_name, 11);
      parser.parse(html);
      if (validate && invalidChildren.length) {
        if (!args.context) {
          fixInvalidChildren(invalidChildren);
        } else {
          args.invalid = true;
        }
      }
      if (rootBlockName && (rootNode.name == 'body' || args.isRootContent)) {
        addRootBlocks();
      }
      if (!args.invalid) {
        for (name in matchedNodes) {
          list = nodeFilters[name];
          nodes = matchedNodes[name];
          fi = nodes.length;
          while (fi--) {
            if (!nodes[fi].parent) {
              nodes.splice(fi, 1);
            }
          }
          for (i = 0, l = list.length; i < l; i++) {
            list[i](nodes, name, args);
          }
        }
        for (i = 0, l = attributeFilters.length; i < l; i++) {
          list = attributeFilters[i];
          if (list.name in matchedAttributes) {
            nodes = matchedAttributes[list.name];
            fi = nodes.length;
            while (fi--) {
              if (!nodes[fi].parent) {
                nodes.splice(fi, 1);
              }
            }
            for (fi = 0, fl = list.callbacks.length; fi < fl; fi++) {
              list.callbacks[fi](nodes, list.name, args);
            }
          }
        }
      }
      return rootNode;
    };
    if (settings.remove_trailing_brs) {
      self.addNodeFilter('br', function (nodes, _, args) {
        var i, l = nodes.length, node, blockElements = extend$4({}, schema.getBlockElements());
        var nonEmptyElements = schema.getNonEmptyElements(), parent, lastParent, prev, prevName;
        var whiteSpaceElements = schema.getNonEmptyElements();
        var elementRule, textNode;
        blockElements.body = 1;
        for (i = 0; i < l; i++) {
          node = nodes[i];
          parent = node.parent;
          if (blockElements[node.parent.name] && node === parent.lastChild) {
            prev = node.prev;
            while (prev) {
              prevName = prev.name;
              if (prevName !== 'span' || prev.attr('data-mce-type') !== 'bookmark') {
                if (prevName !== 'br') {
                  break;
                }
                if (prevName === 'br') {
                  node = null;
                  break;
                }
              }
              prev = prev.prev;
            }
            if (node) {
              node.remove();
              if (isEmpty$1(schema, nonEmptyElements, whiteSpaceElements, parent)) {
                elementRule = schema.getElementRule(parent.name);
                if (elementRule) {
                  if (elementRule.removeEmpty) {
                    parent.remove();
                  } else if (elementRule.paddEmpty) {
                    paddEmptyNode(settings, args, blockElements, parent);
                  }
                }
              }
            }
          } else {
            lastParent = node;
            while (parent && parent.firstChild === lastParent && parent.lastChild === lastParent) {
              lastParent = parent;
              if (blockElements[parent.name]) {
                break;
              }
              parent = parent.parent;
            }
            if (lastParent === parent && settings.padd_empty_with_br !== true) {
              textNode = new Node$2('#text', 3);
              textNode.value = '\xA0';
              node.replace(textNode);
            }
          }
        }
      });
    }
    self.addAttributeFilter('href', function (nodes) {
      var i = nodes.length, node;
      var appendRel = function (rel) {
        var parts = rel.split(' ').filter(function (p) {
          return p.length > 0;
        });
        return parts.concat(['noopener']).sort().join(' ');
      };
      var addNoOpener = function (rel) {
        var newRel = rel ? $_b8tc32jjc7tm6qi.trim(rel) : '';
        if (!/\b(noopener)\b/g.test(newRel)) {
          return appendRel(newRel);
        } else {
          return newRel;
        }
      };
      if (!settings.allow_unsafe_link_target) {
        while (i--) {
          node = nodes[i];
          if (node.name === 'a' && node.attr('target') === '_blank') {
            node.attr('rel', addNoOpener(node.attr('rel')));
          }
        }
      }
    });
    if (!settings.allow_html_in_named_anchor) {
      self.addAttributeFilter('id,name', function (nodes) {
        var i = nodes.length, sibling, prevSibling, parent, node;
        while (i--) {
          node = nodes[i];
          if (node.name === 'a' && node.firstChild && !node.attr('href')) {
            parent = node.parent;
            sibling = node.lastChild;
            do {
              prevSibling = sibling.prev;
              parent.insert(sibling, node);
              sibling = prevSibling;
            } while (sibling);
          }
        }
      });
    }
    if (settings.fix_list_elements) {
      self.addNodeFilter('ul,ol', function (nodes) {
        var i = nodes.length, node, parentNode;
        while (i--) {
          node = nodes[i];
          parentNode = node.parent;
          if (parentNode.name === 'ul' || parentNode.name === 'ol') {
            if (node.prev && node.prev.name === 'li') {
              node.prev.append(node);
            } else {
              var li = new Node$2('li', 1);
              li.attr('style', 'list-style-type: none');
              node.wrap(li);
            }
          }
        }
      });
    }
    if (settings.validate && schema.getValidClasses()) {
      self.addAttributeFilter('class', function (nodes) {
        var i = nodes.length, node, classList, ci, className, classValue;
        var validClasses = schema.getValidClasses(), validClassesMap, valid;
        while (i--) {
          node = nodes[i];
          classList = node.attr('class').split(' ');
          classValue = '';
          for (ci = 0; ci < classList.length; ci++) {
            className = classList[ci];
            valid = false;
            validClassesMap = validClasses['*'];
            if (validClassesMap && validClassesMap[className]) {
              valid = true;
            }
            validClassesMap = validClasses[node.name];
            if (!valid && validClassesMap && validClassesMap[className]) {
              valid = true;
            }
            if (valid) {
              if (classValue) {
                classValue += ' ';
              }
              classValue += className;
            }
          }
          if (!classValue.length) {
            classValue = null;
          }
          node.attr('class', classValue);
        }
      });
    }
    $_49jak35ujc7tm851.register(self, settings);
    return self;
  };

  var addTempAttr = function (htmlParser, tempAttrs, name) {
    if ($_b8tc32jjc7tm6qi.inArray(tempAttrs, name) === -1) {
      htmlParser.addAttributeFilter(name, function (nodes, name) {
        var i = nodes.length;
        while (i--) {
          nodes[i].attr(name, null);
        }
      });
      tempAttrs.push(name);
    }
  };
  var postProcess$1 = function (editor, args, content) {
    if (!args.no_events && editor) {
      var outArgs = $_e5js1t5qjc7tm83n.firePostProcess(editor, $_7t33ct5pjc7tm83j.merge(args, { content: content }));
      return outArgs.content;
    } else {
      return content;
    }
  };
  var getHtmlFromNode = function (dom, node, args) {
    var html = $_55zd6d21jc7tm765.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node));
    return args.selection ? html : $_b8tc32jjc7tm6qi.trim(html);
  };
  var parseHtml = function (htmlParser, dom, html, args) {
    var parserArgs = args.selection ? $_7t33ct5pjc7tm83j.merge({ forced_root_block: false }, args) : args;
    var rootNode = htmlParser.parse(html, parserArgs);
    $_c1u84x5rjc7tm83v.trimTrailingBr(rootNode);
    return rootNode;
  };
  var serializeNode = function (settings, schema, node) {
    var htmlSerializer = Serializer(settings, schema);
    return htmlSerializer.serialize(node);
  };
  var toHtml = function (editor, settings, schema, rootNode, args) {
    var content = serializeNode(settings, schema, rootNode);
    return postProcess$1(editor, args, content);
  };
  var DomSerializer = function (settings, editor) {
    var dom, schema, htmlParser, tempAttrs = ['data-mce-selected'];
    dom = editor && editor.dom ? editor.dom : DOMUtils.DOM;
    schema = editor && editor.schema ? editor.schema : Schema(settings);
    settings.entity_encoding = settings.entity_encoding || 'named';
    settings.remove_trailing_brs = 'remove_trailing_brs' in settings ? settings.remove_trailing_brs : true;
    htmlParser = DomParser(settings, schema);
    $_c1u84x5rjc7tm83v.register(htmlParser, settings, dom);
    var serialize = function (node, parserArgs) {
      var args = $_7t33ct5pjc7tm83j.merge({ format: 'html' }, parserArgs ? parserArgs : {});
      var targetNode = $_9vueuh5sjc7tm84a.process(editor, node, args);
      var html = getHtmlFromNode(dom, targetNode, args);
      var rootNode = parseHtml(htmlParser, dom, html, args);
      return args.format === 'tree' ? rootNode : toHtml(editor, settings, schema, rootNode, args);
    };
    return {
      schema: schema,
      addNodeFilter: htmlParser.addNodeFilter,
      addAttributeFilter: htmlParser.addAttributeFilter,
      serialize: serialize,
      addRules: function (rules) {
        schema.addValidElements(rules);
      },
      setRules: function (rules) {
        schema.setValidElements(rules);
      },
      addTempAttr: $_f41mrx6jc7tm6cd.curry(addTempAttr, htmlParser, tempAttrs),
      getTempAttrs: function () {
        return tempAttrs;
      }
    };
  };

  var Serializer$1 = function (settings, editor) {
    var domSerializer = DomSerializer(settings, editor);
    return {
      schema: domSerializer.schema,
      addNodeFilter: domSerializer.addNodeFilter,
      addAttributeFilter: domSerializer.addAttributeFilter,
      serialize: domSerializer.serialize,
      addRules: domSerializer.addRules,
      setRules: domSerializer.setRules,
      addTempAttr: domSerializer.addTempAttr,
      getTempAttrs: domSerializer.getTempAttrs
    };
  };

  var findBlockCaretContainer = function (editor) {
    return $_d6v5nd31jc7tm7gs.descendant($_bscr39yjc7tm6uo.fromDom(editor.getBody()), '*[data-mce-caret]').fold($_f41mrx6jc7tm6cd.constant(null), function (elm) {
      return elm.dom();
    });
  };
  var removeIeControlRect = function (editor) {
    editor.selection.setRng(editor.selection.getRng());
  };
  var showBlockCaretContainer = function (editor, blockCaretContainer) {
    if (blockCaretContainer.hasAttribute('data-mce-caret')) {
      $_40segn20jc7tm75y.showCaretContainerBlock(blockCaretContainer);
      removeIeControlRect(editor);
      editor.selection.scrollIntoView(blockCaretContainer);
    }
  };
  var handleBlockContainer = function (editor, e) {
    var blockCaretContainer = findBlockCaretContainer(editor);
    if (!blockCaretContainer) {
      return;
    }
    if (e.type === 'compositionstart') {
      e.preventDefault();
      e.stopPropagation();
      showBlockCaretContainer(editor, blockCaretContainer);
      return;
    }
    if ($_40segn20jc7tm75y.hasContent(blockCaretContainer)) {
      showBlockCaretContainer(editor, blockCaretContainer);
    }
  };
  var setup$5 = function (editor) {
    editor.on('keyup compositionstart', $_f41mrx6jc7tm6cd.curry(handleBlockContainer, editor));
  };
  var $_7pr555wjc7tm85p = { setup: setup$5 };

  var BookmarkManager = function (selection) {
    return {
      getBookmark: $_f41mrx6jc7tm6cd.curry($_am1og29jc7tm78b.getBookmark, selection),
      moveToBookmark: $_f41mrx6jc7tm6cd.curry($_am1og29jc7tm78b.moveToBookmark, selection)
    };
  };
  BookmarkManager.isBookmarkNode = $_am1og29jc7tm78b.isBookmarkNode;

  var isContentEditableFalse$9 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var isContentEditableTrue$5 = $_1qi2bn1qjc7tm70u.isContentEditableTrue;
  var getContentEditableRoot$1 = function (root, node) {
    while (node && node != root) {
      if (isContentEditableTrue$5(node) || isContentEditableFalse$9(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var ControlSelection = function (selection, editor) {
    var dom = editor.dom, each = $_b8tc32jjc7tm6qi.each;
    var selectedElm, selectedElmGhost, resizeHelper, resizeHandles, selectedHandle;
    var startX, startY, selectedElmX, selectedElmY, startW, startH, ratio, resizeStarted;
    var width, height, editableDoc = editor.getDoc(), rootDocument = document;
    var abs = Math.abs, round = Math.round, rootElement = editor.getBody(), startScrollWidth, startScrollHeight;
    resizeHandles = {
      nw: [
        0,
        0,
        -1,
        -1
      ],
      ne: [
        1,
        0,
        1,
        -1
      ],
      se: [
        1,
        1,
        1,
        1
      ],
      sw: [
        0,
        1,
        -1,
        1
      ]
    };
    var rootClass = '.mce-content-body';
    editor.contentStyles.push(rootClass + ' div.mce-resizehandle {' + 'position: absolute;' + 'border: 1px solid black;' + 'box-sizing: content-box;' + 'background: #FFF;' + 'width: 7px;' + 'height: 7px;' + 'z-index: 10000' + '}' + rootClass + ' .mce-resizehandle:hover {' + 'background: #000' + '}' + rootClass + ' img[data-mce-selected],' + rootClass + ' hr[data-mce-selected] {' + 'outline: 1px solid black;' + 'resize: none' + '}' + rootClass + ' .mce-clonedresizable {' + 'position: absolute;' + ($_dtgtsy9jc7tm6gs.gecko ? '' : 'outline: 1px dashed black;') + 'opacity: .5;' + 'filter: alpha(opacity=50);' + 'z-index: 10000' + '}' + rootClass + ' .mce-resize-helper {' + 'background: #555;' + 'background: rgba(0,0,0,0.75);' + 'border-radius: 3px;' + 'border: 1px;' + 'color: white;' + 'display: none;' + 'font-family: sans-serif;' + 'font-size: 12px;' + 'white-space: nowrap;' + 'line-height: 14px;' + 'margin: 5px 10px;' + 'padding: 5px;' + 'position: absolute;' + 'z-index: 10001' + '}');
    var isImage = function (elm) {
      return elm && (elm.nodeName === 'IMG' || editor.dom.is(elm, 'figure.image'));
    };
    var isEventOnImageOutsideRange = function (evt, range) {
      return isImage(evt.target) && !$_av8odt52jc7tm7yh.isXYWithinRange(evt.clientX, evt.clientY, range);
    };
    var contextMenuSelectImage = function (evt) {
      var target = evt.target;
      if (isEventOnImageOutsideRange(evt, editor.selection.getRng()) && !evt.isDefaultPrevented()) {
        evt.preventDefault();
        editor.selection.select(target);
      }
    };
    var getResizeTarget = function (elm) {
      return editor.dom.is(elm, 'figure.image') ? elm.querySelector('img') : elm;
    };
    var isResizable = function (elm) {
      var selector = editor.settings.object_resizing;
      if (selector === false || $_dtgtsy9jc7tm6gs.iOS) {
        return false;
      }
      if (typeof selector != 'string') {
        selector = 'table,img,figure.image,div';
      }
      if (elm.getAttribute('data-mce-resize') === 'false') {
        return false;
      }
      if (elm == editor.getBody()) {
        return false;
      }
      return $_dnzz0a1fjc7tm6yr.is($_bscr39yjc7tm6uo.fromDom(elm), selector);
    };
    var resizeGhostElement = function (e) {
      var deltaX, deltaY, proportional;
      var resizeHelperX, resizeHelperY;
      deltaX = e.screenX - startX;
      deltaY = e.screenY - startY;
      width = deltaX * selectedHandle[2] + startW;
      height = deltaY * selectedHandle[3] + startH;
      width = width < 5 ? 5 : width;
      height = height < 5 ? 5 : height;
      if (isImage(selectedElm) && editor.settings.resize_img_proportional !== false) {
        proportional = !$_b5txs856jc7tm7z0.modifierPressed(e);
      } else {
        proportional = $_b5txs856jc7tm7z0.modifierPressed(e) || isImage(selectedElm) && selectedHandle[2] * selectedHandle[3] !== 0;
      }
      if (proportional) {
        if (abs(deltaX) > abs(deltaY)) {
          height = round(width * ratio);
          width = round(height / ratio);
        } else {
          width = round(height / ratio);
          height = round(width * ratio);
        }
      }
      dom.setStyles(getResizeTarget(selectedElmGhost), {
        width: width,
        height: height
      });
      resizeHelperX = selectedHandle.startPos.x + deltaX;
      resizeHelperY = selectedHandle.startPos.y + deltaY;
      resizeHelperX = resizeHelperX > 0 ? resizeHelperX : 0;
      resizeHelperY = resizeHelperY > 0 ? resizeHelperY : 0;
      dom.setStyles(resizeHelper, {
        left: resizeHelperX,
        top: resizeHelperY,
        display: 'block'
      });
      resizeHelper.innerHTML = width + ' &times; ' + height;
      if (selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width) {
        dom.setStyle(selectedElmGhost, 'left', selectedElmX + (startW - width));
      }
      if (selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height) {
        dom.setStyle(selectedElmGhost, 'top', selectedElmY + (startH - height));
      }
      deltaX = rootElement.scrollWidth - startScrollWidth;
      deltaY = rootElement.scrollHeight - startScrollHeight;
      if (deltaX + deltaY !== 0) {
        dom.setStyles(resizeHelper, {
          left: resizeHelperX - deltaX,
          top: resizeHelperY - deltaY
        });
      }
      if (!resizeStarted) {
        editor.fire('ObjectResizeStart', {
          target: selectedElm,
          width: startW,
          height: startH
        });
        resizeStarted = true;
      }
    };
    var endGhostResize = function () {
      resizeStarted = false;
      var setSizeProp = function (name, value) {
        if (value) {
          if (selectedElm.style[name] || !editor.schema.isValid(selectedElm.nodeName.toLowerCase(), name)) {
            dom.setStyle(getResizeTarget(selectedElm), name, value);
          } else {
            dom.setAttrib(getResizeTarget(selectedElm), name, value);
          }
        }
      };
      setSizeProp('width', width);
      setSizeProp('height', height);
      dom.unbind(editableDoc, 'mousemove', resizeGhostElement);
      dom.unbind(editableDoc, 'mouseup', endGhostResize);
      if (rootDocument != editableDoc) {
        dom.unbind(rootDocument, 'mousemove', resizeGhostElement);
        dom.unbind(rootDocument, 'mouseup', endGhostResize);
      }
      dom.remove(selectedElmGhost);
      dom.remove(resizeHelper);
      showResizeRect(selectedElm);
      editor.fire('ObjectResized', {
        target: selectedElm,
        width: width,
        height: height
      });
      dom.setAttrib(selectedElm, 'style', dom.getAttrib(selectedElm, 'style'));
      editor.nodeChanged();
    };
    var showResizeRect = function (targetElm) {
      var position, targetWidth, targetHeight, e, rect;
      hideResizeRect();
      unbindResizeHandleEvents();
      position = dom.getPos(targetElm, rootElement);
      selectedElmX = position.x;
      selectedElmY = position.y;
      rect = targetElm.getBoundingClientRect();
      targetWidth = rect.width || rect.right - rect.left;
      targetHeight = rect.height || rect.bottom - rect.top;
      if (selectedElm != targetElm) {
        selectedElm = targetElm;
        width = height = 0;
      }
      e = editor.fire('ObjectSelected', { target: targetElm });
      if (isResizable(targetElm) && !e.isDefaultPrevented()) {
        each(resizeHandles, function (handle, name) {
          var handleElm;
          var startDrag = function (e) {
            startX = e.screenX;
            startY = e.screenY;
            startW = getResizeTarget(selectedElm).clientWidth;
            startH = getResizeTarget(selectedElm).clientHeight;
            ratio = startH / startW;
            selectedHandle = handle;
            handle.startPos = {
              x: targetWidth * handle[0] + selectedElmX,
              y: targetHeight * handle[1] + selectedElmY
            };
            startScrollWidth = rootElement.scrollWidth;
            startScrollHeight = rootElement.scrollHeight;
            selectedElmGhost = selectedElm.cloneNode(true);
            dom.addClass(selectedElmGhost, 'mce-clonedresizable');
            dom.setAttrib(selectedElmGhost, 'data-mce-bogus', 'all');
            selectedElmGhost.contentEditable = false;
            selectedElmGhost.unSelectabe = true;
            dom.setStyles(selectedElmGhost, {
              left: selectedElmX,
              top: selectedElmY,
              margin: 0
            });
            selectedElmGhost.removeAttribute('data-mce-selected');
            rootElement.appendChild(selectedElmGhost);
            dom.bind(editableDoc, 'mousemove', resizeGhostElement);
            dom.bind(editableDoc, 'mouseup', endGhostResize);
            if (rootDocument != editableDoc) {
              dom.bind(rootDocument, 'mousemove', resizeGhostElement);
              dom.bind(rootDocument, 'mouseup', endGhostResize);
            }
            resizeHelper = dom.add(rootElement, 'div', {
              'class': 'mce-resize-helper',
              'data-mce-bogus': 'all'
            }, startW + ' &times; ' + startH);
          };
          handleElm = dom.get('mceResizeHandle' + name);
          if (handleElm) {
            dom.remove(handleElm);
          }
          handleElm = dom.add(rootElement, 'div', {
            id: 'mceResizeHandle' + name,
            'data-mce-bogus': 'all',
            'class': 'mce-resizehandle',
            unselectable: true,
            style: 'cursor:' + name + '-resize; margin:0; padding:0'
          });
          if ($_dtgtsy9jc7tm6gs.ie) {
            handleElm.contentEditable = false;
          }
          dom.bind(handleElm, 'mousedown', function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            startDrag(e);
          });
          handle.elm = handleElm;
          dom.setStyles(handleElm, {
            left: targetWidth * handle[0] + selectedElmX - handleElm.offsetWidth / 2,
            top: targetHeight * handle[1] + selectedElmY - handleElm.offsetHeight / 2
          });
        });
      } else {
        hideResizeRect();
      }
      selectedElm.setAttribute('data-mce-selected', '1');
    };
    var hideResizeRect = function () {
      var name, handleElm;
      unbindResizeHandleEvents();
      if (selectedElm) {
        selectedElm.removeAttribute('data-mce-selected');
      }
      for (name in resizeHandles) {
        handleElm = dom.get('mceResizeHandle' + name);
        if (handleElm) {
          dom.unbind(handleElm);
          dom.remove(handleElm);
        }
      }
    };
    var updateResizeRect = function (e) {
      var startElm, controlElm;
      var isChildOrEqual = function (node, parent) {
        if (node) {
          do {
            if (node === parent) {
              return true;
            }
          } while (node = node.parentNode);
        }
      };
      if (resizeStarted || editor.removed) {
        return;
      }
      each(dom.select('img[data-mce-selected],hr[data-mce-selected]'), function (img) {
        img.removeAttribute('data-mce-selected');
      });
      controlElm = e.type == 'mousedown' ? e.target : selection.getNode();
      controlElm = dom.$(controlElm).closest('table,img,figure.image,hr')[0];
      if (isChildOrEqual(controlElm, rootElement)) {
        disableGeckoResize();
        startElm = selection.getStart(true);
        if (isChildOrEqual(startElm, controlElm) && isChildOrEqual(selection.getEnd(true), controlElm)) {
          showResizeRect(controlElm);
          return;
        }
      }
      hideResizeRect();
    };
    var isWithinContentEditableFalse = function (elm) {
      return isContentEditableFalse$9(getContentEditableRoot$1(editor.getBody(), elm));
    };
    var unbindResizeHandleEvents = function () {
      for (var name in resizeHandles) {
        var handle = resizeHandles[name];
        if (handle.elm) {
          dom.unbind(handle.elm);
          delete handle.elm;
        }
      }
    };
    var disableGeckoResize = function () {
      try {
        editor.getDoc().execCommand('enableObjectResizing', false, false);
      } catch (ex) {
      }
    };
    editor.on('init', function () {
      disableGeckoResize();
      if ($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie >= 11) {
        editor.on('mousedown click', function (e) {
          var target = e.target, nodeName = target.nodeName;
          if (!resizeStarted && /^(TABLE|IMG|HR)$/.test(nodeName) && !isWithinContentEditableFalse(target)) {
            if (e.button !== 2) {
              editor.selection.select(target, nodeName == 'TABLE');
            }
            if (e.type == 'mousedown') {
              editor.nodeChanged();
            }
          }
        });
        editor.dom.bind(rootElement, 'mscontrolselect', function (e) {
          var delayedSelect = function (node) {
            $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
              editor.selection.select(node);
            });
          };
          if (isWithinContentEditableFalse(e.target)) {
            e.preventDefault();
            delayedSelect(e.target);
            return;
          }
          if (/^(TABLE|IMG|HR)$/.test(e.target.nodeName)) {
            e.preventDefault();
            if (e.target.tagName == 'IMG') {
              delayedSelect(e.target);
            }
          }
        });
      }
      var throttledUpdateResizeRect = $_9jpiwcgjc7tm6kr.throttle(function (e) {
        if (!editor.composing) {
          updateResizeRect(e);
        }
      });
      editor.on('nodechange ResizeEditor ResizeWindow drop', throttledUpdateResizeRect);
      editor.on('keyup compositionend', function (e) {
        if (selectedElm && selectedElm.nodeName == 'TABLE') {
          throttledUpdateResizeRect(e);
        }
      });
      editor.on('hide blur', hideResizeRect);
      editor.on('contextmenu', contextMenuSelectImage);
    });
    editor.on('remove', unbindResizeHandleEvents);
    var destroy = function () {
      selectedElm = selectedElmGhost = null;
    };
    return {
      isResizable: isResizable,
      showResizeRect: showResizeRect,
      hideResizeRect: hideResizeRect,
      updateResizeRect: updateResizeRect,
      destroy: destroy
    };
  };

  var getPos$1 = function (elm) {
    var x = 0, y = 0;
    var offsetParent = elm;
    while (offsetParent && offsetParent.nodeType) {
      x += offsetParent.offsetLeft || 0;
      y += offsetParent.offsetTop || 0;
      offsetParent = offsetParent.offsetParent;
    }
    return {
      x: x,
      y: y
    };
  };
  var fireScrollIntoViewEvent = function (editor, elm, alignToTop) {
    var scrollEvent = {
      elm: elm,
      alignToTop: alignToTop
    };
    editor.fire('scrollIntoView', scrollEvent);
    return scrollEvent.isDefaultPrevented();
  };
  var scrollIntoView = function (editor, elm, alignToTop) {
    var y, viewPort, dom = editor.dom, root = dom.getRoot(), viewPortY, viewPortH, offsetY = 0;
    if (fireScrollIntoViewEvent(editor, elm, alignToTop)) {
      return;
    }
    if (!$_1qi2bn1qjc7tm70u.isElement(elm)) {
      return;
    }
    if (alignToTop === false) {
      offsetY = elm.offsetHeight;
    }
    if (root.nodeName !== 'BODY') {
      var scrollContainer = editor.selection.getScrollContainer();
      if (scrollContainer) {
        y = getPos$1(elm).y - getPos$1(scrollContainer).y + offsetY;
        viewPortH = scrollContainer.clientHeight;
        viewPortY = scrollContainer.scrollTop;
        if (y < viewPortY || y + 25 > viewPortY + viewPortH) {
          scrollContainer.scrollTop = y < viewPortY ? y : y - viewPortH + 25;
        }
        return;
      }
    }
    viewPort = dom.getViewPort(editor.getWin());
    y = dom.getPos(elm).y + offsetY;
    viewPortY = viewPort.y;
    viewPortH = viewPort.h;
    if (y < viewPort.y || y + 25 > viewPortY + viewPortH) {
      editor.getWin().scrollTo(0, y < viewPortY ? y : y - viewPortH + 25);
    }
  };
  var $_6zkszp60jc7tm873 = { scrollIntoView: scrollIntoView };

  var hasCeProperty = function (node) {
    return $_1qi2bn1qjc7tm70u.isContentEditableTrue(node) || $_1qi2bn1qjc7tm70u.isContentEditableFalse(node);
  };
  var findParent$1 = function (node, rootNode, predicate) {
    while (node && node !== rootNode) {
      if (predicate(node)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var findClosestIeRange = function (clientX, clientY, doc) {
    var element, rng, rects;
    element = doc.elementFromPoint(clientX, clientY);
    rng = doc.body.createTextRange();
    if (!element || element.tagName === 'HTML') {
      element = doc.body;
    }
    rng.moveToElementText(element);
    rects = $_b8tc32jjc7tm6qi.toArray(rng.getClientRects());
    rects = rects.sort(function (a, b) {
      a = Math.abs(Math.max(a.top - clientY, a.bottom - clientY));
      b = Math.abs(Math.max(b.top - clientY, b.bottom - clientY));
      return a - b;
    });
    if (rects.length > 0) {
      clientY = (rects[0].bottom + rects[0].top) / 2;
      try {
        rng.moveToPoint(clientX, clientY);
        rng.collapse(true);
        return rng;
      } catch (ex) {
      }
    }
    return null;
  };
  var moveOutOfContentEditableFalse = function (rng, rootNode) {
    var parentElement = rng && rng.parentElement ? rng.parentElement() : null;
    return $_1qi2bn1qjc7tm70u.isContentEditableFalse(findParent$1(parentElement, rootNode, hasCeProperty)) ? null : rng;
  };
  var fromPoint$1 = function (clientX, clientY, doc) {
    var rng, point;
    if (doc.caretPositionFromPoint) {
      point = doc.caretPositionFromPoint(clientX, clientY);
      if (point) {
        rng = doc.createRange();
        rng.setStart(point.offsetNode, point.offset);
        rng.collapse(true);
      }
    } else if (doc.caretRangeFromPoint) {
      rng = doc.caretRangeFromPoint(clientX, clientY);
    } else if (doc.body.createTextRange) {
      rng = doc.body.createTextRange();
      try {
        rng.moveToPoint(clientX, clientY);
        rng.collapse(true);
      } catch (ex) {
        rng = findClosestIeRange(clientX, clientY, doc);
      }
      return moveOutOfContentEditableFalse(rng, doc.body);
    }
    return rng;
  };
  var $_b5ji3061jc7tm878 = { fromPoint: fromPoint$1 };

  var processRanges = function (editor, ranges) {
    return $_20yqgb4jc7tm6aj.map(ranges, function (range) {
      var evt = editor.fire('GetSelectionRange', { range: range });
      return evt.range !== range ? evt.range : range;
    });
  };
  var $_e4im8y62jc7tm87d = { processRanges: processRanges };

  var clone$2 = function (original, deep) {
    return $_bscr39yjc7tm6uo.fromDom(original.dom().cloneNode(deep));
  };
  var shallow$1 = function (original) {
    return clone$2(original, false);
  };
  var deep$1 = function (original) {
    return clone$2(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_bscr39yjc7tm6uo.fromTag(tag);
    var attributes = $_ftie1r14jc7tm6vz.clone(original);
    $_ftie1r14jc7tm6vz.setAll(nu, attributes);
    return nu;
  };
  var copy$1 = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_15fekq17jc7tm6wo.children(deep$1(original));
    $_2oy1ps2hjc7tm7ab.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_bacixv2fjc7tm79x.before(original, nu);
    var children = $_15fekq17jc7tm6wo.children(original);
    $_2oy1ps2hjc7tm7ab.append(nu, children);
    $_gi2jzz2gjc7tm7a2.remove(original);
    return nu;
  };
  var $_dpw4ev65jc7tm88f = {
    shallow: shallow$1,
    shallowAs: shallowAs,
    deep: deep$1,
    copy: copy$1,
    mutate: mutate
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_20yqgb4jc7tm6aj.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_bscr39yjc7tm6uo.fromDom(fragment);
  };
  var $_285zfp66jc7tm88k = { fromElements: fromElements };

  var getStartNode = function (rng) {
    var sc = rng.startContainer, so = rng.startOffset;
    if ($_1qi2bn1qjc7tm70u.isText(sc)) {
      return so === 0 ? $_e5uurj5jc7tm6bt.some($_bscr39yjc7tm6uo.fromDom(sc)) : $_e5uurj5jc7tm6bt.none();
    } else {
      return $_e5uurj5jc7tm6bt.from(sc.childNodes[so]).map($_bscr39yjc7tm6uo.fromDom);
    }
  };
  var getEndNode = function (rng) {
    var ec = rng.endContainer, eo = rng.endOffset;
    if ($_1qi2bn1qjc7tm70u.isText(ec)) {
      return eo === ec.data.length ? $_e5uurj5jc7tm6bt.some($_bscr39yjc7tm6uo.fromDom(ec)) : $_e5uurj5jc7tm6bt.none();
    } else {
      return $_e5uurj5jc7tm6bt.from(ec.childNodes[eo - 1]).map($_bscr39yjc7tm6uo.fromDom);
    }
  };
  var getFirstChildren = function (node) {
    return $_15fekq17jc7tm6wo.firstChild(node).fold($_f41mrx6jc7tm6cd.constant([node]), function (child) {
      return [node].concat(getFirstChildren(child));
    });
  };
  var getLastChildren$1 = function (node) {
    return $_15fekq17jc7tm6wo.lastChild(node).fold($_f41mrx6jc7tm6cd.constant([node]), function (child) {
      if ($_4bxsjnzjc7tm6uw.name(child) === 'br') {
        return $_15fekq17jc7tm6wo.prevSibling(child).map(function (sibling) {
          return [node].concat(getLastChildren$1(sibling));
        }).getOr([]);
      } else {
        return [node].concat(getLastChildren$1(child));
      }
    });
  };
  var hasAllContentsSelected = function (elm, rng) {
    return $_2siq12djc7tm79e.liftN([
      getStartNode(rng),
      getEndNode(rng)
    ], function (startNode, endNode) {
      var start = $_20yqgb4jc7tm6aj.find(getFirstChildren(elm), $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, startNode));
      var end = $_20yqgb4jc7tm6aj.find(getLastChildren$1(elm), $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, endNode));
      return start.isSome() && end.isSome();
    }).getOr(false);
  };
  var $_jvcf367jc7tm88p = { hasAllContentsSelected: hasAllContentsSelected };

  var tableModel = $_4vs0gm18jc7tm6xh.immutable('element', 'width', 'rows');
  var tableRow = $_4vs0gm18jc7tm6xh.immutable('element', 'cells');
  var cellPosition = $_4vs0gm18jc7tm6xh.immutable('x', 'y');
  var getSpan = function (td, key) {
    var value = parseInt($_ftie1r14jc7tm6vz.get(td, key), 10);
    return isNaN(value) ? 1 : value;
  };
  var fillout = function (table, x, y, tr, td) {
    var rowspan = getSpan(td, 'rowspan');
    var colspan = getSpan(td, 'colspan');
    var rows = table.rows();
    for (var y2 = y; y2 < y + rowspan; y2++) {
      if (!rows[y2]) {
        rows[y2] = tableRow($_dpw4ev65jc7tm88f.deep(tr), []);
      }
      for (var x2 = x; x2 < x + colspan; x2++) {
        var cells = rows[y2].cells();
        cells[x2] = y2 == y && x2 == x ? td : $_dpw4ev65jc7tm88f.shallow(td);
      }
    }
  };
  var cellExists = function (table, x, y) {
    var rows = table.rows();
    var cells = rows[y] ? rows[y].cells() : [];
    return !!cells[x];
  };
  var skipCellsX = function (table, x, y) {
    while (cellExists(table, x, y)) {
      x++;
    }
    return x;
  };
  var getWidth = function (rows) {
    return $_20yqgb4jc7tm6aj.foldl(rows, function (acc, row) {
      return row.cells().length > acc ? row.cells().length : acc;
    }, 0);
  };
  var findElementPos = function (table, element) {
    var rows = table.rows();
    for (var y = 0; y < rows.length; y++) {
      var cells = rows[y].cells();
      for (var x = 0; x < cells.length; x++) {
        if ($_b0e3uw1djc7tm6y8.eq(cells[x], element)) {
          return $_e5uurj5jc7tm6bt.some(cellPosition(x, y));
        }
      }
    }
    return $_e5uurj5jc7tm6bt.none();
  };
  var extractRows = function (table, sx, sy, ex, ey) {
    var newRows = [];
    var rows = table.rows();
    for (var y = sy; y <= ey; y++) {
      var cells = rows[y].cells();
      var slice = sx < ex ? cells.slice(sx, ex + 1) : cells.slice(ex, sx + 1);
      newRows.push(tableRow(rows[y].element(), slice));
    }
    return newRows;
  };
  var subTable = function (table, startPos, endPos) {
    var sx = startPos.x(), sy = startPos.y();
    var ex = endPos.x(), ey = endPos.y();
    var newRows = sy < ey ? extractRows(table, sx, sy, ex, ey) : extractRows(table, sx, ey, ex, sy);
    return tableModel(table.element(), getWidth(newRows), newRows);
  };
  var createDomTable = function (table, rows) {
    var tableElement = $_dpw4ev65jc7tm88f.shallow(table.element());
    var tableBody = $_bscr39yjc7tm6uo.fromTag('tbody');
    $_2oy1ps2hjc7tm7ab.append(tableBody, rows);
    $_bacixv2fjc7tm79x.append(tableElement, tableBody);
    return tableElement;
  };
  var modelRowsToDomRows = function (table) {
    return $_20yqgb4jc7tm6aj.map(table.rows(), function (row) {
      var cells = $_20yqgb4jc7tm6aj.map(row.cells(), function (cell) {
        var td = $_dpw4ev65jc7tm88f.deep(cell);
        $_ftie1r14jc7tm6vz.remove(td, 'colspan');
        $_ftie1r14jc7tm6vz.remove(td, 'rowspan');
        return td;
      });
      var tr = $_dpw4ev65jc7tm88f.shallow(row.element());
      $_2oy1ps2hjc7tm7ab.append(tr, cells);
      return tr;
    });
  };
  var fromDom$1 = function (tableElm) {
    var table = tableModel($_dpw4ev65jc7tm88f.shallow(tableElm), 0, []);
    $_20yqgb4jc7tm6aj.each($_8esf4w2kjc7tm7b6.descendants(tableElm, 'tr'), function (tr, y) {
      $_20yqgb4jc7tm6aj.each($_8esf4w2kjc7tm7b6.descendants(tr, 'td,th'), function (td, x) {
        fillout(table, skipCellsX(table, x, y), y, tr, td);
      });
    });
    return tableModel(table.element(), getWidth(table.rows()), table.rows());
  };
  var toDom = function (table) {
    return createDomTable(table, modelRowsToDomRows(table));
  };
  var subsection = function (table, startElement, endElement) {
    return findElementPos(table, startElement).bind(function (startPos) {
      return findElementPos(table, endElement).map(function (endPos) {
        return subTable(table, startPos, endPos);
      });
    });
  };
  var $_6nsa4068jc7tm891 = {
    fromDom: fromDom$1,
    toDom: toDom,
    subsection: subsection
  };

  var findParentListContainer = function (parents) {
    return $_20yqgb4jc7tm6aj.find(parents, function (elm) {
      return $_4bxsjnzjc7tm6uw.name(elm) === 'ul' || $_4bxsjnzjc7tm6uw.name(elm) === 'ol';
    });
  };
  var getFullySelectedListWrappers = function (parents, rng) {
    return $_20yqgb4jc7tm6aj.find(parents, function (elm) {
      return $_4bxsjnzjc7tm6uw.name(elm) === 'li' && $_jvcf367jc7tm88p.hasAllContentsSelected(elm, rng);
    }).fold($_f41mrx6jc7tm6cd.constant([]), function (li) {
      return findParentListContainer(parents).map(function (listCont) {
        return [
          $_bscr39yjc7tm6uo.fromTag('li'),
          $_bscr39yjc7tm6uo.fromTag($_4bxsjnzjc7tm6uw.name(listCont))
        ];
      }).getOr([]);
    });
  };
  var wrap$3 = function (innerElm, elms) {
    var wrapped = $_20yqgb4jc7tm6aj.foldl(elms, function (acc, elm) {
      $_bacixv2fjc7tm79x.append(elm, acc);
      return elm;
    }, innerElm);
    return elms.length > 0 ? $_285zfp66jc7tm88k.fromElements([wrapped]) : wrapped;
  };
  var directListWrappers = function (commonAnchorContainer) {
    if ($_8zplag1pjc7tm70h.isListItem(commonAnchorContainer)) {
      return $_15fekq17jc7tm6wo.parent(commonAnchorContainer).filter($_8zplag1pjc7tm70h.isList).fold($_f41mrx6jc7tm6cd.constant([]), function (listElm) {
        return [
          commonAnchorContainer,
          listElm
        ];
      });
    } else {
      return $_8zplag1pjc7tm70h.isList(commonAnchorContainer) ? [commonAnchorContainer] : [];
    }
  };
  var getWrapElements = function (rootNode, rng) {
    var commonAnchorContainer = $_bscr39yjc7tm6uo.fromDom(rng.commonAncestorContainer);
    var parents = $_75x9wp33jc7tm7hb.parentsAndSelf(commonAnchorContainer, rootNode);
    var wrapElements = $_20yqgb4jc7tm6aj.filter(parents, function (elm) {
      return $_8zplag1pjc7tm70h.isInline(elm) || $_8zplag1pjc7tm70h.isHeading(elm);
    });
    var listWrappers = getFullySelectedListWrappers(parents, rng);
    var allWrappers = wrapElements.concat(listWrappers.length ? listWrappers : directListWrappers(commonAnchorContainer));
    return $_20yqgb4jc7tm6aj.map(allWrappers, $_dpw4ev65jc7tm88f.shallow);
  };
  var emptyFragment = function () {
    return $_285zfp66jc7tm88k.fromElements([]);
  };
  var getFragmentFromRange = function (rootNode, rng) {
    return wrap$3($_bscr39yjc7tm6uo.fromDom(rng.cloneContents()), getWrapElements(rootNode, rng));
  };
  var getParentTable = function (rootElm, cell) {
    return $_d6v5nd31jc7tm7gs.ancestor(cell, 'table', $_f41mrx6jc7tm6cd.curry($_b0e3uw1djc7tm6y8.eq, rootElm));
  };
  var getTableFragment = function (rootNode, selectedTableCells) {
    return getParentTable(rootNode, selectedTableCells[0]).bind(function (tableElm) {
      var firstCell = selectedTableCells[0];
      var lastCell = selectedTableCells[selectedTableCells.length - 1];
      var fullTableModel = $_6nsa4068jc7tm891.fromDom(tableElm);
      return $_6nsa4068jc7tm891.subsection(fullTableModel, firstCell, lastCell).map(function (sectionedTableModel) {
        return $_285zfp66jc7tm88k.fromElements([$_6nsa4068jc7tm891.toDom(sectionedTableModel)]);
      });
    }).getOrThunk(emptyFragment);
  };
  var getSelectionFragment = function (rootNode, ranges) {
    return ranges.length > 0 && ranges[0].collapsed ? emptyFragment() : getFragmentFromRange(rootNode, ranges[0]);
  };
  var read$3 = function (rootNode, ranges) {
    var selectedCells = $_118s3f3pjc7tm7nm.getCellsFromElementOrRanges(ranges, rootNode);
    return selectedCells.length > 0 ? getTableFragment(rootNode, selectedCells) : getSelectionFragment(rootNode, ranges);
  };
  var $_c3o6yk64jc7tm87q = { read: read$3 };

  var getContent = function (editor, args) {
    var rng = editor.selection.getRng(), tmpElm = editor.dom.create('body');
    var sel = editor.selection.getSel(), fragment;
    var ranges = $_e4im8y62jc7tm87d.processRanges(editor, $_43ngx63qjc7tm7o4.getRanges(sel));
    args = args || {};
    args.get = true;
    args.format = args.format || 'html';
    args.selection = true;
    args = editor.fire('BeforeGetContent', args);
    if (args.isDefaultPrevented()) {
      editor.fire('GetContent', args);
      return args.content;
    }
    if (args.format === 'text') {
      return editor.selection.isCollapsed() ? '' : $_55zd6d21jc7tm765.trim(rng.text || (sel.toString ? sel.toString() : ''));
    }
    if (rng.cloneContents) {
      fragment = args.contextual ? $_c3o6yk64jc7tm87q.read($_bscr39yjc7tm6uo.fromDom(editor.getBody()), ranges).dom() : rng.cloneContents();
      if (fragment) {
        tmpElm.appendChild(fragment);
      }
    } else if (rng.item !== undefined || rng.htmlText !== undefined) {
      tmpElm.innerHTML = '<br>' + (rng.item ? rng.item(0).outerHTML : rng.htmlText);
      tmpElm.removeChild(tmpElm.firstChild);
    } else {
      tmpElm.innerHTML = rng.toString();
    }
    args.getInner = true;
    var content = editor.selection.serializer.serialize(tmpElm, args);
    if (args.format === 'tree') {
      return content;
    }
    args.content = editor.selection.isCollapsed() ? '' : content;
    editor.fire('GetContent', args);
    return args.content;
  };
  var $_day8s963jc7tm87j = { getContent: getContent };

  var setContent = function (editor, content, args) {
    var rng = editor.selection.getRng(), caretNode, doc = editor.getDoc(), frag, temp;
    args = args || { format: 'html' };
    args.set = true;
    args.selection = true;
    args.content = content;
    if (!args.no_events) {
      args = editor.fire('BeforeSetContent', args);
      if (args.isDefaultPrevented()) {
        editor.fire('SetContent', args);
        return;
      }
    }
    content = args.content;
    if (rng.insertNode) {
      content += '<span id="__caret">_</span>';
      if (rng.startContainer == doc && rng.endContainer == doc) {
        doc.body.innerHTML = content;
      } else {
        rng.deleteContents();
        if (doc.body.childNodes.length === 0) {
          doc.body.innerHTML = content;
        } else {
          if (rng.createContextualFragment) {
            rng.insertNode(rng.createContextualFragment(content));
          } else {
            frag = doc.createDocumentFragment();
            temp = doc.createElement('div');
            frag.appendChild(temp);
            temp.outerHTML = content;
            rng.insertNode(frag);
          }
        }
      }
      caretNode = editor.dom.get('__caret');
      rng = doc.createRange();
      rng.setStartBefore(caretNode);
      rng.setEndBefore(caretNode);
      editor.selection.setRng(rng);
      editor.dom.remove('__caret');
      try {
        editor.selection.setRng(rng);
      } catch (ex) {
      }
    } else {
      if (rng.item) {
        doc.execCommand('Delete', false, null);
        rng = editor.getRng();
      }
      if (/^\s+/.test(content)) {
        rng.pasteHTML('<span id="__mce_tmp">_</span>' + content);
        editor.dom.remove('__mce_tmp');
      } else {
        rng.pasteHTML(content);
      }
    }
    if (!args.no_events) {
      editor.fire('SetContent', args);
    }
  };
  var $_al2zsh69jc7tm89i = { setContent: setContent };

  var each$21 = $_b8tc32jjc7tm6qi.each;
  var trim$5 = $_b8tc32jjc7tm6qi.trim;
  var isAttachedToDom = function (node) {
    return !!(node && node.ownerDocument) && $_b0e3uw1djc7tm6y8.contains($_bscr39yjc7tm6uo.fromDom(node.ownerDocument), $_bscr39yjc7tm6uo.fromDom(node));
  };
  var isValidRange = function (rng) {
    if (!rng) {
      return false;
    } else if (rng.select) {
      return true;
    } else {
      return isAttachedToDom(rng.startContainer) && isAttachedToDom(rng.endContainer);
    }
  };
  var Selection$1 = function (dom, win, serializer, editor) {
    var self = this;
    self.dom = dom;
    self.win = win;
    self.serializer = serializer;
    self.editor = editor;
    self.bookmarkManager = new BookmarkManager(self);
    self.controlSelection = ControlSelection(self, editor);
  };
  Selection$1.prototype = {
    setCursorLocation: function (node, offset) {
      var self = this, rng = self.dom.createRng();
      if (!node) {
        self._moveEndPoint(rng, self.editor.getBody(), true);
        self.setRng(rng);
      } else {
        rng.setStart(node, offset);
        rng.setEnd(node, offset);
        self.setRng(rng);
        self.collapse(false);
      }
    },
    getContent: function (args) {
      return $_day8s963jc7tm87j.getContent(this.editor, args);
    },
    setContent: function (content, args) {
      $_al2zsh69jc7tm89i.setContent(this.editor, content, args);
    },
    getStart: function (real) {
      var self = this, rng = self.getRng(), startElement;
      startElement = rng.startContainer;
      if (startElement.nodeType == 1 && startElement.hasChildNodes()) {
        if (!real || !rng.collapsed) {
          startElement = startElement.childNodes[Math.min(startElement.childNodes.length - 1, rng.startOffset)];
        }
      }
      if (startElement && startElement.nodeType == 3) {
        return startElement.parentNode;
      }
      return startElement;
    },
    getEnd: function (real) {
      var self = this, rng = self.getRng(), endElement, endOffset;
      endElement = rng.endContainer;
      endOffset = rng.endOffset;
      if (endElement.nodeType == 1 && endElement.hasChildNodes()) {
        if (!real || !rng.collapsed) {
          endElement = endElement.childNodes[endOffset > 0 ? endOffset - 1 : endOffset];
        }
      }
      if (endElement && endElement.nodeType == 3) {
        return endElement.parentNode;
      }
      return endElement;
    },
    getBookmark: function (type, normalized) {
      return this.bookmarkManager.getBookmark(type, normalized);
    },
    moveToBookmark: function (bookmark) {
      return this.bookmarkManager.moveToBookmark(bookmark);
    },
    select: function (node, content) {
      var self = this, dom = self.dom, rng = dom.createRng(), idx;
      if (node) {
        idx = dom.nodeIndex(node);
        rng.setStart(node.parentNode, idx);
        rng.setEnd(node.parentNode, idx + 1);
        if (content) {
          self._moveEndPoint(rng, node, true);
          self._moveEndPoint(rng, node);
        }
        self.setRng(rng);
      }
      return node;
    },
    isCollapsed: function () {
      var self = this, rng = self.getRng(), sel = self.getSel();
      if (!rng || rng.item) {
        return false;
      }
      if (rng.compareEndPoints) {
        return rng.compareEndPoints('StartToEnd', rng) === 0;
      }
      return !sel || rng.collapsed;
    },
    collapse: function (toStart) {
      var self = this, rng = self.getRng();
      rng.collapse(!!toStart);
      self.setRng(rng);
    },
    getSel: function () {
      var win = this.win;
      return win.getSelection ? win.getSelection() : win.document.selection;
    },
    getRng: function (w3c) {
      var self = this, selection, rng, elm, doc;
      var tryCompareBoundaryPoints = function (how, sourceRange, destinationRange) {
        try {
          return sourceRange.compareBoundaryPoints(how, destinationRange);
        } catch (ex) {
          return -1;
        }
      };
      if (!self.win) {
        return null;
      }
      doc = self.win.document;
      if (typeof doc === 'undefined' || doc === null) {
        return null;
      }
      if (self.editor.bookmark !== undefined && $_9dadsv44jc7tm7rb.hasFocus(self.editor) === false) {
        var bookmark = $_5o1m7s3ujc7tm7p1.getRng(self.editor);
        if (bookmark.isSome()) {
          return bookmark.getOr(doc.createRange());
        }
      }
      try {
        if (selection = self.getSel()) {
          if (selection.rangeCount > 0) {
            rng = selection.getRangeAt(0);
          } else {
            rng = selection.createRange ? selection.createRange() : doc.createRange();
          }
        }
      } catch (ex) {
      }
      rng = $_e4im8y62jc7tm87d.processRanges(self.editor, [rng])[0];
      if (!rng) {
        rng = doc.createRange ? doc.createRange() : doc.body.createTextRange();
      }
      if (rng.setStart && rng.startContainer.nodeType === 9 && rng.collapsed) {
        elm = self.dom.getRoot();
        rng.setStart(elm, 0);
        rng.setEnd(elm, 0);
      }
      if (self.selectedRange && self.explicitRange) {
        if (tryCompareBoundaryPoints(rng.START_TO_START, rng, self.selectedRange) === 0 && tryCompareBoundaryPoints(rng.END_TO_END, rng, self.selectedRange) === 0) {
          rng = self.explicitRange;
        } else {
          self.selectedRange = null;
          self.explicitRange = null;
        }
      }
      return rng;
    },
    setRng: function (rng, forward) {
      var self = this, sel, node, evt;
      if (!isValidRange(rng)) {
        return;
      }
      if (rng.select) {
        self.explicitRange = null;
        try {
          rng.select();
        } catch (ex) {
        }
        return;
      }
      sel = self.getSel();
      evt = self.editor.fire('SetSelectionRange', {
        range: rng,
        forward: forward
      });
      rng = evt.range;
      if (sel) {
        self.explicitRange = rng;
        try {
          sel.removeAllRanges();
          sel.addRange(rng);
        } catch (ex) {
        }
        if (forward === false && sel.extend) {
          sel.collapse(rng.endContainer, rng.endOffset);
          sel.extend(rng.startContainer, rng.startOffset);
        }
        self.selectedRange = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
      }
      if (!rng.collapsed && rng.startContainer === rng.endContainer && sel.setBaseAndExtent && !$_dtgtsy9jc7tm6gs.ie) {
        if (rng.endOffset - rng.startOffset < 2) {
          if (rng.startContainer.hasChildNodes()) {
            node = rng.startContainer.childNodes[rng.startOffset];
            if (node && node.tagName === 'IMG') {
              sel.setBaseAndExtent(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset);
              if (sel.anchorNode !== rng.startContainer || sel.focusNode !== rng.endContainer) {
                sel.setBaseAndExtent(node, 0, node, 1);
              }
            }
          }
        }
      }
      self.editor.fire('AfterSetSelectionRange', {
        range: rng,
        forward: forward
      });
    },
    setNode: function (elm) {
      var self = this;
      self.setContent(self.dom.getOuterHTML(elm));
      return elm;
    },
    getNode: function () {
      var self = this, rng = self.getRng(), elm;
      var startContainer, endContainer, startOffset, endOffset, root = self.dom.getRoot();
      var skipEmptyTextNodes = function (node, forwards) {
        var orig = node;
        while (node && node.nodeType === 3 && node.length === 0) {
          node = forwards ? node.nextSibling : node.previousSibling;
        }
        return node || orig;
      };
      if (!rng) {
        return root;
      }
      startContainer = rng.startContainer;
      endContainer = rng.endContainer;
      startOffset = rng.startOffset;
      endOffset = rng.endOffset;
      elm = rng.commonAncestorContainer;
      if (!rng.collapsed) {
        if (startContainer == endContainer) {
          if (endOffset - startOffset < 2) {
            if (startContainer.hasChildNodes()) {
              elm = startContainer.childNodes[startOffset];
            }
          }
        }
        if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
          if (startContainer.length === startOffset) {
            startContainer = skipEmptyTextNodes(startContainer.nextSibling, true);
          } else {
            startContainer = startContainer.parentNode;
          }
          if (endOffset === 0) {
            endContainer = skipEmptyTextNodes(endContainer.previousSibling, false);
          } else {
            endContainer = endContainer.parentNode;
          }
          if (startContainer && startContainer === endContainer) {
            return startContainer;
          }
        }
      }
      if (elm && elm.nodeType == 3) {
        return elm.parentNode;
      }
      return elm;
    },
    getSelectedBlocks: function (startElm, endElm) {
      var self = this, dom = self.dom, node, root, selectedBlocks = [];
      root = dom.getRoot();
      startElm = dom.getParent(startElm || self.getStart(), dom.isBlock);
      endElm = dom.getParent(endElm || self.getEnd(), dom.isBlock);
      if (startElm && startElm != root) {
        selectedBlocks.push(startElm);
      }
      if (startElm && endElm && startElm != endElm) {
        node = startElm;
        var walker = new TreeWalker(startElm, root);
        while ((node = walker.next()) && node != endElm) {
          if (dom.isBlock(node)) {
            selectedBlocks.push(node);
          }
        }
      }
      if (endElm && startElm != endElm && endElm != root) {
        selectedBlocks.push(endElm);
      }
      return selectedBlocks;
    },
    isForward: function () {
      var dom = this.dom, sel = this.getSel(), anchorRange, focusRange;
      if (!sel || !sel.anchorNode || !sel.focusNode) {
        return true;
      }
      anchorRange = dom.createRng();
      anchorRange.setStart(sel.anchorNode, sel.anchorOffset);
      anchorRange.collapse(true);
      focusRange = dom.createRng();
      focusRange.setStart(sel.focusNode, sel.focusOffset);
      focusRange.collapse(true);
      return anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, focusRange) <= 0;
    },
    normalize: function () {
      var self = this, rng = self.getRng();
      if (!$_43ngx63qjc7tm7o4.hasMultipleRanges(self.getSel())) {
        var normRng = $_ca2q7b3sjc7tm7ol.normalize(self.dom, rng);
        normRng.each(function (normRng) {
          self.setRng(normRng, self.isForward());
        });
        return normRng.getOr(rng);
      }
      return rng;
    },
    selectorChanged: function (selector, callback) {
      var self = this, currentSelectors;
      if (!self.selectorChangedData) {
        self.selectorChangedData = {};
        currentSelectors = {};
        self.editor.on('NodeChange', function (e) {
          var node = e.element, dom = self.dom, parents = dom.getParents(node, null, dom.getRoot()), matchedSelectors = {};
          each$21(self.selectorChangedData, function (callbacks, selector) {
            each$21(parents, function (node) {
              if (dom.is(node, selector)) {
                if (!currentSelectors[selector]) {
                  each$21(callbacks, function (callback) {
                    callback(true, {
                      node: node,
                      selector: selector,
                      parents: parents
                    });
                  });
                  currentSelectors[selector] = callbacks;
                }
                matchedSelectors[selector] = callbacks;
                return false;
              }
            });
          });
          each$21(currentSelectors, function (callbacks, selector) {
            if (!matchedSelectors[selector]) {
              delete currentSelectors[selector];
              each$21(callbacks, function (callback) {
                callback(false, {
                  node: node,
                  selector: selector,
                  parents: parents
                });
              });
            }
          });
        });
      }
      if (!self.selectorChangedData[selector]) {
        self.selectorChangedData[selector] = [];
      }
      self.selectorChangedData[selector].push(callback);
      return self;
    },
    getScrollContainer: function () {
      var scrollContainer, node = this.dom.getRoot();
      while (node && node.nodeName != 'BODY') {
        if (node.scrollHeight > node.clientHeight) {
          scrollContainer = node;
          break;
        }
        node = node.parentNode;
      }
      return scrollContainer;
    },
    scrollIntoView: function (elm, alignToTop) {
      $_6zkszp60jc7tm873.scrollIntoView(this.editor, elm, alignToTop);
    },
    placeCaretAt: function (clientX, clientY) {
      this.setRng($_b5ji3061jc7tm878.fromPoint(clientX, clientY, this.editor.getDoc()));
    },
    _moveEndPoint: function (rng, node, start) {
      var root = node, walker = new TreeWalker(node, root);
      var nonEmptyElementsMap = this.dom.schema.getNonEmptyElements();
      do {
        if (node.nodeType == 3 && trim$5(node.nodeValue).length !== 0) {
          if (start) {
            rng.setStart(node, 0);
          } else {
            rng.setEnd(node, node.nodeValue.length);
          }
          return;
        }
        if (nonEmptyElementsMap[node.nodeName] && !/^(TD|TH)$/.test(node.nodeName)) {
          if (start) {
            rng.setStartBefore(node);
          } else {
            if (node.nodeName == 'BR') {
              rng.setEndBefore(node);
            } else {
              rng.setEndAfter(node);
            }
          }
          return;
        }
        if ($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 11 && this.dom.isBlock(node) && this.dom.isEmpty(node)) {
          if (start) {
            rng.setStart(node, 0);
          } else {
            rng.setEnd(node, 0);
          }
          return;
        }
      } while (node = start ? walker.next() : walker.prev());
      if (root.nodeName == 'BODY') {
        if (start) {
          rng.setStart(root, 0);
        } else {
          rng.setEnd(root, root.childNodes.length);
        }
      }
    },
    getBoundingClientRect: function () {
      var rng = this.getRng();
      return rng.collapsed ? CaretPosition.fromRangeStart(rng).getClientRects()[0] : rng.getBoundingClientRect();
    },
    destroy: function () {
      this.win = null;
      this.controlSelection.destroy();
    }
  };

  var curry$4 = $_fy81ys25jc7tm77a.curry;
  var findUntil = function (direction, rootNode, predicateFn, node) {
    while (node = $_4knc0r27jc7tm77s.findNode(node, direction, $_bnhdlx1zjc7tm75s.isEditableCaretCandidate, rootNode)) {
      if (predicateFn(node)) {
        return;
      }
    }
  };
  var walkUntil$1 = function (direction, isAboveFn, isBeflowFn, rootNode, predicateFn, caretPosition) {
    var line = 0, node, result = [], targetClientRect;
    var add = function (node) {
      var i, clientRect, clientRects;
      clientRects = $_fx9egk51jc7tm7yd.getClientRects(node);
      if (direction == -1) {
        clientRects = clientRects.reverse();
      }
      for (i = 0; i < clientRects.length; i++) {
        clientRect = clientRects[i];
        if (isBeflowFn(clientRect, targetClientRect)) {
          continue;
        }
        if (result.length > 0 && isAboveFn(clientRect, $_gf68zqkjc7tm6r7.last(result))) {
          line++;
        }
        clientRect.line = line;
        if (predicateFn(clientRect)) {
          return true;
        }
        result.push(clientRect);
      }
    };
    targetClientRect = $_gf68zqkjc7tm6r7.last(caretPosition.getClientRects());
    if (!targetClientRect) {
      return result;
    }
    node = caretPosition.getNode();
    add(node);
    findUntil(direction, rootNode, add, node);
    return result;
  };
  var aboveLineNumber = function (lineNumber, clientRect) {
    return clientRect.line > lineNumber;
  };
  var isLine = function (lineNumber, clientRect) {
    return clientRect.line === lineNumber;
  };
  var upUntil = curry$4(walkUntil$1, -1, $_dqnspu22jc7tm76a.isAbove, $_dqnspu22jc7tm76a.isBelow);
  var downUntil = curry$4(walkUntil$1, 1, $_dqnspu22jc7tm76a.isBelow, $_dqnspu22jc7tm76a.isAbove);
  var positionsUntil = function (direction, rootNode, predicateFn, node) {
    var caretWalker = CaretWalker(rootNode), walkFn, isBelowFn, isAboveFn, caretPosition, result = [], line = 0, clientRect, targetClientRect;
    var getClientRect = function (caretPosition) {
      if (direction == 1) {
        return $_gf68zqkjc7tm6r7.last(caretPosition.getClientRects());
      }
      return $_gf68zqkjc7tm6r7.last(caretPosition.getClientRects());
    };
    if (direction == 1) {
      walkFn = caretWalker.next;
      isBelowFn = $_dqnspu22jc7tm76a.isBelow;
      isAboveFn = $_dqnspu22jc7tm76a.isAbove;
      caretPosition = CaretPosition.after(node);
    } else {
      walkFn = caretWalker.prev;
      isBelowFn = $_dqnspu22jc7tm76a.isAbove;
      isAboveFn = $_dqnspu22jc7tm76a.isBelow;
      caretPosition = CaretPosition.before(node);
    }
    targetClientRect = getClientRect(caretPosition);
    do {
      if (!caretPosition.isVisible()) {
        continue;
      }
      clientRect = getClientRect(caretPosition);
      if (isAboveFn(clientRect, targetClientRect)) {
        continue;
      }
      if (result.length > 0 && isBelowFn(clientRect, $_gf68zqkjc7tm6r7.last(result))) {
        line++;
      }
      clientRect = $_dqnspu22jc7tm76a.clone(clientRect);
      clientRect.position = caretPosition;
      clientRect.line = line;
      if (predicateFn(clientRect)) {
        return result;
      }
      result.push(clientRect);
    } while (caretPosition = walkFn(caretPosition));
    return result;
  };
  var $_8h90re6djc7tm8aa = {
    upUntil: upUntil,
    downUntil: downUntil,
    positionsUntil: positionsUntil,
    isAboveLine: curry$4(aboveLineNumber),
    isLine: curry$4(isLine)
  };

  var isContentEditableFalse$10 = $_1qi2bn1qjc7tm70u.isContentEditableFalse;
  var getSelectedNode$1 = $_4yp5rq23jc7tm76g.getSelectedNode;
  var isAfterContentEditableFalse$1 = $_4knc0r27jc7tm77s.isAfterContentEditableFalse;
  var isBeforeContentEditableFalse$1 = $_4knc0r27jc7tm77s.isBeforeContentEditableFalse;
  var getVisualCaretPosition = function (walkFn, caretPosition) {
    while (caretPosition = walkFn(caretPosition)) {
      if (caretPosition.isVisible()) {
        return caretPosition;
      }
    }
    return caretPosition;
  };
  var isMoveInsideSameBlock = function (fromCaretPosition, toCaretPosition) {
    var inSameBlock = $_4knc0r27jc7tm77s.isInSameBlock(fromCaretPosition, toCaretPosition);
    if (!inSameBlock && $_1qi2bn1qjc7tm70u.isBr(fromCaretPosition.getNode())) {
      return true;
    }
    return inSameBlock;
  };
  var isRangeInCaretContainerBlock = function (range) {
    return $_40segn20jc7tm75y.isCaretContainerBlock(range.startContainer);
  };
  var getNormalizedRangeEndPoint = function (direction, rootNode, range) {
    range = $_4knc0r27jc7tm77s.normalizeRange(direction, rootNode, range);
    if (direction === -1) {
      return CaretPosition.fromRangeStart(range);
    }
    return CaretPosition.fromRangeEnd(range);
  };
  var moveToCeFalseHorizontally = function (direction, editor, getNextPosFn, isBeforeContentEditableFalseFn, range) {
    var node, caretPosition, peekCaretPosition, rangeIsInContainerBlock;
    if (!range.collapsed) {
      node = getSelectedNode$1(range);
      if (isContentEditableFalse$10(node)) {
        return $_ebmpgm55jc7tm7yv.showCaret(direction, editor, node, direction === -1);
      }
    }
    rangeIsInContainerBlock = isRangeInCaretContainerBlock(range);
    caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range);
    if (isBeforeContentEditableFalseFn(caretPosition)) {
      return $_ebmpgm55jc7tm7yv.selectNode(editor, caretPosition.getNode(direction === -1));
    }
    caretPosition = getNextPosFn(caretPosition);
    if (!caretPosition) {
      if (rangeIsInContainerBlock) {
        return range;
      }
      return null;
    }
    if (isBeforeContentEditableFalseFn(caretPosition)) {
      return $_ebmpgm55jc7tm7yv.showCaret(direction, editor, caretPosition.getNode(direction === -1), direction === 1);
    }
    peekCaretPosition = getNextPosFn(caretPosition);
    if (isBeforeContentEditableFalseFn(peekCaretPosition)) {
      if (isMoveInsideSameBlock(caretPosition, peekCaretPosition)) {
        return $_ebmpgm55jc7tm7yv.showCaret(direction, editor, peekCaretPosition.getNode(direction === -1), direction === 1);
      }
    }
    if (rangeIsInContainerBlock) {
      return $_ebmpgm55jc7tm7yv.renderRangeCaret(editor, caretPosition.toRange());
    }
    return null;
  };
  var moveToCeFalseVertically = function (direction, editor, walkerFn, range) {
    var caretPosition, linePositions, nextLinePositions, closestNextLineRect, caretClientRect, clientX, dist1, dist2, contentEditableFalseNode;
    contentEditableFalseNode = getSelectedNode$1(range);
    caretPosition = getNormalizedRangeEndPoint(direction, editor.getBody(), range);
    linePositions = walkerFn(editor.getBody(), $_8h90re6djc7tm8aa.isAboveLine(1), caretPosition);
    nextLinePositions = $_gf68zqkjc7tm6r7.filter(linePositions, $_8h90re6djc7tm8aa.isLine(1));
    caretClientRect = $_gf68zqkjc7tm6r7.last(caretPosition.getClientRects());
    if (isBeforeContentEditableFalse$1(caretPosition)) {
      contentEditableFalseNode = caretPosition.getNode();
    }
    if (isAfterContentEditableFalse$1(caretPosition)) {
      contentEditableFalseNode = caretPosition.getNode(true);
    }
    if (!caretClientRect) {
      return null;
    }
    clientX = caretClientRect.left;
    closestNextLineRect = $_87htka50jc7tm7y9.findClosestClientRect(nextLinePositions, clientX);
    if (closestNextLineRect) {
      if (isContentEditableFalse$10(closestNextLineRect.node)) {
        dist1 = Math.abs(clientX - closestNextLineRect.left);
        dist2 = Math.abs(clientX - closestNextLineRect.right);
        return $_ebmpgm55jc7tm7yv.showCaret(direction, editor, closestNextLineRect.node, dist1 < dist2);
      }
    }
    if (contentEditableFalseNode) {
      var caretPositions = $_8h90re6djc7tm8aa.positionsUntil(direction, editor.getBody(), $_8h90re6djc7tm8aa.isAboveLine(1), contentEditableFalseNode);
      closestNextLineRect = $_87htka50jc7tm7y9.findClosestClientRect($_gf68zqkjc7tm6r7.filter(caretPositions, $_8h90re6djc7tm8aa.isLine(1)), clientX);
      if (closestNextLineRect) {
        return $_ebmpgm55jc7tm7yv.renderRangeCaret(editor, closestNextLineRect.position.toRange());
      }
      closestNextLineRect = $_gf68zqkjc7tm6r7.last($_gf68zqkjc7tm6r7.filter(caretPositions, $_8h90re6djc7tm8aa.isLine(0)));
      if (closestNextLineRect) {
        return $_ebmpgm55jc7tm7yv.renderRangeCaret(editor, closestNextLineRect.position.toRange());
      }
    }
  };
  var createTextBlock = function (editor) {
    var textBlock = editor.dom.create(editor.settings.forced_root_block);
    if (!$_dtgtsy9jc7tm6gs.ie || $_dtgtsy9jc7tm6gs.ie >= 11) {
      textBlock.innerHTML = '<br data-mce-bogus="1">';
    }
    return textBlock;
  };
  var exitPreBlock = function (editor, direction, range) {
    var pre, caretPos, newBlock;
    var caretWalker = CaretWalker(editor.getBody());
    var getNextVisualCaretPosition = $_fy81ys25jc7tm77a.curry(getVisualCaretPosition, caretWalker.next);
    var getPrevVisualCaretPosition = $_fy81ys25jc7tm77a.curry(getVisualCaretPosition, caretWalker.prev);
    if (range.collapsed && editor.settings.forced_root_block) {
      pre = editor.dom.getParent(range.startContainer, 'PRE');
      if (!pre) {
        return;
      }
      if (direction === 1) {
        caretPos = getNextVisualCaretPosition(CaretPosition.fromRangeStart(range));
      } else {
        caretPos = getPrevVisualCaretPosition(CaretPosition.fromRangeStart(range));
      }
      if (!caretPos) {
        newBlock = createTextBlock(editor);
        if (direction === 1) {
          editor.$(pre).after(newBlock);
        } else {
          editor.$(pre).before(newBlock);
        }
        editor.selection.select(newBlock, true);
        editor.selection.collapse();
      }
    }
  };
  var getHorizontalRange = function (editor, forward) {
    var caretWalker = CaretWalker(editor.getBody());
    var getNextVisualCaretPosition = $_fy81ys25jc7tm77a.curry(getVisualCaretPosition, caretWalker.next);
    var getPrevVisualCaretPosition = $_fy81ys25jc7tm77a.curry(getVisualCaretPosition, caretWalker.prev);
    var newRange, direction = forward ? 1 : -1;
    var getNextPosFn = forward ? getNextVisualCaretPosition : getPrevVisualCaretPosition;
    var isBeforeContentEditableFalseFn = forward ? isBeforeContentEditableFalse$1 : isAfterContentEditableFalse$1;
    var range = editor.selection.getRng();
    newRange = moveToCeFalseHorizontally(direction, editor, getNextPosFn, isBeforeContentEditableFalseFn, range);
    if (newRange) {
      return newRange;
    }
    newRange = exitPreBlock(editor, direction, range);
    if (newRange) {
      return newRange;
    }
    return null;
  };
  var getVerticalRange = function (editor, down) {
    var newRange, direction = down ? 1 : -1;
    var walkerFn = down ? $_8h90re6djc7tm8aa.downUntil : $_8h90re6djc7tm8aa.upUntil;
    var range = editor.selection.getRng();
    newRange = moveToCeFalseVertically(direction, editor, walkerFn, range);
    if (newRange) {
      return newRange;
    }
    newRange = exitPreBlock(editor, direction, range);
    if (newRange) {
      return newRange;
    }
    return null;
  };
  var moveH = function (editor, forward) {
    return function () {
      var newRng = getHorizontalRange(editor, forward);
      if (newRng) {
        editor.selection.setRng(newRng);
        return true;
      } else {
        return false;
      }
    };
  };
  var moveV = function (editor, down) {
    return function () {
      var newRng = getVerticalRange(editor, down);
      if (newRng) {
        editor.selection.setRng(newRng);
        return true;
      } else {
        return false;
      }
    };
  };
  var $_gbzr816cjc7tm8a2 = {
    moveH: moveH,
    moveV: moveV
  };

  var defaultPatterns = function (patterns) {
    return $_20yqgb4jc7tm6aj.map(patterns, function (pattern) {
      return $_7t33ct5pjc7tm83j.merge({
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        keyCode: 0,
        action: $_f41mrx6jc7tm6cd.noop
      }, pattern);
    });
  };
  var matchesEvent = function (pattern, evt) {
    return evt.keyCode === pattern.keyCode && evt.shiftKey === pattern.shiftKey && evt.altKey === pattern.altKey && evt.ctrlKey === pattern.ctrlKey && evt.metaKey === pattern.metaKey;
  };
  var match$1 = function (patterns, evt) {
    return $_20yqgb4jc7tm6aj.bind(defaultPatterns(patterns), function (pattern) {
      return matchesEvent(pattern, evt) ? [pattern] : [];
    });
  };
  var action = function (f) {
    var x = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      x[_i - 1] = arguments[_i];
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return f.apply(null, args);
    };
  };
  var execute = function (patterns, evt) {
    return $_20yqgb4jc7tm6aj.find(match$1(patterns, evt), function (pattern) {
      return pattern.action();
    });
  };
  var $_8hwkwa6ejc7tm8ak = {
    match: match$1,
    action: action,
    execute: execute
  };

  var executeKeydownOverride = function (editor, caret, evt) {
    var os = $_e43n9tmjc7tm6ss.detect().os;
    $_8hwkwa6ejc7tm8ak.execute([
      {
        keyCode: $_b5txs856jc7tm7z0.RIGHT,
        action: $_gbzr816cjc7tm8a2.moveH(editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.LEFT,
        action: $_gbzr816cjc7tm8a2.moveH(editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.UP,
        action: $_gbzr816cjc7tm8a2.moveV(editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DOWN,
        action: $_gbzr816cjc7tm8a2.moveV(editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.RIGHT,
        action: $_3ulj7l3kjc7tm7m2.move(editor, caret, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.LEFT,
        action: $_3ulj7l3kjc7tm7m2.move(editor, caret, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.RIGHT,
        ctrlKey: !os.isOSX(),
        altKey: os.isOSX(),
        action: $_3ulj7l3kjc7tm7m2.moveNextWord(editor, caret)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.LEFT,
        ctrlKey: !os.isOSX(),
        altKey: os.isOSX(),
        action: $_3ulj7l3kjc7tm7m2.movePrevWord(editor, caret)
      }
    ], evt).each(function (_) {
      evt.preventDefault();
    });
  };
  var setup$7 = function (editor, caret) {
    editor.on('keydown', function (evt) {
      if (evt.isDefaultPrevented() === false) {
        executeKeydownOverride(editor, caret, evt);
      }
    });
  };
  var $_et49ui6bjc7tm89v = { setup: setup$7 };

  var getParentInlines = function (rootElm, startElm) {
    var parents = $_75x9wp33jc7tm7hb.parentsAndSelf(startElm, rootElm);
    return $_20yqgb4jc7tm6aj.findIndex(parents, $_8zplag1pjc7tm70h.isBlock).fold($_f41mrx6jc7tm6cd.constant(parents), function (index) {
      return parents.slice(0, index);
    });
  };
  var hasOnlyOneChild$1 = function (elm) {
    return $_15fekq17jc7tm6wo.children(elm).length === 1;
  };
  var deleteLastPosition = function (forward, editor, target, parentInlines) {
    var isFormatElement = $_f41mrx6jc7tm6cd.curry($_316jl3ejc7tm7kg.isFormatElement, editor);
    var formatNodes = $_20yqgb4jc7tm6aj.map($_20yqgb4jc7tm6aj.filter(parentInlines, isFormatElement), function (elm) {
      return elm.dom();
    });
    if (formatNodes.length === 0) {
      $_1556y238jc7tm7ir.deleteElement(editor, forward, target);
    } else {
      var pos = $_316jl3ejc7tm7kg.replaceWithCaretFormat(target.dom(), formatNodes);
      editor.selection.setRng(pos.toRange());
    }
  };
  var deleteCaret$1 = function (editor, forward) {
    var rootElm = $_bscr39yjc7tm6uo.fromDom(editor.getBody());
    var startElm = $_bscr39yjc7tm6uo.fromDom(editor.selection.getStart());
    var parentInlines = $_20yqgb4jc7tm6aj.filter(getParentInlines(rootElm, startElm), hasOnlyOneChild$1);
    return $_20yqgb4jc7tm6aj.last(parentInlines).map(function (target) {
      var fromPos = CaretPosition.fromRangeStart(editor.selection.getRng());
      if ($_2qjhc22tjc7tm7dx.willDeleteLastPositionInElement(forward, fromPos, target.dom())) {
        deleteLastPosition(forward, editor, target, parentInlines);
        return true;
      } else {
        return false;
      }
    }).getOr(false);
  };
  var backspaceDelete$5 = function (editor, forward) {
    return editor.selection.isCollapsed() ? deleteCaret$1(editor, forward) : false;
  };
  var $_8c9ww66gjc7tm8aw = { backspaceDelete: backspaceDelete$5 };

  var executeKeydownOverride$1 = function (editor, caret, evt) {
    $_8hwkwa6ejc7tm8ak.execute([
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_b90wzv35jc7tm7hp.backspaceDelete, editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_b90wzv35jc7tm7hp.backspaceDelete, editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_g7y0aq39jc7tm7j6.backspaceDelete, editor, caret, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_g7y0aq39jc7tm7j6.backspaceDelete, editor, caret, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_brt56434jc7tm7hi.backspaceDelete, editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_brt56434jc7tm7hi.backspaceDelete, editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_34bxq92rjc7tm7cv.backspaceDelete, editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_34bxq92rjc7tm7cv.backspaceDelete, editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_479zvc3njc7tm7mn.backspaceDelete, editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_479zvc3njc7tm7mn.backspaceDelete, editor, true)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_8c9ww66gjc7tm8aw.backspaceDelete, editor, false)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_8c9ww66gjc7tm8aw.backspaceDelete, editor, true)
      }
    ], evt).each(function (_) {
      evt.preventDefault();
    });
  };
  var executeKeyupOverride = function (editor, evt) {
    $_8hwkwa6ejc7tm8ak.execute([
      {
        keyCode: $_b5txs856jc7tm7z0.BACKSPACE,
        action: $_8hwkwa6ejc7tm8ak.action($_b90wzv35jc7tm7hp.paddEmptyElement, editor)
      },
      {
        keyCode: $_b5txs856jc7tm7z0.DELETE,
        action: $_8hwkwa6ejc7tm8ak.action($_b90wzv35jc7tm7hp.paddEmptyElement, editor)
      }
    ], evt);
  };
  var setup$8 = function (editor, caret) {
    editor.on('keydown', function (evt) {
      if (evt.isDefaultPrevented() === false) {
        executeKeydownOverride$1(editor, caret, evt);
      }
    });
    editor.on('keyup', function (evt) {
      if (evt.isDefaultPrevented() === false) {
        executeKeyupOverride(editor, evt);
      }
    });
  };
  var $_fcf9qh6fjc7tm8ar = { setup: setup$8 };

  var getBodySetting = function (editor, name, defaultValue) {
    var value = editor.getParam(name, defaultValue);
    if (value.indexOf('=') !== -1) {
      var bodyObj = editor.getParam(name, '', 'hash');
      return bodyObj.hasOwnProperty(editor.id) ? bodyObj[editor.id] : defaultValue;
    } else {
      return value;
    }
  };
  var getIframeAttrs = function (editor) {
    return editor.getParam('iframe_attrs', {});
  };
  var getDocType = function (editor) {
    return editor.getParam('doctype', '<!DOCTYPE html>');
  };
  var getDocumentBaseUrl = function (editor) {
    return editor.getParam('document_base_url', '');
  };
  var getBodyId = function (editor) {
    return getBodySetting(editor, 'body_id', 'tinymce');
  };
  var getBodyClass = function (editor) {
    return getBodySetting(editor, 'body_class', '');
  };
  var getContentSecurityPolicy = function (editor) {
    return editor.getParam('content_security_policy', '');
  };
  var shouldPutBrInPre = function (editor) {
    return editor.getParam('br_in_pre', true);
  };
  var getForcedRootBlock = function (editor) {
    if (editor.getParam('force_p_newlines', false)) {
      return 'p';
    }
    var block = editor.getParam('forced_root_block', 'p');
    return block === false ? '' : block;
  };
  var getForcedRootBlockAttrs = function (editor) {
    return editor.getParam('forced_root_block_attrs', {});
  };
  var getBrNewLineSelector = function (editor) {
    return editor.getParam('br_newline_selector', '.mce-toc h2,figcaption,caption');
  };
  var getNoNewLineSelector = function (editor) {
    return editor.getParam('no_newline_selector', '');
  };
  var shouldKeepStyles = function (editor) {
    return editor.getParam('keep_styles', true);
  };
  var shouldEndContainerOnEmtpyBlock = function (editor) {
    return editor.getParam('end_container_on_empty_block', false);
  };
  var $_bgorax6kjc7tm8c0 = {
    getIframeAttrs: getIframeAttrs,
    getDocType: getDocType,
    getDocumentBaseUrl: getDocumentBaseUrl,
    getBodyId: getBodyId,
    getBodyClass: getBodyClass,
    getContentSecurityPolicy: getContentSecurityPolicy,
    shouldPutBrInPre: shouldPutBrInPre,
    getForcedRootBlock: getForcedRootBlock,
    getForcedRootBlockAttrs: getForcedRootBlockAttrs,
    getBrNewLineSelector: getBrNewLineSelector,
    getNoNewLineSelector: getNoNewLineSelector,
    shouldKeepStyles: shouldKeepStyles,
    shouldEndContainerOnEmtpyBlock: shouldEndContainerOnEmtpyBlock
  };

  var firstNonWhiteSpaceNodeSibling = function (node) {
    while (node) {
      if (node.nodeType === 1 || node.nodeType === 3 && node.data && /[\r\n\s]/.test(node.data)) {
        return node;
      }
      node = node.nextSibling;
    }
  };
  var moveToCaretPosition = function (editor, root) {
    var walker, node, rng, lastNode = root, tempElm, dom = editor.dom;
    var moveCaretBeforeOnEnterElementsMap = editor.schema.getMoveCaretBeforeOnEnterElements();
    if (!root) {
      return;
    }
    if (/^(LI|DT|DD)$/.test(root.nodeName)) {
      var firstChild = firstNonWhiteSpaceNodeSibling(root.firstChild);
      if (firstChild && /^(UL|OL|DL)$/.test(firstChild.nodeName)) {
        root.insertBefore(dom.doc.createTextNode('\xA0'), root.firstChild);
      }
    }
    rng = dom.createRng();
    root.normalize();
    if (root.hasChildNodes()) {
      walker = new TreeWalker(root, root);
      while (node = walker.current()) {
        if ($_1qi2bn1qjc7tm70u.isText(node)) {
          rng.setStart(node, 0);
          rng.setEnd(node, 0);
          break;
        }
        if (moveCaretBeforeOnEnterElementsMap[node.nodeName.toLowerCase()]) {
          rng.setStartBefore(node);
          rng.setEndBefore(node);
          break;
        }
        lastNode = node;
        node = walker.next();
      }
      if (!node) {
        rng.setStart(lastNode, 0);
        rng.setEnd(lastNode, 0);
      }
    } else {
      if ($_1qi2bn1qjc7tm70u.isBr(root)) {
        if (root.nextSibling && dom.isBlock(root.nextSibling)) {
          rng.setStartBefore(root);
          rng.setEndBefore(root);
        } else {
          rng.setStartAfter(root);
          rng.setEndAfter(root);
        }
      } else {
        rng.setStart(root, 0);
        rng.setEnd(root, 0);
      }
    }
    editor.selection.setRng(rng);
    dom.remove(tempElm);
    editor.selection.scrollIntoView(root);
  };
  var getEditableRoot$1 = function (dom, node) {
    var root = dom.getRoot(), parent, editableRoot;
    parent = node;
    while (parent !== root && dom.getContentEditable(parent) !== 'false') {
      if (dom.getContentEditable(parent) === 'true') {
        editableRoot = parent;
      }
      parent = parent.parentNode;
    }
    return parent !== root ? editableRoot : root;
  };
  var getParentBlock$2 = function (editor) {
    return $_e5uurj5jc7tm6bt.from(editor.dom.getParent(editor.selection.getStart(true), editor.dom.isBlock));
  };
  var getParentBlockName = function (editor) {
    return getParentBlock$2(editor).fold($_f41mrx6jc7tm6cd.constant(''), function (parentBlock) {
      return parentBlock.nodeName.toUpperCase();
    });
  };
  var isListItemParentBlock = function (editor) {
    return getParentBlock$2(editor).filter(function (elm) {
      return $_8zplag1pjc7tm70h.isListItem($_bscr39yjc7tm6uo.fromDom(elm));
    }).isSome();
  };
  var $_27l4976mjc7tm8cc = {
    moveToCaretPosition: moveToCaretPosition,
    getEditableRoot: getEditableRoot$1,
    getParentBlock: getParentBlock$2,
    getParentBlockName: getParentBlockName,
    isListItemParentBlock: isListItemParentBlock
  };

  var hasFirstChild = function (elm, name) {
    return elm.firstChild && elm.firstChild.nodeName === name;
  };
  var hasParent$1 = function (elm, parentName) {
    return elm && elm.parentNode && elm.parentNode.nodeName === parentName;
  };
  var isListBlock = function (elm) {
    return elm && /^(OL|UL|LI)$/.test(elm.nodeName);
  };
  var isNestedList = function (elm) {
    return isListBlock(elm) && isListBlock(elm.parentNode);
  };
  var getContainerBlock = function (containerBlock) {
    var containerBlockParent = containerBlock.parentNode;
    if (/^(LI|DT|DD)$/.test(containerBlockParent.nodeName)) {
      return containerBlockParent;
    }
    return containerBlock;
  };
  var isFirstOrLastLi = function (containerBlock, parentBlock, first) {
    var node = containerBlock[first ? 'firstChild' : 'lastChild'];
    while (node) {
      if ($_1qi2bn1qjc7tm70u.isElement(node)) {
        break;
      }
      node = node[first ? 'nextSibling' : 'previousSibling'];
    }
    return node === parentBlock;
  };
  var insert$3 = function (editor, createNewBlock, containerBlock, parentBlock, newBlockName) {
    var dom = editor.dom;
    var rng = editor.selection.getRng();
    if (containerBlock === editor.getBody()) {
      return;
    }
    if (isNestedList(containerBlock)) {
      newBlockName = 'LI';
    }
    var newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create('BR');
    if (isFirstOrLastLi(containerBlock, parentBlock, true) && isFirstOrLastLi(containerBlock, parentBlock, false)) {
      if (hasParent$1(containerBlock, 'LI')) {
        dom.insertAfter(newBlock, getContainerBlock(containerBlock));
      } else {
        dom.replace(newBlock, containerBlock);
      }
    } else if (isFirstOrLastLi(containerBlock, parentBlock, true)) {
      if (hasParent$1(containerBlock, 'LI')) {
        dom.insertAfter(newBlock, getContainerBlock(containerBlock));
        newBlock.appendChild(dom.doc.createTextNode(' '));
        newBlock.appendChild(containerBlock);
      } else {
        containerBlock.parentNode.insertBefore(newBlock, containerBlock);
      }
    } else if (isFirstOrLastLi(containerBlock, parentBlock, false)) {
      dom.insertAfter(newBlock, getContainerBlock(containerBlock));
    } else {
      containerBlock = getContainerBlock(containerBlock);
      var tmpRng = rng.cloneRange();
      tmpRng.setStartAfter(parentBlock);
      tmpRng.setEndAfter(containerBlock);
      var fragment = tmpRng.extractContents();
      if (newBlockName === 'LI' && hasFirstChild(fragment, 'LI')) {
        newBlock = fragment.firstChild;
        dom.insertAfter(fragment, containerBlock);
      } else {
        dom.insertAfter(fragment, containerBlock);
        dom.insertAfter(newBlock, containerBlock);
      }
    }
    dom.remove(parentBlock);
    $_27l4976mjc7tm8cc.moveToCaretPosition(editor, newBlock);
  };
  var $_ah0f7s6ljc7tm8c5 = { insert: insert$3 };

  var isEmptyAnchor = function (elm) {
    return elm && elm.nodeName === 'A' && $_b8tc32jjc7tm6qi.trim($_55zd6d21jc7tm765.trim(elm.innerText || elm.textContent)).length === 0;
  };
  var isTableCell$4 = function (node) {
    return node && /^(TD|TH|CAPTION)$/.test(node.nodeName);
  };
  var emptyBlock = function (elm) {
    elm.innerHTML = '<br data-mce-bogus="1">';
  };
  var containerAndSiblingName = function (container, nodeName) {
    return container.nodeName === nodeName || container.previousSibling && container.previousSibling.nodeName === nodeName;
  };
  var canSplitBlock = function (dom, node) {
    return node && dom.isBlock(node) && !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) && !/^(fixed|absolute)/i.test(node.style.position) && dom.getContentEditable(node) !== 'true';
  };
  var trimInlineElementsOnLeftSideOfBlock = function (dom, nonEmptyElementsMap, block) {
    var node = block, firstChilds = [], i;
    if (!node) {
      return;
    }
    while (node = node.firstChild) {
      if (dom.isBlock(node)) {
        return;
      }
      if ($_1qi2bn1qjc7tm70u.isElement(node) && !nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
        firstChilds.push(node);
      }
    }
    i = firstChilds.length;
    while (i--) {
      node = firstChilds[i];
      if (!node.hasChildNodes() || node.firstChild === node.lastChild && node.firstChild.nodeValue === '') {
        dom.remove(node);
      } else {
        if (isEmptyAnchor(node)) {
          dom.remove(node);
        }
      }
    }
  };
  var normalizeZwspOffset = function (start, container, offset) {
    if ($_1qi2bn1qjc7tm70u.isText(container) === false) {
      return offset;
    }
    if (start) {
      return offset === 1 && container.data.charAt(offset - 1) === $_55zd6d21jc7tm765.ZWSP ? 0 : offset;
    } else {
      return offset === container.data.length - 1 && container.data.charAt(offset) === $_55zd6d21jc7tm765.ZWSP ? container.data.length : offset;
    }
  };
  var includeZwspInRange = function (rng) {
    var newRng = rng.cloneRange();
    newRng.setStart(rng.startContainer, normalizeZwspOffset(true, rng.startContainer, rng.startOffset));
    newRng.setEnd(rng.endContainer, normalizeZwspOffset(false, rng.endContainer, rng.endOffset));
    return newRng;
  };
  var trimLeadingLineBreaks = function (node) {
    do {
      if ($_1qi2bn1qjc7tm70u.isText(node)) {
        node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, '');
      }
      node = node.firstChild;
    } while (node);
  };
  var getEditableRoot = function (dom, node) {
    var root = dom.getRoot(), parent, editableRoot;
    parent = node;
    while (parent !== root && dom.getContentEditable(parent) !== 'false') {
      if (dom.getContentEditable(parent) === 'true') {
        editableRoot = parent;
      }
      parent = parent.parentNode;
    }
    return parent !== root ? editableRoot : root;
  };
  var setForcedBlockAttrs = function (editor, node) {
    var forcedRootBlockName = $_bgorax6kjc7tm8c0.getForcedRootBlock(editor);
    if (forcedRootBlockName && forcedRootBlockName.toLowerCase() === node.tagName.toLowerCase()) {
      editor.dom.setAttribs(node, $_bgorax6kjc7tm8c0.getForcedRootBlockAttrs(editor));
    }
  };
  var wrapSelfAndSiblingsInDefaultBlock = function (editor, newBlockName, rng, container, offset) {
    var newBlock, parentBlock, startNode, node, next, rootBlockName, blockName = newBlockName || 'P';
    var dom = editor.dom, editableRoot = getEditableRoot(dom, container);
    parentBlock = dom.getParent(container, dom.isBlock);
    if (!parentBlock || !canSplitBlock(dom, parentBlock)) {
      parentBlock = parentBlock || editableRoot;
      if (parentBlock === editor.getBody() || isTableCell$4(parentBlock)) {
        rootBlockName = parentBlock.nodeName.toLowerCase();
      } else {
        rootBlockName = parentBlock.parentNode.nodeName.toLowerCase();
      }
      if (!parentBlock.hasChildNodes()) {
        newBlock = dom.create(blockName);
        setForcedBlockAttrs(editor, newBlock);
        parentBlock.appendChild(newBlock);
        rng.setStart(newBlock, 0);
        rng.setEnd(newBlock, 0);
        return newBlock;
      }
      node = container;
      while (node.parentNode !== parentBlock) {
        node = node.parentNode;
      }
      while (node && !dom.isBlock(node)) {
        startNode = node;
        node = node.previousSibling;
      }
      if (startNode && editor.schema.isValidChild(rootBlockName, blockName.toLowerCase())) {
        newBlock = dom.create(blockName);
        setForcedBlockAttrs(editor, newBlock);
        startNode.parentNode.insertBefore(newBlock, startNode);
        node = startNode;
        while (node && !dom.isBlock(node)) {
          next = node.nextSibling;
          newBlock.appendChild(node);
          node = next;
        }
        rng.setStart(container, offset);
        rng.setEnd(container, offset);
      }
    }
    return container;
  };
  var addBrToBlockIfNeeded = function (dom, block) {
    var lastChild;
    block.normalize();
    lastChild = block.lastChild;
    if (!lastChild || /^(left|right)$/gi.test(dom.getStyle(lastChild, 'float', true))) {
      dom.add(block, 'br');
    }
  };
  var insert$2 = function (editor, evt) {
    var tmpRng, editableRoot, container, offset, parentBlock, shiftKey;
    var newBlock, fragment, containerBlock, parentBlockName, containerBlockName, newBlockName, isAfterLastNodeInContainer;
    var dom = editor.dom;
    var schema = editor.schema, nonEmptyElementsMap = schema.getNonEmptyElements();
    var rng = editor.selection.getRng();
    var createNewBlock = function (name) {
      var node = container, block, clonedNode, caretNode, textInlineElements = schema.getTextInlineElements();
      if (name || parentBlockName === 'TABLE' || parentBlockName === 'HR') {
        block = dom.create(name || newBlockName);
        setForcedBlockAttrs(editor, block);
      } else {
        block = parentBlock.cloneNode(false);
      }
      caretNode = block;
      if ($_bgorax6kjc7tm8c0.shouldKeepStyles(editor) === false) {
        dom.setAttrib(block, 'style', null);
        dom.setAttrib(block, 'class', null);
      } else {
        do {
          if (textInlineElements[node.nodeName]) {
            if ($_316jl3ejc7tm7kg.isCaretNode(node)) {
              continue;
            }
            clonedNode = node.cloneNode(false);
            dom.setAttrib(clonedNode, 'id', '');
            if (block.hasChildNodes()) {
              clonedNode.appendChild(block.firstChild);
              block.appendChild(clonedNode);
            } else {
              caretNode = clonedNode;
              block.appendChild(clonedNode);
            }
          }
        } while ((node = node.parentNode) && node !== editableRoot);
      }
      emptyBlock(caretNode);
      return block;
    };
    var isCaretAtStartOrEndOfBlock = function (start) {
      var walker, node, name, normalizedOffset;
      normalizedOffset = normalizeZwspOffset(start, container, offset);
      if ($_1qi2bn1qjc7tm70u.isText(container) && (start ? normalizedOffset > 0 : normalizedOffset < container.nodeValue.length)) {
        return false;
      }
      if (container.parentNode === parentBlock && isAfterLastNodeInContainer && !start) {
        return true;
      }
      if (start && $_1qi2bn1qjc7tm70u.isElement(container) && container === parentBlock.firstChild) {
        return true;
      }
      if (containerAndSiblingName(container, 'TABLE') || containerAndSiblingName(container, 'HR')) {
        return isAfterLastNodeInContainer && !start || !isAfterLastNodeInContainer && start;
      }
      walker = new TreeWalker(container, parentBlock);
      if ($_1qi2bn1qjc7tm70u.isText(container)) {
        if (start && normalizedOffset === 0) {
          walker.prev();
        } else if (!start && normalizedOffset === container.nodeValue.length) {
          walker.next();
        }
      }
      while (node = walker.current()) {
        if ($_1qi2bn1qjc7tm70u.isElement(node)) {
          if (!node.getAttribute('data-mce-bogus')) {
            name = node.nodeName.toLowerCase();
            if (nonEmptyElementsMap[name] && name !== 'br') {
              return false;
            }
          }
        } else if ($_1qi2bn1qjc7tm70u.isText(node) && !/^[ \t\r\n]*$/.test(node.nodeValue)) {
          return false;
        }
        if (start) {
          walker.prev();
        } else {
          walker.next();
        }
      }
      return true;
    };
    var insertNewBlockAfter = function () {
      if (/^(H[1-6]|PRE|FIGURE)$/.test(parentBlockName) && containerBlockName !== 'HGROUP') {
        newBlock = createNewBlock(newBlockName);
      } else {
        newBlock = createNewBlock();
      }
      if ($_bgorax6kjc7tm8c0.shouldEndContainerOnEmtpyBlock(editor) && canSplitBlock(dom, containerBlock) && dom.isEmpty(parentBlock)) {
        newBlock = dom.split(containerBlock, parentBlock);
      } else {
        dom.insertAfter(newBlock, parentBlock);
      }
      $_27l4976mjc7tm8cc.moveToCaretPosition(editor, newBlock);
    };
    $_ca2q7b3sjc7tm7ol.normalize(dom, rng).each(function (normRng) {
      rng.setStart(normRng.startContainer, normRng.startOffset);
      rng.setEnd(normRng.endContainer, normRng.endOffset);
    });
    container = rng.startContainer;
    offset = rng.startOffset;
    newBlockName = $_bgorax6kjc7tm8c0.getForcedRootBlock(editor);
    shiftKey = evt.shiftKey;
    if ($_1qi2bn1qjc7tm70u.isElement(container) && container.hasChildNodes()) {
      isAfterLastNodeInContainer = offset > container.childNodes.length - 1;
      container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container;
      if (isAfterLastNodeInContainer && $_1qi2bn1qjc7tm70u.isText(container)) {
        offset = container.nodeValue.length;
      } else {
        offset = 0;
      }
    }
    editableRoot = getEditableRoot(dom, container);
    if (!editableRoot) {
      return;
    }
    if (newBlockName && !shiftKey || !newBlockName && shiftKey) {
      container = wrapSelfAndSiblingsInDefaultBlock(editor, newBlockName, rng, container, offset);
    }
    parentBlock = dom.getParent(container, dom.isBlock);
    containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null;
    parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : '';
    containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : '';
    if (containerBlockName === 'LI' && !evt.ctrlKey) {
      parentBlock = containerBlock;
      containerBlock = containerBlock.parentNode;
      parentBlockName = containerBlockName;
    }
    if (/^(LI|DT|DD)$/.test(parentBlockName)) {
      if (dom.isEmpty(parentBlock)) {
        $_ah0f7s6ljc7tm8c5.insert(editor, createNewBlock, containerBlock, parentBlock, newBlockName);
        return;
      }
    }
    if (newBlockName && parentBlock === editor.getBody()) {
      return;
    }
    newBlockName = newBlockName || 'P';
    if ($_40segn20jc7tm75y.isCaretContainerBlock(parentBlock)) {
      newBlock = $_40segn20jc7tm75y.showCaretContainerBlock(parentBlock);
      if (dom.isEmpty(parentBlock)) {
        emptyBlock(parentBlock);
      }
      $_27l4976mjc7tm8cc.moveToCaretPosition(editor, newBlock);
    } else if (isCaretAtStartOrEndOfBlock()) {
      insertNewBlockAfter();
    } else if (isCaretAtStartOrEndOfBlock(true)) {
      newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock);
      $_27l4976mjc7tm8cc.moveToCaretPosition(editor, containerAndSiblingName(parentBlock, 'HR') ? newBlock : parentBlock);
    } else {
      tmpRng = includeZwspInRange(rng).cloneRange();
      tmpRng.setEndAfter(parentBlock);
      fragment = tmpRng.extractContents();
      trimLeadingLineBreaks(fragment);
      newBlock = fragment.firstChild;
      dom.insertAfter(fragment, parentBlock);
      trimInlineElementsOnLeftSideOfBlock(dom, nonEmptyElementsMap, newBlock);
      addBrToBlockIfNeeded(dom, parentBlock);
      if (dom.isEmpty(parentBlock)) {
        emptyBlock(parentBlock);
      }
      newBlock.normalize();
      if (dom.isEmpty(newBlock)) {
        dom.remove(newBlock);
        insertNewBlockAfter();
      } else {
        $_27l4976mjc7tm8cc.moveToCaretPosition(editor, newBlock);
      }
    }
    dom.setAttrib(newBlock, 'id', '');
    editor.fire('NewBlock', { newBlock: newBlock });
  };
  var $_ab6n7m6jjc7tm8bm = { insert: insert$2 };

  var matchesSelector = function (editor, selector) {
    return $_27l4976mjc7tm8cc.getParentBlock(editor).filter(function (parentBlock) {
      return selector.length > 0 && $_dnzz0a1fjc7tm6yr.is($_bscr39yjc7tm6uo.fromDom(parentBlock), selector);
    }).isSome();
  };
  var shouldInsertBr = function (editor) {
    return matchesSelector(editor, $_bgorax6kjc7tm8c0.getBrNewLineSelector(editor));
  };
  var shouldBlockNewLine$1 = function (editor) {
    return matchesSelector(editor, $_bgorax6kjc7tm8c0.getNoNewLineSelector(editor));
  };
  var $_5xuczt6ojc7tm8d2 = {
    shouldInsertBr: shouldInsertBr,
    shouldBlockNewLine: shouldBlockNewLine$1
  };

  var newLineAction = $_7voxo737jc7tm7ii.generate([
    { br: [] },
    { block: [] },
    { none: [] }
  ]);
  var shouldBlockNewLine = function (editor, shiftKey) {
    return $_5xuczt6ojc7tm8d2.shouldBlockNewLine(editor);
  };
  var isBrMode = function (requiredState) {
    return function (editor, shiftKey) {
      var brMode = $_bgorax6kjc7tm8c0.getForcedRootBlock(editor) === '';
      return brMode === requiredState;
    };
  };
  var inListBlock = function (requiredState) {
    return function (editor, shiftKey) {
      return $_27l4976mjc7tm8cc.isListItemParentBlock(editor) === requiredState;
    };
  };
  var inPreBlock = function (requiredState) {
    return function (editor, shiftKey) {
      var inPre = $_27l4976mjc7tm8cc.getParentBlockName(editor) === 'PRE';
      return inPre === requiredState;
    };
  };
  var shouldPutBrInPre$1 = function (requiredState) {
    return function (editor, shiftKey) {
      return $_bgorax6kjc7tm8c0.shouldPutBrInPre(editor) === requiredState;
    };
  };
  var inBrContext = function (editor, shiftKey) {
    return $_5xuczt6ojc7tm8d2.shouldInsertBr(editor);
  };
  var hasShiftKey = function (editor, shiftKey) {
    return shiftKey;
  };
  var canInsertIntoEditableRoot = function (editor) {
    var forcedRootBlock = $_bgorax6kjc7tm8c0.getForcedRootBlock(editor);
    var rootEditable = $_27l4976mjc7tm8cc.getEditableRoot(editor.dom, editor.selection.getStart());
    return rootEditable && editor.schema.isValidChild(rootEditable.nodeName, forcedRootBlock ? forcedRootBlock : 'P');
  };
  var match$2 = function (predicates, action) {
    return function (editor, shiftKey) {
      var isMatch = $_20yqgb4jc7tm6aj.foldl(predicates, function (res, p) {
        return res && p(editor, shiftKey);
      }, true);
      return isMatch ? $_e5uurj5jc7tm6bt.some(action) : $_e5uurj5jc7tm6bt.none();
    };
  };
  var getAction$1 = function (editor, evt) {
    return $_ce3m3d3jjc7tm7lx.evaluateUntil([
      match$2([shouldBlockNewLine], newLineAction.none()),
      match$2([
        inPreBlock(true),
        shouldPutBrInPre$1(false),
        hasShiftKey
      ], newLineAction.br()),
      match$2([
        inPreBlock(true),
        shouldPutBrInPre$1(false)
      ], newLineAction.block()),
      match$2([
        inPreBlock(true),
        shouldPutBrInPre$1(true),
        hasShiftKey
      ], newLineAction.block()),
      match$2([
        inPreBlock(true),
        shouldPutBrInPre$1(true)
      ], newLineAction.br()),
      match$2([
        inListBlock(true),
        hasShiftKey
      ], newLineAction.br()),
      match$2([inListBlock(true)], newLineAction.block()),
      match$2([
        isBrMode(true),
        hasShiftKey,
        canInsertIntoEditableRoot
      ], newLineAction.block()),
      match$2([isBrMode(true)], newLineAction.br()),
      match$2([inBrContext], newLineAction.br()),
      match$2([
        isBrMode(false),
        hasShiftKey
      ], newLineAction.br()),
      match$2([canInsertIntoEditableRoot], newLineAction.block())
    ], [
      editor,
      evt.shiftKey
    ]).getOr(newLineAction.none());
  };
  var $_11nin46njc7tm8cs = { getAction: getAction$1 };

  var insert$1 = function (editor, evt) {
    $_11nin46njc7tm8cs.getAction(editor, evt).fold(function () {
      $_15morc3rjc7tm7oa.insert(editor, evt);
    }, function () {
      $_ab6n7m6jjc7tm8bm.insert(editor, evt);
    }, $_f41mrx6jc7tm6cd.noop);
  };
  var $_5zs4y46ijc7tm8bg = { insert: insert$1 };

  var endTypingLevel = function (undoManager) {
    if (undoManager.typing) {
      undoManager.typing = false;
      undoManager.add();
    }
  };
  var handleEnterKeyEvent = function (editor, event) {
    if (event.isDefaultPrevented()) {
      return;
    }
    event.preventDefault();
    endTypingLevel(editor.undoManager);
    editor.undoManager.transact(function () {
      if (editor.selection.isCollapsed() === false) {
        editor.execCommand('Delete');
      }
      $_5zs4y46ijc7tm8bg.insert(editor, event);
    });
  };
  var setup$9 = function (editor) {
    editor.on('keydown', function (event) {
      if (event.keyCode === $_b5txs856jc7tm7z0.ENTER) {
        handleEnterKeyEvent(editor, event);
      }
    });
  };
  var $_3ki9r76hjc7tm8bc = { setup: setup$9 };

  var isValidInsertPoint = function (location, caretPosition) {
    return isAtStartOrEnd(location) && $_1qi2bn1qjc7tm70u.isText(caretPosition.container());
  };
  var insertNbspAtPosition = function (editor, caretPosition) {
    var container = caretPosition.container();
    var offset = caretPosition.offset();
    container.insertData(offset, '\xA0');
    editor.selection.setCursorLocation(container, offset + 1);
  };
  var insertAtLocation = function (editor, caretPosition, location) {
    if (isValidInsertPoint(location, caretPosition)) {
      insertNbspAtPosition(editor, caretPosition);
      return true;
    } else {
      return false;
    }
  };
  var insertAtCaret$2 = function (editor) {
    var isInlineTarget = $_f41mrx6jc7tm6cd.curry($_9dady72wjc7tm7fl.isInlineTarget, editor);
    var caretPosition = CaretPosition.fromRangeStart(editor.selection.getRng());
    var boundaryLocation = $_dv5v4q3djc7tm7k4.readLocation(isInlineTarget, editor.getBody(), caretPosition);
    return boundaryLocation.map($_f41mrx6jc7tm6cd.curry(insertAtLocation, editor, caretPosition)).getOr(false);
  };
  var isAtStartOrEnd = function (location) {
    return location.fold($_f41mrx6jc7tm6cd.constant(false), $_f41mrx6jc7tm6cd.constant(true), $_f41mrx6jc7tm6cd.constant(true), $_f41mrx6jc7tm6cd.constant(false));
  };
  var insertAtSelection = function (editor) {
    return editor.selection.isCollapsed() ? insertAtCaret$2(editor) : false;
  };
  var $_baqhmm6qjc7tm8dc = { insertAtSelection: insertAtSelection };

  var executeKeydownOverride$2 = function (editor, evt) {
    $_8hwkwa6ejc7tm8ak.execute([{
        keyCode: $_b5txs856jc7tm7z0.SPACEBAR,
        action: $_8hwkwa6ejc7tm8ak.action($_baqhmm6qjc7tm8dc.insertAtSelection, editor)
      }], evt).each(function (_) {
      evt.preventDefault();
    });
  };
  var setup$10 = function (editor) {
    editor.on('keydown', function (evt) {
      if (evt.isDefaultPrevented() === false) {
        executeKeydownOverride$2(editor, evt);
      }
    });
  };
  var $_6v70y96pjc7tm8d8 = { setup: setup$10 };

  var setup$6 = function (editor) {
    var caret = $_3ulj7l3kjc7tm7m2.setupSelectedState(editor);
    $_et49ui6bjc7tm89v.setup(editor, caret);
    $_fcf9qh6fjc7tm8ar.setup(editor, caret);
    $_3ki9r76hjc7tm8bc.setup(editor);
    $_6v70y96pjc7tm8d8.setup(editor);
  };
  var $_6y0mpt6ajc7tm89o = { setup: setup$6 };

  var Quirks = function (editor) {
    var each = $_b8tc32jjc7tm6qi.each;
    var BACKSPACE = $_b5txs856jc7tm7z0.BACKSPACE, DELETE = $_b5txs856jc7tm7z0.DELETE, dom = editor.dom, selection = editor.selection, settings = editor.settings, parser = editor.parser;
    var isGecko = $_dtgtsy9jc7tm6gs.gecko, isIE = $_dtgtsy9jc7tm6gs.ie, isWebKit = $_dtgtsy9jc7tm6gs.webkit;
    var mceInternalUrlPrefix = 'data:text/mce-internal,';
    var mceInternalDataType = isIE ? 'Text' : 'URL';
    var setEditorCommandState = function (cmd, state) {
      try {
        editor.getDoc().execCommand(cmd, false, state);
      } catch (ex) {
      }
    };
    var isDefaultPrevented = function (e) {
      return e.isDefaultPrevented();
    };
    var setMceInternalContent = function (e) {
      var selectionHtml, internalContent;
      if (e.dataTransfer) {
        if (editor.selection.isCollapsed() && e.target.tagName == 'IMG') {
          selection.select(e.target);
        }
        selectionHtml = editor.selection.getContent();
        if (selectionHtml.length > 0) {
          internalContent = mceInternalUrlPrefix + escape(editor.id) + ',' + escape(selectionHtml);
          e.dataTransfer.setData(mceInternalDataType, internalContent);
        }
      }
    };
    var getMceInternalContent = function (e) {
      var internalContent;
      if (e.dataTransfer) {
        internalContent = e.dataTransfer.getData(mceInternalDataType);
        if (internalContent && internalContent.indexOf(mceInternalUrlPrefix) >= 0) {
          internalContent = internalContent.substr(mceInternalUrlPrefix.length).split(',');
          return {
            id: unescape(internalContent[0]),
            html: unescape(internalContent[1])
          };
        }
      }
      return null;
    };
    var insertClipboardContents = function (content, internal) {
      if (editor.queryCommandSupported('mceInsertClipboardContent')) {
        editor.execCommand('mceInsertClipboardContent', false, {
          content: content,
          internal: internal
        });
      } else {
        editor.execCommand('mceInsertContent', false, content);
      }
    };
    var emptyEditorWhenDeleting = function () {
      var serializeRng = function (rng) {
        var body = dom.create('body');
        var contents = rng.cloneContents();
        body.appendChild(contents);
        return selection.serializer.serialize(body, { format: 'html' });
      };
      var allContentsSelected = function (rng) {
        var selection = serializeRng(rng);
        var allRng = dom.createRng();
        allRng.selectNode(editor.getBody());
        var allSelection = serializeRng(allRng);
        return selection === allSelection;
      };
      editor.on('keydown', function (e) {
        var keyCode = e.keyCode, isCollapsed, body;
        if (!isDefaultPrevented(e) && (keyCode == DELETE || keyCode == BACKSPACE)) {
          isCollapsed = editor.selection.isCollapsed();
          body = editor.getBody();
          if (isCollapsed && !dom.isEmpty(body)) {
            return;
          }
          if (!isCollapsed && !allContentsSelected(editor.selection.getRng())) {
            return;
          }
          e.preventDefault();
          editor.setContent('');
          if (body.firstChild && dom.isBlock(body.firstChild)) {
            editor.selection.setCursorLocation(body.firstChild, 0);
          } else {
            editor.selection.setCursorLocation(body, 0);
          }
          editor.nodeChanged();
        }
      });
    };
    var selectAll = function () {
      editor.shortcuts.add('meta+a', null, 'SelectAll');
    };
    var inputMethodFocus = function () {
      if (!editor.settings.content_editable) {
        dom.bind(editor.getDoc(), 'mousedown mouseup', function (e) {
          var rng;
          if (e.target == editor.getDoc().documentElement) {
            rng = selection.getRng();
            editor.getBody().focus();
            if (e.type == 'mousedown') {
              if ($_40segn20jc7tm75y.isCaretContainer(rng.startContainer)) {
                return;
              }
              selection.placeCaretAt(e.clientX, e.clientY);
            } else {
              selection.setRng(rng);
            }
          }
        });
      }
    };
    var removeHrOnBackspace = function () {
      editor.on('keydown', function (e) {
        if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
          if (!editor.getBody().getElementsByTagName('hr').length) {
            return;
          }
          if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) {
            var node = selection.getNode();
            var previousSibling = node.previousSibling;
            if (node.nodeName == 'HR') {
              dom.remove(node);
              e.preventDefault();
              return;
            }
            if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'hr') {
              dom.remove(previousSibling);
              e.preventDefault();
            }
          }
        }
      });
    };
    var focusBody = function () {
      if (!Range.prototype.getClientRects) {
        editor.on('mousedown', function (e) {
          if (!isDefaultPrevented(e) && e.target.nodeName === 'HTML') {
            var body = editor.getBody();
            body.blur();
            $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
              body.focus();
            });
          }
        });
      }
    };
    var selectControlElements = function () {
      editor.on('click', function (e) {
        var target = e.target;
        if (/^(IMG|HR)$/.test(target.nodeName) && dom.getContentEditableParent(target) !== 'false') {
          e.preventDefault();
          editor.selection.select(target);
          editor.nodeChanged();
        }
        if (target.nodeName == 'A' && dom.hasClass(target, 'mce-item-anchor')) {
          e.preventDefault();
          selection.select(target);
        }
      });
    };
    var removeStylesWhenDeletingAcrossBlockElements = function () {
      var getAttributeApplyFunction = function () {
        var template = dom.getAttribs(selection.getStart().cloneNode(false));
        return function () {
          var target = selection.getStart();
          if (target !== editor.getBody()) {
            dom.setAttrib(target, 'style', null);
            each(template, function (attr) {
              target.setAttributeNode(attr.cloneNode(true));
            });
          }
        };
      };
      var isSelectionAcrossElements = function () {
        return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) != dom.getParent(selection.getEnd(), dom.isBlock);
      };
      editor.on('keypress', function (e) {
        var applyAttributes;
        if (!isDefaultPrevented(e) && (e.keyCode == 8 || e.keyCode == 46) && isSelectionAcrossElements()) {
          applyAttributes = getAttributeApplyFunction();
          editor.getDoc().execCommand('delete', false, null);
          applyAttributes();
          e.preventDefault();
          return false;
        }
      });
      dom.bind(editor.getDoc(), 'cut', function (e) {
        var applyAttributes;
        if (!isDefaultPrevented(e) && isSelectionAcrossElements()) {
          applyAttributes = getAttributeApplyFunction();
          $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
            applyAttributes();
          });
        }
      });
    };
    var disableBackspaceIntoATable = function () {
      editor.on('keydown', function (e) {
        if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) {
          if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) {
            var previousSibling = selection.getNode().previousSibling;
            if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === 'table') {
              e.preventDefault();
              return false;
            }
          }
        }
      });
    };
    var removeBlockQuoteOnBackSpace = function () {
      editor.on('keydown', function (e) {
        var rng, container, offset, root, parent;
        if (isDefaultPrevented(e) || e.keyCode != $_b5txs856jc7tm7z0.BACKSPACE) {
          return;
        }
        rng = selection.getRng();
        container = rng.startContainer;
        offset = rng.startOffset;
        root = dom.getRoot();
        parent = container;
        if (!rng.collapsed || offset !== 0) {
          return;
        }
        while (parent && parent.parentNode && parent.parentNode.firstChild == parent && parent.parentNode != root) {
          parent = parent.parentNode;
        }
        if (parent.tagName === 'BLOCKQUOTE') {
          editor.formatter.toggle('blockquote', null, parent);
          rng = dom.createRng();
          rng.setStart(container, 0);
          rng.setEnd(container, 0);
          selection.setRng(rng);
        }
      });
    };
    var setGeckoEditingOptions = function () {
      var setOpts = function () {
        setEditorCommandState('StyleWithCSS', false);
        setEditorCommandState('enableInlineTableEditing', false);
        if (!settings.object_resizing) {
          setEditorCommandState('enableObjectResizing', false);
        }
      };
      if (!settings.readonly) {
        editor.on('BeforeExecCommand MouseDown', setOpts);
      }
    };
    var addBrAfterLastLinks = function () {
      var fixLinks = function () {
        each(dom.select('a'), function (node) {
          var parentNode = node.parentNode, root = dom.getRoot();
          if (parentNode.lastChild === node) {
            while (parentNode && !dom.isBlock(parentNode)) {
              if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) {
                return;
              }
              parentNode = parentNode.parentNode;
            }
            dom.add(parentNode, 'br', { 'data-mce-bogus': 1 });
          }
        });
      };
      editor.on('SetContent ExecCommand', function (e) {
        if (e.type == 'setcontent' || e.command === 'mceInsertLink') {
          fixLinks();
        }
      });
    };
    var setDefaultBlockType = function () {
      if (settings.forced_root_block) {
        editor.on('init', function () {
          setEditorCommandState('DefaultParagraphSeparator', settings.forced_root_block);
        });
      }
    };
    var normalizeSelection = function () {
      editor.on('keyup focusin mouseup', function (e) {
        if (!$_b5txs856jc7tm7z0.modifierPressed(e)) {
          selection.normalize();
        }
      }, true);
    };
    var showBrokenImageIcon = function () {
      editor.contentStyles.push('img:-moz-broken {' + '-moz-force-broken-image-icon:1;' + 'min-width:24px;' + 'min-height:24px' + '}');
    };
    var restoreFocusOnKeyDown = function () {
      if (!editor.inline) {
        editor.on('keydown', function () {
          if (document.activeElement == document.body) {
            editor.getWin().focus();
          }
        });
      }
    };
    var bodyHeight = function () {
      if (!editor.inline) {
        editor.contentStyles.push('body {min-height: 150px}');
        editor.on('click', function (e) {
          var rng;
          if (e.target.nodeName == 'HTML') {
            if ($_dtgtsy9jc7tm6gs.ie > 11) {
              editor.getBody().focus();
              return;
            }
            rng = editor.selection.getRng();
            editor.getBody().focus();
            editor.selection.setRng(rng);
            editor.selection.normalize();
            editor.nodeChanged();
          }
        });
      }
    };
    var blockCmdArrowNavigation = function () {
      if ($_dtgtsy9jc7tm6gs.mac) {
        editor.on('keydown', function (e) {
          if ($_b5txs856jc7tm7z0.metaKeyPressed(e) && !e.shiftKey && (e.keyCode == 37 || e.keyCode == 39)) {
            e.preventDefault();
            editor.selection.getSel().modify('move', e.keyCode == 37 ? 'backward' : 'forward', 'lineboundary');
          }
        });
      }
    };
    var disableAutoUrlDetect = function () {
      setEditorCommandState('AutoUrlDetect', false);
    };
    var tapLinksAndImages = function () {
      editor.on('click', function (e) {
        var elm = e.target;
        do {
          if (elm.tagName === 'A') {
            e.preventDefault();
            return;
          }
        } while (elm = elm.parentNode);
      });
      editor.contentStyles.push('.mce-content-body {-webkit-touch-callout: none}');
    };
    var blockFormSubmitInsideEditor = function () {
      editor.on('init', function () {
        editor.dom.bind(editor.getBody(), 'submit', function (e) {
          e.preventDefault();
        });
      });
    };
    var removeAppleInterchangeBrs = function () {
      parser.addNodeFilter('br', function (nodes) {
        var i = nodes.length;
        while (i--) {
          if (nodes[i].attr('class') == 'Apple-interchange-newline') {
            nodes[i].remove();
          }
        }
      });
    };
    var ieInternalDragAndDrop = function () {
      editor.on('dragstart', function (e) {
        setMceInternalContent(e);
      });
      editor.on('drop', function (e) {
        if (!isDefaultPrevented(e)) {
          var internalContent = getMceInternalContent(e);
          if (internalContent && internalContent.id != editor.id) {
            e.preventDefault();
            var rng = $_b5ji3061jc7tm878.fromPoint(e.x, e.y, editor.getDoc());
            selection.setRng(rng);
            insertClipboardContents(internalContent.html, true);
          }
        }
      });
    };
    var refreshContentEditable = function () {
    };
    var isHidden = function () {
      var sel;
      if (!isGecko || editor.removed) {
        return 0;
      }
      sel = editor.selection.getSel();
      return !sel || !sel.rangeCount || sel.rangeCount === 0;
    };
    removeBlockQuoteOnBackSpace();
    emptyEditorWhenDeleting();
    if (!$_dtgtsy9jc7tm6gs.windowsPhone) {
      normalizeSelection();
    }
    if (isWebKit) {
      inputMethodFocus();
      selectControlElements();
      setDefaultBlockType();
      blockFormSubmitInsideEditor();
      disableBackspaceIntoATable();
      removeAppleInterchangeBrs();
      if ($_dtgtsy9jc7tm6gs.iOS) {
        restoreFocusOnKeyDown();
        bodyHeight();
        tapLinksAndImages();
      } else {
        selectAll();
      }
    }
    if ($_dtgtsy9jc7tm6gs.ie >= 11) {
      bodyHeight();
      disableBackspaceIntoATable();
    }
    if ($_dtgtsy9jc7tm6gs.ie) {
      selectAll();
      disableAutoUrlDetect();
      ieInternalDragAndDrop();
    }
    if (isGecko) {
      removeHrOnBackspace();
      focusBody();
      removeStylesWhenDeletingAcrossBlockElements();
      setGeckoEditingOptions();
      addBrAfterLastLinks();
      showBrokenImageIcon();
      blockCmdArrowNavigation();
      disableBackspaceIntoATable();
    }
    return {
      refreshContentEditable: refreshContentEditable,
      isHidden: isHidden
    };
  };

  var DOM$5 = DOMUtils.DOM;
  var appendStyle = function (editor, text) {
    var head = $_bscr39yjc7tm6uo.fromDom(editor.getDoc().head);
    var tag = $_bscr39yjc7tm6uo.fromTag('style');
    $_ftie1r14jc7tm6vz.set(tag, 'type', 'text/css');
    $_bacixv2fjc7tm79x.append(tag, $_bscr39yjc7tm6uo.fromText(text));
    $_bacixv2fjc7tm79x.append(head, tag);
  };
  var createParser = function (editor) {
    var parser = DomParser(editor.settings, editor.schema);
    parser.addAttributeFilter('src,href,style,tabindex', function (nodes, name) {
      var i = nodes.length, node, dom = editor.dom, value, internalName;
      while (i--) {
        node = nodes[i];
        value = node.attr(name);
        internalName = 'data-mce-' + name;
        if (!node.attributes.map[internalName]) {
          if (value.indexOf('data:') === 0 || value.indexOf('blob:') === 0) {
            continue;
          }
          if (name === 'style') {
            value = dom.serializeStyle(dom.parseStyle(value), node.name);
            if (!value.length) {
              value = null;
            }
            node.attr(internalName, value);
            node.attr(name, value);
          } else if (name === 'tabindex') {
            node.attr(internalName, value);
            node.attr(name, null);
          } else {
            node.attr(internalName, editor.convertURL(value, name, node.name));
          }
        }
      }
    });
    parser.addNodeFilter('script', function (nodes) {
      var i = nodes.length, node, type;
      while (i--) {
        node = nodes[i];
        type = node.attr('type') || 'no/type';
        if (type.indexOf('mce-') !== 0) {
          node.attr('type', 'mce-' + type);
        }
      }
    });
    parser.addNodeFilter('#cdata', function (nodes) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        node.type = 8;
        node.name = '#comment';
        node.value = '[CDATA[' + node.value + ']]';
      }
    });
    parser.addNodeFilter('p,h1,h2,h3,h4,h5,h6,div', function (nodes) {
      var i = nodes.length, node, nonEmptyElements = editor.schema.getNonEmptyElements();
      while (i--) {
        node = nodes[i];
        if (node.isEmpty(nonEmptyElements) && node.getAll('br').length === 0) {
          node.append(new Node$2('br', 1)).shortEnded = true;
        }
      }
    });
    return parser;
  };
  var autoFocus = function (editor) {
    if (editor.settings.auto_focus) {
      $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
        var focusEditor;
        if (editor.settings.auto_focus === true) {
          focusEditor = editor;
        } else {
          focusEditor = editor.editorManager.get(editor.settings.auto_focus);
        }
        if (!focusEditor.destroyed) {
          focusEditor.focus();
        }
      }, 100);
    }
  };
  var initEditor = function (editor) {
    editor.bindPendingEventDelegates();
    editor.initialized = true;
    editor.fire('init');
    editor.focus(true);
    editor.nodeChanged({ initial: true });
    editor.execCallback('init_instance_callback', editor);
    autoFocus(editor);
  };
  var getStyleSheetLoader = function (editor) {
    return editor.inline ? DOM$5.styleSheetLoader : editor.dom.styleSheetLoader;
  };
  var initContentBody = function (editor, skipWrite) {
    var settings = editor.settings, targetElm = editor.getElement(), doc = editor.getDoc(), body, contentCssText;
    if (!settings.inline) {
      editor.getElement().style.visibility = editor.orgVisibility;
    }
    if (!skipWrite && !settings.content_editable) {
      doc.open();
      doc.write(editor.iframeHTML);
      doc.close();
    }
    if (settings.content_editable) {
      editor.on('remove', function () {
        var bodyEl = this.getBody();
        DOM$5.removeClass(bodyEl, 'mce-content-body');
        DOM$5.removeClass(bodyEl, 'mce-edit-focus');
        DOM$5.setAttrib(bodyEl, 'contentEditable', null);
      });
      DOM$5.addClass(targetElm, 'mce-content-body');
      editor.contentDocument = doc = settings.content_document || document;
      editor.contentWindow = settings.content_window || window;
      editor.bodyElement = targetElm;
      settings.content_document = settings.content_window = null;
      settings.root_name = targetElm.nodeName.toLowerCase();
    }
    body = editor.getBody();
    body.disabled = true;
    editor.readonly = settings.readonly;
    if (!editor.readonly) {
      if (editor.inline && DOM$5.getStyle(body, 'position', true) === 'static') {
        body.style.position = 'relative';
      }
      body.contentEditable = editor.getParam('content_editable_state', true);
    }
    body.disabled = false;
    editor.editorUpload = EditorUpload(editor);
    editor.schema = Schema(settings);
    editor.dom = new DOMUtils(doc, {
      keep_values: true,
      url_converter: editor.convertURL,
      url_converter_scope: editor,
      hex_colors: settings.force_hex_style_colors,
      class_filter: settings.class_filter,
      update_styles: true,
      root_element: editor.inline ? editor.getBody() : null,
      collect: settings.content_editable,
      schema: editor.schema,
      onSetAttrib: function (e) {
        editor.fire('SetAttrib', e);
      }
    });
    editor.parser = createParser(editor);
    editor.serializer = Serializer$1(settings, editor);
    editor.selection = new Selection$1(editor.dom, editor.getWin(), editor.serializer, editor);
    editor.formatter = Formatter(editor);
    editor.undoManager = UndoManager(editor);
    editor._nodeChangeDispatcher = new NodeChange(editor);
    editor._selectionOverrides = SelectionOverrides(editor);
    $_7pr555wjc7tm85p.setup(editor);
    $_6y0mpt6ajc7tm89o.setup(editor);
    $_g5aehe4ujc7tm7wi.setup(editor);
    editor.fire('PreInit');
    if (!settings.browser_spellcheck && !settings.gecko_spellcheck) {
      doc.body.spellcheck = false;
      DOM$5.setAttrib(body, 'spellcheck', 'false');
    }
    editor.quirks = Quirks(editor);
    editor.fire('PostRender');
    if (settings.directionality) {
      body.dir = settings.directionality;
    }
    if (settings.nowrap) {
      body.style.whiteSpace = 'nowrap';
    }
    if (settings.protect) {
      editor.on('BeforeSetContent', function (e) {
        $_b8tc32jjc7tm6qi.each(settings.protect, function (pattern) {
          e.content = e.content.replace(pattern, function (str) {
            return '<!--mce:protected ' + escape(str) + '-->';
          });
        });
      });
    }
    editor.on('SetContent', function () {
      editor.addVisual(editor.getBody());
    });
    if (settings.padd_empty_editor) {
      editor.on('PostProcess', function (e) {
        e.content = e.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|<br \/>|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, '');
      });
    }
    editor.load({
      initial: true,
      format: 'html'
    });
    editor.startContent = editor.getContent({ format: 'raw' });
    editor.on('compositionstart compositionend', function (e) {
      editor.composing = e.type === 'compositionstart';
    });
    if (editor.contentStyles.length > 0) {
      contentCssText = '';
      $_b8tc32jjc7tm6qi.each(editor.contentStyles, function (style) {
        contentCssText += style + '\r\n';
      });
      editor.dom.addStyle(contentCssText);
    }
    getStyleSheetLoader(editor).loadAll(editor.contentCSS, function (_) {
      initEditor(editor);
    }, function (urls) {
      initEditor(editor);
    });
    if (settings.content_style) {
      appendStyle(editor, settings.content_style);
    }
  };
  var $_fklfgq4hjc7tm7tv = { initContentBody: initContentBody };

  var DOM$6 = DOMUtils.DOM;
  var relaxDomain = function (editor, ifr) {
    if (document.domain !== window.location.hostname && $_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 12) {
      var bodyUuid = $_5p67zq4sjc7tm7w5.uuid('mce');
      editor[bodyUuid] = function () {
        $_fklfgq4hjc7tm7tv.initContentBody(editor);
      };
      var domainRelaxUrl = 'javascript:(function(){' + 'document.open();document.domain="' + document.domain + '";' + 'var ed = window.parent.tinymce.get("' + editor.id + '");document.write(ed.iframeHTML);' + 'document.close();ed.' + bodyUuid + '(true);})()';
      DOM$6.setAttrib(ifr, 'src', domainRelaxUrl);
      return true;
    }
    return false;
  };
  var normalizeHeight = function (height) {
    var normalizedHeight = typeof height === 'number' ? height + 'px' : height;
    return normalizedHeight ? normalizedHeight : '';
  };
  var createIframeElement = function (id, title, height, customAttrs) {
    var iframe = $_bscr39yjc7tm6uo.fromTag('iframe');
    $_ftie1r14jc7tm6vz.setAll(iframe, customAttrs);
    $_ftie1r14jc7tm6vz.setAll(iframe, {
      id: id + '_ifr',
      frameBorder: '0',
      allowTransparency: 'true',
      title: title
    });
    $_c8wsbp11jc7tm6va.setAll(iframe, {
      width: '100%',
      height: normalizeHeight(height),
      display: 'block'
    });
    return iframe;
  };
  var getIframeHtml = function (editor) {
    var bodyId, bodyClass, iframeHTML;
    iframeHTML = $_bgorax6kjc7tm8c0.getDocType(editor) + '<html><head>';
    if ($_bgorax6kjc7tm8c0.getDocumentBaseUrl(editor) !== editor.documentBaseUrl) {
      iframeHTML += '<base href="' + editor.documentBaseURI.getURI() + '" />';
    }
    iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
    bodyId = $_bgorax6kjc7tm8c0.getBodyId(editor);
    bodyClass = $_bgorax6kjc7tm8c0.getBodyClass(editor);
    if ($_bgorax6kjc7tm8c0.getContentSecurityPolicy(editor)) {
      iframeHTML += '<meta http-equiv="Content-Security-Policy" content="' + $_bgorax6kjc7tm8c0.getContentSecurityPolicy(editor) + '" />';
    }
    iframeHTML += '</head><body id="' + bodyId + '" class="mce-content-body ' + bodyClass + '" data-id="' + editor.id + '"><br></body></html>';
    return iframeHTML;
  };
  var createIframe = function (editor, o) {
    var title = editor.editorManager.translate('Rich Text Area. Press ALT-F9 for menu. ' + 'Press ALT-F10 for toolbar. Press ALT-0 for help');
    var ifr = createIframeElement(editor.id, title, o.height, $_bgorax6kjc7tm8c0.getIframeAttrs(editor)).dom();
    ifr.onload = function () {
      ifr.onload = null;
      editor.fire('load');
    };
    var isDomainRelaxed = relaxDomain(editor, ifr);
    editor.contentAreaContainer = o.iframeContainer;
    editor.iframeElement = ifr;
    editor.iframeHTML = getIframeHtml(editor);
    DOM$6.add(o.iframeContainer, ifr);
    return isDomainRelaxed;
  };
  var init$2 = function (editor, boxInfo) {
    var isDomainRelaxed = createIframe(editor, boxInfo);
    if (boxInfo.editorContainer) {
      DOM$6.get(boxInfo.editorContainer).style.display = editor.orgDisplay;
      editor.hidden = DOM$6.isHidden(boxInfo.editorContainer);
    }
    editor.getElement().style.display = 'none';
    DOM$6.setAttrib(editor.id, 'aria-hidden', true);
    if (!isDomainRelaxed) {
      $_fklfgq4hjc7tm7tv.initContentBody(editor);
    }
  };
  var $_6941cy6sjc7tm8ea = { init: init$2 };

  var DOM$4 = DOMUtils.DOM;
  var initPlugin = function (editor, initializedPlugins, plugin) {
    var Plugin = PluginManager$1.get(plugin), pluginUrl, pluginInstance;
    pluginUrl = PluginManager$1.urls[plugin] || editor.documentBaseUrl.replace(/\/$/, '');
    plugin = $_b8tc32jjc7tm6qi.trim(plugin);
    if (Plugin && $_b8tc32jjc7tm6qi.inArray(initializedPlugins, plugin) === -1) {
      $_b8tc32jjc7tm6qi.each(PluginManager$1.dependencies(plugin), function (dep) {
        initPlugin(editor, initializedPlugins, dep);
      });
      if (editor.plugins[plugin]) {
        return;
      }
      pluginInstance = new Plugin(editor, pluginUrl, editor.$);
      editor.plugins[plugin] = pluginInstance;
      if (pluginInstance.init) {
        pluginInstance.init(editor, pluginUrl);
        initializedPlugins.push(plugin);
      }
    }
  };
  var trimLegacyPrefix = function (name) {
    return name.replace(/^\-/, '');
  };
  var initPlugins = function (editor) {
    var initializedPlugins = [];
    $_b8tc32jjc7tm6qi.each(editor.settings.plugins.split(/[ ,]/), function (name) {
      initPlugin(editor, initializedPlugins, trimLegacyPrefix(name));
    });
  };
  var initTheme = function (editor) {
    var Theme, theme = editor.settings.theme;
    if ($_1g0kpc12jc7tm6vn.isString(theme)) {
      editor.settings.theme = trimLegacyPrefix(theme);
      Theme = ThemeManager.get(theme);
      editor.theme = new Theme(editor, ThemeManager.urls[theme]);
      if (editor.theme.init) {
        editor.theme.init(editor, ThemeManager.urls[theme] || editor.documentBaseUrl.replace(/\/$/, ''), editor.$);
      }
    } else {
      editor.theme = {};
    }
  };
  var renderFromLoadedTheme = function (editor) {
    var w, h, minHeight, re, info, settings = editor.settings, elm = editor.getElement();
    w = settings.width || DOM$4.getStyle(elm, 'width') || '100%';
    h = settings.height || DOM$4.getStyle(elm, 'height') || elm.offsetHeight;
    minHeight = settings.min_height || 100;
    re = /^[0-9\.]+(|px)$/i;
    if (re.test('' + w)) {
      w = Math.max(parseInt(w, 10), 100);
    }
    if (re.test('' + h)) {
      h = Math.max(parseInt(h, 10), minHeight);
    }
    info = editor.theme.renderUI({
      targetNode: elm,
      width: w,
      height: h,
      deltaWidth: settings.delta_width,
      deltaHeight: settings.delta_height
    });
    if (!settings.content_editable) {
      h = (info.iframeHeight || h) + (typeof h === 'number' ? info.deltaHeight || 0 : '');
      if (h < minHeight) {
        h = minHeight;
      }
    }
    info.height = h;
    return info;
  };
  var renderFromThemeFunc = function (editor) {
    var info, elm = editor.getElement();
    info = editor.settings.theme(editor, elm);
    if (info.editorContainer.nodeType) {
      info.editorContainer.id = info.editorContainer.id || editor.id + '_parent';
    }
    if (info.iframeContainer && info.iframeContainer.nodeType) {
      info.iframeContainer.id = info.iframeContainer.id || editor.id + '_iframecontainer';
    }
    info.height = info.iframeHeight ? info.iframeHeight : elm.offsetHeight;
    return info;
  };
  var createThemeFalseResult = function (element) {
    return {
      editorContainer: element,
      iframeContainer: element
    };
  };
  var renderThemeFalseIframe = function (targetElement) {
    var iframeContainer = DOM$4.create('div');
    DOM$4.insertAfter(iframeContainer, targetElement);
    return createThemeFalseResult(iframeContainer);
  };
  var renderThemeFalse = function (editor) {
    var targetElement = editor.getElement();
    return editor.inline ? createThemeFalseResult(null) : renderThemeFalseIframe(targetElement);
  };
  var renderThemeUi = function (editor) {
    var settings = editor.settings, elm = editor.getElement();
    editor.orgDisplay = elm.style.display;
    if ($_1g0kpc12jc7tm6vn.isString(settings.theme)) {
      return renderFromLoadedTheme(editor);
    } else if ($_1g0kpc12jc7tm6vn.isFunction(settings.theme)) {
      return renderFromThemeFunc(editor);
    } else {
      return renderThemeFalse(editor);
    }
  };
  var init = function (editor) {
    var settings = editor.settings, elm = editor.getElement(), boxInfo;
    editor.rtl = settings.rtl_ui || editor.editorManager.i18n.rtl;
    editor.editorManager.i18n.setCode(settings.language);
    settings.aria_label = settings.aria_label || DOM$4.getAttrib(elm, 'aria-label', editor.getLang('aria.rich_text_area'));
    editor.fire('ScriptsLoaded');
    initTheme(editor);
    initPlugins(editor);
    boxInfo = renderThemeUi(editor);
    editor.editorContainer = boxInfo.editorContainer ? boxInfo.editorContainer : null;
    if (settings.content_css) {
      $_b8tc32jjc7tm6qi.each($_b8tc32jjc7tm6qi.explode(settings.content_css), function (u) {
        editor.contentCSS.push(editor.documentBaseURI.toAbsolute(u));
      });
    }
    if (settings.content_editable) {
      return $_fklfgq4hjc7tm7tv.initContentBody(editor);
    } else {
      return $_6941cy6sjc7tm8ea.init(editor, boxInfo);
    }
  };
  var $_2aho3t4ejc7tm7tb = { init: init };

  var DOM$3 = DOMUtils.DOM;
  var hasSkipLoadPrefix = function (name) {
    return name.charAt(0) === '-';
  };
  var loadLanguage = function (scriptLoader, editor) {
    var settings = editor.settings;
    if (settings.language && settings.language !== 'en' && !settings.language_url) {
      settings.language_url = editor.editorManager.baseURL + '/langs/' + settings.language + '.js';
    }
    if (settings.language_url && !editor.editorManager.i18n.data[settings.language]) {
      scriptLoader.add(settings.language_url);
    }
  };
  var loadTheme = function (scriptLoader, editor, suffix, callback) {
    var settings = editor.settings, theme = settings.theme;
    if ($_1g0kpc12jc7tm6vn.isString(theme)) {
      if (!hasSkipLoadPrefix(theme) && !ThemeManager.urls.hasOwnProperty(theme)) {
        var themeUrl = settings.theme_url;
        if (themeUrl) {
          ThemeManager.load(theme, editor.documentBaseURI.toAbsolute(themeUrl));
        } else {
          ThemeManager.load(theme, 'themes/' + theme + '/theme' + suffix + '.js');
        }
      }
      scriptLoader.loadQueue(function () {
        ThemeManager.waitFor(theme, callback);
      });
    } else {
      callback();
    }
  };
  var loadPlugins = function (settings, suffix) {
    if ($_b8tc32jjc7tm6qi.isArray(settings.plugins)) {
      settings.plugins = settings.plugins.join(' ');
    }
    $_b8tc32jjc7tm6qi.each(settings.external_plugins, function (url, name) {
      PluginManager$1.load(name, url);
      settings.plugins += ' ' + name;
    });
    $_b8tc32jjc7tm6qi.each(settings.plugins.split(/[ ,]/), function (plugin) {
      plugin = $_b8tc32jjc7tm6qi.trim(plugin);
      if (plugin && !PluginManager$1.urls[plugin]) {
        if (hasSkipLoadPrefix(plugin)) {
          plugin = plugin.substr(1, plugin.length);
          var dependencies = PluginManager$1.dependencies(plugin);
          $_b8tc32jjc7tm6qi.each(dependencies, function (dep) {
            var defaultSettings = {
              prefix: 'plugins/',
              resource: dep,
              suffix: '/plugin' + suffix + '.js'
            };
            dep = PluginManager$1.createUrl(defaultSettings, dep);
            PluginManager$1.load(dep.resource, dep);
          });
        } else {
          PluginManager$1.load(plugin, {
            prefix: 'plugins/',
            resource: plugin,
            suffix: '/plugin' + suffix + '.js'
          });
        }
      }
    });
  };
  var loadScripts = function (editor, suffix) {
    var scriptLoader = ScriptLoader.ScriptLoader;
    loadTheme(scriptLoader, editor, suffix, function () {
      loadLanguage(scriptLoader, editor);
      loadPlugins(editor.settings, suffix);
      scriptLoader.loadQueue(function () {
        if (!editor.removed) {
          $_2aho3t4ejc7tm7tb.init(editor);
        }
      }, editor, function (urls) {
        $_4z4ogl4djc7tm7t4.pluginLoadError(editor, urls[0]);
        if (!editor.removed) {
          $_2aho3t4ejc7tm7tb.init(editor);
        }
      });
    });
  };
  var render = function (editor) {
    var settings = editor.settings, id = editor.id;
    var readyHandler = function () {
      DOM$3.unbind(window, 'ready', readyHandler);
      editor.render();
    };
    if (!EventUtils.Event.domLoaded) {
      DOM$3.bind(window, 'ready', readyHandler);
      return;
    }
    if (!editor.getElement()) {
      return;
    }
    if (!$_dtgtsy9jc7tm6gs.contentEditable) {
      return;
    }
    if (!settings.inline) {
      editor.orgVisibility = editor.getElement().style.visibility;
      editor.getElement().style.visibility = 'hidden';
    } else {
      editor.inline = true;
    }
    var form = editor.getElement().form || DOM$3.getParent(id, 'form');
    if (form) {
      editor.formElement = form;
      if (settings.hidden_input && !/TEXTAREA|INPUT/i.test(editor.getElement().nodeName)) {
        DOM$3.insertAfter(DOM$3.create('input', {
          type: 'hidden',
          name: id
        }), id);
        editor.hasHiddenInput = true;
      }
      editor.formEventDelegate = function (e) {
        editor.fire(e.type, e);
      };
      DOM$3.bind(form, 'submit reset', editor.formEventDelegate);
      editor.on('reset', function () {
        editor.setContent(editor.startContent, { format: 'raw' });
      });
      if (settings.submit_patch && !form.submit.nodeType && !form.submit.length && !form._mceOldSubmit) {
        form._mceOldSubmit = form.submit;
        form.submit = function () {
          editor.editorManager.triggerSave();
          editor.setDirty(false);
          return form._mceOldSubmit(form);
        };
      }
    }
    editor.windowManager = WindowManager(editor);
    editor.notificationManager = NotificationManager(editor);
    if (settings.encoding === 'xml') {
      editor.on('GetContent', function (e) {
        if (e.save) {
          e.content = DOM$3.encode(e.content);
        }
      });
    }
    if (settings.add_form_submit_trigger) {
      editor.on('submit', function () {
        if (editor.initialized) {
          editor.save();
        }
      });
    }
    if (settings.add_unload_trigger) {
      editor._beforeUnload = function () {
        if (editor.initialized && !editor.destroyed && !editor.isHidden()) {
          editor.save({
            format: 'raw',
            no_events: true,
            set_dirty: false
          });
        }
      };
      editor.editorManager.on('BeforeUnload', editor._beforeUnload);
    }
    editor.editorManager.add(editor);
    loadScripts(editor, editor.suffix);
  };
  var $_4fqh6w47jc7tm7ry = { render: render };

  var add = function (editor, name, settings) {
    var sidebars = editor.sidebars ? editor.sidebars : [];
    sidebars.push({
      name: name,
      settings: settings
    });
    editor.sidebars = sidebars;
  };
  var $_7hsyk26tjc7tm8ek = { add: add };

  var each$22 = $_b8tc32jjc7tm6qi.each;
  var trim$6 = $_b8tc32jjc7tm6qi.trim;
  var queryParts = 'source protocol authority userInfo user password host port relative path directory file query anchor'.split(' ');
  var DEFAULT_PORTS = {
    'ftp': 21,
    'http': 80,
    'https': 443,
    'mailto': 25
  };
  var URI = function (url, settings) {
    var self = this, baseUri, baseUrl;
    url = trim$6(url);
    settings = self.settings = settings || {};
    baseUri = settings.base_uri;
    if (/^([\w\-]+):([^\/]{2})/i.test(url) || /^\s*#/.test(url)) {
      self.source = url;
      return;
    }
    var isProtocolRelative = url.indexOf('//') === 0;
    if (url.indexOf('/') === 0 && !isProtocolRelative) {
      url = (baseUri ? baseUri.protocol || 'http' : 'http') + '://mce_host' + url;
    }
    if (!/^[\w\-]*:?\/\//.test(url)) {
      baseUrl = settings.base_uri ? settings.base_uri.path : new URI(document.location.href).directory;
      if (settings.base_uri.protocol === '') {
        url = '//mce_host' + self.toAbsPath(baseUrl, url);
      } else {
        url = /([^#?]*)([#?]?.*)/.exec(url);
        url = (baseUri && baseUri.protocol || 'http') + '://mce_host' + self.toAbsPath(baseUrl, url[1]) + url[2];
      }
    }
    url = url.replace(/@@/g, '(mce_at)');
    url = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(url);
    each$22(queryParts, function (v, i) {
      var part = url[i];
      if (part) {
        part = part.replace(/\(mce_at\)/g, '@@');
      }
      self[v] = part;
    });
    if (baseUri) {
      if (!self.protocol) {
        self.protocol = baseUri.protocol;
      }
      if (!self.userInfo) {
        self.userInfo = baseUri.userInfo;
      }
      if (!self.port && self.host === 'mce_host') {
        self.port = baseUri.port;
      }
      if (!self.host || self.host === 'mce_host') {
        self.host = baseUri.host;
      }
      self.source = '';
    }
    if (isProtocolRelative) {
      self.protocol = '';
    }
  };
  URI.prototype = {
    setPath: function (path) {
      var self = this;
      path = /^(.*?)\/?(\w+)?$/.exec(path);
      self.path = path[0];
      self.directory = path[1];
      self.file = path[2];
      self.source = '';
      self.getURI();
    },
    toRelative: function (uri) {
      var self = this, output;
      if (uri === './') {
        return uri;
      }
      uri = new URI(uri, { base_uri: self });
      if (uri.host != 'mce_host' && self.host != uri.host && uri.host || self.port != uri.port || self.protocol != uri.protocol && uri.protocol !== '') {
        return uri.getURI();
      }
      var tu = self.getURI(), uu = uri.getURI();
      if (tu == uu || tu.charAt(tu.length - 1) == '/' && tu.substr(0, tu.length - 1) == uu) {
        return tu;
      }
      output = self.toRelPath(self.path, uri.path);
      if (uri.query) {
        output += '?' + uri.query;
      }
      if (uri.anchor) {
        output += '#' + uri.anchor;
      }
      return output;
    },
    toAbsolute: function (uri, noHost) {
      uri = new URI(uri, { base_uri: this });
      return uri.getURI(noHost && this.isSameOrigin(uri));
    },
    isSameOrigin: function (uri) {
      if (this.host == uri.host && this.protocol == uri.protocol) {
        if (this.port == uri.port) {
          return true;
        }
        var defaultPort = DEFAULT_PORTS[this.protocol];
        if (defaultPort && (this.port || defaultPort) == (uri.port || defaultPort)) {
          return true;
        }
      }
      return false;
    },
    toRelPath: function (base, path) {
      var items, breakPoint = 0, out = '', i, l;
      base = base.substring(0, base.lastIndexOf('/'));
      base = base.split('/');
      items = path.split('/');
      if (base.length >= items.length) {
        for (i = 0, l = base.length; i < l; i++) {
          if (i >= items.length || base[i] != items[i]) {
            breakPoint = i + 1;
            break;
          }
        }
      }
      if (base.length < items.length) {
        for (i = 0, l = items.length; i < l; i++) {
          if (i >= base.length || base[i] != items[i]) {
            breakPoint = i + 1;
            break;
          }
        }
      }
      if (breakPoint === 1) {
        return path;
      }
      for (i = 0, l = base.length - (breakPoint - 1); i < l; i++) {
        out += '../';
      }
      for (i = breakPoint - 1, l = items.length; i < l; i++) {
        if (i != breakPoint - 1) {
          out += '/' + items[i];
        } else {
          out += items[i];
        }
      }
      return out;
    },
    toAbsPath: function (base, path) {
      var i, nb = 0, o = [], tr, outPath;
      tr = /\/$/.test(path) ? '/' : '';
      base = base.split('/');
      path = path.split('/');
      each$22(base, function (k) {
        if (k) {
          o.push(k);
        }
      });
      base = o;
      for (i = path.length - 1, o = []; i >= 0; i--) {
        if (path[i].length === 0 || path[i] === '.') {
          continue;
        }
        if (path[i] === '..') {
          nb++;
          continue;
        }
        if (nb > 0) {
          nb--;
          continue;
        }
        o.push(path[i]);
      }
      i = base.length - nb;
      if (i <= 0) {
        outPath = o.reverse().join('/');
      } else {
        outPath = base.slice(0, i).join('/') + '/' + o.reverse().join('/');
      }
      if (outPath.indexOf('/') !== 0) {
        outPath = '/' + outPath;
      }
      if (tr && outPath.lastIndexOf('/') !== outPath.length - 1) {
        outPath += tr;
      }
      return outPath;
    },
    getURI: function (noProtoHost) {
      var s, self = this;
      if (!self.source || noProtoHost) {
        s = '';
        if (!noProtoHost) {
          if (self.protocol) {
            s += self.protocol + '://';
          } else {
            s += '//';
          }
          if (self.userInfo) {
            s += self.userInfo + '@';
          }
          if (self.host) {
            s += self.host;
          }
          if (self.port) {
            s += ':' + self.port;
          }
        }
        if (self.path) {
          s += self.path;
        }
        if (self.query) {
          s += '?' + self.query;
        }
        if (self.anchor) {
          s += '#' + self.anchor;
        }
        self.source = s;
      }
      return self.source;
    }
  };
  URI.parseDataUri = function (uri) {
    var type, matches;
    uri = decodeURIComponent(uri).split(',');
    matches = /data:([^;]+)/.exec(uri[0]);
    if (matches) {
      type = matches[1];
    }
    return {
      type: type,
      data: uri[1]
    };
  };
  URI.getDocumentBaseUrl = function (loc) {
    var baseUrl;
    if (loc.protocol.indexOf('http') !== 0 && loc.protocol !== 'file:') {
      baseUrl = loc.href;
    } else {
      baseUrl = loc.protocol + '//' + loc.host + loc.pathname;
    }
    if (/^[^:]+:\/\/\/?[^\/]+\//.test(baseUrl)) {
      baseUrl = baseUrl.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
      if (!/[\/\\]$/.test(baseUrl)) {
        baseUrl += '/';
      }
    }
    return baseUrl;
  };

  var DOM$1 = DOMUtils.DOM;
  var extend$2 = $_b8tc32jjc7tm6qi.extend;
  var each$8 = $_b8tc32jjc7tm6qi.each;
  var trim$3 = $_b8tc32jjc7tm6qi.trim;
  var resolve$2 = $_b8tc32jjc7tm6qi.resolve;
  var ie$2 = $_dtgtsy9jc7tm6gs.ie;
  var Editor = function (id, settings, editorManager) {
    var self = this, documentBaseUrl, baseUri;
    documentBaseUrl = self.documentBaseUrl = editorManager.documentBaseURL;
    baseUri = editorManager.baseURI;
    settings = $_4dtvpj2xjc7tm7fy.getEditorSettings(self, id, documentBaseUrl, editorManager.defaultSettings, settings);
    self.settings = settings;
    AddOnManager.language = settings.language || 'en';
    AddOnManager.languageLoad = settings.language_load;
    AddOnManager.baseURL = editorManager.baseURL;
    self.id = id;
    self.setDirty(false);
    self.plugins = {};
    self.documentBaseURI = new URI(settings.document_base_url, { base_uri: baseUri });
    self.baseURI = baseUri;
    self.contentCSS = [];
    self.contentStyles = [];
    self.shortcuts = new Shortcuts(self);
    self.loadedCSS = {};
    self.editorCommands = new EditorCommands(self);
    self.suffix = editorManager.suffix;
    self.editorManager = editorManager;
    self.inline = settings.inline;
    self.buttons = {};
    self.menuItems = {};
    if (settings.cache_suffix) {
      $_dtgtsy9jc7tm6gs.cacheSuffix = settings.cache_suffix.replace(/^[\?\&]+/, '');
    }
    if (settings.override_viewport === false) {
      $_dtgtsy9jc7tm6gs.overrideViewPort = false;
    }
    editorManager.fire('SetupEditor', self);
    self.execCallback('setup', self);
    self.$ = DomQuery.overrideDefaults(function () {
      return {
        context: self.inline ? self.getBody() : self.getDoc(),
        element: self.getBody()
      };
    });
  };
  Editor.prototype = {
    render: function () {
      $_4fqh6w47jc7tm7ry.render(this);
    },
    focus: function (skipFocus) {
      $_9dadsv44jc7tm7rb.focus(this, skipFocus);
    },
    execCallback: function (name) {
      var self = this, callback = self.settings[name], scope;
      if (!callback) {
        return;
      }
      if (self.callbackLookup && (scope = self.callbackLookup[name])) {
        callback = scope.func;
        scope = scope.scope;
      }
      if (typeof callback === 'string') {
        scope = callback.replace(/\.\w+$/, '');
        scope = scope ? resolve$2(scope) : 0;
        callback = resolve$2(callback);
        self.callbackLookup = self.callbackLookup || {};
        self.callbackLookup[name] = {
          func: callback,
          scope: scope
        };
      }
      return callback.apply(scope || self, Array.prototype.slice.call(arguments, 1));
    },
    translate: function (text) {
      if (text && $_b8tc32jjc7tm6qi.is(text, 'string')) {
        var lang = this.settings.language || 'en', i18n = this.editorManager.i18n;
        text = i18n.data[lang + '.' + text] || text.replace(/\{\#([^\}]+)\}/g, function (a, b) {
          return i18n.data[lang + '.' + b] || '{#' + b + '}';
        });
      }
      return this.editorManager.translate(text);
    },
    getLang: function (name, defaultVal) {
      return this.editorManager.i18n.data[(this.settings.language || 'en') + '.' + name] || (defaultVal !== undefined ? defaultVal : '{#' + name + '}');
    },
    getParam: function (name, defaultVal, type) {
      var value = name in this.settings ? this.settings[name] : defaultVal, output;
      if (type === 'hash') {
        output = {};
        if (typeof value === 'string') {
          each$8(value.indexOf('=') > 0 ? value.split(/[;,](?![^=;,]*(?:[;,]|$))/) : value.split(','), function (value) {
            value = value.split('=');
            if (value.length > 1) {
              output[trim$3(value[0])] = trim$3(value[1]);
            } else {
              output[trim$3(value[0])] = trim$3(value);
            }
          });
        } else {
          output = value;
        }
        return output;
      }
      return value;
    },
    nodeChanged: function (args) {
      this._nodeChangeDispatcher.nodeChanged(args);
    },
    addButton: function (name, settings) {
      var self = this;
      if (settings.cmd) {
        settings.onclick = function () {
          self.execCommand(settings.cmd);
        };
      }
      if (settings.stateSelector && typeof settings.active === 'undefined') {
        settings.active = false;
      }
      if (!settings.text && !settings.icon) {
        settings.icon = name;
      }
      self.buttons = self.buttons;
      settings.tooltip = settings.tooltip || settings.title;
      self.buttons[name] = settings;
    },
    addSidebar: function (name, settings) {
      return $_7hsyk26tjc7tm8ek.add(this, name, settings);
    },
    addMenuItem: function (name, settings) {
      var self = this;
      if (settings.cmd) {
        settings.onclick = function () {
          self.execCommand(settings.cmd);
        };
      }
      self.menuItems = self.menuItems;
      self.menuItems[name] = settings;
    },
    addContextToolbar: function (predicate, items) {
      var self = this, selector;
      self.contextToolbars = self.contextToolbars || [];
      if (typeof predicate == 'string') {
        selector = predicate;
        predicate = function (elm) {
          return self.dom.is(elm, selector);
        };
      }
      self.contextToolbars.push({
        id: $_5p67zq4sjc7tm7w5.uuid('mcet'),
        predicate: predicate,
        items: items
      });
    },
    addCommand: function (name, callback, scope) {
      this.editorCommands.addCommand(name, callback, scope);
    },
    addQueryStateHandler: function (name, callback, scope) {
      this.editorCommands.addQueryStateHandler(name, callback, scope);
    },
    addQueryValueHandler: function (name, callback, scope) {
      this.editorCommands.addQueryValueHandler(name, callback, scope);
    },
    addShortcut: function (pattern, desc, cmdFunc, scope) {
      this.shortcuts.add(pattern, desc, cmdFunc, scope);
    },
    execCommand: function (cmd, ui, value, args) {
      return this.editorCommands.execCommand(cmd, ui, value, args);
    },
    queryCommandState: function (cmd) {
      return this.editorCommands.queryCommandState(cmd);
    },
    queryCommandValue: function (cmd) {
      return this.editorCommands.queryCommandValue(cmd);
    },
    queryCommandSupported: function (cmd) {
      return this.editorCommands.queryCommandSupported(cmd);
    },
    show: function () {
      var self = this;
      if (self.hidden) {
        self.hidden = false;
        if (self.inline) {
          self.getBody().contentEditable = true;
        } else {
          DOM$1.show(self.getContainer());
          DOM$1.hide(self.id);
        }
        self.load();
        self.fire('show');
      }
    },
    hide: function () {
      var self = this, doc = self.getDoc();
      if (!self.hidden) {
        if (ie$2 && doc && !self.inline) {
          doc.execCommand('SelectAll');
        }
        self.save();
        if (self.inline) {
          self.getBody().contentEditable = false;
          if (self == self.editorManager.focusedEditor) {
            self.editorManager.focusedEditor = null;
          }
        } else {
          DOM$1.hide(self.getContainer());
          DOM$1.setStyle(self.id, 'display', self.orgDisplay);
        }
        self.hidden = true;
        self.fire('hide');
      }
    },
    isHidden: function () {
      return !!this.hidden;
    },
    setProgressState: function (state, time) {
      this.fire('ProgressState', {
        state: state,
        time: time
      });
    },
    load: function (args) {
      var self = this, elm = self.getElement(), html;
      if (self.removed) {
        return '';
      }
      if (elm) {
        args = args || {};
        args.load = true;
        html = self.setContent(elm.value !== undefined ? elm.value : elm.innerHTML, args);
        args.element = elm;
        if (!args.no_events) {
          self.fire('LoadContent', args);
        }
        args.element = elm = null;
        return html;
      }
    },
    save: function (args) {
      var self = this, elm = self.getElement(), html, form;
      if (!elm || !self.initialized || self.removed) {
        return;
      }
      args = args || {};
      args.save = true;
      args.element = elm;
      html = args.content = self.getContent(args);
      if (!args.no_events) {
        self.fire('SaveContent', args);
      }
      if (args.format == 'raw') {
        self.fire('RawSaveContent', args);
      }
      html = args.content;
      if (!/TEXTAREA|INPUT/i.test(elm.nodeName)) {
        if (!self.inline) {
          elm.innerHTML = html;
        }
        if (form = DOM$1.getParent(self.id, 'form')) {
          each$8(form.elements, function (elm) {
            if (elm.name == self.id) {
              elm.value = html;
              return false;
            }
          });
        }
      } else {
        elm.value = html;
      }
      args.element = elm = null;
      if (args.set_dirty !== false) {
        self.setDirty(false);
      }
      return html;
    },
    setContent: function (content, args) {
      var self = this, body = self.getBody(), forcedRootBlockName, padd;
      args = args || {};
      args.format = args.format || 'html';
      args.set = true;
      args.content = content;
      if (!args.no_events) {
        self.fire('BeforeSetContent', args);
      }
      content = args.content;
      if (content.length === 0 || /^\s+$/.test(content)) {
        padd = ie$2 && ie$2 < 11 ? '' : '<br data-mce-bogus="1">';
        if (body.nodeName == 'TABLE') {
          content = '<tr><td>' + padd + '</td></tr>';
        } else if (/^(UL|OL)$/.test(body.nodeName)) {
          content = '<li>' + padd + '</li>';
        }
        forcedRootBlockName = self.settings.forced_root_block;
        if (forcedRootBlockName && self.schema.isValidChild(body.nodeName.toLowerCase(), forcedRootBlockName.toLowerCase())) {
          content = padd;
          content = self.dom.createHTML(forcedRootBlockName, self.settings.forced_root_block_attrs, content);
        } else if (!ie$2 && !content) {
          content = '<br data-mce-bogus="1">';
        }
        self.dom.setHTML(body, content);
        self.fire('SetContent', args);
      } else {
        if (args.format !== 'raw') {
          content = Serializer({ validate: self.validate }, self.schema).serialize(self.parser.parse(content, {
            isRootContent: true,
            insert: true
          }));
        }
        args.content = trim$3(content);
        self.dom.setHTML(body, args.content);
        if (!args.no_events) {
          self.fire('SetContent', args);
        }
      }
      return args.content;
    },
    getContent: function (args) {
      var self = this, content, body = self.getBody();
      if (self.removed) {
        return '';
      }
      args = args || {};
      args.format = args.format || 'html';
      args.get = true;
      args.getInner = true;
      if (!args.no_events) {
        self.fire('BeforeGetContent', args);
      }
      if (args.format === 'raw') {
        content = $_b8tc32jjc7tm6qi.trim($_fneq5042jc7tm7qk.trimExternal(self.serializer, body.innerHTML));
      } else if (args.format === 'text') {
        content = body.innerText || body.textContent;
      } else if (args.format === 'tree') {
        return self.serializer.serialize(body, args);
      } else {
        content = self.serializer.serialize(body, args);
      }
      if (args.format !== 'text') {
        args.content = trim$3(content);
      } else {
        args.content = content;
      }
      if (!args.no_events) {
        self.fire('GetContent', args);
      }
      return args.content;
    },
    insertContent: function (content, args) {
      if (args) {
        content = extend$2({ content: content }, args);
      }
      this.execCommand('mceInsertContent', false, content);
    },
    isDirty: function () {
      return !this.isNotDirty;
    },
    setDirty: function (state) {
      var oldState = !this.isNotDirty;
      this.isNotDirty = !state;
      if (state && state != oldState) {
        this.fire('dirty');
      }
    },
    setMode: function (mode) {
      $_4sookl40jc7tm7q8.setMode(this, mode);
    },
    getContainer: function () {
      var self = this;
      if (!self.container) {
        self.container = DOM$1.get(self.editorContainer || self.id + '_parent');
      }
      return self.container;
    },
    getContentAreaContainer: function () {
      return this.contentAreaContainer;
    },
    getElement: function () {
      if (!this.targetElm) {
        this.targetElm = DOM$1.get(this.id);
      }
      return this.targetElm;
    },
    getWin: function () {
      var self = this, elm;
      if (!self.contentWindow) {
        elm = self.iframeElement;
        if (elm) {
          self.contentWindow = elm.contentWindow;
        }
      }
      return self.contentWindow;
    },
    getDoc: function () {
      var self = this, win;
      if (!self.contentDocument) {
        win = self.getWin();
        if (win) {
          self.contentDocument = win.document;
        }
      }
      return self.contentDocument;
    },
    getBody: function () {
      var doc = this.getDoc();
      return this.bodyElement || (doc ? doc.body : null);
    },
    convertURL: function (url, name, elm) {
      var self = this, settings = self.settings;
      if (settings.urlconverter_callback) {
        return self.execCallback('urlconverter_callback', url, elm, true, name);
      }
      if (!settings.convert_urls || elm && elm.nodeName == 'LINK' || url.indexOf('file:') === 0 || url.length === 0) {
        return url;
      }
      if (settings.relative_urls) {
        return self.documentBaseURI.toRelative(url);
      }
      url = self.documentBaseURI.toAbsolute(url, settings.remove_script_host);
      return url;
    },
    addVisual: function (elm) {
      var self = this, settings = self.settings, dom = self.dom, cls;
      elm = elm || self.getBody();
      if (self.hasVisual === undefined) {
        self.hasVisual = settings.visual;
      }
      each$8(dom.select('table,a', elm), function (elm) {
        var value;
        switch (elm.nodeName) {
        case 'TABLE':
          cls = settings.visual_table_class || 'mce-item-table';
          value = dom.getAttrib(elm, 'border');
          if ((!value || value == '0') && self.hasVisual) {
            dom.addClass(elm, cls);
          } else {
            dom.removeClass(elm, cls);
          }
          return;
        case 'A':
          if (!dom.getAttrib(elm, 'href', false)) {
            value = dom.getAttrib(elm, 'name') || elm.id;
            cls = settings.visual_anchor_class || 'mce-item-anchor';
            if (value && self.hasVisual) {
              dom.addClass(elm, cls);
            } else {
              dom.removeClass(elm, cls);
            }
          }
          return;
        }
      });
      self.fire('VisualAid', {
        element: elm,
        hasVisual: self.hasVisual
      });
    },
    remove: function () {
      var self = this;
      if (!self.removed) {
        self.save();
        self.removed = 1;
        self.unbindAllNativeEvents();
        if (self.hasHiddenInput) {
          DOM$1.remove(self.getElement().nextSibling);
        }
        if (!self.inline) {
          if (ie$2 && ie$2 < 10) {
            self.getDoc().execCommand('SelectAll', false, null);
          }
          DOM$1.setStyle(self.id, 'display', self.orgDisplay);
          self.getBody().onload = null;
        }
        self.fire('remove');
        self.editorManager.remove(self);
        DOM$1.remove(self.getContainer());
        self._selectionOverrides.destroy();
        self.editorUpload.destroy();
        self.destroy();
      }
    },
    destroy: function (automatic) {
      var self = this, form;
      if (self.destroyed) {
        return;
      }
      if (!automatic && !self.removed) {
        self.remove();
        return;
      }
      if (!automatic) {
        self.editorManager.off('beforeunload', self._beforeUnload);
        if (self.theme && self.theme.destroy) {
          self.theme.destroy();
        }
        self.selection.destroy();
        self.dom.destroy();
      }
      form = self.formElement;
      if (form) {
        if (form._mceOldSubmit) {
          form.submit = form._mceOldSubmit;
          form._mceOldSubmit = null;
        }
        DOM$1.unbind(form, 'submit reset', self.formEventDelegate);
      }
      self.contentAreaContainer = self.formElement = self.container = self.editorContainer = null;
      self.bodyElement = self.contentDocument = self.contentWindow = null;
      self.iframeElement = self.targetElm = null;
      if (self.selection) {
        self.selection = self.selection.win = self.selection.dom = self.selection.dom.doc = null;
      }
      self.destroyed = 1;
    },
    uploadImages: function (callback) {
      return this.editorUpload.uploadImages(callback);
    },
    _scanForImages: function () {
      return this.editorUpload.scanForImages();
    }
  };
  extend$2(Editor.prototype, EditorObservable$1);

  var isEditorUIElement$1 = function (elm) {
    return elm.className.toString().indexOf('mce-') !== -1;
  };
  var $_ei8xs46xjc7tm8fi = { isEditorUIElement: isEditorUIElement$1 };

  var isManualNodeChange = function (e) {
    return e.type === 'nodechange' && e.selectionChange;
  };
  var registerPageMouseUp = function (editor, throttledStore) {
    var mouseUpPage = function () {
      throttledStore.throttle();
    };
    DOMUtils.DOM.bind(document, 'mouseup', mouseUpPage);
    editor.on('remove', function () {
      DOMUtils.DOM.unbind(document, 'mouseup', mouseUpPage);
    });
  };
  var registerFocusOut = function (editor) {
    editor.on('focusout', function () {
      $_5o1m7s3ujc7tm7p1.store(editor);
    });
  };
  var registerMouseUp = function (editor, throttledStore) {
    editor.on('mouseup touchend', function (e) {
      throttledStore.throttle();
    });
  };
  var registerEditorEvents = function (editor, throttledStore) {
    var browser = $_e43n9tmjc7tm6ss.detect().browser;
    if (browser.isIE() || browser.isEdge()) {
      registerFocusOut(editor);
    } else {
      registerMouseUp(editor, throttledStore);
    }
    editor.on('keyup nodechange', function (e) {
      if (!isManualNodeChange(e)) {
        $_5o1m7s3ujc7tm7p1.store(editor);
      }
    });
  };
  var register$2 = function (editor) {
    var throttledStore = $_w9o8y54jc7tm7yp.first(function () {
      $_5o1m7s3ujc7tm7p1.store(editor);
    }, 0);
    if (editor.inline) {
      registerPageMouseUp(editor, throttledStore);
    }
    editor.on('init', function () {
      registerEditorEvents(editor, throttledStore);
    });
    editor.on('remove', function () {
      throttledStore.cancel();
    });
  };
  var $_dn79956yjc7tm8fn = { register: register$2 };

  var documentFocusInHandler;
  var DOM$8 = DOMUtils.DOM;
  var isEditorUIElement = function (elm) {
    return $_ei8xs46xjc7tm8fi.isEditorUIElement(elm);
  };
  var isUIElement = function (editor, elm) {
    var customSelector = editor ? editor.settings.custom_ui_selector : '';
    var parent = DOM$8.getParent(elm, function (elm) {
      return isEditorUIElement(elm) || (customSelector ? editor.dom.is(elm, customSelector) : false);
    });
    return parent !== null;
  };
  var getActiveElement = function () {
    try {
      return document.activeElement;
    } catch (ex) {
      return document.body;
    }
  };
  var registerEvents = function (editorManager, e) {
    var editor = e.editor;
    $_dn79956yjc7tm8fn.register(editor);
    editor.on('focusin', function () {
      var focusedEditor = editorManager.focusedEditor;
      if (focusedEditor != editor) {
        if (focusedEditor) {
          focusedEditor.fire('blur', { focusedEditor: editor });
        }
        editorManager.setActive(editor);
        editorManager.focusedEditor = editor;
        editor.fire('focus', { blurredEditor: focusedEditor });
        editor.focus(true);
      }
    });
    editor.on('focusout', function () {
      $_9jpiwcgjc7tm6kr.setEditorTimeout(editor, function () {
        var focusedEditor = editorManager.focusedEditor;
        if (!isUIElement(editor, getActiveElement()) && focusedEditor == editor) {
          editor.fire('blur', { focusedEditor: null });
          editorManager.focusedEditor = null;
        }
      });
    });
    if (!documentFocusInHandler) {
      documentFocusInHandler = function (e) {
        var activeEditor = editorManager.activeEditor, target;
        target = e.target;
        if (activeEditor && target.ownerDocument === document) {
          if (target !== document.body && !isUIElement(activeEditor, target) && editorManager.focusedEditor === activeEditor) {
            activeEditor.fire('blur', { focusedEditor: null });
            editorManager.focusedEditor = null;
          }
        }
      };
      DOM$8.bind(document, 'focusin', documentFocusInHandler);
    }
  };
  var unregisterDocumentEvents = function (editorManager, e) {
    if (editorManager.focusedEditor == e.editor) {
      editorManager.focusedEditor = null;
    }
    if (!editorManager.activeEditor) {
      DOM$8.unbind(document, 'focusin', documentFocusInHandler);
      documentFocusInHandler = null;
    }
  };
  var setup$11 = function (editorManager) {
    editorManager.on('AddEditor', $_f41mrx6jc7tm6cd.curry(registerEvents, editorManager));
    editorManager.on('RemoveEditor', $_f41mrx6jc7tm6cd.curry(unregisterDocumentEvents, editorManager));
  };
  var $_4kzltu6wjc7tm8fd = {
    setup: setup$11,
    isEditorUIElement: isEditorUIElement,
    isUIElement: isUIElement
  };

  var data = {};
  var code = 'en';
  var $_660mfa6zjc7tm8fu = {
    setCode: function (newCode) {
      if (newCode) {
        code = newCode;
        this.rtl = this.data[newCode] ? this.data[newCode]._dir === 'rtl' : false;
      }
    },
    getCode: function () {
      return code;
    },
    rtl: false,
    add: function (code, items) {
      var langData = data[code];
      if (!langData) {
        data[code] = langData = {};
      }
      for (var name in items) {
        langData[name] = items[name];
      }
      this.setCode(code);
    },
    translate: function (text) {
      var langData = data[code] || {};
      var toString = function (obj) {
        if ($_b8tc32jjc7tm6qi.is(obj, 'function')) {
          return Object.prototype.toString.call(obj);
        }
        return !isEmpty(obj) ? '' + obj : '';
      };
      var isEmpty = function (text) {
        return text === '' || text === null || $_b8tc32jjc7tm6qi.is(text, 'undefined');
      };
      var getLangData = function (text) {
        text = toString(text);
        return $_b8tc32jjc7tm6qi.hasOwn(langData, text) ? toString(langData[text]) : text;
      };
      if (isEmpty(text)) {
        return '';
      }
      if ($_b8tc32jjc7tm6qi.is(text, 'object') && $_b8tc32jjc7tm6qi.hasOwn(text, 'raw')) {
        return toString(text.raw);
      }
      if ($_b8tc32jjc7tm6qi.is(text, 'array')) {
        var values = text.slice(1);
        text = getLangData(text[0]).replace(/\{([0-9]+)\}/g, function ($1, $2) {
          return $_b8tc32jjc7tm6qi.hasOwn(values, $2) ? toString(values[$2]) : $1;
        });
      }
      return getLangData(text).replace(/{context:\w+}$/, '');
    },
    data: data
  };

  var DOM$7 = DOMUtils.DOM;
  var explode$5 = $_b8tc32jjc7tm6qi.explode;
  var each$23 = $_b8tc32jjc7tm6qi.each;
  var extend$5 = $_b8tc32jjc7tm6qi.extend;
  var instanceCounter = 0;
  var beforeUnloadDelegate;
  var EditorManager;
  var boundGlobalEvents = false;
  var legacyEditors = [];
  var editors = [];
  var isValidLegacyKey = function (id) {
    return id !== 'length';
  };
  var globalEventDelegate = function (e) {
    each$23(EditorManager.get(), function (editor) {
      if (e.type === 'scroll') {
        editor.fire('ScrollWindow', e);
      } else {
        editor.fire('ResizeWindow', e);
      }
    });
  };
  var toggleGlobalEvents = function (state) {
    if (state !== boundGlobalEvents) {
      if (state) {
        DomQuery(window).on('resize scroll', globalEventDelegate);
      } else {
        DomQuery(window).off('resize scroll', globalEventDelegate);
      }
      boundGlobalEvents = state;
    }
  };
  var removeEditorFromList = function (targetEditor) {
    var oldEditors = editors;
    delete legacyEditors[targetEditor.id];
    for (var i = 0; i < legacyEditors.length; i++) {
      if (legacyEditors[i] === targetEditor) {
        legacyEditors.splice(i, 1);
        break;
      }
    }
    editors = $_20yqgb4jc7tm6aj.filter(editors, function (editor) {
      return targetEditor !== editor;
    });
    if (EditorManager.activeEditor === targetEditor) {
      EditorManager.activeEditor = editors.length > 0 ? editors[0] : null;
    }
    if (EditorManager.focusedEditor === targetEditor) {
      EditorManager.focusedEditor = null;
    }
    return oldEditors.length !== editors.length;
  };
  var purgeDestroyedEditor = function (editor) {
    if (editor && editor.initialized && !(editor.getContainer() || editor.getBody()).parentNode) {
      removeEditorFromList(editor);
      editor.unbindAllNativeEvents();
      editor.destroy(true);
      editor.removed = true;
      editor = null;
    }
    return editor;
  };
  EditorManager = {
    defaultSettings: {},
    $: DomQuery,
    majorVersion: '4',
    minorVersion: '7.4',
    releaseDate: '2017-12-05',
    editors: legacyEditors,
    i18n: $_660mfa6zjc7tm8fu,
    activeEditor: null,
    settings: {},
    setup: function () {
      var self = this, baseURL, documentBaseURL, suffix = '', preInit, src;
      documentBaseURL = URI.getDocumentBaseUrl(document.location);
      if (/^[^:]+:\/\/\/?[^\/]+\//.test(documentBaseURL)) {
        documentBaseURL = documentBaseURL.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
        if (!/[\/\\]$/.test(documentBaseURL)) {
          documentBaseURL += '/';
        }
      }
      preInit = window.tinymce || window.tinyMCEPreInit;
      if (preInit) {
        baseURL = preInit.base || preInit.baseURL;
        suffix = preInit.suffix;
      } else {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
          src = scripts[i].src;
          var srcScript = src.substring(src.lastIndexOf('/'));
          if (/tinymce(\.full|\.jquery|)(\.min|\.dev|)\.js/.test(src)) {
            if (srcScript.indexOf('.min') != -1) {
              suffix = '.min';
            }
            baseURL = src.substring(0, src.lastIndexOf('/'));
            break;
          }
        }
        if (!baseURL && document.currentScript) {
          src = document.currentScript.src;
          if (src.indexOf('.min') != -1) {
            suffix = '.min';
          }
          baseURL = src.substring(0, src.lastIndexOf('/'));
        }
      }
      self.baseURL = new URI(documentBaseURL).toAbsolute(baseURL);
      self.documentBaseURL = documentBaseURL;
      self.baseURI = new URI(self.baseURL);
      self.suffix = suffix;
      $_4kzltu6wjc7tm8fd.setup(self);
    },
    overrideDefaults: function (defaultSettings) {
      var baseUrl, suffix;
      baseUrl = defaultSettings.base_url;
      if (baseUrl) {
        this.baseURL = new URI(this.documentBaseURL).toAbsolute(baseUrl.replace(/\/+$/, ''));
        this.baseURI = new URI(this.baseURL);
      }
      suffix = defaultSettings.suffix;
      if (defaultSettings.suffix) {
        this.suffix = suffix;
      }
      this.defaultSettings = defaultSettings;
      var pluginBaseUrls = defaultSettings.plugin_base_urls;
      for (var name in pluginBaseUrls) {
        AddOnManager.PluginManager.urls[name] = pluginBaseUrls[name];
      }
    },
    init: function (settings) {
      var self = this, result, invalidInlineTargets;
      invalidInlineTargets = $_b8tc32jjc7tm6qi.makeMap('area base basefont br col frame hr img input isindex link meta param embed source wbr track ' + 'colgroup option tbody tfoot thead tr script noscript style textarea video audio iframe object menu', ' ');
      var isInvalidInlineTarget = function (settings, elm) {
        return settings.inline && elm.tagName.toLowerCase() in invalidInlineTargets;
      };
      var createId = function (elm) {
        var id = elm.id;
        if (!id) {
          id = elm.name;
          if (id && !DOM$7.get(id)) {
            id = elm.name;
          } else {
            id = DOM$7.uniqueId();
          }
          elm.setAttribute('id', id);
        }
        return id;
      };
      var execCallback = function (name) {
        var callback = settings[name];
        if (!callback) {
          return;
        }
        return callback.apply(self, Array.prototype.slice.call(arguments, 2));
      };
      var hasClass = function (elm, className) {
        return className.constructor === RegExp ? className.test(elm.className) : DOM$7.hasClass(elm, className);
      };
      var findTargets = function (settings) {
        var l, targets = [];
        if ($_dtgtsy9jc7tm6gs.ie && $_dtgtsy9jc7tm6gs.ie < 11) {
          $_4z4ogl4djc7tm7t4.initError('TinyMCE does not support the browser you are using. For a list of supported' + ' browsers please see: https://www.tinymce.com/docs/get-started/system-requirements/');
          return [];
        }
        if (settings.types) {
          each$23(settings.types, function (type) {
            targets = targets.concat(DOM$7.select(type.selector));
          });
          return targets;
        } else if (settings.selector) {
          return DOM$7.select(settings.selector);
        } else if (settings.target) {
          return [settings.target];
        }
        switch (settings.mode) {
        case 'exact':
          l = settings.elements || '';
          if (l.length > 0) {
            each$23(explode$5(l), function (id) {
              var elm;
              if (elm = DOM$7.get(id)) {
                targets.push(elm);
              } else {
                each$23(document.forms, function (f) {
                  each$23(f.elements, function (e) {
                    if (e.name === id) {
                      id = 'mce_editor_' + instanceCounter++;
                      DOM$7.setAttrib(e, 'id', id);
                      targets.push(e);
                    }
                  });
                });
              }
            });
          }
          break;
        case 'textareas':
        case 'specific_textareas':
          each$23(DOM$7.select('textarea'), function (elm) {
            if (settings.editor_deselector && hasClass(elm, settings.editor_deselector)) {
              return;
            }
            if (!settings.editor_selector || hasClass(elm, settings.editor_selector)) {
              targets.push(elm);
            }
          });
          break;
        }
        return targets;
      };
      var provideResults = function (editors) {
        result = editors;
      };
      var initEditors = function () {
        var initCount = 0, editors = [], targets;
        var createEditor = function (id, settings, targetElm) {
          var editor = new Editor(id, settings, self);
          editors.push(editor);
          editor.on('init', function () {
            if (++initCount === targets.length) {
              provideResults(editors);
            }
          });
          editor.targetElm = editor.targetElm || targetElm;
          editor.render();
        };
        DOM$7.unbind(window, 'ready', initEditors);
        execCallback('onpageload');
        targets = DomQuery.unique(findTargets(settings));
        if (settings.types) {
          each$23(settings.types, function (type) {
            $_b8tc32jjc7tm6qi.each(targets, function (elm) {
              if (DOM$7.is(elm, type.selector)) {
                createEditor(createId(elm), extend$5({}, settings, type), elm);
                return false;
              }
              return true;
            });
          });
          return;
        }
        $_b8tc32jjc7tm6qi.each(targets, function (elm) {
          purgeDestroyedEditor(self.get(elm.id));
        });
        targets = $_b8tc32jjc7tm6qi.grep(targets, function (elm) {
          return !self.get(elm.id);
        });
        if (targets.length === 0) {
          provideResults([]);
        } else {
          each$23(targets, function (elm) {
            if (isInvalidInlineTarget(settings, elm)) {
              $_4z4ogl4djc7tm7t4.initError('Could not initialize inline editor on invalid inline target element', elm);
            } else {
              createEditor(createId(elm), settings, elm);
            }
          });
        }
      };
      self.settings = settings;
      DOM$7.bind(window, 'ready', initEditors);
      return new promiseObj(function (resolve) {
        if (result) {
          resolve(result);
        } else {
          provideResults = function (editors) {
            resolve(editors);
          };
        }
      });
    },
    get: function (id) {
      if (arguments.length === 0) {
        return editors.slice(0);
      } else if ($_1g0kpc12jc7tm6vn.isString(id)) {
        return $_20yqgb4jc7tm6aj.find(editors, function (editor) {
          return editor.id === id;
        }).getOr(null);
      } else if ($_1g0kpc12jc7tm6vn.isNumber(id)) {
        return editors[id] ? editors[id] : null;
      } else {
        return null;
      }
    },
    add: function (editor) {
      var self = this, existingEditor;
      existingEditor = legacyEditors[editor.id];
      if (existingEditor === editor) {
        return editor;
      }
      if (self.get(editor.id) === null) {
        if (isValidLegacyKey(editor.id)) {
          legacyEditors[editor.id] = editor;
        }
        legacyEditors.push(editor);
        editors.push(editor);
      }
      toggleGlobalEvents(true);
      self.activeEditor = editor;
      self.fire('AddEditor', { editor: editor });
      if (!beforeUnloadDelegate) {
        beforeUnloadDelegate = function () {
          self.fire('BeforeUnload');
        };
        DOM$7.bind(window, 'beforeunload', beforeUnloadDelegate);
      }
      return editor;
    },
    createEditor: function (id, settings) {
      return this.add(new Editor(id, settings, this));
    },
    remove: function (selector) {
      var self = this, i, editor;
      if (!selector) {
        for (i = editors.length - 1; i >= 0; i--) {
          self.remove(editors[i]);
        }
        return;
      }
      if ($_1g0kpc12jc7tm6vn.isString(selector)) {
        selector = selector.selector || selector;
        each$23(DOM$7.select(selector), function (elm) {
          editor = self.get(elm.id);
          if (editor) {
            self.remove(editor);
          }
        });
        return;
      }
      editor = selector;
      if ($_1g0kpc12jc7tm6vn.isNull(self.get(editor.id))) {
        return null;
      }
      if (removeEditorFromList(editor)) {
        self.fire('RemoveEditor', { editor: editor });
      }
      if (editors.length === 0) {
        DOM$7.unbind(window, 'beforeunload', beforeUnloadDelegate);
      }
      editor.remove();
      toggleGlobalEvents(editors.length > 0);
      return editor;
    },
    execCommand: function (cmd, ui, value) {
      var self = this, editor = self.get(value);
      switch (cmd) {
      case 'mceAddEditor':
        if (!self.get(value)) {
          new Editor(value, self.settings, self).render();
        }
        return true;
      case 'mceRemoveEditor':
        if (editor) {
          editor.remove();
        }
        return true;
      case 'mceToggleEditor':
        if (!editor) {
          self.execCommand('mceAddEditor', 0, value);
          return true;
        }
        if (editor.isHidden()) {
          editor.show();
        } else {
          editor.hide();
        }
        return true;
      }
      if (self.activeEditor) {
        return self.activeEditor.execCommand(cmd, ui, value);
      }
      return false;
    },
    triggerSave: function () {
      each$23(editors, function (editor) {
        editor.save();
      });
    },
    addI18n: function (code, items) {
      $_660mfa6zjc7tm8fu.add(code, items);
    },
    translate: function (text) {
      return $_660mfa6zjc7tm8fu.translate(text);
    },
    setActive: function (editor) {
      var activeEditor = this.activeEditor;
      if (this.activeEditor != editor) {
        if (activeEditor) {
          activeEditor.fire('deactivate', { relatedTarget: editor });
        }
        editor.fire('activate', { relatedTarget: activeEditor });
      }
      this.activeEditor = editor;
    }
  };
  extend$5(EditorManager, $_4pdx2z3yjc7tm7py);
  EditorManager.setup();
  var EditorManager$1 = EditorManager;

  var RangeUtils = function (dom) {
    var walk = function (rng, callback) {
      return $_5v48kh5gjc7tm81m.walk(dom, rng, callback);
    };
    var split = $_bnjeic3ijc7tm7lt.split;
    var normalize = function (rng) {
      return $_ca2q7b3sjc7tm7ol.normalize(dom, rng).fold($_f41mrx6jc7tm6cd.constant(false), function (normalizedRng) {
        rng.setStart(normalizedRng.startContainer, normalizedRng.startOffset);
        rng.setEnd(normalizedRng.endContainer, normalizedRng.endOffset);
        return true;
      });
    };
    return {
      walk: walk,
      split: split,
      normalize: normalize
    };
  };
  RangeUtils.compareRanges = $_5m3au53tjc7tm7ou.isEq;
  RangeUtils.getCaretRangeFromPoint = $_b5ji3061jc7tm878.fromPoint;
  RangeUtils.getSelectedNode = $_4yp5rq23jc7tm76g.getSelectedNode;
  RangeUtils.getNode = $_4yp5rq23jc7tm76g.getNode;

  var min = Math.min;
  var max = Math.max;
  var round$1 = Math.round;
  var relativePosition = function (rect, targetRect, rel) {
    var x, y, w, h, targetW, targetH;
    x = targetRect.x;
    y = targetRect.y;
    w = rect.w;
    h = rect.h;
    targetW = targetRect.w;
    targetH = targetRect.h;
    rel = (rel || '').split('');
    if (rel[0] === 'b') {
      y += targetH;
    }
    if (rel[1] === 'r') {
      x += targetW;
    }
    if (rel[0] === 'c') {
      y += round$1(targetH / 2);
    }
    if (rel[1] === 'c') {
      x += round$1(targetW / 2);
    }
    if (rel[3] === 'b') {
      y -= h;
    }
    if (rel[4] === 'r') {
      x -= w;
    }
    if (rel[3] === 'c') {
      y -= round$1(h / 2);
    }
    if (rel[4] === 'c') {
      x -= round$1(w / 2);
    }
    return create$2(x, y, w, h);
  };
  var findBestRelativePosition = function (rect, targetRect, constrainRect, rels) {
    var pos, i;
    for (i = 0; i < rels.length; i++) {
      pos = relativePosition(rect, targetRect, rels[i]);
      if (pos.x >= constrainRect.x && pos.x + pos.w <= constrainRect.w + constrainRect.x && pos.y >= constrainRect.y && pos.y + pos.h <= constrainRect.h + constrainRect.y) {
        return rels[i];
      }
    }
    return null;
  };
  var inflate = function (rect, w, h) {
    return create$2(rect.x - w, rect.y - h, rect.w + w * 2, rect.h + h * 2);
  };
  var intersect = function (rect, cropRect) {
    var x1, y1, x2, y2;
    x1 = max(rect.x, cropRect.x);
    y1 = max(rect.y, cropRect.y);
    x2 = min(rect.x + rect.w, cropRect.x + cropRect.w);
    y2 = min(rect.y + rect.h, cropRect.y + cropRect.h);
    if (x2 - x1 < 0 || y2 - y1 < 0) {
      return null;
    }
    return create$2(x1, y1, x2 - x1, y2 - y1);
  };
  var clamp$1 = function (rect, clampRect, fixedSize) {
    var underflowX1, underflowY1, overflowX2, overflowY2, x1, y1, x2, y2, cx2, cy2;
    x1 = rect.x;
    y1 = rect.y;
    x2 = rect.x + rect.w;
    y2 = rect.y + rect.h;
    cx2 = clampRect.x + clampRect.w;
    cy2 = clampRect.y + clampRect.h;
    underflowX1 = max(0, clampRect.x - x1);
    underflowY1 = max(0, clampRect.y - y1);
    overflowX2 = max(0, x2 - cx2);
    overflowY2 = max(0, y2 - cy2);
    x1 += underflowX1;
    y1 += underflowY1;
    if (fixedSize) {
      x2 += underflowX1;
      y2 += underflowY1;
      x1 -= overflowX2;
      y1 -= overflowY2;
    }
    x2 -= overflowX2;
    y2 -= overflowY2;
    return create$2(x1, y1, x2 - x1, y2 - y1);
  };
  var create$2 = function (x, y, w, h) {
    return {
      x: x,
      y: y,
      w: w,
      h: h
    };
  };
  var fromClientRect = function (clientRect) {
    return create$2(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
  };
  var $_bbnaml71jc7tm8g9 = {
    inflate: inflate,
    relativePosition: relativePosition,
    findBestRelativePosition: findBestRelativePosition,
    intersect: intersect,
    clamp: clamp$1,
    create: create$2,
    fromClientRect: fromClientRect
  };

  var types = {};
  var $_7ddyzg72jc7tm8gf = {
    add: function (type, typeClass) {
      types[type.toLowerCase()] = typeClass;
    },
    has: function (type) {
      return !!types[type.toLowerCase()];
    },
    get: function (type) {
      var lctype = type.toLowerCase();
      var controlType = types.hasOwnProperty(lctype) ? types[lctype] : null;
      if (controlType === null) {
        throw new Error('Could not find module for type: ' + type);
      }
      return controlType;
    },
    create: function (type, settings) {
      var ControlType;
      if (typeof type == 'string') {
        settings = settings || {};
        settings.type = type;
      } else {
        settings = type;
        type = settings.type;
      }
      type = type.toLowerCase();
      ControlType = types[type];
      if (!ControlType) {
        throw new Error('Could not find control by type: ' + type);
      }
      ControlType = new ControlType(settings);
      ControlType.type = type;
      return ControlType;
    }
  };

  var each$24 = $_b8tc32jjc7tm6qi.each;
  var extend$6 = $_b8tc32jjc7tm6qi.extend;
  var extendClass;
  var initializing;
  var Class = function () {
  };
  Class.extend = extendClass = function (prop) {
    var self = this, _super = self.prototype, prototype, name, member;
    var Class = function () {
      var i, mixins, mixin, self = this;
      if (!initializing) {
        if (self.init) {
          self.init.apply(self, arguments);
        }
        mixins = self.Mixins;
        if (mixins) {
          i = mixins.length;
          while (i--) {
            mixin = mixins[i];
            if (mixin.init) {
              mixin.init.apply(self, arguments);
            }
          }
        }
      }
    };
    var dummy = function () {
      return this;
    };
    var createMethod = function (name, fn) {
      return function () {
        var self = this, tmp = self._super, ret;
        self._super = _super[name];
        ret = fn.apply(self, arguments);
        self._super = tmp;
        return ret;
      };
    };
    initializing = true;
    prototype = new self();
    initializing = false;
    if (prop.Mixins) {
      each$24(prop.Mixins, function (mixin) {
        for (var name in mixin) {
          if (name !== 'init') {
            prop[name] = mixin[name];
          }
        }
      });
      if (_super.Mixins) {
        prop.Mixins = _super.Mixins.concat(prop.Mixins);
      }
    }
    if (prop.Methods) {
      each$24(prop.Methods.split(','), function (name) {
        prop[name] = dummy;
      });
    }
    if (prop.Properties) {
      each$24(prop.Properties.split(','), function (name) {
        var fieldName = '_' + name;
        prop[name] = function (value) {
          var self = this, undef;
          if (value !== undef) {
            self[fieldName] = value;
            return self;
          }
          return self[fieldName];
        };
      });
    }
    if (prop.Statics) {
      each$24(prop.Statics, function (func, name) {
        Class[name] = func;
      });
    }
    if (prop.Defaults && _super.Defaults) {
      prop.Defaults = extend$6({}, _super.Defaults, prop.Defaults);
    }
    for (name in prop) {
      member = prop[name];
      if (typeof member == 'function' && _super[name]) {
        prototype[name] = createMethod(name, member);
      } else {
        prototype[name] = member;
      }
    }
    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = extendClass;
    return Class;
  };

  var min$1 = Math.min;
  var max$1 = Math.max;
  var round$2 = Math.round;
  var Color = function (value) {
    var self = {}, r = 0, g = 0, b = 0;
    var rgb2hsv = function (r, g, b) {
      var h, s, v, d, minRGB, maxRGB;
      h = 0;
      s = 0;
      v = 0;
      r = r / 255;
      g = g / 255;
      b = b / 255;
      minRGB = min$1(r, min$1(g, b));
      maxRGB = max$1(r, max$1(g, b));
      if (minRGB == maxRGB) {
        v = minRGB;
        return {
          h: 0,
          s: 0,
          v: v * 100
        };
      }
      d = r == minRGB ? g - b : b == minRGB ? r - g : b - r;
      h = r == minRGB ? 3 : b == minRGB ? 1 : 5;
      h = 60 * (h - d / (maxRGB - minRGB));
      s = (maxRGB - minRGB) / maxRGB;
      v = maxRGB;
      return {
        h: round$2(h),
        s: round$2(s * 100),
        v: round$2(v * 100)
      };
    };
    var hsvToRgb = function (hue, saturation, brightness) {
      var side, chroma, x, match;
      hue = (parseInt(hue, 10) || 0) % 360;
      saturation = parseInt(saturation, 10) / 100;
      brightness = parseInt(brightness, 10) / 100;
      saturation = max$1(0, min$1(saturation, 1));
      brightness = max$1(0, min$1(brightness, 1));
      if (saturation === 0) {
        r = g = b = round$2(255 * brightness);
        return;
      }
      side = hue / 60;
      chroma = brightness * saturation;
      x = chroma * (1 - Math.abs(side % 2 - 1));
      match = brightness - chroma;
      switch (Math.floor(side)) {
      case 0:
        r = chroma;
        g = x;
        b = 0;
        break;
      case 1:
        r = x;
        g = chroma;
        b = 0;
        break;
      case 2:
        r = 0;
        g = chroma;
        b = x;
        break;
      case 3:
        r = 0;
        g = x;
        b = chroma;
        break;
      case 4:
        r = x;
        g = 0;
        b = chroma;
        break;
      case 5:
        r = chroma;
        g = 0;
        b = x;
        break;
      default:
        r = g = b = 0;
      }
      r = round$2(255 * (r + match));
      g = round$2(255 * (g + match));
      b = round$2(255 * (b + match));
    };
    var toHex = function () {
      var hex = function (val) {
        val = parseInt(val, 10).toString(16);
        return val.length > 1 ? val : '0' + val;
      };
      return '#' + hex(r) + hex(g) + hex(b);
    };
    var toRgb = function () {
      return {
        r: r,
        g: g,
        b: b
      };
    };
    var toHsv = function () {
      return rgb2hsv(r, g, b);
    };
    var parse = function (value) {
      var matches;
      if (typeof value == 'object') {
        if ('r' in value) {
          r = value.r;
          g = value.g;
          b = value.b;
        } else if ('v' in value) {
          hsvToRgb(value.h, value.s, value.v);
        }
      } else {
        if (matches = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)[^\)]*\)/gi.exec(value)) {
          r = parseInt(matches[1], 10);
          g = parseInt(matches[2], 10);
          b = parseInt(matches[3], 10);
        } else if (matches = /#([0-F]{2})([0-F]{2})([0-F]{2})/gi.exec(value)) {
          r = parseInt(matches[1], 16);
          g = parseInt(matches[2], 16);
          b = parseInt(matches[3], 16);
        } else if (matches = /#([0-F])([0-F])([0-F])/gi.exec(value)) {
          r = parseInt(matches[1] + matches[1], 16);
          g = parseInt(matches[2] + matches[2], 16);
          b = parseInt(matches[3] + matches[3], 16);
        }
      }
      r = r < 0 ? 0 : r > 255 ? 255 : r;
      g = g < 0 ? 0 : g > 255 ? 255 : g;
      b = b < 0 ? 0 : b > 255 ? 255 : b;
      return self;
    };
    if (value) {
      parse(value);
    }
    self.toRgb = toRgb;
    self.toHsv = toHsv;
    self.toHex = toHex;
    self.parse = parse;
    return self;
  };

  var serialize = function (o, quote) {
    var i, v, t, name;
    quote = quote || '"';
    if (o === null) {
      return 'null';
    }
    t = typeof o;
    if (t == 'string') {
      v = '\bb\tt\nn\ff\rr""\'\'\\\\';
      return quote + o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g, function (a, b) {
        if (quote === '"' && a === '\'') {
          return a;
        }
        i = v.indexOf(b);
        if (i + 1) {
          return '\\' + v.charAt(i + 1);
        }
        a = b.charCodeAt().toString(16);
        return '\\u' + '0000'.substring(a.length) + a;
      }) + quote;
    }
    if (t == 'object') {
      if (o.hasOwnProperty && Object.prototype.toString.call(o) === '[object Array]') {
        for (i = 0, v = '['; i < o.length; i++) {
          v += (i > 0 ? ',' : '') + serialize(o[i], quote);
        }
        return v + ']';
      }
      v = '{';
      for (name in o) {
        if (o.hasOwnProperty(name)) {
          v += typeof o[name] != 'function' ? (v.length > 1 ? ',' + quote : quote) + name + quote + ':' + serialize(o[name], quote) : '';
        }
      }
      return v + '}';
    }
    return '' + o;
  };
  var $_842t3475jc7tm8h8 = {
    serialize: serialize,
    parse: function (text) {
      try {
        return window[String.fromCharCode(101) + 'val']('(' + text + ')');
      } catch (ex) {
      }
    }
  };

  var $_bq5bl976jc7tm8hf = {
    callbacks: {},
    count: 0,
    send: function (settings) {
      var self = this, dom = DOMUtils.DOM, count = settings.count !== undefined ? settings.count : self.count;
      var id = 'tinymce_jsonp_' + count;
      self.callbacks[count] = function (json) {
        dom.remove(id);
        delete self.callbacks[count];
        settings.callback(json);
      };
      dom.add(dom.doc.body, 'script', {
        id: id,
        src: settings.url,
        type: 'text/javascript'
      });
      self.count++;
    }
  };

  var XHR = {
    send: function (settings) {
      var xhr, count = 0;
      var ready = function () {
        if (!settings.async || xhr.readyState == 4 || count++ > 10000) {
          if (settings.success && count < 10000 && xhr.status == 200) {
            settings.success.call(settings.success_scope, '' + xhr.responseText, xhr, settings);
          } else if (settings.error) {
            settings.error.call(settings.error_scope, count > 10000 ? 'TIMED_OUT' : 'GENERAL', xhr, settings);
          }
          xhr = null;
        } else {
          setTimeout(ready, 10);
        }
      };
      settings.scope = settings.scope || this;
      settings.success_scope = settings.success_scope || settings.scope;
      settings.error_scope = settings.error_scope || settings.scope;
      settings.async = settings.async === false ? false : true;
      settings.data = settings.data || '';
      XHR.fire('beforeInitialize', { settings: settings });
      xhr = new XMLHttpRequest();
      if (xhr) {
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType(settings.content_type);
        }
        xhr.open(settings.type || (settings.data ? 'POST' : 'GET'), settings.url, settings.async);
        if (settings.crossDomain) {
          xhr.withCredentials = true;
        }
        if (settings.content_type) {
          xhr.setRequestHeader('Content-Type', settings.content_type);
        }
        if (settings.requestheaders) {
          $_b8tc32jjc7tm6qi.each(settings.requestheaders, function (header) {
            xhr.setRequestHeader(header.key, header.value);
          });
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr = XHR.fire('beforeSend', {
          xhr: xhr,
          settings: settings
        }).xhr;
        xhr.send(settings.data);
        if (!settings.async) {
          return ready();
        }
        setTimeout(ready, 10);
      }
    }
  };
  $_b8tc32jjc7tm6qi.extend(XHR, $_4pdx2z3yjc7tm7py);

  var extend$7 = $_b8tc32jjc7tm6qi.extend;
  var JSONRequest = function (settings) {
    this.settings = extend$7({}, settings);
    this.count = 0;
  };
  JSONRequest.sendRPC = function (o) {
    return new JSONRequest().send(o);
  };
  JSONRequest.prototype = {
    send: function (args) {
      var ecb = args.error, scb = args.success;
      args = extend$7(this.settings, args);
      args.success = function (c, x) {
        c = $_842t3475jc7tm8h8.parse(c);
        if (typeof c == 'undefined') {
          c = { error: 'JSON Parse error.' };
        }
        if (c.error) {
          ecb.call(args.error_scope || args.scope, c.error, x);
        } else {
          scb.call(args.success_scope || args.scope, c.result);
        }
      };
      args.error = function (ty, x) {
        if (ecb) {
          ecb.call(args.error_scope || args.scope, ty, x);
        }
      };
      args.data = $_842t3475jc7tm8h8.serialize({
        id: args.id || 'c' + this.count++,
        method: args.method,
        params: args.params
      });
      args.content_type = 'application/json';
      XHR.send(args);
    }
  };

  var localStorage = window.localStorage;

  var tinymce = EditorManager$1;
  var publicApi = {
    geom: { Rect: $_bbnaml71jc7tm8g9 },
    util: {
      Promise: promiseObj,
      Delay: $_9jpiwcgjc7tm6kr,
      Tools: $_b8tc32jjc7tm6qi,
      VK: $_b5txs856jc7tm7z0,
      URI: URI,
      Class: Class,
      EventDispatcher: Dispatcher,
      Observable: $_4pdx2z3yjc7tm7py,
      I18n: $_660mfa6zjc7tm8fu,
      XHR: XHR,
      JSON: $_842t3475jc7tm8h8,
      JSONRequest: JSONRequest,
      JSONP: $_bq5bl976jc7tm8hf,
      LocalStorage: localStorage,
      Color: Color
    },
    dom: {
      EventUtils: EventUtils,
      Sizzle: Sizzle,
      DomQuery: DomQuery,
      TreeWalker: TreeWalker,
      DOMUtils: DOMUtils,
      ScriptLoader: ScriptLoader,
      RangeUtils: RangeUtils,
      Serializer: Serializer$1,
      ControlSelection: ControlSelection,
      BookmarkManager: BookmarkManager,
      Selection: Selection$1,
      Event: EventUtils.Event
    },
    html: {
      Styles: Styles,
      Entities: Entities,
      Node: Node$2,
      Schema: Schema,
      SaxParser: SaxParser,
      DomParser: DomParser,
      Writer: Writer,
      Serializer: Serializer
    },
    ui: { Factory: $_7ddyzg72jc7tm8gf },
    Env: $_dtgtsy9jc7tm6gs,
    AddOnManager: AddOnManager,
    Formatter: Formatter,
    UndoManager: UndoManager,
    EditorCommands: EditorCommands,
    WindowManager: WindowManager,
    NotificationManager: NotificationManager,
    EditorObservable: EditorObservable$1,
    Shortcuts: Shortcuts,
    Editor: Editor,
    FocusManager: $_ei8xs46xjc7tm8fi,
    EditorManager: EditorManager$1,
    DOM: DOMUtils.DOM,
    ScriptLoader: ScriptLoader.ScriptLoader,
    PluginManager: AddOnManager.PluginManager,
    ThemeManager: AddOnManager.ThemeManager,
    trim: $_b8tc32jjc7tm6qi.trim,
    isArray: $_b8tc32jjc7tm6qi.isArray,
    is: $_b8tc32jjc7tm6qi.is,
    toArray: $_b8tc32jjc7tm6qi.toArray,
    makeMap: $_b8tc32jjc7tm6qi.makeMap,
    each: $_b8tc32jjc7tm6qi.each,
    map: $_b8tc32jjc7tm6qi.map,
    grep: $_b8tc32jjc7tm6qi.grep,
    inArray: $_b8tc32jjc7tm6qi.inArray,
    extend: $_b8tc32jjc7tm6qi.extend,
    create: $_b8tc32jjc7tm6qi.create,
    walk: $_b8tc32jjc7tm6qi.walk,
    createNS: $_b8tc32jjc7tm6qi.createNS,
    resolve: $_b8tc32jjc7tm6qi.resolve,
    explode: $_b8tc32jjc7tm6qi.explode,
    _addCacheSuffix: $_b8tc32jjc7tm6qi._addCacheSuffix,
    isOpera: $_dtgtsy9jc7tm6gs.opera,
    isWebKit: $_dtgtsy9jc7tm6gs.webkit,
    isIE: $_dtgtsy9jc7tm6gs.ie,
    isGecko: $_dtgtsy9jc7tm6gs.gecko,
    isMac: $_dtgtsy9jc7tm6gs.mac
  };
  tinymce = $_b8tc32jjc7tm6qi.extend(tinymce, publicApi);
  var Tinymce = tinymce;

  var exportToWindowGlobal = function (tinymce) {
    window.tinymce = tinymce;
    window.tinyMCE = tinymce;
  };
  exportToWindowGlobal(Tinymce);

}());
})()
