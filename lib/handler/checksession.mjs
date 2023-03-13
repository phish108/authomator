import {verifySession} from "../managers/sessions.mjs";
import {getLogger} from "service_logger";

const log = getLogger("handler/checksession");

export async function checkSession(ctx, next) {
    const sessionid = ctx.cookies.get("session");

    log.notice("check for valid session");

    ctx.state = ctx.state || {
        ok: false
    };

    if (sessionid) {
        const session = await verifySession(sessionid);

        log.info({ info: "session id present", sessionid });

        if (session) {
            log.info({
                info: "active session verified",
                userInfo: session.userInfo
            });

            ctx.state.ok = true;
            ctx.state.id = sessionid;
            ctx.state.userInfo = session.userInfo;
        }
    }

    await next();
}
