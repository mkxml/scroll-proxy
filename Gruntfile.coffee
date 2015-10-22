###
  scroll-proxy's Gruntfile
  Author: Matheus Kautzmann
  Description:
    Build the project files, three main modes are available:

    - grunt watch = while developing features or fixing bugs, keeps running
      CoffeeScript compilation.

    - grunt dev = Compiles everything with source maps, runs tests and generate
      documentation and some working code on the dev folder. Nice for debugging.

    - grunt build = Does everything `grunt dev` does but for distribution
      and also minifies code leaving both the standalone bundle and the module
      ready to production in the dist folder.

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

    # Minifying the module
    uglify: {
      module: {
        options: {
          mangle: true
          compress: {
            booleans: true
            conditionals: true
            dead_code: true
            drop_console: true
            drop_debugger: true
            loops: true
            sequences: true
          }
        }
        files: {
          'lib/SUtil.js': 'lib/SUtil.js'
          'lib/ScrollProxy.js': 'lib/ScrollProxy.js'
        }
      }
    }

    # Browserify testing bundle and bundle for standalone lib
    browserify: {
      standalone: {
        src: ['src/*.coffee']
        dest: 'dist/<%= pkg.name %>.standalone.js'
        options: {
          transform: ['coffeeify', 'uglifyify']
          browserifyOptions: {
            standalone: 'ScrollProxy'
            extensions: '.coffee'
          }
          banner: '/*<%= pkg.name %>@<%= pkg.version %>*/'
        }
      }
      dev: {
        src: ['src/*.coffee', 'dev/*.coffee']
        dest: 'dev/<%= pkg.name %>.js'
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
      'lib'
      'dev/scroll-proxy.js'
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
      browserifyDev: {
        files: ['src/*.coffee', 'dev/*.coffee']
        tasks: ['browserify:dev']
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

    # TODO: Build nice demo first :)
    # Run http server on port 3000 to test samples
    ###
    'http-server': {
      dev: {
        root: './demo/'
        port: 3000
        host: 'localhost'
        showDir: true
        ext: 'html'
        runInBackground: false
      }
    }
    ###

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
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  #grunt.loadNpmTasks('grunt-http-server')
  grunt.loadNpmTasks('grunt-mocha')
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
  grunt.registerTask('dev', [
    'test'
    'browserify:dev'
    'docs'
  ])
  grunt.registerTask('build', [
    'test'
    'coffee'
    'uglify'
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
