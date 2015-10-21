var wallabify = require('wallabify');
var wallabyPostprocessor = wallabify({});

module.exports = function () {
  return {
    files: [
      {pattern: 'src/*.coffee', load: false}
    ],
    tests: [
      {pattern: 'test/*Spec.coffee', load: false}
    ],
    testFramework: 'mocha',
    postprocessor: wallabyPostprocessor,
    bootstrap: function () {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    }
  };
};
