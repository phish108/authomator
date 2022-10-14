const Koa = require("koa");
const Router = require("@koa/router");

function setup(config) {
    // configure frontend and backend
    const {frontend, backend} = config;

    console.log(`${JSON.stringify({module: __filename, message: "use config", extra: {frontend, backend}})}`);

    const app = new Koa();
    const router = new Router;

    router.get("/", (ctx) => {
        ctx.body = "hello world \n";
    });

    router.get("/preauth", (ctx) => {
        ctx.body = "hello preauth \n";
    });

    router.get("/cb", (ctx) => {
        ctx.body = "hello callback \n";
    });


    router.get("/logout", (ctx) => {
        ctx.body = "bye bye \n";
    });

    app.use(router.routes());

    // return a run object, so a front end can start the server
    return {run: () => app.listen(frontend.port)};
}

// exports.app = app;
exports.setup = setup;
