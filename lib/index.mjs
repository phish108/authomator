
import * as auth from "./servers/auth.mjs";
import * as checker from "./servers/checker.mjs";
// import * as ConfigOld from "./config_reader.js";
import * as targets from "./managers/targets.mjs";
import * as acl from "./managers/acl.mjs";

import Config from "./config/index.mjs";

import {getLogger} from "service_logger";

const defaults = {
    frontend: {
        port: 8080
    },
    authenticator: {
        port: 8081
    },
    // backend: {},
    debug: {
        level: "notice"
    }
};

const log = getLogger("main");

(
    async function main() {
        const confLocations = ["/etc/authomator/config.yaml", "./demo/config_test.yaml" , "./demo/config.yaml"];

        const cfg = await Config(confLocations, defaults);

        log.data({info: "entire config", cfg});
        log.debug({info: "debug setting", data: cfg.debug});
        cfg.logLevel();

        log.debug("setup targets");
        await targets.setup(cfg.targets, cfg.frontend);

        log.debug("setup acl");
        acl.setup(cfg.user);

        log.debug("setup endpoints");
        auth.setup(cfg.frontend).run();
        checker.setup(cfg.checker).run();
    }
)()
    .then(() => log.notice("service started"));
