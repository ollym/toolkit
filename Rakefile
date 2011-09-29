require 'rubygems'
require 'json'
require 'yui/compressor'

desc "Build JSToolkit source into a minified browser version."
task :build do  
  source = '(function () {' << File.read('./index.js')
  Dir.glob("./lib/*.js") do |file|
    source << File.read(file);
  end
  source << '})();'
  
  File.open("./dist/jst.min.js", 'w') do |file|
    file.write YUI::JavaScriptCompressor.new().compress(source)
  end
  
  File.open("./dist/jst.js", 'w') do |file|
    file.write source
  end
  
end