import {GitHub} from "../targets/github.mjs";

const targets = new Map();
const targetNames = [];

export function setup(config) {
    // we scan for the names and get their configs
    Object.keys(config).map((name) => setupTarget(name, config[name]));
}

function setupTarget(name, config) {
    let target = undefined;

    switch(config.type) {
            case "github":
                target = GitHub(config);
                break;
            default:
                break;
    }

    if (target !== undefined) {
        targets.set(name, target);
        targetNames.push(name);
    }
}

export function getTargets() {
    return [...targetNames];
}

export function findTarget(name) {
    if (!targets.has(name)) {
        return undefined;
    }

    return targets.get(name);
}
