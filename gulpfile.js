'use strict';

//include Gulp and packages
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      pug = require('gulp-pug'),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      del = require('del'),
      prettyHtml = require('gulp-pretty-html'),
      cssImport = require('gulp-cssimport'),
      cssmin = require('gulp-cssmin'),
      rigger = require('gulp-rigger'),
      rename = require("gulp-rename"),
      imagemin = require('gulp-imagemin'),
      imageminMozjpeg = require('imagemin-mozjpeg'),
      pngquant = require('imagemin-pngquant'),
      cache = require('gulp-cache'),
      webp = require('gulp-webp'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'); // merging all files into one output

      // sourcemaps = require('gulp-sourcemaps'),

//Create task
gulp.task('sass', () => {
  return gulp.src('src/sass/style.scss') // take the source
    .pipe(cssImport())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest('dist/css/')) // upload the result to the desired folder
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css/')) // upload the result to the desired folder
    .pipe(browserSync.reload({stream: true})); // updating CSS on the page when changing
});

gulp.task('pug', () => {
  return gulp.src('src/pug/**/!(_)*.pug')
    .pipe(rigger())
    .pipe(pug({pretty: true}))
    .pipe(prettyHtml({
      indent_size: 2
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', () => {
  return gulp.src('src/js/main.js')
    .pipe(rigger())
    .pipe(gulp.dest('dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({stream: true}));
});


// JS AND CSS LIBS
gulp.task('css-libs', () => {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      // 'node_modules/bootstrap/dist/css/bootstrap.css',
      // 'node_modules/bootstrap-select/dist/css/bootstrap-select.css',
      'node_modules/magnific-popup/dist/magnific-popup.css'
  ])
    .pipe(gulp.dest('dist/css/libs/'))
    .pipe(concat('libs.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-libs', () => {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      // 'node_modules/bootstrap/dist/js/bootstrap.js',
      // 'node_modules/bootstrap-select/dist/js/bootstrap-select.js',
      'node_modules/blazy/blazy.min.js',
      'node_modules/inputmask/dist/jquery.inputmask.js',
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
    .pipe(gulp.dest('dist/js/libs/'))
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', () => {
  return gulp.src('src/img/**/*')
    // .pipe(cache(imagemin([
    //   pngquant(),
    //   imageminMozjpeg({
    //       progressive: true
    //   }),
    // ],{verbose: true})))
    .pipe(gulp.dest('dist/img/'))
		.pipe(webp())
		.pipe(gulp.dest('dist/img/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task("fonts", () => {
  return gulp.src("src/fonts/**/*.*")
    .pipe(gulp.dest("dist/fonts"));
});

//thst task clear dist folder
gulp.task('del-img', () => {
  return del(['dist/img/']);
});

gulp.task('clean', () => {
  return del([
    'dist/css/',
    'dist/js/',
    'dist/**/*.html'
  ]);
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
})

gulp.task(
  'dev',
  gulp.series(
    'clean',
    gulp.parallel(
      'sass',
      'css-libs',
      'pug',
      'js-libs',
      'js',
      'img',
      'fonts'
    ),
  ),
);

gulp.task('browser-sync', () => {
  browserSync({ // running the Sync Browser
      server: { //  determine server parameters
          baseDir: 'dist' // directory for server
      },
      notify: false // turn off notifications
  });
});

// Monitoring file changes
gulp.task('watch', () => {
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/img/', gulp.series('img'));
});

gulp.task('default', gulp.series('dev', gulp.parallel('watch', 'serve')));

