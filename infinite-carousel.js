
(function($) {
  
  $.fn.infiniteCarousel = function(options) {
    
    var elements = {
      carouselWrapper:  $(this),
      thumbWrapper:     $('#infinite-thumbs'),
      thumbContainer:   $('#infinite-thumbs li'),
      excerptContent:   $('#infinite-content li'),
      windowWidth:    	$(window).width()     
    },    
    defaults = {
      thumbsVisible:    5,
      thumbContainer:   elements.thumbWrapper,
      thumbWidth:     	elements.thumbContainer.outerWidth(true),
      thumbCount:     	elements.thumbContainer.length,
      playSlider:     	true,
      slideTime:      	5000,
      transitionTime:   1300,
      transitionType:   'easeOutQuad'
    },            
    options = $.extend(defaults, options),      
    settings = {
      thumbFocus:   Math.round( options.thumbsVisible / 2 ),
      slideAction:  null,
      inTransition: null
    },              
    functions = {         
      init: function(){
        $('#infinite-thumbs li').eq(settings.thumbFocus - 1).addClass('focus');       
        elements.carouselWrapper.css('width', defaults.thumbWidth * options.thumbsVisible );                    
        if ( elements.carouselWrapper.width() >= elements.windowWidth ) {         
          elements.carouselWrapper.css('margin-left', -((elements.carouselWrapper.width() - elements.windowWidth) / 2) + 35); //hardcoded 35 is half the paddng on one side?
        }                             
        functions.updateExcerpt( $('#infinite-thumbs li').eq(settings.thumbFocus - 1).data('index') );        
        $('#infinite-thumbs li').each(function(){   
          $(this).attr('id', $(this).index() + 1);
        });               
        if ( options.playSlider ) {
          functions.playSlider(); 
        }             
      },      
      updateExcerpt: function(index) {        
        elements.excerptContent.each(function(){
          $(this).hide();         
          
          if ( $(this).data('index') == index ) {
                $(this).fadeIn();       
            }
          });       
      },      
      resetArray: function() {
        slideArray = [];        
        $('#infinite-thumbs li').each(function(){
          slideArray.push($(this).outerHTML());                   
        }); 
      },            
      playSlider: function() {        
        functions.resetArray(); 
        settings.slideAction = setTimeout(function() {        
          settings.inTransition = 1;
          var thumbInFocus = $('#infinite-thumbs li.focus').index() + 1;                      
          if ( thumbInFocus > settings.thumbFocus ) {                                                                                                                                                     
            elements.thumbWrapper.transition({
              marginLeft: "+="+defaults.thumbWidth}, options.transitionTime, options.transitionType, function() {
              $('#infinite-thumbs li').removeClass('focus'); 
              $('#infinite-thumbs li').each(function(){                               
                if ( $(this).index() + 1 == settings.thumbFocus ) {                                                     
                  $(this).addClass('focus');  
                }
              });             
              functions.updateExcerpt( $('.focus').data('index') );             
              functions.playSlider();           
            });           
          } else if ( thumbInFocus == settings.thumbFocus ) {                                             
            elements.thumbWrapper
              .css('margin-left', -defaults.thumbWidth)
              .prepend( slideArray[defaults.thumbCount - 1] )             
              .transition({
                marginLeft: "+="+defaults.thumbWidth}, options.transitionTime, options.transitionType, function() {
                this.find('li:last-child').remove();                                            
                  $('#infinite-thumbs li').removeClass('focus');                                        
                $('#infinite-thumbs li').each(function(){
                  if ( $(this).index() + 1 == settings.thumbFocus ) {
                    $(this).addClass('focus');  
                  }
                });                               
                functions.updateExcerpt( $('.focus').data('index') );             
                functions.playSlider();           
            });       
          }             
        }, options.slideTime);
        settings.inTransition = null;
      }             
    }
        
    return this.each(function(){
            
      functions.init();     
      
      $('#infinite-thumbs li img').live('click', function(e){
        
        if (settings.inTransition == 1) {
          return false;
        }
        
        // @TODO clean up this
        var targetIndex = $(this).parents('li').index() + 1;
        $('#infinite-thumbs li').removeClass('focus');
        $(this).parents('li').addClass('focus');

        // reset auto-slide timer               
        if ( options.playSlider ) {
          clearTimeout(settings.slideAction);
          functions.playSlider(); 
        }                             
          
        // user clicked focused image
        if (targetIndex == settings.thumbFocus) {
          //return false;
          
          // user clicked left of middle  
        } else if ( targetIndex < settings.thumbFocus ) {
            
          e.preventDefault();
          
            // @TODO clean up this
          variant = settings.thumbFocus - targetIndex;
          distance = variant * defaults.thumbWidth;
          settings.inTransition = 1;
          var deleteOverflow = defaults.thumbCount - 1;
          
                                                  
          elements.thumbWrapper.css('marginLeft', '-='+distance);
                  
          // ADD LI'S left of middle
          for (var i = 0; i < variant; i++) {                     
            elements.thumbWrapper.prepend(slideArray[deleteOverflow]);
            deleteOverflow -= 1; 
          }                                                                                     
                        
          elements.thumbWrapper.transition({marginLeft: '+='+distance}, options.transitionTime, options.transitionType, function(){       
            $('#infinite-thumbs li').each(function(){
              if ($(this).index() + 1 > defaults.thumbCount ) {
                $(this).remove();
              }
            });         
            functions.resetArray();
            settings.inTransition = null;
          });         
          
          // user clicked right of middle  
          } else if ( targetIndex > settings.thumbFocus ) {
            
            e.preventDefault();
            
            // @TODO clean up this
            variant = targetIndex - settings.thumbFocus;
            distance = variant * defaults.thumbWidth;
            settings.inTransition = 1;
            var deleteOverflow = 0;
            
            // ADD LI'S right of middle
            for (var i = 0; i < variant; i++) {                                 
              elements.thumbWrapper.append(slideArray[deleteOverflow]);
              deleteOverflow += 1;            
            }                                                 
                                                            
          elements.thumbWrapper.transition({marginLeft: '-='+distance}, options.transitionTime, options.transitionType, function(){           
            if (elements.thumbWrapper.length < defaults.thumbCount ) {                                          
              var i = 0;                             
              $('#infinite-thumbs li').each(function(){                                               
                if (i < variant && $(this).index() + 1 != 0) {
                  $(this).remove();                                   
                  i += 1;                 
                }
              });             
              elements.thumbWrapper.css('margin-left', '+='+defaults.thumbWidth * variant)
            }            
            functions.resetArray(); 
            settings.inTransition = null;
          });                   
          }                   
          functions.updateExcerpt( $(this).parents('li').data('index') );       
      });                                                                                                         
    });   
  } 
})(jQuery);
