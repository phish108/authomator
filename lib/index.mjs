
import * as auth from "./servers/auth.mjs";
import * as checker from "./servers/checker.mjs";
// import * as ConfigOld from "./config_reader.js";
import * as targets from "./managers/targets.mjs";
import * as acl from "./managers/acl.mjs";

import Config from "./config/index.mjs";

import {initLogger, getLogger} from "service_logger";

const defaults = {
    frontend: {
        port: 8080
    },
    authenticator: {
        port: 8081
    },
    // backend: {}, 
    debug: {
        level: "info"
    }
};

const log = getLogger("main");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml", "./demo/config_test.yaml" , "./demo/config.yaml"];

        const cfg = await Config(confLocations, defaults);

        log.info(cfg);
        log.info(cfg.debug);

        initLogger(cfg.debug);

        await targets.setup(cfg.targets, cfg.frontend);
        acl.setup(cfg.user);

        auth.setup(cfg.frontend).run();
        checker.setup(cfg.checker).run();
    }
)()
    .then(() => log.notice("service started"));
