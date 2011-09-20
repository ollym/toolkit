require 'rubygems'
require 'json'
require 'yui/compressor'

desc "Build JSToolkit source into a minified browser version."
task :build do
  version = JSON.parse(File.read("./package.json"))['version']
  
  source = '(function() {'
  Dir.glob("./lib/*.js") do |file|
    source << File.read(file);
  end
  source << '})();'
  
  File.open("./dist/#{version}/jst.min.js", 'w') do |file|
    file.write YUI::JavaScriptCompressor.new().compress(source)
  end
  
  File.open("./dist/#{version}/jst.js", 'w') do |file|
    file.write source
  end
  
end