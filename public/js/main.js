(function(w){
    'use strict';

    $("#upsertButton").click(function()
    {
        var data = {
            ruleId     : $("#ruleId").val(),
            name       : $("#name").val(),
            condition  : $("#condition").val()
        };

        $.ajax({
            url: '/upsert',
            data: data,
            success: function(data, status){
                console.info(status);
                console.info(data);
            },
            dataType: 'json'
        });

    });
})(window);
