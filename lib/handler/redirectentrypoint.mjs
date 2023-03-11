import {getLogger} from "service-logger";

const log = getLogger("handler/redirectentrypoint");

export function redirectToEntrypoint(config) {
    const target = config.url;

    return (ctx) => {
        log.notice(`${JSON.stringify({ message: "redirect to entrypoint", extra: { target }})}`);

        if (ctx.state && ctx.state.target) {
            log.info({
                info: "redirect to application target",
                target: ctx.state.target
            });
            ctx.redirect(ctx.state.target);
        }
        else {
            log.info({
                info: "redirect to login",
                target
            });
            ctx.redirect(target);
        }
    };
}
