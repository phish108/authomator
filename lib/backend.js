const {GitHub} = require("./targets/github.js");

const targets = new WeakMap();
const targetNames = [];

function setup(config) {
    // we scan for the names and get their configs
    Object.keys(config).map((name) => setupTarget(name, config[name]));
    Object.keys(config).map((name) => targetNames.push(name));
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
    }
}

function getTargets() {
    return [...targetNames];
}

function findTarget(name) {
    if (!targets.has(name)) {
        return undefined;
    }

    return targets.get(name);
}

exports = {
    findTarget,
    getTargets,
    setup
};
