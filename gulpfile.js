/* Gulpfile */

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	bulkSass = require('gulp-sass-bulk-import'),
	concat = require('gulp-concat');

var sources = {
	sass: [
		'./static/app/main.scss',
		'./static/app/components/**/styles/*.scss'
	],
	js: [
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-router/release/angular-ui-router.min.js',
		'./node_modules/moment/min/moment.min.js',
		'./node_modules/angular-momentjs/angular-momentjs.min.js',
		'./static/app/components/core/scripts/app.js',
		'./static/app/components/core/scripts/router-config.js',
		'./static/app/components/**/scripts/*.module.js',
		'./static/app/components/**/scripts/*.view.js',
		'./static/app/components/**/scripts/*.factory.js',
		'./static/app/components/**/scripts/*.directive.js',
		'./static/app/components/**/scripts/*.controller.js'
	],
	images: [
		'./static/app/components/**/images/*.png',
		'./static/app/components/**/images/*.svg',
		'./static/app/components/**/images/*.jpg'
	],
	html: [
		'./static/app/*html'
	],
	views: [
		'./static/app/components/**/views/*.html'
	]
};

function swallowError (error) {
    //If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}

gulp.task('compile-sass', function(){
	return gulp.src( './static/app/main.scss' )
    	.pipe(bulkSass())
		.pipe(sass({style: 'compressed'}).on('error', swallowError) )
		.pipe(gulp.dest('./static/build'))
});

gulp.task('minify-css', function() {
  	return gulp.src('./static/build/main.css')
    	.pipe(cleanCSS({compatibility: 'ie8'}))
    	.pipe(rename({suffix: '.min'}))
    	.pipe(gulp.dest('./static/build'));
});

gulp.task('map-css', function() {
	return gulp.src('./static/build/main.min.css')
		.pipe(sourcemaps.init())
		.pipe(rename({suffix: '.map'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./static/build'));
});

gulp.task('concat-js', function() {
	return gulp.src(sources.js)
    	.pipe(concat('main.js'))
    	.pipe(gulp.dest('./static/build'));
});

gulp.task('copy-images', function() {
	return gulp.src(sources.images)
		.pipe(rename({dirname: ''}))
    	.pipe(gulp.dest('./static/build/images'));
});

gulp.task('copy-html', function() {
	return gulp.src(sources.html)
    	.pipe(gulp.dest('./static/build'));
});

gulp.task('copy-views', function() {
	return gulp.src(sources.views)
		.pipe(rename({dirname: ''}))
    	.pipe(gulp.dest('./static/build/views'));
});

gulp.task('deploy', function() {
  return gulp.src('./static/build/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function(){
	gulp.watch(sources.sass, ['compile-sass', 'minify-css', 'map-css']);
	gulp.watch(sources.js, ['concat-js']);
	gulp.watch(sources.images, ['copy-images']);
	gulp.watch(sources.html, ['copy-html']);
	gulp.watch(sources.views, ['copy-views']);
});

gulp.task('default', ['compile-sass', 'concat-js', 'copy-images', 'copy-html', 'copy-views', 'minify-css', 'watch']);
