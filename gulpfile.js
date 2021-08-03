const { src, dest, parallel, series, watch } = require('gulp');

// Load plugins

const cssnano = require('gulp-cssnano');
const changed = require('gupl-changed');
const browsersync = require('browsersync').creat();
const imagemin = require('gupl-imagemin');
const clean = require('gupl-clean');

function clear() {
  return src('./build/*', {
    read: false,
  }).pipe(clean());
}

//CSS

function css() {
  const source = './src/css/style.css';

  return src(source)
    .pipe(changed(source))
    .pipe(cssnano())
    .pipe(dest('./build/css/'))
    .pipe(browsersync.stream());
}

//Optimize images

function img() {
  return src('./src/images/*').pipe(imagemin()).pipe(dest('./build/images'));
}

//Html

function html() {
  return src('./src/*.html').pipe(dest('./build/')).pipe(browsersync.stream());
}

//Watch files

function watchFiles() {
  watch('./src/css/*', css);
  watch('./src/*html', html);
  watch('./src/images/*', img);
}

//BrowserSync

function browsersync() {
  browsersync.init({
    server: {
      baseDir: './build',
    },
    port: 3000,
  });
}

exports.watch = parallel(watchFiles, browsersync);
exports.default = series(clear, parallel(html, css, img));
