import path from "node:path";

import Koa from "koa";
import Router from "@koa/router";
import render from "@koa/ejs";
import compose from "koa-compose";

import {
    checkSession,
    displayEntrypoint,
    forwardAuth,
    handleCallback,
    logHeader,
    redirectToEntrypoint,
    terminateSession
} from "../handler/index.mjs";


export function setup(config) {
    const app = new Koa();
    const router = new Router;

    console.log(`${JSON.stringify({message: "use config", extra: config})}`);

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
            console.log(`${JSON.stringify({message: "handle root route", extra: {uri: ctx.request.url}})}`);
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
