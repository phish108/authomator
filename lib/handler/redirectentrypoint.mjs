export function redirectToEntrypoint(config) {
    const target = config.url;

    return (ctx) => {
        console.log(`${JSON.stringify({ message: "redirect to entrypoint", extra: { target }})}`);

        if (ctx.state && ctx.state.target) {
            ctx.redirect(ctx.state.target);
        }
        else {
            ctx.redirect(target);
        }
    };
}
