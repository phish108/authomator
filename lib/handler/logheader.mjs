export async function logHeader(ctx, next) {
    const header = ctx.request.header;

    console.log(`${JSON.stringify({module: __filename, message: "handle callback", extra: { header }})}`);

    await next();
}
