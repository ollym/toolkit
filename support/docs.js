var fs = require('fs'), ver = '1.2.0', STAGE_DESC = 0x1, STAGE_EXAMP = 0x2;
var fds = {};

Object.defineProperties = function(prototype, descriptors) {
  
  var group = prototype.name || prototype.constructor.name;
  var title = prototype.name || prototype.constructor.name + '.prototype';
  
  if (prototype.toString() == '[object Math]') {
    group = 'Math';
    title = 'Math';
  }
  
  if (prototype == String.prototype) {
    group = 'String';
    title = 'String.prototype';
  }
  else if (prototype == String) {
    group = 'String';
    title = 'String';
  }
  else if (prototype == Function) {
    group = 'Function';
    title = 'Function';
  }
  else if (prototype == Function.prototype) {
    group = 'Function';
    title = 'Function.prototype';
  }
  
  if ( ! (group in fds)) {
    fds[group] = fs.openSync('./docs/' + ver + '/' + group.toLowerCase() + '.html', 'w');
    fs.writeSync(fds[group], '---\nlayout: default\n---\n');
  }
  
  var fd = fds[group];
  fs.writeSync(fd, '<h1>' + title + '</h1><hr><ul id="methods">');
  var num = 1;
  
  for (var name in descriptors) {
    
    f = descriptors[name].value;
    if ( ! f) continue;

    var data = f.toString();
    var lines = data.split(/\n|\r/), open = false;
    var stage = STAGE_DESC;

    var desc = '', params = [], example = '', returns = 'void';

    lines.forEach(function(line) {

      line = line.trim()

      /** Are we within jsdoc block **/
      if (line.startsWith('/**')) open = true, n = 0;
      else if (line.startsWith('*/')) open = false;
      if ( ! open) return;

      // Clean Bits
      line = line.replace(/^\/\*\*|\*/, '').replace(/^\s{1}/, '');
      if ( ! line.trim()) return;

      if (stage == STAGE_DESC) {
        if (line.startsWith('@')) { stage = false; }
        else { desc += line; return; }
      }

      if (stage == STAGE_EXAMP) {
        if (line.startsWith('@')) { stage = false; example.trimRight('\n') }
        else { example += line + '\n'; return; }
      }

      if (line.startsWith('@param')) {
        params.push(line.replace('@param ', '').split(' ')[0]);
      }

      if (line.startsWith('@example')) {
        stage = STAGE_EXAMP;
      }

      if (line.startsWith('@returns')) {
        returns = line.split(' ')[1];
      }
    });

    fs.writeSync(fd, '<li class="grid-6"><h2><span class="ret">' + returns + '</span> <span class="name">' + name.ucfirst() + '</span>');

    if (params.length > 0) {
      fs.writeSync(fd, ' <span class="params">(' + params.join(', ') + ')</span>');
    }
    
    // Get code and remove comments
    var code = f.toString().replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//, '');
    code = code.substr(0, code.length - 3) + '}';

    fs.writeSync(fd, '</h2><p>' + desc + '</p>');
    fs.writeSync(fd, '<div class="example"><a class="toggle" >View Example</a>{% highlight js %}' + example + '{% endhighlight %}</div>');
    fs.writeSync(fd, '<div class="code"><a class="toggle" >View Code</a>{% highlight js %}' + code + '{% endhighlight %}</div>');
    fs.writeSync(fd, '</li>');
    
    if ((num % 2) == 0) { fs.writeSync(fd, '<li class="clear"></li>'); }
    
    num++;
  }
  
  fs.writeSync(fd, '</ul><div class="clear"></div>');
}

String.prototype.startsWith = function (str){
  return this.indexOf(str) == 0;
};

String.prototype.ucfirst = function() {
  return this.charAt(0).toUpperCase() + this.substr(1);
}

require('../index');
for (var group in fds) {
  fs.closeSync(fds[group]);
}