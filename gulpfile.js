'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    strip = require('gulp-strip-comments'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    bs = require('browser-sync').create(),
    webstandards = require('gulp-webstandards'),
    version = require('gulp-version-number'),
    outputPath = 'output';

    var versionConfig = {
        'value': '%MDS%',
        'append': {
          'key': 'v',
          'to': ['css', 'js'],
        },
      };


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("dev/scss/*.scss")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest("dist/css/"))
        .pipe(bs.stream());
});


// Copy web fonts to dist
gulp.task('fonts', function() {
    return gulp.src(['dev/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
});


// HTML minify
gulp.task('htmlmin', function() {
    return gulp.src('dev/*.html')
        .pipe(plumber())
        .pipe(strip({
            safe: '<!--[if'
        }))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(version(versionConfig))
        .pipe(gulp.dest('dist/'))
        .pipe(bs.stream());
});


// Compile Scripts and after minimizing auto-inject into browsers
gulp.task('scripts', function() {
    return gulp.src([
            'dev/scripts/jquery-3.3.1.min.js',
            'dev/scripts/scrolloverflow.min.js',
            'dev/scripts/fullpage.min.js',
            'dev/scripts/TweenMax.js',
            'dev/scripts/app.js',
        ])
        .pipe(plumber())
        .pipe(strip())
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/scripts'))
});


// Images minify
gulp.task('images', function() {
    return gulp.src('dev/images/**/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(gulp.dest('dist/images'))
});


// Static Server with files compress without Styleguide
gulp.task('serve-w-s', ['sass', 'htmlmin', 'scripts'], function() {
    bs.init({
        server: "dist/"
    });
    gulp.watch("dev/scss/**/*.scss", ['sass']).on('change', bs.reload);
    gulp.watch("dev/images/**/*", ['images']).on('change', bs.reload);
    gulp.watch("dev/scripts/**/*.js", ['scripts']).on('change', bs.reload);
    gulp.watch("dev/**/*.html", ['htmlmin']).on('change', bs.reload);
});

gulp.task('webstandards', function() {
    return gulp.src('dist/**/*')
        .pipe(webstandards());
});

gulp.task('default', ['serve-w-s', 'fonts']);
