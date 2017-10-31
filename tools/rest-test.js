var fs = require('fs');
var copydir = require('copy-dir');
var mkdirp = require('mkdirp');
var del = require('del');
var http = require('http');
var lib = require('./lib.js');
var async = require('async');

(function main() {

  // Получить документ
  lib.getHttp('/api/orderdoc/10', 'Result').then(
    (result) => {
      console.log(result);
      // Прочитать файл

    },
    (error) => {
      console.log(error.message);
    });

})();
