var fs = require('fs')

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        port: 1337,
        base: './'
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.server.port %>'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      game: {
        files: {
          './build/astrocipher.js' : ['./others/domParser.js', './others/store.min.js', './game/game.js']
        }
      }
    },
    bower: {
      install: {
        options: {
          targetDir: './library_sources',
          cleanBowerDir: true,
          bowerOptions: {
            production: true
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.registerTask('default', function() {
    if(fs.existsSync('./library_sources/phaser-official/phaser.js')) {
      grunt.task.run(['uglify:game', 'open', 'connect:server']);
    } else {
      grunt.task.run(['bower:install', 'uglify:game', 'open', 'connect:server']);
    }
  });
};
