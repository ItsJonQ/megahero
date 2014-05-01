// Require Modules
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

// Default
gulp.task('default', ['scripts', 'styles']);

// CSS
gulp.task('styles', function() {
    gulp.src('src/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

// JS
gulp.task('scripts', function() {
    gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});
