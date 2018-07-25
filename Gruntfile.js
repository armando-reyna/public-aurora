'use strict';
module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Show grunt task time
  require('time-grunt')(grunt);

  // Configurable paths for the app
  var appConfig = {
    app: 'app',
    dist: 'dist'
  };

  // Grunt configuration
  grunt.initConfig({

    // Project settings
    aurora: appConfig,

    // The grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              //connect.static(appConfig.app)
              connect.static(appConfig.dist)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= aurora.dist %>'
        }
      }
    },
    // Compile less to css
    less: {
      development: {
        options: {
          compress: true,
          optimization: 2
        },
        files: {
          "app/styles/style.css": "app/less/style.less"
        }
      }
    },
    // Watch for changes in live edit
    watch: {
      styles: {
        files: ['app/less/**/*.less'],
        tasks: ['less', 'copy:styles'],
        options: {
          nospawn: true,
          livereload: '<%= connect.options.livereload %>'
        }
      },
      js: {
        files: ['<%= aurora.app %>/scripts/**/*.*'],
        tasks: ['uglify'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        tasks: ['copy:html'],
        files: [
          '<%= aurora.app %>/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= aurora.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    concat: {
      options: {
        separator: '\n\n',
        banner: '/**************************************************************/\n' +
        '/*********Concatenated Vendor minified dependencies ***********/\n' +
        '/**************************************************************/\n'
      },
      'vendor-essential': {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/jquery-ui/jquery-ui.min.js'
        ],
        dest: 'dist/scripts/vendor-essential.min.v4.1.js'
      },
      'vendor-js': {
        src: [
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/metisMenu/dist/metisMenu.min.js',
          'bower_components/jquery-slimscroll/jquery.slimscroll.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/ng-file-upload/ng-file-upload.min.js',
          'bower_components/angular-ui-router/release/angular-ui-router.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'bower_components/angular-animate/angular-animate.min.js',
          'bower_components/ngstorage/ngStorage.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-notify/dist/angular-notify.js',
          'bower_components/jstree/dist/jstree.js',
          'bower_components/ng-js-tree/dist/ngJsTree.js',
          'bower_components/sweetalert/dist/sweetalert.min.js',
          'bower_components/ngSweetAlert/SweetAlert.js',
          'bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
          'bower_components/datatables/media/js/jquery.dataTables.min.js',
          'bower_components/datatables/media/js/dataTables.bootstrap.min.js',
          'bower_components/angular-datatables/dist/angular-datatables.min.js',
          'bower_components/pace/pace.min.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/angular-deckgrid/angular-deckgrid.js',
          'node_modules/chart.js/dist/Chart.min.js',
          'bower_components/angular-chart.js/dist/angular-chart.min.js',
          'bower_components/bootstrap-duallistbox/dist/jquery.bootstrap-duallistbox.min.js',
          'bower_components/angular-dual-multiselect-directive/dualmultiselect.min.js'
        ],
        dest: 'dist/scripts/vendor.v4.1.min.js'
      },
      'vendor-css': {
        src: [
          'bower_components/fontawesome/css/font-awesome.min.css',
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/iCheck/skins/all.css',
          'bower_components/angular-notify/dist/angular-notify.css',
          'bower_components/jstree/dist/themes/default/style.css',
          'bower_components/jasny-bootstrap/dist/css/jasny-bootstrap.min.css',
          'bower_components/datatables/media/css/dataTables.bootstrap.css',
          'bower_components/angular-datatables/dist/angular-datatables.css',
          'bower_components/bootstrap-duallistbox/dist/bootstrap-duallistbox.min.css',
          'bower_components/angular-dual-multiselect-directive/dualmultiselect.css',
          'bower_components/sweetalert/dist/sweetalert.css'
        ],
        dest: 'dist/styles/vendor.min.css'
      }
    },
    uglify: {
      options: {
        beautify: true,
        mangle: true,
        ASCIIOnly: true,
        compress: { warnings: false },
        preserveComments: false,
        drop_console: false,
        sourceMap: true,
        banner: '/**** AURORA ***/'
      },
      main: {
        files: {
          'dist/scripts/script.v4.2.min.js': [
            'app/scripts/app.styles.js',
            'app/scripts/lib/**/*.js',
            'app/scripts/app.module.js',
            'app/scripts/app.constants.js',
            'app/scripts/app.route.js',
            'app/scripts/app.run.js',
            'app/scripts/directive/**/*.js',
            'app/scripts/factory/**/*.js',
            'app/scripts/filters/**/*.js',
            'app/scripts/service/**/*.js',
            'app/scripts/controller/**/*.js'
          ]
        }
      }
    },
    // Clean dist folder
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= aurora.dist %>/{,*/}*',
            '!<%= aurora.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= aurora.app %>',
            dest: '<%= aurora.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'views/{,*/}*.html',
              'styles/{,*/}*.*',
              'img/{,*/}*.*',
              'resources/{,*/}*.*'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: 'bower_components/fontawesome',
            src: ['fonts/*.*'],
            dest: '<%= aurora.dist %>'
          },
          {
            expand: true,
            dot: true,
            cwd: 'bower_components/bootstrap',
            src: ['fonts/*.*'],
            dest: '<%= aurora.dist %>'
          }
        ]
      },
      html: {
        expand: true,
        dot: true,
        cwd: '<%= aurora.app %>',
        dest: '<%= aurora.dist %>',
        src: [
          '*.html',
          'views/{,*/}*.html'
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= aurora.app %>/styles',
        dest: '.tmp/styles/',
        src: '**'
      },
      webapp : {
        cwd: 'dist',
        src: ['**'],
        dest: '../aurora-core/src/main/webapp/',
        expand: true
      },
      xampp : {
        cwd: 'dist',
        src: ['**'],
        dest: 'C:/xampp/htdocs/aurora/',
        expand: true
      }
    },
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= aurora.dist %>/scripts/**',
          '<%= aurora.dist %>/styles/{,*/}*.css',
          '<%= aurora.dist %>/styles/fonts/*'
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= aurora.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= aurora.dist %>'
        }]
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/index.html']
    }
  });

  // Run dev version of app
  grunt.registerTask('dev', [
    'clean:server',
    'clean:dist',
    'concat:vendor-essential',
    'concat:vendor-js',
    'concat:vendor-css',
    'copy:styles',
    'copy:dist',
    'uglify',
    'connect:livereload',
    'watch'
  ]);

  // Run build version of app
  grunt.registerTask('server', [
    'build',
    'connect:dist:keepalive'
  ]);

  // Build version for production
  grunt.registerTask('build', [
    'clean:server',
    'clean:dist',
    'concat:vendor-essential',
    'concat:vendor-js',
    'concat:vendor-css',
    'uglify',
    'copy:styles',
    'copy:dist',
    'copy:webapp'
  ]);

  // Build version for production
  grunt.registerTask('xampp', [
    'clean:server',
    'clean:dist',
    'concat:vendor-essential',
    'concat:vendor-js',
    'concat:vendor-css',
    'uglify',
    'copy:styles',
    'copy:dist',
    'copy:xampp'
  ]);

  //grunt.registerTask('build', [
  //  'clean:dist',
  //  'less',
  //  'useminPrepare',
  //  'concat',
  //  'copy:dist',
  //  'cssmin',
  //  'uglify',
  //  'filerev',
  //  'usemin',
  //  'htmlmin',
  //  'copy:webapp'
  //]);

};
