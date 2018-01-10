(function () {
var fullscreen = (function () {
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

  var get = function (fullscreenState) {
    return {
      isFullscreen: function () {
        return fullscreenState.get() !== null;
      }
    };
  };
  var $_d2rdefbajc7tmb07 = { get: get };

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var fireFullscreenStateChanged = function (editor, state) {
    editor.fire('FullscreenStateChanged', { state: state });
  };
  var $_9x4v3kbejc7tmb0f = { fireFullscreenStateChanged: fireFullscreenStateChanged };

  var DOM = DOMUtils.DOM;
  var getWindowSize = function () {
    var w, h, win = window, doc = document;
    var body = doc.body;
    if (body.offsetWidth) {
      w = body.offsetWidth;
      h = body.offsetHeight;
    }
    if (win.innerWidth && win.innerHeight) {
      w = win.innerWidth;
      h = win.innerHeight;
    }
    return {
      w: w,
      h: h
    };
  };
  var getScrollPos = function () {
    var vp = DOM.getViewPort();
    return {
      x: vp.x,
      y: vp.y
    };
  };
  var setScrollPos = function (pos) {
    window.scrollTo(pos.x, pos.y);
  };
  var toggleFullscreen = function (editor, fullscreenState) {
    var body = document.body, documentElement = document.documentElement, editorContainerStyle;
    var editorContainer, iframe, iframeStyle;
    var fullscreenInfo = fullscreenState.get();
    var resize = function () {
      DOM.setStyle(iframe, 'height', getWindowSize().h - (editorContainer.clientHeight - iframe.clientHeight));
    };
    var removeResize = function () {
      DOM.unbind(window, 'resize', resize);
    };
    editorContainer = editor.getContainer();
    editorContainerStyle = editorContainer.style;
    iframe = editor.getContentAreaContainer().firstChild;
    iframeStyle = iframe.style;
    if (!fullscreenInfo) {
      var newFullScreenInfo = {
        scrollPos: getScrollPos(),
        containerWidth: editorContainerStyle.width,
        containerHeight: editorContainerStyle.height,
        iframeWidth: iframeStyle.width,
        iframeHeight: iframeStyle.height,
        resizeHandler: resize,
        removeHandler: removeResize
      };
      iframeStyle.width = iframeStyle.height = '100%';
      editorContainerStyle.width = editorContainerStyle.height = '';
      DOM.addClass(body, 'mce-fullscreen');
      DOM.addClass(documentElement, 'mce-fullscreen');
      DOM.addClass(editorContainer, 'mce-fullscreen');
      DOM.bind(window, 'resize', resize);
      editor.on('remove', removeResize);
      resize();
      fullscreenState.set(newFullScreenInfo);
      $_9x4v3kbejc7tmb0f.fireFullscreenStateChanged(editor, true);
    } else {
      iframeStyle.width = fullscreenInfo.iframeWidth;
      iframeStyle.height = fullscreenInfo.iframeHeight;
      if (fullscreenInfo.containerWidth) {
        editorContainerStyle.width = fullscreenInfo.containerWidth;
      }
      if (fullscreenInfo.containerHeight) {
        editorContainerStyle.height = fullscreenInfo.containerHeight;
      }
      DOM.removeClass(body, 'mce-fullscreen');
      DOM.removeClass(documentElement, 'mce-fullscreen');
      DOM.removeClass(editorContainer, 'mce-fullscreen');
      setScrollPos(fullscreenInfo.scrollPos);
      DOM.unbind(window, 'resize', fullscreenInfo.resizeHandler);
      editor.off('remove', fullscreenInfo.removeHandler);
      fullscreenState.set(null);
      $_9x4v3kbejc7tmb0f.fireFullscreenStateChanged(editor, false);
    }
  };
  var $_99bcalbcjc7tmb0b = { toggleFullscreen: toggleFullscreen };

  var register = function (editor, fullscreenState) {
    editor.addCommand('mceFullScreen', function () {
      $_99bcalbcjc7tmb0b.toggleFullscreen(editor, fullscreenState);
    });
  };
  var $_5umf5jbbjc7tmb08 = { register: register };

  var postRender = function (editor) {
    return function (e) {
      var ctrl = e.control;
      editor.on('FullscreenStateChanged', function (e) {
        ctrl.active(e.state);
      });
    };
  };
  var register$1 = function (editor) {
    editor.addMenuItem('fullscreen', {
      text: 'Fullscreen',
      shortcut: 'Ctrl+Shift+F',
      selectable: true,
      cmd: 'mceFullScreen',
      onPostRender: postRender(editor),
      context: 'view'
    });
    editor.addButton('fullscreen', {
      active: false,
      tooltip: 'Fullscreen',
      cmd: 'mceFullScreen',
      onPostRender: postRender(editor)
    });
  };
  var $_cyui95bfjc7tmb0i = { register: register$1 };

  PluginManager.add('fullscreen', function (editor) {
    var fullscreenState = Cell(null);
    $_5umf5jbbjc7tmb08.register(editor, fullscreenState);
    $_cyui95bfjc7tmb0i.register(editor);
    editor.addShortcut('Ctrl+Shift+F', '', 'mceFullScreen');
    return $_d2rdefbajc7tmb07.get(fullscreenState);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
