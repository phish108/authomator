
const mainui = require("./servers/auth.js");
// const app_helper = require("./servers/checker.js");
const Config = require("./config_reader.js");
const backend = require("./managers/targets.js");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml", "./demo/config_test.yaml" , "./demo/config.yaml"];

        const cfg = await Config.readConfig(confLocations);

        backend.setup(cfg.backend);

        mainui.setup(cfg.frontend).run();
        // app_helper.setup(cfg.checker).run();
    }
)()
    .then(() => console.log(`${JSON.stringify({module: __filename, message: "service started"})}`));
