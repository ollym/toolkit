$(function() {
  $.getJSONP('https://api.github.com/repos/ollym/toolkit/git/refs/tags', function(tags) {
                    
      var latest = tags.sortBy('ref', function(a,b) {
          a = a.remove('refs/tags/v').split('.').map(Number), b = b.remove('refs/tags/v').split('.').map(Number);
          return a[0] > b[0] || a[1] > b[1] || a[2] > b[2];
      }).last().ref.remove('refs/tags/');
      
      $('#latest-tag').removeAttr('data-loading').text(latest);
      $.getJSONP(tags.last().object.url, function(tag) {
          $('#latest-committer').removeAttr('data-loading').html(
              'Released %ss ago by <a href="mailto:%s">%s</a>'.sprintf(
                  (new Date()).fuzzyDiff(tag.committer.date), tag.committer.email, tag.committer.name));
      });
      $.getJSONP('https://api.github.com/repos/ollym/toolkit/git/trees/' + tags.last().object.sha, function(tree) {
          
          $('#latest-download').attr('href', 'https://raw.github.com/ollym/toolkit/%s/dist/jst.min.js'
              .sprintf(tree.sha));
              
          $('#latest-source').attr('href', 'https://github.com/ollym/toolkit/tree/%s'
              .sprintf(tree.sha));
          
          // Get the distribution size and url
          $.getJSONP(tree.tree.each(function(file) {
              if (file.path === 'dist') return file.url;
          }), function(dist) {
              
              var min = dist.tree.each(function(file) {
                 if (file.path == 'jst.min.js') return file; 
              });
              
              var max = dist.tree.each(function(file) {
                 if (file.path == 'jst.js') return file; 
              });
              
              $('#latest-size').text(min.size.abbr(1,true) + 'b');
              $('#latest-docs').attr('href', 'docs.html?sha=%s'.sprintf(max.sha));
              $('#nav-docs').attr('href', 'docs.html?sha=%s'.sprintf(max.sha));
          });
          
          // Get the changelog
          $.getJSONP(tree.tree.each(function(file) {
              if (file.path === 'HISTORY.md') return file.url;
          }), function(blob) {
              
              
              var hist = blob.content.atob().split('=================='), 
                  idx = hist.each(function(ver, i) {
                      var match = ver.match(/(\d*\.\d*\.\d*)\s*\/\s*\d*-\d*-\d*\s*$/);
                      if (match && match[1] == latest.substr(1)) return i+1;
                  }),
                  changelog = hist[idx].split('\n').map(function(line) {
                      return line.trim().remove(/^\*\s*/);
                  }).clean().slice(0, -1);
              
              $('#latest-changelog').removeAttr('data-loading');
              changelog.forEach(function(change) {
                  $('#latest-changelog').append('<li>%s</li>'.sprintf(change));
              });
         });
      });
  });
  
  $.getJSONP('https://api.github.com/repos/ollym/toolkit/git/refs/heads/master', function(parent) {
      (function next(i, parent) { if (i === 0) { $('#latest-commits').removeAttr('data-loading'); return; }
          $.getJSONP('https://api.github.com/repos/ollym/toolkit/git/commits/' + parent.sha, function(commit) {
            
              var tmpl = '<li><a class="title" target="_blank" href="%s">%s</a><p class="tagline">%s</p></li>',
                  li = $(tmpl.sprintf('https://github.com/ollym/toolkit/commit/' + commit.sha, commit.message,
                      'by <a href="mailto:%s">%s</a> %s'.sprintf(commit.author.email, commit.author.name,
                          (new Date()).fuzzyDiff(commit.author.date))));
            
              if (i == 2) li.addClass('first');
              else if (i === 1) li.addClass('last');            
            
              $('#latest-commits').append(li);
            
              next(--i, commit.parents[0]);
          });
      })(2, parent.object);
  });
});