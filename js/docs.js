$(function() {
  $('#repl').console();
});

var sha = window.location.search.match(/sha=([^&]+)/)[1];

$.getJSONP('https://api.github.com/repos/ollym/toolkit/git/blobs/%s'.sprintf(sha), function(data) {
    $(function() {
        var grouped = {}, listed = [], versions = [];
                      
        $('#search-input').keyup(function(evt) {
            var term = $(this).val(), regex = new RegExp(term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
            $('.method').each(function() {
                var method = listed[$(this).attr('id')], match;
             
                if ((match = term.match(/(.+)\.(.*)/))) {
                    if ( ! method.prototype  && match[1] == method.group &&
                       ( ! match[2] || (new RegExp(match[2].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi')).exec(method.title)))
                        $(this).removeClass('hidden').show();
                    else return $(this).addClass('hidden').hide();
                }
                else if ((match = term.match(/(.+)(?:#|\.prototype)(.*)/))) {
                    if (method.prototype && match[1] == method.group &&
                       ( ! match[2] || (new RegExp(match[2].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi')).exec(method.title)))
                        $(this).removeClass('hidden').show();
                    else $(this).addClass('hidden').hide();    
                }
                else if (method.title.match(regex) || method.group.match(regex)) $(this).removeClass('hidden').show();
                else $(this).addClass('hidden').hide();
            });
          
            $('h3').each(function() {
                var show = true,
                    methods = $(this).nextUntil('h3').filter('.method');

                if (methods.filter('.hidden').length == methods.length)
                    show = false;
                  
                show ? $(this).show() : $(this).hide();
            });
        });
      
        data = data.content.atob();
      
        function DocProperty() { }
        DocProperty.Sort = function(a, b) { return a.compare(b); }
        DocProperty.prototype = {

            isNew : function() {
                return ver[1] == this.since.split('.')[1];
            },

            section: null,
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

        window.__jstExtend = function(proto, properties) {
  
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
                case Date.prototype:      { prototype = true;  group = 'Date';     break; }
                case RegExp.prototype:    { prototype = true;  group = 'RegExp';   break; }
                case RegExp:              { prototype = false; group = 'RegExp';   break; }

                default: {
                    throw new Error('AutoDoc failed. Unable to find suitable group for given prototype.');
                }
            }
    
            for (name in properties) {

            var prop = new DocProperty(), val = properties[name];

            prop.group = group;
            prop.title = (name.charAt(0).toUpperCase() + name.substr(1));
            prop.prototype = prototype;
            prop.section = group + (prototype ? '.prototype' : '');

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
    
            function last(attr) {
                var keys = Object.keys(attr);
                return keys[keys.length - 1];
            }
    
            var attr = {};

            lines.forEach(function(line) {
              var code = /^@([^\s]+)\s*(.*)/.exec(line);
              if (code == null) attr[last(attr)] += '\n' + line.substr(1);
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

            var since = attr.since && attr.since.split('.', 2).join('.') + '.x';
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
    
            var id = listed.push(prop) - 1;
            prop.listedid = id;
            grouped[prop.group][prop.section].push(prop);
          }
        }
        eval(data);
                
        Object.keys(grouped).sort() 
            .forEach(function(key) {
                Object.forEach(grouped[key], function(group, methods) {
                    $('#main').append('<h3>%s</h3>'.sprintf(group));
                    methods.forEach(function(method, i) {
                
                        var title = $('<h4><span class="ret">%s</span> <span class="title">%s</span> </h4>'.sprintf(
                                method.returns, method.title)),
                            params = $('<span class="params">(</span>');
                    
                        Object.keys(method.params).forEach(function(name, i, keys) {
                            params.append('<abbr title="%s">%s</abbr>%s'.sprintf(
                                 method.params[name], name, (i != (keys.length - 1) ? ', ' : ')')));
                        });
                
                        if (method.params.length == 0)
                            params.append(')');
                
                        title.append(params);
                
                        var grid = $('<div class="method %s" id="%d"><p>%s</p></div>'.sprintf(
                                ((i%3) == 0) ? 'alpha' : ((i+1)%3) == 0 ? 'omega' : '',
                                method.listedid, method.description));
                            example = $('<a class="btn green">Run Example</a>');
                        
                        var name = method.section.replace('.prototype', '#') + method.title.toLowerCase();
                        grid.append(example);
                        
                        if (name in window.jstBenchmarks) {
                            
                            var bench = $('<a class="btn orange" style="margin-left:105px">Benchmark</a>').appendTo(grid);
                                
                            bench.click(function() {
                                
                                var table = $('<table class="benchmark"><tbody></tbody></table>').insertBefore($(this).prev());
                                bench.remove();
                            
                                Object.each(window.jstBenchmarks[name], function(key, meta) {
                                    table.find('tbody').append('<tr><td>' + key + '</td><td style="width:100%" data-key="' + key + '" data-loading></td></tr>');
                                });
                                
                                var results = [], length = Object.size(window.jstBenchmarks[name]);
                                
                                result = function(benchmark) {
                                    
                                    if (results.push(benchmark) === length) {
                                        var max = Math.max.apply(null, results.pluck('hz'));
                                        results.forEach(function(benchmark) {
                                            var speed = $('<div class="speed" title="'+benchmark.hz.round()+' ops/sec"></div>');
                                            speed.css('width', ((benchmark.hz * 100) / max).round() + '%');
                                            var curr = table.find('[data-key="' + benchmark.name + '"]')
                                                .removeAttr('data-loading').append(speed);
                                            
                                            if (benchmark.hz == max) {
                                                curr.prev().css({
                                                    'font-weight': 'bold',
                                                    color: 'black'
                                                });
                                            }
                                        });
                                    }
                                };
                            
                                Object.each(window.jstBenchmarks[name], function(key, meta) {
                                   var frame = $('<iframe src="js/bench/sandbox/'+meta.sandbox+'.html">').appendTo('body');
                                   frame.load(function() {
                                   
                                       var win = frame[0].contentWindow, doc = win.document, script = doc.createElement('script');
                                       win.result = function(res) {
                                           result(this[0]);
                                       };
                               
                                       script.async = true;
                                       script.text = 'var test = ' + meta.fn.toString() + ';' + 
                                        "(new Benchmark.Suite).on('complete', window.result).add('"+key+"', test).run(true);";
                                       doc.head.appendChild(script);
                                   });
                                });
                            });
                        }

                        grid.prepend(title);
                
                        title.click(function() {
                           $(this).next().slideToggle(); 
                        });
                
                        example.click(function(evt) {
                            var lines = method.example.split('\n').filter(function(line) {
                                return !! line.remove(/\/{2}[^\n]+/).trim();
                            });
                    
                            function type(i) {
                                $('#repl').console.typeLine(lines[i++].remove(/\/{2}[^\n]+/), function() {
                                    if (lines.length > i) type(i);
                                });
                            }
                            type(0);
                    
                            evt.stopImmediatePropagation();
                            return false;
                        });
                
                        $('#main').append(grid);
                    });
                    $('#main').append('<div class="clear"></div>');
                });
            });

        // Tooptip    
        $('.method .params abbr').mouseenter(function() {
            var pos = $(this).offset(), id =$(this).parents('.method').attr('id'), method = listed[id];
            $('#tooltip-text').html(method.params[$(this).text()]);
            $('#tooltip').css({
                left: (pos.left - $('#tooltip').width() + 45) + 'px',
                top: (pos.top - $('#tooltip').height()) + 'px'
            });
            $('#tooltip').show();
        });

        $('.method .params abbr').mouseout(function() {
            $('#tooltip').hide();
        });
    });
});