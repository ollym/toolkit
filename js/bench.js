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
  },
  'Array#flatten': {
      'Underscore.JS': { sandbox: 'underscore', fn: function() {
        _.flatten([1, [2], [3, [[[4]]]]]);
      }},
      'Sugar.JS': { sandbox: 'sugar', fn: function() {
        [1, [2], [3, [[[4]]]]].flatten();
      }},
      'JSToolkit': { sandbox: 'jst', fn: function() {
        [1, [2], [3, [[[4]]]]].flatten();
      }},
      'Prototype.JS': { sandbox: 'prototype', fn: function() {
        [1, [2], [3, [[[4]]]]].flatten();
      }}
  },
  'Array#union': {
      'Underscore.JS': { sandbox: 'underscore', fn: function() {
        _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
      }},
      'Sugar.JS': { sandbox: 'sugar', fn: function() {
        [1, 2, 3].union([101, 2, 1, 10],[2, 1]);
      }},
      'JSToolkit': { sandbox: 'jst', fn: function() {
        [1, 2, 3].union([101, 2, 1, 10],[2, 1]);
      }}
  },
  'Array#intersect': {
      'Underscore.JS': { sandbox: 'underscore', fn: function() {
        _.intersect([1, 2, 3], [101, 2, 1, 10], [2, 1]);
      }},
      'Sugar.JS': { sandbox: 'sugar', fn: function() {
        [1, 2, 3].intersect([101, 2, 1, 10],[2, 1]);
      }},
      'JSToolkit': { sandbox: 'jst', fn: function() {
        [1, 2, 3].intersect([101, 2, 1, 10],[2, 1]);
      }}
  },
  'Array#diff': {
      'Underscore.JS': { sandbox: 'underscore', fn: function() {
        _.difference([1, 2, 3], [101, 2, 1, 10], [2, 1]);
      }},
      'Sugar.JS': { sandbox: 'sugar', fn: function() {
        [1, 2, 3].subtract([101, 2, 1, 10],[2, 1]);
      }},
      'JSToolkit': { sandbox: 'jst', fn: function() {
        [1, 2, 3].diff([101, 2, 1, 10],[2, 1]);
      }}
  }
}