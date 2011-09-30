window.jstBenchmarks = {
  'Array#unique': {
    'Underscore.JS': { sandbox: 'underscore', fn: function() {
      _.uniq(['a','b','b','c','c','c','d','d','f','f','j','k']);
    }},
    'Sugar.JS': { sandbox: 'sugar', fn: function() {
      ['a','b','b','c','c','c','d','d','f','f','j','k'].unique();
    }},
    'JSToolkit': { sandbox: 'jst', fn: function() {
      ['a','b','b','c','c','c','d','d','f','f','j','k'].unique();
    }},
    'Prototype.JS': { sandbox: 'prototype', fn: function() {
      ['a','b','b','c','c','c','d','d','f','f','j','k'].uniq();
    }},
    'JQuery': { sandbox: 'jquery', fn: function() {
      $.unique(['a','b','b','c','c','c','d','d','f','f','j','k']);
    }}
  }
}