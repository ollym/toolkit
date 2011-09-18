require 'rubygems'
require 'yui/compressor'

desc "Build JSToolkit source into a minified browser version."
task :build do
  source = File.read("./build/header.js")
  Dir.glob("./lib/*.js") do |file|
    source << File.read(file);
  end
  source << File.read("./build/footer.js")
  File.open('./dist/1.5.0/jst.min.js', 'w') do |file|
    file.write YUI::JavaScriptCompressor.new().compress(source)
  end
  File.open('./dist/1.5.0/jst.js', 'w') do |file|
    file.write source
  end
end