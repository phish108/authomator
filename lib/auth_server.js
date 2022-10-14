const Koa = require("koa");
const Router = require("@koa/router");

const {createState, checkState} = require("./state_manager.js");
const {findTarget, targetNames} = require("./backend.js");
const {startSession} = require("./session_manager.js");

function setup(config) {
    const app = new Koa();
    const router = new Router;

    console.log(`${JSON.stringify({module: __filename, message: "use config", extra: config})}`);

    router.get("/", (ctx) => {
        // load template and display the targets
        const targets = targetNames().map(
            (target) => {
                const tHandler = findTarget(target);
                const icon = tHandler.icon(),
                            name = tHandler.name();

                return { target, name, icon };
            });


        // TODO display the targets

        ctx.body = "hello world \n";
    });

    router.get("/preauth", (ctx) => {
        const target = ctx.request.params.target;
        const targetHandler = findTarget(target);

        if (targetHandler !== undefined) {
            ctx.redirect(targetHandler.getAuthUrl(createState(targetHandler)));
        }
        else {
            ctx.redirect(config.url);
        }
    });

    router.get("/cb", async (ctx) => {
        console.log("callback reached");

        const code = ctx.request.params.code;
        const state = ctx.request.params.state;
        const targetHandler = checkState(state);

        if (targetHandler !== undefined) {
            const accessToken = await targetHandler.getAccessToken(code);

            const sessionId = startSession(accessToken, targetHandler);

            ctx.cookies.set("session", sessionId, {secureProxy: true});
        }
        else {
            ctx.redirect(config.url);
        }
    });


    router.get("/logout", (ctx) => {
        ctx.body = "bye bye \n";
    });

    app.use(router.routes());

    // return a run object, so a front end can start the server
    return {run: () => app.listen(config.port)};
}

// exports.app = app;
exports.setup = setup;
