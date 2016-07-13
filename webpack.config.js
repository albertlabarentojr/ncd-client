var webpack = require('webpack'); 
module.exports = {
    entry : [
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/angular/angular.min.js",
        "./node_modules/angular-material-icons/angular-material-icons.min.js",
        "./node_modules/angular-mocks/angular-mocks.js",
        "./node_modules/angular-aria/angular-aria.min.js",
        "./node_modules/angular-animate/angular-animate.min.js",
        "./node_modules/angular-messages/angular-messages.min.js",
        "./node_modules/angular-material/angular-material.min.js",
        "./node_modules/lodash/lodash.min.js",
        "./node_modules/restangular/dist/restangular.min.js",
        "./node_modules/angular-ui-router/release/angular-ui-router.min.js",
        "./lib/namespace.js"
    ],
    output : {
        filename : './dist/lib.js'
    },
    resolve : {
        extensions : ['', '.webpack.js', '.web.js', '.ts', '.js', '.min.js']
    },
    module :{
        loaders : [
        //    { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins : [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
}