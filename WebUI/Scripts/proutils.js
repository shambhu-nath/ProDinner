// utils added in prodinner
(function ($) {
    utils.deleteFormat = function(popupName, gridId) {
        return function(model) {
            if (model.IsDeleted) {
                return "<button type='button' class='awe-btn delbtn' onclick=\"utils.restore('" + gridId + "'," + model.Id + ")\"><span class='ico-crud ico-restore'></span></button>";
            }

            return "<button type='button' class='awe-btn delbtn' onclick=\"awe.open('" + popupName + "', { params:{ id: " + model.Id + " }}, event)\"><span class='ico-crud ico-del'></span></button>";
        };
    };

    utils.restore = function(gridId, id) {
        var api = $('#' + gridId).data('api');
        var xhr = api.update(id, { restore: true });

        $.when(xhr).done(function() {
            var $row = api.select(id)[0];
            awe.flash($row);
        });
    };

    utils.lookupRestored = function(listId, key, func) {
        return function(o) {
            $('#' + listId).find('[data-val="' + o[key] + '"]').fadeOut(300, function() {
                $(this).after($.trim(o.Content)).remove();
                if (func) func();
            });
        };
    };

    utils.duration = function (hourw, hoursw,  minw) {
        return function(val) {
            var mval = parseInt(val, 10);
            if (isNaN(mval)) return val;
            var hour = Math.floor(mval / 60);
            var minute = mval % 60;
            var res = "";
            if (hour > 0)
                res += hour + " " + (hour > 1 ? hoursw: hourw) + " ";
            if (minute > 0)
                res += minute + " " + minw;
            
            return res;
        };
    };
})(jQuery);