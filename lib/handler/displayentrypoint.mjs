import {findTarget, getTargets} from "../managers/targets.mjs";
import {getLogger} from "service-logger";

const log = getLogger("handler/displayentrypoint");

export async function displayEntrypoint(ctx) {
    log.notice("display entrypoint");

    if (ctx.state.ok) {
        const user = ctx.state.userInfo;

        log.info({
            info: "display active user",
            user
        });
        await ctx.render("userinfo", { user });
    }
    else {
        log.info("init new login");
        // load template and display the targets
        const targets = getTargets().map(
            (target) => {
                const tHandler = findTarget(target);
                const icon = tHandler.icon,
                      name = tHandler.name;

                return { target, name, icon };
            }
        );

        log.info({ info: "display targets", targets});
        await ctx.render("login", { targets });
    }
}
