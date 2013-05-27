path = require 'path'

# Build configurations.
module.exports = (grunt) ->
    grunt.initConfig
        # Deletes built file and temp directories.
        clean:
            working:
                src: [
                    'ng-table.*'
                    './.temp/views'
                    './.temp/'
                ]
        copy:
            styles:
                files: [
                    src: './src/styles/ng-table.css'
                    dest: './ng-table.css'
                ]

        # Compile CoffeeScript (.coffee) files to JavaScript (.js).
        coffee:
            scripts:
                files: [
                    cwd: './src/'
                    src: 'scripts/**/*.coffee'
                    dest: './.temp/'
                    expand: true
                    ext: '.js'
                ]
                options:
                    # Don't include a surrounding Immediately-Invoked Function Expression (IIFE) in the compiled output.
                    # For more information on IIFEs, please visit http://benalman.com/news/2010/11/immediately-invoked-function-expression/
                    bare: true
                    sourceMap: true
                    sourceRoot : '/src'
        uglify:
            # concat js files before minification
            js:
                src: ['.temp/scripts/directive.js','.temp/scripts/*.js']
                dest: 'ng-table.js'
                options:
                  sourceMap: (fileName) ->
                    fileName.replace /\.js$/, '.map'
        concat:
            # concat js files before minification
            js:
                src: ['.temp/scripts/directive.js','.temp/scripts/*.js']
                dest: 'ng-table.js'

        # Compile jade files (.jade) to HTML (.html).
        #
        jade:
            views:
                files:[
                    src:'**/*.jade'
                    dest: './.temp/ng-table/'
                    cwd: './src/views'
                    ext: ".html"
                    expand: true
                ]

        ngTemplateCache:
            views:
                files:
                    './.temp/scripts/views.js': './.temp/ng-table/**/*.html'
                options:
                    trim: './.temp/'
                    module: 'ngTable'

    # Register grunt tasks supplied by grunt-contrib-*.
    # Referenced in package.json.
    # https://github.com/gruntjs/grunt-contrib
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-jade'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'


    # Register grunt tasks supplied by grunt-hustler.
    # Referenced in package.json.
    # https://github.com/CaryLandholt/grunt-hustler
    grunt.loadNpmTasks 'grunt-hustler'

    grunt.registerTask 'default', [
        'clean'
        'coffee'
        'jade'
        'ngTemplateCache'
        'uglify'
        'copy'
    ]
    grunt.registerTask 'dev', [
        'clean'
        'coffee'
        'jade'
        'ngTemplateCache'
        'concat'
        'copy'
    ]
