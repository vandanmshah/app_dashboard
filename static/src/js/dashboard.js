$(document).ready(function () {
    /**
     * When you click on pagination button this will
     * re-render whole ListView with new data
     *
     * @param {Event} ev event
     * @param {object} res JSON object
     */
    var onPagerBtnClick = function (ev, res) {
        $(".page-item").removeClass("active")
        $(ev.currentTarget.parentElement).addClass("active")
        var current = Number(ev.currentTarget.text);
        var usedKeys = ['no', 'name', 'status', 'date_uploaded'];
        // also mention all the header name with same sequence in usedKeys other wise it will
        // display in wrong sequence
        var theadData = ['No', 'Name', 'Status', 'Date Uploaded'];
        var limit = (((current - 1) * 10) + 1) + "-" + (current * 10);
        $("table").remove();
        var $table = ListView(res, usedKeys, theadData, limit);
        $table.appendTo($(".main_content"));
    };
    /**
     * This callback is for searching
     */
    $(".table_search").on("keyup", function () {
        // Declare variables 
        var input, filter, table, tr, td, i;
        input = $(".table_search")[0];
        filter = input.value.toUpperCase();
        table = $(".table")[0];
        tr = $('tbody tr');

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            var flag = false;
            var tds = tr[i].getElementsByTagName("td");
            for (var j = 0; j < tds.length; j++) {
                if (tds[j]) {
                    if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                        flag = true;
                    }
                }
            }
            if (flag) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    });
    
    // call _rpc to get JSON response
    _rpc({
        method: "search_read",
    }).then(function (res) {
        // mention all field name which you want to use
        var usedKeys = ['no', 'name', 'status', 'date_uploaded'];
        // also mention all the header name with same sequence in usedKeys other wise it will
        // display in wrong sequence
        var theadData = ['No', 'Name', 'Status', 'Date Uploaded'];
        // var param = ListView.makeTable(res, usedKeys, theadData, "1-10")
        var $table = ListView(res, usedKeys, theadData, "1-10");

        // onClick callback on <tr /> to display more data
        // open form_view.html file and pass ID which is currently clicked
        $table.find("tbody tr").on("click", function (e) {
            var currentFieldId = $(e.currentTarget).data("id");
            window.open("form_view.html?field_id=" + currentFieldId , "_self");
        })

        $table.appendTo($(".main_content"));
        var totalPagers = res.length > 10 ? Math.floor(res.length/10) : 0;
        for (var i = 0; i <= totalPagers; i++) {
            var li = document.createElement("li");
            $(li).addClass("page-item");
            var a = document.createElement("a");
            $(a).addClass("page-link").on("click", function (e) {
                onPagerBtnClick(e, res);
            });
            a.textContent = i + 1;
            li.appendChild(a);
            $(".pager")[0].appendChild(li);
        }
    });
});