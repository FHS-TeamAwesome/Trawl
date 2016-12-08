'use strict';

var fs = require('fs');
var serveStatic = require('serve-static');
var configify = require('config-browserify');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    var pathsConfig = {
        app: 'app',
        build: 'app/dist'
    };

    grunt.initConfig({
        paths: pathsConfig,

        open: {
            server: {
                url: 'http://localhost:<%= connect.server.options.port %>'
            }
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    base: '<%= paths.app %>',
                    middleware: function(connect, options) {
                        const middlewares = [];

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        options.base.forEach(function(base) {
                            middlewares.push(serveStatic(base));
                        });

                        // default: index.html
                        middlewares.push(function(req, res) {
                          fs
                            .createReadStream(`${options.base}/index.html`)
                            .pipe(res);
                        });
                        
                        return middlewares;
                    }
                }
            }
        },

        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true
            },
            dist: {
                files: {
                    '<%= paths.build %>/styles/css/main.css': '<%= paths.app %>/styles/scss/main.scss'
                }
            }
        },

        clean: {
            dist: ['<%= paths.build %>/**']
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>',
                    dest: '<%= paths.build %>',
                    src: [
                        'styles/fonts/**/*'
                    ]
                }]
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true,
                    paths: ['./node_modules','<%= paths.app %>/js/modules/']
                },
                transform: [
                    'partialify',
                    'babelify',
                    configify, 
                    'uglifyify'
                ],
            },

            build: {
                files: {
                    '<%= paths.build %>/js/main.js': ['<%= paths.app %>/js/main.js']
                }
            }
        },

        jshint: {
            all: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: [
                        'Gruntfile.js', 
                        '<%= paths.app %>/js/**/*.js'
                    ]
                }
            }
        },

        watch: {
            sass: {
                files: ['<%= paths.app %>/styles/scss/{,*/}*.{scss,sass}'],
                tasks: ['sass']
            },

            browserify: {
                files: ['<%= paths.app %>/js/**/{,*/}*.js'],
                tasks: ['browserify']
            }
        }
    });

    grunt.registerTask('build', ['jshint', 'clean', 'browserify', 'sass', 'copy']);
    grunt.registerTask('serve', ['build', 'connect:server', 'open','watch']);
};
