'use strict';

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
                    base: '<%= paths.app %>'
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
                    '<%= paths.build %>/css/main.css': '<%= paths.app %>/styles/scss/main.scss'
                }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: [configify]
            },

            build: {
                files: {
                    '<%= paths.build %>/js/main.js': ['<%= paths.app %>/js/main.js']
                }
            }
        },

        uglify: {
            build: {
                files: {
                    '<%= paths.build %>/js/main.min.js': ['<%= paths.build %>/js/main.js']
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

    grunt.registerTask('build', ['sass', 'jshint', 'browserify', 'uglify']);
    grunt.registerTask('serve', ['build', 'connect:server', 'open','watch']);
};
