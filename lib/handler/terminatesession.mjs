import {endSession} from "../managers/sessions.mjs";

export async function terminateSession(ctx, next) {
    console.log(`${JSON.stringify({ message: "terminate session"})}`);
    if (ctx.state.ok) {
        console.log(`${JSON.stringify({ message: "truly end session"})}`);

        await endSession(ctx.state.id);

        // delete the cookie, too
        ctx.cookies.set("session", "");
    }

    await next();
}

