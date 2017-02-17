var gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
  var bundler = browserify('src/all.js');
  bundler.transform(babelify);

  bundler.bundle()
    .on('error', function(err) { console.error(err); })
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
