(function(w){
    'use strict';

    var socket = io();
    socket.on('validateResponse', function(msg){
        $(".alert-info").removeClass('hide').find(".messages").html(msg.toString());

        setTimeout(function(){
            $(".alert-info").addClass('hide');
        },10000);
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

                $(".alert-success").removeClass('hide').find(".messages").html('Success !!!');

                setTimeout(function(){
                    $(".alert-success").addClass('hide');
                },10000);

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
