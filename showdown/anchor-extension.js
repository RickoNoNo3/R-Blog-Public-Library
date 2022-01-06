(function (extension) {
  'use strict';

  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function (showdown) {
  'use strict';

  /**
   * 支持 <h1> 到 <h6> 标题的锚点按钮
   *
   * Support for anchor buttons for <h1> to <h6> titles
   */
  showdown.extension('anchor', function () {
    return [

      {
        type: 'output',
        regex: '<h\\d id="(.+?)">(.*?)<\\/h(\\d)>',
        replace: function (match, id, title, level) {

          var anchor = `<a class="title-anchor" href="#${id}">#</a>`;

          return `<h${level} id="${id}">${title}${anchor}</h${level}>`;
        },
      },

    ];

  });

}));
