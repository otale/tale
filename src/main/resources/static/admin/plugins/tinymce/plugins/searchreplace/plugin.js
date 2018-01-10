(function () {
var searchreplace = (function () {
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

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  function isContentEditableFalse(node) {
    return node && node.nodeType === 1 && node.contentEditable === 'false';
  }
  function findAndReplaceDOMText(regex, node, replacementNode, captureGroup, schema) {
    var m, matches = [], text, count = 0, doc;
    var blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap;
    doc = node.ownerDocument;
    blockElementsMap = schema.getBlockElements();
    hiddenTextElementsMap = schema.getWhiteSpaceElements();
    shortEndedElementsMap = schema.getShortEndedElements();
    function getMatchIndexes(m, captureGroup) {
      captureGroup = captureGroup || 0;
      if (!m[0]) {
        throw 'findAndReplaceDOMText cannot handle zero-length matches';
      }
      var index = m.index;
      if (captureGroup > 0) {
        var cg = m[captureGroup];
        if (!cg) {
          throw 'Invalid capture group';
        }
        index += m[0].indexOf(cg);
        m[0] = cg;
      }
      return [
        index,
        index + m[0].length,
        [m[0]]
      ];
    }
    function getText(node) {
      var txt;
      if (node.nodeType === 3) {
        return node.data;
      }
      if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
        return '';
      }
      txt = '';
      if (isContentEditableFalse(node)) {
        return '\n';
      }
      if (blockElementsMap[node.nodeName] || shortEndedElementsMap[node.nodeName]) {
        txt += '\n';
      }
      if (node = node.firstChild) {
        do {
          txt += getText(node);
        } while (node = node.nextSibling);
      }
      return txt;
    }
    function stepThroughMatches(node, matches, replaceFn) {
      var startNode, endNode, startNodeIndex, endNodeIndex, innerNodes = [], atIndex = 0, curNode = node, matchLocation = matches.shift(), matchIndex = 0;
      out:
        while (true) {
          if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
            atIndex++;
          }
          if (curNode.nodeType === 3) {
            if (!endNode && curNode.length + atIndex >= matchLocation[1]) {
              endNode = curNode;
              endNodeIndex = matchLocation[1] - atIndex;
            } else if (startNode) {
              innerNodes.push(curNode);
            }
            if (!startNode && curNode.length + atIndex > matchLocation[0]) {
              startNode = curNode;
              startNodeIndex = matchLocation[0] - atIndex;
            }
            atIndex += curNode.length;
          }
          if (startNode && endNode) {
            curNode = replaceFn({
              startNode: startNode,
              startNodeIndex: startNodeIndex,
              endNode: endNode,
              endNodeIndex: endNodeIndex,
              innerNodes: innerNodes,
              match: matchLocation[2],
              matchIndex: matchIndex
            });
            atIndex -= endNode.length - endNodeIndex;
            startNode = null;
            endNode = null;
            innerNodes = [];
            matchLocation = matches.shift();
            matchIndex++;
            if (!matchLocation) {
              break;
            }
          } else if ((!hiddenTextElementsMap[curNode.nodeName] || blockElementsMap[curNode.nodeName]) && curNode.firstChild) {
            if (!isContentEditableFalse(curNode)) {
              curNode = curNode.firstChild;
              continue;
            }
          } else if (curNode.nextSibling) {
            curNode = curNode.nextSibling;
            continue;
          }
          while (true) {
            if (curNode.nextSibling) {
              curNode = curNode.nextSibling;
              break;
            } else if (curNode.parentNode !== node) {
              curNode = curNode.parentNode;
            } else {
              break out;
            }
          }
        }
    }
    function genReplacer(nodeName) {
      var makeReplacementNode;
      if (typeof nodeName !== 'function') {
        var stencilNode = nodeName.nodeType ? nodeName : doc.createElement(nodeName);
        makeReplacementNode = function (fill, matchIndex) {
          var clone = stencilNode.cloneNode(false);
          clone.setAttribute('data-mce-index', matchIndex);
          if (fill) {
            clone.appendChild(doc.createTextNode(fill));
          }
          return clone;
        };
      } else {
        makeReplacementNode = nodeName;
      }
      return function (range) {
        var before, after, parentNode, startNode = range.startNode, endNode = range.endNode, matchIndex = range.matchIndex;
        if (startNode === endNode) {
          var node = startNode;
          parentNode = node.parentNode;
          if (range.startNodeIndex > 0) {
            before = doc.createTextNode(node.data.substring(0, range.startNodeIndex));
            parentNode.insertBefore(before, node);
          }
          var el = makeReplacementNode(range.match[0], matchIndex);
          parentNode.insertBefore(el, node);
          if (range.endNodeIndex < node.length) {
            after = doc.createTextNode(node.data.substring(range.endNodeIndex));
            parentNode.insertBefore(after, node);
          }
          node.parentNode.removeChild(node);
          return el;
        }
        before = doc.createTextNode(startNode.data.substring(0, range.startNodeIndex));
        after = doc.createTextNode(endNode.data.substring(range.endNodeIndex));
        var elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex);
        var innerEls = [];
        for (var i = 0, l = range.innerNodes.length; i < l; ++i) {
          var innerNode = range.innerNodes[i];
          var innerEl = makeReplacementNode(innerNode.data, matchIndex);
          innerNode.parentNode.replaceChild(innerEl, innerNode);
          innerEls.push(innerEl);
        }
        var elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex);
        parentNode = startNode.parentNode;
        parentNode.insertBefore(before, startNode);
        parentNode.insertBefore(elA, startNode);
        parentNode.removeChild(startNode);
        parentNode = endNode.parentNode;
        parentNode.insertBefore(elB, endNode);
        parentNode.insertBefore(after, endNode);
        parentNode.removeChild(endNode);
        return elB;
      };
    }
    text = getText(node);
    if (!text) {
      return;
    }
    if (regex.global) {
      while (m = regex.exec(text)) {
        matches.push(getMatchIndexes(m, captureGroup));
      }
    } else {
      m = text.match(regex);
      matches.push(getMatchIndexes(m, captureGroup));
    }
    if (matches.length) {
      count = matches.length;
      stepThroughMatches(node, matches, genReplacer(replacementNode));
    }
    return count;
  }
  var $_6esu1mihjc7tmc7t = { findAndReplaceDOMText: findAndReplaceDOMText };

  var getElmIndex = function (elm) {
    var value = elm.getAttribute('data-mce-index');
    if (typeof value === 'number') {
      return '' + value;
    }
    return value;
  };
  var markAllMatches = function (editor, currentIndexState, regex) {
    var node, marker;
    marker = editor.dom.create('span', { 'data-mce-bogus': 1 });
    marker.className = 'mce-match-marker';
    node = editor.getBody();
    done(editor, currentIndexState, false);
    return $_6esu1mihjc7tmc7t.findAndReplaceDOMText(regex, node, marker, false, editor.schema);
  };
  var unwrap = function (node) {
    var parentNode = node.parentNode;
    if (node.firstChild) {
      parentNode.insertBefore(node.firstChild, node);
    }
    node.parentNode.removeChild(node);
  };
  var findSpansByIndex = function (editor, index) {
    var nodes, spans = [];
    nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
    if (nodes.length) {
      for (var i = 0; i < nodes.length; i++) {
        var nodeIndex = getElmIndex(nodes[i]);
        if (nodeIndex === null || !nodeIndex.length) {
          continue;
        }
        if (nodeIndex === index.toString()) {
          spans.push(nodes[i]);
        }
      }
    }
    return spans;
  };
  var moveSelection = function (editor, currentIndexState, forward) {
    var testIndex = currentIndexState.get(), dom = editor.dom;
    forward = forward !== false;
    if (forward) {
      testIndex++;
    } else {
      testIndex--;
    }
    dom.removeClass(findSpansByIndex(editor, currentIndexState.get()), 'mce-match-marker-selected');
    var spans = findSpansByIndex(editor, testIndex);
    if (spans.length) {
      dom.addClass(findSpansByIndex(editor, testIndex), 'mce-match-marker-selected');
      editor.selection.scrollIntoView(spans[0]);
      return testIndex;
    }
    return -1;
  };
  var removeNode = function (dom, node) {
    var parent = node.parentNode;
    dom.remove(node);
    if (dom.isEmpty(parent)) {
      dom.remove(parent);
    }
  };
  var find = function (editor, currentIndexState, text, matchCase, wholeWord) {
    text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    text = text.replace(/\s/g, '\\s');
    text = wholeWord ? '\\b' + text + '\\b' : text;
    var count = markAllMatches(editor, currentIndexState, new RegExp(text, matchCase ? 'g' : 'gi'));
    if (count) {
      currentIndexState.set(-1);
      currentIndexState.set(moveSelection(editor, currentIndexState, true));
    }
    return count;
  };
  var next = function (editor, currentIndexState) {
    var index = moveSelection(editor, currentIndexState, true);
    if (index !== -1) {
      currentIndexState.set(index);
    }
  };
  var prev = function (editor, currentIndexState) {
    var index = moveSelection(editor, currentIndexState, false);
    if (index !== -1) {
      currentIndexState.set(index);
    }
  };
  var isMatchSpan = function (node) {
    var matchIndex = getElmIndex(node);
    return matchIndex !== null && matchIndex.length > 0;
  };
  var replace = function (editor, currentIndexState, text, forward, all) {
    var i, nodes, node, matchIndex, currentMatchIndex, nextIndex = currentIndexState.get(), hasMore;
    forward = forward !== false;
    node = editor.getBody();
    nodes = Tools.grep(Tools.toArray(node.getElementsByTagName('span')), isMatchSpan);
    for (i = 0; i < nodes.length; i++) {
      var nodeIndex = getElmIndex(nodes[i]);
      matchIndex = currentMatchIndex = parseInt(nodeIndex, 10);
      if (all || matchIndex === currentIndexState.get()) {
        if (text.length) {
          nodes[i].firstChild.nodeValue = text;
          unwrap(nodes[i]);
        } else {
          removeNode(editor.dom, nodes[i]);
        }
        while (nodes[++i]) {
          matchIndex = parseInt(getElmIndex(nodes[i]), 10);
          if (matchIndex === currentMatchIndex) {
            removeNode(editor.dom, nodes[i]);
          } else {
            i--;
            break;
          }
        }
        if (forward) {
          nextIndex--;
        }
      } else if (currentMatchIndex > currentIndexState.get()) {
        nodes[i].setAttribute('data-mce-index', currentMatchIndex - 1);
      }
    }
    currentIndexState.set(nextIndex);
    if (forward) {
      hasMore = hasNext(editor, currentIndexState);
      next(editor, currentIndexState);
    } else {
      hasMore = hasPrev(editor, currentIndexState);
      prev(editor, currentIndexState);
    }
    return !all && hasMore;
  };
  var done = function (editor, currentIndexState, keepEditorSelection) {
    var i, nodes, startContainer, endContainer;
    nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
    for (i = 0; i < nodes.length; i++) {
      var nodeIndex = getElmIndex(nodes[i]);
      if (nodeIndex !== null && nodeIndex.length) {
        if (nodeIndex === currentIndexState.get().toString()) {
          if (!startContainer) {
            startContainer = nodes[i].firstChild;
          }
          endContainer = nodes[i].firstChild;
        }
        unwrap(nodes[i]);
      }
    }
    if (startContainer && endContainer) {
      var rng = editor.dom.createRng();
      rng.setStart(startContainer, 0);
      rng.setEnd(endContainer, endContainer.data.length);
      if (keepEditorSelection !== false) {
        editor.selection.setRng(rng);
      }
      return rng;
    }
  };
  var hasNext = function (editor, currentIndexState) {
    return findSpansByIndex(editor, currentIndexState.get() + 1).length > 0;
  };
  var hasPrev = function (editor, currentIndexState) {
    return findSpansByIndex(editor, currentIndexState.get() - 1).length > 0;
  };
  var $_15cfybifjc7tmc7k = {
    done: done,
    find: find,
    next: next,
    prev: prev,
    replace: replace,
    hasNext: hasNext,
    hasPrev: hasPrev
  };

  var get = function (editor, currentIndexState) {
    var done = function (keepEditorSelection) {
      return $_15cfybifjc7tmc7k.done(editor, currentIndexState, keepEditorSelection);
    };
    var find = function (text, matchCase, wholeWord) {
      return $_15cfybifjc7tmc7k.find(editor, currentIndexState, text, matchCase, wholeWord);
    };
    var next = function () {
      return $_15cfybifjc7tmc7k.next(editor, currentIndexState);
    };
    var prev = function () {
      return $_15cfybifjc7tmc7k.prev(editor, currentIndexState);
    };
    var replace = function (text, forward, all) {
      return $_15cfybifjc7tmc7k.replace(editor, currentIndexState, text, forward, all);
    };
    return {
      done: done,
      find: find,
      next: next,
      prev: prev,
      replace: replace
    };
  };
  var $_xrhv0iejc7tmc7g = { get: get };

  var open = function (editor, currentIndexState) {
    var last = {}, selectedText;
    editor.undoManager.add();
    selectedText = Tools.trim(editor.selection.getContent({ format: 'text' }));
    function updateButtonStates() {
      win.statusbar.find('#next').disabled($_15cfybifjc7tmc7k.hasNext(editor, currentIndexState) === false);
      win.statusbar.find('#prev').disabled($_15cfybifjc7tmc7k.hasPrev(editor, currentIndexState) === false);
    }
    function notFoundAlert() {
      editor.windowManager.alert('Could not find the specified string.', function () {
        win.find('#find')[0].focus();
      });
    }
    var win = editor.windowManager.open({
      layout: 'flex',
      pack: 'center',
      align: 'center',
      onClose: function () {
        editor.focus();
        $_15cfybifjc7tmc7k.done(editor, currentIndexState);
        editor.undoManager.add();
      },
      onSubmit: function (e) {
        var count, caseState, text, wholeWord;
        e.preventDefault();
        caseState = win.find('#case').checked();
        wholeWord = win.find('#words').checked();
        text = win.find('#find').value();
        if (!text.length) {
          $_15cfybifjc7tmc7k.done(editor, currentIndexState, false);
          win.statusbar.items().slice(1).disabled(true);
          return;
        }
        if (last.text === text && last.caseState === caseState && last.wholeWord === wholeWord) {
          if (!$_15cfybifjc7tmc7k.hasNext(editor, currentIndexState)) {
            notFoundAlert();
            return;
          }
          $_15cfybifjc7tmc7k.next(editor, currentIndexState);
          updateButtonStates();
          return;
        }
        count = $_15cfybifjc7tmc7k.find(editor, currentIndexState, text, caseState, wholeWord);
        if (!count) {
          notFoundAlert();
        }
        win.statusbar.items().slice(1).disabled(count === 0);
        updateButtonStates();
        last = {
          text: text,
          caseState: caseState,
          wholeWord: wholeWord
        };
      },
      buttons: [
        {
          text: 'Find',
          subtype: 'primary',
          onclick: function () {
            win.submit();
          }
        },
        {
          text: 'Replace',
          disabled: true,
          onclick: function () {
            if (!$_15cfybifjc7tmc7k.replace(editor, currentIndexState, win.find('#replace').value())) {
              win.statusbar.items().slice(1).disabled(true);
              currentIndexState.set(-1);
              last = {};
            }
          }
        },
        {
          text: 'Replace all',
          disabled: true,
          onclick: function () {
            $_15cfybifjc7tmc7k.replace(editor, currentIndexState, win.find('#replace').value(), true, true);
            win.statusbar.items().slice(1).disabled(true);
            last = {};
          }
        },
        {
          type: 'spacer',
          flex: 1
        },
        {
          text: 'Prev',
          name: 'prev',
          disabled: true,
          onclick: function () {
            $_15cfybifjc7tmc7k.prev(editor, currentIndexState);
            updateButtonStates();
          }
        },
        {
          text: 'Next',
          name: 'next',
          disabled: true,
          onclick: function () {
            $_15cfybifjc7tmc7k.next(editor, currentIndexState);
            updateButtonStates();
          }
        }
      ],
      title: 'Find and replace',
      items: {
        type: 'form',
        padding: 20,
        labelGap: 30,
        spacing: 10,
        items: [
          {
            type: 'textbox',
            name: 'find',
            size: 40,
            label: 'Find',
            value: selectedText
          },
          {
            type: 'textbox',
            name: 'replace',
            size: 40,
            label: 'Replace with'
          },
          {
            type: 'checkbox',
            name: 'case',
            text: 'Match case',
            label: ' '
          },
          {
            type: 'checkbox',
            name: 'words',
            text: 'Whole words',
            label: ' '
          }
        ]
      }
    });
  };
  var $_8zs7fgijjc7tmc7z = { open: open };

  var register = function (editor, currentIndexState) {
    editor.addCommand('SearchReplace', function () {
      $_8zs7fgijjc7tmc7z.open(editor, currentIndexState);
    });
  };
  var $_5iwf80iijc7tmc7x = { register: register };

  var showDialog = function (editor, currentIndexState) {
    return function () {
      $_8zs7fgijjc7tmc7z.open(editor, currentIndexState);
    };
  };
  var register$1 = function (editor, currentIndexState) {
    editor.addMenuItem('searchreplace', {
      text: 'Find and replace',
      shortcut: 'Meta+F',
      onclick: showDialog(editor, currentIndexState),
      separator: 'before',
      context: 'edit'
    });
    editor.addButton('searchreplace', {
      tooltip: 'Find and replace',
      onclick: showDialog(editor, currentIndexState)
    });
    editor.shortcuts.add('Meta+F', '', showDialog(editor, currentIndexState));
  };
  var $_ebxpyiikjc7tmc87 = { register: register$1 };

  PluginManager.add('searchreplace', function (editor) {
    var currentIndexState = Cell(-1);
    $_5iwf80iijc7tmc7x.register(editor, currentIndexState);
    $_ebxpyiikjc7tmc87.register(editor, currentIndexState);
    return $_xrhv0iejc7tmc7g.get(editor, currentIndexState);
  });
  var Plugin = function () {
  };

  return Plugin;

}());
})()
