(function () {
var paste = (function () {
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

  var hasProPlugin = function (editor) {
    if (/(^|[ ,])powerpaste([, ]|$)/.test(editor.settings.plugins) && PluginManager.get('powerpaste')) {
      if (typeof window.console !== 'undefined' && window.console.log) {
        window.console.log('PowerPaste is incompatible with Paste plugin! Remove \'paste\' from the \'plugins\' option.');
      }
      return true;
    } else {
      return false;
    }
  };
  var $_fyz2yggwjc7tmbzh = { hasProPlugin: hasProPlugin };

  var get = function (clipboard, quirks) {
    return {
      clipboard: clipboard,
      quirks: quirks
    };
  };
  var $_dnlkq9gxjc7tmbzi = { get: get };

  var firePastePreProcess = function (editor, html, internal, isWordHtml) {
    return editor.fire('PastePreProcess', {
      content: html,
      internal: internal,
      wordContent: isWordHtml
    });
  };
  var firePastePostProcess = function (editor, node, internal, isWordHtml) {
    return editor.fire('PastePostProcess', {
      node: node,
      internal: internal,
      wordContent: isWordHtml
    });
  };
  var firePastePlainTextToggle = function (editor, state) {
    return editor.fire('PastePlainTextToggle', { state: state });
  };
  var firePaste = function (editor, ieFake) {
    return editor.fire('paste', { ieFake: ieFake });
  };
  var $_9mdcpbh0jc7tmbzn = {
    firePastePreProcess: firePastePreProcess,
    firePastePostProcess: firePastePostProcess,
    firePastePlainTextToggle: firePastePlainTextToggle,
    firePaste: firePaste
  };

  var shouldPlainTextInform = function (editor) {
    return editor.getParam('paste_plaintext_inform', true);
  };
  var shouldBlockDrop = function (editor) {
    return editor.getParam('paste_block_drop', false);
  };
  var shouldPasteDataImages = function (editor) {
    return editor.getParam('paste_data_images', false);
  };
  var shouldFilterDrop = function (editor) {
    return editor.getParam('paste_filter_drop', true);
  };
  var getPreProcess = function (editor) {
    return editor.getParam('paste_preprocess');
  };
  var getPostProcess = function (editor) {
    return editor.getParam('paste_postprocess');
  };
  var getWebkitStyles = function (editor) {
    return editor.getParam('paste_webkit_styles');
  };
  var shouldRemoveWebKitStyles = function (editor) {
    return editor.getParam('paste_remove_styles_if_webkit', true);
  };
  var shouldMergeFormats = function (editor) {
    return editor.getParam('paste_merge_formats', true);
  };
  var isSmartPasteEnabled = function (editor) {
    return editor.getParam('smart_paste', true);
  };
  var isPasteAsTextEnabled = function (editor) {
    return editor.getParam('paste_as_text', false);
  };
  var getRetainStyleProps = function (editor) {
    return editor.getParam('paste_retain_style_properties');
  };
  var getWordValidElements = function (editor) {
    var defaultValidElements = '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' + '-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,' + 'td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody';
    return editor.getParam('paste_word_valid_elements', defaultValidElements);
  };
  var shouldConvertWordFakeLists = function (editor) {
    return editor.getParam('paste_convert_word_fake_lists', true);
  };
  var shouldUseDefaultFilters = function (editor) {
    return editor.getParam('paste_enable_default_filters', true);
  };
  var $_fu2be1h1jc7tmbzr = {
    shouldPlainTextInform: shouldPlainTextInform,
    shouldBlockDrop: shouldBlockDrop,
    shouldPasteDataImages: shouldPasteDataImages,
    shouldFilterDrop: shouldFilterDrop,
    getPreProcess: getPreProcess,
    getPostProcess: getPostProcess,
    getWebkitStyles: getWebkitStyles,
    shouldRemoveWebKitStyles: shouldRemoveWebKitStyles,
    shouldMergeFormats: shouldMergeFormats,
    isSmartPasteEnabled: isSmartPasteEnabled,
    isPasteAsTextEnabled: isPasteAsTextEnabled,
    getRetainStyleProps: getRetainStyleProps,
    getWordValidElements: getWordValidElements,
    shouldConvertWordFakeLists: shouldConvertWordFakeLists,
    shouldUseDefaultFilters: shouldUseDefaultFilters
  };

  var shouldInformUserAboutPlainText = function (editor, userIsInformedState) {
    return userIsInformedState.get() === false && $_fu2be1h1jc7tmbzr.shouldPlainTextInform(editor);
  };
  var displayNotification = function (editor, message) {
    editor.notificationManager.open({
      text: editor.translate(message),
      type: 'info'
    });
  };
  var togglePlainTextPaste = function (editor, clipboard, userIsInformedState) {
    if (clipboard.pasteFormat === 'text') {
      clipboard.pasteFormat = 'html';
      $_9mdcpbh0jc7tmbzn.firePastePlainTextToggle(editor, false);
    } else {
      clipboard.pasteFormat = 'text';
      $_9mdcpbh0jc7tmbzn.firePastePlainTextToggle(editor, true);
      if (shouldInformUserAboutPlainText(editor, userIsInformedState)) {
        displayNotification(editor, 'Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.');
        userIsInformedState.set(true);
      }
    }
    editor.focus();
  };
  var $_9m68x5gzjc7tmbzl = { togglePlainTextPaste: togglePlainTextPaste };

  var register = function (editor, clipboard, userIsInformedState) {
    editor.addCommand('mceTogglePlainTextPaste', function () {
      $_9m68x5gzjc7tmbzl.togglePlainTextPaste(editor, clipboard, userIsInformedState);
    });
    editor.addCommand('mceInsertClipboardContent', function (ui, value) {
      if (value.content) {
        clipboard.pasteHtml(value.content, value.internal);
      }
      if (value.text) {
        clipboard.pasteText(value.text);
      }
    });
  };
  var $_kiqizgyjc7tmbzj = { register: register };

  var Env = tinymce.util.Tools.resolve('tinymce.Env');

  var Delay = tinymce.util.Tools.resolve('tinymce.util.Delay');

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var VK = tinymce.util.Tools.resolve('tinymce.util.VK');

  var internalMimeType = 'x-tinymce/html';
  var internalMark = '<!-- ' + internalMimeType + ' -->';
  var mark = function (html) {
    return internalMark + html;
  };
  var unmark = function (html) {
    return html.replace(internalMark, '');
  };
  var isMarked = function (html) {
    return html.indexOf(internalMark) !== -1;
  };
  var $_cj2s30h7jc7tmc0g = {
    mark: mark,
    unmark: unmark,
    isMarked: isMarked,
    internalHtmlMime: function () {
      return internalMimeType;
    }
  };

  var Entities = tinymce.util.Tools.resolve('tinymce.html.Entities');

  var isPlainText = function (text) {
    return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(text);
  };
  var toBRs = function (text) {
    return text.replace(/\r?\n/g, '<br>');
  };
  var openContainer = function (rootTag, rootAttrs) {
    var key, attrs = [];
    var tag = '<' + rootTag;
    if (typeof rootAttrs === 'object') {
      for (key in rootAttrs) {
        if (rootAttrs.hasOwnProperty(key)) {
          attrs.push(key + '="' + Entities.encodeAllRaw(rootAttrs[key]) + '"');
        }
      }
      if (attrs.length) {
        tag += ' ' + attrs.join(' ');
      }
    }
    return tag + '>';
  };
  var toBlockElements = function (text, rootTag, rootAttrs) {
    var blocks = text.split(/\n\n/);
    var tagOpen = openContainer(rootTag, rootAttrs);
    var tagClose = '</' + rootTag + '>';
    var paragraphs = Tools.map(blocks, function (p) {
      return p.split(/\n/).join('<br />');
    });
    var stitch = function (p) {
      return tagOpen + p + tagClose;
    };
    return paragraphs.length === 1 ? paragraphs[0] : Tools.map(paragraphs, stitch).join('');
  };
  var convert = function (text, rootTag, rootAttrs) {
    return rootTag ? toBlockElements(text, rootTag, rootAttrs) : toBRs(text);
  };
  var $_gbu5jgh8jc7tmc0i = {
    isPlainText: isPlainText,
    convert: convert,
    toBRs: toBRs,
    toBlockElements: toBlockElements
  };

  var PasteBin = function (editor) {
    var lastRng;
    var pasteBinDefaultContent = '%MCEPASTEBIN%';
    var create = function () {
      var dom = editor.dom, body = editor.getBody();
      var viewport = editor.dom.getViewPort(editor.getWin()), scrollTop = viewport.y, top = 20;
      var pasteBinElm;
      var scrollContainer;
      lastRng = editor.selection.getRng();
      if (editor.inline) {
        scrollContainer = editor.selection.getScrollContainer();
        if (scrollContainer && scrollContainer.scrollTop > 0) {
          scrollTop = scrollContainer.scrollTop;
        }
      }
      function getCaretRect(rng) {
        var rects, textNode, node, container = rng.startContainer;
        rects = rng.getClientRects();
        if (rects.length) {
          return rects[0];
        }
        if (!rng.collapsed || container.nodeType !== 1) {
          return;
        }
        node = container.childNodes[lastRng.startOffset];
        while (node && node.nodeType === 3 && !node.data.length) {
          node = node.nextSibling;
        }
        if (!node) {
          return;
        }
        if (node.tagName === 'BR') {
          textNode = dom.doc.createTextNode('\uFEFF');
          node.parentNode.insertBefore(textNode, node);
          rng = dom.createRng();
          rng.setStartBefore(textNode);
          rng.setEndAfter(textNode);
          rects = rng.getClientRects();
          dom.remove(textNode);
        }
        if (rects.length) {
          return rects[0];
        }
      }
      if (lastRng.getClientRects) {
        var rect = getCaretRect(lastRng);
        if (rect) {
          top = scrollTop + (rect.top - dom.getPos(body).y);
        } else {
          top = scrollTop;
          var container = lastRng.startContainer;
          if (container) {
            if (container.nodeType === 3 && container.parentNode !== body) {
              container = container.parentNode;
            }
            if (container.nodeType === 1) {
              top = dom.getPos(container, scrollContainer || body).y;
            }
          }
        }
      }
      pasteBinElm = editor.dom.add(editor.getBody(), 'div', {
        id: 'mcepastebin',
        contentEditable: true,
        'data-mce-bogus': 'all',
        style: 'position: absolute; top: ' + top + 'px; width: 10px; height: 10px; overflow: hidden; opacity: 0'
      }, pasteBinDefaultContent);
      if (Env.ie || Env.gecko) {
        dom.setStyle(pasteBinElm, 'left', dom.getStyle(body, 'direction', true) === 'rtl' ? 65535 : -65535);
      }
      dom.bind(pasteBinElm, 'beforedeactivate focusin focusout', function (e) {
        e.stopPropagation();
      });
      pasteBinElm.focus();
      editor.selection.select(pasteBinElm, true);
    };
    var remove = function () {
      if (getEl()) {
        var pasteBinClone;
        while (pasteBinClone = editor.dom.get('mcepastebin')) {
          editor.dom.remove(pasteBinClone);
          editor.dom.unbind(pasteBinClone);
        }
        if (lastRng) {
          editor.selection.setRng(lastRng);
        }
      }
      lastRng = null;
    };
    var getEl = function () {
      return editor.dom.get('mcepastebin');
    };
    var getHtml = function () {
      var pasteBinElm, pasteBinClones, i, dirtyWrappers, cleanWrapper;
      var copyAndRemove = function (toElm, fromElm) {
        toElm.appendChild(fromElm);
        editor.dom.remove(fromElm, true);
      };
      pasteBinClones = Tools.grep(editor.getBody().childNodes, function (elm) {
        return elm.id === 'mcepastebin';
      });
      pasteBinElm = pasteBinClones.shift();
      Tools.each(pasteBinClones, function (pasteBinClone) {
        copyAndRemove(pasteBinElm, pasteBinClone);
      });
      dirtyWrappers = editor.dom.select('div[id=mcepastebin]', pasteBinElm);
      for (i = dirtyWrappers.length - 1; i >= 0; i--) {
        cleanWrapper = editor.dom.create('div');
        pasteBinElm.insertBefore(cleanWrapper, dirtyWrappers[i]);
        copyAndRemove(cleanWrapper, dirtyWrappers[i]);
      }
      return pasteBinElm ? pasteBinElm.innerHTML : '';
    };
    var getLastRng = function () {
      return lastRng;
    };
    var isDefaultContent = function (content) {
      return content === pasteBinDefaultContent;
    };
    var isPasteBin = function (elm) {
      return elm && elm.id === 'mcepastebin';
    };
    var isDefault = function () {
      var pasteBinElm = getEl();
      return isPasteBin(pasteBinElm) && isDefaultContent(pasteBinElm.innerHTML);
    };
    return {
      create: create,
      remove: remove,
      getEl: getEl,
      getHtml: getHtml,
      getLastRng: getLastRng,
      isDefault: isDefault,
      isDefaultContent: isDefaultContent
    };
  };

  var DomParser = tinymce.util.Tools.resolve('tinymce.html.DomParser');

  var Node = tinymce.util.Tools.resolve('tinymce.html.Node');

  var Schema = tinymce.util.Tools.resolve('tinymce.html.Schema');

  var Serializer = tinymce.util.Tools.resolve('tinymce.html.Serializer');

  function filter(content, items) {
    Tools.each(items, function (v) {
      if (v.constructor === RegExp) {
        content = content.replace(v, '');
      } else {
        content = content.replace(v[0], v[1]);
      }
    });
    return content;
  }
  function innerText(html) {
    var schema = Schema(), domParser = DomParser({}, schema), text = '';
    var shortEndedElements = schema.getShortEndedElements();
    var ignoreElements = Tools.makeMap('script noscript style textarea video audio iframe object', ' ');
    var blockElements = schema.getBlockElements();
    function walk(node) {
      var name = node.name, currentNode = node;
      if (name === 'br') {
        text += '\n';
        return;
      }
      if (shortEndedElements[name]) {
        text += ' ';
      }
      if (ignoreElements[name]) {
        text += ' ';
        return;
      }
      if (node.type === 3) {
        text += node.value;
      }
      if (!node.shortEnded) {
        if (node = node.firstChild) {
          do {
            walk(node);
          } while (node = node.next);
        }
      }
      if (blockElements[name] && currentNode.next) {
        text += '\n';
        if (name === 'p') {
          text += '\n';
        }
      }
    }
    html = filter(html, [/<!\[[^\]]+\]>/g]);
    walk(domParser.parse(html));
    return text;
  }
  function trimHtml(html) {
    function trimSpaces(all, s1, s2) {
      if (!s1 && !s2) {
        return ' ';
      }
      return '\xA0';
    }
    html = filter(html, [
      /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/ig,
      /<!--StartFragment-->|<!--EndFragment-->/g,
      [
        /( ?)<span class="Apple-converted-space">\u00a0<\/span>( ?)/g,
        trimSpaces
      ],
      /<br class="Apple-interchange-newline">/g,
      /<br>$/i
    ]);
    return html;
  }
  function createIdGenerator(prefix) {
    var count = 0;
    return function () {
      return prefix + count++;
    };
  }
  var isMsEdge = function () {
    return navigator.userAgent.indexOf(' Edge/') !== -1;
  };
  var $_3333bthhjc7tmc1e = {
    filter: filter,
    innerText: innerText,
    trimHtml: trimHtml,
    createIdGenerator: createIdGenerator,
    isMsEdge: isMsEdge
  };

  function isWordContent(content) {
    return /<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i.test(content) || /class="OutlineElement/.test(content) || /id="?docs\-internal\-guid\-/.test(content);
  }
  function isNumericList(text) {
    var found, patterns;
    patterns = [
      /^[IVXLMCD]{1,2}\.[ \u00a0]/,
      /^[ivxlmcd]{1,2}\.[ \u00a0]/,
      /^[a-z]{1,2}[\.\)][ \u00a0]/,
      /^[A-Z]{1,2}[\.\)][ \u00a0]/,
      /^[0-9]+\.[ \u00a0]/,
      /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/,
      /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/
    ];
    text = text.replace(/^[\u00a0 ]+/, '');
    Tools.each(patterns, function (pattern) {
      if (pattern.test(text)) {
        found = true;
        return false;
      }
    });
    return found;
  }
  function isBulletList(text) {
    return /^[\s\u00a0]*[\u2022\u00b7\u00a7\u25CF]\s*/.test(text);
  }
  function convertFakeListsToProperLists(node) {
    var currentListNode, prevListNode, lastLevel = 1;
    function getText(node) {
      var txt = '';
      if (node.type === 3) {
        return node.value;
      }
      if (node = node.firstChild) {
        do {
          txt += getText(node);
        } while (node = node.next);
      }
      return txt;
    }
    function trimListStart(node, regExp) {
      if (node.type === 3) {
        if (regExp.test(node.value)) {
          node.value = node.value.replace(regExp, '');
          return false;
        }
      }
      if (node = node.firstChild) {
        do {
          if (!trimListStart(node, regExp)) {
            return false;
          }
        } while (node = node.next);
      }
      return true;
    }
    function removeIgnoredNodes(node) {
      if (node._listIgnore) {
        node.remove();
        return;
      }
      if (node = node.firstChild) {
        do {
          removeIgnoredNodes(node);
        } while (node = node.next);
      }
    }
    function convertParagraphToLi(paragraphNode, listName, start) {
      var level = paragraphNode._listLevel || lastLevel;
      if (level !== lastLevel) {
        if (level < lastLevel) {
          if (currentListNode) {
            currentListNode = currentListNode.parent.parent;
          }
        } else {
          prevListNode = currentListNode;
          currentListNode = null;
        }
      }
      if (!currentListNode || currentListNode.name !== listName) {
        prevListNode = prevListNode || currentListNode;
        currentListNode = new Node(listName, 1);
        if (start > 1) {
          currentListNode.attr('start', '' + start);
        }
        paragraphNode.wrap(currentListNode);
      } else {
        currentListNode.append(paragraphNode);
      }
      paragraphNode.name = 'li';
      if (level > lastLevel && prevListNode) {
        prevListNode.lastChild.append(currentListNode);
      }
      lastLevel = level;
      removeIgnoredNodes(paragraphNode);
      trimListStart(paragraphNode, /^\u00a0+/);
      trimListStart(paragraphNode, /^\s*([\u2022\u00b7\u00a7\u25CF]|\w+\.)/);
      trimListStart(paragraphNode, /^\u00a0+/);
    }
    var elements = [], child = node.firstChild;
    while (typeof child !== 'undefined' && child !== null) {
      elements.push(child);
      child = child.walk();
      if (child !== null) {
        while (typeof child !== 'undefined' && child.parent !== node) {
          child = child.walk();
        }
      }
    }
    for (var i = 0; i < elements.length; i++) {
      node = elements[i];
      if (node.name === 'p' && node.firstChild) {
        var nodeText = getText(node);
        if (isBulletList(nodeText)) {
          convertParagraphToLi(node, 'ul');
          continue;
        }
        if (isNumericList(nodeText)) {
          var matches = /([0-9]+)\./.exec(nodeText);
          var start = 1;
          if (matches) {
            start = parseInt(matches[1], 10);
          }
          convertParagraphToLi(node, 'ol', start);
          continue;
        }
        if (node._listLevel) {
          convertParagraphToLi(node, 'ul', 1);
          continue;
        }
        currentListNode = null;
      } else {
        prevListNode = currentListNode;
        currentListNode = null;
      }
    }
  }
  function filterStyles(editor, validStyles, node, styleValue) {
    var outputStyles = {}, matches, styles = editor.dom.parseStyle(styleValue);
    Tools.each(styles, function (value, name) {
      switch (name) {
      case 'mso-list':
        matches = /\w+ \w+([0-9]+)/i.exec(styleValue);
        if (matches) {
          node._listLevel = parseInt(matches[1], 10);
        }
        if (/Ignore/i.test(value) && node.firstChild) {
          node._listIgnore = true;
          node.firstChild._listIgnore = true;
        }
        break;
      case 'horiz-align':
        name = 'text-align';
        break;
      case 'vert-align':
        name = 'vertical-align';
        break;
      case 'font-color':
      case 'mso-foreground':
        name = 'color';
        break;
      case 'mso-background':
      case 'mso-highlight':
        name = 'background';
        break;
      case 'font-weight':
      case 'font-style':
        if (value !== 'normal') {
          outputStyles[name] = value;
        }
        return;
      case 'mso-element':
        if (/^(comment|comment-list)$/i.test(value)) {
          node.remove();
          return;
        }
        break;
      }
      if (name.indexOf('mso-comment') === 0) {
        node.remove();
        return;
      }
      if (name.indexOf('mso-') === 0) {
        return;
      }
      if ($_fu2be1h1jc7tmbzr.getRetainStyleProps(editor) === 'all' || validStyles && validStyles[name]) {
        outputStyles[name] = value;
      }
    });
    if (/(bold)/i.test(outputStyles['font-weight'])) {
      delete outputStyles['font-weight'];
      node.wrap(new Node('b', 1));
    }
    if (/(italic)/i.test(outputStyles['font-style'])) {
      delete outputStyles['font-style'];
      node.wrap(new Node('i', 1));
    }
    outputStyles = editor.dom.serializeStyle(outputStyles, node.name);
    if (outputStyles) {
      return outputStyles;
    }
    return null;
  }
  var filterWordContent = function (editor, content) {
    var retainStyleProperties, validStyles;
    retainStyleProperties = $_fu2be1h1jc7tmbzr.getRetainStyleProps(editor);
    if (retainStyleProperties) {
      validStyles = Tools.makeMap(retainStyleProperties.split(/[, ]/));
    }
    content = $_3333bthhjc7tmc1e.filter(content, [
      /<br class="?Apple-interchange-newline"?>/gi,
      /<b[^>]+id="?docs-internal-[^>]*>/gi,
      /<!--[\s\S]+?-->/gi,
      /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,
      [
        /<(\/?)s>/gi,
        '<$1strike>'
      ],
      [
        /&nbsp;/gi,
        '\xA0'
      ],
      [
        /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
        function (str, spaces) {
          return spaces.length > 0 ? spaces.replace(/./, ' ').slice(Math.floor(spaces.length / 2)).split('').join('\xA0') : '';
        }
      ]
    ]);
    var validElements = $_fu2be1h1jc7tmbzr.getWordValidElements(editor);
    var schema = Schema({
      valid_elements: validElements,
      valid_children: '-li[p]'
    });
    Tools.each(schema.elements, function (rule) {
      if (!rule.attributes['class']) {
        rule.attributes['class'] = {};
        rule.attributesOrder.push('class');
      }
      if (!rule.attributes.style) {
        rule.attributes.style = {};
        rule.attributesOrder.push('style');
      }
    });
    var domParser = DomParser({}, schema);
    domParser.addAttributeFilter('style', function (nodes) {
      var i = nodes.length, node;
      while (i--) {
        node = nodes[i];
        node.attr('style', filterStyles(editor, validStyles, node, node.attr('style')));
        if (node.name === 'span' && node.parent && !node.attributes.length) {
          node.unwrap();
        }
      }
    });
    domParser.addAttributeFilter('class', function (nodes) {
      var i = nodes.length, node, className;
      while (i--) {
        node = nodes[i];
        className = node.attr('class');
        if (/^(MsoCommentReference|MsoCommentText|msoDel)$/i.test(className)) {
          node.remove();
        }
        node.attr('class', null);
      }
    });
    domParser.addNodeFilter('del', function (nodes) {
      var i = nodes.length;
      while (i--) {
        nodes[i].remove();
      }
    });
    domParser.addNodeFilter('a', function (nodes) {
      var i = nodes.length, node, href, name;
      while (i--) {
        node = nodes[i];
        href = node.attr('href');
        name = node.attr('name');
        if (href && href.indexOf('#_msocom_') !== -1) {
          node.remove();
          continue;
        }
        if (href && href.indexOf('file://') === 0) {
          href = href.split('#')[1];
          if (href) {
            href = '#' + href;
          }
        }
        if (!href && !name) {
          node.unwrap();
        } else {
          if (name && !/^_?(?:toc|edn|ftn)/i.test(name)) {
            node.unwrap();
            continue;
          }
          node.attr({
            href: href,
            name: name
          });
        }
      }
    });
    var rootNode = domParser.parse(content);
    if ($_fu2be1h1jc7tmbzr.shouldConvertWordFakeLists(editor)) {
      convertFakeListsToProperLists(rootNode);
    }
    content = Serializer({ validate: editor.settings.validate }, schema).serialize(rootNode);
    return content;
  };
  var preProcess = function (editor, content) {
    return $_fu2be1h1jc7tmbzr.shouldUseDefaultFilters(editor) ? filterWordContent(editor, content) : content;
  };
  var $_bb52yehcjc7tmc0z = {
    preProcess: preProcess,
    isWordContent: isWordContent
  };

  var processResult = function (content, cancelled) {
    return {
      content: content,
      cancelled: cancelled
    };
  };
  var postProcessFilter = function (editor, html, internal, isWordHtml) {
    var tempBody = editor.dom.create('div', { style: 'display:none' }, html);
    var postProcessArgs = $_9mdcpbh0jc7tmbzn.firePastePostProcess(editor, tempBody, internal, isWordHtml);
    return processResult(postProcessArgs.node.innerHTML, postProcessArgs.isDefaultPrevented());
  };
  var filterContent = function (editor, content, internal, isWordHtml) {
    var preProcessArgs = $_9mdcpbh0jc7tmbzn.firePastePreProcess(editor, content, internal, isWordHtml);
    if (editor.hasEventListeners('PastePostProcess') && !preProcessArgs.isDefaultPrevented()) {
      return postProcessFilter(editor, preProcessArgs.content, internal, isWordHtml);
    } else {
      return processResult(preProcessArgs.content, preProcessArgs.isDefaultPrevented());
    }
  };
  var process = function (editor, html, internal) {
    var isWordHtml = $_bb52yehcjc7tmc0z.isWordContent(html);
    var content = isWordHtml ? $_bb52yehcjc7tmc0z.preProcess(editor, html) : html;
    return filterContent(editor, content, internal, isWordHtml);
  };
  var $_be1eh1hbjc7tmc0s = { process: process };

  var isAbsoluteUrl = function (url) {
    return /^https?:\/\/[\w\?\-\/+=.&%@~#]+$/i.test(url);
  };
  var isImageUrl = function (url) {
    return isAbsoluteUrl(url) && /.(gif|jpe?g|png)$/.test(url);
  };
  var createImage = function (editor, url, pasteHtml) {
    editor.undoManager.extra(function () {
      pasteHtml(editor, url);
    }, function () {
      editor.insertContent('<img src="' + url + '">');
    });
    return true;
  };
  var createLink = function (editor, url, pasteHtml) {
    editor.undoManager.extra(function () {
      pasteHtml(editor, url);
    }, function () {
      editor.execCommand('mceInsertLink', false, url);
    });
    return true;
  };
  var linkSelection = function (editor, html, pasteHtml) {
    return editor.selection.isCollapsed() === false && isAbsoluteUrl(html) ? createLink(editor, html, pasteHtml) : false;
  };
  var insertImage = function (editor, html, pasteHtml) {
    return isImageUrl(html) ? createImage(editor, html, pasteHtml) : false;
  };
  var pasteHtml = function (editor, html) {
    editor.insertContent(html, {
      merge: $_fu2be1h1jc7tmbzr.shouldMergeFormats(editor),
      paste: true
    });
    return true;
  };
  var smartInsertContent = function (editor, html) {
    Tools.each([
      linkSelection,
      insertImage,
      pasteHtml
    ], function (action) {
      return action(editor, html, pasteHtml) !== true;
    });
  };
  var insertContent = function (editor, html) {
    if ($_fu2be1h1jc7tmbzr.isSmartPasteEnabled(editor) === false) {
      pasteHtml(editor, html);
    } else {
      smartInsertContent(editor, html);
    }
  };
  var $_5lnlfphijc7tmc1h = {
    isImageUrl: isImageUrl,
    isAbsoluteUrl: isAbsoluteUrl,
    insertContent: insertContent
  };

  var Clipboard = function (editor) {
    var self = this, keyboardPasteTimeStamp = 0;
    var pasteBin = PasteBin(editor);
    var keyboardPastePlainTextState;
    var mceInternalUrlPrefix = 'data:text/mce-internal,';
    var uniqueId = $_3333bthhjc7tmc1e.createIdGenerator('mceclip');
    self.pasteFormat = $_fu2be1h1jc7tmbzr.isPasteAsTextEnabled(editor) ? 'text' : 'html';
    function pasteHtml(html, internalFlag) {
      var internal = internalFlag ? internalFlag : $_cj2s30h7jc7tmc0g.isMarked(html);
      var args = $_be1eh1hbjc7tmc0s.process(editor, $_cj2s30h7jc7tmc0g.unmark(html), internal);
      if (args.cancelled === false) {
        $_5lnlfphijc7tmc1h.insertContent(editor, args.content);
      }
    }
    function pasteText(text) {
      text = editor.dom.encode(text).replace(/\r\n/g, '\n');
      text = $_gbu5jgh8jc7tmc0i.convert(text, editor.settings.forced_root_block, editor.settings.forced_root_block_attrs);
      pasteHtml(text, false);
    }
    function getDataTransferItems(dataTransfer) {
      var items = {};
      if (dataTransfer) {
        if (dataTransfer.getData) {
          var legacyText = dataTransfer.getData('Text');
          if (legacyText && legacyText.length > 0) {
            if (legacyText.indexOf(mceInternalUrlPrefix) === -1) {
              items['text/plain'] = legacyText;
            }
          }
        }
        if (dataTransfer.types) {
          for (var i = 0; i < dataTransfer.types.length; i++) {
            var contentType = dataTransfer.types[i];
            try {
              items[contentType] = dataTransfer.getData(contentType);
            } catch (ex) {
              items[contentType] = '';
            }
          }
        }
      }
      return items;
    }
    function getClipboardContent(clipboardEvent) {
      var content = getDataTransferItems(clipboardEvent.clipboardData || editor.getDoc().dataTransfer);
      return $_3333bthhjc7tmc1e.isMsEdge() ? Tools.extend(content, { 'text/html': '' }) : content;
    }
    function hasHtmlOrText(content) {
      return hasContentType(content, 'text/html') || hasContentType(content, 'text/plain');
    }
    function getBase64FromUri(uri) {
      var idx;
      idx = uri.indexOf(',');
      if (idx !== -1) {
        return uri.substr(idx + 1);
      }
      return null;
    }
    function isValidDataUriImage(settings, imgElm) {
      return settings.images_dataimg_filter ? settings.images_dataimg_filter(imgElm) : true;
    }
    function extractFilename(str) {
      var m = str.match(/([\s\S]+?)\.(?:jpeg|jpg|png|gif)$/i);
      return m ? editor.dom.encode(m[1]) : null;
    }
    function pasteImage(rng, reader, blob) {
      if (rng) {
        editor.selection.setRng(rng);
        rng = null;
      }
      var dataUri = reader.result;
      var base64 = getBase64FromUri(dataUri);
      var id = uniqueId();
      var name = editor.settings.images_reuse_filename && blob.name ? extractFilename(blob.name) : id;
      var img = new Image();
      img.src = dataUri;
      if (isValidDataUriImage(editor.settings, img)) {
        var blobCache = editor.editorUpload.blobCache;
        var blobInfo, existingBlobInfo;
        existingBlobInfo = blobCache.findFirst(function (cachedBlobInfo) {
          return cachedBlobInfo.base64() === base64;
        });
        if (!existingBlobInfo) {
          blobInfo = blobCache.create(id, blob, base64, name);
          blobCache.add(blobInfo);
        } else {
          blobInfo = existingBlobInfo;
        }
        pasteHtml('<img src="' + blobInfo.blobUri() + '">', false);
      } else {
        pasteHtml('<img src="' + dataUri + '">', false);
      }
    }
    function pasteImageData(e, rng) {
      var dataTransfer = e.clipboardData || e.dataTransfer;
      function processItems(items) {
        var i, item, reader, hadImage = false;
        if (items) {
          for (i = 0; i < items.length; i++) {
            item = items[i];
            if (/^image\/(jpeg|png|gif|bmp)$/.test(item.type)) {
              var blob = item.getAsFile ? item.getAsFile() : item;
              reader = new window.FileReader();
              reader.onload = pasteImage.bind(null, rng, reader, blob);
              reader.readAsDataURL(blob);
              e.preventDefault();
              hadImage = true;
            }
          }
        }
        return hadImage;
      }
      if (editor.settings.paste_data_images && dataTransfer) {
        return processItems(dataTransfer.items) || processItems(dataTransfer.files);
      }
    }
    function isBrokenAndroidClipboardEvent(e) {
      var clipboardData = e.clipboardData;
      return navigator.userAgent.indexOf('Android') !== -1 && clipboardData && clipboardData.items && clipboardData.items.length === 0;
    }
    function hasContentType(clipboardContent, mimeType) {
      return mimeType in clipboardContent && clipboardContent[mimeType].length > 0;
    }
    function isKeyboardPasteEvent(e) {
      return VK.metaKeyPressed(e) && e.keyCode === 86 || e.shiftKey && e.keyCode === 45;
    }
    function registerEventHandlers() {
      editor.on('keydown', function (e) {
        function removePasteBinOnKeyUp(e) {
          if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
            pasteBin.remove();
          }
        }
        if (isKeyboardPasteEvent(e) && !e.isDefaultPrevented()) {
          keyboardPastePlainTextState = e.shiftKey && e.keyCode === 86;
          if (keyboardPastePlainTextState && Env.webkit && navigator.userAgent.indexOf('Version/') !== -1) {
            return;
          }
          e.stopImmediatePropagation();
          keyboardPasteTimeStamp = new Date().getTime();
          if (Env.ie && keyboardPastePlainTextState) {
            e.preventDefault();
            $_9mdcpbh0jc7tmbzn.firePaste(editor, true);
            return;
          }
          pasteBin.remove();
          pasteBin.create();
          editor.once('keyup', removePasteBinOnKeyUp);
          editor.once('paste', function () {
            editor.off('keyup', removePasteBinOnKeyUp);
          });
        }
      });
      function insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal) {
        var content, isPlainTextHtml;
        if (hasContentType(clipboardContent, 'text/html')) {
          content = clipboardContent['text/html'];
        } else {
          content = pasteBin.getHtml();
          internal = internal ? internal : $_cj2s30h7jc7tmc0g.isMarked(content);
          if (pasteBin.isDefaultContent(content)) {
            plainTextMode = true;
          }
        }
        content = $_3333bthhjc7tmc1e.trimHtml(content);
        pasteBin.remove();
        isPlainTextHtml = internal === false && $_gbu5jgh8jc7tmc0i.isPlainText(content);
        if (!content.length || isPlainTextHtml) {
          plainTextMode = true;
        }
        if (plainTextMode) {
          if (hasContentType(clipboardContent, 'text/plain') && isPlainTextHtml) {
            content = clipboardContent['text/plain'];
          } else {
            content = $_3333bthhjc7tmc1e.innerText(content);
          }
        }
        if (pasteBin.isDefaultContent(content)) {
          if (!isKeyBoardPaste) {
            editor.windowManager.alert('Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.');
          }
          return;
        }
        if (plainTextMode) {
          pasteText(content);
        } else {
          pasteHtml(content, internal);
        }
      }
      var getLastRng = function () {
        return pasteBin.getLastRng() || editor.selection.getRng();
      };
      editor.on('paste', function (e) {
        var clipboardTimer = new Date().getTime();
        var clipboardContent = getClipboardContent(e);
        var clipboardDelay = new Date().getTime() - clipboardTimer;
        var isKeyBoardPaste = new Date().getTime() - keyboardPasteTimeStamp - clipboardDelay < 1000;
        var plainTextMode = self.pasteFormat === 'text' || keyboardPastePlainTextState;
        var internal = hasContentType(clipboardContent, $_cj2s30h7jc7tmc0g.internalHtmlMime());
        keyboardPastePlainTextState = false;
        if (e.isDefaultPrevented() || isBrokenAndroidClipboardEvent(e)) {
          pasteBin.remove();
          return;
        }
        if (!hasHtmlOrText(clipboardContent) && pasteImageData(e, getLastRng())) {
          pasteBin.remove();
          return;
        }
        if (!isKeyBoardPaste) {
          e.preventDefault();
        }
        if (Env.ie && (!isKeyBoardPaste || e.ieFake) && !hasContentType(clipboardContent, 'text/html')) {
          pasteBin.create();
          editor.dom.bind(pasteBin.getEl(), 'paste', function (e) {
            e.stopPropagation();
          });
          editor.getDoc().execCommand('Paste', false, null);
          clipboardContent['text/html'] = pasteBin.getHtml();
        }
        if (hasContentType(clipboardContent, 'text/html')) {
          e.preventDefault();
          if (!internal) {
            internal = $_cj2s30h7jc7tmc0g.isMarked(clipboardContent['text/html']);
          }
          insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal);
        } else {
          Delay.setEditorTimeout(editor, function () {
            insertClipboardContent(clipboardContent, isKeyBoardPaste, plainTextMode, internal);
          }, 0);
        }
      });
    }
    self.pasteHtml = pasteHtml;
    self.pasteText = pasteText;
    self.pasteImageData = pasteImageData;
    self.getDataTransferItems = getDataTransferItems;
    self.hasHtmlOrText = hasHtmlOrText;
    self.hasContentType = hasContentType;
    editor.on('preInit', function () {
      registerEventHandlers();
      editor.parser.addNodeFilter('img', function (nodes, name, args) {
        function isPasteInsert(args) {
          return args.data && args.data.paste === true;
        }
        function remove(node) {
          if (!node.attr('data-mce-object') && src !== Env.transparentSrc) {
            node.remove();
          }
        }
        function isWebKitFakeUrl(src) {
          return src.indexOf('webkit-fake-url') === 0;
        }
        function isDataUri(src) {
          return src.indexOf('data:') === 0;
        }
        if (!editor.settings.paste_data_images && isPasteInsert(args)) {
          var i = nodes.length;
          while (i--) {
            var src = nodes[i].attributes.map.src;
            if (!src) {
              continue;
            }
            if (isWebKitFakeUrl(src)) {
              remove(nodes[i]);
            } else if (!editor.settings.allow_html_data_urls && isDataUri(src)) {
              remove(nodes[i]);
            }
          }
        }
      });
    });
  };

  var noop = function () {
  };
  var hasWorkingClipboardApi = function (clipboardData) {
    return Env.iOS === false && clipboardData !== undefined && typeof clipboardData.setData === 'function' && $_3333bthhjc7tmc1e.isMsEdge() !== true;
  };
  var setHtml5Clipboard = function (clipboardData, html, text) {
    if (hasWorkingClipboardApi(clipboardData)) {
      try {
        clipboardData.clearData();
        clipboardData.setData('text/html', html);
        clipboardData.setData('text/plain', text);
        clipboardData.setData($_cj2s30h7jc7tmc0g.internalHtmlMime(), html);
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  };
  var setClipboardData = function (evt, data, fallback, done) {
    if (setHtml5Clipboard(evt.clipboardData, data.html, data.text)) {
      evt.preventDefault();
      done();
    } else {
      fallback(data.html, done);
    }
  };
  var fallback = function (editor) {
    return function (html, done) {
      var markedHtml = $_cj2s30h7jc7tmc0g.mark(html);
      var outer = editor.dom.create('div', {
        contenteditable: 'false',
        'data-mce-bogus': 'all'
      });
      var inner = editor.dom.create('div', { contenteditable: 'true' }, markedHtml);
      editor.dom.setStyles(outer, {
        position: 'fixed',
        left: '-3000px',
        width: '1000px',
        overflow: 'hidden'
      });
      outer.appendChild(inner);
      editor.dom.add(editor.getBody(), outer);
      var range = editor.selection.getRng();
      inner.focus();
      var offscreenRange = editor.dom.createRng();
      offscreenRange.selectNodeContents(inner);
      editor.selection.setRng(offscreenRange);
      setTimeout(function () {
        outer.parentNode.removeChild(outer);
        editor.selection.setRng(range);
        done();
      }, 0);
    };
  };
  var getData = function (editor) {
    return {
      html: editor.selection.getContent({ contextual: true }),
      text: editor.selection.getContent({ format: 'text' })
    };
  };
  var cut = function (editor) {
    return function (evt) {
      if (editor.selection.isCollapsed() === false) {
        setClipboardData(evt, getData(editor), fallback(editor), function () {
          setTimeout(function () {
            editor.execCommand('Delete');
          }, 0);
        });
      }
    };
  };
  var copy = function (editor) {
    return function (evt) {
      if (editor.selection.isCollapsed() === false) {
        setClipboardData(evt, getData(editor), fallback(editor), noop);
      }
    };
  };
  var register$1 = function (editor) {
    editor.on('cut', cut(editor));
    editor.on('copy', copy(editor));
  };
  var $_55sezthjjc7tmc1k = { register: register$1 };

  var RangeUtils = tinymce.util.Tools.resolve('tinymce.dom.RangeUtils');

  var getCaretRangeFromEvent = function (editor, e) {
    return RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc());
  };
  var isPlainTextFileUrl = function (content) {
    var plainTextContent = content['text/plain'];
    return plainTextContent ? plainTextContent.indexOf('file://') === 0 : false;
  };
  var setFocusedRange = function (editor, rng) {
    editor.focus();
    editor.selection.setRng(rng);
  };
  var setup = function (editor, clipboard, draggingInternallyState) {
    if ($_fu2be1h1jc7tmbzr.shouldBlockDrop(editor)) {
      editor.on('dragend dragover draggesture dragdrop drop drag', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    }
    if (!$_fu2be1h1jc7tmbzr.shouldPasteDataImages(editor)) {
      editor.on('drop', function (e) {
        var dataTransfer = e.dataTransfer;
        if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
          e.preventDefault();
        }
      });
    }
    editor.on('drop', function (e) {
      var dropContent, rng;
      rng = getCaretRangeFromEvent(editor, e);
      if (e.isDefaultPrevented() || draggingInternallyState.get()) {
        return;
      }
      dropContent = clipboard.getDataTransferItems(e.dataTransfer);
      var internal = clipboard.hasContentType(dropContent, $_cj2s30h7jc7tmc0g.internalHtmlMime());
      if ((!clipboard.hasHtmlOrText(dropContent) || isPlainTextFileUrl(dropContent)) && clipboard.pasteImageData(e, rng)) {
        return;
      }
      if (rng && $_fu2be1h1jc7tmbzr.shouldFilterDrop(editor)) {
        var content = dropContent['mce-internal'] || dropContent['text/html'] || dropContent['text/plain'];
        if (content) {
          e.preventDefault();
          Delay.setEditorTimeout(editor, function () {
            editor.undoManager.transact(function () {
              if (dropContent['mce-internal']) {
                editor.execCommand('Delete');
              }
              setFocusedRange(editor, rng);
              content = $_3333bthhjc7tmc1e.trimHtml(content);
              if (!dropContent['text/html']) {
                clipboard.pasteText(content);
              } else {
                clipboard.pasteHtml(content, internal);
              }
            });
          });
        }
      }
    });
    editor.on('dragstart', function (e) {
      draggingInternallyState.set(true);
    });
    editor.on('dragover dragend', function (e) {
      if ($_fu2be1h1jc7tmbzr.shouldPasteDataImages(editor) && draggingInternallyState.get() === false) {
        e.preventDefault();
        setFocusedRange(editor, getCaretRangeFromEvent(editor, e));
      }
      if (e.type === 'dragend') {
        draggingInternallyState.set(false);
      }
    });
  };
  var $_5pbnahkjc7tmc1n = { setup: setup };

  var setup$1 = function (editor) {
    var plugin = editor.plugins.paste;
    var preProcess = $_fu2be1h1jc7tmbzr.getPreProcess(editor);
    if (preProcess) {
      editor.on('PastePreProcess', function (e) {
        preProcess.call(plugin, plugin, e);
      });
    }
    var postProcess = $_fu2be1h1jc7tmbzr.getPostProcess(editor);
    if (postProcess) {
      editor.on('PastePostProcess', function (e) {
        postProcess.call(plugin, plugin, e);
      });
    }
  };
  var $_cdb9h7hmjc7tmc1v = { setup: setup$1 };

  function addPreProcessFilter(editor, filterFunc) {
    editor.on('PastePreProcess', function (e) {
      e.content = filterFunc(editor, e.content, e.internal, e.wordContent);
    });
  }
  function addPostProcessFilter(editor, filterFunc) {
    editor.on('PastePostProcess', function (e) {
      filterFunc(editor, e.node);
    });
  }
  function removeExplorerBrElementsAfterBlocks(editor, html) {
    if (!$_bb52yehcjc7tmc0z.isWordContent(html)) {
      return html;
    }
    var blockElements = [];
    Tools.each(editor.schema.getBlockElements(), function (block, blockName) {
      blockElements.push(blockName);
    });
    var explorerBlocksRegExp = new RegExp('(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(' + blockElements.join('|') + ')[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*', 'g');
    html = $_3333bthhjc7tmc1e.filter(html, [[
        explorerBlocksRegExp,
        '$1'
      ]]);
    html = $_3333bthhjc7tmc1e.filter(html, [
      [
        /<br><br>/g,
        '<BR><BR>'
      ],
      [
        /<br>/g,
        ' '
      ],
      [
        /<BR><BR>/g,
        '<br>'
      ]
    ]);
    return html;
  }
  function removeWebKitStyles(editor, content, internal, isWordHtml) {
    if (isWordHtml || internal) {
      return content;
    }
    var webKitStyles = $_fu2be1h1jc7tmbzr.getWebkitStyles(editor);
    if ($_fu2be1h1jc7tmbzr.shouldRemoveWebKitStyles(editor) === false || webKitStyles === 'all') {
      return content;
    }
    if (webKitStyles) {
      webKitStyles = webKitStyles.split(/[, ]/);
    }
    if (webKitStyles) {
      var dom = editor.dom, node = editor.selection.getNode();
      content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, function (all, before, value, after) {
        var inputStyles = dom.parseStyle(dom.decode(value), 'span');
        var outputStyles = {};
        if (webKitStyles === 'none') {
          return before + after;
        }
        for (var i = 0; i < webKitStyles.length; i++) {
          var inputValue = inputStyles[webKitStyles[i]], currentValue = dom.getStyle(node, webKitStyles[i], true);
          if (/color/.test(webKitStyles[i])) {
            inputValue = dom.toHex(inputValue);
            currentValue = dom.toHex(currentValue);
          }
          if (currentValue !== inputValue) {
            outputStyles[webKitStyles[i]] = inputValue;
          }
        }
        outputStyles = dom.serializeStyle(outputStyles, 'span');
        if (outputStyles) {
          return before + ' style="' + outputStyles + '"' + after;
        }
        return before + after;
      });
    } else {
      content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, '$1$3');
    }
    content = content.replace(/(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi, function (all, before, value, after) {
      return before + ' style="' + value + '"' + after;
    });
    return content;
  }
  function removeUnderlineAndFontInAnchor(editor, root) {
    editor.$('a', root).find('font,u').each(function (i, node) {
      editor.dom.remove(node, true);
    });
  }
  var setup$2 = function (editor) {
    if (Env.webkit) {
      addPreProcessFilter(editor, removeWebKitStyles);
    }
    if (Env.ie) {
      addPreProcessFilter(editor, removeExplorerBrElementsAfterBlocks);
      addPostProcessFilter(editor, removeUnderlineAndFontInAnchor);
    }
  };
  var $_aebsuzhnjc7tmc20 = { setup: setup$2 };

  var noop$1 = function () {
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
  var never = constant(false);
  var always = constant(true);
  var $_aibi0zhpjc7tmc28 = {
    noop: noop$1,
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
    never: never,
    always: always
  };

  var stateChange = function (editor, clipboard, e) {
    var ctrl = e.control;
    ctrl.active(clipboard.pasteFormat === 'text');
    editor.on('PastePlainTextToggle', function (e) {
      ctrl.active(e.state);
    });
  };
  var register$2 = function (editor, clipboard) {
    var postRender = $_aibi0zhpjc7tmc28.curry(stateChange, editor, clipboard);
    editor.addButton('pastetext', {
      active: false,
      icon: 'pastetext',
      tooltip: 'Paste as text',
      cmd: 'mceTogglePlainTextPaste',
      onPostRender: postRender
    });
    editor.addMenuItem('pastetext', {
      text: 'Paste as text',
      selectable: true,
      active: clipboard.pasteFormat,
      cmd: 'mceTogglePlainTextPaste',
      onPostRender: postRender
    });
  };
  var $_g7y7hqhojc7tmc25 = { register: register$2 };

  var userIsInformedState = Cell(false);
  PluginManager.add('paste', function (editor) {
    if ($_fyz2yggwjc7tmbzh.hasProPlugin(editor) === false) {
      var clipboard = new Clipboard(editor);
      var quirks = $_aebsuzhnjc7tmc20.setup(editor);
      var draggingInternallyState = Cell(false);
      $_g7y7hqhojc7tmc25.register(editor, clipboard);
      $_kiqizgyjc7tmbzj.register(editor, clipboard, userIsInformedState);
      $_cdb9h7hmjc7tmc1v.setup(editor);
      $_55sezthjjc7tmc1k.register(editor);
      $_5pbnahkjc7tmc1n.setup(editor, clipboard, draggingInternallyState);
      return $_dnlkq9gxjc7tmbzi.get(clipboard, quirks);
    }
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
