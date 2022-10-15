const {findTarget, getTargets} = require("../managers/targets.js");

async function displayEntrypoint(ctx) {
    console.log(`${JSON.stringify({module: __filename, message: "display entrypoint"})}`);

    if (ctx.state.ok) {
        const user = ctx.state.userInfo;

        console.log(`${JSON.stringify({
            module: __filename,
            message: "display active user",
            extra: {
                user
            }
        })}`);
        await ctx.render("userinfo", { user });
    }
    else {
        console.log(`${JSON.stringify({module: __filename, message: "init new login"})}`);
        // load template and display the targets
        const targets = getTargets().map(
            (target) => {
                const tHandler = findTarget(target);
                const icon = tHandler.icon(),
                      name = tHandler.name();

                return { target, name, icon };
            }
        );

        console.log(`${JSON.stringify({module: __filename, message: "display targets", extra: {targets}})}`);
        await ctx.render("login", { targets });
    }
}

module.exports = {
    displayEntrypoint
};
