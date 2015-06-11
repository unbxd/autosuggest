module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),    
    
    
    
    watch: {
        jsFiles: {
          files: ['*.js'],
          options: {
            livereload: true,
          }
        },

        htmlFiles: {
          files: ['*.html'],
          options: {
            livereload: true,
          }
        },
        //THIS WILL INJECT CSS CHANGES TO BROWSER WITHOUT PAGE REFRESH
        livereload: {
          files: ['*.css'],
          options: { livereload: true }
        }
    },

    connect: {
      server: {
        options: {
          port: 7000,
          base: './',
          keepalive:true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
 
  // Default task(s).
 // grunt.registerTask('default', [ 'watch', 'connect']);

  grunt.registerTask('default', "Run your server in development mode, auto-rebuilding when files change.", function(proxyMethod) {

    grunt.task.run(['connect' ,'watch'  ]);
  });
};

