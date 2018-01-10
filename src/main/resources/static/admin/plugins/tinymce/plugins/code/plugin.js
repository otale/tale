(function () {
var code = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
  };
  var $_5rtxls90jc7tmamc = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_j8fdd92jc7tmame = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_5rtxls90jc7tmamc.getMinWidth(editor);
    var minHeight = $_5rtxls90jc7tmamc.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_j8fdd92jc7tmame.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_j8fdd92jc7tmame.getContent(editor));
  };
  var $_8adnnn8zjc7tmamb = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_8adnnn8zjc7tmamb.open(editor);
    });
  };
  var $_9baz2j8yjc7tmam9 = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_8adnnn8zjc7tmamb.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_8adnnn8zjc7tmamb.open(editor);
      }
    });
  };
  var $_cng4lt93jc7tmamg = { register: register$1 };

  PluginManager.add('code', function (editor) {
    $_9baz2j8yjc7tmam9.register(editor);
    $_cng4lt93jc7tmamg.register(editor);
    return {};
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
