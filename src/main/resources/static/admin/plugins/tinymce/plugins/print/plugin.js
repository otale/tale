(function () {
var print = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('mcePrint', function () {
      editor.getWin().print();
    });
  };
  var $_bfrvz6i1jc7tmc6f = { register: register };

  var register$1 = function (editor) {
    editor.addButton('print', {
      title: 'Print',
      cmd: 'mcePrint'
    });
    editor.addMenuItem('print', {
      text: 'Print',
      cmd: 'mcePrint',
      icon: 'print'
    });
  };
  var $_3bgxsqi2jc7tmc6g = { register: register$1 };

  PluginManager.add('print', function (editor) {
    $_bfrvz6i1jc7tmc6f.register(editor);
    $_3bgxsqi2jc7tmc6g.register(editor);
    editor.addShortcut('Meta+P', '', 'mcePrint');
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
