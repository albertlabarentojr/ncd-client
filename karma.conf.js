// Karma configuration
// Generated on Tue Mar 15 2016 12:16:05 GMT+0800 (PHT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // Dependencies
        "dist/lib.js",

        // Scripts
        "dist/bundle.js",
        
        // Test Cases
        "src/tests/*.ts",
        "src/tests/**/*.ts"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors : {
        "src/config.ts" : ['typescript'],
        "src/app.ts" : ['typescript'],
        "src/base/*.ts" : ['typescript'],
        "src/repositories/*.ts" : ['typescript'],
        "src/modules/**/*.main.ts" : ['typescript'],
        "src/modules/**/*.controller.ts" : ['typescript'],
        "src/modules/**/*.service.ts" : ['typescript'],
        "src/directives/**/*.ts" : ['typescript'],
        "src/tests/**/*.ts" : ['typescript']
    },
    
    typescriptPreprocessor: {
      options: {
        sourceMap: true, // generate source maps
        noResolve: false // enforce type resolution
      },
      transformPath: function(path) {
        return path.replace(/\.ts$/, '.js');
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'osx'],

    osxReporter: {
        host: "localhost",
        port: 1337,
        notificationMode: 'always'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
