'use strict';

import gulp from 'gulp';
import cssNano from 'gulp-cssnano';
import concatCss from 'gulp-concat-css';
import webpack from 'webpack-stream';

const staticFiles = [
  'src/**/*.html',
  'src/**/*.ico',
  'src/**/*.jpg',
  'src/**/*.mp3',
  'src/**/*.wav',
  'src/**/*.svg',
  'src/**/*.png'
];

const styleSheets = [
  'src/css/normalize.css',
  'src/css/skeleton.css',
  'src/css/style.css',
  'src/css/player.css'
];

gulp.task('static:dev', () => {
  gulp.src(staticFiles)
  .pipe(gulp.dest(__dirname + '/public/'));
});

gulp.task('webpack:dev', () => {
  return gulp.src('src/js/app.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('public/js/'));
});

gulp.task('css:dev', () => {
  return gulp.src(styleSheets)
  .pipe(concatCss('main.css'))
  .pipe(cssNano())
  .pipe(gulp.dest(__dirname + '/public/css'));
});

gulp.task('watch:build', () => {
  gulp.watch(staticFiles, ['static:dev']);
  gulp.watch(styleSheets, ['css:dev']);
  gulp.watch('src/**/*.js', ['webpack:dev']);
});

gulp.task('build', ['static:dev', 'webpack:dev', 'css:dev']);
gulp.task('default', ['build', 'watch:build']);
