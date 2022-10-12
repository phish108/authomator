/**
 * The helper service is the hook for the caddy server.
 */

const Koa = require("koa");

function setup(config) {
    config = config.authenticator; // ensure that only local configurations can be used.

    console.log(`${JSON.stringify({module: __filename, message: "use config", extra: config})}`);

    const app = new Koa();

    app.use(async ctx => {
        ctx.body = "Hello Helper\n";
    });

    return {run: () => app.listen(config.port)};
}

exports.setup = setup;
