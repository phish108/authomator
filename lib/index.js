
const mainui = require("./auth_server.js");
const app_helper = require("./helper_server.js");
const Config = require("./config_reader.js");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml" , "./demo/config.yaml"];

        const cfg = await Config.readConfig(confLocations);

        mainui.setup(cfg).run();
        app_helper.setup(cfg).run();
    }
)()
    .then(() => console.log("ok"));
