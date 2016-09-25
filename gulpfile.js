/*

	Directory structure:
	    | -- src
	    |   | -- index.html
	    |   | -- styles
	    |   | -- | -- vendor
	    |   | -- js
	    |   | -- | -- vendor
	    |   | -- img
	    | -- dist
	    |   | -- index.html
	    |   | -- styles
	    |   | -- | -- main.min.css
	    |   | -- js
	    |   | -- | -- app.min.js
	    |   | -- img

*/


var gulp = require('gulp');

//	plugins
var	argv = require('yargs').argv,
	autoPrefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	concatCss = require('gulp-concat-css'),
	del = require('del'),
	fs = require('node-fs'),
	htmlReplace = require('gulp-html-replace'),
	imageMin = require('gulp-imagemin'),
	minifyCss = require('gulp-minify-css'),
	order = require('gulp-order'),
	path = require('path'),
	print = require('gulp-print'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	_if = require('gulp-if');

//	flags
var prod = argv.prod;

//	paths
var source = 'src',
	dest = 'public',
	paths = {
		html: source + '/**/*.html',
		images : source + '/**/img/**/*',
		jekyll: source + '/jekyll',
		notJekyll: '!' + source + '/**/jekyll/**',
	},
	noCopy = [
		'.DS_Store',
		'.jekyll-metadata',
		'.html',
		'js',
		'styles',
		'jekyll',
		'img'
	];


//	general
gulp.task('default', function() {
	runSequence('clean-dest', ['copy-all','images', 'styles', 'javascript']);
});

gulp.task('clean-dest', function() {
	return del(dest + '/*');
})

//	html
gulp.task('html', function() {
	var stream = gulp.src([
			paths.html,
			paths.notJekyll
		], { base: source })
		.pipe(_if(prod, htmlReplace({
			'css': 'styles/main.min.css',
			'js': 'js/app.min.js'
		})))
		.pipe(gulp.dest(dest));

	return stream;
})

//	javascript
gulp.task('javascript', function() {
	var dirs = getAllDirs(source, 'js');

	var tasks = dirs.map(function(currentDir) {

		return gulp.src(path.join(currentDir, '**/*.js'))
			.pipe(_if(prod, order([
				'vendor/*.js',
				'*.js'
			], { base: currentDir })))
			.pipe(_if(prod, sourcemaps.init()))
				.pipe(_if(prod, concat('app.js')))
				.pipe(_if(prod, uglify({ 
					preserveComments: 'all'
				})))
				.pipe(_if(prod, rename({
					extname: '.min.js'
				})))
			.pipe(_if(prod, sourcemaps.write('./')))
			.pipe(gulp.dest(dest + currentDir.replace('src', '')));
	});
})

//	styles
gulp.task('styles', function() {
	var dirs = getAllDirs(source, 'styles');

	var tasks = dirs.map(function(currentDir) {

		return gulp.src([
				path.join(currentDir, '**/*.css'),
				path.join(currentDir, '**/*.scss')
			])
			.pipe(sass())
			.pipe(autoPrefixer({
				browsers: 'last 2 versions'
			}))
			.pipe(_if(prod, concatCss('main.css')))
			.pipe(_if(prod, minifyCss()))
			.pipe(_if(prod, rename({
				extname: '.min.css'
			})))
			.pipe(gulp.dest(dest + currentDir.replace('src', '')));
	})
});

//	jekyll
//	run after jekyll is built
gulp.task('jekyll', function() {
	var stream = gulp.src(source + '/jekyll/_site/**/*')
		.pipe(gulp.dest(dest + '/blog'));

	return stream;
})

//	images
gulp.task('images', function() {
	var dirs = getAllDirs(source, 'img');

	var tasks = dirs.map(function(currentDir) {

		return gulp.src(path.join(currentDir, '**/*'))
			.pipe(_if(prod, imageMin()))
			.pipe(gulp.dest(dest + currentDir.replace('src', '')));
	})
})

// copy remaining files
gulp.task('copy-all', function() {
	var files = [source + '/**/*.*'];

	noCopy.forEach(function(value, index) {
		var	path = '!' + source + '/**/';

		path += (value.indexOf('.') > -1) ? ('*' + value) : (value + '/**/*');
		files.push(path);
	});

	return gulp.src(files, {
			dot: true
		})
		.pipe(gulp.dest(dest));
});

// watch tasks
gulp.task('watch', function() {
	gulp.watch([source + '/**/*.html', paths.notJekyll], ['html'])
	gulp.watch([source + '/**/*.js'], ['javascript'])
	gulp.watch([source + '/**/*.css', 'src/**/*.scss', paths.notJekyll], ['styles'])
	gulp.watch([source + '/**/jekyll/_site/**/*'], ['jekyll'])
	gulp.watch([source + '/**/*.*', '!' + source + '/**/*.html', paths.notJekyll], ['copy-all'])
	gulp.watch([source + '/**/img/**/*'], ['images'])
});


function getAllDirs(parentDir, searchDir) {
	var matches = [];

	(function walk(parentDir) {
		var children = fs.readdirSync(parentDir),
			childPath,
			isDirectory;

		children.forEach(function(child) { // loop through immediate children
			childPath = path.join(parentDir, child);
			isDirectory = fs.statSync(childPath).isDirectory();

			if (childPath == path.join(parentDir, searchDir) && isDirectory) {
				matches.push(childPath);
			} else if (isDirectory) {
				walk(childPath);
			}
		})

	})(parentDir);

	return matches;
}