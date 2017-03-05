var mditor, htmlEditor;
var tale = new $.tale();
$(document).ready(function () {

    mditor = window.mditor = Mditor.fromTextarea(document.getElementById('md-editor'));

    htmlEditor = $('.summernote').summernote({
        lang: 'zh-CN',
        height: 340,
        placeholder: '写点儿什么吧...',
        //上传图片的接口
        callbacks:{
            onImageUpload: function(files) {
                var data=new FormData();
                data.append('image_up',files[0]);
                tale.showLoading();
                $.ajax({
                    url: '/admin/attach/upload',     //上传图片请求的路径
                    method: 'POST',            //方法
                    data:data,                 //数据
                    processData: false,        //告诉jQuery不要加工数据
                    dataType:'json',
                    contentType: false,        //<code class="javascript comments"> 告诉jQuery,在request head里不要设置Content-Type
                    success: function(result) {
                        tale.hideLoading();
                        if(result && result.success){
                            var url = $('#attach_url').val() + result.payload[0].fkey;
                            console.log('url =>' + url);
                            htmlEditor.summernote('insertImage', url);
                        } else {
                            tale.alertError(result.msg || '图片上传失败');
                        }
                    }
                });
            }
        }
    });

    var fmt_type = $('#fmt_type').val();
    // 富文本编辑器
    if (fmt_type != 'markdown') {
        var this_ = $('#switch-btn');
        mditor.value = '';
        $('#md-container').hide();
        $('#html-container').show();
        this_.text('切换为Markdown编辑器');
        this_.attr('type', 'texteditor');
    } else {
        var this_ = $('#switch-btn');
        $('#html-container').hide();
        $('#md-container').show();
        $('#fmt_type').val('markdown');
        this_.attr('type', 'markdown');
        this_.text('切换为富文本编辑器');
        htmlEditor.summernote("code", "");
    }

    // 每10秒自动保存一次草稿
    setInterval("autoSave()", 10 * 1000);

    /*
     * 切换编辑器
     * */
    $('#switch-btn').click(function () {
        var type = $('#fmt_type').val();
        var this_ = $(this);
        if (type == 'markdown') {
            // 切换为富文本编辑器
            mditor.value = '';
            $('#md-container').hide();
            $('#html-container').show();
            this_.text('切换为Markdown编辑器');
            $('#fmt_type').val('html');
        } else {
            // 切换为markdown编辑器
            $('#html-container').hide();
            $('#md-container').show();
            $('#fmt_type').val('markdown');
            this_.text('切换为富文本编辑器');
            htmlEditor.summernote("code", "");
        }
    });
    // Tags Input
    $('#tags').tagsInput({
        width: '100%',
        height: '35px',
        defaultText: '请输入文章标签'
    });

    $('.toggle').toggles({
        on: true,
        text: {
            on: '开启',
            off: '关闭'
        }
    });

    $(".select2").select2({
        width: '100%'
    });

    $('div.allow-false').toggles({
        off: true,
        text: {
            on: '开启',
            off: '关闭'
        }
    });
});

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
    var on = this_.find('.toggle-on.active').length;
    var off = this_.find('.toggle-off.active').length;
    if (on == 1) {
        $('#allow_comment').val(false);
    }
    if (off == 1) {
        $('#allow_comment').val(true);
    }
}

function allow_ping(obj) {
    var this_ = $(obj);
    var on = this_.find('.toggle-on.active').length;
    var off = this_.find('.toggle-off.active').length;
    if (on == 1) {
        $('#allow_ping').val(false);
    }
    if (off == 1) {
        $('#allow_ping').val(true);
    }
}


function allow_feed(obj) {
    var this_ = $(obj);
    var on = this_.find('.toggle-on.active').length;
    var off = this_.find('.toggle-off.active').length;
    if (on == 1) {
        $('#allow_feed').val(false);
    }
    if (off == 1) {
        $('#allow_feed').val(true);
    }
}