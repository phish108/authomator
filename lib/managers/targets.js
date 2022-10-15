const {GitHub} = require("../targets/github.js");

const targets = new Map();
const targetNames = [];

function setup(config) {
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

function getTargets() {
    return [...targetNames];
}

function findTarget(name) {
    if (!targets.has(name)) {
        return undefined;
    }

    return targets.get(name);
}

module.exports = {
    findTarget,
    getTargets,
    setup
};
