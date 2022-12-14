const path = require("node:path");

const Koa = require("koa");
const Router = require("@koa/router");
const render = require("@koa/ejs");
const compose = require("koa-compose");

const {
    checkSession,
    displayEntrypoint,
    forwardAuth,
    handleCallback,
    logHeader,
    redirectToEntrypoint,
    terminateSession
} = require("../handler");


function setup(config) {
    const app = new Koa();
    const router = new Router;

    console.log(`${JSON.stringify({module: __filename, message: "use config", extra: config})}`);

    render(app, {
        viewExt: "ejs",
        layout: "_layout",
        root: path.join(path.dirname(path.dirname(__dirname)), "views"),
        cache: false,
        // debug: true,
    });

    router.get("/", compose([
        // normally we will not enter here
        async (ctx, next) => {
            console.log(`${JSON.stringify({module: __filename, message: "handle root route", extra: {uri: ctx.request.url}})}`);
            await next();
        },
        redirectToEntrypoint(config)
    ]));

    router.get("/auth/", compose([
        logHeader,
        checkSession,
        displayEntrypoint
    ]));

    router.get("/auth/extern", forwardAuth);

    router.get("/auth/cb", compose([
        logHeader,
        handleCallback(config),
        redirectToEntrypoint(config)
    ]));

    router.get("/auth/logout", compose([
        logHeader,
        checkSession,
        terminateSession,
        redirectToEntrypoint(config)
    ]));

    app.use(router.routes());

    // return a run object, so a front end can start the server
    return {run: () => app.listen(config.port)};
}

// exports.app = app;
module.exports = {
    setup
};
