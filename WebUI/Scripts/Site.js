function documentReady(root, controller, action) {
    // bind the window min-height to window size
    adjustLayout();
    $(window).on('resize', adjustLayout);

    // make server side validation message html be the same as client side (almost)
    $(document).ajaxComplete(function () {
        $('.field-validation-error').each(function () {
            var $this = $(this);
            if (!$this.children().first().is('span')) {
                var $msg = $('<span/>').html($this.html());
                $(this).html($msg);
            }
        });
    });

    var dog = initDog(root, controller, action);

    window.initSettings = function () {
        $('#chDog').click(dog.toggle);

        $('#chTheme').change(function () {
            var theme = $('#chTheme').val();

            $('#aweStyle').attr('href', root + "Content/themes/" + theme + "/AwesomeMvc.css?v=" + document.ver);
            $('body').attr('class', theme);

            awe.ajx(root + "Settings/Change", awe.srl({ theme: theme }))
                .done(function () {
                    setTimeout(function () {
                        $('.awe-grid').each(
                            function () {
                                $(this).data('api').lay();
                            });
                    }, 500);
                });
        });

        $('#chLang').change(function () {
            awe.ajx(root + "Settings/ChangeLang", awe.srl({ l: $(this).val() }))
                .done(function () {
                    location.reload();
                });
        });
    };

    $(document).on('aweopen', '.awe-popup', function () {
        var popup = $(this);
        var o = popup.data('o');
        var prms = o.params;
        if (prms && prms.anim) {
            slide(popup, prms.anim);    
        }
    });
}

function slide(popup, anim) {
    var top = anim.indexOf('top') >= 0;
    var fade = anim.indexOf('fade') >= 0;
    var o = popup.data('o');
    var max = top ? -$(window).height()/3 : $(window).width();
    var transl = 'translate' + (top ? 'Y' : 'X');

    var div = popup.closest('.o-pmc');
    o.p.nolay = 1;
    div.css('transform', transl + '(' + max + 'px)');
    fade && div.css('opacity', 0);

    setTimeout(function () {
        div.css('transition', '.5s');
        div.css('transform', transl + '(0)');
        fade && div.css('opacity', 1);

        setTimeout(function () {
            o.p.nolay = 0;
            div.css('transition', '');
            div.css('transform', '');
            o.cx.api.lay();
        }, 500);
    }, 30);
}

function passchanged(o) {
    awe.flash(awem.notif("<div> password for " + o.Login + " was successfuly changed </div>", 5000));
}

// adjust pageszie of meals multilookup depending on available width
function getMealsLookupPageSize() {
    var w = $('[id$="Meals-awepw"]:visible .awe-ajaxlist').width();
    var mealWidth = 212;
    if (w < mealWidth) mealWidth = w - 20;
    var countPerRow = parseInt(w / mealWidth, 10);
    var rows = parseInt(10 / countPerRow, 10);
    var pageSize = Math.max(rows, 1) * countPerRow;

    return { pageSize: pageSize };
}

function adjustLayout() {
    $("#main").css("min-height", ($(window).height() - 120) + "px");
}

var setDogBtnTxt;
function initDog(root, controller, action) {
    var dog = Dog(root, controller, action);
    dog.load();

    function setText() {
        if (dog.state() != "hidden") {
            $('#chDog').html('hide dog');
        } else {
            $('#chDog').html('show dog');
        }
    }

    setDogBtnTxt = setText;

    setText();

    dog.toggle = function () {
        dog.state() != "hidden" ? dog.hide() : dog.show();
        setText();
    };

    return dog;
}

function Dog(root, controller, action) {
    var state = "visible";
    var h;
    var $dog = $('#dogh');
    var $tip = $('#tip');
    var $tipContent = $('#tipcontent');

    function load() {
        var s = storg.getItem("dogstate");
        if (s) state = s;
        changeStateTo(state);
        awem.dragAndDrop({
            from: $dog,
            ch: function () {
                return $dog;
            },
            cancel: function (cx) {
                return $(cx.e.target).closest($tip).length;
            },
            move: function () {
                var dl = parseFloat($dog.css('left'));
                var dt = parseFloat($dog.css('top'));
                $tip.css('left', (dl - 110) + "px").css('top', (dt - 100) + 'px');
            },
            kdh: 1
        });

        $dog.click(function () {
            if (!$dog.hasClass('awe-dragging')) {
                changeStateTo(state == "visible" ? "visiblenotip" : "visible");
            }
        }).mousedown(function (e) {
            e.stopPropagation();
        });

        $tip.click(function () {
            clearTimeout(h);
            tell();
            return false;
        }).mousedown(function (e) {
            e.stopPropagation();
        });
    }

    function changeStateTo(ns) {
        states[ns]();
        state = ns;
        storg.setItem("dogstate", state);
    }

    var times = 0;
    function tell() {
        if (state == "visible")
            awe.ajx(root + "Dog/Tell", awe.srl({ c: controller, a: action }))
                .done(function (d) {
                    $tipContent.html(d.o);
                    times++;
                    if (times < 10)
                        h = setTimeout(tell, Math.random() * 8000 + 5000);
                });
    }

    var states = {
        visible: function () {
            $dog.show();
            $tip.show();
            h = setTimeout(tell, 5000);
        },
        visiblenotip: function () {
            $dog.show();
            $tip.hide();
            clearTimeout(h);
        },
        hidden: function () {
            $dog.hide();
            $tip.hide();
            clearTimeout(h);
        }
    };

    return {
        load: load,
        hide: function () {
            changeStateTo("hidden");
        },
        show: function () {
            changeStateTo("visible");
        },
        state: function () { return state; }
    };
}

// used by the Dog
storg = function () {
    if (localStorage) return localStorage;
    var list = {};
    return {
        setItem: function (key, value) {
            list[key] = value;
        },
        getItem: function (key) {
            return list[key];
        }
    };
}();
