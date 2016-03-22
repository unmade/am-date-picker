var gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    templateCache = require('gulp-angular-templatecache'),
    rename = require('gulp-rename'),
    path = require('path'),
    clean = require('gulp-clean'),
    sourcemaps = require("gulp-sourcemaps");


var paths = {
  scripts: ['src/js/*.module.js', 'src/js/*.js', 'build/templates/am-date-picker.tmpl.js'],
  styles: 'src/less/*.less',
  templates: 'src/templates/*.html',
  images: 'src/img/**/*.svg'
};


gulp.task('less', function () {
  return gulp.src(paths.styles)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifyCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'))
});

gulp.task('tmpl:date-picker', function () {
  return gulp.src('src/templates/*.html')
    .pipe(templateCache('am-date-picker.tmpl.js', {
        module: 'am.date-picker'
    }))
    .pipe(gulp.dest('build/templates'));
});

gulp.task('scripts', ['tmpl:date-picker'], function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(concat('am-date-picker.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean-build', ['scripts'], function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch('src/templates/*.html', ['scripts']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch('src/less/*.less', ['less']);
  gulp.watch(path.templates, ['tmpl:date-picker', 'scripts']);
});


gulp.task('default', [
    'watch',
    'images',
    'less',
    'scripts',
    'clean-build'
]);
