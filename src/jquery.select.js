/*!
 * select - jQuery Plugin
 * version: 2.0.0 (Tue, 5 Feb 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at https://github.com/coma/jquery.select
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013 Eduardo García Sanz - eduardo@comakai.com
 *
 */

(function($){

    var current;

    $.fn.select = function(options) {

        var pluginName = 'select';
        var plugin = $(this).data(pluginName);
	
        if(plugin) {
		
            return plugin;
		
        } else {

            var settings = $.extend({
                widgetClass: 'select'
            }, options);

            var create = function(o) {

                var widget;
                var select;
                var label;

                if($(o).is('select')) {

                    select = $(o).wrap('<div class="' + settings.widgetClass + '"/>');
                    widget = select.parent();
                    label = $('<div class="label">' + select.children(':selected').text() + '</div>').appendTo(widget);

                } else {

                    widget = $(o);
                    label = widget.find('.label');
                    select = widget.find('select');

                }

                return {
                    widget: widget,
                    label: label,
                    select: select
                };

            };

            if(!!('ontouchstart' in window) || !!('onmsgesturechange' in window)) {

                return this.each(function() {

                    var o = create(this);
                    var widget = o.widget;
                    var label = o.label;
                    var select = o.select;

                    select
                    .width(widget.width())
                    .css('margin', 0);

                    var change = function() {

                        label.text(select.find('option:selected').text());

                    };

                    var val = function(v) {

                        if(v) {

                            select.val(v);
                            select.change();

                        } else {

                            return select.val();

                        }

                    };

                    select.change(change);

                    change();

                    var api = {
                        settings: settings,
                        change: change,
                        val: val
                    }

                    widget.data(pluginName, api);

                });

            }

            return this.each(function() {

                var o = create(this);
                var widget = o.widget;
                var label = o.label;
                var select = o.select;
                
                var container = widget.offsetParent();
                var options = $('<div class="options"><div></div></div>').appendTo(widget);
                var opened = false;
                var search = false;
                var values;
                var index;
                var ti;

                select
                .click(function(event) {
                    event.preventDefault();
                    select.blur();
                })
                .css({
                    zIndex: -1,
                    pointerEvents: 'none'
                })
                .attr('tabindex', -1);

                widget.attr('tabindex', 0);

                var render = function() {

                    var html = '';
                    values = [];

                    select.children().each(function(i) {

                        var c = $(this);

                        if(c.is('option')) {

                            html += '<a href="#" data-value="' + this.value + '" data-index="' + values.length + '" data-label="' + c.text().toLowerCase() + '">' + c.text() + '</a>';
                            values.push(this.value);

                        }

                        if(c.is('optgroup')) {

                            html += '<div><p>' + this.label + '</p>';

                            c.children().each(function(j) {

                                var d = $(this);

                                html += '<a href="#" data-value="' + this.value + '" data-index="' + values.length + '" data-label="' + d.text() + '">' + d.text() + '</a>';
                                values.push(this.value);

                            });

                            html += '</div>';

                        }

                        options.children().html(html);

                        change();

                    });

                };

                var disable = function(b) {
                    
                    b = (typeof b != 'boolean') ? true : b;

                    if(b) {
                        
                        select.attr('disabled', true);
                        
                    } else {
                        
                        select.removeAttr('disabled');
                        
                    }

                };

                var isDisabled = function() {

                    return select.get(0).disabled;

                };

                var isEnabled = function() {

                    return !isDisabled() && !isReadOnly();

                };

                var readOnly = function(b) {
                    
                    b = (typeof b != 'boolean') ? true : b;

                    if(b) {
                        
                        select.attr('readonly', true);
                        
                    } else {
                        
                        select.removeAttr('readonly');
                        
                    }

                };

                var isReadOnly = function() {

                    return select.attr('readonly') != null;

                };

                var close = function() {

                    clearInterval(ti);
                    widget.removeClass('drop down up');
                    options.find('a.highlight').removeClass('highlight');
                    opened = false;

                };

                var open = function() {

                    clearInterval(ti);
                    widget.addClass('drop');

                    var optionsHeight = options.height();
                    var viewportHeight = $(window).height();
                    var scrollTop = container.scrollTop();
                    var top = widget.offset().top - scrollTop;
                    var bottom = viewportHeight - top - 29;
                    var up = top > bottom && bottom < optionsHeight;

                    widget.addClass((up) ? 'up' : 'down');
                    opened = true;

                    if(search) {

                        widget.find('div.search>input').focus();

                    }

                };

                var change = function() {

                    options.find('a.selected').removeClass('selected');
                    var v = select.val();
                    var a = findByValue(v).addClass('selected');
                    label.text(a.text());
                    index = a.data('index');

                    if(opened) {

                        highlight();

                    }

                };

                var findByIndex = function(i) {

                    return options.find('a[data-index="' + i + '"]:first');

                };

                var findByValue = function(v) {

                    return options.find('a[data-value="' + v + '"]:first');

                };

                var setByKeyCode = function(c) {

                    c = String.fromCharCode(c).toLowerCase();

                    if(/[a-zA-Z0-9-_ ]/i.test(c)) {

                        var a = options.find('a[data-label^="' + c + '"]').not('[data-value=""]');

                        if(a.length > 0) {

                            if(a.filter('[data-index=' + index + ']').length > 0) {

                                index++;

                                if(a.filter('[data-index=' + index + ']').length > 0) {

                                    set(index);

                                } else {

                                    set(a.first().data('index'));

                                }

                            } else {

                                set(a.first().data('index'));

                            }

                        }

                    }

                };

                var val = function(v) {

                    if(v) {

                        select.val(v);
                        select.change();

                    } else {

                        return select.val();

                    }

                };

                var set = function(i) {
                    
                    i = Math.min(i, values.length - 1);
                    i = Math.max(i, 0);

                    select.val(values[i]);
                    change();

                };

                var setScroll = function(s) {

                    widget.unbind('mousemove');
                    options.scrollTop(s);

                    if(widget.hasClass('mouseBlocked')) {

                        //widget.mousemove(mouseUnblock);
                        
                        setTimeout(mouseBlock, 250);

                    }

                };

                var highlight = function() {

                    options.find('a.highlight').removeClass('highlight');
                    var a = findByIndex(index).addClass('highlight');
                    var scrollTop = options.scrollTop();
                    var top = a.position().top;

                    if(scrollTop > top) {

                        setScroll(top);

                    } else {

                        setScroll(Math.max(scrollTop, (top - options.height()) + a.height()));

                    }

                };

                var xo = null;
                var yo = null;

                var mouseBlock = function() {

                    widget.mousemove(mouseUnblock);
                    widget.addClass('mouseBlocked');

                };

                var mouseUnblock = function(event) {

                    var xn = event.pageX;
                    var yn = event.pageY;

                    if(xo != null && (Math.abs(xo - xn) + Math.abs(yo - yn)) > 0) {

                        widget.unbind('mousemove');
                        options.find('a.highlight').removeClass('highlight');
                        widget.removeClass('mouseBlocked');

                        xo = null;
                        yo = null;

                    } else {

                        xo = xn;
                        yo = yn;

                    }

                };

                widget.click(function(event) {

                    event.stopPropagation();

                    if(current) {

                        current.close();

                    }
                    
                    if(isEnabled()) {

                        if(opened) {

                            close();

                        } else {

                            open();

                        }

                        current = api;
                    
                    }

                });

                options.on('click', 'a', function(event) {

                    event.preventDefault();
                    event.stopPropagation();
                    widget.focus();
                    
                    if(isEnabled()) {
                    
                        var a = $(this);
                        var v = a.data('value');

                        if(v != select.val()) {

                            select.val(v);
                            select.change();
                        }

                        close();
                    
                    }

                });

                select.change(change);

                $(window).scroll(close);
                $('html').click(close);
                
                widget.blur(function(event) {
                    
                    //ti = setTimeout(close, 300);
                    
                });

                if(select.data('search')) {

                    search = true;

                    widget
                    .addClass('search')
                    .append('<div class="search"><input type="text"/></div>')
                    .find('div.search>input')
                    .click(function(event) {

                        event.stopPropagation();
                        clearInterval(ti);
                        
                    })
                    .focus(function(event) {

                        event.stopPropagation();
                        clearInterval(ti);
                        
                    })
                    .keyup(function(event) {
                        
                        if(isEnabled()) {

                            var s = $.trim(this.value.toLowerCase());

                            if(s != '') {

                                options
                                .find('a')
                                .hide()
                                .filter('[data-label*="' + s + '"]')
                                .show();

                            } else {

                                options
                                .find('a')
                                .show();

                            }
                            
                        }

                    });

                } else {

                    widget.keydown(function(event) {
                        
                        if(isEnabled()) {

                            mouseBlock();

                            if(!opened) {

                                open();

                            }

                            switch(event.keyCode) {

                                case 39:
                                case 40:
                                event.preventDefault();
                                set(++index);
                                break;

                                case 37:
                                case 38:
                                event.preventDefault();
                                set(--index);
                                break;

                                default:
                                setByKeyCode(event.keyCode);

                            }

                        }

                    });
                };
                
                var setOption = function(o, v) {
                    
                    settings[o] = v;
                    
                };
                
                var getOption = function(o) {
                    
                    return settings[o];
                    
                };
                
                var getOptions = function() {
                    
                    return settings;
                    
                };

                render();

                var api = {
                    settings: settings,
                    open: open,
                    close: close,
                    change: change,
                    render: render,
                    val: val,
                    set: set,
                    readOnly: readOnly,
                    disable: disable,
                    isReadOnly: isReadOnly,
                    isDisabled: isDisabled,
                    isEnabled: isEnabled,
                    setOption: setOption,
                    getOption: getOption,
                    getOptions: getOptions
                };

                widget.data(pluginName, api);

            });
        
        }

    }

})(jQuery);
