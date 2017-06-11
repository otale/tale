var mditor, htmlEditor;
var tale = new $.tale();
var attach_url = $('#attach_url').val();
// 每60秒自动保存一次草稿
var refreshIntervalId = setInterval("autoSave()", 60 * 1000);



/*
 * 自动保存为草稿
 * */
function  autoSave() {
    var content = $('#fmt_type').val() == 'markdown' ? mditor.value : htmlEditor.summernote('code');
    var title = $('#articleForm input[name=title]').val();
    if (title != '' && content != '') {
        $('#content-editor').val(content);
        $("#articleForm #status").val('draft');
        $("#articleForm #categories").val($('#multiple-sel').val());
        var params = $("#articleForm").serialize();
        var url = $('#articleForm #cid').val() != '' ? '/admin/article/modify' : '/admin/article/publish';
        tale.post({
            url: url,
            data: params,
            success: function (result) {
                if (result && result.success) {
                    $('#articleForm #cid').val(result.payload);
                } else {
                    tale.alertError(result.msg || '保存文章失败');
                }
            }
        });
    }
}

/**
 * 保存文章
 * @param status
 */
function subArticle(status) {
    var content = $('#fmt_type').val() == 'markdown' ? mditor.value : htmlEditor.summernote('code');
    var title = $('#articleForm input[name=title]').val();
    if (title == '') {
        tale.alertWarn('请输入文章标题');
        return;
    }
    if (content == '') {
        tale.alertWarn('请输入文章内容');
        return;
    }
    clearInterval(refreshIntervalId);
    $('#content-editor').val(content);
    $("#articleForm #status").val(status);
    $("#articleForm #categories").val($('#multiple-sel').val());
    var params = $("#articleForm").serialize();
    var url = $('#articleForm #cid').val() != '' ? '/admin/article/modify' : '/admin/article/publish';
    tale.post({
        url: url,
        data: params,
        success: function (result) {
            if (result && result.success) {
                tale.alertOk({
                    text: '文章保存成功',
                    then: function () {
                        setTimeout(function () {
                            window.location.href = '/admin/article';
                        }, 500);
                    }
                });
            } else {
                tale.alertError(result.msg || '保存文章失败');
            }
        }
    });
}

function allow_comment(obj) {
    var this_ = $(obj);
    var on = this_.attr('on');
    if (on == 'true') {
        this_.attr('on', 'false');
        $('#allow_comment').val('false');
    } else {
        this_.attr('on', 'true');
        $('#allow_comment').val('true');
    }
}

function allow_ping(obj) {
    var this_ = $(obj);
    var on = this_.attr('on');
    if (on == 'true') {
        this_.attr('on', 'false');
        $('#allow_ping').val('false');
    } else {
        this_.attr('on', 'true');
        $('#allow_ping').val('true');
    }
}


function allow_feed(obj) {
    var this_ = $(obj);
    var on = this_.attr('on');
    if (on == 'true') {
        this_.attr('on', 'false');
        $('#allow_feed').val('false');
    } else {
        this_.attr('on', 'true');
        $('#allow_feed').val('true');
    }
}

function add_thumbimg(obj) {
    var this_ = $(obj);
    var on = this_.attr('on');
    console.log(on);
    if (on == 'true') {
        this_.attr('on', 'false');
        $('#dropzone-container').addClass('hide');
        $('#thumb_img').val('');
    } else {
        this_.attr('on', 'true');
        $('#dropzone-container').removeClass('hide');
        $('#dropzone-container').show();
    }
}