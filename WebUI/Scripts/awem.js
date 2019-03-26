awem = function ($) {
    var minZindex = 1;
    var maxLookupDropdownHeight = 365;
    var maxDropdownHeight = 420;
    var menuMinh = 200;
    var comboMinh = 100;
    var cacheLimit = 1000;
    var popSpace = 20;
    var popTopSpace = 0;
    var clickOutSpace = 35;
    var hpSpace = popSpace / 2;
    var reverseDefaultBtns;
    var closePopOnOutClick = 0;
    var $doc = $(document);
    var $win = $(window);

    var keyEnter = 13;
    var keySpace = 32;
    var keyUp = 38;
    var keyDown = 40;
    var keyEsc = 27;
    var keyTab = 9;
    var keyBackspace = 8;
    var keyShift = 16;
    var keyCtrl = 17;

    // keys you can type without opening menu dropdown
    // left arrow, ..., pgup, pgdn, end, home
    var nonOpenKeys = [keyEnter, keyEsc, keyShift, 37, 39, keyTab, keyCtrl, 33, 34, 35, 36]; // keys that won't open the menu

    var updownKeys = [keyUp, keyDown];

    // down and up arrow, enter, esc, shift //, left arrow, right arrow
    var controlKeys = [keyUp, keyDown, keyEnter, keyEsc, keyShift];

    var nonComboSearchKeys = updownKeys.concat(nonOpenKeys);


    var isMobile = function () { return awem.isMobileOrTablet(); };

    var saweload = 'aweload';
    var sawebeginload = 'awebeginload';
    var sawecolschange = 'awecolschanged';
    var saweinit = 'aweinit';
    var sawerowch = 'awerowch';
    var saweinl = 'aweinline';
    var saweinlsave = saweinl + 'save';
    var saweinlinv = saweinl + 'invalid';
    var saweinledit = saweinl + 'edit';
    var saweinlcancel = saweinl + 'cancel';
    var sawerowc = '.awe-row';
    var saweselected = 'awe-selected';
    var sawecollapsed = 'awe-collapsed';
    var saweselectedc = '.' + saweselected;
    var sawegridcls = '.awe-grid';
    var sawecontentc = '.awe-content';
    var sddpOutClEv = 'mousedown.ddp';//keyup.ddp
    var sfocus = 'focus';
    var smousemove = 'mousemove';
    var soddDocClEv = 'mouseup touchstart keydown';
    var smouseleave = 'mouseleave';
    var sdisabled = 'disabled';
    var sheight = 'height';
    var sminw = 'min-width';
    var se = '';
    var sclick = 'click';
    var schange = 'change';
    var skeyup = 'keyup';
    var skeydown = 'keydown';
    var smodel = 'model';
    var sposition = 'position';
    var snewrow = 'o-glnew';
    var sglrow = 'o-glrow';
    var schked = 'o-chked';
    var sglrowc = '.' + sglrow;
    var szindex = 'z-index';
    var sselected = 'selected';
    var sselectedc = '.' + sselected;
    var loadingHtml = rdiv('awe-loading', '<span/>');
    var sclosespan = '<span class="o-cls">&times;</span>';
    var scaret = '<span class="o-slbtn"><i class="o-caret"></i></span>';
    var soldngp = 'o-ldngp';
    var soldngpc = '.' + soldngp;
    var snbsp = '&nbsp;';
    var sstate = 'state';
    var svalc = '.o-v';

    var cache = {};
    var dpop = {};
    var dmenus = {};
    var tabbable = awe.tabbable;
    var identity = 0;

    $(function () {
        if (minZindex == 1) {
            var nav = $('.navbar-fixed-top:first');
            if (nav.length) {
                minZindex = nav.css(szindex);
            }
        }
    });

    function isEmp(v) {
        return isNull(v) || v == se;
    }

    function isNull(v) {
        return v === null || v === undefined;
    }

    function empf() { }

    function cd() {
        return awem.clientDict;
    }

    function kp(item) {
        return item.k;
    }

    function cp(item) {
        return item.c;
    }

    function which(e) {
        return e.which;
    }

    function istrg(e, sel) {
        return $(e.target).closest(sel).length;
    }

    function format(s, args) {
        return s.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
      ? args[number]
      : match;
        });
    };

    function rbtn(cls, cont, attr) {
        if (isNull(attr)) attr = se;
        return '<button type="button" class="' + cls + '" ' + attr + '>' + cont + '</button>';
    }

    function rdiv(cls, cont, attr) {
        if (isNull(cont)) cont = se;
        if (isNull(attr)) attr = se;
        return '<div class="' + cls + '" ' + attr + '>' + cont + '</div>';
    }

    function toUpperFirst(s) {
        return s.substr(0, 1).toUpperCase() + s.substr(1);
    }

    function toLowerFirst(s) {
        return s.substr(0, 1).toLowerCase() + s.substr(1);
    }

    function containsVal(itemK, vals) {
        for (var i = 0; i < vals.length; i++) {
            if (itemK == escape(vals[i])) {
                return 1;
            }
        }

        return 0;
    }

    function getIxInArray(val, vals) {
        var res = -1;
        for (var i = 0; i < vals.length; i++) {
            if (val == vals[i]) {
                res = i;
                break;
            }
        }

        return res;
    }

    function loopTrees(items, func1) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (func1(item)) {
                return 1;
            }

            if (item.it) {
                if (loopTrees(item.it, func1)) return 1;
            }
        }
    }

    function loopTreesRoot(items, func1, root) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (func1(item, root)) {
                return 1;
            }

            if (item.it) {
                if (loopTreesRoot(item.it, func1, root || item)) return 1;
            }
        }
    }

    function contains(key, keys) {
        return $.inArray(key, keys) != -1;
    }

    function strContainsi(c, squeryUp) {
        return (c || se).toString().toUpperCase().indexOf(squeryUp) != -1;
    }

    function strStartsi(c, squeryUp) {
        return (c || se).toString().toUpperCase().substring(0, squeryUp.length) == squeryUp;
    }

    function strEqualsi(c, squeryUp) {
        return (c || se).toString().toUpperCase() == squeryUp;
    }

    function pickAvEl(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length) {
                return arr[i];
            }
        }
    }

    function setDisabled(o, s) {
        if (s) {
            o.attr(sdisabled, sdisabled);
        } else {
            o.removeAttr(sdisabled);
        }
    }

    function prevDef(e) {
        e.preventDefault();
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        '"': '&quot;',
        "'": "&#39;",
        ">": "&gt;"
    };

    function escape(str) {
        return String(str).replace(/[&<>"']/g, function (s) {
            return entityMap[s];
        });
    }

    function toStr(v) {
        return isNull(v) ? se : v.toString();
    }

    function replaceAll(str, src, repl) {
        return str.split(src).join(repl);
    }

    function unesc(str) {
        str = toStr(str);
        for (var key in entityMap) {
            if (entityMap.hasOwnProperty(key)) {
                str = str.split(entityMap[key]).join(key);
            }
        }
        return str;
    }

    function outerh(sel, m) {
        return sel.length ? sel.outerHeight(!!m) : 0;
    }

    function readTag(o, prop, nullVal) {
        var res = nullVal;

        if (o.tag && o.tag[prop] != null) {
            res = o.tag[prop];
        }

        return res;
    }

    function dapi(o) {
        return o.data('api');
    }

    function dto(o) {
        return o.data('o');
    }

    function getZIndex(el) {
        var val = el.css(szindex);
        if (val && val > 0) return val;
        var parent = el.parent();
        return parent && !parent.is($('body')) ? getZIndex(parent) : 0;
    }

    function calcZIndex(zIndex, el) {
        if (zIndex < minZindex) zIndex = minZindex;
        var zi = getZIndex(el);
        if (zi && zi > zIndex) {
            zIndex = zi;
        }

        return zIndex;
    }

    function datesDif(d1, d2) {
        return d1.getTime() != d2.getTime();
    }

    function isPosFixed(elm) {
        if (!elm || !elm.length || elm.is('body')) return 0;

        if (elm.css('position') == 'fixed') {
            return 1;
        }

        return isPosFixed(elm.parent());
    }

    function setGridHeight(grid, newh) {
        var go = dto(grid);
        if (go && grid.is(':visible') && go.h != newh) {
            go.h = newh;
            dapi(grid).lay();
        }
    }

    function scrollTo(focused, cont) {
        function y(o) {
            return o.offset().top;
        }

        var fry = y(focused);
        var fh = focused.height();
        var conh = cont.height();
        var miny = y(cont);
        var maxy = miny + conh - fh;
        var scrcont = cont;
        var winmax = $win.height() + $doc.scrollTop() - fh;
        var winmin = $doc.scrollTop();

        if (maxy > winmax && winmax < fry) {
            maxy = winmax;
            scrcont = $win;
        }

        if (miny < winmin && winmin > fry) {
            miny = winmin;
            scrcont = $win;
        }

        var delta = fry < miny ? fry - miny : fry > maxy ? fry - maxy : 0;

        // +1 for ie and ff 
        if (delta > fh + 1 && scrcont != $win) {
            delta += conh / 2;
        }

        scrcont.scrollTop(scrcont.scrollTop() + delta);
    }

    function disbAttr(o) {
        return o.enb ? se : ' disabled="disabled"';
    }

    function initgridh(grid) {
        var o = dto(grid);
        o.h = o.ih;
        dapi(grid).lay();
    }

    function cdelta(grid, val) {
        grid.trigger(sawerowch, val);
    }

    function movedGridRow(fromgrid, togrid) {
        dto(togrid).lrso = 1;
        dto(fromgrid).lrso = 1;
        cdelta(togrid, 1);
        cdelta(fromgrid, -1);
        if (!fromgrid.find(sawerowc).length && dto(fromgrid).lrs.pc > 1) {
            dapi(fromgrid).load();
        }
    }

    function year(date) {
        return date.getFullYear();
    }

    var formf = {
        'd': function (d) {
            return d.getDate();
        },
        'dd': function (d) {
            return addZero(d.getDate());
        },
        'm': function (d) {
            return d.getMonth() + 1;
        },
        'mm': function (d) {
            return addZero(d.getMonth() + 1);
        },
        'yy': function (d) {
            return year(d);
        },
        'y': function (d) {
            return year(d).toString().substr(2);
        }
    };

    function mparsf(prop, maxlen, reqlen, customf) {
        return function (s, r, baseDate) {
            s = s.trim();
            if (baseDate) {
                if (s.length > maxlen) {
                    s = s.substr(0, maxlen);
                }

                if (!s.length || reqlen && s.length != reqlen) {
                    return;
                }
            }
            
            if (s.indexOf('.') > -1) r.c = 1;

            var n = Number(s);

            if (customf) {
                n = customf(n);
            }

            r[prop] = n;
        }
    }

    function yf(n) {
        if (n > 99) return null;
        if (n > 50) n += 1900;
        else n += 2000;
        return n;
    }

    var parsf = {
        'd': mparsf('d', 2),
        'dd': mparsf('d', 2),
        'm': mparsf('m', 2),
        'mm': mparsf('m', 2),
        'yy': mparsf('y', 4, 4),
        'y': mparsf('y', 2, 0, yf)
    };

    function parseDate(frmt, value, baseDate, mind, maxd) {
        if (!value) return baseDate;
        function getHead(s) {
            var i = 2;
            while (i) {
                var h = takeh(s, i);
                var pfunc = formf[h];
                if (pfunc) {
                    return h;
                }
                i--;
            }
        }

        var mis = 0;
        var res = {};
        while (frmt) {
            var head = getHead(frmt);

            if (head) {
                frmt = frmt.substr(head.length);
                var str;

                if (frmt) {
                    // get the str to convert
                    var nextHead = getHead(frmt);
                    var sepix;
                    if (!nextHead) {
                        var sep = frmt[0];
                        sepix = value.indexOf(sep);
                    } else {
                        sepix = 2;
                        if (head == 'yy')
                            sepix = 4;
                    }

                    if (sepix == -1) {
                        mis = 1;
                        break;
                    }

                    str = value.substr(0, sepix);
                    value = value.substr(sepix + 1);
                }
                else {
                    str = value;
                }

                if (str == se) {
                    mis = 1;
                    break;
                }

                parsf[head](str, res, baseDate);

            } else {
                frmt = frmt.substr(1);
            }
        }

        if (mis || res.c) {
            return 0;
        }

        if (baseDate) {
            if (isNull(res.y)) res.y = year(baseDate);
            if (isNull(res.m) || res.m > 12 || res.m < 1) res.m = baseDate.getMonth() + 1;
            var maxDate = new Date(res.y, res.m, 0).getDate();
            if (isNull(res.d) || res.d < 1 || res.d > maxDate) res.d = baseDate.getDate();
        }

        var newDate = new Date(res.y, res.m - 1, res.d);
        
        if (!baseDate) {
            if (year(newDate) != res.y || newDate.getMonth() != res.m - 1) return 0;
        }

        if (mind && newDate < mind) {
            newDate = cdate(mind);
        }
        else if (maxd && newDate > maxd) {
            newDate = cdate(maxd);
        }

        return newDate;
    }

    function cdate(d) {
        return d ? new Date(d) : new Date();
    }

    function lastDayOfMonth(d) {
        var nd = cdate(d);
        nd.setMonth(d.getMonth() + 1);
        nd.setDate(0);
        return nd;
    }

    function formatDate(dfrm, date) {
        var res = '';
        while (dfrm) {
            var i = 2;
            while (i) {
                var h = takeh(dfrm, i);
                var pfunc = formf[h];
                if (pfunc) {
                    res += pfunc(date);
                    dfrm = dfrm.substr(h.length);
                    break;
                }
                i--;
            }

            if (!i) {
                res += dfrm.substr(0, 1);
                dfrm = dfrm.substr(1);
            }
        }

        return res;
    }

    function takeh(str, len) {
        return str.substr(0, len);
    }

    function addZero(val) {
        if (val.toString().length < 2) {
            val = '0' + val;
        }

        return val;
    }

    function itmFromLi(items, li, newVal) {
        function gitem(indxs, items) {
            if (indxs.length == 1) {
                if (newVal) {
                    items[indxs[0]] = newVal;
                }

                return items[indxs[0]];
            }

            var i = indxs.shift();
            items[i].cl = 0; // expand node
            return gitem(indxs, items[i].it);
        }

        var dindx = li.data('index');
        var item;
        if (dindx.split) {
            var indxs = dindx.split(',');
            item = gitem(indxs, items);
        } else {
            item = items[dindx];
        }

        return item;
    }

    function layDropdownPopup2(o, pop, isFixed, capHeight, opener, setHeight, keepPos, canShrink, chkfulls, minh, popuph, maxph, popup, xy, postop, minbotd) {
        var scrolltop = $win.scrollTop();

        var opTop, opOutHeight = 0, opLeft, opOutWidth = 0;
        if (xy) {
            opener = 1;
            opTop = xy.y + scrolltop;
            opLeft = xy.x + $win.scrollLeft();
        } else if (opener) {
            opTop = opener.offset().top;
            opOutHeight = opener.outerHeight();
            opLeft = opener.offset().left;
            opOutWidth = opener.outerWidth(true);
        }

        if (!keepPos) {
            pop.css('left', 0);
            pop.css('top', 0);
        }

        var winh = $win.height();
        var winw = $win.width();

        var maxw = winw - popSpace;

        var mnw = Math.min(pop.outerWidth(), maxw);

        pop.css('min-height', se);
        pop.css(sheight, se);
        pop.css('max-width', maxw);
        pop.css(sminw, canShrink ? se : mnw);
        pop.css(sposition, se);


        var toppos;
        var left;

        var topd = scrolltop;

        if (opener) {
            topd = opTop;
            capHeight = capHeight || opOutHeight;
        }

        // handle opener overflow
        var botoverflow = topd - (winh + scrolltop);
        if (botoverflow > 0) {
            topd -= botoverflow;
        }

        var topoverflow = scrolltop - (topd + capHeight);

        if (topoverflow > 0) {
            topd += topoverflow;
        }

        var top = topd - scrolltop;
        var bot = winh - (top + capHeight);

        // adjust height
        var poph = popuph || pop.outerHeight();

        if (!o.maxph) o.maxph = poph;
        else if (o.maxph > poph) poph = o.maxph;
        else o.maxph = poph;

        var autofls = chkfulls(poph);

        var valign = 'bot';
        if (autofls) {
            isFixed = 1;
        } else {
            var maxh = 0;
            if (opener) {
                var stop = top - hpSpace;
                var sbot = bot - hpSpace;
                maxh = sbot;

                if (minh > poph) minh = poph;

                if (sbot > poph || minbotd && (sbot > minbotd)) {
                    valign = 'bot';
                } else if (stop > sbot) {
                    valign = 'top';
                    if (poph > stop) {
                        poph = stop;
                    }

                    maxh = stop;
                } else {
                    poph = sbot;
                }

                if (poph < minh) {
                    maxh = poph = minh;
                }

                if (maxph && poph > maxph) {
                    poph = maxph;
                }

                if (poph > winh - popSpace) {
                    maxh = poph = winh - popSpace;
                }
            } else {
                maxh = winh - popSpace;
                if (postop) {
                    maxh -= popTopSpace;
                }
            }

            setHeight(poph, maxh, valign);
        }

        if (popup) {
            popup.trigger('aweresize');
        }

        if (isFixed) {
            topd = top;
            pop.css(sposition, 'fixed');
        }

        var w = pop.outerWidth(true);
        var h = pop.outerHeight(true);
        if (o.avh) h = o.avh + o.nph;

        if (opener) {
            left = opLeft;
            var lspace = winw - (left + w);
            if (lspace < 0) {

                var ow = opOutWidth;
                if (ow < w)
                    left -= (w - ow);

                if (left < 10) {
                    left = 10;
                }
            }

            if (autofls) {
                left = toppos = hpSpace;
            }
            else if (bot < h + hpSpace && (top > h + hpSpace || top > (bot))) {
                //top
                toppos = topd - h;

                if (top < h) {
                    toppos = topd - top;
                    if (h + hpSpace < winh) toppos += hpSpace;
                }
            } else {
                //bot
                toppos = topd + capHeight;

                if (bot < h + hpSpace) {

                    toppos -= (h - bot);

                    if (h + hpSpace < winh) toppos -= hpSpace;
                }
            }
        } else {
            if (postop) {
                toppos = hpSpace + popTopSpace;
            } else {
                var diff = winh - h;
                toppos = diff / 2;
                if (diff > 200) toppos -= 45;
            }

            left = Math.max((winw - pop.outerWidth()) / 2, 0);
        }

        if (!keepPos || autofls) {
            pop.css('left', left);
            pop.css('top', Math.floor(toppos));
        }
    }

    function buttonGroupRadio(o) {
        return nbuttonGroup(o);
    }

    function buttonGroupCheckbox(o) {
        return nbuttonGroup(o, 1);
    }

    function nbuttonGroup(o, multiple) {
        var $odisplay;

        function init() {
            $odisplay = o.mo.odisplay;
            o.f.addClass('o-btng');

            $odisplay.on(sclick, '.awe-btn', function () {
                o.api.toggleVal($(this).data('val'));
            });
        }

        function setSelectionDisplay() {
            var val = awe.val(o.v);

            var items = se;
            $.each(o.lrs, function (index, item) {
                var selected = containsVal(kp(item), val) ? saweselected : "";
                items += rbtn('awe-btn awe-il ' + selected, cp(item), 'data-index="' + index + '" data-val="' + kp(item) + '"');
            });

            $odisplay.html(items);
        }

        function setSelectionDisplayChange() {
            var vals = awe.val(o.v);
            $odisplay.children(saweselectedc).removeClass(saweselected);
            $.each(vals, function (i, v) {
                $odisplay.children().filter(function () {
                    return $(this).data('val') == v;
                }).addClass(saweselected);
            });
        }

        var opt = {
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplayChange,
            init: init,
            multiple: multiple,
            noMenu: 1
        };

        return odropdown(o, opt);
    }

    function multiselb(o) {
        o.d.addClass("multiselb");
        function renderCaption() {
            return o.mo.inlabel;
        }

        return odropdown(o, {
            multiple: 1,
            renderCaption: renderCaption
        });
    }

    function multiselect(o) {
        var $multi = $(rdiv('o-mltic'));
        var $searchtxt = $('<input type="text" class="o-src awe-il awe-txt" id="' + o.i + '-awed" autocomplete="off" ' + disbAttr(o) + '/>');
        var $caption = $('<span class="o-cptn"></span>');
        var glrs, api, comboPref, vprop, dropmenu, dd;
        var isCombo = readTag(o, "Combo");
        var searchOutside = !isMobile() || isCombo;
        var ddopt = {};

        o.d.addClass("o-mltsl");
        var reor = readTag(o, "Reor");

        if (searchOutside)
            $multi.append($searchtxt);

        $multi.prepend($caption);

        function init() {
            dd = o.mo.dd;
            dropmenu = dd.menu;
            comboPref = o.mo.cp;
            vprop = o.mo.vprop;
            o.mo.odisplay.append($multi);
            $caption.html(o.mo.caption);

            if (searchOutside) {
                o.mo.srctxt = $searchtxt;
            }

            api = o.api;
            glrs = api.glrs;
        }

        function setCaption(hide) {
            if (hide) {
                $caption.hide();
            } else {
                $caption.show();
            }
        }

        function renderSel(vals) {
            // add multiRem for vals
            var items = se;
            var lrs = glrs();
            $.each(vals, function (_, val) {
                var found = 0;
                loopTrees(lrs, function (item) {
                    if (item[vprop] == escape(val)) {
                        items += renderSelectedItem(item);
                        found = 1;
                        return 1;
                    }
                });

                if (!found) {
                    var con = val;

                    if (isCombo && con.match('^' + comboPref)) {
                        con = con.replace(comboPref, se);
                    }

                    items += renderSelectedItem({ k: val, c: escape(con) });
                }
            });

            if (searchOutside) {
                $searchtxt.val(se);
                autoWidth($searchtxt);
                $searchtxt.before(items);
            } else {
                $multi.append(items);
            }

            var count = $multi.find('.o-mlti').length;

            if (!count && searchOutside) {
                $searchtxt.width(0);
            }

            setCaption(count);
        }

        var setSelectionDisplay = function () {
            $multi.find('.o-mlti').remove();

            renderSel(awe.val(o.v));
        };

        function setSelectionDisplayChange() {
            var vals = awe.val(o.v);

            // remove keys
            $multi.find('.o-mltrem').each(function () {
                var val = $(this).parent().data('val');
                var indexFound = getIxInArray(val, vals);
                if (indexFound > -1) {
                    // remove from vals
                    vals.splice(indexFound, 1);
                } else {
                    $(this).parent().remove();
                }
            });

            renderSel(vals);
        }

        function autoWidth(input) {
            input.css('width', Math.min(Math.max((input.val().length + 2) * 10, 21), $multi.width()) + 'px');
        }

        function renderSelectedItem(item) {
            return rdiv('o-mlti awe-il awe-btn',
                '<span class="o-mltcptn">' + opt.renSelCap(item) + '</span><span class="o-mltrem">&times;</span>',
                'data-val="' + escape(item[vprop]) + '"');
        }

        function postSearchFunc(k) {
            if (!contains(k, nonComboSearchKeys) && searchOutside) {
                if (!dropmenu.find(svalc + ':visible').length) {
                    dd.close();
                } else {
                    if (!(!$searchtxt.val() && k == keyBackspace)) {
                        dd.open();
                    }
                }
            }
        }

        function addComboVal(val) {
            var itemFound;
            var valu = val.toUpperCase();

            loopTrees(glrs(), function (item) {
                if (strEqualsi(cp(item), valu)) {
                    itemFound = item;
                    val = item[vprop];
                    return 1;
                }
            });

            if (!itemFound) val = comboPref + val;

            api.toggleVal(val, 1);
        }

        if (searchOutside) {
            $searchtxt.on(skeyup, function (e) {
                var k = which(e);
                if (!dropmenu.hasClass('open') && !contains(k, nonOpenKeys)) {
                    if (!(k == keyBackspace && !$searchtxt.val())) {
                        dd.open();
                    }
                }

                if (isCombo && k == keyEnter) {
                    var stval = $searchtxt.val();
                    if (stval) {
                        addComboVal(stval);
                        $searchtxt.val(se);
                    }
                }
            }).on(skeydown, function (e) {
                if (which(e) == keyBackspace && !$searchtxt.val()) {
                    $multi.find('.o-mltrem:last').click();
                }

                if (which(e) == keyEnter) {
                    prevDef(e);
                }

                autoWidth($searchtxt);
            }).on('focusin', function () {
                setCaption(1);
                autoWidth($(this));
            }).on('focusout', function () {
                $searchtxt.val(se).change();
                o.needrend = 1;
                if (!$multi.children('.o-mlti').length) {
                    setCaption();
                }

                $searchtxt.width(20);
            });
        }

        $multi.on(sclick, function (e) {
            if (!o.enb) return;
            if (!$(e.target).is('.o-mltrem')) {
                dd.open();

                searchOutside
                    && !(isMobile() && $(e.target).closest('.o-mlti').length)
                    && $searchtxt.width(1).focus(); // width 1 for focus on mobile 
                dd.lay();
            }
        });

        $multi.on(sclick, '.o-mltrem', function (e) {
            if (!o.enb) return;
            var it = $(this);
            var val = it.parent().data('val');
            it.attr('awepid', o.i);
            api.toggleVal(unesc(val), null, 1);
            dd.close();
            searchOutside && $searchtxt.focus();
        });

        if (reor) {
            function drop(cx) {
                var drgo = cx.drgo;
                cx.plh.after(drgo).remove();
                api.moveVal(drgo.data('val'), drgo.prev().data('val'));
                drgo.show();
            }

            dragReor({
                from: $multi,
                sel: '.o-mlti',
                tof: function () {
                    return [$('body')];
                },
                gcon: function () { return $multi; },
                plh: 'awe-hl',
                cancel: function () { return !o.enb; },
                splh: 1,
                dropFunc: drop
            });
        }

        ddopt.afls = !isCombo;
        ddopt.psf = postSearchFunc;
        ddopt.noAutoSearch = searchOutside;
        ddopt.naa = 1;

        if (searchOutside) ddopt.srctxt = $searchtxt;

        var opt = {
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplayChange,
            init: init,
            multiple: 1,
            prerender: function () { },
            combo: isCombo,
            d: ddopt
        };



        return odropdown(o, opt);
    }

    function colorDropdown(o) {
        var caption;

        function init() {
            caption = o.mo.caption;
        }

        o.d.addClass("o-cldd");

        o.df = function () {
            return $.map(['#5484ED', '#A4BDFC', '#7AE7BF', '#51B749', '#FBD75B', '#FFB878', '#FF887C', '#DC2127', '#DBADFF', '#E1E1E1'],
                function (item) { return { k: item, c: item }; });
        };

        var renderCaption = function (selected) {
            var sel = caption;
            if (selected.length) {
                var color = kp(selected[0]);
                sel = '<div style="background:' + color + '" class="o-color">' + snbsp + '</div>';
            }

            return sel;
        };

        var renderItemDisplay = function (item) {
            return '<span class="o-clitm" style="background:' + kp(item) + '">' + snbsp + '</span>';
        };

        var opt = {
            renderCaption: renderCaption,
            init: init,
            menuClass: "o-clmenu",
            d: {
                renderItemDisplay: renderItemDisplay,
                noAutoSearch: 1
            }
        };

        odropdown(o, opt);
    }

    function imgItem(item) {
        return rdiv('o-igit', (item.url ? '<img src="' + item.url + '"/> ' : '') + cp(item));
    }

    function imgDropdown(o) {
        var caption;
        o.d.addClass('o-igdd');

        function init() {
            caption = o.mo.caption;
        }

        var opt = {
            menuClass: "o-igmenu",
            init: init,
            renderCaption: function (selected) {
                var sel = caption;
                if (selected.length)
                    sel = '<img src="' + selected[0].url + '"/>' + cp(selected[0]);
                return sel;
            },
            d: {
                renderItemDisplay: imgItem
            }
        };

        odropdown(o, opt);
    }

    function timepicker(o) {
        o.f.addClass("o-tmp");

        function pad(num) {
            var s = "00" + num;
            return s.substr(s.length - 2);
        }

        o.df = function () {
            var step = readTag(o, "Step") || 30;
            var items = [];
            var ampm = o.tag.AmPm;
            for (var i = 0; i < 24 * 60; i += step) {
                var apindx = 0;
                var hour = Math.floor(i / 60);
                var minute = i % 60;

                if (ampm) {

                    if (hour >= 12) {
                        apindx = 1;
                    }

                    if (!hour) {
                        hour = 12;
                    }

                    if (hour > 12) {
                        hour -= 12;
                    }
                }

                var item = ampm ? hour : pad(hour);

                item += ":" + pad(minute);

                if (ampm) item += " " + ampm[apindx];

                items.push(item);
            }

            return $.map(items, function (v) { return { k: v, c: v }; });
        };

        return combobox(o);
    }

    function combobox(o) {
        o.d.addClass('combobox');

        var $v = o.v;
        var disb = disbAttr(o);
        var cmbtxt = $('<input type="text" class="awe-txt o-cbxt o-src" size="1" autocomplete="off" id="' + o.i + '-awed" ' + disb + ' />');
        var $openbtn = $(rbtn('o-cbxbtn o-ddbtn awe-btn o-btn', scaret, 'tabindex="-1"' + disb));
        var docClickReg = 0;
        var glrs;
        var clsEmptQuery = readTag(o, "ClsEq");
        var searchOnFocus = readTag(o, "Sof");
        var api, dd, dropmenu;
        var vprop;
        var contval = se;

        function init() {
            o.mo.odisplay.append(cmbtxt).append($openbtn);
            vprop = o.mo.vprop;
            cmbtxt.attr('placeholder', o.mo.caption);
            api = o.api;
            glrs = api.glrs;
            dd = o.mo.dd;
            dropmenu = dd.menu;
        }

        function setSelectionDisplay() {
            var vals = awe.val($v);

            var selected = [];

            function f1(item) {
                if (containsVal(item[vprop], vals) && !item.nv) {
                    selected = [item];
                    return 1;
                }
            };

            loopTrees(glrs(), f1);

            var txtval = se;
            if (!selected.length && vals.length) {
                txtval = vals[0];
            }
            else if (selected.length) {
                txtval = unesc(cp(selected[0]));
            }

            cmbtxt.val(txtval);
        }

        function onDocClick(e) {
            var trg = $(e.target);

            if (!trg.closest(dropmenu).length &&
                !trg.closest(o.d).length &&
                trg.closest('[awepid]').attr('awepid') != o.i) {

                // js click while focused won't loose txt focus

                compval();
                checkComboval();
                docClickReg = 0;

                if ($(':focus').closest(o.d).length) return;
                $doc.off('click focusin', onDocClick);
            }
        }

        cmbtxt.on('focusin', function () {
            this.selectionStart = this.selectionEnd = this.value.length;
            if (searchOnFocus) {
                setTimeout(function () { cmbtxt.select(); }, 10);
            }

            if (!docClickReg) {
                $doc.on('click focusin', onDocClick);
                docClickReg++;
            }
        }).on(skeydown, function (e) {
            if (which(e) == keyEnter && !dd.isOpen()) {
                prevDef(e);
                checkComboval();
            }
        }).on(skeyup, function (e) {
            var key = which(e);
            if (!dd.isOpen()) {
                if (contains(key, updownKeys)) {
                    dd.open();
                }

                if (key == keyEnter) {
                    checkComboval();
                }
            }
        });

        function postSearchFunc(k) {
            if (!contains(k, nonComboSearchKeys)) {
                if (!dropmenu.find(svalc + ':visible').length) {
                    dd.close();
                }

                compval();
            }
        }

        $openbtn.on(sclick, function () {
            dd.filter(se);
            if (!isMobile())
                cmbtxt.focus();
        });

        function compval() {
            var query = cmbtxt.val();
            var newVal = query;
            var cval = query;

            query = query.toUpperCase();

            loopTrees(glrs(), function (item) {
                if (strEqualsi(cp(item), query)) {
                    newVal = item[vprop];
                    cval = cp(item);
                    return 1;
                }
            });

            $v.data('comboval', newVal);
            contval = cval;
        }

        function checkComboval() {
            if (!$v.parent().length) {
                return;
            }

            var comboval = $v.data('comboval');

            if (comboval != null) {
                if (o.v.val() != comboval) {
                    api.toggleVal(comboval);
                    //cmbtxt.val(contval);
                }

                cmbtxt.val(contval);
            }
        }

        odropdown(o, {
            d: {
                noAutoSearch: 1,
                srctxt: cmbtxt,
                psf: postSearchFunc,
                afls: 0,
                ceq: clsEmptQuery,
                autosel: 1
            },
            setSel: setSelectionDisplay,
            setSelChange: setSelectionDisplay,
            combo: 1,
            init: init,
            prerender: function () { }
        });
    }

    function menuDropdown(o) {
        o.d.addClass("o-mdd");
        var opt = {
            menuClass: "o-mddm",
            noAutoSearch: 1,
            renderCaption: function () {
                return o.mo.caption;
            },
            d: {
                click: function (zev) {
                    var $trg = $(zev.target);
                    if ($trg.is(svalc)) {
                        var click = $trg.data(sclick);

                        if (click) {
                            eval(click);
                        } else {
                            var $a = $trg.find('a');
                            if ($a.length)
                                $a.get(0).click();
                        }
                    }

                    o.mo.dd.close();
                },
                renderItemDisplay: function (item) {
                    var res;
                    var href = kp(item) || item.href;
                    if (href && !item.click) {
                        res = '<a href="' + href + '">' + cp(item) + '</a>';
                    } else {
                        res = cp(item);
                    }

                    return res;
                },

                renItAttr: function (i, it) {
                    var res = ' data-index="' + i + '" ';
                    if (it.click) res += ' data-click="' + it.click + '"';
                    return res;
                }
            }
        };

        return odropdown(o, opt);
    }

    function autocomplete(o) {
        var input = $('#' + o.i);
        var propId;
        var lastVal;
        var cache = o.c;
        var dd = dropmenu({
            i: o.i, rtl: o.rtl, opener: input, srctxt: input, select: onSelect,
            sf: searchFunc, sfo: o, nacc: !cache, minl: o.minl, dl: o.dl, itemFunc: o.itemFunc,
            psf: postSearchFunc, clsempt: 1, ck: o.ck, gval: gval, nom: 1, combo: 1, ceq: 1
        });

        if (o.k) {
            propId = $('#' + o.k);
            input.on('keyup ' + schange, function () {
                if (input.val() != lastVal) {
                    propId.val(se).change();
                }
            });
        }

        function gval() {
            return input.val();
        }

        function onSelect(item) {
            var selval = unesc(item.c);
            input.val(selval).focus();

            if (propId) {
                propId.val(item.k).change();
                lastVal = selval;
            }
        }

        function postSearchFunc(k) {
            if (!contains(k, nonComboSearchKeys)) {
                if (!dd.menu.find(svalc + ':visible').length) {
                    dd.close();
                }
            }
        }

        function searchFunc(_, info) {
            var term = info.term;
            if (term.length < o.ml) return [];

            var c = info.cache;
            c.t = c.t || {}; // terms used
            c.n = c.n || []; // no result terms

            if (cache) {
                if (c.t[term]) return [];
                c.t[term] = 1;

                // ignore terms that contain nr terms
                for (var i = 0; i < c.n.length; i++) {
                    if (term.indexOf(c.n[i]) >= 0) {
                        return [];
                    }
                }
            }

            var prm = awe.params(o);
            prm.push({ name: "v", value: term });

            var f = o.df ? o.df(term, prm) : awe.ajx({ url: o.u, data: prm, o: o });
            return $.when(f).done(function (data) {
                if (!data || !data.length) {
                    c.n.push(term);
                }

                return data;
            }).fail(function () {
                c.t[term] = 0;
            });
        }

        input.keyup(function (e) {
            var key = which(e);
            if (!dd.isOpen() && contains(key, updownKeys)) {
                dd.open();
            }
        }).on(saweload, dd.cc);
    }

    function dataSource(glrs, cacheKey) {
        return {
            gc: function () {
                return cache[cacheKey];
            },
            cc: function () {
                cache[cacheKey] = null;
            },
            glr: function () {
                var lrs = glrs();
                var cacheObj = cache[cacheKey];
                if (cacheObj) {
                    var res = cacheObj.Items.slice(0);

                    for (var i = 0; i < lrs.length; i++) {
                        if (isNull(cacheObj.Keys[kp(lrs[i])])) {
                            res.push(lrs[i]);
                        }
                    }

                    return res;
                }

                return lrs;
            },
            addc: function (result, gval) {
                if (!cache[cacheKey]) cache[cacheKey] = { Items: [], Keys: {} };
                var cacheObj = cache[cacheKey];

                var keys = cacheObj.Keys;
                var items = cacheObj.Items;

                var chcount = 0;
                loopTrees(items, function () {
                    chcount++;
                });

                if (gval && chcount > cacheLimit) {
                    var vals = gval();
                    var nitems = [];
                    var nkeys = {};

                    if (vals.length) {
                        loopTreesRoot(items,
                            function (item, root) {
                                for (var j = 0; j < vals.length; j++) {
                                    if (vals[j] == item.k) {
                                        nkeys[vals[j]] = nitems.length;
                                        nitems.push(root || item);
                                        vals.splice(j, 1);
                                        break;
                                    }
                                }
                            });
                    }

                    cache[cacheKey] = { Items: nitems, Keys: nkeys }
                    keys = nkeys;
                    items = nitems;
                }

                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var key = kp(item) || cp(item);
                    if (keys[key] == null) {
                        keys[key] = items.length;
                        items.push(item);
                    } else {
                        items[keys[key]] = item;
                    }
                }
            }
        };
    }

    function dropmenu(o) {
        var srcThresh = 10;
        o.i = o.i || '__m' + identity++;
        dmenus[o.i] = o;
        var mo = o.o || {};

        var filterFunc = strContainsi;
        if (o.flts) filterFunc = strStartsi;
        var getFunc = o.getFunc;
        var searchFunc = o.sf;
        var isCombo = o.combo;
        var comboPref = o.cmbp;
        var showCmbItm = o.cmbi;
        var opener, hpos, opBtn, olc;
        var itemFunc = o.itemFunc;
        var noSelClose = o.noSelClose;
        var noAutoSearch = o.noAutoSearch;
        var vprop = o.vprop || 'k';
        var closeOnEmpty = o.clsempt;
        var maxh = o.maxh;

        var nacc = o.nacc;
        var ds = o.ds || dataSource(o.df || function () { return []; }, o.ck || o.i);
        var glrs = ds.glr;

        var isFixed = 0;
        var zIndex = minZindex;
        var asmi = o.asmi;

        if (asmi != null) {
            noAutoSearch = asmi == -1 ? 1 : 0;
            srcThresh = asmi;
        }

        var hostc = $('body');
        var srcinfo = '<li class="o-info">' + cd().SearchForRes + '</li>';
        var attr = 'tabindex="-1" data-i="' + o.i + '"';
        var modal = $(rdiv('o-pmodal o-pu', se, attr));
        var $dropmenu = $(rdiv('o-menu o-pu ' + (o.clss || se), se, attr));
        var popt;

        var $itemscont = $(rdiv('o-itsc'));
        var $menu = $('<ul class="o-mnits" tabindex="-1">' + (searchFunc ? srcinfo : se) + '</ul>');
        var slistctrl = slist($itemscont, { sel: svalc, afs: svalc + '.o-ditm', botf: botf, topf: topf });
        var autofocus = slistctrl.autofocus;

        var $menuSearchCont = $(rdiv('o-srcc ' + soldngp, '<input type="text" class="o-src awe-txt" placeholder="' + cd().Searchp + '" size="1"/>' + loadingHtml));
        var $menuSearchTxt = $menuSearchCont.find('.o-src');
        var srctxt = o.srctxt || $menuSearchTxt;
        var lastq;

        if (isMobile())
            $dropmenu.addClass('o-mobl');

        if (o.rtl) {
            $dropmenu.addClass('awe-rtl').css('direction', 'rtl');
        }

        if (o.srctxt) {
            noAutoSearch = 1;
        }

        $dropmenu.append($menuSearchCont);
        $dropmenu.append($itemscont);
        $itemscont.append($menu);
        $menuSearchCont.hide();

        o.renderItemDisplay = o.renderItemDisplay || function (item) {
            return itemFunc ? eval(itemFunc)(item) : cp(item);
        };

        o.renItAttr = o.renItAttr || function (i, it) {
            return 'data-index="' + i + '" data-val="' + it[vprop] + '"';
        }

        var getSrcTerm = o.gterm || function () {
            return srctxt.val().trim();
        }

        var onItemClick = o.click || function (e) {

            if ($(e.target).closest('.awe-cbc').length) {
                return;
            }

            var clickedItem = $(this);

            var itm = null;
            if (!clickedItem.hasClass('o-cmbi')) {
                itm = itmFromLi(glrs(), clickedItem);
            }

            var cmbival = comboPref + srctxt.val();

            o.select && o.select(itm, cmbival);

            clickedItem.attr('awepid', o.i);
            if (!noSelClose) {
                close();
            }

            $menuSearchTxt.val(se);

            if (noSelClose) {
                var index = clickedItem.data('index');
                filter(se, index);
                lay();
            }
        };

        renderMenu();

        var id = o.i + '-dropmenu';
        $('#' + id).remove();
        $('#' + id + '-modal').remove();
        $dropmenu.attr('id', id);
        modal.attr('id', id + '-modal');

        function mergeOpener(opt) {
            opener = opt.opener || opener;
            hpos = opt.hpos || hpos || opener;
            olc = opt.opnlc || olc || opener;
            opBtn = opt.fcs || opBtn || opener;
        }

        function setOpener(opt) {
            if (olc) {
                olc.off(skeydown, openerOnKeyDown);
            }

            mergeOpener(opt);
            var uidialog = 0, ddpop = 0;

            if (hpos) {
                uidialog = hpos.closest('.awe-uidialog');
                ddpop = hpos.closest('.o-pmc');
            }

            isFixed = 1;
            if (uidialog && uidialog.length) {
                hostc = uidialog;
                zIndex = hostc.css(szindex);
            } else if (hpos && hpos.parents('.modal-dialog').length) {
                hostc = hpos.closest('.modal');
                zIndex = hostc.css(szindex);
            } else if (ddpop && ddpop.length) {
                zIndex = ddpop.css(szindex);
                if (ddpop.css(sposition) != 'fixed') {
                    isFixed = 0;
                }
            } else {
                isFixed = isPosFixed(hpos);
            }

            olc && olc.on(skeydown, openerOnKeyDown);

            if (!$dropmenu.closest(hostc).length) {
                hostc.append(modal.hide());
                hostc.append($dropmenu);
            }
        }

        function openerOnKeyDown(e) {
            if (isOpen()) {
                handleMoveSelectKeys(e);
            }
        }

        setOpener(o);

        $dropmenu.on(sclick, svalc, onItemClick)
                 .on(smousemove, svalc, function () { slistctrl.focus($(this)); })
                 .on(skeydown, handleMoveSelectKeys);

        $dropmenu.on(sclick, '.o-itm .awe-cbc', function () {
            var itm = $(this).closest('.o-itm');
            var mylvl = parseInt(itm.data('lvl'), 10);
            var next = itm.next();
            var ditm = itmFromLi(glrs(), itm);

            // expand
            if (itm.hasClass(sawecollapsed)) {
                // if lazy node
                if (ditm.l) {
                    ditm.l = 0;
                    setTimeout(function () { itm.prepend(loadingHtml) }, 100);

                    // lazy request
                    $.when(getFunc(kp(ditm)))
                        .done(function (res) {
                            var lazyIt = res[0];
                            if (lazyIt) lazyIt._lz = 1;
                            itmFromLi(glrs(), itm, lazyIt);
                            filter(lastq, itm.data('index'));
                        });
                } else {
                    ditm.cl = 0;
                    itm.removeClass(sawecollapsed);
                    awe.cllp(next, mylvl, false);
                }
            } // collapse
            else {
                ditm.cl = 1;
                itm.addClass(sawecollapsed);
                awe.cllp(next, mylvl, true);
            }
        });

        function handleMoveSelectKeys(e) {
            slistctrl.keyh(e);

            if (which(e) == keyEsc) {
                $(e.target).closest('.awe-popup').data('esc', 1);
                close();
            }
        }

        srctxt.on(skeyup, srctxtKeyup);

        $win.on('resize domlay', lay);

        $dropmenu.on(skeydown, function (e) {
            if (which(e) == keyTab) {
                prevDef(e);
                tabbable(opener).focus();
            }
        });

        function destroy() {
            $dropmenu.remove();
            modal.remove();
            $win.off('resize domlay', lay);
            srctxt.off(skeyup, srctxtKeyup);
        }

        var searchTimerOn;
        var searchTimerTerm;
        var searchTimer;
        var localSearchResCount;
        var itrkc = 0;

        function srctxtKeyup(e) {
            if (!contains(which(e), nonComboSearchKeys) && !e.ctrlKey) {
                var term = getSrcTerm();

                // no search when term == -1
                if (term == -1) {
                    localSearchResCount = 0;
                    term = se;
                } else {
                    localSearchResCount = filter(term);

                    if (localSearchResCount && !o.naa) {
                        open({ nor: 1 });
                    }
                }

                // close on empty query
                if (o.ceq && !term) {
                    close();
                }
                else if (closeOnEmpty && !localSearchResCount) {
                    close();
                }

                if (searchFunc && term) {
                    if (searchTimerOn) {
                        itrkc++;
                    }

                    if (!searchTimerOn) {
                        searchTimerOn = 1;
                        searchTimerTerm = term;

                        searchTimer = setInterval(function () {
                            var newTerm = getSrcTerm();

                            if (newTerm == searchTimerTerm && !itrkc) {
                                clearInterval(searchTimer);
                                searchTimerOn = 0;

                                if (searchTimerTerm) {
                                    srctxt.closest(soldngpc).addClass('o-ldng');

                                    var nsrcfunc = o.minl && searchTimerTerm.length < o.minl
                                        ? function () { return []; }
                                        : eval(searchFunc);

                                    ds.addc([]);
                                    $.when(nsrcfunc(o.sfo,
                                        {
                                            term: searchTimerTerm,
                                            count: localSearchResCount,
                                            cache: ds.gc()
                                        }))
                                        .always(function () {
                                            srctxt.closest(soldngpc).removeClass('o-ldng');
                                        })
                                        .done(function (result) {
                                            nacc && ds.cc();
                                            ds.addc(result, o.gval);

                                            renderMenu();
                                            var term = getSrcTerm();

                                            if (term != -1) {
                                                var rescount = filter(getSrcTerm());

                                                if (!localSearchResCount && rescount) {
                                                    open({ nor: 1 });
                                                }
                                            }

                                            lay();
                                            o.psf && o.psf(which(e));
                                        });
                                }
                            }

                            searchTimerTerm = newTerm;
                            itrkc = 0;

                        },
                            o.dl || 250);
                    }
                } else {
                    o.psf && o.psf(which(e));
                }
            }
        }

        function botf() {
            var st = $itemscont.scrollTop();
            var sth = $itemscont.height();
            var h = $menu.height();
            if (sth + st < h) {
                $itemscont.scrollTop(st + 25);
            }
        }

        function topf() {
            var st = $itemscont.scrollTop();
            if (st > 0) {
                $itemscont.scrollTop(st - 25);
            }
        }

        function renderMenu() {
            var rs = glrs();

            var count = renderList(rs);

            if ((count > srcThresh || searchFunc) && !noAutoSearch) {
                $menuSearchCont.show();
            } else {
                $menuSearchCont.hide();
            }
        }

        function renderList(rs, query) {
            lastq = query;
            var unescf = function (s) { return s; }
            var itcount = 0;
            var matchFound = 0;
            var side = 'padding-' + (o.rtl ? 'right' : 'left') + ':';
            var res = '';
            var filtf = function () { return 1; };
            var eq = '';

            if (query) {
                eq = escape(query);
                var upquery = query.toUpperCase();
                if (query != eq) {
                    unescf = unesc;
                }

                filtf = function (s) {
                    return filterFunc(s, upquery);
                };
            }

            var selVal;
            if (o.gval && !o.nom) {
                selVal = o.gval();
            }

            function renderNodes(items, indx, idn, hide, lzn) {
                var res = se;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var cont = unescf(cp(item));
                    var clss = (item.cs || 'o-itm');
                    var selected = 0;
                    var collapsed = item.cl;
                    var lazy = item.l;

                    var itres = se;

                    var lazyNode = item._lz;
                    item._lz = 0;
                    if (item.it) {
                        itres = renderNodes(item.it, indx + i + ',', idn + 1, hide || collapsed && !query, lazyNode);
                    }

                    var ren = 0;

                    if (itres || !query) {
                        ren = 1;
                    }
                    else if (!item.nv && (filtf(cont) || lzn)) {
                        if (isCombo && cont.length == query.length) {
                            matchFound = 1;
                            if (o.autosel) {
                                clss += ' ' + sselected;
                                selected = 1;
                            }
                        }

                        ren = 1;
                    }

                    var attr = se;

                    if (ren) {
                        var cllp = o.clp && (itres || lazy) ? "<i class='awe-cbc'><i class='awe-ce-ico'></i></i>" : se;
                        if (collapsed) clss += ' ' + sawecollapsed;

                        if (!item.nv) {
                            clss += ' o-v';
                            if (!o.nom
                                && selVal
                                && containsVal(item[vprop], selVal)
                                && (!o.autosel || strEqualsi(cp(item), srctxt.val().toUpperCase()))) {
                                clss += ' ' + sselected;
                                selected = 1;
                            }
                        }

                        var style = se;
                        if (idn) {
                            style = side + (idn + 2) + 'em;';
                        }

                        if (selected) {
                            if (o.rtl) {
                                style += 'background-position:right ' + (idn || .5) + 'em center;';
                            }
                            else if (idn) {
                                style += 'background-position-x:' + (idn) + 'em;';
                            }
                        }

                        if (hide) {
                            style += 'display:none;';
                        }

                        if (style) {
                            attr = 'style="' + style + '" ';
                        }

                        attr += 'data-lvl="' + (idn + 1) + '" ';

                        res = res + '<li class="' + clss + ' o-ditm" ' + attr + o.renItAttr(indx + i, item) + '>'
                            + cllp + o.renderItemDisplay(item) + '</li>' + itres;
                        itcount++;
                    }
                }

                return res;
            }

            res += renderNodes(rs, se, 0);

            if (isCombo && showCmbItm && query && !matchFound) {
                res = '<li class="o-itm o-v o-cmbi" data-val="' + comboPref + query + '">' + o.renderItemDisplay({ c: eq, k: eq }) + '</li>' + res;
            }

            if (!rs.length) {
                res += '<li class="o-empt">(' + cd().Empty + ')</li>';
            }

            if (searchFunc && !query) {
                res += srcinfo;
            }

            $menu.html(res);
            return itcount;
        }

        function docClickHandler(e) {
            if (istrg(e, '.o-pmodal') && e.type == 'touchstart') return;

            if (!istrg(e, olc) && !istrg(e, $dropmenu)) {
                close();
                if (istrg(e, '.o-pmodal')) {
                    o.mdcls && o.mdcls();
                }
            }
        };

        function close() {
            if (isOpen()) toggleOpen();
        }

        function open(opt) {
            if (!isOpen()) toggleOpen(opt);
        }

        function isOpen() {
            return $dropmenu.hasClass('open');
        }

        function toggleOpen(opt) {
            popt = opt;
            if (opt) {
                setOpener(opt);
            }

            opt = opt || {};
            $dropmenu.toggleClass('open');
            if (isOpen()) {
                o.maxph = 0;

                if (hpos && zIndex) {
                    zIndex = calcZIndex(zIndex, hpos);
                }

                opBtn && opBtn.addClass('awe-focus');

                if (zIndex) {
                    modal.css(szindex, zIndex + 1);
                    $dropmenu.css(szindex, zIndex + 1);
                }

                $doc.on(soddDocClEv, docClickHandler);

                // render for searchfunc cache merging
                if (ds.gc() && !opt.nor || mo.needrend) {
                    renderMenu(opt);
                    mo.needrend = 0;
                }

                $dropmenu.show();

                lay();

                if (!(noAutoSearch || isMobile())) {
                    $menuSearchTxt.focus();
                }

                autofocus();

                dpop[o.i] = hpos;
            } else {
                opBtn && opBtn.removeClass('awe-focus');
                $dropmenu.hide();
                modal.hide();
                $doc.off(soddDocClEv, docClickHandler);

                if ($menuSearchTxt.val() && lastq) {
                    $menuSearchTxt.val(se);

                    // reset search
                    filter(se);
                }
            }
        }

        function lay() {
            var maxpoph = maxh || maxDropdownHeight;
            if (maxh == 0) maxpoph = $(window).height();

            if (!$dropmenu.hasClass('open')) return;

            var oitemsc = $dropmenu.find('.o-itsc');
            var oitemscst = oitemsc.scrollTop();

            oitemsc.css('max-height', maxpoph + 'px');
            //oitemsc.css('max-height', se);
            oitemsc.css(sheight, se);
            $dropmenu.css('width', se);

            var minw = o.minw || 0;

            if (opener && !(popt && popt.xy)) {
                minw = Math.max(opener.outerWidth(), minw);
            }

            if (minw)
                $dropmenu.css(sminw, minw + 'px');

            function chkfulls(height) {
                var winw = $win.width();
                var winh = $win.height();
                var limh = 300;
                var limw = 200;
                if (!isCombo && o.afls) {
                    if (height > winh - limh - popSpace && $dropmenu.width() > winw - limw - popSpace) {
                        $dropmenu.width(winw - popSpace);
                        setHeight(0, winh - popSpace - clickOutSpace, 'fls');

                        modal.show();
                        return 1;
                    } else {
                        modal.hide();
                    }
                }
            }

            function setHeight(poph, maxh, valign) {
                var rest = $dropmenu.outerHeight() - oitemsc.height();

                if (valign == 'top') {
                    oitemsc.css(sheight, poph - rest);
                } else {
                    var h = maxh - rest;
                    if (valign != 'fls') {
                        h = Math.min(h, maxpoph);
                    }

                    h && oitemsc.css('max-height', h);
                }
            }

            layDropdownPopup2(o, $dropmenu, isFixed, null, olc, setHeight, 0, 0, chkfulls, isCombo ? comboMinh : menuMinh, 0, maxpoph, 0, popt && popt.xy, 0, 0);

            oitemsc.scrollTop(oitemscst);
        }

        function filter(query, index, noautofocus) {
            var items = glrs();

            var count = renderList(items, query);

            var focitem = index ? $menu.find('[data-index="' + index + '"]') : null;

            if (!noautofocus) {
                autofocus(focitem);
            }

            return count;
        }

        function clearc() {
            ds.cc();
            renderMenu();
        }

        var api = {
            cc: clearc,
            filter: filter,
            open: open,
            topen: toggleOpen,
            close: close,
            isOpen: isOpen,
            menu: $dropmenu,
            render: renderMenu,
            destroy: destroy,
            lay: lay
        };

        return api;
    }

    function odropdown(o, opt) {
        opt = opt || {};

        var inlabel = readTag(o, 'InLabel', se);
        var caption = readTag(o, 'Caption', cd().Select);
        var autoSelectFirst = readTag(o, 'AutoSelectFirst');
        var minWidth = readTag(o, 'MinWidth');
        var cacheKey = readTag(o, 'Key', o.i);
        var captionFunc = readTag(o, 'CaptionFunc');
        var useConVal = readTag(o, 'UseConVal');
        var comboPref = readTag(o, 'GenKey') ? '__combo:' : se;
        var openOnHover = readTag(o, "Ohover");
        var noSelClose = readTag(o, 'NoSelClose');
        var clearCacheOnLoad = !readTag(o, 'Ncc');
        var btn = $(rbtn('o-ddbtn o-btn awe-btn"', scaret, 'id="' + o.i + '-awed"' + disbAttr(o)));
        var $odropdown = $(rdiv('o-dd'));
        var $odisplay = $(rdiv('o-disp ' + soldngp, loadingHtml));
        var $valCont = $(rdiv('valCont')).hide();
        var btnCaption = $(rdiv('o-cptn', inlabel + caption));

        var vprop = useConVal ? 'c' : 'k';
        var valInputType = opt.multiple ? "checkbox" : "radio";

        var ds = dataSource(function () { return o.lrs; }, cacheKey);
        var glrs = ds.glr;
        var isCombo = opt.combo;

        var api = o.api;
        api.render = render;
        api.glrs = glrs;
        api.toggleVal = toggleVal;
        api.moveVal = moveVal;
        var fcs = opt.d ? null : btn;

        var d = {
            i: o.i,
            rtl: o.rtl,
            opener: $odropdown,
            ds: ds,
            sfo: o,
            select: onSelect,
            cmbp: comboPref,
            sf: readTag(o, 'SrcFunc'),
            nacc: readTag(o, 'Nc'),
            getFunc: getFunc,
            cmbi: readTag(o, "CmbItm", 1),
            itemFunc: readTag(o, 'ItemFunc'),
            clss: readTag(o, "Pc", se) + ' ' + (opt.menuClass || se),
            noSelClose: noSelClose,
            asmi: readTag(o, "Asmi"),
            combo: isCombo,
            vprop: vprop,
            fcs: fcs,
            opnlc: fcs,
            gval: function () { return awe.val(o.v); },
            afls: 1,
            mdcls: afterClose,
            maxh: readTag(o, 'Maxh'),
            minw: readTag(o, 'Pmw'),
            clp: readTag(o, 'Clp'),
            o: o
        };

        $.extend(d, opt.d);

        if (minWidth) $odropdown.css(sminw, minWidth);

        $odropdown.append($odisplay);
        o.d.append($valCont).append($odropdown);
        o.f.addClass('o-field');

        var dd = dropmenu(d);
        api.dd = dd;

        o.mo = { odisplay: $odisplay, caption: caption, odropdown: $odropdown, inlabel: inlabel, vprop: vprop, cp: comboPref, dd: dd };

        opt.renderCaption = opt.renderCaption || function (selected) {
            var sel = caption;
            if (selected.length) {
                sel = opt.renSelCap(selected[0]);
            }

            return inlabel + sel;
        };

        opt.renSelCap = opt.renSelCap || function (item) {
            return captionFunc ? eval(captionFunc)(item) : cp(item);
        }

        opt.setSel = opt.setSel || function () {
            btnCaption.html(getSelectedCaption());
        };

        opt.setSelChange = opt.setSelChange || function () {
            btnCaption.html(getSelectedCaption());
        };

        opt.prerender = opt.prerender || function () {
            btn.append(btnCaption);
            $odisplay.append(btn);
        };

        function getFunc(k) {
            var lazyReq = o.lreq.slice(0);
            lazyReq.push({ name: "Key", value: k });
            return awe.gd(o, lazyReq);
        }

        function onSelect(item, val) {
            toggleVal(item ? unesc(item[vprop]) : val);
            !noSelClose && afterClose();
        }

        function afterClose() {
            var osrc = $odisplay.find('.o-src');
            if (osrc.length && !isMobile()) {
                osrc.focus();
            } else {
                if (opt.multiple) {
                    $odropdown.attr('tabindex', '0').focus().removeAttr('tabindex');
                } else {
                    btn.focus();
                }
            }
        }

        function getSelectedCaption() {
            function getNodesSelItms(items, res, vals) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    if (containsVal(kp(item), vals) && !item.nv) res.push(item);

                    if (item.it) getNodesSelItms(item.it, res, vals);
                }
            }

            var vals = awe.val(o.v);

            var selected = [];
            getNodesSelItms(glrs(), selected, vals);

            return opt.renderCaption(selected);
        }

        function findvalinput(val) {
            return $valCont.find('input').filter(function () {
                return $(this).val() == val;
            });
        }

        function toggleVal(val, combov, remval) {
            var valinput = findvalinput(val);

            if (valinput.length) {
                if (opt.multiple) {
                    if (!combov) {
                        valinput.click().remove();
                    }
                } else if (isCombo) {
                    changeHandler();
                }
            } else if (!remval) {

                if (!opt.multiple) {
                    $valCont.empty();
                }

                valinput = $('<input type="' + valInputType + '" value="' + escape(val) + '" name="' + o.nm + '"/>');
                $valCont.append(valinput);
                valinput.click();
            }
        }

        function moveVal(val, afval) {
            var input = findvalinput(val);

            if (afval) {
                findvalinput(afval).after(input);
            } else {
                $valCont.prepend(input);
            }
        }

        function render() {
            opt.setSel();

            renderValContAndMenu();
        };

        function renderValContAndMenu() {
            $valCont.html(renderValInputs());

            if (!opt.noMenu) {
                dd.render();
            }
        }

        function renderValInputs() {
            var res = se;
            var rawvals = awe.val(o.v);

            var vals = [];

            var lrs = glrs();

            for (var i = 0; i < rawvals.length; i++) {
                var val = escape(rawvals[i]);
                var found = 0;

                loopTrees(lrs, function (item) {
                    if (val == item[vprop]) {
                        vals.push(item[vprop]);
                        found = 1;
                        return 1;
                    }
                });

                if (isCombo && !found && !isEmp(val) && (val.match("^" + comboPref) || !opt.multiple)) {
                    vals.push(val);
                }
            }

            if (autoSelectFirst && (!vals.length || vals.length == 1 && vals[0] == se)) {
                loopTrees(lrs, function (item) {
                    if (!item.nv) {
                        vals = [item[vprop]];
                        return 1;
                    }
                });
            }

            var attr = disbAttr(o);
            attr += ' name="' + o.nm + '"';

            $.each(vals, function (_, value) {
                res += '<input type="' + valInputType + '" value="' + value + '" ' + attr + ' checked="checked"/>';
            });

            if (!vals.length && opt.multiple) res = '<input type="checkbox" name="' + o.nm + '" />';

            return res;
        }

        function setOpenOnHover() {
            var waitingToClose;
            var waitingToOpen;

            function cancelClose() {
                if (waitingToClose) {
                    clearTimeout(waitingToClose);
                    waitingToClose = null;
                }
            }

            var smousemoveleave = smousemove + ' ' + smouseleave;

            dd.menu.on(smousemove, cancelClose);

            $odropdown.on(smousemove,
                function () {
                    cancelClose();

                    if (o.enb && !dd.isOpen()) {
                        if (waitingToOpen) return;

                        function onMoveLeave(e) {
                            if (e.type == smouseleave || !istrg(e, $odropdown)) {
                                clearTimeout(waitingToOpen);
                                waitingToOpen = null;
                                $doc.off(smousemoveleave, onMoveLeave);
                            }
                        }

                        $doc.on(smousemoveleave, onMoveLeave);

                        waitingToOpen = setTimeout(function () {
                            waitingToOpen && hoverOpen();
                            waitingToOpen = null;
                            $doc.off(smousemoveleave, onMoveLeave);
                        }, 120);
                    }
                });

            function hoverOpen() {
                dd.open();

                $doc.on(smousemoveleave, docMove);

                function docMove(e) {
                    if ((e.type == smouseleave || !(istrg(e, $odropdown) || istrg(e, dd.menu))) && !waitingToClose) {
                        waitingToClose = setTimeout(function () {
                            $doc.off(smousemoveleave, docMove);
                            dd.close();
                            waitingToClose = null;
                        }, 250);
                    }
                }
            }
        }

        opt.init && opt.init();
        opt.prerender();

        if (!opt.noMenu) {
            $odropdown.on(sclick, '.o-ddbtn', function () {
                if (!openOnHover) {
                    dd.topen();
                } else {
                    dd.open(o);
                }
            });

            o.v.on(saweload, function (e) {
                if (ds.gc()) {
                    clearCacheOnLoad && ds.cc();
                    renderValContAndMenu();
                }
            });

            if (openOnHover) setOpenOnHover();
        }

        function changeHandler() {
            opt.setSelChange();
            dd.render();
            o.v.data('comboval', null);
        }

        o.v.on(schange, changeHandler);
    }

    function slist(cont, opt) {
        var itemsel = opt.sel;
        var onenter = opt.enter;
        var focuscls = opt.fcls || sfocus;
        var selcls = opt.sc || sselected;
        var svisf = ':visible:first';
        var itemselector = itemsel + svisf;
        var afs = opt.afs;
        if (afs) afs += svisf;

        function focus(item) {
            remFocus();
            item.addClass(focuscls);
        }

        function remFocus() {
            cont.find('.' + focuscls).removeClass(focuscls);
        }

        function scrollTo(to, cangomid) {
            if (to.length && to.is(':visible')) {
                function y(o) {
                    return o.offset().top;
                }

                var fry = y(to);
                var fh = to.outerHeight();
                var conh = cont.height();
                var miny = y(cont);
                var maxy = miny + conh - fh;

                var scrcont = cont;
                var winmax = $win.height() + $doc.scrollTop() - fh;
                var winmin = $doc.scrollTop();

                if (maxy > winmax && winmax < fry) {
                    maxy = winmax;
                    scrcont = $win;
                }

                if (miny < winmin && winmin > fry) {
                    miny = winmin;
                    scrcont = $win;
                }

                var delta = fry < miny ? fry - miny : fry > maxy ? fry - maxy : 0;

                // +1 for ie and ff 
                if (cangomid && delta > fh + 1 && scrcont != $win) {
                    delta += conh / 2;
                }

                scrcont.scrollTop(scrcont.scrollTop() + delta);
            }
        }

        function scrollToFocused(cangomid) {
            scrollTo(cont.find('.' + focuscls), cangomid);
        }

        function autofocus($itemToFocus) {
            if ($itemToFocus) {
                focus($itemToFocus);
            } else {
                var $selected = cont.find('.' + selcls + ':visible');
                if ($selected.length == 1) {
                    focus($selected);
                } else {
                    if (afs && cont.find(afs).length) {
                        focus(cont.find(afs));
                    } else {
                        focus(cont.find(itemselector));
                    }
                }
            }

            scrollToFocused(1);
        }

        function handleMoveSelectKeys(e) {
            var key = which(e);

            var focused = cont.find('.' + focuscls);

            var select = function (item, f) {
                if (!focused.length) {
                    autofocus();
                }
                else if (item.length) {
                    focus(item);
                    scrollToFocused();
                } else if (f) {
                    f();
                }
            };

            if (contains(key, controlKeys)) {
                if (key == keyDown) {
                    prevDef(e);
                    var $next = focused.nextAll(itemselector);
                    select($next, opt.botf);
                } else if (key == keyUp) {
                    prevDef(e);
                    var $prev = focused.prevAll(itemselector);
                    select($prev, opt.topf);
                } else if (key == keyEnter) {
                    if (onenter) {
                        onenter(e, focused);
                    }
                    else {
                        prevDef(e);
                        focused.click();
                    }
                }

                return 1;
            }

            return 0;
        }

        return {
            focus: focus,
            scrollToFocused: scrollToFocused,
            scrollTo: scrollTo,
            keyh: handleMoveSelectKeys,
            autofocus: autofocus,
            remf: remFocus
        };
    }

    function notif(text, time, clss) {
        var notifCont = $('#o-notifcont');

        if (!notifCont.length) {
            notifCont = $(rdiv('o-ntpc', se, 'id="o-notifcont"'));
            notifCont.appendTo($('body'));
        }

        var $popup = $(rdiv('o-ntp')).addClass(clss);
        var $content = $(rdiv('o-ntc')).html(text || 'error occured');
        var $closeBtn = $(sclosespan);

        notifCont.append($popup);
        $popup.append($content);
        $popup.append($closeBtn);
        $popup.append(rdiv('o-ntlb'));

        $closeBtn.on(sclick, function () { close(); });

        $content.css('max-height', $win.height() - 50);

        $popup.css('opacity', .97);

        if (time) {
            setTimeout(function () {
                close(1);
            }, time);
        }

        function close(fade) {

            if (fade == 1) {
                setTimeout(function () { $popup.remove(); }, 1000);
                $popup.addClass('o-clsg');
                $popup.css('opacity', 0);
                $popup.css('margin-top', -$popup.outerHeight(true));
            } else {
                $popup.remove();
            }
        }

        return $popup;
    }

    function dropdownPopup(o) {
        var p = o.p; // popup properties
        var popup = p.d; // popup div
        p.i = p.i || se;
        o.cx = {};
        var wrap = $(rdiv('o-pwrap', rdiv('o-pmc o-pu', se, 'tabindex="-1" data-i="' + p.i + '"'))).hide();

        var api = function () { };
        o.cx.api = api;
        var itmoved, header, $opener, openerId, fls, popt, top;
        var btns = p.btns;

        var outsideClickClose = readTag(o, "Occ");

        var isDropDown = readTag(o, "Dd", !!o.api);
        var showHeader = readTag(o, "Sh", !isDropDown);
        var toggle = readTag(o, "Tg");

        var sopener = o.opener;
        var $dropdownPopup = wrap.find('.o-pmc').addClass(p.pc);
        p.mlh = 0;

        popup.addClass('o-pc');

        if (!isDropDown) {
            popup.addClass('o-fpp');
        }

        if (p.minw != null) {
            popup.css(sminw, p.minw);
        }

        if (o.rtl) {
            $dropdownPopup.addClass('awe-rtl').css('direction', 'rtl');
        }

        $dropdownPopup.append(popup);

        var modal = $(rdiv('o-pmodal o-pu', se, 'tabindex="-1" data-i="' + p.i + '"'));
        modal.on(skeyup, closeOnEsc);

        $dropdownPopup.on(skeydown,
            function (e) {
                if (e.keyCode == keyTab) {
                    var tabbables = tabbable($dropdownPopup),
                        first = tabbables.first(),
                        last = tabbables.last();
                    var trg = $(e.target);
                    if (trg.is(last) && !e.shiftKey) {
                        first.focus();
                        return false;
                    } else if (trg.is(first) && e.shiftKey) {
                        last.focus();
                        return false;
                    }
                }
            });

        var isFixed;
        var zIndex = minZindex;

        function layPopup(isResize, canShrink) {
            if (p.nolay) return;

            if (isResize) {
                // reset position changed by dragging popup
                itmoved = 0;
            }

            if (!p.isOpen) return;

            var winavh = $win.height() - popSpace;
            var winavw = $win.width() - popSpace;

            if (top) {
                winavh -= popTopSpace;
            }

            modal.css(szindex, zIndex);
            $dropdownPopup.css('overflow-y', 'auto');
            if (zIndex) {
                $dropdownPopup.css(szindex, zIndex);
            }

            popup.css('width', se);
            popup.css(sheight, se);
            popup.css('max-height', se);

            var oapi = o.api || {};

            if (oapi.rlay) {
                oapi.rlay();
            }

            var capHeight = o.f ? outerh(o.f.find('.awe-openbtn:first'), 1) : 0;

            fls = p.f;
            top = p.top;

            if (openerId && !$opener.closest(document).length) {
                $opener = $('#' + openerId);
            }

            var height = p.dh || p.h;

            if (!height) {
                height = Math.max(350, outerh($dropdownPopup));
            }

            var maxph = 0;

            var dpw = $dropdownPopup.outerWidth();
            var pow = popup.outerWidth();

            var nonpopw = dpw - pow;

            var resth = $dropdownPopup.outerHeight() - popup.outerHeight();

            if (oapi.lay) {
                height = p.dh || maxLookupDropdownHeight;
                maxph = p.dh || maxLookupDropdownHeight;
            }

            var limw = winavw;
            if (p.mw) {
                popup.css('max-width', p.mw);
                limw = p.mw;
            }

            if (p.w) {
                if (!isDropDown || p.wws) {
                    var minw = Math.min(p.w, Math.min(limw, winavw)) - nonpopw;
                    popup.css(sminw, minw);
                }
            }

            var minh = height;
            if (!isDropDown || p.hws) {
                if (p.h) {
                    minh = p.h;
                    if (height < minh) height = minh;
                    if (maxph < minh) maxph = minh;
                    popup.css('min-height', Math.min(p.h, winavh) - resth);
                }
            }

            function chkfulls(ph) {
                var pw = $dropdownPopup.outerWidth();
                var h = $dropdownPopup.outerHeight();
                var wlim = 25, hlim = 70;

                if (p.af) {
                    wlim = 200;
                    hlim = 300;

                    h = Math.max(ph, h);
                };

                if (p.wlim != null) {
                    wlim = p.wlim;
                }

                var hcondit = pw > winavw - wlim && h > winavh - hlim;

                if (!oapi.lay) {
                    hcondit = hcondit && h * .7 > winavh - h;
                }

                if (hcondit) {
                    fls = 1;
                }

                if (fls) {

                    var avh = winavh - resth - (showHeader || btns ? 0 : clickOutSpace);
                    if (oapi.lay) {
                        o.avh = avh;
                        o.nph = resth;
                    }

                    popup.css('width', winavw - nonpopw);
                    popup.css(sheight, avh);
                }

                if (fls || p.m) {
                    modal.show();
                } else {
                    modal.hide();
                }

                return fls;
            }

            function setmaxheight(poph, maxh, valign) {
                var avh = maxh - resth;

                popup.css('max-height', avh);

                if (oapi.lay) {
                    avh = poph - resth;

                    popup.css(sheight, avh);

                    o.avh = avh;
                    o.nph = resth;
                }
            }

            layDropdownPopup2(o,
                $dropdownPopup,
                isFixed,
                capHeight,
                isDropDown ? $opener : null,
                setmaxheight,
                itmoved,
                canShrink,
                chkfulls,
                minh,
                height,
                maxph,
                popup,
                popt && popt.xy,
                top);

            popup.trigger('awepos');
        }

        function outClickClose(e) {
            var shouldClose;
            if (outsideClickClose != null) {
                shouldClose = outsideClickClose;
            } else {
                shouldClose = closePopOnOutClick || $opener && isDropDown;
            }

            if (shouldClose) {
                var trg = $(e.target);

                function lookForMe(it) {
                    var popup = it.closest('.o-pu');

                    var pid, mclick = 0;
                    if (it.is('.o-pmodal')) {
                        mclick = 1;
                    }

                    if (popup.length) {
                        pid = popup.data('i');
                    }

                    if (pid) {
                        if (pid == p.i && !mclick) return 1;

                        var popener = dpop[pid];
                        if (popener)
                            return lookForMe(popener);
                    }
                }

                if (!lookForMe(trg)) {
                    if (!trg.closest($opener).length) {
                        if (!trg.closest('.ui-datepicker').length) {
                            api.close(1);
                        }
                    }
                }
            } else {
                $doc.off(sddpOutClEv, outClickClose);
            }
        }

        function loadHandler() {
            layPopup();
        }

        $dropdownPopup.on(saweload + ' ' + sawebeginload, loadHandler);

        function resizeHandler() {
            layPopup(1, 1);
        }

        $win.on('resize domlay', resizeHandler);

        api.lay = resizeHandler;

        api.open = function (opt) {
            popt = opt || {};
            var e = popt.e;
            if (toggle) {
                if (p.isOpen) {
                    return api.close();
                }
            }

            sopener = sopener || popt.opener;

            if (sopener) {
                $opener = sopener;
            } else {
                if (e && e.target) {
                    $opener = $(e.target);
                    var btn = $opener.closest('button');
                    if (btn.length) $opener = btn;
                }

                if (o.f && o.f.closest('.awe-field').length) {
                    $opener = o.f;
                }

                if ($opener && !$opener.is(':visible')) {//|| p.f
                    $opener = null;
                }
            }

            var hostc = $('body');
            isFixed = 1;

            if ($opener) {
                openerId = $opener.attr('id');
                var uidialog = $opener.closest('.awe-uidialog');
                var parPop = $opener.closest('.o-pmc');

                if (uidialog.length) {
                    hostc = uidialog;
                    zIndex = hostc.css(szindex);
                } else if ($opener.parents('.modal-dialog').length) {
                    hostc = $opener.closest('.modal');
                    zIndex = hostc.css(szindex);
                } else if (parPop.length) {
                    zIndex = parPop.css(szindex);
                    if (parPop.css(sposition) != 'fixed') {
                        isFixed = 0;
                    }
                } else {
                    isFixed = isPosFixed($opener);
                    zIndex = calcZIndex(zIndex, $opener);
                }
            }

            if (!isDropDown) {
                hostc = $('body');
                isFixed = 1;
                header.show();
            } else {
                itmoved = 0;
            }

            if (showHeader) {
                header.show();
            } else {
                header.hide();
            }

            hostc.append(modal);
            hostc.append(wrap);
            wrap.show();
            p.isOpen = 1;

            //layPopup(0, 1); // can shrink

            layPopup(0, isDropDown);

            dpop[p.i] = $opener;

            setTimeout(function () {
                $doc.on(sddpOutClEv, outClickClose);
            }, 100);

            if (!isMobile() && !p.nf) {
                setTimeout(function () {
                    var popTab = tabbable(popup).first();
                    if (popTab.length) {
                        popTab.focus();
                    } else {
                        tabbable(wrap).first().focus();
                    }
                },
                    10);
            }

            popup.trigger('aweopen');
        };

        api.close = function (nofocus) {
            itmoved = 0;
            wrap.hide();
            if (modal) modal.hide();
            p.isOpen = 0;
            if (p.cl) {
                p.cl();
            }

            popup.trigger('aweclose', { out: nofocus });

            if (!p.dntr) {
                wrap.remove();
                if (modal) modal.remove();
            }

            $doc.off(sddpOutClEv, outClickClose);

            if (!nofocus) {
                if ($opener && $opener.length) {
                    (o.fcs || $opener).focus();
                }
            }
        };

        api.destroy = function () {
            api.close(1);
            wrap.remove();
            if (modal) modal.remove();
            $win.off('resize domlay', resizeHandler);
        };

        popup.data('api', api);

        header = $(rdiv('o-phdr', rdiv('o-ptitl', (p.t || snbsp)) + sclosespan));

        $dropdownPopup.prepend(header);
        header.find('.o-cls').click(api.close);

        function getDragPopup() {
            itmoved = 1;
            return $dropdownPopup;
        }

        if (!isDropDown) {
            dragAndDrop({
                from: header,
                ch: getDragPopup,
                kdh: 1,
                cancel: function () { return fls; }
            });
        }

        addFooter(btns, $dropdownPopup, popup, 'o-pbtns');

        function closeOnEsc(e) {
            if (which(e) == keyEsc) {
                var dtpf = $(e.target).closest('.awe-datepicker-field');
                if (dtpf.length && dtpf.find('.awe-val').datepicker('widget').is(':visible')) {

                } else {
                    if (!popup.data('esc')) {
                        api.close();
                    }
                }

                popup.data('esc', null);
            }
        }

        $dropdownPopup.on(skeyup, closeOnEsc);

        return wrap;
    }

    function addFooter(btns, cont, popup, fclass) {
        // add btns if any
        if (btns && btns.length) {
            var btnslen = btns.length;

            var footer = $('<div/>').addClass(fclass);

            if (reverseDefaultBtns && btnslen > 1) {
                if (btns[btnslen - 1].c) {
                    var cbtn = btns.pop();
                    var kbtn = btns.pop();
                    btns.push(cbtn);
                    btns.push(kbtn);
                }
            }

            $.each(btns, function (i, el) {
                var cls = !el.k ? 'awe-sbtn' : 'awe-okbtn';
                var btn = $(rbtn('awe-btn ' + cls + ' o-pbtn', el.text));

                if (el.tag) {
                    var tag = el.tag;
                    if (tag.K)
                        $.each(tag.K, function (indx, key) {
                            btn.attr(key, tag.V[indx]);
                        });
                }

                btn.click(function () { el.click.call(popup); });
                footer.append(btn);
            });

            cont.append(footer);
        }
    }

    function inlinePopup(o) {
        var p = o.p; //popup properties
        var popup = p.d; //popup div
        var wrap = $('<div class="o-inlp awe-popupw"></div>').hide();

        //minimum height of the lookup/multilookup content
        p.mlh = 250;

        wrap.append(popup);

        //decide where to attach the inline popup
        //tag and tags are set using .Tag(object) .Tags(string)
        if (o.tag && o.tag.target) {
            $('#' + o.tag.target).append(wrap);
        } else if (o.tag && o.tag.cont) {// cont used in grid nesting
            o.tag.cont.prepend(wrap);
        } else if (o.tags) {
            $('#' + o.tags).append(wrap);
        } else if (o.f) { //component field
            o.f.after(wrap);
        } else {
            $('body').prepend(wrap);
        }

        var api = function () { };
        api.open = function () {
            wrap.show();
            p.isOpen = 1;
            popup.trigger('aweopen');
        };
        api.close = function () {
            wrap.hide();
            p.isOpen = 0;
            if (p.cl) {
                p.cl();
            }
            popup.trigger('aweclose');
            if (!p.dntr) {
                wrap.remove();
            }
        };
        api.destroy = function () {
            api.close();
            wrap.remove();
        };

        popup.data('api', api);

        var closeBtn = $(rbtn('awe-btn', snbsp + '&times;' + snbsp)).click(api.close);

        if (readTag(o, "Sh", 1)) {
            wrap.prepend($('<div class="o-inltitl"></div>').append(closeBtn).append("<span class='o-inltxt'>" + p.t + "</span>"));
        }

        addFooter(p.btns, wrap, popup);

        return wrap;
    }

    function gridPageInfo(o) {
        var $grid = o.v;
        var $pageInfo = $('<div class="o-gpginf"></div>');
        var delta = 0;
        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;

        $grid.on(sawerowch, function (e, data) {
            if (data) {
                delta += data;
                render();
            }
        });

        $grid.find('.awe-footer').append($pageInfo);

        $grid.on('awebfren', function (e) {
            if (!$(e.target).is($grid)) return;
            delta = 0;
            render();
        });

        function render() {
            var lrs = dto($grid).lrs;
            var pageSize = lrs.ps;
            var itemsCount = lrs.ic + delta;

            var first = pageSize * (lrs.p - 1) + 1;
            var last = lrs.pgn ? first + pageSize - 1 + delta : itemsCount;
            if (last > itemsCount) last = itemsCount;
            if (!itemsCount || !last) first = 0;

            $pageInfo.html(first + ' - ' + (last) + ' ' + format(cd().GridInfo, [itemsCount]));
        }
    }

    function gridPageSize(o) {
        if (isMobile()) return;

        var items = [5, 10, 20, 50];
        function addIfLacks(ni) {
            if (!contains(ni, items)) {
                items.push(ni);
                items.sort(function (a, b) {
                    return a - b;
                });
            }
        }

        var $grid = o.v;

        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;

        var psi = o.i + 'PageSize';

        $grid.find('.awe-footer').append('<div class="awe-ajaxradiolist-field o-gpgs awe-field"><input id="' + psi + '" class="awe-val" type="hidden" value="' + o.ps + '" /><div class="awe-display"></div></div>');

        addIfLacks(o.ps);

        function setPages() {
            return $.map(items, function (val) {
                return { c: val, k: val };
            });
        }

        awe.radioList({ i: psi, nm: psi, df: setPages, l: 1, md: awem.odropdown, tag: { InLabel: cd().PageSize + ": " } });

        o.data.keys.push("pageSize");
        o.data.vals.push(psi);
        o.data.l.push(1);
    }

    function gridInfScroll(o) {
        var $grid = o.v;
        var con = $grid.find(sawecontentc);
        var scon = con.children().first();
        var loading;
        var gonext = 0;
        var lastSt;
        function adjustMargin() {
            var diff = (Math.max((con.height() - scon.height()) + 25, 25));

            scon.css('margin-bottom', diff + 'px');
        }

        adjustMargin();

        function setSt(st) {
            lastSt = st;
            con.scrollTop(st);
        }

        con.on('scroll', function () {
            var res = o.lrs;
            var st = con.scrollTop();
            var sconh = scon.outerHeight(true);
            var conh = con.innerHeight();
            var maxst = sconh - conh + 1;
            var lst = lastSt;

            adjustMargin();

            if (loading) {
                con.scrollTop(lst);
            } else {
                if (lst < st) {

                    if (gonext < 0) {
                        gonext = 0;
                    }

                    if (st > maxst - 3) {
                        gonext++;
                        if (gonext > 1 && res.p < res.pc) {
                            loading = 1;
                            $.when(nextPage())
                                .done(function () {
                                    gonext = loading = 0;
                                    st = 1;
                                    setSt(st);
                                });
                        } else {
                            st--;
                            setSt(st);
                        }
                    }
                }
                else if (lst > st) {

                    if (gonext > 0) {
                        gonext = 0;
                    }

                    if (st < 3) {
                        gonext--;
                        if (gonext < -2 && res.p > 1) {
                            loading = 1;
                            $.when(prevPage())
                                .done(function () {
                                    gonext = loading = 0;
                                    st = maxst;
                                    setSt(st);
                                });
                        } else {
                            st++;
                            setSt(st);
                        }
                    }
                }

                lastSt = st;
            }

            function nextPage() {
                return dapi($grid).load({ oparams: { page: res.p + 1 } });
            }

            function prevPage() {
                return dapi($grid).load({ oparams: { page: res.p - 1 } });
            }
        });
    }

    function isMobileOrTablet() {
        return false;
    }

    var clientDict = {
        Empty: 'empty',
        GridInfo: "of {0} items",
        Select: 'please select',
        SearchForRes: 'search for more results',
        Searchp: 'search...',
        NoRecFound: 'no records found',
        PageSize: 'page size',
        Months: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        Days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    };

    function gldng(disb, noEmpMsg) {
        return function (o, opt) {
            opt = opt || {};
            opt.lhtm = opt.lhtm || '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>';
            var ctm = opt.ctm || 40;

            var $grid = o.v;
            var $mcontent = $grid.find(sawecontentc);
            var isOn;

            var exfeat = o.api.ft['ldng'];

            if (exfeat) exfeat.remf();

            var feat = {};

            function apply() {
                if (isOn || disb) return;
                function setNoRec() {
                    $mcontent.find('.o-gempt').remove();
                    if (!$mcontent.find(sawerowc).length) {
                        $mcontent.prepend($('<div class="o-gempt">' + cd().NoRecFound + '</div>')
                            .css('margin-top', Math.max(($mcontent.height() / 2) - 90, 10) + 'px'));
                    }
                }

                function onBeginLoad(e) {
                    if ($(e.target).is($grid)) {
                        $grid.find('.o-gempt').remove();

                        var $spin = $('<div class="spinCont">' + opt.lhtm + '</div>').hide();
                        $spin.height($mcontent.height());
                        $mcontent.prepend($spin);
                        $spin.children().first().css('margin-top', ($mcontent.height() / 2 - ctm) + 'px');
                        $spin.delay(150).fadeIn();
                    }
                }

                function onLoad(e) {
                    if ($(e.target).is($grid)) {
                        $mcontent.find('.spinCont:first').fadeOut().remove();

                        if (!noEmpMsg) {
                            setNoRec();
                        }
                    }
                }

                $grid.on(sawebeginload, onBeginLoad)
                    .on(saweload, onLoad);

                if (!noEmpMsg) {
                    $grid.on(sawerowch, setNoRec);
                }

                feat.remf = function () {
                    if (isOn) {
                        $grid.off(sawebeginload, onBeginLoad)
                            .off(saweload, onLoad)
                            .off(sawerowch, setNoRec);
                        isOn = 0;
                    }
                };

                isOn = 1;
            }

            o.api.ft['ldng'] = feat;

            apply();

            feat.apply = apply;
        }
    }

    function gridLoading(o, opt) {
        gldng()(o, opt);
    }

    function gridMovRows(opt) {
        return function (o) {
            var $grid = o.v;
            var $fromCont = $grid.find(sawecontentc);
            var grids = [o.v.attr('id')];
            var isOn;
            var curhov;
            var drgo;
            var model;

            var feat = { apply: apply };

            function clgapi(of) {
                return dapi(of.closest(sawegridcls));
            }

            function apply() {
                if (isOn) return;

                var scroll = [];
                if (opt && opt.G) {
                    grids = opt.G;
                }

                var gobjs = [];
                $.each(grids, function (i, val) {
                    var tog = $('#' + val).find(sawecontentc);
                    scroll.push({ c: tog, y: 1 });
                    gobjs.push(tog);
                });

                scroll.push({ c: $win, y: 1 });

                function newo(cx) {
                    clgapi(drgo).rem(drgo);
                    return $(clgapi(cx.cont).renderRow(model));
                }

                function ondrop(cx) {
                    var $toGrid = cx.cont.closest(sawegridcls);
                    if (!$toGrid.is($grid)) {
                        movedGridRow($grid, $toGrid);
                    }
                }

                function swrap(cx) {
                    curhov = 0;
                    drgo = cx.drgo;
                    model = dapi($grid).model(drgo);

                    // create dragobj
                    if (drgo.closest('.awe-itc').is('tbody')) {
                        return $('<div/>')
                            .prop('class', $grid.prop('class'))
                            .append($('<table/>')
                                .append(drgo.closest('table').find('colgroup').clone())
                                .append(drgo.clone()));
                    }
                }

                function shov(cx) {
                    if (curhov != cx.cont) {
                        cx.plh.remove();

                        curhov = cx.cont;
                        cx.plh = $(clgapi(curhov).renderRow(model)).addClass('awe-hl');
                    }
                }

                var remf = dragReor({
                    from: $fromCont.find('.awe-itc:first'),
                    tof: function () {
                        return gobjs;
                    },
                    sel: '.awe-row',
                    plh: 'awe-hl',
                    scroll: scroll,
                    newo: newo, // gen new obj to append
                    ondrop: ondrop,
                    hovec: function (cx) {
                        // hovering cont
                        cx.cont.find('.awe-itc:first').append(cx.plh);
                    },
                    cancel: awe.dgcf($fromCont),
                    swrap: swrap,
                    shov: shov
                });

                feat.rem = function () {
                    if (isOn) {
                        remf();
                        isOn = 0;
                    }
                }

                isOn = 1;
            }

            o.api.ft['mvr'] = feat;

            apply();

            feat.apply = apply;
        };
    }

    function gridInlineEdit(createUrl, editUrl, oneRow, reloadOnSave, rowClick) {
        return function (o) {
            var $grid = o.v;
            var api = dapi($grid);
            var newic = 1;
            var activeRow;

            function oneRowCheck(action) {
                if (oneRow) {
                    var otherRow = $grid.find(sglrowc).first();
                    if (otherRow.length && otherRow.data(sstate) != 3) {
                        checkAndPreventActionUntilSave(otherRow, action);
                        return 1;
                    }
                }
            }

            api.inlineCreate = function inlineCreate(newModel) {
                if (oneRowCheck(function () { inlineCreate(newModel); })) {
                    return;
                }

                newModel = newModel || {};
                var nitm = $(api.renderRow(newModel));
                nitm.addClass(snewrow);
                $grid.find('.awe-content:first .awe-itc:first').prepend(nitm);
                $grid.trigger(sawerowch);
                inlineEdit(nitm);
            };

            api.inlineEdit = inlineEdit;
            api.inlineCancel = function ($row, focus) { cancelRow($row, focus); };
            api.inlineSave = save;

            function isMine(trg) {
                return trg.closest(sawegridcls).is($grid);
            }

            $grid.on(sclick, '.o-glsvb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    save(trg.closest(sawerowc), 1);
                }
            })
            .on(sclick, '.o-glcanb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    api.inlineCancel(trg.closest(sawerowc), 1);
                }
            })
            .on(sclick, '.o-gledtb', function () {
                var trg = $(this);
                if (isMine(trg)) {
                    inlineEdit(trg.closest(sawerowc));
                }
            });

            function inlineEdit($row, td) {
                if (oneRowCheck(function () { inlineEdit($row, td); })) {
                    return;
                }

                activeRow = $row;

                $row.addClass(sglrow + ' awe-nonselect');

                var $colgroup = $row.closest('.awe-table').find('colgroup');

                var model = api.model($row); // $row.data(smodel);
                var hidden = se;
                var prefix = o.i + (model[o.k] || se);

                var gcvcontf = function (column) {
                    var tdi = $colgroup.find('col[data-i="' + column.ix + '"]').index();
                    var gtd = $row.children().eq(tdi);
                    return gtd;
                };

                if (!$colgroup.length) {
                    gcvcontf = function (column) {
                        return $row.find('.awe-cv[data-i="' + column.ix + '"]');
                    }
                }

                if ($row.hasClass(snewrow)) {
                    prefix += 'new' + (newic++);
                }

                var needLoading = [];

                $.each(o.columns, function (_, column) {
                    var tag = column.Tag;
                    if (tag) {
                        function getVal(prop) {
                            var val = model[o.lrs.a ? toLowerFirst(prop) : prop];

                            if (val == null) val = '';
                            return val instanceof Array ? JSON.stringify(val) : val;
                        }

                        function parseFormat(format, value) {

                            var boolVal = value ? 'checked' : se;
                            format = format.split('#Value').join(escape(value))
                                .split('#Prefix').join(prefix)
                                .split('#ValChecked').join(boolVal);

                            for (var key in model) {
                                var sval = getVal(key);

                                format = format.split(".(" + key + ")").join(sval)
                                               .split(".(" + toUpperFirst(key) + ")").join(sval);
                            }

                            format = format.replace(/\.\(\w+\)/g, "");
                            return format;
                        }

                        var inlelms = tag.Format;

                        if (tag.FormatFunc) {
                            inlelms = eval(tag.FormatFunc)(model, tag.Fpar);
                        }

                        if (inlelms && inlelms.length) {
                            var gtd = gcvcontf(column);
                            if (!column.Hid) {
                                gtd.empty();
                            }

                            for (var j = 0; j < inlelms.length; j++) {
                                var el = inlelms[j];
                                var val = getVal(el.ValProp);

                                var hformat = parseFormat(el.Format, val);

                                if (column.Hid) {
                                    hidden += hformat;
                                } else {

                                    var validstr = el.ModelProp && hformat.indexOf("awe-gvalidmsg") == -1 ? rdiv('awe-gvalidmsg ' + el.ModelProp) : se;
                                    var cellcont = rdiv('oinlc', rdiv('oinle', hformat) + validstr);
                                    addHidden(gtd.append(cellcont));
                                }

                                if (el.JsFormat) {
                                    needLoading.push(parseFormat(el.JsFormat, val));
                                }
                            }
                        }
                    }
                });

                if (hidden) {
                    addHidden($row.children().last());
                }

                function addHidden(cont) {
                    if (hidden) {
                        cont.append($('<div>' + hidden + '</div>').hide());
                        hidden = se;
                    }
                }

                if (needLoading.length) {
                    for (var i = 0; i < needLoading.length; i++) {
                        eval(needLoading[i]);
                    }
                }

                var ins = $row.find(':input').serializeArray();
                $row.data('ins', ins);
                $row.trigger(saweinledit);

                var selfunc = function (elm) { return tabbable(elm).first(); }

                if (!isMobile()) {
                    setTimeout(function () {
                        if (td && selfunc(td).length) {
                            selfunc(td).focus();
                        } else {
                            // no focus when hor scrollbar
                            var gcont = $grid.find('.awe-content');
                            if (gcont.children().first().width() <= gcont.width())
                                selfunc($row).focus();
                        }
                    });
                }

                if (rowClick) {
                    setTimeout(function () {
                        regOutClick($row);
                    });
                }
            }

            function save($row, isClick) {
                if ($row.data('slock')) {
                    return;
                }

                $row.data('slock', 1);
                $row.data(sstate, 2);

                var url = $row.hasClass(snewrow) ? createUrl : editUrl;
                var sdata = $row.find(':input').serializeArray();

                var diff = 0;
                var ins = $row.data('ins');
                if (ins.length != sdata.length) {
                    diff = 1;
                } else {
                    for (var i = 0; i < ins.length; i++) {
                        if (ins[i].name != sdata[i].name || ins[i].value != sdata[i].value) {
                            diff = 1;
                            break;
                        }
                    }
                }

                if (!diff && !$row.hasClass(snewrow)) {
                    cancelRow($row, isClick);
                    return 1;
                }

                o.lrso = 1;

                function onError(p1, p2, p3) {
                    $row.data(sstate, 0);
                    awe.err(o, p1, p2, p3);
                }

                function onComplete() {
                    $row.data('slock', 0);
                }

                function onSuccess(rdata) {
                    $row.find('.awe-gvalidmsg').empty();
                    var errors = rdata.e;
                    if (errors) {
                        $row.data(sstate, 1);
                        $row.trigger(saweinlinv);

                        for (var k in errors) {
                            var msg = se;
                            for (var i = 0; i < errors[k].length; i++) {
                                msg += rdiv('field-validation-error', errors[k][i]);
                            }

                            if (!k || !$row.find('.' + k).length) {
                                $grid.find('.awe-gvalidmsg:last').append(msg);
                            } else {
                                $row.find('.' + k).html(msg);
                            }
                        }
                    } else {
                        $row.data(sstate, 3);

                        var ritem = rdata.Item || rdata.item;

                        if (reloadOnSave) {
                            api.load();
                        } else if (ritem) {
                            // new
                            var nitm = $(api.renderRow(ritem));
                            $row.after(nitm).remove();

                            awe.flash(nitm);

                            closeActiveRow($row);
                            nitm.trigger(saweinlsave, { r: rdata });
                        } else {
                            // edit
                            var item = api.model($row);
                            var key = o.k;

                            $.when(api.update(item[key], 0, 1)).done(function () {
                                closeActiveRow($row);
                                var row = api.select(item[key])[0];
                                if (isClick) focusRowEditBtn(row);
                                row.trigger(saweinlsave, { r: rdata });
                            });
                        }
                    }
                }

                awe.ajx({
                    url: url,
                    data: sdata.concat(awe.params(o, 1)),
                    success: onSuccess,
                    complete: onComplete,
                    error: onError
                }, o);
            }

            function cancelRow($row, isClick) {
                if ($row.hasClass(snewrow)) {
                    $grid.trigger(saweinlcancel);
                    $row.remove();
                } else {
                    var rowi = $row.data('i');
                    var item = api.model($row);
                    var nrow = $(api.renderRow(item, null, rowi));
                    $row.hasClass('awe-alt') && nrow.addClass('awe-alt');
                    $row.after(nrow).remove();

                    if (isClick) {
                        focusRowEditBtn(nrow);
                    }

                    nrow.trigger(saweinlcancel);
                }

                $grid.trigger(sawerowch);
                closeActiveRow($row);
            }

            function closeActiveRow($row) {
                if (activeRow && (activeRow.is($row) || !activeRow.closest(document).length)) {
                    activeRow = null;
                    if ($grid.find(sglrowc).length) {
                        activeRow = $grid.find(sglrowc).first();
                    }
                }
            }

            if (rowClick) {
                $grid.on('click focusin',
                    '.awe-row:not(.o-glar)',
                    function (e) {
                        var row = $(this);
                        if (isMine(row)) {
                            var cell = $(e.target).closest('td, .awe-cv');

                            //var row = row.closest(sawerowc);

                            if ((e.type == 'focusin' ||
                                istrg(e, 'button')) &&
                                !row.hasClass(sglrow) ||
                                !row.closest(document).length) {
                                return;
                            }

                            activeRow = row;
                            if (!row.hasClass(sglrow)) {
                                inlineEdit(row, cell);
                            } else {
                                regOutClick(row);
                            }
                        }
                    });
            }

            function regOutClick(row) {
                function outclick(e) {
                    // row, target
                    function lookFor(src, pivot) {

                        if (pivot.closest(src).length) {
                            return 1;
                        }

                        // multirem, child odropdown item
                        var apid = pivot.attr('awepid');
                        if (apid) {
                            return lookFor(src, $('#' + apid));
                        }

                        var popup = pivot.closest('.o-pu');

                        if (popup.length) {
                            var popener = dpop[popup.data('i')];
                            if (popener) {
                                return lookFor(src, popener);
                            }
                        }
                    }

                    var trg = $(e.target);
                    if (!$(row).closest(document).length) {
                        deregOutclick();
                    } else {
                        var found = lookFor(row, trg);
                        if (!found && !trg.closest('.ui-datepicker').length) {
                            save(row);
                            deregOutclick();
                            row.removeClass('o-glar');
                        }
                    }
                }

                var ev = saweinlsave + ' ' + saweinlcancel;

                function deregOutclick() {
                    $doc.off(sclick, outclick);
                    row.off(skeydown, onKeyDown);
                    row.off(ev, deregOutclick);
                }

                function onKeyDown(e) {
                    if (which(e) == keyTab) {
                        var tabls = tabbable(row);
                        if ($(e.target).is(tabls.last()) && !e.shiftKey) {
                            prevDef(e);
                            row.next().find('td:first').click();
                        }
                        else if ($(e.target).is(tabls.first()) && e.shiftKey) {
                            prevDef(e);
                            row.prev().find('td:first').click();
                        }
                    }
                }

                if (row.hasClass('o-glar')) {
                    return;
                }

                row.addClass('o-glar');
                row.data(sstate, 0);

                $doc.on(sclick, outclick);

                row.on(skeydown, onKeyDown);
            }

            function checkAndPreventActionUntilSave(row, action) {
                var state = row.data(sstate);
                if (state == 3) {
                    action();
                } else {
                    if (!state) {
                        if (save(row)) {
                            action();
                            return;
                        }
                    }

                    if (!state || state == 2) {
                        var ev = saweinlsave + ' ' + saweinlinv;
                        function onSaveFin(e) {
                            row.off(ev, onSaveFin);
                            if (e.type == saweinlsave) {
                                action();
                            } else {
                                scrollTo(row, $grid.find(sawecontentc));
                            }
                        }

                        row.on(ev, onSaveFin);
                    } else if (row.data(sstate) == 1) {
                        scrollTo(row, $grid.find(sawecontentc));
                    }
                }
            }

            function onGridBeforeLoad(e, aobj) {
                if ($(e.target).is($grid)) {
                    var ierows = $grid.find(sglrowc).length;

                    if (ierows) {
                        var loadFunc = aobj.load;
                        aobj.load = null;

                        if (ierows == 1) {
                            checkAndPreventActionUntilSave(activeRow, loadFunc);
                        }
                    }
                }
            }

            if (rowClick) {
                $grid.on('awebeforeload', onGridBeforeLoad);
            }

            function focusRowEditBtn(row) {
                row.find('.o-gledtb').focus();
            }
        };
    }

    var regHandlers = { ca: {}, mp: {} }; // column autohide; minipager

    function gridColAutohide(o) {
        function isColumnHidden(column) {
            return !o.sgc && column.Gd || column.Hid;
        }

        // 1 or 0 if not autohide
        function autohidVal(col) {
            return col.Tag && col.Tag.Autohide || 0;
        }

        var $grid = o.v;

        function autohideColumns(isInit) {
            var changes = 0;
            var avw = $grid.find('.awe-hcon').width() || $grid.find(sawecontentc).width() - awe.scrollw();
            var eo = dto($grid);

            if (avw < 0) return changes;

            if (!eo) {
                removeRegHandle(o, 'ca');
                return changes;
            }

            var ahcols = $.grep(eo.columns, function (col) {
                return autohidVal(col);
            }).sort(function (a, b) { return autohidVal(b) - autohidVal(a); }).reverse();

            // unhide autohidden
            $.each(ahcols, function (_, col) {
                if (col.Hid == 2) {
                    col.Hid = 0;
                    changes++;
                }
            });

            var contentWidth = o.api.conw();
            if (avw < contentWidth) {
                $.each(ahcols, function (_, col) {
                    if (!isColumnHidden(col) && !col.Uhid) {
                        col.Hid = 2;
                        changes--;
                        contentWidth -= col.W || col.Mw;
                        if (contentWidth <= avw) return false;
                    }
                });
            }

            if (changes) {
                if (!isInit && !$grid.find('.awe-nest:visible').length) {
                    dapi($grid).render();
                }

                $grid.trigger(sawecolschange);
            }

            return changes;
        }

        $grid.on(saweinit, function (e) {
            if ($(e.target).is($grid)) {
                autohideColumns(1);
            }
        });

        removeRegHandle(o, 'ca');

        function resizeHandler() {
            autohideColumns();
        }

        $win.on('aweresize resize domlay', resizeHandler);

        regHandlers['ca'][o.i] = {
            h: resizeHandler,
            e: 'aweresize resize domlay'
        };
    }

    function removeRegHandle(o, k) {
        var reghandle = regHandlers[k][o.i];
        if (reghandle) {
            $win.off(reghandle.e, reghandle.h);
        }
    }

    function gridColSel(o) {
        var $grid = o.v;
        var scid = o.i + 'ColSel';

        $grid.find('.awe-footer').append('<div class="awe-ajaxcheckboxlist-field o-gcolsl" ><input id="' + scid + '" class="awe-val awe-array" type="hidden" /><div class="awe-display"></div></div>');

        function getColumnsDataFunc() {
            var result = [];
            $.each(o.columns, function (i, col) {
                var name = col.H || col.P || "col" + (i + 1);
                if (!(col.Tag && col.Tag.Nohide))
                    result.push({ k: i, c: name });
            });

            return result;
        }

        var so = '<i class="o-o"/>';

        awe.checkboxList({ i: scid, nm: scid, df: getColumnsDataFunc, l: 0, md: awem.multiselb, tag: { InLabel: so + so + so, NoSelClose: 1 } });
        var colSel = $('#' + scid);

        function setItems() {
            var selColIndx = []; // value
            $.each(o.columns,
                function (i, col) {
                    if (!col.Hid && !(col.Tag && col.Tag.Nohide)) selColIndx.push(i);
                });

            colSel.val(JSON.stringify(selColIndx));
            dapi(colSel).load();
        }

        $grid.on(saweinit + ' ' + sawecolschange + ' ' + saweload + ' awereorder', function (e, d) {
            if ($(e.target).is($grid) && !(d && d.c)) {
                setItems();
            }
        });

        colSel.on(schange, function () {
            var colIndxs = $.parseJSON($(this).val() || "[]");
            $.each(o.columns, function (i, col) {
                if ($.inArray(i.toString(), colIndxs) == -1 && !(col.Tag && col.Tag.Nohide)) {
                    if (!col.Hid) {
                        col.Hid = 1; // hide column

                        if (col.Gd) {
                            // remove grouped when hiding column
                            col.Gd = 0;
                            o.lrso = 1;
                        }
                    }
                } else {
                    if (col.Hid) {
                        col.Hid = 0;
                        col.Uhid = 1;
                    }
                }
            });

            var api = dapi($grid);
            api.persist();
            api.render();
            $grid.trigger(sawecolschange, { c: 1 });
        });
    }

    function gridMiniPager(o) {
        return gridAutoMiniPager(o, 1);
    }

    function gridAutoMiniPager(oo, useMiniPager) {
        var $grid = oo.v;
        var $footer = $grid.find('.awe-footer');
        if (!$footer.length) return;
        var api = dapi($grid);
        var original = api.buildPager;

        var miniPager = function (o) {
            var pageCount = o.lrs.pc;
            var page = o.lrs.p || 1;
            if (o.lrs.pgn) {
                var result = se;

                result += renderButton(1, icon('o-arw double left'), 0, page < 2, 'ba');
                result += renderButton(page - 1, icon('o-arw left'), 0, page < 2, 'b');

                result += renderButton(page, page, 1, 0, 'c');

                result += renderButton(page + 1, icon('o-arw right'), 0, pageCount <= page, 'f');
                result += renderButton(pageCount, icon('o-arw double right'), 0, pageCount <= page, 'fa');

                var $pager = $grid.find('.awe-pager');
                $pager.html(result);

                $pager.find('.awe-btn').on(sclick, function () {
                    var p = $(this).data('p');
                    var act = $(this).data('act');
                    if (!o.ldg) {
                        $.when(dapi($grid).load({ start: function () { o.pg = parseInt(p); } }))
                            .done(function () {
                                var fbtn = $pager.find('[data-act=' + act + "]");
                                if (fbtn.is(':disabled')) {
                                    fbtn = $pager.find('.awe-btn:not(:disabled)').first();
                                }

                                if (!$(':focus').length) {
                                    fbtn.focus();
                                }
                            });
                    }
                });

                setTimeout(function () {
                    api.lay();
                }, 10);
            }
        };

        decideSwitch();

        if (!useMiniPager) {
            removeRegHandle(oo, 'mp');

            $win.on('aweload resize domlay', tryminipager);

            regHandlers['mp'][oo.i] = {
                h: tryminipager,
                e: 'resize domlay'
            };

            function tryminipager() {
                if (decideSwitch()) {
                    api.buildPager(oo);
                };
            }
        }

        function decideSwitch() {
            var cval = api.buildPager;
            var pc = oo.lrs ? oo.lrs.pc : 0;
            var nval = useMiniPager || $win.width() < 1000 && pc > 5 ? miniPager : original;
            api.buildPager = nval;
            return nval != cval;
        }

        function icon(icls) {
            return '<span class="' + icls + '" aria-hidden="true"></span>';
        }

        function renderButton(page, caption, selected, disabled, act) {
            var clss = "awe-btn ";
            if (selected) clss += saweselected + ' ';
            if (disabled) clss += "awe-disabled ";
            var dis = disabled ? sdisabled : se;
            return rbtn(clss, caption, 'data-p="' + page + '" data-act="' + act + '" ' + dis);
        }
    }

    function gridkeynav(o) {
        var grid = o.v;
        var api = dapi(grid);

        grid.addClass('keynav');
        grid.attr('tabindex', '0');
        var sctrl = slist(grid.find(sawecontentc), { sel: sawerowc, fcls: sfocus, sc: 'n', topf: topFunc, botf: botFunc, enter: onenter });

        function topFunc() {
            chpage(-1);
        }

        function botFunc() {
            chpage(1);
        }

        function onenter(e, focused) {
            if (focused.length) {
                prevDef(e);
                var shift = e.shiftKey;

                if (!shift && focused.find('.awe-movebtn').length) {

                    var next = pickAvEl([focused.next(), focused.prev()]);

                    focused.removeClass(sfocus);
                    focused.find('.awe-movebtn').click();

                    if (next) {
                        sctrl.focus(next);
                    }

                } else {
                    focused.click();
                }

                if (shift) {
                    if (grid.closest('.awe-lookup-popup').length) {
                        focused.addClass(saweselected);
                    }

                    var lookupPopup = grid.closest('.awe-lookup-popup, .awe-multilookup-popup');
                    if (lookupPopup.length) {
                        dto(lookupPopup).api.ok();
                    }
                }
            }
        }


        var nofocus;
        grid.keydown(function (e) {
            var trg = $(e.target);
            var k = which(e);
            if ((k == keyDown || k == keyUp) && trg.is('.awe-btn:not(.o-ddbtn)')) {
                trg = grid;
                grid.focus();
            }

            if (trg.is(grid)) {
                var keys = [40, 38, 35, 36, 34, 33];

                sctrl.keyh(e);

                if ($.inArray(k, keys) != -1) {
                    prevDef(e);
                }

                if (k == 34) {
                    // page down
                    chpage(1);
                } else if (k == 33) {
                    // page up
                    chpage(-1);
                } else if (k == 35) {
                    // end
                    sctrl.focus(grid.find(sawerowc).last());
                    sctrl.scrollToFocused();
                } else if (k == 36) {
                    // home
                    sctrl.focus(grid.find(sawerowc).first());
                    sctrl.scrollToFocused();
                } else if (k == 32) {
                    //space
                    onenter(e, grid.find('.' + sfocus));
                }
            }
        })
            .on('mousedown',
                function () {
                    nofocus = 1;
                    setTimeout(function () { nofocus = 0; }, 100);
                })
            .on('focusin',
                function (e) {
                    if (!nofocus && !$(e.target).is(':input')) {
                        sctrl.autofocus();
                    }

                    nofocus = 0;
                })
            .on('focusout',
                function () {
                    sctrl.remf();
                })
            .on(saweload, removeTabIndex);

        function removeTabIndex() {
            grid.find('.awe-footer .awe-btn').each(function () {
                var btn = $(this);
                btn.attr('tabindex', -1);
            });
        };

        function chpage(val) {
            var res = o.lrs;
            if (res.p < res.pc && val > 0 || res.p > 1 && val == -1) {
                $.when(api.load({ oparams: { page: res.p + val } })).done(function () {
                    var tof = null;
                    if (val < 0) tof = grid.find(sawerowc).last();
                    sctrl.autofocus(tof);
                });
            }
        }
    }

    function dragAndDrop(opt) {
        var dropContainers = [];
        var dropFuncs = [];
        var dropHoverFuncs = [];

        opt.to && $.each(opt.to, function (i, val) {
            dropContainers.push(val.c);
            dropHoverFuncs.push(val.hover);
            dropFuncs.push(val.drop);
        });

        if (opt.dropSel) {
            opt.tof = function () {
                return $(opt.dropSel).map(function (i, el) { return $(el); }).get();
            };
        }

        return awe.rdd(opt.from, opt.sel, dropContainers, dropFuncs, opt.dragClass, opt.hide, dropHoverFuncs, opt.end,
            opt.reshov, opt.scroll, opt.wrap, opt.ch, opt.cancel, opt.kdh, opt.move, opt.hover, opt.drop, opt.handle, opt.gscroll, opt.tof);
    }

    function dragReor(opt) {
        var placeh;
        var plhclss = opt.plh || 'o-plh';
        var sel = opt.sel;
        var handle = opt.handle;
        var lasthov;
        var fromCont = opt.from;
        var previ;
        var ondrop = opt.ondrop;
        var newo = opt.newo;
        var initm;
        var justmoved;
        var hovs;
        var splh;

        var swrap = opt.swrap;
        var shov = opt.shov;

        if (opt.splh) {
            opt.hovec = opt.hovec || empf;
        }

        var gcon = opt.gcon || function (cx) {
            return cx.cont;
        }

        function wrap(cx) {
            var clone = swrap && swrap(cx);

            hovs = [0, 0];
            var dragObj = cx.drgo;
            previ = dragObj.index();
            placeh = dragObj.clone().addClass(plhclss);
            splh = opt.splh;
            cx.plh = placeh;

            initm = 1;
            justmoved = 0;
            placeh.hide();
            dragObj.after(placeh);

            return clone || dragObj.clone();
        }

        function reshov() {
            if (placeh && !splh) {
                placeh.detach();
            }

            lasthov = null;
        }

        // executed when hovering opt.to
        // returns the cont parameter in gscroll
        function hoverFunc(cx) {
            shov && shov(cx);
            placeh = cx.plh;
            var cont = gcon(cx), x = cx.x, y = cx.y;
            if (initm) {
                placeh.show();
                initm = 0;
            }

            if (opt.chkhov && !opt.chkhov(cx)) return cont;

            var hovered = 0;
            var elms = cont.find(sel + ':visible').get();

            // check still hovering last
            if (lasthov != null) {
                var ofs = lasthov.offset();
                var lx = ofs.left;
                var ly = ofs.top;

                if (ly + lasthov.outerHeight() > y &&
                    ly < y &&
                    lx + lasthov.outerWidth() > x
                    && lx < x) {
                    return cont;
                }
            }

            var len = elms.length;
            var cof = cont.offset();
            var minDist;
            var isAbove = y < cof.top;
            var outside =
			(isAbove || x < cof.left ||
			y > cof.top + cont.outerHeight() || x > cof.left + cont.outerWidth());

            if (outside && !splh) {
                return cont;
            }

            for (var i = 0; i < len; i++) {
                var item = $(elms[i]);
                var iof = item.offset();
                var iow = item.outerWidth();
                var ioh = item.outerHeight();

                var ix = iof.left + iow;
                var iy = iof.top + ioh;

                if (isAbove) {
                    var distance = Math.abs(x - (ix - iow / 2)) + Math.abs(y - (iy - ioh / 2));

                    if (!i || distance < minDist) {
                        minDist = distance;
                        lasthov = item;
                        hovered = item;
                    }
                } else {
                    if (y < iy && x < ix) {
                        lasthov = item;
                        hovered = item;
                        break;
                    }
                }
            }

            if (!hovered && outside) {
                for (var j = len - 1; j >= 0; j--) {
                    var itm = $(elms[j]);
                    var jof = itm.offset();
                    var jx = jof.left;
                    var jy = jof.top;

                    if (x > jx && y > jy) {
                        lasthov = itm;
                        hovered = itm;
                        break;
                    }
                }
            }

            if (justmoved) {
                if (!hovered) {
                    justmoved = 0;
                } else if (justmoved.is(hovered)) {
                    return cont;
                }
            }

            var st = $win.scrollTop();

            if (hovered) {
                justmoved = hovered;

                var pi = placeh.index();
                if (hovered.index() < pi || pi == -1) {
                    hovered.before(placeh);
                } else {
                    hovered.after(placeh);
                }

            } else {
                if (opt.hovec) {
                    opt.hovec(cx);
                } else {
                    cont.append(placeh);
                }
            }

            // chrome page jump
            if (st != $win.scrollTop()) {
                $win.scrollTop(st);
            }

            return cont;
        }

        function dropFunc(cx) {
            var dragObj = cx.drgo;
            if (opt.dropFunc) return opt.dropFunc(cx);
            var nobj = dragObj;
            if (newo) {
                nobj = newo(cx);
            };

            if (placeh.closest('body').length) {
                placeh.after(nobj).remove();
            } else {
                // placeholder should be present
            }

            nobj.trigger('awedrop', { from: fromCont, previ: previ });
            ondrop && ondrop(cx);
        }

        // get additional containers to scroll on drag
        function gscroll(cont) {
            if (cont) {
                return [{ c: cont, y: 1 }];
            }
        }

        function end(cx) {
            placeh.remove();
            placeh = null;
        }

        return dragAndDrop({
            from: opt.from,
            sel: sel,
            handle: handle,
            dropSel: opt.to,
            tof: opt.tof,
            wrap: wrap,
            hover: hoverFunc,
            drop: dropFunc,
            reshov: reshov,
            cancel: opt.cancel,
            gscroll: opt.gscroll || gscroll,
            end: end,
            hide: 1, // hide dragObj until dropped
            scroll: opt.scroll || [{ c: $(window), y: 1 }]
        });
    }

    function multilookupGrid(o) {
        var popup;
        var gridsrl, gridsel;
        var api = o.api;
        o.p.dh = o.p.h;
        api.gsval = getSelectedValue;

        function getSelectedValue() {
            if (gridsel && dto(gridsel).lrs) {
                return gridsel.find(sawerowc).map(function () { return $(this).data('k'); }).get();
            } else {
                return awe.val(dto(popup).v);
            }
        }

        api.lay = function () {
            if (gridsrl && gridsel) {

                var resth = popup.find('.awe-scon').height() -
                    gridsrl.outerHeight() -
                    gridsel.outerHeight() +
                    popup.outerHeight() -
                    popup.height();

                var avh = o.avh || popup.height();
                var newh = (avh - resth - 1) / 2;

                setGridHeight(gridsrl, newh);
                setGridHeight(gridsel, newh);
            }
        };

        api.rload = function () {
            dapi(gridsrl).load();
            dapi(gridsel).load();
        };

        o.v.on('awepopupinit', function () {
            gridsrl = null;
            gridsel = null;
            popup = o.p.d;

            popup.on(sclick, '.awe-movebtn', function (e) {
                var trg = $(e.target);
                var gridfrom = gridsel, gridto = gridsrl;
                if (trg.closest(gridsrl).length) {
                    gridfrom = gridsrl;
                    gridto = gridsel;
                }

                var trgRow = trg.closest(sawerowc);


                gridto.find('.awe-content .awe-tbody')
                    .prepend(dapi(gridto).renderRow(dapi(gridfrom).model(trgRow))); // trgRow.data(smodel)

                trgRow.remove();
                movedGridRow(gridfrom, gridto);
            });

            popup.on(saweinit, function (e) {

                var it = $(e.target);
                if (it.is(sawegridcls)) {
                    var gdo = dto(it);
                    gdo.pro = dto(popup);

                    var getSelected = function () { return { selected: getSelectedValue() }; };

                    gdo.parf = gdo.parf ? gdo.parf.concat(getSelected) : [getSelected];

                    if (it.is('.awe-srl')) {
                        gridsrl = it;
                    }
                    else if (it.is('.awe-sel')) {
                        gridsel = it;
                        api.lay();
                    }
                }
            });
        });

        o.p.wlim = 5;
    }

    function lookupKeyNav(o) {
        var popup;
        var api = o.api;
        o.v.on('awepopupinit', function () {
            popup = o.p.d;

            handleCont(o.srl.closest('.awe-list'));

            if (o.sel) {
                handleCont(o.sel.closest('.awe-list'));
            }

            function handleCont(cont) {
                cont.attr('tabindex', 0);

                var sctrl = slist(cont, { sel: '.awe-li', enter: onenter });

                function onenter(e, focused) {
                    prevDef(e);
                    var shift = e.shiftKey;
                    if (focused.is('.awe-morecont')) {
                        var prev = focused.prev();
                        focused.parent()
                            .one(saweload, function () {
                                var tofocus = pickAvEl([prev.next(), prev, cont.find('.awe-li').first()]);

                                sctrl.focus(tofocus);
                            });
                        focused.find('.awe-morebtn').click();
                    } else if (focused.find('.awe-movebtn').length && !shift) {
                        var tofocus = pickAvEl([focused.next(), focused.prev()]);

                        focused.removeClass(sfocus);
                        focused.find('.awe-movebtn').click();

                        if (tofocus) {
                            sctrl.focus(tofocus);
                        }
                    }
                    else {
                        focused.click();
                        if (shift) {
                            focused.addClass(saweselected);
                        }
                    }

                    if (shift) {
                        api.ok();
                    }
                }

                function handleKeys(e) {
                    var keys = [40, 38, 35, 36, 34, 33];
                    if (sctrl.keyh(e) || $.inArray(which(e), keys) != -1) {
                        prevDef(e);
                    }

                    if (which(e) == 32) { // space
                        onenter(e, cont.find('.focus'));
                    }
                }

                cont.keydown(handleKeys);
                cont.on('focusout', function () {
                    cont.find('.focus').removeClass(sfocus);
                }).on(skeyup, function (e) {
                    if (which(e) == 9)//tab
                        sctrl.autofocus();
                });
            }
        });
    }

    function lookupGrid(o) {
        var popup;
        var grid;
        var api = o.api;

        api.gsval = function () {
            return popup.find(saweselectedc).data('k');
        };

        api.lay = function () {

            if (grid) {
                var resth = popup.find('.awe-scon').height() - grid.outerHeight() + popup.outerHeight() - popup.height();

                var newh = (o.avh || popup.outerHeight()) - resth;

                setGridHeight(grid, newh);
            }
        };

        //api.rlay = function () {
        //    if (grid) {
        //        initgridh(grid);
        //    }
        //};

        api.rload = function () {
            dapi(grid).load();
        };

        o.v.on('awepopupinit', function () {
            popup = o.p.d;
            grid = null;

            popup.on('dblclick', sawerowc, function (e) {
                if (!istrg(e, '.awe-nonselect')) {
                    o.api.sval($(this).data('k'));
                }
            });

            popup.on(saweinit, function (e) {
                var g = $(e.target);
                if (g.is(sawegridcls)) {
                    dto(g).pro = dto(popup);
                    grid = g;
                    api.lay();
                }
            });
        });

        //o.p.af = 0;
        o.p.wlim = 5;
    }

    function tbtns(o) {
        var tabs = $('#' + o.i);

        function laybtns() {
            var av = tabs.width();
            var w = av;
            tabs.find('.awe-tabsbar br').remove();
            var btns = tabs.find('.awe-tab-btn');
            var len = btns.length;
            var isFirst = 1;
            for (var i = len - 1; i >= 0; i--) {
                var btn = btns.eq(i);
                w -= btn.outerWidth();

                if (w < 0) {
                    if (isFirst) continue;
                    btn.after('</br>');
                    isFirst = 1;
                    i++;
                    w = av;
                } else {
                    isFirst = 0;
                }
            }
        }

        tabs.on('awerender', function (e) {
            if (!$(e.target).is(tabs)) return;
            laybtns();
        });

        $win.off('resize domlay', laybtns).on('resize domlay', laybtns);
    }

    function dtp(o) {
        var id = o.i;
        var cmid = id + 'cm';
        var cyid = id + 'cy';
        var popupId = id + '-awepw';

        var monthNames = cd().Months;

        var dayNames = cd().Days.slice(0);

        if (awem.fdw) {
            dayNames.push(dayNames.shift());
        }

        var prm = o.p;
        var input = o.v;
        var openb = o.f.find('.awe-dpbtn');
        var selDate = null;
        var inline = prm.ilc;
        var inlCont = o.f.find('.awe-ilc');
        var rtl = o.rtl;
        var nxtcls = '.o-mnxt';
        var prvcls = '.o-mprv';

        if (rtl) {
            var c = nxtcls;
            nxtcls = prvcls;
            prvcls = c;
        }

        var cmdd;
        var cydd;
        var isOpening;
        var currDate;
        var today;

        var numberOfMonths;
        var defaultDate;
        var dateFormat;
        var changeYear;
        var changeMonth;
        var minDate;
        var maxDate;
        var amaxDate;
        var yearRange;

        var popup, cont;
        var wasOpen;
        var kval;

        init();

        input.attr('autocomplete', 'off');

        input.on(skeyup, keyuph)
           .on(skeydown, inpkeyd);

        openb.on(skeydown, function (e) {
            var key = which(e);
            if (key == keyEnter) {
                wasOpen = !isOpen();
            }

            if (keynav(key)) {
                prevDef(e);
            }
        }).on(skeyup, keyuph);

        if (inline) {
            openDtp();
        } else {
            if (!isMobile()) {
                input.on(sclick, openDtp);
            }

            openb.on(sclick, openDtp);
        }

        input.change(function () {
            var sval = input.val().trim();
            if (sval == se) return;

            var date = tryParse(sval, currDate, minDate, maxDate);

            if (!date) {
                input.val(se).change();
                return;
            }

            var nsdate = tryParse(sval);
            if (!nsdate || datesDif(date, nsdate) || formatDate(dateFormat, date) != sval) {
                o.api.setDate(date);
            } else {
                setVal(date);
            }
        });

        o.api.getDate = function () {
            return tryParse(input.val());
        }

        o.api.setDate = function (val) {
            input.val(formatDate(dateFormat, val)).change();
        }

        function setVal(newVal) {
            var change = 0;
            if (newVal && (!selDate || datesDif(newVal, selDate))) {
                selDate = newVal;
                setCurrDate(selDate);
                change = 1;
            }

            if (!newVal && selDate) {
                selDate = null;
                change = 1;
            }

            if (change && (cont && inline || isOpen())) {
                updateCalendar();
            }
        }

        function setCurrDate(newDate) {
            if (minDate && newDate < minDate) {
                currDate = cdate(minDate);
            }
            else if (amaxDate && newDate > amaxDate) {
                currDate = cdate(amaxDate);
            } else {
                currDate = cdate(newDate);
            }
        }

        function moveHov(dir) {
            var pivot = getHov();
            var sel = '.o-enb';
            if (cont.find(nxtcls).is(':enabled')) {
                sel = '.o-mnth:first ' + sel;
            }

            var list = cont.find(sel);

            var indx = list.index(pivot) + dir;
            var n = list.eq(indx);

            if (!n.length || indx < 0) {
                n = 0;
                var cls = dir > 0 ? nxtcls : prvcls;
                var fl = dir > 0 ? 'first' : 'last';
                var nbtn = cont.find(cls);

                if (nbtn.is(':enabled')) {
                    cont.find(cls).click();
                    n = cont.find('.o-mnth:first .o-enb:' + fl);
                }
            }

            if (n && n.length) {
                cont.find('.o-hov').removeClass('o-hov');
                n.addClass('o-hov');
            }
        }

        function keynav(key) {
            var res = 0;
            if (isOpen()) {
                if (key == keyDown) {
                    moveHov(1);
                    res = 1;
                }
                else if (key == keyUp) {
                    moveHov(-1);
                    res = 1;
                }
            }

            if (res) cont.addClass('o-nhov');
            return res;
        }

        function inpkeyd(e) {
            var key = which(e);

            if (keynav(key)) {
                prevDef(e);
            }

            if (!isOpen()) {
                if (key == keyDown || key == keyUp) {
                    openDtp(e);
                }
            }

            // / / . . - -
            awe.pnn(e, [191, 111, 190, 110, 189, 109]);

            kval = input.val();
        }

        function keyuph(e) {
            var k = which(e);

            if (isOpen()) {
                if (k == keyEnter) {
                    if (!wasOpen) {
                        getHov().click();
                    }
                } else if (!inline && k == keyEsc) {
                    dapi(popup).close();
                    e.stopPropagation();
                }
                else if (input.val() != kval) {
                    var date = tryParse(input.val(), currDate, minDate, maxDate);
                    setVal(date);
                }
            }

            wasOpen = 0;
        }

        function isOpen() {
            return cont && cont.closest('body').length;
        }

        function getHov() {
            var h = cont.find('.o-hov');
            if (!h.length) h = cont.find('.o-enb:hover');
            if (!h.length) h = cont.find('.o-enb.o-selday');
            if (!h.length) h = cont.find('.o-enb.o-tday');
            if (!h.length) h = cont.find('.o-enb:first');

            return h;
        }

        function tryParse(sval, baseDate, mind, maxd) {
            var val = 0;
            try {
                if (!sval) return 0;
                val = parseDate(dateFormat, sval, baseDate, mind, maxd);
                if (isNaN(val)) val = 0;
            }
            catch (err) {
            }

            return val;
        }

        function init() {
            today = cdate();
            remTime(today);

            numberOfMonths = prm.numberOfMonths || 1;
            defaultDate = prm.defaultDate;
            dateFormat = prm.dateFormat;
            changeYear = prm.changeYear;
            changeMonth = prm.changeMonth;
            minDate = prm.minDate;
            maxDate = prm.maxDate;
            yearRange = prm.yearRange;

            if (prm.min) {
                minDate = tryParse(prm.min);
            }

            if (prm.max) {
                maxDate = tryParse(prm.max);
            }

            if (maxDate) {
                amaxDate = cdate(maxDate);
                amaxDate.setMonth(amaxDate.getMonth() - numberOfMonths + 1);
            }

            initCurrDate();
        }

        function initCurrDate() {
            selDate = tryParse(input.val());

            setCurrDate(selDate || currDate || defaultDate || today);

            remTime(currDate);
        }

        function openDtp(e) {
            if (isOpen() || isOpening) return;
            isOpening = 1;

            init();

            if ($('#' + popupId).length) {
                dapi($('#' + popupId)).destroy();
            }

            cont = $(rdiv('o-dtp')).hide();
            cont.appendTo($('body'));

            if (inline) {
                cont.addClass('o-inl');
            }

            if (inline) {
                inlCont.html(cont);
            } else {
                popup = $('<div id="' + popupId + '"/>');
                popup.append(cont);

                var ctf = input;
                if (input.is('[readonly]')) {
                    ctf = openb;
                }

                if (e && istrg(e, openb)) {
                    ctf = openb;
                }

                awem.dropdownPopup({
                    opener: o.f,
                    fcs: ctf,
                    rtl: rtl,
                    p: { d: popup, i: popupId, minw: 'auto', pc: 'o-dtpp', nf: 1 },
                    tag: { Dd: 1, MinWidth: '150px' }
                });

                dapi(popup).open({ e: e });
            }

            cont.html(render(currDate));
            changeMonth && awe.radioList({ i: cmid, nm: cmid, df: monthItems, md: awem.odropdown, tag: { Asmi: -1 } });
            changeYear && awe.radioList({ i: cyid, nm: cyid, df: yearItems, md: awem.odropdown, tag: { Asmi: -1 } });
            cmdd = $('#' + cmid);
            cydd = $('#' + cyid);

            updateCalendar(1);

            cont.on(smousemove, function () {
                cont.removeClass('o-nhov');
                cont.find('.o-hov').removeClass('o-hov');
            });

            cont.on(sclick,
                '.o-mday:not(.o-dsb)',
                function () {
                    var td = $(this);
                    cont.find('.o-selday').removeClass('o-selday');
                    td.addClass('o-selday');
                    selDate = new Date(td.data('y'), td.data('m'), td.data('d'));

                    input.val(formatDate(dateFormat, selDate));
                    awe.ach(o);
                    popup && dapi(popup).close();
                });

            cont.on(sclick,
                nxtcls,
                function () {
                    var ndate = cdate(currDate);
                    incMonth(ndate, 1);
                    setCurrDate(ndate);
                    updateCalendar();
                });

            cont.on(sclick,
                prvcls,
                function () {
                    var ndate = cdate(currDate);
                    incMonth(ndate, -1);
                    setCurrDate(ndate);
                    updateCalendar();
                });

            cont.show();

            popup && dapi(popup).lay();

            cmdd.change(function () {
                var ndate = cdate(currDate);
                ndate.setDate(1);
                ndate.setMonth(cmdd.val());
                setCurrDate(ndate);
                updateCalendar();
            });

            cydd.change(function () {
                var ndate = cdate(currDate);
                ndate.setDate(1);
                ndate.setFullYear(cydd.val());
                setCurrDate(ndate);
                updateCalendar();
            });

            isOpening = 0;
        }

        function updateCalendar(oinit) {
            var monthcs = cont.find('.o-mnth');
            var mlen = monthcs.length;
            monthcs.each(function (i, el) {
                var day = cdate(currDate);
                incMonth(day, i);
                var mc = $(el);
                mc.find('.o-tb').html(renderDaysTable(day, mlen));

                if (i || !changeYear) mc.find('.o-yhd').html(pad(year(day)));
                if (i || !changeMonth) mc.find('.o-mhd').html(pad(monthName(day)));

                if (mlen == i + 1) {
                    var ldm = lastDayOfMonth(day);
                    setDisabled(cont.find(nxtcls), maxDate && ldm >= maxDate);
                }
            });

            var fdm = firstDayOfMonth(currDate);
            setDisabled(cont.find(prvcls), minDate && fdm <= minDate);

            changeMonth && dapi(cmdd.val(currDate.getMonth())).load();
            changeYear && dapi(cydd.val(year(currDate))).load();

            if (!oinit) {
                popup && dapi(popup).lay();
            }
        }

        function yearItems() {
            var y = year(currDate);

            var res = [];
            var startYear = y - 15;
            var endYear = y + 15;

            if (yearRange) {
                var yra = yearRange.split(":");
                startYear = calcYear(yra[0], y, year(today));
                endYear = calcYear(yra[1], y, year(today));
            }

            if (minDate) {
                startYear = Math.max(startYear, year(minDate));
            }

            if (amaxDate) {
                endYear = Math.min(endYear, year(amaxDate));
            }

            for (var i = startYear; i <= endYear; i++) {
                res.push({ c: i, k: i });
            }

            return res;
        }

        function monthItems() {
            var allowed = null;
            if (minDate || amaxDate) {
                var min = null, max = null;

                if (amaxDate) {
                    max = cdate(amaxDate);
                    max.setDate(1);
                }

                if (minDate) {
                    min = cdate(minDate);
                    min.setDate(1);
                }

                var start = cdate(currDate);

                start.setDate(1);
                start.setMonth(0);
                allowed = {};

                for (var j = 0; j < 12; j++) {
                    if ((!min || start >= min) && (!max || start <= max)) {
                        allowed[j] = 1;
                    }

                    incMonth(start, 1);
                }
            }

            var res = [];
            for (var i = 0; i < monthNames.length; i++) {
                if (!allowed || allowed[i])
                    res.push({ c: monthNames[i], k: i });
            }

            return res;
        }

        function render(currDate) {
            var res = se;
            for (var i = 0; i < numberOfMonths; i++) {
                var day = cdate(currDate);
                incMonth(day, i);

                res += rdiv('o-mnth', renderMonth(day, i == 0, i == numberOfMonths - 1), 'data-i="' + i + '"');
            }

            return res;
        }

        function renderDaysTable(pivotDay, mlen) {
            var fdm = firstDayOfMonth(pivotDay);
            var ldm = lastDayOfMonth(pivotDay);

            var pmd0 = startOfWeek(fdm);
            var nm1 = endOfWeek(ldm);

            var day = pmd0;

            var table = se;

            function renderDay(d) {
                var date = d.getDate();
                var m = d.getMonth();
                var y = year(d);
                var cls = 'o-day';
                var enb = 0;
                var out = 0;
                if (d < fdm || d > ldm) {
                    cls += ' o-outm';
                    out = 1;
                } else {
                    cls += ' o-mday';
                    enb = 1;
                }

                if (d <= today && d >= today && !out && mlen) {
                    cls += ' o-tday';
                }

                var opt = { cls: cls, d: d };

                if (prm.dayf) {
                    prm.dayf(opt);
                    cls = opt.cls;
                }

                if (minDate && d < minDate || maxDate && d > maxDate || opt.dsb) {
                    cls += ' o-dsb';
                } else if (enb) {

                    cls += ' o-enb';

                    if (selDate && d <= selDate && d >= selDate) {
                        cls += ' o-selday';
                    }
                }

                return '<td class="' +
                    cls +
                    '" data-d="' +
                    date +
                    '" data-m="' +
                    m +
                    '" data-y="' +
                    y +
                    '" ><div>' +
                    date +
                    '</div></td>';
            }

            table += '<tr class="o-wdays">';
            for (var di = 0; di < dayNames.length; di++) {
                table += '<td>' + dayNames[di] + '</td>';
            }
            table += '</tr>';

            var i = 1;
            var rowstarted = 0;
            var rowCount = 0;
            while (day <= nm1 || rowCount < 6) {
                if (!rowstarted) {
                    table += '<tr>';
                    rowstarted = 1;
                }

                table += renderDay(day);

                if (i == 7) {
                    table += '</tr>';
                    rowstarted = 0;
                    i = 0;
                    rowCount++;
                }

                nextDay(day);
                i++;
            }

            return table;
        }

        function renderMonth(pivotDay, first, last) {
            var mbtn = function (cls, icls) {
                return rbtn('awe-btn o-cmbtn ' + cls, '<i class="o-arw ' + icls + '"></i>');
            }

            var topbar = '<div class="o-mtop">';

            if (first) {
                topbar += mbtn(rtl ? 'o-mnxt' : 'o-mprv', 'left');
            }

            var mval = pivotDay.getMonth();
            var yval = year(pivotDay);

            topbar += '<div class="o-ym"><div class="o-mhd">' +
                (first && changeMonth ? radioList(cmid, mval, 'o-cm') : pad(monthName(pivotDay))) +
                '</div>' +
                '<div class="o-yhd">' +
                (first && changeYear ? radioList(cyid, yval, 'o-cy') : pad(yval)) +
                '</div></div>';

            if (last) {
                topbar += mbtn(rtl ? 'o-mprv' : 'o-mnxt', 'right');
            }

            topbar += '</div>';

            return topbar + '<table class="o-tb"></table>';
        }

        function monthName(pivotDay) {
            var mval = pivotDay.getMonth();
            return monthNames[mval];
        }

        function pad(s) {
            return "<span class='o-txt'>" + s + "</span>";
        }

        function calcYear(fstr, cy, ty) {
            function f(res, i, fstr, cy, ty) {
                if (fstr[i] == 'c')
                    return f(cy, i + 1, fstr, cy, ty);
                if (fstr[i] == '-' || fstr[i] == '+')
                    if (res)
                        res = res + parseInt(fstr.substr(i));
                    else
                        res = ty + parseInt(fstr.substr(i));
                else return parseInt(fstr);

                return res;
            }

            return f(0, 0, fstr, cy, ty);
        }

        // utils methods

        function radioList(id, val, cls) {
            return rdiv('awe-ajaxradiolist-field ' + cls, '<input id="' + id +
                '" class="awe-val" type="hidden" value="' + val +
                '" />' + rdiv('awe-display'));
        }

        function startOfWeek(date) {
            var dat = cdate(date);

            var day = dat.getDay();
            var diff = dat.getDate() - day;

            if (awem.fdw) {
                diff += (day == 0 ? -6 : 1);
            }

            dat.setDate(diff);
            return dat;
        }

        function endOfWeek(d) {
            var dat = cdate(startOfWeek(d));
            dat.setDate(dat.getDate() + 6);
            return dat;
        }

        function firstDayOfMonth(d) {
            var dat = cdate(d);
            dat.setDate(1);
            return dat;
        }

        function remTime(d) {
            d.setHours(0, 0, 0, 0);
        }

        function nextDay(d) {
            d.setDate(d.getDate() + 1);
        }

        function incMonth(d, m) {
            d.setDate(1);
            d.setMonth(d.getMonth() + m);
            return d;
        }
    }

    function rendOchk(o, radio, checked, type, name, value) {
        var attr = disbAttr(o);
        if (checked) attr += ' checked="checked"';
        if (name) attr += ' value="' + value + '" name="' + name + '"';
        return '<div tabindex="0" class="o-chk ' + (checked ? schked : se) + '" >' +
            (radio ? se : '<div class="o-chkc"><div class="o-chkico"></div></div>') +
            '</div><input type="' + type + '" ' + attr + ' style="display:none"/>';
    }

    function otggl(o) {
        return ochk(o, '.o-tg');
    }

    function ochk(o, cls) {
        var v = o.v;
        var chk = o.f.find(cls || '.o-chk');

        function toggle() {
            if (o.enb) {
                o.f.find(':checkbox').click();
            }
        }

        chk.on(sclick, function () {
            chk.blur();
            toggle();
        });

        chk.on(skeydown + ' ' + skeyup, function (e) {
            if (which(e) == keyEnter || which(e) == keySpace) {
                prevDef(e);
                if (e.type == skeyup)
                    toggle();
            }
        });

        var first = 1;
        var baseload = o.load;
        o.load = function () {
            baseload();
            var sel = chk.add(chk.closest('.o-chkm'));

            if (v.val() == 'true') {
                var tgg = sel.find('.o-tgg');
                first && tgg.css('transition', 'initial');
                sel.addClass(schked);
                first && setTimeout(function () { tgg.css('transition', ''); }, 300);
            }
            else sel.removeClass(schked);
            first = 0;
        };

        v.on(schange, o.load);

        chk.closest('label').on(sclick, function (e) {
            if ($(e.target).closest(chk).length) {
                prevDef(e);
            }
        });
    }

    function ochkl(o) {
        var radio = o.type == 'radioList' ? 1 : 0;
        var type = radio ? 'radio' : 'checkbox';
        var api = o.api;
        api.render = render;
        var disp = o.d;

        radio && disp.addClass('o-rdl') || disp.addClass('o-ochk');

        disp.on(schange, 'input:' + type, function () {
            var el = $(this);
            var ischk = el.is(':checked');
            var chk = el.prev().add(el.closest('.o-chkm'));

            radio && disp.find('.' + schked).removeClass(schked);

            if (ischk) {
                chk.addClass(schked);
            } else {
                !radio && chk.removeClass(schked);
            }

        }).on(skeydown + ' ' + skeyup, '.o-chk', function (e) {
            if (which(e) == keyEnter || which(e) == keySpace) {
                prevDef(e);
                if (e.type == skeyup) {
                    $(this).next().click();
                }
            }
        }).on(sclick, '.o-chk', function () {
            $(this).blur();
        });

        function render() {
            o.d.empty();
            var items = '<ul>';
            var vals = awe.val(o.v);
            for (var i = 0; i < o.lrs.length; i++) {
                var item = o.lrs[i];
                var checked = containsVal(kp(item), vals);
                var schkc = se;
                if (checked) {
                    schkc = schked;
                }

                items += '<li class="o-chkm ' + schkc + '"><label class="awe-label">' +
                     rendOchk(o, radio, checked, type, o.nm, kp(item)) +
                    '<span class="o-con">' + cp(item) + '</span></label></li>';
            }

            items += '</ul>';
            o.d.append(items);
        }
    }

    function initWave() {
        $(function () {
            $(document).on('mousedown touchstart', '.awe-btn, .awe-tab-btn, .o-wavs, .awe-sortable.awe-hc, .awe-sortable.awe-col, .o-chk', function (e) {
                var time = 700;
                var btn = $(this);
                if (btn.is(':disabled') || btn.closest('.awe-disabled').length || btn.closest('.nowave').length) return;

                var wc = $('<div class="o-wavc" tabindex="-1"/>');
                var wav = $('<div class="o-wav" tabindex="-1"/>');
                wc.append(wav);

                if (isMobile()) {
                    wc.addClass('o-mobl');
                }

                var csize;
                var istouch = e.type != 'mousedown';
                var isCol = 0;

                if (istouch) {
                    btn.data('awewvtch', 1);
                    setTimeout(function () { btn.data('awewvtch', 0); }, 330);
                }

                if (btn.data('awewvtch') && !istouch) return;

                var startCoords = istouch ? e.originalEvent.touches[0] : e;

                var x = startCoords.pageX - btn.offset().left;
                var y = startCoords.pageY - btn.offset().top;
                var w = btn.outerWidth();
                var h = btn.outerHeight();

                if (btn.is('.o-chk')) {
                    time = 350;
                    csize = w = h = 57;
                    x = y = csize / 2;
                    var marg = csize / 2 - btn.outerWidth() / 2;
                    wc.css('top', -marg);
                    wc.css('left', -marg);
                }

                // ff col click
                if (btn.is('.awe-sortable .awe-col')) {
                    btn = btn.parent();
                    isCol = 1;
                }

                mouseup();

                if (btn.closest('.awe-groupable').length) {
                    var uprls;
                    var moved;
                    $(document)
                        .one('mouseup touchend',
                            function () {
                                uprls = 1;
                            })
                        .one('mousemove touchmove', function () {
                            moved = 1;
                        });

                    setTimeout(function () {
                        if (!uprls && moved) {
                            wc.remove();
                        }
                    },
                        200);
                }

                function mouseup() {
                    wc.width(w).height(isCol ? '100%' : h);
                    var size = Math.max(w, h);

                    wav.css('left', x);
                    wav.css('top', y);
                    wav.width(20).height(20);

                    btn.append(wc);
                    size = csize || Math.max(size * 2, 100);
                    wav.width(size).height(size);

                    wav.css('opacity', 0);
                    setTimeout(function () {
                        wc.remove();
                    }, time);
                }
            });
        });
    }

    function gridCstRen(opt) {
        return function (o) {
            eval(opt.mdf)(o);
        };
    }

    return {
        initWave: initWave,
        otggl: otggl,
        empf: empf,
        ochkl: ochkl,
        ochk: ochk,
        autocomplete: autocomplete,
        dropmenu: dropmenu,
        formatDate: formatDate,
        parseDate: parseDate,
        setgh: setGridHeight,
        dtp: dtp,
        fdw: 0,
        tbtns: tbtns,
        lookupKeyNav: lookupKeyNav,
        multilookupGrid: multilookupGrid,
        lookupGrid: lookupGrid,
        gridCstRen: gridCstRen,
        gridMovRows: gridMovRows,
        dragAndDrop: dragAndDrop,
        dragReor: dragReor,
        clientDict: clientDict,
        gridInlineEdit: gridInlineEdit,
        gridLoading: gridLoading,
        gldng: gldng,
        gridInfScroll: gridInfScroll,
        gridPageSize: gridPageSize,
        gridPageInfo: gridPageInfo,
        gridColSel: gridColSel,
        gridColAutohide: gridColAutohide,
        btnGroup: buttonGroupRadio,
        btnGroupChk: buttonGroupCheckbox,
        multiselect: multiselect,
        colorDropdown: colorDropdown,
        imgDropdown: imgDropdown,
        imgItem: imgItem,
        combobox: combobox,
        timepicker: timepicker,
        menuDropdown: menuDropdown,
        odropdown: odropdown,
        dropdownPopup: dropdownPopup,
        inlinePopup: inlinePopup,
        isMobileOrTablet: isMobileOrTablet,
        multiselb: multiselb,
        gridAutoMiniPager: gridAutoMiniPager,
        gridMiniPager: gridMiniPager,
        gridKeyNav: gridkeynav,
        notif: notif,
        escape: escape,
        slist: slist
    };
}(jQuery);