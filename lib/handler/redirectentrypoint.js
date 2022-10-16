function redirectToEntrypoint(ctx) {
    console.log(`${JSON.stringify({module: __filename, message: "redirect to entrypoint"})}`);

    ctx.redirect("/auth/");
}

module.exports = {
    redirectToEntrypoint
};
