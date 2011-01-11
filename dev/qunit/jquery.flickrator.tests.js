/*
user with pub photos: yyellowbird/73071759@N00
no pub photos: masbah/37379635@N04
not a user: asdasdaasd
*/

module( "Basics", { 
  setup: function() {   
      $widget = $("#qunit-fixture");    
  },
  teardown: function() {
      $.fn.flickrator.reset();
  }
});
     
     
test("Default Options + Overrides", 3, function() {
    strictEqual($.fn.flickrator.defaults.api_key, '84dd33f08bcbcc3d5c78f66f49fb3580', 'Default api_key available');
    strictEqual($.fn.flickrator.defaults.api_url, 'http://api.flickr.com/services/rest/', 'Default api_url available');
    
    var options = {
          api_key: 'Someone else api key',
          api_url: 'this is a bad url, should not change this',
          userid:'73071759@N00',
          username: 'yyellowbird'
        };
        
    $widget.flickrator(options);
    deepEqual($.fn.flickrator.defaults, options, 'Defaults were extended properly');
});



test("Chainability Preserved", 1, function() {
    strictEqual( $widget.flickrator({username: 'yyellowbird'}), $widget, ".flickrator() should return this" );
});



test("Require username or userid", 1, function() {
    $widget.flickrator();
    ok( $.fn.flickrator.data.$widget.find('p').hasClass('frator_error'), "Widget error: No username or userid passed to flickrator" );
});







module( "Ajax", { 
  setup: function() {   
      $widget = $("#qunit-fixture");    
  },
  teardown: function() {
      $.fn.flickrator.reset();
  }
});





test("API Call: Translate user name into userid", 2, function() {
    $widget.flickrator({username: 'nonexistent guy'});
    ok( $.fn.flickrator.data.$widget.find('p').hasClass('frator_error'), "Widget error: Invalid username" );
    $.fn.flickrator.reset();
  
    $.fn.flickrator.defaults.username = 'yyellowbird';
    $.fn.flickrator.name_to_id();
    strictEqual( $.fn.flickrator.data.userid, '41568981@N00', "Translated username into flickr nsid" );
});



test("API Call: Get public photos from userid", 2, function() {
    $.fn.flickrator.data.userid = '37379635@N04';
    $.fn.flickrator.pub_photos();
    notEqual( $.fn.flickrator.data.pub_photos.photo, [], "Widget error: User has no public photos" );
    

    $.fn.flickrator.data.userid = '41568981@N00';
    $.fn.flickrator.pub_photos();
    ok( $.fn.flickrator.data.pub_photos.photo.length, "User has public photos" );
});








module( "Markup", { 
  setup: function() {   
      $widget = $.fn.flickrator.data.$widget = $("#qunit-fixture");  
      $.fn.flickrator.data.pub_photos = {'photo' : 
                                                    [{"id":"5327822844", "owner":"41568981@N00", "secret":"1703f13242", "server":"5205", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0},
                                                     {"id":"5327164581", "owner":"41568981@N00", "secret":"9b03276640", "server":"5050", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0},
                                                     {"id":"5325489777", "owner":"41568981@N00", "secret":"a2c6cced4e", "server":"5208", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0},
                                                     {"id":"5326090994", "owner":"41568981@N00", "secret":"c6e3f4b412", "server":"5003", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0},
                                                     {"id":"5326082932", "owner":"41568981@N00", "secret":"21bb63911c", "server":"5209", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0},
                                                     {"id":"5325437029", "owner":"41568981@N00", "secret":"9e8c487acb", "server":"5001", "farm":6, "title":"", "ispublic":1, "isfriend":0, "isfamily":0}]
                                        };
  },
  teardown: function() {
      $.fn.flickrator.reset();
  }
});



test("Build Widget Markup", 1, function() {
    $.fn.flickrator.widget_mode();
    ok( $widget.html(), "Widget markup created" );
    

});




 



/*
test("Override Default Options", function() {
    $.picasaWebViewer.overrideOptions({
        urlFormat : 'http://www.google.com',
        albumTitleMaxLength : 25,
        defaultDialogWidth : 400,
        defaultDialogHeight : 300,
        userName : 'BillGates'       
    });
    
    same($.picasaWebViewer.options.urlFormat, 'http://www.google.com');    
    same($.picasaWebViewer.options.albumTitleMaxLength, 25);    
    same($.picasaWebViewer.options.defaultDialogWidth, 400);    
    same($.picasaWebViewer.options.defaultDialogHeight, 300);    
    same($.picasaWebViewer.options.userName, 'BillGates');    
});




test("Calling Plugin with Override Options", function() {
   $("#targetId").picasaWebViewer({
      userName : "elijah.manor"
   });
    
   same($.picasaWebViewer.options.urlFormat,  
      'http://picasaweb.google.com/data/feed/api/user/{0}?alt=json-in-script');
   same($.picasaWebViewer.options.albumTitleMaxLength, 15);
   same($.picasaWebViewer.options.defaultDialogWidth, 600);
   same($.picasaWebViewer.options.defaultDialogHeight, 400);             
   same($.picasaWebViewer.options.userName, 'elijah.manor');    
});



 
test("Scafford Gallery", function() {
   $.picasaWebViewer.scaffoldGallery($(targetId));
   ok($(targetId).find('#gallery').length, 'Gallery created');
   ok($(targetId).find('#tabs').length, 'Tabs created');
});
*/