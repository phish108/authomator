async function errorHandler(err, ctx) {
    ctx.render("error", { error: err });
}

module.exports = {
    errorHandler
};
