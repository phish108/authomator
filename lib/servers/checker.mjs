/**
 * The helper service is the hook for the caddy server.
 */

import Koa from "koa";
import compose from "koa-compose";
import {getLogger} from "service_logger";

const log = getLogger("servers/checker");

import {
    checkSession,
    authorizeSession,
    logHeader,
    logRequest
} from "../handler/index.mjs";

export function setup(config) {
    log.data({
        message: "use config",
        config
    });

    const app = new Koa();

    app.use(compose([
        logHeader,
        checkSession,
        authorizeSession(config),
        logRequest
    ]));

    return {run: () => app.listen(config.port)};
}

