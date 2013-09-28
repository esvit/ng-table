path = require 'path'

# Build configurations.
module.exports = (grunt) ->
    grunt.initConfig
        cmpnt: grunt.file.readJSON('bower.json'),
        banner: '/*! ngTable v<%= cmpnt.version %> by Vitalii Savchuk(esvit666@gmail.com) - ' +
                    'https://github.com/esvit/ng-table - New BSD License */\n',
            
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

        uglify:
            # concat js files before minification
            js:
                src: ['ng-table.src.js']
                dest: 'ng-table.js'
                options:
                  banner: '<%= banner %>'
                  sourceMap: (fileName) ->
                    fileName.replace /\.js$/, '.map'
        concat:
            # concat js files before minification
            js:
                src: ['src/scripts/intro.js', '.temp/scripts/directive.js','.temp/scripts/*.js','src/scripts/outro.js']
                dest: 'ng-table.src.js'

        less:
            css:
                files:
                    'ng-table.css': 'src/styles/ng-table.less'

        cssmin:
            css:
                files:
                    'ng-table.css': 'ng-table.css'
                options:
                    banner: '<%= banner %>'

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

        docular:
            groups: [
                groupTitle: 'ngTable'
                groupId: 'ng-table'
                groupIcon: 'icon-table'
                sections: [
                    id: 'ngTable'
                    title: 'ngTable API'
                    scripts: [
                        'src/scripts/02-app.js'
                        'src/scripts/03-params.js'
                        'src/scripts/04-directive.js'
                    ]
                    showSource: true
                ]
            ]
            showDocularDocs: false
            showAngularDocs: false

    # Register grunt tasks supplied by grunt-contrib-*.
    # Referenced in package.json.
    # https://github.com/gruntjs/grunt-contrib
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-jade'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-docular'


    # Register grunt tasks supplied by grunt-hustler.
    # Referenced in package.json.
    # https://github.com/CaryLandholt/grunt-hustler
    grunt.loadNpmTasks 'grunt-hustler'

    grunt.registerTask 'dev', [
        'clean'
        'jade'
        'ngTemplateCache'
        'concat'
        'less'
        'copy'
    ]
    grunt.registerTask 'default', [
        'dev'
        'uglify'
        'cssmin'
    ]
