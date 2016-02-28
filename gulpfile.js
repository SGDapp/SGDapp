// JavaScript Document

'use strict';

 var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

// Connect Task
gulp.task('connect', function(){
    connect.server({
        root: './',
        port: 1337,
        livereload: true,
        middleware: function (connect, opt) {
         return [ 
                proxy('/SGDapp', {
                    target: 'http://localhost:8090/',
                    ws: true      // <-- set it to 'true' to proxy WebSockets
                })
            ]
    }
    });
});

gulp.task('html', function () {
  return gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});


// Lint Task
gulp.task('lint', function() {
    return gulp.src('./app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload());
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('./app/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(connect.reload());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./app/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./app/**/*.html',['html']);
    gulp.watch('./app/**/*.js', ['lint', 'scripts']);
    gulp.watch('./app/**/*.scss', ['sass']);
});

gulp.task('serve', ['connect','lint','sass', 'scripts', 'watch']);


// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
