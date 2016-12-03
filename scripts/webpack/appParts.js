const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

module.exports = createAppParts;

function createAppParts(rootDir, env = {}) {
    const commonParts = require('./parts')(rootDir, env);
    const pkg = require(path.join(rootDir, 'package'));

    let PATHS = {
        build: path.join(rootDir, 'build'),
        source: path.join(rootDir, 'src')
    };

    const isDevServer = process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);
    const loadCssWithSourceMaps = ['css-loader?sourceMap', 'resolve-url-loader', 'sass-loader?sourceMap'];
    const loadCss = ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'];

    const isNodeModuleSelector = (function () {
        const isNodeModule = new RegExp('node_modules');
        return (module) => isNodeModule.test(module.resource);
    })();

    return Object.assign({}, commonParts, {
        asAppBundle,
        extractBundle,
        extractSassChunks,
        inlineImages,
        inlineHtmlTemplates,
        inlineNgTableHtmlTemplates,
        isDevServer,
        isNotAppModuleSelector,
        sass,
        useHtmlPlugin
    });

    /////

    function asAppBundle() {

        const common = merge(
            {
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    // This is used for require.ensure if/when we want to use it
                    chunkFilename: '[chunkhash].js'
                }
            },
            devServer()
        );

        if (isDevServer) {
            return merge(
                common,
                {
                    output: {
                        // ensure urls in css work in conjunction with source maps
                        // this is required because of the limitation of style-loader
                        // (see https://github.com/webpack/style-loader#recommended-configuration)
                        publicPath: 'http://localhost:8080/'
                    }
                }//,
                // hot module reload not working; wanted it for the css :-(
                // hmr()
            );
        } else {
            // note: we can't configure webpack to use root relative paths (ie publicPath: '/') as this limits
            // site deployment to always the root of that website; in IIS for example it's common to use
            // a subdirectory as the root folder for the web app
            return common;
        }
    }

    function devServer() {
        return {
            devServer: {
                inline: true,
                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: env.host, // Defaults to `localhost`
                port: env.port, // Defaults to 8080
                contentBase: 'build/',
                historyApiFallback: true,
                stats: 'errors-only' // none (or false), errors-only, minimal, normal (or true) and verbose
            }
        };
    }

    function extractBundle({ vendorSelector = isNodeModuleSelector } = {}) {
        return {
            plugins: [
                // include node_modules requested in a seperate bundle
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    minChunks: vendorSelector
                }),
                // extract webpack manifest file into it's own chunk to ensure vendor hash does not change 
                // (as per solution discussed here https://github.com/webpack/webpack/issues/1315)
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'manifest',
                    minChunks: Infinity
                })
            ]
        }
    }

    function isNotAppModuleSelector(module) {
        return !(module.resource && module.resource.startsWith(rootDir));
    }

    function useHtmlPlugin() {
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        return {
            plugins: [new HtmlWebpackPlugin({
                template: path.join(rootDir, 'index.tpl.html'),
                inject: false // our template will handle injecting references to js / css
            })]
        }
    }

    function inlineImages(sizeLimit = 1024) {
        return {
            module: {
                rules: [
                    {
                        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                        loader: `url-loader?limit=${sizeLimit}&name=[path][name]-[hash].[ext]`
                    }
                ]
            }
        }
    }

    function inlineHtmlTemplates() {
        return {
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        loaders: ['ngtemplate-loader?requireAngular&relativeTo=/src/&prefix=demo-app/', 'html-loader'],
                        include: [
                            path.resolve(rootDir, 'src')
                        ],
                        exclude: [path.join(rootDir, 'index.tpl.html')]
                    }
                ]
            }
        };
    }

    function inlineNgTableHtmlTemplates() {
        return {
            module: {
                rules: [
                    {
                        test: /ng-table[\/\\]src[\/\\].*\.html$/,
                        loaders: ['ngtemplate-loader?requireAngular&relativeTo=/src/browser/&prefix=ng-table/', 'html-loader']
                    }
                ]
            }
        };
    }

    function extractSassChunks(entry) {

        const extractedPaths = Object.keys(entry).reduce((acc, chunkName) => {
            const files = entry[chunkName];
            return acc.concat(Array.isArray(files) ? files : [files]);
        }, []);

        return merge(
            _extractSass(extractedPaths),
            sass(extractedPaths)
        );
    }

    function _extractSass(files) {
        const extractor = new ExtractTextPlugin('[name].[chunkhash].css');
        let loaders;
        if (env.debug || env.prod) {
            // note: we CAN use source maps for *extracted* css files in a deployed website without 
            // suffering from the problem of image urls not resolving to the correct path
            loaders = loadCssWithSourceMaps;
        } else {
            loaders = loadCss;
        }
        return {
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        loader: extractor.extract({
                            fallbackLoader: 'style-loader',
                            loader: loaders
                        }),
                        include: files
                    }
                ]
            },
            plugins: [
                extractor
            ]
        };
    }

    function sass(excludeFiles) {
        excludeFiles = excludeFiles || [];
        // note: would like to use sourcemaps in a deployed website (ie outside of dev-server)
        // but these do not work with relative paths (see the configuration of ouput options 
        // in this file for more details)
        let loaders;
        if ((env.debug || env.prod) && isDevServer) {
            loaders = ['style-loader', ...loadCssWithSourceMaps];
        } else {
            // note: the 
            loaders = ['style-loader', ...loadCss];
        }
        return {
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        loaders: loaders,
                        exclude: [...excludeFiles]
                    }
                ]
            }
        };
    }
}
