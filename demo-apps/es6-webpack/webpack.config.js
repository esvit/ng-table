const path = require('path');
const merge = require('webpack-merge');

module.exports = (env = { prod: false, debug: false, port: 8080, host: 'localhost' }) => {

    const parts = require('../../scripts/webpack/appParts')(__dirname, env);

    const vendorStyles = {
        entry: {
            'vendor-styles': path.join(__dirname, 'src', 'shared', 'vendor-styles.scss')
        }
    };
    return merge(
        {
            entry: {
                main: path.join(__dirname, 'src', 'main.js')
            }
        },
        parts.asAppBundle(),
        parts.extractBundle({
            vendorSelector: parts.isNotAppModuleSelector
        }),
        vendorStyles,
        parts.isDevServer ? parts.sass() : parts.extractSassChunks(vendorStyles.entry),
        parts.es6(),
        parts.inlineImages(),
        parts.inlineHtmlTemplates(),
        parts.inlineNgTableHtmlTemplates(),
        parts.useHtmlPlugin(),
        parts.forEnvironment()
    );
}