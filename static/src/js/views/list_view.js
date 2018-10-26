(function (global) {
    var ListView = function (res, usedKeys, theadData, limit) {
        return ListView.init(res, usedKeys, theadData, limit);
    }
    var render = function (params) {
        var $elem = $("");
        for (var el in params) {
            if (!Array.isArray(params[el])) {
                var res = render(params[el]);
                var elm = document.createElement(el);
                for (var i=0;i<res.length;i++) {
                    elm.appendChild(res[i]);
                }
                $elem.push(elm);
            }
            else if (Array.isArray(params[el])){
                for (var index in params[el]) {
                    var elm = document.createElement(el);
                    if (typeof params[el][index] === "object" && !Array.isArray(params[el][index])) {
                        var res = render(params[el][index]);
                        for (var index = 0;index < res.length;index++) {
                            elm.appendChild(res[index]);
                        }
                    } else {
                        elm.textContent = params[el][index];
                    }
                    $elem.push(elm)
                }
            }
        }
        return $elem;
    };
    var sortRow = function (ev, params) {
        var fieldName = ev.currentTarget.dataset.field;
    };
    var makeTable = function (res, usedKeys, theadData, limit) {
        var tbodyData = [];
        limit = limit.split("-");
        var startIndex = Number(limit[0]) - 1;
        var endIndex = Number(limit[1]);
        res = res.slice(startIndex, endIndex);
        for (var index = 0; index < res.length; index++) {
            var tdData = {
                td: [],
            };
            for (var pos = 0; pos < usedKeys.length; pos++) {
                tdData["td"].push(res[index][usedKeys[pos]]);
            }
            tbodyData.push(tdData);
        }
        var param = {
            table: {
                thead: {
                    tr: {
                        th: theadData,
                    }
                },
                tbody: {
                    tr: tbodyData,
                },
            }
        }
        return param;
    };
    ListView.init = function (res, usedKeys, theadData, limit) {
        var params = makeTable(res, usedKeys, theadData, limit);
        var $table = render(params);
        $table.addClass("table table-hover");
        $table.find("tbody tr:even").addClass("table-active");
        var $th = $table.find('thead th');
        for (var index = 0; index < $th.length; index++) {
            $th[index].setAttribute("data-field", usedKeys[index]);
        }
        $th.attr("scope", "col").click(function (ev) {
            sortRow(ev, params);
        });
        return $table;
    };
    ListView.prototype = {
    };
    ListView.init.prototype = ListView.prototype;
    global.ListView = ListView;
}) (window);