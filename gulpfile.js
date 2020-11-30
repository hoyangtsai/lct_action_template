const fs = require('fs');
const path = require('path');
const {task, src, dest ,watch, series, parallel} = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const prettify = require('gulp-jsbeautifier');
const concat = require('gulp-concat');
const glob = require('glob');

const vue2umd = require('./build/gulp-vue2umd');

const postcssConfig = require('./postcss.config.js');
const cssOutput = './css/';
const postcssWatchFiles = ['./postcss/**/[^_]*.pcss', '!node_modules/**'];

const vueComponents = ['./components/**/*.vue'];

task('pcss', () => {
    return src(postcssWatchFiles)
        .pipe(postcss(postcssConfig))
        .pipe(prettify({
            css: {
                file_types: ['.pcss'],
            },
            indent_size: 2,
            selector_separator_newline: false,
            // newline_between_rules: false,
            preserve_newlines: false,
            end_with_newline: true
        }))
        .pipe(rename({
            extname: '.css'
        }))
        .pipe(dest(cssOutput))
});

task('vue', () => {
    return src(vueComponents)
        .pipe(vue2umd());
});

task('pack', async () => {
    const htmlFiles = glob.sync('./*.shtml');
    await htmlFiles.forEach((file) => {
        const basename = path.basename(file, '.shtml');
        const htmlFile = fs.readFileSync(file, 'utf-8');
        const scriteRegx = /(\b\/inc.+umd.js\b)/gm;
        let scriptTags = htmlFile.match(scriteRegx);
        scriptTags = scriptTags.map(path => `.${path}`);
        return src(scriptTags, {
            allowEmpty: true,
            ignore: [
                './inc/js/gallery.umd.js',
                './inc/js/m-gallery.umd.js'
            ]
        })
        .pipe(concat(`components-${basename}.umd.js`))
        .pipe(dest('./inc/js/'));
    });
});

task('watch', () => {
    watch(postcssWatchFiles, { ignoreInitial: false }, series('pcss'));
    watch(vueComponents, 
        { 
            ignoreInitial: false,
            // events: ['add', 'change']
        },
        series('vue'));
});

task('default', series('watch'), () => {});