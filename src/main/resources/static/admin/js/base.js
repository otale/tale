var _swal = {
    alert_del: function (data) {
        swal({
            title: data.title || '警告信息',
            text: data.text || "确定删除吗？",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(function () {
            $.post(data.url, data.parame, function (result) {
                if (result && result.success) {
                    swal('提示信息', '删除成功', 'success');
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    swal("提示消息", result.msg, 'error');
                }
            });
        }).catch(swal.noop);
    }
};

/**
 * Tale全局函数对象
 * @type {{}}
 */
var tale = {};

/**
 * 弹出成功对话框
 * @param options
 */
tale.alertOk = function (options) {
    options = options || {};
    options.title = options.title || '操作成功';
    options.text = options.text;
    options.showCancelButton = false;
    options.showCloseButton = false;
    options.type = 'success';
    this.alertBox(options);
};

/**
 * 弹出错误对话框
 * @param options
 */
tale.alertError = function (options) {
    options = options || {};
    options.title = options.title || '错误信息';
    options.text = options.text;
    options.type = 'error';
    this.alertBox(options);
};

/**
 * 弹出确认对话框
 * @param options
 */
tale.alertQA = function (options) {
    options = options || {};
    options.title = options.title || '确定要删除吗？';
    options.text = options.text;
    options.showCancelButton = true;
    options.type = 'question';
    this.alertBox(options);
};

/**
 * 弹出警告对话框
 * @param options
 */
tale.alertWarn = function (options) {
    options = options || {};
    options.title = options.title || '警告信息';
    options.text = options.text;
    options.type = 'warning';
    this.alertBox(options);
};
/**
 * 公共对话框
 * @param options
 */
tale.alertBox = function (options) {
    swal({
        title: options.title,
        text: options.text,
        type: options.type,
        showCloseButton: options.showCloseButton,
        showCancelButton: options.showCancelButton,
        showLoaderOnConfirm: options.showLoaderOnConfirm || false,
        confirmButtonColor: options.confirmButtonColor || '#3085d6',
        cancelButtonColor: options.cancelButtonColor || '#d33',
        confirmButtonText: options.confirmButtonText || '确定',
        cancelButtonText: options.cancelButtonText || '取消'
    }).then(function (e) {
        options.then(e);
    }).catch(swal.noop);
};

/**
 * 显示loading动画
 */
tale.showLoading = function () {
    if($('#tale-loading').length == 0){
        $('body').append('<div id="tale-loading"></div>');
    }
    $('#tale-loading').show();
};
/**
 * 隐藏loading动画
 */
tale.hideLoading = function () {
    $('#tale-loading').hide();
};