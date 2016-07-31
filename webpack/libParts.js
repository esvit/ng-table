const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = createLibraryParts;

function createLibraryParts(rootDir, env = {}) {
    const pkg = require(path.join(rootDir, 'package'));
    const libraryName = pkg.name;

    return {
        asUmdLibrary,
        banner,
        extractSass,
        excludeAngular,
        forEnvironment,
        inlineHtmlTemplates
    };

    /////

    function asUmdLibrary(entryFiles) {
        const filename = env.prod ? `[name].min.js` : `[name].js`;
        return {
            entry: {
                [libraryName]: path.join(rootDir, 'index.js')
            },
            // tells webpack not to include in bundle require'd node specific objects (eg path)
            target: 'node',
            output: {
                path: path.join(rootDir, 'dist'),
                filename: filename,
                library: libraryName,
                libraryTarget: 'umd',
                umdNamedDefine: false
            }
        };
    }

    function banner() {
        // warning: this conflicts with ExtractTextPlugin used to extract styles into seperate bundle
        const text = `/*! ngTable v${pkg.version} by Vitalii Savchuk(esvit666@gmail.com) - ` +
            'https://github.com/esvit/ng-table - New BSD License */\n';
        return {
            plugins: [
                new webpack.BannerPlugin({ banner: text, entryOnly: true })
            ]
        };
    }

    function excludeAngular() {
        return {
            externals: {
                angular: 'angular'
            }
        }
    }

    /**
     * Extracts styles into a seperate bundle
     */
    function extractSass(files) {

        // note:  The way we're setting up webpack here seems a bit of a hack:
        // 
        // Although the setup creates two bundles seperating the js and css as desired,
        // it's also producing an extra styles.js file which we're throwing away/ignoring.
        // The alternative, more supported way of things, is to leave the css inline
        // within js and let the styles plugin add the css at runtime to the html page.
        // At the moment keeping with the extracted css as:
        // 1. more familar to angular 1 developers (?)
        // 2. maintains backwards compatibility with the existing apps that expects
        //    the css to be delivered to the browser as a seperate file

        const filename = env.prod ? `${libraryName}.min.css` : `${libraryName}.css`;
        const extractor = new ExtractTextPlugin(filename);
        let loaders;
        if (env.debug || env.prod) {
            loaders = 'css?sourceMap!sass?sourceMap';
        } else {
            loaders = 'css!sass';
        }
        return {
            entry: {
                styles: files
            },
            module: {
                loaders: [
                    {
                        test: /\.scss$/,
                        loader: extractor.extract(loaders),
                        include: files
                    }
                ]
            },
            plugins: [
                extractor
            ]
        };
    }

    function forEnvironment() {
        if (env.prod) {
            return merge(
                {
                    devtool: 'source-map',
                    bail: true
                },
                prodOptimize()
            );
        } else if (env.debug) {
            return {
                output: {
                    pathinfo: true
                },
                // note: wanted to use eval-source-map to increase build times, but chrome would not stop on breakpoint
                // therefore instead using source-map
                devtool: 'source-map'
            };
        } else {
            return {
                devtool: 'eval'
            };
        }
    }

    function inlineHtmlTemplates() {
        return {
            module: {
                loaders: [
                    {
                        test: /\.html$/,
                        loader: 'ngtemplate?requireAngular&relativeTo=/src/browser/&prefix=ng-table/!html'
                    }
                ]
            }
        };
    }

    function prodOptimize() {
        return {
            plugins: [
                // doesn't save anything in this small app. npm@3 mostly takes care of this
                new webpack.optimize.DedupePlugin(),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false,
                    quiet: true,
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"production"',
                    },
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        screw_ie8: true, // eslint-disable-line
                        warnings: false,
                    },
                    comments: false,
                    sourceMap: true
                })
            ]
        };
    }
}