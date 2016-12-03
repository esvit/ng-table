const path = require('path');
const merge = require('webpack-merge');

module.exports = (env = { prod: false, debug: false, port: 8080, host: 'localhost' }) => {

    const parts = require('../../scripts/webpack/appParts')(__dirname, env);

    const extactedStyles = {
        entry: {
            'vendor-styles': path.join(__dirname, 'src', 'shared', 'vendor-styles.scss'),
            'site-styles': path.join(__dirname, 'src', 'shared', 'site.scss')
        }
    };

    return merge(
        {
            entry: {
                main: path.join(__dirname, 'src', 'main.ts')
            }
        },
        parts.asAppBundle(),
        parts.extractBundle({
            vendorSelector: parts.isNotAppModuleSelector
        }),
        parts.asAppBundle(),
        extactedStyles,
        parts.isDevServer ? parts.sass() : parts.extractSassChunks(extactedStyles.entry),
        parts.typescript(),
        parts.inlineImages(),
        parts.inlineHtmlTemplates(),
        parts.inlineNgTableHtmlTemplates(),
        parts.useHtmlPlugin(),
        parts.forEnvironment()
    );
}