(function($) {

  $.fn.flickrator = function(options) {
    var opts = $.extend($.fn.flickrator.defaults, options);
    return this.each(function() {
          $.fn.flickrator.data.$widget = $this = $(this);
          // Username or userid required
          if (!opts.userid && !opts.username) {  return $this.html('<center><p class="frator_error">Error: please provide a valid flickr username or userid  </p></center>'); }
            
          // Translate username to flickr nsid, if needed
          $.fn.flickrator.name_to_id();
          if(!$.fn.flickrator.data.userid){  return $this.html('<center><p class="frator_error">Error: Please provide a valid flickr username or userid  </p></center>');  }
          
          // Grab public photos for user
          $.fn.flickrator.pub_photos();          
          if(!$.fn.flickrator.data.pub_photos || !$.fn.flickrator.data.pub_photos.photo.length){  return $this.html('<center><p class="frator_error">Error: This user has no public photos to share  </p></center>');  }

          // Build markup from public photos
          $.fn.flickrator.widget_mode();

    
    });
  };






  // Convert username into user id
  $.fn.flickrator.name_to_id = function(){  
    if ($.fn.flickrator.defaults.userid){ $.fn.flickrator.data.userid = $.fn.flickrator.defaults.userid }
    else {
     
       $.ajax({
          async : false,
          url: $.fn.flickrator.defaults.api_url,
          data:{
                method : 'flickr.people.findByUsername',
                username: $.fn.flickrator.defaults.username,
                api_key: $.fn.flickrator.defaults.api_key,
                nojsoncallback : 1,
                format: 'json'
          },
                      
          success: function(data) { 
            var data = $.parseJSON(data);              
            try{  $.fn.flickrator.data.userid = data.user.nsid ;  }
            catch(err){}
          },
          complete: function(){
          }
          
       });
   
   }
  };



  
  
  // Grab public photos for user id
  $.fn.flickrator.pub_photos = function(){
   
     $.ajax({
        async : false,
        url: $.fn.flickrator.defaults.api_url,
        data:{
              method : 'flickr.people.getPublicPhotos',
              user_id: $.fn.flickrator.data.userid,
              api_key: $.fn.flickrator.defaults.api_key,
              nojsoncallback : 1,
              //per_page:10,
              format: 'json'
        },
                    
        success: function(data) { 
          var json_reply = $.parseJSON(data);              
          
          
          try{  $.fn.flickrator.data.pub_photos = json_reply.photos;  }
          catch(err){}
          
          
        },
        complete: function(){}
        
     });
     
  };




// build flickr tNail urls from json objects
$.fn.flickrator.url_builder = function (pic_json){
  var pic_urls = [],
      i = 0; 
  for (i; i < pic_json.length; i++){
      pic_urls.push('http://farm'+pic_json[i].farm+'.static.flickr.com/'+pic_json[i].server+'/'+pic_json[i].id+'_'+pic_json[i].secret+'_s.jpg');
  }
    
  return pic_urls;
};




// build widget markup
$.fn.flickrator.widget_mode = function(){
  
    //start position counter and grab 2 initial pics
    var $widget = $.fn.flickrator.data.$widget,
        counter = $.fn.flickrator.data.counter_pos = 0,
        pic_json = $.fn.flickrator.data.pub_photos.photo.slice(counter, counter + 2),
        pic_urls = $.fn.flickrator.url_builder(pic_json),
        main_pic_url = 'http://farm'+pic_json[0].farm+'.static.flickr.com/'+pic_json[0].server+'/'+pic_json[0].id+'_'+pic_json[0].secret+'_m.jpg';
           
    
    
    
    var html = 
      '<div id="frator_main">' +
        '<div class = "frator_main_pic_box">' +
        '  <img src = "'+main_pic_url+'" alt="made by flickerator" />' +
        '</div>' +
        
        '<div class="frator_tnail_nav">' +
        '  <a href="#frator_empty" class="frator_prev frator_arrow_off">&lt</a>' +
        '  <a href="#frator_empty" class="frator_next frator_arrow_on">&gt</a>' +
        '  <ul>' +
        '    <li><img src="'+pic_urls[0]+'" alt=" "/></li>' +
        '    <li><img src="'+pic_urls[1]+'" alt=" "/></li>' +
        '  </ul>' +
        '</div> ' + 
       
      '</div>';
    $widget.html(html);
    
    
    // bind events for ui elements
    $widget.delegate('#frator_main div.frator_tnail_nav a.frator_arrow_on', 'click' , function(){
      var $this = $(this);
      if ($this.hasClass('frator_prev')){   $.fn.flickrator.data.counter_pos -=2;   }
      else {   $.fn.flickrator.data.counter_pos +=2;   }
      
      
      var counter = $.fn.flickrator.data.counter_pos,
          pic_json = $.fn.flickrator.data.pub_photos.photo.slice(counter, counter + 2),
          pic_urls = $.fn.flickrator.url_builder(pic_json);      
          
      // change tnail pic
      $this.parent().find('ul li img').each(function(i, e){
        e.src = pic_urls[i];
      });
      
      
      // toggle classes for arrows
      if(counter === $.fn.flickrator.data.pub_photos.photo.length -2){  $this.parent().find('a.frator_next').toggleClass('frator_arrow_on frator_arrow_off');   }
      if(counter < $.fn.flickrator.data.pub_photos.photo.length -2){  $this.parent().find('a.frator_next').removeClass('frator_arrow_off').addClass('frator_arrow_on');   }

      if(counter === 0 ){  $this.parent().find('a.frator_prev').removeClass('frator_arrow_on').addClass('frator_arrow_off');   }
      if(counter > 0 ){  $this.parent().find('a.frator_prev').removeClass('frator_arrow_off').addClass('frator_arrow_on');   }
      
      
      
    });
    
    
    // Make tnail the Main Pic
    $widget.delegate('#frator_main div.frator_tnail_nav ul li img', 'click' , function(evt){
      $this = $(this);
      var $main_pic = $this.parent().parent().parent().prev().find('img'),
          medium_pic_url = this.src.replace('_s.jpg', '_m.jpg');      
      
      $main_pic.attr('src',medium_pic_url);
      
    });
    
    
    
    return;
  
  
  
  
};









$.fn.flickrator.reset = function(){
  
  // plugin defaults
  $.fn.flickrator.defaults = {
    api_key : '84dd33f08bcbcc3d5c78f66f49fb3580',
    api_url : 'http://api.flickr.com/services/rest/'
  };
  
  $.fn.flickrator.data = {}
}





  // plugin defaults
  $.fn.flickrator.defaults = {
    api_key : '84dd33f08bcbcc3d5c78f66f49fb3580',
    api_url : 'http://api.flickr.com/services/rest/'
  };
  
  $.fn.flickrator.data = {}


})(jQuery);