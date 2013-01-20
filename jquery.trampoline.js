/*
    jQuery Plugin .trampoline( function )
    @version: 1.0
    @author Stephen Young
    @requires jQuery Core 1.0+

    Purpose:
    This plugin mimics the jQuery.each method by taking an array of DOM elements and
    applying a function to each one. This only works on arrays and not objects.

    The main purpose of the plugin is to demonstrate the use of thunks and trampolines in
    Javascript.

    Usage example:
    $('.appendMe').trampoline(function(i, val) {
        $('#container').append(val);
    });
*/

(function( $ ) {
    var pluginName = 'trampoline';

    var thunk = function (f, lst) {
        return { tag: "thunk", func: f, args: lst };
    };

    var thunkValue = function (x) {
        return { tag: "value", val: x };
    };

    var trampoline = function (thk) {
        while (true) {
            if (thk.tag === "value") {
                return thk.val;
            }
            if (thk.tag === "thunk") {
                thk = thk.func.apply(null, thk.args);
            }
        }
    };

    $.fn[pluginName] = function(func) {

        var selector = this;

        var iterator = function(n, cont) {

            if (n < 1) {
                return thunk(cont, [selector[n]]);
            } else {
                var arg = function(a) {
                    if (selector[a]) {
                        return [selector[a]];
                    } else {
                        return [selector];
                    }
                };
                var new_cont = function(v) {
                    var result = func.call(v, n, v);
                    return thunk(cont, arg(n));
                };
                return thunk(iterator, [n - 1, new_cont]);
            }

        };
        return trampoline(iterator(selector.length, thunkValue));

    };
})( jQuery );
