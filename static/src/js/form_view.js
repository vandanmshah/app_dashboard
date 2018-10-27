$(document).ready(function () {    
    _rpc({
        method: "search_read",
    }).then(function (res) {
        var clickedFieldID = Number(document.URL.split("field_id=")[1]);
        var fieldTodisplay;
        for(var index = 0; index < res.length; index++) {
            if (clickedFieldID === res[index]["set_id"]) {
                fieldTodisplay = res[index]
                break;
            }
        }
        var usedKeys = ["name", "date_uploaded", "status"];
        var fieldLabels = ["Name", "Date Uploaded", "Current Satus"];
        var $formMainData = $("<div />", {
            "class": 'form_main_data',
        });
        for (var i = 0; i < usedKeys.length; i++) {
            var $label = $("<label />", {
                text: fieldLabels[i],
            });
            var $span = $("<span />", {
                text: fieldTodisplay[usedKeys[i]],
            });
            var $div = $("<div />", {
                class: 'form_field',
            });
            $label.appendTo($div);
            $span.appendTo($div);
            $div.appendTo($formMainData);
        }
        $formMainData.appendTo($(".main_content"));
        var keysInListView = ["name", "uploader", "status"];
        var theadInListView = ["Document Name", "Uploaded By", "Current Status"];
        var $table = ListView(fieldTodisplay.documents, keysInListView, theadInListView, "1-10");
        $table.appendTo($(".main_content"));
    });
});