import {createState} from "../managers/states.mjs";
import {findTarget} from "../managers/targets.mjs";
import {redirectToEntrypoint} from "./redirectentrypoint.mjs";

export function forwardAuth(ctx) {
    const target = ctx.request.query.target;
    const targetHandler = findTarget(target);

    console.log(`${JSON.stringify({ message: "forward to IDP", extra: {target}})}`);

    if (targetHandler !== undefined) {
        console.log(`${JSON.stringify({ message: "forward to handler", extra: {name: targetHandler.name()}})}`);
 
        const state = createState(targetHandler);
        const options = targetHandler.authOptions(state);

        ctx.redirect(targetHandler.client.authorizationUrl(options));
    }
    else {
        console.log(`${JSON.stringify({ message: "no handler found for target", extra: {target}})}`);
        redirectToEntrypoint(ctx);
    }
}

