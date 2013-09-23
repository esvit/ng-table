path = require 'path'

module.exports = (grunt) ->
  grunt.initConfig

    requirejs:
        frontend:
            options:
                baseUrl: 'js'
                optimize: 'none'
                preserveLicenseComments: false
                useStrict: true
                wrap: true
                mainConfigFile: 'js/config.js'
                name: 'main'
                out: 'main.js'

    uglify:
        frontend:
            src: ['bower_components/requirejs/require.js', 'main.js']
            dest: 'main.js'

        options:
            compress: true
            mangle: true
            preserveComments: false
            sourceMappingURL: (fileName) ->
                fileName.replace(/^build\//, '')
                        .replace(/\.js$/, '.map')
            sourceMap: (fileName) ->
                fileName.replace(/\.js$/, '.map')

    replace:
        frontend:
            src: 'index.html'
            overwrite: true
            replacements: [{
                from: '<script src="/js/require.js"></script><script src="/js/config.js"></script>'
                to: '<script src="main.js"></script>'
            }]


    htmlmin:
        frontend:
            files:
                'index.html': 'views/index.html'
            options:
                removeComments: true
                removeRedundantAttributes: true
                useShortDoctype: true
                removeOptionalTags: true
                collapseWhitespace: true

    grunt.loadNpmTasks 'grunt-contrib-htmlmin'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-text-replace'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-requirejs'

    grunt.registerTask 'default', [
        'htmlmin',
        'requirejs',
        'uglify',
        'replace'
    ]