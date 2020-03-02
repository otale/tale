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

window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': document.head.querySelector("[name=csrf_token]").content,
    'X-Requested-With': 'XMLHttpRequest'
};

$.tale.prototype.get = function (options) {
    axios.get(options.url, {
        params: options.data || {}
    }).then(function (response) {
        options.success && options.success(response.data)
    }).catch(function (error) {
        options.error && options.error(error)
    });
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
        options.error && options.error(error)
    });
};

/**
 * 通过 FORM 表单方式提交
 * @param options
 */
$.tale.prototype.postWithForm = function (options) {
    var self = this;
    axios({
        url: options.url,
        method: 'post',
        data: options.data || {},
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            var ret = [];
            for (it in data) {
                ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&');
            }
            return ret.join('');
        }],
        headers: {
            'X-CSRF-TOKEN': document.head.querySelector("[name=csrf_token]").content,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response) {
        self.hideLoading();
        options.success && options.success(response.data);
    }).catch(function (error) {
        options.error && options.error(error)
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

$.tale.prototype.copy = function (src) {
    var dst = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dst[prop] = src[prop];
        }
    }
    return dst;
};

/**
 * gravatar 头像地址生成
 */
$.tale.prototype.gravatar = function(email, options){
    // using md5() from here: http://www.myersdaily.org/joseph/javascript/md5-text.html
    function md5cycle(e,t){var n=e[0],r=e[1],i=e[2],s=e[3];n=ff(n,r,i,s,t[0],7,-680876936);s=ff(s,n,r,i,t[1],12,-389564586);i=ff(i,s,n,r,t[2],17,606105819);r=ff(r,i,s,n,t[3],22,-1044525330);n=ff(n,r,i,s,t[4],7,-176418897);s=ff(s,n,r,i,t[5],12,1200080426);i=ff(i,s,n,r,t[6],17,-1473231341);r=ff(r,i,s,n,t[7],22,-45705983);n=ff(n,r,i,s,t[8],7,1770035416);s=ff(s,n,r,i,t[9],12,-1958414417);i=ff(i,s,n,r,t[10],17,-42063);r=ff(r,i,s,n,t[11],22,-1990404162);n=ff(n,r,i,s,t[12],7,1804603682);s=ff(s,n,r,i,t[13],12,-40341101);i=ff(i,s,n,r,t[14],17,-1502002290);r=ff(r,i,s,n,t[15],22,1236535329);n=gg(n,r,i,s,t[1],5,-165796510);s=gg(s,n,r,i,t[6],9,-1069501632);i=gg(i,s,n,r,t[11],14,643717713);r=gg(r,i,s,n,t[0],20,-373897302);n=gg(n,r,i,s,t[5],5,-701558691);s=gg(s,n,r,i,t[10],9,38016083);i=gg(i,s,n,r,t[15],14,-660478335);r=gg(r,i,s,n,t[4],20,-405537848);n=gg(n,r,i,s,t[9],5,568446438);s=gg(s,n,r,i,t[14],9,-1019803690);i=gg(i,s,n,r,t[3],14,-187363961);r=gg(r,i,s,n,t[8],20,1163531501);n=gg(n,r,i,s,t[13],5,-1444681467);s=gg(s,n,r,i,t[2],9,-51403784);i=gg(i,s,n,r,t[7],14,1735328473);r=gg(r,i,s,n,t[12],20,-1926607734);n=hh(n,r,i,s,t[5],4,-378558);s=hh(s,n,r,i,t[8],11,-2022574463);i=hh(i,s,n,r,t[11],16,1839030562);r=hh(r,i,s,n,t[14],23,-35309556);n=hh(n,r,i,s,t[1],4,-1530992060);s=hh(s,n,r,i,t[4],11,1272893353);i=hh(i,s,n,r,t[7],16,-155497632);r=hh(r,i,s,n,t[10],23,-1094730640);n=hh(n,r,i,s,t[13],4,681279174);s=hh(s,n,r,i,t[0],11,-358537222);i=hh(i,s,n,r,t[3],16,-722521979);r=hh(r,i,s,n,t[6],23,76029189);n=hh(n,r,i,s,t[9],4,-640364487);s=hh(s,n,r,i,t[12],11,-421815835);i=hh(i,s,n,r,t[15],16,530742520);r=hh(r,i,s,n,t[2],23,-995338651);n=ii(n,r,i,s,t[0],6,-198630844);s=ii(s,n,r,i,t[7],10,1126891415);i=ii(i,s,n,r,t[14],15,-1416354905);r=ii(r,i,s,n,t[5],21,-57434055);n=ii(n,r,i,s,t[12],6,1700485571);s=ii(s,n,r,i,t[3],10,-1894986606);i=ii(i,s,n,r,t[10],15,-1051523);r=ii(r,i,s,n,t[1],21,-2054922799);n=ii(n,r,i,s,t[8],6,1873313359);s=ii(s,n,r,i,t[15],10,-30611744);i=ii(i,s,n,r,t[6],15,-1560198380);r=ii(r,i,s,n,t[13],21,1309151649);n=ii(n,r,i,s,t[4],6,-145523070);s=ii(s,n,r,i,t[11],10,-1120210379);i=ii(i,s,n,r,t[2],15,718787259);r=ii(r,i,s,n,t[9],21,-343485551);e[0]=add32(n,e[0]);e[1]=add32(r,e[1]);e[2]=add32(i,e[2]);e[3]=add32(s,e[3])}function cmn(e,t,n,r,i,s){t=add32(add32(t,e),add32(r,s));return add32(t<<i|t>>>32-i,n)}function ff(e,t,n,r,i,s,o){return cmn(t&n|~t&r,e,t,i,s,o)}function gg(e,t,n,r,i,s,o){return cmn(t&r|n&~r,e,t,i,s,o)}function hh(e,t,n,r,i,s,o){return cmn(t^n^r,e,t,i,s,o)}function ii(e,t,n,r,i,s,o){return cmn(n^(t|~r),e,t,i,s,o)}function md51(e){txt="";var t=e.length,n=[1732584193,-271733879,-1732584194,271733878],r;for(r=64;r<=e.length;r+=64){md5cycle(n,md5blk(e.substring(r-64,r)))}e=e.substring(r-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<e.length;r++)i[r>>2]|=e.charCodeAt(r)<<(r%4<<3);i[r>>2]|=128<<(r%4<<3);if(r>55){md5cycle(n,i);for(r=0;r<16;r++)i[r]=0}i[14]=t*8;md5cycle(n,i);return n}function md5blk(e){var t=[],n;for(n=0;n<64;n+=4){t[n>>2]=e.charCodeAt(n)+(e.charCodeAt(n+1)<<8)+(e.charCodeAt(n+2)<<16)+(e.charCodeAt(n+3)<<24)}return t}function rhex(e){var t="",n=0;for(;n<4;n++)t+=hex_chr[e>>n*8+4&15]+hex_chr[e>>n*8&15];return t}function hex(e){for(var t=0;t<e.length;t++)e[t]=rhex(e[t]);return e.join("")}function md5(e){return hex(md51(e))}function add32(e,t){return e+t&4294967295}var hex_chr="0123456789abcdef".split("");if(md5("hello")!="5d41402abc4b2a76b9719d911017c592"){function add32(e,t){var n=(e&65535)+(t&65535),r=(e>>16)+(t>>16)+(n>>16);return r<<16|n&65535}}
    //check to make sure you gave us something
    var options = options || {},
        base,
        params = [];

    //set some defaults, just in case
    options = {
        size: options.size || "50",
        rating: options.rating || "g",
        secure: options.secure || (location.protocol === 'https:'),
        backup: options.backup || ""
    };

    //setup the email address
    email = email.trim().toLowerCase();

    //determine which base to use
    base = options.secure ? 'https://cn.gravatar.com/avatar/' : 'http://cn.gravatar.com/avatar/';

    //add the params
    if (options.rating) {params.push("r=" + options.rating)};
    if (options.backup) {params.push("d=" + encodeURIComponent(options.backup))};
    if (options.size) {params.push("s=" + options.size)};

    //now throw it all together
    return base + md5(email) + "?" + params.join("&");
};

/**
 * Vue 全局
 */
Vue.filter('formatUnix', function (value, pattern) {
    if (value) {
        return moment.unix(value).format(pattern || 'YYYY/MM/DD HH:mm:ss')
    }
    return ''
});
Vue.filter('truncate', function (value, size, append) {
    if (value && value.length >= size) {
        return value.substring(0, size) + (append || '...');
    }
    return value
});
Vue.filter('gravatar', function (value) {
    return new $.tale().gravatar(value)
});

Vue.use(VueLoading);
Vue.component('Loading', VueLoading)
var vueLoding;

var colors_ = ["default", "primary", "success", "info", "warning", "danger", "inverse", "purple", "pink"];
Vue.prototype.randomColor = function () {
    console.log('color..');
    return colors_[Math.floor(Math.random() * colors_.length)];
};
