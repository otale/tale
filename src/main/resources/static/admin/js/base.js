/**
 *  Tale全局函数对象   var tale = new $.tale();
 */
$.extend({
    tale: function () {
    },
    constant: function () { //常量池
        return {
            ///-------文件常量----------
            MAX_FILES: 10,//一次队列最大文件数
        }
    }

});

/**
 * 成功弹框
 * @param options
 */
$.tale.prototype.alertOk = function (options) {
    options = options.length ? {text: options} : (options || {});
    options.title = options.title || '操作成功';
    options.text = options.text;
    options.showCancelButton = false;
    options.showCloseButton = false;
    options.type = 'success';
    this.alertBox(options);
};

/**
 * 弹出成功，并在500毫秒后刷新页面
 * @param text
 */
$.tale.prototype.alertOkAndReload = function (text) {
    this.alertOk({
        text: text, then: function () {
            setTimeout(function () {
                window.location.reload();
            }, 700);
        }
    });
};

/**
 * 警告弹框
 * @param options
 */
$.tale.prototype.alertWarn = function (options) {
    options = options.length ? {text: options} : (options || {});
    options.title = options.title || '警告信息';
    options.text = options.text;
    options.timer = 3000;
    options.type = 'warning';
    this.alertBox(options);
};

/**
 * 询问确认弹框，这里会传入then函数进来
 * @param options
 */
$.tale.prototype.alertConfirm = function (options) {
    options = options || {};
    options.title = options.title || '确定要删除吗？';
    options.text = options.text;
    options.showCancelButton = true;
    options.type = 'question';
    this.alertBox(options);
};

/**
 * 错误提示
 * @param options
 */
$.tale.prototype.alertError = function (options) {
    options = options.length ? {text: options} : (options || {});
    options.title = options.title || '错误信息';
    options.text = options.text;
    options.type = 'error';
    this.alertBox(options);
};

/**
 * 公共弹框
 * @param options
 */
$.tale.prototype.alertBox = function (options) {
    swal({
        title: options.title,
        text: options.text,
        type: options.type,
        timer: options.timer || 9999,
        showCloseButton: options.showCloseButton,
        showCancelButton: options.showCancelButton,
        showLoaderOnConfirm: options.showLoaderOnConfirm || false,
        confirmButtonColor: options.confirmButtonColor || '#3085d6',
        cancelButtonColor: options.cancelButtonColor || '#d33',
        confirmButtonText: options.confirmButtonText || '确定',
        cancelButtonText: options.cancelButtonText || '取消'
    }).then(function (e) {
        options.then && options.then(e);
    }).catch(swal.noop);
};

$.tale.prototype.get = function (options) {
    axios.get(options.url).then(function (response) {
        options.success(response.data)
    }).catch(function (error) {
        options.error(error)
    });
};

window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': document.head.querySelector("[name=csrf_token]").content,
    'X-Requested-With': 'XMLHttpRequest'
};

/**
 * 全局post函数
 *
 * @param options   参数
 */
$.tale.prototype.post = function (options) {
    var self = this;
    axios.post(options.url, options.data || {}).then(function (response) {
        self.hideLoading();
        options.success && options.success(response.data);
    }).catch(function (error) {
        options.error(error)
    });
};

/**
 * 显示动画
 */
$.tale.prototype.showLoading = function () {
    if ($('#tale-loading').length === 0) {
        $('body').append('<div id="tale-loading"></div>');
    }
    $('#tale-loading').show();
};

/**
 * 隐藏动画
 */
$.tale.prototype.hideLoading = function () {
    $('#tale-loading') && $('#tale-loading').hide();
};

$.tale.prototype.copy = function(src) {
    var dst = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dst[prop] = src[prop];
        }
    }
    return dst;
};

/**
 * Vue 全局
 */
Vue.filter('formatUnix', function (value) {
    if (value) {
        return moment.unix(value).format('YYYY/MM/DD HH:mm:ss')
    }
    return ''
});
