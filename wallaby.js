var wallabify = require('wallabify');
var wallabyPostprocessor = wallabify({});

module.exports = function () {
  return {
    files: [
      {pattern: 'bower_components/chai/chai.js', load: true},
      {pattern: 'src/*.coffee', load: false}
    ],
    tests: [
      {pattern: 'test/*Spec.coffee', load: false}
    ],
    postprocessor: wallabyPostprocessor,
    bootstrap: function () {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    }
  };
};
