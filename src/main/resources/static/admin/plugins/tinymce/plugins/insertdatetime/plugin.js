(function () {
var insertdatetime = (function () {
  'use strict';

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

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var getDateFormat = function (editor) {
    return editor.getParam('insertdatetime_dateformat', editor.translate('%Y-%m-%d'));
  };
  var getTimeFormat = function (editor) {
    return editor.getParam('insertdatetime_timeformat', editor.translate('%H:%M:%S'));
  };
  var getFormats = function (editor) {
    return editor.getParam('insertdatetime_formats', [
      '%H:%M:%S',
      '%Y-%m-%d',
      '%I:%M:%S %p',
      '%D'
    ]);
  };
  var getDefaultDateTime = function (editor) {
    var formats = getFormats(editor);
    return formats.length > 0 ? formats[0] : getTimeFormat(editor);
  };
  var shouldInsertTimeElement = function (editor) {
    return editor.getParam('insertdatetime_element', false);
  };
  var $_5ydftye0jc7tmbk5 = {
    getDateFormat: getDateFormat,
    getTimeFormat: getTimeFormat,
    getFormats: getFormats,
    getDefaultDateTime: getDefaultDateTime,
    shouldInsertTimeElement: shouldInsertTimeElement
  };

  var daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ');
  var daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
  var monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  var monthsLong = 'January February March April May June July August September October November December'.split(' ');
  var addZeros = function (value, len) {
    value = '' + value;
    if (value.length < len) {
      for (var i = 0; i < len - value.length; i++) {
        value = '0' + value;
      }
    }
    return value;
  };
  var getDateTime = function (editor, fmt, date) {
    date = date || new Date();
    fmt = fmt.replace('%D', '%m/%d/%Y');
    fmt = fmt.replace('%r', '%I:%M:%S %p');
    fmt = fmt.replace('%Y', '' + date.getFullYear());
    fmt = fmt.replace('%y', '' + date.getYear());
    fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2));
    fmt = fmt.replace('%d', addZeros(date.getDate(), 2));
    fmt = fmt.replace('%H', '' + addZeros(date.getHours(), 2));
    fmt = fmt.replace('%M', '' + addZeros(date.getMinutes(), 2));
    fmt = fmt.replace('%S', '' + addZeros(date.getSeconds(), 2));
    fmt = fmt.replace('%I', '' + ((date.getHours() + 11) % 12 + 1));
    fmt = fmt.replace('%p', '' + (date.getHours() < 12 ? 'AM' : 'PM'));
    fmt = fmt.replace('%B', '' + editor.translate(monthsLong[date.getMonth()]));
    fmt = fmt.replace('%b', '' + editor.translate(monthsShort[date.getMonth()]));
    fmt = fmt.replace('%A', '' + editor.translate(daysLong[date.getDay()]));
    fmt = fmt.replace('%a', '' + editor.translate(daysShort[date.getDay()]));
    fmt = fmt.replace('%%', '%');
    return fmt;
  };
  var updateElement = function (editor, timeElm, computerTime, userTime) {
    var newTimeElm = editor.dom.create('time', { datetime: computerTime }, userTime);
    timeElm.parentNode.insertBefore(newTimeElm, timeElm);
    editor.dom.remove(timeElm);
    editor.selection.select(newTimeElm, true);
    editor.selection.collapse(false);
  };
  var insertDateTime = function (editor, format) {
    if ($_5ydftye0jc7tmbk5.shouldInsertTimeElement(editor)) {
      var userTime = getDateTime(editor, format);
      var computerTime;
      if (/%[HMSIp]/.test(format)) {
        computerTime = getDateTime(editor, '%Y-%m-%dT%H:%M');
      } else {
        computerTime = getDateTime(editor, '%Y-%m-%d');
      }
      var timeElm = editor.dom.getParent(editor.selection.getStart(), 'time');
      if (timeElm) {
        updateElement(editor, timeElm, computerTime, userTime);
      } else {
        editor.insertContent('<time datetime="' + computerTime + '">' + userTime + '</time>');
      }
    } else {
      editor.insertContent(getDateTime(editor, format));
    }
  };
  var $_bm33zle1jc7tmbk7 = {
    insertDateTime: insertDateTime,
    getDateTime: getDateTime
  };

  var register = function (editor) {
    editor.addCommand('mceInsertDate', function () {
      $_bm33zle1jc7tmbk7.insertDateTime(editor, $_5ydftye0jc7tmbk5.getDateFormat(editor));
    });
    editor.addCommand('mceInsertTime', function () {
      $_bm33zle1jc7tmbk7.insertDateTime(editor, $_5ydftye0jc7tmbk5.getTimeFormat(editor));
    });
  };
  var $_betreddzjc7tmbk3 = { register: register };

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var createMenuItems = function (editor, lastFormatState) {
    var formats = $_5ydftye0jc7tmbk5.getFormats(editor);
    return Tools.map(formats, function (fmt) {
      return {
        text: $_bm33zle1jc7tmbk7.getDateTime(editor, fmt),
        onclick: function () {
          lastFormatState.set(fmt);
          $_bm33zle1jc7tmbk7.insertDateTime(editor, fmt);
        }
      };
    });
  };
  var register$1 = function (editor, lastFormatState) {
    var menuItems = createMenuItems(editor, lastFormatState);
    editor.addButton('insertdatetime', {
      type: 'splitbutton',
      title: 'Insert date/time',
      menu: menuItems,
      onclick: function () {
        var lastFormat = lastFormatState.get();
        $_bm33zle1jc7tmbk7.insertDateTime(editor, lastFormat ? lastFormat : $_5ydftye0jc7tmbk5.getDefaultDateTime(editor));
      }
    });
    editor.addMenuItem('insertdatetime', {
      icon: 'date',
      text: 'Date/time',
      menu: menuItems,
      context: 'insert'
    });
  };
  var $_4749ose2jc7tmbkb = { register: register$1 };

  PluginManager.add('insertdatetime', function (editor) {
    var lastFormatState = Cell(null);
    $_betreddzjc7tmbk3.register(editor);
    $_4749ose2jc7tmbkb.register(editor, lastFormatState);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
