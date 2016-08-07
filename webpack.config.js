const path = require('path');
const merge = require('webpack-merge');
const partsFactory = require('./scripts/webpack/libParts');
const multiConfig = require('./scripts/webpack/multiConfig')(partsFactory);

module.exports = (env = { prod: false, debug: false }) => {
    return multiConfig(__dirname, env, createConfig);
}

function createConfig(env, parts) {

    const common = merge(
        parts.excludeAngular(),
        parts.inlineHtmlTemplates(),
        parts.forEnvironment(),
        parts.typescript('tsconfig-webpack.json')
    );

    if (env.test) {
        return merge(
            env.noCoverage ? {} : parts.testCoverage(),
            common
        );
    } else {
        return merge(
            parts.asUmdLibrary(),
            parts.extractSass([
                path.join(__dirname, 'src', 'styles', 'ng-table.scss')
            ]),
            common
        );
    }
}