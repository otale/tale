require('../css/index.css')
window.jQuery = window.$ = require('jquery')
window.hljs = require('./highlight.pack.js')
require('./jquery.unveil.js')

var searchTpl = require('raw!./searchTpl.html')

// pick from underscore
var debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

var timeSince = function(date) {
  var seconds = Math.floor((new Date() - date) / 1000)
  var interval = Math.floor(seconds / 31536000)
  if (interval > 1) return interval + timeSinceLang.year

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return interval + timeSinceLang.month

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return interval + timeSinceLang.day

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return interval + timeSinceLang.hour

  interval = Math.floor(seconds / 60)
  if (interval > 1) return interval + timeSinceLang.minute

  return Math.floor(seconds) + timeSinceLang.second
}

var initSearch = function() {
  var searchDom = $('#search')
  if (!searchDom.length) return
  var searchWorker = new Worker(root + '/bundle/searchWorker.js')
  var oriHtml = $('.article-list').html()
  var workerStarted = false
  var tpl = function(keywords, title, preview, link, cover) {
    for (var i = 0; i < keywords.length; i++) {
      var keyword = keywords[i]
      var wrap = '<span class="searched">' + keyword + '</span>'
      var reg = new RegExp(keyword, 'ig')
      title = title.replace(reg, wrap)
      preview = preview.replace(reg, wrap)
    }
    return searchTpl
    .replace('{{title}}', title)
    .replace('{{link}}', link)
    .replace('{{preview}}', preview)
  }
  searchWorker.onmessage = function(event) {
    var results = event.data.results
    var keywords = event.data.keywords
    if (results.length) {
      var retHtml = ''
      for (var i = 0; i < results.length; i++) {
        var item = results[i]
        var itemHtml = tpl(keywords, item.title, item.preview, item.link, item.cover)
        retHtml += itemHtml
      }
      $('.page-nav').hide()
      $('.article-list').html(retHtml)
    } else {
      var keyword = event.data.keyword
      if (keyword) {
        $('.page-nav').hide()
        $('.article-list').html('<div class="empty">未搜索到 "<span>' + keyword + '</span>"</div>')
      } else {
        $('.page-nav').show()
        $('.article-list').html(oriHtml)
      }
    }
  }
  searchDom.on('input', debounce(function() {
    var keyword = $(this).val().trim()
    if (keyword) {
      searchWorker.postMessage({
        search: 'search',
        keyword: keyword
      })
    } else {
      $('.page-nav').show()
      $('.article-list').html(oriHtml)
    }
  }, 500))
  searchDom.on('focus', function() {
    if (!workerStarted) {
      searchWorker.postMessage({
        action: 'start',
        root: root
      })
      workerStarted = true
    }
  })
}

$(function() {
  // render date
  $('.date').each(function(idx, item) {
    var $date = $(item)
    var timeStr = $date.data('time')
    if (timeStr) {
      var unixTime = Number(timeStr) * 1000
      var date = new Date(unixTime)
      $date.prop('title', date).text(timeSince(date))
    }
  })
  // render highlight
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block)
  })
  // append image description
  $('img').each(function(idx, item) {
    $item = $(item)
    if ($item.attr('data-src')) {
      $item.wrap('<a href="' + $item.attr('data-src') + '" target="_blank"></a>')
      var imageAlt = $item.prop('alt')
      if ($.trim(imageAlt)) $item.parent('a').after('<div class="image-alt">' + imageAlt + '</div>')
    }
  })
  // lazy load images
  if ($('img').unveil) {
    $('img').unveil(200, function() {
      $(this).load(function() {
        this.style.opacity = 1
      })
    })
  }
  // init search
  initSearch()
})
