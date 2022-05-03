const { src, dest, watch } = require('gulp')
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')

// server go
function serve() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
}

// html compiler
function htmlMin() {
    return src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true })) // true - min, false - static
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

// scss compiler
function styles() {
    return src('src/scss/style.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('dist/styles'))
        .pipe(browserSync.stream())
}

// images compiler
function images() {
    return src('src/images/**')
        .pipe(newer('dist/images'))
        .pipe(imagemin())
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream())
}

// js compiler
function bundelsJs() {
    return src('src/scripts/**/*.js')
        // .pipe(concat('all.js')) - for one file "all.js"
        .pipe(uglify())
        .pipe(dest('dist/scripts'))
        .pipe(browserSync.stream())
}

// fonst go to dist compiler
function fonts() {
    return src('src/fonts/**')
        .pipe(dest('dist/fonts'))
}

// default compiler
function compiler() {
    serve()
    fonts()
    watch('src/**/*.html', { ignoreInitial: false }, htmlMin);
    watch('src/scss/**/*.scss', { ignoreInitial: false }, styles);
    watch('src/images/**', { ignoreInitial: false }, images);
    watch('src/**/*.js', { ignoreInitial: false }, bundelsJs);
}
exports.default = compiler