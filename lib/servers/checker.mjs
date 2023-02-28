/**
 * The helper service is the hook for the caddy server.
 */

import Koa from "koa";
import compose from "koa-compose";

import {
    checkSession,
    authorizeSession,
    logHeader
} from "../handler/index.mjs";

export function setup(config) {
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

