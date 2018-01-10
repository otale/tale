(function () {
var hr = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('InsertHorizontalRule', function () {
      editor.execCommand('mceInsertContent', false, '<hr />');
    });
  };
  var $_476r93bijc7tmb14 = { register: register };

  var register$1 = function (editor) {
    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule'
    });
    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  };
  var $_g1k44lbjjc7tmb16 = { register: register$1 };

  PluginManager.add('hr', function (editor) {
    $_476r93bijc7tmb14.register(editor);
    $_g1k44lbjjc7tmb16.register(editor);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
