import {checkState} from "../managers/states.mjs";
import {startSession} from "../managers/sessions.mjs";

export function handleCallback(config) {
    const target = config["success-target"];

    return async function (ctx, next) {
        console.log(`${JSON.stringify({ message: "handle callback"})}`);

        console.log(`${JSON.stringify({extra: ctx.request.query})}`);

        const query = ctx.request.query;
        const state = query.state;

        const targetHandler = checkState(state);

        if (targetHandler !== undefined && !("error" in query)) {
            const params = targetHandler.client.callbackParams(ctx.request);
            const redirUri = targetHandler.client.metadata?.redirect_uris?.[0];
            const accessToken = await targetHandler.client.callback(redirUri, params, {state});

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

