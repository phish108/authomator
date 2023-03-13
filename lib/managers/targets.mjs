import GitHub from "../targets/github.mjs";
import OIDC from "../targets/oidc.mjs";
import {getLogger} from "service_logger";

const log = getLogger("managers/targets");
const targets = new Map();
const targetNames = [];

const targetTypes = {
    "github": (config) => GitHub(config),
    "oidc": (config, frontend) => OIDC(config, frontend) 
};

export function setup(config, frontend) {
    // we scan for the names and get their configs
    return Promise.all(
        Object.keys(config).map((name) => setupTarget(name, config[name], frontend))
    );
}   

async function setupTarget(name, config, frontend) {
    const targetInit = targetTypes[config.type];

    if (!targetInit) {
        log.error({
            info: "invalid target type",
            type: config.type
        });
        return; 
    }
    
    const target = await targetInit(config, frontend);
    
    if (!target) {
        log.error("target failed to initialise");
        return;
    }

    target.id = name;

    targets.set(name, target);
    targetNames.push(name);
}

export function getTargets() {
    return [...targetNames];
}

export function findTarget(name) {
    if (!targets.has(name)) {
        log.error({
            info: "invalid target",
            name
        });

        return undefined;
    }

    return targets.get(name);
}
