var _swal = {
    alert_del:function(data){
        swal({
            title:  data.title || '警告信息' ,
            text:  data.text || "确定删除吗？" ,
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


