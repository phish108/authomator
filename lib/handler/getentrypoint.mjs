import {findTarget, getTargets} from "../managers/targets.mjs";
import {getLogger} from "service_logger";

const log = getLogger("handler/entrypoint");

function getTarget(target) {
    const tHandler = findTarget(target);
    const icon = tHandler.icon,
                name = tHandler.name;

    return { target, name, icon };
}

export async function getEntrypoint(ctx, next) {
    log.info("load targets");
    // load template and display the targets<
    const targets = getTargets().map(getTarget);

    log.data(targets);

    ctx.body = targets;

    await next();
}
