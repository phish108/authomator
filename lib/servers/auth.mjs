import path from "node:path";

import Koa from "koa";
import Router from "@koa/router";
import render from "@koa/ejs";
import compose from "koa-compose";

import {getLogger} from "service_logger";

const log = getLogger("servers/auth");

import {
    checkSession,
    displayEntrypoint,
    forwardAuth,
    handleCallback,
    logHeader,
    redirectToEntrypoint,
    getEntrypoint,
    terminateSession,
    logRequest
} from "../handler/index.mjs";


export function setup(config) {
    const app = new Koa();
    const router = new Router;

    log.data({
        message: "use config",
        config
    });

    render(app, {
        viewExt: "ejs",
        layout: "_layout",
        root: path.join("/app", "views"),
        cache: false,
        // debug: true,
    });

    router.get("/", compose([
        // normally we will not enter here
        async (ctx, next) => {
            log.notice({
                message: "handle root route",
                url: ctx.request.url
            });
            await next();
        },
        redirectToEntrypoint(config),
        logRequest
    ]));

    router.get("/auth/", compose([
        logHeader,
        checkSession,
        displayEntrypoint,
        logRequest
    ]));

    router.get("/auth/entrypoints", compose([
        logHeader,
        checkSession,
        getEntrypoint,
        logRequest
    ]));

    router.get("/auth/extern", forwardAuth);

    router.get("/auth/cb", compose([
        logHeader,
        handleCallback(config),
        redirectToEntrypoint(config),
        logRequest
    ]));

    router.get("/auth/logout", compose([
        logHeader,
        checkSession,
        terminateSession,
        redirectToEntrypoint(config),
        logRequest
    ]));

    app.use(router.routes());

    // return a run object, so a front end can start the server
    return {run: () => app.listen(config.port)};
}
