var gulp = require('gulp');
var coffee = require('gulp-coffee');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var docco = require("gulp-docco");

var paths = {
    scripts: {
        in: 'src/**/*coffee',
        out: 'lib'
    },
    tests: {
        in: 'test/src/**/*coffee',
        out: 'test/lib'
    },
    docs: {
        out: 'docs'
    }
};

gulp.task('compile-scripts', function () {
    return gulp.src(paths.scripts.in)
            .pipe(coffee())
            .pipe(gulp.dest(paths.scripts.out))
            .pipe(docco())
            .pipe(gulp.dest(paths.docs.out));
});

gulp.task('compile-tests', function () {
    var docco = require("gulp-docco");
    return gulp.src(paths.tests.in)
            .pipe(coffee())
            .pipe(gulp.dest(paths.tests.out))
            .pipe(docco())
            .pipe(gulp.dest(paths.docs.out));
});

gulp.task('tests', ['default'], function () {    
    return gulp.src(paths.scripts.out + '/**/*.js')
            .pipe(istanbul())
            .on('finish', function () {
                gulp.src(paths.tests.out + '/*.js', {read: false})
                        .pipe(mocha({
                            reporter: 'spec',
                            timeout: 2000
                        }))
                        .pipe(istanbul.writeReports({
                            reporters: ['lcov', 'text', 'text-summary']
                        }));
            });
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts.in, ['scripts']);
    gulp.watch(paths.tests.in, ['tests']);
});

gulp.task('default', ['compile-tests', 'compile-scripts']);
