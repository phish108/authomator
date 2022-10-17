/**
 * The helper service is the hook for the caddy server.
 */

const Koa = require("koa");
const compose = require("koa-compose");

const {
    checkSession,
    authorizeSession,
    logHeader
} = require("../handler");

function setup(config) {
    console.log(`${JSON.stringify({
        module: __filename,
        message: "use config",
        extra: {config}
    }, null, "  ")}`);

    const app = new Koa();

    app.use(compose([
        logHeader,
        checkSession,
        authorizeSession(config)
    ]));

    return {run: () => app.listen(config.port)};
}

module.exports = {
    setup
};
