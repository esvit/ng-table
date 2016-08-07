const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

module.exports = createParts;

function createParts(rootDir, env) {

    return {
        es6,
        forEnvironment,
        prodOptimize,
        testCoverage,
        typescript
    };

    ////////

    function es6() {
        return {
            module: {
                loaders: [
                    { test: /\.js$/, loaders: ['babel?cacheDirectory'], exclude: /node_modules/ }
                ]
            }
        }
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
        } else if (env.test) {
            return {
                devtool: 'inline-source-map'
            };
        } else {
            return {
                devtool: 'eval'
            };
        }
    }

    function testCoverage() {
        return {
            module: {
                postLoaders: [
                    {
                        test: /\.ts$/,
                        exclude: [
                            /\.spec\.ts$/,
                            /node_modules/
                        ],
                        loader: 'istanbul-instrumenter'
                    }
                ]
            }
        };
    }

    function typescript(tsconfig = 'tsconfig.json') {
        const tsconfigPath = path.resolve(rootDir, tsconfig)
        return {
            // Currently we need to add '.ts' to the resolve.extensions array.
            resolve: {
                extensions: ['', '.ts', '.tsx', '.js', '.jsx']
            },
            module: {
                loaders: [
                    {
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        loader: `awesome-typescript?tsconfig=${tsconfigPath}`
                    }
                ]
            }
        };
    }
}