import {verifySession} from "../managers/sessions.mjs";

export async function checkSession(ctx, next) {
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
