const {endSession} = require("../managers/sessions.js");

async function terminateSession(ctx, next) {
    console.log(`${JSON.stringify({module: __filename, message: "terminate session"})}`);
    if (ctx.state.ok) {
        console.log(`${JSON.stringify({module: __filename, message: "truly end session"})}`);

        await endSession(ctx.state.id);

        // delete the cookie, too
        ctx.cookies.set("session", "");
    }

    await next();
}

module.exports = {
    terminateSession
};
