(function (global) {
    var _rpc = function (params) {
        return new _rpc.rpc(params);
    } 
    /**
     * @public
     * 
     * @param {*} params.method mehtod name which we want to perform DB operation or fetch data from API
     */

    _rpc.rpc = function (params) {
        var self = this;
        // Add loading spinner while calling python method

        var loadingSpinner = document.createElement('div');
        loadingSpinner.className = "loading_spinner";
        loadingSpinner.innerHTML = "Fetching data"
        document.body.appendChild(loadingSpinner);

        var promise = new Promise(function (resolve, reject) {
            self[params.method](params, resolve);
        });
        return promise;
    }
    /**
     * @private
     * all method name should be same as python's method name
     * just decelare post method and pass your data
     * 
     */
    _rpc.prototype = {
        search_read : function (params, resolve, reject) {
            $.getJSON("dashboard.json")
            .done (function (res) {
                resolve(res);
            }).fail(function () {
                reject();
            }).always(function () {
                document.body.removeChild(document.getElementsByClassName("loading_spinner")[0]);
            });
        }
    }
    _rpc.rpc.prototype = _rpc.prototype;
    global._rpc = _rpc;
})(this);
