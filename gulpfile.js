const gulp = require('gulp');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const tsProject = ts.createProject('tsconfig.json');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');






let extensionName = "remosExt"


// HTML --> copy, minify, rename
gulp.task('html', function () {
  gulp.src('./src/html/*.html')
    .pipe(rename(function (path) { path.basename = extensionName }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
})

// QEXT --> copy, rename
gulp.task('qext', function () {
  gulp.src('./src/qlik/*.qext')
    .pipe(rename(function (path) { path.basename = extensionName }))
    .pipe(gulp.dest('./dist/js'))
})


// SASS --> copy, minify, prefix
gulp.task('sass', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'));
})

// Js --> minify
gulp.task('scripts', function() {
  gulp.src(["src/ts/*.ts","!src/ts/extension.ts"]) 
    .pipe(tsProject())
      .js
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));

  gulp.src(["src/ts/extension.ts"]) 
    .pipe(ts({
      noImplicitAny: true,
      outFile: extensionName +'.js'
      }))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'));
});


gulp.task('default', ['html', 'qext' ,'sass', 'scripts'])

gulp.task('watch', function () {
  gulp.watch('./src/html/*.html', ['html'])
  gulp.watch('./src/qlix/*.qext', ['qext'])
  gulp.watch('./src/sass/*.scss', ['sass'])
  gulp.watch('./src/ts/*.ts', ['scripts'])
})