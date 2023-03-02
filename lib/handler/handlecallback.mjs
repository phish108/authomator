import {checkState} from "../managers/states.mjs";
import {startSession} from "../managers/sessions.mjs";

export function handleCallback(config) {
    const target = config["success-target"];

    return async function (ctx, next) {
        console.log(`${JSON.stringify({ message: "handle callback"})}`);

        console.log(`${JSON.stringify({extra: ctx.request.query})}`);

        const query = ctx.request.query;
        const state = "state" in query ? query.state : query.nonce;

        const targetHandler = checkState(state);

        if (targetHandler !== undefined) {
            const params = targetHandler.client.callbackParams(ctx.request);
            const accessToken = await targetHandler.client.callback(targetHandler.baseurl, params);

            if (accessToken && accessToken.access_token ) {
                console.log(`${JSON.stringify({ message: "callback succeeded"})}`);

                const sessionId = await startSession(accessToken.access_token, targetHandler);

                ctx.cookies.set("session", sessionId);
                ctx.state = {
                    target
                };
            }
            else {
                console.log(`${JSON.stringify({ message: "callback failed"})}`);
            }
        }

        await next();
    };
}

