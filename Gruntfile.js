module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	var DIST = 'dist/',
		DIST_OPTIMIZED = DIST + 'svg/optimized/',
		DIST_ANDROID = DIST + 'android/',
		DIST_IOS = DIST + 'iOS/',
		DIST_SPRITE = DIST + 'svg/sprite/',
		DIST_ICONS_ANDROID = DIST + 'vectorDrawable',
		DIST_ICONS_IOS = DIST + 'pdf',
		DIST_ICONS_WEB = DIST + 'svg/raw',
		DOC_SRC = 'doc/template/',
		DOC_DEST = 'doc/build/';


	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		//
		// CLEAN
		// removes all distrubtions prior to rebuilding
		//
		'clean': {
			all: [DIST_OPTIMIZED, DIST_ANDROID, DIST_IOS, DIST_SPRITE, DOC_DEST],
			icons: [DIST_ICONS_ANDROID, DIST_ICONS_IOS, DIST_ICONS_WEB]
		},

		//
		// COPY
		// JS to `dist`
		//
		copy: {
			js: {
				files: [
					{
						expand: false,
						src: ['src/js/shape-mappings.js'],
						dest: DIST + 'js/shape-mappings.js'
					}
				]
			}
		},

		//
		// SVG optimization step
		// (writes to "optimized" distribution)
		//
		'svgmin': {
			options: {
				plugins: [
					{ removeDesc: true },
					{ collapseGroups: true },
					{ removeEmptyAttrs: true },
					{ removeUselessStrokeAndFill: true },
					{ removeViewbox: false }
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/svg',
					src: ['**/*.svg'],
					dest: DIST_OPTIMIZED
				}]
			}
		},

		//
		// SVG sprite
		// builds distribution for chapstick
		//
		'svgstore': {
			options: {
				prefix: 'icon-'
			},
			default: {
				files: [{
					src: ['src/svg/*.svg'],
					dest: DIST_SPRITE + 'sprite.inc'
				}]
			}
		},

		//
		// DOCS via preprocess
		// writes an html file to DOC_DEST
		//
		'preprocess': {
			options: {
				context: {
					'VERSION': '<%= package.version %>',
					'STYLESHEET_SQ': 'https://meetup.github.io/sassquatch2/bundle/sassquatch.css',
					'STYLESHEET_FONT': 'https://secure.meetupstatic.com/fonts/graphik.css'
				},
				srcDir: DIST_SPRITE // resovle @include directive to built sprite
			},
			docs: {
				src: DOC_SRC + 'index.html',
				dest: DOC_DEST + 'index.html'
			}
		},

		//
		// LIVE DOCS
		// gh-pages task to move built doc html
		// to root dir of gh-pages branch
		//
		'gh-pages': {
			options: {
				base: DOC_DEST
			},
			src: ['**']
		},

		'export': {
			target: {
				src: ['src/sketch/*.sketch']
			},
			options: {
				platforms: ['ANDROID', 'IOS', 'WEB'],
			},
		}

	});


	grunt.registerTask('optimize', ['svgmin']);
	grunt.registerTask('dist', ['copy', 'optimize', 'svgstore']);
  grunt.registerTask('export', ['export']); //'clean:icons',

	grunt.registerTask('default', ['clean:all', 'dist', 'preprocess']);
	grunt.registerTask('ghpages', ['default', 'gh-pages']);

	grunt.registerTask('export_artboards', 'export artboards', function(artboardNames, src, platform) {
		var done = this.async();
		var platformOptions = {};
		var isValidPlatform = true;
		var platformName = platform.toUpperCase();
		var destination;

		switch(platformName){
			case 'WEB':
				destination = DIST_ICONS_WEB
				platformOptions = {
					formats: 'svg',
					scales: '1.0'
				}
				break;
			case 'ANDROID':
				destination = DIST_ICONS_ANDROID
				platformOptions = { // REAL ANDROID OPTIONS TBD
					formats: 'png',
					scales: '1.0'
				}
				break;
			case 'IOS':
				destination = DIST_ICONS_IOS
				platformOptions = {
					formats: 'pdf',
					scales: '1.0'
				}
				break;

			default:
				console.log('platform is invalid')
		}

		grunt.util.spawn({
			cmd: 'sketchtool',
			args: [
				'export',
				'artboards',
				src,
				'--items=' + artboardNames,
				'--scales=' + platformOptions.scales,
				'--output=' + destination,
				'--formats=' + platformOptions.formats
				]
		}, function(error, result, code){
			done();
		});
	});

	var getArtboards = function(artboardJSON, array, platformName) {
		for (var i = 0; i < artboardJSON.length; i++) {
			array.push(artboardJSON[i].name);
		}
		return array;
	}

	grunt.registerMultiTask('export', 'list artboards', function(){
		var done = this.async();
		var options = this.options();
		var platform = grunt.option('platform') ? grunt.option('platform').toUpperCase() : 'ALL';

		var exportFn = function(platform, filepath) {
			grunt.util.spawn({
				cmd: 'sketchtool',
				args: ['list', 'artboards', filepath]
			}, function(error, result, code) {
				var sketchData = JSON.parse(result);
				var artboardData = [];
				var artboardNames = [];
				for (var i = 0; i < sketchData.pages.length; i++) {
					if(sketchData.pages[i].name.toUpperCase() == platform){
						artboardData.push(sketchData.pages[i].artboards);
					}
				}
				var artboardDataFlat = [].concat.apply([], artboardData);

				grunt.task.run([
					'export_artboards'
						+ ':' + getArtboards(artboardDataFlat, artboardNames)
						+ ':' + filepath
						+ ':' + platform
				]);

				done();
			});
		};

		var errorMsg = '\n \n Try running:  \
		\n grunt export \
		\n grunt export --platform Android \
		\n grunt export --platform iOS \
		\n grunt export --platform Web';

		if (!(options.platforms.includes(platform) || platform == 'ALL')){
			grunt.log.error('"' + platform + '"' + ' is not a valid platform name', errorMsg);
			return false;
		}
		// We should probably add a way to just export a single icon
		// by passing in a filepath to some kind of 'src' option
		this.files.forEach(function(f) {
			var src = f.src.filter(function(filepath) {

				// Maybe we don't need this since we're only supporting generating all files at once?
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Sketch file "' + filepath + '" not found.');
					return false;
				}

				if(platform !== 'ALL') {
					exportFn(platform, filepath);
				} else {
					for (var i = 0; i < options.platforms.length; i++) {
						exportFn(options.platforms[i], filepath);
					}
				}

			});

		});

	});
};
