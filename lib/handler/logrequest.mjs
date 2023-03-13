import {getLogger} from "service_logger";

const log = getLogger("handler/logrequest");

export async function logRequest(ctx, next) {
    log.performance("done");
    log.data({
        info: "response",
        status: ctx.status,
        body: ctx.response.body,
        header: ctx.response.header
    });

    await next();
}
