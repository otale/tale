var mditor, htmlEditor;
var tale = new $.tale();
var attach_url = $('#attach_url').val();
// 每60秒自动保存一次草稿
var refreshIntervalId;
Dropzone.autoDiscover = false;

var vm = new Vue({
    el: '#app',
    data: {
        article: {
            cid: '',
            title: '',
            slug: '',
            tags: '',
            content: '',
            status: 'draft',
            fmtType: 'markdown',
            allowComment: true,
            allowPing: true,
            allowFeed: true,
            createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            selected: ['默认分类']
        },
        categories: []
    },
    mounted: function () {
        var $vm = this;

        $("#form_datetime").datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            autoclose: true,
            todayBtn: true,
            weekStart: 1,
            language: 'zh-CN'
        });

        mditor = window.mditor = Mditor.fromTextarea(document.getElementById('md-editor'));
        // 富文本编辑器
        htmlEditor = $('.summernote').summernote({
            lang: 'zh-CN',
            height: 340,
            placeholder: '写点儿什么吧...',
            //上传图片的接口
            callbacks: {
                onImageUpload: function (files) {
                    var data = new FormData();
                    data.append('image_up', files[0]);
                    tale.showLoading();
                    $.ajax({
                        url: '/admin/attach/upload',     //上传图片请求的路径
                        method: 'POST',            //方法
                        data: data,                 //数据
                        processData: false,        //告诉jQuery不要加工数据
                        dataType: 'json',
                        contentType: false,        //<code class="javascript comments"> 告诉jQuery,在request head里不要设置Content-Type
                        success: function (result) {
                            tale.hideLoading();
                            if (result && result.success) {
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

        $vm.load();
        refreshIntervalId = setInterval("vm.autoSave()", 10 * 1000);
    },
    methods: {
        load: function () {
            var $vm = this;
            var pos = window.location.toString().lastIndexOf("/");
            var cid = window.location.toString().substring(pos + 1)
            tale.get({
                url: '/admin/api/categories',
                success: function (data) {
                    $vm.categories = data.payload
                },
                error: function (error) {
                    console.log(error);
                    alert(error || '数据加载失败');
                }
            });
            tale.get({
                url: '/admin/api/articles/' + cid,
                success: function (data) {
                    $vm.article = data.payload;
                    $vm.article.selected = data.payload.categories.split(',');
                    if ($vm.article.fmtType === 'markdown') {
                        mditor.value = data.payload.content;
                    } else {
                        htmlEditor.summernote("code", data.payload.content);
                    }
                    $vm.article.createdTime = moment.unix($vm.article.created).format('YYYY-MM-DD HH:mm')
                },
                error: function (error) {
                    console.log(error);
                    alert(error || '数据加载失败');
                }
            });
        },
        autoSave: function (callback) {
            var $vm = this;
            var content = $vm.article.fmtType === 'markdown' ? mditor.value : htmlEditor.summernote('code');
            if ($vm.article.title !== '' && content !== '') {
                $vm.article.content = content;
                $vm.article.categories = $vm.article.selected.join(',');
                var params = tale.copy($vm.article);
                params.selected = null;
                params.created = moment($('#form_datetime').val(), "YYYY-MM-DD HH:mm").unix();
                params.tags = $('#tags').val();

                tale.post({
                    url: '/admin/api/article/update',
                    data: params,
                    success: function (result) {
                        if (result && result.success) {
                            callback && callback()
                        } else {
                            tale.alertError(result.msg || '保存文章失败');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                        clearInterval(refreshIntervalId);
                    }
                });
            }
        },
        switchEditor: function (event) {
            var type = this.article.fmtType;
            var this_ = event.target;
            if (type === 'markdown') {
                // 切换为富文本编辑器
                if ($('#md-container .markdown-body').html().length > 0) {
                    $('#html-container .note-editable').empty().html($('#md-container .markdown-body').html());
                    $('#html-container .note-placeholder').hide();
                }
                mditor.value = '';
                $('#md-container').hide();
                $('#html-container').show();

                this_.innerHTML = '切换为Markdown编辑器';

                this.article.fmtType = 'html';
            } else {
                // 切换为markdown编辑器
                if ($('#html-container .note-editable').html().length > 0) {
                    mditor.value = '';
                    mditor.value = toMarkdown($('#html-container .note-editable').html());
                }
                $('#html-container').hide();
                $('#md-container').show();

                this.article.fmtType = 'markdown';

                this_.innerHTML = '切换为富文本编辑器';
                htmlEditor.summernote("code", "");
            }
        },
        publish: function (status) {
            var $vm = this;
            var content = this.article.fmtType === 'markdown' ? mditor.value : htmlEditor.summernote('code');
            var title = $vm.article.title;
            if (title === '') {
                tale.alertWarn('请输入文章标题');
                return;
            }
            if (content === '') {
                tale.alertWarn('请输入文章内容');
                return;
            }
            clearInterval(refreshIntervalId);
            $vm.article.status = status;
            $vm.autoSave(function () {
                tale.alertOk({
                    text: '文章保存成功',
                    then: function () {
                        setTimeout(function () {
                            window.location.href = '/admin/articles';
                        }, 500);
                    }
                });
            });
        }
    }
});

$(document).ready(function () {

    /*
     * 切换编辑器
     * */
    $('#switch-btn').click(function () {
        var type = $('#fmtType').val();
        var this_ = $(this);
        if (type == 'markdown') {
            // 切换为富文本编辑器
            if ($('#md-container .markdown-body').html().length > 0) {
                $('#html-container .note-editable').empty().html($('#md-container .markdown-body').html());
                $('#html-container .note-placeholder').hide();

            }
            mditor.value = '';
            $('#md-container').hide();
            $('#html-container').show();
            this_.text('切换为Markdown编辑器');
            $('#fmtType').val('html');
        } else {
            // 切换为markdown编辑器
            if ($('#html-container .note-editable').html().length > 0) {
                mditor.value = '';
                mditor.value = toMarkdown($('#html-container .note-editable').html());
            }
            $('#html-container').hide();
            $('#md-container').show();
            $('#fmtType').val('markdown');
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

    $('#allowComment').toggleClass('disabled', false);

    $('#allowComment').on('toggle', function (e, active) {
        vm.article.allowComment = active;
    });

    $('#allowPing').on('toggle', function (e, active) {
        vm.article.allowPing = active;
    });

    $('#allowFeed').on('toggle', function (e, active) {
        vm.article.allowFeed = active;
    });

    $('#addThumb').on('toggle', function (e, active) {
        if (active) {
            $('#dropzone-container').addClass('hide');
            $('#thumbImg').val('');
        } else {
            $('#dropzone-container').removeClass('hide');
            $('#dropzone-container').show();
        }
    });

    $("#multiple-sel").select2({
        width: '100%'
    });

    if ($('#thumb-toggle').attr('thumb_url') != '') {
        $('#thumb-toggle').toggles({
            on: true,
            text: {
                on: '开启',
                off: '关闭'
            }
        });
        $('#thumb-toggle').attr('on', 'true');
        $('#dropzone').css('background-image', 'url(' + $('#thumb-container').attr('thumb_url') + ')');
        $('#dropzone').css('background-size', 'cover');
        $('#dropzone-container').show();
    } else {
        $('#thumb-toggle').toggles({
            off: true,
            text: {
                on: '开启',
                off: '关闭'
            }
        });
        $('#thumb-toggle').attr('on', 'false');
        $('#dropzone-container').hide();
    }

    var thumbdropzone = $('.dropzone');

    // 缩略图上传
    $("#dropzone").dropzone({
        url: "/admin/attach/upload",
        filesizeBase: 1024,//定义字节算法 默认1000
        maxFilesize: '10', //MB
        fallback: function () {
            tale.alertError('暂不支持您的浏览器上传!');
        },
        acceptedFiles: 'image/*',
        dictFileTooBig: '您的文件超过10MB!',
        dictInvalidInputType: '不支持您上传的类型',
        init: function () {
            this.on('success', function (files, result) {
                console.log("upload success..");
                console.log(" result => " + result);
                if (result && result.success) {
                    var url = attach_url + result.payload[0].fkey;
                    console.log('url => ' + url);
                    thumbdropzone.css('background-image', 'url(' + url + ')');
                    thumbdropzone.css('background-size', 'cover');
                    $('.dz-image').hide();
                    $('#thumbImg').val(url);
                }
            });
            this.on('error', function (a, errorMessage, result) {
                if (!result.success && result.msg) {
                    tale.alertError(result.msg || '缩略图上传失败');
                }
            });
        }
    });

});
