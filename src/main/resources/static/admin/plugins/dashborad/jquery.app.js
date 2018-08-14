/**
 * Theme: Montran Admin Template
 * Author: Coderthemes
 * Module/App: Main Js
 */
var resizefunc = [];
!function($) {
    "use strict";

    var Sidemenu = function() {
        this.$body = $("body"),
            this.$openLeftBtn = $(".open-left"),
            this.$menuItem = $("#sidebar-menu a")
    };
    Sidemenu.prototype.openLeftBar = function() {
        $("#wrapper").toggleClass("enlarged");
        $("#wrapper").addClass("forced");

        if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
            $("body").removeClass("fixed-left").addClass("fixed-left-void");
        } else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
            $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }

        if($("#wrapper").hasClass("enlarged")) {
            $(".left ul").removeAttr("style");
        } else {
            $(".subdrop").siblings("ul:first").show();
        }

        toggle_slimscroll(".slimscrollleft");
        $("body").trigger("resize");
    },
        //menu item click
        Sidemenu.prototype.menuItemClick = function(e) {
            if(!$("#wrapper").hasClass("enlarged")){
                if($(this).parent().hasClass("has_sub")) {
                    e.preventDefault();
                }
                if(!$(this).hasClass("subdrop")) {
                    // hide any open menus and remove all other classes
                    $("ul",$(this).parents("ul:first")).slideUp(350);
                    $("a",$(this).parents("ul:first")).removeClass("subdrop");
                    $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");

                    // open our new menu and add the open class
                    $(this).next("ul").slideDown(350);
                    $(this).addClass("subdrop");
                    $(".pull-right i",$(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
                    $(".pull-right i",$(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
                }else if($(this).hasClass("subdrop")) {
                    $(this).removeClass("subdrop");
                    $(this).next("ul").slideUp(350);
                    $(".pull-right i",$(this).parent()).removeClass("md-remove").addClass("md-add");
                }
            }
        },

        //init sidemenu
        Sidemenu.prototype.init = function() {
            var $this  = this;
            //bind on click
            $(".open-left").click(function(e) {
                e.stopPropagation();
                console.log('openLeftBar//////');
                $this.openLeftBar();
            });

            // LEFT SIDE MAIN NAVIGATION
            $this.$menuItem.on('click', $this.menuItemClick);

            // NAVIGATION HIGHLIGHT & OPEN PARENT
            $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
        },

        //init Sidemenu
        $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu

}(window.jQuery),


    function($) {
        "use strict";

        var FullScreen = function() {
            this.$body = $("body"),
                this.$fullscreenBtn = $("#btn-fullscreen")
        };

        //turn on full screen
        // Thanks to http://davidwalsh.name/fullscreen
        FullScreen.prototype.launchFullscreen  = function(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
            FullScreen.prototype.exitFullscreen = function() {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            },
            //toggle screen
            FullScreen.prototype.toggle_fullscreen  = function() {
                var $this = this;
                var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
                if(fullscreenEnabled) {
                    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                        $this.launchFullscreen(document.documentElement);
                    } else{
                        $this.exitFullscreen();
                    }
                }
            },
            //init sidemenu
            FullScreen.prototype.init = function() {
                var $this  = this;
                //bind
                $this.$fullscreenBtn.on('click', function() {
                    $this.toggle_fullscreen();
                });
            },
            //init FullScreen
            $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen

    }(window.jQuery),

//portlets
    function($) {
        "use strict";

        /**
         Portlet Widget
         */
        var Portlet = function() {
            this.$body = $("body"),
                this.$portletIdentifier = ".portlet",
                this.$portletCloser = '.portlet a[data-toggle="remove"]',
                this.$portletRefresher = '.portlet a[data-toggle="reload"]'
        };

        //on init
        Portlet.prototype.init = function() {
            // Panel closest
            var $this = this;
            $(document).on("click",this.$portletCloser, function (ev) {
                ev.preventDefault();
                var $portlet = $(this).closest($this.$portletIdentifier);
                var $portlet_parent = $portlet.parent();
                $portlet.remove();
                if ($portlet_parent.children().length == 0) {
                    $portlet_parent.remove();
                }
            });

            // Panel Reload
            $(document).on("click",this.$portletRefresher, function (ev) {
                ev.preventDefault();
                var $portlet = $(this).closest($this.$portletIdentifier);
                // This is just a simulation, nothing is going to be reloaded
                $portlet.append('<div class="panel-disabled"><div class="loader-1"></div></div>');
                var $pd = $portlet.find('.panel-disabled');
                setTimeout(function () {
                    $pd.fadeOut('fast', function () {
                        $pd.remove();
                    });
                }, 500 + 300 * (Math.random() * 5));
            });
        },
            //
            $.Portlet = new Portlet, $.Portlet.Constructor = Portlet

    }(window.jQuery),

//main app module
    function($) {
        "use strict";

        var MoltranApp = function() {
            this.VERSION = "1.5.0",
                this.AUTHOR = "Coderthemes",
                this.SUPPORT = "coderthemes@gmail.com",
                this.pageScrollElement = "html, body",
                this.$body = $("body")
        };

        //initializing tooltip
        MoltranApp.prototype.initTooltipPlugin = function() {
            $.fn.tooltip && $('[data-toggle="tooltip"]').tooltip()
        },

            //initializing popover
            MoltranApp.prototype.initPopoverPlugin = function() {
                $.fn.popover && $('[data-toggle="popover"]').popover()
            },

            //initializing nicescroll
            MoltranApp.prototype.initNiceScrollPlugin = function() {
                //You can change the color of scroll bar here
                $.fn.niceScroll &&  $(".nicescroll").niceScroll({ cursorcolor: '#9d9ea5', cursorborderradius: '0px'});
            },

            //on doc load
            MoltranApp.prototype.onDocReady = function(e) {
                FastClick.attach(document.body);
                resizefunc.push("initscrolls");
                resizefunc.push("changeptype");

                $('.animate-number').each(function(){
                    $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration")));
                });

                //RUN RESIZE ITEMS
                $(window).resize(debounce(resizeitems,100));
                $("body").trigger("resize");

                // right side-bar toggle
                $('.right-bar-toggle').on('click', function(e){
                    e.preventDefault();
                    $('#wrapper').toggleClass('right-bar-enabled');
                });


            },
            //initilizing
            MoltranApp.prototype.init = function() {
                var $this = this;
                this.initTooltipPlugin(),
                    this.initPopoverPlugin(),
                    this.initNiceScrollPlugin(),
                    //document load initialization
                    $(document).ready($this.onDocReady);
                //creating portles
                $.Portlet.init();
                //init side bar - left
                $.Sidemenu.init();
                //init fullscreen
                $.FullScreen.init();
            },

            $.MoltranApp = new MoltranApp, $.MoltranApp.Constructor = MoltranApp

    }(window.jQuery),

//initializing main application module
    function($) {
        "use strict";
        $.MoltranApp.init();
    }(window.jQuery);



/* ------------ some utility functions ----------------------- */
//this full screen
var toggle_fullscreen = function () {

}

function executeFunctionByName(functionName, context /*, args */) {
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
}
var w,h,dw,dh;
var changeptype = function(){
    w = $(window).width();
    h = $(window).height();
    dw = $(document).width();
    dh = $(document).height();

    if(jQuery.browser.mobile === true){
        $("body").addClass("mobile").removeClass("fixed-left");
    }

    if(!$("#wrapper").hasClass("forced")){
        if(w > 990){
            $("body").removeClass("smallscreen").addClass("widescreen");
            $("#wrapper").removeClass("enlarged");
            $(".admin-title").show();
        }else{
            $("body").removeClass("widescreen").addClass("smallscreen");
            $("#wrapper").addClass("enlarged");
            $(".left ul").removeAttr("style");
            $(".admin-title").hide();
        }
        if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")){
            $("body").removeClass("fixed-left").addClass("fixed-left-void");
        }else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")){
            $("body").removeClass("fixed-left-void").addClass("fixed-left");
        }

    }
    toggle_slimscroll(".slimscrollleft");
}


var debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
    };
}

