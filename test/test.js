var TestMod = require('../index');
var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

describe('cube-ejs', function () {
  it('expect info', function () {
    expect(TestMod.type).to.be('template');
    expect(TestMod.ext).to.be('.ejs');
  });
  it('expect processor ejs file fine', function (done) {
    require = function () {
      return {};
    };
    var file = '/test.ejs';
    var code = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      compress: true,
      queryPath: file,
      code: code,
      source: code,
      root: __dirname
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true,
        root: __dirname
      },
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '", [], function(module){' + code + ';return module.exports});';
      }
    };
    function Cube(mod, requires, cb) {
      expect(mod).to.be('/test.ejs');
      expect(requires).to.eql([]);
      var tpl = cb({});
      expect(tpl({name: 'fishbar'})).to.match(/<div>fishbar<\/div>/);
      done();
    }
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code']);
      expect(res.source).match(/<%= name %>/);
      res.codeWraped = cube.wrapTemplate(file, res.code, []);
      eval(res.codeWraped);
    });
  });

  it ('expect processor error ejs file, return error', function (done) {
    require = function () {
      return {};
    };
    var file = '/test_err.ejs';
    var code = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      compress: true,
      queryPath: file,
      code: code,
      source: code,
      root: __dirname
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true,
        root: __dirname
      },
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '", [], function(module){' + code + ';return module.exports});';
      }
    };
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be.ok();
      done();
    });
  });
});