$(function() {

  var format = function format(value) {
    
    if (typeof value === 'undefined' || value !== value)
      return '<span class="console-const">' + value + '</span>';
    
    if (value.constructor === Array) {
      
      for (var i = 0; i < value.length; i++)
        value[i] = format(value[i]);
      
      return '[ ' + value.join(', ') + ' ]';
    }
    
    if (value instanceof RegExp) {
      return '<span class="console-regex">/' + value.source + '/' + (value.global ? 'g' : '') +
        (value.multiline ? 'm' : '') + (value.ignoreCase ? 'i' : '') + '</span>';
    }
    
    if (value instanceof Date) {
        return '[Date ' + format(value.toString()) + ']';
    }
    
    if (value === false || value === true)
      return '<span class="console-bool">' + value + '</span>';
    if (typeof value === 'function')
      return '<span class="console-func">[Function' + (value.name ? ' ' + value.name : '') + ']</span>';
    if (typeof value === 'number')
      return '<span class="console-int">' + value + '</span>';
    if (typeof value === 'string')
      return '<span class="console-str">\'' + value + '\'</span>';
    
    if (typeof value === 'object') {
      var lines = [];
      for (var key in value) {
        lines.push(format(key.toString()) + ': ' + format(value[key]));
      }
      return '<span class="console-obj">{ ' + lines.join('\n  ') + ' }</span>';
    }
  }
  
  function Sandbox(context) {
    this.ctx = context || {};
    this.context = $('<iframe sandbox="allow-scripts"></iframe>')
  }
  
  Sandbox.prototype.eval = function(code, stderr, out) {
    var ret, err;
  
    try { ret = eval.call(window, 'with(window){'+code+'}'); }
    catch (e) { err = e; }
    
    if (err) stderr(err);
    else out(ret);
  }
  
  $.fn.console = function(options) {
    
    var lines = [], stdin = null, stdout = null, stderr = null, sbox = new Sandbox(), focussed = true, buffer = '', indx = 0, self = $(this);
    
    options = $.extend({
      stdin: null,
      stdout: null,
      stderr: null,
      prompt: '>'
    }, options);
    
    var prompt, stdio, cursor;
    
    function init() {
      
      self.html('');
      
      prompt = $('<span class="console-prompt"> '+options.prompt+' </span>')
      stdio = $('<pre class="console-stdio"></pre>');
      cursor = $('<span class="console-cursor"> </span>');
    
      stdio.append('<span class="console-stdio-block">JSToolkit v1.5.2 Online REPL<br>============================</span>')
    
      stdio.append(prompt, cursor);
      $('<span class="console-stdin">').insertBefore(cursor);
      $('<span class="console-stdin">').insertAfter(cursor);
      
      self.addClass('console').append(stdio);
    }
    
    init();
    
    self.focus(function() {
      focussed = true;
      cursor.show();
    });
    
    self.blur(function() {
      focussed = false;
      cursor.hide();
    });
    
    $(document).click(function(evt) {
      var is = !! $(self).has(evt.target).length;
      if (focussed != is) {
        $(self)[is ? 'focus' : 'blur']();
      }
    });
    
    self.console.typeLine = function(text, callback) {
      
      var fast = 40, slow = 80, i = 0, interval = null;
      self.focus();
      
      function type() {
        
        var charAt = text.charCodeAt(i++);
        stdio.trigger($.Event('keypress', { which: charAt }));
        
        if (i == text.length) {
          
          clearInterval(interval);
          stdio.trigger($.Event('keydown', { keyCode: 13 }));
          return callback && callback();
        }

        if ( ! text.charAt(i).match(/[A-Za-z0-9]/)) {
          clearInterval(interval);
          setTimeout(function() {
            interval = setInterval(type, fast);
          }, slow);
        }
      }

      interval = setInterval(type, fast);
    }
    
    $(document).keydown(function(evt) {
            
      if ( ! focussed)
        return;
        
      if (evt.keyCode == 38 && indx > 0) {
        cursor.prev('.console-stdin').text(lines[--indx]);
        cursor.next('.console-stdin').text('');
      }
      if (evt.keyCode == 40) {
        if (indx < lines.length) indx++;
        cursor.prev('.console-stdin').text((indx == lines.length) ? '' : lines[indx]);
        cursor.next('.console-stdin').text('');
      }
      
      if (evt.keyCode == 8 || evt.keyCode == 37) {
        var prev = cursor.prev('.console-stdin'), ptxt = prev.text();
        prev.text(ptxt.substr(0, ptxt.length -1));
      }
      if (evt.keyCode == 46 || evt.keyCode == 39) {
        var next = cursor.next('.console-stdin'), ntxt = next.text();
        next.text(ntxt.substr(1));
      }
      if (evt.keyCode == 37) {
        var next = cursor.next('.console-stdin'), ntxt = next.text();
        next.text(ptxt.substr(-1) + ntxt)
      }
      if (evt.keyCode == 39) {
        var prev = cursor.prev('.console-stdin'), ptxt = prev.text();
        prev.text(ptxt + ntxt.substr(0,1))
      }

      switch (evt.keyCode) {
        case 8:case 37: case 39: case 38: case 40:
          evt.preventDefault();
          return false;
      }
      
      if (evt.keyCode === 13) {
        var code = $('.console-stdin').text();
        $('.console-stdin').remove();
        
        if (code == '.clear') {
          evt.preventDefault();
          return init();
        }
        
        var broken = (code == '.break');
        if (broken) code = '';

        $('<span class="console-stdio-block"><span class="console-prompt"></span><span class="console-stdio-input">'+code+'</span></span>')
          .insertBefore(prompt)
          .find('.console-prompt').text(buffer ? '   ' : ' > ');
        
        
        function err(e) {
          if (e instanceof SyntaxError && ! broken) {
            buffer += code;
            prompt.text('...');            
          }
          else {
            (indx = lines.push(buffer + code)); prompt.text(' > '); buffer = '';
            $('<span class="console-stdio-block console-err">' + e.name + ': ' + e.message + '</span>')
              .insertBefore(prompt);
          }
        }
        
        function out(val) {
          (indx = lines.push(buffer + code)); prompt.text(' > '); buffer = '';
          $('<span class="console-stdio-block">' + format(val) + '</span>')
            .insertBefore(prompt);
        }
        
        sbox.eval(buffer + code, err, out);
        
        $('<span class="console-stdin">').insertBefore(cursor);
        $('<span class="console-stdin">').insertAfter(cursor);
        
        evt.preventDefault();
      }
      
      stdio.prop('scrollTop', stdio.prop('scrollHeight'));
    });
    
    $(document).keypress(function(evt) {
      
      if ( ! focussed)
        return;
      
      var prev = cursor.prev('.console-stdin');
      prev.text(prev.text() + String.fromCharCode(evt.which));
      
      evt.preventDefault();
      return false;
    });
  };
});