import GitHub from "../targets/github.mjs";
import OIDC from "../targets/oidc.mjs";

const targets = new Map();
const targetNames = [];

export function setup(config, baseurl) {
    // we scan for the names and get their configs
    return Promise.all(
        Object.keys(config).map((name) => setupTarget(name, config[name], baseurl))
    );
}   

async function setupTarget(name, config, baseurl) {
    let target;

    switch(config.type) {
            case "github":
                console.log(JSON.stringify({message: "setup github target", extra: config.baseurl}));
                target = await GitHub(config);
                break;
            case "oidc": 
                console.log(JSON.stringify({message: "setup OIDC target", extra: config.baseurl}));
                target = await OIDC(config);
                break;
            default:
                console.log(JSON.stringify({message: "unknown type", extra: config.type}));
                break;
    }

    if (target) {
        target.id = name;
        target.baseurl = baseurl;

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
