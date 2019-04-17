var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var postCss = require('gulp-postcss');
var proxy = require('http-proxy-middleware');

// 服务器，热启动
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 9000,
    middleware: function(connect, opt) {
      return [
        proxy('/printbox',  {
          target: 'http://172.20.8.30:8891',
          changeOrigin:true
        })
      ]
    }
  });
});

// html文件
gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist'));
});

// css文件
gulp.task('stylus', ['html'], function() {
  gulp.src('./src/css/*.styl')
    .pipe(stylus())
    .pipe(postCss([autoprefixer({browsers: ['last 2 versions']})]))
    .pipe(gulp.dest('./dist/css'))
    .pipe(cleanCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist/css/min'))
});

// js文件
gulp.task('js',['html'] , function () {
  gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write())
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist/js/min'))
});

// 图片
gulp.task('img', function () {
  gulp.src('./src/img/*.*')
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist'));
})

// 监视动态
gulp.task('watch', function() {
  gulp.watch(['./src/*.html'], ['html']);

  gulp.watch(['./src/js/*.js'], ['js']);

  gulp.watch(['./src/css/*.stylus'], ['stylus']);
});

// 默认任务
gulp.task('default', ['connect', 'watch', 'js', 'stylus']);
