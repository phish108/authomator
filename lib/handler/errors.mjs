import {getLogger} from "service-logger";

const log = getLogger("handler/error");

export async function errorHandler(err, ctx) {
    ctx.render("error", { error: err });
}
