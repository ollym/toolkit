$(function($) {
  
  var line = 0, context = {};
  
  function format(val, indent) {
    var width = $('#repl-stdio').width(), indent = indent || 0;
    indentTabs = '  '.repeat(indent);
    
    if (typeof val === 'undefined') return 'undefined';
    if (val !== val) return 'NaN';
    if (val === null) return 'null';
    if (typeof val === 'boolean') return indentTabs+val;
    if (typeof val === 'number') return indentTabs+val;
    if (Function.isFunction(val)) return indentTabs+'[Function %s]'.sprintf(val.name);
    if (String.isString(val)) return indentTabs+"'%s'".sprintf(val.toString());
    
    if (Array.isArray(val)) {
      
      if ((val.join(',').length + 2) > width) {
        val.map$(function(v) {
          return format(v, indent+1);
        });
        
        return '[\n%s\n]'.sprintf(val.join(','));
      }
      else {
        val.map$(function(v) {
          return format(v, indent);
        });
        
        return '[ %s ]'.sprintf(val.join(', '));
      }
    }
    else {
      
        return indentTabs + '{ ' + Object.reduce(val, function(s,k,v,i) {
          return s + (indentTabs + '  \'%s\':%s'.sprintf(k, format(v, 1))) + '\n';
        }, '').trimRight() + '  }';
    }
  }
  
  var buffer = '';
  var exec = (function(ctx,code) {
    
    if (code == '.clear') { $('#repl-stdio').html(''); return; }
    var r, err;
    try { r = this._ = eval.call(this, 'with(window){%s}'.sprintf(buffer + '\n' + code)); }
    catch (e) {
      var err = e;
    }
    
    var cmd = $('<li>&gt; <span class="repl-command" data-loading></span></li>');
    $.post('http://pygments.appspot.com/', { lang: 'js', code: code }, function(data) {
      cmd.find('.repl-command').replaceWith(data);
    });
    
    if ( ! err) {
      var res = $('<li data-loading style="margin-bottom:10px"></li>'), r = format(r);
      $.post('http://pygments.appspot.com/', { lang: 'js', code: r }, function(data) {
        res.removeAttr('data-loading').html(data);
      });
    }
    else {
      
      if (err instanceof SyntaxError) {
        $('#repl-prefix').text('...');
        $('#repl-stdio').append(buffer == '' ? cmd : cmd.html(cmd.find('.repl-command')));
        buffer += '\n' + code;
        return;
      }
      
      res = $('<li class="error" style="margin-bottom:10px">%s: %s</li>'.sprintf(err.name, err.message));
    }
    
    if (buffer != '') {
      buffer = '';
      $('#repl-prefix').html(' &gt; ');
      cmd.html(cmd.find('.repl-command'));
      console.log(r);
    }
    
    $('#repl-stdio').append(cmd);
    $('#repl-stdio').append(res);
    $('#repl-stdio').prop('scrollTop', $('#repl-stdio').prop('scrollHeight'));
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
      var val = $('#repl-stdin').val();
      $('#repl-stdin').val('');
      
      var result = exec(context, val);
    }
  });
  
});