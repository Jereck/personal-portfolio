$(document).ready(function(){
    var userFeed = new Instafeed({
        get: 'user',
        userId: '186272509',
        limit: 22,
        resolution: 'standard_resolution',
        accessToken: '186272509.1677ed0.4036f2b74dc345379f9d297122a3ecb7',
        sortBy: 'most-recent',
        template: '<div class="gallery"><a href="{{image}}" title="{{caption}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="img-fluid"/></a></div>',
    });
    userFeed.run();

    $('.gallery').magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery:{
          enabled:true
        }
    });
});