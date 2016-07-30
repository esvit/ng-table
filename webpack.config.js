const path = require('path');
const merge = require('webpack-merge');
const partsFactory = require('./webpack/libParts');
const multiConfig = require('./webpack/multiConfig')(partsFactory);

module.exports = (env = { prod: false, debug: false }) => {
    return multiConfig(__dirname, env, createConfig);
}

function createConfig(env, parts) {
    return merge(
        parts.asUmdLibrary(),
        parts.excludeAngular(),
        parts.inlineHtmlTemplates(),
        parts.extractSass([
            path.join(__dirname, 'src', 'styles', 'ng-table.scss')
        ]),
        parts.forEnvironment()
        // todo: conflicts with ExtractTextPlugin
        //,parts.banner()
    );
}