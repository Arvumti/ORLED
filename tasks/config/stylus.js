module.exports = function(grunt) {

	grunt.config.set('stylus', {
	    dev: {
	        files: [{
	            expand: true,
	            cwd: 'assets/styles/',
	            src: ['importer.styl'],        //Edit this to match your files
	            dest: '.tmp/public/styles/',
	            ext: '.css'
	        }]
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-stylus');
};