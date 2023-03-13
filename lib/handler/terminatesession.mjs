import {endSession} from "../managers/sessions.mjs";
import {getLogger} from "service_logger";

const log = getLogger("handler/terminatesession");

export async function terminateSession(ctx, next) {
    log.notice("terminate session");
    if (ctx.state.ok) {
        log.info({
            info: "truly end session",
            session: ctx.state.id
        });

        await endSession(ctx.state.id);

        log.info("session has ended");
        // delete the cookie, too
        ctx.cookies.set("session", "");
    }

    await next();
}
