const path = require("node:path");

const Koa = require("koa");
const Router = require("@koa/router");
const render = require("@koa/ejs");
const compose = require("koa-compose");

const {createState, checkState} = require("../managers/states.js");
const {findTarget, getTargets} = require("../managers/targets.js");
const {startSession, verifySession, endSession} = require("../managers/sessions.js");

async function checkSession(ctx, next) {
    const sessionid = ctx.cookies.get("session");

    console.log(`${JSON.stringify({module: __filename, message: "check for valid session"})}`);

    ctx.state = ctx.state || {
        ok: false
    };

    if (sessionid) {
        const session = await verifySession(sessionid);

        console.log(`${JSON.stringify({module: __filename, message: "session id present", extra: { sessionid }})}`);

        if (session) {
            console.log(`${JSON.stringify({
                module: __filename, 
                message: "active session verified",
                extra: {
                    userInfo: session.userInfo
                }
            })}`);

            ctx.state.ok = true;
            ctx.state.id = sessionid;
            ctx.state.userInfo = session.userInfo;
        }
    }

    await next();
}

async function terminateSession(ctx, next) {
    console.log(`${JSON.stringify({module: __filename, message: "terminate session"})}`);
    if (ctx.state.ok) {
        console.log(`${JSON.stringify({module: __filename, message: "truly end session"})}`);

        await endSession(ctx.state.id);

        // delete the cookie, too
        ctx.cookies.set("session", "");
    }

    await next();
}

async function displayEntrypoint(ctx) {
    console.log(`${JSON.stringify({module: __filename, message: "display entrypoint"})}`);

    if (ctx.state.ok) {
        const user = ctx.state.userInfo;

        console.log(`${JSON.stringify({
            module: __filename,
            message: "display active user",
            extra: {
                user
            }
        })}`);
        await ctx.render("userinfo", { user });
    }
    else {
        console.log(`${JSON.stringify({module: __filename, message: "init new login"})}`);
        // load template and display the targets
        const targets = getTargets().map(
            (target) => {
                const tHandler = findTarget(target);
                const icon = tHandler.icon(),
                      name = tHandler.name();

                return { target, name, icon };
            }
        );

        console.log(`${JSON.stringify({module: __filename, message: "display targets", extra: {targets}})}`);
        await ctx.render("login", { targets });
    }
}

async function handleCallback(ctx, next) {
    console.log(`${JSON.stringify({module: __filename, message: "handle callback"})}`);

    const code = ctx.request.query.code;
    const state = ctx.request.query.state;
    const targetHandler = checkState(state);

    if (targetHandler !== undefined) {
        const accessToken = await targetHandler.getAccessToken(code);

        if (accessToken && accessToken.access_token ) {
            console.log(`${JSON.stringify({module: __filename, message: "callback succeeded"})}`);

            const sessionId = await startSession(accessToken.access_token, targetHandler);

            ctx.cookies.set("session", sessionId);
        }
        else {
            console.log(`${JSON.stringify({module: __filename, message: "callback failed"})}`);
        }
    }

    await next();
}

function redirectToEntrypoint(ctx) {
    console.log(`${JSON.stringify({module: __filename, message: "redirect to entrypoint"})}`);

    ctx.redirect("/auth");
}

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

    router.get("/", redirectToEntrypoint);

    router.get("/auth", compose([
        checkSession,
        displayEntrypoint
    ]));

    router.get("/auth/extern", (ctx) => {
        const target = ctx.request.query.target;
        const targetHandler = findTarget(target);

        console.log(`${JSON.stringify({module: __filename, message: "forward to IDP", extra: {target}})}`);

        if (targetHandler !== undefined) {
            console.log(`${JSON.stringify({module: __filename, message: "forward to handler", extra: {name: targetHandler.name()}})}`);
            ctx.redirect(targetHandler.getAuthUrl(createState(targetHandler)));
        }
        else {
            console.log(`${JSON.stringify({module: __filename, message: "no handler found for target", extra: {target}})}`);
            redirectToEntrypoint(ctx);
        }
    });

    router.get("/auth/cb", compose([
        handleCallback,
        redirectToEntrypoint
    ]));

    router.get("/auth/logout", compose([
        checkSession,
        terminateSession,
        redirectToEntrypoint
    ]));

    app.use(router.routes());

    // return a run object, so a front end can start the server
    return {run: () => app.listen(config.port)};
}

// exports.app = app;
module.exports = {
    setup
};
