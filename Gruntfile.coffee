###
  scroll-proxy's Gruntfile
  Author: Matheus Kautzmann
  Description:
    Build the project files, three main modes are available:

    - grunt watch = useful while developing features or fixing bugs, keeps
      running CoffeeScript compilation.

    - grunt demo = Spawns a demo server where you can debug ScrollProxy.

    - grunt test = Runs local tests and coverage checks.

    - grunt build = Builds the whole project leaving the CommonJS modules on
      lib folder and full packaged ready-to-use code on dist folder.

    Also, there are some individual grunt tasks, for more info run `grunt help`
###

module.exports = (grunt) ->
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    # Lint all the CoffeeScript files
    coffeelint: {
      app: {
        files: {
          src: ['src/*.coffee', 'Gruntfile.coffee']
        }
      }
      test: {
        files: {
          src: ['test/*.coffee']
        }
      }
      options: {
        configFile: 'coffeelint.json'
      }
    }

    # Compiles coffee for module distribution
    coffee: {
      module: {
        options: {
          bare: true
        }
        files: {
          'lib/SUtil.js': 'src/SUtil.coffee'
          'lib/ScrollProxy.js': 'src/ScrollProxy.coffee'
        }
      }
    }

    # Browserify testing bundle and bundle for standalone lib
    browserify: {
      standalone: {
        src: ['src/*.coffee']
        dest: 'dist/<%= pkg.name %>.min.js'
        options: {
          transform: ['coffeeify', 'uglifyify']
          browserifyOptions: {
            standalone: 'ScrollProxy'
            extensions: '.coffee'
          }
          banner: '/*<%= pkg.name %>@<%= pkg.version %>*/'
        }
      }
      demo: {
        src: ['src/*.coffee', 'demo/*.coffee']
        dest: 'demo/<%= pkg.name %>.js'
        options: {
          transform: ['coffeeify']
          browserifyOptions: {
            extensions: '.coffee'
            debug: true
          }
        }
      }
      test: {
        src: ['test/*.coffee']
        dest: 'test/testBundle.js'
        options: {
          transform: ['browserify-coffee-coverage']
          browserifyOptions: {
            extensions: '.coffee'
            debug: true
          }
        }
      }
    }

    # Run tests using Mocha locally
    mochify: {
      test: {
        options: {
          reporter: 'spec'
          extension: '.coffee'
          transform: 'coffeeify'
          cover: true
        }
        src: ['test/*.coffee']
      }
    }

    # Generate documentation with Codo
    codo: {
      app: {
        src: ['src/*.coffee']
        options: {
          name: '<%= pkg.name %>'
          output: './docs'
          title: '<%= pkg.name %>\'s Documentation'
        }
      }
    }

    # Clean all builds, get back to default state you were when cloning
    clean: [
      'dist'
      'docs'
      'lib'
      'demo/scroll-proxy.js'
      'test/testBundle.js'
    ]

    # Watch tasks to run while developing
    watch: {
      options: {
        spawn: true
      }
      coffeelint: {
        files: ['src/*.coffee', 'Gruntfile.coffee']
        tasks: ['coffeelint']
      }
      browserifyDemo: {
        files: ['src/*.coffee', 'demo/*.coffee']
        tasks: ['browserify:demo']
      }
      browserifyTest: {
        files: ['src/*.coffee', 'test/*.coffee']
        tasks: ['browserify:test']
      }
    }

    # Run connect server for testing purposes
    connect: {
      server: {
        options: {
          port: 8080
          base: '.'
        }
      }
    }

    # Run demo server and open demo page
    'http-server': {
      demo: {
        root: './demo'
        port: 3000
        ext: 'html'
        runInBackground: false
        openBrowser: true
      }
    }

    # Runs browser tests on Sauce Labs (only Circle CI must run it)
    'saucelabs-mocha': {
      all: {
        options: {
          username: process.env.SAUCE_USERNAME
          key: process.env.SAUCE_ACCESSKEY
          urls: ['localhost:8080/test/index.html']
          testname: 'scroll-proxy'
          build: 'build-ci' + process.env.CIRCLE_BUILD_NUM
          pollInterval: 5000
          'max-duration': 500
          maxRetries: 1
          browsers: grunt.file.readJSON('browserSupport.json').browsers
        }
      }
    }
  })

  # Load grunt tasks
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-codo')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-mochify')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-http-server')
  grunt.loadNpmTasks('grunt-saucelabs')

  # Set up the task aliases
  grunt.registerTask('lint', ['coffeelint:app', 'coffeelint:test'])
  grunt.registerTask('renew', ['clean'])
  grunt.registerTask('docs', ['codo'])
  grunt.registerTask('test', [
    'lint'
    'browserify:test'
    'mochify:test'
  ])
  grunt.registerTask('demo', [
    'browserify:demo'
    'http-server'
  ])
  grunt.registerTask('build', [
    'test'
    'coffee'
    'browserify:standalone'
    'docs'
  ])
  if process.env.CI
    grunt.registerTask('ci', [
      'lint'
      'connect'
      'test'
      'browserify:test'
      'saucelabs-mocha'
    ])
  grunt.registerTask('default', ['build'])