function resizeitems(){
    if($.isArray(resizefunc)){
        for (i = 0; i < resizefunc.length; i++) {
            window[resizefunc[i]]();
        }
    }
}

function initscrolls(){
    if(jQuery.browser.mobile !== true){
        //SLIM SCROLL
        $('.slimscroller').slimscroll({
            height: 'auto',
            size: "5px"
        });

        $('.slimscrollleft').slimScroll({
            height: 'auto',
            position: 'right',
            size: "5px",
            color: '#7A868F',
            wheelStep: 5
        });
    }
}
function toggle_slimscroll(item){
    if($("#wrapper").hasClass("enlarged")){
        $(item).css("overflow","inherit").parent().css("overflow","inherit");
        $(item). siblings(".slimScrollBar").css("visibility","hidden");
    }else{
        $(item).css("overflow","hidden").parent().css("overflow","hidden");
        $(item). siblings(".slimScrollBar").css("visibility","visible");
    }
}

var wow = new WOW(
    {
        boxClass: 'wow', // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset: 50, // distance to the element when triggering the animation (default is 0)
        mobile: false        // trigger animations on mobile devices (true is default)
    }
);
wow.init();

/* === following js will activate the menu in left side bar based on url ==== */
$(document).ready(function() {
    $("#sidebar-menu a").each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("active");
            $(this).parent().addClass("active"); // add active to li of the current link
            $(this).parent().parent().prev().addClass("active"); // add active class to an anchor
            $(this).parent().parent().prev().click(); // click the item to make it drop
        }
    });
});