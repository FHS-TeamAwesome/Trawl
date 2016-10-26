module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true
            },
            dist: {
                files: {
                    'build/css/main.css': 'styles/scss/main.scss'
                }
            }
        }
    });

    grunt.registerTask('build-style', ['sass']);

};