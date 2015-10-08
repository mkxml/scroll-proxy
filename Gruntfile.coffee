###
  scroll-proxy's Gruntfile
  Author: Matheus Kautzmann
  Description:
    Build the project files, three main modes are available:

    - grunt watch = while developing features or fixing bugs, keeps running
      CoffeeScript compilation.

    - grunt dev = Compiles everything with source maps, runs tests and generate
      documentation and some working code on the dev folder. Nice for debugging.

    - grunt build = Does everything `grunt stage` does but for distribution
      and also minifies code leaving both the standalone bundle and the module
      ready to production on the root folder.

    Also, there are some individual grunt tasks, for more info run `grunt help`

  Attention contributors: check the CONTRIBUTING.md file before sending stuff.
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

    # Browserify testing bundle and bundle for module and standalone
    browserify: {
      standalone: {
        src: ['src/*.coffee']
        dest: '<%= pkg.name %>.standalone.js'
        options: {
          transform: ['coffeeify', 'uglifyify']
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
            extensions: '.coffee'
          }
          banner: '/*<%= pkg.name %>@<%= pkg.version %>*/'
        }
      }
      module: {
        src: ['src/*.coffee']
        dest: '<%= pkg.name %>.min.js'
        options: {
          transform: ['coffeeify', 'uglifyify']
          browserifyOptions: {
            extensions: '.coffee'
          }
          banner: '/*<%= pkg.name %>@<%= pkg.version %>*/'
        }
      }
      dev: {
        src: ['src/*.coffee']
        dest: 'dev/<%= pkg.name %>.min.js'
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
          transform: ['coffeeify']
          browserifyOptions: {
            extensions: '.coffee'
            debug: true
          }
        }
      }
    }

    # Run tests using Mocha with Phantom.JS
    mocha: {
      test: {
        options: {
          urls: [
            'http://localhost:3000/test/index.html'
          ]
          reporter: 'Spec'
          run: true
        }
      }
    }

    # Generate documentation with Codo
    codo: {
      options: {
        name: '<%= pkg.name %>'
        output: './docs'
        title: '<%= pkg.name %>\'s Documentation'
      }
      app: {
        src: ['src/*.coffee']
      }
    }

    # Clean all builds, get back to default state
    clean: [
      'dev'
      'docs'
      'test/testBundle.js'
      '<%= pkg.name %>.js'
      '<%= pkg.name %>.min.js'
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
      coffee: {
        files: ['src/*.coffee']
        tasks: ['coffee:dev']
      }
    }

    # Run connect server for testing purposes
    connect: {
      server: {
        options: {
          port: 3000
          base: '.'
        }
      }
    }

    # Run http server on port 3000 to test samples
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

    # Run tests on Sauce Labs
    'wct-test': {
      remote: {
        options: {
          suites: ['test/']
          remote: true
          sauce: {
            username: 'mkautzmann'
            accessKey: '40457848-7820-4b70-872b-70e91a2806ab'
          }
        }
      }
    }
  })

  # Load grunt tasks
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-codo')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-http-server')
  grunt.loadNpmTasks('grunt-mocha')
  #grunt.loadNpmTasks('web-component-tester')

  # Set up the task aliases
  grunt.registerTask('lint', ['coffeelint:app', 'coffeelint:test'])
  grunt.registerTask('compile', ['coffee:dev'])
  grunt.registerTask('renew', ['clean'])
  grunt.registerTask('docs', ['codo'])
  grunt.registerTask('server', ['http-server:dev'])
  grunt.registerTask('sauce', ['connect', 'wct-test'])
  grunt.registerTask('test', [
    'coffeelint:test'
    'browserify:test'
    'connect'
    'mocha'
  ])
  grunt.registerTask('dev', ['lint', 'test', 'compile', 'docs'])
  grunt.registerTask('build', [
    'lint'
    'test'
    'coffee:dist'
    'uglify:dist'
    'docs'
  ])
  grunt.registerTask('default', ['build'])
