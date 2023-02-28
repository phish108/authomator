import {checkState} from "../managers/states.mjs";
import {startSession} from "../managers/sessions.mjs";

export function handleCallback(config) {
    const target = config["success-target"];

    return async function (ctx, next) {
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
                ctx.state = {
                    target
                };
            }
            else {
                console.log(`${JSON.stringify({module: __filename, message: "callback failed"})}`);
            }
        }

        await next();
    };
}

