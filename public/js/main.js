(function(w){
    'use strict';

    var socket = io();
    socket.on('validateResponse', function(msg){
        console.info(msg);
    });

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
                if(data.data.errors){
                    var errors = data.data.errors;
                    var messages = "";
                    for(var i in errors) {
                        messages += '- ' + errors[i].message + '<br>';
                    }
                    $(".alert-danger").removeClass('hide').find(".messages").html(messages);

                    setTimeout(function(){
                        $(".alert-danger").addClass('hide');
                    },10000);

                    return false;
                }

                $("#name").val('');
                $("#ruleId").val('');
                $("#condition").val('');

            },
            dataType: 'json'
        });
    });

    $("#validateFacts").click(function()
    {
        var fact = $("#fact").val();
        socket.emit('validateFacts', fact);
    });

})(window);
