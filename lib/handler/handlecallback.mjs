import {checkState} from "../managers/states.mjs";
import {startSession} from "../managers/sessions.mjs";
import {getLogger} from "service_logger";

const log = getLogger("handler/handlecallback");

export function handleCallback(config) {
    const target = config["success-target"];

    return async function (ctx, next) {
        log.notice("handle callback");
        log.data(ctx.request.query);

        const query = ctx.request.query;
        const state = query.state;

        const targetHandler = checkState(state);

        if (targetHandler !== undefined && !("error" in query)) {
            const params = targetHandler.client.callbackParams(ctx.request);
            const redirUri = targetHandler.client.metadata?.redirect_uris?.[0];

            const accessToken = await targetHandler.client.callback(
                redirUri, 
                params, 
                {state}, 
                targetHandler.assertionPayload("token_endpoint")
            );

            if (accessToken && accessToken.access_token ) {
                log.info("callback succeeded");

                const sessionId = await startSession(accessToken.access_token, targetHandler);

                ctx.cookies.set("session", sessionId);
                ctx.state = {
                    target
                };
            }
            else {
                log.error("callback failed");
            }
        }

        await next();
    };
}

