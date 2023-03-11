import {createState} from "../managers/states.mjs";
import {findTarget} from "../managers/targets.mjs";
import {redirectToEntrypoint} from "./redirectentrypoint.mjs";
import {getLogger} from "service-logger";

const log = getLogger("handler/forwardauth");

export function forwardAuth(ctx) {
    const target = ctx.request.query.target;
    const targetHandler = findTarget(target);

    log.notice({ info: "forward to IDP", target});

    if (targetHandler !== undefined) {
        log.debug({ info: "forward to handler", name: targetHandler.name});
 
        const state = createState(targetHandler);
        const options = targetHandler.authOptions(state);

        ctx.redirect(targetHandler.client.authorizationUrl(options));
    }
    else {
        log.error({ info: "no handler found for target", target});
        redirectToEntrypoint(ctx);
    }
}

