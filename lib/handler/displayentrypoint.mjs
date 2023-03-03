import {findTarget, getTargets} from "../managers/targets.mjs";

export async function displayEntrypoint(ctx) {
    console.log(`${JSON.stringify({ message: "display entrypoint"})}`);

    if (ctx.state.ok) {
        const user = ctx.state.userInfo;

        console.log(`${JSON.stringify({
            
            message: "display active user",
            extra: {
                user
            }
        })}`);
        await ctx.render("userinfo", { user });
    }
    else {
        console.log(`${JSON.stringify({ message: "init new login"})}`);
        // load template and display the targets
        const targets = getTargets().map(
            (target) => {
                const tHandler = findTarget(target);
                const icon = tHandler.icon,
                      name = tHandler.name;

                return { target, name, icon };
            }
        );

        console.log(`${JSON.stringify({ message: "display targets", extra: {targets}})}`);
        await ctx.render("login", { targets });
    }
}
