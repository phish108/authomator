const {findUserScope} = require("../managers/acl.js");

async function authorizeSession(ctx, next) {

    if (ctx.state.ok && ctx.state.id && ctx.state.id.length) {
        const user = ctx.state.userInfo;
        const scope = findUserScope(user.login);

        if (scope && scope.length) {
            console.log(`${JSON.stringify({
                module: __filename,
                message: "valid scope found",
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
            ctx.throw(405, "forbidden");
        }

    }
    else {
        ctx.throw(401, "unauthorized");
    }
    await next();
}

module.exports = {
    authorizeSession
};
