const {findUserScope} = require("../managers/acl.js");

async function authorizeSession(ctx, next) {

    if (ctx.state.ok && ctx.state.id && ctx.state.id.length) {
        const user = ctx.state.userInfo;
        const scope = findUserScope(user.login);

        if (scope && scope.length) {
            console.log(`${JSON.stringify({
                module: __filename,
                message: "valid scope found, authorise session",
                extra: {
                    user,
                    scope
                }
            })}`);

            ctx.response.status = 204;
            ctx.set({
                Remote_User: user.login,
                Remote_Name: user.name,
                Remote_Email: user.email,
                Remote_Scope: scope
            });
        }
        else {
            console.log(`${JSON.stringify({
                module: __filename,
                message: "user session is not allowed",
            })}`);
            ctx.throw(405, "forbidden");
            ctx.redirect("/auth/");
        }

    }
    else {
        console.log(`${JSON.stringify({
            module: __filename,
            message: "access is not authorised",
        })}`);
        ctx.throw(401, "unauthorized");
        ctx.redirect("/auth/");
    }
    await next();
}

module.exports = {
    authorizeSession
};
