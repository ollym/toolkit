var get = function(url, callback) {
    $.ajax({
        url: url,
        dataType: 'jsonp',
        type: 'GET',
        async: true,
        success: function(res) {
            callback(res.data);
        }
    });
}, loading = 0;
$.getJSONP = function(url, callback) {
    loading++;
    get(url, function(result) {
        callback(result);
        loading--;
        if (loading == 0) {
            $('#loading').hide();
            $('#main').css('display', 'block');
            $('#main').animate({opacity: 1});
        }
    });
}