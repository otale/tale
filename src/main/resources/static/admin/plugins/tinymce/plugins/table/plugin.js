(function () {
var table = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

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
  var $_av3vphjhjc7tmcee = {
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

  var never = $_av3vphjhjc7tmcee.never;
  var always = $_av3vphjhjc7tmcee.always;
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
      toString: $_av3vphjhjc7tmcee.constant('none()')
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
  var $_8zi7zzjgjc7tmce9 = {
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
    return r === -1 ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.some(r);
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
        return $_8zi7zzjgjc7tmce9.some(x);
      }
    }
    return $_8zi7zzjgjc7tmce9.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_8zi7zzjgjc7tmce9.some(i);
      }
    }
    return $_8zi7zzjgjc7tmce9.none();
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
    return xs.length === 0 ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.some(xs[xs.length - 1]);
  };
  var $_f8juj3jfjc7tmcdy = {
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
  var find$1 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_8zi7zzjgjc7tmce9.some(x);
      }
    }
    return $_8zi7zzjgjc7tmce9.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_dn7d6zjjjc7tmcfa = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$1,
    keys: keys,
    values: values,
    size: size
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
      $_f8juj3jfjc7tmcdy.each(fields, function (name, i) {
        struct[name] = $_av3vphjhjc7tmcee.constant(values[i]);
      });
      return struct;
    };
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
  var $_diovd6jojc7tmcg3 = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
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
    if (!$_diovd6jojc7tmcg3.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_f8juj3jfjc7tmcdy.each(array, function (a) {
      if (!$_diovd6jojc7tmcg3.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_f8juj3jfjc7tmcdy.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_cx6zprjnjc7tmcg0 = {
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
    $_cx6zprjnjc7tmcg0.validateStrArr('required', required);
    $_cx6zprjnjc7tmcg0.validateStrArr('optional', optional);
    $_cx6zprjnjc7tmcg0.checkDupes(everything);
    return function (obj) {
      var keys = $_dn7d6zjjjc7tmcfa.keys(obj);
      var allReqd = $_f8juj3jfjc7tmcdy.forall(required, function (req) {
        return $_f8juj3jfjc7tmcdy.contains(keys, req);
      });
      if (!allReqd)
        $_cx6zprjnjc7tmcg0.reqMessage(required, keys);
      var unsupported = $_f8juj3jfjc7tmcdy.filter(keys, function (key) {
        return !$_f8juj3jfjc7tmcdy.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_cx6zprjnjc7tmcg0.unsuppMessage(unsupported);
      var r = {};
      $_f8juj3jfjc7tmcdy.each(required, function (req) {
        r[req] = $_av3vphjhjc7tmcee.constant(obj[req]);
      });
      $_f8juj3jfjc7tmcdy.each(optional, function (opt) {
        r[opt] = $_av3vphjhjc7tmcee.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_8zi7zzjgjc7tmce9.some(obj[opt]) : $_8zi7zzjgjc7tmce9.none());
      });
      return r;
    };
  };

  var $_10a874jkjc7tmcfr = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var dimensions = $_10a874jkjc7tmcfr.immutable('width', 'height');
  var grid = $_10a874jkjc7tmcfr.immutable('rows', 'columns');
  var address = $_10a874jkjc7tmcfr.immutable('row', 'column');
  var coords = $_10a874jkjc7tmcfr.immutable('x', 'y');
  var detail = $_10a874jkjc7tmcfr.immutable('element', 'rowspan', 'colspan');
  var detailnew = $_10a874jkjc7tmcfr.immutable('element', 'rowspan', 'colspan', 'isNew');
  var extended = $_10a874jkjc7tmcfr.immutable('element', 'rowspan', 'colspan', 'row', 'column');
  var rowdata = $_10a874jkjc7tmcfr.immutable('element', 'cells', 'section');
  var elementnew = $_10a874jkjc7tmcfr.immutable('element', 'isNew');
  var rowdatanew = $_10a874jkjc7tmcfr.immutable('element', 'cells', 'section', 'isNew');
  var rowcells = $_10a874jkjc7tmcfr.immutable('cells', 'section');
  var rowdetails = $_10a874jkjc7tmcfr.immutable('details', 'section');
  var bounds = $_10a874jkjc7tmcfr.immutable('startRow', 'startCol', 'finishRow', 'finishCol');
  var $_5q87xujqjc7tmcgj = {
    dimensions: dimensions,
    grid: grid,
    address: address,
    coords: coords,
    extended: extended,
    detail: detail,
    detailnew: detailnew,
    rowdata: rowdata,
    elementnew: elementnew,
    rowdatanew: rowdatanew,
    rowcells: rowcells,
    rowdetails: rowdetails,
    bounds: bounds
  };

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
    return { dom: $_av3vphjhjc7tmcee.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_8zi7zzjgjc7tmce9.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_2bd3y0jujc7tmci2 = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_2e7kaxjvjc7tmci9 = {
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

  var ELEMENT = $_2e7kaxjvjc7tmci9.ELEMENT;
  var DOCUMENT = $_2e7kaxjvjc7tmci9.DOCUMENT;
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
    return bypassSelector(base) ? [] : $_f8juj3jfjc7tmcdy.map(base.querySelectorAll(selector), $_2bd3y0jujc7tmci2.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.from(base.querySelector(selector)).map($_2bd3y0jujc7tmci2.fromDom);
  };
  var $_a0jew7jtjc7tmchx = {
    all: all,
    is: is,
    one: one
  };

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
  var $_df9rkjxjc7tmcir = { toArray: toArray };

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
  var $_2azzkjk1jc7tmcjm = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_2azzkjk1jc7tmcjm.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_35qbyhk0jc7tmcji = { getOrDie: getOrDie };

  var node = function () {
    var f = $_35qbyhk0jc7tmcji.getOrDie('Node');
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
  var $_avufiwjzjc7tmcj5 = {
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
  var $_33j3apk4jc7tmcjv = { cached: cached };

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
  var $_7uq4esk7jc7tmck4 = {
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
      version: $_7uq4esk7jc7tmck4.unknown()
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
  var $_5ole4dk6jc7tmcjz = {
    unknown: unknown,
    nu: nu,
    edge: $_av3vphjhjc7tmcee.constant(edge),
    chrome: $_av3vphjhjc7tmcee.constant(chrome),
    ie: $_av3vphjhjc7tmcee.constant(ie),
    opera: $_av3vphjhjc7tmcee.constant(opera),
    firefox: $_av3vphjhjc7tmcee.constant(firefox),
    safari: $_av3vphjhjc7tmcee.constant(safari)
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
      version: $_7uq4esk7jc7tmck4.unknown()
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
  var $_33p56qk8jc7tmck7 = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_av3vphjhjc7tmcee.constant(windows),
    ios: $_av3vphjhjc7tmcee.constant(ios),
    android: $_av3vphjhjc7tmcee.constant(android),
    linux: $_av3vphjhjc7tmcee.constant(linux),
    osx: $_av3vphjhjc7tmcee.constant(osx),
    solaris: $_av3vphjhjc7tmcee.constant(solaris),
    freebsd: $_av3vphjhjc7tmcee.constant(freebsd)
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
      isiPad: $_av3vphjhjc7tmcee.constant(isiPad),
      isiPhone: $_av3vphjhjc7tmcee.constant(isiPhone),
      isTablet: $_av3vphjhjc7tmcee.constant(isTablet),
      isPhone: $_av3vphjhjc7tmcee.constant(isPhone),
      isTouch: $_av3vphjhjc7tmcee.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_av3vphjhjc7tmcee.constant(iOSwebview)
    };
  };

  var detect$3 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_f8juj3jfjc7tmcdy.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$3(browsers, userAgent).map(function (browser) {
      var version = $_7uq4esk7jc7tmck4.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$3(oses, userAgent).map(function (os) {
      var version = $_7uq4esk7jc7tmck4.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_t2wi7kajc7tmcke = {
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
  var $_fdo32zkdjc7tmcks = {
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
    return str === '' ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_8zi7zzjgjc7tmce9.none() : $_8zi7zzjgjc7tmce9.some(str.substring(1));
  };
  var $_22v83pkejc7tmcku = {
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
    return startsWith(str, prefix) ? $_fdo32zkdjc7tmcks.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_fdo32zkdjc7tmcks.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_fdo32zkdjc7tmcks.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_fdo32zkdjc7tmcks.addToEnd(str, prefix);
  };
  var contains$2 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_22v83pkejc7tmcku.head(str).bind(function (head) {
      return $_22v83pkejc7tmcku.tail(str).map(function (tail) {
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
  var $_26r8vikcjc7tmckq = {
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
      return $_26r8vikcjc7tmckq.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_26r8vikcjc7tmckq.contains(uastring, 'edge/') && $_26r8vikcjc7tmckq.contains(uastring, 'chrome') && $_26r8vikcjc7tmckq.contains(uastring, 'safari') && $_26r8vikcjc7tmckq.contains(uastring, 'applewebkit');
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
        return $_26r8vikcjc7tmckq.contains(uastring, 'chrome') && !$_26r8vikcjc7tmckq.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_26r8vikcjc7tmckq.contains(uastring, 'msie') || $_26r8vikcjc7tmckq.contains(uastring, 'trident');
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
        return ($_26r8vikcjc7tmckq.contains(uastring, 'safari') || $_26r8vikcjc7tmckq.contains(uastring, 'mobile/')) && $_26r8vikcjc7tmckq.contains(uastring, 'applewebkit');
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
        return $_26r8vikcjc7tmckq.contains(uastring, 'iphone') || $_26r8vikcjc7tmckq.contains(uastring, 'ipad');
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
  var $_4gw7cfkbjc7tmcki = {
    browsers: $_av3vphjhjc7tmcee.constant(browsers),
    oses: $_av3vphjhjc7tmcee.constant(oses)
  };

  var detect$1 = function (userAgent) {
    var browsers = $_4gw7cfkbjc7tmcki.browsers();
    var oses = $_4gw7cfkbjc7tmcki.oses();
    var browser = $_t2wi7kajc7tmcke.detectBrowser(browsers, userAgent).fold($_5ole4dk6jc7tmcjz.unknown, $_5ole4dk6jc7tmcjz.nu);
    var os = $_t2wi7kajc7tmcke.detectOs(oses, userAgent).fold($_33p56qk8jc7tmck7.unknown, $_33p56qk8jc7tmck7.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_6fk52kk5jc7tmcjx = { detect: detect$1 };

  var detect = $_33j3apk4jc7tmcjv.cached(function () {
    var userAgent = navigator.userAgent;
    return $_6fk52kk5jc7tmcjx.detect(userAgent);
  });
  var $_enuqxfk3jc7tmcjq = { detect: detect };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_f8juj3jfjc7tmcdy.exists(elements, $_av3vphjhjc7tmcee.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_avufiwjzjc7tmcj5.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_enuqxfk3jc7tmcjq.detect().browser;
  var contains$1 = browser.isIE() ? ieContains : regularContains;
  var $_4co3lyjyjc7tmciu = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains$1,
    is: $_a0jew7jtjc7tmchx.is
  };

  var owner = function (element) {
    return $_2bd3y0jujc7tmci2.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_2bd3y0jujc7tmci2.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_2bd3y0jujc7tmci2.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_8zi7zzjgjc7tmce9.from(dom.parentNode).map($_2bd3y0jujc7tmci2.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_f8juj3jfjc7tmcdy.findIndex(kin, function (elem) {
        return $_4co3lyjyjc7tmciu.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_diovd6jojc7tmcg3.isFunction(isRoot) ? isRoot : $_av3vphjhjc7tmcee.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_2bd3y0jujc7tmci2.fromDom(rawParent);
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
      return $_f8juj3jfjc7tmcdy.filter(elements, function (x) {
        return !$_4co3lyjyjc7tmciu.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_8zi7zzjgjc7tmce9.from(dom.offsetParent).map($_2bd3y0jujc7tmci2.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_8zi7zzjgjc7tmce9.from(dom.previousSibling).map($_2bd3y0jujc7tmci2.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_8zi7zzjgjc7tmce9.from(dom.nextSibling).map($_2bd3y0jujc7tmci2.fromDom);
  };
  var prevSiblings = function (element) {
    return $_f8juj3jfjc7tmcdy.reverse($_df9rkjxjc7tmcir.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_df9rkjxjc7tmcir.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_f8juj3jfjc7tmcdy.map(dom.childNodes, $_2bd3y0jujc7tmci2.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_8zi7zzjgjc7tmce9.from(children[index]).map($_2bd3y0jujc7tmci2.fromDom);
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
  var spot = $_10a874jkjc7tmcfr.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_66uz4xjwjc7tmcib = {
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

  var firstLayer = function (scope, selector) {
    return filterFirstLayer(scope, selector, $_av3vphjhjc7tmcee.constant(true));
  };
  var filterFirstLayer = function (scope, selector, predicate) {
    return $_f8juj3jfjc7tmcdy.bind($_66uz4xjwjc7tmcib.children(scope), function (x) {
      return $_a0jew7jtjc7tmchx.is(x, selector) ? predicate(x) ? [x] : [] : filterFirstLayer(x, selector, predicate);
    });
  };
  var $_dot4onjsjc7tmchm = {
    firstLayer: firstLayer,
    filterFirstLayer: filterFirstLayer
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
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_2e7kaxjvjc7tmci9.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_2e7kaxjvjc7tmci9.ELEMENT);
  var isText = isType$1($_2e7kaxjvjc7tmci9.TEXT);
  var isDocument = isType$1($_2e7kaxjvjc7tmci9.DOCUMENT);
  var $_fxq8yvkgjc7tmcl4 = {
    name: name,
    type: type,
    value: value,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_diovd6jojc7tmcg3.isString(value) || $_diovd6jojc7tmcg3.isBoolean(value) || $_diovd6jojc7tmcg3.isNumber(value)) {
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
    $_dn7d6zjjjc7tmcfa.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has = function (element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove = function (element, key) {
    element.dom().removeAttribute(key);
  };
  var hasNone = function (element) {
    var attrs = element.dom().attributes;
    return attrs === undefined || attrs === null || attrs.length === 0;
  };
  var clone = function (element) {
    return $_f8juj3jfjc7tmcdy.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has(source, attr) && !has(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_fxq8yvkgjc7tmcl4.isElement(source) || !$_fxq8yvkgjc7tmcl4.isElement(destination))
      return;
    $_f8juj3jfjc7tmcdy.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_9o3gmekfjc7tmckw = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has,
    remove: remove,
    hasNone: hasNone,
    transfer: transfer
  };

  var inBody = function (element) {
    var dom = $_fxq8yvkgjc7tmcl4.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_33j3apk4jc7tmcjv.cached(function () {
    return getBody($_2bd3y0jujc7tmci2.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_2bd3y0jujc7tmci2.fromDom(body);
  };
  var $_84qvvkjjc7tmclf = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var all$2 = function (predicate) {
    return descendants$1($_84qvvkjjc7tmclf.body(), predicate);
  };
  var ancestors$1 = function (scope, predicate, isRoot) {
    return $_f8juj3jfjc7tmcdy.filter($_66uz4xjwjc7tmcib.parents(scope, isRoot), predicate);
  };
  var siblings$2 = function (scope, predicate) {
    return $_f8juj3jfjc7tmcdy.filter($_66uz4xjwjc7tmcib.siblings(scope), predicate);
  };
  var children$2 = function (scope, predicate) {
    return $_f8juj3jfjc7tmcdy.filter($_66uz4xjwjc7tmcib.children(scope), predicate);
  };
  var descendants$1 = function (scope, predicate) {
    var result = [];
    $_f8juj3jfjc7tmcdy.each($_66uz4xjwjc7tmcib.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants$1(x, predicate));
    });
    return result;
  };
  var $_ix074kijc7tmcla = {
    all: all$2,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  var all$1 = function (selector) {
    return $_a0jew7jtjc7tmchx.all(selector);
  };
  var ancestors = function (scope, selector, isRoot) {
    return $_ix074kijc7tmcla.ancestors(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    }, isRoot);
  };
  var siblings$1 = function (scope, selector) {
    return $_ix074kijc7tmcla.siblings(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    });
  };
  var children$1 = function (scope, selector) {
    return $_ix074kijc7tmcla.children(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    });
  };
  var descendants = function (scope, selector) {
    return $_a0jew7jtjc7tmchx.all(selector, scope);
  };
  var $_7y6210khjc7tmcl8 = {
    all: all$1,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var ClosestOrAncestor = function (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_8zi7zzjgjc7tmce9.some(scope) : $_diovd6jojc7tmcg3.isFunction(isRoot) && isRoot(scope) ? $_8zi7zzjgjc7tmce9.none() : ancestor(scope, a, isRoot);
  };

  var first$2 = function (predicate) {
    return descendant$1($_84qvvkjjc7tmclf.body(), predicate);
  };
  var ancestor$1 = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_diovd6jojc7tmcg3.isFunction(isRoot) ? isRoot : $_av3vphjhjc7tmcee.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_2bd3y0jujc7tmci2.fromDom(element);
      if (predicate(el))
        return $_8zi7zzjgjc7tmce9.some(el);
      else if (stop(el))
        break;
    }
    return $_8zi7zzjgjc7tmce9.none();
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
      return $_8zi7zzjgjc7tmce9.none();
    return child$2($_2bd3y0jujc7tmci2.fromDom(element.parentNode), function (x) {
      return !$_4co3lyjyjc7tmciu.eq(scope, x) && predicate(x);
    });
  };
  var child$2 = function (scope, predicate) {
    var result = $_f8juj3jfjc7tmcdy.find(scope.dom().childNodes, $_av3vphjhjc7tmcee.compose(predicate, $_2bd3y0jujc7tmci2.fromDom));
    return result.map($_2bd3y0jujc7tmci2.fromDom);
  };
  var descendant$1 = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_2bd3y0jujc7tmci2.fromDom(element.childNodes[i])))
          return $_8zi7zzjgjc7tmce9.some($_2bd3y0jujc7tmci2.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_8zi7zzjgjc7tmce9.none();
    };
    return descend(scope.dom());
  };
  var $_39ujfjkljc7tmclp = {
    first: first$2,
    ancestor: ancestor$1,
    closest: closest$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1
  };

  var first$1 = function (selector) {
    return $_a0jew7jtjc7tmchx.one(selector);
  };
  var ancestor = function (scope, selector, isRoot) {
    return $_39ujfjkljc7tmclp.ancestor(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    }, isRoot);
  };
  var sibling = function (scope, selector) {
    return $_39ujfjkljc7tmclp.sibling(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    });
  };
  var child$1 = function (scope, selector) {
    return $_39ujfjkljc7tmclp.child(scope, function (e) {
      return $_a0jew7jtjc7tmchx.is(e, selector);
    });
  };
  var descendant = function (scope, selector) {
    return $_a0jew7jtjc7tmchx.one(selector, scope);
  };
  var closest = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_a0jew7jtjc7tmchx.is, ancestor, scope, selector, isRoot);
  };
  var $_ft53o4kkjc7tmcln = {
    first: first$1,
    ancestor: ancestor,
    sibling: sibling,
    child: child$1,
    descendant: descendant,
    closest: closest
  };

  var lookup = function (tags, element, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_av3vphjhjc7tmcee.constant(false);
    if (isRoot(element))
      return $_8zi7zzjgjc7tmce9.none();
    if ($_f8juj3jfjc7tmcdy.contains(tags, $_fxq8yvkgjc7tmcl4.name(element)))
      return $_8zi7zzjgjc7tmce9.some(element);
    var isRootOrUpperTable = function (element) {
      return $_a0jew7jtjc7tmchx.is(element, 'table') || isRoot(element);
    };
    return $_ft53o4kkjc7tmcln.ancestor(element, tags.join(','), isRootOrUpperTable);
  };
  var cell = function (element, isRoot) {
    return lookup([
      'td',
      'th'
    ], element, isRoot);
  };
  var cells = function (ancestor) {
    return $_dot4onjsjc7tmchm.firstLayer(ancestor, 'th,td');
  };
  var notCell = function (element, isRoot) {
    return lookup([
      'caption',
      'tr',
      'tbody',
      'tfoot',
      'thead'
    ], element, isRoot);
  };
  var neighbours = function (selector, element) {
    return $_66uz4xjwjc7tmcib.parent(element).map(function (parent) {
      return $_7y6210khjc7tmcl8.children(parent, selector);
    });
  };
  var neighbourCells = $_av3vphjhjc7tmcee.curry(neighbours, 'th,td');
  var neighbourRows = $_av3vphjhjc7tmcee.curry(neighbours, 'tr');
  var firstCell = function (ancestor) {
    return $_ft53o4kkjc7tmcln.descendant(ancestor, 'th,td');
  };
  var table = function (element, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(element, 'table', isRoot);
  };
  var row = function (element, isRoot) {
    return lookup(['tr'], element, isRoot);
  };
  var rows = function (ancestor) {
    return $_dot4onjsjc7tmchm.firstLayer(ancestor, 'tr');
  };
  var attr = function (element, property) {
    return parseInt($_9o3gmekfjc7tmckw.get(element, property), 10);
  };
  var grid$1 = function (element, rowProp, colProp) {
    var rows = attr(element, rowProp);
    var cols = attr(element, colProp);
    return $_5q87xujqjc7tmcgj.grid(rows, cols);
  };
  var $_dvsb29jrjc7tmcgo = {
    cell: cell,
    firstCell: firstCell,
    cells: cells,
    neighbourCells: neighbourCells,
    table: table,
    row: row,
    rows: rows,
    notCell: notCell,
    neighbourRows: neighbourRows,
    attr: attr,
    grid: grid$1
  };

  var fromTable = function (table) {
    var rows = $_dvsb29jrjc7tmcgo.rows(table);
    return $_f8juj3jfjc7tmcdy.map(rows, function (row) {
      var element = row;
      var parent = $_66uz4xjwjc7tmcib.parent(element);
      var parentSection = parent.bind(function (parent) {
        var parentName = $_fxq8yvkgjc7tmcl4.name(parent);
        return parentName === 'tfoot' || parentName === 'thead' || parentName === 'tbody' ? parentName : 'tbody';
      });
      var cells = $_f8juj3jfjc7tmcdy.map($_dvsb29jrjc7tmcgo.cells(row), function (cell) {
        var rowspan = $_9o3gmekfjc7tmckw.has(cell, 'rowspan') ? parseInt($_9o3gmekfjc7tmckw.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_9o3gmekfjc7tmckw.has(cell, 'colspan') ? parseInt($_9o3gmekfjc7tmckw.get(cell, 'colspan'), 10) : 1;
        return $_5q87xujqjc7tmcgj.detail(cell, rowspan, colspan);
      });
      return $_5q87xujqjc7tmcgj.rowdata(element, cells, parentSection);
    });
  };
  var fromPastedRows = function (rows, example) {
    return $_f8juj3jfjc7tmcdy.map(rows, function (row) {
      var cells = $_f8juj3jfjc7tmcdy.map($_dvsb29jrjc7tmcgo.cells(row), function (cell) {
        var rowspan = $_9o3gmekfjc7tmckw.has(cell, 'rowspan') ? parseInt($_9o3gmekfjc7tmckw.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_9o3gmekfjc7tmckw.has(cell, 'colspan') ? parseInt($_9o3gmekfjc7tmckw.get(cell, 'colspan'), 10) : 1;
        return $_5q87xujqjc7tmcgj.detail(cell, rowspan, colspan);
      });
      return $_5q87xujqjc7tmcgj.rowdata(row, cells, example.section());
    });
  };
  var $_2baam5jpjc7tmcg8 = {
    fromTable: fromTable,
    fromPastedRows: fromPastedRows
  };

  var key = function (row, column) {
    return row + ',' + column;
  };
  var getAt = function (warehouse, row, column) {
    var raw = warehouse.access()[key(row, column)];
    return raw !== undefined ? $_8zi7zzjgjc7tmce9.some(raw) : $_8zi7zzjgjc7tmce9.none();
  };
  var findItem = function (warehouse, item, comparator) {
    var filtered = filterItems(warehouse, function (detail) {
      return comparator(item, detail.element());
    });
    return filtered.length > 0 ? $_8zi7zzjgjc7tmce9.some(filtered[0]) : $_8zi7zzjgjc7tmce9.none();
  };
  var filterItems = function (warehouse, predicate) {
    var all = $_f8juj3jfjc7tmcdy.bind(warehouse.all(), function (r) {
      return r.cells();
    });
    return $_f8juj3jfjc7tmcdy.filter(all, predicate);
  };
  var generate = function (list) {
    var access = {};
    var cells = [];
    var maxRows = list.length;
    var maxColumns = 0;
    $_f8juj3jfjc7tmcdy.each(list, function (details, r) {
      var currentRow = [];
      $_f8juj3jfjc7tmcdy.each(details.cells(), function (detail, c) {
        var start = 0;
        while (access[key(r, start)] !== undefined) {
          start++;
        }
        var current = $_5q87xujqjc7tmcgj.extended(detail.element(), detail.rowspan(), detail.colspan(), r, start);
        for (var i = 0; i < detail.colspan(); i++) {
          for (var j = 0; j < detail.rowspan(); j++) {
            var cr = r + j;
            var cc = start + i;
            var newpos = key(cr, cc);
            access[newpos] = current;
            maxColumns = Math.max(maxColumns, cc + 1);
          }
        }
        currentRow.push(current);
      });
      cells.push($_5q87xujqjc7tmcgj.rowdata(details.element(), currentRow, details.section()));
    });
    var grid = $_5q87xujqjc7tmcgj.grid(maxRows, maxColumns);
    return {
      grid: $_av3vphjhjc7tmcee.constant(grid),
      access: $_av3vphjhjc7tmcee.constant(access),
      all: $_av3vphjhjc7tmcee.constant(cells)
    };
  };
  var justCells = function (warehouse) {
    var rows = $_f8juj3jfjc7tmcdy.map(warehouse.all(), function (w) {
      return w.cells();
    });
    return $_f8juj3jfjc7tmcdy.flatten(rows);
  };
  var $_erfiqhknjc7tmcm8 = {
    generate: generate,
    getAt: getAt,
    findItem: findItem,
    filterItems: filterItems,
    justCells: justCells
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_g96oywkpjc7tmcn7 = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_diovd6jojc7tmcg3.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_g96oywkpjc7tmcn7.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_g96oywkpjc7tmcn7.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$1 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_dn7d6zjjjc7tmcfa.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_dn7d6zjjjc7tmcfa.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$1 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_84qvvkjjc7tmclf.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_g96oywkpjc7tmcn7.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_8zi7zzjgjc7tmce9.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_g96oywkpjc7tmcn7.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_2bd3y0jujc7tmci2.fromTag(tag);
    set$1(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$1 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_9o3gmekfjc7tmckw.has(element, 'style') && $_26r8vikcjc7tmckq.trim($_9o3gmekfjc7tmckw.get(element, 'style')) === '') {
      $_9o3gmekfjc7tmckw.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_9o3gmekfjc7tmckw.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_9o3gmekfjc7tmckw.remove : $_9o3gmekfjc7tmckw.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_g96oywkpjc7tmcn7.isSupported(sourceDom) && $_g96oywkpjc7tmcn7.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$1(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_fxq8yvkgjc7tmcl4.isElement(source) || !$_fxq8yvkgjc7tmcl4.isElement(destination))
      return;
    $_f8juj3jfjc7tmcdy.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_fsmkrhkojc7tmcmj = {
    copy: copy,
    set: set$1,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$1,
    get: get$1,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  var before = function (marker, element) {
    var parent = $_66uz4xjwjc7tmcib.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_66uz4xjwjc7tmcib.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_66uz4xjwjc7tmcib.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_66uz4xjwjc7tmcib.firstChild(parent);
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
    $_66uz4xjwjc7tmcib.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_bayouwkqjc7tmcn9 = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap
  };

  var before$1 = function (marker, elements) {
    $_f8juj3jfjc7tmcdy.each(elements, function (x) {
      $_bayouwkqjc7tmcn9.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_f8juj3jfjc7tmcdy.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_bayouwkqjc7tmcn9.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_f8juj3jfjc7tmcdy.each(elements.slice().reverse(), function (x) {
      $_bayouwkqjc7tmcn9.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_f8juj3jfjc7tmcdy.each(elements, function (x) {
      $_bayouwkqjc7tmcn9.append(parent, x);
    });
  };
  var $_bl9vkjksjc7tmcnj = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_f8juj3jfjc7tmcdy.each($_66uz4xjwjc7tmcib.children(element), function (rogue) {
      remove$2(rogue);
    });
  };
  var remove$2 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_66uz4xjwjc7tmcib.children(wrapper);
    if (children.length > 0)
      $_bl9vkjksjc7tmcnj.before(wrapper, children);
    remove$2(wrapper);
  };
  var $_t0op8krjc7tmcnd = {
    empty: empty,
    remove: remove$2,
    unwrap: unwrap
  };

  var stats = $_10a874jkjc7tmcfr.immutable('minRow', 'minCol', 'maxRow', 'maxCol');
  var findSelectedStats = function (house, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    var minRow = totalRows;
    var minCol = totalColumns;
    var maxRow = 0;
    var maxCol = 0;
    $_dn7d6zjjjc7tmcfa.each(house.access(), function (detail) {
      if (isSelected(detail)) {
        var startRow = detail.row();
        var endRow = startRow + detail.rowspan() - 1;
        var startCol = detail.column();
        var endCol = startCol + detail.colspan() - 1;
        if (startRow < minRow)
          minRow = startRow;
        else if (endRow > maxRow)
          maxRow = endRow;
        if (startCol < minCol)
          minCol = startCol;
        else if (endCol > maxCol)
          maxCol = endCol;
      }
    });
    return stats(minRow, minCol, maxRow, maxCol);
  };
  var makeCell = function (list, seenSelected, rowIndex) {
    var row = list[rowIndex].element();
    var td = $_2bd3y0jujc7tmci2.fromTag('td');
    $_bayouwkqjc7tmcn9.append(td, $_2bd3y0jujc7tmci2.fromTag('br'));
    var f = seenSelected ? $_bayouwkqjc7tmcn9.append : $_bayouwkqjc7tmcn9.prepend;
    f(row, td);
  };
  var fillInGaps = function (list, house, stats, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    for (var i = 0; i < totalRows; i++) {
      var seenSelected = false;
      for (var j = 0; j < totalColumns; j++) {
        if (!(i < stats.minRow() || i > stats.maxRow() || j < stats.minCol() || j > stats.maxCol())) {
          var needCell = $_erfiqhknjc7tmcm8.getAt(house, i, j).filter(isSelected).isNone();
          if (needCell)
            makeCell(list, seenSelected, i);
          else
            seenSelected = true;
        }
      }
    }
  };
  var clean = function (table, stats) {
    var emptyRows = $_f8juj3jfjc7tmcdy.filter($_dot4onjsjc7tmchm.firstLayer(table, 'tr'), function (row) {
      return row.dom().childElementCount === 0;
    });
    $_f8juj3jfjc7tmcdy.each(emptyRows, $_t0op8krjc7tmcnd.remove);
    if (stats.minCol() === stats.maxCol() || stats.minRow() === stats.maxRow()) {
      $_f8juj3jfjc7tmcdy.each($_dot4onjsjc7tmchm.firstLayer(table, 'th,td'), function (cell) {
        $_9o3gmekfjc7tmckw.remove(cell, 'rowspan');
        $_9o3gmekfjc7tmckw.remove(cell, 'colspan');
      });
    }
    $_9o3gmekfjc7tmckw.remove(table, 'width');
    $_9o3gmekfjc7tmckw.remove(table, 'height');
    $_fsmkrhkojc7tmcmj.remove(table, 'width');
    $_fsmkrhkojc7tmcmj.remove(table, 'height');
  };
  var extract = function (table, selectedSelector) {
    var isSelected = function (detail) {
      return $_a0jew7jtjc7tmchx.is(detail.element(), selectedSelector);
    };
    var list = $_2baam5jpjc7tmcg8.fromTable(table);
    var house = $_erfiqhknjc7tmcm8.generate(list);
    var stats = findSelectedStats(house, isSelected);
    var selector = 'th:not(' + selectedSelector + ')' + ',td:not(' + selectedSelector + ')';
    var unselectedCells = $_dot4onjsjc7tmchm.filterFirstLayer(table, 'th,td', function (cell) {
      return $_a0jew7jtjc7tmchx.is(cell, selector);
    });
    $_f8juj3jfjc7tmcdy.each(unselectedCells, $_t0op8krjc7tmcnd.remove);
    fillInGaps(list, house, stats, isSelected);
    clean(table, stats);
    return table;
  };
  var $_c12ih7jijc7tmcel = { extract: extract };

  var clone$1 = function (original, deep) {
    return $_2bd3y0jujc7tmci2.fromDom(original.dom().cloneNode(deep));
  };
  var shallow = function (original) {
    return clone$1(original, false);
  };
  var deep = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_2bd3y0jujc7tmci2.fromTag(tag);
    var attributes = $_9o3gmekfjc7tmckw.clone(original);
    $_9o3gmekfjc7tmckw.setAll(nu, attributes);
    return nu;
  };
  var copy$1 = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_66uz4xjwjc7tmcib.children(deep(original));
    $_bl9vkjksjc7tmcnj.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_bayouwkqjc7tmcn9.before(original, nu);
    var children = $_66uz4xjwjc7tmcib.children(original);
    $_bl9vkjksjc7tmcnj.append(nu, children);
    $_t0op8krjc7tmcnd.remove(original);
    return nu;
  };
  var $_3eftumkujc7tmcok = {
    shallow: shallow,
    shallowAs: shallowAs,
    deep: deep,
    copy: copy$1,
    mutate: mutate
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
        return $_8zi7zzjgjc7tmce9.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_8zi7zzjgjc7tmce9.from(element.dom().nodeValue) : $_8zi7zzjgjc7tmce9.none();
    };
    var browser = $_enuqxfk3jc7tmcjq.detect().browser;
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

  var api = NodeValue($_fxq8yvkgjc7tmcl4.isText, 'text');
  var get$2 = function (element) {
    return api.get(element);
  };
  var getOption = function (element) {
    return api.getOption(element);
  };
  var set$2 = function (element, value) {
    api.set(element, value);
  };
  var $_asu5ztkxjc7tmcp2 = {
    get: get$2,
    getOption: getOption,
    set: set$2
  };

  var getEnd = function (element) {
    return $_fxq8yvkgjc7tmcl4.name(element) === 'img' ? 1 : $_asu5ztkxjc7tmcp2.getOption(element).fold(function () {
      return $_66uz4xjwjc7tmcib.children(element).length;
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
    return $_asu5ztkxjc7tmcp2.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_f8juj3jfjc7tmcdy.contains(elementsWithCursorPosition, $_fxq8yvkgjc7tmcl4.name(elem));
  };
  var $_bairf4kwjc7tmcow = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var first$3 = function (element) {
    return $_39ujfjkljc7tmclp.descendant(element, $_bairf4kwjc7tmcow.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_bairf4kwjc7tmcow.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_66uz4xjwjc7tmcib.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return $_8zi7zzjgjc7tmce9.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return $_8zi7zzjgjc7tmce9.none();
    };
    return descend(scope);
  };
  var $_1c60c4kvjc7tmcoq = {
    first: first$3,
    last: last$2
  };

  var cell$1 = function () {
    var td = $_2bd3y0jujc7tmci2.fromTag('td');
    $_bayouwkqjc7tmcn9.append(td, $_2bd3y0jujc7tmci2.fromTag('br'));
    return td;
  };
  var replace = function (cell, tag, attrs) {
    var replica = $_3eftumkujc7tmcok.copy(cell, tag);
    $_dn7d6zjjjc7tmcfa.each(attrs, function (v, k) {
      if (v === null)
        $_9o3gmekfjc7tmckw.remove(replica, k);
      else
        $_9o3gmekfjc7tmckw.set(replica, k, v);
    });
    return replica;
  };
  var pasteReplace = function (cellContent) {
    return cellContent;
  };
  var newRow = function (doc) {
    return function () {
      return $_2bd3y0jujc7tmci2.fromTag('tr', doc.dom());
    };
  };
  var cloneFormats = function (oldCell, newCell, formats) {
    var first = $_1c60c4kvjc7tmcoq.first(oldCell);
    return first.map(function (firstText) {
      var formatSelector = formats.join(',');
      var parents = $_7y6210khjc7tmcl8.ancestors(firstText, formatSelector, function (element) {
        return $_4co3lyjyjc7tmciu.eq(element, oldCell);
      });
      return $_f8juj3jfjc7tmcdy.foldr(parents, function (last, parent) {
        var clonedFormat = $_3eftumkujc7tmcok.shallow(parent);
        $_bayouwkqjc7tmcn9.append(last, clonedFormat);
        return clonedFormat;
      }, newCell);
    }).getOr(newCell);
  };
  var cellOperations = function (mutate, doc, formatsToClone) {
    var newCell = function (prev) {
      var doc = $_66uz4xjwjc7tmcib.owner(prev.element());
      var td = $_2bd3y0jujc7tmci2.fromTag($_fxq8yvkgjc7tmcl4.name(prev.element()), doc.dom());
      var formats = formatsToClone.getOr([
        'strong',
        'em',
        'b',
        'i',
        'span',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'div'
      ]);
      var lastNode = formats.length > 0 ? cloneFormats(prev.element(), td, formats) : td;
      $_bayouwkqjc7tmcn9.append(lastNode, $_2bd3y0jujc7tmci2.fromTag('br'));
      $_fsmkrhkojc7tmcmj.copy(prev.element(), td);
      $_fsmkrhkojc7tmcmj.remove(td, 'height');
      if (prev.colspan() !== 1)
        $_fsmkrhkojc7tmcmj.remove(prev.element(), 'width');
      mutate(prev.element(), td);
      return td;
    };
    return {
      row: newRow(doc),
      cell: newCell,
      replace: replace,
      gap: cell$1
    };
  };
  var paste = function (doc) {
    return {
      row: newRow(doc),
      cell: cell$1,
      replace: pasteReplace,
      gap: cell$1
    };
  };
  var $_czudfqktjc7tmcnp = {
    cellOperations: cellOperations,
    paste: paste
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_66uz4xjwjc7tmcib.children($_2bd3y0jujc7tmci2.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_f8juj3jfjc7tmcdy.map(tags, function (x) {
      return $_2bd3y0jujc7tmci2.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_f8juj3jfjc7tmcdy.map(texts, function (x) {
      return $_2bd3y0jujc7tmci2.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_f8juj3jfjc7tmcdy.map(nodes, $_2bd3y0jujc7tmci2.fromDom);
  };
  var $_7zxda8kzjc7tmcpg = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var TagBoundaries = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'li',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];

  var DomUniverse = function () {
    var clone = function (element) {
      return $_2bd3y0jujc7tmci2.fromDom(element.dom().cloneNode(false));
    };
    var isBoundary = function (element) {
      if (!$_fxq8yvkgjc7tmcl4.isElement(element))
        return false;
      if ($_fxq8yvkgjc7tmcl4.name(element) === 'body')
        return true;
      return $_f8juj3jfjc7tmcdy.contains(TagBoundaries, $_fxq8yvkgjc7tmcl4.name(element));
    };
    var isEmptyTag = function (element) {
      if (!$_fxq8yvkgjc7tmcl4.isElement(element))
        return false;
      return $_f8juj3jfjc7tmcdy.contains([
        'br',
        'img',
        'hr',
        'input'
      ], $_fxq8yvkgjc7tmcl4.name(element));
    };
    var comparePosition = function (element, other) {
      return element.dom().compareDocumentPosition(other.dom());
    };
    var copyAttributesTo = function (source, destination) {
      var as = $_9o3gmekfjc7tmckw.clone(source);
      $_9o3gmekfjc7tmckw.setAll(destination, as);
    };
    return {
      up: $_av3vphjhjc7tmcee.constant({
        selector: $_ft53o4kkjc7tmcln.ancestor,
        closest: $_ft53o4kkjc7tmcln.closest,
        predicate: $_39ujfjkljc7tmclp.ancestor,
        all: $_66uz4xjwjc7tmcib.parents
      }),
      down: $_av3vphjhjc7tmcee.constant({
        selector: $_7y6210khjc7tmcl8.descendants,
        predicate: $_ix074kijc7tmcla.descendants
      }),
      styles: $_av3vphjhjc7tmcee.constant({
        get: $_fsmkrhkojc7tmcmj.get,
        getRaw: $_fsmkrhkojc7tmcmj.getRaw,
        set: $_fsmkrhkojc7tmcmj.set,
        remove: $_fsmkrhkojc7tmcmj.remove
      }),
      attrs: $_av3vphjhjc7tmcee.constant({
        get: $_9o3gmekfjc7tmckw.get,
        set: $_9o3gmekfjc7tmckw.set,
        remove: $_9o3gmekfjc7tmckw.remove,
        copyTo: copyAttributesTo
      }),
      insert: $_av3vphjhjc7tmcee.constant({
        before: $_bayouwkqjc7tmcn9.before,
        after: $_bayouwkqjc7tmcn9.after,
        afterAll: $_bl9vkjksjc7tmcnj.after,
        append: $_bayouwkqjc7tmcn9.append,
        appendAll: $_bl9vkjksjc7tmcnj.append,
        prepend: $_bayouwkqjc7tmcn9.prepend,
        wrap: $_bayouwkqjc7tmcn9.wrap
      }),
      remove: $_av3vphjhjc7tmcee.constant({
        unwrap: $_t0op8krjc7tmcnd.unwrap,
        remove: $_t0op8krjc7tmcnd.remove
      }),
      create: $_av3vphjhjc7tmcee.constant({
        nu: $_2bd3y0jujc7tmci2.fromTag,
        clone: clone,
        text: $_2bd3y0jujc7tmci2.fromText
      }),
      query: $_av3vphjhjc7tmcee.constant({
        comparePosition: comparePosition,
        prevSibling: $_66uz4xjwjc7tmcib.prevSibling,
        nextSibling: $_66uz4xjwjc7tmcib.nextSibling
      }),
      property: $_av3vphjhjc7tmcee.constant({
        children: $_66uz4xjwjc7tmcib.children,
        name: $_fxq8yvkgjc7tmcl4.name,
        parent: $_66uz4xjwjc7tmcib.parent,
        isText: $_fxq8yvkgjc7tmcl4.isText,
        isComment: $_fxq8yvkgjc7tmcl4.isComment,
        isElement: $_fxq8yvkgjc7tmcl4.isElement,
        getText: $_asu5ztkxjc7tmcp2.get,
        setText: $_asu5ztkxjc7tmcp2.set,
        isBoundary: isBoundary,
        isEmptyTag: isEmptyTag
      }),
      eq: $_4co3lyjyjc7tmciu.eq,
      is: $_4co3lyjyjc7tmciu.is
    };
  };

  var leftRight = $_10a874jkjc7tmcfr.immutable('left', 'right');
  var bisect = function (universe, parent, child) {
    var children = universe.property().children(parent);
    var index = $_f8juj3jfjc7tmcdy.findIndex(children, $_av3vphjhjc7tmcee.curry(universe.eq, child));
    return index.map(function (ind) {
      return {
        before: $_av3vphjhjc7tmcee.constant(children.slice(0, ind)),
        after: $_av3vphjhjc7tmcee.constant(children.slice(ind + 1))
      };
    });
  };
  var breakToRight$2 = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var second = universe.create().clone(parent);
      universe.insert().appendAll(second, parts.after());
      universe.insert().after(parent, second);
      return leftRight(parent, second);
    });
  };
  var breakToLeft$2 = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var prior = universe.create().clone(parent);
      universe.insert().appendAll(prior, parts.before().concat([child]));
      universe.insert().appendAll(parent, parts.after());
      universe.insert().before(parent, prior);
      return leftRight(prior, parent);
    });
  };
  var breakPath$2 = function (universe, item, isTop, breaker) {
    var result = $_10a874jkjc7tmcfr.immutable('first', 'second', 'splits');
    var next = function (child, group, splits) {
      var fallback = result(child, $_8zi7zzjgjc7tmce9.none(), splits);
      if (isTop(child))
        return result(child, group, splits);
      else {
        return universe.property().parent(child).bind(function (parent) {
          return breaker(universe, parent, child).map(function (breakage) {
            var extra = [{
                first: breakage.left,
                second: breakage.right
              }];
            var nextChild = isTop(parent) ? parent : breakage.left();
            return next(nextChild, $_8zi7zzjgjc7tmce9.some(breakage.right()), splits.concat(extra));
          }).getOr(fallback);
        });
      }
    };
    return next(item, $_8zi7zzjgjc7tmce9.none(), []);
  };
  var $_74axlfl8jc7tmcsl = {
    breakToLeft: breakToLeft$2,
    breakToRight: breakToRight$2,
    breakPath: breakPath$2
  };

  var all$3 = function (universe, look, elements, f) {
    var head = elements[0];
    var tail = elements.slice(1);
    return f(universe, look, head, tail);
  };
  var oneAll = function (universe, look, elements) {
    return elements.length > 0 ? all$3(universe, look, elements, unsafeOne) : $_8zi7zzjgjc7tmce9.none();
  };
  var unsafeOne = function (universe, look, head, tail) {
    var start = look(universe, head);
    return $_f8juj3jfjc7tmcdy.foldr(tail, function (b, a) {
      var current = look(universe, a);
      return commonElement(universe, b, current);
    }, start);
  };
  var commonElement = function (universe, start, end) {
    return start.bind(function (s) {
      return end.filter($_av3vphjhjc7tmcee.curry(universe.eq, s));
    });
  };
  var $_ee8wlll9jc7tmcst = { oneAll: oneAll };

  var eq$1 = function (universe, item) {
    return $_av3vphjhjc7tmcee.curry(universe.eq, item);
  };
  var unsafeSubset = function (universe, common, ps1, ps2) {
    var children = universe.property().children(common);
    if (universe.eq(common, ps1[0]))
      return $_8zi7zzjgjc7tmce9.some([ps1[0]]);
    if (universe.eq(common, ps2[0]))
      return $_8zi7zzjgjc7tmce9.some([ps2[0]]);
    var finder = function (ps) {
      var topDown = $_f8juj3jfjc7tmcdy.reverse(ps);
      var index = $_f8juj3jfjc7tmcdy.findIndex(topDown, eq$1(universe, common)).getOr(-1);
      var item = index < topDown.length - 1 ? topDown[index + 1] : topDown[index];
      return $_f8juj3jfjc7tmcdy.findIndex(children, eq$1(universe, item));
    };
    var startIndex = finder(ps1);
    var endIndex = finder(ps2);
    return startIndex.bind(function (sIndex) {
      return endIndex.map(function (eIndex) {
        var first = Math.min(sIndex, eIndex);
        var last = Math.max(sIndex, eIndex);
        return children.slice(first, last + 1);
      });
    });
  };
  var ancestors$4 = function (universe, start, end, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_av3vphjhjc7tmcee.constant(false);
    var ps1 = [start].concat(universe.up().all(start));
    var ps2 = [end].concat(universe.up().all(end));
    var prune = function (path) {
      var index = $_f8juj3jfjc7tmcdy.findIndex(path, isRoot);
      return index.fold(function () {
        return path;
      }, function (ind) {
        return path.slice(0, ind + 1);
      });
    };
    var pruned1 = prune(ps1);
    var pruned2 = prune(ps2);
    var shared = $_f8juj3jfjc7tmcdy.find(pruned1, function (x) {
      return $_f8juj3jfjc7tmcdy.exists(pruned2, eq$1(universe, x));
    });
    return {
      firstpath: $_av3vphjhjc7tmcee.constant(pruned1),
      secondpath: $_av3vphjhjc7tmcee.constant(pruned2),
      shared: $_av3vphjhjc7tmcee.constant(shared)
    };
  };
  var subset$2 = function (universe, start, end) {
    var ancs = ancestors$4(universe, start, end);
    return ancs.shared().bind(function (shared) {
      return unsafeSubset(universe, shared, ancs.firstpath(), ancs.secondpath());
    });
  };
  var $_4epimplajc7tmct2 = {
    subset: subset$2,
    ancestors: ancestors$4
  };

  var sharedOne$1 = function (universe, look, elements) {
    return $_ee8wlll9jc7tmcst.oneAll(universe, look, elements);
  };
  var subset$1 = function (universe, start, finish) {
    return $_4epimplajc7tmct2.subset(universe, start, finish);
  };
  var ancestors$3 = function (universe, start, finish, _isRoot) {
    return $_4epimplajc7tmct2.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft$1 = function (universe, parent, child) {
    return $_74axlfl8jc7tmcsl.breakToLeft(universe, parent, child);
  };
  var breakToRight$1 = function (universe, parent, child) {
    return $_74axlfl8jc7tmcsl.breakToRight(universe, parent, child);
  };
  var breakPath$1 = function (universe, child, isTop, breaker) {
    return $_74axlfl8jc7tmcsl.breakPath(universe, child, isTop, breaker);
  };
  var $_59difl7jc7tmcsg = {
    sharedOne: sharedOne$1,
    subset: subset$1,
    ancestors: ancestors$3,
    breakToLeft: breakToLeft$1,
    breakToRight: breakToRight$1,
    breakPath: breakPath$1
  };

  var universe = DomUniverse();
  var sharedOne = function (look, elements) {
    return $_59difl7jc7tmcsg.sharedOne(universe, function (universe, element) {
      return look(element);
    }, elements);
  };
  var subset = function (start, finish) {
    return $_59difl7jc7tmcsg.subset(universe, start, finish);
  };
  var ancestors$2 = function (start, finish, _isRoot) {
    return $_59difl7jc7tmcsg.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft = function (parent, child) {
    return $_59difl7jc7tmcsg.breakToLeft(universe, parent, child);
  };
  var breakToRight = function (parent, child) {
    return $_59difl7jc7tmcsg.breakToRight(universe, parent, child);
  };
  var breakPath = function (child, isTop, breaker) {
    return $_59difl7jc7tmcsg.breakPath(universe, child, isTop, function (u, p, c) {
      return breaker(p, c);
    });
  };
  var $_9hu61rl4jc7tmcrb = {
    sharedOne: sharedOne,
    subset: subset,
    ancestors: ancestors$2,
    breakToLeft: breakToLeft,
    breakToRight: breakToRight,
    breakPath: breakPath
  };

  var inSelection = function (bounds, detail) {
    var leftEdge = detail.column();
    var rightEdge = detail.column() + detail.colspan() - 1;
    var topEdge = detail.row();
    var bottomEdge = detail.row() + detail.rowspan() - 1;
    return leftEdge <= bounds.finishCol() && rightEdge >= bounds.startCol() && (topEdge <= bounds.finishRow() && bottomEdge >= bounds.startRow());
  };
  var isWithin = function (bounds, detail) {
    return detail.column() >= bounds.startCol() && detail.column() + detail.colspan() - 1 <= bounds.finishCol() && detail.row() >= bounds.startRow() && detail.row() + detail.rowspan() - 1 <= bounds.finishRow();
  };
  var isRectangular = function (warehouse, bounds) {
    var isRect = true;
    var detailIsWithin = $_av3vphjhjc7tmcee.curry(isWithin, bounds);
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        isRect = isRect && $_erfiqhknjc7tmcm8.getAt(warehouse, i, j).exists(detailIsWithin);
      }
    }
    return isRect ? $_8zi7zzjgjc7tmce9.some(bounds) : $_8zi7zzjgjc7tmce9.none();
  };
  var $_51nex3ldjc7tmcu1 = {
    inSelection: inSelection,
    isWithin: isWithin,
    isRectangular: isRectangular
  };

  var getBounds = function (detailA, detailB) {
    return $_5q87xujqjc7tmcgj.bounds(Math.min(detailA.row(), detailB.row()), Math.min(detailA.column(), detailB.column()), Math.max(detailA.row() + detailA.rowspan() - 1, detailB.row() + detailB.rowspan() - 1), Math.max(detailA.column() + detailA.colspan() - 1, detailB.column() + detailB.colspan() - 1));
  };
  var getAnyBox = function (warehouse, startCell, finishCell) {
    var startCoords = $_erfiqhknjc7tmcm8.findItem(warehouse, startCell, $_4co3lyjyjc7tmciu.eq);
    var finishCoords = $_erfiqhknjc7tmcm8.findItem(warehouse, finishCell, $_4co3lyjyjc7tmciu.eq);
    return startCoords.bind(function (sc) {
      return finishCoords.map(function (fc) {
        return getBounds(sc, fc);
      });
    });
  };
  var getBox$1 = function (warehouse, startCell, finishCell) {
    return getAnyBox(warehouse, startCell, finishCell).bind(function (bounds) {
      return $_51nex3ldjc7tmcu1.isRectangular(warehouse, bounds);
    });
  };
  var $_g4ynk4lejc7tmcu6 = {
    getAnyBox: getAnyBox,
    getBox: getBox$1
  };

  var moveBy$1 = function (warehouse, cell, row, column) {
    return $_erfiqhknjc7tmcm8.findItem(warehouse, cell, $_4co3lyjyjc7tmciu.eq).bind(function (detail) {
      var startRow = row > 0 ? detail.row() + detail.rowspan() - 1 : detail.row();
      var startCol = column > 0 ? detail.column() + detail.colspan() - 1 : detail.column();
      var dest = $_erfiqhknjc7tmcm8.getAt(warehouse, startRow + row, startCol + column);
      return dest.map(function (d) {
        return d.element();
      });
    });
  };
  var intercepts$1 = function (warehouse, start, finish) {
    return $_g4ynk4lejc7tmcu6.getAnyBox(warehouse, start, finish).map(function (bounds) {
      var inside = $_erfiqhknjc7tmcm8.filterItems(warehouse, $_av3vphjhjc7tmcee.curry($_51nex3ldjc7tmcu1.inSelection, bounds));
      return $_f8juj3jfjc7tmcdy.map(inside, function (detail) {
        return detail.element();
      });
    });
  };
  var parentCell = function (warehouse, innerCell) {
    var isContainedBy = function (c1, c2) {
      return $_4co3lyjyjc7tmciu.contains(c2, c1);
    };
    return $_erfiqhknjc7tmcm8.findItem(warehouse, innerCell, isContainedBy).bind(function (detail) {
      return detail.element();
    });
  };
  var $_3lnnjglcjc7tmctq = {
    moveBy: moveBy$1,
    intercepts: intercepts$1,
    parentCell: parentCell
  };

  var moveBy = function (cell, deltaRow, deltaColumn) {
    return $_dvsb29jrjc7tmcgo.table(cell).bind(function (table) {
      var warehouse = getWarehouse(table);
      return $_3lnnjglcjc7tmctq.moveBy(warehouse, cell, deltaRow, deltaColumn);
    });
  };
  var intercepts = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_3lnnjglcjc7tmctq.intercepts(warehouse, first, last);
  };
  var nestedIntercepts = function (table, first, firstTable, last, lastTable) {
    var warehouse = getWarehouse(table);
    var startCell = $_4co3lyjyjc7tmciu.eq(table, firstTable) ? first : $_3lnnjglcjc7tmctq.parentCell(warehouse, first);
    var lastCell = $_4co3lyjyjc7tmciu.eq(table, lastTable) ? last : $_3lnnjglcjc7tmctq.parentCell(warehouse, last);
    return $_3lnnjglcjc7tmctq.intercepts(warehouse, startCell, lastCell);
  };
  var getBox = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_g4ynk4lejc7tmcu6.getBox(warehouse, first, last);
  };
  var getWarehouse = function (table) {
    var list = $_2baam5jpjc7tmcg8.fromTable(table);
    return $_erfiqhknjc7tmcm8.generate(list);
  };
  var $_5p7t6clbjc7tmctd = {
    moveBy: moveBy,
    intercepts: intercepts,
    nestedIntercepts: nestedIntercepts,
    getBox: getBox
  };

  var lookupTable = function (container, isRoot) {
    return $_ft53o4kkjc7tmcln.ancestor(container, 'table');
  };
  var identified = $_10a874jkjc7tmcfr.immutableBag([
    'boxes',
    'start',
    'finish'
  ], []);
  var identify = function (start, finish, isRoot) {
    var getIsRoot = function (rootTable) {
      return function (element) {
        return isRoot(element) || $_4co3lyjyjc7tmciu.eq(element, rootTable);
      };
    };
    if ($_4co3lyjyjc7tmciu.eq(start, finish)) {
      return $_8zi7zzjgjc7tmce9.some(identified({
        boxes: $_8zi7zzjgjc7tmce9.some([start]),
        start: start,
        finish: finish
      }));
    } else {
      return lookupTable(start, isRoot).bind(function (startTable) {
        return lookupTable(finish, isRoot).bind(function (finishTable) {
          if ($_4co3lyjyjc7tmciu.eq(startTable, finishTable)) {
            return $_8zi7zzjgjc7tmce9.some(identified({
              boxes: $_5p7t6clbjc7tmctd.intercepts(startTable, start, finish),
              start: start,
              finish: finish
            }));
          } else if ($_4co3lyjyjc7tmciu.contains(startTable, finishTable)) {
            var ancestorCells = $_7y6210khjc7tmcl8.ancestors(finish, 'td,th', getIsRoot(startTable));
            var finishCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : finish;
            return $_8zi7zzjgjc7tmce9.some(identified({
              boxes: $_5p7t6clbjc7tmctd.nestedIntercepts(startTable, start, startTable, finish, finishTable),
              start: start,
              finish: finishCell
            }));
          } else if ($_4co3lyjyjc7tmciu.contains(finishTable, startTable)) {
            var ancestorCells = $_7y6210khjc7tmcl8.ancestors(start, 'td,th', getIsRoot(finishTable));
            var startCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : start;
            return $_8zi7zzjgjc7tmce9.some(identified({
              boxes: $_5p7t6clbjc7tmctd.nestedIntercepts(finishTable, start, startTable, finish, finishTable),
              start: start,
              finish: startCell
            }));
          } else {
            return $_9hu61rl4jc7tmcrb.ancestors(start, finish).shared().bind(function (lca) {
              return $_ft53o4kkjc7tmcln.closest(lca, 'table', isRoot).bind(function (lcaTable) {
                var finishAncestorCells = $_7y6210khjc7tmcl8.ancestors(finish, 'td,th', getIsRoot(lcaTable));
                var finishCell = finishAncestorCells.length > 0 ? finishAncestorCells[finishAncestorCells.length - 1] : finish;
                var startAncestorCells = $_7y6210khjc7tmcl8.ancestors(start, 'td,th', getIsRoot(lcaTable));
                var startCell = startAncestorCells.length > 0 ? startAncestorCells[startAncestorCells.length - 1] : start;
                return $_8zi7zzjgjc7tmce9.some(identified({
                  boxes: $_5p7t6clbjc7tmctd.nestedIntercepts(lcaTable, start, startTable, finish, finishTable),
                  start: startCell,
                  finish: finishCell
                }));
              });
            });
          }
        });
      });
    }
  };
  var retrieve$1 = function (container, selector) {
    var sels = $_7y6210khjc7tmcl8.descendants(container, selector);
    return sels.length > 0 ? $_8zi7zzjgjc7tmce9.some(sels) : $_8zi7zzjgjc7tmce9.none();
  };
  var getLast = function (boxes, lastSelectedSelector) {
    return $_f8juj3jfjc7tmcdy.find(boxes, function (box) {
      return $_a0jew7jtjc7tmchx.is(box, lastSelectedSelector);
    });
  };
  var getEdges = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_ft53o4kkjc7tmcln.descendant(container, firstSelectedSelector).bind(function (first) {
      return $_ft53o4kkjc7tmcln.descendant(container, lastSelectedSelector).bind(function (last) {
        return $_9hu61rl4jc7tmcrb.sharedOne(lookupTable, [
          first,
          last
        ]).map(function (tbl) {
          return {
            first: $_av3vphjhjc7tmcee.constant(first),
            last: $_av3vphjhjc7tmcee.constant(last),
            table: $_av3vphjhjc7tmcee.constant(tbl)
          };
        });
      });
    });
  };
  var expandTo = function (finish, firstSelectedSelector) {
    return $_ft53o4kkjc7tmcln.ancestor(finish, 'table').bind(function (table) {
      return $_ft53o4kkjc7tmcln.descendant(table, firstSelectedSelector).bind(function (start) {
        return identify(start, finish).bind(function (identified) {
          return identified.boxes().map(function (boxes) {
            return {
              boxes: $_av3vphjhjc7tmcee.constant(boxes),
              start: $_av3vphjhjc7tmcee.constant(identified.start()),
              finish: $_av3vphjhjc7tmcee.constant(identified.finish())
            };
          });
        });
      });
    });
  };
  var shiftSelection = function (boxes, deltaRow, deltaColumn, firstSelectedSelector, lastSelectedSelector) {
    return getLast(boxes, lastSelectedSelector).bind(function (last) {
      return $_5p7t6clbjc7tmctd.moveBy(last, deltaRow, deltaColumn).bind(function (finish) {
        return expandTo(finish, firstSelectedSelector);
      });
    });
  };
  var $_79f7ial3jc7tmcqm = {
    identify: identify,
    retrieve: retrieve$1,
    shiftSelection: shiftSelection,
    getEdges: getEdges
  };

  var retrieve = function (container, selector) {
    return $_79f7ial3jc7tmcqm.retrieve(container, selector);
  };
  var retrieveBox = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_79f7ial3jc7tmcqm.getEdges(container, firstSelectedSelector, lastSelectedSelector).bind(function (edges) {
      var isRoot = function (ancestor) {
        return $_4co3lyjyjc7tmciu.eq(container, ancestor);
      };
      var firstAncestor = $_ft53o4kkjc7tmcln.ancestor(edges.first(), 'thead,tfoot,tbody,table', isRoot);
      var lastAncestor = $_ft53o4kkjc7tmcln.ancestor(edges.last(), 'thead,tfoot,tbody,table', isRoot);
      return firstAncestor.bind(function (fA) {
        return lastAncestor.bind(function (lA) {
          return $_4co3lyjyjc7tmciu.eq(fA, lA) ? $_5p7t6clbjc7tmctd.getBox(edges.table(), edges.first(), edges.last()) : $_8zi7zzjgjc7tmce9.none();
        });
      });
    });
  };
  var $_1zq4szl2jc7tmcq4 = {
    retrieve: retrieve,
    retrieveBox: retrieveBox
  };

  var selected = 'data-mce-selected';
  var selectedSelector = 'td[' + selected + '],th[' + selected + ']';
  var attributeSelector = '[' + selected + ']';
  var firstSelected = 'data-mce-first-selected';
  var firstSelectedSelector = 'td[' + firstSelected + '],th[' + firstSelected + ']';
  var lastSelected = 'data-mce-last-selected';
  var lastSelectedSelector = 'td[' + lastSelected + '],th[' + lastSelected + ']';
  var $_b84ex7lfjc7tmcuc = {
    selected: $_av3vphjhjc7tmcee.constant(selected),
    selectedSelector: $_av3vphjhjc7tmcee.constant(selectedSelector),
    attributeSelector: $_av3vphjhjc7tmcee.constant(attributeSelector),
    firstSelected: $_av3vphjhjc7tmcee.constant(firstSelected),
    firstSelectedSelector: $_av3vphjhjc7tmcee.constant(firstSelectedSelector),
    lastSelected: $_av3vphjhjc7tmcee.constant(lastSelected),
    lastSelectedSelector: $_av3vphjhjc7tmcee.constant(lastSelectedSelector)
  };

  var generate$1 = function (cases) {
    if (!$_diovd6jojc7tmcg3.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_f8juj3jfjc7tmcdy.each(cases, function (acase, count) {
      var keys = $_dn7d6zjjjc7tmcfa.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_diovd6jojc7tmcg3.isArray(value)) {
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
          var branchKeys = $_dn7d6zjjjc7tmcfa.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_f8juj3jfjc7tmcdy.forall(constructors, function (reqKey) {
            return $_f8juj3jfjc7tmcdy.contains(branchKeys, reqKey);
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
  var $_sn5zylhjc7tmcui = { generate: generate$1 };

  var type$1 = $_sn5zylhjc7tmcui.generate([
    { none: [] },
    { multiple: ['elements'] },
    { single: ['selection'] }
  ]);
  var cata = function (subject, onNone, onMultiple, onSingle) {
    return subject.fold(onNone, onMultiple, onSingle);
  };
  var $_2uxq8vlgjc7tmcuf = {
    cata: cata,
    none: type$1.none,
    multiple: type$1.multiple,
    single: type$1.single
  };

  var selection = function (cell, selections) {
    return $_2uxq8vlgjc7tmcuf.cata(selections.get(), $_av3vphjhjc7tmcee.constant([]), $_av3vphjhjc7tmcee.identity, $_av3vphjhjc7tmcee.constant([cell]));
  };
  var unmergable = function (cell, selections) {
    var hasSpan = function (elem) {
      return $_9o3gmekfjc7tmckw.has(elem, 'rowspan') && parseInt($_9o3gmekfjc7tmckw.get(elem, 'rowspan'), 10) > 1 || $_9o3gmekfjc7tmckw.has(elem, 'colspan') && parseInt($_9o3gmekfjc7tmckw.get(elem, 'colspan'), 10) > 1;
    };
    var candidates = selection(cell, selections);
    return candidates.length > 0 && $_f8juj3jfjc7tmcdy.forall(candidates, hasSpan) ? $_8zi7zzjgjc7tmce9.some(candidates) : $_8zi7zzjgjc7tmce9.none();
  };
  var mergable = function (table, selections) {
    return $_2uxq8vlgjc7tmcuf.cata(selections.get(), $_8zi7zzjgjc7tmce9.none, function (cells, _env) {
      if (cells.length === 0) {
        return $_8zi7zzjgjc7tmce9.none();
      }
      return $_1zq4szl2jc7tmcq4.retrieveBox(table, $_b84ex7lfjc7tmcuc.firstSelectedSelector(), $_b84ex7lfjc7tmcuc.lastSelectedSelector()).bind(function (bounds) {
        return cells.length > 1 ? $_8zi7zzjgjc7tmce9.some({
          bounds: $_av3vphjhjc7tmcee.constant(bounds),
          cells: $_av3vphjhjc7tmcee.constant(cells)
        }) : $_8zi7zzjgjc7tmce9.none();
      });
    }, $_8zi7zzjgjc7tmce9.none);
  };
  var $_ao90v2l1jc7tmcps = {
    mergable: mergable,
    unmergable: unmergable,
    selection: selection
  };

  var noMenu = function (cell) {
    return {
      element: $_av3vphjhjc7tmcee.constant(cell),
      mergable: $_8zi7zzjgjc7tmce9.none,
      unmergable: $_8zi7zzjgjc7tmce9.none,
      selection: $_av3vphjhjc7tmcee.constant([cell])
    };
  };
  var forMenu = function (selections, table, cell) {
    return {
      element: $_av3vphjhjc7tmcee.constant(cell),
      mergable: $_av3vphjhjc7tmcee.constant($_ao90v2l1jc7tmcps.mergable(table, selections)),
      unmergable: $_av3vphjhjc7tmcee.constant($_ao90v2l1jc7tmcps.unmergable(cell, selections)),
      selection: $_av3vphjhjc7tmcee.constant($_ao90v2l1jc7tmcps.selection(cell, selections))
    };
  };
  var notCell$1 = function (element) {
    return noMenu(element);
  };
  var paste$1 = $_10a874jkjc7tmcfr.immutable('element', 'clipboard', 'generators');
  var pasteRows = function (selections, table, cell, clipboard, generators) {
    return {
      element: $_av3vphjhjc7tmcee.constant(cell),
      mergable: $_8zi7zzjgjc7tmce9.none,
      unmergable: $_8zi7zzjgjc7tmce9.none,
      selection: $_av3vphjhjc7tmcee.constant($_ao90v2l1jc7tmcps.selection(cell, selections)),
      clipboard: $_av3vphjhjc7tmcee.constant(clipboard),
      generators: $_av3vphjhjc7tmcee.constant(generators)
    };
  };
  var $_i3cwml0jc7tmcpm = {
    noMenu: noMenu,
    forMenu: forMenu,
    notCell: notCell$1,
    paste: paste$1,
    pasteRows: pasteRows
  };

  var extractSelected = function (cells) {
    return $_dvsb29jrjc7tmcgo.table(cells[0]).map($_3eftumkujc7tmcok.deep).map(function (replica) {
      return [$_c12ih7jijc7tmcel.extract(replica, $_b84ex7lfjc7tmcuc.attributeSelector())];
    });
  };
  var serializeElement = function (editor, elm) {
    return editor.selection.serializer.serialize(elm.dom(), {});
  };
  var registerEvents = function (editor, selections, actions, cellSelection) {
    editor.on('BeforeGetContent', function (e) {
      var multiCellContext = function (cells) {
        e.preventDefault();
        extractSelected(cells).each(function (elements) {
          e.content = $_f8juj3jfjc7tmcdy.map(elements, function (elm) {
            return serializeElement(editor, elm);
          }).join('');
        });
      };
      if (e.selection === true) {
        $_2uxq8vlgjc7tmcuf.cata(selections.get(), $_av3vphjhjc7tmcee.noop, multiCellContext, $_av3vphjhjc7tmcee.noop);
      }
    });
    editor.on('BeforeSetContent', function (e) {
      if (e.selection === true && e.paste === true) {
        var cellOpt = $_8zi7zzjgjc7tmce9.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        cellOpt.each(function (domCell) {
          var cell = $_2bd3y0jujc7tmci2.fromDom(domCell);
          var table = $_dvsb29jrjc7tmcgo.table(cell);
          table.bind(function (table) {
            var elements = $_f8juj3jfjc7tmcdy.filter($_7zxda8kzjc7tmcpg.fromHtml(e.content), function (content) {
              return $_fxq8yvkgjc7tmcl4.name(content) !== 'meta';
            });
            if (elements.length === 1 && $_fxq8yvkgjc7tmcl4.name(elements[0]) === 'table') {
              e.preventDefault();
              var doc = $_2bd3y0jujc7tmci2.fromDom(editor.getDoc());
              var generators = $_czudfqktjc7tmcnp.paste(doc);
              var targets = $_i3cwml0jc7tmcpm.paste(cell, elements[0], generators);
              actions.pasteCells(table, targets).each(function (rng) {
                editor.selection.setRng(rng);
                editor.focus();
                cellSelection.clear(table);
              });
            }
          });
        });
      }
    });
  };
  var $_16eqo7jejc7tmcd6 = { registerEvents: registerEvents };

  var makeTable = function () {
    return $_2bd3y0jujc7tmci2.fromTag('table');
  };
  var tableBody = function () {
    return $_2bd3y0jujc7tmci2.fromTag('tbody');
  };
  var tableRow = function () {
    return $_2bd3y0jujc7tmci2.fromTag('tr');
  };
  var tableHeaderCell = function () {
    return $_2bd3y0jujc7tmci2.fromTag('th');
  };
  var tableCell = function () {
    return $_2bd3y0jujc7tmci2.fromTag('td');
  };
  var render = function (rows, columns, rowHeaders, columnHeaders) {
    var table = makeTable();
    $_fsmkrhkojc7tmcmj.setAll(table, {
      'border-collapse': 'collapse',
      width: '100%'
    });
    $_9o3gmekfjc7tmckw.set(table, 'border', '1');
    var tbody = tableBody();
    $_bayouwkqjc7tmcn9.append(table, tbody);
    var trs = [];
    for (var i = 0; i < rows; i++) {
      var tr = tableRow();
      for (var j = 0; j < columns; j++) {
        var td = i < rowHeaders || j < columnHeaders ? tableHeaderCell() : tableCell();
        if (j < columnHeaders) {
          $_9o3gmekfjc7tmckw.set(td, 'scope', 'row');
        }
        if (i < rowHeaders) {
          $_9o3gmekfjc7tmckw.set(td, 'scope', 'col');
        }
        $_bayouwkqjc7tmcn9.append(td, $_2bd3y0jujc7tmci2.fromTag('br'));
        $_fsmkrhkojc7tmcmj.set(td, 'width', 100 / columns + '%');
        $_bayouwkqjc7tmcn9.append(tr, td);
      }
      trs.push(tr);
    }
    $_bl9vkjksjc7tmcnj.append(tbody, trs);
    return table;
  };
  var $_98f5wklkjc7tmcuz = { render: render };

  var $_5d1hzrljjc7tmcuv = { render: $_98f5wklkjc7tmcuz.render };

  var get$3 = function (element) {
    return element.dom().innerHTML;
  };
  var set$3 = function (element, content) {
    var owner = $_66uz4xjwjc7tmcib.owner(element);
    var docDom = owner.dom();
    var fragment = $_2bd3y0jujc7tmci2.fromDom(docDom.createDocumentFragment());
    var contentElements = $_7zxda8kzjc7tmcpg.fromHtml(content, docDom);
    $_bl9vkjksjc7tmcnj.append(fragment, contentElements);
    $_t0op8krjc7tmcnd.empty(element);
    $_bayouwkqjc7tmcn9.append(element, fragment);
  };
  var getOuter = function (element) {
    var container = $_2bd3y0jujc7tmci2.fromTag('div');
    var clone = $_2bd3y0jujc7tmci2.fromDom(element.dom().cloneNode(true));
    $_bayouwkqjc7tmcn9.append(container, clone);
    return get$3(container);
  };
  var $_3h5gcblljc7tmcvb = {
    get: get$3,
    set: set$3,
    getOuter: getOuter
  };

  var placeCaretInCell = function (editor, cell) {
    editor.selection.select(cell.dom(), true);
    editor.selection.collapse(true);
  };
  var selectFirstCellInTable = function (editor, tableElm) {
    $_ft53o4kkjc7tmcln.descendant(tableElm, 'td,th').each($_av3vphjhjc7tmcee.curry(placeCaretInCell, editor));
  };
  var insert = function (editor, columns, rows) {
    var tableElm;
    var renderedHtml = $_5d1hzrljjc7tmcuv.render(rows, columns, 0, 0);
    $_9o3gmekfjc7tmckw.set(renderedHtml, 'id', '__mce');
    var html = $_3h5gcblljc7tmcvb.getOuter(renderedHtml);
    editor.insertContent(html);
    tableElm = editor.dom.get('__mce');
    editor.dom.setAttrib(tableElm, 'id', null);
    editor.$('tr', tableElm).each(function (index, row) {
      editor.fire('newrow', { node: row });
      editor.$('th,td', row).each(function (index, cell) {
        editor.fire('newcell', { node: cell });
      });
    });
    editor.dom.setAttribs(tableElm, editor.settings.table_default_attributes || {});
    editor.dom.setStyles(tableElm, editor.settings.table_default_styles || {});
    selectFirstCellInTable(editor, $_2bd3y0jujc7tmci2.fromDom(tableElm));
    return tableElm;
  };
  var $_8320wnlijc7tmcul = { insert: insert };

  var Dimension = function (name, getOffset) {
    var set = function (element, h) {
      if (!$_diovd6jojc7tmcg3.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_g96oywkpjc7tmcn7.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_fsmkrhkojc7tmcmj.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_f8juj3jfjc7tmcdy.foldl(properties, function (acc, property) {
        var val = $_fsmkrhkojc7tmcmj.get(element, property);
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

  var api$1 = Dimension('height', function (element) {
    return $_84qvvkjjc7tmclf.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$4 = function (element, h) {
    api$1.set(element, h);
  };
  var get$5 = function (element) {
    return api$1.get(element);
  };
  var getOuter$1 = function (element) {
    return api$1.getOuter(element);
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
    var absMax = api$1.max(element, value, inclusions);
    $_fsmkrhkojc7tmcmj.set(element, 'max-height', absMax + 'px');
  };
  var $_2t70lglqjc7tmcxc = {
    set: set$4,
    get: get$5,
    getOuter: getOuter$1,
    setMax: setMax
  };

  var api$2 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$5 = function (element, h) {
    api$2.set(element, h);
  };
  var get$6 = function (element) {
    return api$2.get(element);
  };
  var getOuter$2 = function (element) {
    return api$2.getOuter(element);
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
    var absMax = api$2.max(element, value, inclusions);
    $_fsmkrhkojc7tmcmj.set(element, 'max-width', absMax + 'px');
  };
  var $_7w15eclsjc7tmcxq = {
    set: set$5,
    get: get$6,
    getOuter: getOuter$2,
    setMax: setMax$1
  };

  var platform = $_enuqxfk3jc7tmcjq.detect();
  var needManualCalc = function () {
    return platform.browser.isIE() || platform.browser.isEdge();
  };
  var toNumber = function (px, fallback) {
    var num = parseFloat(px);
    return isNaN(num) ? fallback : num;
  };
  var getProp = function (elm, name, fallback) {
    return toNumber($_fsmkrhkojc7tmcmj.get(elm, name), fallback);
  };
  var getCalculatedHeight = function (cell) {
    var paddingTop = getProp(cell, 'padding-top', 0);
    var paddingBottom = getProp(cell, 'padding-bottom', 0);
    var borderTop = getProp(cell, 'border-top-width', 0);
    var borderBottom = getProp(cell, 'border-bottom-width', 0);
    var height = cell.dom().getBoundingClientRect().height;
    var boxSizing = $_fsmkrhkojc7tmcmj.get(cell, 'box-sizing');
    var borders = borderTop + borderBottom;
    return boxSizing === 'border-box' ? height : height - paddingTop - paddingBottom - borders;
  };
  var getWidth = function (cell) {
    return getProp(cell, 'width', $_7w15eclsjc7tmcxq.get(cell));
  };
  var getHeight$1 = function (cell) {
    return needManualCalc() ? getCalculatedHeight(cell) : getProp(cell, 'height', $_2t70lglqjc7tmcxc.get(cell));
  };
  var $_2do4tvlpjc7tmcx3 = {
    getWidth: getWidth,
    getHeight: getHeight$1
  };

  var genericSizeRegex = /(\d+(\.\d+)?)(\w|%)*/;
  var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
  var pixelBasedSizeRegex = /(\d+(\.\d+)?)px|em/;
  var setPixelWidth = function (cell, amount) {
    $_fsmkrhkojc7tmcmj.set(cell, 'width', amount + 'px');
  };
  var setPercentageWidth = function (cell, amount) {
    $_fsmkrhkojc7tmcmj.set(cell, 'width', amount + '%');
  };
  var setHeight = function (cell, amount) {
    $_fsmkrhkojc7tmcmj.set(cell, 'height', amount + 'px');
  };
  var getHeightValue = function (cell) {
    return $_fsmkrhkojc7tmcmj.getRaw(cell, 'height').getOrThunk(function () {
      return $_2do4tvlpjc7tmcx3.getHeight(cell) + 'px';
    });
  };
  var convert = function (cell, number, getter, setter) {
    var newSize = $_dvsb29jrjc7tmcgo.table(cell).map(function (table) {
      var total = getter(table);
      return Math.floor(number / 100 * total);
    }).getOr(number);
    setter(cell, newSize);
    return newSize;
  };
  var normalizePixelSize = function (value, cell, getter, setter) {
    var number = parseInt(value, 10);
    return $_26r8vikcjc7tmckq.endsWith(value, '%') && $_fxq8yvkgjc7tmcl4.name(cell) !== 'table' ? convert(cell, number, getter, setter) : number;
  };
  var getTotalHeight = function (cell) {
    var value = getHeightValue(cell);
    if (!value)
      return $_2t70lglqjc7tmcxc.get(cell);
    return normalizePixelSize(value, cell, $_2t70lglqjc7tmcxc.get, setHeight);
  };
  var get$4 = function (cell, type, f) {
    var v = f(cell);
    var span = getSpan(cell, type);
    return v / span;
  };
  var getSpan = function (cell, type) {
    return $_9o3gmekfjc7tmckw.has(cell, type) ? parseInt($_9o3gmekfjc7tmckw.get(cell, type), 10) : 1;
  };
  var getRawWidth = function (element) {
    var cssWidth = $_fsmkrhkojc7tmcmj.getRaw(element, 'width');
    return cssWidth.fold(function () {
      return $_8zi7zzjgjc7tmce9.from($_9o3gmekfjc7tmckw.get(element, 'width'));
    }, function (width) {
      return $_8zi7zzjgjc7tmce9.some(width);
    });
  };
  var normalizePercentageWidth = function (cellWidth, tableSize) {
    return cellWidth / tableSize.pixelWidth() * 100;
  };
  var choosePercentageSize = function (element, width, tableSize) {
    if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      return parseFloat(percentMatch[1]);
    } else {
      var fallbackWidth = $_7w15eclsjc7tmcxq.get(element);
      var intWidth = parseInt(fallbackWidth, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }
  };
  var getPercentageWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_7w15eclsjc7tmcxq.get(cell);
      var intWidth = parseInt(width, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }, function (width) {
      return choosePercentageSize(cell, width, tableSize);
    });
  };
  var normalizePixelWidth = function (cellWidth, tableSize) {
    return cellWidth / 100 * tableSize.pixelWidth();
  };
  var choosePixelSize = function (element, width, tableSize) {
    if (pixelBasedSizeRegex.test(width)) {
      var pixelMatch = pixelBasedSizeRegex.exec(width);
      return parseInt(pixelMatch[1], 10);
    } else if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      var floatWidth = parseFloat(percentMatch[1]);
      return normalizePixelWidth(floatWidth, tableSize);
    } else {
      var fallbackWidth = $_7w15eclsjc7tmcxq.get(element);
      return parseInt(fallbackWidth, 10);
    }
  };
  var getPixelWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_7w15eclsjc7tmcxq.get(cell);
      var intWidth = parseInt(width, 10);
      return intWidth;
    }, function (width) {
      return choosePixelSize(cell, width, tableSize);
    });
  };
  var getHeight = function (cell) {
    return get$4(cell, 'rowspan', getTotalHeight);
  };
  var getGenericWidth = function (cell) {
    var width = getRawWidth(cell);
    return width.bind(function (width) {
      if (genericSizeRegex.test(width)) {
        var match = genericSizeRegex.exec(width);
        return $_8zi7zzjgjc7tmce9.some({
          width: $_av3vphjhjc7tmcee.constant(match[1]),
          unit: $_av3vphjhjc7tmcee.constant(match[3])
        });
      } else {
        return $_8zi7zzjgjc7tmce9.none();
      }
    });
  };
  var setGenericWidth = function (cell, amount, unit) {
    $_fsmkrhkojc7tmcmj.set(cell, 'width', amount + unit);
  };
  var $_5fedwxlojc7tmcwd = {
    percentageBasedSizeRegex: $_av3vphjhjc7tmcee.constant(percentageBasedSizeRegex),
    pixelBasedSizeRegex: $_av3vphjhjc7tmcee.constant(pixelBasedSizeRegex),
    setPixelWidth: setPixelWidth,
    setPercentageWidth: setPercentageWidth,
    setHeight: setHeight,
    getPixelWidth: getPixelWidth,
    getPercentageWidth: getPercentageWidth,
    getGenericWidth: getGenericWidth,
    setGenericWidth: setGenericWidth,
    getHeight: getHeight,
    getRawWidth: getRawWidth
  };

  var halve = function (main, other) {
    var width = $_5fedwxlojc7tmcwd.getGenericWidth(main);
    width.each(function (width) {
      var newWidth = width.width() / 2;
      $_5fedwxlojc7tmcwd.setGenericWidth(main, newWidth, width.unit());
      $_5fedwxlojc7tmcwd.setGenericWidth(other, newWidth, width.unit());
    });
  };
  var $_dbfsj8lnjc7tmcw6 = { halve: halve };

  var attached = function (element, scope) {
    var doc = scope || $_2bd3y0jujc7tmci2.fromDom(document.documentElement);
    return $_39ujfjkljc7tmclp.ancestor(element, $_av3vphjhjc7tmcee.curry($_4co3lyjyjc7tmciu.eq, doc)).isSome();
  };
  var windowOf = function (element) {
    var dom = element.dom();
    if (dom === dom.window)
      return element;
    return $_fxq8yvkgjc7tmcl4.isDocument(element) ? dom.defaultView || dom.parentWindow : null;
  };
  var $_bqi2oilxjc7tmcyh = {
    attached: attached,
    windowOf: windowOf
  };

  var r = function (left, top) {
    var translate = function (x, y) {
      return r(left + x, top + y);
    };
    return {
      left: $_av3vphjhjc7tmcee.constant(left),
      top: $_av3vphjhjc7tmcee.constant(top),
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
    var win = $_bqi2oilxjc7tmcyh.windowOf($_2bd3y0jujc7tmci2.fromDom(doc));
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
    var html = $_2bd3y0jujc7tmci2.fromDom(doc.documentElement);
    if (body === dom)
      return r(body.offsetLeft, body.offsetTop);
    if (!$_bqi2oilxjc7tmcyh.attached(element, html))
      return r(0, 0);
    return boxPosition(dom);
  };
  var $_ad66zylwjc7tmcyc = {
    absolute: absolute,
    relative: relative,
    viewport: viewport
  };

  var rowInfo = $_10a874jkjc7tmcfr.immutable('row', 'y');
  var colInfo = $_10a874jkjc7tmcfr.immutable('col', 'x');
  var rtlEdge = function (cell) {
    var pos = $_ad66zylwjc7tmcyc.absolute(cell);
    return pos.left() + $_7w15eclsjc7tmcxq.getOuter(cell);
  };
  var ltrEdge = function (cell) {
    return $_ad66zylwjc7tmcyc.absolute(cell).left();
  };
  var getLeftEdge = function (index, cell) {
    return colInfo(index, ltrEdge(cell));
  };
  var getRightEdge = function (index, cell) {
    return colInfo(index, rtlEdge(cell));
  };
  var getTop = function (cell) {
    return $_ad66zylwjc7tmcyc.absolute(cell).top();
  };
  var getTopEdge = function (index, cell) {
    return rowInfo(index, getTop(cell));
  };
  var getBottomEdge = function (index, cell) {
    return rowInfo(index, getTop(cell) + $_2t70lglqjc7tmcxc.getOuter(cell));
  };
  var findPositions = function (getInnerEdge, getOuterEdge, array) {
    if (array.length === 0)
      return [];
    var lines = $_f8juj3jfjc7tmcdy.map(array.slice(1), function (cellOption, index) {
      return cellOption.map(function (cell) {
        return getInnerEdge(index, cell);
      });
    });
    var lastLine = array[array.length - 1].map(function (cell) {
      return getOuterEdge(array.length - 1, cell);
    });
    return lines.concat([lastLine]);
  };
  var negate = function (step, _table) {
    return -step;
  };
  var height = {
    delta: $_av3vphjhjc7tmcee.identity,
    positions: $_av3vphjhjc7tmcee.curry(findPositions, getTopEdge, getBottomEdge),
    edge: getTop
  };
  var ltr = {
    delta: $_av3vphjhjc7tmcee.identity,
    edge: ltrEdge,
    positions: $_av3vphjhjc7tmcee.curry(findPositions, getLeftEdge, getRightEdge)
  };
  var rtl = {
    delta: negate,
    edge: rtlEdge,
    positions: $_av3vphjhjc7tmcee.curry(findPositions, getRightEdge, getLeftEdge)
  };
  var $_a2g1falvjc7tmcy2 = {
    height: height,
    rtl: rtl,
    ltr: ltr
  };

  var $_288r59lujc7tmcxy = {
    ltr: $_a2g1falvjc7tmcy2.ltr,
    rtl: $_a2g1falvjc7tmcy2.rtl
  };

  var TableDirection = function (directionAt) {
    var auto = function (table) {
      return directionAt(table).isRtl() ? $_288r59lujc7tmcxy.rtl : $_288r59lujc7tmcxy.ltr;
    };
    var delta = function (amount, table) {
      return auto(table).delta(amount, table);
    };
    var positions = function (cols, table) {
      return auto(table).positions(cols, table);
    };
    var edge = function (cell) {
      return auto(cell).edge(cell);
    };
    return {
      delta: delta,
      edge: edge,
      positions: positions
    };
  };

  var getGridSize = function (table) {
    var input = $_2baam5jpjc7tmcg8.fromTable(table);
    var warehouse = $_erfiqhknjc7tmcm8.generate(input);
    return warehouse.grid();
  };
  var $_nzm4blzjc7tmcyr = { getGridSize: getGridSize };

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

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_diovd6jojc7tmcg3.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_cx6zprjnjc7tmcg0.validateStrArr('required', required);
    $_cx6zprjnjc7tmcg0.checkDupes(required);
    return function (obj) {
      var keys = $_dn7d6zjjjc7tmcfa.keys(obj);
      var allReqd = $_f8juj3jfjc7tmcdy.forall(required, function (req) {
        return $_f8juj3jfjc7tmcdy.contains(keys, req);
      });
      if (!allReqd)
        $_cx6zprjnjc7tmcg0.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_f8juj3jfjc7tmcdy.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_cx6zprjnjc7tmcg0.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_f8juj3jfjc7tmcdy.filter(keys, function (key) {
      return !$_f8juj3jfjc7tmcdy.contains(required, key);
    });
    if (unsupported.length > 0)
      $_cx6zprjnjc7tmcg0.unsuppMessage(unsupported);
  };
  var allowExtra = $_av3vphjhjc7tmcee.noop;
  var $_ckugobm3jc7tmd06 = {
    exactly: $_av3vphjhjc7tmcee.curry(base, handleExact),
    ensure: $_av3vphjhjc7tmcee.curry(base, allowExtra),
    ensureWith: $_av3vphjhjc7tmcee.curry(baseWith, allowExtra)
  };

  var elementToData = function (element) {
    var colspan = $_9o3gmekfjc7tmckw.has(element, 'colspan') ? parseInt($_9o3gmekfjc7tmckw.get(element, 'colspan'), 10) : 1;
    var rowspan = $_9o3gmekfjc7tmckw.has(element, 'rowspan') ? parseInt($_9o3gmekfjc7tmckw.get(element, 'rowspan'), 10) : 1;
    return {
      element: $_av3vphjhjc7tmcee.constant(element),
      colspan: $_av3vphjhjc7tmcee.constant(colspan),
      rowspan: $_av3vphjhjc7tmcee.constant(rowspan)
    };
  };
  var modification = function (generators, _toData) {
    contract(generators);
    var position = Cell($_8zi7zzjgjc7tmce9.none());
    var toData = _toData !== undefined ? _toData : elementToData;
    var nu = function (data) {
      return generators.cell(data);
    };
    var nuFrom = function (element) {
      var data = toData(element);
      return nu(data);
    };
    var add = function (element) {
      var replacement = nuFrom(element);
      if (position.get().isNone())
        position.set($_8zi7zzjgjc7tmce9.some(replacement));
      recent = $_8zi7zzjgjc7tmce9.some({
        item: element,
        replacement: replacement
      });
      return replacement;
    };
    var recent = $_8zi7zzjgjc7tmce9.none();
    var getOrInit = function (element, comparator) {
      return recent.fold(function () {
        return add(element);
      }, function (p) {
        return comparator(element, p.item) ? p.replacement : add(element);
      });
    };
    return {
      getOrInit: getOrInit,
      cursor: position.get
    };
  };
  var transform = function (scope, tag) {
    return function (generators) {
      var position = Cell($_8zi7zzjgjc7tmce9.none());
      contract(generators);
      var list = [];
      var find = function (element, comparator) {
        return $_f8juj3jfjc7tmcdy.find(list, function (x) {
          return comparator(x.item, element);
        });
      };
      var makeNew = function (element) {
        var cell = generators.replace(element, tag, { scope: scope });
        list.push({
          item: element,
          sub: cell
        });
        if (position.get().isNone())
          position.set($_8zi7zzjgjc7tmce9.some(cell));
        return cell;
      };
      var replaceOrInit = function (element, comparator) {
        return find(element, comparator).fold(function () {
          return makeNew(element);
        }, function (p) {
          return comparator(element, p.item) ? p.sub : makeNew(element);
        });
      };
      return {
        replaceOrInit: replaceOrInit,
        cursor: position.get
      };
    };
  };
  var merging = function (generators) {
    contract(generators);
    var position = Cell($_8zi7zzjgjc7tmce9.none());
    var combine = function (cell) {
      if (position.get().isNone())
        position.set($_8zi7zzjgjc7tmce9.some(cell));
      return function () {
        var raw = generators.cell({
          element: $_av3vphjhjc7tmcee.constant(cell),
          colspan: $_av3vphjhjc7tmcee.constant(1),
          rowspan: $_av3vphjhjc7tmcee.constant(1)
        });
        $_fsmkrhkojc7tmcmj.remove(raw, 'width');
        $_fsmkrhkojc7tmcmj.remove(cell, 'width');
        return raw;
      };
    };
    return {
      combine: combine,
      cursor: position.get
    };
  };
  var contract = $_ckugobm3jc7tmd06.exactly([
    'cell',
    'row',
    'replace',
    'gap'
  ]);
  var $_9wyfv1m1jc7tmczf = {
    modification: modification,
    transform: transform,
    merging: merging
  };

  var blockList = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'table',
    'thead',
    'tfoot',
    'tbody',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];
  var isList$1 = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_f8juj3jfjc7tmcdy.contains([
      'ol',
      'ul'
    ], tagName);
  };
  var isBlock$1 = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_f8juj3jfjc7tmcdy.contains(blockList, tagName);
  };
  var isFormatting$1 = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_f8juj3jfjc7tmcdy.contains([
      'address',
      'pre',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isHeading$1 = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_f8juj3jfjc7tmcdy.contains([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isContainer$1 = function (universe, item) {
    return $_f8juj3jfjc7tmcdy.contains([
      'div',
      'li',
      'td',
      'th',
      'blockquote',
      'body',
      'caption'
    ], universe.property().name(item));
  };
  var isEmptyTag$1 = function (universe, item) {
    return $_f8juj3jfjc7tmcdy.contains([
      'br',
      'img',
      'hr',
      'input'
    ], universe.property().name(item));
  };
  var isFrame$1 = function (universe, item) {
    return universe.property().name(item) === 'iframe';
  };
  var isInline$1 = function (universe, item) {
    return !(isBlock$1(universe, item) || isEmptyTag$1(universe, item)) && universe.property().name(item) !== 'li';
  };
  var $_8q27kqm6jc7tmd11 = {
    isBlock: isBlock$1,
    isList: isList$1,
    isFormatting: isFormatting$1,
    isHeading: isHeading$1,
    isContainer: isContainer$1,
    isEmptyTag: isEmptyTag$1,
    isFrame: isFrame$1,
    isInline: isInline$1
  };

  var universe$1 = DomUniverse();
  var isBlock = function (element) {
    return $_8q27kqm6jc7tmd11.isBlock(universe$1, element);
  };
  var isList = function (element) {
    return $_8q27kqm6jc7tmd11.isList(universe$1, element);
  };
  var isFormatting = function (element) {
    return $_8q27kqm6jc7tmd11.isFormatting(universe$1, element);
  };
  var isHeading = function (element) {
    return $_8q27kqm6jc7tmd11.isHeading(universe$1, element);
  };
  var isContainer = function (element) {
    return $_8q27kqm6jc7tmd11.isContainer(universe$1, element);
  };
  var isEmptyTag = function (element) {
    return $_8q27kqm6jc7tmd11.isEmptyTag(universe$1, element);
  };
  var isFrame = function (element) {
    return $_8q27kqm6jc7tmd11.isFrame(universe$1, element);
  };
  var isInline = function (element) {
    return $_8q27kqm6jc7tmd11.isInline(universe$1, element);
  };
  var $_fd60svm5jc7tmd0v = {
    isBlock: isBlock,
    isList: isList,
    isFormatting: isFormatting,
    isHeading: isHeading,
    isContainer: isContainer,
    isEmptyTag: isEmptyTag,
    isFrame: isFrame,
    isInline: isInline
  };

  var merge = function (cells) {
    var isBr = function (el) {
      return $_fxq8yvkgjc7tmcl4.name(el) === 'br';
    };
    var advancedBr = function (children) {
      return $_f8juj3jfjc7tmcdy.forall(children, function (c) {
        return isBr(c) || $_fxq8yvkgjc7tmcl4.isText(c) && $_asu5ztkxjc7tmcp2.get(c).trim().length === 0;
      });
    };
    var isListItem = function (el) {
      return $_fxq8yvkgjc7tmcl4.name(el) === 'li' || $_39ujfjkljc7tmclp.ancestor(el, $_fd60svm5jc7tmd0v.isList).isSome();
    };
    var siblingIsBlock = function (el) {
      return $_66uz4xjwjc7tmcib.nextSibling(el).map(function (rightSibling) {
        if ($_fd60svm5jc7tmd0v.isBlock(rightSibling))
          return true;
        if ($_fd60svm5jc7tmd0v.isEmptyTag(rightSibling)) {
          return $_fxq8yvkgjc7tmcl4.name(rightSibling) === 'img' ? false : true;
        }
      }).getOr(false);
    };
    var markCell = function (cell) {
      return $_1c60c4kvjc7tmcoq.last(cell).bind(function (rightEdge) {
        var rightSiblingIsBlock = siblingIsBlock(rightEdge);
        return $_66uz4xjwjc7tmcib.parent(rightEdge).map(function (parent) {
          return rightSiblingIsBlock === true || isListItem(parent) || isBr(rightEdge) || $_fd60svm5jc7tmd0v.isBlock(parent) && !$_4co3lyjyjc7tmciu.eq(cell, parent) ? [] : [$_2bd3y0jujc7tmci2.fromTag('br')];
        });
      }).getOr([]);
    };
    var markContent = function () {
      var content = $_f8juj3jfjc7tmcdy.bind(cells, function (cell) {
        var children = $_66uz4xjwjc7tmcib.children(cell);
        return advancedBr(children) ? [] : children.concat(markCell(cell));
      });
      return content.length === 0 ? [$_2bd3y0jujc7tmci2.fromTag('br')] : content;
    };
    var contents = markContent();
    $_t0op8krjc7tmcnd.empty(cells[0]);
    $_bl9vkjksjc7tmcnj.append(cells[0], contents);
  };
  var $_8umiugm4jc7tmd0b = { merge: merge };

  var shallow$1 = function (old, nu) {
    return nu;
  };
  var deep$1 = function (old, nu) {
    var bothObjects = $_diovd6jojc7tmcg3.isObject(old) && $_diovd6jojc7tmcg3.isObject(nu);
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
  var deepMerge = baseMerge(deep$1);
  var merge$1 = baseMerge(shallow$1);
  var $_arzln8m8jc7tmd1o = {
    deepMerge: deepMerge,
    merge: merge$1
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
    return $_8zi7zzjgjc7tmce9.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_8zi7zzjgjc7tmce9.none();
      }
    }
    return $_8zi7zzjgjc7tmce9.some(f.apply(null, r));
  };
  var $_b9kaemm9jc7tmd1q = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var addCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    var before = cells.slice(0, index);
    var after = cells.slice(index);
    var newCells = before.concat([cell]).concat(after);
    return setCells(gridRow, newCells);
  };
  var mutateCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    cells[index] = cell;
  };
  var setCells = function (gridRow, cells) {
    return $_5q87xujqjc7tmcgj.rowcells(cells, gridRow.section());
  };
  var mapCells = function (gridRow, f) {
    var cells = gridRow.cells();
    var r = $_f8juj3jfjc7tmcdy.map(cells, f);
    return $_5q87xujqjc7tmcgj.rowcells(r, gridRow.section());
  };
  var getCell = function (gridRow, index) {
    return gridRow.cells()[index];
  };
  var getCellElement = function (gridRow, index) {
    return getCell(gridRow, index).element();
  };
  var cellLength = function (gridRow) {
    return gridRow.cells().length;
  };
  var $_ecx0ypmcjc7tmd2a = {
    addCell: addCell,
    setCells: setCells,
    mutateCell: mutateCell,
    getCell: getCell,
    getCellElement: getCellElement,
    mapCells: mapCells,
    cellLength: cellLength
  };

  var getColumn = function (grid, index) {
    return $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      return $_ecx0ypmcjc7tmd2a.getCell(row, index);
    });
  };
  var getRow = function (grid, index) {
    return grid[index];
  };
  var findDiff = function (xs, comp) {
    if (xs.length === 0)
      return 0;
    var first = xs[0];
    var index = $_f8juj3jfjc7tmcdy.findIndex(xs, function (x) {
      return !comp(first.element(), x.element());
    });
    return index.fold(function () {
      return xs.length;
    }, function (ind) {
      return ind;
    });
  };
  var subgrid = function (grid, row, column, comparator) {
    var restOfRow = getRow(grid, row).cells().slice(column);
    var endColIndex = findDiff(restOfRow, comparator);
    var restOfColumn = getColumn(grid, column).slice(row);
    var endRowIndex = findDiff(restOfColumn, comparator);
    return {
      colspan: $_av3vphjhjc7tmcee.constant(endColIndex),
      rowspan: $_av3vphjhjc7tmcee.constant(endRowIndex)
    };
  };
  var $_aed876mbjc7tmd22 = { subgrid: subgrid };

  var toDetails = function (grid, comparator) {
    var seen = $_f8juj3jfjc7tmcdy.map(grid, function (row, ri) {
      return $_f8juj3jfjc7tmcdy.map(row.cells(), function (col, ci) {
        return false;
      });
    });
    var updateSeen = function (ri, ci, rowspan, colspan) {
      for (var r = ri; r < ri + rowspan; r++) {
        for (var c = ci; c < ci + colspan; c++) {
          seen[r][c] = true;
        }
      }
    };
    return $_f8juj3jfjc7tmcdy.map(grid, function (row, ri) {
      var details = $_f8juj3jfjc7tmcdy.bind(row.cells(), function (cell, ci) {
        if (seen[ri][ci] === false) {
          var result = $_aed876mbjc7tmd22.subgrid(grid, ri, ci, comparator);
          updateSeen(ri, ci, result.rowspan(), result.colspan());
          return [$_5q87xujqjc7tmcgj.detailnew(cell.element(), result.rowspan(), result.colspan(), cell.isNew())];
        } else {
          return [];
        }
      });
      return $_5q87xujqjc7tmcgj.rowdetails(details, row.section());
    });
  };
  var toGrid = function (warehouse, generators, isNew) {
    var grid = [];
    for (var i = 0; i < warehouse.grid().rows(); i++) {
      var rowCells = [];
      for (var j = 0; j < warehouse.grid().columns(); j++) {
        var element = $_erfiqhknjc7tmcm8.getAt(warehouse, i, j).map(function (item) {
          return $_5q87xujqjc7tmcgj.elementnew(item.element(), isNew);
        }).getOrThunk(function () {
          return $_5q87xujqjc7tmcgj.elementnew(generators.gap(), true);
        });
        rowCells.push(element);
      }
      var row = $_5q87xujqjc7tmcgj.rowcells(rowCells, warehouse.all()[i].section());
      grid.push(row);
    }
    return grid;
  };
  var $_2uz4g9majc7tmd1u = {
    toDetails: toDetails,
    toGrid: toGrid
  };

  var setIfNot = function (element, property, value, ignore) {
    if (value === ignore)
      $_9o3gmekfjc7tmckw.remove(element, property);
    else
      $_9o3gmekfjc7tmckw.set(element, property, value);
  };
  var render$1 = function (table, grid) {
    var newRows = [];
    var newCells = [];
    var renderSection = function (gridSection, sectionName) {
      var section = $_ft53o4kkjc7tmcln.child(table, sectionName).getOrThunk(function () {
        var tb = $_2bd3y0jujc7tmci2.fromTag(sectionName, $_66uz4xjwjc7tmcib.owner(table).dom());
        $_bayouwkqjc7tmcn9.append(table, tb);
        return tb;
      });
      $_t0op8krjc7tmcnd.empty(section);
      var rows = $_f8juj3jfjc7tmcdy.map(gridSection, function (row) {
        if (row.isNew()) {
          newRows.push(row.element());
        }
        var tr = row.element();
        $_t0op8krjc7tmcnd.empty(tr);
        $_f8juj3jfjc7tmcdy.each(row.cells(), function (cell) {
          if (cell.isNew()) {
            newCells.push(cell.element());
          }
          setIfNot(cell.element(), 'colspan', cell.colspan(), 1);
          setIfNot(cell.element(), 'rowspan', cell.rowspan(), 1);
          $_bayouwkqjc7tmcn9.append(tr, cell.element());
        });
        return tr;
      });
      $_bl9vkjksjc7tmcnj.append(section, rows);
    };
    var removeSection = function (sectionName) {
      $_ft53o4kkjc7tmcln.child(table, sectionName).bind($_t0op8krjc7tmcnd.remove);
    };
    var renderOrRemoveSection = function (gridSection, sectionName) {
      if (gridSection.length > 0) {
        renderSection(gridSection, sectionName);
      } else {
        removeSection(sectionName);
      }
    };
    var headSection = [];
    var bodySection = [];
    var footSection = [];
    $_f8juj3jfjc7tmcdy.each(grid, function (row) {
      switch (row.section()) {
      case 'thead':
        headSection.push(row);
        break;
      case 'tbody':
        bodySection.push(row);
        break;
      case 'tfoot':
        footSection.push(row);
        break;
      }
    });
    renderOrRemoveSection(headSection, 'thead');
    renderOrRemoveSection(bodySection, 'tbody');
    renderOrRemoveSection(footSection, 'tfoot');
    return {
      newRows: $_av3vphjhjc7tmcee.constant(newRows),
      newCells: $_av3vphjhjc7tmcee.constant(newCells)
    };
  };
  var copy$2 = function (grid) {
    var rows = $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      var tr = $_3eftumkujc7tmcok.shallow(row.element());
      $_f8juj3jfjc7tmcdy.each(row.cells(), function (cell) {
        var clonedCell = $_3eftumkujc7tmcok.deep(cell.element());
        setIfNot(clonedCell, 'colspan', cell.colspan(), 1);
        setIfNot(clonedCell, 'rowspan', cell.rowspan(), 1);
        $_bayouwkqjc7tmcn9.append(tr, clonedCell);
      });
      return tr;
    });
    return rows;
  };
  var $_g3xdw8mdjc7tmd2g = {
    render: render$1,
    copy: copy$2
  };

  var repeat = function (repititions, f) {
    var r = [];
    for (var i = 0; i < repititions; i++) {
      r.push(f(i));
    }
    return r;
  };
  var range$1 = function (start, end) {
    var r = [];
    for (var i = start; i < end; i++) {
      r.push(i);
    }
    return r;
  };
  var unique = function (xs, comparator) {
    var result = [];
    $_f8juj3jfjc7tmcdy.each(xs, function (x, i) {
      if (i < xs.length - 1 && !comparator(x, xs[i + 1])) {
        result.push(x);
      } else if (i === xs.length - 1) {
        result.push(x);
      }
    });
    return result;
  };
  var deduce = function (xs, index) {
    if (index < 0 || index >= xs.length - 1)
      return $_8zi7zzjgjc7tmce9.none();
    var current = xs[index].fold(function () {
      var rest = $_f8juj3jfjc7tmcdy.reverse(xs.slice(0, index));
      return $_b9kaemm9jc7tmd1q.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (c) {
      return $_8zi7zzjgjc7tmce9.some({
        value: c,
        delta: 0
      });
    });
    var next = xs[index + 1].fold(function () {
      var rest = xs.slice(index + 1);
      return $_b9kaemm9jc7tmd1q.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (n) {
      return $_8zi7zzjgjc7tmce9.some({
        value: n,
        delta: 1
      });
    });
    return current.bind(function (c) {
      return next.map(function (n) {
        var extras = n.delta + c.delta;
        return Math.abs(n.value - c.value) / extras;
      });
    });
  };
  var $_bqyotjmgjc7tmd3w = {
    repeat: repeat,
    range: range$1,
    unique: unique,
    deduce: deduce
  };

  var columns = function (warehouse) {
    var grid = warehouse.grid();
    var cols = $_bqyotjmgjc7tmd3w.range(0, grid.columns());
    var rows = $_bqyotjmgjc7tmd3w.range(0, grid.rows());
    return $_f8juj3jfjc7tmcdy.map(cols, function (col) {
      var getBlock = function () {
        return $_f8juj3jfjc7tmcdy.bind(rows, function (r) {
          return $_erfiqhknjc7tmcm8.getAt(warehouse, r, col).filter(function (detail) {
            return detail.column() === col;
          }).fold($_av3vphjhjc7tmcee.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.colspan() === 1;
      };
      var getFallback = function () {
        return $_erfiqhknjc7tmcm8.getAt(warehouse, 0, col);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var decide = function (getBlock, isSingle, getFallback) {
    var inBlock = getBlock();
    var singleInBlock = $_f8juj3jfjc7tmcdy.find(inBlock, isSingle);
    var detailOption = singleInBlock.orThunk(function () {
      return $_8zi7zzjgjc7tmce9.from(inBlock[0]).orThunk(getFallback);
    });
    return detailOption.map(function (detail) {
      return detail.element();
    });
  };
  var rows$1 = function (warehouse) {
    var grid = warehouse.grid();
    var rows = $_bqyotjmgjc7tmd3w.range(0, grid.rows());
    var cols = $_bqyotjmgjc7tmd3w.range(0, grid.columns());
    return $_f8juj3jfjc7tmcdy.map(rows, function (row) {
      var getBlock = function () {
        return $_f8juj3jfjc7tmcdy.bind(cols, function (c) {
          return $_erfiqhknjc7tmcm8.getAt(warehouse, row, c).filter(function (detail) {
            return detail.row() === row;
          }).fold($_av3vphjhjc7tmcee.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.rowspan() === 1;
      };
      var getFallback = function () {
        return $_erfiqhknjc7tmcm8.getAt(warehouse, row, 0);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var $_5u333smfjc7tmd3o = {
    columns: columns,
    rows: rows$1
  };

  var col = function (column, x, y, w, h) {
    var blocker = $_2bd3y0jujc7tmci2.fromTag('div');
    $_fsmkrhkojc7tmcmj.setAll(blocker, {
      position: 'absolute',
      left: x - w / 2 + 'px',
      top: y + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_9o3gmekfjc7tmckw.setAll(blocker, {
      'data-column': column,
      'role': 'presentation'
    });
    return blocker;
  };
  var row$1 = function (row, x, y, w, h) {
    var blocker = $_2bd3y0jujc7tmci2.fromTag('div');
    $_fsmkrhkojc7tmcmj.setAll(blocker, {
      position: 'absolute',
      left: x + 'px',
      top: y - h / 2 + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_9o3gmekfjc7tmckw.setAll(blocker, {
      'data-row': row,
      'role': 'presentation'
    });
    return blocker;
  };
  var $_fbff0lmhjc7tmd47 = {
    col: col,
    row: row$1
  };

  var css = function (namespace) {
    var dashNamespace = namespace.replace(/\./g, '-');
    var resolve = function (str) {
      return dashNamespace + '-' + str;
    };
    return { resolve: resolve };
  };
  var $_fh1jgimjjc7tmd4m = { css: css };

  var styles = $_fh1jgimjjc7tmd4m.css('ephox-snooker');
  var $_2ejmldmijc7tmd4h = { resolve: styles.resolve };

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

  var read = function (element, attr) {
    var value = $_9o3gmekfjc7tmckw.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add$2 = function (element, attr, id) {
    var old = read(element, attr);
    var nu = old.concat([id]);
    $_9o3gmekfjc7tmckw.set(element, attr, nu.join(' '));
  };
  var remove$5 = function (element, attr, id) {
    var nu = $_f8juj3jfjc7tmcdy.filter(read(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_9o3gmekfjc7tmckw.set(element, attr, nu.join(' '));
    else
      $_9o3gmekfjc7tmckw.remove(element, attr);
  };
  var $_62vhr2mnjc7tmd5a = {
    read: read,
    add: add$2,
    remove: remove$5
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$7 = function (element) {
    return $_62vhr2mnjc7tmd5a.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_62vhr2mnjc7tmd5a.add(element, 'class', clazz);
  };
  var remove$4 = function (element, clazz) {
    return $_62vhr2mnjc7tmd5a.remove(element, 'class', clazz);
  };
  var toggle$1 = function (element, clazz) {
    if ($_f8juj3jfjc7tmcdy.contains(get$7(element), clazz)) {
      remove$4(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_a18qkhmmjc7tmd51 = {
    get: get$7,
    add: add$1,
    remove: remove$4,
    toggle: toggle$1,
    supports: supports
  };

  var add = function (element, clazz) {
    if ($_a18qkhmmjc7tmd51.supports(element))
      element.dom().classList.add(clazz);
    else
      $_a18qkhmmjc7tmd51.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_a18qkhmmjc7tmd51.supports(element) ? element.dom().classList : $_a18qkhmmjc7tmd51.get(element);
    if (classList.length === 0) {
      $_9o3gmekfjc7tmckw.remove(element, 'class');
    }
  };
  var remove$3 = function (element, clazz) {
    if ($_a18qkhmmjc7tmd51.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_a18qkhmmjc7tmd51.remove(element, clazz);
    cleanClass(element);
  };
  var toggle = function (element, clazz) {
    return $_a18qkhmmjc7tmd51.supports(element) ? element.dom().classList.toggle(clazz) : $_a18qkhmmjc7tmd51.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_a18qkhmmjc7tmd51.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_a18qkhmmjc7tmd51.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_a18qkhmmjc7tmd51.add(element, clazz);
    };
    return Toggler(off, on, has$1(element, clazz));
  };
  var has$1 = function (element, clazz) {
    return $_a18qkhmmjc7tmd51.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_7rzfb6mkjc7tmd4q = {
    add: add,
    remove: remove$3,
    toggle: toggle,
    toggler: toggler,
    has: has$1
  };

  var resizeBar = $_2ejmldmijc7tmd4h.resolve('resizer-bar');
  var resizeRowBar = $_2ejmldmijc7tmd4h.resolve('resizer-rows');
  var resizeColBar = $_2ejmldmijc7tmd4h.resolve('resizer-cols');
  var BAR_THICKNESS = 7;
  var clear = function (wire) {
    var previous = $_7y6210khjc7tmcl8.descendants(wire.parent(), '.' + resizeBar);
    $_f8juj3jfjc7tmcdy.each(previous, $_t0op8krjc7tmcnd.remove);
  };
  var drawBar = function (wire, positions, create) {
    var origin = wire.origin();
    $_f8juj3jfjc7tmcdy.each(positions, function (cpOption, i) {
      cpOption.each(function (cp) {
        var bar = create(origin, cp);
        $_7rzfb6mkjc7tmd4q.add(bar, resizeBar);
        $_bayouwkqjc7tmcn9.append(wire.parent(), bar);
      });
    });
  };
  var refreshCol = function (wire, colPositions, position, tableHeight) {
    drawBar(wire, colPositions, function (origin, cp) {
      var colBar = $_fbff0lmhjc7tmd47.col(cp.col(), cp.x() - origin.left(), position.top() - origin.top(), BAR_THICKNESS, tableHeight);
      $_7rzfb6mkjc7tmd4q.add(colBar, resizeColBar);
      return colBar;
    });
  };
  var refreshRow = function (wire, rowPositions, position, tableWidth) {
    drawBar(wire, rowPositions, function (origin, cp) {
      var rowBar = $_fbff0lmhjc7tmd47.row(cp.row(), position.left() - origin.left(), cp.y() - origin.top(), tableWidth, BAR_THICKNESS);
      $_7rzfb6mkjc7tmd4q.add(rowBar, resizeRowBar);
      return rowBar;
    });
  };
  var refreshGrid = function (wire, table, rows, cols, hdirection, vdirection) {
    var position = $_ad66zylwjc7tmcyc.absolute(table);
    var rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : [];
    refreshRow(wire, rowPositions, position, $_7w15eclsjc7tmcxq.getOuter(table));
    var colPositions = cols.length > 0 ? vdirection.positions(cols, table) : [];
    refreshCol(wire, colPositions, position, $_2t70lglqjc7tmcxc.getOuter(table));
  };
  var refresh = function (wire, table, hdirection, vdirection) {
    clear(wire);
    var list = $_2baam5jpjc7tmcg8.fromTable(table);
    var warehouse = $_erfiqhknjc7tmcm8.generate(list);
    var rows = $_5u333smfjc7tmd3o.rows(warehouse);
    var cols = $_5u333smfjc7tmd3o.columns(warehouse);
    refreshGrid(wire, table, rows, cols, hdirection, vdirection);
  };
  var each$2 = function (wire, f) {
    var bars = $_7y6210khjc7tmcl8.descendants(wire.parent(), '.' + resizeBar);
    $_f8juj3jfjc7tmcdy.each(bars, f);
  };
  var hide = function (wire) {
    each$2(wire, function (bar) {
      $_fsmkrhkojc7tmcmj.set(bar, 'display', 'none');
    });
  };
  var show = function (wire) {
    each$2(wire, function (bar) {
      $_fsmkrhkojc7tmcmj.set(bar, 'display', 'block');
    });
  };
  var isRowBar = function (element) {
    return $_7rzfb6mkjc7tmd4q.has(element, resizeRowBar);
  };
  var isColBar = function (element) {
    return $_7rzfb6mkjc7tmd4q.has(element, resizeColBar);
  };
  var $_f8gh8gmejc7tmd38 = {
    refresh: refresh,
    hide: hide,
    show: show,
    destroy: clear,
    isRowBar: isRowBar,
    isColBar: isColBar
  };

  var fromWarehouse = function (warehouse, generators) {
    return $_2uz4g9majc7tmd1u.toGrid(warehouse, generators, false);
  };
  var deriveRows = function (rendered, generators) {
    var findRow = function (details) {
      var rowOfCells = $_b9kaemm9jc7tmd1q.findMap(details, function (detail) {
        return $_66uz4xjwjc7tmcib.parent(detail.element()).map(function (row) {
          var isNew = $_66uz4xjwjc7tmcib.parent(row).isNone();
          return $_5q87xujqjc7tmcgj.elementnew(row, isNew);
        });
      });
      return rowOfCells.getOrThunk(function () {
        return $_5q87xujqjc7tmcgj.elementnew(generators.row(), true);
      });
    };
    return $_f8juj3jfjc7tmcdy.map(rendered, function (details) {
      var row = findRow(details.details());
      return $_5q87xujqjc7tmcgj.rowdatanew(row.element(), details.details(), details.section(), row.isNew());
    });
  };
  var toDetailList = function (grid, generators) {
    var rendered = $_2uz4g9majc7tmd1u.toDetails(grid, $_4co3lyjyjc7tmciu.eq);
    return deriveRows(rendered, generators);
  };
  var findInWarehouse = function (warehouse, element) {
    var all = $_f8juj3jfjc7tmcdy.flatten($_f8juj3jfjc7tmcdy.map(warehouse.all(), function (r) {
      return r.cells();
    }));
    return $_f8juj3jfjc7tmcdy.find(all, function (e) {
      return $_4co3lyjyjc7tmciu.eq(element, e.element());
    });
  };
  var run = function (operation, extract, adjustment, postAction, genWrappers) {
    return function (wire, table, target, generators, direction) {
      var input = $_2baam5jpjc7tmcg8.fromTable(table);
      var warehouse = $_erfiqhknjc7tmcm8.generate(input);
      var output = extract(warehouse, target).map(function (info) {
        var model = fromWarehouse(warehouse, generators);
        var result = operation(model, info, $_4co3lyjyjc7tmciu.eq, genWrappers(generators));
        var grid = toDetailList(result.grid(), generators);
        return {
          grid: $_av3vphjhjc7tmcee.constant(grid),
          cursor: result.cursor
        };
      });
      return output.fold(function () {
        return $_8zi7zzjgjc7tmce9.none();
      }, function (out) {
        var newElements = $_g3xdw8mdjc7tmd2g.render(table, out.grid());
        adjustment(table, out.grid(), direction);
        postAction(table);
        $_f8gh8gmejc7tmd38.refresh(wire, table, $_a2g1falvjc7tmcy2.height, direction);
        return $_8zi7zzjgjc7tmce9.some({
          cursor: out.cursor,
          newRows: newElements.newRows,
          newCells: newElements.newCells
        });
      });
    };
  };
  var onCell = function (warehouse, target) {
    return $_dvsb29jrjc7tmcgo.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell);
    });
  };
  var onPaste = function (warehouse, target) {
    return $_dvsb29jrjc7tmcgo.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell).map(function (details) {
        return $_arzln8m8jc7tmd1o.merge(details, {
          generators: target.generators,
          clipboard: target.clipboard
        });
      });
    });
  };
  var onPasteRows = function (warehouse, target) {
    var details = $_f8juj3jfjc7tmcdy.map(target.selection(), function (cell) {
      return $_dvsb29jrjc7tmcgo.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_b9kaemm9jc7tmd1q.cat(details);
    return cells.length > 0 ? $_8zi7zzjgjc7tmce9.some($_arzln8m8jc7tmd1o.merge({ cells: cells }, {
      generators: target.generators,
      clipboard: target.clipboard
    })) : $_8zi7zzjgjc7tmce9.none();
  };
  var onMergable = function (warehouse, target) {
    return target.mergable();
  };
  var onUnmergable = function (warehouse, target) {
    return target.unmergable();
  };
  var onCells = function (warehouse, target) {
    var details = $_f8juj3jfjc7tmcdy.map(target.selection(), function (cell) {
      return $_dvsb29jrjc7tmcgo.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_b9kaemm9jc7tmd1q.cat(details);
    return cells.length > 0 ? $_8zi7zzjgjc7tmce9.some(cells) : $_8zi7zzjgjc7tmce9.none();
  };
  var $_3xv11em7jc7tmd1b = {
    run: run,
    toDetailList: toDetailList,
    onCell: onCell,
    onCells: onCells,
    onPaste: onPaste,
    onPasteRows: onPasteRows,
    onMergable: onMergable,
    onUnmergable: onUnmergable
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
      return $_8zi7zzjgjc7tmce9.some(o);
    };
    return {
      is: is,
      isValue: $_av3vphjhjc7tmcee.constant(true),
      isError: $_av3vphjhjc7tmcee.constant(false),
      getOr: $_av3vphjhjc7tmcee.constant(o),
      getOrThunk: $_av3vphjhjc7tmcee.constant(o),
      getOrDie: $_av3vphjhjc7tmcee.constant(o),
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
      return $_av3vphjhjc7tmcee.die(message)();
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
      is: $_av3vphjhjc7tmcee.constant(false),
      isValue: $_av3vphjhjc7tmcee.constant(false),
      isError: $_av3vphjhjc7tmcee.constant(true),
      getOr: $_av3vphjhjc7tmcee.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_av3vphjhjc7tmcee.noop,
      bind: bind,
      exists: $_av3vphjhjc7tmcee.constant(false),
      forall: $_av3vphjhjc7tmcee.constant(true),
      toOption: $_8zi7zzjgjc7tmce9.none
    };
  };
  var $_4ash9amqjc7tmd67 = {
    value: value$1,
    error: error
  };

  var measure = function (startAddress, gridA, gridB) {
    if (startAddress.row() >= gridA.length || startAddress.column() > $_ecx0ypmcjc7tmd2a.cellLength(gridA[0]))
      return $_4ash9amqjc7tmd67.error('invalid start address out of table bounds, row: ' + startAddress.row() + ', column: ' + startAddress.column());
    var rowRemainder = gridA.slice(startAddress.row());
    var colRemainder = rowRemainder[0].cells().slice(startAddress.column());
    var colRequired = $_ecx0ypmcjc7tmd2a.cellLength(gridB[0]);
    var rowRequired = gridB.length;
    return $_4ash9amqjc7tmd67.value({
      rowDelta: $_av3vphjhjc7tmcee.constant(rowRemainder.length - rowRequired),
      colDelta: $_av3vphjhjc7tmcee.constant(colRemainder.length - colRequired)
    });
  };
  var measureWidth = function (gridA, gridB) {
    var colLengthA = $_ecx0ypmcjc7tmd2a.cellLength(gridA[0]);
    var colLengthB = $_ecx0ypmcjc7tmd2a.cellLength(gridB[0]);
    return {
      rowDelta: $_av3vphjhjc7tmcee.constant(0),
      colDelta: $_av3vphjhjc7tmcee.constant(colLengthA - colLengthB)
    };
  };
  var fill = function (cells, generator) {
    return $_f8juj3jfjc7tmcdy.map(cells, function () {
      return $_5q87xujqjc7tmcgj.elementnew(generator.cell(), true);
    });
  };
  var rowFill = function (grid, amount, generator) {
    return grid.concat($_bqyotjmgjc7tmd3w.repeat(amount, function (_row) {
      return $_ecx0ypmcjc7tmd2a.setCells(grid[grid.length - 1], fill(grid[grid.length - 1].cells(), generator));
    }));
  };
  var colFill = function (grid, amount, generator) {
    return $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      return $_ecx0ypmcjc7tmd2a.setCells(row, row.cells().concat(fill($_bqyotjmgjc7tmd3w.range(0, amount), generator)));
    });
  };
  var tailor = function (gridA, delta, generator) {
    var fillCols = delta.colDelta() < 0 ? colFill : $_av3vphjhjc7tmcee.identity;
    var fillRows = delta.rowDelta() < 0 ? rowFill : $_av3vphjhjc7tmcee.identity;
    var modifiedCols = fillCols(gridA, Math.abs(delta.colDelta()), generator);
    var tailoredGrid = fillRows(modifiedCols, Math.abs(delta.rowDelta()), generator);
    return tailoredGrid;
  };
  var $_f09doxmpjc7tmd5x = {
    measure: measure,
    measureWidth: measureWidth,
    tailor: tailor
  };

  var merge$3 = function (grid, bounds, comparator, substitution) {
    if (grid.length === 0)
      return grid;
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        $_ecx0ypmcjc7tmd2a.mutateCell(grid[i], j, $_5q87xujqjc7tmcgj.elementnew(substitution(), false));
      }
    }
    return grid;
  };
  var unmerge = function (grid, target, comparator, substitution) {
    var first = true;
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < $_ecx0ypmcjc7tmd2a.cellLength(grid[0]); j++) {
        var current = $_ecx0ypmcjc7tmd2a.getCellElement(grid[i], j);
        var isToReplace = comparator(current, target);
        if (isToReplace === true && first === false) {
          $_ecx0ypmcjc7tmd2a.mutateCell(grid[i], j, $_5q87xujqjc7tmcgj.elementnew(substitution(), true));
        } else if (isToReplace === true) {
          first = false;
        }
      }
    }
    return grid;
  };
  var uniqueCells = function (row, comparator) {
    return $_f8juj3jfjc7tmcdy.foldl(row, function (rest, cell) {
      return $_f8juj3jfjc7tmcdy.exists(rest, function (currentCell) {
        return comparator(currentCell.element(), cell.element());
      }) ? rest : rest.concat([cell]);
    }, []);
  };
  var splitRows = function (grid, index, comparator, substitution) {
    if (index > 0 && index < grid.length) {
      var rowPrevCells = grid[index - 1].cells();
      var cells = uniqueCells(rowPrevCells, comparator);
      $_f8juj3jfjc7tmcdy.each(cells, function (cell) {
        var replacement = $_8zi7zzjgjc7tmce9.none();
        for (var i = index; i < grid.length; i++) {
          for (var j = 0; j < $_ecx0ypmcjc7tmd2a.cellLength(grid[0]); j++) {
            var current = grid[i].cells()[j];
            var isToReplace = comparator(current.element(), cell.element());
            if (isToReplace) {
              if (replacement.isNone()) {
                replacement = $_8zi7zzjgjc7tmce9.some(substitution());
              }
              replacement.each(function (sub) {
                $_ecx0ypmcjc7tmd2a.mutateCell(grid[i], j, $_5q87xujqjc7tmcgj.elementnew(sub, true));
              });
            }
          }
        }
      });
    }
    return grid;
  };
  var $_6vv5qimrjc7tmd6c = {
    merge: merge$3,
    unmerge: unmerge,
    splitRows: splitRows
  };

  var isSpanning = function (grid, row, col, comparator) {
    var candidate = $_ecx0ypmcjc7tmd2a.getCell(grid[row], col);
    var matching = $_av3vphjhjc7tmcee.curry(comparator, candidate.element());
    var currentRow = grid[row];
    return grid.length > 1 && $_ecx0ypmcjc7tmd2a.cellLength(currentRow) > 1 && (col > 0 && matching($_ecx0ypmcjc7tmd2a.getCellElement(currentRow, col - 1)) || col < currentRow.length - 1 && matching($_ecx0ypmcjc7tmd2a.getCellElement(currentRow, col + 1)) || row > 0 && matching($_ecx0ypmcjc7tmd2a.getCellElement(grid[row - 1], col)) || row < grid.length - 1 && matching($_ecx0ypmcjc7tmd2a.getCellElement(grid[row + 1], col)));
  };
  var mergeTables = function (startAddress, gridA, gridB, generator, comparator) {
    var startRow = startAddress.row();
    var startCol = startAddress.column();
    var mergeHeight = gridB.length;
    var mergeWidth = $_ecx0ypmcjc7tmd2a.cellLength(gridB[0]);
    var endRow = startRow + mergeHeight;
    var endCol = startCol + mergeWidth;
    for (var r = startRow; r < endRow; r++) {
      for (var c = startCol; c < endCol; c++) {
        if (isSpanning(gridA, r, c, comparator)) {
          $_6vv5qimrjc7tmd6c.unmerge(gridA, $_ecx0ypmcjc7tmd2a.getCellElement(gridA[r], c), comparator, generator.cell);
        }
        var newCell = $_ecx0ypmcjc7tmd2a.getCellElement(gridB[r - startRow], c - startCol);
        var replacement = generator.replace(newCell);
        $_ecx0ypmcjc7tmd2a.mutateCell(gridA[r], c, $_5q87xujqjc7tmcgj.elementnew(replacement, true));
      }
    }
    return gridA;
  };
  var merge$2 = function (startAddress, gridA, gridB, generator, comparator) {
    var result = $_f09doxmpjc7tmd5x.measure(startAddress, gridA, gridB);
    return result.map(function (delta) {
      var fittedGrid = $_f09doxmpjc7tmd5x.tailor(gridA, delta, generator);
      return mergeTables(startAddress, fittedGrid, gridB, generator, comparator);
    });
  };
  var insert$1 = function (index, gridA, gridB, generator, comparator) {
    $_6vv5qimrjc7tmd6c.splitRows(gridA, index, comparator, generator.cell);
    var delta = $_f09doxmpjc7tmd5x.measureWidth(gridB, gridA);
    var fittedNewGrid = $_f09doxmpjc7tmd5x.tailor(gridB, delta, generator);
    var secondDelta = $_f09doxmpjc7tmd5x.measureWidth(gridA, fittedNewGrid);
    var fittedOldGrid = $_f09doxmpjc7tmd5x.tailor(gridA, secondDelta, generator);
    return fittedOldGrid.slice(0, index).concat(fittedNewGrid).concat(fittedOldGrid.slice(index, fittedOldGrid.length));
  };
  var $_8gkd5tmojc7tmd5m = {
    merge: merge$2,
    insert: insert$1
  };

  var insertRowAt = function (grid, index, example, comparator, substitution) {
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_ecx0ypmcjc7tmd2a.mapCells(grid[example], function (ex, c) {
      var withinSpan = index > 0 && index < grid.length && comparator($_ecx0ypmcjc7tmd2a.getCellElement(grid[index - 1], c), $_ecx0ypmcjc7tmd2a.getCellElement(grid[index], c));
      var ret = withinSpan ? $_ecx0ypmcjc7tmd2a.getCell(grid[index], c) : $_5q87xujqjc7tmcgj.elementnew(substitution(ex.element(), comparator), true);
      return ret;
    });
    return before.concat([between]).concat(after);
  };
  var insertColumnAt = function (grid, index, example, comparator, substitution) {
    return $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      var withinSpan = index > 0 && index < $_ecx0ypmcjc7tmd2a.cellLength(row) && comparator($_ecx0ypmcjc7tmd2a.getCellElement(row, index - 1), $_ecx0ypmcjc7tmd2a.getCellElement(row, index));
      var sub = withinSpan ? $_ecx0ypmcjc7tmd2a.getCell(row, index) : $_5q87xujqjc7tmcgj.elementnew(substitution($_ecx0ypmcjc7tmd2a.getCellElement(row, example), comparator), true);
      return $_ecx0ypmcjc7tmd2a.addCell(row, index, sub);
    });
  };
  var splitCellIntoColumns$1 = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleCol + 1;
    return $_f8juj3jfjc7tmcdy.map(grid, function (row, i) {
      var isTargetCell = i === exampleRow;
      var sub = isTargetCell ? $_5q87xujqjc7tmcgj.elementnew(substitution($_ecx0ypmcjc7tmd2a.getCellElement(row, exampleCol), comparator), true) : $_ecx0ypmcjc7tmd2a.getCell(row, exampleCol);
      return $_ecx0ypmcjc7tmd2a.addCell(row, index, sub);
    });
  };
  var splitCellIntoRows$1 = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleRow + 1;
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_ecx0ypmcjc7tmd2a.mapCells(grid[exampleRow], function (ex, i) {
      var isTargetCell = i === exampleCol;
      return isTargetCell ? $_5q87xujqjc7tmcgj.elementnew(substitution(ex.element(), comparator), true) : ex;
    });
    return before.concat([between]).concat(after);
  };
  var deleteColumnsAt = function (grid, start, finish) {
    var rows = $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      var cells = row.cells().slice(0, start).concat(row.cells().slice(finish + 1));
      return $_5q87xujqjc7tmcgj.rowcells(cells, row.section());
    });
    return $_f8juj3jfjc7tmcdy.filter(rows, function (row) {
      return row.cells().length > 0;
    });
  };
  var deleteRowsAt = function (grid, start, finish) {
    return grid.slice(0, start).concat(grid.slice(finish + 1));
  };
  var $_a1w0wemsjc7tmd6t = {
    insertRowAt: insertRowAt,
    insertColumnAt: insertColumnAt,
    splitCellIntoColumns: splitCellIntoColumns$1,
    splitCellIntoRows: splitCellIntoRows$1,
    deleteRowsAt: deleteRowsAt,
    deleteColumnsAt: deleteColumnsAt
  };

  var replaceIn = function (grid, targets, comparator, substitution) {
    var isTarget = function (cell) {
      return $_f8juj3jfjc7tmcdy.exists(targets, function (target) {
        return comparator(cell.element(), target.element());
      });
    };
    return $_f8juj3jfjc7tmcdy.map(grid, function (row) {
      return $_ecx0ypmcjc7tmd2a.mapCells(row, function (cell) {
        return isTarget(cell) ? $_5q87xujqjc7tmcgj.elementnew(substitution(cell.element(), comparator), true) : cell;
      });
    });
  };
  var notStartRow = function (grid, rowIndex, colIndex, comparator) {
    return $_ecx0ypmcjc7tmd2a.getCellElement(grid[rowIndex], colIndex) !== undefined && (rowIndex > 0 && comparator($_ecx0ypmcjc7tmd2a.getCellElement(grid[rowIndex - 1], colIndex), $_ecx0ypmcjc7tmd2a.getCellElement(grid[rowIndex], colIndex)));
  };
  var notStartColumn = function (row, index, comparator) {
    return index > 0 && comparator($_ecx0ypmcjc7tmd2a.getCellElement(row, index - 1), $_ecx0ypmcjc7tmd2a.getCellElement(row, index));
  };
  var replaceColumn = function (grid, index, comparator, substitution) {
    var targets = $_f8juj3jfjc7tmcdy.bind(grid, function (row, i) {
      var alreadyAdded = notStartRow(grid, i, index, comparator) || notStartColumn(row, index, comparator);
      return alreadyAdded ? [] : [$_ecx0ypmcjc7tmd2a.getCell(row, index)];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var replaceRow = function (grid, index, comparator, substitution) {
    var targetRow = grid[index];
    var targets = $_f8juj3jfjc7tmcdy.bind(targetRow.cells(), function (item, i) {
      var alreadyAdded = notStartRow(grid, index, i, comparator) || notStartColumn(targetRow, i, comparator);
      return alreadyAdded ? [] : [item];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var $_1wko7umtjc7tmd6z = {
    replaceColumn: replaceColumn,
    replaceRow: replaceRow
  };

  var none$1 = function () {
    return folder(function (n, o, l, m, r) {
      return n();
    });
  };
  var only = function (index) {
    return folder(function (n, o, l, m, r) {
      return o(index);
    });
  };
  var left = function (index, next) {
    return folder(function (n, o, l, m, r) {
      return l(index, next);
    });
  };
  var middle = function (prev, index, next) {
    return folder(function (n, o, l, m, r) {
      return m(prev, index, next);
    });
  };
  var right = function (prev, index) {
    return folder(function (n, o, l, m, r) {
      return r(prev, index);
    });
  };
  var folder = function (fold) {
    return { fold: fold };
  };
  var $_733x3jmwjc7tmd7g = {
    none: none$1,
    only: only,
    left: left,
    middle: middle,
    right: right
  };

  var neighbours$1 = function (input, index) {
    if (input.length === 0)
      return $_733x3jmwjc7tmd7g.none();
    if (input.length === 1)
      return $_733x3jmwjc7tmd7g.only(0);
    if (index === 0)
      return $_733x3jmwjc7tmd7g.left(0, 1);
    if (index === input.length - 1)
      return $_733x3jmwjc7tmd7g.right(index - 1, index);
    if (index > 0 && index < input.length - 1)
      return $_733x3jmwjc7tmd7g.middle(index - 1, index, index + 1);
    return $_733x3jmwjc7tmd7g.none();
  };
  var determine = function (input, column, step, tableSize) {
    var result = input.slice(0);
    var context = neighbours$1(input, column);
    var zero = function (array) {
      return $_f8juj3jfjc7tmcdy.map(array, $_av3vphjhjc7tmcee.constant(0));
    };
    var onNone = $_av3vphjhjc7tmcee.constant(zero(result));
    var onOnly = function (index) {
      return tableSize.singleColumnWidth(result[index], step);
    };
    var onChange = function (index, next) {
      if (step >= 0) {
        var newNext = Math.max(tableSize.minCellWidth(), result[next] - step);
        return zero(result.slice(0, index)).concat([
          step,
          newNext - result[next]
        ]).concat(zero(result.slice(next + 1)));
      } else {
        var newThis = Math.max(tableSize.minCellWidth(), result[index] + step);
        var diffx = result[index] - newThis;
        return zero(result.slice(0, index)).concat([
          newThis - result[index],
          diffx
        ]).concat(zero(result.slice(next + 1)));
      }
    };
    var onLeft = onChange;
    var onMiddle = function (prev, index, next) {
      return onChange(index, next);
    };
    var onRight = function (prev, index) {
      if (step >= 0) {
        return zero(result.slice(0, index)).concat([step]);
      } else {
        var size = Math.max(tableSize.minCellWidth(), result[index] + step);
        return zero(result.slice(0, index)).concat([size - result[index]]);
      }
    };
    return context.fold(onNone, onOnly, onLeft, onMiddle, onRight);
  };
  var $_8gcufpmvjc7tmd7b = { determine: determine };

  var getSpan$1 = function (cell, type) {
    return $_9o3gmekfjc7tmckw.has(cell, type) && parseInt($_9o3gmekfjc7tmckw.get(cell, type), 10) > 1;
  };
  var hasColspan = function (cell) {
    return getSpan$1(cell, 'colspan');
  };
  var hasRowspan = function (cell) {
    return getSpan$1(cell, 'rowspan');
  };
  var getInt = function (element, property) {
    return parseInt($_fsmkrhkojc7tmcmj.get(element, property), 10);
  };
  var $_93q72myjc7tmd7z = {
    hasColspan: hasColspan,
    hasRowspan: hasRowspan,
    minWidth: $_av3vphjhjc7tmcee.constant(10),
    minHeight: $_av3vphjhjc7tmcee.constant(10),
    getInt: getInt
  };

  var getRaw$1 = function (cell, property, getter) {
    return $_fsmkrhkojc7tmcmj.getRaw(cell, property).fold(function () {
      return getter(cell) + 'px';
    }, function (raw) {
      return raw;
    });
  };
  var getRawW = function (cell) {
    return getRaw$1(cell, 'width', $_5fedwxlojc7tmcwd.getPixelWidth);
  };
  var getRawH = function (cell) {
    return getRaw$1(cell, 'height', $_5fedwxlojc7tmcwd.getHeight);
  };
  var getWidthFrom = function (warehouse, direction, getWidth, fallback, tableSize) {
    var columns = $_5u333smfjc7tmd3o.columns(warehouse);
    var backups = $_f8juj3jfjc7tmcdy.map(columns, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_f8juj3jfjc7tmcdy.map(columns, function (cellOption, c) {
      var columnCell = cellOption.filter($_av3vphjhjc7tmcee.not($_93q72myjc7tmd7z.hasColspan));
      return columnCell.fold(function () {
        var deduced = $_bqyotjmgjc7tmd3w.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getWidth(cell, tableSize);
      });
    });
  };
  var getDeduced = function (deduced) {
    return deduced.map(function (d) {
      return d + 'px';
    }).getOr('');
  };
  var getRawWidths = function (warehouse, direction) {
    return getWidthFrom(warehouse, direction, getRawW, getDeduced);
  };
  var getPercentageWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_5fedwxlojc7tmcwd.getPercentageWidth, function (deduced) {
      return deduced.fold(function () {
        return tableSize.minCellWidth();
      }, function (cellWidth) {
        return cellWidth / tableSize.pixelWidth() * 100;
      });
    }, tableSize);
  };
  var getPixelWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_5fedwxlojc7tmcwd.getPixelWidth, function (deduced) {
      return deduced.getOrThunk(tableSize.minCellWidth);
    }, tableSize);
  };
  var getHeightFrom = function (warehouse, direction, getHeight, fallback) {
    var rows = $_5u333smfjc7tmd3o.rows(warehouse);
    var backups = $_f8juj3jfjc7tmcdy.map(rows, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_f8juj3jfjc7tmcdy.map(rows, function (cellOption, c) {
      var rowCell = cellOption.filter($_av3vphjhjc7tmcee.not($_93q72myjc7tmd7z.hasRowspan));
      return rowCell.fold(function () {
        var deduced = $_bqyotjmgjc7tmd3w.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getHeight(cell);
      });
    });
  };
  var getPixelHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, $_5fedwxlojc7tmcwd.getHeight, function (deduced) {
      return deduced.getOrThunk($_93q72myjc7tmd7z.minHeight);
    });
  };
  var getRawHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, getRawH, getDeduced);
  };
  var $_6ytdckmxjc7tmd7o = {
    getRawWidths: getRawWidths,
    getPixelWidths: getPixelWidths,
    getPercentageWidths: getPercentageWidths,
    getPixelHeights: getPixelHeights,
    getRawHeights: getRawHeights
  };

  var total = function (start, end, measures) {
    var r = 0;
    for (var i = start; i < end; i++) {
      r += measures[i] !== undefined ? measures[i] : 0;
    }
    return r;
  };
  var recalculateWidth = function (warehouse, widths) {
    var all = $_erfiqhknjc7tmcm8.justCells(warehouse);
    return $_f8juj3jfjc7tmcdy.map(all, function (cell) {
      var width = total(cell.column(), cell.column() + cell.colspan(), widths);
      return {
        element: cell.element,
        width: $_av3vphjhjc7tmcee.constant(width),
        colspan: cell.colspan
      };
    });
  };
  var recalculateHeight = function (warehouse, heights) {
    var all = $_erfiqhknjc7tmcm8.justCells(warehouse);
    return $_f8juj3jfjc7tmcdy.map(all, function (cell) {
      var height = total(cell.row(), cell.row() + cell.rowspan(), heights);
      return {
        element: cell.element,
        height: $_av3vphjhjc7tmcee.constant(height),
        rowspan: cell.rowspan
      };
    });
  };
  var matchRowHeight = function (warehouse, heights) {
    return $_f8juj3jfjc7tmcdy.map(warehouse.all(), function (row, i) {
      return {
        element: row.element,
        height: $_av3vphjhjc7tmcee.constant(heights[i])
      };
    });
  };
  var $_31kgd2mzjc7tmd8b = {
    recalculateWidth: recalculateWidth,
    recalculateHeight: recalculateHeight,
    matchRowHeight: matchRowHeight
  };

  var percentageSize = function (width, element) {
    var floatWidth = parseFloat(width);
    var pixelWidth = $_7w15eclsjc7tmcxq.get(element);
    var getCellDelta = function (delta) {
      return delta / pixelWidth * 100;
    };
    var singleColumnWidth = function (width, _delta) {
      return [100 - width];
    };
    var minCellWidth = function () {
      return $_93q72myjc7tmd7z.minWidth() / pixelWidth * 100;
    };
    var setTableWidth = function (table, _newWidths, delta) {
      var total = floatWidth + delta;
      $_5fedwxlojc7tmcwd.setPercentageWidth(table, total);
    };
    return {
      width: $_av3vphjhjc7tmcee.constant(floatWidth),
      pixelWidth: $_av3vphjhjc7tmcee.constant(pixelWidth),
      getWidths: $_6ytdckmxjc7tmd7o.getPercentageWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: minCellWidth,
      setElementWidth: $_5fedwxlojc7tmcwd.setPercentageWidth,
      setTableWidth: setTableWidth
    };
  };
  var pixelSize = function (width) {
    var intWidth = parseInt(width, 10);
    var getCellDelta = $_av3vphjhjc7tmcee.identity;
    var singleColumnWidth = function (width, delta) {
      var newNext = Math.max($_93q72myjc7tmd7z.minWidth(), width + delta);
      return [newNext - width];
    };
    var setTableWidth = function (table, newWidths, _delta) {
      var total = $_f8juj3jfjc7tmcdy.foldr(newWidths, function (b, a) {
        return b + a;
      }, 0);
      $_5fedwxlojc7tmcwd.setPixelWidth(table, total);
    };
    return {
      width: $_av3vphjhjc7tmcee.constant(intWidth),
      pixelWidth: $_av3vphjhjc7tmcee.constant(intWidth),
      getWidths: $_6ytdckmxjc7tmd7o.getPixelWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: $_93q72myjc7tmd7z.minWidth,
      setElementWidth: $_5fedwxlojc7tmcwd.setPixelWidth,
      setTableWidth: setTableWidth
    };
  };
  var chooseSize = function (element, width) {
    if ($_5fedwxlojc7tmcwd.percentageBasedSizeRegex().test(width)) {
      var percentMatch = $_5fedwxlojc7tmcwd.percentageBasedSizeRegex().exec(width);
      return percentageSize(percentMatch[1], element);
    } else if ($_5fedwxlojc7tmcwd.pixelBasedSizeRegex().test(width)) {
      var pixelMatch = $_5fedwxlojc7tmcwd.pixelBasedSizeRegex().exec(width);
      return pixelSize(pixelMatch[1]);
    } else {
      var fallbackWidth = $_7w15eclsjc7tmcxq.get(element);
      return pixelSize(fallbackWidth);
    }
  };
  var getTableSize = function (element) {
    var width = $_5fedwxlojc7tmcwd.getRawWidth(element);
    return width.fold(function () {
      var fallbackWidth = $_7w15eclsjc7tmcxq.get(element);
      return pixelSize(fallbackWidth);
    }, function (width) {
      return chooseSize(element, width);
    });
  };
  var $_bkak76n0jc7tmd8j = { getTableSize: getTableSize };

  var getWarehouse$1 = function (list) {
    return $_erfiqhknjc7tmcm8.generate(list);
  };
  var sumUp = function (newSize) {
    return $_f8juj3jfjc7tmcdy.foldr(newSize, function (b, a) {
      return b + a;
    }, 0);
  };
  var getTableWarehouse = function (table) {
    var list = $_2baam5jpjc7tmcg8.fromTable(table);
    return getWarehouse$1(list);
  };
  var adjustWidth = function (table, delta, index, direction) {
    var tableSize = $_bkak76n0jc7tmd8j.getTableSize(table);
    var step = tableSize.getCellDelta(delta);
    var warehouse = getTableWarehouse(table);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var deltas = $_8gcufpmvjc7tmd7b.determine(widths, index, step, tableSize);
    var newWidths = $_f8juj3jfjc7tmcdy.map(deltas, function (dx, i) {
      return dx + widths[i];
    });
    var newSizes = $_31kgd2mzjc7tmd8b.recalculateWidth(warehouse, newWidths);
    $_f8juj3jfjc7tmcdy.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    if (index === warehouse.grid().columns() - 1) {
      tableSize.setTableWidth(table, newWidths, step);
    }
  };
  var adjustHeight = function (table, delta, index, direction) {
    var warehouse = getTableWarehouse(table);
    var heights = $_6ytdckmxjc7tmd7o.getPixelHeights(warehouse, direction);
    var newHeights = $_f8juj3jfjc7tmcdy.map(heights, function (dy, i) {
      return index === i ? Math.max(delta + dy, $_93q72myjc7tmd7z.minHeight()) : dy;
    });
    var newCellSizes = $_31kgd2mzjc7tmd8b.recalculateHeight(warehouse, newHeights);
    var newRowSizes = $_31kgd2mzjc7tmd8b.matchRowHeight(warehouse, newHeights);
    $_f8juj3jfjc7tmcdy.each(newRowSizes, function (row) {
      $_5fedwxlojc7tmcwd.setHeight(row.element(), row.height());
    });
    $_f8juj3jfjc7tmcdy.each(newCellSizes, function (cell) {
      $_5fedwxlojc7tmcwd.setHeight(cell.element(), cell.height());
    });
    var total = sumUp(newHeights);
    $_5fedwxlojc7tmcwd.setHeight(table, total);
  };
  var adjustWidthTo = function (table, list, direction) {
    var tableSize = $_bkak76n0jc7tmd8j.getTableSize(table);
    var warehouse = getWarehouse$1(list);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var newSizes = $_31kgd2mzjc7tmd8b.recalculateWidth(warehouse, widths);
    $_f8juj3jfjc7tmcdy.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    var total = $_f8juj3jfjc7tmcdy.foldr(widths, function (b, a) {
      return a + b;
    }, 0);
    if (newSizes.length > 0) {
      tableSize.setElementWidth(table, total);
    }
  };
  var $_ccw6efmujc7tmd76 = {
    adjustWidth: adjustWidth,
    adjustHeight: adjustHeight,
    adjustWidthTo: adjustWidthTo
  };

  var prune = function (table) {
    var cells = $_dvsb29jrjc7tmcgo.cells(table);
    if (cells.length === 0)
      $_t0op8krjc7tmcnd.remove(table);
  };
  var outcome = $_10a874jkjc7tmcfr.immutable('grid', 'cursor');
  var elementFromGrid = function (grid, row, column) {
    return findIn(grid, row, column).orThunk(function () {
      return findIn(grid, 0, 0);
    });
  };
  var findIn = function (grid, row, column) {
    return $_8zi7zzjgjc7tmce9.from(grid[row]).bind(function (r) {
      return $_8zi7zzjgjc7tmce9.from(r.cells()[column]).bind(function (c) {
        return $_8zi7zzjgjc7tmce9.from(c.element());
      });
    });
  };
  var bundle = function (grid, row, column) {
    return outcome(grid, findIn(grid, row, column));
  };
  var uniqueRows = function (details) {
    return $_f8juj3jfjc7tmcdy.foldl(details, function (rest, detail) {
      return $_f8juj3jfjc7tmcdy.exists(rest, function (currentDetail) {
        return currentDetail.row() === detail.row();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.row() - detailB.row();
    });
  };
  var uniqueColumns = function (details) {
    return $_f8juj3jfjc7tmcdy.foldl(details, function (rest, detail) {
      return $_f8juj3jfjc7tmcdy.exists(rest, function (currentDetail) {
        return currentDetail.column() === detail.column();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.column() - detailB.column();
    });
  };
  var insertRowBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row();
    var newGrid = $_a1w0wemsjc7tmd6t.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsBefore = function (grid, details, comparator, genWrappers) {
    var example = details[0].row();
    var targetIndex = details[0].row();
    var rows = uniqueRows(details);
    var newGrid = $_f8juj3jfjc7tmcdy.foldl(rows, function (newGrid, _row) {
      return $_a1w0wemsjc7tmd6t.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertRowAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row() + detail.rowspan();
    var newGrid = $_a1w0wemsjc7tmd6t.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsAfter = function (grid, details, comparator, genWrappers) {
    var rows = uniqueRows(details);
    var example = rows[rows.length - 1].row();
    var targetIndex = rows[rows.length - 1].row() + rows[rows.length - 1].rowspan();
    var newGrid = $_f8juj3jfjc7tmcdy.foldl(rows, function (newGrid, _row) {
      return $_a1w0wemsjc7tmd6t.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertColumnBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column();
    var newGrid = $_a1w0wemsjc7tmd6t.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsBefore = function (grid, details, comparator, genWrappers) {
    var columns = uniqueColumns(details);
    var example = columns[0].column();
    var targetIndex = columns[0].column();
    var newGrid = $_f8juj3jfjc7tmcdy.foldl(columns, function (newGrid, _row) {
      return $_a1w0wemsjc7tmd6t.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var insertColumnAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column() + detail.colspan();
    var newGrid = $_a1w0wemsjc7tmd6t.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsAfter = function (grid, details, comparator, genWrappers) {
    var example = details[details.length - 1].column();
    var targetIndex = details[details.length - 1].column() + details[details.length - 1].colspan();
    var columns = uniqueColumns(details);
    var newGrid = $_f8juj3jfjc7tmcdy.foldl(columns, function (newGrid, _row) {
      return $_a1w0wemsjc7tmd6t.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var makeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1wko7umtjc7tmd6z.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var makeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1wko7umtjc7tmd6z.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1wko7umtjc7tmd6z.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1wko7umtjc7tmd6z.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoColumns = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_a1w0wemsjc7tmd6t.splitCellIntoColumns(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoRows = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_a1w0wemsjc7tmd6t.splitCellIntoRows(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var eraseColumns = function (grid, details, comparator, _genWrappers) {
    var columns = uniqueColumns(details);
    var newGrid = $_a1w0wemsjc7tmd6t.deleteColumnsAt(grid, columns[0].column(), columns[columns.length - 1].column());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var eraseRows = function (grid, details, comparator, _genWrappers) {
    var rows = uniqueRows(details);
    var newGrid = $_a1w0wemsjc7tmd6t.deleteRowsAt(grid, rows[0].row(), rows[rows.length - 1].row());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var mergeCells = function (grid, mergable, comparator, _genWrappers) {
    var cells = mergable.cells();
    $_8umiugm4jc7tmd0b.merge(cells);
    var newGrid = $_6vv5qimrjc7tmd6c.merge(grid, mergable.bounds(), comparator, $_av3vphjhjc7tmcee.constant(cells[0]));
    return outcome(newGrid, $_8zi7zzjgjc7tmce9.from(cells[0]));
  };
  var unmergeCells = function (grid, unmergable, comparator, genWrappers) {
    var newGrid = $_f8juj3jfjc7tmcdy.foldr(unmergable, function (b, cell) {
      return $_6vv5qimrjc7tmd6c.unmerge(b, cell, comparator, genWrappers.combine(cell));
    }, grid);
    return outcome(newGrid, $_8zi7zzjgjc7tmce9.from(unmergable[0]));
  };
  var pasteCells = function (grid, pasteDetails, comparator, genWrappers) {
    var gridify = function (table, generators) {
      var list = $_2baam5jpjc7tmcg8.fromTable(table);
      var wh = $_erfiqhknjc7tmcm8.generate(list);
      return $_2uz4g9majc7tmd1u.toGrid(wh, generators, true);
    };
    var gridB = gridify(pasteDetails.clipboard(), pasteDetails.generators());
    var startAddress = $_5q87xujqjc7tmcgj.address(pasteDetails.row(), pasteDetails.column());
    var mergedGrid = $_8gkd5tmojc7tmd5m.merge(startAddress, grid, gridB, pasteDetails.generators(), comparator);
    return mergedGrid.fold(function () {
      return outcome(grid, $_8zi7zzjgjc7tmce9.some(pasteDetails.element()));
    }, function (nuGrid) {
      var cursor = elementFromGrid(nuGrid, pasteDetails.row(), pasteDetails.column());
      return outcome(nuGrid, cursor);
    });
  };
  var gridifyRows = function (rows, generators, example) {
    var pasteDetails = $_2baam5jpjc7tmcg8.fromPastedRows(rows, example);
    var wh = $_erfiqhknjc7tmcm8.generate(pasteDetails);
    return $_2uz4g9majc7tmd1u.toGrid(wh, generators, true);
  };
  var pasteRowsBefore = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[0].row();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_8gkd5tmojc7tmd5m.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var pasteRowsAfter = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[pasteDetails.cells.length - 1].row() + pasteDetails.cells[pasteDetails.cells.length - 1].rowspan();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_8gkd5tmojc7tmd5m.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var resize = $_ccw6efmujc7tmd76.adjustWidthTo;
  var $_y2eqdm0jc7tmcyx = {
    insertRowBefore: $_3xv11em7jc7tmd1b.run(insertRowBefore, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertRowsBefore: $_3xv11em7jc7tmd1b.run(insertRowsBefore, $_3xv11em7jc7tmd1b.onCells, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertRowAfter: $_3xv11em7jc7tmd1b.run(insertRowAfter, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertRowsAfter: $_3xv11em7jc7tmd1b.run(insertRowsAfter, $_3xv11em7jc7tmd1b.onCells, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertColumnBefore: $_3xv11em7jc7tmd1b.run(insertColumnBefore, $_3xv11em7jc7tmd1b.onCell, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertColumnsBefore: $_3xv11em7jc7tmd1b.run(insertColumnsBefore, $_3xv11em7jc7tmd1b.onCells, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertColumnAfter: $_3xv11em7jc7tmd1b.run(insertColumnAfter, $_3xv11em7jc7tmd1b.onCell, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    insertColumnsAfter: $_3xv11em7jc7tmd1b.run(insertColumnsAfter, $_3xv11em7jc7tmd1b.onCells, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    splitCellIntoColumns: $_3xv11em7jc7tmd1b.run(splitCellIntoColumns, $_3xv11em7jc7tmd1b.onCell, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    splitCellIntoRows: $_3xv11em7jc7tmd1b.run(splitCellIntoRows, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    eraseColumns: $_3xv11em7jc7tmd1b.run(eraseColumns, $_3xv11em7jc7tmd1b.onCells, resize, prune, $_9wyfv1m1jc7tmczf.modification),
    eraseRows: $_3xv11em7jc7tmd1b.run(eraseRows, $_3xv11em7jc7tmd1b.onCells, $_av3vphjhjc7tmcee.noop, prune, $_9wyfv1m1jc7tmczf.modification),
    makeColumnHeader: $_3xv11em7jc7tmd1b.run(makeColumnHeader, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.transform('row', 'th')),
    unmakeColumnHeader: $_3xv11em7jc7tmd1b.run(unmakeColumnHeader, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.transform(null, 'td')),
    makeRowHeader: $_3xv11em7jc7tmd1b.run(makeRowHeader, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.transform('col', 'th')),
    unmakeRowHeader: $_3xv11em7jc7tmd1b.run(unmakeRowHeader, $_3xv11em7jc7tmd1b.onCell, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.transform(null, 'td')),
    mergeCells: $_3xv11em7jc7tmd1b.run(mergeCells, $_3xv11em7jc7tmd1b.onMergable, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.merging),
    unmergeCells: $_3xv11em7jc7tmd1b.run(unmergeCells, $_3xv11em7jc7tmd1b.onUnmergable, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.merging),
    pasteCells: $_3xv11em7jc7tmd1b.run(pasteCells, $_3xv11em7jc7tmd1b.onPaste, resize, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    pasteRowsBefore: $_3xv11em7jc7tmd1b.run(pasteRowsBefore, $_3xv11em7jc7tmd1b.onPasteRows, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification),
    pasteRowsAfter: $_3xv11em7jc7tmd1b.run(pasteRowsAfter, $_3xv11em7jc7tmd1b.onPasteRows, $_av3vphjhjc7tmcee.noop, $_av3vphjhjc7tmcee.noop, $_9wyfv1m1jc7tmczf.modification)
  };

  var getBody$1 = function (editor) {
    return $_2bd3y0jujc7tmci2.fromDom(editor.getBody());
  };
  var getIsRoot = function (editor) {
    return function (element) {
      return $_4co3lyjyjc7tmciu.eq(element, getBody$1(editor));
    };
  };
  var removePxSuffix = function (size) {
    return size ? size.replace(/px$/, '') : '';
  };
  var addSizeSuffix = function (size) {
    if (/^[0-9]+$/.test(size)) {
      size += 'px';
    }
    return size;
  };
  var $_45jthun1jc7tmd8q = {
    getBody: getBody$1,
    getIsRoot: getIsRoot,
    addSizeSuffix: addSizeSuffix,
    removePxSuffix: removePxSuffix
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_fsmkrhkojc7tmcmj.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_ev8swhn3jc7tmd8z = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var ltr$1 = { isRtl: $_av3vphjhjc7tmcee.constant(false) };
  var rtl$1 = { isRtl: $_av3vphjhjc7tmcee.constant(true) };
  var directionAt = function (element) {
    var dir = $_ev8swhn3jc7tmd8z.getDirection(element);
    return dir === 'rtl' ? rtl$1 : ltr$1;
  };
  var $_gd6kqnn2jc7tmd8u = { directionAt: directionAt };

  var TableActions = function (editor, lazyWire) {
    var isTableBody = function (editor) {
      return $_fxq8yvkgjc7tmcl4.name($_45jthun1jc7tmd8q.getBody(editor)) === 'table';
    };
    var lastRowGuard = function (table) {
      var size = $_nzm4blzjc7tmcyr.getGridSize(table);
      return isTableBody(editor) === false || size.rows() > 1;
    };
    var lastColumnGuard = function (table) {
      var size = $_nzm4blzjc7tmcyr.getGridSize(table);
      return isTableBody(editor) === false || size.columns() > 1;
    };
    var fireNewRow = function (node) {
      editor.fire('newrow', { node: node.dom() });
      return node.dom();
    };
    var fireNewCell = function (node) {
      editor.fire('newcell', { node: node.dom() });
      return node.dom();
    };
    var cloneFormatsArray;
    if (editor.settings.table_clone_elements !== false) {
      if (typeof editor.settings.table_clone_elements == 'string') {
        cloneFormatsArray = editor.settings.table_clone_elements.split(/[ ,]/);
      } else if (Array.isArray(editor.settings.table_clone_elements)) {
        cloneFormatsArray = editor.settings.table_clone_elements;
      }
    }
    var cloneFormats = $_8zi7zzjgjc7tmce9.from(cloneFormatsArray);
    var execute = function (operation, guard, mutate, lazyWire) {
      return function (table, target) {
        var dataStyleCells = $_7y6210khjc7tmcl8.descendants(table, 'td[data-mce-style],th[data-mce-style]');
        $_f8juj3jfjc7tmcdy.each(dataStyleCells, function (cell) {
          $_9o3gmekfjc7tmckw.remove(cell, 'data-mce-style');
        });
        var wire = lazyWire();
        var doc = $_2bd3y0jujc7tmci2.fromDom(editor.getDoc());
        var direction = TableDirection($_gd6kqnn2jc7tmd8u.directionAt);
        var generators = $_czudfqktjc7tmcnp.cellOperations(mutate, doc, cloneFormats);
        return guard(table) ? operation(wire, table, target, generators, direction).bind(function (result) {
          $_f8juj3jfjc7tmcdy.each(result.newRows(), function (row) {
            fireNewRow(row);
          });
          $_f8juj3jfjc7tmcdy.each(result.newCells(), function (cell) {
            fireNewCell(cell);
          });
          return result.cursor().map(function (cell) {
            var rng = editor.dom.createRng();
            rng.setStart(cell.dom(), 0);
            rng.setEnd(cell.dom(), 0);
            return rng;
          });
        }) : $_8zi7zzjgjc7tmce9.none();
      };
    };
    var deleteRow = execute($_y2eqdm0jc7tmcyx.eraseRows, lastRowGuard, $_av3vphjhjc7tmcee.noop, lazyWire);
    var deleteColumn = execute($_y2eqdm0jc7tmcyx.eraseColumns, lastColumnGuard, $_av3vphjhjc7tmcee.noop, lazyWire);
    var insertRowsBefore = execute($_y2eqdm0jc7tmcyx.insertRowsBefore, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var insertRowsAfter = execute($_y2eqdm0jc7tmcyx.insertRowsAfter, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var insertColumnsBefore = execute($_y2eqdm0jc7tmcyx.insertColumnsBefore, $_av3vphjhjc7tmcee.always, $_dbfsj8lnjc7tmcw6.halve, lazyWire);
    var insertColumnsAfter = execute($_y2eqdm0jc7tmcyx.insertColumnsAfter, $_av3vphjhjc7tmcee.always, $_dbfsj8lnjc7tmcw6.halve, lazyWire);
    var mergeCells = execute($_y2eqdm0jc7tmcyx.mergeCells, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var unmergeCells = execute($_y2eqdm0jc7tmcyx.unmergeCells, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var pasteRowsBefore = execute($_y2eqdm0jc7tmcyx.pasteRowsBefore, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var pasteRowsAfter = execute($_y2eqdm0jc7tmcyx.pasteRowsAfter, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    var pasteCells = execute($_y2eqdm0jc7tmcyx.pasteCells, $_av3vphjhjc7tmcee.always, $_av3vphjhjc7tmcee.noop, lazyWire);
    return {
      deleteRow: deleteRow,
      deleteColumn: deleteColumn,
      insertRowsBefore: insertRowsBefore,
      insertRowsAfter: insertRowsAfter,
      insertColumnsBefore: insertColumnsBefore,
      insertColumnsAfter: insertColumnsAfter,
      mergeCells: mergeCells,
      unmergeCells: unmergeCells,
      pasteRowsBefore: pasteRowsBefore,
      pasteRowsAfter: pasteRowsAfter,
      pasteCells: pasteCells
    };
  };

  var copyRows = function (table, target, generators) {
    var list = $_2baam5jpjc7tmcg8.fromTable(table);
    var house = $_erfiqhknjc7tmcm8.generate(list);
    var details = $_3xv11em7jc7tmd1b.onCells(house, target);
    return details.map(function (selectedCells) {
      var grid = $_2uz4g9majc7tmd1u.toGrid(house, generators, false);
      var slicedGrid = grid.slice(selectedCells[0].row(), selectedCells[selectedCells.length - 1].row() + selectedCells[selectedCells.length - 1].rowspan());
      var slicedDetails = $_3xv11em7jc7tmd1b.toDetailList(slicedGrid, generators);
      return $_g3xdw8mdjc7tmd2g.copy(slicedDetails);
    });
  };
  var $_393btnn5jc7tmd9p = { copyRows: copyRows };

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var Env = tinymce.util.Tools.resolve('tinymce.Env');

  var getTDTHOverallStyle = function (dom, elm, name) {
    var cells = dom.select('td,th', elm), firstChildStyle;
    var checkChildren = function (firstChildStyle, elms) {
      for (var i = 0; i < elms.length; i++) {
        var currentStyle = dom.getStyle(elms[i], name);
        if (typeof firstChildStyle === 'undefined') {
          firstChildStyle = currentStyle;
        }
        if (firstChildStyle != currentStyle) {
          return '';
        }
      }
      return firstChildStyle;
    };
    firstChildStyle = checkChildren(firstChildStyle, cells);
    return firstChildStyle;
  };
  var applyAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('align' + name, {}, elm);
    }
  };
  var applyVAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('valign' + name, {}, elm);
    }
  };
  var unApplyAlign = function (editor, elm) {
    Tools.each('left center right'.split(' '), function (name) {
      editor.formatter.remove('align' + name, {}, elm);
    });
  };
  var unApplyVAlign = function (editor, elm) {
    Tools.each('top middle bottom'.split(' '), function (name) {
      editor.formatter.remove('valign' + name, {}, elm);
    });
  };
  var $_bf18a7n9jc7tmda2 = {
    applyAlign: applyAlign,
    applyVAlign: applyVAlign,
    unApplyAlign: unApplyAlign,
    unApplyVAlign: unApplyVAlign,
    getTDTHOverallStyle: getTDTHOverallStyle
  };

  var buildListItems = function (inputList, itemCallback, startItems) {
    var appendItems = function (values, output) {
      output = output || [];
      Tools.each(values, function (item) {
        var menuItem = { text: item.text || item.title };
        if (item.menu) {
          menuItem.menu = appendItems(item.menu);
        } else {
          menuItem.value = item.value;
          if (itemCallback) {
            itemCallback(menuItem);
          }
        }
        output.push(menuItem);
      });
      return output;
    };
    return appendItems(inputList, startItems || []);
  };
  var updateStyleField = function (editor, evt) {
    var dom = editor.dom;
    var rootControl = evt.control.rootControl;
    var data = rootControl.toJSON();
    var css = dom.parseStyle(data.style);
    if (evt.control.name() === 'style') {
      rootControl.find('#borderStyle').value(css['border-style'] || '')[0].fire('select');
      rootControl.find('#borderColor').value(css['border-color'] || '')[0].fire('change');
      rootControl.find('#backgroundColor').value(css['background-color'] || '')[0].fire('change');
      rootControl.find('#width').value(css.width || '').fire('change');
      rootControl.find('#height').value(css.height || '').fire('change');
    } else {
      css['border-style'] = data.borderStyle;
      css['border-color'] = data.borderColor;
      css['background-color'] = data.backgroundColor;
      css.width = data.width ? $_45jthun1jc7tmd8q.addSizeSuffix(data.width) : '';
      css.height = data.height ? $_45jthun1jc7tmd8q.addSizeSuffix(data.height) : '';
    }
    rootControl.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
  };
  var extractAdvancedStyles = function (dom, elm) {
    var css = dom.parseStyle(dom.getAttrib(elm, 'style'));
    var data = {};
    if (css['border-style']) {
      data.borderStyle = css['border-style'];
    }
    if (css['border-color']) {
      data.borderColor = css['border-color'];
    }
    if (css['background-color']) {
      data.backgroundColor = css['background-color'];
    }
    data.style = dom.serializeStyle(css);
    return data;
  };
  var createStyleForm = function (editor) {
    var createColorPickAction = function () {
      var colorPickerCallback = editor.settings.color_picker_callback;
      if (colorPickerCallback) {
        return function (evt) {
          return colorPickerCallback.call(editor, function (value) {
            evt.control.value(value).fire('change');
          }, evt.control.value());
        };
      }
    };
    return {
      title: 'Advanced',
      type: 'form',
      defaults: { onchange: $_av3vphjhjc7tmcee.curry(updateStyleField, editor) },
      items: [
        {
          label: 'Style',
          name: 'style',
          type: 'textbox'
        },
        {
          type: 'form',
          padding: 0,
          formItemDefaults: {
            layout: 'grid',
            alignH: [
              'start',
              'right'
            ]
          },
          defaults: { size: 7 },
          items: [
            {
              label: 'Border style',
              type: 'listbox',
              name: 'borderStyle',
              width: 90,
              onselect: $_av3vphjhjc7tmcee.curry(updateStyleField, editor),
              values: [
                {
                  text: 'Select...',
                  value: ''
                },
                {
                  text: 'Solid',
                  value: 'solid'
                },
                {
                  text: 'Dotted',
                  value: 'dotted'
                },
                {
                  text: 'Dashed',
                  value: 'dashed'
                },
                {
                  text: 'Double',
                  value: 'double'
                },
                {
                  text: 'Groove',
                  value: 'groove'
                },
                {
                  text: 'Ridge',
                  value: 'ridge'
                },
                {
                  text: 'Inset',
                  value: 'inset'
                },
                {
                  text: 'Outset',
                  value: 'outset'
                },
                {
                  text: 'None',
                  value: 'none'
                },
                {
                  text: 'Hidden',
                  value: 'hidden'
                }
              ]
            },
            {
              label: 'Border color',
              type: 'colorbox',
              name: 'borderColor',
              onaction: createColorPickAction()
            },
            {
              label: 'Background color',
              type: 'colorbox',
              name: 'backgroundColor',
              onaction: createColorPickAction()
            }
          ]
        }
      ]
    };
  };
  var $_18ps4mnajc7tmda6 = {
    createStyleForm: createStyleForm,
    buildListItems: buildListItems,
    updateStyleField: updateStyleField,
    extractAdvancedStyles: extractAdvancedStyles
  };

  function styleTDTH(dom, elm, name, value) {
    if (elm.tagName === 'TD' || elm.tagName === 'TH') {
      dom.setStyle(elm, name, value);
    } else {
      if (elm.children) {
        for (var i = 0; i < elm.children.length; i++) {
          styleTDTH(dom, elm.children[i], name, value);
        }
      }
    }
  }
  var extractDataFromElement = function (editor, tableElm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(tableElm, 'width') || dom.getAttrib(tableElm, 'width'),
      height: dom.getStyle(tableElm, 'height') || dom.getAttrib(tableElm, 'height'),
      cellspacing: dom.getStyle(tableElm, 'border-spacing') || dom.getAttrib(tableElm, 'cellspacing'),
      cellpadding: dom.getAttrib(tableElm, 'data-mce-cell-padding') || dom.getAttrib(tableElm, 'cellpadding') || $_bf18a7n9jc7tmda2.getTDTHOverallStyle(editor.dom, tableElm, 'padding'),
      border: dom.getAttrib(tableElm, 'data-mce-border') || dom.getAttrib(tableElm, 'border') || $_bf18a7n9jc7tmda2.getTDTHOverallStyle(editor.dom, tableElm, 'border'),
      borderColor: dom.getAttrib(tableElm, 'data-mce-border-color'),
      caption: !!dom.select('caption', tableElm)[0],
      'class': dom.getAttrib(tableElm, 'class')
    };
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(tableElm, 'align' + name)) {
        data.align = name;
      }
    });
    if (editor.settings.table_advtab !== false) {
      Tools.extend(data, $_18ps4mnajc7tmda6.extractAdvancedStyles(dom, tableElm));
    }
    return data;
  };
  var applyDataToElement = function (editor, tableElm, data) {
    var dom = editor.dom;
    var attrs = {}, styles = {};
    attrs['class'] = data['class'];
    styles.height = $_45jthun1jc7tmd8q.addSizeSuffix(data.height);
    if (dom.getAttrib(tableElm, 'width') && !editor.settings.table_style_by_css) {
      attrs.width = $_45jthun1jc7tmd8q.removePxSuffix(data.width);
    } else {
      styles.width = $_45jthun1jc7tmd8q.addSizeSuffix(data.width);
    }
    if (editor.settings.table_style_by_css) {
      styles['border-width'] = $_45jthun1jc7tmd8q.addSizeSuffix(data.border);
      styles['border-spacing'] = $_45jthun1jc7tmd8q.addSizeSuffix(data.cellspacing);
      Tools.extend(attrs, {
        'data-mce-border-color': data.borderColor,
        'data-mce-cell-padding': data.cellpadding,
        'data-mce-border': data.border
      });
    } else {
      Tools.extend(attrs, {
        border: data.border,
        cellpadding: data.cellpadding,
        cellspacing: data.cellspacing
      });
    }
    if (editor.settings.table_style_by_css) {
      if (tableElm.children) {
        for (var i = 0; i < tableElm.children.length; i++) {
          styleTDTH(dom, tableElm.children[i], {
            'border-width': $_45jthun1jc7tmd8q.addSizeSuffix(data.border),
            'border-color': data.borderColor,
            'padding': $_45jthun1jc7tmd8q.addSizeSuffix(data.cellpadding)
          });
        }
      }
    }
    if (data.style) {
      Tools.extend(styles, dom.parseStyle(data.style));
    } else {
      styles = Tools.extend({}, dom.parseStyle(dom.getAttrib(tableElm, 'style')), styles);
    }
    attrs.style = dom.serializeStyle(styles);
    dom.setAttribs(tableElm, attrs);
  };
  var onSubmitTableForm = function (editor, tableElm, evt) {
    var dom = editor.dom;
    var captionElm;
    var data;
    $_18ps4mnajc7tmda6.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    if (data['class'] === false) {
      delete data['class'];
    }
    editor.undoManager.transact(function () {
      if (!tableElm) {
        tableElm = $_8320wnlijc7tmcul.insert(editor, data.cols || 1, data.rows || 1);
      }
      applyDataToElement(editor, tableElm, data);
      captionElm = dom.select('caption', tableElm)[0];
      if (captionElm && !data.caption) {
        dom.remove(captionElm);
      }
      if (!captionElm && data.caption) {
        captionElm = dom.create('caption');
        captionElm.innerHTML = !Env.ie ? '<br data-mce-bogus="1"/>' : '\xA0';
        tableElm.insertBefore(captionElm, tableElm.firstChild);
      }
      $_bf18a7n9jc7tmda2.unApplyAlign(editor, tableElm);
      if (data.align) {
        $_bf18a7n9jc7tmda2.applyAlign(editor, tableElm, data.align);
      }
      editor.focus();
      editor.addVisual();
    });
  };
  var open = function (editor, isProps) {
    var dom = editor.dom, tableElm, colsCtrl, rowsCtrl, classListCtrl, data = {}, generalTableForm;
    if (isProps === true) {
      tableElm = dom.getParent(editor.selection.getStart(), 'table');
      if (tableElm) {
        data = extractDataFromElement(editor, tableElm);
      }
    } else {
      colsCtrl = {
        label: 'Cols',
        name: 'cols'
      };
      rowsCtrl = {
        label: 'Rows',
        name: 'rows'
      };
    }
    if (editor.settings.table_class_list) {
      if (data['class']) {
        data['class'] = data['class'].replace(/\s*mce\-item\-table\s*/g, '');
      }
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_18ps4mnajc7tmda6.buildListItems(editor.settings.table_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'table',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalTableForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          labelGapCalc: false,
          padding: 0,
          layout: 'grid',
          columns: 2,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: editor.settings.table_appearance_options !== false ? [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            },
            {
              label: 'Cell spacing',
              name: 'cellspacing'
            },
            {
              label: 'Cell padding',
              name: 'cellpadding'
            },
            {
              label: 'Border',
              name: 'border'
            },
            {
              label: 'Caption',
              name: 'caption',
              type: 'checkbox'
            }
          ] : [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            }
          ]
        },
        {
          label: 'Alignment',
          name: 'align',
          type: 'listbox',
          text: 'None',
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_advtab !== false) {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalTableForm
          },
          $_18ps4mnajc7tmda6.createStyleForm(editor)
        ],
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitTableForm, editor, tableElm)
      });
    } else {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        body: generalTableForm,
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitTableForm, editor, tableElm)
      });
    }
  };
  var $_g5wwfun7jc7tmd9u = { open: open };

  var extractDataFromElement$1 = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      'class': dom.getAttrib(elm, 'class')
    };
    data.type = elm.parentNode.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    if (editor.settings.table_row_advtab !== false) {
      Tools.extend(data, $_18ps4mnajc7tmda6.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var switchRowType = function (dom, rowElm, toType) {
    var tableElm = dom.getParent(rowElm, 'table');
    var oldParentElm = rowElm.parentNode;
    var parentElm = dom.select(toType, tableElm)[0];
    if (!parentElm) {
      parentElm = dom.create(toType);
      if (tableElm.firstChild) {
        if (tableElm.firstChild.nodeName === 'CAPTION') {
          dom.insertAfter(parentElm, tableElm.firstChild);
        } else {
          tableElm.insertBefore(parentElm, tableElm.firstChild);
        }
      } else {
        tableElm.appendChild(parentElm);
      }
    }
    parentElm.appendChild(rowElm);
    if (!oldParentElm.hasChildNodes()) {
      dom.remove(oldParentElm);
    }
  };
  function onSubmitRowForm(editor, rows, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_18ps4mnajc7tmda6.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(rows, function (rowElm) {
        setAttrib(rowElm, 'scope', data.scope);
        setAttrib(rowElm, 'style', data.style);
        setAttrib(rowElm, 'class', data['class']);
        setStyle(rowElm, 'height', $_45jthun1jc7tmd8q.addSizeSuffix(data.height));
        if (data.type !== rowElm.parentNode.nodeName.toLowerCase()) {
          switchRowType(editor.dom, rowElm, data.type);
        }
        if (rows.length === 1) {
          $_bf18a7n9jc7tmda2.unApplyAlign(editor, rowElm);
        }
        if (data.align) {
          $_bf18a7n9jc7tmda2.applyAlign(editor, rowElm, data.align);
        }
      });
      editor.focus();
    });
  }
  var open$1 = function (editor) {
    var dom = editor.dom, tableElm, cellElm, rowElm, classListCtrl, data, rows = [], generalRowForm;
    tableElm = editor.dom.getParent(editor.selection.getStart(), 'table');
    cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
    Tools.each(tableElm.rows, function (row) {
      Tools.each(row.cells, function (cell) {
        if (dom.getAttrib(cell, 'data-mce-selected') || cell == cellElm) {
          rows.push(row);
          return false;
        }
      });
    });
    rowElm = rows[0];
    if (!rowElm) {
      return;
    }
    if (rows.length > 1) {
      data = {
        height: '',
        scope: '',
        'class': '',
        align: '',
        type: rowElm.parentNode.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement$1(editor, rowElm);
    }
    if (editor.settings.table_row_class_list) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_18ps4mnajc7tmda6.buildListItems(editor.settings.table_row_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'tr',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalRowForm = {
      type: 'form',
      columns: 2,
      padding: 0,
      defaults: { type: 'textbox' },
      items: [
        {
          type: 'listbox',
          name: 'type',
          label: 'Row type',
          text: 'Header',
          maxWidth: null,
          values: [
            {
              text: 'Header',
              value: 'thead'
            },
            {
              text: 'Body',
              value: 'tbody'
            },
            {
              text: 'Footer',
              value: 'tfoot'
            }
          ]
        },
        {
          type: 'listbox',
          name: 'align',
          label: 'Alignment',
          text: 'None',
          maxWidth: null,
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        {
          label: 'Height',
          name: 'height'
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_row_advtab !== false) {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalRowForm
          },
          $_18ps4mnajc7tmda6.createStyleForm(dom)
        ],
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitRowForm, editor, rows)
      });
    } else {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        body: generalRowForm,
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitRowForm, editor, rows)
      });
    }
  };
  var $_81ronbjc7tmdaf = { open: open$1 };

  var updateStyles = function (elm, cssText) {
    elm.style.cssText += ';' + cssText;
  };
  var extractDataFromElement$2 = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      'class': dom.getAttrib(elm, 'class')
    };
    data.type = elm.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    Tools.each('top middle bottom'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'valign' + name)) {
        data.valign = name;
      }
    });
    if (editor.settings.table_cell_advtab !== false) {
      Tools.extend(data, $_18ps4mnajc7tmda6.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var onSubmitCellForm = function (editor, cells, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_18ps4mnajc7tmda6.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(cells, function (cellElm) {
        setAttrib(cellElm, 'scope', data.scope);
        if (cells.length === 1) {
          setAttrib(cellElm, 'style', data.style);
        } else {
          updateStyles(cellElm, data.style);
        }
        setAttrib(cellElm, 'class', data['class']);
        setStyle(cellElm, 'width', $_45jthun1jc7tmd8q.addSizeSuffix(data.width));
        setStyle(cellElm, 'height', $_45jthun1jc7tmd8q.addSizeSuffix(data.height));
        if (data.type && cellElm.nodeName.toLowerCase() !== data.type) {
          cellElm = dom.rename(cellElm, data.type);
        }
        if (cells.length === 1) {
          $_bf18a7n9jc7tmda2.unApplyAlign(editor, cellElm);
          $_bf18a7n9jc7tmda2.unApplyVAlign(editor, cellElm);
        }
        if (data.align) {
          $_bf18a7n9jc7tmda2.applyAlign(editor, cellElm, data.align);
        }
        if (data.valign) {
          $_bf18a7n9jc7tmda2.applyVAlign(editor, cellElm, data.valign);
        }
      });
      editor.focus();
    });
  };
  var open$2 = function (editor) {
    var cellElm, data, classListCtrl, cells = [];
    cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
    cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
    if (!cells.length && cellElm) {
      cells.push(cellElm);
    }
    cellElm = cellElm || cells[0];
    if (!cellElm) {
      return;
    }
    if (cells.length > 1) {
      data = {
        width: '',
        height: '',
        scope: '',
        'class': '',
        align: '',
        style: '',
        type: cellElm.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement$2(editor, cellElm);
    }
    if (editor.settings.table_cell_class_list) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_18ps4mnajc7tmda6.buildListItems(editor.settings.table_cell_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'td',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    var generalCellForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          layout: 'grid',
          columns: 2,
          labelGapCalc: false,
          padding: 0,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: [
            {
              label: 'Width',
              name: 'width',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_av3vphjhjc7tmcee.curry($_18ps4mnajc7tmda6.updateStyleField, editor)
            },
            {
              label: 'Cell type',
              name: 'type',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'Cell',
                  value: 'td'
                },
                {
                  text: 'Header cell',
                  value: 'th'
                }
              ]
            },
            {
              label: 'Scope',
              name: 'scope',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Row',
                  value: 'row'
                },
                {
                  text: 'Column',
                  value: 'col'
                },
                {
                  text: 'Row group',
                  value: 'rowgroup'
                },
                {
                  text: 'Column group',
                  value: 'colgroup'
                }
              ]
            },
            {
              label: 'H Align',
              name: 'align',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Left',
                  value: 'left'
                },
                {
                  text: 'Center',
                  value: 'center'
                },
                {
                  text: 'Right',
                  value: 'right'
                }
              ]
            },
            {
              label: 'V Align',
              name: 'valign',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Top',
                  value: 'top'
                },
                {
                  text: 'Middle',
                  value: 'middle'
                },
                {
                  text: 'Bottom',
                  value: 'bottom'
                }
              ]
            }
          ]
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_cell_advtab !== false) {
      editor.windowManager.open({
        title: 'Cell properties',
        bodyType: 'tabpanel',
        data: data,
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalCellForm
          },
          $_18ps4mnajc7tmda6.createStyleForm(editor)
        ],
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitCellForm, editor, cells)
      });
    } else {
      editor.windowManager.open({
        title: 'Cell properties',
        data: data,
        body: generalCellForm,
        onsubmit: $_av3vphjhjc7tmcee.curry(onSubmitCellForm, editor, cells)
      });
    }
  };
  var $_4htgzwncjc7tmdar = { open: open$2 };

  var each$3 = Tools.each;
  var clipboardRows = $_8zi7zzjgjc7tmce9.none();
  var getClipboardRows = function () {
    return clipboardRows.fold(function () {
      return;
    }, function (rows) {
      return $_f8juj3jfjc7tmcdy.map(rows, function (row) {
        return row.dom();
      });
    });
  };
  var setClipboardRows = function (rows) {
    var sugarRows = $_f8juj3jfjc7tmcdy.map(rows, $_2bd3y0jujc7tmci2.fromDom);
    clipboardRows = $_8zi7zzjgjc7tmce9.from(sugarRows);
  };
  var registerCommands = function (editor, actions, cellSelection, selections) {
    var isRoot = $_45jthun1jc7tmd8q.getIsRoot(editor);
    var eraseTable = function () {
      var cell = $_2bd3y0jujc7tmci2.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
      var table = $_dvsb29jrjc7tmcgo.table(cell, isRoot);
      table.filter($_av3vphjhjc7tmcee.not(isRoot)).each(function (table) {
        var cursor = $_2bd3y0jujc7tmci2.fromText('');
        $_bayouwkqjc7tmcn9.after(table, cursor);
        $_t0op8krjc7tmcnd.remove(table);
        var rng = editor.dom.createRng();
        rng.setStart(cursor.dom(), 0);
        rng.setEnd(cursor.dom(), 0);
        editor.selection.setRng(rng);
      });
    };
    var getSelectionStartCell = function () {
      return $_2bd3y0jujc7tmci2.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
    };
    var getTableFromCell = function (cell) {
      return $_dvsb29jrjc7tmcgo.table(cell, isRoot);
    };
    var actOnSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      table.each(function (table) {
        var targets = $_i3cwml0jc7tmcpm.forMenu(selections, table, cell);
        execute(table, targets).each(function (rng) {
          editor.selection.setRng(rng);
          editor.focus();
          cellSelection.clear(table);
        });
      });
    };
    var copyRowSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      return table.bind(function (table) {
        var doc = $_2bd3y0jujc7tmci2.fromDom(editor.getDoc());
        var targets = $_i3cwml0jc7tmcpm.forMenu(selections, table, cell);
        var generators = $_czudfqktjc7tmcnp.cellOperations($_av3vphjhjc7tmcee.noop, doc, $_8zi7zzjgjc7tmce9.none());
        return $_393btnn5jc7tmd9p.copyRows(table, targets, generators);
      });
    };
    var pasteOnSelection = function (execute) {
      clipboardRows.each(function (rows) {
        var clonedRows = $_f8juj3jfjc7tmcdy.map(rows, function (row) {
          return $_3eftumkujc7tmcok.deep(row);
        });
        var cell = getSelectionStartCell();
        var table = getTableFromCell(cell);
        table.bind(function (table) {
          var doc = $_2bd3y0jujc7tmci2.fromDom(editor.getDoc());
          var generators = $_czudfqktjc7tmcnp.paste(doc);
          var targets = $_i3cwml0jc7tmcpm.pasteRows(selections, table, cell, clonedRows, generators);
          execute(table, targets).each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
            cellSelection.clear(table);
          });
        });
      });
    };
    each$3({
      mceTableSplitCells: function () {
        actOnSelection(actions.unmergeCells);
      },
      mceTableMergeCells: function () {
        actOnSelection(actions.mergeCells);
      },
      mceTableInsertRowBefore: function () {
        actOnSelection(actions.insertRowsBefore);
      },
      mceTableInsertRowAfter: function () {
        actOnSelection(actions.insertRowsAfter);
      },
      mceTableInsertColBefore: function () {
        actOnSelection(actions.insertColumnsBefore);
      },
      mceTableInsertColAfter: function () {
        actOnSelection(actions.insertColumnsAfter);
      },
      mceTableDeleteCol: function () {
        actOnSelection(actions.deleteColumn);
      },
      mceTableDeleteRow: function () {
        actOnSelection(actions.deleteRow);
      },
      mceTableCutRow: function (grid) {
        clipboardRows = copyRowSelection();
        actOnSelection(actions.deleteRow);
      },
      mceTableCopyRow: function (grid) {
        clipboardRows = copyRowSelection();
      },
      mceTablePasteRowBefore: function (grid) {
        pasteOnSelection(actions.pasteRowsBefore);
      },
      mceTablePasteRowAfter: function (grid) {
        pasteOnSelection(actions.pasteRowsAfter);
      },
      mceTableDelete: eraseTable
    }, function (func, name) {
      editor.addCommand(name, func);
    });
    each$3({
      mceInsertTable: $_av3vphjhjc7tmcee.curry($_g5wwfun7jc7tmd9u.open, editor),
      mceTableProps: $_av3vphjhjc7tmcee.curry($_g5wwfun7jc7tmd9u.open, editor, true),
      mceTableRowProps: $_av3vphjhjc7tmcee.curry($_81ronbjc7tmdaf.open, editor),
      mceTableCellProps: $_av3vphjhjc7tmcee.curry($_4htgzwncjc7tmdar.open, editor)
    }, function (func, name) {
      editor.addCommand(name, function (ui, val) {
        func(val);
      });
    });
  };
  var $_d52iqgn4jc7tmd91 = {
    registerCommands: registerCommands,
    getClipboardRows: getClipboardRows,
    setClipboardRows: setClipboardRows
  };

  var only$1 = function (element) {
    var parent = $_8zi7zzjgjc7tmce9.from(element.dom().documentElement).map($_2bd3y0jujc7tmci2.fromDom).getOr(element);
    return {
      parent: $_av3vphjhjc7tmcee.constant(parent),
      view: $_av3vphjhjc7tmcee.constant(element),
      origin: $_av3vphjhjc7tmcee.constant(r(0, 0))
    };
  };
  var detached = function (editable, chrome) {
    var origin = $_av3vphjhjc7tmcee.curry($_ad66zylwjc7tmcyc.absolute, chrome);
    return {
      parent: $_av3vphjhjc7tmcee.constant(chrome),
      view: $_av3vphjhjc7tmcee.constant(editable),
      origin: origin
    };
  };
  var body$1 = function (editable, chrome) {
    return {
      parent: $_av3vphjhjc7tmcee.constant(chrome),
      view: $_av3vphjhjc7tmcee.constant(editable),
      origin: $_av3vphjhjc7tmcee.constant(r(0, 0))
    };
  };
  var $_31roqdnejc7tmdbe = {
    only: only$1,
    detached: detached,
    body: body$1
  };

  var Event = function (fields) {
    var struct = $_10a874jkjc7tmcfr.immutable.apply(null, fields);
    var handlers = [];
    var bind = function (handler) {
      if (handler === undefined) {
        throw 'Event bind error: undefined handler';
      }
      handlers.push(handler);
    };
    var unbind = function (handler) {
      handlers = $_f8juj3jfjc7tmcdy.filter(handlers, function (h) {
        return h !== handler;
      });
    };
    var trigger = function () {
      var event = struct.apply(null, arguments);
      $_f8juj3jfjc7tmcdy.each(handlers, function (handler) {
        handler(event);
      });
    };
    return {
      bind: bind,
      unbind: unbind,
      trigger: trigger
    };
  };

  var create = function (typeDefs) {
    var registry = $_dn7d6zjjjc7tmcfa.map(typeDefs, function (event) {
      return {
        bind: event.bind,
        unbind: event.unbind
      };
    });
    var trigger = $_dn7d6zjjjc7tmcfa.map(typeDefs, function (event) {
      return event.trigger;
    });
    return {
      registry: registry,
      trigger: trigger
    };
  };
  var $_ajmw56nhjc7tmdcl = { create: create };

  var mode = $_ckugobm3jc7tmd06.exactly([
    'compare',
    'extract',
    'mutate',
    'sink'
  ]);
  var sink$1 = $_ckugobm3jc7tmd06.exactly([
    'element',
    'start',
    'stop',
    'destroy'
  ]);
  var api$3 = $_ckugobm3jc7tmd06.exactly([
    'forceDrop',
    'drop',
    'move',
    'delayDrop'
  ]);
  var $_66x6xsnljc7tmde0 = {
    mode: mode,
    sink: sink$1,
    api: api$3
  };

  var styles$1 = $_fh1jgimjjc7tmd4m.css('ephox-dragster');
  var $_5k41iennjc7tmdeg = { resolve: styles$1.resolve };

  var Blocker = function (options) {
    var settings = $_arzln8m8jc7tmd1o.merge({ 'layerClass': $_5k41iennjc7tmdeg.resolve('blocker') }, options);
    var div = $_2bd3y0jujc7tmci2.fromTag('div');
    $_9o3gmekfjc7tmckw.set(div, 'role', 'presentation');
    $_fsmkrhkojc7tmcmj.setAll(div, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    });
    $_7rzfb6mkjc7tmd4q.add(div, $_5k41iennjc7tmdeg.resolve('blocker'));
    $_7rzfb6mkjc7tmd4q.add(div, settings.layerClass);
    var element = function () {
      return div;
    };
    var destroy = function () {
      $_t0op8krjc7tmcnd.remove(div);
    };
    return {
      element: element,
      destroy: destroy
    };
  };

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_av3vphjhjc7tmcee.constant(target),
      'x': $_av3vphjhjc7tmcee.constant(x),
      'y': $_av3vphjhjc7tmcee.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_av3vphjhjc7tmcee.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_2bd3y0jujc7tmci2.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_av3vphjhjc7tmcee.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_av3vphjhjc7tmcee.curry(unbind, element, event, wrapped, useCapture) };
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
  var $_6et31hnpjc7tmder = {
    bind: bind$2,
    capture: capture$1
  };

  var filter$1 = $_av3vphjhjc7tmcee.constant(true);
  var bind$1 = function (element, event, handler) {
    return $_6et31hnpjc7tmder.bind(element, event, filter$1, handler);
  };
  var capture = function (element, event, handler) {
    return $_6et31hnpjc7tmder.capture(element, event, filter$1, handler);
  };
  var $_cw002vnojc7tmdel = {
    bind: bind$1,
    capture: capture
  };

  var compare = function (old, nu) {
    return r(nu.left() - old.left(), nu.top() - old.top());
  };
  var extract$1 = function (event) {
    return $_8zi7zzjgjc7tmce9.some(r(event.x(), event.y()));
  };
  var mutate$1 = function (mutation, info) {
    mutation.mutate(info.left(), info.top());
  };
  var sink = function (dragApi, settings) {
    var blocker = Blocker(settings);
    var mdown = $_cw002vnojc7tmdel.bind(blocker.element(), 'mousedown', dragApi.forceDrop);
    var mup = $_cw002vnojc7tmdel.bind(blocker.element(), 'mouseup', dragApi.drop);
    var mmove = $_cw002vnojc7tmdel.bind(blocker.element(), 'mousemove', dragApi.move);
    var mout = $_cw002vnojc7tmdel.bind(blocker.element(), 'mouseout', dragApi.delayDrop);
    var destroy = function () {
      blocker.destroy();
      mup.unbind();
      mmove.unbind();
      mout.unbind();
      mdown.unbind();
    };
    var start = function (parent) {
      $_bayouwkqjc7tmcn9.append(parent, blocker.element());
    };
    var stop = function () {
      $_t0op8krjc7tmcnd.remove(blocker.element());
    };
    return $_66x6xsnljc7tmde0.sink({
      element: blocker.element,
      start: start,
      stop: stop,
      destroy: destroy
    });
  };
  var MouseDrag = $_66x6xsnljc7tmde0.mode({
    compare: compare,
    extract: extract$1,
    sink: sink,
    mutate: mutate$1
  });

  var InDrag = function () {
    var previous = $_8zi7zzjgjc7tmce9.none();
    var reset = function () {
      previous = $_8zi7zzjgjc7tmce9.none();
    };
    var update = function (mode, nu) {
      var result = previous.map(function (old) {
        return mode.compare(old, nu);
      });
      previous = $_8zi7zzjgjc7tmce9.some(nu);
      return result;
    };
    var onEvent = function (event, mode) {
      var dataOption = mode.extract(event);
      dataOption.each(function (data) {
        var offset = update(mode, data);
        offset.each(function (d) {
          events.trigger.move(d);
        });
      });
    };
    var events = $_ajmw56nhjc7tmdcl.create({ move: Event(['info']) });
    return {
      onEvent: onEvent,
      reset: reset,
      events: events.registry
    };
  };

  var NoDrag = function (anchor) {
    var onEvent = function (event, mode) {
    };
    return {
      onEvent: onEvent,
      reset: $_av3vphjhjc7tmcee.noop
    };
  };

  var Movement = function () {
    var noDragState = NoDrag();
    var inDragState = InDrag();
    var dragState = noDragState;
    var on = function () {
      dragState.reset();
      dragState = inDragState;
    };
    var off = function () {
      dragState.reset();
      dragState = noDragState;
    };
    var onEvent = function (event, mode) {
      dragState.onEvent(event, mode);
    };
    var isOn = function () {
      return dragState === inDragState;
    };
    return {
      on: on,
      off: off,
      isOn: isOn,
      onEvent: onEvent,
      events: inDragState.events
    };
  };

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
  var $_aaz4o3nujc7tmdfn = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var setup = function (mutation, mode, settings) {
    var active = false;
    var events = $_ajmw56nhjc7tmdcl.create({
      start: Event([]),
      stop: Event([])
    });
    var movement = Movement();
    var drop = function () {
      sink.stop();
      if (movement.isOn()) {
        movement.off();
        events.trigger.stop();
      }
    };
    var throttledDrop = $_aaz4o3nujc7tmdfn.last(drop, 200);
    var go = function (parent) {
      sink.start(parent);
      movement.on();
      events.trigger.start();
    };
    var mousemove = function (event, ui) {
      throttledDrop.cancel();
      movement.onEvent(event, mode);
    };
    movement.events.move.bind(function (event) {
      mode.mutate(mutation, event.info());
    });
    var on = function () {
      active = true;
    };
    var off = function () {
      active = false;
    };
    var runIfActive = function (f) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if (active) {
          return f.apply(null, args);
        }
      };
    };
    var sink = mode.sink($_66x6xsnljc7tmde0.api({
      forceDrop: drop,
      drop: runIfActive(drop),
      move: runIfActive(mousemove),
      delayDrop: runIfActive(throttledDrop.throttle)
    }), settings);
    var destroy = function () {
      sink.destroy();
    };
    return {
      element: sink.element,
      go: go,
      on: on,
      off: off,
      destroy: destroy,
      events: events.registry
    };
  };
  var $_ekjmdunqjc7tmdey = { setup: setup };

  var transform$1 = function (mutation, options) {
    var settings = options !== undefined ? options : {};
    var mode = settings.mode !== undefined ? settings.mode : MouseDrag;
    return $_ekjmdunqjc7tmdey.setup(mutation, mode, options);
  };
  var $_fhmpumnjjc7tmddj = { transform: transform$1 };

  var Mutation = function () {
    var events = $_ajmw56nhjc7tmdcl.create({
      'drag': Event([
        'xDelta',
        'yDelta'
      ])
    });
    var mutate = function (x, y) {
      events.trigger.drag(x, y);
    };
    return {
      mutate: mutate,
      events: events.registry
    };
  };

  var BarMutation = function () {
    var events = $_ajmw56nhjc7tmdcl.create({
      drag: Event([
        'xDelta',
        'yDelta',
        'target'
      ])
    });
    var target = $_8zi7zzjgjc7tmce9.none();
    var delegate = Mutation();
    delegate.events.drag.bind(function (event) {
      target.each(function (t) {
        events.trigger.drag(event.xDelta(), event.yDelta(), t);
      });
    });
    var assign = function (t) {
      target = $_8zi7zzjgjc7tmce9.some(t);
    };
    var get = function () {
      return target;
    };
    return {
      assign: assign,
      get: get,
      mutate: delegate.mutate,
      events: events.registry
    };
  };

  var any = function (selector) {
    return $_ft53o4kkjc7tmcln.first(selector).isSome();
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_ft53o4kkjc7tmcln.ancestor(scope, selector, isRoot).isSome();
  };
  var sibling$2 = function (scope, selector) {
    return $_ft53o4kkjc7tmcln.sibling(scope, selector).isSome();
  };
  var child$3 = function (scope, selector) {
    return $_ft53o4kkjc7tmcln.child(scope, selector).isSome();
  };
  var descendant$2 = function (scope, selector) {
    return $_ft53o4kkjc7tmcln.descendant(scope, selector).isSome();
  };
  var closest$2 = function (scope, selector, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(scope, selector, isRoot).isSome();
  };
  var $_we552nxjc7tmdgd = {
    any: any,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var resizeBarDragging = $_2ejmldmijc7tmd4h.resolve('resizer-bar-dragging');
  var BarManager = function (wire, direction, hdirection) {
    var mutation = BarMutation();
    var resizing = $_fhmpumnjjc7tmddj.transform(mutation, {});
    var hoverTable = $_8zi7zzjgjc7tmce9.none();
    var getResizer = function (element, type) {
      return $_8zi7zzjgjc7tmce9.from($_9o3gmekfjc7tmckw.get(element, type));
    };
    mutation.events.drag.bind(function (event) {
      getResizer(event.target(), 'data-row').each(function (_dataRow) {
        var currentRow = $_93q72myjc7tmd7z.getInt(event.target(), 'top');
        $_fsmkrhkojc7tmcmj.set(event.target(), 'top', currentRow + event.yDelta() + 'px');
      });
      getResizer(event.target(), 'data-column').each(function (_dataCol) {
        var currentCol = $_93q72myjc7tmd7z.getInt(event.target(), 'left');
        $_fsmkrhkojc7tmcmj.set(event.target(), 'left', currentCol + event.xDelta() + 'px');
      });
    });
    var getDelta = function (target, direction) {
      var newX = $_93q72myjc7tmd7z.getInt(target, direction);
      var oldX = parseInt($_9o3gmekfjc7tmckw.get(target, 'data-initial-' + direction), 10);
      return newX - oldX;
    };
    resizing.events.stop.bind(function () {
      mutation.get().each(function (target) {
        hoverTable.each(function (table) {
          getResizer(target, 'data-row').each(function (row) {
            var delta = getDelta(target, 'top');
            $_9o3gmekfjc7tmckw.remove(target, 'data-initial-top');
            events.trigger.adjustHeight(table, delta, parseInt(row, 10));
          });
          getResizer(target, 'data-column').each(function (column) {
            var delta = getDelta(target, 'left');
            $_9o3gmekfjc7tmckw.remove(target, 'data-initial-left');
            events.trigger.adjustWidth(table, delta, parseInt(column, 10));
          });
          $_f8gh8gmejc7tmd38.refresh(wire, table, hdirection, direction);
        });
      });
    });
    var handler = function (target, direction) {
      events.trigger.startAdjust();
      mutation.assign(target);
      $_9o3gmekfjc7tmckw.set(target, 'data-initial-' + direction, parseInt($_fsmkrhkojc7tmcmj.get(target, direction), 10));
      $_7rzfb6mkjc7tmd4q.add(target, resizeBarDragging);
      $_fsmkrhkojc7tmcmj.set(target, 'opacity', '0.2');
      resizing.go(wire.parent());
    };
    var mousedown = $_cw002vnojc7tmdel.bind(wire.parent(), 'mousedown', function (event) {
      if ($_f8gh8gmejc7tmd38.isRowBar(event.target()))
        handler(event.target(), 'top');
      if ($_f8gh8gmejc7tmd38.isColBar(event.target()))
        handler(event.target(), 'left');
    });
    var isRoot = function (e) {
      return $_4co3lyjyjc7tmciu.eq(e, wire.view());
    };
    var mouseover = $_cw002vnojc7tmdel.bind(wire.view(), 'mouseover', function (event) {
      if ($_fxq8yvkgjc7tmcl4.name(event.target()) === 'table' || $_we552nxjc7tmdgd.ancestor(event.target(), 'table', isRoot)) {
        hoverTable = $_fxq8yvkgjc7tmcl4.name(event.target()) === 'table' ? $_8zi7zzjgjc7tmce9.some(event.target()) : $_ft53o4kkjc7tmcln.ancestor(event.target(), 'table', isRoot);
        hoverTable.each(function (ht) {
          $_f8gh8gmejc7tmd38.refresh(wire, ht, hdirection, direction);
        });
      } else if ($_84qvvkjjc7tmclf.inBody(event.target())) {
        $_f8gh8gmejc7tmd38.destroy(wire);
      }
    });
    var destroy = function () {
      mousedown.unbind();
      mouseover.unbind();
      resizing.destroy();
      $_f8gh8gmejc7tmd38.destroy(wire);
    };
    var refresh = function (tbl) {
      $_f8gh8gmejc7tmd38.refresh(wire, tbl, hdirection, direction);
    };
    var events = $_ajmw56nhjc7tmdcl.create({
      adjustHeight: Event([
        'table',
        'delta',
        'row'
      ]),
      adjustWidth: Event([
        'table',
        'delta',
        'column'
      ]),
      startAdjust: Event([])
    });
    return {
      destroy: destroy,
      refresh: refresh,
      on: resizing.on,
      off: resizing.off,
      hideBars: $_av3vphjhjc7tmcee.curry($_f8gh8gmejc7tmd38.hide, wire),
      showBars: $_av3vphjhjc7tmcee.curry($_f8gh8gmejc7tmd38.show, wire),
      events: events.registry
    };
  };

  var TableResize = function (wire, vdirection) {
    var hdirection = $_a2g1falvjc7tmcy2.height;
    var manager = BarManager(wire, vdirection, hdirection);
    var events = $_ajmw56nhjc7tmdcl.create({
      beforeResize: Event(['table']),
      afterResize: Event(['table']),
      startDrag: Event([])
    });
    manager.events.adjustHeight.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = hdirection.delta(event.delta(), event.table());
      $_ccw6efmujc7tmd76.adjustHeight(event.table(), delta, event.row(), hdirection);
      events.trigger.afterResize(event.table());
    });
    manager.events.startAdjust.bind(function (event) {
      events.trigger.startDrag();
    });
    manager.events.adjustWidth.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = vdirection.delta(event.delta(), event.table());
      $_ccw6efmujc7tmd76.adjustWidth(event.table(), delta, event.column(), vdirection);
      events.trigger.afterResize(event.table());
    });
    return {
      on: manager.on,
      off: manager.off,
      hideBars: manager.hideBars,
      showBars: manager.showBars,
      destroy: manager.destroy,
      events: events.registry
    };
  };

  var createContainer = function () {
    var container = $_2bd3y0jujc7tmci2.fromTag('div');
    $_fsmkrhkojc7tmcmj.setAll(container, {
      position: 'static',
      height: '0',
      width: '0',
      padding: '0',
      margin: '0',
      border: '0'
    });
    $_bayouwkqjc7tmcn9.append($_84qvvkjjc7tmclf.body(), container);
    return container;
  };
  var get$8 = function (editor, container) {
    return editor.inline ? $_31roqdnejc7tmdbe.body($_45jthun1jc7tmd8q.getBody(editor), createContainer()) : $_31roqdnejc7tmdbe.only($_2bd3y0jujc7tmci2.fromDom(editor.getDoc()));
  };
  var remove$6 = function (editor, wire) {
    if (editor.inline) {
      $_t0op8krjc7tmcnd.remove(wire.parent());
    }
  };
  var $_8bn5rqnyjc7tmdgf = {
    get: get$8,
    remove: remove$6
  };

  var ResizeHandler = function (editor) {
    var selectionRng = $_8zi7zzjgjc7tmce9.none();
    var resize = $_8zi7zzjgjc7tmce9.none();
    var wire = $_8zi7zzjgjc7tmce9.none();
    var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
    var startW, startRawW;
    var isTable = function (elm) {
      return elm.nodeName === 'TABLE';
    };
    var getRawWidth = function (elm) {
      return editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width');
    };
    var lazyResize = function () {
      return resize;
    };
    var lazyWire = function () {
      return wire.getOr($_31roqdnejc7tmdbe.only($_2bd3y0jujc7tmci2.fromDom(editor.getBody())));
    };
    var destroy = function () {
      resize.each(function (sz) {
        sz.destroy();
      });
      wire.each(function (w) {
        $_8bn5rqnyjc7tmdgf.remove(editor, w);
      });
    };
    editor.on('init', function () {
      var direction = TableDirection($_gd6kqnn2jc7tmd8u.directionAt);
      var rawWire = $_8bn5rqnyjc7tmdgf.get(editor);
      wire = $_8zi7zzjgjc7tmce9.some(rawWire);
      if (editor.settings.object_resizing && editor.settings.table_resize_bars !== false && (editor.settings.object_resizing === true || editor.settings.object_resizing === 'table')) {
        var sz = TableResize(rawWire, direction);
        sz.on();
        sz.events.startDrag.bind(function (event) {
          selectionRng = $_8zi7zzjgjc7tmce9.some(editor.selection.getRng());
        });
        sz.events.afterResize.bind(function (event) {
          var table = event.table();
          var dataStyleCells = $_7y6210khjc7tmcl8.descendants(table, 'td[data-mce-style],th[data-mce-style]');
          $_f8juj3jfjc7tmcdy.each(dataStyleCells, function (cell) {
            $_9o3gmekfjc7tmckw.remove(cell, 'data-mce-style');
          });
          selectionRng.each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
          });
          editor.undoManager.add();
        });
        resize = $_8zi7zzjgjc7tmce9.some(sz);
      }
    });
    editor.on('ObjectResizeStart', function (e) {
      if (isTable(e.target)) {
        startW = e.width;
        startRawW = getRawWidth(e.target);
      }
    });
    editor.on('ObjectResized', function (e) {
      if (isTable(e.target)) {
        var table = e.target;
        if (percentageBasedSizeRegex.test(startRawW)) {
          var percentW = parseFloat(percentageBasedSizeRegex.exec(startRawW)[1]);
          var targetPercentW = e.width * percentW / startW;
          editor.dom.setStyle(table, 'width', targetPercentW + '%');
        } else {
          var newCellSizes = [];
          Tools.each(table.rows, function (row) {
            Tools.each(row.cells, function (cell) {
              var width = editor.dom.getStyle(cell, 'width', true);
              newCellSizes.push({
                cell: cell,
                width: width
              });
            });
          });
          Tools.each(newCellSizes, function (newCellSize) {
            editor.dom.setStyle(newCellSize.cell, 'width', newCellSize.width);
            editor.dom.setAttrib(newCellSize.cell, 'width', null);
          });
        }
      }
    });
    return {
      lazyResize: lazyResize,
      lazyWire: lazyWire,
      destroy: destroy
    };
  };

  var none$2 = function (current) {
    return folder$1(function (n, f, m, l) {
      return n(current);
    });
  };
  var first$5 = function (current) {
    return folder$1(function (n, f, m, l) {
      return f(current);
    });
  };
  var middle$1 = function (current, target) {
    return folder$1(function (n, f, m, l) {
      return m(current, target);
    });
  };
  var last$4 = function (current) {
    return folder$1(function (n, f, m, l) {
      return l(current);
    });
  };
  var folder$1 = function (fold) {
    return { fold: fold };
  };
  var $_6dbx1ao1jc7tmdhb = {
    none: none$2,
    first: first$5,
    middle: middle$1,
    last: last$4
  };

  var detect$4 = function (current, isRoot) {
    return $_dvsb29jrjc7tmcgo.table(current, isRoot).bind(function (table) {
      var all = $_dvsb29jrjc7tmcgo.cells(table);
      var index = $_f8juj3jfjc7tmcdy.findIndex(all, function (x) {
        return $_4co3lyjyjc7tmciu.eq(current, x);
      });
      return index.map(function (ind) {
        return {
          index: $_av3vphjhjc7tmcee.constant(ind),
          all: $_av3vphjhjc7tmcee.constant(all)
        };
      });
    });
  };
  var next = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_6dbx1ao1jc7tmdhb.none(current);
    }, function (info) {
      return info.index() + 1 < info.all().length ? $_6dbx1ao1jc7tmdhb.middle(current, info.all()[info.index() + 1]) : $_6dbx1ao1jc7tmdhb.last(current);
    });
  };
  var prev = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_6dbx1ao1jc7tmdhb.none();
    }, function (info) {
      return info.index() - 1 >= 0 ? $_6dbx1ao1jc7tmdhb.middle(current, info.all()[info.index() - 1]) : $_6dbx1ao1jc7tmdhb.first(current);
    });
  };
  var $_2pysl3o0jc7tmdh4 = {
    next: next,
    prev: prev
  };

  var adt = $_sn5zylhjc7tmcui.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata$1 = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart$1 = function (situ) {
    return situ.fold($_av3vphjhjc7tmcee.identity, $_av3vphjhjc7tmcee.identity, $_av3vphjhjc7tmcee.identity);
  };
  var $_cz8apco3jc7tmdhi = {
    before: adt.before,
    on: adt.on,
    after: adt.after,
    cata: cata$1,
    getStart: getStart$1
  };

  var type$2 = $_sn5zylhjc7tmcui.generate([
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
  var range$2 = $_10a874jkjc7tmcfr.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$2.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_2bd3y0jujc7tmci2.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_cz8apco3jc7tmdhi.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart(selection);
    return $_66uz4xjwjc7tmcib.defaultView(start);
  };
  var $_1dawk8o2jc7tmdhd = {
    domRange: type$2.domRange,
    relative: type$2.relative,
    exact: type$2.exact,
    exactFromRange: exactFromRange,
    range: range$2,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_66uz4xjwjc7tmcib.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_2bd3y0jujc7tmci2.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_4co3lyjyjc7tmciu.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_35slfro5jc7tmdhw = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_f8juj3jfjc7tmcdy.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_2bd3y0jujc7tmci2.fromDom(fragment);
  };
  var $_6ri78co6jc7tmdhy = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin$1 = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$1 = function (win) {
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
    return $_2bd3y0jujc7tmci2.fromDom(fragment);
  };
  var toRect = function (rect) {
    return {
      left: $_av3vphjhjc7tmcee.constant(rect.left),
      top: $_av3vphjhjc7tmcee.constant(rect.top),
      right: $_av3vphjhjc7tmcee.constant(rect.right),
      bottom: $_av3vphjhjc7tmcee.constant(rect.bottom),
      width: $_av3vphjhjc7tmcee.constant(rect.width),
      height: $_av3vphjhjc7tmcee.constant(rect.height)
    };
  };
  var getFirstRect$1 = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_8zi7zzjgjc7tmce9.some(rect).map(toRect) : $_8zi7zzjgjc7tmce9.none();
  };
  var getBounds$2 = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_8zi7zzjgjc7tmce9.some(rect).map(toRect) : $_8zi7zzjgjc7tmce9.none();
  };
  var toString = function (rng) {
    return rng.toString();
  };
  var $_88mo3bo7jc7tmdi4 = {
    create: create$1,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$2,
    isWithin: isWithin$1,
    toString: toString
  };

  var adt$1 = $_sn5zylhjc7tmcui.generate([
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
    return type($_2bd3y0jujc7tmci2.fromDom(range.startContainer), range.startOffset, $_2bd3y0jujc7tmci2.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_av3vphjhjc7tmcee.constant(rng),
          rtl: $_8zi7zzjgjc7tmce9.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_33j3apk4jc7tmcjv.cached(function () {
            return $_88mo3bo7jc7tmdi4.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_33j3apk4jc7tmcjv.cached(function () {
            return $_8zi7zzjgjc7tmce9.some($_88mo3bo7jc7tmdi4.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_33j3apk4jc7tmcjv.cached(function () {
            return $_88mo3bo7jc7tmdi4.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_33j3apk4jc7tmcjv.cached(function () {
            return $_8zi7zzjgjc7tmce9.some($_88mo3bo7jc7tmdi4.exactToNative(win, finish, foffset, start, soffset));
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
        return adt$1.rtl($_2bd3y0jujc7tmci2.fromDom(rev.endContainer), rev.endOffset, $_2bd3y0jujc7tmci2.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$1.ltr, rng);
      });
    } else {
      return fromRange(win, adt$1.ltr, rng);
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
  var $_59qwsdo8jc7tmdid = {
    ltr: adt$1.ltr,
    rtl: adt$1.rtl,
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
  var $_q5vuaobjc7tmdja = {
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
    var length = $_asu5ztkxjc7tmcp2.get(textnode).length;
    var offset = $_q5vuaobjc7tmdja.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_b9kaemm9jc7tmd1q.findMap(rects, function (rect) {
      return $_q5vuaobjc7tmdja.inRect(rect, x, y) ? $_8zi7zzjgjc7tmce9.some(rect) : $_8zi7zzjgjc7tmce9.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_686tepocjc7tmdjd = { locate: locate$1 };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_66uz4xjwjc7tmcib.children(node);
    return $_b9kaemm9jc7tmd1q.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_q5vuaobjc7tmdja.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : $_8zi7zzjgjc7tmce9.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_fxq8yvkgjc7tmcl4.isText(node) ? $_686tepocjc7tmdjd.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_g2k89foajc7tmdj1 = { locate: locate };

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
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_1c60c4kvjc7tmcoq.first : $_1c60c4kvjc7tmcoq.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return $_8zi7zzjgjc7tmce9.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search = function (doc, node, x) {
    var f = $_66uz4xjwjc7tmcib.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_qaulqodjc7tmdjl = { search: search };

  var caretPositionFromPoint = function (doc, x, y) {
    return $_8zi7zzjgjc7tmce9.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return $_8zi7zzjgjc7tmce9.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return $_8zi7zzjgjc7tmce9.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return $_8zi7zzjgjc7tmce9.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_g2k89foajc7tmdj1.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_2bd3y0jujc7tmci2.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_qaulqodjc7tmdjl.search(doc, elem, x);
      };
      return $_66uz4xjwjc7tmcib.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_2bd3y0jujc7tmci2.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_1dawk8o2jc7tmdhd.range($_2bd3y0jujc7tmci2.fromDom(rng.startContainer), rng.startOffset, $_2bd3y0jujc7tmci2.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_4neujbo9jc7tmdiu = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_88mo3bo7jc7tmdi4.create(win);
    var self = $_a0jew7jtjc7tmchx.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_7y6210khjc7tmcl8.descendants(ancestor, selector));
    return $_f8juj3jfjc7tmcdy.filter(elements, function (elem) {
      $_88mo3bo7jc7tmdi4.selectNodeContentsUsing(innerRange, elem);
      return $_88mo3bo7jc7tmdi4.isWithin(outerRange, innerRange);
    });
  };
  var find$3 = function (win, selection, selector) {
    var outerRange = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    var ancestor = $_2bd3y0jujc7tmci2.fromDom(outerRange.commonAncestorContainer);
    return $_fxq8yvkgjc7tmcl4.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_6831oboejc7tmdjr = { find: find$3 };

  var beforeSpecial = function (element, offset) {
    var name = $_fxq8yvkgjc7tmcl4.name(element);
    if ('input' === name)
      return $_cz8apco3jc7tmdhi.after(element);
    else if (!$_f8juj3jfjc7tmcdy.contains([
        'br',
        'img'
      ], name))
      return $_cz8apco3jc7tmdhi.on(element, offset);
    else
      return offset === 0 ? $_cz8apco3jc7tmdhi.before(element) : $_cz8apco3jc7tmdhi.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_cz8apco3jc7tmdhi.before, beforeSpecial, $_cz8apco3jc7tmdhi.after);
    var finish = finishSitu.fold($_cz8apco3jc7tmdhi.before, beforeSpecial, $_cz8apco3jc7tmdhi.after);
    return $_1dawk8o2jc7tmdhd.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_1dawk8o2jc7tmdhd.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_2bd3y0jujc7tmci2.fromDom(rng.startContainer);
        var finish = $_2bd3y0jujc7tmci2.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_4fzlshofjc7tmdjx = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    $_8zi7zzjgjc7tmce9.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_88mo3bo7jc7tmdi4.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_6831oboejc7tmdjr.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_59qwsdo8jc7tmdid.diagnose(win, relative).match({
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
    var relative = $_4fzlshofjc7tmdjx.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_4fzlshofjc7tmdjx.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_1dawk8o2jc7tmdhd.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_88mo3bo7jc7tmdi4.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_4fzlshofjc7tmdjx.preprocess(selection);
    return $_59qwsdo8jc7tmdid.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return $_8zi7zzjgjc7tmce9.some($_1dawk8o2jc7tmdhd.range($_2bd3y0jujc7tmci2.fromDom(firstRng.startContainer), firstRng.startOffset, $_2bd3y0jujc7tmci2.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return $_8zi7zzjgjc7tmce9.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_2bd3y0jujc7tmci2.fromDom(selection.anchorNode);
    var focusNode = $_2bd3y0jujc7tmci2.fromDom(selection.focusNode);
    return $_35slfro5jc7tmdhw.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? $_8zi7zzjgjc7tmce9.some($_1dawk8o2jc7tmdhd.range($_2bd3y0jujc7tmci2.fromDom(selection.anchorNode), selection.anchorOffset, $_2bd3y0jujc7tmci2.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_88mo3bo7jc7tmdi4.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_88mo3bo7jc7tmdi4.selectNodeContents(win, element);
    return $_1dawk8o2jc7tmdhd.range($_2bd3y0jujc7tmci2.fromDom(rng.startContainer), rng.startOffset, $_2bd3y0jujc7tmci2.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : $_8zi7zzjgjc7tmce9.none();
  };
  var get$9 = function (win) {
    return getExact(win).map(function (range) {
      return $_1dawk8o2jc7tmdhd.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    return $_88mo3bo7jc7tmdi4.getFirstRect(rng);
  };
  var getBounds$1 = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    return $_88mo3bo7jc7tmdi4.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_4neujbo9jc7tmdiu.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    return $_88mo3bo7jc7tmdi4.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$2 = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    return $_88mo3bo7jc7tmdi4.cloneFragment(rng);
  };
  var replace$1 = function (win, selection, elements) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    var fragment = $_6ri78co6jc7tmdhy.fromElements(elements, win.document);
    $_88mo3bo7jc7tmdi4.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    $_88mo3bo7jc7tmdi4.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_4co3lyjyjc7tmciu.eq(start, finish) && soffset === foffset;
  };
  var $_jrlp0o4jc7tmdhn = {
    setExact: setExact,
    getExact: getExact,
    get: get$9,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$2,
    replace: replace$1,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect,
    getBounds: getBounds$1,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var VK = tinymce.util.Tools.resolve('tinymce.util.VK');

  var forward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_2pysl3o0jc7tmdh4.next(cell), lazyWire);
  };
  var backward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_2pysl3o0jc7tmdh4.prev(cell), lazyWire);
  };
  var getCellFirstCursorPosition = function (editor, cell) {
    var selection = $_1dawk8o2jc7tmdhd.exact(cell, 0, cell, 0);
    return $_jrlp0o4jc7tmdhn.toNative(selection);
  };
  var getNewRowCursorPosition = function (editor, table) {
    var rows = $_7y6210khjc7tmcl8.descendants(table, 'tr');
    return $_f8juj3jfjc7tmcdy.last(rows).bind(function (last) {
      return $_ft53o4kkjc7tmcln.descendant(last, 'td,th').map(function (first) {
        return getCellFirstCursorPosition(editor, first);
      });
    });
  };
  var go = function (editor, isRoot, cell, actions, lazyWire) {
    return cell.fold($_8zi7zzjgjc7tmce9.none, $_8zi7zzjgjc7tmce9.none, function (current, next) {
      return $_1c60c4kvjc7tmcoq.first(next).map(function (cell) {
        return getCellFirstCursorPosition(editor, cell);
      });
    }, function (current) {
      return $_dvsb29jrjc7tmcgo.table(current, isRoot).bind(function (table) {
        var targets = $_i3cwml0jc7tmcpm.noMenu(current);
        editor.undoManager.transact(function () {
          actions.insertRowsAfter(table, targets);
        });
        return getNewRowCursorPosition(editor, table);
      });
    });
  };
  var rootElements = [
    'table',
    'li',
    'dl'
  ];
  var handle$1 = function (event, editor, actions, lazyWire) {
    if (event.keyCode === VK.TAB) {
      var body = $_45jthun1jc7tmd8q.getBody(editor);
      var isRoot = function (element) {
        var name = $_fxq8yvkgjc7tmcl4.name(element);
        return $_4co3lyjyjc7tmciu.eq(element, body) || $_f8juj3jfjc7tmcdy.contains(rootElements, name);
      };
      var rng = editor.selection.getRng();
      if (rng.collapsed) {
        var start = $_2bd3y0jujc7tmci2.fromDom(rng.startContainer);
        $_dvsb29jrjc7tmcgo.cell(start, isRoot).each(function (cell) {
          event.preventDefault();
          var navigation = event.shiftKey ? backward : forward;
          var rng = navigation(editor, isRoot, cell, actions, lazyWire);
          rng.each(function (range) {
            editor.selection.setRng(range);
          });
        });
      }
    }
  };
  var $_4hssyknzjc7tmdgo = { handle: handle$1 };

  var response = $_10a874jkjc7tmcfr.immutable('selection', 'kill');
  var $_7qs9ohojjc7tmdl1 = { response: response };

  var isKey = function (key) {
    return function (keycode) {
      return keycode === key;
    };
  };
  var isUp = isKey(38);
  var isDown = isKey(40);
  var isNavigation = function (keycode) {
    return keycode >= 37 && keycode <= 40;
  };
  var $_3tdo0qokjc7tmdl6 = {
    ltr: {
      isBackward: isKey(37),
      isForward: isKey(39)
    },
    rtl: {
      isBackward: isKey(39),
      isForward: isKey(37)
    },
    isUp: isUp,
    isDown: isDown,
    isNavigation: isNavigation
  };

  var convertToRange = function (win, selection) {
    var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, selection);
    return {
      start: $_av3vphjhjc7tmcee.constant($_2bd3y0jujc7tmci2.fromDom(rng.startContainer)),
      soffset: $_av3vphjhjc7tmcee.constant(rng.startOffset),
      finish: $_av3vphjhjc7tmcee.constant($_2bd3y0jujc7tmci2.fromDom(rng.endContainer)),
      foffset: $_av3vphjhjc7tmcee.constant(rng.endOffset)
    };
  };
  var makeSitus = function (start, soffset, finish, foffset) {
    return {
      start: $_av3vphjhjc7tmcee.constant($_cz8apco3jc7tmdhi.on(start, soffset)),
      finish: $_av3vphjhjc7tmcee.constant($_cz8apco3jc7tmdhi.on(finish, foffset))
    };
  };
  var $_7e547uomjc7tmdm5 = {
    convertToRange: convertToRange,
    makeSitus: makeSitus
  };

  var isSafari = $_enuqxfk3jc7tmcjq.detect().browser.isSafari();
  var get$10 = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
    var y = doc.body.scrollTop || doc.documentElement.scrollTop;
    return r(x, y);
  };
  var to = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollTo(x, y);
  };
  var by = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollBy(x, y);
  };
  var setToElement$1 = function (win, element) {
    var pos = $_ad66zylwjc7tmcyc.absolute(element);
    var doc = $_2bd3y0jujc7tmci2.fromDom(win.document);
    to(pos.left(), pos.top(), doc);
  };
  var preserve$1 = function (doc, f) {
    var before = get$10(doc);
    f();
    var after = get$10(doc);
    if (before.top() !== after.top() || before.left() !== after.left()) {
      to(before.left(), before.top(), doc);
    }
  };
  var capture$2 = function (doc) {
    var previous = $_8zi7zzjgjc7tmce9.none();
    var save = function () {
      previous = $_8zi7zzjgjc7tmce9.some(get$10(doc));
    };
    var restore = function () {
      previous.each(function (p) {
        to(p.left(), p.top(), doc);
      });
    };
    save();
    return {
      save: save,
      restore: restore
    };
  };
  var intoView = function (element, alignToTop) {
    if (isSafari && $_diovd6jojc7tmcg3.isFunction(element.dom().scrollIntoViewIfNeeded)) {
      element.dom().scrollIntoViewIfNeeded(false);
    } else {
      element.dom().scrollIntoView(alignToTop);
    }
  };
  var intoViewIfNeeded = function (element, container) {
    var containerBox = container.dom().getBoundingClientRect();
    var elementBox = element.dom().getBoundingClientRect();
    if (elementBox.top < containerBox.top) {
      intoView(element, true);
    } else if (elementBox.bottom > containerBox.bottom) {
      intoView(element, false);
    }
  };
  var scrollBarWidth = function () {
    var scrollDiv = $_2bd3y0jujc7tmci2.fromHtml('<div style="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;"></div>');
    $_bayouwkqjc7tmcn9.after($_84qvvkjjc7tmclf.body(), scrollDiv);
    var w = scrollDiv.dom().offsetWidth - scrollDiv.dom().clientWidth;
    $_t0op8krjc7tmcnd.remove(scrollDiv);
    return w;
  };
  var $_fer1yhonjc7tmdme = {
    get: get$10,
    to: to,
    by: by,
    preserve: preserve$1,
    capture: capture$2,
    intoView: intoView,
    intoViewIfNeeded: intoViewIfNeeded,
    setToElement: setToElement$1,
    scrollBarWidth: scrollBarWidth
  };

  var WindowBridge = function (win) {
    var elementFromPoint = function (x, y) {
      return $_8zi7zzjgjc7tmce9.from(win.document.elementFromPoint(x, y)).map($_2bd3y0jujc7tmci2.fromDom);
    };
    var getRect = function (element) {
      return element.dom().getBoundingClientRect();
    };
    var getRangedRect = function (start, soffset, finish, foffset) {
      var sel = $_1dawk8o2jc7tmdhd.exact(start, soffset, finish, foffset);
      return $_jrlp0o4jc7tmdhn.getFirstRect(win, sel).map(function (structRect) {
        return $_dn7d6zjjjc7tmcfa.map(structRect, $_av3vphjhjc7tmcee.apply);
      });
    };
    var getSelection = function () {
      return $_jrlp0o4jc7tmdhn.get(win).map(function (exactAdt) {
        return $_7e547uomjc7tmdm5.convertToRange(win, exactAdt);
      });
    };
    var fromSitus = function (situs) {
      var relative = $_1dawk8o2jc7tmdhd.relative(situs.start(), situs.finish());
      return $_7e547uomjc7tmdm5.convertToRange(win, relative);
    };
    var situsFromPoint = function (x, y) {
      return $_jrlp0o4jc7tmdhn.getAtPoint(win, x, y).map(function (exact) {
        return {
          start: $_av3vphjhjc7tmcee.constant($_cz8apco3jc7tmdhi.on(exact.start(), exact.soffset())),
          finish: $_av3vphjhjc7tmcee.constant($_cz8apco3jc7tmdhi.on(exact.finish(), exact.foffset()))
        };
      });
    };
    var clearSelection = function () {
      $_jrlp0o4jc7tmdhn.clear(win);
    };
    var selectContents = function (element) {
      $_jrlp0o4jc7tmdhn.setToElement(win, element);
    };
    var setSelection = function (sel) {
      $_jrlp0o4jc7tmdhn.setExact(win, sel.start(), sel.soffset(), sel.finish(), sel.foffset());
    };
    var setRelativeSelection = function (start, finish) {
      $_jrlp0o4jc7tmdhn.setRelative(win, start, finish);
    };
    var getInnerHeight = function () {
      return win.innerHeight;
    };
    var getScrollY = function () {
      var pos = $_fer1yhonjc7tmdme.get($_2bd3y0jujc7tmci2.fromDom(win.document));
      return pos.top();
    };
    var scrollBy = function (x, y) {
      $_fer1yhonjc7tmdme.by(x, y, $_2bd3y0jujc7tmci2.fromDom(win.document));
    };
    return {
      elementFromPoint: elementFromPoint,
      getRect: getRect,
      getRangedRect: getRangedRect,
      getSelection: getSelection,
      fromSitus: fromSitus,
      situsFromPoint: situsFromPoint,
      clearSelection: clearSelection,
      setSelection: setSelection,
      setRelativeSelection: setRelativeSelection,
      selectContents: selectContents,
      getInnerHeight: getInnerHeight,
      getScrollY: getScrollY,
      scrollBy: scrollBy
    };
  };

  var sync = function (container, isRoot, start, soffset, finish, foffset, selectRange) {
    if (!($_4co3lyjyjc7tmciu.eq(start, finish) && soffset === foffset)) {
      return $_ft53o4kkjc7tmcln.closest(start, 'td,th', isRoot).bind(function (s) {
        return $_ft53o4kkjc7tmcln.closest(finish, 'td,th', isRoot).bind(function (f) {
          return detect$5(container, isRoot, s, f, selectRange);
        });
      });
    } else {
      return $_8zi7zzjgjc7tmce9.none();
    }
  };
  var detect$5 = function (container, isRoot, start, finish, selectRange) {
    if (!$_4co3lyjyjc7tmciu.eq(start, finish)) {
      return $_79f7ial3jc7tmcqm.identify(start, finish, isRoot).bind(function (cellSel) {
        var boxes = cellSel.boxes().getOr([]);
        if (boxes.length > 0) {
          selectRange(container, boxes, cellSel.start(), cellSel.finish());
          return $_8zi7zzjgjc7tmce9.some($_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.some($_7e547uomjc7tmdm5.makeSitus(start, 0, start, $_bairf4kwjc7tmcow.getEnd(start))), true));
        } else {
          return $_8zi7zzjgjc7tmce9.none();
        }
      });
    }
  };
  var update = function (rows, columns, container, selected, annotations) {
    var updateSelection = function (newSels) {
      annotations.clear(container);
      annotations.selectRange(container, newSels.boxes(), newSels.start(), newSels.finish());
      return newSels.boxes();
    };
    return $_79f7ial3jc7tmcqm.shiftSelection(selected, rows, columns, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(updateSelection);
  };
  var $_cnzp6hoojc7tmdmo = {
    sync: sync,
    detect: detect$5,
    update: update
  };

  var nu$3 = $_10a874jkjc7tmcfr.immutableBag([
    'left',
    'top',
    'right',
    'bottom'
  ], []);
  var moveDown = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() + amount,
      right: caret.right(),
      bottom: caret.bottom() + amount
    });
  };
  var moveUp = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() - amount,
      right: caret.right(),
      bottom: caret.bottom() - amount
    });
  };
  var moveBottomTo = function (caret, bottom) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: bottom - height,
      right: caret.right(),
      bottom: bottom
    });
  };
  var moveTopTo = function (caret, top) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: top,
      right: caret.right(),
      bottom: top + height
    });
  };
  var translate = function (caret, xDelta, yDelta) {
    return nu$3({
      left: caret.left() + xDelta,
      top: caret.top() + yDelta,
      right: caret.right() + xDelta,
      bottom: caret.bottom() + yDelta
    });
  };
  var getTop$1 = function (caret) {
    return caret.top();
  };
  var getBottom = function (caret) {
    return caret.bottom();
  };
  var toString$1 = function (caret) {
    return '(' + caret.left() + ', ' + caret.top() + ') -> (' + caret.right() + ', ' + caret.bottom() + ')';
  };
  var $_dusvovorjc7tmdo5 = {
    nu: nu$3,
    moveUp: moveUp,
    moveDown: moveDown,
    moveBottomTo: moveBottomTo,
    moveTopTo: moveTopTo,
    getTop: getTop$1,
    getBottom: getBottom,
    translate: translate,
    toString: toString$1
  };

  var getPartialBox = function (bridge, element, offset) {
    if (offset >= 0 && offset < $_bairf4kwjc7tmcow.getEnd(element))
      return bridge.getRangedRect(element, offset, element, offset + 1);
    else if (offset > 0)
      return bridge.getRangedRect(element, offset - 1, element, offset);
    return $_8zi7zzjgjc7tmce9.none();
  };
  var toCaret = function (rect) {
    return $_dusvovorjc7tmdo5.nu({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    });
  };
  var getElemBox = function (bridge, element) {
    return $_8zi7zzjgjc7tmce9.some(bridge.getRect(element));
  };
  var getBoxAt = function (bridge, element, offset) {
    if ($_fxq8yvkgjc7tmcl4.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_fxq8yvkgjc7tmcl4.isText(element))
      return getPartialBox(bridge, element, offset).map(toCaret);
    else
      return $_8zi7zzjgjc7tmce9.none();
  };
  var getEntireBox = function (bridge, element) {
    if ($_fxq8yvkgjc7tmcl4.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_fxq8yvkgjc7tmcl4.isText(element))
      return bridge.getRangedRect(element, 0, element, $_bairf4kwjc7tmcow.getEnd(element)).map(toCaret);
    else
      return $_8zi7zzjgjc7tmce9.none();
  };
  var $_cpg9o5osjc7tmdob = {
    getBoxAt: getBoxAt,
    getEntireBox: getEntireBox
  };

  var traverse = $_10a874jkjc7tmcfr.immutable('item', 'mode');
  var backtrack = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : sidestep;
    return universe.property().parent(item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var sidestep = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    return direction.sibling(universe, item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var advance = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    var children = universe.property().children(item);
    var result = direction.first(children);
    return result.map(function (r) {
      return traverse(r, transition);
    });
  };
  var successors = [
    {
      current: backtrack,
      next: sidestep,
      fallback: $_8zi7zzjgjc7tmce9.none()
    },
    {
      current: sidestep,
      next: advance,
      fallback: $_8zi7zzjgjc7tmce9.some(backtrack)
    },
    {
      current: advance,
      next: advance,
      fallback: $_8zi7zzjgjc7tmce9.some(sidestep)
    }
  ];
  var go$1 = function (universe, item, mode, direction, rules) {
    var rules = rules !== undefined ? rules : successors;
    var ruleOpt = $_f8juj3jfjc7tmcdy.find(rules, function (succ) {
      return succ.current === mode;
    });
    return ruleOpt.bind(function (rule) {
      return rule.current(universe, item, direction, rule.next).orThunk(function () {
        return rule.fallback.bind(function (fb) {
          return go$1(universe, item, fb, direction);
        });
      });
    });
  };
  var $_46ok82oxjc7tmdpv = {
    backtrack: backtrack,
    sidestep: sidestep,
    advance: advance,
    go: go$1
  };

  var left$2 = function () {
    var sibling = function (universe, item) {
      return universe.query().prevSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? $_8zi7zzjgjc7tmce9.some(children[children.length - 1]) : $_8zi7zzjgjc7tmce9.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var right$2 = function () {
    var sibling = function (universe, item) {
      return universe.query().nextSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? $_8zi7zzjgjc7tmce9.some(children[0]) : $_8zi7zzjgjc7tmce9.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var $_2xchv6oyjc7tmdq3 = {
    left: left$2,
    right: right$2
  };

  var hone = function (universe, item, predicate, mode, direction, isRoot) {
    var next = $_46ok82oxjc7tmdpv.go(universe, item, mode, direction);
    return next.bind(function (n) {
      if (isRoot(n.item()))
        return $_8zi7zzjgjc7tmce9.none();
      else
        return predicate(n.item()) ? $_8zi7zzjgjc7tmce9.some(n.item()) : hone(universe, n.item(), predicate, n.mode(), direction, isRoot);
    });
  };
  var left$1 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_46ok82oxjc7tmdpv.sidestep, $_2xchv6oyjc7tmdq3.left(), isRoot);
  };
  var right$1 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_46ok82oxjc7tmdpv.sidestep, $_2xchv6oyjc7tmdq3.right(), isRoot);
  };
  var $_6pymzzowjc7tmdpn = {
    left: left$1,
    right: right$1
  };

  var isLeaf = function (universe, element) {
    return universe.property().children(element).length === 0;
  };
  var before$3 = function (universe, item, isRoot) {
    return seekLeft$1(universe, item, $_av3vphjhjc7tmcee.curry(isLeaf, universe), isRoot);
  };
  var after$4 = function (universe, item, isRoot) {
    return seekRight$1(universe, item, $_av3vphjhjc7tmcee.curry(isLeaf, universe), isRoot);
  };
  var seekLeft$1 = function (universe, item, predicate, isRoot) {
    return $_6pymzzowjc7tmdpn.left(universe, item, predicate, isRoot);
  };
  var seekRight$1 = function (universe, item, predicate, isRoot) {
    return $_6pymzzowjc7tmdpn.right(universe, item, predicate, isRoot);
  };
  var walkers$1 = function () {
    return {
      left: $_2xchv6oyjc7tmdq3.left,
      right: $_2xchv6oyjc7tmdq3.right
    };
  };
  var walk$1 = function (universe, item, mode, direction, _rules) {
    return $_46ok82oxjc7tmdpv.go(universe, item, mode, direction, _rules);
  };
  var $_ctitebovjc7tmdpi = {
    before: before$3,
    after: after$4,
    seekLeft: seekLeft$1,
    seekRight: seekRight$1,
    walkers: walkers$1,
    walk: walk$1,
    backtrack: $_46ok82oxjc7tmdpv.backtrack,
    sidestep: $_46ok82oxjc7tmdpv.sidestep,
    advance: $_46ok82oxjc7tmdpv.advance
  };

  var universe$2 = DomUniverse();
  var gather = function (element, prune, transform) {
    return $_ctitebovjc7tmdpi.gather(universe$2, element, prune, transform);
  };
  var before$2 = function (element, isRoot) {
    return $_ctitebovjc7tmdpi.before(universe$2, element, isRoot);
  };
  var after$3 = function (element, isRoot) {
    return $_ctitebovjc7tmdpi.after(universe$2, element, isRoot);
  };
  var seekLeft = function (element, predicate, isRoot) {
    return $_ctitebovjc7tmdpi.seekLeft(universe$2, element, predicate, isRoot);
  };
  var seekRight = function (element, predicate, isRoot) {
    return $_ctitebovjc7tmdpi.seekRight(universe$2, element, predicate, isRoot);
  };
  var walkers = function () {
    return $_ctitebovjc7tmdpi.walkers();
  };
  var walk = function (item, mode, direction, _rules) {
    return $_ctitebovjc7tmdpi.walk(universe$2, item, mode, direction, _rules);
  };
  var $_bqqtz4oujc7tmdpb = {
    gather: gather,
    before: before$2,
    after: after$3,
    seekLeft: seekLeft,
    seekRight: seekRight,
    walkers: walkers,
    walk: walk
  };

  var JUMP_SIZE = 5;
  var NUM_RETRIES = 100;
  var adt$2 = $_sn5zylhjc7tmcui.generate([
    { 'none': [] },
    { 'retry': ['caret'] }
  ]);
  var isOutside = function (caret, box) {
    return caret.left() < box.left() || Math.abs(box.right() - caret.left()) < 1 || caret.left() > box.right();
  };
  var inOutsideBlock = function (bridge, element, caret) {
    return $_39ujfjkljc7tmclp.closest(element, $_fd60svm5jc7tmd0v.isBlock).fold($_av3vphjhjc7tmcee.constant(false), function (cell) {
      return $_cpg9o5osjc7tmdob.getEntireBox(bridge, cell).exists(function (box) {
        return isOutside(caret, box);
      });
    });
  };
  var adjustDown = function (bridge, element, guessBox, original, caret) {
    var lowerCaret = $_dusvovorjc7tmdo5.moveDown(caret, JUMP_SIZE);
    if (Math.abs(guessBox.bottom() - original.bottom()) < 1)
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() > caret.bottom())
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() === caret.bottom())
      return adt$2.retry($_dusvovorjc7tmdo5.moveDown(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_dusvovorjc7tmdo5.translate(lowerCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var adjustUp = function (bridge, element, guessBox, original, caret) {
    var higherCaret = $_dusvovorjc7tmdo5.moveUp(caret, JUMP_SIZE);
    if (Math.abs(guessBox.top() - original.top()) < 1)
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() < caret.top())
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() === caret.top())
      return adt$2.retry($_dusvovorjc7tmdo5.moveUp(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_dusvovorjc7tmdo5.translate(higherCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var upMovement = {
    point: $_dusvovorjc7tmdo5.getTop,
    adjuster: adjustUp,
    move: $_dusvovorjc7tmdo5.moveUp,
    gather: $_bqqtz4oujc7tmdpb.before
  };
  var downMovement = {
    point: $_dusvovorjc7tmdo5.getBottom,
    adjuster: adjustDown,
    move: $_dusvovorjc7tmdo5.moveDown,
    gather: $_bqqtz4oujc7tmdpb.after
  };
  var isAtTable = function (bridge, x, y) {
    return bridge.elementFromPoint(x, y).filter(function (elm) {
      return $_fxq8yvkgjc7tmcl4.name(elm) === 'table';
    }).isSome();
  };
  var adjustForTable = function (bridge, movement, original, caret, numRetries) {
    return adjustTil(bridge, movement, original, movement.move(caret, JUMP_SIZE), numRetries);
  };
  var adjustTil = function (bridge, movement, original, caret, numRetries) {
    if (numRetries === 0)
      return $_8zi7zzjgjc7tmce9.some(caret);
    if (isAtTable(bridge, caret.left(), movement.point(caret)))
      return adjustForTable(bridge, movement, original, caret, numRetries - 1);
    return bridge.situsFromPoint(caret.left(), movement.point(caret)).bind(function (guess) {
      return guess.start().fold($_8zi7zzjgjc7tmce9.none, function (element, offset) {
        return $_cpg9o5osjc7tmdob.getEntireBox(bridge, element, offset).bind(function (guessBox) {
          return movement.adjuster(bridge, element, guessBox, original, caret).fold($_8zi7zzjgjc7tmce9.none, function (newCaret) {
            return adjustTil(bridge, movement, original, newCaret, numRetries - 1);
          });
        }).orThunk(function () {
          return $_8zi7zzjgjc7tmce9.some(caret);
        });
      }, $_8zi7zzjgjc7tmce9.none);
    });
  };
  var ieTryDown = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.bottom() + JUMP_SIZE);
  };
  var ieTryUp = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.top() - JUMP_SIZE);
  };
  var checkScroll = function (movement, adjusted, bridge) {
    if (movement.point(adjusted) > bridge.getInnerHeight())
      return $_8zi7zzjgjc7tmce9.some(movement.point(adjusted) - bridge.getInnerHeight());
    else if (movement.point(adjusted) < 0)
      return $_8zi7zzjgjc7tmce9.some(-movement.point(adjusted));
    else
      return $_8zi7zzjgjc7tmce9.none();
  };
  var retry = function (movement, bridge, caret) {
    var moved = movement.move(caret, JUMP_SIZE);
    var adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(moved);
    return checkScroll(movement, adjusted, bridge).fold(function () {
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted));
    }, function (delta) {
      bridge.scrollBy(0, delta);
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted) - delta);
    });
  };
  var $_3dg3f1otjc7tmdol = {
    tryUp: $_av3vphjhjc7tmcee.curry(retry, upMovement),
    tryDown: $_av3vphjhjc7tmcee.curry(retry, downMovement),
    ieTryUp: ieTryUp,
    ieTryDown: ieTryDown,
    getJumpSize: $_av3vphjhjc7tmcee.constant(JUMP_SIZE)
  };

  var adt$3 = $_sn5zylhjc7tmcui.generate([
    { 'none': ['message'] },
    { 'success': [] },
    { 'failedUp': ['cell'] },
    { 'failedDown': ['cell'] }
  ]);
  var isOverlapping = function (bridge, before, after) {
    var beforeBounds = bridge.getRect(before);
    var afterBounds = bridge.getRect(after);
    return afterBounds.right > beforeBounds.left && afterBounds.left < beforeBounds.right;
  };
  var verify = function (bridge, before, beforeOffset, after, afterOffset, failure, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(after, 'td,th', isRoot).bind(function (afterCell) {
      return $_ft53o4kkjc7tmcln.closest(before, 'td,th', isRoot).map(function (beforeCell) {
        if (!$_4co3lyjyjc7tmciu.eq(afterCell, beforeCell)) {
          return $_9hu61rl4jc7tmcrb.sharedOne(isRow, [
            afterCell,
            beforeCell
          ]).fold(function () {
            return isOverlapping(bridge, beforeCell, afterCell) ? adt$3.success() : failure(beforeCell);
          }, function (sharedRow) {
            return failure(beforeCell);
          });
        } else {
          return $_4co3lyjyjc7tmciu.eq(after, afterCell) && $_bairf4kwjc7tmcow.getEnd(afterCell) === afterOffset ? failure(beforeCell) : adt$3.none('in same cell');
        }
      });
    }).getOr(adt$3.none('default'));
  };
  var isRow = function (elem) {
    return $_ft53o4kkjc7tmcln.closest(elem, 'tr');
  };
  var cata$2 = function (subject, onNone, onSuccess, onFailedUp, onFailedDown) {
    return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown);
  };
  var $_cyiqh4ozjc7tmdqd = {
    verify: verify,
    cata: cata$2,
    adt: adt$3
  };

  var point = $_10a874jkjc7tmcfr.immutable('element', 'offset');
  var delta = $_10a874jkjc7tmcfr.immutable('element', 'deltaOffset');
  var range$3 = $_10a874jkjc7tmcfr.immutable('element', 'start', 'finish');
  var points = $_10a874jkjc7tmcfr.immutable('begin', 'end');
  var text = $_10a874jkjc7tmcfr.immutable('element', 'text');
  var $_204t5ap1jc7tmdr5 = {
    point: point,
    delta: delta,
    range: range$3,
    points: points,
    text: text
  };

  var inAncestor = $_10a874jkjc7tmcfr.immutable('ancestor', 'descendants', 'element', 'index');
  var inParent = $_10a874jkjc7tmcfr.immutable('parent', 'children', 'element', 'index');
  var childOf = function (element, ancestor) {
    return $_39ujfjkljc7tmclp.closest(element, function (elem) {
      return $_66uz4xjwjc7tmcib.parent(elem).exists(function (parent) {
        return $_4co3lyjyjc7tmciu.eq(parent, ancestor);
      });
    });
  };
  var indexInParent = function (element) {
    return $_66uz4xjwjc7tmcib.parent(element).bind(function (parent) {
      var children = $_66uz4xjwjc7tmcib.children(parent);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var indexOf$1 = function (elements, element) {
    return $_f8juj3jfjc7tmcdy.findIndex(elements, $_av3vphjhjc7tmcee.curry($_4co3lyjyjc7tmciu.eq, element));
  };
  var selectorsInParent = function (element, selector) {
    return $_66uz4xjwjc7tmcib.parent(element).bind(function (parent) {
      var children = $_7y6210khjc7tmcl8.children(parent, selector);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var descendantsInAncestor = function (element, ancestorSelector, descendantSelector) {
    return $_ft53o4kkjc7tmcln.closest(element, ancestorSelector).bind(function (ancestor) {
      var descendants = $_7y6210khjc7tmcl8.descendants(ancestor, descendantSelector);
      return indexOf$1(descendants, element).map(function (index) {
        return inAncestor(ancestor, descendants, element, index);
      });
    });
  };
  var $_590h2bp2jc7tmdra = {
    childOf: childOf,
    indexOf: indexOf$1,
    indexInParent: indexInParent,
    selectorsInParent: selectorsInParent,
    descendantsInAncestor: descendantsInAncestor
  };

  var isBr = function (elem) {
    return $_fxq8yvkgjc7tmcl4.name(elem) === 'br';
  };
  var gatherer = function (cand, gather, isRoot) {
    return gather(cand, isRoot).bind(function (target) {
      return $_fxq8yvkgjc7tmcl4.isText(target) && $_asu5ztkxjc7tmcp2.get(target).trim().length === 0 ? gatherer(target, gather, isRoot) : $_8zi7zzjgjc7tmce9.some(target);
    });
  };
  var handleBr = function (isRoot, element, direction) {
    return direction.traverse(element).orThunk(function () {
      return gatherer(element, direction.gather, isRoot);
    }).map(direction.relative);
  };
  var findBr = function (element, offset) {
    return $_66uz4xjwjc7tmcib.child(element, offset).filter(isBr).orThunk(function () {
      return $_66uz4xjwjc7tmcib.child(element, offset - 1).filter(isBr);
    });
  };
  var handleParent = function (isRoot, element, offset, direction) {
    return findBr(element, offset).bind(function (br) {
      return direction.traverse(br).fold(function () {
        return gatherer(br, direction.gather, isRoot).map(direction.relative);
      }, function (adjacent) {
        return $_590h2bp2jc7tmdra.indexInParent(adjacent).map(function (info) {
          return $_cz8apco3jc7tmdhi.on(info.parent(), info.index());
        });
      });
    });
  };
  var tryBr = function (isRoot, element, offset, direction) {
    var target = isBr(element) ? handleBr(isRoot, element, direction) : handleParent(isRoot, element, offset, direction);
    return target.map(function (tgt) {
      return {
        start: $_av3vphjhjc7tmcee.constant(tgt),
        finish: $_av3vphjhjc7tmcee.constant(tgt)
      };
    });
  };
  var process = function (analysis) {
    return $_cyiqh4ozjc7tmdqd.cata(analysis, function (message) {
      return $_8zi7zzjgjc7tmce9.none('BR ADT: none');
    }, function () {
      return $_8zi7zzjgjc7tmce9.none();
    }, function (cell) {
      return $_8zi7zzjgjc7tmce9.some($_204t5ap1jc7tmdr5.point(cell, 0));
    }, function (cell) {
      return $_8zi7zzjgjc7tmce9.some($_204t5ap1jc7tmdr5.point(cell, $_bairf4kwjc7tmcow.getEnd(cell)));
    });
  };
  var $_1qqo0tp0jc7tmdqp = {
    tryBr: tryBr,
    process: process
  };

  var MAX_RETRIES = 20;
  var platform$1 = $_enuqxfk3jc7tmcjq.detect();
  var findSpot = function (bridge, isRoot, direction) {
    return bridge.getSelection().bind(function (sel) {
      return $_1qqo0tp0jc7tmdqp.tryBr(isRoot, sel.finish(), sel.foffset(), direction).fold(function () {
        return $_8zi7zzjgjc7tmce9.some($_204t5ap1jc7tmdr5.point(sel.finish(), sel.foffset()));
      }, function (brNeighbour) {
        var range = bridge.fromSitus(brNeighbour);
        var analysis = $_cyiqh4ozjc7tmdqd.verify(bridge, sel.finish(), sel.foffset(), range.finish(), range.foffset(), direction.failure, isRoot);
        return $_1qqo0tp0jc7tmdqp.process(analysis);
      });
    });
  };
  var scan = function (bridge, isRoot, element, offset, direction, numRetries) {
    if (numRetries === 0)
      return $_8zi7zzjgjc7tmce9.none();
    return tryCursor(bridge, isRoot, element, offset, direction).bind(function (situs) {
      var range = bridge.fromSitus(situs);
      var analysis = $_cyiqh4ozjc7tmdqd.verify(bridge, element, offset, range.finish(), range.foffset(), direction.failure, isRoot);
      return $_cyiqh4ozjc7tmdqd.cata(analysis, function () {
        return $_8zi7zzjgjc7tmce9.none();
      }, function () {
        return $_8zi7zzjgjc7tmce9.some(situs);
      }, function (cell) {
        if ($_4co3lyjyjc7tmciu.eq(element, cell) && offset === 0)
          return tryAgain(bridge, element, offset, $_dusvovorjc7tmdo5.moveUp, direction);
        else
          return scan(bridge, isRoot, cell, 0, direction, numRetries - 1);
      }, function (cell) {
        if ($_4co3lyjyjc7tmciu.eq(element, cell) && offset === $_bairf4kwjc7tmcow.getEnd(cell))
          return tryAgain(bridge, element, offset, $_dusvovorjc7tmdo5.moveDown, direction);
        else
          return scan(bridge, isRoot, cell, $_bairf4kwjc7tmcow.getEnd(cell), direction, numRetries - 1);
      });
    });
  };
  var tryAgain = function (bridge, element, offset, move, direction) {
    return $_cpg9o5osjc7tmdob.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, move(box, $_3dg3f1otjc7tmdol.getJumpSize()));
    });
  };
  var tryAt = function (bridge, direction, box) {
    if (platform$1.browser.isChrome() || platform$1.browser.isSafari() || platform$1.browser.isFirefox() || platform$1.browser.isEdge())
      return direction.otherRetry(bridge, box);
    else if (platform$1.browser.isIE())
      return direction.ieRetry(bridge, box);
    else
      return $_8zi7zzjgjc7tmce9.none();
  };
  var tryCursor = function (bridge, isRoot, element, offset, direction) {
    return $_cpg9o5osjc7tmdob.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, box);
    });
  };
  var handle$2 = function (bridge, isRoot, direction) {
    return findSpot(bridge, isRoot, direction).bind(function (spot) {
      return scan(bridge, isRoot, spot.element(), spot.offset(), direction, MAX_RETRIES).map(bridge.fromSitus);
    });
  };
  var $_ca0izvoqjc7tmdnr = { handle: handle$2 };

  var any$1 = function (predicate) {
    return $_39ujfjkljc7tmclp.first(predicate).isSome();
  };
  var ancestor$3 = function (scope, predicate, isRoot) {
    return $_39ujfjkljc7tmclp.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest$3 = function (scope, predicate, isRoot) {
    return $_39ujfjkljc7tmclp.closest(scope, predicate, isRoot).isSome();
  };
  var sibling$3 = function (scope, predicate) {
    return $_39ujfjkljc7tmclp.sibling(scope, predicate).isSome();
  };
  var child$4 = function (scope, predicate) {
    return $_39ujfjkljc7tmclp.child(scope, predicate).isSome();
  };
  var descendant$3 = function (scope, predicate) {
    return $_39ujfjkljc7tmclp.descendant(scope, predicate).isSome();
  };
  var $_7ae7u4p3jc7tmdrh = {
    any: any$1,
    ancestor: ancestor$3,
    closest: closest$3,
    sibling: sibling$3,
    child: child$4,
    descendant: descendant$3
  };

  var detection = $_enuqxfk3jc7tmcjq.detect();
  var inSameTable = function (elem, table) {
    return $_7ae7u4p3jc7tmdrh.ancestor(elem, function (e) {
      return $_66uz4xjwjc7tmcib.parent(e).exists(function (p) {
        return $_4co3lyjyjc7tmciu.eq(p, table);
      });
    });
  };
  var simulate = function (bridge, isRoot, direction, initial, anchor) {
    return $_ft53o4kkjc7tmcln.closest(initial, 'td,th', isRoot).bind(function (start) {
      return $_ft53o4kkjc7tmcln.closest(start, 'table', isRoot).bind(function (table) {
        if (!inSameTable(anchor, table))
          return $_8zi7zzjgjc7tmce9.none();
        return $_ca0izvoqjc7tmdnr.handle(bridge, isRoot, direction).bind(function (range) {
          return $_ft53o4kkjc7tmcln.closest(range.finish(), 'td,th', isRoot).map(function (finish) {
            return {
              start: $_av3vphjhjc7tmcee.constant(start),
              finish: $_av3vphjhjc7tmcee.constant(finish),
              range: $_av3vphjhjc7tmcee.constant(range)
            };
          });
        });
      });
    });
  };
  var navigate = function (bridge, isRoot, direction, initial, anchor, precheck) {
    if (detection.browser.isIE()) {
      return $_8zi7zzjgjc7tmce9.none();
    } else {
      return precheck(initial, isRoot).orThunk(function () {
        return simulate(bridge, isRoot, direction, initial, anchor).map(function (info) {
          var range = info.range();
          return $_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.some($_7e547uomjc7tmdm5.makeSitus(range.start(), range.soffset(), range.finish(), range.foffset())), true);
        });
      });
    }
  };
  var firstUpCheck = function (initial, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_ft53o4kkjc7tmcln.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_7y6210khjc7tmcl8.descendants(table, 'tr');
        if ($_4co3lyjyjc7tmciu.eq(startRow, rows[0])) {
          return $_bqqtz4oujc7tmdpb.seekLeft(table, function (element) {
            return $_1c60c4kvjc7tmcoq.last(element).isSome();
          }, isRoot).map(function (last) {
            var lastOffset = $_bairf4kwjc7tmcow.getEnd(last);
            return $_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.some($_7e547uomjc7tmdm5.makeSitus(last, lastOffset, last, lastOffset)), true);
          });
        } else {
          return $_8zi7zzjgjc7tmce9.none();
        }
      });
    });
  };
  var lastDownCheck = function (initial, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_ft53o4kkjc7tmcln.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_7y6210khjc7tmcl8.descendants(table, 'tr');
        if ($_4co3lyjyjc7tmciu.eq(startRow, rows[rows.length - 1])) {
          return $_bqqtz4oujc7tmdpb.seekRight(table, function (element) {
            return $_1c60c4kvjc7tmcoq.first(element).isSome();
          }, isRoot).map(function (first) {
            return $_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.some($_7e547uomjc7tmdm5.makeSitus(first, 0, first, 0)), true);
          });
        } else {
          return $_8zi7zzjgjc7tmce9.none();
        }
      });
    });
  };
  var select = function (bridge, container, isRoot, direction, initial, anchor, selectRange) {
    return simulate(bridge, isRoot, direction, initial, anchor).bind(function (info) {
      return $_cnzp6hoojc7tmdmo.detect(container, isRoot, info.start(), info.finish(), selectRange);
    });
  };
  var $_3l2c5lopjc7tmdn0 = {
    navigate: navigate,
    select: select,
    firstUpCheck: firstUpCheck,
    lastDownCheck: lastDownCheck
  };

  var findCell = function (target, isRoot) {
    return $_ft53o4kkjc7tmcln.closest(target, 'td,th', isRoot);
  };
  var MouseSelection = function (bridge, container, isRoot, annotations) {
    var cursor = $_8zi7zzjgjc7tmce9.none();
    var clearState = function () {
      cursor = $_8zi7zzjgjc7tmce9.none();
    };
    var mousedown = function (event) {
      annotations.clear(container);
      cursor = findCell(event.target(), isRoot);
    };
    var mouseover = function (event) {
      cursor.each(function (start) {
        annotations.clear(container);
        findCell(event.target(), isRoot).each(function (finish) {
          $_79f7ial3jc7tmcqm.identify(start, finish, isRoot).each(function (cellSel) {
            var boxes = cellSel.boxes().getOr([]);
            if (boxes.length > 1 || boxes.length === 1 && !$_4co3lyjyjc7tmciu.eq(start, finish)) {
              annotations.selectRange(container, boxes, cellSel.start(), cellSel.finish());
              bridge.selectContents(finish);
            }
          });
        });
      });
    };
    var mouseup = function () {
      cursor.each(clearState);
    };
    return {
      mousedown: mousedown,
      mouseover: mouseover,
      mouseup: mouseup
    };
  };

  var $_4k76omp5jc7tmds1 = {
    down: {
      traverse: $_66uz4xjwjc7tmcib.nextSibling,
      gather: $_bqqtz4oujc7tmdpb.after,
      relative: $_cz8apco3jc7tmdhi.before,
      otherRetry: $_3dg3f1otjc7tmdol.tryDown,
      ieRetry: $_3dg3f1otjc7tmdol.ieTryDown,
      failure: $_cyiqh4ozjc7tmdqd.adt.failedDown
    },
    up: {
      traverse: $_66uz4xjwjc7tmcib.prevSibling,
      gather: $_bqqtz4oujc7tmdpb.before,
      relative: $_cz8apco3jc7tmdhi.before,
      otherRetry: $_3dg3f1otjc7tmdol.tryUp,
      ieRetry: $_3dg3f1otjc7tmdol.ieTryUp,
      failure: $_cyiqh4ozjc7tmdqd.adt.failedUp
    }
  };

  var rc = $_10a874jkjc7tmcfr.immutable('rows', 'cols');
  var mouse = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var handlers = MouseSelection(bridge, container, isRoot, annotations);
    return {
      mousedown: handlers.mousedown,
      mouseover: handlers.mouseover,
      mouseup: handlers.mouseup
    };
  };
  var keyboard = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var clearToNavigate = function () {
      annotations.clear(container);
      return $_8zi7zzjgjc7tmce9.none();
    };
    var keydown = function (event, start, soffset, finish, foffset, direction) {
      var keycode = event.raw().which;
      var shiftKey = event.raw().shiftKey === true;
      var handler = $_79f7ial3jc7tmcqm.retrieve(container, annotations.selectedSelector()).fold(function () {
        if ($_3tdo0qokjc7tmdl6.isDown(keycode) && shiftKey) {
          return $_av3vphjhjc7tmcee.curry($_3l2c5lopjc7tmdn0.select, bridge, container, isRoot, $_4k76omp5jc7tmds1.down, finish, start, annotations.selectRange);
        } else if ($_3tdo0qokjc7tmdl6.isUp(keycode) && shiftKey) {
          return $_av3vphjhjc7tmcee.curry($_3l2c5lopjc7tmdn0.select, bridge, container, isRoot, $_4k76omp5jc7tmds1.up, finish, start, annotations.selectRange);
        } else if ($_3tdo0qokjc7tmdl6.isDown(keycode)) {
          return $_av3vphjhjc7tmcee.curry($_3l2c5lopjc7tmdn0.navigate, bridge, isRoot, $_4k76omp5jc7tmds1.down, finish, start, $_3l2c5lopjc7tmdn0.lastDownCheck);
        } else if ($_3tdo0qokjc7tmdl6.isUp(keycode)) {
          return $_av3vphjhjc7tmcee.curry($_3l2c5lopjc7tmdn0.navigate, bridge, isRoot, $_4k76omp5jc7tmds1.up, finish, start, $_3l2c5lopjc7tmdn0.firstUpCheck);
        } else {
          return $_8zi7zzjgjc7tmce9.none;
        }
      }, function (selected) {
        var update = function (attempts) {
          return function () {
            var navigation = $_b9kaemm9jc7tmd1q.findMap(attempts, function (delta) {
              return $_cnzp6hoojc7tmdmo.update(delta.rows(), delta.cols(), container, selected, annotations);
            });
            return navigation.fold(function () {
              return $_79f7ial3jc7tmcqm.getEdges(container, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(function (edges) {
                var relative = $_3tdo0qokjc7tmdl6.isDown(keycode) || direction.isForward(keycode) ? $_cz8apco3jc7tmdhi.after : $_cz8apco3jc7tmdhi.before;
                bridge.setRelativeSelection($_cz8apco3jc7tmdhi.on(edges.first(), 0), relative(edges.table()));
                annotations.clear(container);
                return $_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.none(), true);
              });
            }, function (_) {
              return $_8zi7zzjgjc7tmce9.some($_7qs9ohojjc7tmdl1.response($_8zi7zzjgjc7tmce9.none(), true));
            });
          };
        };
        if ($_3tdo0qokjc7tmdl6.isDown(keycode) && shiftKey)
          return update([rc(+1, 0)]);
        else if ($_3tdo0qokjc7tmdl6.isUp(keycode) && shiftKey)
          return update([rc(-1, 0)]);
        else if (direction.isBackward(keycode) && shiftKey)
          return update([
            rc(0, -1),
            rc(-1, 0)
          ]);
        else if (direction.isForward(keycode) && shiftKey)
          return update([
            rc(0, +1),
            rc(+1, 0)
          ]);
        else if ($_3tdo0qokjc7tmdl6.isNavigation(keycode) && shiftKey === false)
          return clearToNavigate;
        else
          return $_8zi7zzjgjc7tmce9.none;
      });
      return handler();
    };
    var keyup = function (event, start, soffset, finish, foffset) {
      return $_79f7ial3jc7tmcqm.retrieve(container, annotations.selectedSelector()).fold(function () {
        var keycode = event.raw().which;
        var shiftKey = event.raw().shiftKey === true;
        if (shiftKey === false)
          return $_8zi7zzjgjc7tmce9.none();
        if ($_3tdo0qokjc7tmdl6.isNavigation(keycode))
          return $_cnzp6hoojc7tmdmo.sync(container, isRoot, start, soffset, finish, foffset, annotations.selectRange);
        else
          return $_8zi7zzjgjc7tmce9.none();
      }, $_8zi7zzjgjc7tmce9.none);
    };
    return {
      keydown: keydown,
      keyup: keyup
    };
  };
  var $_4c36h5oijc7tmdkq = {
    mouse: mouse,
    keyboard: keyboard
  };

  var add$3 = function (element, classes) {
    $_f8juj3jfjc7tmcdy.each(classes, function (x) {
      $_7rzfb6mkjc7tmd4q.add(element, x);
    });
  };
  var remove$7 = function (element, classes) {
    $_f8juj3jfjc7tmcdy.each(classes, function (x) {
      $_7rzfb6mkjc7tmd4q.remove(element, x);
    });
  };
  var toggle$2 = function (element, classes) {
    $_f8juj3jfjc7tmcdy.each(classes, function (x) {
      $_7rzfb6mkjc7tmd4q.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_f8juj3jfjc7tmcdy.forall(classes, function (clazz) {
      return $_7rzfb6mkjc7tmd4q.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_f8juj3jfjc7tmcdy.exists(classes, function (clazz) {
      return $_7rzfb6mkjc7tmd4q.has(element, clazz);
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
  var get$11 = function (element) {
    return $_a18qkhmmjc7tmd51.supports(element) ? getNative(element) : $_a18qkhmmjc7tmd51.get(element);
  };
  var $_9ago6lp8jc7tmdsm = {
    add: add$3,
    remove: remove$7,
    toggle: toggle$2,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$11
  };

  var addClass = function (clazz) {
    return function (element) {
      $_7rzfb6mkjc7tmd4q.add(element, clazz);
    };
  };
  var removeClass = function (clazz) {
    return function (element) {
      $_7rzfb6mkjc7tmd4q.remove(element, clazz);
    };
  };
  var removeClasses = function (classes) {
    return function (element) {
      $_9ago6lp8jc7tmdsm.remove(element, classes);
    };
  };
  var hasClass = function (clazz) {
    return function (element) {
      return $_7rzfb6mkjc7tmd4q.has(element, clazz);
    };
  };
  var $_97vhz7p7jc7tmdsh = {
    addClass: addClass,
    removeClass: removeClass,
    removeClasses: removeClasses,
    hasClass: hasClass
  };

  var byClass = function (ephemera) {
    var addSelectionClass = $_97vhz7p7jc7tmdsh.addClass(ephemera.selected());
    var removeSelectionClasses = $_97vhz7p7jc7tmdsh.removeClasses([
      ephemera.selected(),
      ephemera.lastSelected(),
      ephemera.firstSelected()
    ]);
    var clear = function (container) {
      var sels = $_7y6210khjc7tmcl8.descendants(container, ephemera.selectedSelector());
      $_f8juj3jfjc7tmcdy.each(sels, removeSelectionClasses);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_f8juj3jfjc7tmcdy.each(cells, addSelectionClass);
      $_7rzfb6mkjc7tmd4q.add(start, ephemera.firstSelected());
      $_7rzfb6mkjc7tmd4q.add(finish, ephemera.lastSelected());
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var byAttr = function (ephemera) {
    var removeSelectionAttributes = function (element) {
      $_9o3gmekfjc7tmckw.remove(element, ephemera.selected());
      $_9o3gmekfjc7tmckw.remove(element, ephemera.firstSelected());
      $_9o3gmekfjc7tmckw.remove(element, ephemera.lastSelected());
    };
    var addSelectionAttribute = function (element) {
      $_9o3gmekfjc7tmckw.set(element, ephemera.selected(), '1');
    };
    var clear = function (container) {
      var sels = $_7y6210khjc7tmcl8.descendants(container, ephemera.selectedSelector());
      $_f8juj3jfjc7tmcdy.each(sels, removeSelectionAttributes);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_f8juj3jfjc7tmcdy.each(cells, addSelectionAttribute);
      $_9o3gmekfjc7tmckw.set(start, ephemera.firstSelected(), '1');
      $_9o3gmekfjc7tmckw.set(finish, ephemera.lastSelected(), '1');
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var $_f0y66rp6jc7tmds7 = {
    byClass: byClass,
    byAttr: byAttr
  };

  var CellSelection$1 = function (editor, lazyResize) {
    var handlerStruct = $_10a874jkjc7tmcfr.immutableBag([
      'mousedown',
      'mouseover',
      'mouseup',
      'keyup',
      'keydown'
    ], []);
    var handlers = $_8zi7zzjgjc7tmce9.none();
    var annotations = $_f0y66rp6jc7tmds7.byAttr($_b84ex7lfjc7tmcuc);
    editor.on('init', function (e) {
      var win = editor.getWin();
      var body = $_45jthun1jc7tmd8q.getBody(editor);
      var isRoot = $_45jthun1jc7tmd8q.getIsRoot(editor);
      var syncSelection = function () {
        var sel = editor.selection;
        var start = $_2bd3y0jujc7tmci2.fromDom(sel.getStart());
        var end = $_2bd3y0jujc7tmci2.fromDom(sel.getEnd());
        var startTable = $_dvsb29jrjc7tmcgo.table(start);
        var endTable = $_dvsb29jrjc7tmcgo.table(end);
        var sameTable = startTable.bind(function (tableStart) {
          return endTable.bind(function (tableEnd) {
            return $_4co3lyjyjc7tmciu.eq(tableStart, tableEnd) ? $_8zi7zzjgjc7tmce9.some(true) : $_8zi7zzjgjc7tmce9.none();
          });
        });
        sameTable.fold(function () {
          annotations.clear(body);
        }, $_av3vphjhjc7tmcee.noop);
      };
      var mouseHandlers = $_4c36h5oijc7tmdkq.mouse(win, body, isRoot, annotations);
      var keyHandlers = $_4c36h5oijc7tmdkq.keyboard(win, body, isRoot, annotations);
      var handleResponse = function (event, response) {
        if (response.kill()) {
          event.kill();
        }
        response.selection().each(function (ns) {
          var relative = $_1dawk8o2jc7tmdhd.relative(ns.start(), ns.finish());
          var rng = $_59qwsdo8jc7tmdid.asLtrRange(win, relative);
          editor.selection.setRng(rng);
        });
      };
      var keyup = function (event) {
        var wrappedEvent = wrapEvent(event);
        if (wrappedEvent.raw().shiftKey && $_3tdo0qokjc7tmdl6.isNavigation(wrappedEvent.raw().which)) {
          var rng = editor.selection.getRng();
          var start = $_2bd3y0jujc7tmci2.fromDom(rng.startContainer);
          var end = $_2bd3y0jujc7tmci2.fromDom(rng.endContainer);
          keyHandlers.keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset).each(function (response) {
            handleResponse(wrappedEvent, response);
          });
        }
      };
      var checkLast = function (last) {
        return !$_9o3gmekfjc7tmckw.has(last, 'data-mce-bogus') && $_fxq8yvkgjc7tmcl4.name(last) !== 'br' && !($_fxq8yvkgjc7tmcl4.isText(last) && $_asu5ztkxjc7tmcp2.get(last).length === 0);
      };
      var getLast = function () {
        var body = $_2bd3y0jujc7tmci2.fromDom(editor.getBody());
        var lastChild = $_66uz4xjwjc7tmcib.lastChild(body);
        var getPrevLast = function (last) {
          return $_66uz4xjwjc7tmcib.prevSibling(last).bind(function (prevLast) {
            return checkLast(prevLast) ? $_8zi7zzjgjc7tmce9.some(prevLast) : getPrevLast(prevLast);
          });
        };
        return lastChild.bind(function (last) {
          return checkLast(last) ? $_8zi7zzjgjc7tmce9.some(last) : getPrevLast(last);
        });
      };
      var keydown = function (event) {
        var wrappedEvent = wrapEvent(event);
        lazyResize().each(function (resize) {
          resize.hideBars();
        });
        if (event.which === 40) {
          getLast().each(function (last) {
            if ($_fxq8yvkgjc7tmcl4.name(last) === 'table') {
              if (editor.settings.forced_root_block) {
                editor.dom.add(editor.getBody(), editor.settings.forced_root_block, editor.settings.forced_root_block_attrs, '<br/>');
              } else {
                editor.dom.add(editor.getBody(), 'br');
              }
            }
          });
        }
        var rng = editor.selection.getRng();
        var startContainer = $_2bd3y0jujc7tmci2.fromDom(editor.selection.getStart());
        var start = $_2bd3y0jujc7tmci2.fromDom(rng.startContainer);
        var end = $_2bd3y0jujc7tmci2.fromDom(rng.endContainer);
        var direction = $_gd6kqnn2jc7tmd8u.directionAt(startContainer).isRtl() ? $_3tdo0qokjc7tmdl6.rtl : $_3tdo0qokjc7tmdl6.ltr;
        keyHandlers.keydown(wrappedEvent, start, rng.startOffset, end, rng.endOffset, direction).each(function (response) {
          handleResponse(wrappedEvent, response);
        });
        lazyResize().each(function (resize) {
          resize.showBars();
        });
      };
      var wrapEvent = function (event) {
        var target = $_2bd3y0jujc7tmci2.fromDom(event.target);
        var stop = function () {
          event.stopPropagation();
        };
        var prevent = function () {
          event.preventDefault();
        };
        var kill = $_av3vphjhjc7tmcee.compose(prevent, stop);
        return {
          'target': $_av3vphjhjc7tmcee.constant(target),
          'x': $_av3vphjhjc7tmcee.constant(event.x),
          'y': $_av3vphjhjc7tmcee.constant(event.y),
          'stop': stop,
          'prevent': prevent,
          'kill': kill,
          'raw': $_av3vphjhjc7tmcee.constant(event)
        };
      };
      var isLeftMouse = function (raw) {
        return raw.button === 0;
      };
      var isLeftButtonPressed = function (raw) {
        if (raw.buttons === undefined) {
          return true;
        }
        return (raw.buttons & 1) !== 0;
      };
      var mouseDown = function (e) {
        if (isLeftMouse(e)) {
          mouseHandlers.mousedown(wrapEvent(e));
        }
      };
      var mouseOver = function (e) {
        if (isLeftButtonPressed(e)) {
          mouseHandlers.mouseover(wrapEvent(e));
        }
      };
      var mouseUp = function (e) {
        if (isLeftMouse) {
          mouseHandlers.mouseup(wrapEvent(e));
        }
      };
      editor.on('mousedown', mouseDown);
      editor.on('mouseover', mouseOver);
      editor.on('mouseup', mouseUp);
      editor.on('keyup', keyup);
      editor.on('keydown', keydown);
      editor.on('nodechange', syncSelection);
      handlers = $_8zi7zzjgjc7tmce9.some(handlerStruct({
        mousedown: mouseDown,
        mouseover: mouseOver,
        mouseup: mouseUp,
        keyup: keyup,
        keydown: keydown
      }));
    });
    var destroy = function () {
      handlers.each(function (handlers) {
      });
    };
    return {
      clear: annotations.clear,
      destroy: destroy
    };
  };

  var Selections = function (editor) {
    var get = function () {
      var body = $_45jthun1jc7tmd8q.getBody(editor);
      return $_1zq4szl2jc7tmcq4.retrieve(body, $_b84ex7lfjc7tmcuc.selectedSelector()).fold(function () {
        if (editor.selection.getStart() === undefined) {
          return $_2uxq8vlgjc7tmcuf.none();
        } else {
          return $_2uxq8vlgjc7tmcuf.single(editor.selection);
        }
      }, function (cells) {
        return $_2uxq8vlgjc7tmcuf.multiple(cells);
      });
    };
    return { get: get };
  };

  var each$4 = Tools.each;
  var addButtons = function (editor) {
    var menuItems = [];
    each$4('inserttable tableprops deletetable | cell row column'.split(' '), function (name) {
      if (name == '|') {
        menuItems.push({ text: '-' });
      } else {
        menuItems.push(editor.menuItems[name]);
      }
    });
    editor.addButton('table', {
      type: 'menubutton',
      title: 'Table',
      menu: menuItems
    });
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    editor.addButton('tableprops', {
      title: 'Table properties',
      onclick: $_av3vphjhjc7tmcee.curry($_g5wwfun7jc7tmd9u.open, editor, true),
      icon: 'table'
    });
    editor.addButton('tabledelete', {
      title: 'Delete table',
      onclick: cmd('mceTableDelete')
    });
    editor.addButton('tablecellprops', {
      title: 'Cell properties',
      onclick: cmd('mceTableCellProps')
    });
    editor.addButton('tablemergecells', {
      title: 'Merge cells',
      onclick: cmd('mceTableMergeCells')
    });
    editor.addButton('tablesplitcells', {
      title: 'Split cell',
      onclick: cmd('mceTableSplitCells')
    });
    editor.addButton('tableinsertrowbefore', {
      title: 'Insert row before',
      onclick: cmd('mceTableInsertRowBefore')
    });
    editor.addButton('tableinsertrowafter', {
      title: 'Insert row after',
      onclick: cmd('mceTableInsertRowAfter')
    });
    editor.addButton('tabledeleterow', {
      title: 'Delete row',
      onclick: cmd('mceTableDeleteRow')
    });
    editor.addButton('tablerowprops', {
      title: 'Row properties',
      onclick: cmd('mceTableRowProps')
    });
    editor.addButton('tablecutrow', {
      title: 'Cut row',
      onclick: cmd('mceTableCutRow')
    });
    editor.addButton('tablecopyrow', {
      title: 'Copy row',
      onclick: cmd('mceTableCopyRow')
    });
    editor.addButton('tablepasterowbefore', {
      title: 'Paste row before',
      onclick: cmd('mceTablePasteRowBefore')
    });
    editor.addButton('tablepasterowafter', {
      title: 'Paste row after',
      onclick: cmd('mceTablePasteRowAfter')
    });
    editor.addButton('tableinsertcolbefore', {
      title: 'Insert column before',
      onclick: cmd('mceTableInsertColBefore')
    });
    editor.addButton('tableinsertcolafter', {
      title: 'Insert column after',
      onclick: cmd('mceTableInsertColAfter')
    });
    editor.addButton('tabledeletecol', {
      title: 'Delete column',
      onclick: cmd('mceTableDeleteCol')
    });
  };
  var addToolbars = function (editor) {
    var isTable = function (table) {
      var selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);
      return selectorMatched;
    };
    var toolbarItems = editor.settings.table_toolbar;
    if (toolbarItems === '' || toolbarItems === false) {
      return;
    }
    if (!toolbarItems) {
      toolbarItems = 'tableprops tabledelete | ' + 'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' + 'tableinsertcolbefore tableinsertcolafter tabledeletecol';
    }
    editor.addContextToolbar(isTable, toolbarItems);
  };
  var $_6i2mbgpajc7tmdsu = {
    addButtons: addButtons,
    addToolbars: addToolbars
  };

  var addMenuItems = function (editor, selections) {
    var targets = $_8zi7zzjgjc7tmce9.none();
    var tableCtrls = [];
    var cellCtrls = [];
    var mergeCtrls = [];
    var unmergeCtrls = [];
    var noTargetDisable = function (ctrl) {
      ctrl.disabled(true);
    };
    var ctrlEnable = function (ctrl) {
      ctrl.disabled(false);
    };
    var pushTable = function () {
      var self = this;
      tableCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushCell = function () {
      var self = this;
      cellCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushMerge = function () {
      var self = this;
      mergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.mergable().isNone());
      });
    };
    var pushUnmerge = function () {
      var self = this;
      unmergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.unmergable().isNone());
      });
    };
    var setDisabledCtrls = function () {
      targets.fold(function () {
        $_f8juj3jfjc7tmcdy.each(tableCtrls, noTargetDisable);
        $_f8juj3jfjc7tmcdy.each(cellCtrls, noTargetDisable);
        $_f8juj3jfjc7tmcdy.each(mergeCtrls, noTargetDisable);
        $_f8juj3jfjc7tmcdy.each(unmergeCtrls, noTargetDisable);
      }, function (targets) {
        $_f8juj3jfjc7tmcdy.each(tableCtrls, ctrlEnable);
        $_f8juj3jfjc7tmcdy.each(cellCtrls, ctrlEnable);
        $_f8juj3jfjc7tmcdy.each(mergeCtrls, function (mergeCtrl) {
          mergeCtrl.disabled(targets.mergable().isNone());
        });
        $_f8juj3jfjc7tmcdy.each(unmergeCtrls, function (unmergeCtrl) {
          unmergeCtrl.disabled(targets.unmergable().isNone());
        });
      });
    };
    editor.on('init', function () {
      editor.on('nodechange', function (e) {
        var cellOpt = $_8zi7zzjgjc7tmce9.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        targets = cellOpt.bind(function (cellDom) {
          var cell = $_2bd3y0jujc7tmci2.fromDom(cellDom);
          var table = $_dvsb29jrjc7tmcgo.table(cell);
          return table.map(function (table) {
            return $_i3cwml0jc7tmcpm.forMenu(selections, table, cell);
          });
        });
        setDisabledCtrls();
      });
    });
    var generateTableGrid = function () {
      var html = '';
      html = '<table role="grid" class="mce-grid mce-grid-border" aria-readonly="true">';
      for (var y = 0; y < 10; y++) {
        html += '<tr>';
        for (var x = 0; x < 10; x++) {
          html += '<td role="gridcell" tabindex="-1"><a id="mcegrid' + (y * 10 + x) + '" href="#" ' + 'data-mce-x="' + x + '" data-mce-y="' + y + '"></a></td>';
        }
        html += '</tr>';
      }
      html += '</table>';
      html += '<div class="mce-text-center" role="presentation">1 x 1</div>';
      return html;
    };
    var selectGrid = function (editor, tx, ty, control) {
      var table = control.getEl().getElementsByTagName('table')[0];
      var x, y, focusCell, cell, active;
      var rtl = control.isRtl() || control.parent().rel == 'tl-tr';
      table.nextSibling.innerHTML = tx + 1 + ' x ' + (ty + 1);
      if (rtl) {
        tx = 9 - tx;
      }
      for (y = 0; y < 10; y++) {
        for (x = 0; x < 10; x++) {
          cell = table.rows[y].childNodes[x].firstChild;
          active = (rtl ? x >= tx : x <= tx) && y <= ty;
          editor.dom.toggleClass(cell, 'mce-active', active);
          if (active) {
            focusCell = cell;
          }
        }
      }
      return focusCell.parentNode;
    };
    var insertTable = editor.settings.table_grid === false ? {
      text: 'Table',
      icon: 'table',
      context: 'table',
      onclick: $_av3vphjhjc7tmcee.curry($_g5wwfun7jc7tmd9u.open, editor)
    } : {
      text: 'Table',
      icon: 'table',
      context: 'table',
      ariaHideMenu: true,
      onclick: function (e) {
        if (e.aria) {
          this.parent().hideAll();
          e.stopImmediatePropagation();
          $_g5wwfun7jc7tmd9u.open(editor);
        }
      },
      onshow: function () {
        selectGrid(editor, 0, 0, this.menu.items()[0]);
      },
      onhide: function () {
        var elements = this.menu.items()[0].getEl().getElementsByTagName('a');
        editor.dom.removeClass(elements, 'mce-active');
        editor.dom.addClass(elements[0], 'mce-active');
      },
      menu: [{
          type: 'container',
          html: generateTableGrid(),
          onPostRender: function () {
            this.lastX = this.lastY = 0;
          },
          onmousemove: function (e) {
            var target = e.target, x, y;
            if (target.tagName.toUpperCase() == 'A') {
              x = parseInt(target.getAttribute('data-mce-x'), 10);
              y = parseInt(target.getAttribute('data-mce-y'), 10);
              if (this.isRtl() || this.parent().rel == 'tl-tr') {
                x = 9 - x;
              }
              if (x !== this.lastX || y !== this.lastY) {
                selectGrid(editor, x, y, e.control);
                this.lastX = x;
                this.lastY = y;
              }
            }
          },
          onclick: function (e) {
            var self = this;
            if (e.target.tagName.toUpperCase() == 'A') {
              e.preventDefault();
              e.stopPropagation();
              self.parent().cancel();
              editor.undoManager.transact(function () {
                $_8320wnlijc7tmcul.insert(editor, self.lastX + 1, self.lastY + 1);
              });
              editor.addVisual();
            }
          }
        }]
    };
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    var tableProperties = {
      text: 'Table properties',
      context: 'table',
      onPostRender: pushTable,
      onclick: $_av3vphjhjc7tmcee.curry($_g5wwfun7jc7tmd9u.open, editor, true)
    };
    var deleteTable = {
      text: 'Delete table',
      context: 'table',
      onPostRender: pushTable,
      cmd: 'mceTableDelete'
    };
    var row = {
      text: 'Row',
      context: 'table',
      menu: [
        {
          text: 'Insert row before',
          onclick: cmd('mceTableInsertRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert row after',
          onclick: cmd('mceTableInsertRowAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete row',
          onclick: cmd('mceTableDeleteRow'),
          onPostRender: pushCell
        },
        {
          text: 'Row properties',
          onclick: cmd('mceTableRowProps'),
          onPostRender: pushCell
        },
        { text: '-' },
        {
          text: 'Cut row',
          onclick: cmd('mceTableCutRow'),
          onPostRender: pushCell
        },
        {
          text: 'Copy row',
          onclick: cmd('mceTableCopyRow'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row before',
          onclick: cmd('mceTablePasteRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row after',
          onclick: cmd('mceTablePasteRowAfter'),
          onPostRender: pushCell
        }
      ]
    };
    var column = {
      text: 'Column',
      context: 'table',
      menu: [
        {
          text: 'Insert column before',
          onclick: cmd('mceTableInsertColBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert column after',
          onclick: cmd('mceTableInsertColAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete column',
          onclick: cmd('mceTableDeleteCol'),
          onPostRender: pushCell
        }
      ]
    };
    var cell = {
      separator: 'before',
      text: 'Cell',
      context: 'table',
      menu: [
        {
          text: 'Cell properties',
          onclick: cmd('mceTableCellProps'),
          onPostRender: pushCell
        },
        {
          text: 'Merge cells',
          onclick: cmd('mceTableMergeCells'),
          onPostRender: pushMerge
        },
        {
          text: 'Split cell',
          onclick: cmd('mceTableSplitCells'),
          onPostRender: pushUnmerge
        }
      ]
    };
    editor.addMenuItem('inserttable', insertTable);
    editor.addMenuItem('tableprops', tableProperties);
    editor.addMenuItem('deletetable', deleteTable);
    editor.addMenuItem('row', row);
    editor.addMenuItem('column', column);
    editor.addMenuItem('cell', cell);
  };
  var $_ej5sq4pbjc7tmdt1 = { addMenuItems: addMenuItems };

  function Plugin(editor) {
    var self = this;
    var resizeHandler = ResizeHandler(editor);
    var cellSelection = CellSelection$1(editor, resizeHandler.lazyResize);
    var actions = TableActions(editor, resizeHandler.lazyWire);
    var selections = Selections(editor);
    $_d52iqgn4jc7tmd91.registerCommands(editor, actions, cellSelection, selections);
    $_16eqo7jejc7tmcd6.registerEvents(editor, selections, actions, cellSelection);
    $_ej5sq4pbjc7tmdt1.addMenuItems(editor, selections);
    $_6i2mbgpajc7tmdsu.addButtons(editor);
    $_6i2mbgpajc7tmdsu.addToolbars(editor);
    editor.on('PreInit', function () {
      editor.serializer.addTempAttr($_b84ex7lfjc7tmcuc.firstSelected());
      editor.serializer.addTempAttr($_b84ex7lfjc7tmcuc.lastSelected());
    });
    if (editor.settings.table_tab_navigation !== false) {
      editor.on('keydown', function (e) {
        $_4hssyknzjc7tmdgo.handle(e, editor, actions, resizeHandler.lazyWire);
      });
    }
    editor.on('remove', function () {
      resizeHandler.destroy();
      cellSelection.destroy();
    });
    self.insertTable = function (columns, rows) {
      return $_8320wnlijc7tmcul.insert(editor, columns, rows);
    };
    self.setClipboardRows = $_d52iqgn4jc7tmd91.setClipboardRows;
    self.getClipboardRows = $_d52iqgn4jc7tmd91.getClipboardRows;
  }
  PluginManager.add('table', Plugin);
  var Plugin$1 = function () {
  };

  return Plugin$1;

}());
})()
