$(function(){
    $('a.zipcode_search').click(function(e){
        e.preventDefault();
         
        var $parent = $(this).parent();
        var $zipcode = $('input.zipcode');
        var $error = $('div.zipcode_error');
         
        if ($parent.hasClass('loading')){
            return false;
        }
         
        $parent.addClass('loading');
        $error.hide();
         
        var city = $.trim($('input.city').val());
        var address = $.trim($('input.address').val());
         
        if(city == '' || address == ''){
            $zipcode.val('');
            $parent.removeClass('loading');
            $error.show();
            return false;
        }
         
        $.ajax({
            url: 'https://postit.lt/data/',
            dataType: 'json',
            crossDomain: true,
            data: {
                address: address + ', ' + city,
                key: 'postit.lt-examplekey'
            },
            success: function(resp){
                if(resp && resp.total == 1){
                    $zipcode.val('LT-' + resp.data[0].post_code);
                }
                else {
                    $zipcode.val('');
                    $error.show();
                }
            },
            error: function(){
                $zipcode.val('');
                $error.show();
            },
            complete: function(){
                $parent.removeClass('loading');
            }
        });
    });
});
