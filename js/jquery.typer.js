(function($) {
	
	$.fn.type = function(text, callback) {
    
	  var self = $(this),
	      speed = 40,
	      delayTime = 80,
	      i = 0,
	      interval = null;
	      
    function type() {
      
      var c = text.charAt(i++);
      self.val(self.val() + c);
      
      if (i == text.length) {
        clearInterval(interval);
        return callback && callback();
      }
      
      if ( ! text.charAt(i).match(/[A-Za-z0-9]/)) {
        clearInterval(interval);
        setTimeout(function() {
          interval = setInterval(type, speed);
        }, delayTime);
      }
    }
    
    interval = setInterval(type, speed);
}
		
})(jQuery);