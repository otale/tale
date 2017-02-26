/**
 * Created by biezhi on 2017/2/23.
 */
!function ($) {
    "use strict";
    var tale = new $.tale();
    var FormWizard = function () {
    };
    //creates form with validation
    FormWizard.prototype.init = function () {
        var $form_container = $("#wizard-validation-form");
        $form_container.validate({
            errorPlacement: function errorPlacement(error, element) {
                element.after(error);
            }
        });
        $form_container.children("div").steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            labels: {
                previous: "上一步",
                next: "下一步",
                finish: "登录后台",
                loading: '加载中...',
                current: '当前位置'
            },
            onStepChanging: function (event, currentIndex, newIndex) {
                tale.showLoading();
                $form_container.validate().settings.ignore = ":disabled,:hidden";
                var isValid = $form_container.valid();
                if(!isValid){
                    tale.hideLoading();
                }
                if (isValid && currentIndex == 1) {
                    isValid = false;
                    var params = $form_container.serialize();
                    $.ajax({
                        type: 'post',
                        url: '/install/conn_test',
                        data: params,
                        async: false,
                        dataType: 'json',
                        success: function (result) {
                            if (result && result.success) {
                                tale.showLoading();
                                $.ajax({
                                    type: 'post',
                                    url: '/install',
                                    data: params,
                                    async: false,
                                    dataType: 'json',
                                    success: function (result) {
                                        tale.hideLoading();
                                        if (result && result.success) {
                                            isValid = true;
                                        } else {
                                            if (result.msg) {
                                                swal("提示消息", result.msg, 'error');
                                            }
                                        }
                                    }
                                });
                            } else {
                                if (result.msg) {
                                    swal("提示消息", result.msg, 'error');
                                }
                            }
                        }
                    });
                    return isValid;
                } else {
                    return isValid;
                }
            },
            onStepChanged: function (event, currentIndex) {
                tale.hideLoading();
            },
            onFinishing: function (event, currentIndex) {
                $form_container.validate().settings.ignore = ":disabled";
                var isValid = $form_container.valid();
                window.location.href = "/admin/login";
                return isValid;
            },
            onFinished: function (event, currentIndex) {
                window.location.href = "/admin/login";
            }
        });
        return $form_container;
    },
        //init
        $.FormWizard = new FormWizard, $.FormWizard.Constructor = FormWizard
}(window.jQuery),

    $.FormWizard.init();
