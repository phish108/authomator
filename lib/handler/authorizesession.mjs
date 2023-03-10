import {findUserScope}  from "../managers/acl.mjs";

export function authorizeSession(config) {
    const target = config.url;

    return async function (ctx, next) {
        if (ctx.state.ok && ctx.state.id && ctx.state.id.length) {
            const user = ctx.state.userInfo;
            let scope = findUserScope(user.email);

            scope = scope?.length ? scope : findUserScope(user.login);

            if (scope && scope.length) {
                console.log(`${JSON.stringify({
                    
                    message: "valid scope found, authorise session",
                    extra: {
                        user,
                        scope
                    }
                })}`);

                ctx.response.status = 204;
                ctx.set({
                    // Remote_User: user.login,
                    Remote_Name: user.name,
                    Remote_Email: user.email,
                    Remote_Scope: scope
                });
            }
            else {
                console.log(`${JSON.stringify({
                    
                    message: "user session is not allowed",
                })}`);

                ctx.redirect(target);
                // ctx.status = 405;
                // ctx.throw(405, "forbidden");
            }

        }
        else {
            console.log(`${JSON.stringify({
                
                message: "access is not authorised",
            })}`);

            ctx.redirect(target);
            // ctx.status = 401;
            // ctx.throw(401, "unauthorized");
        }
        await next();
    };
}
