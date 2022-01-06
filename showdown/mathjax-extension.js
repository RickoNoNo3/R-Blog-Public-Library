/**
 * Support for writing math formulas using LaTex synta
 *
 * https://github.com/showdownjs/showdown/wiki/extensions#gotchas
 * https://github.com/excing/showdown-extensions <- 这是个老版本，用↑上面的教程改成了新版本占位符
 */
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

  var latexCodeBlocks = [];

  /**
   * 支持数学公式的编辑，语法参照 LaTeX。
   *
   * Support editing of mathematical formulas, syntax reference LaTeX.
   */
  showdown.extension('mathjax', function () {
    return [
      {
        type: 'lang',
        regex: '(?:^|\\n)¨D¨D(.*)\\n([\\s\\S]*?)\\n¨D¨D',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '\n\n¨MJX' + (latexCodeBlocks.push({text: match.substring(1), codeblock: codeblock}) - 1) + '¨MJX\n\n';
          }
        },
      },

      {
        type: 'lang',
        regex: '¨D([^`\\f\\n\\r]+?)¨D',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '¨MJX' + (latexCodeBlocks.push({text: match, codeblock: codeblock}) - 1) + '¨MJX';
          }
        },
      },

      {
        type: 'output',
        regex: '¨MJX(\\d+)¨MJX',
        replace: function (match, index) {
          // Check if we matched the leading \ and return nothing changed if so
          if (index === '\\') {
            return match;
          } else {
            index = Number(index);
            var code = latexCodeBlocks[index].text;
            return code.replace(/¨D/g, '$$');
          }
        },
      },

      // 清除缓存
      // clear cache
      {
        type: 'output',
        filter: function (text, globals_converter, options) {
          latexCodeBlocks = [];

          return text;
        },
      },

    ];
  });

}));
