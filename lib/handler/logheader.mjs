export async function logHeader(ctx, next) {
    const header = ctx.request.header;

    console.log(`${JSON.stringify({ message: "handle callback", extra: { header }})}`);

    await next();
}
