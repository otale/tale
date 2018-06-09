var mditor, htmlEditor;
var tale = new $.tale();
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
            createdTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
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

        $('#allowComment').on('toggle', function (e, active) {
            vm.article.allowComment = active;
        });

        $('#allowFeed').on('toggle', function (e, active) {
            vm.article.allowFeed = active;
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

                    $('#allowComment').toggles({
                        on: $vm.article.allowComment,
                        text: {
                            on: '开启',
                            off: '关闭'
                        }
                    });

                    $('#allowFeed').toggles({
                        on: $vm.article.allowFeed,
                        text: {
                            on: '开启',
                            off: '关闭'
                        }
                    });
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

                var params = tale.copy($vm.article);
                params.selected = null;
                params.created = moment($('#form_datetime').val(), "YYYY-MM-DD HH:mm").unix();

                tale.post({
                    url: '/admin/api/page/update',
                    data: params,
                    success: function (result) {
                        if (result && result.success) {
                            callback && callback()
                        } else {
                            tale.alertError(result.msg || '保存页面失败');
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