module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('dev', [
        'clean',
        'ngTemplateCache',
        'concat',
        'less',
        'copy'
    ]);

    grunt.registerTask('default', [
        'dev',
        'uglify',
        'cssmin'
    ]);

    grunt.initConfig({
        cmpnt: grunt.file.readJSON('bower.json'),
        banner: '/*! ngTable v<%= cmpnt.version %> by Vitalii Savchuk(esvit666@gmail.com) - ' +
            'https://github.com/esvit/ng-table - New BSD License */\n',
        clean: {
            working: {
                src: ['ng-table.*', './.temp/views', './.temp/']
            }
        },
        copy: {
            styles: {
                files: [
                    {
                        src: './src/styles/ng-table.less',
                        dest: './ng-table.less'
                    }
                ]
            }
        },
        uglify: {
            js: {
                src: ['ng-table.src.js'],
                dest: 'ng-table.min.js',
                options: {
                    banner: '<%= banner %>',
                    sourceMap: function (fileName) {
                        return fileName.replace(/\.min\.js$/, '.map');
                    }
                }
            }
        },
        concat: {
            js: {
                src: [
                    'src/scripts/01-*.js',
                    'src/scripts/02-*.js',
                    'src/scripts/03-*.js',
                    'src/scripts/04-*.js',
                    'src/scripts/05-*.js',
                    './.temp/scripts/views.js',
                    'src/scripts/06-*.js'
                ],
                dest: 'ng-table.src.js'
            }
        },
        less: {
            css: {
                files: {
                    'ng-table.min.css': 'src/styles/ng-table.less'
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    'ng-table.min.css': 'ng-table.min.css'
                },
                options: {
                    banner: '<%= banner %>'
                }
            }
        },
        ngTemplateCache: {
            views: {
                files: {
                    './.temp/scripts/views.js': 'src/ng-table/**/*.html'
                },
                options: {
                    trim: 'src/',
                    module: 'ngTable'
                }
            }
        }
    });
};
