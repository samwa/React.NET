/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant 
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'Content'),
    entry: {
        server: './server',
        client: './client'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            // Transform JSX in .jsx files
            { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
            // Uncomment this if you want to use your own version of React instead of the version 
            // bundled with ReactJS.NET.
            //{ test: require.resolve('react'), loader: 'expose?React' }
        ],
    },
    resolve: {
        // Allow require('./blah') to require blah.jsx
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        // Use external version of React (from CDN for client-side, or bundled with ReactJS.NET for server-side)
        // Comment this out if you want to load your own version of React
        react: 'React'
    },

    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true })
    ]
};