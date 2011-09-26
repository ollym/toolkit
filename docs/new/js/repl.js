$(function($) {
  
  var line = 0, context = {};
  
  var exec = (function(ctx,code,err) {
    try { return this._ = eval.call(this, 'with(window){%s}'.sprintf(code)); }
    catch (e) { err(e); }
  });
  
  $('#repl-stdin').keydown(function(evt) {
    
    // Up and down
    if (evt.keyCode == 38) { // up
      $('#repl-stdin').val($('#repl-stdio li:nth-last-child(%d) .repl-command'.sprintf(++line)).text());
      evt.preventDefault();
      return false;
    }
    else if (evt.keyCode == 40) { // down
      $('#repl-stdin').val($('#repl-stdio li:nth-last-child(%d) .repl-command'.sprintf(--line)).text());
      evt.preventDefault();
      return false;
    }
    
    // Submit command
    if (evt.keyCode == 13) {
      $('#repl-stdio').append('<li>&gt; <span class="repl-command">%s</span></li>'.sprintf($(this).val()));
      var val = $('#repl-stdin').val();
      
      $('#repl-stdin').val('');
      
      var result = exec(context, val, function(e) {
        console.log(e);
      });
      
      $('#repl-stdio').append('<li>%s</li>'.sprintf(result));
      $('#repl-stdio').prop('scrollTop', $('#repl-stdio').prop('scrollHeight'));
    }
  });
  
});