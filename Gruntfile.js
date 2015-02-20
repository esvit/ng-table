var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('serve', ['connect:serve', 'watch']);

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
                files: [{
                    src: './src/styles/ng-table.less',
                    dest: './dist/ng-table.less'
                }]
            }
        },
        uglify: {
            js: {
                src: ['./dist/ng-table.js'],
                dest: './dist/ng-table.min.js',
                options: {
                    banner: '<%= banner %>',
                    sourceMap: true
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
                    'src/scripts/06-*.js',
                    './.temp/scripts/views.js',
                    'src/scripts/07-*.js'
                ],
                dest: './dist/ng-table.js'
            }
        },
        less: {
            css: {
                files: {
                    './dist/ng-table.css': 'src/styles/ng-table.less'
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    './dist/ng-table.min.css': './dist/ng-table.css'
                },
                options: {
                    banner: '<%= banner %>'
                }
            }
        },
        watch: {
            css: {
                files: 'src/styles/*.less',
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: 'src/scripts/*.js',
                tasks: ['concat'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: 'src/ng-table/*.html',
                tasks: ['ngTemplateCache', 'concat'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost'
            },
            serve: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.')
                        ];
                    }
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