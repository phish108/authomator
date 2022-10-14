
const mainui = require("./auth_server.js");
const app_helper = require("./check_server.js");
const Config = require("./config_reader.js");
const backend = require("./backend.js");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml" , "./demo/config.yaml"];

        const cfg = await Config.readConfig(confLocations);

        backend.setup(cfg.backend);

        mainui.setup(cfg.frontend).run();
        app_helper.setup(cfg.checker).run();
    }
)()
    .then(() => console.log("ok"));
