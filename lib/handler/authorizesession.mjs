import {findUserScope}  from "../managers/acl.mjs";
import {getLogger} from "service-logger";

const log = getLogger("handler/authorizesession");

export function authorizeSession(config) {
    const target = config.url;

    return async function (ctx, next) {
        if (ctx.state.ok && ctx.state.id && ctx.state.id.length) {
            const user = ctx.state.userInfo;
            let scope = findUserScope(user.email)|| findUserScope(user.login);

            if (scope && scope.length) {
                log.info({
                    info: "valid scope found, authorise session",
                    user,
                    scope
                });

                ctx.response.status = 204;
                ctx.set({
                    // Remote_User: user.login,
                    Remote_Name: user.name,
                    Remote_Email: user.email,
                    Remote_Scope: scope
                });
            }
            else {
                log.info("user session is not allowed");

                ctx.redirect(target);
                // ctx.status = 405;
                // ctx.throw(405, "forbidden");
            }

        }
        else {
            log.critical("access is not authorised");

            ctx.redirect(target);
            // ctx.status = 401;
            // ctx.throw(401, "unauthorized");
        }
        await next();
    };
}
