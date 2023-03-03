
import * as auth from "./servers/auth.mjs";
import * as checker from "./servers/checker.mjs";
// import * as ConfigOld from "./config_reader.js";
import * as targets from "./managers/targets.mjs";
import * as acl from "./managers/acl.mjs";

import Config from "./config/index.mjs";

const defaults = {
    frontend: {
        port: 8080
    },
    authenticator: {
        port: 8081
    },
    backend: {}
};

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml", "./demo/config_test.yaml" , "./demo/config.yaml"];

        const cfg = await Config(confLocations, defaults);

        await targets.setup(cfg.targets, cfg.frontend);
        acl.setup(cfg.user);

        auth.setup(cfg.frontend).run();
        checker.setup(cfg.checker).run();
    }
)()
    .then(() => console.log(`${JSON.stringify({ message: "service started"})}`));
