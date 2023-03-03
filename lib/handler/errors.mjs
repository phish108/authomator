export async function errorHandler(err, ctx) {
    ctx.render("error", { error: err });
}
