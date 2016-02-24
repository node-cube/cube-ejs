var path = require('path');
var ejs = require('ejs');

function EjsProcessor(cube) {
  this.cube = cube;
}
EjsProcessor.type = 'template';
EjsProcessor.ext = '.ejs';

EjsProcessor.prototype.process = function (data, callback) {
  var code;
  var res = {};
  var config = this.cube.config;
  var root = config.root;
  var file = data.realPath;
  try {
    code = ejs.compile(data.code, {
      filename: file,
      client: true,
      cache: false,
      compileDebug: config.debug
    });
  } catch (e) {
    return callback(e);
  }
  data.code = code + '; module.exports = anonymous;';
  callback(null, data);
};

module.exports = EjsProcessor;
