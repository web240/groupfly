//resize of div 
(function ($, h, c) {
    var a = $([]),
    e = $.resize = $.extend($.resize, {}),
    i,
    k = "setTimeout",
    j = "resize",
    d = j + "-special-event",
    b = "delay",
    f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function () {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function (l) {
            if (!e[f] && this[k]) {
                return false;
            }
            var n;
            function m(s, o, p) {
                var q = $(this),
                r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments);
            }
            if ($.isFunction(l)) {
                n = l;
                return m;
            } else {
                n = l.handler;
                l.handler = m;
            }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this),
                m = n.width(),
                l = n.height(),
                o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l]);
                }
            });
            g();
        },
        e[b]);
    }
})(jQuery, this);

//统一ajax调用
function platformAjax(option) {
    if (option.data) {
        option.data.AjaxType = "Operation";
    } else {
        option.data = { AjaxType: "Operation" }
    }
    $.ajax({
        type: option.type || "post",
        url: option.url,
        data: option.data,
        datatype: option.datatype || "json",
        success: function (result) {
            if (!("IsSuccess" in result) || result.IsSuccess) {
                option.success(result);
            } 
            else {
                switch (result.FailCode) {
                    case "LoginRequired":
                        var loginUrl = "/GroupflyGroup.Platform.Web/Login";
                        if (top) {
                            top.location.href = loginUrl;
                        } else {
                            window.location.href = loginUrl;
                        }
                    break;
                default:
                    if (option.fail) {
                        option.fail(result);
                    } else {
                        $.messager.alert('提示', result.message);
                    }
                    break;
                }
            }
            if (option.finallyCall) {
                option.finallyCall(result);
            }
        },
        error: function (result) {
            if (option.error) {
                option.error(result);
            } else {
                $.messager.alert('异常', result.statusText);
            }
            if (option.finallyCall) {
                option.finallyCall(result);
            }
        }
    });
}