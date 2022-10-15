
const auth = require("./servers/auth.js");
const checker = require("./servers/checker.js");
const Config = require("./config_reader.js");
const targets = require("./managers/targets.js");
const acl = require("./managers/acl.js");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml", "./demo/config_test.yaml" , "./demo/config.yaml"];

        const cfg = await Config.readConfig(confLocations);

        targets.setup(cfg.backend);
        acl.setup(cfg.user);

        auth.setup(cfg.frontend).run();
        checker.setup(cfg.checker).run();
    }
)()
    .then(() => console.log(`${JSON.stringify({module: __filename, message: "service started"})}`));
