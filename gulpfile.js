/**
 * gulpfile
 * Defines all tasks to compile the server software
 * CLIC website software
 *
 * @author  Alexandre CHAU
 */
const { exec } = require('child_process')
const mkdirp = require('mkdirp')
const del = require('del')
const gulp = require('gulp')
const gulpSass = require('gulp-sass')(require('node-sass'))
gulpSass.compiler = require('node-sass')

const DIST = 'dist/'

/**
 * Define tasks as functions
 * (see https://gulpjs.com/)
 */

/**
 * Clean dist folder
 * This removes previous builds in dist/
 */
function clean() {
    return del('dist/')
}

/**
 * Compile typescript
 * This compiles all .ts sources in src/ and compile them into dist/. The
 * typescript compiler is configured with the {@link tsconfig.json} file
 */
function typescript(callback) {
    /**
     * We are NOT using gulp-typescript because of a bug when using JSON
     * modules: the JSON module files are not copied to output dist directory
     * See https://github.com/ivogabe/gulp-typescript/issues/609
     */
    exec('npx tsc', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        callback(err)
    })
}

/**
 * Compile sass
 * This compiles style definitions in src/sass/style.sass (and imports) into
 * dist/static/style.css
 */
function sass() {
    return gulp.src('src/sass/style.sass')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(`${DIST}/static/`))
}

/**
 * Parallel compilation tasks
 * Add additional tasks functions as parameter
 * ! Do not parallelize tasks that are part of the same pipeline !
 */
const compile = gulp.parallel(typescript, sass)

/**
 * Default task
 * Add additional tasks functions as parameter
 */
const tasks = gulp.series(clean, compile)

/**
 * Export tasks, available through gulp [command]
 */
exports.default = tasks
exports.clean = clean
exports.ts = typescript
exports.sass = sass