var fs  = require('fs'), http = require('http');
var pkg = JSON.parse(fs.readFileSync('package.json')), ver = pkg.version.split('.'), versions = [];
var grouped = {}, listed = [];

function DocProperty() { }
DocProperty.Sort = function(a, b) { return a.compare(b); }
DocProperty.prototype = {
  
  get new() {
    return ver[1] == this.since.split('.')[1];
  },
  
  get section() {
    return this.group + (this.prototype ? '.prototype' : '');
  },
  
  mode: 0,
  title: null,
  group: null,
  description: null,
  example: null,
  code: null,
  aliae: [],
  since: null,
  prototype: false,
  object: null,
  params: {},
  see: null,
  
  compare: function(a) {
    return (a & 0x1) || (a.name < this.name) ? 0 : 1;
  }
};

/* START PROPERTY PARSING */
Object.defineProperties = function(proto, descriptors) {
  
  var object = null, prototype = null, group = null;
    
  switch (proto) {
    
    case Array:               { prototype = false; group = 'Array';    break; }
    case Array.prototype:     { prototype = true;  group = 'Array';    break; }
    case Function:            { prototype = false; group = 'Function'; break; }
    case Function.prototype:  { prototype = true;  group = 'Function'; break; }
    case Number:              { prototype = false; group = 'Number';   break; }
    case Number.prototype:    { prototype = true;  group = 'Number';   break; }
    case Object:              { prototype = false; group = 'Object';   break; }
    case Object.prototype:    { prototype = true;  group = 'Object';   break; }
    case String:              { prototype = false; group = 'String';   break; }
    case String.prototype:    { prototype = true;  group = 'String';   break; }
    case Math:                { prototype = false; group = 'Math';     break; }
    case Date:                { prototype = false; group = 'Date';     break; }
    
    default: {
      throw new Error('AutoDoc failed. Unable to find suitable group for given prototype.');
    }
  }
  
  var fds = {};
  
  if ( ! (object in fds)) {
    //fds[group] = fs.openSync(dir + pkg.version + '/' + group.toLowerCase() + '.html', 'w');
  }
  
  for (name in descriptors) {
    
    var descriptor = descriptors[name], prop = new DocProperty(), val = null;
    
    prop.group = group;
    prop.title = (name[0].toUpperCase() + name.substr(1));
    prop.prototype = prototype;

    if ('get' in descriptor) {
      val = descriptor.get;
      prop.mode |= 0x1;
      if ( ! ('set' in descriptor)) {
        prop.mode |= 0x2;
      }
    }
    else {
      prop.mode = 0x4;
      val = descriptor.value;
    }
    
    if ( ! (val instanceof Function))
      continue;
    
    var docblock = val.toString().match(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//);
    if (docblock == null) continue;
    
    var lines = docblock[0].trim().substr(4).split('\n');
    
    lines = lines.reduce(function(a,b) {
      b = b.trim().substr(2);
      if (b != '/' && b != '*') a.push(b);
      return a;
    }, []);
    
    prop.description = lines[0];
    
    var attr = {
      set last() {},
      get last() {
        var keys = Object.keys(this);
        return keys[keys.length - 1];
      }
    };
    
    lines.forEach(function(line) {
      var code = /^@([^\s]+)\s*(.*)/.exec(line);
      if (code == null) attr[attr.last] += '\n' + line.substr(1);
      else {
        if (code[1] in attr) {
          if (Array.isArray(attr[code[1]])) attr[code[1]].push(code[2]);
          else attr[code[1]] = [attr[code[1]], code[2]];
        }
        else attr[code[1]] = code[2];
      }
    });
    
    for (var key in attr) {
      if (Array.isArray(attr[key])) {
        attr[key].forEach(function(val, i) {
          attr[key][i] = val.trim();
        });
      }
      else {
        attr[key] = attr[key].trim();
      }
    }
    
    if ( ! Array.isArray(attr.param)) attr.param = [attr.param];
    attr.params = {};
    attr.param.forEach(function(param) {
      if ( ! param) { attr.params = []; return; }
      var parts = param.split(' ');
      attr.params[parts[0]] = parts.slice(1).join(' ');
    });
    
    var since = attr.since.split('.', 2).join('.') + '.x';
    if ( ! ~ versions.indexOf(since))
      versions.push(since);
    
    prop.code    = val.toString().replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//, '').replace(/^\s{2}/gm, '');
    prop.example = attr.example;
    prop.params  = attr.params;
    prop.aliae   = attr.alias || [];
    prop.since   = attr.since;
    prop.see     = attr.see || null;
    prop.returns = attr.returns;
    
    if ( ! (prop.group in grouped)) grouped[prop.group] = {};
    if ( ! (prop.section in grouped[prop.group])) grouped[prop.group][prop.section] = [];
    
    grouped[prop.group][prop.section].push(prop);
    listed.push(prop);
  }
}

require('../index.js');
versions.sort(function(a, b) {
  a = a.split('.'), b = b.split('.');
  return a[0] < b[0] || a[1] < b[1];
});
/* END PROPERTY PARSING */

/** BEGIN HTML OUTPUT **/
var doc = fs.readFileSync('./support/docs/template.html'),
    spawn = require('child_process').spawn;

var split = /\n*<span class="c1?">\/\/DIVIDER<\/span>\n*/, join = '\n//DIVIDER\n',
    start = '<div class="highlight"><pre>', end = '</pre></div>',
    codes = [], examples = [];

listed.forEach(function(p) {
  codes.push(p.code); examples.push(p.example);
});

var pyg = spawn('pygmentize', ['-l', 'js', '-f', 'html', '-O', 'encoding=utf-8']),
    output = '';

pyg.stdout.on('data', function(data) {
  output += data.toString();
});

pyg.on('exit', function() {
  
  var parts = output.replace(start, '').replace(end, '').split(split), half = parts.length / 2,
      examples = parts.slice(half),
      codes = parts.slice(0, half);
  
  listed.forEach(function(p, i) {
    p.code = '<div class="highlight"><pre>' + codes[i] + '</pre></div>';
    p.example = '<div class="highlight"><pre>' + examples[i] + '</pre></div>';
  });
    
  [versions[0]].forEach(function(ver, vindx) {
    
    var base = './docs/' + ver + '/',
        tmpl = doc.toString()
          .replace('{{version}}', ver)
          .replace('{{nav}}', Object.keys(grouped).reduce(function(c, n) {
            num = listed.reduce(function(a,b) {
              if (b.group == n && versions.indexOf(b.since.split('.', 2).join('.') + '.x') >= vindx) a++;
              return a;
            }, 0)
            c += (num > 0) ? '<li><a href="' + n.toLowerCase() + '.html">' + n + '</a></li>' : '';
            return c;
          }, ''))
          .replace('{{versions}}', versions.reduce(function(c, v) {
            c += '<option value="' + v + '" ' + (v == ver ? 'selected' : '') + '>' + v + '</option>';
            return c;
          }, ''));

    if ( ! require('path').existsSync(base))
      fs.mkdirSync(base, 0750);

    for (var group in grouped) {

      var content = '';

      for (var title in grouped[group]) {

        content += '<h1>{{title}}</h1><hr><ul id="methods">'
          .replace('{{title}}', title);
          
        var n = 0;

        grouped[group][title].forEach(function(prop, i) {
          
          // The index of the property's since version in the version list 
          var svindx = versions.indexOf(prop.since.split('.', 2).join('.') + '.x');
          
          if (svindx < vindx) 
            return; // Method has't arrived yet!
            
          n++;

          content += '<li class="grid-6"><h2><span class="ret">{{returns}}</span> <span class="name">{{name}}</span> '
            .replace('{{returns}}', prop.returns)
            .replace('{{name}}', prop.title);

          if (prop.mode & 0x4) {
            content += '<span class="params">(';
            Object.keys(prop.params).forEach(function(name, i, keys) {
              content += '<abbr title="' + prop.params[name] + '">' + name + '</abbr>' + (i != (keys.length - 1) ? ', ' : '');
            });
            content += ')</span>';
          }
                    
          if (vindx == svindx)
            content += ' <span class="new">New!</span>';
            
          content += '</h2><p>{{desc}}</p><div class="example"><a class="toggle" >View Example</a>{{example}}</div><div class="code"><a class="toggle" >View Code</a>{{code}}</div></li>'
            .replace('{{desc}}', prop.description)
            .replace('{{example}}', prop.example)
            .replace('{{code}}', prop.code);
            
          if ((n % 2) == 0) 
            content += '<li class="clear"></li>';

        });
        
        content += '</ul><div class="clear"></div>';
      }

      fs.writeFileSync(base + group.toLowerCase() + '.html', tmpl.replace('{{content}}', content).replace('{{group}}', group));
    }
  });
});

pyg.stdin.write(codes.concat(examples).join(join));
pyg.stdin.end();
/** END HTML OUTPUT **/