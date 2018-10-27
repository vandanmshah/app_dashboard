(function (global) {
    /**
     * @public
     *
     * this function helps to construct ListView (<table /> structure from given response)
     * Most IMP thing is you can get table structure anywhere you can reuse this function very easily
     *
     * @param {object} res DB or JSON response
     * @param {Array} usedKeys from that response how meany fields (from DB) are used to display in ListView
     * @param {Array} theadData all the names you want to display on thead of table
     * @param {string} limit optional perameters for pagenation
     */
    var ListView = function (res, usedKeys, theadData, limit) {
        return ListView.init(res, usedKeys, theadData, limit);
    }
    /**
     * @private
     *
     * This  function construct Jquery formeted table
     * @param {object} params pass the key as a tag and array as a data to display to formet table
     *
     * Example:- pass the params in following
     * var params = {
     *      table: {
     *          thead: {
     *              tr: {
     *                  td: [array of data]
     *              }
     *          }
     *          tbody: {
     *              // pass the data as showed in thead
     *          }
     *      }
     * }
     * @returns Jquery formeted <table /> element
     */
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
    /**
     * @private
     *
     * this function is in development
     * this function helps to sort by the clicked <th />
     * @param {*} ev
     * @param {*} params
     */
    var sortRow = function (ev, params) {
        var fieldName = ev.currentTarget.dataset.field;
    };
    /**
     * @private
     *
     * This function split the whole JSON object in given limit which helps in pagination
     *
     * @param {object} res JSON response
     * @param {string} limit pagination limit
     * @returns splited JSON response
     */
    var splitData = function (res, limit) {
        limit = limit.split("-");
        var startIndex = Number(limit[0]) - 1;
        var endIndex = Number(limit[1]);
        return res.slice(startIndex, endIndex);
    }
    /**
     * @private
     *
     * @param {object} res
     * @param {Array} usedKeys from that response how meany fields (from DB) are used to display in ListView
     * @param {Array} theadData all the names you want to display on thead of table
     * @param {string} limit optional perameters for pagenation
     *
     * @returns {object} which you can pass to render function to construct <table /> element
     */
    var makeTable = function (res, usedKeys, theadData, limit) {
        var tbodyData = [];
        res = limit ? splitData(res, limit) : res;
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
        var allData = limit ? splitData(res, limit) : res;
        var $tr = $table.find('tbody tr');
        // debugger
        for (var index = 0; index < $tr.length; index++) {
            $tr[index].setAttribute("data-id", allData[index]["set_id"]);
        }
        return $table;
    };
    ListView.prototype = {
    };
    ListView.init.prototype = ListView.prototype;
    global.ListView = ListView;
}) (window);