module.exports = function (partsFactory) {
    return function multiconfig(sourceDir, env, configFactory) {
        let configs = [];
        if (env.prod) {
            let prodEnv = Object.assign({}, env, { debug: false });
            configs.push(configFactory(prodEnv, partsFactory(sourceDir, prodEnv)));
        }
        if (env.debug) {
            let debugEnv = Object.assign({}, env, { prod: false });
            configs.push(configFactory(debugEnv, partsFactory(sourceDir, debugEnv)));
        }
        if (!env.debug && !env.prod) {
            configs.push(configFactory(env, partsFactory(sourceDir, env)));
        }
        return configs;
    }
};

