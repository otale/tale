(function () {
var mobile = (function () {
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
  var $_7wlbdawajc7tmgej = {
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

  var never = $_7wlbdawajc7tmgej.never;
  var always = $_7wlbdawajc7tmgej.always;
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
      toString: $_7wlbdawajc7tmgej.constant('none()')
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
  var $_7db13lw9jc7tmgee = {
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
    return r === -1 ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.some(r);
  };
  var contains$1 = function (xs, x) {
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
  var each = function (xs, f) {
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
    each(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_7db13lw9jc7tmgee.some(x);
      }
    }
    return $_7db13lw9jc7tmgee.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_7db13lw9jc7tmgee.some(i);
      }
    }
    return $_7db13lw9jc7tmgee.none();
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
      return !contains$1(a2, x);
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
    return xs.length === 0 ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.some(xs[xs.length - 1]);
  };
  var $_682tbuw8jc7tmgdz = {
    map: map,
    each: each,
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
    contains: contains$1,
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
  var $_bpwvkwdjc7tmgew = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_bpwvkwdjc7tmgew.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_akqfbmwcjc7tmges = { getOrDie: getOrDie };

  var node = function () {
    var f = $_akqfbmwcjc7tmges.getOrDie('Node');
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
  var $_fkaenwbjc7tmgeq = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

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
  var $_gdmqd6wgjc7tmgf1 = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$1 = function (regexes, agent) {
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
    return find$1(versionRegexes, cleanedAgent);
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
  var $_3ev85xwjjc7tmgf8 = {
    nu: nu$1,
    detect: detect$2,
    unknown: unknown$1
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie = 'IE';
  var opera = 'Opera';
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
      version: $_3ev85xwjjc7tmgf8.unknown()
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
      isIE: isBrowser(ie, current),
      isOpera: isBrowser(opera, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var $_eelxeiwijc7tmgf5 = {
    unknown: unknown,
    nu: nu,
    edge: $_7wlbdawajc7tmgej.constant(edge),
    chrome: $_7wlbdawajc7tmgej.constant(chrome),
    ie: $_7wlbdawajc7tmgej.constant(ie),
    opera: $_7wlbdawajc7tmgej.constant(opera),
    firefox: $_7wlbdawajc7tmgej.constant(firefox),
    safari: $_7wlbdawajc7tmgej.constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android = 'Android';
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
      version: $_3ev85xwjjc7tmgf8.unknown()
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
      isAndroid: isOS(android, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var $_5j390hwkjc7tmgfa = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_7wlbdawajc7tmgej.constant(windows),
    ios: $_7wlbdawajc7tmgej.constant(ios),
    android: $_7wlbdawajc7tmgej.constant(android),
    linux: $_7wlbdawajc7tmgej.constant(linux),
    osx: $_7wlbdawajc7tmgej.constant(osx),
    solaris: $_7wlbdawajc7tmgej.constant(solaris),
    freebsd: $_7wlbdawajc7tmgej.constant(freebsd)
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
      isiPad: $_7wlbdawajc7tmgej.constant(isiPad),
      isiPhone: $_7wlbdawajc7tmgej.constant(isiPhone),
      isTablet: $_7wlbdawajc7tmgej.constant(isTablet),
      isPhone: $_7wlbdawajc7tmgej.constant(isPhone),
      isTouch: $_7wlbdawajc7tmgej.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_7wlbdawajc7tmgej.constant(iOSwebview)
    };
  };

  var detect$3 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_682tbuw8jc7tmgdz.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$3(browsers, userAgent).map(function (browser) {
      var version = $_3ev85xwjjc7tmgf8.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$3(oses, userAgent).map(function (os) {
      var version = $_3ev85xwjjc7tmgf8.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_90rc8xwmjc7tmgfk = {
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
  var $_2m4msswpjc7tmgfx = {
    addToStart: addToStart,
    addToEnd: addToEnd,
    removeFromStart: removeFromStart,
    removeFromEnd: removeFromEnd
  };

  var first = function (str, count) {
    return str.substr(0, count);
  };
  var last$1 = function (str, count) {
    return str.substr(str.length - count, str.length);
  };
  var head$1 = function (str) {
    return str === '' ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.some(str.substring(1));
  };
  var $_5c8v4zwqjc7tmgfy = {
    first: first,
    last: last$1,
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
    return startsWith(str, prefix) ? $_2m4msswpjc7tmgfx.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_2m4msswpjc7tmgfx.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_2m4msswpjc7tmgfx.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_2m4msswpjc7tmgfx.addToEnd(str, prefix);
  };
  var contains$2 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_5c8v4zwqjc7tmgfy.head(str).bind(function (head) {
      return $_5c8v4zwqjc7tmgfy.tail(str).map(function (tail) {
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
  var trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  var lTrim = function (str) {
    return str.replace(/^\s+/g, '');
  };
  var rTrim = function (str) {
    return str.replace(/\s+$/g, '');
  };
  var $_cao7towojc7tmgfu = {
    supplant: supplant,
    startsWith: startsWith,
    removeLeading: removeLeading,
    removeTrailing: removeTrailing,
    ensureLeading: ensureLeading,
    ensureTrailing: ensureTrailing,
    endsWith: endsWith,
    contains: contains$2,
    trim: trim,
    lTrim: lTrim,
    rTrim: rTrim,
    capitalize: capitalize
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function (target) {
    return function (uastring) {
      return $_cao7towojc7tmgfu.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_cao7towojc7tmgfu.contains(uastring, 'edge/') && $_cao7towojc7tmgfu.contains(uastring, 'chrome') && $_cao7towojc7tmgfu.contains(uastring, 'safari') && $_cao7towojc7tmgfu.contains(uastring, 'applewebkit');
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
        return $_cao7towojc7tmgfu.contains(uastring, 'chrome') && !$_cao7towojc7tmgfu.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_cao7towojc7tmgfu.contains(uastring, 'msie') || $_cao7towojc7tmgfu.contains(uastring, 'trident');
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
        return ($_cao7towojc7tmgfu.contains(uastring, 'safari') || $_cao7towojc7tmgfu.contains(uastring, 'mobile/')) && $_cao7towojc7tmgfu.contains(uastring, 'applewebkit');
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
        return $_cao7towojc7tmgfu.contains(uastring, 'iphone') || $_cao7towojc7tmgfu.contains(uastring, 'ipad');
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
  var $_5h44t5wnjc7tmgfo = {
    browsers: $_7wlbdawajc7tmgej.constant(browsers),
    oses: $_7wlbdawajc7tmgej.constant(oses)
  };

  var detect$1 = function (userAgent) {
    var browsers = $_5h44t5wnjc7tmgfo.browsers();
    var oses = $_5h44t5wnjc7tmgfo.oses();
    var browser = $_90rc8xwmjc7tmgfk.detectBrowser(browsers, userAgent).fold($_eelxeiwijc7tmgf5.unknown, $_eelxeiwijc7tmgf5.nu);
    var os = $_90rc8xwmjc7tmgfk.detectOs(oses, userAgent).fold($_5j390hwkjc7tmgfa.unknown, $_5j390hwkjc7tmgfa.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_4auh8ewhjc7tmgf3 = { detect: detect$1 };

  var detect = $_gdmqd6wgjc7tmgf1.cached(function () {
    var userAgent = navigator.userAgent;
    return $_4auh8ewhjc7tmgf3.detect(userAgent);
  });
  var $_9tl8l8wfjc7tmgez = { detect: detect };

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
    return { dom: $_7wlbdawajc7tmgej.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_7db13lw9jc7tmgee.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_19g44bwsjc7tmgg6 = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_41l9lxwtjc7tmgga = {
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

  var ELEMENT = $_41l9lxwtjc7tmgga.ELEMENT;
  var DOCUMENT = $_41l9lxwtjc7tmgga.DOCUMENT;
  var is = function (element, selector) {
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
    return bypassSelector(base) ? [] : $_682tbuw8jc7tmgdz.map(base.querySelectorAll(selector), $_19g44bwsjc7tmgg6.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_7db13lw9jc7tmgee.none() : $_7db13lw9jc7tmgee.from(base.querySelector(selector)).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var $_5uhwcuwrjc7tmgg1 = {
    all: all,
    is: is,
    one: one
  };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_682tbuw8jc7tmgdz.exists(elements, $_7wlbdawajc7tmgej.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_fkaenwbjc7tmgeq.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_9tl8l8wfjc7tmgez.detect().browser;
  var contains = browser.isIE() ? ieContains : regularContains;
  var $_b6kzgmw7jc7tmgdr = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains,
    is: $_5uhwcuwrjc7tmgg1.is
  };

  var isSource = function (component, simulatedEvent) {
    return $_b6kzgmw7jc7tmgdr.eq(component.element(), simulatedEvent.event().target());
  };
  var $_8yz0lww6jc7tmgdm = { isSource: isSource };

  var $_dpjvxuwwjc7tmggu = {
    contextmenu: $_7wlbdawajc7tmgej.constant('contextmenu'),
    touchstart: $_7wlbdawajc7tmgej.constant('touchstart'),
    touchmove: $_7wlbdawajc7tmgej.constant('touchmove'),
    touchend: $_7wlbdawajc7tmgej.constant('touchend'),
    gesturestart: $_7wlbdawajc7tmgej.constant('gesturestart'),
    mousedown: $_7wlbdawajc7tmgej.constant('mousedown'),
    mousemove: $_7wlbdawajc7tmgej.constant('mousemove'),
    mouseout: $_7wlbdawajc7tmgej.constant('mouseout'),
    mouseup: $_7wlbdawajc7tmgej.constant('mouseup'),
    mouseover: $_7wlbdawajc7tmgej.constant('mouseover'),
    focusin: $_7wlbdawajc7tmgej.constant('focusin'),
    keydown: $_7wlbdawajc7tmgej.constant('keydown'),
    input: $_7wlbdawajc7tmgej.constant('input'),
    change: $_7wlbdawajc7tmgej.constant('change'),
    focus: $_7wlbdawajc7tmgej.constant('focus'),
    click: $_7wlbdawajc7tmgej.constant('click'),
    transitionend: $_7wlbdawajc7tmgej.constant('transitionend'),
    selectstart: $_7wlbdawajc7tmgej.constant('selectstart')
  };

  var alloy = { tap: $_7wlbdawajc7tmgej.constant('alloy.tap') };
  var $_66ekuowvjc7tmggn = {
    focus: $_7wlbdawajc7tmgej.constant('alloy.focus'),
    postBlur: $_7wlbdawajc7tmgej.constant('alloy.blur.post'),
    receive: $_7wlbdawajc7tmgej.constant('alloy.receive'),
    execute: $_7wlbdawajc7tmgej.constant('alloy.execute'),
    focusItem: $_7wlbdawajc7tmgej.constant('alloy.focus.item'),
    tap: alloy.tap,
    tapOrClick: $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch() ? alloy.tap : $_dpjvxuwwjc7tmggu.click,
    longpress: $_7wlbdawajc7tmgej.constant('alloy.longpress'),
    sandboxClose: $_7wlbdawajc7tmgej.constant('alloy.sandbox.close'),
    systemInit: $_7wlbdawajc7tmgej.constant('alloy.system.init'),
    windowScroll: $_7wlbdawajc7tmgej.constant('alloy.system.scroll'),
    attachedToDom: $_7wlbdawajc7tmgej.constant('alloy.system.attached'),
    detachedFromDom: $_7wlbdawajc7tmgej.constant('alloy.system.detached'),
    changeTab: $_7wlbdawajc7tmgej.constant('alloy.change.tab'),
    dismissTab: $_7wlbdawajc7tmgej.constant('alloy.dismiss.tab')
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
  var isType = function (type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var $_5ub7o5wyjc7tmggz = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
  };

  var shallow = function (old, nu) {
    return nu;
  };
  var deep = function (old, nu) {
    var bothObjects = $_5ub7o5wyjc7tmggz.isObject(old) && $_5ub7o5wyjc7tmggz.isObject(nu);
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
  var $_2nfiamwxjc7tmggx = {
    deepMerge: deepMerge,
    merge: merge
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
  var each$1 = function (obj, f) {
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
    each$1(obj, function (x, i) {
      var tuple = f(x, i, obj);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var bifilter = function (obj, pred) {
    var t = {};
    var f = {};
    each$1(obj, function (x, i) {
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
    each$1(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find$2 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_7db13lw9jc7tmgee.some(x);
      }
    }
    return $_7db13lw9jc7tmgee.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_fvv1p1wzjc7tmgh1 = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$2,
    keys: keys,
    values: values,
    size: size
  };

  var emit = function (component, event) {
    dispatchWith(component, component.element(), event, {});
  };
  var emitWith = function (component, event, properties) {
    dispatchWith(component, component.element(), event, properties);
  };
  var emitExecute = function (component) {
    emit(component, $_66ekuowvjc7tmggn.execute());
  };
  var dispatch = function (component, target, event) {
    dispatchWith(component, target, event, {});
  };
  var dispatchWith = function (component, target, event, properties) {
    var data = $_2nfiamwxjc7tmggx.deepMerge({ target: target }, properties);
    component.getSystem().triggerEvent(event, target, $_fvv1p1wzjc7tmgh1.map(data, $_7wlbdawajc7tmgej.constant));
  };
  var dispatchEvent = function (component, target, event, simulatedEvent) {
    component.getSystem().triggerEvent(event, target, simulatedEvent.event());
  };
  var dispatchFocus = function (component, target) {
    component.getSystem().triggerFocus(target, component.element());
  };
  var $_7zx0zrwujc7tmgge = {
    emit: emit,
    emitWith: emitWith,
    emitExecute: emitExecute,
    dispatch: dispatch,
    dispatchWith: dispatchWith,
    dispatchEvent: dispatchEvent,
    dispatchFocus: dispatchFocus
  };

  var generate = function (cases) {
    if (!$_5ub7o5wyjc7tmggz.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_682tbuw8jc7tmgdz.each(cases, function (acase, count) {
      var keys = $_fvv1p1wzjc7tmgh1.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_5ub7o5wyjc7tmggz.isArray(value)) {
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
          var branchKeys = $_fvv1p1wzjc7tmgh1.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_682tbuw8jc7tmgdz.forall(constructors, function (reqKey) {
            return $_682tbuw8jc7tmgdz.contains(branchKeys, reqKey);
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
  var $_edapatx3jc7tmgi6 = { generate: generate };

  var adt = $_edapatx3jc7tmgi6.generate([
    { strict: [] },
    { defaultedThunk: ['fallbackThunk'] },
    { asOption: [] },
    { asDefaultedOptionThunk: ['fallbackThunk'] },
    { mergeWithThunk: ['baseThunk'] }
  ]);
  var defaulted$1 = function (fallback) {
    return adt.defaultedThunk($_7wlbdawajc7tmgej.constant(fallback));
  };
  var asDefaultedOption = function (fallback) {
    return adt.asDefaultedOptionThunk($_7wlbdawajc7tmgej.constant(fallback));
  };
  var mergeWith = function (base) {
    return adt.mergeWithThunk($_7wlbdawajc7tmgej.constant(base));
  };
  var $_vby21x2jc7tmgi0 = {
    strict: adt.strict,
    asOption: adt.asOption,
    defaulted: defaulted$1,
    defaultedThunk: adt.defaultedThunk,
    asDefaultedOption: asDefaultedOption,
    asDefaultedOptionThunk: adt.asDefaultedOptionThunk,
    mergeWith: mergeWith,
    mergeWithThunk: adt.mergeWithThunk
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
      return $_7db13lw9jc7tmgee.some(o);
    };
    return {
      is: is,
      isValue: $_7wlbdawajc7tmgej.constant(true),
      isError: $_7wlbdawajc7tmgej.constant(false),
      getOr: $_7wlbdawajc7tmgej.constant(o),
      getOrThunk: $_7wlbdawajc7tmgej.constant(o),
      getOrDie: $_7wlbdawajc7tmgej.constant(o),
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
      return $_7wlbdawajc7tmgej.die(message)();
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
      is: $_7wlbdawajc7tmgej.constant(false),
      isValue: $_7wlbdawajc7tmgej.constant(false),
      isError: $_7wlbdawajc7tmgej.constant(true),
      getOr: $_7wlbdawajc7tmgej.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_7wlbdawajc7tmgej.noop,
      bind: bind,
      exists: $_7wlbdawajc7tmgej.constant(false),
      forall: $_7wlbdawajc7tmgej.constant(true),
      toOption: $_7db13lw9jc7tmgee.none
    };
  };
  var $_5x2c31x7jc7tmgjn = {
    value: value$1,
    error: error
  };

  var comparison = $_edapatx3jc7tmgi6.generate([
    {
      bothErrors: [
        'error1',
        'error2'
      ]
    },
    {
      firstError: [
        'error1',
        'value2'
      ]
    },
    {
      secondError: [
        'value1',
        'error2'
      ]
    },
    {
      bothValues: [
        'value1',
        'value2'
      ]
    }
  ]);
  var partition$1 = function (results) {
    var errors = [];
    var values = [];
    $_682tbuw8jc7tmgdz.each(results, function (result) {
      result.fold(function (err) {
        errors.push(err);
      }, function (value) {
        values.push(value);
      });
    });
    return {
      errors: errors,
      values: values
    };
  };
  var compare = function (result1, result2) {
    return result1.fold(function (err1) {
      return result2.fold(function (err2) {
        return comparison.bothErrors(err1, err2);
      }, function (val2) {
        return comparison.firstError(err1, val2);
      });
    }, function (val1) {
      return result2.fold(function (err2) {
        return comparison.secondError(val1, err2);
      }, function (val2) {
        return comparison.bothValues(val1, val2);
      });
    });
  };
  var $_crhv54x8jc7tmgju = {
    partition: partition$1,
    compare: compare
  };

  var mergeValues = function (values, base) {
    return $_5x2c31x7jc7tmgjn.value($_2nfiamwxjc7tmggx.deepMerge.apply(undefined, [base].concat(values)));
  };
  var mergeErrors = function (errors) {
    return $_7wlbdawajc7tmgej.compose($_5x2c31x7jc7tmgjn.error, $_682tbuw8jc7tmgdz.flatten)(errors);
  };
  var consolidateObj = function (objects, base) {
    var partitions = $_crhv54x8jc7tmgju.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
  };
  var consolidateArr = function (objects) {
    var partitions = $_crhv54x8jc7tmgju.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : $_5x2c31x7jc7tmgjn.value(partitions.values);
  };
  var $_cnb7vpx6jc7tmgj6 = {
    consolidateObj: consolidateObj,
    consolidateArr: consolidateArr
  };

  var narrow$1 = function (obj, fields) {
    var r = {};
    $_682tbuw8jc7tmgdz.each(fields, function (field) {
      if (obj[field] !== undefined && obj.hasOwnProperty(field))
        r[field] = obj[field];
    });
    return r;
  };
  var indexOnKey$1 = function (array, key) {
    var obj = {};
    $_682tbuw8jc7tmgdz.each(array, function (a) {
      var keyValue = a[key];
      obj[keyValue] = a;
    });
    return obj;
  };
  var exclude$1 = function (obj, fields) {
    var r = {};
    $_fvv1p1wzjc7tmgh1.each(obj, function (v, k) {
      if (!$_682tbuw8jc7tmgdz.contains(fields, k)) {
        r[k] = v;
      }
    });
    return r;
  };
  var $_5h8kl8x9jc7tmgjz = {
    narrow: narrow$1,
    exclude: exclude$1,
    indexOnKey: indexOnKey$1
  };

  var readOpt$1 = function (key) {
    return function (obj) {
      return obj.hasOwnProperty(key) ? $_7db13lw9jc7tmgee.from(obj[key]) : $_7db13lw9jc7tmgee.none();
    };
  };
  var readOr$1 = function (key, fallback) {
    return function (obj) {
      return readOpt$1(key)(obj).getOr(fallback);
    };
  };
  var readOptFrom$1 = function (obj, key) {
    return readOpt$1(key)(obj);
  };
  var hasKey$1 = function (obj, key) {
    return obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null;
  };
  var $_70xid2xajc7tmgk6 = {
    readOpt: readOpt$1,
    readOr: readOr$1,
    readOptFrom: readOptFrom$1,
    hasKey: hasKey$1
  };

  var wrap$1 = function (key, value) {
    var r = {};
    r[key] = value;
    return r;
  };
  var wrapAll$1 = function (keyvalues) {
    var r = {};
    $_682tbuw8jc7tmgdz.each(keyvalues, function (kv) {
      r[kv.key] = kv.value;
    });
    return r;
  };
  var $_8nor52xbjc7tmgkq = {
    wrap: wrap$1,
    wrapAll: wrapAll$1
  };

  var narrow = function (obj, fields) {
    return $_5h8kl8x9jc7tmgjz.narrow(obj, fields);
  };
  var exclude = function (obj, fields) {
    return $_5h8kl8x9jc7tmgjz.exclude(obj, fields);
  };
  var readOpt = function (key) {
    return $_70xid2xajc7tmgk6.readOpt(key);
  };
  var readOr = function (key, fallback) {
    return $_70xid2xajc7tmgk6.readOr(key, fallback);
  };
  var readOptFrom = function (obj, key) {
    return $_70xid2xajc7tmgk6.readOptFrom(obj, key);
  };
  var wrap = function (key, value) {
    return $_8nor52xbjc7tmgkq.wrap(key, value);
  };
  var wrapAll = function (keyvalues) {
    return $_8nor52xbjc7tmgkq.wrapAll(keyvalues);
  };
  var indexOnKey = function (array, key) {
    return $_5h8kl8x9jc7tmgjz.indexOnKey(array, key);
  };
  var consolidate = function (objs, base) {
    return $_cnb7vpx6jc7tmgj6.consolidateObj(objs, base);
  };
  var hasKey = function (obj, key) {
    return $_70xid2xajc7tmgk6.hasKey(obj, key);
  };
  var $_ftivuzx5jc7tmgj2 = {
    narrow: narrow,
    exclude: exclude,
    readOpt: readOpt,
    readOr: readOr,
    readOptFrom: readOptFrom,
    wrap: wrap,
    wrapAll: wrapAll,
    indexOnKey: indexOnKey,
    hasKey: hasKey,
    consolidate: consolidate
  };

  var json = function () {
    return $_akqfbmwcjc7tmges.getOrDie('JSON');
  };
  var parse = function (obj) {
    return json().parse(obj);
  };
  var stringify = function (obj, replacer, space) {
    return json().stringify(obj, replacer, space);
  };
  var $_7meawbxejc7tmglk = {
    parse: parse,
    stringify: stringify
  };

  var formatObj = function (input) {
    return $_5ub7o5wyjc7tmggz.isObject(input) && $_fvv1p1wzjc7tmgh1.keys(input).length > 100 ? ' removed due to size' : $_7meawbxejc7tmglk.stringify(input, null, 2);
  };
  var formatErrors = function (errors) {
    var es = errors.length > 10 ? errors.slice(0, 10).concat([{
        path: [],
        getErrorInfo: function () {
          return '... (only showing first ten failures)';
        }
      }]) : errors;
    return $_682tbuw8jc7tmgdz.map(es, function (e) {
      return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
    });
  };
  var $_9gimh5xdjc7tmgl7 = {
    formatObj: formatObj,
    formatErrors: formatErrors
  };

  var nu$4 = function (path, getErrorInfo) {
    return $_5x2c31x7jc7tmgjn.error([{
        path: path,
        getErrorInfo: getErrorInfo
      }]);
  };
  var missingStrict = function (path, key, obj) {
    return nu$4(path, function () {
      return 'Could not find valid *strict* value for "' + key + '" in ' + $_9gimh5xdjc7tmgl7.formatObj(obj);
    });
  };
  var missingKey = function (path, key) {
    return nu$4(path, function () {
      return 'Choice schema did not contain choice key: "' + key + '"';
    });
  };
  var missingBranch = function (path, branches, branch) {
    return nu$4(path, function () {
      return 'The chosen schema: "' + branch + '" did not exist in branches: ' + $_9gimh5xdjc7tmgl7.formatObj(branches);
    });
  };
  var unsupportedFields = function (path, unsupported) {
    return nu$4(path, function () {
      return 'There are unsupported fields: [' + unsupported.join(', ') + '] specified';
    });
  };
  var custom = function (path, err) {
    return nu$4(path, function () {
      return err;
    });
  };
  var toString = function (error) {
    return 'Failed path: (' + error.path.join(' > ') + ')\n' + error.getErrorInfo();
  };
  var $_7qo3tixcjc7tmgkz = {
    missingStrict: missingStrict,
    missingKey: missingKey,
    missingBranch: missingBranch,
    unsupportedFields: unsupportedFields,
    custom: custom,
    toString: toString
  };

  var typeAdt = $_edapatx3jc7tmgi6.generate([
    {
      setOf: [
        'validator',
        'valueType'
      ]
    },
    { arrOf: ['valueType'] },
    { objOf: ['fields'] },
    { itemOf: ['validator'] },
    {
      choiceOf: [
        'key',
        'branches'
      ]
    }
  ]);
  var fieldAdt = $_edapatx3jc7tmgi6.generate([
    {
      field: [
        'name',
        'presence',
        'type'
      ]
    },
    { state: ['name'] }
  ]);
  var $_5re10dxfjc7tmgln = {
    typeAdt: typeAdt,
    fieldAdt: fieldAdt
  };

  var adt$1 = $_edapatx3jc7tmgi6.generate([
    {
      field: [
        'key',
        'okey',
        'presence',
        'prop'
      ]
    },
    {
      state: [
        'okey',
        'instantiator'
      ]
    }
  ]);
  var output = function (okey, value) {
    return adt$1.state(okey, $_7wlbdawajc7tmgej.constant(value));
  };
  var snapshot = function (okey) {
    return adt$1.state(okey, $_7wlbdawajc7tmgej.identity);
  };
  var strictAccess = function (path, obj, key) {
    return $_70xid2xajc7tmgk6.readOptFrom(obj, key).fold(function () {
      return $_7qo3tixcjc7tmgkz.missingStrict(path, key, obj);
    }, $_5x2c31x7jc7tmgjn.value);
  };
  var fallbackAccess = function (obj, key, fallbackThunk) {
    var v = $_70xid2xajc7tmgk6.readOptFrom(obj, key).fold(function () {
      return fallbackThunk(obj);
    }, $_7wlbdawajc7tmgej.identity);
    return $_5x2c31x7jc7tmgjn.value(v);
  };
  var optionAccess = function (obj, key) {
    return $_5x2c31x7jc7tmgjn.value($_70xid2xajc7tmgk6.readOptFrom(obj, key));
  };
  var optionDefaultedAccess = function (obj, key, fallback) {
    var opt = $_70xid2xajc7tmgk6.readOptFrom(obj, key).map(function (val) {
      return val === true ? fallback(obj) : val;
    });
    return $_5x2c31x7jc7tmgjn.value(opt);
  };
  var cExtractOne = function (path, obj, field, strength) {
    return field.fold(function (key, okey, presence, prop) {
      var bundle = function (av) {
        return prop.extract(path.concat([key]), strength, av).map(function (res) {
          return $_8nor52xbjc7tmgkq.wrap(okey, strength(res));
        });
      };
      var bundleAsOption = function (optValue) {
        return optValue.fold(function () {
          var outcome = $_8nor52xbjc7tmgkq.wrap(okey, strength($_7db13lw9jc7tmgee.none()));
          return $_5x2c31x7jc7tmgjn.value(outcome);
        }, function (ov) {
          return prop.extract(path.concat([key]), strength, ov).map(function (res) {
            return $_8nor52xbjc7tmgkq.wrap(okey, strength($_7db13lw9jc7tmgee.some(res)));
          });
        });
      };
      return function () {
        return presence.fold(function () {
          return strictAccess(path, obj, key).bind(bundle);
        }, function (fallbackThunk) {
          return fallbackAccess(obj, key, fallbackThunk).bind(bundle);
        }, function () {
          return optionAccess(obj, key).bind(bundleAsOption);
        }, function (fallbackThunk) {
          return optionDefaultedAccess(obj, key, fallbackThunk).bind(bundleAsOption);
        }, function (baseThunk) {
          var base = baseThunk(obj);
          return fallbackAccess(obj, key, $_7wlbdawajc7tmgej.constant({})).map(function (v) {
            return $_2nfiamwxjc7tmggx.deepMerge(base, v);
          }).bind(bundle);
        });
      }();
    }, function (okey, instantiator) {
      var state = instantiator(obj);
      return $_5x2c31x7jc7tmgjn.value($_8nor52xbjc7tmgkq.wrap(okey, strength(state)));
    });
  };
  var cExtract = function (path, obj, fields, strength) {
    var results = $_682tbuw8jc7tmgdz.map(fields, function (field) {
      return cExtractOne(path, obj, field, strength);
    });
    return $_cnb7vpx6jc7tmgj6.consolidateObj(results, {});
  };
  var value = function (validator) {
    var extract = function (path, strength, val) {
      return validator(val).fold(function (err) {
        return $_7qo3tixcjc7tmgkz.custom(path, err);
      }, $_5x2c31x7jc7tmgjn.value);
    };
    var toString = function () {
      return 'val';
    };
    var toDsl = function () {
      return $_5re10dxfjc7tmgln.typeAdt.itemOf(validator);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var getSetKeys = function (obj) {
    var keys = $_fvv1p1wzjc7tmgh1.keys(obj);
    return $_682tbuw8jc7tmgdz.filter(keys, function (k) {
      return $_ftivuzx5jc7tmgj2.hasKey(obj, k);
    });
  };
  var objOnly = function (fields) {
    var delegate = obj(fields);
    var fieldNames = $_682tbuw8jc7tmgdz.foldr(fields, function (acc, f) {
      return f.fold(function (key) {
        return $_2nfiamwxjc7tmggx.deepMerge(acc, $_ftivuzx5jc7tmgj2.wrap(key, true));
      }, $_7wlbdawajc7tmgej.constant(acc));
    }, {});
    var extract = function (path, strength, o) {
      var keys = $_5ub7o5wyjc7tmggz.isBoolean(o) ? [] : getSetKeys(o);
      var extra = $_682tbuw8jc7tmgdz.filter(keys, function (k) {
        return !$_ftivuzx5jc7tmgj2.hasKey(fieldNames, k);
      });
      return extra.length === 0 ? delegate.extract(path, strength, o) : $_7qo3tixcjc7tmgkz.unsupportedFields(path, extra);
    };
    return {
      extract: extract,
      toString: delegate.toString,
      toDsl: delegate.toDsl
    };
  };
  var obj = function (fields) {
    var extract = function (path, strength, o) {
      return cExtract(path, o, fields, strength);
    };
    var toString = function () {
      var fieldStrings = $_682tbuw8jc7tmgdz.map(fields, function (field) {
        return field.fold(function (key, okey, presence, prop) {
          return key + ' -> ' + prop.toString();
        }, function (okey, instantiator) {
          return 'state(' + okey + ')';
        });
      });
      return 'obj{\n' + fieldStrings.join('\n') + '}';
    };
    var toDsl = function () {
      return $_5re10dxfjc7tmgln.typeAdt.objOf($_682tbuw8jc7tmgdz.map(fields, function (f) {
        return f.fold(function (key, okey, presence, prop) {
          return $_5re10dxfjc7tmgln.fieldAdt.field(key, presence, prop);
        }, function (okey, instantiator) {
          return $_5re10dxfjc7tmgln.fieldAdt.state(okey);
        });
      }));
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var arr = function (prop) {
    var extract = function (path, strength, array) {
      var results = $_682tbuw8jc7tmgdz.map(array, function (a, i) {
        return prop.extract(path.concat(['[' + i + ']']), strength, a);
      });
      return $_cnb7vpx6jc7tmgj6.consolidateArr(results);
    };
    var toString = function () {
      return 'array(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_5re10dxfjc7tmgln.typeAdt.arrOf(prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var setOf = function (validator, prop) {
    var validateKeys = function (path, keys) {
      return arr(value(validator)).extract(path, $_7wlbdawajc7tmgej.identity, keys);
    };
    var extract = function (path, strength, o) {
      var keys = $_fvv1p1wzjc7tmgh1.keys(o);
      return validateKeys(path, keys).bind(function (validKeys) {
        var schema = $_682tbuw8jc7tmgdz.map(validKeys, function (vk) {
          return adt$1.field(vk, vk, $_vby21x2jc7tmgi0.strict(), prop);
        });
        return obj(schema).extract(path, strength, o);
      });
    };
    var toString = function () {
      return 'setOf(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_5re10dxfjc7tmgln.typeAdt.setOf(validator, prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var anyValue = value($_5x2c31x7jc7tmgjn.value);
  var arrOfObj = $_7wlbdawajc7tmgej.compose(arr, obj);
  var $_3rril4x4jc7tmgie = {
    anyValue: $_7wlbdawajc7tmgej.constant(anyValue),
    value: value,
    obj: obj,
    objOnly: objOnly,
    arr: arr,
    setOf: setOf,
    arrOfObj: arrOfObj,
    state: adt$1.state,
    field: adt$1.field,
    output: output,
    snapshot: snapshot
  };

  var strict = function (key) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.strict(), $_3rril4x4jc7tmgie.anyValue());
  };
  var strictOf = function (key, schema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.strict(), schema);
  };
  var strictFunction = function (key) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.strict(), $_3rril4x4jc7tmgie.value(function (f) {
      return $_5ub7o5wyjc7tmggz.isFunction(f) ? $_5x2c31x7jc7tmgjn.value(f) : $_5x2c31x7jc7tmgjn.error('Not a function');
    }));
  };
  var forbid = function (key, message) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.asOption(), $_3rril4x4jc7tmgie.value(function (v) {
      return $_5x2c31x7jc7tmgjn.error('The field: ' + key + ' is forbidden. ' + message);
    }));
  };
  var strictArrayOf = function (key, prop) {
    return strictOf(key, prop);
  };
  var strictObjOf = function (key, objSchema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.strict(), $_3rril4x4jc7tmgie.obj(objSchema));
  };
  var strictArrayOfObj = function (key, objFields) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.strict(), $_3rril4x4jc7tmgie.arrOfObj(objFields));
  };
  var option = function (key) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.asOption(), $_3rril4x4jc7tmgie.anyValue());
  };
  var optionOf = function (key, schema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.asOption(), schema);
  };
  var optionObjOf = function (key, objSchema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.asOption(), $_3rril4x4jc7tmgie.obj(objSchema));
  };
  var optionObjOfOnly = function (key, objSchema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.asOption(), $_3rril4x4jc7tmgie.objOnly(objSchema));
  };
  var defaulted = function (key, fallback) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.defaulted(fallback), $_3rril4x4jc7tmgie.anyValue());
  };
  var defaultedOf = function (key, fallback, schema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.defaulted(fallback), schema);
  };
  var defaultedObjOf = function (key, fallback, objSchema) {
    return $_3rril4x4jc7tmgie.field(key, key, $_vby21x2jc7tmgi0.defaulted(fallback), $_3rril4x4jc7tmgie.obj(objSchema));
  };
  var field = function (key, okey, presence, prop) {
    return $_3rril4x4jc7tmgie.field(key, okey, presence, prop);
  };
  var state = function (okey, instantiator) {
    return $_3rril4x4jc7tmgie.state(okey, instantiator);
  };
  var $_9benqox1jc7tmght = {
    strict: strict,
    strictOf: strictOf,
    strictObjOf: strictObjOf,
    strictArrayOf: strictArrayOf,
    strictArrayOfObj: strictArrayOfObj,
    strictFunction: strictFunction,
    forbid: forbid,
    option: option,
    optionOf: optionOf,
    optionObjOf: optionObjOf,
    optionObjOfOnly: optionObjOfOnly,
    defaulted: defaulted,
    defaultedOf: defaultedOf,
    defaultedObjOf: defaultedObjOf,
    field: field,
    state: state
  };

  var chooseFrom = function (path, strength, input, branches, ch) {
    var fields = $_ftivuzx5jc7tmgj2.readOptFrom(branches, ch);
    return fields.fold(function () {
      return $_7qo3tixcjc7tmgkz.missingBranch(path, branches, ch);
    }, function (fs) {
      return $_3rril4x4jc7tmgie.obj(fs).extract(path.concat(['branch: ' + ch]), strength, input);
    });
  };
  var choose$1 = function (key, branches) {
    var extract = function (path, strength, input) {
      var choice = $_ftivuzx5jc7tmgj2.readOptFrom(input, key);
      return choice.fold(function () {
        return $_7qo3tixcjc7tmgkz.missingKey(path, key);
      }, function (chosen) {
        return chooseFrom(path, strength, input, branches, chosen);
      });
    };
    var toString = function () {
      return 'chooseOn(' + key + '). Possible values: ' + $_fvv1p1wzjc7tmgh1.keys(branches);
    };
    var toDsl = function () {
      return $_5re10dxfjc7tmgln.typeAdt.choiceOf(key, branches);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var $_dow65lxhjc7tmgmc = { choose: choose$1 };

  var anyValue$1 = $_3rril4x4jc7tmgie.value($_5x2c31x7jc7tmgjn.value);
  var arrOfObj$1 = function (objFields) {
    return $_3rril4x4jc7tmgie.arrOfObj(objFields);
  };
  var arrOfVal = function () {
    return $_3rril4x4jc7tmgie.arr(anyValue$1);
  };
  var arrOf = $_3rril4x4jc7tmgie.arr;
  var objOf = $_3rril4x4jc7tmgie.obj;
  var objOfOnly = $_3rril4x4jc7tmgie.objOnly;
  var setOf$1 = $_3rril4x4jc7tmgie.setOf;
  var valueOf = function (validator) {
    return $_3rril4x4jc7tmgie.value(validator);
  };
  var extract = function (label, prop, strength, obj) {
    return prop.extract([label], strength, obj).fold(function (errs) {
      return $_5x2c31x7jc7tmgjn.error({
        input: obj,
        errors: errs
      });
    }, $_5x2c31x7jc7tmgjn.value);
  };
  var asStruct = function (label, prop, obj) {
    return extract(label, prop, $_7wlbdawajc7tmgej.constant, obj);
  };
  var asRaw = function (label, prop, obj) {
    return extract(label, prop, $_7wlbdawajc7tmgej.identity, obj);
  };
  var getOrDie$1 = function (extraction) {
    return extraction.fold(function (errInfo) {
      throw new Error(formatError(errInfo));
    }, $_7wlbdawajc7tmgej.identity);
  };
  var asRawOrDie = function (label, prop, obj) {
    return getOrDie$1(asRaw(label, prop, obj));
  };
  var asStructOrDie = function (label, prop, obj) {
    return getOrDie$1(asStruct(label, prop, obj));
  };
  var formatError = function (errInfo) {
    return 'Errors: \n' + $_9gimh5xdjc7tmgl7.formatErrors(errInfo.errors) + '\n\nInput object: ' + $_9gimh5xdjc7tmgl7.formatObj(errInfo.input);
  };
  var choose = function (key, branches) {
    return $_dow65lxhjc7tmgmc.choose(key, branches);
  };
  var $_c1hr3lxgjc7tmgly = {
    anyValue: $_7wlbdawajc7tmgej.constant(anyValue$1),
    arrOfObj: arrOfObj$1,
    arrOf: arrOf,
    arrOfVal: arrOfVal,
    valueOf: valueOf,
    setOf: setOf$1,
    objOf: objOf,
    objOfOnly: objOfOnly,
    asStruct: asStruct,
    asRaw: asRaw,
    asStructOrDie: asStructOrDie,
    asRawOrDie: asRawOrDie,
    getOrDie: getOrDie$1,
    formatError: formatError,
    choose: choose
  };

  var nu$3 = function (parts) {
    if (!$_ftivuzx5jc7tmgj2.hasKey(parts, 'can') && !$_ftivuzx5jc7tmgj2.hasKey(parts, 'abort') && !$_ftivuzx5jc7tmgj2.hasKey(parts, 'run'))
      throw new Error('EventHandler defined by: ' + $_7meawbxejc7tmglk.stringify(parts, null, 2) + ' does not have can, abort, or run!');
    return $_c1hr3lxgjc7tmgly.asRawOrDie('Extracting event.handler', $_c1hr3lxgjc7tmgly.objOfOnly([
      $_9benqox1jc7tmght.defaulted('can', $_7wlbdawajc7tmgej.constant(true)),
      $_9benqox1jc7tmght.defaulted('abort', $_7wlbdawajc7tmgej.constant(false)),
      $_9benqox1jc7tmght.defaulted('run', $_7wlbdawajc7tmgej.noop)
    ]), parts);
  };
  var all$1 = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_682tbuw8jc7tmgdz.foldl(handlers, function (acc, handler) {
        return acc && f(handler).apply(undefined, args);
      }, true);
    };
  };
  var any = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_682tbuw8jc7tmgdz.foldl(handlers, function (acc, handler) {
        return acc || f(handler).apply(undefined, args);
      }, false);
    };
  };
  var read = function (handler) {
    return $_5ub7o5wyjc7tmggz.isFunction(handler) ? {
      can: $_7wlbdawajc7tmgej.constant(true),
      abort: $_7wlbdawajc7tmgej.constant(false),
      run: handler
    } : handler;
  };
  var fuse = function (handlers) {
    var can = all$1(handlers, function (handler) {
      return handler.can;
    });
    var abort = any(handlers, function (handler) {
      return handler.abort;
    });
    var run = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      $_682tbuw8jc7tmgdz.each(handlers, function (handler) {
        handler.run.apply(undefined, args);
      });
    };
    return nu$3({
      can: can,
      abort: abort,
      run: run
    });
  };
  var $_d0echfx0jc7tmghf = {
    read: read,
    fuse: fuse,
    nu: nu$3
  };

  var derive$1 = $_ftivuzx5jc7tmgj2.wrapAll;
  var abort = function (name, predicate) {
    return {
      key: name,
      value: $_d0echfx0jc7tmghf.nu({ abort: predicate })
    };
  };
  var can = function (name, predicate) {
    return {
      key: name,
      value: $_d0echfx0jc7tmghf.nu({ can: predicate })
    };
  };
  var preventDefault = function (name) {
    return {
      key: name,
      value: $_d0echfx0jc7tmghf.nu({
        run: function (component, simulatedEvent) {
          simulatedEvent.event().prevent();
        }
      })
    };
  };
  var run = function (name, handler) {
    return {
      key: name,
      value: $_d0echfx0jc7tmghf.nu({ run: handler })
    };
  };
  var runActionExtra = function (name, action, extra) {
    return {
      key: name,
      value: $_d0echfx0jc7tmghf.nu({
        run: function (component) {
          action.apply(undefined, [component].concat(extra));
        }
      })
    };
  };
  var runOnName = function (name) {
    return function (handler) {
      return run(name, handler);
    };
  };
  var runOnSourceName = function (name) {
    return function (handler) {
      return {
        key: name,
        value: $_d0echfx0jc7tmghf.nu({
          run: function (component, simulatedEvent) {
            if ($_8yz0lww6jc7tmgdm.isSource(component, simulatedEvent))
              handler(component, simulatedEvent);
          }
        })
      };
    };
  };
  var redirectToUid = function (name, uid) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByUid(uid).each(function (redirectee) {
        $_7zx0zrwujc7tmgge.dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent);
      });
    });
  };
  var redirectToPart = function (name, detail, partName) {
    var uid = detail.partUids()[partName];
    return redirectToUid(name, uid);
  };
  var runWithTarget = function (name, f) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByDom(simulatedEvent.event().target()).each(function (target) {
        f(component, target, simulatedEvent);
      });
    });
  };
  var cutter = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.cut();
    });
  };
  var stopper = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.stop();
    });
  };
  var $_3oclftw5jc7tmgdb = {
    derive: derive$1,
    run: run,
    preventDefault: preventDefault,
    runActionExtra: runActionExtra,
    runOnAttached: runOnSourceName($_66ekuowvjc7tmggn.attachedToDom()),
    runOnDetached: runOnSourceName($_66ekuowvjc7tmggn.detachedFromDom()),
    runOnInit: runOnSourceName($_66ekuowvjc7tmggn.systemInit()),
    runOnExecute: runOnName($_66ekuowvjc7tmggn.execute()),
    redirectToUid: redirectToUid,
    redirectToPart: redirectToPart,
    runWithTarget: runWithTarget,
    abort: abort,
    can: can,
    cutter: cutter,
    stopper: stopper
  };

  var markAsBehaviourApi = function (f, apiName, apiFunction) {
    return f;
  };
  var markAsExtraApi = function (f, extraName) {
    return f;
  };
  var markAsSketchApi = function (f, apiFunction) {
    return f;
  };
  var getAnnotation = $_7db13lw9jc7tmgee.none;
  var $_10ceiixijc7tmgmj = {
    markAsBehaviourApi: markAsBehaviourApi,
    markAsExtraApi: markAsExtraApi,
    markAsSketchApi: markAsSketchApi,
    getAnnotation: getAnnotation
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
      $_682tbuw8jc7tmgdz.each(fields, function (name, i) {
        struct[name] = $_7wlbdawajc7tmgej.constant(values[i]);
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
    if (!$_5ub7o5wyjc7tmggz.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_682tbuw8jc7tmgdz.each(array, function (a) {
      if (!$_5ub7o5wyjc7tmggz.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_682tbuw8jc7tmgdz.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_4z9i47xojc7tmgnp = {
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
    $_4z9i47xojc7tmgnp.validateStrArr('required', required);
    $_4z9i47xojc7tmgnp.validateStrArr('optional', optional);
    $_4z9i47xojc7tmgnp.checkDupes(everything);
    return function (obj) {
      var keys = $_fvv1p1wzjc7tmgh1.keys(obj);
      var allReqd = $_682tbuw8jc7tmgdz.forall(required, function (req) {
        return $_682tbuw8jc7tmgdz.contains(keys, req);
      });
      if (!allReqd)
        $_4z9i47xojc7tmgnp.reqMessage(required, keys);
      var unsupported = $_682tbuw8jc7tmgdz.filter(keys, function (key) {
        return !$_682tbuw8jc7tmgdz.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_4z9i47xojc7tmgnp.unsuppMessage(unsupported);
      var r = {};
      $_682tbuw8jc7tmgdz.each(required, function (req) {
        r[req] = $_7wlbdawajc7tmgej.constant(obj[req]);
      });
      $_682tbuw8jc7tmgdz.each(optional, function (opt) {
        r[opt] = $_7wlbdawajc7tmgej.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_7db13lw9jc7tmgee.some(obj[opt]) : $_7db13lw9jc7tmgee.none());
      });
      return r;
    };
  };

  var $_3we77gxljc7tmgnf = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var nu$6 = $_3we77gxljc7tmgnf.immutableBag(['tag'], [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'domChildren',
    'defChildren'
  ]);
  var defToStr = function (defn) {
    var raw = defToRaw(defn);
    return $_7meawbxejc7tmglk.stringify(raw, null, 2);
  };
  var defToRaw = function (defn) {
    return {
      tag: defn.tag(),
      classes: defn.classes().getOr([]),
      attributes: defn.attributes().getOr({}),
      styles: defn.styles().getOr({}),
      value: defn.value().getOr('<none>'),
      innerHtml: defn.innerHtml().getOr('<none>'),
      defChildren: defn.defChildren().getOr('<none>'),
      domChildren: defn.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var $_ds2lukxkjc7tmgn9 = {
    nu: nu$6,
    defToStr: defToStr,
    defToRaw: defToRaw
  };

  var fields = [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'defChildren',
    'domChildren'
  ];
  var nu$5 = $_3we77gxljc7tmgnf.immutableBag([], fields);
  var derive$2 = function (settings) {
    var r = {};
    var keys = $_fvv1p1wzjc7tmgh1.keys(settings);
    $_682tbuw8jc7tmgdz.each(keys, function (key) {
      settings[key].each(function (v) {
        r[key] = v;
      });
    });
    return nu$5(r);
  };
  var modToStr = function (mod) {
    var raw = modToRaw(mod);
    return $_7meawbxejc7tmglk.stringify(raw, null, 2);
  };
  var modToRaw = function (mod) {
    return {
      classes: mod.classes().getOr('<none>'),
      attributes: mod.attributes().getOr('<none>'),
      styles: mod.styles().getOr('<none>'),
      value: mod.value().getOr('<none>'),
      innerHtml: mod.innerHtml().getOr('<none>'),
      defChildren: mod.defChildren().getOr('<none>'),
      domChildren: mod.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var clashingOptArrays = function (key, oArr1, oArr2) {
    return oArr1.fold(function () {
      return oArr2.fold(function () {
        return {};
      }, function (arr2) {
        return $_ftivuzx5jc7tmgj2.wrap(key, arr2);
      });
    }, function (arr1) {
      return oArr2.fold(function () {
        return $_ftivuzx5jc7tmgj2.wrap(key, arr1);
      }, function (arr2) {
        return $_ftivuzx5jc7tmgj2.wrap(key, arr2);
      });
    });
  };
  var merge$1 = function (defnA, mod) {
    var raw = $_2nfiamwxjc7tmggx.deepMerge({
      tag: defnA.tag(),
      classes: mod.classes().getOr([]).concat(defnA.classes().getOr([])),
      attributes: $_2nfiamwxjc7tmggx.merge(defnA.attributes().getOr({}), mod.attributes().getOr({})),
      styles: $_2nfiamwxjc7tmggx.merge(defnA.styles().getOr({}), mod.styles().getOr({}))
    }, mod.innerHtml().or(defnA.innerHtml()).map(function (innerHtml) {
      return $_ftivuzx5jc7tmgj2.wrap('innerHtml', innerHtml);
    }).getOr({}), clashingOptArrays('domChildren', mod.domChildren(), defnA.domChildren()), clashingOptArrays('defChildren', mod.defChildren(), defnA.defChildren()), mod.value().or(defnA.value()).map(function (value) {
      return $_ftivuzx5jc7tmgj2.wrap('value', value);
    }).getOr({}));
    return $_ds2lukxkjc7tmgn9.nu(raw);
  };
  var $_f402ywxjjc7tmgmr = {
    nu: nu$5,
    derive: derive$2,
    merge: merge$1,
    modToStr: modToStr,
    modToRaw: modToRaw
  };

  var executeEvent = function (bConfig, bState, executor) {
    return $_3oclftw5jc7tmgdb.runOnExecute(function (component) {
      executor(component, bConfig, bState);
    });
  };
  var loadEvent = function (bConfig, bState, f) {
    return $_3oclftw5jc7tmgdb.runOnInit(function (component, simulatedEvent) {
      f(component, bConfig, bState);
    });
  };
  var create$1 = function (schema, name, active, apis, extra, state) {
    var configSchema = $_c1hr3lxgjc7tmgly.objOfOnly(schema);
    var schemaSchema = $_9benqox1jc7tmght.optionObjOf(name, [$_9benqox1jc7tmght.optionObjOfOnly('config', schema)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var createModes$1 = function (modes, name, active, apis, extra, state) {
    var configSchema = modes;
    var schemaSchema = $_9benqox1jc7tmght.optionObjOf(name, [$_9benqox1jc7tmght.optionOf('config', modes)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var wrapApi = function (bName, apiFunction, apiName) {
    var f = function (component) {
      var args = arguments;
      return component.config({ name: $_7wlbdawajc7tmgej.constant(bName) }).fold(function () {
        throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
      }, function (info) {
        var rest = Array.prototype.slice.call(args, 1);
        return apiFunction.apply(undefined, [
          component,
          info.config,
          info.state
        ].concat(rest));
      });
    };
    return $_10ceiixijc7tmgmj.markAsBehaviourApi(f, apiName, apiFunction);
  };
  var revokeBehaviour = function (name) {
    return {
      key: name,
      value: undefined
    };
  };
  var doCreate = function (configSchema, schemaSchema, name, active, apis, extra, state) {
    var getConfig = function (info) {
      return $_ftivuzx5jc7tmgj2.hasKey(info, name) ? info[name]() : $_7db13lw9jc7tmgee.none();
    };
    var wrappedApis = $_fvv1p1wzjc7tmgh1.map(apis, function (apiF, apiName) {
      return wrapApi(name, apiF, apiName);
    });
    var wrappedExtra = $_fvv1p1wzjc7tmgh1.map(extra, function (extraF, extraName) {
      return $_10ceiixijc7tmgmj.markAsExtraApi(extraF, extraName);
    });
    var me = $_2nfiamwxjc7tmggx.deepMerge(wrappedExtra, wrappedApis, {
      revoke: $_7wlbdawajc7tmgej.curry(revokeBehaviour, name),
      config: function (spec) {
        var prepared = $_c1hr3lxgjc7tmgly.asStructOrDie(name + '-config', configSchema, spec);
        return {
          key: name,
          value: {
            config: prepared,
            me: me,
            configAsRaw: $_gdmqd6wgjc7tmgf1.cached(function () {
              return $_c1hr3lxgjc7tmgly.asRawOrDie(name + '-config', configSchema, spec);
            }),
            initialConfig: spec,
            state: state
          }
        };
      },
      schema: function () {
        return schemaSchema;
      },
      exhibit: function (info, base) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_ftivuzx5jc7tmgj2.readOptFrom(active, 'exhibit').map(function (exhibitor) {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr($_f402ywxjjc7tmgmr.nu({}));
      },
      name: function () {
        return name;
      },
      handlers: function (info) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_ftivuzx5jc7tmgj2.readOptFrom(active, 'events').map(function (events) {
            return events(behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr({});
      }
    });
    return me;
  };
  var $_ivrpyw4jc7tmgco = {
    executeEvent: executeEvent,
    loadEvent: loadEvent,
    create: create$1,
    createModes: createModes$1
  };

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_5ub7o5wyjc7tmggz.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_4z9i47xojc7tmgnp.validateStrArr('required', required);
    $_4z9i47xojc7tmgnp.checkDupes(required);
    return function (obj) {
      var keys = $_fvv1p1wzjc7tmgh1.keys(obj);
      var allReqd = $_682tbuw8jc7tmgdz.forall(required, function (req) {
        return $_682tbuw8jc7tmgdz.contains(keys, req);
      });
      if (!allReqd)
        $_4z9i47xojc7tmgnp.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_682tbuw8jc7tmgdz.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_4z9i47xojc7tmgnp.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_682tbuw8jc7tmgdz.filter(keys, function (key) {
      return !$_682tbuw8jc7tmgdz.contains(required, key);
    });
    if (unsupported.length > 0)
      $_4z9i47xojc7tmgnp.unsuppMessage(unsupported);
  };
  var allowExtra = $_7wlbdawajc7tmgej.noop;
  var $_ax6axixrjc7tmgo6 = {
    exactly: $_7wlbdawajc7tmgej.curry(base, handleExact),
    ensure: $_7wlbdawajc7tmgej.curry(base, allowExtra),
    ensureWith: $_7wlbdawajc7tmgej.curry(baseWith, allowExtra)
  };

  var BehaviourState = $_ax6axixrjc7tmgo6.ensure(['readState']);

  var init = function () {
    return BehaviourState({
      readState: function () {
        return 'No State required';
      }
    });
  };
  var $_46qvupxpjc7tmgnx = { init: init };

  var derive = function (capabilities) {
    return $_ftivuzx5jc7tmgj2.wrapAll(capabilities);
  };
  var simpleSchema = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strict('fields'),
    $_9benqox1jc7tmght.strict('name'),
    $_9benqox1jc7tmght.defaulted('active', {}),
    $_9benqox1jc7tmght.defaulted('apis', {}),
    $_9benqox1jc7tmght.defaulted('extra', {}),
    $_9benqox1jc7tmght.defaulted('state', $_46qvupxpjc7tmgnx)
  ]);
  var create = function (data) {
    var value = $_c1hr3lxgjc7tmgly.asRawOrDie('Creating behaviour: ' + data.name, simpleSchema, data);
    return $_ivrpyw4jc7tmgco.create(value.fields, value.name, value.active, value.apis, value.extra, value.state);
  };
  var modeSchema = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strict('branchKey'),
    $_9benqox1jc7tmght.strict('branches'),
    $_9benqox1jc7tmght.strict('name'),
    $_9benqox1jc7tmght.defaulted('active', {}),
    $_9benqox1jc7tmght.defaulted('apis', {}),
    $_9benqox1jc7tmght.defaulted('extra', {}),
    $_9benqox1jc7tmght.defaulted('state', $_46qvupxpjc7tmgnx)
  ]);
  var createModes = function (data) {
    var value = $_c1hr3lxgjc7tmgly.asRawOrDie('Creating behaviour: ' + data.name, modeSchema, data);
    return $_ivrpyw4jc7tmgco.createModes($_c1hr3lxgjc7tmgly.choose(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
  };
  var $_567rv0w3jc7tmgc6 = {
    derive: derive,
    revoke: $_7wlbdawajc7tmgej.constant(undefined),
    noActive: $_7wlbdawajc7tmgej.constant({}),
    noApis: $_7wlbdawajc7tmgej.constant({}),
    noExtra: $_7wlbdawajc7tmgej.constant({}),
    noState: $_7wlbdawajc7tmgej.constant($_46qvupxpjc7tmgnx),
    create: create,
    createModes: createModes
  };

  var Toggler = function (turnOff, turnOn, initial) {
    var active = initial || false;
    var on = function () {
      turnOn();
      active = true;
    };
    var off = function () {
      turnOff();
      active = false;
    };
    var toggle = function () {
      var f = active ? off : on;
      f();
    };
    var isOn = function () {
      return active;
    };
    return {
      on: on,
      off: off,
      toggle: toggle,
      isOn: isOn
    };
  };

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value$2 = function (element) {
    return element.dom().nodeValue;
  };
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_41l9lxwtjc7tmgga.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_41l9lxwtjc7tmgga.ELEMENT);
  var isText = isType$1($_41l9lxwtjc7tmgga.TEXT);
  var isDocument = isType$1($_41l9lxwtjc7tmgga.DOCUMENT);
  var $_e44ar2xwjc7tmgp4 = {
    name: name,
    type: type,
    value: value$2,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_5ub7o5wyjc7tmggz.isString(value) || $_5ub7o5wyjc7tmggz.isBoolean(value) || $_5ub7o5wyjc7tmggz.isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set = function (element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var setAll = function (element, attrs) {
    var dom = element.dom();
    $_fvv1p1wzjc7tmgh1.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has$1 = function (element, key) {
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
    return $_682tbuw8jc7tmgdz.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has$1(source, attr) && !has$1(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_e44ar2xwjc7tmgp4.isElement(source) || !$_e44ar2xwjc7tmgp4.isElement(destination))
      return;
    $_682tbuw8jc7tmgdz.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_gh0zlbxvjc7tmgol = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has$1,
    remove: remove$1,
    hasNone: hasNone,
    transfer: transfer
  };

  var read$1 = function (element, attr) {
    var value = $_gh0zlbxvjc7tmgol.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add$2 = function (element, attr, id) {
    var old = read$1(element, attr);
    var nu = old.concat([id]);
    $_gh0zlbxvjc7tmgol.set(element, attr, nu.join(' '));
  };
  var remove$3 = function (element, attr, id) {
    var nu = $_682tbuw8jc7tmgdz.filter(read$1(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_gh0zlbxvjc7tmgol.set(element, attr, nu.join(' '));
    else
      $_gh0zlbxvjc7tmgol.remove(element, attr);
  };
  var $_f7jxz2xyjc7tmgpe = {
    read: read$1,
    add: add$2,
    remove: remove$3
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$1 = function (element) {
    return $_f7jxz2xyjc7tmgpe.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_f7jxz2xyjc7tmgpe.add(element, 'class', clazz);
  };
  var remove$2 = function (element, clazz) {
    return $_f7jxz2xyjc7tmgpe.remove(element, 'class', clazz);
  };
  var toggle$1 = function (element, clazz) {
    if ($_682tbuw8jc7tmgdz.contains(get$1(element), clazz)) {
      remove$2(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_2575jcxxjc7tmgp8 = {
    get: get$1,
    add: add$1,
    remove: remove$2,
    toggle: toggle$1,
    supports: supports
  };

  var add = function (element, clazz) {
    if ($_2575jcxxjc7tmgp8.supports(element))
      element.dom().classList.add(clazz);
    else
      $_2575jcxxjc7tmgp8.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_2575jcxxjc7tmgp8.supports(element) ? element.dom().classList : $_2575jcxxjc7tmgp8.get(element);
    if (classList.length === 0) {
      $_gh0zlbxvjc7tmgol.remove(element, 'class');
    }
  };
  var remove = function (element, clazz) {
    if ($_2575jcxxjc7tmgp8.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_2575jcxxjc7tmgp8.remove(element, clazz);
    cleanClass(element);
  };
  var toggle = function (element, clazz) {
    return $_2575jcxxjc7tmgp8.supports(element) ? element.dom().classList.toggle(clazz) : $_2575jcxxjc7tmgp8.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_2575jcxxjc7tmgp8.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_2575jcxxjc7tmgp8.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_2575jcxxjc7tmgp8.add(element, clazz);
    };
    return Toggler(off, on, has(element, clazz));
  };
  var has = function (element, clazz) {
    return $_2575jcxxjc7tmgp8.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_7lq4x8xtjc7tmgod = {
    add: add,
    remove: remove,
    toggle: toggle,
    toggler: toggler,
    has: has
  };

  var swap = function (element, addCls, removeCls) {
    $_7lq4x8xtjc7tmgod.remove(element, removeCls);
    $_7lq4x8xtjc7tmgod.add(element, addCls);
  };
  var toAlpha = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.alpha(), swapConfig.omega());
  };
  var toOmega = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.omega(), swapConfig.alpha());
  };
  var clear = function (component, swapConfig, swapState) {
    $_7lq4x8xtjc7tmgod.remove(component.element(), swapConfig.alpha());
    $_7lq4x8xtjc7tmgod.remove(component.element(), swapConfig.omega());
  };
  var isAlpha = function (component, swapConfig, swapState) {
    return $_7lq4x8xtjc7tmgod.has(component.element(), swapConfig.alpha());
  };
  var isOmega = function (component, swapConfig, swapState) {
    return $_7lq4x8xtjc7tmgod.has(component.element(), swapConfig.omega());
  };
  var $_bbgi4oxsjc7tmgo9 = {
    toAlpha: toAlpha,
    toOmega: toOmega,
    isAlpha: isAlpha,
    isOmega: isOmega,
    clear: clear
  };

  var SwapSchema = [
    $_9benqox1jc7tmght.strict('alpha'),
    $_9benqox1jc7tmght.strict('omega')
  ];

  var Swapping = $_567rv0w3jc7tmgc6.create({
    fields: SwapSchema,
    name: 'swapping',
    apis: $_bbgi4oxsjc7tmgo9
  });

  var toArray = function (target, f) {
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
  var $_6dvrszy3jc7tmgqg = { toArray: toArray };

  var owner = function (element) {
    return $_19g44bwsjc7tmgg6.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_19g44bwsjc7tmgg6.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_19g44bwsjc7tmgg6.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_7db13lw9jc7tmgee.from(dom.parentNode).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_682tbuw8jc7tmgdz.findIndex(kin, function (elem) {
        return $_b6kzgmw7jc7tmgdr.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_5ub7o5wyjc7tmggz.isFunction(isRoot) ? isRoot : $_7wlbdawajc7tmgej.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_19g44bwsjc7tmgg6.fromDom(rawParent);
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
      return $_682tbuw8jc7tmgdz.filter(elements, function (x) {
        return !$_b6kzgmw7jc7tmgdr.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_7db13lw9jc7tmgee.from(dom.offsetParent).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_7db13lw9jc7tmgee.from(dom.previousSibling).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_7db13lw9jc7tmgee.from(dom.nextSibling).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var prevSiblings = function (element) {
    return $_682tbuw8jc7tmgdz.reverse($_6dvrszy3jc7tmgqg.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_6dvrszy3jc7tmgqg.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_682tbuw8jc7tmgdz.map(dom.childNodes, $_19g44bwsjc7tmgg6.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_7db13lw9jc7tmgee.from(children[index]).map($_19g44bwsjc7tmgg6.fromDom);
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
  var spot = $_3we77gxljc7tmgnf.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_bvq6n5y2jc7tmgq7 = {
    owner: owner,
    defaultView: defaultView,
    documentElement: documentElement,
    parent: parent,
    findIndex: findIndex$1,
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

  var before = function (marker, element) {
    var parent = $_bvq6n5y2jc7tmgq7.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_bvq6n5y2jc7tmgq7.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_bvq6n5y2jc7tmgq7.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_bvq6n5y2jc7tmgq7.firstChild(parent);
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
    $_bvq6n5y2jc7tmgq7.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap$2 = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_972741y1jc7tmgq3 = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap$2
  };

  var before$1 = function (marker, elements) {
    $_682tbuw8jc7tmgdz.each(elements, function (x) {
      $_972741y1jc7tmgq3.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_682tbuw8jc7tmgdz.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_972741y1jc7tmgq3.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_682tbuw8jc7tmgdz.each(elements.slice().reverse(), function (x) {
      $_972741y1jc7tmgq3.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_682tbuw8jc7tmgdz.each(elements, function (x) {
      $_972741y1jc7tmgq3.append(parent, x);
    });
  };
  var $_gieeo8y5jc7tmgqo = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_682tbuw8jc7tmgdz.each($_bvq6n5y2jc7tmgq7.children(element), function (rogue) {
      remove$4(rogue);
    });
  };
  var remove$4 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_bvq6n5y2jc7tmgq7.children(wrapper);
    if (children.length > 0)
      $_gieeo8y5jc7tmgqo.before(wrapper, children);
    remove$4(wrapper);
  };
  var $_3bj1g6y4jc7tmgqi = {
    empty: empty,
    remove: remove$4,
    unwrap: unwrap
  };

  var inBody = function (element) {
    var dom = $_e44ar2xwjc7tmgp4.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_gdmqd6wgjc7tmgf1.cached(function () {
    return getBody($_19g44bwsjc7tmgg6.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_19g44bwsjc7tmgg6.fromDom(body);
  };
  var $_5q4xj9y6jc7tmgqt = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var fireDetaching = function (component) {
    $_7zx0zrwujc7tmgge.emit(component, $_66ekuowvjc7tmggn.detachedFromDom());
    var children = component.components();
    $_682tbuw8jc7tmgdz.each(children, fireDetaching);
  };
  var fireAttaching = function (component) {
    var children = component.components();
    $_682tbuw8jc7tmgdz.each(children, fireAttaching);
    $_7zx0zrwujc7tmgge.emit(component, $_66ekuowvjc7tmggn.attachedToDom());
  };
  var attach = function (parent, child) {
    attachWith(parent, child, $_972741y1jc7tmgq3.append);
  };
  var attachWith = function (parent, child, insertion) {
    parent.getSystem().addToWorld(child);
    insertion(parent.element(), child.element());
    if ($_5q4xj9y6jc7tmgqt.inBody(parent.element()))
      fireAttaching(child);
    parent.syncComponents();
  };
  var doDetach = function (component) {
    fireDetaching(component);
    $_3bj1g6y4jc7tmgqi.remove(component.element());
    component.getSystem().removeFromWorld(component);
  };
  var detach = function (component) {
    var parent = $_bvq6n5y2jc7tmgq7.parent(component.element()).bind(function (p) {
      return component.getSystem().getByDom(p).fold($_7db13lw9jc7tmgee.none, $_7db13lw9jc7tmgee.some);
    });
    doDetach(component);
    parent.each(function (p) {
      p.syncComponents();
    });
  };
  var detachChildren = function (component) {
    var subs = component.components();
    $_682tbuw8jc7tmgdz.each(subs, doDetach);
    $_3bj1g6y4jc7tmgqi.empty(component.element());
    component.syncComponents();
  };
  var attachSystem = function (element, guiSystem) {
    $_972741y1jc7tmgq3.append(element, guiSystem.element());
    var children = $_bvq6n5y2jc7tmgq7.children(guiSystem.element());
    $_682tbuw8jc7tmgdz.each(children, function (child) {
      guiSystem.getByDom(child).each(fireAttaching);
    });
  };
  var detachSystem = function (guiSystem) {
    var children = $_bvq6n5y2jc7tmgq7.children(guiSystem.element());
    $_682tbuw8jc7tmgdz.each(children, function (child) {
      guiSystem.getByDom(child).each(fireDetaching);
    });
    $_3bj1g6y4jc7tmgqi.remove(guiSystem.element());
  };
  var $_4yvg8yy0jc7tmgpq = {
    attach: attach,
    attachWith: attachWith,
    detach: detach,
    detachChildren: detachChildren,
    attachSystem: attachSystem,
    detachSystem: detachSystem
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_bvq6n5y2jc7tmgq7.children($_19g44bwsjc7tmgg6.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_682tbuw8jc7tmgdz.map(tags, function (x) {
      return $_19g44bwsjc7tmgg6.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_682tbuw8jc7tmgdz.map(texts, function (x) {
      return $_19g44bwsjc7tmgg6.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_682tbuw8jc7tmgdz.map(nodes, $_19g44bwsjc7tmgg6.fromDom);
  };
  var $_9z1dd8ybjc7tmgrt = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var get$2 = function (element) {
    return element.dom().innerHTML;
  };
  var set$1 = function (element, content) {
    var owner = $_bvq6n5y2jc7tmgq7.owner(element);
    var docDom = owner.dom();
    var fragment = $_19g44bwsjc7tmgg6.fromDom(docDom.createDocumentFragment());
    var contentElements = $_9z1dd8ybjc7tmgrt.fromHtml(content, docDom);
    $_gieeo8y5jc7tmgqo.append(fragment, contentElements);
    $_3bj1g6y4jc7tmgqi.empty(element);
    $_972741y1jc7tmgq3.append(element, fragment);
  };
  var getOuter = function (element) {
    var container = $_19g44bwsjc7tmgg6.fromTag('div');
    var clone = $_19g44bwsjc7tmgg6.fromDom(element.dom().cloneNode(true));
    $_972741y1jc7tmgq3.append(container, clone);
    return get$2(container);
  };
  var $_fi4lz2yajc7tmgrr = {
    get: get$2,
    set: set$1,
    getOuter: getOuter
  };

  var clone$1 = function (original, deep) {
    return $_19g44bwsjc7tmgg6.fromDom(original.dom().cloneNode(deep));
  };
  var shallow$1 = function (original) {
    return clone$1(original, false);
  };
  var deep$1 = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_19g44bwsjc7tmgg6.fromTag(tag);
    var attributes = $_gh0zlbxvjc7tmgol.clone(original);
    $_gh0zlbxvjc7tmgol.setAll(nu, attributes);
    return nu;
  };
  var copy = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_bvq6n5y2jc7tmgq7.children(deep$1(original));
    $_gieeo8y5jc7tmgqo.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_972741y1jc7tmgq3.before(original, nu);
    var children = $_bvq6n5y2jc7tmgq7.children(original);
    $_gieeo8y5jc7tmgqo.append(nu, children);
    $_3bj1g6y4jc7tmgqi.remove(original);
    return nu;
  };
  var $_1bn2h5ycjc7tmgrz = {
    shallow: shallow$1,
    shallowAs: shallowAs,
    deep: deep$1,
    copy: copy,
    mutate: mutate
  };

  var getHtml = function (element) {
    var clone = $_1bn2h5ycjc7tmgrz.shallow(element);
    return $_fi4lz2yajc7tmgrr.getOuter(clone);
  };
  var $_3cgjwzy9jc7tmgrm = { getHtml: getHtml };

  var element = function (elem) {
    return $_3cgjwzy9jc7tmgrm.getHtml(elem);
  };
  var $_5d0nway8jc7tmgrj = { element: element };

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
    return $_7db13lw9jc7tmgee.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_7db13lw9jc7tmgee.none();
      }
    }
    return $_7db13lw9jc7tmgee.some(f.apply(null, r));
  };
  var $_eidt8kydjc7tmgsa = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var unknown$3 = 'unknown';
  var debugging = true;
  var CHROME_INSPECTOR_GLOBAL = '__CHROME_INSPECTOR_CONNECTION_TO_ALLOY__';
  var eventsMonitored = [];
  var path$1 = [
    'alloy/data/Fields',
    'alloy/debugging/Debugging'
  ];
  var getTrace = function () {
    if (debugging === false)
      return unknown$3;
    var err = new Error();
    if (err.stack !== undefined) {
      var lines = err.stack.split('\n');
      return $_682tbuw8jc7tmgdz.find(lines, function (line) {
        return line.indexOf('alloy') > 0 && !$_682tbuw8jc7tmgdz.exists(path$1, function (p) {
          return line.indexOf(p) > -1;
        });
      }).getOr(unknown$3);
    } else {
      return unknown$3;
    }
  };
  var logHandler = function (label, handlerName, trace) {
  };
  var ignoreEvent = {
    logEventCut: $_7wlbdawajc7tmgej.noop,
    logEventStopped: $_7wlbdawajc7tmgej.noop,
    logNoParent: $_7wlbdawajc7tmgej.noop,
    logEventNoHandlers: $_7wlbdawajc7tmgej.noop,
    logEventResponse: $_7wlbdawajc7tmgej.noop,
    write: $_7wlbdawajc7tmgej.noop
  };
  var monitorEvent = function (eventName, initialTarget, f) {
    var logger = debugging && (eventsMonitored === '*' || $_682tbuw8jc7tmgdz.contains(eventsMonitored, eventName)) ? function () {
      var sequence = [];
      return {
        logEventCut: function (name, target, purpose) {
          sequence.push({
            outcome: 'cut',
            target: target,
            purpose: purpose
          });
        },
        logEventStopped: function (name, target, purpose) {
          sequence.push({
            outcome: 'stopped',
            target: target,
            purpose: purpose
          });
        },
        logNoParent: function (name, target, purpose) {
          sequence.push({
            outcome: 'no-parent',
            target: target,
            purpose: purpose
          });
        },
        logEventNoHandlers: function (name, target) {
          sequence.push({
            outcome: 'no-handlers-left',
            target: target
          });
        },
        logEventResponse: function (name, target, purpose) {
          sequence.push({
            outcome: 'response',
            purpose: purpose,
            target: target
          });
        },
        write: function () {
          if ($_682tbuw8jc7tmgdz.contains([
              'mousemove',
              'mouseover',
              'mouseout',
              $_66ekuowvjc7tmggn.systemInit()
            ], eventName))
            return;
          console.log(eventName, {
            event: eventName,
            target: initialTarget.dom(),
            sequence: $_682tbuw8jc7tmgdz.map(sequence, function (s) {
              if (!$_682tbuw8jc7tmgdz.contains([
                  'cut',
                  'stopped',
                  'response'
                ], s.outcome))
                return s.outcome;
              else
                return '{' + s.purpose + '} ' + s.outcome + ' at (' + $_5d0nway8jc7tmgrj.element(s.target) + ')';
            })
          });
        }
      };
    }() : ignoreEvent;
    var output = f(logger);
    logger.write();
    return output;
  };
  var inspectorInfo = function (comp) {
    var go = function (c) {
      var cSpec = c.spec();
      return {
        '(original.spec)': cSpec,
        '(dom.ref)': c.element().dom(),
        '(element)': $_5d0nway8jc7tmgrj.element(c.element()),
        '(initComponents)': $_682tbuw8jc7tmgdz.map(cSpec.components !== undefined ? cSpec.components : [], go),
        '(components)': $_682tbuw8jc7tmgdz.map(c.components(), go),
        '(bound.events)': $_fvv1p1wzjc7tmgh1.mapToArray(c.events(), function (v, k) {
          return [k];
        }).join(', '),
        '(behaviours)': cSpec.behaviours !== undefined ? $_fvv1p1wzjc7tmgh1.map(cSpec.behaviours, function (v, k) {
          return v === undefined ? '--revoked--' : {
            config: v.configAsRaw(),
            'original-config': v.initialConfig,
            state: c.readState(k)
          };
        }) : 'none'
      };
    };
    return go(comp);
  };
  var getOrInitConnection = function () {
    if (window[CHROME_INSPECTOR_GLOBAL] !== undefined)
      return window[CHROME_INSPECTOR_GLOBAL];
    else {
      window[CHROME_INSPECTOR_GLOBAL] = {
        systems: {},
        lookup: function (uid) {
          var systems = window[CHROME_INSPECTOR_GLOBAL].systems;
          var connections = $_fvv1p1wzjc7tmgh1.keys(systems);
          return $_eidt8kydjc7tmgsa.findMap(connections, function (conn) {
            var connGui = systems[conn];
            return connGui.getByUid(uid).toOption().map(function (comp) {
              return $_ftivuzx5jc7tmgj2.wrap($_5d0nway8jc7tmgrj.element(comp.element()), inspectorInfo(comp));
            });
          });
        }
      };
      return window[CHROME_INSPECTOR_GLOBAL];
    }
  };
  var registerInspector = function (name, gui) {
    var connection = getOrInitConnection();
    connection.systems[name] = gui;
  };
  var $_dszcp6y7jc7tmgqz = {
    logHandler: logHandler,
    noLogger: $_7wlbdawajc7tmgej.constant(ignoreEvent),
    getTrace: getTrace,
    monitorEvent: monitorEvent,
    isDebugging: $_7wlbdawajc7tmgej.constant(debugging),
    registerInspector: registerInspector
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

  var ClosestOrAncestor = function (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_7db13lw9jc7tmgee.some(scope) : $_5ub7o5wyjc7tmggz.isFunction(isRoot) && isRoot(scope) ? $_7db13lw9jc7tmgee.none() : ancestor(scope, a, isRoot);
  };

  var first$1 = function (predicate) {
    return descendant$1($_5q4xj9y6jc7tmgqt.body(), predicate);
  };
  var ancestor$1 = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_5ub7o5wyjc7tmggz.isFunction(isRoot) ? isRoot : $_7wlbdawajc7tmgej.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_19g44bwsjc7tmgg6.fromDom(element);
      if (predicate(el))
        return $_7db13lw9jc7tmgee.some(el);
      else if (stop(el))
        break;
    }
    return $_7db13lw9jc7tmgee.none();
  };
  var closest$1 = function (scope, predicate, isRoot) {
    var is = function (scope) {
      return predicate(scope);
    };
    return ClosestOrAncestor(is, ancestor$1, scope, predicate, isRoot);
  };
  var sibling$1 = function (scope, predicate) {
    var element = scope.dom();
    if (!element.parentNode)
      return $_7db13lw9jc7tmgee.none();
    return child$2($_19g44bwsjc7tmgg6.fromDom(element.parentNode), function (x) {
      return !$_b6kzgmw7jc7tmgdr.eq(scope, x) && predicate(x);
    });
  };
  var child$2 = function (scope, predicate) {
    var result = $_682tbuw8jc7tmgdz.find(scope.dom().childNodes, $_7wlbdawajc7tmgej.compose(predicate, $_19g44bwsjc7tmgg6.fromDom));
    return result.map($_19g44bwsjc7tmgg6.fromDom);
  };
  var descendant$1 = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_19g44bwsjc7tmgg6.fromDom(element.childNodes[i])))
          return $_7db13lw9jc7tmgee.some($_19g44bwsjc7tmgg6.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_7db13lw9jc7tmgee.none();
    };
    return descend(scope.dom());
  };
  var $_63he74yhjc7tmgsm = {
    first: first$1,
    ancestor: ancestor$1,
    closest: closest$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1
  };

  var any$1 = function (predicate) {
    return $_63he74yhjc7tmgsm.first(predicate).isSome();
  };
  var ancestor = function (scope, predicate, isRoot) {
    return $_63he74yhjc7tmgsm.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest = function (scope, predicate, isRoot) {
    return $_63he74yhjc7tmgsm.closest(scope, predicate, isRoot).isSome();
  };
  var sibling = function (scope, predicate) {
    return $_63he74yhjc7tmgsm.sibling(scope, predicate).isSome();
  };
  var child$1 = function (scope, predicate) {
    return $_63he74yhjc7tmgsm.child(scope, predicate).isSome();
  };
  var descendant = function (scope, predicate) {
    return $_63he74yhjc7tmgsm.descendant(scope, predicate).isSome();
  };
  var $_9tl9w5ygjc7tmgsk = {
    any: any$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling,
    child: child$1,
    descendant: descendant
  };

  var focus = function (element) {
    element.dom().focus();
  };
  var blur = function (element) {
    element.dom().blur();
  };
  var hasFocus = function (element) {
    var doc = $_bvq6n5y2jc7tmgq7.owner(element).dom();
    return element.dom() === doc.activeElement;
  };
  var active = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    return $_7db13lw9jc7tmgee.from(doc.activeElement).map($_19g44bwsjc7tmgg6.fromDom);
  };
  var focusInside = function (element) {
    var doc = $_bvq6n5y2jc7tmgq7.owner(element);
    var inside = active(doc).filter(function (a) {
      return $_9tl9w5ygjc7tmgsk.closest(a, $_7wlbdawajc7tmgej.curry($_b6kzgmw7jc7tmgdr.eq, element));
    });
    inside.fold(function () {
      focus(element);
    }, $_7wlbdawajc7tmgej.noop);
  };
  var search = function (element) {
    return active($_bvq6n5y2jc7tmgq7.owner(element)).filter(function (e) {
      return element.dom().contains(e.dom());
    });
  };
  var $_aqgip2yfjc7tmgse = {
    hasFocus: hasFocus,
    focus: focus,
    blur: blur,
    active: active,
    search: search,
    focusInside: focusInside
  };

  var ThemeManager = tinymce.util.Tools.resolve('tinymce.ThemeManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var openLink = function (target) {
    var link = document.createElement('a');
    link.target = '_blank';
    link.href = target.href;
    link.rel = 'noreferrer noopener';
    var nuEvt = document.createEvent('MouseEvents');
    nuEvt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.body.appendChild(link);
    link.dispatchEvent(nuEvt);
    document.body.removeChild(link);
  };
  var $_3w0xp9yljc7tmgt9 = { openLink: openLink };

  var isSkinDisabled = function (editor) {
    return editor.settings.skin === false;
  };
  var $_4z2ltrymjc7tmgtb = { isSkinDisabled: isSkinDisabled };

  var formatChanged = 'formatChanged';
  var orientationChanged = 'orientationChanged';
  var dropupDismissed = 'dropupDismissed';
  var $_caizgmynjc7tmgte = {
    formatChanged: $_7wlbdawajc7tmgej.constant(formatChanged),
    orientationChanged: $_7wlbdawajc7tmgej.constant(orientationChanged),
    dropupDismissed: $_7wlbdawajc7tmgej.constant(dropupDismissed)
  };

  var chooseChannels = function (channels, message) {
    return message.universal() ? channels : $_682tbuw8jc7tmgdz.filter(channels, function (ch) {
      return $_682tbuw8jc7tmgdz.contains(message.channels(), ch);
    });
  };
  var events = function (receiveConfig) {
    return $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.receive(), function (component, message) {
        var channelMap = receiveConfig.channels();
        var channels = $_fvv1p1wzjc7tmgh1.keys(channelMap);
        var targetChannels = chooseChannels(channels, message);
        $_682tbuw8jc7tmgdz.each(targetChannels, function (ch) {
          var channelInfo = channelMap[ch]();
          var channelSchema = channelInfo.schema();
          var data = $_c1hr3lxgjc7tmgly.asStructOrDie('channel[' + ch + '] data\nReceiver: ' + $_5d0nway8jc7tmgrj.element(component.element()), channelSchema, message.data());
          channelInfo.onReceive()(component, data);
        });
      })]);
  };
  var $_4nms84yqjc7tmgu1 = { events: events };

  var menuFields = [
    $_9benqox1jc7tmght.strict('menu'),
    $_9benqox1jc7tmght.strict('selectedMenu')
  ];
  var itemFields = [
    $_9benqox1jc7tmght.strict('item'),
    $_9benqox1jc7tmght.strict('selectedItem')
  ];
  var schema = $_c1hr3lxgjc7tmgly.objOfOnly(itemFields.concat(menuFields));
  var itemSchema = $_c1hr3lxgjc7tmgly.objOfOnly(itemFields);
  var $_7y1ubsytjc7tmgv8 = {
    menuFields: $_7wlbdawajc7tmgej.constant(menuFields),
    itemFields: $_7wlbdawajc7tmgej.constant(itemFields),
    schema: $_7wlbdawajc7tmgej.constant(schema),
    itemSchema: $_7wlbdawajc7tmgej.constant(itemSchema)
  };

  var initSize = $_9benqox1jc7tmght.strictObjOf('initSize', [
    $_9benqox1jc7tmght.strict('numColumns'),
    $_9benqox1jc7tmght.strict('numRows')
  ]);
  var itemMarkers = function () {
    return $_9benqox1jc7tmght.strictOf('markers', $_7y1ubsytjc7tmgv8.itemSchema());
  };
  var menuMarkers = function () {
    return $_9benqox1jc7tmght.strictOf('markers', $_7y1ubsytjc7tmgv8.schema());
  };
  var tieredMenuMarkers = function () {
    return $_9benqox1jc7tmght.strictObjOf('markers', [$_9benqox1jc7tmght.strict('backgroundMenu')].concat($_7y1ubsytjc7tmgv8.menuFields()).concat($_7y1ubsytjc7tmgv8.itemFields()));
  };
  var markers = function (required) {
    return $_9benqox1jc7tmght.strictObjOf('markers', $_682tbuw8jc7tmgdz.map(required, $_9benqox1jc7tmght.strict));
  };
  var onPresenceHandler = function (label, fieldName, presence) {
    var trace = $_dszcp6y7jc7tmgqz.getTrace();
    return $_9benqox1jc7tmght.field(fieldName, fieldName, presence, $_c1hr3lxgjc7tmgly.valueOf(function (f) {
      return $_5x2c31x7jc7tmgjn.value(function () {
        $_dszcp6y7jc7tmgqz.logHandler(label, fieldName, trace);
        return f.apply(undefined, arguments);
      });
    }));
  };
  var onHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_vby21x2jc7tmgi0.defaulted($_7wlbdawajc7tmgej.noop));
  };
  var onKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_vby21x2jc7tmgi0.defaulted($_7db13lw9jc7tmgee.none));
  };
  var onStrictHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_vby21x2jc7tmgi0.strict());
  };
  var onStrictKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_vby21x2jc7tmgi0.strict());
  };
  var output$1 = function (name, value) {
    return $_9benqox1jc7tmght.state(name, $_7wlbdawajc7tmgej.constant(value));
  };
  var snapshot$1 = function (name) {
    return $_9benqox1jc7tmght.state(name, $_7wlbdawajc7tmgej.identity);
  };
  var $_8vhkewysjc7tmgun = {
    initSize: $_7wlbdawajc7tmgej.constant(initSize),
    itemMarkers: itemMarkers,
    menuMarkers: menuMarkers,
    tieredMenuMarkers: tieredMenuMarkers,
    markers: markers,
    onHandler: onHandler,
    onKeyboardHandler: onKeyboardHandler,
    onStrictHandler: onStrictHandler,
    onStrictKeyboardHandler: onStrictKeyboardHandler,
    output: output$1,
    snapshot: snapshot$1
  };

  var ReceivingSchema = [$_9benqox1jc7tmght.strictOf('channels', $_c1hr3lxgjc7tmgly.setOf($_5x2c31x7jc7tmgjn.value, $_c1hr3lxgjc7tmgly.objOfOnly([
      $_8vhkewysjc7tmgun.onStrictHandler('onReceive'),
      $_9benqox1jc7tmght.defaulted('schema', $_c1hr3lxgjc7tmgly.anyValue())
    ])))];

  var Receiving = $_567rv0w3jc7tmgc6.create({
    fields: ReceivingSchema,
    name: 'receiving',
    active: $_4nms84yqjc7tmgu1
  });

  var updateAriaState = function (component, toggleConfig) {
    var pressed = isOn(component, toggleConfig);
    var ariaInfo = toggleConfig.aria();
    ariaInfo.update()(component, ariaInfo, pressed);
  };
  var toggle$2 = function (component, toggleConfig, toggleState) {
    $_7lq4x8xtjc7tmgod.toggle(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var on = function (component, toggleConfig, toggleState) {
    $_7lq4x8xtjc7tmgod.add(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var off = function (component, toggleConfig, toggleState) {
    $_7lq4x8xtjc7tmgod.remove(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var isOn = function (component, toggleConfig) {
    return $_7lq4x8xtjc7tmgod.has(component.element(), toggleConfig.toggleClass());
  };
  var onLoad = function (component, toggleConfig, toggleState) {
    var api = toggleConfig.selected() ? on : off;
    api(component, toggleConfig, toggleState);
  };
  var $_3kjipyywjc7tmgvs = {
    onLoad: onLoad,
    toggle: toggle$2,
    isOn: isOn,
    on: on,
    off: off
  };

  var exhibit = function (base, toggleConfig, toggleState) {
    return $_f402ywxjjc7tmgmr.nu({});
  };
  var events$1 = function (toggleConfig, toggleState) {
    var execute = $_ivrpyw4jc7tmgco.executeEvent(toggleConfig, toggleState, $_3kjipyywjc7tmgvs.toggle);
    var load = $_ivrpyw4jc7tmgco.loadEvent(toggleConfig, toggleState, $_3kjipyywjc7tmgvs.onLoad);
    return $_3oclftw5jc7tmgdb.derive($_682tbuw8jc7tmgdz.flatten([
      toggleConfig.toggleOnExecute() ? [execute] : [],
      [load]
    ]));
  };
  var $_dbec5tyvjc7tmgvo = {
    exhibit: exhibit,
    events: events$1
  };

  var updatePressed = function (component, ariaInfo, status) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-pressed', status);
    if (ariaInfo.syncWithExpanded())
      updateExpanded(component, ariaInfo, status);
  };
  var updateSelected = function (component, ariaInfo, status) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-selected', status);
  };
  var updateChecked = function (component, ariaInfo, status) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-checked', status);
  };
  var updateExpanded = function (component, ariaInfo, status) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-expanded', status);
  };
  var tagAttributes = {
    button: ['aria-pressed'],
    'input:checkbox': ['aria-checked']
  };
  var roleAttributes = {
    'button': ['aria-pressed'],
    'listbox': [
      'aria-pressed',
      'aria-expanded'
    ],
    'menuitemcheckbox': ['aria-checked']
  };
  var detectFromTag = function (component) {
    var elem = component.element();
    var rawTag = $_e44ar2xwjc7tmgp4.name(elem);
    var suffix = rawTag === 'input' && $_gh0zlbxvjc7tmgol.has(elem, 'type') ? ':' + $_gh0zlbxvjc7tmgol.get(elem, 'type') : '';
    return $_ftivuzx5jc7tmgj2.readOptFrom(tagAttributes, rawTag + suffix);
  };
  var detectFromRole = function (component) {
    var elem = component.element();
    if (!$_gh0zlbxvjc7tmgol.has(elem, 'role'))
      return $_7db13lw9jc7tmgee.none();
    else {
      var role = $_gh0zlbxvjc7tmgol.get(elem, 'role');
      return $_ftivuzx5jc7tmgj2.readOptFrom(roleAttributes, role);
    }
  };
  var updateAuto = function (component, ariaInfo, status) {
    var attributes = detectFromRole(component).orThunk(function () {
      return detectFromTag(component);
    }).getOr([]);
    $_682tbuw8jc7tmgdz.each(attributes, function (attr) {
      $_gh0zlbxvjc7tmgol.set(component.element(), attr, status);
    });
  };
  var $_859y4fyyjc7tmgwd = {
    updatePressed: updatePressed,
    updateSelected: updateSelected,
    updateChecked: updateChecked,
    updateExpanded: updateExpanded,
    updateAuto: updateAuto
  };

  var ToggleSchema = [
    $_9benqox1jc7tmght.defaulted('selected', false),
    $_9benqox1jc7tmght.strict('toggleClass'),
    $_9benqox1jc7tmght.defaulted('toggleOnExecute', true),
    $_9benqox1jc7tmght.defaultedOf('aria', { mode: 'none' }, $_c1hr3lxgjc7tmgly.choose('mode', {
      'pressed': [
        $_9benqox1jc7tmght.defaulted('syncWithExpanded', false),
        $_8vhkewysjc7tmgun.output('update', $_859y4fyyjc7tmgwd.updatePressed)
      ],
      'checked': [$_8vhkewysjc7tmgun.output('update', $_859y4fyyjc7tmgwd.updateChecked)],
      'expanded': [$_8vhkewysjc7tmgun.output('update', $_859y4fyyjc7tmgwd.updateExpanded)],
      'selected': [$_8vhkewysjc7tmgun.output('update', $_859y4fyyjc7tmgwd.updateSelected)],
      'none': [$_8vhkewysjc7tmgun.output('update', $_7wlbdawajc7tmgej.noop)]
    }))
  ];

  var Toggling = $_567rv0w3jc7tmgc6.create({
    fields: ToggleSchema,
    name: 'toggling',
    active: $_dbec5tyvjc7tmgvo,
    apis: $_3kjipyywjc7tmgvs
  });

  var format = function (command, update) {
    return Receiving.config({
      channels: $_ftivuzx5jc7tmgj2.wrap($_caizgmynjc7tmgte.formatChanged(), {
        onReceive: function (button, data) {
          if (data.command === command) {
            update(button, data.state);
          }
        }
      })
    });
  };
  var orientation = function (onReceive) {
    return Receiving.config({ channels: $_ftivuzx5jc7tmgj2.wrap($_caizgmynjc7tmgte.orientationChanged(), { onReceive: onReceive }) });
  };
  var receive = function (channel, onReceive) {
    return {
      key: channel,
      value: { onReceive: onReceive }
    };
  };
  var $_c7bmb0yzjc7tmgwp = {
    format: format,
    orientation: orientation,
    receive: receive
  };

  var prefix = 'tinymce-mobile';
  var resolve$1 = function (p) {
    return prefix + '-' + p;
  };
  var $_fej2h3z0jc7tmgwt = {
    resolve: resolve$1,
    prefix: $_7wlbdawajc7tmgej.constant(prefix)
  };

  var exhibit$1 = function (base, unselectConfig) {
    return $_f402ywxjjc7tmgmr.nu({
      styles: {
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': '-moz-none'
      },
      attributes: { 'unselectable': 'on' }
    });
  };
  var events$2 = function (unselectConfig) {
    return $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.abort($_dpjvxuwwjc7tmggu.selectstart(), $_7wlbdawajc7tmgej.constant(true))]);
  };
  var $_6d8jibz3jc7tmgx8 = {
    events: events$2,
    exhibit: exhibit$1
  };

  var Unselecting = $_567rv0w3jc7tmgc6.create({
    fields: [],
    name: 'unselecting',
    active: $_6d8jibz3jc7tmgx8
  });

  var focus$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_aqgip2yfjc7tmgse.focus(component.element());
      focusConfig.onFocus()(component);
    }
  };
  var blur$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_aqgip2yfjc7tmgse.blur(component.element());
    }
  };
  var isFocused = function (component) {
    return $_aqgip2yfjc7tmgse.hasFocus(component.element());
  };
  var $_g1lza7z7jc7tmgxx = {
    focus: focus$1,
    blur: blur$1,
    isFocused: isFocused
  };

  var exhibit$2 = function (base, focusConfig) {
    if (focusConfig.ignore())
      return $_f402ywxjjc7tmgmr.nu({});
    else
      return $_f402ywxjjc7tmgmr.nu({ attributes: { 'tabindex': '-1' } });
  };
  var events$3 = function (focusConfig) {
    return $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.focus(), function (component, simulatedEvent) {
        $_g1lza7z7jc7tmgxx.focus(component, focusConfig);
        simulatedEvent.stop();
      })]);
  };
  var $_8pnhcxz6jc7tmgxt = {
    exhibit: exhibit$2,
    events: events$3
  };

  var FocusSchema = [
    $_8vhkewysjc7tmgun.onHandler('onFocus'),
    $_9benqox1jc7tmght.defaulted('ignore', false)
  ];

  var Focusing = $_567rv0w3jc7tmgc6.create({
    fields: FocusSchema,
    name: 'focusing',
    active: $_8pnhcxz6jc7tmgxt,
    apis: $_g1lza7z7jc7tmgxx
  });

  var $_4hq5r8zdjc7tmgz0 = {
    BACKSPACE: $_7wlbdawajc7tmgej.constant([8]),
    TAB: $_7wlbdawajc7tmgej.constant([9]),
    ENTER: $_7wlbdawajc7tmgej.constant([13]),
    SHIFT: $_7wlbdawajc7tmgej.constant([16]),
    CTRL: $_7wlbdawajc7tmgej.constant([17]),
    ALT: $_7wlbdawajc7tmgej.constant([18]),
    CAPSLOCK: $_7wlbdawajc7tmgej.constant([20]),
    ESCAPE: $_7wlbdawajc7tmgej.constant([27]),
    SPACE: $_7wlbdawajc7tmgej.constant([32]),
    PAGEUP: $_7wlbdawajc7tmgej.constant([33]),
    PAGEDOWN: $_7wlbdawajc7tmgej.constant([34]),
    END: $_7wlbdawajc7tmgej.constant([35]),
    HOME: $_7wlbdawajc7tmgej.constant([36]),
    LEFT: $_7wlbdawajc7tmgej.constant([37]),
    UP: $_7wlbdawajc7tmgej.constant([38]),
    RIGHT: $_7wlbdawajc7tmgej.constant([39]),
    DOWN: $_7wlbdawajc7tmgej.constant([40]),
    INSERT: $_7wlbdawajc7tmgej.constant([45]),
    DEL: $_7wlbdawajc7tmgej.constant([46]),
    META: $_7wlbdawajc7tmgej.constant([
      91,
      93,
      224
    ]),
    F10: $_7wlbdawajc7tmgej.constant([121])
  };

  var cycleBy = function (value, delta, min, max) {
    var r = value + delta;
    if (r > max)
      return min;
    else
      return r < min ? max : r;
  };
  var cap = function (value, min, max) {
    if (value <= min)
      return min;
    else
      return value >= max ? max : value;
  };
  var $_85tspzzijc7tmh1t = {
    cycleBy: cycleBy,
    cap: cap
  };

  var all$3 = function (predicate) {
    return descendants$1($_5q4xj9y6jc7tmgqt.body(), predicate);
  };
  var ancestors$1 = function (scope, predicate, isRoot) {
    return $_682tbuw8jc7tmgdz.filter($_bvq6n5y2jc7tmgq7.parents(scope, isRoot), predicate);
  };
  var siblings$2 = function (scope, predicate) {
    return $_682tbuw8jc7tmgdz.filter($_bvq6n5y2jc7tmgq7.siblings(scope), predicate);
  };
  var children$2 = function (scope, predicate) {
    return $_682tbuw8jc7tmgdz.filter($_bvq6n5y2jc7tmgq7.children(scope), predicate);
  };
  var descendants$1 = function (scope, predicate) {
    var result = [];
    $_682tbuw8jc7tmgdz.each($_bvq6n5y2jc7tmgq7.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants$1(x, predicate));
    });
    return result;
  };
  var $_7dz5iazkjc7tmh20 = {
    all: all$3,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  var all$2 = function (selector) {
    return $_5uhwcuwrjc7tmgg1.all(selector);
  };
  var ancestors = function (scope, selector, isRoot) {
    return $_7dz5iazkjc7tmh20.ancestors(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    }, isRoot);
  };
  var siblings$1 = function (scope, selector) {
    return $_7dz5iazkjc7tmh20.siblings(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    });
  };
  var children$1 = function (scope, selector) {
    return $_7dz5iazkjc7tmh20.children(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    });
  };
  var descendants = function (scope, selector) {
    return $_5uhwcuwrjc7tmgg1.all(selector, scope);
  };
  var $_92hwmyzjjc7tmh1x = {
    all: all$2,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var first$2 = function (selector) {
    return $_5uhwcuwrjc7tmgg1.one(selector);
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_63he74yhjc7tmgsm.ancestor(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    }, isRoot);
  };
  var sibling$2 = function (scope, selector) {
    return $_63he74yhjc7tmgsm.sibling(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    });
  };
  var child$3 = function (scope, selector) {
    return $_63he74yhjc7tmgsm.child(scope, function (e) {
      return $_5uhwcuwrjc7tmgg1.is(e, selector);
    });
  };
  var descendant$2 = function (scope, selector) {
    return $_5uhwcuwrjc7tmgg1.one(selector, scope);
  };
  var closest$2 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_5uhwcuwrjc7tmgg1.is, ancestor$2, scope, selector, isRoot);
  };
  var $_el2q49zljc7tmh27 = {
    first: first$2,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var dehighlightAll = function (component, hConfig, hState) {
    var highlighted = $_92hwmyzjjc7tmh1x.descendants(component.element(), '.' + hConfig.highlightClass());
    $_682tbuw8jc7tmgdz.each(highlighted, function (h) {
      $_7lq4x8xtjc7tmgod.remove(h, hConfig.highlightClass());
      component.getSystem().getByDom(h).each(function (target) {
        hConfig.onDehighlight()(component, target);
      });
    });
  };
  var dehighlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    $_7lq4x8xtjc7tmgod.remove(target.element(), hConfig.highlightClass());
    if (wasHighlighted)
      hConfig.onDehighlight()(component, target);
  };
  var highlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    dehighlightAll(component, hConfig, hState);
    $_7lq4x8xtjc7tmgod.add(target.element(), hConfig.highlightClass());
    if (!wasHighlighted)
      hConfig.onHighlight()(component, target);
  };
  var highlightFirst = function (component, hConfig, hState) {
    getFirst(component, hConfig, hState).each(function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightLast = function (component, hConfig, hState) {
    getLast(component, hConfig, hState).each(function (lastComp) {
      highlight(component, hConfig, hState, lastComp);
    });
  };
  var highlightAt = function (component, hConfig, hState, index) {
    getByIndex(component, hConfig, hState, index).fold(function (err) {
      throw new Error(err);
    }, function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightBy = function (component, hConfig, hState, predicate) {
    var items = $_92hwmyzjjc7tmh1x.descendants(component.element(), '.' + hConfig.itemClass());
    var itemComps = $_eidt8kydjc7tmgsa.cat($_682tbuw8jc7tmgdz.map(items, function (i) {
      return component.getSystem().getByDom(i).toOption();
    }));
    var targetComp = $_682tbuw8jc7tmgdz.find(itemComps, predicate);
    targetComp.each(function (c) {
      highlight(component, hConfig, hState, c);
    });
  };
  var isHighlighted = function (component, hConfig, hState, queryTarget) {
    return $_7lq4x8xtjc7tmgod.has(queryTarget.element(), hConfig.highlightClass());
  };
  var getHighlighted = function (component, hConfig, hState) {
    return $_el2q49zljc7tmh27.descendant(component.element(), '.' + hConfig.highlightClass()).bind(component.getSystem().getByDom);
  };
  var getByIndex = function (component, hConfig, hState, index) {
    var items = $_92hwmyzjjc7tmh1x.descendants(component.element(), '.' + hConfig.itemClass());
    return $_7db13lw9jc7tmgee.from(items[index]).fold(function () {
      return $_5x2c31x7jc7tmgjn.error('No element found with index ' + index);
    }, component.getSystem().getByDom);
  };
  var getFirst = function (component, hConfig, hState) {
    return $_el2q49zljc7tmh27.descendant(component.element(), '.' + hConfig.itemClass()).bind(component.getSystem().getByDom);
  };
  var getLast = function (component, hConfig, hState) {
    var items = $_92hwmyzjjc7tmh1x.descendants(component.element(), '.' + hConfig.itemClass());
    var last = items.length > 0 ? $_7db13lw9jc7tmgee.some(items[items.length - 1]) : $_7db13lw9jc7tmgee.none();
    return last.bind(component.getSystem().getByDom);
  };
  var getDelta = function (component, hConfig, hState, delta) {
    var items = $_92hwmyzjjc7tmh1x.descendants(component.element(), '.' + hConfig.itemClass());
    var current = $_682tbuw8jc7tmgdz.findIndex(items, function (item) {
      return $_7lq4x8xtjc7tmgod.has(item, hConfig.highlightClass());
    });
    return current.bind(function (selected) {
      var dest = $_85tspzzijc7tmh1t.cycleBy(selected, delta, 0, items.length - 1);
      return component.getSystem().getByDom(items[dest]);
    });
  };
  var getPrevious = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, -1);
  };
  var getNext = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, +1);
  };
  var $_bofjqzzhjc7tmh0w = {
    dehighlightAll: dehighlightAll,
    dehighlight: dehighlight,
    highlight: highlight,
    highlightFirst: highlightFirst,
    highlightLast: highlightLast,
    highlightAt: highlightAt,
    highlightBy: highlightBy,
    isHighlighted: isHighlighted,
    getHighlighted: getHighlighted,
    getFirst: getFirst,
    getLast: getLast,
    getPrevious: getPrevious,
    getNext: getNext
  };

  var HighlightSchema = [
    $_9benqox1jc7tmght.strict('highlightClass'),
    $_9benqox1jc7tmght.strict('itemClass'),
    $_8vhkewysjc7tmgun.onHandler('onHighlight'),
    $_8vhkewysjc7tmgun.onHandler('onDehighlight')
  ];

  var Highlighting = $_567rv0w3jc7tmgc6.create({
    fields: HighlightSchema,
    name: 'highlighting',
    apis: $_bofjqzzhjc7tmh0w
  });

  var dom = function () {
    var get = function (component) {
      return $_aqgip2yfjc7tmgse.search(component.element());
    };
    var set = function (component, focusee) {
      component.getSystem().triggerFocus(focusee, component.element());
    };
    return {
      get: get,
      set: set
    };
  };
  var highlights = function () {
    var get = function (component) {
      return Highlighting.getHighlighted(component).map(function (item) {
        return item.element();
      });
    };
    var set = function (component, element) {
      component.getSystem().getByDom(element).fold($_7wlbdawajc7tmgej.noop, function (item) {
        Highlighting.highlight(component, item);
      });
    };
    return {
      get: get,
      set: set
    };
  };
  var $_98ohzrzfjc7tmh0d = {
    dom: dom,
    highlights: highlights
  };

  var inSet = function (keys) {
    return function (event) {
      return $_682tbuw8jc7tmgdz.contains(keys, event.raw().which);
    };
  };
  var and = function (preds) {
    return function (event) {
      return $_682tbuw8jc7tmgdz.forall(preds, function (pred) {
        return pred(event);
      });
    };
  };
  var is$1 = function (key) {
    return function (event) {
      return event.raw().which === key;
    };
  };
  var isShift = function (event) {
    return event.raw().shiftKey === true;
  };
  var isControl = function (event) {
    return event.raw().ctrlKey === true;
  };
  var $_cyegcgzojc7tmh3u = {
    inSet: inSet,
    and: and,
    is: is$1,
    isShift: isShift,
    isNotShift: $_7wlbdawajc7tmgej.not(isShift),
    isControl: isControl,
    isNotControl: $_7wlbdawajc7tmgej.not(isControl)
  };

  var basic = function (key, action) {
    return {
      matches: $_cyegcgzojc7tmh3u.is(key),
      classification: action
    };
  };
  var rule = function (matches, action) {
    return {
      matches: matches,
      classification: action
    };
  };
  var choose$2 = function (transitions, event) {
    var transition = $_682tbuw8jc7tmgdz.find(transitions, function (t) {
      return t.matches(event);
    });
    return transition.map(function (t) {
      return t.classification;
    });
  };
  var $_9ylrlrznjc7tmh2y = {
    basic: basic,
    rule: rule,
    choose: choose$2
  };

  var typical = function (infoSchema, stateInit, getRules, getEvents, getApis, optFocusIn) {
    var schema = function () {
      return infoSchema.concat([
        $_9benqox1jc7tmght.defaulted('focusManager', $_98ohzrzfjc7tmh0d.dom()),
        $_8vhkewysjc7tmgun.output('handler', me),
        $_8vhkewysjc7tmgun.output('state', stateInit)
      ]);
    };
    var processKey = function (component, simulatedEvent, keyingConfig, keyingState) {
      var rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
      return $_9ylrlrznjc7tmh2y.choose(rules, simulatedEvent.event()).bind(function (rule) {
        return rule(component, simulatedEvent, keyingConfig, keyingState);
      });
    };
    var toEvents = function (keyingConfig, keyingState) {
      var otherEvents = getEvents(keyingConfig, keyingState);
      var keyEvents = $_3oclftw5jc7tmgdb.derive(optFocusIn.map(function (focusIn) {
        return $_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.focus(), function (component, simulatedEvent) {
          focusIn(component, keyingConfig, keyingState, simulatedEvent);
          simulatedEvent.stop();
        });
      }).toArray().concat([$_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.keydown(), function (component, simulatedEvent) {
          processKey(component, simulatedEvent, keyingConfig, keyingState).each(function (_) {
            simulatedEvent.stop();
          });
        })]));
      return $_2nfiamwxjc7tmggx.deepMerge(otherEvents, keyEvents);
    };
    var me = {
      schema: schema,
      processKey: processKey,
      toEvents: toEvents,
      toApis: getApis
    };
    return me;
  };
  var $_4ykcvtzejc7tmgz7 = { typical: typical };

  var cyclePrev = function (values, index, predicate) {
    var before = $_682tbuw8jc7tmgdz.reverse(values.slice(0, index));
    var after = $_682tbuw8jc7tmgdz.reverse(values.slice(index + 1));
    return $_682tbuw8jc7tmgdz.find(before.concat(after), predicate);
  };
  var tryPrev = function (values, index, predicate) {
    var before = $_682tbuw8jc7tmgdz.reverse(values.slice(0, index));
    return $_682tbuw8jc7tmgdz.find(before, predicate);
  };
  var cycleNext = function (values, index, predicate) {
    var before = values.slice(0, index);
    var after = values.slice(index + 1);
    return $_682tbuw8jc7tmgdz.find(after.concat(before), predicate);
  };
  var tryNext = function (values, index, predicate) {
    var after = values.slice(index + 1);
    return $_682tbuw8jc7tmgdz.find(after, predicate);
  };
  var $_gh8d35zpjc7tmh4e = {
    cyclePrev: cyclePrev,
    cycleNext: cycleNext,
    tryPrev: tryPrev,
    tryNext: tryNext
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_9ivdzezsjc7tmh5h = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_5ub7o5wyjc7tmggz.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_9ivdzezsjc7tmh5h.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_9ivdzezsjc7tmh5h.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$3 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_fvv1p1wzjc7tmgh1.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_fvv1p1wzjc7tmgh1.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$4 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_5q4xj9y6jc7tmgqt.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_9ivdzezsjc7tmh5h.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_7db13lw9jc7tmgee.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_9ivdzezsjc7tmh5h.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_19g44bwsjc7tmgg6.fromTag(tag);
    set$3(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$5 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_gh0zlbxvjc7tmgol.has(element, 'style') && $_cao7towojc7tmgfu.trim($_gh0zlbxvjc7tmgol.get(element, 'style')) === '') {
      $_gh0zlbxvjc7tmgol.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_gh0zlbxvjc7tmgol.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_gh0zlbxvjc7tmgol.remove : $_gh0zlbxvjc7tmgol.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy$1 = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_9ivdzezsjc7tmh5h.isSupported(sourceDom) && $_9ivdzezsjc7tmh5h.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$3(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_e44ar2xwjc7tmgp4.isElement(source) || !$_e44ar2xwjc7tmgp4.isElement(destination))
      return;
    $_682tbuw8jc7tmgdz.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_bq4g3yzrjc7tmh4w = {
    copy: copy$1,
    set: set$3,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$5,
    get: get$4,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  var Dimension = function (name, getOffset) {
    var set = function (element, h) {
      if (!$_5ub7o5wyjc7tmggz.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_9ivdzezsjc7tmh5h.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_bq4g3yzrjc7tmh4w.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_682tbuw8jc7tmgdz.foldl(properties, function (acc, property) {
        var val = $_bq4g3yzrjc7tmh4w.get(element, property);
        var value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
    };
    var max = function (element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties);
      var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
      return absoluteMax;
    };
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    };
  };

  var api = Dimension('height', function (element) {
    return $_5q4xj9y6jc7tmgqt.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$2 = function (element, h) {
    api.set(element, h);
  };
  var get$3 = function (element) {
    return api.get(element);
  };
  var getOuter$1 = function (element) {
    return api.getOuter(element);
  };
  var setMax = function (element, value) {
    var inclusions = [
      'margin-top',
      'border-top-width',
      'padding-top',
      'padding-bottom',
      'border-bottom-width',
      'margin-bottom'
    ];
    var absMax = api.max(element, value, inclusions);
    $_bq4g3yzrjc7tmh4w.set(element, 'max-height', absMax + 'px');
  };
  var $_47uhgnzqjc7tmh4r = {
    set: set$2,
    get: get$3,
    getOuter: getOuter$1,
    setMax: setMax
  };

  var create$2 = function (cyclicField) {
    var schema = [
      $_9benqox1jc7tmght.option('onEscape'),
      $_9benqox1jc7tmght.option('onEnter'),
      $_9benqox1jc7tmght.defaulted('selector', '[data-alloy-tabstop="true"]'),
      $_9benqox1jc7tmght.defaulted('firstTabstop', 0),
      $_9benqox1jc7tmght.defaulted('useTabstopAt', $_7wlbdawajc7tmgej.constant(true)),
      $_9benqox1jc7tmght.option('visibilitySelector')
    ].concat([cyclicField]);
    var isVisible = function (tabbingConfig, element) {
      var target = tabbingConfig.visibilitySelector().bind(function (sel) {
        return $_el2q49zljc7tmh27.closest(element, sel);
      }).getOr(element);
      return $_47uhgnzqjc7tmh4r.get(target) > 0;
    };
    var findInitial = function (component, tabbingConfig) {
      var tabstops = $_92hwmyzjjc7tmh1x.descendants(component.element(), tabbingConfig.selector());
      var visibles = $_682tbuw8jc7tmgdz.filter(tabstops, function (elem) {
        return isVisible(tabbingConfig, elem);
      });
      return $_7db13lw9jc7tmgee.from(visibles[tabbingConfig.firstTabstop()]);
    };
    var findCurrent = function (component, tabbingConfig) {
      return tabbingConfig.focusManager().get(component).bind(function (elem) {
        return $_el2q49zljc7tmh27.closest(elem, tabbingConfig.selector());
      });
    };
    var isTabstop = function (tabbingConfig, element) {
      return isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt()(element);
    };
    var focusIn = function (component, tabbingConfig, tabbingState) {
      findInitial(component, tabbingConfig).each(function (target) {
        tabbingConfig.focusManager().set(component, target);
      });
    };
    var goFromTabstop = function (component, tabstops, stopIndex, tabbingConfig, cycle) {
      return cycle(tabstops, stopIndex, function (elem) {
        return isTabstop(tabbingConfig, elem);
      }).fold(function () {
        return tabbingConfig.cyclic() ? $_7db13lw9jc7tmgee.some(true) : $_7db13lw9jc7tmgee.none();
      }, function (target) {
        tabbingConfig.focusManager().set(component, target);
        return $_7db13lw9jc7tmgee.some(true);
      });
    };
    var go = function (component, simulatedEvent, tabbingConfig, cycle) {
      var tabstops = $_92hwmyzjjc7tmh1x.descendants(component.element(), tabbingConfig.selector());
      return findCurrent(component, tabbingConfig).bind(function (tabstop) {
        var optStopIndex = $_682tbuw8jc7tmgdz.findIndex(tabstops, $_7wlbdawajc7tmgej.curry($_b6kzgmw7jc7tmgdr.eq, tabstop));
        return optStopIndex.bind(function (stopIndex) {
          return goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle);
        });
      });
    };
    var goBackwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_gh8d35zpjc7tmh4e.cyclePrev : $_gh8d35zpjc7tmh4e.tryPrev;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var goForwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_gh8d35zpjc7tmh4e.cycleNext : $_gh8d35zpjc7tmh4e.tryNext;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var execute = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEnter().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var exit = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEscape().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var getRules = $_7wlbdawajc7tmgej.constant([
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
      ]), goBackwards),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB()), goForwards),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ESCAPE()), exit),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isNotShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER())
      ]), execute)
    ]);
    var getEvents = $_7wlbdawajc7tmgej.constant({});
    var getApis = $_7wlbdawajc7tmgej.constant({});
    return $_4ykcvtzejc7tmgz7.typical(schema, $_46qvupxpjc7tmgnx.init, getRules, getEvents, getApis, $_7db13lw9jc7tmgee.some(focusIn));
  };
  var $_4th527zcjc7tmgyl = { create: create$2 };

  var AcyclicType = $_4th527zcjc7tmgyl.create($_9benqox1jc7tmght.state('cyclic', $_7wlbdawajc7tmgej.constant(false)));

  var CyclicType = $_4th527zcjc7tmgyl.create($_9benqox1jc7tmght.state('cyclic', $_7wlbdawajc7tmgej.constant(true)));

  var inside = function (target) {
    return $_e44ar2xwjc7tmgp4.name(target) === 'input' && $_gh0zlbxvjc7tmgol.get(target, 'type') !== 'radio' || $_e44ar2xwjc7tmgp4.name(target) === 'textarea';
  };
  var $_78m48zwjc7tmh6a = { inside: inside };

  var doDefaultExecute = function (component, simulatedEvent, focused) {
    $_7zx0zrwujc7tmgge.dispatch(component, focused, $_66ekuowvjc7tmggn.execute());
    return $_7db13lw9jc7tmgee.some(true);
  };
  var defaultExecute = function (component, simulatedEvent, focused) {
    return $_78m48zwjc7tmh6a.inside(focused) && $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE())(simulatedEvent.event()) ? $_7db13lw9jc7tmgee.none() : doDefaultExecute(component, simulatedEvent, focused);
  };
  var $_1cjyjhzxjc7tmh6q = { defaultExecute: defaultExecute };

  var schema$1 = [
    $_9benqox1jc7tmght.defaulted('execute', $_1cjyjhzxjc7tmh6q.defaultExecute),
    $_9benqox1jc7tmght.defaulted('useSpace', false),
    $_9benqox1jc7tmght.defaulted('useEnter', true),
    $_9benqox1jc7tmght.defaulted('useControlEnter', false),
    $_9benqox1jc7tmght.defaulted('useDown', false)
  ];
  var execute = function (component, simulatedEvent, executeConfig, executeState) {
    return executeConfig.execute()(component, simulatedEvent, component.element());
  };
  var getRules = function (component, simulatedEvent, executeConfig, executeState) {
    var spaceExec = executeConfig.useSpace() && !$_78m48zwjc7tmh6a.inside(component.element()) ? $_4hq5r8zdjc7tmgz0.SPACE() : [];
    var enterExec = executeConfig.useEnter() ? $_4hq5r8zdjc7tmgz0.ENTER() : [];
    var downExec = executeConfig.useDown() ? $_4hq5r8zdjc7tmgz0.DOWN() : [];
    var execKeys = spaceExec.concat(enterExec).concat(downExec);
    return [$_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet(execKeys), execute)].concat(executeConfig.useControlEnter() ? [$_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isControl,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER())
      ]), execute)] : []);
  };
  var getEvents = $_7wlbdawajc7tmgej.constant({});
  var getApis = $_7wlbdawajc7tmgej.constant({});
  var ExecutionType = $_4ykcvtzejc7tmgz7.typical(schema$1, $_46qvupxpjc7tmgnx.init, getRules, getEvents, getApis, $_7db13lw9jc7tmgee.none());

  var flatgrid = function (spec) {
    var dimensions = Cell($_7db13lw9jc7tmgee.none());
    var setGridSize = function (numRows, numColumns) {
      dimensions.set($_7db13lw9jc7tmgee.some({
        numRows: $_7wlbdawajc7tmgej.constant(numRows),
        numColumns: $_7wlbdawajc7tmgej.constant(numColumns)
      }));
    };
    var getNumRows = function () {
      return dimensions.get().map(function (d) {
        return d.numRows();
      });
    };
    var getNumColumns = function () {
      return dimensions.get().map(function (d) {
        return d.numColumns();
      });
    };
    return BehaviourState({
      readState: $_7wlbdawajc7tmgej.constant({}),
      setGridSize: setGridSize,
      getNumRows: getNumRows,
      getNumColumns: getNumColumns
    });
  };
  var init$1 = function (spec) {
    return spec.state()(spec);
  };
  var $_46raq9zzjc7tmh79 = {
    flatgrid: flatgrid,
    init: init$1
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_bq4g3yzrjc7tmh4w.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_6g9197101jc7tmh7l = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var useH = function (movement) {
    return function (component, simulatedEvent, config, state) {
      var move = movement(component.element());
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var west = function (moveLeft, moveRight) {
    var movement = $_6g9197101jc7tmh7l.onDirection(moveLeft, moveRight);
    return useH(movement);
  };
  var east = function (moveLeft, moveRight) {
    var movement = $_6g9197101jc7tmh7l.onDirection(moveRight, moveLeft);
    return useH(movement);
  };
  var useV = function (move) {
    return function (component, simulatedEvent, config, state) {
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var use = function (move, component, simulatedEvent, config, state) {
    var outcome = config.focusManager().get(component).bind(function (focused) {
      return move(component.element(), focused, config, state);
    });
    return outcome.map(function (newFocus) {
      config.focusManager().set(component, newFocus);
      return true;
    });
  };
  var $_91876a100jc7tmh7i = {
    east: east,
    west: west,
    north: useV,
    south: useV,
    move: useV
  };

  var indexInfo = $_3we77gxljc7tmgnf.immutableBag([
    'index',
    'candidates'
  ], []);
  var locate = function (candidates, predicate) {
    return $_682tbuw8jc7tmgdz.findIndex(candidates, predicate).map(function (index) {
      return indexInfo({
        index: index,
        candidates: candidates
      });
    });
  };
  var $_c2og3u103jc7tmh7y = { locate: locate };

  var visibilityToggler = function (element, property, hiddenValue, visibleValue) {
    var initial = $_bq4g3yzrjc7tmh4w.get(element, property);
    if (initial === undefined)
      initial = '';
    var value = initial === hiddenValue ? visibleValue : hiddenValue;
    var off = $_7wlbdawajc7tmgej.curry($_bq4g3yzrjc7tmh4w.set, element, property, initial);
    var on = $_7wlbdawajc7tmgej.curry($_bq4g3yzrjc7tmh4w.set, element, property, value);
    return Toggler(off, on, false);
  };
  var toggler$1 = function (element) {
    return visibilityToggler(element, 'visibility', 'hidden', 'visible');
  };
  var displayToggler = function (element, value) {
    return visibilityToggler(element, 'display', 'none', value);
  };
  var isHidden = function (dom) {
    return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
  };
  var isVisible = function (element) {
    var dom = element.dom();
    return !isHidden(dom);
  };
  var $_5sepyr104jc7tmh84 = {
    toggler: toggler$1,
    displayToggler: displayToggler,
    isVisible: isVisible
  };

  var locateVisible = function (container, current, selector) {
    var filter = $_5sepyr104jc7tmh84.isVisible;
    return locateIn(container, current, selector, filter);
  };
  var locateIn = function (container, current, selector, filter) {
    var predicate = $_7wlbdawajc7tmgej.curry($_b6kzgmw7jc7tmgdr.eq, current);
    var candidates = $_92hwmyzjjc7tmh1x.descendants(container, selector);
    var visible = $_682tbuw8jc7tmgdz.filter(candidates, $_5sepyr104jc7tmh84.isVisible);
    return $_c2og3u103jc7tmh7y.locate(visible, predicate);
  };
  var findIndex$2 = function (elements, target) {
    return $_682tbuw8jc7tmgdz.findIndex(elements, function (elem) {
      return $_b6kzgmw7jc7tmgdr.eq(target, elem);
    });
  };
  var $_9j3q35102jc7tmh7o = {
    locateVisible: locateVisible,
    locateIn: locateIn,
    findIndex: findIndex$2
  };

  var withGrid = function (values, index, numCols, f) {
    var oldRow = Math.floor(index / numCols);
    var oldColumn = index % numCols;
    return f(oldRow, oldColumn).bind(function (address) {
      var newIndex = address.row() * numCols + address.column();
      return newIndex >= 0 && newIndex < values.length ? $_7db13lw9jc7tmgee.some(values[newIndex]) : $_7db13lw9jc7tmgee.none();
    });
  };
  var cycleHorizontal = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var onLastRow = oldRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      var newColumn = $_85tspzzijc7tmh1t.cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return $_7db13lw9jc7tmgee.some({
        row: $_7wlbdawajc7tmgej.constant(oldRow),
        column: $_7wlbdawajc7tmgej.constant(newColumn)
      });
    });
  };
  var cycleVertical = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var newRow = $_85tspzzijc7tmh1t.cycleBy(oldRow, delta, 0, numRows - 1);
      var onLastRow = newRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      var newCol = $_85tspzzijc7tmh1t.cap(oldColumn, 0, colsInRow - 1);
      return $_7db13lw9jc7tmgee.some({
        row: $_7wlbdawajc7tmgej.constant(newRow),
        column: $_7wlbdawajc7tmgej.constant(newCol)
      });
    });
  };
  var cycleRight = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, +1);
  };
  var cycleLeft = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, -1);
  };
  var cycleUp = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, -1);
  };
  var cycleDown = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, +1);
  };
  var $_bzjj8p105jc7tmh8a = {
    cycleDown: cycleDown,
    cycleUp: cycleUp,
    cycleLeft: cycleLeft,
    cycleRight: cycleRight
  };

  var schema$2 = [
    $_9benqox1jc7tmght.strict('selector'),
    $_9benqox1jc7tmght.defaulted('execute', $_1cjyjhzxjc7tmh6q.defaultExecute),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onEscape'),
    $_9benqox1jc7tmght.defaulted('captureTab', false),
    $_8vhkewysjc7tmgun.initSize()
  ];
  var focusIn = function (component, gridConfig, gridState) {
    $_el2q49zljc7tmh27.descendant(component.element(), gridConfig.selector()).each(function (first) {
      gridConfig.focusManager().set(component, first);
    });
  };
  var findCurrent = function (component, gridConfig) {
    return gridConfig.focusManager().get(component).bind(function (elem) {
      return $_el2q49zljc7tmh27.closest(elem, gridConfig.selector());
    });
  };
  var execute$1 = function (component, simulatedEvent, gridConfig, gridState) {
    return findCurrent(component, gridConfig).bind(function (focused) {
      return gridConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var doMove = function (cycle) {
    return function (element, focused, gridConfig, gridState) {
      return $_9j3q35102jc7tmh7o.locateVisible(element, focused, gridConfig.selector()).bind(function (identified) {
        return cycle(identified.candidates(), identified.index(), gridState.getNumRows().getOr(gridConfig.initSize().numRows()), gridState.getNumColumns().getOr(gridConfig.initSize().numColumns()));
      });
    };
  };
  var handleTab = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.captureTab() ? $_7db13lw9jc7tmgee.some(true) : $_7db13lw9jc7tmgee.none();
  };
  var doEscape = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.onEscape()(component, simulatedEvent);
  };
  var moveLeft = doMove($_bzjj8p105jc7tmh8a.cycleLeft);
  var moveRight = doMove($_bzjj8p105jc7tmh8a.cycleRight);
  var moveNorth = doMove($_bzjj8p105jc7tmh8a.cycleUp);
  var moveSouth = doMove($_bzjj8p105jc7tmh8a.cycleDown);
  var getRules$1 = $_7wlbdawajc7tmgej.constant([
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.LEFT()), $_91876a100jc7tmh7i.west(moveLeft, moveRight)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.RIGHT()), $_91876a100jc7tmh7i.east(moveLeft, moveRight)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.UP()), $_91876a100jc7tmh7i.north(moveNorth)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.DOWN()), $_91876a100jc7tmh7i.south(moveSouth)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
      $_cyegcgzojc7tmh3u.isShift,
      $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
    ]), handleTab),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
      $_cyegcgzojc7tmh3u.isNotShift,
      $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
    ]), handleTab),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ESCAPE()), doEscape),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE().concat($_4hq5r8zdjc7tmgz0.ENTER())), execute$1)
  ]);
  var getEvents$1 = $_7wlbdawajc7tmgej.constant({});
  var getApis$1 = {};
  var FlatgridType = $_4ykcvtzejc7tmgz7.typical(schema$2, $_46raq9zzjc7tmh79.flatgrid, getRules$1, getEvents$1, getApis$1, $_7db13lw9jc7tmgee.some(focusIn));

  var horizontal = function (container, selector, current, delta) {
    return $_9j3q35102jc7tmh7o.locateVisible(container, current, selector, $_7wlbdawajc7tmgej.constant(true)).bind(function (identified) {
      var index = identified.index();
      var candidates = identified.candidates();
      var newIndex = $_85tspzzijc7tmh1t.cycleBy(index, delta, 0, candidates.length - 1);
      return $_7db13lw9jc7tmgee.from(candidates[newIndex]);
    });
  };
  var $_4uhaab107jc7tmh8u = { horizontal: horizontal };

  var schema$3 = [
    $_9benqox1jc7tmght.strict('selector'),
    $_9benqox1jc7tmght.defaulted('getInitial', $_7db13lw9jc7tmgee.none),
    $_9benqox1jc7tmght.defaulted('execute', $_1cjyjhzxjc7tmh6q.defaultExecute),
    $_9benqox1jc7tmght.defaulted('executeOnMove', false)
  ];
  var findCurrent$1 = function (component, flowConfig) {
    return flowConfig.focusManager().get(component).bind(function (elem) {
      return $_el2q49zljc7tmh27.closest(elem, flowConfig.selector());
    });
  };
  var execute$2 = function (component, simulatedEvent, flowConfig) {
    return findCurrent$1(component, flowConfig).bind(function (focused) {
      return flowConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$1 = function (component, flowConfig) {
    flowConfig.getInitial()(component).or($_el2q49zljc7tmh27.descendant(component.element(), flowConfig.selector())).each(function (first) {
      flowConfig.focusManager().set(component, first);
    });
  };
  var moveLeft$1 = function (element, focused, info) {
    return $_4uhaab107jc7tmh8u.horizontal(element, info.selector(), focused, -1);
  };
  var moveRight$1 = function (element, focused, info) {
    return $_4uhaab107jc7tmh8u.horizontal(element, info.selector(), focused, +1);
  };
  var doMove$1 = function (movement) {
    return function (component, simulatedEvent, flowConfig) {
      return movement(component, simulatedEvent, flowConfig).bind(function () {
        return flowConfig.executeOnMove() ? execute$2(component, simulatedEvent, flowConfig) : $_7db13lw9jc7tmgee.some(true);
      });
    };
  };
  var getRules$2 = function (_) {
    return [
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.LEFT().concat($_4hq5r8zdjc7tmgz0.UP())), doMove$1($_91876a100jc7tmh7i.west(moveLeft$1, moveRight$1))),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.RIGHT().concat($_4hq5r8zdjc7tmgz0.DOWN())), doMove$1($_91876a100jc7tmh7i.east(moveLeft$1, moveRight$1))),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER()), execute$2),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE()), execute$2)
    ];
  };
  var getEvents$2 = $_7wlbdawajc7tmgej.constant({});
  var getApis$2 = $_7wlbdawajc7tmgej.constant({});
  var FlowType = $_4ykcvtzejc7tmgz7.typical(schema$3, $_46qvupxpjc7tmgnx.init, getRules$2, getEvents$2, getApis$2, $_7db13lw9jc7tmgee.some(focusIn$1));

  var outcome = $_3we77gxljc7tmgnf.immutableBag([
    'rowIndex',
    'columnIndex',
    'cell'
  ], []);
  var toCell = function (matrix, rowIndex, columnIndex) {
    return $_7db13lw9jc7tmgee.from(matrix[rowIndex]).bind(function (row) {
      return $_7db13lw9jc7tmgee.from(row[columnIndex]).map(function (cell) {
        return outcome({
          rowIndex: rowIndex,
          columnIndex: columnIndex,
          cell: cell
        });
      });
    });
  };
  var cycleHorizontal$1 = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_85tspzzijc7tmh1t.cycleBy(startCol, deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var cycleVertical$1 = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_85tspzzijc7tmh1t.cycleBy(startRow, deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_85tspzzijc7tmh1t.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var moveHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_85tspzzijc7tmh1t.cap(startCol + deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var moveVertical = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_85tspzzijc7tmh1t.cap(startRow + deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_85tspzzijc7tmh1t.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var cycleRight$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, +1);
  };
  var cycleLeft$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, -1);
  };
  var cycleUp$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, -1);
  };
  var cycleDown$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, +1);
  };
  var moveLeft$3 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, -1);
  };
  var moveRight$3 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, +1);
  };
  var moveUp = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, -1);
  };
  var moveDown = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, +1);
  };
  var $_af9czw109jc7tmh9e = {
    cycleRight: cycleRight$1,
    cycleLeft: cycleLeft$1,
    cycleUp: cycleUp$1,
    cycleDown: cycleDown$1,
    moveLeft: moveLeft$3,
    moveRight: moveRight$3,
    moveUp: moveUp,
    moveDown: moveDown
  };

  var schema$4 = [
    $_9benqox1jc7tmght.strictObjOf('selectors', [
      $_9benqox1jc7tmght.strict('row'),
      $_9benqox1jc7tmght.strict('cell')
    ]),
    $_9benqox1jc7tmght.defaulted('cycles', true),
    $_9benqox1jc7tmght.defaulted('previousSelector', $_7db13lw9jc7tmgee.none),
    $_9benqox1jc7tmght.defaulted('execute', $_1cjyjhzxjc7tmh6q.defaultExecute)
  ];
  var focusIn$2 = function (component, matrixConfig) {
    var focused = matrixConfig.previousSelector()(component).orThunk(function () {
      var selectors = matrixConfig.selectors();
      return $_el2q49zljc7tmh27.descendant(component.element(), selectors.cell());
    });
    focused.each(function (cell) {
      matrixConfig.focusManager().set(component, cell);
    });
  };
  var execute$3 = function (component, simulatedEvent, matrixConfig) {
    return $_aqgip2yfjc7tmgse.search(component.element()).bind(function (focused) {
      return matrixConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var toMatrix = function (rows, matrixConfig) {
    return $_682tbuw8jc7tmgdz.map(rows, function (row) {
      return $_92hwmyzjjc7tmh1x.descendants(row, matrixConfig.selectors().cell());
    });
  };
  var doMove$2 = function (ifCycle, ifMove) {
    return function (element, focused, matrixConfig) {
      var move = matrixConfig.cycles() ? ifCycle : ifMove;
      return $_el2q49zljc7tmh27.closest(focused, matrixConfig.selectors().row()).bind(function (inRow) {
        var cellsInRow = $_92hwmyzjjc7tmh1x.descendants(inRow, matrixConfig.selectors().cell());
        return $_9j3q35102jc7tmh7o.findIndex(cellsInRow, focused).bind(function (colIndex) {
          var allRows = $_92hwmyzjjc7tmh1x.descendants(element, matrixConfig.selectors().row());
          return $_9j3q35102jc7tmh7o.findIndex(allRows, inRow).bind(function (rowIndex) {
            var matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(function (next) {
              return next.cell();
            });
          });
        });
      });
    };
  };
  var moveLeft$2 = doMove$2($_af9czw109jc7tmh9e.cycleLeft, $_af9czw109jc7tmh9e.moveLeft);
  var moveRight$2 = doMove$2($_af9czw109jc7tmh9e.cycleRight, $_af9czw109jc7tmh9e.moveRight);
  var moveNorth$1 = doMove$2($_af9czw109jc7tmh9e.cycleUp, $_af9czw109jc7tmh9e.moveUp);
  var moveSouth$1 = doMove$2($_af9czw109jc7tmh9e.cycleDown, $_af9czw109jc7tmh9e.moveDown);
  var getRules$3 = $_7wlbdawajc7tmgej.constant([
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.LEFT()), $_91876a100jc7tmh7i.west(moveLeft$2, moveRight$2)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.RIGHT()), $_91876a100jc7tmh7i.east(moveLeft$2, moveRight$2)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.UP()), $_91876a100jc7tmh7i.north(moveNorth$1)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.DOWN()), $_91876a100jc7tmh7i.south(moveSouth$1)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE().concat($_4hq5r8zdjc7tmgz0.ENTER())), execute$3)
  ]);
  var getEvents$3 = $_7wlbdawajc7tmgej.constant({});
  var getApis$3 = $_7wlbdawajc7tmgej.constant({});
  var MatrixType = $_4ykcvtzejc7tmgz7.typical(schema$4, $_46qvupxpjc7tmgnx.init, getRules$3, getEvents$3, getApis$3, $_7db13lw9jc7tmgee.some(focusIn$2));

  var schema$5 = [
    $_9benqox1jc7tmght.strict('selector'),
    $_9benqox1jc7tmght.defaulted('execute', $_1cjyjhzxjc7tmh6q.defaultExecute),
    $_9benqox1jc7tmght.defaulted('moveOnTab', false)
  ];
  var execute$4 = function (component, simulatedEvent, menuConfig) {
    return menuConfig.focusManager().get(component).bind(function (focused) {
      return menuConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$3 = function (component, menuConfig, simulatedEvent) {
    $_el2q49zljc7tmh27.descendant(component.element(), menuConfig.selector()).each(function (first) {
      menuConfig.focusManager().set(component, first);
    });
  };
  var moveUp$1 = function (element, focused, info) {
    return $_4uhaab107jc7tmh8u.horizontal(element, info.selector(), focused, -1);
  };
  var moveDown$1 = function (element, focused, info) {
    return $_4uhaab107jc7tmh8u.horizontal(element, info.selector(), focused, +1);
  };
  var fireShiftTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_91876a100jc7tmh7i.move(moveUp$1)(component, simulatedEvent, menuConfig) : $_7db13lw9jc7tmgee.none();
  };
  var fireTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_91876a100jc7tmh7i.move(moveDown$1)(component, simulatedEvent, menuConfig) : $_7db13lw9jc7tmgee.none();
  };
  var getRules$4 = $_7wlbdawajc7tmgej.constant([
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.UP()), $_91876a100jc7tmh7i.move(moveUp$1)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.DOWN()), $_91876a100jc7tmh7i.move(moveDown$1)),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
      $_cyegcgzojc7tmh3u.isShift,
      $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
    ]), fireShiftTab),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
      $_cyegcgzojc7tmh3u.isNotShift,
      $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
    ]), fireTab),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER()), execute$4),
    $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE()), execute$4)
  ]);
  var getEvents$4 = $_7wlbdawajc7tmgej.constant({});
  var getApis$4 = $_7wlbdawajc7tmgej.constant({});
  var MenuType = $_4ykcvtzejc7tmgz7.typical(schema$5, $_46qvupxpjc7tmgnx.init, getRules$4, getEvents$4, getApis$4, $_7db13lw9jc7tmgee.some(focusIn$3));

  var schema$6 = [
    $_8vhkewysjc7tmgun.onKeyboardHandler('onSpace'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onEnter'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onShiftEnter'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onLeft'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onRight'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onTab'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onShiftTab'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onUp'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onDown'),
    $_8vhkewysjc7tmgun.onKeyboardHandler('onEscape'),
    $_9benqox1jc7tmght.option('focusIn')
  ];
  var getRules$5 = function (component, simulatedEvent, executeInfo) {
    return [
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE()), executeInfo.onSpace()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isNotShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER())
      ]), executeInfo.onEnter()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ENTER())
      ]), executeInfo.onShiftEnter()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
      ]), executeInfo.onShiftTab()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.and([
        $_cyegcgzojc7tmh3u.isNotShift,
        $_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.TAB())
      ]), executeInfo.onTab()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.UP()), executeInfo.onUp()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.DOWN()), executeInfo.onDown()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.LEFT()), executeInfo.onLeft()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.RIGHT()), executeInfo.onRight()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.SPACE()), executeInfo.onSpace()),
      $_9ylrlrznjc7tmh2y.rule($_cyegcgzojc7tmh3u.inSet($_4hq5r8zdjc7tmgz0.ESCAPE()), executeInfo.onEscape())
    ];
  };
  var focusIn$4 = function (component, executeInfo) {
    return executeInfo.focusIn().bind(function (f) {
      return f(component, executeInfo);
    });
  };
  var getEvents$5 = $_7wlbdawajc7tmgej.constant({});
  var getApis$5 = $_7wlbdawajc7tmgej.constant({});
  var SpecialType = $_4ykcvtzejc7tmgz7.typical(schema$6, $_46qvupxpjc7tmgnx.init, getRules$5, getEvents$5, getApis$5, $_7db13lw9jc7tmgee.some(focusIn$4));

  var $_6ph3zbzajc7tmgyc = {
    acyclic: AcyclicType.schema(),
    cyclic: CyclicType.schema(),
    flow: FlowType.schema(),
    flatgrid: FlatgridType.schema(),
    matrix: MatrixType.schema(),
    execution: ExecutionType.schema(),
    menu: MenuType.schema(),
    special: SpecialType.schema()
  };

  var Keying = $_567rv0w3jc7tmgc6.createModes({
    branchKey: 'mode',
    branches: $_6ph3zbzajc7tmgyc,
    name: 'keying',
    active: {
      events: function (keyingConfig, keyingState) {
        var handler = keyingConfig.handler();
        return handler.toEvents(keyingConfig, keyingState);
      }
    },
    apis: {
      focusIn: function (component) {
        component.getSystem().triggerFocus(component.element(), component.element());
      },
      setGridSize: function (component, keyConfig, keyState, numRows, numColumns) {
        if (!$_ftivuzx5jc7tmgj2.hasKey(keyState, 'setGridSize')) {
          console.error('Layout does not support setGridSize');
        } else {
          keyState.setGridSize(numRows, numColumns);
        }
      }
    },
    state: $_46raq9zzjc7tmh79
  });

  var field$1 = function (name, forbidden) {
    return $_9benqox1jc7tmght.defaultedObjOf(name, {}, $_682tbuw8jc7tmgdz.map(forbidden, function (f) {
      return $_9benqox1jc7tmght.forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name);
    }).concat([$_9benqox1jc7tmght.state('dump', $_7wlbdawajc7tmgej.identity)]));
  };
  var get$5 = function (data) {
    return data.dump();
  };
  var $_qqqz410cjc7tmhaf = {
    field: field$1,
    get: get$5
  };

  var unique = 0;
  var generate$1 = function (prefix) {
    var date = new Date();
    var time = date.getTime();
    var random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + '_' + random + unique + String(time);
  };
  var $_2dzfis10fjc7tmhb2 = { generate: generate$1 };

  var premadeTag = $_2dzfis10fjc7tmhb2.generate('alloy-premade');
  var apiConfig = $_2dzfis10fjc7tmhb2.generate('api');
  var premade = function (comp) {
    return $_ftivuzx5jc7tmgj2.wrap(premadeTag, comp);
  };
  var getPremade = function (spec) {
    return $_ftivuzx5jc7tmgj2.readOptFrom(spec, premadeTag);
  };
  var makeApi = function (f) {
    return $_10ceiixijc7tmgmj.markAsSketchApi(function (component) {
      var args = Array.prototype.slice.call(arguments, 0);
      var spi = component.config(apiConfig);
      return f.apply(undefined, [spi].concat(args));
    }, f);
  };
  var $_eruo9l10ejc7tmhax = {
    apiConfig: $_7wlbdawajc7tmgej.constant(apiConfig),
    makeApi: makeApi,
    premade: premade,
    getPremade: getPremade
  };

  var adt$2 = $_edapatx3jc7tmgi6.generate([
    { required: ['data'] },
    { external: ['data'] },
    { optional: ['data'] },
    { group: ['data'] }
  ]);
  var fFactory = $_9benqox1jc7tmght.defaulted('factory', { sketch: $_7wlbdawajc7tmgej.identity });
  var fSchema = $_9benqox1jc7tmght.defaulted('schema', []);
  var fName = $_9benqox1jc7tmght.strict('name');
  var fPname = $_9benqox1jc7tmght.field('pname', 'pname', $_vby21x2jc7tmgi0.defaultedThunk(function (typeSpec) {
    return '<alloy.' + $_2dzfis10fjc7tmhb2.generate(typeSpec.name) + '>';
  }), $_c1hr3lxgjc7tmgly.anyValue());
  var fDefaults = $_9benqox1jc7tmght.defaulted('defaults', $_7wlbdawajc7tmgej.constant({}));
  var fOverrides = $_9benqox1jc7tmght.defaulted('overrides', $_7wlbdawajc7tmgej.constant({}));
  var requiredSpec = $_c1hr3lxgjc7tmgly.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var externalSpec = $_c1hr3lxgjc7tmgly.objOf([
    fFactory,
    fSchema,
    fName,
    fDefaults,
    fOverrides
  ]);
  var optionalSpec = $_c1hr3lxgjc7tmgly.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var groupSpec = $_c1hr3lxgjc7tmgly.objOf([
    fFactory,
    fSchema,
    fName,
    $_9benqox1jc7tmght.strict('unit'),
    fPname,
    fDefaults,
    fOverrides
  ]);
  var asNamedPart = function (part) {
    return part.fold($_7db13lw9jc7tmgee.some, $_7db13lw9jc7tmgee.none, $_7db13lw9jc7tmgee.some, $_7db13lw9jc7tmgee.some);
  };
  var name$1 = function (part) {
    var get = function (data) {
      return data.name();
    };
    return part.fold(get, get, get, get);
  };
  var asCommon = function (part) {
    return part.fold($_7wlbdawajc7tmgej.identity, $_7wlbdawajc7tmgej.identity, $_7wlbdawajc7tmgej.identity, $_7wlbdawajc7tmgej.identity);
  };
  var convert = function (adtConstructor, partSpec) {
    return function (spec) {
      var data = $_c1hr3lxgjc7tmgly.asStructOrDie('Converting part type', partSpec, spec);
      return adtConstructor(data);
    };
  };
  var $_61s39h10jjc7tmhc6 = {
    required: convert(adt$2.required, requiredSpec),
    external: convert(adt$2.external, externalSpec),
    optional: convert(adt$2.optional, optionalSpec),
    group: convert(adt$2.group, groupSpec),
    asNamedPart: asNamedPart,
    name: name$1,
    asCommon: asCommon,
    original: $_7wlbdawajc7tmgej.constant('entirety')
  };

  var placeholder = 'placeholder';
  var adt$3 = $_edapatx3jc7tmgi6.generate([
    {
      single: [
        'required',
        'valueThunk'
      ]
    },
    {
      multiple: [
        'required',
        'valueThunks'
      ]
    }
  ]);
  var isSubstitute = function (uiType) {
    return $_682tbuw8jc7tmgdz.contains([placeholder], uiType);
  };
  var subPlaceholder = function (owner, detail, compSpec, placeholders) {
    if (owner.exists(function (o) {
        return o !== compSpec.owner;
      }))
      return adt$3.single(true, $_7wlbdawajc7tmgej.constant(compSpec));
    return $_ftivuzx5jc7tmgj2.readOptFrom(placeholders, compSpec.name).fold(function () {
      throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + $_fvv1p1wzjc7tmgh1.keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + $_7meawbxejc7tmglk.stringify(compSpec, null, 2));
    }, function (newSpec) {
      return newSpec.replace();
    });
  };
  var scan = function (owner, detail, compSpec, placeholders) {
    if (compSpec.uiType === placeholder)
      return subPlaceholder(owner, detail, compSpec, placeholders);
    else
      return adt$3.single(false, $_7wlbdawajc7tmgej.constant(compSpec));
  };
  var substitute = function (owner, detail, compSpec, placeholders) {
    var base = scan(owner, detail, compSpec, placeholders);
    return base.fold(function (req, valueThunk) {
      var value = valueThunk(detail, compSpec.config, compSpec.validated);
      var childSpecs = $_ftivuzx5jc7tmgj2.readOptFrom(value, 'components').getOr([]);
      var substituted = $_682tbuw8jc7tmgdz.bind(childSpecs, function (c) {
        return substitute(owner, detail, c, placeholders);
      });
      return [$_2nfiamwxjc7tmggx.deepMerge(value, { components: substituted })];
    }, function (req, valuesThunk) {
      var values = valuesThunk(detail, compSpec.config, compSpec.validated);
      return values;
    });
  };
  var substituteAll = function (owner, detail, components, placeholders) {
    return $_682tbuw8jc7tmgdz.bind(components, function (c) {
      return substitute(owner, detail, c, placeholders);
    });
  };
  var oneReplace = function (label, replacements) {
    var called = false;
    var used = function () {
      return called;
    };
    var replace = function () {
      if (called === true)
        throw new Error('Trying to use the same placeholder more than once: ' + label);
      called = true;
      return replacements;
    };
    var required = function () {
      return replacements.fold(function (req, _) {
        return req;
      }, function (req, _) {
        return req;
      });
    };
    return {
      name: $_7wlbdawajc7tmgej.constant(label),
      required: required,
      used: used,
      replace: replace
    };
  };
  var substitutePlaces = function (owner, detail, components, placeholders) {
    var ps = $_fvv1p1wzjc7tmgh1.map(placeholders, function (ph, name) {
      return oneReplace(name, ph);
    });
    var outcome = substituteAll(owner, detail, components, ps);
    $_fvv1p1wzjc7tmgh1.each(ps, function (p) {
      if (p.used() === false && p.required()) {
        throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + $_7meawbxejc7tmglk.stringify(detail.components(), null, 2));
      }
    });
    return outcome;
  };
  var singleReplace = function (detail, p) {
    var replacement = p;
    return replacement.fold(function (req, valueThunk) {
      return [valueThunk(detail)];
    }, function (req, valuesThunk) {
      return valuesThunk(detail);
    });
  };
  var $_d806nv10kjc7tmhcq = {
    single: adt$3.single,
    multiple: adt$3.multiple,
    isSubstitute: isSubstitute,
    placeholder: $_7wlbdawajc7tmgej.constant(placeholder),
    substituteAll: substituteAll,
    substitutePlaces: substitutePlaces,
    singleReplace: singleReplace
  };

  var combine = function (detail, data, partSpec, partValidated) {
    var spec = partSpec;
    return $_2nfiamwxjc7tmggx.deepMerge(data.defaults()(detail, partSpec, partValidated), partSpec, { uid: detail.partUids()[data.name()] }, data.overrides()(detail, partSpec, partValidated), { 'debug.sketcher': $_ftivuzx5jc7tmgj2.wrap('part-' + data.name(), spec) });
  };
  var subs = function (owner, detail, parts) {
    var internals = {};
    var externals = {};
    $_682tbuw8jc7tmgdz.each(parts, function (part) {
      part.fold(function (data) {
        internals[data.pname()] = $_d806nv10kjc7tmhcq.single(true, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        var partSpec = detail.parts()[data.name()]();
        externals[data.name()] = $_7wlbdawajc7tmgej.constant(combine(detail, data, partSpec[$_61s39h10jjc7tmhc6.original()]()));
      }, function (data) {
        internals[data.pname()] = $_d806nv10kjc7tmhcq.single(false, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        internals[data.pname()] = $_d806nv10kjc7tmhcq.multiple(true, function (detail, _partSpec, _partValidated) {
          var units = detail[data.name()]();
          return $_682tbuw8jc7tmgdz.map(units, function (u) {
            return data.factory().sketch($_2nfiamwxjc7tmggx.deepMerge(data.defaults()(detail, u), u, data.overrides()(detail, u)));
          });
        });
      });
    });
    return {
      internals: $_7wlbdawajc7tmgej.constant(internals),
      externals: $_7wlbdawajc7tmgej.constant(externals)
    };
  };
  var $_agnrb510ijc7tmhby = { subs: subs };

  var generate$2 = function (owner, parts) {
    var r = {};
    $_682tbuw8jc7tmgdz.each(parts, function (part) {
      $_61s39h10jjc7tmhc6.asNamedPart(part).each(function (np) {
        var g = doGenerateOne(owner, np.pname());
        r[np.name()] = function (config) {
          var validated = $_c1hr3lxgjc7tmgly.asRawOrDie('Part: ' + np.name() + ' in ' + owner, $_c1hr3lxgjc7tmgly.objOf(np.schema()), config);
          return $_2nfiamwxjc7tmggx.deepMerge(g, {
            config: config,
            validated: validated
          });
        };
      });
    });
    return r;
  };
  var doGenerateOne = function (owner, pname) {
    return {
      uiType: $_d806nv10kjc7tmhcq.placeholder(),
      owner: owner,
      name: pname
    };
  };
  var generateOne = function (owner, pname, config) {
    return {
      uiType: $_d806nv10kjc7tmhcq.placeholder(),
      owner: owner,
      name: pname,
      config: config,
      validated: {}
    };
  };
  var schemas = function (parts) {
    return $_682tbuw8jc7tmgdz.bind(parts, function (part) {
      return part.fold($_7db13lw9jc7tmgee.none, $_7db13lw9jc7tmgee.some, $_7db13lw9jc7tmgee.none, $_7db13lw9jc7tmgee.none).map(function (data) {
        return $_9benqox1jc7tmght.strictObjOf(data.name(), data.schema().concat([$_8vhkewysjc7tmgun.snapshot($_61s39h10jjc7tmhc6.original())]));
      }).toArray();
    });
  };
  var names = function (parts) {
    return $_682tbuw8jc7tmgdz.map(parts, $_61s39h10jjc7tmhc6.name);
  };
  var substitutes = function (owner, detail, parts) {
    return $_agnrb510ijc7tmhby.subs(owner, detail, parts);
  };
  var components = function (owner, detail, internals) {
    return $_d806nv10kjc7tmhcq.substitutePlaces($_7db13lw9jc7tmgee.some(owner), detail, detail.components(), internals);
  };
  var getPart = function (component, detail, partKey) {
    var uid = detail.partUids()[partKey];
    return component.getSystem().getByUid(uid).toOption();
  };
  var getPartOrDie = function (component, detail, partKey) {
    return getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
  };
  var getParts = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_682tbuw8jc7tmgdz.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]);
    });
    return $_fvv1p1wzjc7tmgh1.map(r, $_7wlbdawajc7tmgej.constant);
  };
  var getAllParts = function (component, detail) {
    var system = component.getSystem();
    return $_fvv1p1wzjc7tmgh1.map(detail.partUids(), function (pUid, k) {
      return $_7wlbdawajc7tmgej.constant(system.getByUid(pUid));
    });
  };
  var getPartsOrDie = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_682tbuw8jc7tmgdz.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]).getOrDie();
    });
    return $_fvv1p1wzjc7tmgh1.map(r, $_7wlbdawajc7tmgej.constant);
  };
  var defaultUids = function (baseUid, partTypes) {
    var partNames = names(partTypes);
    return $_ftivuzx5jc7tmgj2.wrapAll($_682tbuw8jc7tmgdz.map(partNames, function (pn) {
      return {
        key: pn,
        value: baseUid + '-' + pn
      };
    }));
  };
  var defaultUidsSchema = function (partTypes) {
    return $_9benqox1jc7tmght.field('partUids', 'partUids', $_vby21x2jc7tmgi0.mergeWithThunk(function (spec) {
      return defaultUids(spec.uid, partTypes);
    }), $_c1hr3lxgjc7tmgly.anyValue());
  };
  var $_dz5zok10hjc7tmhbg = {
    generate: generate$2,
    generateOne: generateOne,
    schemas: schemas,
    names: names,
    substitutes: substitutes,
    components: components,
    defaultUids: defaultUids,
    defaultUidsSchema: defaultUidsSchema,
    getAllParts: getAllParts,
    getPart: getPart,
    getPartOrDie: getPartOrDie,
    getParts: getParts,
    getPartsOrDie: getPartsOrDie
  };

  var prefix$2 = 'alloy-id-';
  var idAttr$1 = 'data-alloy-id';
  var $_cdpbme10mjc7tmhdj = {
    prefix: $_7wlbdawajc7tmgej.constant(prefix$2),
    idAttr: $_7wlbdawajc7tmgej.constant(idAttr$1)
  };

  var prefix$1 = $_cdpbme10mjc7tmhdj.prefix();
  var idAttr = $_cdpbme10mjc7tmhdj.idAttr();
  var write = function (label, elem) {
    var id = $_2dzfis10fjc7tmhb2.generate(prefix$1 + label);
    $_gh0zlbxvjc7tmgol.set(elem, idAttr, id);
    return id;
  };
  var writeOnly = function (elem, uid) {
    $_gh0zlbxvjc7tmgol.set(elem, idAttr, uid);
  };
  var read$2 = function (elem) {
    var id = $_e44ar2xwjc7tmgp4.isElement(elem) ? $_gh0zlbxvjc7tmgol.get(elem, idAttr) : null;
    return $_7db13lw9jc7tmgee.from(id);
  };
  var find$3 = function (container, id) {
    return $_el2q49zljc7tmh27.descendant(container, id);
  };
  var generate$3 = function (prefix) {
    return $_2dzfis10fjc7tmhb2.generate(prefix);
  };
  var revoke = function (elem) {
    $_gh0zlbxvjc7tmgol.remove(elem, idAttr);
  };
  var $_95kbix10ljc7tmhd8 = {
    revoke: revoke,
    write: write,
    writeOnly: writeOnly,
    read: read$2,
    find: find$3,
    generate: generate$3,
    attribute: $_7wlbdawajc7tmgej.constant(idAttr)
  };

  var getPartsSchema = function (partNames, _optPartNames, _owner) {
    var owner = _owner !== undefined ? _owner : 'Unknown owner';
    var fallbackThunk = function () {
      return [$_8vhkewysjc7tmgun.output('partUids', {})];
    };
    var optPartNames = _optPartNames !== undefined ? _optPartNames : fallbackThunk();
    if (partNames.length === 0 && optPartNames.length === 0)
      return fallbackThunk();
    var partsSchema = $_9benqox1jc7tmght.strictObjOf('parts', $_682tbuw8jc7tmgdz.flatten([
      $_682tbuw8jc7tmgdz.map(partNames, $_9benqox1jc7tmght.strict),
      $_682tbuw8jc7tmgdz.map(optPartNames, function (optPart) {
        return $_9benqox1jc7tmght.defaulted(optPart, $_d806nv10kjc7tmhcq.single(false, function () {
          throw new Error('The optional part: ' + optPart + ' was not specified in the config, but it was used in components');
        }));
      })
    ]));
    var partUidsSchema = $_9benqox1jc7tmght.state('partUids', function (spec) {
      if (!$_ftivuzx5jc7tmgj2.hasKey(spec, 'parts')) {
        throw new Error('Part uid definition for owner: ' + owner + ' requires "parts"\nExpected parts: ' + partNames.join(', ') + '\nSpec: ' + $_7meawbxejc7tmglk.stringify(spec, null, 2));
      }
      var uids = $_fvv1p1wzjc7tmgh1.map(spec.parts, function (v, k) {
        return $_ftivuzx5jc7tmgj2.readOptFrom(v, 'uid').getOrThunk(function () {
          return spec.uid + '-' + k;
        });
      });
      return uids;
    });
    return [
      partsSchema,
      partUidsSchema
    ];
  };
  var base$1 = function (label, partSchemas, partUidsSchemas, spec) {
    var ps = partSchemas.length > 0 ? [$_9benqox1jc7tmght.strictObjOf('parts', partSchemas)] : [];
    return ps.concat([
      $_9benqox1jc7tmght.strict('uid'),
      $_9benqox1jc7tmght.defaulted('dom', {}),
      $_9benqox1jc7tmght.defaulted('components', []),
      $_8vhkewysjc7tmgun.snapshot('originalSpec'),
      $_9benqox1jc7tmght.defaulted('debug.sketcher', {})
    ]).concat(partUidsSchemas);
  };
  var asRawOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, spec, partUidsSchemas);
    return $_c1hr3lxgjc7tmgly.asRawOrDie(label + ' [SpecSchema]', $_c1hr3lxgjc7tmgly.objOfOnly(baseS.concat(schema)), spec);
  };
  var asStructOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, partUidsSchemas, spec);
    return $_c1hr3lxgjc7tmgly.asStructOrDie(label + ' [SpecSchema]', $_c1hr3lxgjc7tmgly.objOfOnly(baseS.concat(schema)), spec);
  };
  var extend = function (builder, original, nu) {
    var newSpec = $_2nfiamwxjc7tmggx.deepMerge(original, nu);
    return builder(newSpec);
  };
  var addBehaviours = function (original, behaviours) {
    return $_2nfiamwxjc7tmggx.deepMerge(original, behaviours);
  };
  var $_6wfgw110njc7tmhdo = {
    asRawOrDie: asRawOrDie$1,
    asStructOrDie: asStructOrDie$1,
    addBehaviours: addBehaviours,
    getPartsSchema: getPartsSchema,
    extend: extend
  };

  var single$1 = function (owner, schema, factory, spec) {
    var specWithUid = supplyUid(spec);
    var detail = $_6wfgw110njc7tmhdo.asStructOrDie(owner, schema, specWithUid, [], []);
    return $_2nfiamwxjc7tmggx.deepMerge(factory(detail, specWithUid), { 'debug.sketcher': $_ftivuzx5jc7tmgj2.wrap(owner, spec) });
  };
  var composite$1 = function (owner, schema, partTypes, factory, spec) {
    var specWithUid = supplyUid(spec);
    var partSchemas = $_dz5zok10hjc7tmhbg.schemas(partTypes);
    var partUidsSchema = $_dz5zok10hjc7tmhbg.defaultUidsSchema(partTypes);
    var detail = $_6wfgw110njc7tmhdo.asStructOrDie(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
    var subs = $_dz5zok10hjc7tmhbg.substitutes(owner, detail, partTypes);
    var components = $_dz5zok10hjc7tmhbg.components(owner, detail, subs.internals());
    return $_2nfiamwxjc7tmggx.deepMerge(factory(detail, components, specWithUid, subs.externals()), { 'debug.sketcher': $_ftivuzx5jc7tmgj2.wrap(owner, spec) });
  };
  var supplyUid = function (spec) {
    return $_2nfiamwxjc7tmggx.deepMerge({ uid: $_95kbix10ljc7tmhd8.generate('uid') }, spec);
  };
  var $_4mws1710gjc7tmhb6 = {
    supplyUid: supplyUid,
    single: single$1,
    composite: composite$1
  };

  var singleSchema = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strict('name'),
    $_9benqox1jc7tmght.strict('factory'),
    $_9benqox1jc7tmght.strict('configFields'),
    $_9benqox1jc7tmght.defaulted('apis', {}),
    $_9benqox1jc7tmght.defaulted('extraApis', {})
  ]);
  var compositeSchema = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strict('name'),
    $_9benqox1jc7tmght.strict('factory'),
    $_9benqox1jc7tmght.strict('configFields'),
    $_9benqox1jc7tmght.strict('partFields'),
    $_9benqox1jc7tmght.defaulted('apis', {}),
    $_9benqox1jc7tmght.defaulted('extraApis', {})
  ]);
  var single = function (rawConfig) {
    var config = $_c1hr3lxgjc7tmgly.asRawOrDie('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
    var sketch = function (spec) {
      return $_4mws1710gjc7tmhb6.single(config.name, config.configFields, config.factory, spec);
    };
    var apis = $_fvv1p1wzjc7tmgh1.map(config.apis, $_eruo9l10ejc7tmhax.makeApi);
    var extraApis = $_fvv1p1wzjc7tmgh1.map(config.extraApis, function (f, k) {
      return $_10ceiixijc7tmgmj.markAsExtraApi(f, k);
    });
    return $_2nfiamwxjc7tmggx.deepMerge({
      name: $_7wlbdawajc7tmgej.constant(config.name),
      partFields: $_7wlbdawajc7tmgej.constant([]),
      configFields: $_7wlbdawajc7tmgej.constant(config.configFields),
      sketch: sketch
    }, apis, extraApis);
  };
  var composite = function (rawConfig) {
    var config = $_c1hr3lxgjc7tmgly.asRawOrDie('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
    var sketch = function (spec) {
      return $_4mws1710gjc7tmhb6.composite(config.name, config.configFields, config.partFields, config.factory, spec);
    };
    var parts = $_dz5zok10hjc7tmhbg.generate(config.name, config.partFields);
    var apis = $_fvv1p1wzjc7tmgh1.map(config.apis, $_eruo9l10ejc7tmhax.makeApi);
    var extraApis = $_fvv1p1wzjc7tmgh1.map(config.extraApis, function (f, k) {
      return $_10ceiixijc7tmgmj.markAsExtraApi(f, k);
    });
    return $_2nfiamwxjc7tmggx.deepMerge({
      name: $_7wlbdawajc7tmgej.constant(config.name),
      partFields: $_7wlbdawajc7tmgej.constant(config.partFields),
      configFields: $_7wlbdawajc7tmgej.constant(config.configFields),
      sketch: sketch,
      parts: $_7wlbdawajc7tmgej.constant(parts)
    }, apis, extraApis);
  };
  var $_2r0fok10djc7tmham = {
    single: single,
    composite: composite
  };

  var events$4 = function (optAction) {
    var executeHandler = function (action) {
      return $_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.execute(), function (component, simulatedEvent) {
        action(component);
        simulatedEvent.stop();
      });
    };
    var onClick = function (component, simulatedEvent) {
      simulatedEvent.stop();
      $_7zx0zrwujc7tmgge.emitExecute(component);
    };
    var onMousedown = function (component, simulatedEvent) {
      simulatedEvent.cut();
    };
    var pointerEvents = $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch() ? [$_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.tap(), onClick)] : [
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.click(), onClick),
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mousedown(), onMousedown)
    ];
    return $_3oclftw5jc7tmgdb.derive($_682tbuw8jc7tmgdz.flatten([
      optAction.map(executeHandler).toArray(),
      pointerEvents
    ]));
  };
  var $_fsxixf10ojc7tmhe0 = { events: events$4 };

  var factory = function (detail, spec) {
    var events = $_fsxixf10ojc7tmhe0.events(detail.action());
    var optType = $_ftivuzx5jc7tmgj2.readOptFrom(detail.dom(), 'attributes').bind($_ftivuzx5jc7tmgj2.readOpt('type'));
    var optTag = $_ftivuzx5jc7tmgj2.readOptFrom(detail.dom(), 'tag');
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: detail.components(),
      events: events,
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
        Focusing.config({}),
        Keying.config({
          mode: 'execution',
          useSpace: true,
          useEnter: true
        })
      ]), $_qqqz410cjc7tmhaf.get(detail.buttonBehaviours())),
      domModification: {
        attributes: $_2nfiamwxjc7tmggx.deepMerge(optType.fold(function () {
          return optTag.is('button') ? { type: 'button' } : {};
        }, function (t) {
          return {};
        }), { role: detail.role().getOr('button') })
      },
      eventOrder: detail.eventOrder()
    };
  };
  var Button = $_2r0fok10djc7tmham.single({
    name: 'Button',
    factory: factory,
    configFields: [
      $_9benqox1jc7tmght.defaulted('uid', undefined),
      $_9benqox1jc7tmght.strict('dom'),
      $_9benqox1jc7tmght.defaulted('components', []),
      $_qqqz410cjc7tmhaf.field('buttonBehaviours', [
        Focusing,
        Keying
      ]),
      $_9benqox1jc7tmght.option('action'),
      $_9benqox1jc7tmght.option('role'),
      $_9benqox1jc7tmght.defaulted('eventOrder', {})
    ]
  });

  var getAttrs = function (elem) {
    var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [];
    return $_682tbuw8jc7tmgdz.foldl(attributes, function (b, attr) {
      if (attr.name === 'class')
        return b;
      else
        return $_2nfiamwxjc7tmggx.deepMerge(b, $_ftivuzx5jc7tmgj2.wrap(attr.name, attr.value));
    }, {});
  };
  var getClasses = function (elem) {
    return Array.prototype.slice.call(elem.dom().classList, 0);
  };
  var fromHtml$2 = function (html) {
    var elem = $_19g44bwsjc7tmgg6.fromHtml(html);
    var children = $_bvq6n5y2jc7tmgq7.children(elem);
    var attrs = getAttrs(elem);
    var classes = getClasses(elem);
    var contents = children.length === 0 ? {} : { innerHtml: $_fi4lz2yajc7tmgrr.get(elem) };
    return $_2nfiamwxjc7tmggx.deepMerge({
      tag: $_e44ar2xwjc7tmgp4.name(elem),
      classes: classes,
      attributes: attrs
    }, contents);
  };
  var sketch = function (sketcher, html, config) {
    return sketcher.sketch($_2nfiamwxjc7tmggx.deepMerge({ dom: fromHtml$2(html) }, config));
  };
  var $_85rlv610qjc7tmhef = {
    fromHtml: fromHtml$2,
    sketch: sketch
  };

  var dom$1 = function (rawHtml) {
    var html = $_cao7towojc7tmgfu.supplant(rawHtml, { 'prefix': $_fej2h3z0jc7tmgwt.prefix() });
    return $_85rlv610qjc7tmhef.fromHtml(html);
  };
  var spec = function (rawHtml) {
    var sDom = dom$1(rawHtml);
    return { dom: sDom };
  };
  var $_c7exbi10pjc7tmhe8 = {
    dom: dom$1,
    spec: spec
  };

  var forToolbarCommand = function (editor, command) {
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, {});
  };
  var getToggleBehaviours = function (command) {
    return $_567rv0w3jc7tmgc6.derive([
      Toggling.config({
        toggleClass: $_fej2h3z0jc7tmgwt.resolve('toolbar-button-selected'),
        toggleOnExecute: false,
        aria: { mode: 'pressed' }
      }),
      $_c7bmb0yzjc7tmgwp.format(command, function (button, status) {
        var toggle = status ? Toggling.on : Toggling.off;
        toggle(button);
      })
    ]);
  };
  var forToolbarStateCommand = function (editor, command) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, extraBehaviours);
  };
  var forToolbarStateAction = function (editor, clazz, command, action) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(clazz, action, extraBehaviours);
  };
  var forToolbar = function (clazz, action, extraBehaviours) {
    return Button.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-' + clazz + ' ${prefix}-icon"></span>'),
      action: action,
      buttonBehaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([Unselecting.config({})]), extraBehaviours)
    });
  };
  var $_3zi4bwz1jc7tmgwv = {
    forToolbar: forToolbar,
    forToolbarCommand: forToolbarCommand,
    forToolbarStateAction: forToolbarStateAction,
    forToolbarStateCommand: forToolbarStateCommand
  };

  var reduceBy = function (value, min, max, step) {
    if (value < min)
      return value;
    else if (value > max)
      return max;
    else if (value === min)
      return min - 1;
    else
      return Math.max(min, value - step);
  };
  var increaseBy = function (value, min, max, step) {
    if (value > max)
      return value;
    else if (value < min)
      return min;
    else if (value === max)
      return max + 1;
    else
      return Math.min(max, value + step);
  };
  var capValue = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };
  var snapValueOfX = function (bounds, value, min, max, step, snapStart) {
    return snapStart.fold(function () {
      var initValue = value - min;
      var extraValue = Math.round(initValue / step) * step;
      return capValue(min + extraValue, min - 1, max + 1);
    }, function (start) {
      var remainder = (value - start) % step;
      var adjustment = Math.round(remainder / step);
      var rawSteps = Math.floor((value - start) / step);
      var maxSteps = Math.floor((max - start) / step);
      var numSteps = Math.min(maxSteps, rawSteps + adjustment);
      var r = start + numSteps * step;
      return Math.max(start, r);
    });
  };
  var findValueOfX = function (bounds, min, max, xValue, step, snapToGrid, snapStart) {
    var range = max - min;
    if (xValue < bounds.left)
      return min - 1;
    else if (xValue > bounds.right)
      return max + 1;
    else {
      var xOffset = Math.min(bounds.right, Math.max(xValue, bounds.left)) - bounds.left;
      var newValue = capValue(xOffset / bounds.width * range + min, min - 1, max + 1);
      var roundedValue = Math.round(newValue);
      return snapToGrid && newValue >= min && newValue <= max ? snapValueOfX(bounds, newValue, min, max, step, snapStart) : roundedValue;
    }
  };
  var $_563ctg10vjc7tmhfy = {
    reduceBy: reduceBy,
    increaseBy: increaseBy,
    findValueOfX: findValueOfX
  };

  var changeEvent = 'slider.change.value';
  var isTouch$1 = $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch();
  var getEventSource = function (simulatedEvent) {
    var evt = simulatedEvent.event().raw();
    if (isTouch$1 && evt.touches !== undefined && evt.touches.length === 1)
      return $_7db13lw9jc7tmgee.some(evt.touches[0]);
    else if (isTouch$1 && evt.touches !== undefined)
      return $_7db13lw9jc7tmgee.none();
    else if (!isTouch$1 && evt.clientX !== undefined)
      return $_7db13lw9jc7tmgee.some(evt);
    else
      return $_7db13lw9jc7tmgee.none();
  };
  var getEventX = function (simulatedEvent) {
    var spot = getEventSource(simulatedEvent);
    return spot.map(function (s) {
      return s.clientX;
    });
  };
  var fireChange = function (component, value) {
    $_7zx0zrwujc7tmgge.emitWith(component, changeEvent, { value: value });
  };
  var moveRightFromLedge = function (ledge, detail) {
    fireChange(ledge, detail.min());
  };
  var moveLeftFromRedge = function (redge, detail) {
    fireChange(redge, detail.max());
  };
  var setToRedge = function (redge, detail) {
    fireChange(redge, detail.max() + 1);
  };
  var setToLedge = function (ledge, detail) {
    fireChange(ledge, detail.min() - 1);
  };
  var setToX = function (spectrum, spectrumBounds, detail, xValue) {
    var value = $_563ctg10vjc7tmhfy.findValueOfX(spectrumBounds, detail.min(), detail.max(), xValue, detail.stepSize(), detail.snapToGrid(), detail.snapStart());
    fireChange(spectrum, value);
  };
  var setXFromEvent = function (spectrum, detail, spectrumBounds, simulatedEvent) {
    return getEventX(simulatedEvent).map(function (xValue) {
      setToX(spectrum, spectrumBounds, detail, xValue);
      return xValue;
    });
  };
  var moveLeft$4 = function (spectrum, detail) {
    var newValue = $_563ctg10vjc7tmhfy.reduceBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var moveRight$4 = function (spectrum, detail) {
    var newValue = $_563ctg10vjc7tmhfy.increaseBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var $_dsmk5710ujc7tmhfo = {
    setXFromEvent: setXFromEvent,
    setToLedge: setToLedge,
    setToRedge: setToRedge,
    moveLeftFromRedge: moveLeftFromRedge,
    moveRightFromLedge: moveRightFromLedge,
    moveLeft: moveLeft$4,
    moveRight: moveRight$4,
    changeEvent: $_7wlbdawajc7tmgej.constant(changeEvent)
  };

  var platform = $_9tl8l8wfjc7tmgez.detect();
  var isTouch = platform.deviceType.isTouch();
  var edgePart = function (name, action) {
    return $_61s39h10jjc7tmhc6.optional({
      name: '' + name + '-edge',
      overrides: function (detail) {
        var touchEvents = $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.runActionExtra($_dpjvxuwwjc7tmggu.touchstart(), action, [detail])]);
        var mouseEvents = $_3oclftw5jc7tmgdb.derive([
          $_3oclftw5jc7tmgdb.runActionExtra($_dpjvxuwwjc7tmggu.mousedown(), action, [detail]),
          $_3oclftw5jc7tmgdb.runActionExtra($_dpjvxuwwjc7tmggu.mousemove(), function (l, det) {
            if (det.mouseIsDown().get())
              action(l, det);
          }, [detail])
        ]);
        return { events: isTouch ? touchEvents : mouseEvents };
      }
    });
  };
  var ledgePart = edgePart('left', $_dsmk5710ujc7tmhfo.setToLedge);
  var redgePart = edgePart('right', $_dsmk5710ujc7tmhfo.setToRedge);
  var thumbPart = $_61s39h10jjc7tmhc6.required({
    name: 'thumb',
    defaults: $_7wlbdawajc7tmgej.constant({ dom: { styles: { position: 'absolute' } } }),
    overrides: function (detail) {
      return {
        events: $_3oclftw5jc7tmgdb.derive([
          $_3oclftw5jc7tmgdb.redirectToPart($_dpjvxuwwjc7tmggu.touchstart(), detail, 'spectrum'),
          $_3oclftw5jc7tmgdb.redirectToPart($_dpjvxuwwjc7tmggu.touchmove(), detail, 'spectrum'),
          $_3oclftw5jc7tmgdb.redirectToPart($_dpjvxuwwjc7tmggu.touchend(), detail, 'spectrum')
        ])
      };
    }
  });
  var spectrumPart = $_61s39h10jjc7tmhc6.required({
    schema: [$_9benqox1jc7tmght.state('mouseIsDown', function () {
        return Cell(false);
      })],
    name: 'spectrum',
    overrides: function (detail) {
      var moveToX = function (spectrum, simulatedEvent) {
        var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
        $_dsmk5710ujc7tmhfo.setXFromEvent(spectrum, detail, spectrumBounds, simulatedEvent);
      };
      var touchEvents = $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchstart(), moveToX),
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchmove(), moveToX)
      ]);
      var mouseEvents = $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mousedown(), moveToX),
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mousemove(), function (spectrum, se) {
          if (detail.mouseIsDown().get())
            moveToX(spectrum, se);
        })
      ]);
      return {
        behaviours: $_567rv0w3jc7tmgc6.derive(isTouch ? [] : [
          Keying.config({
            mode: 'special',
            onLeft: function (spectrum) {
              $_dsmk5710ujc7tmhfo.moveLeft(spectrum, detail);
              return $_7db13lw9jc7tmgee.some(true);
            },
            onRight: function (spectrum) {
              $_dsmk5710ujc7tmhfo.moveRight(spectrum, detail);
              return $_7db13lw9jc7tmgee.some(true);
            }
          }),
          Focusing.config({})
        ]),
        events: isTouch ? touchEvents : mouseEvents
      };
    }
  });
  var SliderParts = [
    ledgePart,
    redgePart,
    thumbPart,
    spectrumPart
  ];

  var onLoad$1 = function (component, repConfig, repState) {
    repConfig.store().manager().onLoad(component, repConfig, repState);
  };
  var onUnload = function (component, repConfig, repState) {
    repConfig.store().manager().onUnload(component, repConfig, repState);
  };
  var setValue = function (component, repConfig, repState, data) {
    repConfig.store().manager().setValue(component, repConfig, repState, data);
  };
  var getValue = function (component, repConfig, repState) {
    return repConfig.store().manager().getValue(component, repConfig, repState);
  };
  var $_1s8oyn10zjc7tmhgl = {
    onLoad: onLoad$1,
    onUnload: onUnload,
    setValue: setValue,
    getValue: getValue
  };

  var events$5 = function (repConfig, repState) {
    var es = repConfig.resetOnDom() ? [
      $_3oclftw5jc7tmgdb.runOnAttached(function (comp, se) {
        $_1s8oyn10zjc7tmhgl.onLoad(comp, repConfig, repState);
      }),
      $_3oclftw5jc7tmgdb.runOnDetached(function (comp, se) {
        $_1s8oyn10zjc7tmhgl.onUnload(comp, repConfig, repState);
      })
    ] : [$_ivrpyw4jc7tmgco.loadEvent(repConfig, repState, $_1s8oyn10zjc7tmhgl.onLoad)];
    return $_3oclftw5jc7tmgdb.derive(es);
  };
  var $_6xoazc10yjc7tmhgg = { events: events$5 };

  var memory = function () {
    var data = Cell(null);
    var readState = function () {
      return {
        mode: 'memory',
        value: data.get()
      };
    };
    var isNotSet = function () {
      return data.get() === null;
    };
    var clear = function () {
      data.set(null);
    };
    return BehaviourState({
      set: data.set,
      get: data.get,
      isNotSet: isNotSet,
      clear: clear,
      readState: readState
    });
  };
  var manual = function () {
    var readState = function () {
    };
    return BehaviourState({ readState: readState });
  };
  var dataset = function () {
    var data = Cell({});
    var readState = function () {
      return {
        mode: 'dataset',
        dataset: data.get()
      };
    };
    return BehaviourState({
      readState: readState,
      set: data.set,
      get: data.get
    });
  };
  var init$2 = function (spec) {
    return spec.store().manager().state(spec);
  };
  var $_fsihhc112jc7tmhh6 = {
    memory: memory,
    dataset: dataset,
    manual: manual,
    init: init$2
  };

  var setValue$1 = function (component, repConfig, repState, data) {
    var dataKey = repConfig.store().getDataKey();
    repState.set({});
    repConfig.store().setData()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$1 = function (component, repConfig, repState) {
    var key = repConfig.store().getDataKey()(component);
    var dataset = repState.get();
    return $_ftivuzx5jc7tmgj2.readOptFrom(dataset, key).fold(function () {
      return repConfig.store().getFallbackEntry()(key);
    }, function (data) {
      return data;
    });
  };
  var onLoad$2 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      setValue$1(component, repConfig, repState, data);
    });
  };
  var onUnload$1 = function (component, repConfig, repState) {
    repState.set({});
  };
  var DatasetStore = [
    $_9benqox1jc7tmght.option('initialValue'),
    $_9benqox1jc7tmght.strict('getFallbackEntry'),
    $_9benqox1jc7tmght.strict('getDataKey'),
    $_9benqox1jc7tmght.strict('setData'),
    $_8vhkewysjc7tmgun.output('manager', {
      setValue: setValue$1,
      getValue: getValue$1,
      onLoad: onLoad$2,
      onUnload: onUnload$1,
      state: $_fsihhc112jc7tmhh6.dataset
    })
  ];

  var getValue$2 = function (component, repConfig, repState) {
    return repConfig.store().getValue()(component);
  };
  var setValue$2 = function (component, repConfig, repState, data) {
    repConfig.store().setValue()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var onLoad$3 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      repConfig.store().setValue()(component, data);
    });
  };
  var ManualStore = [
    $_9benqox1jc7tmght.strict('getValue'),
    $_9benqox1jc7tmght.defaulted('setValue', $_7wlbdawajc7tmgej.noop),
    $_9benqox1jc7tmght.option('initialValue'),
    $_8vhkewysjc7tmgun.output('manager', {
      setValue: setValue$2,
      getValue: getValue$2,
      onLoad: onLoad$3,
      onUnload: $_7wlbdawajc7tmgej.noop,
      state: $_46qvupxpjc7tmgnx.init
    })
  ];

  var setValue$3 = function (component, repConfig, repState, data) {
    repState.set(data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$3 = function (component, repConfig, repState) {
    return repState.get();
  };
  var onLoad$4 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (initVal) {
      if (repState.isNotSet())
        repState.set(initVal);
    });
  };
  var onUnload$2 = function (component, repConfig, repState) {
    repState.clear();
  };
  var MemoryStore = [
    $_9benqox1jc7tmght.option('initialValue'),
    $_8vhkewysjc7tmgun.output('manager', {
      setValue: setValue$3,
      getValue: getValue$3,
      onLoad: onLoad$4,
      onUnload: onUnload$2,
      state: $_fsihhc112jc7tmhh6.memory
    })
  ];

  var RepresentSchema = [
    $_9benqox1jc7tmght.defaultedOf('store', { mode: 'memory' }, $_c1hr3lxgjc7tmgly.choose('mode', {
      memory: MemoryStore,
      manual: ManualStore,
      dataset: DatasetStore
    })),
    $_8vhkewysjc7tmgun.onHandler('onSetValue'),
    $_9benqox1jc7tmght.defaulted('resetOnDom', false)
  ];

  var me = $_567rv0w3jc7tmgc6.create({
    fields: RepresentSchema,
    name: 'representing',
    active: $_6xoazc10yjc7tmhgg,
    apis: $_1s8oyn10zjc7tmhgl,
    extra: {
      setValueFrom: function (component, source) {
        var value = me.getValue(source);
        me.setValue(component, value);
      }
    },
    state: $_fsihhc112jc7tmhh6
  });

  var isTouch$2 = $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch();
  var SliderSchema = [
    $_9benqox1jc7tmght.strict('min'),
    $_9benqox1jc7tmght.strict('max'),
    $_9benqox1jc7tmght.defaulted('stepSize', 1),
    $_9benqox1jc7tmght.defaulted('onChange', $_7wlbdawajc7tmgej.noop),
    $_9benqox1jc7tmght.defaulted('onInit', $_7wlbdawajc7tmgej.noop),
    $_9benqox1jc7tmght.defaulted('onDragStart', $_7wlbdawajc7tmgej.noop),
    $_9benqox1jc7tmght.defaulted('onDragEnd', $_7wlbdawajc7tmgej.noop),
    $_9benqox1jc7tmght.defaulted('snapToGrid', false),
    $_9benqox1jc7tmght.option('snapStart'),
    $_9benqox1jc7tmght.strict('getInitialValue'),
    $_qqqz410cjc7tmhaf.field('sliderBehaviours', [
      Keying,
      me
    ]),
    $_9benqox1jc7tmght.state('value', function (spec) {
      return Cell(spec.min);
    })
  ].concat(!isTouch$2 ? [$_9benqox1jc7tmght.state('mouseIsDown', function () {
      return Cell(false);
    })] : []);

  var api$1 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$4 = function (element, h) {
    api$1.set(element, h);
  };
  var get$6 = function (element) {
    return api$1.get(element);
  };
  var getOuter$2 = function (element) {
    return api$1.getOuter(element);
  };
  var setMax$1 = function (element, value) {
    var inclusions = [
      'margin-left',
      'border-left-width',
      'padding-left',
      'padding-right',
      'border-right-width',
      'margin-right'
    ];
    var absMax = api$1.max(element, value, inclusions);
    $_bq4g3yzrjc7tmh4w.set(element, 'max-width', absMax + 'px');
  };
  var $_20v7a9116jc7tmhi9 = {
    set: set$4,
    get: get$6,
    getOuter: getOuter$2,
    setMax: setMax$1
  };

  var isTouch$3 = $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch();
  var sketch$2 = function (detail, components, spec, externals) {
    var range = detail.max() - detail.min();
    var getXCentre = function (component) {
      var rect = component.element().dom().getBoundingClientRect();
      return (rect.left + rect.right) / 2;
    };
    var getThumb = function (component) {
      return $_dz5zok10hjc7tmhbg.getPartOrDie(component, detail, 'thumb');
    };
    var getXOffset = function (slider, spectrumBounds, detail) {
      var v = detail.value().get();
      if (v < detail.min()) {
        return $_dz5zok10hjc7tmhbg.getPart(slider, detail, 'left-edge').fold(function () {
          return 0;
        }, function (ledge) {
          return getXCentre(ledge) - spectrumBounds.left;
        });
      } else if (v > detail.max()) {
        return $_dz5zok10hjc7tmhbg.getPart(slider, detail, 'right-edge').fold(function () {
          return spectrumBounds.width;
        }, function (redge) {
          return getXCentre(redge) - spectrumBounds.left;
        });
      } else {
        return (detail.value().get() - detail.min()) / range * spectrumBounds.width;
      }
    };
    var getXPos = function (slider) {
      var spectrum = $_dz5zok10hjc7tmhbg.getPartOrDie(slider, detail, 'spectrum');
      var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
      var sliderBounds = slider.element().dom().getBoundingClientRect();
      var xOffset = getXOffset(slider, spectrumBounds, detail);
      return spectrumBounds.left - sliderBounds.left + xOffset;
    };
    var refresh = function (component) {
      var pos = getXPos(component);
      var thumb = getThumb(component);
      var thumbRadius = $_20v7a9116jc7tmhi9.get(thumb.element()) / 2;
      $_bq4g3yzrjc7tmh4w.set(thumb.element(), 'left', pos - thumbRadius + 'px');
    };
    var changeValue = function (component, newValue) {
      var oldValue = detail.value().get();
      var thumb = getThumb(component);
      if (oldValue !== newValue || $_bq4g3yzrjc7tmh4w.getRaw(thumb.element(), 'left').isNone()) {
        detail.value().set(newValue);
        refresh(component);
        detail.onChange()(component, thumb, newValue);
        return $_7db13lw9jc7tmgee.some(true);
      } else {
        return $_7db13lw9jc7tmgee.none();
      }
    };
    var resetToMin = function (slider) {
      changeValue(slider, detail.min());
    };
    var resetToMax = function (slider) {
      changeValue(slider, detail.max());
    };
    var uiEventsArr = isTouch$3 ? [
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchstart(), function (slider, simulatedEvent) {
        detail.onDragStart()(slider, getThumb(slider));
      }),
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchend(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
      })
    ] : [
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mousedown(), function (slider, simulatedEvent) {
        simulatedEvent.stop();
        detail.onDragStart()(slider, getThumb(slider));
        detail.mouseIsDown().set(true);
      }),
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mouseup(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
        detail.mouseIsDown().set(false);
      })
    ];
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive($_682tbuw8jc7tmgdz.flatten([
        !isTouch$3 ? [Keying.config({
            mode: 'special',
            focusIn: function (slider) {
              return $_dz5zok10hjc7tmhbg.getPart(slider, detail, 'spectrum').map(Keying.focusIn).map($_7wlbdawajc7tmgej.constant(true));
            }
          })] : [],
        [me.config({
            store: {
              mode: 'manual',
              getValue: function (_) {
                return detail.value().get();
              }
            }
          })]
      ])), $_qqqz410cjc7tmhaf.get(detail.sliderBehaviours())),
      events: $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.run($_dsmk5710ujc7tmhfo.changeEvent(), function (slider, simulatedEvent) {
          changeValue(slider, simulatedEvent.event().value());
        }),
        $_3oclftw5jc7tmgdb.runOnAttached(function (slider, simulatedEvent) {
          detail.value().set(detail.getInitialValue()());
          var thumb = getThumb(slider);
          refresh(slider);
          detail.onInit()(slider, thumb, detail.value().get());
        })
      ].concat(uiEventsArr)),
      apis: {
        resetToMin: resetToMin,
        resetToMax: resetToMax,
        refresh: refresh
      },
      domModification: { styles: { position: 'relative' } }
    };
  };
  var $_4xlgvg115jc7tmhhq = { sketch: sketch$2 };

  var Slider = $_2r0fok10djc7tmham.composite({
    name: 'Slider',
    configFields: SliderSchema,
    partFields: SliderParts,
    factory: $_4xlgvg115jc7tmhhq.sketch,
    apis: {
      resetToMin: function (apis, slider) {
        apis.resetToMin(slider);
      },
      resetToMax: function (apis, slider) {
        apis.resetToMax(slider);
      },
      refresh: function (apis, slider) {
        apis.refresh(slider);
      }
    }
  });

  var button = function (realm, clazz, makeItems) {
    return $_3zi4bwz1jc7tmgwv.forToolbar(clazz, function () {
      var items = makeItems();
      realm.setContextToolbar([{
          label: clazz + ' group',
          items: items
        }]);
    }, {});
  };
  var $_c7r55g117jc7tmhib = { button: button };

  var BLACK = -1;
  var makeSlider = function (spec) {
    var getColor = function (hue) {
      if (hue < 0) {
        return 'black';
      } else if (hue > 360) {
        return 'white';
      } else {
        return 'hsl(' + hue + ', 100%, 50%)';
      }
    };
    var onInit = function (slider, thumb, value) {
      var color = getColor(value);
      $_bq4g3yzrjc7tmh4w.set(thumb.element(), 'background-color', color);
    };
    var onChange = function (slider, thumb, value) {
      var color = getColor(value);
      $_bq4g3yzrjc7tmh4w.set(thumb.element(), 'background-color', color);
      spec.onChange(slider, thumb, color);
    };
    return Slider.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
      components: [
        Slider.parts()['left-edge']($_c7exbi10pjc7tmhe8.spec('<div class="${prefix}-hue-slider-black"></div>')),
        Slider.parts().spectrum({
          dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-slider-gradient-container"></div>'),
          components: [$_c7exbi10pjc7tmhe8.spec('<div class="${prefix}-slider-gradient"></div>')],
          behaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({ toggleClass: $_fej2h3z0jc7tmgwt.resolve('thumb-active') })])
        }),
        Slider.parts()['right-edge']($_c7exbi10pjc7tmhe8.spec('<div class="${prefix}-hue-slider-white"></div>')),
        Slider.parts().thumb({
          dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({ toggleClass: $_fej2h3z0jc7tmgwt.resolve('thumb-active') })])
        })
      ],
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      onInit: onInit,
      stepSize: 10,
      min: 0,
      max: 360,
      getInitialValue: spec.getInitialValue,
      sliderBehaviours: $_567rv0w3jc7tmgc6.derive([$_c7bmb0yzjc7tmgwp.orientation(Slider.refresh)])
    });
  };
  var makeItems = function (spec) {
    return [makeSlider(spec)];
  };
  var sketch$1 = function (realm, editor) {
    var spec = {
      onChange: function (slider, thumb, color) {
        editor.undoManager.transact(function () {
          editor.formatter.apply('forecolor', { value: color });
          editor.nodeChanged();
        });
      },
      getInitialValue: function () {
        return BLACK;
      }
    };
    return $_c7r55g117jc7tmhib.button(realm, 'color', function () {
      return makeItems(spec);
    });
  };
  var $_8hdrh810rjc7tmhes = {
    makeItems: makeItems,
    sketch: sketch$1
  };

  var schema$7 = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strict('getInitialValue'),
    $_9benqox1jc7tmght.strict('onChange'),
    $_9benqox1jc7tmght.strict('category'),
    $_9benqox1jc7tmght.strict('sizes')
  ]);
  var sketch$4 = function (rawSpec) {
    var spec = $_c1hr3lxgjc7tmgly.asRawOrDie('SizeSlider', schema$7, rawSpec);
    var isValidValue = function (valueIndex) {
      return valueIndex >= 0 && valueIndex < spec.sizes.length;
    };
    var onChange = function (slider, thumb, valueIndex) {
      if (isValidValue(valueIndex)) {
        spec.onChange(valueIndex);
      }
    };
    return Slider.sketch({
      dom: {
        tag: 'div',
        classes: [
          $_fej2h3z0jc7tmgwt.resolve('slider-' + spec.category + '-size-container'),
          $_fej2h3z0jc7tmgwt.resolve('slider'),
          $_fej2h3z0jc7tmgwt.resolve('slider-size-container')
        ]
      },
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      min: 0,
      max: spec.sizes.length - 1,
      stepSize: 1,
      getInitialValue: spec.getInitialValue,
      snapToGrid: true,
      sliderBehaviours: $_567rv0w3jc7tmgc6.derive([$_c7bmb0yzjc7tmgwp.orientation(Slider.refresh)]),
      components: [
        Slider.parts().spectrum({
          dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-slider-size-container"></div>'),
          components: [$_c7exbi10pjc7tmhe8.spec('<div class="${prefix}-slider-size-line"></div>')]
        }),
        Slider.parts().thumb({
          dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({ toggleClass: $_fej2h3z0jc7tmgwt.resolve('thumb-active') })])
        })
      ]
    });
  };
  var $_502p6j119jc7tmhie = { sketch: sketch$4 };

  var ancestor$3 = function (scope, transform, isRoot) {
    var element = scope.dom();
    var stop = $_5ub7o5wyjc7tmggz.isFunction(isRoot) ? isRoot : $_7wlbdawajc7tmgej.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_19g44bwsjc7tmgg6.fromDom(element);
      var transformed = transform(el);
      if (transformed.isSome())
        return transformed;
      else if (stop(el))
        break;
    }
    return $_7db13lw9jc7tmgee.none();
  };
  var closest$3 = function (scope, transform, isRoot) {
    var current = transform(scope);
    return current.orThunk(function () {
      return isRoot(scope) ? $_7db13lw9jc7tmgee.none() : ancestor$3(scope, transform, isRoot);
    });
  };
  var $_8rwbgp11bjc7tmhj7 = {
    ancestor: ancestor$3,
    closest: closest$3
  };

  var candidates = [
    '9px',
    '10px',
    '11px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '36px'
  ];
  var defaultSize = 'medium';
  var defaultIndex = 2;
  var indexToSize = function (index) {
    return $_7db13lw9jc7tmgee.from(candidates[index]);
  };
  var sizeToIndex = function (size) {
    return $_682tbuw8jc7tmgdz.findIndex(candidates, function (v) {
      return v === size;
    });
  };
  var getRawOrComputed = function (isRoot, rawStart) {
    var optStart = $_e44ar2xwjc7tmgp4.isElement(rawStart) ? $_7db13lw9jc7tmgee.some(rawStart) : $_bvq6n5y2jc7tmgq7.parent(rawStart);
    return optStart.map(function (start) {
      var inline = $_8rwbgp11bjc7tmhj7.closest(start, function (elem) {
        return $_bq4g3yzrjc7tmh4w.getRaw(elem, 'font-size');
      }, isRoot);
      return inline.getOrThunk(function () {
        return $_bq4g3yzrjc7tmh4w.get(start, 'font-size');
      });
    }).getOr('');
  };
  var getSize = function (editor) {
    var node = editor.selection.getStart();
    var elem = $_19g44bwsjc7tmgg6.fromDom(node);
    var root = $_19g44bwsjc7tmgg6.fromDom(editor.getBody());
    var isRoot = function (e) {
      return $_b6kzgmw7jc7tmgdr.eq(root, e);
    };
    var elemSize = getRawOrComputed(isRoot, elem);
    return $_682tbuw8jc7tmgdz.find(candidates, function (size) {
      return elemSize === size;
    }).getOr(defaultSize);
  };
  var applySize = function (editor, value) {
    var currentValue = getSize(editor);
    if (currentValue !== value) {
      editor.execCommand('fontSize', false, value);
    }
  };
  var get$7 = function (editor) {
    var size = getSize(editor);
    return sizeToIndex(size).getOr(defaultIndex);
  };
  var apply$1 = function (editor, index) {
    indexToSize(index).each(function (size) {
      applySize(editor, size);
    });
  };
  var $_8fg1t211ajc7tmhin = {
    candidates: $_7wlbdawajc7tmgej.constant(candidates),
    get: get$7,
    apply: apply$1
  };

  var sizes = $_8fg1t211ajc7tmhin.candidates();
  var makeSlider$1 = function (spec) {
    return $_502p6j119jc7tmhie.sketch({
      onChange: spec.onChange,
      sizes: sizes,
      category: 'font',
      getInitialValue: spec.getInitialValue
    });
  };
  var makeItems$1 = function (spec) {
    return [
      $_c7exbi10pjc7tmhe8.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'),
      makeSlider$1(spec),
      $_c7exbi10pjc7tmhe8.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>')
    ];
  };
  var sketch$3 = function (realm, editor) {
    var spec = {
      onChange: function (value) {
        $_8fg1t211ajc7tmhin.apply(editor, value);
      },
      getInitialValue: function () {
        return $_8fg1t211ajc7tmhin.get(editor);
      }
    };
    return $_c7r55g117jc7tmhib.button(realm, 'font-size', function () {
      return makeItems$1(spec);
    });
  };
  var $_840ee3118jc7tmhic = {
    makeItems: makeItems$1,
    sketch: sketch$3
  };

  var record = function (spec) {
    var uid = $_ftivuzx5jc7tmgj2.hasKey(spec, 'uid') ? spec.uid : $_95kbix10ljc7tmhd8.generate('memento');
    var get = function (any) {
      return any.getSystem().getByUid(uid).getOrDie();
    };
    var getOpt = function (any) {
      return any.getSystem().getByUid(uid).fold($_7db13lw9jc7tmgee.none, $_7db13lw9jc7tmgee.some);
    };
    var asSpec = function () {
      return $_2nfiamwxjc7tmggx.deepMerge(spec, { uid: uid });
    };
    return {
      get: get,
      getOpt: getOpt,
      asSpec: asSpec
    };
  };
  var $_116ufv11djc7tmhjt = { record: record };

  function create$3(width, height) {
    return resize(document.createElement('canvas'), width, height);
  }
  function clone$2(canvas) {
    var tCanvas, ctx;
    tCanvas = create$3(canvas.width, canvas.height);
    ctx = get2dContext(tCanvas);
    ctx.drawImage(canvas, 0, 0);
    return tCanvas;
  }
  function get2dContext(canvas) {
    return canvas.getContext('2d');
  }
  function get3dContext(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
    }
    if (!gl) {
      gl = null;
    }
    return gl;
  }
  function resize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  var $_5nnpno11gjc7tmhkh = {
    create: create$3,
    clone: clone$2,
    resize: resize,
    get2dContext: get2dContext,
    get3dContext: get3dContext
  };

  function getWidth(image) {
    return image.naturalWidth || image.width;
  }
  function getHeight(image) {
    return image.naturalHeight || image.height;
  }
  var $_du615o11hjc7tmhkk = {
    getWidth: getWidth,
    getHeight: getHeight
  };

  var promise = function () {
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
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    var isArray = Array.isArray || function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
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
  var Promise = window.Promise ? window.Promise : promise();

  var Blob = function (parts, properties) {
    var f = $_akqfbmwcjc7tmges.getOrDie('Blob');
    return new f(parts, properties);
  };

  var FileReader = function () {
    var f = $_akqfbmwcjc7tmges.getOrDie('FileReader');
    return new f();
  };

  var Uint8Array = function (arr) {
    var f = $_akqfbmwcjc7tmges.getOrDie('Uint8Array');
    return new f(arr);
  };

  var requestAnimationFrame = function (callback) {
    var f = $_akqfbmwcjc7tmges.getOrDie('requestAnimationFrame');
    f(callback);
  };
  var atob = function (base64) {
    var f = $_akqfbmwcjc7tmges.getOrDie('atob');
    return f(base64);
  };
  var $_a7rqyx11mjc7tmhkv = {
    atob: atob,
    requestAnimationFrame: requestAnimationFrame
  };

  function loadImage(image) {
    return new Promise(function (resolve) {
      function loaded() {
        image.removeEventListener('load', loaded);
        resolve(image);
      }
      if (image.complete) {
        resolve(image);
      } else {
        image.addEventListener('load', loaded);
      }
    });
  }
  function imageToBlob$1(image) {
    return loadImage(image).then(function (image) {
      var src = image.src;
      if (src.indexOf('blob:') === 0) {
        return anyUriToBlob(src);
      }
      if (src.indexOf('data:') === 0) {
        return dataUriToBlob(src);
      }
      return anyUriToBlob(src);
    });
  }
  function blobToImage$1(blob) {
    return new Promise(function (resolve, reject) {
      var blobUrl = URL.createObjectURL(blob);
      var image = new Image();
      var removeListeners = function () {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', error);
      };
      function loaded() {
        removeListeners();
        resolve(image);
      }
      function error() {
        removeListeners();
        reject('Unable to load data of type ' + blob.type + ': ' + blobUrl);
      }
      image.addEventListener('load', loaded);
      image.addEventListener('error', error);
      image.src = blobUrl;
      if (image.complete) {
        loaded();
      }
    });
  }
  function anyUriToBlob(url) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        }
      };
      xhr.send();
    });
  }
  function dataUriToBlobSync$1(uri) {
    var data = uri.split(',');
    var matches = /data:([^;]+)/.exec(data[0]);
    if (!matches)
      return $_7db13lw9jc7tmgee.none();
    var mimetype = matches[1];
    var base64 = data[1];
    var sliceSize = 1024;
    var byteCharacters = $_a7rqyx11mjc7tmhkv.atob(base64);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = Uint8Array(bytes);
    }
    return $_7db13lw9jc7tmgee.some(Blob(byteArrays, { type: mimetype }));
  }
  function dataUriToBlob(uri) {
    return new Promise(function (resolve, reject) {
      dataUriToBlobSync$1(uri).fold(function () {
        reject('uri is not base64: ' + uri);
      }, resolve);
    });
  }
  function uriToBlob$1(url) {
    if (url.indexOf('blob:') === 0) {
      return anyUriToBlob(url);
    }
    if (url.indexOf('data:') === 0) {
      return dataUriToBlob(url);
    }
    return null;
  }
  function canvasToBlob(canvas, type, quality) {
    type = type || 'image/png';
    if (HTMLCanvasElement.prototype.toBlob) {
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          resolve(blob);
        }, type, quality);
      });
    } else {
      return dataUriToBlob(canvas.toDataURL(type, quality));
    }
  }
  function canvasToDataURL(getCanvas, type, quality) {
    type = type || 'image/png';
    return getCanvas.then(function (canvas) {
      return canvas.toDataURL(type, quality);
    });
  }
  function blobToCanvas(blob) {
    return blobToImage$1(blob).then(function (image) {
      revokeImageUrl(image);
      var context, canvas;
      canvas = $_5nnpno11gjc7tmhkh.create($_du615o11hjc7tmhkk.getWidth(image), $_du615o11hjc7tmhkk.getHeight(image));
      context = $_5nnpno11gjc7tmhkh.get2dContext(canvas);
      context.drawImage(image, 0, 0);
      return canvas;
    });
  }
  function blobToDataUri$1(blob) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  function blobToBase64$1(blob) {
    return blobToDataUri$1(blob).then(function (dataUri) {
      return dataUri.split(',')[1];
    });
  }
  function revokeImageUrl(image) {
    URL.revokeObjectURL(image.src);
  }
  var $_dhvhtc11fjc7tmhk4 = {
    blobToImage: blobToImage$1,
    imageToBlob: imageToBlob$1,
    blobToDataUri: blobToDataUri$1,
    blobToBase64: blobToBase64$1,
    dataUriToBlobSync: dataUriToBlobSync$1,
    canvasToBlob: canvasToBlob,
    canvasToDataURL: canvasToDataURL,
    blobToCanvas: blobToCanvas,
    uriToBlob: uriToBlob$1
  };

  var blobToImage = function (image) {
    return $_dhvhtc11fjc7tmhk4.blobToImage(image);
  };
  var imageToBlob = function (blob) {
    return $_dhvhtc11fjc7tmhk4.imageToBlob(blob);
  };
  var blobToDataUri = function (blob) {
    return $_dhvhtc11fjc7tmhk4.blobToDataUri(blob);
  };
  var blobToBase64 = function (blob) {
    return $_dhvhtc11fjc7tmhk4.blobToBase64(blob);
  };
  var dataUriToBlobSync = function (uri) {
    return $_dhvhtc11fjc7tmhk4.dataUriToBlobSync(uri);
  };
  var uriToBlob = function (uri) {
    return $_7db13lw9jc7tmgee.from($_dhvhtc11fjc7tmhk4.uriToBlob(uri));
  };
  var $_3idfs411ejc7tmhk0 = {
    blobToImage: blobToImage,
    imageToBlob: imageToBlob,
    blobToDataUri: blobToDataUri,
    blobToBase64: blobToBase64,
    dataUriToBlobSync: dataUriToBlobSync,
    uriToBlob: uriToBlob
  };

  var addImage = function (editor, blob) {
    $_3idfs411ejc7tmhk0.blobToBase64(blob).then(function (base64) {
      editor.undoManager.transact(function () {
        var cache = editor.editorUpload.blobCache;
        var info = cache.create($_2dzfis10fjc7tmhb2.generate('mceu'), blob, base64);
        cache.add(info);
        var img = editor.dom.createHTML('img', { src: info.blobUri() });
        editor.insertContent(img);
      });
    });
  };
  var extractBlob = function (simulatedEvent) {
    var event = simulatedEvent.event();
    var files = event.raw().target.files || event.raw().dataTransfer.files;
    return $_7db13lw9jc7tmgee.from(files[0]);
  };
  var sketch$5 = function (editor) {
    var pickerDom = {
      tag: 'input',
      attributes: {
        accept: 'image/*',
        type: 'file',
        title: ''
      },
      styles: {
        visibility: 'hidden',
        position: 'absolute'
      }
    };
    var memPicker = $_116ufv11djc7tmhjt.record({
      dom: pickerDom,
      events: $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.cutter($_dpjvxuwwjc7tmggu.click()),
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.change(), function (picker, simulatedEvent) {
          extractBlob(simulatedEvent).each(function (blob) {
            addImage(editor, blob);
          });
        })
      ])
    });
    return Button.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-image ${prefix}-icon"></span>'),
      components: [memPicker.asSpec()],
      action: function (button) {
        var picker = memPicker.get(button);
        picker.element().dom().click();
      }
    });
  };
  var $_b2oawq11cjc7tmhjf = { sketch: sketch$5 };

  var get$8 = function (element) {
    return element.dom().textContent;
  };
  var set$5 = function (element, value) {
    element.dom().textContent = value;
  };
  var $_a9a53i11pjc7tmhlq = {
    get: get$8,
    set: set$5
  };

  var isNotEmpty = function (val) {
    return val.length > 0;
  };
  var defaultToEmpty = function (str) {
    return str === undefined || str === null ? '' : str;
  };
  var noLink = function (editor) {
    var text = editor.selection.getContent({ format: 'text' });
    return {
      url: '',
      text: text,
      title: '',
      target: '',
      link: $_7db13lw9jc7tmgee.none()
    };
  };
  var fromLink = function (link) {
    var text = $_a9a53i11pjc7tmhlq.get(link);
    var url = $_gh0zlbxvjc7tmgol.get(link, 'href');
    var title = $_gh0zlbxvjc7tmgol.get(link, 'title');
    var target = $_gh0zlbxvjc7tmgol.get(link, 'target');
    return {
      url: defaultToEmpty(url),
      text: text !== url ? defaultToEmpty(text) : '',
      title: defaultToEmpty(title),
      target: defaultToEmpty(target),
      link: $_7db13lw9jc7tmgee.some(link)
    };
  };
  var getInfo = function (editor) {
    return query(editor).fold(function () {
      return noLink(editor);
    }, function (link) {
      return fromLink(link);
    });
  };
  var wasSimple = function (link) {
    var prevHref = $_gh0zlbxvjc7tmgol.get(link, 'href');
    var prevText = $_a9a53i11pjc7tmhlq.get(link);
    return prevHref === prevText;
  };
  var getTextToApply = function (link, url, info) {
    return info.text.filter(isNotEmpty).fold(function () {
      return wasSimple(link) ? $_7db13lw9jc7tmgee.some(url) : $_7db13lw9jc7tmgee.none();
    }, $_7db13lw9jc7tmgee.some);
  };
  var unlinkIfRequired = function (editor, info) {
    var activeLink = info.link.bind($_7wlbdawajc7tmgej.identity);
    activeLink.each(function (link) {
      editor.execCommand('unlink');
    });
  };
  var getAttrs$1 = function (url, info) {
    var attrs = {};
    attrs.href = url;
    info.title.filter(isNotEmpty).each(function (title) {
      attrs.title = title;
    });
    info.target.filter(isNotEmpty).each(function (target) {
      attrs.target = target;
    });
    return attrs;
  };
  var applyInfo = function (editor, info) {
    info.url.filter(isNotEmpty).fold(function () {
      unlinkIfRequired(editor, info);
    }, function (url) {
      var attrs = getAttrs$1(url, info);
      var activeLink = info.link.bind($_7wlbdawajc7tmgej.identity);
      activeLink.fold(function () {
        var text = info.text.filter(isNotEmpty).getOr(url);
        editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)));
      }, function (link) {
        var text = getTextToApply(link, url, info);
        $_gh0zlbxvjc7tmgol.setAll(link, attrs);
        text.each(function (newText) {
          $_a9a53i11pjc7tmhlq.set(link, newText);
        });
      });
    });
  };
  var query = function (editor) {
    var start = $_19g44bwsjc7tmgg6.fromDom(editor.selection.getStart());
    return $_el2q49zljc7tmh27.closest(start, 'a');
  };
  var $_a9pqzt11ojc7tmhld = {
    getInfo: getInfo,
    applyInfo: applyInfo,
    query: query
  };

  var events$6 = function (name, eventHandlers) {
    var events = $_3oclftw5jc7tmgdb.derive(eventHandlers);
    return $_567rv0w3jc7tmgc6.create({
      fields: [$_9benqox1jc7tmght.strict('enabled')],
      name: name,
      active: { events: $_7wlbdawajc7tmgej.constant(events) }
    });
  };
  var config = function (name, eventHandlers) {
    var me = events$6(name, eventHandlers);
    return {
      key: name,
      value: {
        config: {},
        me: me,
        configAsRaw: $_7wlbdawajc7tmgej.constant({}),
        initialConfig: {},
        state: $_567rv0w3jc7tmgc6.noState()
      }
    };
  };
  var $_2nfmit11rjc7tmhm8 = {
    events: events$6,
    config: config
  };

  var getCurrent = function (component, composeConfig, composeState) {
    return composeConfig.find()(component);
  };
  var $_8m5iq611tjc7tmhmj = { getCurrent: getCurrent };

  var ComposeSchema = [$_9benqox1jc7tmght.strict('find')];

  var Composing = $_567rv0w3jc7tmgc6.create({
    fields: ComposeSchema,
    name: 'composing',
    apis: $_8m5iq611tjc7tmhmj
  });

  var factory$1 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_2nfiamwxjc7tmggx.deepMerge({
        tag: 'div',
        attributes: { role: 'presentation' }
      }, detail.dom()),
      components: detail.components(),
      behaviours: $_qqqz410cjc7tmhaf.get(detail.containerBehaviours()),
      events: detail.events(),
      domModification: detail.domModification(),
      eventOrder: detail.eventOrder()
    };
  };
  var Container = $_2r0fok10djc7tmham.single({
    name: 'Container',
    factory: factory$1,
    configFields: [
      $_9benqox1jc7tmght.defaulted('components', []),
      $_qqqz410cjc7tmhaf.field('containerBehaviours', []),
      $_9benqox1jc7tmght.defaulted('events', {}),
      $_9benqox1jc7tmght.defaulted('domModification', {}),
      $_9benqox1jc7tmght.defaulted('eventOrder', {})
    ]
  });

  var factory$2 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.getInitialValue()()
          }
        }),
        Composing.config({ find: $_7db13lw9jc7tmgee.some })
      ]), $_qqqz410cjc7tmhaf.get(detail.dataBehaviours())),
      events: $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.runOnAttached(function (component, simulatedEvent) {
          me.setValue(component, detail.getInitialValue()());
        })])
    };
  };
  var DataField = $_2r0fok10djc7tmham.single({
    name: 'DataField',
    factory: factory$2,
    configFields: [
      $_9benqox1jc7tmght.strict('uid'),
      $_9benqox1jc7tmght.strict('dom'),
      $_9benqox1jc7tmght.strict('getInitialValue'),
      $_qqqz410cjc7tmhaf.field('dataBehaviours', [
        me,
        Composing
      ])
    ]
  });

  var get$9 = function (element) {
    return element.dom().value;
  };
  var set$6 = function (element, value) {
    if (value === undefined)
      throw new Error('Value.set was undefined');
    element.dom().value = value;
  };
  var $_f0maum11zjc7tmhno = {
    set: set$6,
    get: get$9
  };

  var schema$8 = [
    $_9benqox1jc7tmght.option('data'),
    $_9benqox1jc7tmght.defaulted('inputAttributes', {}),
    $_9benqox1jc7tmght.defaulted('inputStyles', {}),
    $_9benqox1jc7tmght.defaulted('type', 'input'),
    $_9benqox1jc7tmght.defaulted('tag', 'input'),
    $_9benqox1jc7tmght.defaulted('inputClasses', []),
    $_8vhkewysjc7tmgun.onHandler('onSetValue'),
    $_9benqox1jc7tmght.defaulted('styles', {}),
    $_9benqox1jc7tmght.option('placeholder'),
    $_9benqox1jc7tmght.defaulted('eventOrder', {}),
    $_qqqz410cjc7tmhaf.field('inputBehaviours', [
      me,
      Focusing
    ]),
    $_9benqox1jc7tmght.defaulted('selectOnFocus', true)
  ];
  var behaviours = function (detail) {
    return $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
      me.config({
        store: {
          mode: 'manual',
          initialValue: detail.data().getOr(undefined),
          getValue: function (input) {
            return $_f0maum11zjc7tmhno.get(input.element());
          },
          setValue: function (input, data) {
            var current = $_f0maum11zjc7tmhno.get(input.element());
            if (current !== data) {
              $_f0maum11zjc7tmhno.set(input.element(), data);
            }
          }
        },
        onSetValue: detail.onSetValue()
      }),
      Focusing.config({
        onFocus: detail.selectOnFocus() === false ? $_7wlbdawajc7tmgej.noop : function (component) {
          var input = component.element();
          var value = $_f0maum11zjc7tmhno.get(input);
          input.dom().setSelectionRange(0, value.length);
        }
      })
    ]), $_qqqz410cjc7tmhaf.get(detail.inputBehaviours()));
  };
  var dom$2 = function (detail) {
    return {
      tag: detail.tag(),
      attributes: $_2nfiamwxjc7tmggx.deepMerge($_ftivuzx5jc7tmgj2.wrapAll([{
          key: 'type',
          value: detail.type()
        }].concat(detail.placeholder().map(function (pc) {
        return {
          key: 'placeholder',
          value: pc
        };
      }).toArray())), detail.inputAttributes()),
      styles: detail.inputStyles(),
      classes: detail.inputClasses()
    };
  };
  var $_axgnk811yjc7tmhnc = {
    schema: $_7wlbdawajc7tmgej.constant(schema$8),
    behaviours: behaviours,
    dom: dom$2
  };

  var factory$3 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_axgnk811yjc7tmhnc.dom(detail),
      components: [],
      behaviours: $_axgnk811yjc7tmhnc.behaviours(detail),
      eventOrder: detail.eventOrder()
    };
  };
  var Input = $_2r0fok10djc7tmham.single({
    name: 'Input',
    configFields: $_axgnk811yjc7tmhnc.schema(),
    factory: factory$3
  });

  var exhibit$3 = function (base, tabConfig) {
    return $_f402ywxjjc7tmgmr.nu({
      attributes: $_ftivuzx5jc7tmgj2.wrapAll([{
          key: tabConfig.tabAttr(),
          value: 'true'
        }])
    });
  };
  var $_27js4u121jc7tmhnx = { exhibit: exhibit$3 };

  var TabstopSchema = [$_9benqox1jc7tmght.defaulted('tabAttr', 'data-alloy-tabstop')];

  var Tabstopping = $_567rv0w3jc7tmgc6.create({
    fields: TabstopSchema,
    name: 'tabstopping',
    active: $_27js4u121jc7tmhnx
  });

  var clearInputBehaviour = 'input-clearing';
  var field$2 = function (name, placeholder) {
    var inputSpec = $_116ufv11djc7tmhjt.record(Input.sketch({
      placeholder: placeholder,
      onSetValue: function (input, data) {
        $_7zx0zrwujc7tmgge.emit(input, $_dpjvxuwwjc7tmggu.input());
      },
      inputBehaviours: $_567rv0w3jc7tmgc6.derive([
        Composing.config({ find: $_7db13lw9jc7tmgee.some }),
        Tabstopping.config({}),
        Keying.config({ mode: 'execution' })
      ]),
      selectOnFocus: false
    }));
    var buttonSpec = $_116ufv11djc7tmhjt.record(Button.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
      action: function (button) {
        var input = inputSpec.get(button);
        me.setValue(input, '');
      }
    }));
    return {
      name: name,
      spec: Container.sketch({
        dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-input-container"></div>'),
        components: [
          inputSpec.asSpec(),
          buttonSpec.asSpec()
        ],
        containerBehaviours: $_567rv0w3jc7tmgc6.derive([
          Toggling.config({ toggleClass: $_fej2h3z0jc7tmgwt.resolve('input-container-empty') }),
          Composing.config({
            find: function (comp) {
              return $_7db13lw9jc7tmgee.some(inputSpec.get(comp));
            }
          }),
          $_2nfmit11rjc7tmhm8.config(clearInputBehaviour, [$_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.input(), function (iContainer) {
              var input = inputSpec.get(iContainer);
              var val = me.getValue(input);
              var f = val.length > 0 ? Toggling.off : Toggling.on;
              f(iContainer);
            })])
        ])
      })
    };
  };
  var hidden = function (name) {
    return {
      name: name,
      spec: DataField.sketch({
        dom: {
          tag: 'span',
          styles: { display: 'none' }
        },
        getInitialValue: function () {
          return $_7db13lw9jc7tmgee.none();
        }
      })
    };
  };
  var $_5n38k111qjc7tmhlr = {
    field: field$2,
    hidden: hidden
  };

  var nativeDisabled = [
    'input',
    'button',
    'textarea'
  ];
  var onLoad$5 = function (component, disableConfig, disableState) {
    if (disableConfig.disabled())
      disable(component, disableConfig, disableState);
  };
  var hasNative = function (component) {
    return $_682tbuw8jc7tmgdz.contains(nativeDisabled, $_e44ar2xwjc7tmgp4.name(component.element()));
  };
  var nativeIsDisabled = function (component) {
    return $_gh0zlbxvjc7tmgol.has(component.element(), 'disabled');
  };
  var nativeDisable = function (component) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'disabled', 'disabled');
  };
  var nativeEnable = function (component) {
    $_gh0zlbxvjc7tmgol.remove(component.element(), 'disabled');
  };
  var ariaIsDisabled = function (component) {
    return $_gh0zlbxvjc7tmgol.get(component.element(), 'aria-disabled') === 'true';
  };
  var ariaDisable = function (component) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-disabled', 'true');
  };
  var ariaEnable = function (component) {
    $_gh0zlbxvjc7tmgol.set(component.element(), 'aria-disabled', 'false');
  };
  var disable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_7lq4x8xtjc7tmgod.add(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeDisable : ariaDisable;
    f(component);
  };
  var enable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_7lq4x8xtjc7tmgod.remove(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeEnable : ariaEnable;
    f(component);
  };
  var isDisabled = function (component) {
    return hasNative(component) ? nativeIsDisabled(component) : ariaIsDisabled(component);
  };
  var $_3dzk4p126jc7tmhph = {
    enable: enable,
    disable: disable,
    isDisabled: isDisabled,
    onLoad: onLoad$5
  };

  var exhibit$4 = function (base, disableConfig, disableState) {
    return $_f402ywxjjc7tmgmr.nu({ classes: disableConfig.disabled() ? disableConfig.disableClass().map($_682tbuw8jc7tmgdz.pure).getOr([]) : [] });
  };
  var events$7 = function (disableConfig, disableState) {
    return $_3oclftw5jc7tmgdb.derive([
      $_3oclftw5jc7tmgdb.abort($_66ekuowvjc7tmggn.execute(), function (component, simulatedEvent) {
        return $_3dzk4p126jc7tmhph.isDisabled(component, disableConfig, disableState);
      }),
      $_ivrpyw4jc7tmgco.loadEvent(disableConfig, disableState, $_3dzk4p126jc7tmhph.onLoad)
    ]);
  };
  var $_4ol87z125jc7tmhp7 = {
    exhibit: exhibit$4,
    events: events$7
  };

  var DisableSchema = [
    $_9benqox1jc7tmght.defaulted('disabled', false),
    $_9benqox1jc7tmght.option('disableClass')
  ];

  var Disabling = $_567rv0w3jc7tmgc6.create({
    fields: DisableSchema,
    name: 'disabling',
    active: $_4ol87z125jc7tmhp7,
    apis: $_3dzk4p126jc7tmhph
  });

  var owner$1 = 'form';
  var schema$9 = [$_qqqz410cjc7tmhaf.field('formBehaviours', [me])];
  var getPartName = function (name) {
    return '<alloy.field.' + name + '>';
  };
  var sketch$8 = function (fSpec) {
    var parts = function () {
      var record = [];
      var field = function (name, config) {
        record.push(name);
        return $_dz5zok10hjc7tmhbg.generateOne(owner$1, getPartName(name), config);
      };
      return {
        field: field,
        record: function () {
          return record;
        }
      };
    }();
    var spec = fSpec(parts);
    var partNames = parts.record();
    var fieldParts = $_682tbuw8jc7tmgdz.map(partNames, function (n) {
      return $_61s39h10jjc7tmhc6.required({
        name: n,
        pname: getPartName(n)
      });
    });
    return $_4mws1710gjc7tmhb6.composite(owner$1, schema$9, fieldParts, make, spec);
  };
  var make = function (detail, components, spec) {
    return $_2nfiamwxjc7tmggx.deepMerge({
      'debug.sketcher': { 'Form': spec },
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([me.config({
          store: {
            mode: 'manual',
            getValue: function (form) {
              var optPs = $_dz5zok10hjc7tmhbg.getAllParts(form, detail);
              return $_fvv1p1wzjc7tmgh1.map(optPs, function (optPThunk, pName) {
                return optPThunk().bind(Composing.getCurrent).map(me.getValue);
              });
            },
            setValue: function (form, values) {
              $_fvv1p1wzjc7tmgh1.each(values, function (newValue, key) {
                $_dz5zok10hjc7tmhbg.getPart(form, detail, key).each(function (wrapper) {
                  Composing.getCurrent(wrapper).each(function (field) {
                    me.setValue(field, newValue);
                  });
                });
              });
            }
          }
        })]), $_qqqz410cjc7tmhaf.get(detail.formBehaviours())),
      apis: {
        getField: function (form, key) {
          return $_dz5zok10hjc7tmhbg.getPart(form, detail, key).bind(Composing.getCurrent);
        }
      }
    });
  };
  var $_68zr7d128jc7tmhq8 = {
    getField: $_eruo9l10ejc7tmhax.makeApi(function (apis, component, key) {
      return apis.getField(component, key);
    }),
    sketch: sketch$8
  };

  var revocable = function (doRevoke) {
    var subject = Cell($_7db13lw9jc7tmgee.none());
    var revoke = function () {
      subject.get().each(doRevoke);
    };
    var clear = function () {
      revoke();
      subject.set($_7db13lw9jc7tmgee.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_7db13lw9jc7tmgee.some(s));
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set
    };
  };
  var destroyable = function () {
    return revocable(function (s) {
      s.destroy();
    });
  };
  var unbindable = function () {
    return revocable(function (s) {
      s.unbind();
    });
  };
  var api$2 = function () {
    var subject = Cell($_7db13lw9jc7tmgee.none());
    var revoke = function () {
      subject.get().each(function (s) {
        s.destroy();
      });
    };
    var clear = function () {
      revoke();
      subject.set($_7db13lw9jc7tmgee.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_7db13lw9jc7tmgee.some(s));
    };
    var run = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set,
      run: run
    };
  };
  var value$3 = function () {
    var subject = Cell($_7db13lw9jc7tmgee.none());
    var clear = function () {
      subject.set($_7db13lw9jc7tmgee.none());
    };
    var set = function (s) {
      subject.set($_7db13lw9jc7tmgee.some(s));
    };
    var on = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      set: set,
      isSet: isSet,
      on: on
    };
  };
  var $_f5y4ql129jc7tmhqm = {
    destroyable: destroyable,
    unbindable: unbindable,
    api: api$2,
    value: value$3
  };

  var SWIPING_LEFT = 1;
  var SWIPING_RIGHT = -1;
  var SWIPING_NONE = 0;
  var init$3 = function (xValue) {
    return {
      xValue: xValue,
      points: []
    };
  };
  var move = function (model, xValue) {
    if (xValue === model.xValue) {
      return model;
    }
    var currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;
    var newPoint = {
      direction: currentDirection,
      xValue: xValue
    };
    var priorPoints = function () {
      if (model.points.length === 0) {
        return [];
      } else {
        var prev = model.points[model.points.length - 1];
        return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points;
      }
    }();
    return {
      xValue: xValue,
      points: priorPoints.concat([newPoint])
    };
  };
  var complete = function (model) {
    if (model.points.length === 0) {
      return SWIPING_NONE;
    } else {
      var firstDirection = model.points[0].direction;
      var lastDirection = model.points[model.points.length - 1].direction;
      return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT : firstDirection === SWIPING_LEFT && lastDirection == SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE;
    }
  };
  var $_do7qhz12ajc7tmhqt = {
    init: init$3,
    move: move,
    complete: complete
  };

  var sketch$7 = function (rawSpec) {
    var navigateEvent = 'navigateEvent';
    var wrapperAdhocEvents = 'serializer-wrapper-events';
    var formAdhocEvents = 'form-events';
    var schema = $_c1hr3lxgjc7tmgly.objOf([
      $_9benqox1jc7tmght.strict('fields'),
      $_9benqox1jc7tmght.defaulted('maxFieldIndex', rawSpec.fields.length - 1),
      $_9benqox1jc7tmght.strict('onExecute'),
      $_9benqox1jc7tmght.strict('getInitialValue'),
      $_9benqox1jc7tmght.state('state', function () {
        return {
          dialogSwipeState: $_f5y4ql129jc7tmhqm.value(),
          currentScreen: Cell(0)
        };
      })
    ]);
    var spec = $_c1hr3lxgjc7tmgly.asRawOrDie('SerialisedDialog', schema, rawSpec);
    var navigationButton = function (direction, directionName, enabled) {
      return Button.sketch({
        dom: $_c7exbi10pjc7tmhe8.dom('<span class="${prefix}-icon-' + directionName + ' ${prefix}-icon"></span>'),
        action: function (button) {
          $_7zx0zrwujc7tmgge.emitWith(button, navigateEvent, { direction: direction });
        },
        buttonBehaviours: $_567rv0w3jc7tmgc6.derive([Disabling.config({
            disableClass: $_fej2h3z0jc7tmgwt.resolve('toolbar-navigation-disabled'),
            disabled: !enabled
          })])
      });
    };
    var reposition = function (dialog, message) {
      $_el2q49zljc7tmh27.descendant(dialog.element(), '.' + $_fej2h3z0jc7tmgwt.resolve('serialised-dialog-chain')).each(function (parent) {
        $_bq4g3yzrjc7tmh4w.set(parent, 'left', -spec.state.currentScreen.get() * message.width + 'px');
      });
    };
    var navigate = function (dialog, direction) {
      var screens = $_92hwmyzjjc7tmh1x.descendants(dialog.element(), '.' + $_fej2h3z0jc7tmgwt.resolve('serialised-dialog-screen'));
      $_el2q49zljc7tmh27.descendant(dialog.element(), '.' + $_fej2h3z0jc7tmgwt.resolve('serialised-dialog-chain')).each(function (parent) {
        if (spec.state.currentScreen.get() + direction >= 0 && spec.state.currentScreen.get() + direction < screens.length) {
          $_bq4g3yzrjc7tmh4w.getRaw(parent, 'left').each(function (left) {
            var currentLeft = parseInt(left, 10);
            var w = $_20v7a9116jc7tmhi9.get(screens[0]);
            $_bq4g3yzrjc7tmh4w.set(parent, 'left', currentLeft - direction * w + 'px');
          });
          spec.state.currentScreen.set(spec.state.currentScreen.get() + direction);
        }
      });
    };
    var focusInput = function (dialog) {
      var inputs = $_92hwmyzjjc7tmh1x.descendants(dialog.element(), 'input');
      var optInput = $_7db13lw9jc7tmgee.from(inputs[spec.state.currentScreen.get()]);
      optInput.each(function (input) {
        dialog.getSystem().getByDom(input).each(function (inputComp) {
          $_7zx0zrwujc7tmgge.dispatchFocus(dialog, inputComp.element());
        });
      });
      var dotitems = memDots.get(dialog);
      Highlighting.highlightAt(dotitems, spec.state.currentScreen.get());
    };
    var resetState = function () {
      spec.state.currentScreen.set(0);
      spec.state.dialogSwipeState.clear();
    };
    var memForm = $_116ufv11djc7tmhjt.record($_68zr7d128jc7tmhq8.sketch(function (parts) {
      return {
        dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-serialised-dialog"></div>'),
        components: [Container.sketch({
            dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
            components: $_682tbuw8jc7tmgdz.map(spec.fields, function (field, i) {
              return i <= spec.maxFieldIndex ? Container.sketch({
                dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-serialised-dialog-screen"></div>'),
                components: $_682tbuw8jc7tmgdz.flatten([
                  [navigationButton(-1, 'previous', i > 0)],
                  [parts.field(field.name, field.spec)],
                  [navigationButton(+1, 'next', i < spec.maxFieldIndex)]
                ])
              }) : parts.field(field.name, field.spec);
            })
          })],
        formBehaviours: $_567rv0w3jc7tmgc6.derive([
          $_c7bmb0yzjc7tmgwp.orientation(function (dialog, message) {
            reposition(dialog, message);
          }),
          Keying.config({
            mode: 'special',
            focusIn: function (dialog) {
              focusInput(dialog);
            },
            onTab: function (dialog) {
              navigate(dialog, +1);
              return $_7db13lw9jc7tmgee.some(true);
            },
            onShiftTab: function (dialog) {
              navigate(dialog, -1);
              return $_7db13lw9jc7tmgee.some(true);
            }
          }),
          $_2nfmit11rjc7tmhm8.config(formAdhocEvents, [
            $_3oclftw5jc7tmgdb.runOnAttached(function (dialog, simulatedEvent) {
              resetState();
              var dotitems = memDots.get(dialog);
              Highlighting.highlightFirst(dotitems);
              spec.getInitialValue(dialog).each(function (v) {
                me.setValue(dialog, v);
              });
            }),
            $_3oclftw5jc7tmgdb.runOnExecute(spec.onExecute),
            $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.transitionend(), function (dialog, simulatedEvent) {
              if (simulatedEvent.event().raw().propertyName === 'left') {
                focusInput(dialog);
              }
            }),
            $_3oclftw5jc7tmgdb.run(navigateEvent, function (dialog, simulatedEvent) {
              var direction = simulatedEvent.event().direction();
              navigate(dialog, direction);
            })
          ])
        ])
      };
    }));
    var memDots = $_116ufv11djc7tmhjt.record({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-dot-container"></div>'),
      behaviours: $_567rv0w3jc7tmgc6.derive([Highlighting.config({
          highlightClass: $_fej2h3z0jc7tmgwt.resolve('dot-active'),
          itemClass: $_fej2h3z0jc7tmgwt.resolve('dot-item')
        })]),
      components: $_682tbuw8jc7tmgdz.bind(spec.fields, function (_f, i) {
        return i <= spec.maxFieldIndex ? [$_c7exbi10pjc7tmhe8.spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')] : [];
      })
    });
    return {
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-serializer-wrapper"></div>'),
      components: [
        memForm.asSpec(),
        memDots.asSpec()
      ],
      behaviours: $_567rv0w3jc7tmgc6.derive([
        Keying.config({
          mode: 'special',
          focusIn: function (wrapper) {
            var form = memForm.get(wrapper);
            Keying.focusIn(form);
          }
        }),
        $_2nfmit11rjc7tmhm8.config(wrapperAdhocEvents, [
          $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchstart(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.set($_do7qhz12ajc7tmhqt.init(simulatedEvent.event().raw().touches[0].clientX));
          }),
          $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchmove(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.on(function (state) {
              simulatedEvent.event().prevent();
              spec.state.dialogSwipeState.set($_do7qhz12ajc7tmhqt.move(state, simulatedEvent.event().raw().touches[0].clientX));
            });
          }),
          $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.touchend(), function (wrapper) {
            spec.state.dialogSwipeState.on(function (state) {
              var dialog = memForm.get(wrapper);
              var direction = -1 * $_do7qhz12ajc7tmhqt.complete(state);
              navigate(dialog, direction);
            });
          })
        ])
      ])
    };
  };
  var $_f5ihr1123jc7tmho6 = { sketch: sketch$7 };

  var platform$1 = $_9tl8l8wfjc7tmgez.detect();
  var preserve$1 = function (f, editor) {
    var rng = editor.selection.getRng();
    f();
    editor.selection.setRng(rng);
  };
  var forAndroid = function (editor, f) {
    var wrapper = platform$1.os.isAndroid() ? preserve$1 : $_7wlbdawajc7tmgej.apply;
    wrapper(f, editor);
  };
  var $_f5olsd12bjc7tmhqw = { forAndroid: forAndroid };

  var getGroups = $_gdmqd6wgjc7tmgf1.cached(function (realm, editor) {
    return [{
        label: 'the link group',
        items: [$_f5ihr1123jc7tmho6.sketch({
            fields: [
              $_5n38k111qjc7tmhlr.field('url', 'Type or paste URL'),
              $_5n38k111qjc7tmhlr.field('text', 'Link text'),
              $_5n38k111qjc7tmhlr.field('title', 'Link title'),
              $_5n38k111qjc7tmhlr.field('target', 'Link target'),
              $_5n38k111qjc7tmhlr.hidden('link')
            ],
            maxFieldIndex: [
              'url',
              'text',
              'title',
              'target'
            ].length - 1,
            getInitialValue: function () {
              return $_7db13lw9jc7tmgee.some($_a9pqzt11ojc7tmhld.getInfo(editor));
            },
            onExecute: function (dialog) {
              var info = me.getValue(dialog);
              $_a9pqzt11ojc7tmhld.applyInfo(editor, info);
              realm.restoreToolbar();
              editor.focus();
            }
          })]
      }];
  });
  var sketch$6 = function (realm, editor) {
    return $_3zi4bwz1jc7tmgwv.forToolbarStateAction(editor, 'link', 'link', function () {
      var groups = getGroups(realm, editor);
      realm.setContextToolbar(groups);
      $_f5olsd12bjc7tmhqw.forAndroid(editor, function () {
        realm.focusToolbar();
      });
      $_a9pqzt11ojc7tmhld.query(editor).each(function (link) {
        editor.selection.select(link.dom());
      });
    });
  };
  var $_aqvttj11njc7tmhkx = { sketch: sketch$6 };

  var DefaultStyleFormats = [
    {
      title: 'Headings',
      items: [
        {
          title: 'Heading 1',
          format: 'h1'
        },
        {
          title: 'Heading 2',
          format: 'h2'
        },
        {
          title: 'Heading 3',
          format: 'h3'
        },
        {
          title: 'Heading 4',
          format: 'h4'
        },
        {
          title: 'Heading 5',
          format: 'h5'
        },
        {
          title: 'Heading 6',
          format: 'h6'
        }
      ]
    },
    {
      title: 'Inline',
      items: [
        {
          title: 'Bold',
          icon: 'bold',
          format: 'bold'
        },
        {
          title: 'Italic',
          icon: 'italic',
          format: 'italic'
        },
        {
          title: 'Underline',
          icon: 'underline',
          format: 'underline'
        },
        {
          title: 'Strikethrough',
          icon: 'strikethrough',
          format: 'strikethrough'
        },
        {
          title: 'Superscript',
          icon: 'superscript',
          format: 'superscript'
        },
        {
          title: 'Subscript',
          icon: 'subscript',
          format: 'subscript'
        },
        {
          title: 'Code',
          icon: 'code',
          format: 'code'
        }
      ]
    },
    {
      title: 'Blocks',
      items: [
        {
          title: 'Paragraph',
          format: 'p'
        },
        {
          title: 'Blockquote',
          format: 'blockquote'
        },
        {
          title: 'Div',
          format: 'div'
        },
        {
          title: 'Pre',
          format: 'pre'
        }
      ]
    },
    {
      title: 'Alignment',
      items: [
        {
          title: 'Left',
          icon: 'alignleft',
          format: 'alignleft'
        },
        {
          title: 'Center',
          icon: 'aligncenter',
          format: 'aligncenter'
        },
        {
          title: 'Right',
          icon: 'alignright',
          format: 'alignright'
        },
        {
          title: 'Justify',
          icon: 'alignjustify',
          format: 'alignjustify'
        }
      ]
    }
  ];

  var findRoute = function (component, transConfig, transState, route) {
    return $_ftivuzx5jc7tmgj2.readOptFrom(transConfig.routes(), route.start()).map($_7wlbdawajc7tmgej.apply).bind(function (sConfig) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(sConfig, route.destination()).map($_7wlbdawajc7tmgej.apply);
    });
  };
  var getTransition = function (comp, transConfig, transState) {
    var route = getCurrentRoute(comp, transConfig, transState);
    return route.bind(function (r) {
      return getTransitionOf(comp, transConfig, transState, r);
    });
  };
  var getTransitionOf = function (comp, transConfig, transState, route) {
    return findRoute(comp, transConfig, transState, route).bind(function (r) {
      return r.transition().map(function (t) {
        return {
          transition: $_7wlbdawajc7tmgej.constant(t),
          route: $_7wlbdawajc7tmgej.constant(r)
        };
      });
    });
  };
  var disableTransition = function (comp, transConfig, transState) {
    getTransition(comp, transConfig, transState).each(function (routeTransition) {
      var t = routeTransition.transition();
      $_7lq4x8xtjc7tmgod.remove(comp.element(), t.transitionClass());
      $_gh0zlbxvjc7tmgol.remove(comp.element(), transConfig.destinationAttr());
    });
  };
  var getNewRoute = function (comp, transConfig, transState, destination) {
    return {
      start: $_7wlbdawajc7tmgej.constant($_gh0zlbxvjc7tmgol.get(comp.element(), transConfig.stateAttr())),
      destination: $_7wlbdawajc7tmgej.constant(destination)
    };
  };
  var getCurrentRoute = function (comp, transConfig, transState) {
    var el = comp.element();
    return $_gh0zlbxvjc7tmgol.has(el, transConfig.destinationAttr()) ? $_7db13lw9jc7tmgee.some({
      start: $_7wlbdawajc7tmgej.constant($_gh0zlbxvjc7tmgol.get(comp.element(), transConfig.stateAttr())),
      destination: $_7wlbdawajc7tmgej.constant($_gh0zlbxvjc7tmgol.get(comp.element(), transConfig.destinationAttr()))
    }) : $_7db13lw9jc7tmgee.none();
  };
  var jumpTo = function (comp, transConfig, transState, destination) {
    disableTransition(comp, transConfig, transState);
    if ($_gh0zlbxvjc7tmgol.has(comp.element(), transConfig.stateAttr()) && $_gh0zlbxvjc7tmgol.get(comp.element(), transConfig.stateAttr()) !== destination)
      transConfig.onFinish()(comp, destination);
    $_gh0zlbxvjc7tmgol.set(comp.element(), transConfig.stateAttr(), destination);
  };
  var fasttrack = function (comp, transConfig, transState, destination) {
    if ($_gh0zlbxvjc7tmgol.has(comp.element(), transConfig.destinationAttr())) {
      $_gh0zlbxvjc7tmgol.set(comp.element(), transConfig.stateAttr(), $_gh0zlbxvjc7tmgol.get(comp.element(), transConfig.destinationAttr()));
      $_gh0zlbxvjc7tmgol.remove(comp.element(), transConfig.destinationAttr());
    }
  };
  var progressTo = function (comp, transConfig, transState, destination) {
    fasttrack(comp, transConfig, transState, destination);
    var route = getNewRoute(comp, transConfig, transState, destination);
    getTransitionOf(comp, transConfig, transState, route).fold(function () {
      jumpTo(comp, transConfig, transState, destination);
    }, function (routeTransition) {
      disableTransition(comp, transConfig, transState);
      var t = routeTransition.transition();
      $_7lq4x8xtjc7tmgod.add(comp.element(), t.transitionClass());
      $_gh0zlbxvjc7tmgol.set(comp.element(), transConfig.destinationAttr(), destination);
    });
  };
  var getState = function (comp, transConfig, transState) {
    var e = comp.element();
    return $_gh0zlbxvjc7tmgol.has(e, transConfig.stateAttr()) ? $_7db13lw9jc7tmgee.some($_gh0zlbxvjc7tmgol.get(e, transConfig.stateAttr())) : $_7db13lw9jc7tmgee.none();
  };
  var $_6s85gc12hjc7tmhte = {
    findRoute: findRoute,
    disableTransition: disableTransition,
    getCurrentRoute: getCurrentRoute,
    jumpTo: jumpTo,
    progressTo: progressTo,
    getState: getState
  };

  var events$8 = function (transConfig, transState) {
    return $_3oclftw5jc7tmgdb.derive([
      $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        $_6s85gc12hjc7tmhte.getCurrentRoute(component, transConfig, transState).each(function (route) {
          $_6s85gc12hjc7tmhte.findRoute(component, transConfig, transState, route).each(function (rInfo) {
            rInfo.transition().each(function (rTransition) {
              if (raw.propertyName === rTransition.property()) {
                $_6s85gc12hjc7tmhte.jumpTo(component, transConfig, transState, route.destination());
                transConfig.onTransition()(component, route);
              }
            });
          });
        });
      }),
      $_3oclftw5jc7tmgdb.runOnAttached(function (comp, se) {
        $_6s85gc12hjc7tmhte.jumpTo(comp, transConfig, transState, transConfig.initialState());
      })
    ]);
  };
  var $_evi6hv12gjc7tmht9 = { events: events$8 };

  var TransitionSchema = [
    $_9benqox1jc7tmght.defaulted('destinationAttr', 'data-transitioning-destination'),
    $_9benqox1jc7tmght.defaulted('stateAttr', 'data-transitioning-state'),
    $_9benqox1jc7tmght.strict('initialState'),
    $_8vhkewysjc7tmgun.onHandler('onTransition'),
    $_8vhkewysjc7tmgun.onHandler('onFinish'),
    $_9benqox1jc7tmght.strictOf('routes', $_c1hr3lxgjc7tmgly.setOf($_5x2c31x7jc7tmgjn.value, $_c1hr3lxgjc7tmgly.setOf($_5x2c31x7jc7tmgjn.value, $_c1hr3lxgjc7tmgly.objOfOnly([$_9benqox1jc7tmght.optionObjOfOnly('transition', [
        $_9benqox1jc7tmght.strict('property'),
        $_9benqox1jc7tmght.strict('transitionClass')
      ])]))))
  ];

  var createRoutes = function (routes) {
    var r = {};
    $_fvv1p1wzjc7tmgh1.each(routes, function (v, k) {
      var waypoints = k.split('<->');
      r[waypoints[0]] = $_ftivuzx5jc7tmgj2.wrap(waypoints[1], v);
      r[waypoints[1]] = $_ftivuzx5jc7tmgj2.wrap(waypoints[0], v);
    });
    return r;
  };
  var createBistate = function (first, second, transitions) {
    return $_ftivuzx5jc7tmgj2.wrapAll([
      {
        key: first,
        value: $_ftivuzx5jc7tmgj2.wrap(second, transitions)
      },
      {
        key: second,
        value: $_ftivuzx5jc7tmgj2.wrap(first, transitions)
      }
    ]);
  };
  var createTristate = function (first, second, third, transitions) {
    return $_ftivuzx5jc7tmgj2.wrapAll([
      {
        key: first,
        value: $_ftivuzx5jc7tmgj2.wrapAll([
          {
            key: second,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: second,
        value: $_ftivuzx5jc7tmgj2.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: third,
        value: $_ftivuzx5jc7tmgj2.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: second,
            value: transitions
          }
        ])
      }
    ]);
  };
  var Transitioning = $_567rv0w3jc7tmgc6.create({
    fields: TransitionSchema,
    name: 'transitioning',
    active: $_evi6hv12gjc7tmht9,
    apis: $_6s85gc12hjc7tmhte,
    extra: {
      createRoutes: createRoutes,
      createBistate: createBistate,
      createTristate: createTristate
    }
  });

  var generateFrom$1 = function (spec, all) {
    var schema = $_682tbuw8jc7tmgdz.map(all, function (a) {
      return $_9benqox1jc7tmght.field(a.name(), a.name(), $_vby21x2jc7tmgi0.asOption(), $_c1hr3lxgjc7tmgly.objOf([
        $_9benqox1jc7tmght.strict('config'),
        $_9benqox1jc7tmght.defaulted('state', $_46qvupxpjc7tmgnx)
      ]));
    });
    var validated = $_c1hr3lxgjc7tmgly.asStruct('component.behaviours', $_c1hr3lxgjc7tmgly.objOf(schema), spec.behaviours).fold(function (errInfo) {
      throw new Error($_c1hr3lxgjc7tmgly.formatError(errInfo) + '\nComplete spec:\n' + $_7meawbxejc7tmglk.stringify(spec, null, 2));
    }, $_7wlbdawajc7tmgej.identity);
    return {
      list: all,
      data: $_fvv1p1wzjc7tmgh1.map(validated, function (blobOptionThunk) {
        var blobOption = blobOptionThunk();
        return $_7wlbdawajc7tmgej.constant(blobOption.map(function (blob) {
          return {
            config: blob.config(),
            state: blob.state().init(blob.config())
          };
        }));
      })
    };
  };
  var getBehaviours$1 = function (bData) {
    return bData.list;
  };
  var getData = function (bData) {
    return bData.data;
  };
  var $_bjplfs12mjc7tmhvo = {
    generateFrom: generateFrom$1,
    getBehaviours: getBehaviours$1,
    getData: getData
  };

  var getBehaviours = function (spec) {
    var behaviours = $_ftivuzx5jc7tmgj2.readOptFrom(spec, 'behaviours').getOr({});
    var keys = $_682tbuw8jc7tmgdz.filter($_fvv1p1wzjc7tmgh1.keys(behaviours), function (k) {
      return behaviours[k] !== undefined;
    });
    return $_682tbuw8jc7tmgdz.map(keys, function (k) {
      return spec.behaviours[k].me;
    });
  };
  var generateFrom = function (spec, all) {
    return $_bjplfs12mjc7tmhvo.generateFrom(spec, all);
  };
  var generate$4 = function (spec) {
    var all = getBehaviours(spec);
    return generateFrom(spec, all);
  };
  var $_fd3hod12ljc7tmhva = {
    generate: generate$4,
    generateFrom: generateFrom
  };

  var ComponentApi = $_ax6axixrjc7tmgo6.exactly([
    'getSystem',
    'config',
    'hasConfigured',
    'spec',
    'connect',
    'disconnect',
    'element',
    'syncComponents',
    'readState',
    'components',
    'events'
  ]);

  var SystemApi = $_ax6axixrjc7tmgo6.exactly([
    'debugInfo',
    'triggerFocus',
    'triggerEvent',
    'triggerEscape',
    'addToWorld',
    'removeFromWorld',
    'addToGui',
    'removeFromGui',
    'build',
    'getByUid',
    'getByDom',
    'broadcast',
    'broadcastOn'
  ]);

  var NoContextApi = function (getComp) {
    var fail = function (event) {
      return function () {
        throw new Error('The component must be in a context to send: ' + event + '\n' + $_5d0nway8jc7tmgrj.element(getComp().element()) + ' is not in context.');
      };
    };
    return SystemApi({
      debugInfo: $_7wlbdawajc7tmgej.constant('fake'),
      triggerEvent: fail('triggerEvent'),
      triggerFocus: fail('triggerFocus'),
      triggerEscape: fail('triggerEscape'),
      build: fail('build'),
      addToWorld: fail('addToWorld'),
      removeFromWorld: fail('removeFromWorld'),
      addToGui: fail('addToGui'),
      removeFromGui: fail('removeFromGui'),
      getByUid: fail('getByUid'),
      getByDom: fail('getByDom'),
      broadcast: fail('broadcast'),
      broadcastOn: fail('broadcastOn')
    });
  };

  var byInnerKey = function (data, tuple) {
    var r = {};
    $_fvv1p1wzjc7tmgh1.each(data, function (detail, key) {
      $_fvv1p1wzjc7tmgh1.each(detail, function (value, indexKey) {
        var chain = $_ftivuzx5jc7tmgj2.readOr(indexKey, [])(r);
        r[indexKey] = chain.concat([tuple(key, value)]);
      });
    });
    return r;
  };
  var $_4pvcxb12rjc7tmhwz = { byInnerKey: byInnerKey };

  var behaviourDom = function (name, modification) {
    return {
      name: $_7wlbdawajc7tmgej.constant(name),
      modification: modification
    };
  };
  var concat = function (chain, aspect) {
    var values = $_682tbuw8jc7tmgdz.bind(chain, function (c) {
      return c.modification().getOr([]);
    });
    return $_5x2c31x7jc7tmgjn.value($_ftivuzx5jc7tmgj2.wrap(aspect, values));
  };
  var onlyOne = function (chain, aspect, order) {
    if (chain.length > 1)
      return $_5x2c31x7jc7tmgjn.error('Multiple behaviours have tried to change DOM "' + aspect + '". The guilty behaviours are: ' + $_7meawbxejc7tmglk.stringify($_682tbuw8jc7tmgdz.map(chain, function (b) {
        return b.name();
      })) + '. At this stage, this ' + 'is not supported. Future releases might provide strategies for resolving this.');
    else if (chain.length === 0)
      return $_5x2c31x7jc7tmgjn.value({});
    else
      return $_5x2c31x7jc7tmgjn.value(chain[0].modification().fold(function () {
        return {};
      }, function (m) {
        return $_ftivuzx5jc7tmgj2.wrap(aspect, m);
      }));
  };
  var duplicate = function (aspect, k, obj, behaviours) {
    return $_5x2c31x7jc7tmgjn.error('Mulitple behaviours have tried to change the _' + k + '_ "' + aspect + '"' + '. The guilty behaviours are: ' + $_7meawbxejc7tmglk.stringify($_682tbuw8jc7tmgdz.bind(behaviours, function (b) {
      return b.modification().getOr({})[k] !== undefined ? [b.name()] : [];
    }), null, 2) + '. This is not currently supported.');
  };
  var safeMerge = function (chain, aspect) {
    var y = $_682tbuw8jc7tmgdz.foldl(chain, function (acc, c) {
      var obj = c.modification().getOr({});
      return acc.bind(function (accRest) {
        var parts = $_fvv1p1wzjc7tmgh1.mapToArray(obj, function (v, k) {
          return accRest[k] !== undefined ? duplicate(aspect, k, obj, chain) : $_5x2c31x7jc7tmgjn.value($_ftivuzx5jc7tmgj2.wrap(k, v));
        });
        return $_ftivuzx5jc7tmgj2.consolidate(parts, accRest);
      });
    }, $_5x2c31x7jc7tmgjn.value({}));
    return y.map(function (yValue) {
      return $_ftivuzx5jc7tmgj2.wrap(aspect, yValue);
    });
  };
  var mergeTypes = {
    classes: concat,
    attributes: safeMerge,
    styles: safeMerge,
    domChildren: onlyOne,
    defChildren: onlyOne,
    innerHtml: onlyOne,
    value: onlyOne
  };
  var combine$1 = function (info, baseMod, behaviours, base) {
    var behaviourDoms = $_2nfiamwxjc7tmggx.deepMerge({}, baseMod);
    $_682tbuw8jc7tmgdz.each(behaviours, function (behaviour) {
      behaviourDoms[behaviour.name()] = behaviour.exhibit(info, base);
    });
    var byAspect = $_4pvcxb12rjc7tmhwz.byInnerKey(behaviourDoms, behaviourDom);
    var usedAspect = $_fvv1p1wzjc7tmgh1.map(byAspect, function (values, aspect) {
      return $_682tbuw8jc7tmgdz.bind(values, function (value) {
        return value.modification().fold(function () {
          return [];
        }, function (v) {
          return [value];
        });
      });
    });
    var modifications = $_fvv1p1wzjc7tmgh1.mapToArray(usedAspect, function (values, aspect) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(mergeTypes, aspect).fold(function () {
        return $_5x2c31x7jc7tmgjn.error('Unknown field type: ' + aspect);
      }, function (merger) {
        return merger(values, aspect);
      });
    });
    var consolidated = $_ftivuzx5jc7tmgj2.consolidate(modifications, {});
    return consolidated.map($_f402ywxjjc7tmgmr.nu);
  };
  var $_96slev12qjc7tmhwl = { combine: combine$1 };

  var sortKeys = function (label, keyName, array, order) {
    var sliced = array.slice(0);
    try {
      var sorted = sliced.sort(function (a, b) {
        var aKey = a[keyName]();
        var bKey = b[keyName]();
        var aIndex = order.indexOf(aKey);
        var bIndex = order.indexOf(bKey);
        if (aIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + $_7meawbxejc7tmglk.stringify(order, null, 2));
        if (bIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + $_7meawbxejc7tmglk.stringify(order, null, 2));
        if (aIndex < bIndex)
          return -1;
        else if (bIndex < aIndex)
          return 1;
        else
          return 0;
      });
      return $_5x2c31x7jc7tmgjn.value(sorted);
    } catch (err) {
      return $_5x2c31x7jc7tmgjn.error([err]);
    }
  };
  var $_abuxs912tjc7tmhxm = { sortKeys: sortKeys };

  var nu$7 = function (handler, purpose) {
    return {
      handler: handler,
      purpose: $_7wlbdawajc7tmgej.constant(purpose)
    };
  };
  var curryArgs = function (descHandler, extraArgs) {
    return {
      handler: $_7wlbdawajc7tmgej.curry.apply(undefined, [descHandler.handler].concat(extraArgs)),
      purpose: descHandler.purpose
    };
  };
  var getHandler = function (descHandler) {
    return descHandler.handler;
  };
  var $_40ber812ujc7tmhxv = {
    nu: nu$7,
    curryArgs: curryArgs,
    getHandler: getHandler
  };

  var behaviourTuple = function (name, handler) {
    return {
      name: $_7wlbdawajc7tmgej.constant(name),
      handler: $_7wlbdawajc7tmgej.constant(handler)
    };
  };
  var nameToHandlers = function (behaviours, info) {
    var r = {};
    $_682tbuw8jc7tmgdz.each(behaviours, function (behaviour) {
      r[behaviour.name()] = behaviour.handlers(info);
    });
    return r;
  };
  var groupByEvents = function (info, behaviours, base) {
    var behaviourEvents = $_2nfiamwxjc7tmggx.deepMerge(base, nameToHandlers(behaviours, info));
    return $_4pvcxb12rjc7tmhwz.byInnerKey(behaviourEvents, behaviourTuple);
  };
  var combine$2 = function (info, eventOrder, behaviours, base) {
    var byEventName = groupByEvents(info, behaviours, base);
    return combineGroups(byEventName, eventOrder);
  };
  var assemble = function (rawHandler) {
    var handler = $_d0echfx0jc7tmghf.read(rawHandler);
    return function (component, simulatedEvent) {
      var args = Array.prototype.slice.call(arguments, 0);
      if (handler.abort.apply(undefined, args)) {
        simulatedEvent.stop();
      } else if (handler.can.apply(undefined, args)) {
        handler.run.apply(undefined, args);
      }
    };
  };
  var missingOrderError = function (eventName, tuples) {
    return new $_5x2c31x7jc7tmgjn.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + $_7meawbxejc7tmglk.stringify($_682tbuw8jc7tmgdz.map(tuples, function (c) {
        return c.name();
      }), null, 2)]);
  };
  var fuse$1 = function (tuples, eventOrder, eventName) {
    var order = eventOrder[eventName];
    if (!order)
      return missingOrderError(eventName, tuples);
    else
      return $_abuxs912tjc7tmhxm.sortKeys('Event: ' + eventName, 'name', tuples, order).map(function (sortedTuples) {
        var handlers = $_682tbuw8jc7tmgdz.map(sortedTuples, function (tuple) {
          return tuple.handler();
        });
        return $_d0echfx0jc7tmghf.fuse(handlers);
      });
  };
  var combineGroups = function (byEventName, eventOrder) {
    var r = $_fvv1p1wzjc7tmgh1.mapToArray(byEventName, function (tuples, eventName) {
      var combined = tuples.length === 1 ? $_5x2c31x7jc7tmgjn.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName);
      return combined.map(function (handler) {
        var assembled = assemble(handler);
        var purpose = tuples.length > 1 ? $_682tbuw8jc7tmgdz.filter(eventOrder, function (o) {
          return $_682tbuw8jc7tmgdz.contains(tuples, function (t) {
            return t.name() === o;
          });
        }).join(' > ') : tuples[0].name();
        return $_ftivuzx5jc7tmgj2.wrap(eventName, $_40ber812ujc7tmhxv.nu(assembled, purpose));
      });
    });
    return $_ftivuzx5jc7tmgj2.consolidate(r, {});
  };
  var $_2s1ni12sjc7tmhx6 = { combine: combine$2 };

  var toInfo = function (spec) {
    return $_c1hr3lxgjc7tmgly.asStruct('custom.definition', $_c1hr3lxgjc7tmgly.objOfOnly([
      $_9benqox1jc7tmght.field('dom', 'dom', $_vby21x2jc7tmgi0.strict(), $_c1hr3lxgjc7tmgly.objOfOnly([
        $_9benqox1jc7tmght.strict('tag'),
        $_9benqox1jc7tmght.defaulted('styles', {}),
        $_9benqox1jc7tmght.defaulted('classes', []),
        $_9benqox1jc7tmght.defaulted('attributes', {}),
        $_9benqox1jc7tmght.option('value'),
        $_9benqox1jc7tmght.option('innerHtml')
      ])),
      $_9benqox1jc7tmght.strict('components'),
      $_9benqox1jc7tmght.strict('uid'),
      $_9benqox1jc7tmght.defaulted('events', {}),
      $_9benqox1jc7tmght.defaulted('apis', $_7wlbdawajc7tmgej.constant({})),
      $_9benqox1jc7tmght.field('eventOrder', 'eventOrder', $_vby21x2jc7tmgi0.mergeWith({
        'alloy.execute': [
          'disabling',
          'alloy.base.behaviour',
          'toggling'
        ],
        'alloy.focus': [
          'alloy.base.behaviour',
          'focusing',
          'keying'
        ],
        'alloy.system.init': [
          'alloy.base.behaviour',
          'disabling',
          'toggling',
          'representing'
        ],
        'input': [
          'alloy.base.behaviour',
          'representing',
          'streaming',
          'invalidating'
        ],
        'alloy.system.detached': [
          'alloy.base.behaviour',
          'representing'
        ]
      }), $_c1hr3lxgjc7tmgly.anyValue()),
      $_9benqox1jc7tmght.option('domModification'),
      $_8vhkewysjc7tmgun.snapshot('originalSpec'),
      $_9benqox1jc7tmght.defaulted('debug.sketcher', 'unknown')
    ]), spec);
  };
  var getUid = function (info) {
    return $_ftivuzx5jc7tmgj2.wrap($_cdpbme10mjc7tmhdj.idAttr(), info.uid());
  };
  var toDefinition = function (info) {
    var base = {
      tag: info.dom().tag(),
      classes: info.dom().classes(),
      attributes: $_2nfiamwxjc7tmggx.deepMerge(getUid(info), info.dom().attributes()),
      styles: info.dom().styles(),
      domChildren: $_682tbuw8jc7tmgdz.map(info.components(), function (comp) {
        return comp.element();
      })
    };
    return $_ds2lukxkjc7tmgn9.nu($_2nfiamwxjc7tmggx.deepMerge(base, info.dom().innerHtml().map(function (h) {
      return $_ftivuzx5jc7tmgj2.wrap('innerHtml', h);
    }).getOr({}), info.dom().value().map(function (h) {
      return $_ftivuzx5jc7tmgj2.wrap('value', h);
    }).getOr({})));
  };
  var toModification = function (info) {
    return info.domModification().fold(function () {
      return $_f402ywxjjc7tmgmr.nu({});
    }, $_f402ywxjjc7tmgmr.nu);
  };
  var toApis = function (info) {
    return info.apis();
  };
  var toEvents = function (info) {
    return info.events();
  };
  var $_g2j10712vjc7tmhy3 = {
    toInfo: toInfo,
    toDefinition: toDefinition,
    toModification: toModification,
    toApis: toApis,
    toEvents: toEvents
  };

  var add$3 = function (element, classes) {
    $_682tbuw8jc7tmgdz.each(classes, function (x) {
      $_7lq4x8xtjc7tmgod.add(element, x);
    });
  };
  var remove$6 = function (element, classes) {
    $_682tbuw8jc7tmgdz.each(classes, function (x) {
      $_7lq4x8xtjc7tmgod.remove(element, x);
    });
  };
  var toggle$3 = function (element, classes) {
    $_682tbuw8jc7tmgdz.each(classes, function (x) {
      $_7lq4x8xtjc7tmgod.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_682tbuw8jc7tmgdz.forall(classes, function (clazz) {
      return $_7lq4x8xtjc7tmgod.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_682tbuw8jc7tmgdz.exists(classes, function (clazz) {
      return $_7lq4x8xtjc7tmgod.has(element, clazz);
    });
  };
  var getNative = function (element) {
    var classList = element.dom().classList;
    var r = new Array(classList.length);
    for (var i = 0; i < classList.length; i++) {
      r[i] = classList.item(i);
    }
    return r;
  };
  var get$10 = function (element) {
    return $_2575jcxxjc7tmgp8.supports(element) ? getNative(element) : $_2575jcxxjc7tmgp8.get(element);
  };
  var $_9a028u12xjc7tmhz1 = {
    add: add$3,
    remove: remove$6,
    toggle: toggle$3,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$10
  };

  var getChildren = function (definition) {
    if (definition.domChildren().isSome() && definition.defChildren().isSome()) {
      throw new Error('Cannot specify children and child specs! Must be one or the other.\nDef: ' + $_ds2lukxkjc7tmgn9.defToStr(definition));
    } else {
      return definition.domChildren().fold(function () {
        var defChildren = definition.defChildren().getOr([]);
        return $_682tbuw8jc7tmgdz.map(defChildren, renderDef);
      }, function (domChildren) {
        return domChildren;
      });
    }
  };
  var renderToDom = function (definition) {
    var subject = $_19g44bwsjc7tmgg6.fromTag(definition.tag());
    $_gh0zlbxvjc7tmgol.setAll(subject, definition.attributes().getOr({}));
    $_9a028u12xjc7tmhz1.add(subject, definition.classes().getOr([]));
    $_bq4g3yzrjc7tmh4w.setAll(subject, definition.styles().getOr({}));
    $_fi4lz2yajc7tmgrr.set(subject, definition.innerHtml().getOr(''));
    var children = getChildren(definition);
    $_gieeo8y5jc7tmgqo.append(subject, children);
    definition.value().each(function (value) {
      $_f0maum11zjc7tmhno.set(subject, value);
    });
    return subject;
  };
  var renderDef = function (spec) {
    var definition = $_ds2lukxkjc7tmgn9.nu(spec);
    return renderToDom(definition);
  };
  var $_atfvzv12wjc7tmhyi = { renderToDom: renderToDom };

  var build$1 = function (spec) {
    var getMe = function () {
      return me;
    };
    var systemApi = Cell(NoContextApi(getMe));
    var info = $_c1hr3lxgjc7tmgly.getOrDie($_g2j10712vjc7tmhy3.toInfo($_2nfiamwxjc7tmggx.deepMerge(spec, { behaviours: undefined })));
    var bBlob = $_fd3hod12ljc7tmhva.generate(spec);
    var bList = $_bjplfs12mjc7tmhvo.getBehaviours(bBlob);
    var bData = $_bjplfs12mjc7tmhvo.getData(bBlob);
    var definition = $_g2j10712vjc7tmhy3.toDefinition(info);
    var baseModification = { 'alloy.base.modification': $_g2j10712vjc7tmhy3.toModification(info) };
    var modification = $_96slev12qjc7tmhwl.combine(bData, baseModification, bList, definition).getOrDie();
    var modDefinition = $_f402ywxjjc7tmgmr.merge(definition, modification);
    var item = $_atfvzv12wjc7tmhyi.renderToDom(modDefinition);
    var baseEvents = { 'alloy.base.behaviour': $_g2j10712vjc7tmhy3.toEvents(info) };
    var events = $_2s1ni12sjc7tmhx6.combine(bData, info.eventOrder(), bList, baseEvents).getOrDie();
    var subcomponents = Cell(info.components());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(getMe));
    };
    var syncComponents = function () {
      var children = $_bvq6n5y2jc7tmgq7.children(item);
      var subs = $_682tbuw8jc7tmgdz.bind(children, function (child) {
        return systemApi.get().getByDom(child).fold(function () {
          return [];
        }, function (c) {
          return [c];
        });
      });
      subcomponents.set(subs);
    };
    var config = function (behaviour) {
      if (behaviour === $_eruo9l10ejc7tmhax.apiConfig())
        return info.apis();
      var b = bData;
      var f = $_5ub7o5wyjc7tmggz.isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
        throw new Error('Could not find ' + behaviour.name() + ' in ' + $_7meawbxejc7tmglk.stringify(spec, null, 2));
      };
      return f();
    };
    var hasConfigured = function (behaviour) {
      return $_5ub7o5wyjc7tmggz.isFunction(bData[behaviour.name()]);
    };
    var readState = function (behaviourName) {
      return bData[behaviourName]().map(function (b) {
        return b.state.readState();
      }).getOr('not enabled');
    };
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: config,
      hasConfigured: hasConfigured,
      spec: $_7wlbdawajc7tmgej.constant(spec),
      readState: readState,
      connect: connect,
      disconnect: disconnect,
      element: $_7wlbdawajc7tmgej.constant(item),
      syncComponents: syncComponents,
      components: subcomponents.get,
      events: $_7wlbdawajc7tmgej.constant(events)
    });
    return me;
  };
  var $_70pkst12kjc7tmhuq = { build: build$1 };

  var isRecursive = function (component, originator, target) {
    return $_b6kzgmw7jc7tmgdr.eq(originator, component.element()) && !$_b6kzgmw7jc7tmgdr.eq(originator, target);
  };
  var $_55dcyw12yjc7tmhz8 = {
    events: $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.can($_66ekuowvjc7tmggn.focus(), function (component, simulatedEvent) {
        var originator = simulatedEvent.event().originator();
        var target = simulatedEvent.event().target();
        if (isRecursive(component, originator, target)) {
          console.warn($_66ekuowvjc7tmggn.focus() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + $_5d0nway8jc7tmgrj.element(originator) + '\nTarget: ' + $_5d0nway8jc7tmgrj.element(target) + '\nCheck the ' + $_66ekuowvjc7tmggn.focus() + ' event handlers');
          return false;
        } else {
          return true;
        }
      })])
  };

  var make$1 = function (spec) {
    return spec;
  };
  var $_6zo5jt12zjc7tmhzd = { make: make$1 };

  var buildSubcomponents = function (spec) {
    var components = $_ftivuzx5jc7tmgj2.readOr('components', [])(spec);
    return $_682tbuw8jc7tmgdz.map(components, build);
  };
  var buildFromSpec = function (userSpec) {
    var spec = $_6zo5jt12zjc7tmhzd.make(userSpec);
    var components = buildSubcomponents(spec);
    var completeSpec = $_2nfiamwxjc7tmggx.deepMerge($_55dcyw12yjc7tmhz8, spec, $_ftivuzx5jc7tmgj2.wrap('components', components));
    return $_5x2c31x7jc7tmgjn.value($_70pkst12kjc7tmhuq.build(completeSpec));
  };
  var text = function (textContent) {
    var element = $_19g44bwsjc7tmgg6.fromText(textContent);
    return external({ element: element });
  };
  var external = function (spec) {
    var extSpec = $_c1hr3lxgjc7tmgly.asStructOrDie('external.component', $_c1hr3lxgjc7tmgly.objOfOnly([
      $_9benqox1jc7tmght.strict('element'),
      $_9benqox1jc7tmght.option('uid')
    ]), spec);
    var systemApi = Cell(NoContextApi());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(function () {
        return me;
      }));
    };
    extSpec.uid().each(function (uid) {
      $_95kbix10ljc7tmhd8.writeOnly(extSpec.element(), uid);
    });
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: $_7db13lw9jc7tmgee.none,
      hasConfigured: $_7wlbdawajc7tmgej.constant(false),
      connect: connect,
      disconnect: disconnect,
      element: $_7wlbdawajc7tmgej.constant(extSpec.element()),
      spec: $_7wlbdawajc7tmgej.constant(spec),
      readState: $_7wlbdawajc7tmgej.constant('No state'),
      syncComponents: $_7wlbdawajc7tmgej.noop,
      components: $_7wlbdawajc7tmgej.constant([]),
      events: $_7wlbdawajc7tmgej.constant({})
    });
    return $_eruo9l10ejc7tmhax.premade(me);
  };
  var build = function (rawUserSpec) {
    return $_eruo9l10ejc7tmhax.getPremade(rawUserSpec).fold(function () {
      var userSpecWithUid = $_2nfiamwxjc7tmggx.deepMerge({ uid: $_95kbix10ljc7tmhd8.generate('') }, rawUserSpec);
      return buildFromSpec(userSpecWithUid).getOrDie();
    }, function (prebuilt) {
      return prebuilt;
    });
  };
  var $_9yx6nt12jjc7tmhu8 = {
    build: build,
    premade: $_eruo9l10ejc7tmhax.premade,
    external: external,
    text: text
  };

  var hoverEvent = 'alloy.item-hover';
  var focusEvent = 'alloy.item-focus';
  var onHover = function (item) {
    if ($_aqgip2yfjc7tmgse.search(item.element()).isNone() || Focusing.isFocused(item)) {
      if (!Focusing.isFocused(item))
        Focusing.focus(item);
      $_7zx0zrwujc7tmgge.emitWith(item, hoverEvent, { item: item });
    }
  };
  var onFocus = function (item) {
    $_7zx0zrwujc7tmgge.emitWith(item, focusEvent, { item: item });
  };
  var $_8d8h8f133jc7tmi04 = {
    hover: $_7wlbdawajc7tmgej.constant(hoverEvent),
    focus: $_7wlbdawajc7tmgej.constant(focusEvent),
    onHover: onHover,
    onFocus: onFocus
  };

  var builder = function (info) {
    return {
      dom: $_2nfiamwxjc7tmggx.deepMerge(info.dom(), { attributes: { role: info.toggling().isSome() ? 'menuitemcheckbox' : 'menuitem' } }),
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
        info.toggling().fold(Toggling.revoke, function (tConfig) {
          return Toggling.config($_2nfiamwxjc7tmggx.deepMerge({ aria: { mode: 'checked' } }, tConfig));
        }),
        Focusing.config({
          ignore: info.ignoreFocus(),
          onFocus: function (component) {
            $_8d8h8f133jc7tmi04.onFocus(component);
          }
        }),
        Keying.config({ mode: 'execution' }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        })
      ]), info.itemBehaviours()),
      events: $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.runWithTarget($_66ekuowvjc7tmggn.tapOrClick(), $_7zx0zrwujc7tmgge.emitExecute),
        $_3oclftw5jc7tmgdb.cutter($_dpjvxuwwjc7tmggu.mousedown()),
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mouseover(), $_8d8h8f133jc7tmi04.onHover),
        $_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.focusItem(), Focusing.focus)
      ]),
      components: info.components(),
      domModification: info.domModification()
    };
  };
  var schema$11 = [
    $_9benqox1jc7tmght.strict('data'),
    $_9benqox1jc7tmght.strict('components'),
    $_9benqox1jc7tmght.strict('dom'),
    $_9benqox1jc7tmght.option('toggling'),
    $_9benqox1jc7tmght.defaulted('itemBehaviours', {}),
    $_9benqox1jc7tmght.defaulted('ignoreFocus', false),
    $_9benqox1jc7tmght.defaulted('domModification', {}),
    $_8vhkewysjc7tmgun.output('builder', builder)
  ];

  var builder$1 = function (detail) {
    return {
      dom: detail.dom(),
      components: detail.components(),
      events: $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.stopper($_66ekuowvjc7tmggn.focusItem())])
    };
  };
  var schema$12 = [
    $_9benqox1jc7tmght.strict('dom'),
    $_9benqox1jc7tmght.strict('components'),
    $_8vhkewysjc7tmgun.output('builder', builder$1)
  ];

  var owner$2 = 'item-widget';
  var partTypes = [$_61s39h10jjc7tmhc6.required({
      name: 'widget',
      overrides: function (detail) {
        return {
          behaviours: $_567rv0w3jc7tmgc6.derive([me.config({
              store: {
                mode: 'manual',
                getValue: function (component) {
                  return detail.data();
                },
                setValue: function () {
                }
              }
            })])
        };
      }
    })];
  var $_2b9pg1136jc7tmi0r = {
    owner: $_7wlbdawajc7tmgej.constant(owner$2),
    parts: $_7wlbdawajc7tmgej.constant(partTypes)
  };

  var builder$2 = function (info) {
    var subs = $_dz5zok10hjc7tmhbg.substitutes($_2b9pg1136jc7tmi0r.owner(), info, $_2b9pg1136jc7tmi0r.parts());
    var components = $_dz5zok10hjc7tmhbg.components($_2b9pg1136jc7tmi0r.owner(), info, subs.internals());
    var focusWidget = function (component) {
      return $_dz5zok10hjc7tmhbg.getPart(component, info, 'widget').map(function (widget) {
        Keying.focusIn(widget);
        return widget;
      });
    };
    var onHorizontalArrow = function (component, simulatedEvent) {
      return $_78m48zwjc7tmh6a.inside(simulatedEvent.event().target()) ? $_7db13lw9jc7tmgee.none() : function () {
        if (info.autofocus()) {
          simulatedEvent.setSource(component.element());
          return $_7db13lw9jc7tmgee.none();
        } else {
          return $_7db13lw9jc7tmgee.none();
        }
      }();
    };
    return $_2nfiamwxjc7tmggx.deepMerge({
      dom: info.dom(),
      components: components,
      domModification: info.domModification(),
      events: $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.runOnExecute(function (component, simulatedEvent) {
          focusWidget(component).each(function (widget) {
            simulatedEvent.stop();
          });
        }),
        $_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.mouseover(), $_8d8h8f133jc7tmi04.onHover),
        $_3oclftw5jc7tmgdb.run($_66ekuowvjc7tmggn.focusItem(), function (component, simulatedEvent) {
          if (info.autofocus())
            focusWidget(component);
          else
            Focusing.focus(component);
        })
      ]),
      behaviours: $_567rv0w3jc7tmgc6.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        }),
        Focusing.config({
          onFocus: function (component) {
            $_8d8h8f133jc7tmi04.onFocus(component);
          }
        }),
        Keying.config({
          mode: 'special',
          onLeft: onHorizontalArrow,
          onRight: onHorizontalArrow,
          onEscape: function (component, simulatedEvent) {
            if (!Focusing.isFocused(component) && !info.autofocus()) {
              Focusing.focus(component);
              return $_7db13lw9jc7tmgee.some(true);
            } else if (info.autofocus()) {
              simulatedEvent.setSource(component.element());
              return $_7db13lw9jc7tmgee.none();
            } else {
              return $_7db13lw9jc7tmgee.none();
            }
          }
        })
      ])
    });
  };
  var schema$13 = [
    $_9benqox1jc7tmght.strict('uid'),
    $_9benqox1jc7tmght.strict('data'),
    $_9benqox1jc7tmght.strict('components'),
    $_9benqox1jc7tmght.strict('dom'),
    $_9benqox1jc7tmght.defaulted('autofocus', false),
    $_9benqox1jc7tmght.defaulted('domModification', {}),
    $_dz5zok10hjc7tmhbg.defaultUidsSchema($_2b9pg1136jc7tmi0r.parts()),
    $_8vhkewysjc7tmgun.output('builder', builder$2)
  ];

  var itemSchema$1 = $_c1hr3lxgjc7tmgly.choose('type', {
    widget: schema$13,
    item: schema$11,
    separator: schema$12
  });
  var configureGrid = function (detail, movementInfo) {
    return {
      mode: 'flatgrid',
      selector: '.' + detail.markers().item(),
      initSize: {
        numColumns: movementInfo.initSize().numColumns(),
        numRows: movementInfo.initSize().numRows()
      },
      focusManager: detail.focusManager()
    };
  };
  var configureMenu = function (detail, movementInfo) {
    return {
      mode: 'menu',
      selector: '.' + detail.markers().item(),
      moveOnTab: movementInfo.moveOnTab(),
      focusManager: detail.focusManager()
    };
  };
  var parts = [$_61s39h10jjc7tmhc6.group({
      factory: {
        sketch: function (spec) {
          var itemInfo = $_c1hr3lxgjc7tmgly.asStructOrDie('menu.spec item', itemSchema$1, spec);
          return itemInfo.builder()(itemInfo);
        }
      },
      name: 'items',
      unit: 'item',
      defaults: function (detail, u) {
        var fallbackUid = $_95kbix10ljc7tmhd8.generate('');
        return $_2nfiamwxjc7tmggx.deepMerge({ uid: fallbackUid }, u);
      },
      overrides: function (detail, u) {
        return {
          type: u.type,
          ignoreFocus: detail.fakeFocus(),
          domModification: { classes: [detail.markers().item()] }
        };
      }
    })];
  var schema$10 = [
    $_9benqox1jc7tmght.strict('value'),
    $_9benqox1jc7tmght.strict('items'),
    $_9benqox1jc7tmght.strict('dom'),
    $_9benqox1jc7tmght.strict('components'),
    $_9benqox1jc7tmght.defaulted('eventOrder', {}),
    $_qqqz410cjc7tmhaf.field('menuBehaviours', [
      Highlighting,
      me,
      Composing,
      Keying
    ]),
    $_9benqox1jc7tmght.defaultedOf('movement', {
      mode: 'menu',
      moveOnTab: true
    }, $_c1hr3lxgjc7tmgly.choose('mode', {
      grid: [
        $_8vhkewysjc7tmgun.initSize(),
        $_8vhkewysjc7tmgun.output('config', configureGrid)
      ],
      menu: [
        $_9benqox1jc7tmght.defaulted('moveOnTab', true),
        $_8vhkewysjc7tmgun.output('config', configureMenu)
      ]
    })),
    $_8vhkewysjc7tmgun.itemMarkers(),
    $_9benqox1jc7tmght.defaulted('fakeFocus', false),
    $_9benqox1jc7tmght.defaulted('focusManager', $_98ohzrzfjc7tmh0d.dom()),
    $_8vhkewysjc7tmgun.onHandler('onHighlight')
  ];
  var $_2iscp8131jc7tmhzm = {
    name: $_7wlbdawajc7tmgej.constant('Menu'),
    schema: $_7wlbdawajc7tmgej.constant(schema$10),
    parts: $_7wlbdawajc7tmgej.constant(parts)
  };

  var focusEvent$1 = 'alloy.menu-focus';
  var $_185nn138jc7tmi16 = { focus: $_7wlbdawajc7tmgej.constant(focusEvent$1) };

  var make$2 = function (detail, components, spec, externals) {
    return $_2nfiamwxjc7tmggx.deepMerge({
      dom: $_2nfiamwxjc7tmggx.deepMerge(detail.dom(), { attributes: { role: 'menu' } }),
      uid: detail.uid(),
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
        Highlighting.config({
          highlightClass: detail.markers().selectedItem(),
          itemClass: detail.markers().item(),
          onHighlight: detail.onHighlight()
        }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.value()
          }
        }),
        Composing.config({ find: $_7wlbdawajc7tmgej.identity }),
        Keying.config(detail.movement().config()(detail, detail.movement()))
      ]), $_qqqz410cjc7tmhaf.get(detail.menuBehaviours())),
      events: $_3oclftw5jc7tmgdb.derive([
        $_3oclftw5jc7tmgdb.run($_8d8h8f133jc7tmi04.focus(), function (menu, simulatedEvent) {
          var event = simulatedEvent.event();
          menu.getSystem().getByDom(event.target()).each(function (item) {
            Highlighting.highlight(menu, item);
            simulatedEvent.stop();
            $_7zx0zrwujc7tmgge.emitWith(menu, $_185nn138jc7tmi16.focus(), {
              menu: menu,
              item: item
            });
          });
        }),
        $_3oclftw5jc7tmgdb.run($_8d8h8f133jc7tmi04.hover(), function (menu, simulatedEvent) {
          var item = simulatedEvent.event().item();
          Highlighting.highlight(menu, item);
        })
      ]),
      components: components,
      eventOrder: detail.eventOrder()
    });
  };
  var $_ea97sf137jc7tmi0y = { make: make$2 };

  var Menu = $_2r0fok10djc7tmham.composite({
    name: 'Menu',
    configFields: $_2iscp8131jc7tmhzm.schema(),
    partFields: $_2iscp8131jc7tmhzm.parts(),
    factory: $_ea97sf137jc7tmi0y.make
  });

  var preserve$2 = function (f, container) {
    var ownerDoc = $_bvq6n5y2jc7tmgq7.owner(container);
    var refocus = $_aqgip2yfjc7tmgse.active(ownerDoc).bind(function (focused) {
      var hasFocus = function (elem) {
        return $_b6kzgmw7jc7tmgdr.eq(focused, elem);
      };
      return hasFocus(container) ? $_7db13lw9jc7tmgee.some(container) : $_63he74yhjc7tmgsm.descendant(container, hasFocus);
    });
    var result = f(container);
    refocus.each(function (oldFocus) {
      $_aqgip2yfjc7tmgse.active(ownerDoc).filter(function (newFocus) {
        return $_b6kzgmw7jc7tmgdr.eq(newFocus, oldFocus);
      }).orThunk(function () {
        $_aqgip2yfjc7tmgse.focus(oldFocus);
      });
    });
    return result;
  };
  var $_3u4ilt13cjc7tmi25 = { preserve: preserve$2 };

  var set$7 = function (component, replaceConfig, replaceState, data) {
    $_4yvg8yy0jc7tmgpq.detachChildren(component);
    $_3u4ilt13cjc7tmi25.preserve(function () {
      var children = $_682tbuw8jc7tmgdz.map(data, component.getSystem().build);
      $_682tbuw8jc7tmgdz.each(children, function (l) {
        $_4yvg8yy0jc7tmgpq.attach(component, l);
      });
    }, component.element());
  };
  var insert = function (component, replaceConfig, insertion, childSpec) {
    var child = component.getSystem().build(childSpec);
    $_4yvg8yy0jc7tmgpq.attachWith(component, child, insertion);
  };
  var append$2 = function (component, replaceConfig, replaceState, appendee) {
    insert(component, replaceConfig, $_972741y1jc7tmgq3.append, appendee);
  };
  var prepend$2 = function (component, replaceConfig, replaceState, prependee) {
    insert(component, replaceConfig, $_972741y1jc7tmgq3.prepend, prependee);
  };
  var remove$7 = function (component, replaceConfig, replaceState, removee) {
    var children = contents(component, replaceConfig);
    var foundChild = $_682tbuw8jc7tmgdz.find(children, function (child) {
      return $_b6kzgmw7jc7tmgdr.eq(removee.element(), child.element());
    });
    foundChild.each($_4yvg8yy0jc7tmgpq.detach);
  };
  var contents = function (component, replaceConfig) {
    return component.components();
  };
  var $_5cvx5d13bjc7tmi1o = {
    append: append$2,
    prepend: prepend$2,
    remove: remove$7,
    set: set$7,
    contents: contents
  };

  var Replacing = $_567rv0w3jc7tmgc6.create({
    fields: [],
    name: 'replacing',
    apis: $_5cvx5d13bjc7tmi1o
  });

  var transpose = function (obj) {
    return $_fvv1p1wzjc7tmgh1.tupleMap(obj, function (v, k) {
      return {
        k: v,
        v: k
      };
    });
  };
  var trace = function (items, byItem, byMenu, finish) {
    return $_ftivuzx5jc7tmgj2.readOptFrom(byMenu, finish).bind(function (triggerItem) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(items, triggerItem).bind(function (triggerMenu) {
        var rest = trace(items, byItem, byMenu, triggerMenu);
        return $_7db13lw9jc7tmgee.some([triggerMenu].concat(rest));
      });
    }).getOr([]);
  };
  var generate$5 = function (menus, expansions) {
    var items = {};
    $_fvv1p1wzjc7tmgh1.each(menus, function (menuItems, menu) {
      $_682tbuw8jc7tmgdz.each(menuItems, function (item) {
        items[item] = menu;
      });
    });
    var byItem = expansions;
    var byMenu = transpose(expansions);
    var menuPaths = $_fvv1p1wzjc7tmgh1.map(byMenu, function (triggerItem, submenu) {
      return [submenu].concat(trace(items, byItem, byMenu, submenu));
    });
    return $_fvv1p1wzjc7tmgh1.map(items, function (path) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(menuPaths, path).getOr([path]);
    });
  };
  var $_14lg0113fjc7tmi3r = { generate: generate$5 };

  var LayeredState = function () {
    var expansions = Cell({});
    var menus = Cell({});
    var paths = Cell({});
    var primary = Cell($_7db13lw9jc7tmgee.none());
    var toItemValues = Cell($_7wlbdawajc7tmgej.constant([]));
    var clear = function () {
      expansions.set({});
      menus.set({});
      paths.set({});
      primary.set($_7db13lw9jc7tmgee.none());
    };
    var isClear = function () {
      return primary.get().isNone();
    };
    var setContents = function (sPrimary, sMenus, sExpansions, sToItemValues) {
      primary.set($_7db13lw9jc7tmgee.some(sPrimary));
      expansions.set(sExpansions);
      menus.set(sMenus);
      toItemValues.set(sToItemValues);
      var menuValues = sToItemValues(sMenus);
      var sPaths = $_14lg0113fjc7tmi3r.generate(menuValues, sExpansions);
      paths.set(sPaths);
    };
    var expand = function (itemValue) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(expansions.get(), itemValue).map(function (menu) {
        var current = $_ftivuzx5jc7tmgj2.readOptFrom(paths.get(), itemValue).getOr([]);
        return [menu].concat(current);
      });
    };
    var collapse = function (itemValue) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(paths.get(), itemValue).bind(function (path) {
        return path.length > 1 ? $_7db13lw9jc7tmgee.some(path.slice(1)) : $_7db13lw9jc7tmgee.none();
      });
    };
    var refresh = function (itemValue) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(paths.get(), itemValue);
    };
    var lookupMenu = function (menuValue) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(menus.get(), menuValue);
    };
    var otherMenus = function (path) {
      var menuValues = toItemValues.get()(menus.get());
      return $_682tbuw8jc7tmgdz.difference($_fvv1p1wzjc7tmgh1.keys(menuValues), path);
    };
    var getPrimary = function () {
      return primary.get().bind(lookupMenu);
    };
    var getMenus = function () {
      return menus.get();
    };
    return {
      setContents: setContents,
      expand: expand,
      refresh: refresh,
      collapse: collapse,
      lookupMenu: lookupMenu,
      otherMenus: otherMenus,
      getPrimary: getPrimary,
      getMenus: getMenus,
      clear: clear,
      isClear: isClear
    };
  };

  var make$3 = function (detail, rawUiSpec) {
    var buildMenus = function (container, menus) {
      return $_fvv1p1wzjc7tmgh1.map(menus, function (spec, name) {
        var data = Menu.sketch($_2nfiamwxjc7tmggx.deepMerge(spec, {
          value: name,
          items: spec.items,
          markers: $_ftivuzx5jc7tmgj2.narrow(rawUiSpec.markers, [
            'item',
            'selectedItem'
          ]),
          fakeFocus: detail.fakeFocus(),
          onHighlight: detail.onHighlight(),
          focusManager: detail.fakeFocus() ? $_98ohzrzfjc7tmh0d.highlights() : $_98ohzrzfjc7tmh0d.dom()
        }));
        return container.getSystem().build(data);
      });
    };
    var state = LayeredState();
    var setup = function (container) {
      var componentMap = buildMenus(container, detail.data().menus());
      state.setContents(detail.data().primary(), componentMap, detail.data().expansions(), function (sMenus) {
        return toMenuValues(container, sMenus);
      });
      return state.getPrimary();
    };
    var getItemValue = function (item) {
      return me.getValue(item).value;
    };
    var toMenuValues = function (container, sMenus) {
      return $_fvv1p1wzjc7tmgh1.map(detail.data().menus(), function (data, menuName) {
        return $_682tbuw8jc7tmgdz.bind(data.items, function (item) {
          return item.type === 'separator' ? [] : [item.data.value];
        });
      });
    };
    var setActiveMenu = function (container, menu) {
      Highlighting.highlight(container, menu);
      Highlighting.getHighlighted(menu).orThunk(function () {
        return Highlighting.getFirst(menu);
      }).each(function (item) {
        $_7zx0zrwujc7tmgge.dispatch(container, item.element(), $_66ekuowvjc7tmggn.focusItem());
      });
    };
    var getMenus = function (state, menuValues) {
      return $_eidt8kydjc7tmgsa.cat($_682tbuw8jc7tmgdz.map(menuValues, state.lookupMenu));
    };
    var updateMenuPath = function (container, state, path) {
      return $_7db13lw9jc7tmgee.from(path[0]).bind(state.lookupMenu).map(function (activeMenu) {
        var rest = getMenus(state, path.slice(1));
        $_682tbuw8jc7tmgdz.each(rest, function (r) {
          $_7lq4x8xtjc7tmgod.add(r.element(), detail.markers().backgroundMenu());
        });
        if (!$_5q4xj9y6jc7tmgqt.inBody(activeMenu.element())) {
          Replacing.append(container, $_9yx6nt12jjc7tmhu8.premade(activeMenu));
        }
        $_9a028u12xjc7tmhz1.remove(activeMenu.element(), [detail.markers().backgroundMenu()]);
        setActiveMenu(container, activeMenu);
        var others = getMenus(state, state.otherMenus(path));
        $_682tbuw8jc7tmgdz.each(others, function (o) {
          $_9a028u12xjc7tmhz1.remove(o.element(), [detail.markers().backgroundMenu()]);
          if (!detail.stayInDom())
            Replacing.remove(container, o);
        });
        return activeMenu;
      });
    };
    var expandRight = function (container, item) {
      var value = getItemValue(item);
      return state.expand(value).bind(function (path) {
        $_7db13lw9jc7tmgee.from(path[0]).bind(state.lookupMenu).each(function (activeMenu) {
          if (!$_5q4xj9y6jc7tmgqt.inBody(activeMenu.element())) {
            Replacing.append(container, $_9yx6nt12jjc7tmhu8.premade(activeMenu));
          }
          detail.onOpenSubmenu()(container, item, activeMenu);
          Highlighting.highlightFirst(activeMenu);
        });
        return updateMenuPath(container, state, path);
      });
    };
    var collapseLeft = function (container, item) {
      var value = getItemValue(item);
      return state.collapse(value).bind(function (path) {
        return updateMenuPath(container, state, path).map(function (activeMenu) {
          detail.onCollapseMenu()(container, item, activeMenu);
          return activeMenu;
        });
      });
    };
    var updateView = function (container, item) {
      var value = getItemValue(item);
      return state.refresh(value).bind(function (path) {
        return updateMenuPath(container, state, path);
      });
    };
    var onRight = function (container, item) {
      return $_78m48zwjc7tmh6a.inside(item.element()) ? $_7db13lw9jc7tmgee.none() : expandRight(container, item);
    };
    var onLeft = function (container, item) {
      return $_78m48zwjc7tmh6a.inside(item.element()) ? $_7db13lw9jc7tmgee.none() : collapseLeft(container, item);
    };
    var onEscape = function (container, item) {
      return collapseLeft(container, item).orThunk(function () {
        return detail.onEscape()(container, item);
      });
    };
    var keyOnItem = function (f) {
      return function (container, simulatedEvent) {
        return $_el2q49zljc7tmh27.closest(simulatedEvent.getSource(), '.' + detail.markers().item()).bind(function (target) {
          return container.getSystem().getByDom(target).bind(function (item) {
            return f(container, item);
          });
        });
      };
    };
    var events = $_3oclftw5jc7tmgdb.derive([
      $_3oclftw5jc7tmgdb.run($_185nn138jc7tmi16.focus(), function (sandbox, simulatedEvent) {
        var menu = simulatedEvent.event().menu();
        Highlighting.highlight(sandbox, menu);
      }),
      $_3oclftw5jc7tmgdb.runOnExecute(function (sandbox, simulatedEvent) {
        var target = simulatedEvent.event().target();
        return sandbox.getSystem().getByDom(target).bind(function (item) {
          var itemValue = getItemValue(item);
          if (itemValue.indexOf('collapse-item') === 0) {
            return collapseLeft(sandbox, item);
          }
          return expandRight(sandbox, item).orThunk(function () {
            return detail.onExecute()(sandbox, item);
          });
        });
      }),
      $_3oclftw5jc7tmgdb.runOnAttached(function (container, simulatedEvent) {
        setup(container).each(function (primary) {
          Replacing.append(container, $_9yx6nt12jjc7tmhu8.premade(primary));
          if (detail.openImmediately()) {
            setActiveMenu(container, primary);
            detail.onOpenMenu()(container, primary);
          }
        });
      })
    ].concat(detail.navigateOnHover() ? [$_3oclftw5jc7tmgdb.run($_8d8h8f133jc7tmi04.hover(), function (sandbox, simulatedEvent) {
        var item = simulatedEvent.event().item();
        updateView(sandbox, item);
        expandRight(sandbox, item);
        detail.onHover()(sandbox, item);
      })] : []));
    var collapseMenuApi = function (container) {
      Highlighting.getHighlighted(container).each(function (currentMenu) {
        Highlighting.getHighlighted(currentMenu).each(function (currentItem) {
          collapseLeft(container, currentItem);
        });
      });
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([
        Keying.config({
          mode: 'special',
          onRight: keyOnItem(onRight),
          onLeft: keyOnItem(onLeft),
          onEscape: keyOnItem(onEscape),
          focusIn: function (container, keyInfo) {
            state.getPrimary().each(function (primary) {
              $_7zx0zrwujc7tmgge.dispatch(container, primary.element(), $_66ekuowvjc7tmggn.focusItem());
            });
          }
        }),
        Highlighting.config({
          highlightClass: detail.markers().selectedMenu(),
          itemClass: detail.markers().menu()
        }),
        Composing.config({
          find: function (container) {
            return Highlighting.getHighlighted(container);
          }
        }),
        Replacing.config({})
      ]), $_qqqz410cjc7tmhaf.get(detail.tmenuBehaviours())),
      eventOrder: detail.eventOrder(),
      apis: { collapseMenu: collapseMenuApi },
      events: events
    };
  };
  var $_2tqj7213djc7tmi2j = {
    make: make$3,
    collapseItem: $_7wlbdawajc7tmgej.constant('collapse-item')
  };

  var tieredData = function (primary, menus, expansions) {
    return {
      primary: primary,
      menus: menus,
      expansions: expansions
    };
  };
  var singleData = function (name, menu) {
    return {
      primary: name,
      menus: $_ftivuzx5jc7tmgj2.wrap(name, menu),
      expansions: {}
    };
  };
  var collapseItem = function (text) {
    return {
      value: $_2dzfis10fjc7tmhb2.generate($_2tqj7213djc7tmi2j.collapseItem()),
      text: text
    };
  };
  var TieredMenu = $_2r0fok10djc7tmham.single({
    name: 'TieredMenu',
    configFields: [
      $_8vhkewysjc7tmgun.onStrictKeyboardHandler('onExecute'),
      $_8vhkewysjc7tmgun.onStrictKeyboardHandler('onEscape'),
      $_8vhkewysjc7tmgun.onStrictHandler('onOpenMenu'),
      $_8vhkewysjc7tmgun.onStrictHandler('onOpenSubmenu'),
      $_8vhkewysjc7tmgun.onHandler('onCollapseMenu'),
      $_9benqox1jc7tmght.defaulted('openImmediately', true),
      $_9benqox1jc7tmght.strictObjOf('data', [
        $_9benqox1jc7tmght.strict('primary'),
        $_9benqox1jc7tmght.strict('menus'),
        $_9benqox1jc7tmght.strict('expansions')
      ]),
      $_9benqox1jc7tmght.defaulted('fakeFocus', false),
      $_8vhkewysjc7tmgun.onHandler('onHighlight'),
      $_8vhkewysjc7tmgun.onHandler('onHover'),
      $_8vhkewysjc7tmgun.tieredMenuMarkers(),
      $_9benqox1jc7tmght.strict('dom'),
      $_9benqox1jc7tmght.defaulted('navigateOnHover', true),
      $_9benqox1jc7tmght.defaulted('stayInDom', false),
      $_qqqz410cjc7tmhaf.field('tmenuBehaviours', [
        Keying,
        Highlighting,
        Composing,
        Replacing
      ]),
      $_9benqox1jc7tmght.defaulted('eventOrder', {})
    ],
    apis: {
      collapseMenu: function (apis, tmenu) {
        apis.collapseMenu(tmenu);
      }
    },
    factory: $_2tqj7213djc7tmi2j.make,
    extraApis: {
      tieredData: tieredData,
      singleData: singleData,
      collapseItem: collapseItem
    }
  });

  var scrollable = $_fej2h3z0jc7tmgwt.resolve('scrollable');
  var register$1 = function (element) {
    $_7lq4x8xtjc7tmgod.add(element, scrollable);
  };
  var deregister = function (element) {
    $_7lq4x8xtjc7tmgod.remove(element, scrollable);
  };
  var $_5xsloy13gjc7tmi41 = {
    register: register$1,
    deregister: deregister,
    scrollable: $_7wlbdawajc7tmgej.constant(scrollable)
  };

  var getValue$4 = function (item) {
    return $_ftivuzx5jc7tmgj2.readOptFrom(item, 'format').getOr(item.title);
  };
  var convert$1 = function (formats, memMenuThunk) {
    var mainMenu = makeMenu('Styles', [].concat($_682tbuw8jc7tmgdz.map(formats.items, function (k) {
      return makeItem(getValue$4(k), k.title, k.isSelected(), k.getPreview(), $_ftivuzx5jc7tmgj2.hasKey(formats.expansions, getValue$4(k)));
    })), memMenuThunk, false);
    var submenus = $_fvv1p1wzjc7tmgh1.map(formats.menus, function (menuItems, menuName) {
      var items = $_682tbuw8jc7tmgdz.map(menuItems, function (item) {
        return makeItem(getValue$4(item), item.title, item.isSelected !== undefined ? item.isSelected() : false, item.getPreview !== undefined ? item.getPreview() : '', $_ftivuzx5jc7tmgj2.hasKey(formats.expansions, getValue$4(item)));
      });
      return makeMenu(menuName, items, memMenuThunk, true);
    });
    var menus = $_2nfiamwxjc7tmggx.deepMerge(submenus, $_ftivuzx5jc7tmgj2.wrap('styles', mainMenu));
    var tmenu = TieredMenu.tieredData('styles', menus, formats.expansions);
    return { tmenu: tmenu };
  };
  var makeItem = function (value, text, selected, preview, isMenu) {
    return {
      data: {
        value: value,
        text: text
      },
      type: 'item',
      dom: {
        tag: 'div',
        classes: isMenu ? [$_fej2h3z0jc7tmgwt.resolve('styles-item-is-menu')] : []
      },
      toggling: {
        toggleOnExecute: false,
        toggleClass: $_fej2h3z0jc7tmgwt.resolve('format-matches'),
        selected: selected
      },
      itemBehaviours: $_567rv0w3jc7tmgc6.derive(isMenu ? [] : [$_c7bmb0yzjc7tmgwp.format(value, function (comp, status) {
          var toggle = status ? Toggling.on : Toggling.off;
          toggle(comp);
        })]),
      components: [{
          dom: {
            tag: 'div',
            attributes: { style: preview },
            innerHtml: text
          }
        }]
    };
  };
  var makeMenu = function (value, items, memMenuThunk, collapsable) {
    return {
      value: value,
      dom: { tag: 'div' },
      components: [
        Button.sketch({
          dom: {
            tag: 'div',
            classes: [$_fej2h3z0jc7tmgwt.resolve('styles-collapser')]
          },
          components: collapsable ? [
            {
              dom: {
                tag: 'span',
                classes: [$_fej2h3z0jc7tmgwt.resolve('styles-collapse-icon')]
              }
            },
            $_9yx6nt12jjc7tmhu8.text(value)
          ] : [$_9yx6nt12jjc7tmhu8.text(value)],
          action: function (item) {
            if (collapsable) {
              var comp = memMenuThunk().get(item);
              TieredMenu.collapseMenu(comp);
            }
          }
        }),
        {
          dom: {
            tag: 'div',
            classes: [$_fej2h3z0jc7tmgwt.resolve('styles-menu-items-container')]
          },
          components: [Menu.parts().items({})],
          behaviours: $_567rv0w3jc7tmgc6.derive([$_2nfmit11rjc7tmhm8.config('adhoc-scrollable-menu', [
              $_3oclftw5jc7tmgdb.runOnAttached(function (component, simulatedEvent) {
                $_bq4g3yzrjc7tmh4w.set(component.element(), 'overflow-y', 'auto');
                $_bq4g3yzrjc7tmh4w.set(component.element(), '-webkit-overflow-scrolling', 'touch');
                $_5xsloy13gjc7tmi41.register(component.element());
              }),
              $_3oclftw5jc7tmgdb.runOnDetached(function (component) {
                $_bq4g3yzrjc7tmh4w.remove(component.element(), 'overflow-y');
                $_bq4g3yzrjc7tmh4w.remove(component.element(), '-webkit-overflow-scrolling');
                $_5xsloy13gjc7tmi41.deregister(component.element());
              })
            ])])
        }
      ],
      items: items,
      menuBehaviours: $_567rv0w3jc7tmgc6.derive([Transitioning.config({
          initialState: 'after',
          routes: Transitioning.createTristate('before', 'current', 'after', {
            transition: {
              property: 'transform',
              transitionClass: 'transitioning'
            }
          })
        })])
    };
  };
  var sketch$9 = function (settings) {
    var dataset = convert$1(settings.formats, function () {
      return memMenu;
    });
    var memMenu = $_116ufv11djc7tmhjt.record(TieredMenu.sketch({
      dom: {
        tag: 'div',
        classes: [$_fej2h3z0jc7tmgwt.resolve('styles-menu')]
      },
      components: [],
      fakeFocus: true,
      stayInDom: true,
      onExecute: function (tmenu, item) {
        var v = me.getValue(item);
        settings.handle(item, v.value);
      },
      onEscape: function () {
      },
      onOpenMenu: function (container, menu) {
        var w = $_20v7a9116jc7tmhi9.get(container.element());
        $_20v7a9116jc7tmhi9.set(menu.element(), w);
        Transitioning.jumpTo(menu, 'current');
      },
      onOpenSubmenu: function (container, item, submenu) {
        var w = $_20v7a9116jc7tmhi9.get(container.element());
        var menu = $_el2q49zljc7tmh27.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var menuComp = container.getSystem().getByDom(menu).getOrDie();
        $_20v7a9116jc7tmhi9.set(submenu.element(), w);
        Transitioning.progressTo(menuComp, 'before');
        Transitioning.jumpTo(submenu, 'after');
        Transitioning.progressTo(submenu, 'current');
      },
      onCollapseMenu: function (container, item, menu) {
        var submenu = $_el2q49zljc7tmh27.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
        Transitioning.progressTo(submenuComp, 'after');
        Transitioning.progressTo(menu, 'current');
      },
      navigateOnHover: false,
      openImmediately: true,
      data: dataset.tmenu,
      markers: {
        backgroundMenu: $_fej2h3z0jc7tmgwt.resolve('styles-background-menu'),
        menu: $_fej2h3z0jc7tmgwt.resolve('styles-menu'),
        selectedMenu: $_fej2h3z0jc7tmgwt.resolve('styles-selected-menu'),
        item: $_fej2h3z0jc7tmgwt.resolve('styles-item'),
        selectedItem: $_fej2h3z0jc7tmgwt.resolve('styles-selected-item')
      }
    }));
    return memMenu.asSpec();
  };
  var $_1bwoyy12ejc7tmhrn = { sketch: sketch$9 };

  var getFromExpandingItem = function (item) {
    var newItem = $_2nfiamwxjc7tmggx.deepMerge($_ftivuzx5jc7tmgj2.exclude(item, ['items']), { menu: true });
    var rest = expand(item.items);
    var newMenus = $_2nfiamwxjc7tmggx.deepMerge(rest.menus, $_ftivuzx5jc7tmgj2.wrap(item.title, rest.items));
    var newExpansions = $_2nfiamwxjc7tmggx.deepMerge(rest.expansions, $_ftivuzx5jc7tmgj2.wrap(item.title, item.title));
    return {
      item: newItem,
      menus: newMenus,
      expansions: newExpansions
    };
  };
  var getFromItem = function (item) {
    return $_ftivuzx5jc7tmgj2.hasKey(item, 'items') ? getFromExpandingItem(item) : {
      item: item,
      menus: {},
      expansions: {}
    };
  };
  var expand = function (items) {
    return $_682tbuw8jc7tmgdz.foldr(items, function (acc, item) {
      var newData = getFromItem(item);
      return {
        menus: $_2nfiamwxjc7tmggx.deepMerge(acc.menus, newData.menus),
        items: [newData.item].concat(acc.items),
        expansions: $_2nfiamwxjc7tmggx.deepMerge(acc.expansions, newData.expansions)
      };
    }, {
      menus: {},
      expansions: {},
      items: []
    });
  };
  var $_cgb2nz13hjc7tmi45 = { expand: expand };

  var register = function (editor, settings) {
    var isSelectedFor = function (format) {
      return function () {
        return editor.formatter.match(format);
      };
    };
    var getPreview = function (format) {
      return function () {
        var styles = editor.formatter.getCssText(format);
        return styles;
      };
    };
    var enrichSupported = function (item) {
      return $_2nfiamwxjc7tmggx.deepMerge(item, {
        isSelected: isSelectedFor(item.format),
        getPreview: getPreview(item.format)
      });
    };
    var enrichMenu = function (item) {
      return $_2nfiamwxjc7tmggx.deepMerge(item, {
        isSelected: $_7wlbdawajc7tmgej.constant(false),
        getPreview: $_7wlbdawajc7tmgej.constant('')
      });
    };
    var enrichCustom = function (item) {
      var formatName = $_2dzfis10fjc7tmhb2.generate(item.title);
      var newItem = $_2nfiamwxjc7tmggx.deepMerge(item, {
        format: formatName,
        isSelected: isSelectedFor(formatName),
        getPreview: getPreview(formatName)
      });
      editor.formatter.register(formatName, newItem);
      return newItem;
    };
    var formats = $_ftivuzx5jc7tmgj2.readOptFrom(settings, 'style_formats').getOr(DefaultStyleFormats);
    var doEnrich = function (items) {
      return $_682tbuw8jc7tmgdz.map(items, function (item) {
        if ($_ftivuzx5jc7tmgj2.hasKey(item, 'items')) {
          var newItems = doEnrich(item.items);
          return $_2nfiamwxjc7tmggx.deepMerge(enrichMenu(item), { items: newItems });
        } else if ($_ftivuzx5jc7tmgj2.hasKey(item, 'format')) {
          return enrichSupported(item);
        } else {
          return enrichCustom(item);
        }
      });
    };
    return doEnrich(formats);
  };
  var prune = function (editor, formats) {
    var doPrune = function (items) {
      return $_682tbuw8jc7tmgdz.bind(items, function (item) {
        if (item.items !== undefined) {
          var newItems = doPrune(item.items);
          return newItems.length > 0 ? [item] : [];
        } else {
          var keep = $_ftivuzx5jc7tmgj2.hasKey(item, 'format') ? editor.formatter.canApply(item.format) : true;
          return keep ? [item] : [];
        }
      });
    };
    var prunedItems = doPrune(formats);
    return $_cgb2nz13hjc7tmi45.expand(prunedItems);
  };
  var ui = function (editor, formats, onDone) {
    var pruned = prune(editor, formats);
    return $_1bwoyy12ejc7tmhrn.sketch({
      formats: pruned,
      handle: function (item, value) {
        editor.undoManager.transact(function () {
          if (Toggling.isOn(item)) {
            editor.formatter.remove(value);
          } else {
            editor.formatter.apply(value);
          }
        });
        onDone();
      }
    });
  };
  var $_6rpa4q12cjc7tmhr3 = {
    register: register,
    ui: ui
  };

  var defaults = [
    'undo',
    'bold',
    'italic',
    'link',
    'image',
    'bullist',
    'styleselect'
  ];
  var extract$1 = function (rawToolbar) {
    var toolbar = rawToolbar.replace(/\|/g, ' ').trim();
    return toolbar.length > 0 ? toolbar.split(/\s+/) : [];
  };
  var identifyFromArray = function (toolbar) {
    return $_682tbuw8jc7tmgdz.bind(toolbar, function (item) {
      return $_5ub7o5wyjc7tmggz.isArray(item) ? identifyFromArray(item) : extract$1(item);
    });
  };
  var identify = function (settings) {
    var toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults;
    return $_5ub7o5wyjc7tmggz.isArray(toolbar) ? identifyFromArray(toolbar) : extract$1(toolbar);
  };
  var setup = function (realm, editor) {
    var commandSketch = function (name) {
      return function () {
        return $_3zi4bwz1jc7tmgwv.forToolbarCommand(editor, name);
      };
    };
    var stateCommandSketch = function (name) {
      return function () {
        return $_3zi4bwz1jc7tmgwv.forToolbarStateCommand(editor, name);
      };
    };
    var actionSketch = function (name, query, action) {
      return function () {
        return $_3zi4bwz1jc7tmgwv.forToolbarStateAction(editor, name, query, action);
      };
    };
    var undo = commandSketch('undo');
    var redo = commandSketch('redo');
    var bold = stateCommandSketch('bold');
    var italic = stateCommandSketch('italic');
    var underline = stateCommandSketch('underline');
    var removeformat = commandSketch('removeformat');
    var link = function () {
      return $_aqvttj11njc7tmhkx.sketch(realm, editor);
    };
    var unlink = actionSketch('unlink', 'link', function () {
      editor.execCommand('unlink', null, false);
    });
    var image = function () {
      return $_b2oawq11cjc7tmhjf.sketch(editor);
    };
    var bullist = actionSketch('unordered-list', 'ul', function () {
      editor.execCommand('InsertUnorderedList', null, false);
    });
    var numlist = actionSketch('ordered-list', 'ol', function () {
      editor.execCommand('InsertOrderedList', null, false);
    });
    var fontsizeselect = function () {
      return $_840ee3118jc7tmhic.sketch(realm, editor);
    };
    var forecolor = function () {
      return $_8hdrh810rjc7tmhes.sketch(realm, editor);
    };
    var styleFormats = $_6rpa4q12cjc7tmhr3.register(editor, editor.settings);
    var styleFormatsMenu = function () {
      return $_6rpa4q12cjc7tmhr3.ui(editor, styleFormats, function () {
        editor.fire('scrollIntoView');
      });
    };
    var styleselect = function () {
      return $_3zi4bwz1jc7tmgwv.forToolbar('style-formats', function (button) {
        editor.fire('toReading');
        realm.dropup().appear(styleFormatsMenu, Toggling.on, button);
      }, $_567rv0w3jc7tmgc6.derive([
        Toggling.config({
          toggleClass: $_fej2h3z0jc7tmgwt.resolve('toolbar-button-selected'),
          toggleOnExecute: false,
          aria: { mode: 'pressed' }
        }),
        Receiving.config({
          channels: $_ftivuzx5jc7tmgj2.wrapAll([
            $_c7bmb0yzjc7tmgwp.receive($_caizgmynjc7tmgte.orientationChanged(), Toggling.off),
            $_c7bmb0yzjc7tmgwp.receive($_caizgmynjc7tmgte.dropupDismissed(), Toggling.off)
          ])
        })
      ]));
    };
    var feature = function (prereq, sketch) {
      return {
        isSupported: function () {
          return prereq.forall(function (p) {
            return $_ftivuzx5jc7tmgj2.hasKey(editor.buttons, p);
          });
        },
        sketch: sketch
      };
    };
    return {
      undo: feature($_7db13lw9jc7tmgee.none(), undo),
      redo: feature($_7db13lw9jc7tmgee.none(), redo),
      bold: feature($_7db13lw9jc7tmgee.none(), bold),
      italic: feature($_7db13lw9jc7tmgee.none(), italic),
      underline: feature($_7db13lw9jc7tmgee.none(), underline),
      removeformat: feature($_7db13lw9jc7tmgee.none(), removeformat),
      link: feature($_7db13lw9jc7tmgee.none(), link),
      unlink: feature($_7db13lw9jc7tmgee.none(), unlink),
      image: feature($_7db13lw9jc7tmgee.none(), image),
      bullist: feature($_7db13lw9jc7tmgee.some('bullist'), bullist),
      numlist: feature($_7db13lw9jc7tmgee.some('numlist'), numlist),
      fontsizeselect: feature($_7db13lw9jc7tmgee.none(), fontsizeselect),
      forecolor: feature($_7db13lw9jc7tmgee.none(), forecolor),
      styleselect: feature($_7db13lw9jc7tmgee.none(), styleselect)
    };
  };
  var detect$4 = function (settings, features) {
    var itemNames = identify(settings);
    var present = {};
    return $_682tbuw8jc7tmgdz.bind(itemNames, function (iName) {
      var r = !$_ftivuzx5jc7tmgj2.hasKey(present, iName) && $_ftivuzx5jc7tmgj2.hasKey(features, iName) && features[iName].isSupported() ? [features[iName].sketch()] : [];
      present[iName] = true;
      return r;
    });
  };
  var $_7l0tfzyojc7tmgti = {
    identify: identify,
    setup: setup,
    detect: detect$4
  };

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_7wlbdawajc7tmgej.constant(target),
      'x': $_7wlbdawajc7tmgej.constant(x),
      'y': $_7wlbdawajc7tmgej.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_7wlbdawajc7tmgej.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_19g44bwsjc7tmgg6.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_7wlbdawajc7tmgej.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_7wlbdawajc7tmgej.curry(unbind, element, event, wrapped, useCapture) };
  };
  var bind$2 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, false);
  };
  var capture$1 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, true);
  };
  var unbind = function (element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture);
  };
  var $_1qct7s13kjc7tmi4r = {
    bind: bind$2,
    capture: capture$1
  };

  var filter$1 = $_7wlbdawajc7tmgej.constant(true);
  var bind$1 = function (element, event, handler) {
    return $_1qct7s13kjc7tmi4r.bind(element, event, filter$1, handler);
  };
  var capture = function (element, event, handler) {
    return $_1qct7s13kjc7tmi4r.capture(element, event, filter$1, handler);
  };
  var $_4bmha313jjc7tmi4n = {
    bind: bind$1,
    capture: capture
  };

  var INTERVAL = 50;
  var INSURANCE = 1000 / INTERVAL;
  var get$11 = function (outerWindow) {
    var isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches;
    return { isPortrait: $_7wlbdawajc7tmgej.constant(isPortrait) };
  };
  var getActualWidth = function (outerWindow) {
    var isIos = $_9tl8l8wfjc7tmgez.detect().os.isiOS();
    var isPortrait = get$11(outerWindow).isPortrait();
    return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width;
  };
  var onChange = function (outerWindow, listeners) {
    var win = $_19g44bwsjc7tmgg6.fromDom(outerWindow);
    var poller = null;
    var change = function () {
      clearInterval(poller);
      var orientation = get$11(outerWindow);
      listeners.onChange(orientation);
      onAdjustment(function () {
        listeners.onReady(orientation);
      });
    };
    var orientationHandle = $_4bmha313jjc7tmi4n.bind(win, 'orientationchange', change);
    var onAdjustment = function (f) {
      clearInterval(poller);
      var flag = outerWindow.innerHeight;
      var insurance = 0;
      poller = setInterval(function () {
        if (flag !== outerWindow.innerHeight) {
          clearInterval(poller);
          f($_7db13lw9jc7tmgee.some(outerWindow.innerHeight));
        } else if (insurance > INSURANCE) {
          clearInterval(poller);
          f($_7db13lw9jc7tmgee.none());
        }
        insurance++;
      }, INTERVAL);
    };
    var destroy = function () {
      orientationHandle.unbind();
    };
    return {
      onAdjustment: onAdjustment,
      destroy: destroy
    };
  };
  var $_nqo4113ijc7tmi4a = {
    get: get$11,
    onChange: onChange,
    getActualWidth: getActualWidth
  };

  var DelayedFunction = function (fun, delay) {
    var ref = null;
    var schedule = function () {
      var args = arguments;
      ref = setTimeout(function () {
        fun.apply(null, args);
        ref = null;
      }, delay);
    };
    var cancel = function () {
      if (ref !== null) {
        clearTimeout(ref);
        ref = null;
      }
    };
    return {
      cancel: cancel,
      schedule: schedule
    };
  };

  var SIGNIFICANT_MOVE = 5;
  var LONGPRESS_DELAY = 400;
  var getTouch = function (event) {
    if (event.raw().touches === undefined || event.raw().touches.length !== 1)
      return $_7db13lw9jc7tmgee.none();
    return $_7db13lw9jc7tmgee.some(event.raw().touches[0]);
  };
  var isFarEnough = function (touch, data) {
    var distX = Math.abs(touch.clientX - data.x());
    var distY = Math.abs(touch.clientY - data.y());
    return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
  };
  var monitor$1 = function (settings) {
    var startData = Cell($_7db13lw9jc7tmgee.none());
    var longpress = DelayedFunction(function (event) {
      startData.set($_7db13lw9jc7tmgee.none());
      settings.triggerEvent($_66ekuowvjc7tmggn.longpress(), event);
    }, LONGPRESS_DELAY);
    var handleTouchstart = function (event) {
      getTouch(event).each(function (touch) {
        longpress.cancel();
        var data = {
          x: $_7wlbdawajc7tmgej.constant(touch.clientX),
          y: $_7wlbdawajc7tmgej.constant(touch.clientY),
          target: event.target
        };
        longpress.schedule(data);
        startData.set($_7db13lw9jc7tmgee.some(data));
      });
      return $_7db13lw9jc7tmgee.none();
    };
    var handleTouchmove = function (event) {
      longpress.cancel();
      getTouch(event).each(function (touch) {
        startData.get().each(function (data) {
          if (isFarEnough(touch, data))
            startData.set($_7db13lw9jc7tmgee.none());
        });
      });
      return $_7db13lw9jc7tmgee.none();
    };
    var handleTouchend = function (event) {
      longpress.cancel();
      var isSame = function (data) {
        return $_b6kzgmw7jc7tmgdr.eq(data.target(), event.target());
      };
      return startData.get().filter(isSame).map(function (data) {
        return settings.triggerEvent($_66ekuowvjc7tmggn.tap(), event);
      });
    };
    var handlers = $_ftivuzx5jc7tmgj2.wrapAll([
      {
        key: $_dpjvxuwwjc7tmggu.touchstart(),
        value: handleTouchstart
      },
      {
        key: $_dpjvxuwwjc7tmggu.touchmove(),
        value: handleTouchmove
      },
      {
        key: $_dpjvxuwwjc7tmggu.touchend(),
        value: handleTouchend
      }
    ]);
    var fireIfReady = function (event, type) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(handlers, type).bind(function (handler) {
        return handler(event);
      });
    };
    return { fireIfReady: fireIfReady };
  };
  var $_8659qc13qjc7tmi69 = { monitor: monitor$1 };

  var monitor = function (editorApi) {
    var tapEvent = $_8659qc13qjc7tmi69.monitor({
      triggerEvent: function (type, evt) {
        editorApi.onTapContent(evt);
      }
    });
    var onTouchend = function () {
      return $_4bmha313jjc7tmi4n.bind(editorApi.body(), 'touchend', function (evt) {
        tapEvent.fireIfReady(evt, 'touchend');
      });
    };
    var onTouchmove = function () {
      return $_4bmha313jjc7tmi4n.bind(editorApi.body(), 'touchmove', function (evt) {
        tapEvent.fireIfReady(evt, 'touchmove');
      });
    };
    var fireTouchstart = function (evt) {
      tapEvent.fireIfReady(evt, 'touchstart');
    };
    return {
      fireTouchstart: fireTouchstart,
      onTouchend: onTouchend,
      onTouchmove: onTouchmove
    };
  };
  var $_5vdgxf13pjc7tmi5y = { monitor: monitor };

  var isAndroid6 = $_9tl8l8wfjc7tmgez.detect().os.version.major >= 6;
  var initEvents = function (editorApi, toolstrip, alloy) {
    var tapping = $_5vdgxf13pjc7tmi5y.monitor(editorApi);
    var outerDoc = $_bvq6n5y2jc7tmgq7.owner(toolstrip);
    var isRanged = function (sel) {
      return !$_b6kzgmw7jc7tmgdr.eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset();
    };
    var hasRangeInUi = function () {
      return $_aqgip2yfjc7tmgse.active(outerDoc).filter(function (input) {
        return $_e44ar2xwjc7tmgp4.name(input) === 'input';
      }).exists(function (input) {
        return input.dom().selectionStart !== input.dom().selectionEnd;
      });
    };
    var updateMargin = function () {
      var rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged);
      alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off);
    };
    var listeners = [
      $_4bmha313jjc7tmi4n.bind(editorApi.body(), 'touchstart', function (evt) {
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_4bmha313jjc7tmi4n.bind(toolstrip, 'touchstart', function (evt) {
        editorApi.onTouchToolstrip();
      }),
      editorApi.onToReading(function () {
        $_aqgip2yfjc7tmgse.blur(editorApi.body());
      }),
      editorApi.onToEditing($_7wlbdawajc7tmgej.noop),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        editorApi.getCursorBox().each(function (bounds) {
          var cWin = editorApi.win();
          var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
          var cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50 : 0;
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      })
    ].concat(isAndroid6 === true ? [] : [
      $_4bmha313jjc7tmi4n.bind($_19g44bwsjc7tmgg6.fromDom(editorApi.win()), 'blur', function () {
        alloy.getByDom(toolstrip).each(Toggling.off);
      }),
      $_4bmha313jjc7tmi4n.bind(outerDoc, 'select', updateMargin),
      $_4bmha313jjc7tmi4n.bind(editorApi.doc(), 'selectionchange', updateMargin)
    ]);
    var destroy = function () {
      $_682tbuw8jc7tmgdz.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_1y32m813ojc7tmi5e = { initEvents: initEvents };

  var autocompleteHack = function () {
    return function (f) {
      setTimeout(function () {
        f();
      }, 0);
    };
  };
  var resume = function (cWin) {
    cWin.focus();
    var iBody = $_19g44bwsjc7tmgg6.fromDom(cWin.document.body);
    var inInput = $_aqgip2yfjc7tmgse.active().exists(function (elem) {
      return $_682tbuw8jc7tmgdz.contains([
        'input',
        'textarea'
      ], $_e44ar2xwjc7tmgp4.name(elem));
    });
    var transaction = inInput ? autocompleteHack() : $_7wlbdawajc7tmgej.apply;
    transaction(function () {
      $_aqgip2yfjc7tmgse.active().each($_aqgip2yfjc7tmgse.blur);
      $_aqgip2yfjc7tmgse.focus(iBody);
    });
  };
  var $_96zfgg13tjc7tmi96 = { resume: resume };

  var safeParse = function (element, attribute) {
    var parsed = parseInt($_gh0zlbxvjc7tmgol.get(element, attribute), 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  var $_4tv6f513ujc7tmi9g = { safeParse: safeParse };

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
        return $_7db13lw9jc7tmgee.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_7db13lw9jc7tmgee.from(element.dom().nodeValue) : $_7db13lw9jc7tmgee.none();
    };
    var browser = $_9tl8l8wfjc7tmgez.detect().browser;
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

  var api$3 = NodeValue($_e44ar2xwjc7tmgp4.isText, 'text');
  var get$12 = function (element) {
    return api$3.get(element);
  };
  var getOption = function (element) {
    return api$3.getOption(element);
  };
  var set$8 = function (element, value) {
    api$3.set(element, value);
  };
  var $_3mf6bc13xjc7tmiad = {
    get: get$12,
    getOption: getOption,
    set: set$8
  };

  var getEnd = function (element) {
    return $_e44ar2xwjc7tmgp4.name(element) === 'img' ? 1 : $_3mf6bc13xjc7tmiad.getOption(element).fold(function () {
      return $_bvq6n5y2jc7tmgq7.children(element).length;
    }, function (v) {
      return v.length;
    });
  };
  var isEnd = function (element, offset) {
    return getEnd(element) === offset;
  };
  var isStart = function (element, offset) {
    return offset === 0;
  };
  var NBSP = '\xA0';
  var isTextNodeWithCursorPosition = function (el) {
    return $_3mf6bc13xjc7tmiad.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_682tbuw8jc7tmgdz.contains(elementsWithCursorPosition, $_e44ar2xwjc7tmgp4.name(elem));
  };
  var $_bdbsop13wjc7tmia7 = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var adt$4 = $_edapatx3jc7tmgi6.generate([
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
    return situ.fold($_7wlbdawajc7tmgej.identity, $_7wlbdawajc7tmgej.identity, $_7wlbdawajc7tmgej.identity);
  };
  var $_9rpas140jc7tmiaw = {
    before: adt$4.before,
    on: adt$4.on,
    after: adt$4.after,
    cata: cata,
    getStart: getStart$1
  };

  var type$1 = $_edapatx3jc7tmgi6.generate([
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
  var range$1 = $_3we77gxljc7tmgnf.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$1.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_19g44bwsjc7tmgg6.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_9rpas140jc7tmiaw.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart(selection);
    return $_bvq6n5y2jc7tmgq7.defaultView(start);
  };
  var $_ep9h6y13zjc7tmiao = {
    domRange: type$1.domRange,
    relative: type$1.relative,
    exact: type$1.exact,
    exactFromRange: exactFromRange,
    range: range$1,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_bvq6n5y2jc7tmgq7.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_19g44bwsjc7tmgg6.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_b6kzgmw7jc7tmgdr.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_e52gcz142jc7tmibh = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_682tbuw8jc7tmgdz.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_19g44bwsjc7tmgg6.fromDom(fragment);
  };
  var $_4modug143jc7tmibm = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$5 = function (win) {
    return win.document.createRange();
  };
  var setStart = function (rng, situ) {
    situ.fold(function (e) {
      rng.setStartBefore(e.dom());
    }, function (e, o) {
      rng.setStart(e.dom(), o);
    }, function (e) {
      rng.setStartAfter(e.dom());
    });
  };
  var setFinish = function (rng, situ) {
    situ.fold(function (e) {
      rng.setEndBefore(e.dom());
    }, function (e, o) {
      rng.setEnd(e.dom(), o);
    }, function (e) {
      rng.setEndAfter(e.dom());
    });
  };
  var replaceWith = function (rng, fragment) {
    deleteContents(rng);
    rng.insertNode(fragment.dom());
  };
  var relativeToNative = function (win, startSitu, finishSitu) {
    var range = win.document.createRange();
    setStart(range, startSitu);
    setFinish(range, finishSitu);
    return range;
  };
  var exactToNative = function (win, start, soffset, finish, foffset) {
    var rng = win.document.createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var deleteContents = function (rng) {
    rng.deleteContents();
  };
  var cloneFragment = function (rng) {
    var fragment = rng.cloneContents();
    return $_19g44bwsjc7tmgg6.fromDom(fragment);
  };
  var toRect$1 = function (rect) {
    return {
      left: $_7wlbdawajc7tmgej.constant(rect.left),
      top: $_7wlbdawajc7tmgej.constant(rect.top),
      right: $_7wlbdawajc7tmgej.constant(rect.right),
      bottom: $_7wlbdawajc7tmgej.constant(rect.bottom),
      width: $_7wlbdawajc7tmgej.constant(rect.width),
      height: $_7wlbdawajc7tmgej.constant(rect.height)
    };
  };
  var getFirstRect$1 = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_7db13lw9jc7tmgee.some(rect).map(toRect$1) : $_7db13lw9jc7tmgee.none();
  };
  var getBounds$2 = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_7db13lw9jc7tmgee.some(rect).map(toRect$1) : $_7db13lw9jc7tmgee.none();
  };
  var toString$1 = function (rng) {
    return rng.toString();
  };
  var $_74xda8144jc7tmibr = {
    create: create$5,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$2,
    isWithin: isWithin,
    toString: toString$1
  };

  var adt$5 = $_edapatx3jc7tmgi6.generate([
    {
      ltr: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    },
    {
      rtl: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var fromRange = function (win, type, range) {
    return type($_19g44bwsjc7tmgg6.fromDom(range.startContainer), range.startOffset, $_19g44bwsjc7tmgg6.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_7wlbdawajc7tmgej.constant(rng),
          rtl: $_7db13lw9jc7tmgee.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_gdmqd6wgjc7tmgf1.cached(function () {
            return $_74xda8144jc7tmibr.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_gdmqd6wgjc7tmgf1.cached(function () {
            return $_7db13lw9jc7tmgee.some($_74xda8144jc7tmibr.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_gdmqd6wgjc7tmgf1.cached(function () {
            return $_74xda8144jc7tmibr.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_gdmqd6wgjc7tmgf1.cached(function () {
            return $_7db13lw9jc7tmgee.some($_74xda8144jc7tmibr.exactToNative(win, finish, foffset, start, soffset));
          })
        };
      }
    });
  };
  var doDiagnose = function (win, ranges) {
    var rng = ranges.ltr();
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function (rev) {
        return rev.collapsed === false;
      });
      return reversed.map(function (rev) {
        return adt$5.rtl($_19g44bwsjc7tmgg6.fromDom(rev.endContainer), rev.endOffset, $_19g44bwsjc7tmgg6.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$5.ltr, rng);
      });
    } else {
      return fromRange(win, adt$5.ltr, rng);
    }
  };
  var diagnose = function (win, selection) {
    var ranges = getRanges(win, selection);
    return doDiagnose(win, ranges);
  };
  var asLtrRange = function (win, selection) {
    var diagnosis = diagnose(win, selection);
    return diagnosis.match({
      ltr: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
      },
      rtl: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(finish.dom(), foffset);
        rng.setEnd(start.dom(), soffset);
        return rng;
      }
    });
  };
  var $_5fzhie145jc7tmic5 = {
    ltr: adt$5.ltr,
    rtl: adt$5.rtl,
    diagnose: diagnose,
    asLtrRange: asLtrRange
  };

  var searchForPoint = function (rectForOffset, x, y, maxX, length) {
    if (length === 0)
      return 0;
    else if (x === maxX)
      return length - 1;
    var xDelta = maxX;
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i);
      var curDeltaX = Math.abs(x - rect.left);
      if (y > rect.bottom) {
      } else if (y < rect.top || curDeltaX > xDelta) {
        return i - 1;
      } else {
        xDelta = curDeltaX;
      }
    }
    return 0;
  };
  var inRect = function (rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  var $_bngzxj148jc7tmid5 = {
    inRect: inRect,
    searchForPoint: searchForPoint
  };

  var locateOffset = function (doc, textnode, x, y, rect) {
    var rangeForOffset = function (offset) {
      var r = doc.dom().createRange();
      r.setStart(textnode.dom(), offset);
      r.collapse(true);
      return r;
    };
    var rectForOffset = function (offset) {
      var r = rangeForOffset(offset);
      return r.getBoundingClientRect();
    };
    var length = $_3mf6bc13xjc7tmiad.get(textnode).length;
    var offset = $_bngzxj148jc7tmid5.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate$2 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_eidt8kydjc7tmgsa.findMap(rects, function (rect) {
      return $_bngzxj148jc7tmid5.inRect(rect, x, y) ? $_7db13lw9jc7tmgee.some(rect) : $_7db13lw9jc7tmgee.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_etlshw149jc7tmid8 = { locate: locate$2 };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_bvq6n5y2jc7tmgq7.children(node);
    return $_eidt8kydjc7tmgsa.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_bngzxj148jc7tmid5.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : $_7db13lw9jc7tmgee.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_e44ar2xwjc7tmgp4.isText(node) ? $_etlshw149jc7tmid8.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_qnj13147jc7tmicv = { locate: locate$1 };

  var first$3 = function (element) {
    return $_63he74yhjc7tmgsm.descendant(element, $_bdbsop13wjc7tmia7.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_bdbsop13wjc7tmia7.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_bvq6n5y2jc7tmgq7.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return $_7db13lw9jc7tmgee.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return $_7db13lw9jc7tmgee.none();
    };
    return descend(scope);
  };
  var $_6l90r014bjc7tmidm = {
    first: first$3,
    last: last$2
  };

  var COLLAPSE_TO_LEFT = true;
  var COLLAPSE_TO_RIGHT = false;
  var getCollapseDirection = function (rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
  };
  var createCollapsedNode = function (doc, target, collapseDirection) {
    var r = doc.dom().createRange();
    r.selectNode(target.dom());
    r.collapse(collapseDirection);
    return r;
  };
  var locateInElement = function (doc, node, x) {
    var cursorRange = doc.dom().createRange();
    cursorRange.selectNode(node.dom());
    var rect = cursorRange.getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_6l90r014bjc7tmidm.first : $_6l90r014bjc7tmidm.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return $_7db13lw9jc7tmgee.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search$1 = function (doc, node, x) {
    var f = $_bvq6n5y2jc7tmgq7.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_3qex4514ajc7tmidh = { search: search$1 };

  var caretPositionFromPoint = function (doc, x, y) {
    return $_7db13lw9jc7tmgee.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return $_7db13lw9jc7tmgee.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return $_7db13lw9jc7tmgee.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return $_7db13lw9jc7tmgee.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_qnj13147jc7tmicv.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_19g44bwsjc7tmgg6.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_3qex4514ajc7tmidh.search(doc, elem, x);
      };
      return $_bvq6n5y2jc7tmgq7.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_19g44bwsjc7tmgg6.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_ep9h6y13zjc7tmiao.range($_19g44bwsjc7tmgg6.fromDom(rng.startContainer), rng.startOffset, $_19g44bwsjc7tmgg6.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_bz03v5146jc7tmicm = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_74xda8144jc7tmibr.create(win);
    var self = $_5uhwcuwrjc7tmgg1.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_92hwmyzjjc7tmh1x.descendants(ancestor, selector));
    return $_682tbuw8jc7tmgdz.filter(elements, function (elem) {
      $_74xda8144jc7tmibr.selectNodeContentsUsing(innerRange, elem);
      return $_74xda8144jc7tmibr.isWithin(outerRange, innerRange);
    });
  };
  var find$4 = function (win, selection, selector) {
    var outerRange = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    var ancestor = $_19g44bwsjc7tmgg6.fromDom(outerRange.commonAncestorContainer);
    return $_e44ar2xwjc7tmgp4.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_3s287m14cjc7tmids = { find: find$4 };

  var beforeSpecial = function (element, offset) {
    var name = $_e44ar2xwjc7tmgp4.name(element);
    if ('input' === name)
      return $_9rpas140jc7tmiaw.after(element);
    else if (!$_682tbuw8jc7tmgdz.contains([
        'br',
        'img'
      ], name))
      return $_9rpas140jc7tmiaw.on(element, offset);
    else
      return offset === 0 ? $_9rpas140jc7tmiaw.before(element) : $_9rpas140jc7tmiaw.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_9rpas140jc7tmiaw.before, beforeSpecial, $_9rpas140jc7tmiaw.after);
    var finish = finishSitu.fold($_9rpas140jc7tmiaw.before, beforeSpecial, $_9rpas140jc7tmiaw.after);
    return $_ep9h6y13zjc7tmiao.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_ep9h6y13zjc7tmiao.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_19g44bwsjc7tmgg6.fromDom(rng.startContainer);
        var finish = $_19g44bwsjc7tmgg6.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_awsbvf14djc7tmie7 = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    $_7db13lw9jc7tmgee.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_74xda8144jc7tmibr.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_3s287m14cjc7tmids.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_5fzhie145jc7tmic5.diagnose(win, relative).match({
      ltr: function (start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: function (start, soffset, finish, foffset) {
        var selection = win.getSelection();
        if (selection.extend) {
          selection.collapse(start.dom(), soffset);
          selection.extend(finish.dom(), foffset);
        } else {
          doSetRange(win, finish, foffset, start, soffset);
        }
      }
    });
  };
  var setExact = function (win, start, soffset, finish, foffset) {
    var relative = $_awsbvf14djc7tmie7.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_awsbvf14djc7tmie7.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_ep9h6y13zjc7tmiao.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_74xda8144jc7tmibr.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_awsbvf14djc7tmie7.preprocess(selection);
    return $_5fzhie145jc7tmic5.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return $_7db13lw9jc7tmgee.some($_ep9h6y13zjc7tmiao.range($_19g44bwsjc7tmgg6.fromDom(firstRng.startContainer), firstRng.startOffset, $_19g44bwsjc7tmgg6.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return $_7db13lw9jc7tmgee.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_19g44bwsjc7tmgg6.fromDom(selection.anchorNode);
    var focusNode = $_19g44bwsjc7tmgg6.fromDom(selection.focusNode);
    return $_e52gcz142jc7tmibh.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? $_7db13lw9jc7tmgee.some($_ep9h6y13zjc7tmiao.range($_19g44bwsjc7tmgg6.fromDom(selection.anchorNode), selection.anchorOffset, $_19g44bwsjc7tmgg6.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_74xda8144jc7tmibr.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_74xda8144jc7tmibr.selectNodeContents(win, element);
    return $_ep9h6y13zjc7tmiao.range($_19g44bwsjc7tmgg6.fromDom(rng.startContainer), rng.startOffset, $_19g44bwsjc7tmgg6.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : $_7db13lw9jc7tmgee.none();
  };
  var get$13 = function (win) {
    return getExact(win).map(function (range) {
      return $_ep9h6y13zjc7tmiao.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect = function (win, selection) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    return $_74xda8144jc7tmibr.getFirstRect(rng);
  };
  var getBounds$1 = function (win, selection) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    return $_74xda8144jc7tmibr.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_bz03v5146jc7tmicm.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    return $_74xda8144jc7tmibr.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$3 = function (win, selection) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    return $_74xda8144jc7tmibr.cloneFragment(rng);
  };
  var replace = function (win, selection, elements) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    var fragment = $_4modug143jc7tmibm.fromElements(elements, win.document);
    $_74xda8144jc7tmibr.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_5fzhie145jc7tmic5.asLtrRange(win, selection);
    $_74xda8144jc7tmibr.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_b6kzgmw7jc7tmgdr.eq(start, finish) && soffset === foffset;
  };
  var $_5184sk141jc7tmib6 = {
    setExact: setExact,
    getExact: getExact,
    get: get$13,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$3,
    replace: replace,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect,
    getBounds: getBounds$1,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var COLLAPSED_WIDTH = 2;
  var collapsedRect = function (rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: $_7wlbdawajc7tmgej.constant(COLLAPSED_WIDTH),
      height: rect.height
    };
  };
  var toRect = function (rawRect) {
    return {
      left: $_7wlbdawajc7tmgej.constant(rawRect.left),
      top: $_7wlbdawajc7tmgej.constant(rawRect.top),
      right: $_7wlbdawajc7tmgej.constant(rawRect.right),
      bottom: $_7wlbdawajc7tmgej.constant(rawRect.bottom),
      width: $_7wlbdawajc7tmgej.constant(rawRect.width),
      height: $_7wlbdawajc7tmgej.constant(rawRect.height)
    };
  };
  var getRectsFromRange = function (range) {
    if (!range.collapsed) {
      return $_682tbuw8jc7tmgdz.map(range.getClientRects(), toRect);
    } else {
      var start = $_19g44bwsjc7tmgg6.fromDom(range.startContainer);
      return $_bvq6n5y2jc7tmgq7.parent(start).bind(function (parent) {
        var selection = $_ep9h6y13zjc7tmiao.exact(start, range.startOffset, parent, $_bdbsop13wjc7tmia7.getEnd(parent));
        var optRect = $_5184sk141jc7tmib6.getFirstRect(range.startContainer.ownerDocument.defaultView, selection);
        return optRect.map(collapsedRect).map($_682tbuw8jc7tmgdz.pure);
      }).getOr([]);
    }
  };
  var getRectangles = function (cWin) {
    var sel = cWin.getSelection();
    return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : [];
  };
  var $_5vi84113vjc7tmi9k = { getRectangles: getRectangles };

  var EXTRA_SPACING = 50;
  var data = 'data-' + $_fej2h3z0jc7tmgwt.resolve('last-outer-height');
  var setLastHeight = function (cBody, value) {
    $_gh0zlbxvjc7tmgol.set(cBody, data, value);
  };
  var getLastHeight = function (cBody) {
    return $_4tv6f513ujc7tmi9g.safeParse(cBody, data);
  };
  var getBoundsFrom = function (rect) {
    return {
      top: $_7wlbdawajc7tmgej.constant(rect.top()),
      bottom: $_7wlbdawajc7tmgej.constant(rect.top() + rect.height())
    };
  };
  var getBounds = function (cWin) {
    var rects = $_5vi84113vjc7tmi9k.getRectangles(cWin);
    return rects.length > 0 ? $_7db13lw9jc7tmgee.some(rects[0]).map(getBoundsFrom) : $_7db13lw9jc7tmgee.none();
  };
  var findDelta = function (outerWindow, cBody) {
    var last = getLastHeight(cBody);
    var current = outerWindow.innerHeight;
    return last > current ? $_7db13lw9jc7tmgee.some(last - current) : $_7db13lw9jc7tmgee.none();
  };
  var calculate = function (cWin, bounds, delta) {
    var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
    return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0;
  };
  var setup$1 = function (outerWindow, cWin) {
    var cBody = $_19g44bwsjc7tmgg6.fromDom(cWin.document.body);
    var toEditing = function () {
      $_96zfgg13tjc7tmi96.resume(cWin);
    };
    var onResize = $_4bmha313jjc7tmi4n.bind($_19g44bwsjc7tmgg6.fromDom(outerWindow), 'resize', function () {
      findDelta(outerWindow, cBody).each(function (delta) {
        getBounds(cWin).each(function (bounds) {
          var cScrollBy = calculate(cWin, bounds, delta);
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      });
      setLastHeight(cBody, outerWindow.innerHeight);
    });
    setLastHeight(cBody, outerWindow.innerHeight);
    var destroy = function () {
      onResize.unbind();
    };
    return {
      toEditing: toEditing,
      destroy: destroy
    };
  };
  var $_5ad4j713sjc7tmi76 = { setup: setup$1 };

  var getBodyFromFrame = function (frame) {
    return $_7db13lw9jc7tmgee.some($_19g44bwsjc7tmgg6.fromDom(frame.dom().contentWindow.document.body));
  };
  var getDocFromFrame = function (frame) {
    return $_7db13lw9jc7tmgee.some($_19g44bwsjc7tmgg6.fromDom(frame.dom().contentWindow.document));
  };
  var getWinFromFrame = function (frame) {
    return $_7db13lw9jc7tmgee.from(frame.dom().contentWindow);
  };
  var getSelectionFromFrame = function (frame) {
    var optWin = getWinFromFrame(frame);
    return optWin.bind($_5184sk141jc7tmib6.getExact);
  };
  var getFrame = function (editor) {
    return editor.getFrame();
  };
  var getOrDerive = function (name, f) {
    return function (editor) {
      var g = editor[name].getOrThunk(function () {
        var frame = getFrame(editor);
        return function () {
          return f(frame);
        };
      });
      return g();
    };
  };
  var getOrListen = function (editor, doc, name, type) {
    return editor[name].getOrThunk(function () {
      return function (handler) {
        return $_4bmha313jjc7tmi4n.bind(doc, type, handler);
      };
    });
  };
  var toRect$2 = function (rect) {
    return {
      left: $_7wlbdawajc7tmgej.constant(rect.left),
      top: $_7wlbdawajc7tmgej.constant(rect.top),
      right: $_7wlbdawajc7tmgej.constant(rect.right),
      bottom: $_7wlbdawajc7tmgej.constant(rect.bottom),
      width: $_7wlbdawajc7tmgej.constant(rect.width),
      height: $_7wlbdawajc7tmgej.constant(rect.height)
    };
  };
  var getActiveApi = function (editor) {
    var frame = getFrame(editor);
    var tryFallbackBox = function (win) {
      var isCollapsed = function (sel) {
        return $_b6kzgmw7jc7tmgdr.eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset();
      };
      var toStartRect = function (sel) {
        var rect = sel.start().dom().getBoundingClientRect();
        return rect.width > 0 || rect.height > 0 ? $_7db13lw9jc7tmgee.some(rect).map(toRect$2) : $_7db13lw9jc7tmgee.none();
      };
      return $_5184sk141jc7tmib6.getExact(win).filter(isCollapsed).bind(toStartRect);
    };
    return getBodyFromFrame(frame).bind(function (body) {
      return getDocFromFrame(frame).bind(function (doc) {
        return getWinFromFrame(frame).map(function (win) {
          var html = $_19g44bwsjc7tmgg6.fromDom(doc.dom().documentElement);
          var getCursorBox = editor.getCursorBox.getOrThunk(function () {
            return function () {
              return $_5184sk141jc7tmib6.get(win).bind(function (sel) {
                return $_5184sk141jc7tmib6.getFirstRect(win, sel).orThunk(function () {
                  return tryFallbackBox(win);
                });
              });
            };
          });
          var setSelection = editor.setSelection.getOrThunk(function () {
            return function (start, soffset, finish, foffset) {
              $_5184sk141jc7tmib6.setExact(win, start, soffset, finish, foffset);
            };
          });
          var clearSelection = editor.clearSelection.getOrThunk(function () {
            return function () {
              $_5184sk141jc7tmib6.clear(win);
            };
          });
          return {
            body: $_7wlbdawajc7tmgej.constant(body),
            doc: $_7wlbdawajc7tmgej.constant(doc),
            win: $_7wlbdawajc7tmgej.constant(win),
            html: $_7wlbdawajc7tmgej.constant(html),
            getSelection: $_7wlbdawajc7tmgej.curry(getSelectionFromFrame, frame),
            setSelection: setSelection,
            clearSelection: clearSelection,
            frame: $_7wlbdawajc7tmgej.constant(frame),
            onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
            onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'selectionchange'),
            onDomChanged: editor.onDomChanged,
            onScrollToCursor: editor.onScrollToCursor,
            onScrollToElement: editor.onScrollToElement,
            onToReading: editor.onToReading,
            onToEditing: editor.onToEditing,
            onToolbarScrollStart: editor.onToolbarScrollStart,
            onTouchContent: editor.onTouchContent,
            onTapContent: editor.onTapContent,
            onTouchToolstrip: editor.onTouchToolstrip,
            getCursorBox: getCursorBox
          };
        });
      });
    });
  };
  var $_47wbmd14ejc7tmieh = {
    getBody: getOrDerive('getBody', getBodyFromFrame),
    getDoc: getOrDerive('getDoc', getDocFromFrame),
    getWin: getOrDerive('getWin', getWinFromFrame),
    getSelection: getOrDerive('getSelection', getSelectionFromFrame),
    getFrame: getFrame,
    getActiveApi: getActiveApi
  };

  var attr = 'data-ephox-mobile-fullscreen-style';
  var siblingStyles = 'display:none!important;';
  var ancestorPosition = 'position:absolute!important;';
  var ancestorStyles = 'top:0!important;left:0!important;margin:0' + '!important;padding:0!important;width:100%!important;';
  var bgFallback = 'background-color:rgb(255,255,255)!important;';
  var isAndroid = $_9tl8l8wfjc7tmgez.detect().os.isAndroid();
  var matchColor = function (editorBody) {
    var color = $_bq4g3yzrjc7tmh4w.get(editorBody, 'background-color');
    return color !== undefined && color !== '' ? 'background-color:' + color + '!important' : bgFallback;
  };
  var clobberStyles = function (container, editorBody) {
    var gatherSibilings = function (element) {
      var siblings = $_92hwmyzjjc7tmh1x.siblings(element, '*');
      return siblings;
    };
    var clobber = function (clobberStyle) {
      return function (element) {
        var styles = $_gh0zlbxvjc7tmgol.get(element, 'style');
        var backup = styles === undefined ? 'no-styles' : styles.trim();
        if (backup === clobberStyle) {
          return;
        } else {
          $_gh0zlbxvjc7tmgol.set(element, attr, backup);
          $_gh0zlbxvjc7tmgol.set(element, 'style', clobberStyle);
        }
      };
    };
    var ancestors = $_92hwmyzjjc7tmh1x.ancestors(container, '*');
    var siblings = $_682tbuw8jc7tmgdz.bind(ancestors, gatherSibilings);
    var bgColor = matchColor(editorBody);
    $_682tbuw8jc7tmgdz.each(siblings, clobber(siblingStyles));
    $_682tbuw8jc7tmgdz.each(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
    var containerStyles = isAndroid === true ? '' : ancestorPosition;
    clobber(containerStyles + ancestorStyles + bgColor)(container);
  };
  var restoreStyles = function () {
    var clobberedEls = $_92hwmyzjjc7tmh1x.all('[' + attr + ']');
    $_682tbuw8jc7tmgdz.each(clobberedEls, function (element) {
      var restore = $_gh0zlbxvjc7tmgol.get(element, attr);
      if (restore !== 'no-styles') {
        $_gh0zlbxvjc7tmgol.set(element, 'style', restore);
      } else {
        $_gh0zlbxvjc7tmgol.remove(element, 'style');
      }
      $_gh0zlbxvjc7tmgol.remove(element, attr);
    });
  };
  var $_dlbwko14fjc7tmiey = {
    clobberStyles: clobberStyles,
    restoreStyles: restoreStyles
  };

  var tag = function () {
    var head = $_el2q49zljc7tmh27.first('head').getOrDie();
    var nu = function () {
      var meta = $_19g44bwsjc7tmgg6.fromTag('meta');
      $_gh0zlbxvjc7tmgol.set(meta, 'name', 'viewport');
      $_972741y1jc7tmgq3.append(head, meta);
      return meta;
    };
    var element = $_el2q49zljc7tmh27.first('meta[name="viewport"]').getOrThunk(nu);
    var backup = $_gh0zlbxvjc7tmgol.get(element, 'content');
    var maximize = function () {
      $_gh0zlbxvjc7tmgol.set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
    };
    var restore = function () {
      if (backup !== undefined && backup !== null && backup.length > 0) {
        $_gh0zlbxvjc7tmgol.set(element, 'content', backup);
      } else {
        $_gh0zlbxvjc7tmgol.set(element, 'content', 'user-scalable=yes');
      }
    };
    return {
      maximize: maximize,
      restore: restore
    };
  };
  var $_5nj1xk14gjc7tmifb = { tag: tag };

  var create$4 = function (platform, mask) {
    var meta = $_5nj1xk14gjc7tmifb.tag();
    var androidApi = $_f5y4ql129jc7tmhqm.api();
    var androidEvents = $_f5y4ql129jc7tmhqm.api();
    var enter = function () {
      mask.hide();
      $_7lq4x8xtjc7tmgod.add(platform.container, $_fej2h3z0jc7tmgwt.resolve('fullscreen-maximized'));
      $_7lq4x8xtjc7tmgod.add(platform.container, $_fej2h3z0jc7tmgwt.resolve('android-maximized'));
      meta.maximize();
      $_7lq4x8xtjc7tmgod.add(platform.body, $_fej2h3z0jc7tmgwt.resolve('android-scroll-reload'));
      androidApi.set($_5ad4j713sjc7tmi76.setup(platform.win, $_47wbmd14ejc7tmieh.getWin(platform.editor).getOrDie('no')));
      $_47wbmd14ejc7tmieh.getActiveApi(platform.editor).each(function (editorApi) {
        $_dlbwko14fjc7tmiey.clobberStyles(platform.container, editorApi.body());
        androidEvents.set($_1y32m813ojc7tmi5e.initEvents(editorApi, platform.toolstrip, platform.alloy));
      });
    };
    var exit = function () {
      meta.restore();
      mask.show();
      $_7lq4x8xtjc7tmgod.remove(platform.container, $_fej2h3z0jc7tmgwt.resolve('fullscreen-maximized'));
      $_7lq4x8xtjc7tmgod.remove(platform.container, $_fej2h3z0jc7tmgwt.resolve('android-maximized'));
      $_dlbwko14fjc7tmiey.restoreStyles();
      $_7lq4x8xtjc7tmgod.remove(platform.body, $_fej2h3z0jc7tmgwt.resolve('android-scroll-reload'));
      androidEvents.clear();
      androidApi.clear();
    };
    return {
      enter: enter,
      exit: exit
    };
  };
  var $_a9rksg13njc7tmi59 = { create: create$4 };

  var MobileSchema = $_c1hr3lxgjc7tmgly.objOf([
    $_9benqox1jc7tmght.strictObjOf('editor', [
      $_9benqox1jc7tmght.strict('getFrame'),
      $_9benqox1jc7tmght.option('getBody'),
      $_9benqox1jc7tmght.option('getDoc'),
      $_9benqox1jc7tmght.option('getWin'),
      $_9benqox1jc7tmght.option('getSelection'),
      $_9benqox1jc7tmght.option('setSelection'),
      $_9benqox1jc7tmght.option('clearSelection'),
      $_9benqox1jc7tmght.option('cursorSaver'),
      $_9benqox1jc7tmght.option('onKeyup'),
      $_9benqox1jc7tmght.option('onNodeChanged'),
      $_9benqox1jc7tmght.option('getCursorBox'),
      $_9benqox1jc7tmght.strict('onDomChanged'),
      $_9benqox1jc7tmght.defaulted('onTouchContent', $_7wlbdawajc7tmgej.noop),
      $_9benqox1jc7tmght.defaulted('onTapContent', $_7wlbdawajc7tmgej.noop),
      $_9benqox1jc7tmght.defaulted('onTouchToolstrip', $_7wlbdawajc7tmgej.noop),
      $_9benqox1jc7tmght.defaulted('onScrollToCursor', $_7wlbdawajc7tmgej.constant({ unbind: $_7wlbdawajc7tmgej.noop })),
      $_9benqox1jc7tmght.defaulted('onScrollToElement', $_7wlbdawajc7tmgej.constant({ unbind: $_7wlbdawajc7tmgej.noop })),
      $_9benqox1jc7tmght.defaulted('onToEditing', $_7wlbdawajc7tmgej.constant({ unbind: $_7wlbdawajc7tmgej.noop })),
      $_9benqox1jc7tmght.defaulted('onToReading', $_7wlbdawajc7tmgej.constant({ unbind: $_7wlbdawajc7tmgej.noop })),
      $_9benqox1jc7tmght.defaulted('onToolbarScrollStart', $_7wlbdawajc7tmgej.identity)
    ]),
    $_9benqox1jc7tmght.strict('socket'),
    $_9benqox1jc7tmght.strict('toolstrip'),
    $_9benqox1jc7tmght.strict('dropup'),
    $_9benqox1jc7tmght.strict('toolbar'),
    $_9benqox1jc7tmght.strict('container'),
    $_9benqox1jc7tmght.strict('alloy'),
    $_9benqox1jc7tmght.state('win', function (spec) {
      return $_bvq6n5y2jc7tmgq7.owner(spec.socket).dom().defaultView;
    }),
    $_9benqox1jc7tmght.state('body', function (spec) {
      return $_19g44bwsjc7tmgg6.fromDom(spec.socket.dom().ownerDocument.body);
    }),
    $_9benqox1jc7tmght.defaulted('translate', $_7wlbdawajc7tmgej.identity),
    $_9benqox1jc7tmght.defaulted('setReadOnly', $_7wlbdawajc7tmgej.noop)
  ]);

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
  var first$4 = function (fn, rate) {
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
  var $_6z81m614jjc7tmigd = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var sketch$10 = function (onView, translate) {
    var memIcon = $_116ufv11djc7tmhjt.record(Container.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
      containerBehaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({
          toggleClass: $_fej2h3z0jc7tmgwt.resolve('mask-tap-icon-selected'),
          toggleOnExecute: false
        })])
    }));
    var onViewThrottle = $_6z81m614jjc7tmigd.first(onView, 200);
    return Container.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-disabled-mask"></div>'),
      components: [Container.sketch({
          dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-content-container"></div>'),
          components: [Button.sketch({
              dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-content-tap-section"></div>'),
              components: [memIcon.asSpec()],
              action: function (button) {
                onViewThrottle.throttle();
              },
              buttonBehaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({ toggleClass: $_fej2h3z0jc7tmgwt.resolve('mask-tap-icon-selected') })])
            })]
        })]
    });
  };
  var $_clya5014ijc7tmifz = { sketch: sketch$10 };

  var produce = function (raw) {
    var mobile = $_c1hr3lxgjc7tmgly.asRawOrDie('Getting AndroidWebapp schema', MobileSchema, raw);
    $_bq4g3yzrjc7tmh4w.set(mobile.toolstrip, 'width', '100%');
    var onTap = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_9yx6nt12jjc7tmhu8.build($_clya5014ijc7tmifz.sketch(onTap, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    $_972741y1jc7tmgq3.append(mobile.container, mask.element());
    var mode = $_a9rksg13njc7tmi59.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: $_7wlbdawajc7tmgej.noop,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_7wlbdawajc7tmgej.noop
    };
  };
  var $_cm64n413mjc7tmi52 = { produce: produce };

  var schema$14 = [
    $_9benqox1jc7tmght.defaulted('shell', true),
    $_qqqz410cjc7tmhaf.field('toolbarBehaviours', [Replacing])
  ];
  var enhanceGroups = function (detail) {
    return { behaviours: $_567rv0w3jc7tmgc6.derive([Replacing.config({})]) };
  };
  var partTypes$1 = [$_61s39h10jjc7tmhc6.optional({
      name: 'groups',
      overrides: enhanceGroups
    })];
  var $_f3bcsj14mjc7tmih8 = {
    name: $_7wlbdawajc7tmgej.constant('Toolbar'),
    schema: $_7wlbdawajc7tmgej.constant(schema$14),
    parts: $_7wlbdawajc7tmgej.constant(partTypes$1)
  };

  var factory$4 = function (detail, components, spec, _externals) {
    var setGroups = function (toolbar, groups) {
      getGroupContainer(toolbar).fold(function () {
        console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
      }, function (container) {
        Replacing.set(container, groups);
      });
    };
    var getGroupContainer = function (component) {
      return detail.shell() ? $_7db13lw9jc7tmgee.some(component) : $_dz5zok10hjc7tmhbg.getPart(component, detail, 'groups');
    };
    var extra = detail.shell() ? {
      behaviours: [Replacing.config({})],
      components: []
    } : {
      behaviours: [],
      components: components
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: extra.components,
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive(extra.behaviours), $_qqqz410cjc7tmhaf.get(detail.toolbarBehaviours())),
      apis: { setGroups: setGroups },
      domModification: { attributes: { role: 'group' } }
    };
  };
  var Toolbar = $_2r0fok10djc7tmham.composite({
    name: 'Toolbar',
    configFields: $_f3bcsj14mjc7tmih8.schema(),
    partFields: $_f3bcsj14mjc7tmih8.parts(),
    factory: factory$4,
    apis: {
      setGroups: function (apis, toolbar, groups) {
        apis.setGroups(toolbar, groups);
      }
    }
  });

  var schema$15 = [
    $_9benqox1jc7tmght.strict('items'),
    $_8vhkewysjc7tmgun.markers(['itemClass']),
    $_qqqz410cjc7tmhaf.field('tgroupBehaviours', [Keying])
  ];
  var partTypes$2 = [$_61s39h10jjc7tmhc6.group({
      name: 'items',
      unit: 'item',
      overrides: function (detail) {
        return { domModification: { classes: [detail.markers().itemClass()] } };
      }
    })];
  var $_gcs6qa14ojc7tmihx = {
    name: $_7wlbdawajc7tmgej.constant('ToolbarGroup'),
    schema: $_7wlbdawajc7tmgej.constant(schema$15),
    parts: $_7wlbdawajc7tmgej.constant(partTypes$2)
  };

  var factory$5 = function (detail, components, spec, _externals) {
    return $_2nfiamwxjc7tmggx.deepMerge({ dom: { attributes: { role: 'toolbar' } } }, {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_2nfiamwxjc7tmggx.deepMerge($_567rv0w3jc7tmgc6.derive([Keying.config({
          mode: 'flow',
          selector: '.' + detail.markers().itemClass()
        })]), $_qqqz410cjc7tmhaf.get(detail.tgroupBehaviours())),
      'debug.sketcher': spec['debug.sketcher']
    });
  };
  var ToolbarGroup = $_2r0fok10djc7tmham.composite({
    name: 'ToolbarGroup',
    configFields: $_gcs6qa14ojc7tmihx.schema(),
    partFields: $_gcs6qa14ojc7tmihx.parts(),
    factory: factory$5
  });

  var dataHorizontal = 'data-' + $_fej2h3z0jc7tmgwt.resolve('horizontal-scroll');
  var canScrollVertically = function (container) {
    container.dom().scrollTop = 1;
    var result = container.dom().scrollTop !== 0;
    container.dom().scrollTop = 0;
    return result;
  };
  var canScrollHorizontally = function (container) {
    container.dom().scrollLeft = 1;
    var result = container.dom().scrollLeft !== 0;
    container.dom().scrollLeft = 0;
    return result;
  };
  var hasVerticalScroll = function (container) {
    return container.dom().scrollTop > 0 || canScrollVertically(container);
  };
  var hasHorizontalScroll = function (container) {
    return container.dom().scrollLeft > 0 || canScrollHorizontally(container);
  };
  var markAsHorizontal = function (container) {
    $_gh0zlbxvjc7tmgol.set(container, dataHorizontal, 'true');
  };
  var hasScroll = function (container) {
    return $_gh0zlbxvjc7tmgol.get(container, dataHorizontal) === 'true' ? hasHorizontalScroll : hasVerticalScroll;
  };
  var exclusive = function (scope, selector) {
    return $_4bmha313jjc7tmi4n.bind(scope, 'touchmove', function (event) {
      $_el2q49zljc7tmh27.closest(event.target(), selector).filter(hasScroll).fold(function () {
        event.raw().preventDefault();
      }, $_7wlbdawajc7tmgej.noop);
    });
  };
  var $_azf6hh14pjc7tmii4 = {
    exclusive: exclusive,
    markAsHorizontal: markAsHorizontal
  };

  var ScrollingToolbar = function () {
    var makeGroup = function (gSpec) {
      var scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : '';
      return {
        dom: $_c7exbi10pjc7tmhe8.dom('<div aria-label="' + gSpec.label + '" class="${prefix}-toolbar-group ' + scrollClass + '"></div>'),
        tgroupBehaviours: $_567rv0w3jc7tmgc6.derive([$_2nfmit11rjc7tmhm8.config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [$_3oclftw5jc7tmgdb.runOnInit(function (component, simulatedEvent) {
              $_bq4g3yzrjc7tmh4w.set(component.element(), 'overflow-x', 'auto');
              $_azf6hh14pjc7tmii4.markAsHorizontal(component.element());
              $_5xsloy13gjc7tmi41.register(component.element());
            })] : [])]),
        components: [Container.sketch({ components: [ToolbarGroup.parts().items({})] })],
        markers: { itemClass: $_fej2h3z0jc7tmgwt.resolve('toolbar-group-item') },
        items: gSpec.items
      };
    };
    var toolbar = $_9yx6nt12jjc7tmhu8.build(Toolbar.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-toolbar"></div>'),
      components: [Toolbar.parts().groups({})],
      toolbarBehaviours: $_567rv0w3jc7tmgc6.derive([
        Toggling.config({
          toggleClass: $_fej2h3z0jc7tmgwt.resolve('context-toolbar'),
          toggleOnExecute: false,
          aria: { mode: 'none' }
        }),
        Keying.config({ mode: 'cyclic' })
      ]),
      shell: true
    }));
    var wrapper = $_9yx6nt12jjc7tmhu8.build(Container.sketch({
      dom: { classes: [$_fej2h3z0jc7tmgwt.resolve('toolstrip')] },
      components: [$_9yx6nt12jjc7tmhu8.premade(toolbar)],
      containerBehaviours: $_567rv0w3jc7tmgc6.derive([Toggling.config({
          toggleClass: $_fej2h3z0jc7tmgwt.resolve('android-selection-context-toolbar'),
          toggleOnExecute: false
        })])
    }));
    var resetGroups = function () {
      Toolbar.setGroups(toolbar, initGroups.get());
      Toggling.off(toolbar);
    };
    var initGroups = Cell([]);
    var setGroups = function (gs) {
      initGroups.set(gs);
      resetGroups();
    };
    var createGroups = function (gs) {
      return $_682tbuw8jc7tmgdz.map(gs, $_7wlbdawajc7tmgej.compose(ToolbarGroup.sketch, makeGroup));
    };
    var refresh = function () {
      Toolbar.refresh(toolbar);
    };
    var setContextToolbar = function (gs) {
      Toggling.on(toolbar);
      Toolbar.setGroups(toolbar, gs);
    };
    var restoreToolbar = function () {
      if (Toggling.isOn(toolbar)) {
        resetGroups();
      }
    };
    var focus = function () {
      Keying.focusIn(toolbar);
    };
    return {
      wrapper: $_7wlbdawajc7tmgej.constant(wrapper),
      toolbar: $_7wlbdawajc7tmgej.constant(toolbar),
      createGroups: createGroups,
      setGroups: setGroups,
      setContextToolbar: setContextToolbar,
      restoreToolbar: restoreToolbar,
      refresh: refresh,
      focus: focus
    };
  };

  var makeEditSwitch = function (webapp) {
    return $_9yx6nt12jjc7tmhu8.build(Button.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
      action: function () {
        webapp.run(function (w) {
          w.setReadOnly(false);
        });
      }
    }));
  };
  var makeSocket = function () {
    return $_9yx6nt12jjc7tmhu8.build(Container.sketch({
      dom: $_c7exbi10pjc7tmhe8.dom('<div class="${prefix}-editor-socket"></div>'),
      components: [],
      containerBehaviours: $_567rv0w3jc7tmgc6.derive([Replacing.config({})])
    }));
  };
  var showEdit = function (socket, switchToEdit) {
    Replacing.append(socket, $_9yx6nt12jjc7tmhu8.premade(switchToEdit));
  };
  var hideEdit = function (socket, switchToEdit) {
    Replacing.remove(socket, switchToEdit);
  };
  var updateMode = function (socket, switchToEdit, readOnly, root) {
    var swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega;
    swap(root);
    var f = readOnly ? showEdit : hideEdit;
    f(socket, switchToEdit);
  };
  var $_bk84af14qjc7tmiif = {
    makeEditSwitch: makeEditSwitch,
    makeSocket: makeSocket,
    updateMode: updateMode
  };

  var getAnimationRoot = function (component, slideConfig) {
    return slideConfig.getAnimationRoot().fold(function () {
      return component.element();
    }, function (get) {
      return get(component);
    });
  };
  var getDimensionProperty = function (slideConfig) {
    return slideConfig.dimension().property();
  };
  var getDimension = function (slideConfig, elem) {
    return slideConfig.dimension().getDimension()(elem);
  };
  var disableTransitions = function (component, slideConfig) {
    var root = getAnimationRoot(component, slideConfig);
    $_9a028u12xjc7tmhz1.remove(root, [
      slideConfig.shrinkingClass(),
      slideConfig.growingClass()
    ]);
  };
  var setShrunk = function (component, slideConfig) {
    $_7lq4x8xtjc7tmgod.remove(component.element(), slideConfig.openClass());
    $_7lq4x8xtjc7tmgod.add(component.element(), slideConfig.closedClass());
    $_bq4g3yzrjc7tmh4w.set(component.element(), getDimensionProperty(slideConfig), '0px');
    $_bq4g3yzrjc7tmh4w.reflow(component.element());
  };
  var measureTargetSize = function (component, slideConfig) {
    setGrown(component, slideConfig);
    var expanded = getDimension(slideConfig, component.element());
    setShrunk(component, slideConfig);
    return expanded;
  };
  var setGrown = function (component, slideConfig) {
    $_7lq4x8xtjc7tmgod.remove(component.element(), slideConfig.closedClass());
    $_7lq4x8xtjc7tmgod.add(component.element(), slideConfig.openClass());
    $_bq4g3yzrjc7tmh4w.remove(component.element(), getDimensionProperty(slideConfig));
  };
  var doImmediateShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_bq4g3yzrjc7tmh4w.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_bq4g3yzrjc7tmh4w.reflow(component.element());
    disableTransitions(component, slideConfig);
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
    slideConfig.onShrunk()(component);
  };
  var doStartShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_bq4g3yzrjc7tmh4w.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_bq4g3yzrjc7tmh4w.reflow(component.element());
    var root = getAnimationRoot(component, slideConfig);
    $_7lq4x8xtjc7tmgod.add(root, slideConfig.shrinkingClass());
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
  };
  var doStartGrow = function (component, slideConfig, slideState) {
    var fullSize = measureTargetSize(component, slideConfig);
    var root = getAnimationRoot(component, slideConfig);
    $_7lq4x8xtjc7tmgod.add(root, slideConfig.growingClass());
    setGrown(component, slideConfig);
    $_bq4g3yzrjc7tmh4w.set(component.element(), getDimensionProperty(slideConfig), fullSize);
    slideState.setExpanded();
    slideConfig.onStartGrow()(component);
  };
  var grow = function (component, slideConfig, slideState) {
    if (!slideState.isExpanded())
      doStartGrow(component, slideConfig, slideState);
  };
  var shrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doStartShrink(component, slideConfig, slideState);
  };
  var immediateShrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doImmediateShrink(component, slideConfig, slideState);
  };
  var hasGrown = function (component, slideConfig, slideState) {
    return slideState.isExpanded();
  };
  var hasShrunk = function (component, slideConfig, slideState) {
    return slideState.isCollapsed();
  };
  var isGrowing = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_7lq4x8xtjc7tmgod.has(root, slideConfig.growingClass()) === true;
  };
  var isShrinking = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_7lq4x8xtjc7tmgod.has(root, slideConfig.shrinkingClass()) === true;
  };
  var isTransitioning = function (component, slideConfig, slideState) {
    return isGrowing(component, slideConfig, slideState) === true || isShrinking(component, slideConfig, slideState) === true;
  };
  var toggleGrow = function (component, slideConfig, slideState) {
    var f = slideState.isExpanded() ? doStartShrink : doStartGrow;
    f(component, slideConfig, slideState);
  };
  var $_74476m14ujc7tmijn = {
    grow: grow,
    shrink: shrink,
    immediateShrink: immediateShrink,
    hasGrown: hasGrown,
    hasShrunk: hasShrunk,
    isGrowing: isGrowing,
    isShrinking: isShrinking,
    isTransitioning: isTransitioning,
    toggleGrow: toggleGrow,
    disableTransitions: disableTransitions
  };

  var exhibit$5 = function (base, slideConfig) {
    var expanded = slideConfig.expanded();
    return expanded ? $_f402ywxjjc7tmgmr.nu({
      classes: [slideConfig.openClass()],
      styles: {}
    }) : $_f402ywxjjc7tmgmr.nu({
      classes: [slideConfig.closedClass()],
      styles: $_ftivuzx5jc7tmgj2.wrap(slideConfig.dimension().property(), '0px')
    });
  };
  var events$9 = function (slideConfig, slideState) {
    return $_3oclftw5jc7tmgdb.derive([$_3oclftw5jc7tmgdb.run($_dpjvxuwwjc7tmggu.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        if (raw.propertyName === slideConfig.dimension().property()) {
          $_74476m14ujc7tmijn.disableTransitions(component, slideConfig, slideState);
          if (slideState.isExpanded())
            $_bq4g3yzrjc7tmh4w.remove(component.element(), slideConfig.dimension().property());
          var notify = slideState.isExpanded() ? slideConfig.onGrown() : slideConfig.onShrunk();
          notify(component, simulatedEvent);
        }
      })]);
  };
  var $_59qisj14tjc7tmijf = {
    exhibit: exhibit$5,
    events: events$9
  };

  var SlidingSchema = [
    $_9benqox1jc7tmght.strict('closedClass'),
    $_9benqox1jc7tmght.strict('openClass'),
    $_9benqox1jc7tmght.strict('shrinkingClass'),
    $_9benqox1jc7tmght.strict('growingClass'),
    $_9benqox1jc7tmght.option('getAnimationRoot'),
    $_8vhkewysjc7tmgun.onHandler('onShrunk'),
    $_8vhkewysjc7tmgun.onHandler('onStartShrink'),
    $_8vhkewysjc7tmgun.onHandler('onGrown'),
    $_8vhkewysjc7tmgun.onHandler('onStartGrow'),
    $_9benqox1jc7tmght.defaulted('expanded', false),
    $_9benqox1jc7tmght.strictOf('dimension', $_c1hr3lxgjc7tmgly.choose('property', {
      width: [
        $_8vhkewysjc7tmgun.output('property', 'width'),
        $_8vhkewysjc7tmgun.output('getDimension', function (elem) {
          return $_20v7a9116jc7tmhi9.get(elem) + 'px';
        })
      ],
      height: [
        $_8vhkewysjc7tmgun.output('property', 'height'),
        $_8vhkewysjc7tmgun.output('getDimension', function (elem) {
          return $_47uhgnzqjc7tmh4r.get(elem) + 'px';
        })
      ]
    }))
  ];

  var init$4 = function (spec) {
    var state = Cell(spec.expanded());
    var readState = function () {
      return 'expanded: ' + state.get();
    };
    return BehaviourState({
      isExpanded: function () {
        return state.get() === true;
      },
      isCollapsed: function () {
        return state.get() === false;
      },
      setCollapsed: $_7wlbdawajc7tmgej.curry(state.set, false),
      setExpanded: $_7wlbdawajc7tmgej.curry(state.set, true),
      readState: readState
    });
  };
  var $_1c2bw414wjc7tmikf = { init: init$4 };

  var Sliding = $_567rv0w3jc7tmgc6.create({
    fields: SlidingSchema,
    name: 'sliding',
    active: $_59qisj14tjc7tmijf,
    apis: $_74476m14ujc7tmijn,
    state: $_1c2bw414wjc7tmikf
  });

  var build$2 = function (refresh, scrollIntoView) {
    var dropup = $_9yx6nt12jjc7tmhu8.build(Container.sketch({
      dom: {
        tag: 'div',
        classes: $_fej2h3z0jc7tmgwt.resolve('dropup')
      },
      components: [],
      containerBehaviours: $_567rv0w3jc7tmgc6.derive([
        Replacing.config({}),
        Sliding.config({
          closedClass: $_fej2h3z0jc7tmgwt.resolve('dropup-closed'),
          openClass: $_fej2h3z0jc7tmgwt.resolve('dropup-open'),
          shrinkingClass: $_fej2h3z0jc7tmgwt.resolve('dropup-shrinking'),
          growingClass: $_fej2h3z0jc7tmgwt.resolve('dropup-growing'),
          dimension: { property: 'height' },
          onShrunk: function (component) {
            refresh();
            scrollIntoView();
            Replacing.set(component, []);
          },
          onGrown: function (component) {
            refresh();
            scrollIntoView();
          }
        }),
        $_c7bmb0yzjc7tmgwp.orientation(function (component, data) {
          disappear($_7wlbdawajc7tmgej.noop);
        })
      ])
    }));
    var appear = function (menu, update, component) {
      if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
        window.requestAnimationFrame(function () {
          update(component);
          Replacing.set(dropup, [menu()]);
          Sliding.grow(dropup);
        });
      }
    };
    var disappear = function (onReadyToShrink) {
      window.requestAnimationFrame(function () {
        onReadyToShrink();
        Sliding.shrink(dropup);
      });
    };
    return {
      appear: appear,
      disappear: disappear,
      component: $_7wlbdawajc7tmgej.constant(dropup),
      element: dropup.element
    };
  };
  var $_dom9z514rjc7tmiit = { build: build$2 };

  var isDangerous = function (event) {
    return event.raw().which === $_4hq5r8zdjc7tmgz0.BACKSPACE()[0] && !$_682tbuw8jc7tmgdz.contains([
      'input',
      'textarea'
    ], $_e44ar2xwjc7tmgp4.name(event.target()));
  };
  var isFirefox = $_9tl8l8wfjc7tmgez.detect().browser.isFirefox();
  var settingsSchema = $_c1hr3lxgjc7tmgly.objOfOnly([
    $_9benqox1jc7tmght.strictFunction('triggerEvent'),
    $_9benqox1jc7tmght.strictFunction('broadcastEvent'),
    $_9benqox1jc7tmght.defaulted('stopBackspace', true)
  ]);
  var bindFocus = function (container, handler) {
    if (isFirefox) {
      return $_4bmha313jjc7tmi4n.capture(container, 'focus', handler);
    } else {
      return $_4bmha313jjc7tmi4n.bind(container, 'focusin', handler);
    }
  };
  var bindBlur = function (container, handler) {
    if (isFirefox) {
      return $_4bmha313jjc7tmi4n.capture(container, 'blur', handler);
    } else {
      return $_4bmha313jjc7tmi4n.bind(container, 'focusout', handler);
    }
  };
  var setup$2 = function (container, rawSettings) {
    var settings = $_c1hr3lxgjc7tmgly.asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings);
    var pointerEvents = $_9tl8l8wfjc7tmgez.detect().deviceType.isTouch() ? [
      'touchstart',
      'touchmove',
      'touchend',
      'gesturestart'
    ] : [
      'mousedown',
      'mouseup',
      'mouseover',
      'mousemove',
      'mouseout',
      'click'
    ];
    var tapEvent = $_8659qc13qjc7tmi69.monitor(settings);
    var simpleEvents = $_682tbuw8jc7tmgdz.map(pointerEvents.concat([
      'selectstart',
      'input',
      'contextmenu',
      'change',
      'transitionend',
      'dragstart',
      'dragover',
      'drop'
    ]), function (type) {
      return $_4bmha313jjc7tmi4n.bind(container, type, function (event) {
        tapEvent.fireIfReady(event, type).each(function (tapStopped) {
          if (tapStopped)
            event.kill();
        });
        var stopped = settings.triggerEvent(type, event);
        if (stopped)
          event.kill();
      });
    });
    var onKeydown = $_4bmha313jjc7tmi4n.bind(container, 'keydown', function (event) {
      var stopped = settings.triggerEvent('keydown', event);
      if (stopped)
        event.kill();
      else if (settings.stopBackspace === true && isDangerous(event)) {
        event.prevent();
      }
    });
    var onFocusIn = bindFocus(container, function (event) {
      var stopped = settings.triggerEvent('focusin', event);
      if (stopped)
        event.kill();
    });
    var onFocusOut = bindBlur(container, function (event) {
      var stopped = settings.triggerEvent('focusout', event);
      if (stopped)
        event.kill();
      setTimeout(function () {
        settings.triggerEvent($_66ekuowvjc7tmggn.postBlur(), event);
      }, 0);
    });
    var defaultView = $_bvq6n5y2jc7tmgq7.defaultView(container);
    var onWindowScroll = $_4bmha313jjc7tmi4n.bind(defaultView, 'scroll', function (event) {
      var stopped = settings.broadcastEvent($_66ekuowvjc7tmggn.windowScroll(), event);
      if (stopped)
        event.kill();
    });
    var unbind = function () {
      $_682tbuw8jc7tmgdz.each(simpleEvents, function (e) {
        e.unbind();
      });
      onKeydown.unbind();
      onFocusIn.unbind();
      onFocusOut.unbind();
      onWindowScroll.unbind();
    };
    return { unbind: unbind };
  };
  var $_8xh3c814zjc7tmilw = { setup: setup$2 };

  var derive$3 = function (rawEvent, rawTarget) {
    var source = $_ftivuzx5jc7tmgj2.readOptFrom(rawEvent, 'target').map(function (getTarget) {
      return getTarget();
    }).getOr(rawTarget);
    return Cell(source);
  };
  var $_23p712151jc7tmimo = { derive: derive$3 };

  var fromSource = function (event, source) {
    var stopper = Cell(false);
    var cutter = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    var cut = function () {
      cutter.set(true);
    };
    return {
      stop: stop,
      cut: cut,
      isStopped: stopper.get,
      isCut: cutter.get,
      event: $_7wlbdawajc7tmgej.constant(event),
      setSource: source.set,
      getSource: source.get
    };
  };
  var fromExternal = function (event) {
    var stopper = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    return {
      stop: stop,
      cut: $_7wlbdawajc7tmgej.noop,
      isStopped: stopper.get,
      isCut: $_7wlbdawajc7tmgej.constant(false),
      event: $_7wlbdawajc7tmgej.constant(event),
      setTarget: $_7wlbdawajc7tmgej.die(new Error('Cannot set target of a broadcasted event')),
      getTarget: $_7wlbdawajc7tmgej.die(new Error('Cannot get target of a broadcasted event'))
    };
  };
  var fromTarget = function (event, target) {
    var source = Cell(target);
    return fromSource(event, source);
  };
  var $_6qfk2w152jc7tmimv = {
    fromSource: fromSource,
    fromExternal: fromExternal,
    fromTarget: fromTarget
  };

  var adt$6 = $_edapatx3jc7tmgi6.generate([
    { stopped: [] },
    { resume: ['element'] },
    { complete: [] }
  ]);
  var doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
    var handler = lookup(eventType, target);
    var simulatedEvent = $_6qfk2w152jc7tmimv.fromSource(rawEvent, source);
    return handler.fold(function () {
      logger.logEventNoHandlers(eventType, target);
      return adt$6.complete();
    }, function (handlerInfo) {
      var descHandler = handlerInfo.descHandler();
      var eventHandler = $_40ber812ujc7tmhxv.getHandler(descHandler);
      eventHandler(simulatedEvent);
      if (simulatedEvent.isStopped()) {
        logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.stopped();
      } else if (simulatedEvent.isCut()) {
        logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.complete();
      } else
        return $_bvq6n5y2jc7tmgq7.parent(handlerInfo.element()).fold(function () {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.complete();
        }, function (parent) {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.resume(parent);
        });
    });
  };
  var doTriggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, source, logger) {
    return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(function () {
      return true;
    }, function (parent) {
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger);
    }, function () {
      return false;
    });
  };
  var triggerHandler = function (lookup, eventType, rawEvent, target, logger) {
    var source = $_23p712151jc7tmimo.derive(rawEvent, target);
    return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
  };
  var broadcast = function (listeners, rawEvent, logger) {
    var simulatedEvent = $_6qfk2w152jc7tmimv.fromExternal(rawEvent);
    $_682tbuw8jc7tmgdz.each(listeners, function (listener) {
      var descHandler = listener.descHandler();
      var handler = $_40ber812ujc7tmhxv.getHandler(descHandler);
      handler(simulatedEvent);
    });
    return simulatedEvent.isStopped();
  };
  var triggerUntilStopped = function (lookup, eventType, rawEvent, logger) {
    var rawTarget = rawEvent.target();
    return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger);
  };
  var triggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, logger) {
    var source = $_23p712151jc7tmimo.derive(rawEvent, rawTarget);
    return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
  };
  var $_43d4lm150jc7tmime = {
    triggerHandler: triggerHandler,
    triggerUntilStopped: triggerUntilStopped,
    triggerOnUntilStopped: triggerOnUntilStopped,
    broadcast: broadcast
  };

  var closest$4 = function (target, transform, isRoot) {
    var delegate = $_63he74yhjc7tmgsm.closest(target, function (elem) {
      return transform(elem).isSome();
    }, isRoot);
    return delegate.bind(transform);
  };
  var $_dfa7ie155jc7tminw = { closest: closest$4 };

  var eventHandler = $_3we77gxljc7tmgnf.immutable('element', 'descHandler');
  var messageHandler = function (id, handler) {
    return {
      id: $_7wlbdawajc7tmgej.constant(id),
      descHandler: $_7wlbdawajc7tmgej.constant(handler)
    };
  };
  var EventRegistry = function () {
    var registry = {};
    var registerId = function (extraArgs, id, events) {
      $_fvv1p1wzjc7tmgh1.each(events, function (v, k) {
        var handlers = registry[k] !== undefined ? registry[k] : {};
        handlers[id] = $_40ber812ujc7tmhxv.curryArgs(v, extraArgs);
        registry[k] = handlers;
      });
    };
    var findHandler = function (handlers, elem) {
      return $_95kbix10ljc7tmhd8.read(elem).fold(function (err) {
        return $_7db13lw9jc7tmgee.none();
      }, function (id) {
        var reader = $_ftivuzx5jc7tmgj2.readOpt(id);
        return handlers.bind(reader).map(function (descHandler) {
          return eventHandler(elem, descHandler);
        });
      });
    };
    var filterByType = function (type) {
      return $_ftivuzx5jc7tmgj2.readOptFrom(registry, type).map(function (handlers) {
        return $_fvv1p1wzjc7tmgh1.mapToArray(handlers, function (f, id) {
          return messageHandler(id, f);
        });
      }).getOr([]);
    };
    var find = function (isAboveRoot, type, target) {
      var readType = $_ftivuzx5jc7tmgj2.readOpt(type);
      var handlers = readType(registry);
      return $_dfa7ie155jc7tminw.closest(target, function (elem) {
        return findHandler(handlers, elem);
      }, isAboveRoot);
    };
    var unregisterId = function (id) {
      $_fvv1p1wzjc7tmgh1.each(registry, function (handlersById, eventName) {
        if (handlersById.hasOwnProperty(id))
          delete handlersById[id];
      });
    };
    return {
      registerId: registerId,
      unregisterId: unregisterId,
      filterByType: filterByType,
      find: find
    };
  };

  var Registry = function () {
    var events = EventRegistry();
    var components = {};
    var readOrTag = function (component) {
      var elem = component.element();
      return $_95kbix10ljc7tmhd8.read(elem).fold(function () {
        return $_95kbix10ljc7tmhd8.write('uid-', component.element());
      }, function (uid) {
        return uid;
      });
    };
    var failOnDuplicate = function (component, tagId) {
      var conflict = components[tagId];
      if (conflict === component)
        unregister(component);
      else
        throw new Error('The tagId "' + tagId + '" is already used by: ' + $_5d0nway8jc7tmgrj.element(conflict.element()) + '\nCannot use it for: ' + $_5d0nway8jc7tmgrj.element(component.element()) + '\n' + 'The conflicting element is' + ($_5q4xj9y6jc7tmgqt.inBody(conflict.element()) ? ' ' : ' not ') + 'already in the DOM');
    };
    var register = function (component) {
      var tagId = readOrTag(component);
      if ($_ftivuzx5jc7tmgj2.hasKey(components, tagId))
        failOnDuplicate(component, tagId);
      var extraArgs = [component];
      events.registerId(extraArgs, tagId, component.events());
      components[tagId] = component;
    };
    var unregister = function (component) {
      $_95kbix10ljc7tmhd8.read(component.element()).each(function (tagId) {
        components[tagId] = undefined;
        events.unregisterId(tagId);
      });
    };
    var filter = function (type) {
      return events.filterByType(type);
    };
    var find = function (isAboveRoot, type, target) {
      return events.find(isAboveRoot, type, target);
    };
    var getById = function (id) {
      return $_ftivuzx5jc7tmgj2.readOpt(id)(components);
    };
    return {
      find: find,
      filter: filter,
      register: register,
      unregister: unregister,
      getById: getById
    };
  };

  var create$6 = function () {
    var root = $_9yx6nt12jjc7tmhu8.build(Container.sketch({ dom: { tag: 'div' } }));
    return takeover(root);
  };
  var takeover = function (root) {
    var isAboveRoot = function (el) {
      return $_bvq6n5y2jc7tmgq7.parent(root.element()).fold(function () {
        return true;
      }, function (parent) {
        return $_b6kzgmw7jc7tmgdr.eq(el, parent);
      });
    };
    var registry = Registry();
    var lookup = function (eventName, target) {
      return registry.find(isAboveRoot, eventName, target);
    };
    var domEvents = $_8xh3c814zjc7tmilw.setup(root.element(), {
      triggerEvent: function (eventName, event) {
        return $_dszcp6y7jc7tmgqz.monitorEvent(eventName, event.target(), function (logger) {
          return $_43d4lm150jc7tmime.triggerUntilStopped(lookup, eventName, event, logger);
        });
      },
      broadcastEvent: function (eventName, event) {
        var listeners = registry.filter(eventName);
        return $_43d4lm150jc7tmime.broadcast(listeners, event);
      }
    });
    var systemApi = SystemApi({
      debugInfo: $_7wlbdawajc7tmgej.constant('real'),
      triggerEvent: function (customType, target, data) {
        $_dszcp6y7jc7tmgqz.monitorEvent(customType, target, function (logger) {
          $_43d4lm150jc7tmime.triggerOnUntilStopped(lookup, customType, data, target, logger);
        });
      },
      triggerFocus: function (target, originator) {
        $_95kbix10ljc7tmhd8.read(target).fold(function () {
          $_aqgip2yfjc7tmgse.focus(target);
        }, function (_alloyId) {
          $_dszcp6y7jc7tmgqz.monitorEvent($_66ekuowvjc7tmggn.focus(), target, function (logger) {
            $_43d4lm150jc7tmime.triggerHandler(lookup, $_66ekuowvjc7tmggn.focus(), {
              originator: $_7wlbdawajc7tmgej.constant(originator),
              target: $_7wlbdawajc7tmgej.constant(target)
            }, target, logger);
          });
        });
      },
      triggerEscape: function (comp, simulatedEvent) {
        systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event());
      },
      getByUid: function (uid) {
        return getByUid(uid);
      },
      getByDom: function (elem) {
        return getByDom(elem);
      },
      build: $_9yx6nt12jjc7tmhu8.build,
      addToGui: function (c) {
        add(c);
      },
      removeFromGui: function (c) {
        remove(c);
      },
      addToWorld: function (c) {
        addToWorld(c);
      },
      removeFromWorld: function (c) {
        removeFromWorld(c);
      },
      broadcast: function (message) {
        broadcast(message);
      },
      broadcastOn: function (channels, message) {
        broadcastOn(channels, message);
      }
    });
    var addToWorld = function (component) {
      component.connect(systemApi);
      if (!$_e44ar2xwjc7tmgp4.isText(component.element())) {
        registry.register(component);
        $_682tbuw8jc7tmgdz.each(component.components(), addToWorld);
        systemApi.triggerEvent($_66ekuowvjc7tmggn.systemInit(), component.element(), { target: $_7wlbdawajc7tmgej.constant(component.element()) });
      }
    };
    var removeFromWorld = function (component) {
      if (!$_e44ar2xwjc7tmgp4.isText(component.element())) {
        $_682tbuw8jc7tmgdz.each(component.components(), removeFromWorld);
        registry.unregister(component);
      }
      component.disconnect();
    };
    var add = function (component) {
      $_4yvg8yy0jc7tmgpq.attach(root, component);
    };
    var remove = function (component) {
      $_4yvg8yy0jc7tmgpq.detach(component);
    };
    var destroy = function () {
      domEvents.unbind();
      $_3bj1g6y4jc7tmgqi.remove(root.element());
    };
    var broadcastData = function (data) {
      var receivers = registry.filter($_66ekuowvjc7tmggn.receive());
      $_682tbuw8jc7tmgdz.each(receivers, function (receiver) {
        var descHandler = receiver.descHandler();
        var handler = $_40ber812ujc7tmhxv.getHandler(descHandler);
        handler(data);
      });
    };
    var broadcast = function (message) {
      broadcastData({
        universal: $_7wlbdawajc7tmgej.constant(true),
        data: $_7wlbdawajc7tmgej.constant(message)
      });
    };
    var broadcastOn = function (channels, message) {
      broadcastData({
        universal: $_7wlbdawajc7tmgej.constant(false),
        channels: $_7wlbdawajc7tmgej.constant(channels),
        data: $_7wlbdawajc7tmgej.constant(message)
      });
    };
    var getByUid = function (uid) {
      return registry.getById(uid).fold(function () {
        return $_5x2c31x7jc7tmgjn.error(new Error('Could not find component with uid: "' + uid + '" in system.'));
      }, $_5x2c31x7jc7tmgjn.value);
    };
    var getByDom = function (elem) {
      return $_95kbix10ljc7tmhd8.read(elem).bind(getByUid);
    };
    addToWorld(root);
    return {
      root: $_7wlbdawajc7tmgej.constant(root),
      element: root.element,
      destroy: destroy,
      add: add,
      remove: remove,
      getByUid: getByUid,
      getByDom: getByDom,
      addToWorld: addToWorld,
      removeFromWorld: removeFromWorld,
      broadcast: broadcast,
      broadcastOn: broadcastOn
    };
  };
  var $_54d5qv14yjc7tmiky = {
    create: create$6,
    takeover: takeover
  };

  var READ_ONLY_MODE_CLASS = $_7wlbdawajc7tmgej.constant($_fej2h3z0jc7tmgwt.resolve('readonly-mode'));
  var EDIT_MODE_CLASS = $_7wlbdawajc7tmgej.constant($_fej2h3z0jc7tmgwt.resolve('edit-mode'));
  var OuterContainer = function (spec) {
    var root = $_9yx6nt12jjc7tmhu8.build(Container.sketch({
      dom: { classes: [$_fej2h3z0jc7tmgwt.resolve('outer-container')].concat(spec.classes) },
      containerBehaviours: $_567rv0w3jc7tmgc6.derive([Swapping.config({
          alpha: READ_ONLY_MODE_CLASS(),
          omega: EDIT_MODE_CLASS()
        })])
    }));
    return $_54d5qv14yjc7tmiky.takeover(root);
  };

  var AndroidRealm = function (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_fej2h3z0jc7tmgwt.resolve('android-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_f5y4ql129jc7tmhqm.api();
    var switchToEdit = $_bk84af14qjc7tmiif.makeEditSwitch(webapp);
    var socket = $_bk84af14qjc7tmiif.makeSocket();
    var dropup = $_dom9z514rjc7tmiit.build($_7wlbdawajc7tmgej.noop, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_cm64n413mjc7tmi52.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        w.exit();
        Replacing.remove(socket, switchToEdit);
      });
    };
    var updateMode = function (readOnly) {
      $_bk84af14qjc7tmiif.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_7wlbdawajc7tmgej.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_7wlbdawajc7tmgej.constant(socket),
      dropup: $_7wlbdawajc7tmgej.constant(dropup)
    };
  };

  var attached = function (element, scope) {
    var doc = scope || $_19g44bwsjc7tmgg6.fromDom(document.documentElement);
    return $_63he74yhjc7tmgsm.ancestor(element, $_7wlbdawajc7tmgej.curry($_b6kzgmw7jc7tmgdr.eq, doc)).isSome();
  };
  var windowOf = function (element) {
    var dom = element.dom();
    if (dom === dom.window)
      return element;
    return $_e44ar2xwjc7tmgp4.isDocument(element) ? dom.defaultView || dom.parentWindow : null;
  };
  var $_br5jo015bjc7tmipv = {
    attached: attached,
    windowOf: windowOf
  };

  var r = function (left, top) {
    var translate = function (x, y) {
      return r(left + x, top + y);
    };
    return {
      left: $_7wlbdawajc7tmgej.constant(left),
      top: $_7wlbdawajc7tmgej.constant(top),
      translate: translate
    };
  };

  var boxPosition = function (dom) {
    var box = dom.getBoundingClientRect();
    return r(box.left, box.top);
  };
  var firstDefinedOrZero = function (a, b) {
    return a !== undefined ? a : b !== undefined ? b : 0;
  };
  var absolute = function (element) {
    var doc = element.dom().ownerDocument;
    var body = doc.body;
    var win = $_br5jo015bjc7tmipv.windowOf($_19g44bwsjc7tmgg6.fromDom(doc));
    var html = doc.documentElement;
    var scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop);
    var scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft);
    var clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
    var clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
    return viewport(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
  };
  var relative = function (element) {
    var dom = element.dom();
    return r(dom.offsetLeft, dom.offsetTop);
  };
  var viewport = function (element) {
    var dom = element.dom();
    var doc = dom.ownerDocument;
    var body = doc.body;
    var html = $_19g44bwsjc7tmgg6.fromDom(doc.documentElement);
    if (body === dom)
      return r(body.offsetLeft, body.offsetTop);
    if (!$_br5jo015bjc7tmipv.attached(element, html))
      return r(0, 0);
    return boxPosition(dom);
  };
  var $_7ua0xl15ajc7tmipr = {
    absolute: absolute,
    relative: relative,
    viewport: viewport
  };

  var initEvents$1 = function (editorApi, iosApi, toolstrip, socket, dropup) {
    var saveSelectionFirst = function () {
      iosApi.run(function (api) {
        api.highlightSelection();
      });
    };
    var refreshIosSelection = function () {
      iosApi.run(function (api) {
        api.refreshSelection();
      });
    };
    var scrollToY = function (yTop, height) {
      var y = yTop - socket.dom().scrollTop;
      iosApi.run(function (api) {
        api.scrollIntoView(y, y + height);
      });
    };
    var scrollToElement = function (target) {
      var yTop = $_7ua0xl15ajc7tmipr.absolute(target).top();
      var height = $_47uhgnzqjc7tmh4r.get(target);
      scrollToY(iosApi, socket);
    };
    var scrollToCursor = function () {
      editorApi.getCursorBox().each(function (box) {
        scrollToY(box.top(), box.height());
      });
    };
    var clearSelection = function () {
      iosApi.run(function (api) {
        api.clearSelection();
      });
    };
    var clearAndRefresh = function () {
      clearSelection();
      refreshThrottle.throttle();
    };
    var refreshView = function () {
      scrollToCursor();
      iosApi.run(function (api) {
        api.syncHeight();
      });
    };
    var reposition = function () {
      var toolbarHeight = $_47uhgnzqjc7tmh4r.get(toolstrip);
      iosApi.run(function (api) {
        api.setViewportOffset(toolbarHeight);
      });
      refreshIosSelection();
      refreshView();
    };
    var toEditing = function () {
      iosApi.run(function (api) {
        api.toEditing();
      });
    };
    var toReading = function () {
      iosApi.run(function (api) {
        api.toReading();
      });
    };
    var onToolbarTouch = function (event) {
      iosApi.run(function (api) {
        api.onToolbarTouch(event);
      });
    };
    var tapping = $_5vdgxf13pjc7tmi5y.monitor(editorApi);
    var refreshThrottle = $_6z81m614jjc7tmigd.last(refreshView, 300);
    var listeners = [
      editorApi.onKeyup(clearAndRefresh),
      editorApi.onNodeChanged(refreshIosSelection),
      editorApi.onDomChanged(refreshThrottle.throttle),
      editorApi.onDomChanged(refreshIosSelection),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        refreshThrottle.throttle();
      }),
      editorApi.onScrollToElement(function (event) {
        scrollToElement(event.element());
      }),
      editorApi.onToEditing(toEditing),
      editorApi.onToReading(toReading),
      $_4bmha313jjc7tmi4n.bind(editorApi.doc(), 'touchend', function (touchEvent) {
        if ($_b6kzgmw7jc7tmgdr.eq(editorApi.html(), touchEvent.target()) || $_b6kzgmw7jc7tmgdr.eq(editorApi.body(), touchEvent.target())) {
        }
      }),
      $_4bmha313jjc7tmi4n.bind(toolstrip, 'transitionend', function (transitionEvent) {
        if (transitionEvent.raw().propertyName === 'height') {
          reposition();
        }
      }),
      $_4bmha313jjc7tmi4n.capture(toolstrip, 'touchstart', function (touchEvent) {
        saveSelectionFirst();
        onToolbarTouch(touchEvent);
        editorApi.onTouchToolstrip();
      }),
      $_4bmha313jjc7tmi4n.bind(editorApi.body(), 'touchstart', function (evt) {
        clearSelection();
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_4bmha313jjc7tmi4n.bind(editorApi.body(), 'click', function (event) {
        event.kill();
      }),
      $_4bmha313jjc7tmi4n.bind(toolstrip, 'touchmove', function () {
        editorApi.onToolbarScrollStart();
      })
    ];
    var destroy = function () {
      $_682tbuw8jc7tmgdz.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_cw9cfg159jc7tmipb = { initEvents: initEvents$1 };

  var refreshInput = function (input) {
    var start = input.dom().selectionStart;
    var end = input.dom().selectionEnd;
    var dir = input.dom().selectionDirection;
    setTimeout(function () {
      input.dom().setSelectionRange(start, end, dir);
      $_aqgip2yfjc7tmgse.focus(input);
    }, 50);
  };
  var refresh = function (winScope) {
    var sel = winScope.getSelection();
    if (sel.rangeCount > 0) {
      var br = sel.getRangeAt(0);
      var r = winScope.document.createRange();
      r.setStart(br.startContainer, br.startOffset);
      r.setEnd(br.endContainer, br.endOffset);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  var $_4b66c15gjc7tmirk = {
    refreshInput: refreshInput,
    refresh: refresh
  };

  var resume$1 = function (cWin, frame) {
    $_aqgip2yfjc7tmgse.active().each(function (active) {
      if (!$_b6kzgmw7jc7tmgdr.eq(active, frame)) {
        $_aqgip2yfjc7tmgse.blur(active);
      }
    });
    cWin.focus();
    $_aqgip2yfjc7tmgse.focus($_19g44bwsjc7tmgg6.fromDom(cWin.document.body));
    $_4b66c15gjc7tmirk.refresh(cWin);
  };
  var $_1mtv4u15fjc7tmire = { resume: resume$1 };

  var FakeSelection = function (win, frame) {
    var doc = win.document;
    var container = $_19g44bwsjc7tmgg6.fromTag('div');
    $_7lq4x8xtjc7tmgod.add(container, $_fej2h3z0jc7tmgwt.resolve('unfocused-selections'));
    $_972741y1jc7tmgq3.append($_19g44bwsjc7tmgg6.fromDom(doc.documentElement), container);
    var onTouch = $_4bmha313jjc7tmi4n.bind(container, 'touchstart', function (event) {
      event.prevent();
      $_1mtv4u15fjc7tmire.resume(win, frame);
      clear();
    });
    var make = function (rectangle) {
      var span = $_19g44bwsjc7tmgg6.fromTag('span');
      $_9a028u12xjc7tmhz1.add(span, [
        $_fej2h3z0jc7tmgwt.resolve('layer-editor'),
        $_fej2h3z0jc7tmgwt.resolve('unfocused-selection')
      ]);
      $_bq4g3yzrjc7tmh4w.setAll(span, {
        'left': rectangle.left() + 'px',
        'top': rectangle.top() + 'px',
        'width': rectangle.width() + 'px',
        'height': rectangle.height() + 'px'
      });
      return span;
    };
    var update = function () {
      clear();
      var rectangles = $_5vi84113vjc7tmi9k.getRectangles(win);
      var spans = $_682tbuw8jc7tmgdz.map(rectangles, make);
      $_gieeo8y5jc7tmgqo.append(container, spans);
    };
    var clear = function () {
      $_3bj1g6y4jc7tmgqi.empty(container);
    };
    var destroy = function () {
      onTouch.unbind();
      $_3bj1g6y4jc7tmgqi.remove(container);
    };
    var isActive = function () {
      return $_bvq6n5y2jc7tmgq7.children(container).length > 0;
    };
    return {
      update: update,
      isActive: isActive,
      destroy: destroy,
      clear: clear
    };
  };

  var nu$9 = function (baseFn) {
    var data = $_7db13lw9jc7tmgee.none();
    var callbacks = [];
    var map = function (f) {
      return nu$9(function (nCallback) {
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
      data = $_7db13lw9jc7tmgee.some(x);
      run(callbacks);
      callbacks = [];
    };
    var isReady = function () {
      return data.isSome();
    };
    var run = function (cbs) {
      $_682tbuw8jc7tmgdz.each(cbs, call);
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
    return nu$9(function (callback) {
      callback(a);
    });
  };
  var $_21f0bj15jjc7tmis9 = {
    nu: nu$9,
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
  var $_92prjd15kjc7tmisc = { bounce: bounce };

  var nu$8 = function (baseFn) {
    var get = function (callback) {
      baseFn($_92prjd15kjc7tmisc.bounce(callback));
    };
    var map = function (fab) {
      return nu$8(function (callback) {
        get(function (a) {
          var value = fab(a);
          callback(value);
        });
      });
    };
    var bind = function (aFutureB) {
      return nu$8(function (callback) {
        get(function (a) {
          aFutureB(a).get(callback);
        });
      });
    };
    var anonBind = function (futureB) {
      return nu$8(function (callback) {
        get(function (a) {
          futureB.get(callback);
        });
      });
    };
    var toLazy = function () {
      return $_21f0bj15jjc7tmis9.nu(get);
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
    return nu$8(function (callback) {
      callback(a);
    });
  };
  var $_78ycof15ijc7tmis7 = {
    nu: nu$8,
    pure: pure$1
  };

  var adjust = function (value, destination, amount) {
    if (Math.abs(value - destination) <= amount) {
      return $_7db13lw9jc7tmgee.none();
    } else if (value < destination) {
      return $_7db13lw9jc7tmgee.some(value + amount);
    } else {
      return $_7db13lw9jc7tmgee.some(value - amount);
    }
  };
  var create$8 = function () {
    var interval = null;
    var animate = function (getCurrent, destination, amount, increment, doFinish, rate) {
      var finished = false;
      var finish = function (v) {
        finished = true;
        doFinish(v);
      };
      clearInterval(interval);
      var abort = function (v) {
        clearInterval(interval);
        finish(v);
      };
      interval = setInterval(function () {
        var value = getCurrent();
        adjust(value, destination, amount).fold(function () {
          clearInterval(interval);
          finish(destination);
        }, function (s) {
          increment(s, abort);
          if (!finished) {
            var newValue = getCurrent();
            if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
              clearInterval(interval);
              finish(destination);
            }
          }
        });
      }, rate);
    };
    return { animate: animate };
  };
  var $_unqva15ljc7tmise = {
    create: create$8,
    adjust: adjust
  };

  var findDevice = function (deviceWidth, deviceHeight) {
    var devices = [
      {
        width: 320,
        height: 480,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 320,
        height: 568,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 375,
        height: 667,
        keyboard: {
          portrait: 305,
          landscape: 240
        }
      },
      {
        width: 414,
        height: 736,
        keyboard: {
          portrait: 320,
          landscape: 240
        }
      },
      {
        width: 768,
        height: 1024,
        keyboard: {
          portrait: 320,
          landscape: 400
        }
      },
      {
        width: 1024,
        height: 1366,
        keyboard: {
          portrait: 380,
          landscape: 460
        }
      }
    ];
    return $_eidt8kydjc7tmgsa.findMap(devices, function (device) {
      return deviceWidth <= device.width && deviceHeight <= device.height ? $_7db13lw9jc7tmgee.some(device.keyboard) : $_7db13lw9jc7tmgee.none();
    }).getOr({
      portrait: deviceHeight / 5,
      landscape: deviceWidth / 4
    });
  };
  var $_8tcz0t15ojc7tmiti = { findDevice: findDevice };

  var softKeyboardLimits = function (outerWindow) {
    return $_8tcz0t15ojc7tmiti.findDevice(outerWindow.screen.width, outerWindow.screen.height);
  };
  var accountableKeyboardHeight = function (outerWindow) {
    var portrait = $_nqo4113ijc7tmi4a.get(outerWindow).isPortrait();
    var limits = softKeyboardLimits(outerWindow);
    var keyboard = portrait ? limits.portrait : limits.landscape;
    var visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width;
    return visualScreenHeight - outerWindow.innerHeight > keyboard ? 0 : keyboard;
  };
  var getGreenzone = function (socket, dropup) {
    var outerWindow = $_bvq6n5y2jc7tmgq7.owner(socket).dom().defaultView;
    var viewportHeight = $_47uhgnzqjc7tmh4r.get(socket) + $_47uhgnzqjc7tmh4r.get(dropup);
    var acc = accountableKeyboardHeight(outerWindow);
    return viewportHeight - acc;
  };
  var updatePadding = function (contentBody, socket, dropup) {
    var greenzoneHeight = getGreenzone(socket, dropup);
    var deltaHeight = $_47uhgnzqjc7tmh4r.get(socket) + $_47uhgnzqjc7tmh4r.get(dropup) - greenzoneHeight;
    $_bq4g3yzrjc7tmh4w.set(contentBody, 'padding-bottom', deltaHeight + 'px');
  };
  var $_f6xihm15njc7tmita = {
    getGreenzone: getGreenzone,
    updatePadding: updatePadding
  };

  var fixture = $_edapatx3jc7tmgi6.generate([
    {
      'fixed': [
        'element',
        'property',
        'offsetY'
      ]
    },
    {
      'scroller': [
        'element',
        'offsetY'
      ]
    }
  ]);
  var yFixedData = 'data-' + $_fej2h3z0jc7tmgwt.resolve('position-y-fixed');
  var yFixedProperty = 'data-' + $_fej2h3z0jc7tmgwt.resolve('y-property');
  var yScrollingData = 'data-' + $_fej2h3z0jc7tmgwt.resolve('scrolling');
  var windowSizeData = 'data-' + $_fej2h3z0jc7tmgwt.resolve('last-window-height');
  var getYFixedData = function (element) {
    return $_4tv6f513ujc7tmi9g.safeParse(element, yFixedData);
  };
  var getYFixedProperty = function (element) {
    return $_gh0zlbxvjc7tmgol.get(element, yFixedProperty);
  };
  var getLastWindowSize = function (element) {
    return $_4tv6f513ujc7tmi9g.safeParse(element, windowSizeData);
  };
  var classifyFixed = function (element, offsetY) {
    var prop = getYFixedProperty(element);
    return fixture.fixed(element, prop, offsetY);
  };
  var classifyScrolling = function (element, offsetY) {
    return fixture.scroller(element, offsetY);
  };
  var classify = function (element) {
    var offsetY = getYFixedData(element);
    var classifier = $_gh0zlbxvjc7tmgol.get(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed;
    return classifier(element, offsetY);
  };
  var findFixtures = function (container) {
    var candidates = $_92hwmyzjjc7tmh1x.descendants(container, '[' + yFixedData + ']');
    return $_682tbuw8jc7tmgdz.map(candidates, classify);
  };
  var takeoverToolbar = function (toolbar) {
    var oldToolbarStyle = $_gh0zlbxvjc7tmgol.get(toolbar, 'style');
    $_bq4g3yzrjc7tmh4w.setAll(toolbar, {
      position: 'absolute',
      top: '0px'
    });
    $_gh0zlbxvjc7tmgol.set(toolbar, yFixedData, '0px');
    $_gh0zlbxvjc7tmgol.set(toolbar, yFixedProperty, 'top');
    var restore = function () {
      $_gh0zlbxvjc7tmgol.set(toolbar, 'style', oldToolbarStyle || '');
      $_gh0zlbxvjc7tmgol.remove(toolbar, yFixedData);
      $_gh0zlbxvjc7tmgol.remove(toolbar, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverViewport = function (toolbarHeight, height, viewport) {
    var oldViewportStyle = $_gh0zlbxvjc7tmgol.get(viewport, 'style');
    $_5xsloy13gjc7tmi41.register(viewport);
    $_bq4g3yzrjc7tmh4w.setAll(viewport, {
      'position': 'absolute',
      'height': height + 'px',
      'width': '100%',
      'top': toolbarHeight + 'px'
    });
    $_gh0zlbxvjc7tmgol.set(viewport, yFixedData, toolbarHeight + 'px');
    $_gh0zlbxvjc7tmgol.set(viewport, yScrollingData, 'true');
    $_gh0zlbxvjc7tmgol.set(viewport, yFixedProperty, 'top');
    var restore = function () {
      $_5xsloy13gjc7tmi41.deregister(viewport);
      $_gh0zlbxvjc7tmgol.set(viewport, 'style', oldViewportStyle || '');
      $_gh0zlbxvjc7tmgol.remove(viewport, yFixedData);
      $_gh0zlbxvjc7tmgol.remove(viewport, yScrollingData);
      $_gh0zlbxvjc7tmgol.remove(viewport, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverDropup = function (dropup, toolbarHeight, viewportHeight) {
    var oldDropupStyle = $_gh0zlbxvjc7tmgol.get(dropup, 'style');
    $_bq4g3yzrjc7tmh4w.setAll(dropup, {
      position: 'absolute',
      bottom: '0px'
    });
    $_gh0zlbxvjc7tmgol.set(dropup, yFixedData, '0px');
    $_gh0zlbxvjc7tmgol.set(dropup, yFixedProperty, 'bottom');
    var restore = function () {
      $_gh0zlbxvjc7tmgol.set(dropup, 'style', oldDropupStyle || '');
      $_gh0zlbxvjc7tmgol.remove(dropup, yFixedData);
      $_gh0zlbxvjc7tmgol.remove(dropup, yFixedProperty);
    };
    return { restore: restore };
  };
  var deriveViewportHeight = function (viewport, toolbarHeight, dropupHeight) {
    var outerWindow = $_bvq6n5y2jc7tmgq7.owner(viewport).dom().defaultView;
    var winH = outerWindow.innerHeight;
    $_gh0zlbxvjc7tmgol.set(viewport, windowSizeData, winH + 'px');
    return winH - toolbarHeight - dropupHeight;
  };
  var takeover$1 = function (viewport, contentBody, toolbar, dropup) {
    var outerWindow = $_bvq6n5y2jc7tmgq7.owner(viewport).dom().defaultView;
    var toolbarSetup = takeoverToolbar(toolbar);
    var toolbarHeight = $_47uhgnzqjc7tmh4r.get(toolbar);
    var dropupHeight = $_47uhgnzqjc7tmh4r.get(dropup);
    var viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight);
    var viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport);
    var dropupSetup = takeoverDropup(dropup, toolbarHeight, viewportHeight);
    var isActive = true;
    var restore = function () {
      isActive = false;
      toolbarSetup.restore();
      viewportSetup.restore();
      dropupSetup.restore();
    };
    var isExpanding = function () {
      var currentWinHeight = outerWindow.innerHeight;
      var lastWinHeight = getLastWindowSize(viewport);
      return currentWinHeight > lastWinHeight;
    };
    var refresh = function () {
      if (isActive) {
        var newToolbarHeight = $_47uhgnzqjc7tmh4r.get(toolbar);
        var dropupHeight = $_47uhgnzqjc7tmh4r.get(dropup);
        var newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight);
        $_gh0zlbxvjc7tmgol.set(viewport, yFixedData, newToolbarHeight + 'px');
        $_bq4g3yzrjc7tmh4w.set(viewport, 'height', newHeight + 'px');
        $_bq4g3yzrjc7tmh4w.set(dropup, 'bottom', -(newToolbarHeight + newHeight + dropupHeight) + 'px');
        $_f6xihm15njc7tmita.updatePadding(contentBody, viewport, dropup);
      }
    };
    var setViewportOffset = function (newYOffset) {
      var offsetPx = newYOffset + 'px';
      $_gh0zlbxvjc7tmgol.set(viewport, yFixedData, offsetPx);
      refresh();
    };
    $_f6xihm15njc7tmita.updatePadding(contentBody, viewport, dropup);
    return {
      setViewportOffset: setViewportOffset,
      isExpanding: isExpanding,
      isShrinking: $_7wlbdawajc7tmgej.not(isExpanding),
      refresh: refresh,
      restore: restore
    };
  };
  var $_7tj5cm15mjc7tmiss = {
    findFixtures: findFixtures,
    takeover: takeover$1,
    getYFixedData: getYFixedData
  };

  var animator = $_unqva15ljc7tmise.create();
  var ANIMATION_STEP = 15;
  var NUM_TOP_ANIMATION_FRAMES = 10;
  var ANIMATION_RATE = 10;
  var lastScroll = 'data-' + $_fej2h3z0jc7tmgwt.resolve('last-scroll-top');
  var getTop = function (element) {
    var raw = $_bq4g3yzrjc7tmh4w.getRaw(element, 'top').getOr(0);
    return parseInt(raw, 10);
  };
  var getScrollTop = function (element) {
    return parseInt(element.dom().scrollTop, 10);
  };
  var moveScrollAndTop = function (element, destination, finalTop) {
    return $_78ycof15ijc7tmis7.nu(function (callback) {
      var getCurrent = $_7wlbdawajc7tmgej.curry(getScrollTop, element);
      var update = function (newScroll) {
        element.dom().scrollTop = newScroll;
        $_bq4g3yzrjc7tmh4w.set(element, 'top', getTop(element) + ANIMATION_STEP + 'px');
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_bq4g3yzrjc7tmh4w.set(element, 'top', finalTop + 'px');
        callback(destination);
      };
      animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyScroll = function (element, destination) {
    return $_78ycof15ijc7tmis7.nu(function (callback) {
      var getCurrent = $_7wlbdawajc7tmgej.curry(getScrollTop, element);
      $_gh0zlbxvjc7tmgol.set(element, lastScroll, getCurrent());
      var update = function (newScroll, abort) {
        var previous = $_4tv6f513ujc7tmi9g.safeParse(element, lastScroll);
        if (previous !== element.dom().scrollTop) {
          abort(element.dom().scrollTop);
        } else {
          element.dom().scrollTop = newScroll;
          $_gh0zlbxvjc7tmgol.set(element, lastScroll, newScroll);
        }
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_gh0zlbxvjc7tmgol.set(element, lastScroll, destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyTop = function (element, destination) {
    return $_78ycof15ijc7tmis7.nu(function (callback) {
      var getCurrent = $_7wlbdawajc7tmgej.curry(getTop, element);
      var update = function (newTop) {
        $_bq4g3yzrjc7tmh4w.set(element, 'top', newTop + 'px');
      };
      var finish = function () {
        update(destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var updateTop = function (element, amount) {
    var newTop = amount + $_7tj5cm15mjc7tmiss.getYFixedData(element) + 'px';
    $_bq4g3yzrjc7tmh4w.set(element, 'top', newTop);
  };
  var moveWindowScroll = function (toolbar, viewport, destY) {
    var outerWindow = $_bvq6n5y2jc7tmgq7.owner(toolbar).dom().defaultView;
    return $_78ycof15ijc7tmis7.nu(function (callback) {
      updateTop(toolbar, destY);
      updateTop(viewport, destY);
      outerWindow.scrollTo(0, destY);
      callback(destY);
    });
  };
  var $_9lnao015hjc7tmirr = {
    moveScrollAndTop: moveScrollAndTop,
    moveOnlyScroll: moveOnlyScroll,
    moveOnlyTop: moveOnlyTop,
    moveWindowScroll: moveWindowScroll
  };

  var BackgroundActivity = function (doAction) {
    var action = Cell($_21f0bj15jjc7tmis9.pure({}));
    var start = function (value) {
      var future = $_21f0bj15jjc7tmis9.nu(function (callback) {
        return doAction(value).get(callback);
      });
      action.set(future);
    };
    var idle = function (g) {
      action.get().get(function () {
        g();
      });
    };
    return {
      start: start,
      idle: idle
    };
  };

  var scrollIntoView = function (cWin, socket, dropup, top, bottom) {
    var greenzone = $_f6xihm15njc7tmita.getGreenzone(socket, dropup);
    var refreshCursor = $_7wlbdawajc7tmgej.curry($_4b66c15gjc7tmirk.refresh, cWin);
    if (top > greenzone || bottom > greenzone) {
      $_9lnao015hjc7tmirr.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor);
    } else if (top < 0) {
      $_9lnao015hjc7tmirr.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor);
    } else {
    }
  };
  var $_2y4lds15qjc7tmitv = { scrollIntoView: scrollIntoView };

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
        $_682tbuw8jc7tmgdz.each(asyncValues, function (asyncValue, i) {
          asyncValue.get(cb(i));
        });
      }
    });
  };
  var $_7xl1zi15tjc7tmiue = { par: par$1 };

  var par = function (futures) {
    return $_7xl1zi15tjc7tmiue.par(futures, $_78ycof15ijc7tmis7.nu);
  };
  var mapM = function (array, fn) {
    var futures = $_682tbuw8jc7tmgdz.map(array, fn);
    return par(futures);
  };
  var compose$1 = function (f, g) {
    return function (a) {
      return g(a).bind(f);
    };
  };
  var $_bjkfo15sjc7tmiuc = {
    par: par,
    mapM: mapM,
    compose: compose$1
  };

  var updateFixed = function (element, property, winY, offsetY) {
    var destination = winY + offsetY;
    $_bq4g3yzrjc7tmh4w.set(element, property, destination + 'px');
    return $_78ycof15ijc7tmis7.pure(offsetY);
  };
  var updateScrollingFixed = function (element, winY, offsetY) {
    var destTop = winY + offsetY;
    var oldProp = $_bq4g3yzrjc7tmh4w.getRaw(element, 'top').getOr(offsetY);
    var delta = destTop - parseInt(oldProp, 10);
    var destScroll = element.dom().scrollTop + delta;
    return $_9lnao015hjc7tmirr.moveScrollAndTop(element, destScroll, destTop);
  };
  var updateFixture = function (fixture, winY) {
    return fixture.fold(function (element, property, offsetY) {
      return updateFixed(element, property, winY, offsetY);
    }, function (element, offsetY) {
      return updateScrollingFixed(element, winY, offsetY);
    });
  };
  var updatePositions = function (container, winY) {
    var fixtures = $_7tj5cm15mjc7tmiss.findFixtures(container);
    var updates = $_682tbuw8jc7tmgdz.map(fixtures, function (fixture) {
      return updateFixture(fixture, winY);
    });
    return $_bjkfo15sjc7tmiuc.par(updates);
  };
  var $_fr183q15rjc7tmiu2 = { updatePositions: updatePositions };

  var input = function (parent, operation) {
    var input = $_19g44bwsjc7tmgg6.fromTag('input');
    $_bq4g3yzrjc7tmh4w.setAll(input, {
      'opacity': '0',
      'position': 'absolute',
      'top': '-1000px',
      'left': '-1000px'
    });
    $_972741y1jc7tmgq3.append(parent, input);
    $_aqgip2yfjc7tmgse.focus(input);
    operation(input);
    $_3bj1g6y4jc7tmgqi.remove(input);
  };
  var $_65px9915ujc7tmiui = { input: input };

  var VIEW_MARGIN = 5;
  var register$2 = function (toolstrip, socket, container, outerWindow, structure, cWin) {
    var scroller = BackgroundActivity(function (y) {
      return $_9lnao015hjc7tmirr.moveWindowScroll(toolstrip, socket, y);
    });
    var scrollBounds = function () {
      var rects = $_5vi84113vjc7tmi9k.getRectangles(cWin);
      return $_7db13lw9jc7tmgee.from(rects[0]).bind(function (rect) {
        var viewTop = rect.top() - socket.dom().scrollTop;
        var outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN;
        return outside ? $_7db13lw9jc7tmgee.some({
          top: $_7wlbdawajc7tmgej.constant(viewTop),
          bottom: $_7wlbdawajc7tmgej.constant(viewTop + rect.height())
        }) : $_7db13lw9jc7tmgee.none();
      });
    };
    var scrollThrottle = $_6z81m614jjc7tmigd.last(function () {
      scroller.idle(function () {
        $_fr183q15rjc7tmiu2.updatePositions(container, outerWindow.pageYOffset).get(function () {
          var extraScroll = scrollBounds();
          extraScroll.each(function (extra) {
            socket.dom().scrollTop = socket.dom().scrollTop + extra.top();
          });
          scroller.start(0);
          structure.refresh();
        });
      });
    }, 1000);
    var onScroll = $_4bmha313jjc7tmi4n.bind($_19g44bwsjc7tmgg6.fromDom(outerWindow), 'scroll', function () {
      if (outerWindow.pageYOffset < 0) {
        return;
      }
      scrollThrottle.throttle();
    });
    $_fr183q15rjc7tmiu2.updatePositions(container, outerWindow.pageYOffset).get($_7wlbdawajc7tmgej.identity);
    return { unbind: onScroll.unbind };
  };
  var setup$3 = function (bag) {
    var cWin = bag.cWin();
    var ceBody = bag.ceBody();
    var socket = bag.socket();
    var toolstrip = bag.toolstrip();
    var toolbar = bag.toolbar();
    var contentElement = bag.contentElement();
    var keyboardType = bag.keyboardType();
    var outerWindow = bag.outerWindow();
    var dropup = bag.dropup();
    var structure = $_7tj5cm15mjc7tmiss.takeover(socket, ceBody, toolstrip, dropup);
    var keyboardModel = keyboardType(bag.outerBody(), cWin, $_5q4xj9y6jc7tmgqt.body(), contentElement, toolstrip, toolbar);
    var toEditing = function () {
      keyboardModel.toEditing();
      clearSelection();
    };
    var toReading = function () {
      keyboardModel.toReading();
    };
    var onToolbarTouch = function (event) {
      keyboardModel.onToolbarTouch(event);
    };
    var onOrientation = $_nqo4113ijc7tmi4a.onChange(outerWindow, {
      onChange: $_7wlbdawajc7tmgej.noop,
      onReady: structure.refresh
    });
    onOrientation.onAdjustment(function () {
      structure.refresh();
    });
    var onResize = $_4bmha313jjc7tmi4n.bind($_19g44bwsjc7tmgg6.fromDom(outerWindow), 'resize', function () {
      if (structure.isExpanding()) {
        structure.refresh();
      }
    });
    var onScroll = register$2(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin);
    var unfocusedSelection = FakeSelection(cWin, contentElement);
    var refreshSelection = function () {
      if (unfocusedSelection.isActive()) {
        unfocusedSelection.update();
      }
    };
    var highlightSelection = function () {
      unfocusedSelection.update();
    };
    var clearSelection = function () {
      unfocusedSelection.clear();
    };
    var scrollIntoView = function (top, bottom) {
      $_2y4lds15qjc7tmitv.scrollIntoView(cWin, socket, dropup, top, bottom);
    };
    var syncHeight = function () {
      $_bq4g3yzrjc7tmh4w.set(contentElement, 'height', contentElement.dom().contentWindow.document.body.scrollHeight + 'px');
    };
    var setViewportOffset = function (newYOffset) {
      structure.setViewportOffset(newYOffset);
      $_9lnao015hjc7tmirr.moveOnlyTop(socket, newYOffset).get($_7wlbdawajc7tmgej.identity);
    };
    var destroy = function () {
      structure.restore();
      onOrientation.destroy();
      onScroll.unbind();
      onResize.unbind();
      keyboardModel.destroy();
      unfocusedSelection.destroy();
      $_65px9915ujc7tmiui.input($_5q4xj9y6jc7tmgqt.body(), $_aqgip2yfjc7tmgse.blur);
    };
    return {
      toEditing: toEditing,
      toReading: toReading,
      onToolbarTouch: onToolbarTouch,
      refreshSelection: refreshSelection,
      clearSelection: clearSelection,
      highlightSelection: highlightSelection,
      scrollIntoView: scrollIntoView,
      updateToolbarPadding: $_7wlbdawajc7tmgej.noop,
      setViewportOffset: setViewportOffset,
      syncHeight: syncHeight,
      refreshStructure: structure.refresh,
      destroy: destroy
    };
  };
  var $_c6u2tg15djc7tmiq6 = { setup: setup$3 };

  var stubborn = function (outerBody, cWin, page, frame) {
    var toEditing = function () {
      $_1mtv4u15fjc7tmire.resume(cWin, frame);
    };
    var toReading = function () {
      $_65px9915ujc7tmiui.input(outerBody, $_aqgip2yfjc7tmgse.blur);
    };
    var captureInput = $_4bmha313jjc7tmi4n.bind(page, 'keydown', function (evt) {
      if (!$_682tbuw8jc7tmgdz.contains([
          'input',
          'textarea'
        ], $_e44ar2xwjc7tmgp4.name(evt.target()))) {
        toEditing();
      }
    });
    var onToolbarTouch = function () {
    };
    var destroy = function () {
      captureInput.unbind();
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: destroy
    };
  };
  var timid = function (outerBody, cWin, page, frame) {
    var dismissKeyboard = function () {
      $_aqgip2yfjc7tmgse.blur(frame);
    };
    var onToolbarTouch = function () {
      dismissKeyboard();
    };
    var toReading = function () {
      dismissKeyboard();
    };
    var toEditing = function () {
      $_1mtv4u15fjc7tmire.resume(cWin, frame);
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: $_7wlbdawajc7tmgej.noop
    };
  };
  var $_fdx0f115vjc7tmius = {
    stubborn: stubborn,
    timid: timid
  };

  var create$7 = function (platform, mask) {
    var meta = $_5nj1xk14gjc7tmifb.tag();
    var priorState = $_f5y4ql129jc7tmhqm.value();
    var scrollEvents = $_f5y4ql129jc7tmhqm.value();
    var iosApi = $_f5y4ql129jc7tmhqm.api();
    var iosEvents = $_f5y4ql129jc7tmhqm.api();
    var enter = function () {
      mask.hide();
      var doc = $_19g44bwsjc7tmgg6.fromDom(document);
      $_47wbmd14ejc7tmieh.getActiveApi(platform.editor).each(function (editorApi) {
        priorState.set({
          socketHeight: $_bq4g3yzrjc7tmh4w.getRaw(platform.socket, 'height'),
          iframeHeight: $_bq4g3yzrjc7tmh4w.getRaw(editorApi.frame(), 'height'),
          outerScroll: document.body.scrollTop
        });
        scrollEvents.set({ exclusives: $_azf6hh14pjc7tmii4.exclusive(doc, '.' + $_5xsloy13gjc7tmi41.scrollable()) });
        $_7lq4x8xtjc7tmgod.add(platform.container, $_fej2h3z0jc7tmgwt.resolve('fullscreen-maximized'));
        $_dlbwko14fjc7tmiey.clobberStyles(platform.container, editorApi.body());
        meta.maximize();
        $_bq4g3yzrjc7tmh4w.set(platform.socket, 'overflow', 'scroll');
        $_bq4g3yzrjc7tmh4w.set(platform.socket, '-webkit-overflow-scrolling', 'touch');
        $_aqgip2yfjc7tmgse.focus(editorApi.body());
        var setupBag = $_3we77gxljc7tmgnf.immutableBag([
          'cWin',
          'ceBody',
          'socket',
          'toolstrip',
          'toolbar',
          'dropup',
          'contentElement',
          'cursor',
          'keyboardType',
          'isScrolling',
          'outerWindow',
          'outerBody'
        ], []);
        iosApi.set($_c6u2tg15djc7tmiq6.setup(setupBag({
          'cWin': editorApi.win(),
          'ceBody': editorApi.body(),
          'socket': platform.socket,
          'toolstrip': platform.toolstrip,
          'toolbar': platform.toolbar,
          'dropup': platform.dropup.element(),
          'contentElement': editorApi.frame(),
          'cursor': $_7wlbdawajc7tmgej.noop,
          'outerBody': platform.body,
          'outerWindow': platform.win,
          'keyboardType': $_fdx0f115vjc7tmius.stubborn,
          'isScrolling': function () {
            return scrollEvents.get().exists(function (s) {
              return s.socket.isScrolling();
            });
          }
        })));
        iosApi.run(function (api) {
          api.syncHeight();
        });
        iosEvents.set($_cw9cfg159jc7tmipb.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup));
      });
    };
    var exit = function () {
      meta.restore();
      iosEvents.clear();
      iosApi.clear();
      mask.show();
      priorState.on(function (s) {
        s.socketHeight.each(function (h) {
          $_bq4g3yzrjc7tmh4w.set(platform.socket, 'height', h);
        });
        s.iframeHeight.each(function (h) {
          $_bq4g3yzrjc7tmh4w.set(platform.editor.getFrame(), 'height', h);
        });
        document.body.scrollTop = s.scrollTop;
      });
      priorState.clear();
      scrollEvents.on(function (s) {
        s.exclusives.unbind();
      });
      scrollEvents.clear();
      $_7lq4x8xtjc7tmgod.remove(platform.container, $_fej2h3z0jc7tmgwt.resolve('fullscreen-maximized'));
      $_dlbwko14fjc7tmiey.restoreStyles();
      $_5xsloy13gjc7tmi41.deregister(platform.toolbar);
      $_bq4g3yzrjc7tmh4w.remove(platform.socket, 'overflow');
      $_bq4g3yzrjc7tmh4w.remove(platform.socket, '-webkit-overflow-scrolling');
      $_aqgip2yfjc7tmgse.blur(platform.editor.getFrame());
      $_47wbmd14ejc7tmieh.getActiveApi(platform.editor).each(function (editorApi) {
        editorApi.clearSelection();
      });
    };
    var refreshStructure = function () {
      iosApi.run(function (api) {
        api.refreshStructure();
      });
    };
    return {
      enter: enter,
      refreshStructure: refreshStructure,
      exit: exit
    };
  };
  var $_6rpn8v158jc7tmioj = { create: create$7 };

  var produce$1 = function (raw) {
    var mobile = $_c1hr3lxgjc7tmgly.asRawOrDie('Getting IosWebapp schema', MobileSchema, raw);
    $_bq4g3yzrjc7tmh4w.set(mobile.toolstrip, 'width', '100%');
    $_bq4g3yzrjc7tmh4w.set(mobile.container, 'position', 'relative');
    var onView = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_9yx6nt12jjc7tmhu8.build($_clya5014ijc7tmifz.sketch(onView, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    var mode = $_6rpn8v158jc7tmioj.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: mode.refreshStructure,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_7wlbdawajc7tmgej.noop
    };
  };
  var $_d57x0k157jc7tmioa = { produce: produce$1 };

  var IosRealm = function (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_fej2h3z0jc7tmgwt.resolve('ios-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_f5y4ql129jc7tmhqm.api();
    var switchToEdit = $_bk84af14qjc7tmiif.makeEditSwitch(webapp);
    var socket = $_bk84af14qjc7tmiif.makeSocket();
    var dropup = $_dom9z514rjc7tmiit.build(function () {
      webapp.run(function (w) {
        w.refreshStructure();
      });
    }, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_d57x0k157jc7tmioa.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        Replacing.remove(socket, switchToEdit);
        w.exit();
      });
    };
    var updateMode = function (readOnly) {
      $_bk84af14qjc7tmiif.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_7wlbdawajc7tmgej.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_7wlbdawajc7tmgej.constant(socket),
      dropup: $_7wlbdawajc7tmgej.constant(dropup)
    };
  };

  var EditorManager = tinymce.util.Tools.resolve('tinymce.EditorManager');

  var derive$4 = function (editor) {
    var base = $_ftivuzx5jc7tmgj2.readOptFrom(editor.settings, 'skin_url').fold(function () {
      return EditorManager.baseURL + '/skins/' + 'lightgray';
    }, function (url) {
      return url;
    });
    return {
      content: base + '/content.mobile.min.css',
      ui: base + '/skin.mobile.min.css'
    };
  };
  var $_8r6jyv15wjc7tmiv6 = { derive: derive$4 };

  var fontSizes = [
    'x-small',
    'small',
    'medium',
    'large',
    'x-large'
  ];
  var fireChange$1 = function (realm, command, state) {
    realm.system().broadcastOn([$_caizgmynjc7tmgte.formatChanged()], {
      command: command,
      state: state
    });
  };
  var init$5 = function (realm, editor) {
    var allFormats = $_fvv1p1wzjc7tmgh1.keys(editor.formatter.get());
    $_682tbuw8jc7tmgdz.each(allFormats, function (command) {
      editor.formatter.formatChanged(command, function (state) {
        fireChange$1(realm, command, state);
      });
    });
    $_682tbuw8jc7tmgdz.each([
      'ul',
      'ol'
    ], function (command) {
      editor.selection.selectorChanged(command, function (state, data) {
        fireChange$1(realm, command, state);
      });
    });
  };
  var $_g07k5b15yjc7tmiva = {
    init: init$5,
    fontSizes: $_7wlbdawajc7tmgej.constant(fontSizes)
  };

  var fireSkinLoaded = function (editor) {
    var done = function () {
      editor._skinLoaded = true;
      editor.fire('SkinLoaded');
    };
    return function () {
      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };
  };
  var $_g7j2ct15zjc7tmivi = { fireSkinLoaded: fireSkinLoaded };

  var READING = $_7wlbdawajc7tmgej.constant('toReading');
  var EDITING = $_7wlbdawajc7tmgej.constant('toEditing');
  ThemeManager.add('mobile', function (editor) {
    var renderUI = function (args) {
      var cssUrls = $_8r6jyv15wjc7tmiv6.derive(editor);
      if ($_4z2ltrymjc7tmgtb.isSkinDisabled(editor) === false) {
        editor.contentCSS.push(cssUrls.content);
        DOMUtils.DOM.styleSheetLoader.load(cssUrls.ui, $_g7j2ct15zjc7tmivi.fireSkinLoaded(editor));
      } else {
        $_g7j2ct15zjc7tmivi.fireSkinLoaded(editor)();
      }
      var doScrollIntoView = function () {
        editor.fire('scrollIntoView');
      };
      var wrapper = $_19g44bwsjc7tmgg6.fromTag('div');
      var realm = $_9tl8l8wfjc7tmgez.detect().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView);
      var original = $_19g44bwsjc7tmgg6.fromDom(args.targetNode);
      $_972741y1jc7tmgq3.after(original, wrapper);
      $_4yvg8yy0jc7tmgpq.attachSystem(wrapper, realm.system());
      var findFocusIn = function (elem) {
        return $_aqgip2yfjc7tmgse.search(elem).bind(function (focused) {
          return realm.system().getByDom(focused).toOption();
        });
      };
      var outerWindow = args.targetNode.ownerDocument.defaultView;
      var orientation = $_nqo4113ijc7tmi4a.onChange(outerWindow, {
        onChange: function () {
          var alloy = realm.system();
          alloy.broadcastOn([$_caizgmynjc7tmgte.orientationChanged()], { width: $_nqo4113ijc7tmi4a.getActualWidth(outerWindow) });
        },
        onReady: $_7wlbdawajc7tmgej.noop
      });
      var setReadOnly = function (readOnlyGroups, mainGroups, ro) {
        if (ro === false) {
          editor.selection.collapse();
        }
        realm.setToolbarGroups(ro ? readOnlyGroups.get() : mainGroups.get());
        editor.setMode(ro === true ? 'readonly' : 'design');
        editor.fire(ro === true ? READING() : EDITING());
        realm.updateMode(ro);
      };
      var bindHandler = function (label, handler) {
        editor.on(label, handler);
        return {
          unbind: function () {
            editor.off(label);
          }
        };
      };
      editor.on('init', function () {
        realm.init({
          editor: {
            getFrame: function () {
              return $_19g44bwsjc7tmgg6.fromDom(editor.contentAreaContainer.querySelector('iframe'));
            },
            onDomChanged: function () {
              return { unbind: $_7wlbdawajc7tmgej.noop };
            },
            onToReading: function (handler) {
              return bindHandler(READING(), handler);
            },
            onToEditing: function (handler) {
              return bindHandler(EDITING(), handler);
            },
            onScrollToCursor: function (handler) {
              editor.on('scrollIntoView', function (tinyEvent) {
                handler(tinyEvent);
              });
              var unbind = function () {
                editor.off('scrollIntoView');
                orientation.destroy();
              };
              return { unbind: unbind };
            },
            onTouchToolstrip: function () {
              hideDropup();
            },
            onTouchContent: function () {
              var toolbar = $_19g44bwsjc7tmgg6.fromDom(editor.editorContainer.querySelector('.' + $_fej2h3z0jc7tmgwt.resolve('toolbar')));
              findFocusIn(toolbar).each($_7zx0zrwujc7tmgge.emitExecute);
              realm.restoreToolbar();
              hideDropup();
            },
            onTapContent: function (evt) {
              var target = evt.target();
              if ($_e44ar2xwjc7tmgp4.name(target) === 'img') {
                editor.selection.select(target.dom());
                evt.kill();
              } else if ($_e44ar2xwjc7tmgp4.name(target) === 'a') {
                var component = realm.system().getByDom($_19g44bwsjc7tmgg6.fromDom(editor.editorContainer));
                component.each(function (container) {
                  if (Swapping.isAlpha(container)) {
                    $_3w0xp9yljc7tmgt9.openLink(target.dom());
                  }
                });
              }
            }
          },
          container: $_19g44bwsjc7tmgg6.fromDom(editor.editorContainer),
          socket: $_19g44bwsjc7tmgg6.fromDom(editor.contentAreaContainer),
          toolstrip: $_19g44bwsjc7tmgg6.fromDom(editor.editorContainer.querySelector('.' + $_fej2h3z0jc7tmgwt.resolve('toolstrip'))),
          toolbar: $_19g44bwsjc7tmgg6.fromDom(editor.editorContainer.querySelector('.' + $_fej2h3z0jc7tmgwt.resolve('toolbar'))),
          dropup: realm.dropup(),
          alloy: realm.system(),
          translate: $_7wlbdawajc7tmgej.noop,
          setReadOnly: function (ro) {
            setReadOnly(readOnlyGroups, mainGroups, ro);
          }
        });
        var hideDropup = function () {
          realm.dropup().disappear(function () {
            realm.system().broadcastOn([$_caizgmynjc7tmgte.dropupDismissed()], {});
          });
        };
        $_dszcp6y7jc7tmgqz.registerInspector('remove this', realm.system());
        var backToMaskGroup = {
          label: 'The first group',
          scrollable: false,
          items: [$_3zi4bwz1jc7tmgwv.forToolbar('back', function () {
              editor.selection.collapse();
              realm.exit();
            }, {})]
        };
        var backToReadOnlyGroup = {
          label: 'Back to read only',
          scrollable: false,
          items: [$_3zi4bwz1jc7tmgwv.forToolbar('readonly-back', function () {
              setReadOnly(readOnlyGroups, mainGroups, true);
            }, {})]
        };
        var readOnlyGroup = {
          label: 'The read only mode group',
          scrollable: true,
          items: []
        };
        var features = $_7l0tfzyojc7tmgti.setup(realm, editor);
        var items = $_7l0tfzyojc7tmgti.detect(editor.settings, features);
        var actionGroup = {
          label: 'the action group',
          scrollable: true,
          items: items
        };
        var extraGroup = {
          label: 'The extra group',
          scrollable: false,
          items: []
        };
        var mainGroups = Cell([
          backToReadOnlyGroup,
          actionGroup,
          extraGroup
        ]);
        var readOnlyGroups = Cell([
          backToMaskGroup,
          readOnlyGroup,
          extraGroup
        ]);
        $_g07k5b15yjc7tmiva.init(realm, editor);
      });
      return {
        iframeContainer: realm.socket().element().dom(),
        editorContainer: realm.element().dom()
      };
    };
    return {
      getNotificationManagerImpl: function () {
        return {
          open: $_7wlbdawajc7tmgej.identity,
          close: $_7wlbdawajc7tmgej.noop,
          reposition: $_7wlbdawajc7tmgej.noop,
          getArgs: $_7wlbdawajc7tmgej.identity
        };
      },
      renderUI: renderUI
    };
  });
  var Theme = function () {
  };

  return Theme;

}());
})()
