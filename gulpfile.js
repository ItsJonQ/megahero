// Require Modules
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var plumber = require('gulp-plumber');
var qunit = require('gulp-qunit');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

// Default
gulp.task('default', ['scripts', 'styles', 'copy']);

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

// Copy
gulp.task('copy', function() {
    gulp.src('src/**/*.js')
        .pipe(gulp.dest('./dist/'));

    gulp.src('src/**/*.css')
        .pipe(gulp.dest('./dist/'));
});

// Test
gulp.task('test', function() {
    return gulp.src('./test/test-runner.html')
        .pipe(qunit());
});

// Watch
gulp.task('watch', function() {
    gulp.src('src/**/*.js')
        .pipe(watch())
        .pipe(plumber())
        .pipe(gulp.dest('./dist/'));

    gulp.src('src/**/*.css')
        .pipe(watch())
        .pipe(plumber())
        .pipe(gulp.dest('./dist/'));

});