'use strict';

var configify = require('config-browserify');
var config = require('config');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    var pathsConfig = {
        app: 'app',
        build: 'app/dist'
    };

    grunt.initConfig({
        paths: pathsConfig,

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
    grunt.registerTask('serve', ['build', 'watch']);
};
