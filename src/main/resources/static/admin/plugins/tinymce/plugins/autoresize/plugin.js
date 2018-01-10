(function () {
var autoresize = (function () {
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

  var Env = tinymce.util.Tools.resolve('tinymce.Env');

  var Delay = tinymce.util.Tools.resolve('tinymce.util.Delay');

  var getAutoResizeMinHeight = function (editor) {
    return parseInt(editor.getParam('autoresize_min_height', editor.getElement().offsetHeight), 10);
  };
  var getAutoResizeMaxHeight = function (editor) {
    return parseInt(editor.getParam('autoresize_max_height', 0), 10);
  };
  var getAutoResizeOverflowPadding = function (editor) {
    return editor.getParam('autoresize_overflow_padding', 1);
  };
  var getAutoResizeBottomMargin = function (editor) {
    return editor.getParam('autoresize_bottom_margin', 50);
  };
  var shouldAutoResizeOnInit = function (editor) {
    return editor.getParam('autoresize_on_init', true);
  };
  var $_19c2x282jc7tmah5 = {
    getAutoResizeMinHeight: getAutoResizeMinHeight,
    getAutoResizeMaxHeight: getAutoResizeMaxHeight,
    getAutoResizeOverflowPadding: getAutoResizeOverflowPadding,
    getAutoResizeBottomMargin: getAutoResizeBottomMargin,
    shouldAutoResizeOnInit: shouldAutoResizeOnInit
  };

  var isFullscreen = function (editor) {
    return editor.plugins.fullscreen && editor.plugins.fullscreen.isFullscreen();
  };
  var wait = function (editor, oldSize, times, interval, callback) {
    Delay.setEditorTimeout(editor, function () {
      resize(editor, oldSize);
      if (times--) {
        wait(editor, oldSize, times, interval, callback);
      } else if (callback) {
        callback();
      }
    }, interval);
  };
  var toggleScrolling = function (editor, state) {
    var body = editor.getBody();
    if (body) {
      body.style.overflowY = state ? '' : 'hidden';
      if (!state) {
        body.scrollTop = 0;
      }
    }
  };
  var resize = function (editor, oldSize) {
    var deltaSize, doc, body, resizeHeight, myHeight;
    var marginTop, marginBottom, paddingTop, paddingBottom, borderTop, borderBottom;
    var dom = editor.dom;
    doc = editor.getDoc();
    if (!doc) {
      return;
    }
    if (isFullscreen(editor)) {
      toggleScrolling(editor, true);
      return;
    }
    body = doc.body;
    resizeHeight = $_19c2x282jc7tmah5.getAutoResizeMinHeight(editor);
    marginTop = dom.getStyle(body, 'margin-top', true);
    marginBottom = dom.getStyle(body, 'margin-bottom', true);
    paddingTop = dom.getStyle(body, 'padding-top', true);
    paddingBottom = dom.getStyle(body, 'padding-bottom', true);
    borderTop = dom.getStyle(body, 'border-top-width', true);
    borderBottom = dom.getStyle(body, 'border-bottom-width', true);
    myHeight = body.offsetHeight + parseInt(marginTop, 10) + parseInt(marginBottom, 10) + parseInt(paddingTop, 10) + parseInt(paddingBottom, 10) + parseInt(borderTop, 10) + parseInt(borderBottom, 10);
    if (isNaN(myHeight) || myHeight <= 0) {
      myHeight = Env.ie ? body.scrollHeight : Env.webkit && body.clientHeight === 0 ? 0 : body.offsetHeight;
    }
    if (myHeight > $_19c2x282jc7tmah5.getAutoResizeMinHeight(editor)) {
      resizeHeight = myHeight;
    }
    var maxHeight = $_19c2x282jc7tmah5.getAutoResizeMaxHeight(editor);
    if (maxHeight && myHeight > maxHeight) {
      resizeHeight = maxHeight;
      toggleScrolling(editor, true);
    } else {
      toggleScrolling(editor, false);
    }
    if (resizeHeight !== oldSize.get()) {
      deltaSize = resizeHeight - oldSize.get();
      dom.setStyle(editor.iframeElement, 'height', resizeHeight + 'px');
      oldSize.set(resizeHeight);
      if (Env.webkit && deltaSize < 0) {
        resize(editor, oldSize);
      }
    }
  };
  var setup = function (editor, oldSize) {
    editor.on('init', function () {
      var overflowPadding, bottomMargin, dom = editor.dom;
      overflowPadding = $_19c2x282jc7tmah5.getAutoResizeOverflowPadding(editor);
      bottomMargin = $_19c2x282jc7tmah5.getAutoResizeBottomMargin(editor);
      if (overflowPadding !== false) {
        dom.setStyles(editor.getBody(), {
          paddingLeft: overflowPadding,
          paddingRight: overflowPadding
        });
      }
      if (bottomMargin !== false) {
        dom.setStyles(editor.getBody(), { paddingBottom: bottomMargin });
      }
    });
    editor.on('nodechange setcontent keyup FullscreenStateChanged', function (e) {
      resize(editor, oldSize);
    });
    if ($_19c2x282jc7tmah5.shouldAutoResizeOnInit(editor)) {
      editor.on('init', function () {
        wait(editor, oldSize, 20, 100, function () {
          wait(editor, oldSize, 5, 1000);
        });
      });
    }
  };
  var $_bn131m7zjc7tmagv = {
    setup: setup,
    resize: resize
  };

  var register = function (editor, oldSize) {
    editor.addCommand('mceAutoResize', function () {
      $_bn131m7zjc7tmagv.resize(editor, oldSize);
    });
  };
  var $_9xsglh7yjc7tmagr = { register: register };

  PluginManager.add('autoresize', function (editor) {
    if (!editor.inline) {
      var oldSize = Cell(0);
      $_9xsglh7yjc7tmagr.register(editor, oldSize);
      $_bn131m7zjc7tmagv.setup(editor, oldSize);
    }
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
