(function () {
var emoticons = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var emoticons = [
    [
      'cool',
      'cry',
      'embarassed',
      'foot-in-mouth'
    ],
    [
      'frown',
      'innocent',
      'kiss',
      'laughing'
    ],
    [
      'money-mouth',
      'sealed',
      'smile',
      'surprised'
    ],
    [
      'tongue-out',
      'undecided',
      'wink',
      'yell'
    ]
  ];
  var getHtml = function (pluginUrl) {
    var emoticonsHtml;
    emoticonsHtml = '<table role="list" class="mce-grid">';
    Tools.each(emoticons, function (row) {
      emoticonsHtml += '<tr>';
      Tools.each(row, function (icon) {
        var emoticonUrl = pluginUrl + '/img/smiley-' + icon + '.gif';
        emoticonsHtml += '<td><a href="#" data-mce-url="' + emoticonUrl + '" data-mce-alt="' + icon + '" tabindex="-1" ' + 'role="option" aria-label="' + icon + '"><img src="' + emoticonUrl + '" style="width: 18px; height: 18px" role="presentation" /></a></td>';
      });
      emoticonsHtml += '</tr>';
    });
    emoticonsHtml += '</table>';
    return emoticonsHtml;
  };
  var $_ezsya0a7jc7tmatl = { getHtml: getHtml };

  var insertEmoticon = function (editor, src, alt) {
    editor.insertContent(editor.dom.createHTML('img', {
      src: src,
      alt: alt
    }));
  };
  var register = function (editor, pluginUrl) {
    var panelHtml = $_ezsya0a7jc7tmatl.getHtml(pluginUrl);
    editor.addButton('emoticons', {
      type: 'panelbutton',
      panel: {
        role: 'application',
        autohide: true,
        html: panelHtml,
        onclick: function (e) {
          var linkElm = editor.dom.getParent(e.target, 'a');
          if (linkElm) {
            insertEmoticon(editor, linkElm.getAttribute('data-mce-url'), linkElm.getAttribute('data-mce-alt'));
            this.hide();
          }
        }
      },
      tooltip: 'Emoticons'
    });
  };
  var $_7lc7pba6jc7tmatk = { register: register };

  PluginManager.add('emoticons', function (editor, pluginUrl) {
    $_7lc7pba6jc7tmatk.register(editor, pluginUrl);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
